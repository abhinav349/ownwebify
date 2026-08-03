/**
 * Email domain reserved for data the test suite creates.
 *
 * Kept in its own module (rather than exported from `global-setup.ts`) so a
 * test file can reference it without importing the global setup, which would
 * spin up a second PrismaClient inside every worker.
 *
 * `tests/global-setup.ts` deletes every user on this domain, before and after
 * a run. Nothing outside the suite may use it.
 */
export const TEST_EMAIL_DOMAIN = "ownwebify-e2e.test";
