import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "./prisma";

export interface RateLimitRule {
  /** Maximum number of requests allowed inside the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the current window resets. */
  retryAfter: number;
}

/**
 * Named rules, so limits live in one place instead of being scattered as
 * magic numbers across route handlers.
 *
 * Rules of thumb used here:
 *  - anything that lets an unauthenticated caller burn money (email sends,
 *    blob storage, the paid Places API) gets a tight limit;
 *  - anything guessable (passwords, 6-digit OTPs) gets a limit low enough
 *    that brute force is infeasible before the credential expires.
 */
export const RATE_LIMITS = {
  /** Password login attempts, per IP. */
  login: { limit: 10, windowMs: 15 * 60 * 1000 },
  /** Password login attempts, per account — blocks slow distributed guessing. */
  loginPerAccount: { limit: 5, windowMs: 15 * 60 * 1000 },
  /** OTP issuance, per IP (the per-email cap is enforced separately). */
  otpSend: { limit: 5, windowMs: 60 * 60 * 1000 },
  /** OTP verification attempts. 6-digit code = 1e6 space; 10/h is ~nothing. */
  otpVerify: { limit: 10, windowMs: 60 * 60 * 1000 },
  /** Password reset submissions — this endpoint accepts an OTP, so it is a
   *  brute-force target in exactly the same way otpVerify is. */
  passwordReset: { limit: 10, windowMs: 60 * 60 * 1000 },
  /** Account setup (consumes a 32-byte token; limit stops token fishing). */
  setupAccount: { limit: 10, windowMs: 60 * 60 * 1000 },
  /** Authenticated password change. */
  changePassword: { limit: 10, windowMs: 60 * 60 * 1000 },
  /**
   * Public project intake — creates a user, a project and sends 2 emails.
   *
   * Deliberately loose. This is the business's lead form and the bucket is
   * per-IP, so office NAT and mobile CGNAT put many genuine prospects behind
   * one address; a tight limit here turns into lost revenue, which is a
   * worse outcome than the junk rows it would prevent. Set to stop a flood,
   * not to police individuals.
   */
  projectSubmit: { limit: 30, windowMs: 60 * 60 * 1000 },
  /** Chat messages — each one sends an email notification. */
  message: { limit: 30, windowMs: 5 * 60 * 1000 },
  /** Image upload to blob storage. */
  upload: { limit: 20, windowMs: 60 * 60 * 1000 },
  /** Google Places search — billed per call. */
  leadSearch: { limit: 60, windowMs: 60 * 60 * 1000 },
  /**
   * OpenStreetMap lead search — free and keyless, so this isn't about
   * spend. It's here so one admin session can't hammer the shared public
   * Nominatim/Overpass instances past their fair-use policies (~1 req/sec)
   * and get OwnWebify's server IP blocked from both.
   */
  leadSearchOsm: { limit: 60, windowMs: 60 * 60 * 1000 },
  /**
   * Website contact-scraping. One request fans out to several outbound
   * fetches against third-party sites, so this caps how much traffic one
   * admin session can aim at other people's servers on our IP.
   */
  leadEnrich: { limit: 40, windowMs: 60 * 60 * 1000 },
  /**
   * Website reachability check on OSM search results, before they're saved
   * as leads. Same outbound-fan-out concern as leadEnrich, kept as its own
   * bucket so a bulk check on the search page and a bulk email-find on the
   * saved-leads page don't compete for one shared budget.
   */
  leadCheckWebsites: { limit: 40, windowMs: 60 * 60 * 1000 },
  /** Outreach email send. */
  leadEmail: { limit: 100, windowMs: 60 * 60 * 1000 },
  /** Catch-all for read endpoints, to blunt scraping. */
  publicRead: { limit: 120, windowMs: 60 * 1000 },
} as const satisfies Record<string, RateLimitRule>;

export type RateLimitName = keyof typeof RATE_LIMITS;

/**
 * Escape hatch for local development and integration runs, where the same
 * handful of endpoints get hit repeatedly from one address and the counters
 * would otherwise accumulate across runs.
 *
 * The `NODE_ENV` guard is the point: setting `RATE_LIMIT_DISABLED` in a
 * production environment must not be able to switch throttling off, whether
 * that happens by accident or otherwise.
 */
function rateLimitingDisabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.RATE_LIMIT_DISABLED === "true"
  );
}

/**
 * Best-effort client IP.
 *
 * `x-forwarded-for` is attacker-controlled in general, so prefer the headers
 * the platform sets itself and only fall back to the left-most XFF entry.
 * On Vercel `x-vercel-forwarded-for` / `x-real-ip` are overwritten by the
 * edge network on every request and cannot be spoofed by the client.
 */
