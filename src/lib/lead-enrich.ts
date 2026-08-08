/**
 * Pulls contact details off a lead's own website.
 *
 * Neither lead source can supply an email address: Google's Places API has
 * no email field at all, and OpenStreetMap's `email`/`contact:email` tags are
 * only present on a small minority of businesses. Since the outreach email
 * feature is hard-blocked on `Lead.email`, that left every address to be
 * typed in by hand. But most of these businesses do publish an address - on
 * the website we already recorded. This module goes and reads it.
 *
 * Two things make this more delicate than a plain `fetch`:
 *
 *  1. The URL is untrusted. OSM is world-editable, so a `website` tag can
 *     point anywhere, including `http://169.254.169.254/` (cloud instance
 *     metadata) or a host on the deploy's private network. Every hostname,
 *     on every redirect hop, is therefore resolved and checked against the
 *     private ranges before a request is made to it - see assertPublicUrl.
 *  2. Pages are arbitrary size and arbitrary speed. Responses are capped by
 *     bytes and by wall clock, and non-HTML content types are dropped
 *     without reading a body.
 *
 * Extraction itself is deliberately conservative: a wrong address is worse
 * than no address, because it sends a cold pitch to an uninvolved stranger.
 * Anything that doesn't clearly look like the business's own contact address
 * is discarded rather than guessed at.
 */

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const FETCH_TIMEOUT_MS = 8000;
/** Enough for the <head> and body text of a normal marketing page. */
const MAX_BYTES = 512 * 1024;
const MAX_REDIRECTS = 3;
/** Homepage, plus at most this many "contact"-looking pages linked from it. */
const MAX_CONTACT_PAGES = 2;

const USER_AGENT =
  "OwnWebify-LeadFinder/1.0 (+https://ownwebify.com; admin@ownwebify.com)";

export type EnrichFailure =
  | "invalid_url"
  | "blocked_host"
  | "unreachable"
  | "not_html";

export type EnrichResult =
  | {
      ok: true;
      email: string | null;
      phone: string | null;
      checked: string[];
      /** Why nothing was taken, when the page was read but not trusted. */
      note?: string;
    }
  | { ok: false; reason: EnrichFailure; message: string };

/**
 * Addresses that belong to the platform the site is built on, an analytics
 * vendor, or a template the owner never edited. They appear on thousands of
 * unrelated sites, so treating one as a lead's address would mean emailing
 * Wix's abuse desk instead of the restaurant.
 */
const JUNK_EMAIL_DOMAINS = [
  "example.com",
  "example.org",
  "domain.com",
  "yourdomain.com",
  "yoursite.com",
  "sentry.io",
  "sentry-next.wixpress.com",
  "wixpress.com",
  "wix.com",
  "squarespace.com",
  "godaddy.com",
  "shopify.com",
  "wordpress.com",
  "w3.org",
  "schema.org",
  "googlemail.com.invalid",
];

/** Placeholder local-parts from unedited templates. */
const JUNK_EMAIL_LOCALPARTS = [
  "email",
  "youremail",
  "your-email",
  "name",
  "yourname",
  "user",
  "username",
  "someone",
  "test",
  "sentry",
];

/**
 * Ranked preference for which address to pick when a page lists several.
 * A role address is what a business wants cold mail sent to; a named
 * personal address (rahul@, priya@) is a fallback, and a `noreply@` is
 * useless by definition.
 */
const PREFERRED_LOCALPARTS = [
  "info",
  "contact",
  "hello",
  "enquiry",
  "enquiries",
  "inquiry",
  "inquiries",
  "sales",
  "reservations",
  "bookings",
  "booking",
  "office",
  "admin",
  "support",
  "mail",
];

const REJECTED_LOCALPARTS = ["noreply", "no-reply", "donotreply", "do-not-reply"];

/**
 * Mailbox providers a small business might genuinely use for its public
 * address. An address here is accepted despite not matching the site's own
 * domain; anything else off-domain is somebody else's - see pickBestEmail.
 */
const FREEMAIL_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.in",
  "yahoo.co.uk",
  "ymail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "protonmail.com",
  "proton.me",
  "zoho.com",
  "zohomail.com",
  "rediffmail.com",
  "yandex.com",
  "gmx.com",
  "mail.com",
];

