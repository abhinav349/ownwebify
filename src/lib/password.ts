import { randomInt, randomBytes } from "crypto";

/**
 * bcrypt work factor.
 *
 * Raised from 10 to 12 (~4x the work per guess). 12 is the current common
 * baseline and still lands in single-digit hundreds of milliseconds on
 * typical serverless hardware, which is fine for the handful of endpoints
 * that hash.
 *
 * Existing 10-cost hashes keep verifying normally — the cost is encoded in
 * the stored hash — so this applies to passwords set from now on.
 */
export const BCRYPT_COST = 12;

/**
 * Generate a numeric one-time code.
 *
 * Uses `crypto.randomInt` rather than `Math.random()`. `Math.random()` is
 * seeded, non-cryptographic and its internal state is recoverable from a
 * modest run of outputs, so codes minted from it are predictable to anyone
 * who can sample a few — which any visitor can do by requesting codes for
 * an address they control. `randomInt` draws from the CSPRNG and is
 * rejection-sampled, so the distribution stays uniform.
 */
export function generateOtpCode(digits = 6): string {
  const min = 10 ** (digits - 1);
  const max = 10 ** digits;
  return String(randomInt(min, max));
}

/**
 * Generate a URL-safe single-use token (setup links, etc.).
 */
export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}

/**
 * Referral code, e.g. `ACME-7F3A`.
 *
 * Also CSPRNG-backed: referral codes carry an account credit, so guessable
 * codes are a (small) financial hole.
 */
export function generateReferralCode(name: string): string {
  const prefix = name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, "X");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += alphabet[randomInt(0, alphabet.length)];
  }
  return `${prefix}-${suffix}`;
}