export function getClientIp(request: NextRequest | Request): string {
  const headers = request.headers;
  const vercel = headers.get("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",")[0].trim();

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  return "unknown";
}

/**
 * Atomically bump a fixed-window counter and report whether the caller is
 * over budget.
 *
 * The increment and the window roll happen in one statement so that
 * concurrent requests cannot interleave a read-then-write and each come away
 * believing they were the first. `windowStart` is only advanced when the
 * stored window has actually elapsed, which is what makes the reset lazy —
 * no background job is needed to clear expired rows.
 *
 * Fails open: if the counter cannot be written the request is allowed. Every
 * caller of this function also talks to the same database, so a failure here
 * means the request was going to fail anyway, and failing closed would turn a
 * database blip into a site-wide lockout.
 */
export async function checkRateLimit(
  key: string,
  rule: RateLimitRule
): Promise<RateLimitResult> {
  if (rateLimitingDisabled()) {
    return { ok: true, limit: rule.limit, remaining: rule.limit, retryAfter: 0 };
  }

  const now = new Date();
  const windowFloor = new Date(now.getTime() - rule.windowMs);

  try {
    const rows = await prisma.$queryRaw<
      { count: number; windowStart: Date }[]
    >`
      INSERT INTO "RateLimit" ("key", "count", "windowStart", "updatedAt")
      VALUES (${key}, 1, ${now}, ${now})
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE
          WHEN "RateLimit"."windowStart" <= ${windowFloor} THEN 1
          ELSE "RateLimit"."count" + 1
        END,
        "windowStart" = CASE
          WHEN "RateLimit"."windowStart" <= ${windowFloor} THEN ${now}
          ELSE "RateLimit"."windowStart"
        END,
        "updatedAt" = ${now}
      RETURNING "count", "windowStart"
    `;

    const row = rows[0];
    if (!row) {
      return { ok: true, limit: rule.limit, remaining: rule.limit - 1, retryAfter: 0 };
    }

    const count = Number(row.count);
    const resetAt = new Date(row.windowStart).getTime() + rule.windowMs;
    const retryAfter = Math.max(1, Math.ceil((resetAt - now.getTime()) / 1000));

    return {
      ok: count <= rule.limit,
      limit: rule.limit,
      remaining: Math.max(0, rule.limit - count),
      retryAfter,
    };
  } catch (error) {
    console.error("Rate limit check failed, allowing request:", error);
    return { ok: true, limit: rule.limit, remaining: rule.limit, retryAfter: 0 };
  }
}

/**
 * Apply a named rule and, if the caller is over budget, return the 429 to
 * send back. Returns `null` when the request may proceed.
 *
 * Usage keeps the happy path flat:
 *
 *     const limited = await enforceRateLimit(request, "login");
 *     if (limited) return limited;
 */
export async function enforceRateLimit(
  request: NextRequest | Request,
  name: RateLimitName,
  /** Extra bucket discriminator, e.g. an email or user id. Defaults to IP. */
  subject?: string
): Promise<NextResponse | null> {
  const rule = RATE_LIMITS[name];
  const key = `${name}:${subject ?? `ip:${getClientIp(request)}`}`;
  const result = await checkRateLimit(key, rule);

  if (result.ok) return null;

  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(result.retryAfter),
        "RateLimit-Limit": String(result.limit),
        "RateLimit-Remaining": "0",
        "RateLimit-Reset": String(result.retryAfter),
      },
    }
  );
}

/**
 * Delete counters whose window closed some time ago.
 *
 * Rows are reset lazily on next use, so a stale row is never *wrong* — but
 * one-shot keys (an IP that visited once) are never touched again and would
 * otherwise accumulate forever. Nothing calls this on the request path;
 * point a scheduled job at it.
 */
export async function pruneRateLimits(
  olderThanMs = 24 * 60 * 60 * 1000
): Promise<number> {
  const cutoff = new Date(Date.now() - olderThanMs);
  const { count } = await prisma.rateLimit.deleteMany({
    where: { windowStart: { lt: cutoff } },
  });
  return count;
}

/**
 * Clear a counter, e.g. after a successful login so that a legitimate user
 * who fat-fingered their password a few times is not left throttled.
 */
export async function resetRateLimit(
  name: RateLimitName,
  subject: string
): Promise<void> {
  try {
    await prisma.rateLimit.deleteMany({ where: { key: `${name}:${subject}` } });
  } catch (error) {
    console.error("Rate limit reset failed:", error);
  }
}