/**
 * Second-level suffixes that are really part of the public suffix, so
 * "cafe.co.uk" is one registrable name rather than "co.uk".
 *
 * A full Public Suffix List would be exhaustive, but it's a large dependency
 * to carry for a comparison that only needs to answer "is this the same
 * organisation?". These cover the markets the lead finder is pointed at.
 */
const SECOND_LEVEL_SUFFIXES = new Set([
  "co",
  "com",
  "net",
  "org",
  "gov",
  "edu",
  "ac",
]);

/** Extensions that show up in `something@2x.png`-style false positives. */
const ASSET_EXTENSIONS = /\.(png|jpe?g|gif|svg|webp|css|js|woff2?|ttf|ico)$/i;

const EMAIL_PATTERN = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;

// -- Outbound request safety ------------------------------------------------

/**
 * True for any address that isn't routable on the public internet.
 *
 * Blocking these is what stops a hostile `website` tag from turning this
 * server into a proxy for its own internal network - the link-local range in
 * particular is where AWS/GCP hand out instance credentials.
 */
export function isPrivateAddress(ip: string): boolean {
  const version = isIP(ip);

  if (version === 4) {
    const [a, b] = ip.split(".").map(Number);
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true; // link-local / cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 192 && b === 0) return true; // IETF protocol assignments
    if (a === 100 && b >= 64 && b <= 127) return true; // carrier-grade NAT
    if (a >= 224) return true; // multicast and reserved
    return false;
  }

  if (version === 6) {
    const addr = ip.toLowerCase();
    if (addr === "::" || addr === "::1") return true;
    if (/^f[cd]/.test(addr)) return true; // unique local
    if (addr.startsWith("fe80")) return true; // link-local
    // ::ffff:10.0.0.1 is an IPv4 address wearing an IPv6 hat.
    const mapped = addr.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/);
    if (mapped) return isPrivateAddress(mapped[1]);
    return false;
  }

  // Not a literal we can reason about - refuse rather than assume.
  return true;
}

/**
 * Parses a URL and confirms every address its host resolves to is public.
 *
 * Checking *all* A/AAAA records rather than the first matters: a host that
 * answers with one public and one private address would otherwise be a way
 * to reach the private one.
 */
async function assertPublicUrl(
  raw: string
): Promise<{ ok: true; url: URL } | { ok: false; reason: EnrichFailure }> {
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return { ok: false, reason: "invalid_url" };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, reason: "invalid_url" };
  }

  const host = url.hostname.replace(/^\[|\]$/g, "");

  if (isIP(host)) {
    return isPrivateAddress(host)
      ? { ok: false, reason: "blocked_host" }
      : { ok: true, url };
  }

  try {
    const addresses = await lookup(host, { all: true });
    if (!addresses.length) return { ok: false, reason: "unreachable" };
    if (addresses.some((a) => isPrivateAddress(a.address))) {
      return { ok: false, reason: "blocked_host" };
    }
  } catch {
    return { ok: false, reason: "unreachable" };
  }

  return { ok: true, url };
}

/**
 * Reads at most `MAX_BYTES` of the body.
 *
 * `content-length` alone can't be trusted to cap this - it's optional, and a
 * chunked response simply won't have one - so the stream is counted as it
 * arrives and cancelled once it's over budget. A truncated page is fine here:
 * contact details sit in the header or footer markup, not past 512KB.
 */
async function readCapped(res: Response): Promise<string> {
  const body = res.body;
  if (!body) return "";

  const reader = body.getReader();
  const decoder = new TextDecoder();
  const chunks: string[] = [];
  let total = 0;

  try {
    while (total < MAX_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      chunks.push(decoder.decode(value, { stream: true }));
    }
  } finally {
    await reader.cancel().catch(() => {});
  }

  return chunks.join("");
}

/**
 * Fetches one page, re-validating the target on every redirect hop.
 *
 * Redirects are followed by hand (`redirect: "manual"`) precisely so each
 * new location goes back through assertPublicUrl - letting fetch follow them
 * would let a public host bounce us onto a private one, which is the usual
 * way an SSRF filter gets walked around.
 */
async function fetchPage(
  target: string
): Promise<{ ok: true; html: string; url: string } | { ok: false; reason: EnrichFailure }> {
  let current = target;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const checked = await assertPublicUrl(current);
    if (!checked.ok) return checked;

    let res: Response;
    try {
      res = await fetch(checked.url, {
        redirect: "manual",
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      });
    } catch {
      return { ok: false, reason: "unreachable" };
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) return { ok: false, reason: "unreachable" };
      current = new URL(location, checked.url).toString();
      continue;
    }

    if (!res.ok) return { ok: false, reason: "unreachable" };

    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("html")) return { ok: false, reason: "not_html" };

    return { ok: true, html: await readCapped(res), url: checked.url.toString() };
  }

  return { ok: false, reason: "unreachable" };
}

// -- Extraction (pure, no I/O) ---------------------------------------------

function isJunkEmail(email: string): boolean {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return true;
  if (ASSET_EXTENSIONS.test(email)) return true;
  if (JUNK_EMAIL_LOCALPARTS.includes(localPart)) return true;
  if (REJECTED_LOCALPARTS.some((p) => localPart.startsWith(p))) return true;
  return JUNK_EMAIL_DOMAINS.some((d) => domain === d || domain.endsWith(`.${d}`));
}

/** "www.cafe.co.uk" -> "cafe.co.uk", so a site and its www host compare equal. */
function bareHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, "");
}

/**
 * The organisation-owning part of a hostname: "wps.myrealpage.com" ->
 * "myrealpage.com", "shop.cafe.co.uk" -> "cafe.co.uk".
 *
 * Used to answer "do these two hosts belong to the same business?", which is
 * how a lead's real site is told apart from the vendor platform it happens
 * to be hosted on.
 */
export function registrableDomain(host: string): string {
  const labels = bareHost(host).split(".").filter(Boolean);
  if (labels.length <= 2) return labels.join(".");

  const secondLast = labels[labels.length - 2];
  const take = SECOND_LEVEL_SUFFIXES.has(secondLast) ? 3 : 2;
  return labels.slice(-take).join(".");
}

/** True when two hosts belong to the same organisation. */
export function isSameSite(a: string, b: string): boolean {
  return registrableDomain(a) === registrableDomain(b);
}

/**
 * Picks the address most likely to reach the business.
 *
 * An address is only eligible if it's on the site's own domain or at a
 * consumer mailbox provider. Anything else belongs to a third party that
 * merely appears on the page - the platform the site is built on, an agency
 * credit in the footer, a supplier - and mailing it would pitch a business
 * that has nothing to do with the lead. Rejecting the whole category is what
 * makes this safe against vendors the junk list has never heard of, which a
 * hardcoded blocklist can never manage on its own.
 *
 * Among eligible addresses a role mailbox (info@, contact@) outranks a
 * personal one, and the site's own domain outranks a free-mail account.
 */
export function pickBestEmail(
  candidates: string[],
  siteHost: string
): string | null {
  const seen = new Set<string>();
  const usable: string[] = [];

  for (const raw of candidates) {
    const email = raw.trim().toLowerCase().replace(/[.,;:]+$/, "");
    if (!email || seen.has(email) || isJunkEmail(email)) continue;
    seen.add(email);

    const domain = email.split("@")[1];
    const onSite = isSameSite(domain, siteHost);
    const freemail = FREEMAIL_DOMAINS.includes(bareHost(domain));
    if (!onSite && !freemail) continue;

    usable.push(email);
  }

  if (!usable.length) return null;

  return usable.sort((a, b) => score(b) - score(a))[0];

  function score(email: string): number {
    const [localPart, domain] = email.split("@");
    let points = 0;
    if (isSameSite(domain, siteHost)) points += 100;
    const rank = PREFERRED_LOCALPARTS.indexOf(localPart);
    if (rank !== -1) points += PREFERRED_LOCALPARTS.length - rank;
    return points;
  }
}

/**
 * Harvests contact details from one page's HTML.
 *
 * `mailto:`/`tel:` hrefs are collected separately from a free-text scan and
 * ranked ahead of it, because a link is an unambiguous statement that the
 * value is a contact address, whereas loose text matches pick up things like
 * an image filename or a third party mentioned in the copy.
 */
export function extractContacts(
  html: string,
  pageUrl: string
): { emails: string[]; phone: string | null; contactLinks: string[] } {
  const emails: string[] = [];

  for (const match of html.matchAll(/href=["']mailto:([^"'?]+)/gi)) {
    emails.push(decodeURIComponent(match[1]));
  }
  for (const match of html.matchAll(EMAIL_PATTERN)) {
    emails.push(match[0]);
  }

  const telMatch = html.match(/href=["']tel:([^"']+)/i);
  const phone = telMatch
    ? decodeURIComponent(telMatch[1]).replace(/[^\d+]/g, "") || null
    : null;

  const contactLinks: string[] = [];
  let base: URL | null = null;
  try {
    base = new URL(pageUrl);
  } catch {
    base = null;
  }

  if (base) {
    for (const match of html.matchAll(/href=["']([^"'#]+)["']/gi)) {
      const href = match[1];
      if (!/contact|about|reach|impressum/i.test(href)) continue;
      try {
        const url = new URL(href, base);
        // Same-site only: an "about" link pointing at Facebook or a
        // franchise's head office isn't this lead's contact page.
        if (bareHost(url.hostname) !== bareHost(base.hostname)) continue;
        const clean = url.toString();
        if (clean !== pageUrl && !contactLinks.includes(clean)) {
          contactLinks.push(clean);
        }
      } catch {
        // Malformed href - nothing to follow.
      }
    }
  }

  return { emails, phone, contactLinks };
}

/**
 * True only when the failure is evidence the business's own site is down -
 * not evidence about something else (a malformed URL, a host this app
 * refuses to fetch, a non-HTML response). `blocked_host` in particular is
 * not "down": it means the site pointed somewhere this app won't follow,
 * which says nothing about whether the business's real site is up.
 *
 * This is the one signal worth surfacing as a "Website Down" badge, so both
 * callers (the saved-lead enricher and the pre-save OSM checker) go through
 * this instead of each re-deriving the same reason list and risking drift.
 */
export function isWebsiteDown(result: EnrichResult): boolean {
  return !result.ok && result.reason === "unreachable";
}

// -- Entry point ------------------------------------------------------------

/**
 * Visits a lead's website and returns whatever contact details it publishes.
 *
 * The homepage is tried first and only searched further if it yields no
 * email, since most small-business sites put the address in the footer of
 * every page and a second request is pure cost when the first one worked.
 *
 * A successful result with `email: null` is meaningful and distinct from a
 * failure: it means the site was read and genuinely lists no address, which
 * is the one case where hand-entry is still the only option.
 */
export async function enrichFromWebsite(website: string): Promise<EnrichResult> {
  const home = await fetchPage(website);

  if (!home.ok) {
    return {
      ok: false,
      reason: home.reason,
      message:
        home.reason === "blocked_host"
          ? "That website's address isn't publicly reachable, so it wasn't fetched."
          : home.reason === "invalid_url"
            ? "That lead's website isn't a valid URL."
            : home.reason === "not_html"
              ? "That website didn't return a readable web page."
              : "Couldn't reach that website.",
    };
  }

  // Identity is anchored to the URL we were asked about, never to wherever
  // the redirects ended up. A dead site parked on its hosting vendor's
  // placeholder page still answers 200 with a normal-looking contact block,
  // and judging that page on its own terms would make the vendor's support
  // address look like it belonged to this lead.
  let siteHost: string;
  try {
    siteHost = new URL(
      /^https?:\/\//i.test(website) ? website : `https://${website}`
    ).hostname;
  } catch {
    siteHost = new URL(home.url).hostname;
  }

  if (!isSameSite(new URL(home.url).hostname, siteHost)) {
    return {
      ok: true,
      email: null,
      phone: null,
      checked: [home.url],
      note: `That website redirects to ${registrableDomain(new URL(home.url).hostname)}, so anything on it belongs to another business.`,
    };
  }

  const checked = [home.url];
  const first = extractContacts(home.html, home.url);

  let email = pickBestEmail(first.emails, siteHost);
  let phone = first.phone;

  if (!email) {
    for (const link of first.contactLinks.slice(0, MAX_CONTACT_PAGES)) {
      const page = await fetchPage(link);
      if (!page.ok) continue;
      checked.push(page.url);

      const found = extractContacts(page.html, page.url);
      email = pickBestEmail(found.emails, siteHost);
      phone = phone ?? found.phone;
      if (email) break;
    }
  }

  return { ok: true, email, phone, checked };
}
