import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import type { TestProject } from "vitest/node";
import { PrismaClient } from "@prisma/client";
import { TEST_EMAIL_DOMAIN } from "./constants";

const prisma = new PrismaClient();

/**
 * Domains and prefixes reserved for test data.
 *
 * Everything the suite creates lands on one of these, which is what makes
 * the teardown sweep below safe to run against a shared database: the
 * pattern cannot match a real account. The legacy entries cover rows left
 * behind by earlier runs, which had no cleanup and accumulated every time.
 */
const LEGACY_TEST_DOMAINS = ["integration.test"];
const LEGACY_TEST_PREFIXES = ["e2e-pup-"];

/**
 * The rate-limit bucket a request to `localhost` always lands in: nothing
 * this suite talks to sets the headers `getClientIp` reads, so every
 * IP-keyed counter the tests create - login throttles above all - collapses
 * onto this one synthetic key. Real traffic can never share it (production
 * goes through Vercel, which always sets `x-vercel-forwarded-for`), which is
 * what makes it safe to sweep unconditionally below.
 */
const TEST_IP_KEY = "ip:unknown";

/**
 * Matches only rate-limit rows this test run could plausibly have created:
 * the shared local-IP bucket, or anything keyed to one of the fixture
 * accounts. This DB is shared with a live site, so the wipe below must never
 * touch a counter that belongs to a real account or visitor.
 */
function testRateLimitWhere() {
  return {
    OR: [
      { key: { endsWith: `:${TEST_IP_KEY}` } },
      { key: { contains: TEST_ADMIN_EMAIL } },
      { key: { contains: TEST_CLIENT_EMAIL } },
    ],
  };
}

export const TEST_ADMIN_EMAIL = `e2e-admin@${TEST_EMAIL_DOMAIN}`;
export const TEST_CLIENT_EMAIL = `e2e-client@${TEST_EMAIL_DOMAIN}`;

export interface TestCredentials {
  adminEmail: string;
  adminPassword: string;
  clientEmail: string;
  clientPassword: string;
}

/**
 * Remove every user on a reserved test domain, plus everything hanging off
 * them. Ordered child-first because the schema uses required relations
 * without cascade.
 */
async function purgeTestUsers(): Promise<number> {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { endsWith: `@${TEST_EMAIL_DOMAIN}` } },
        ...LEGACY_TEST_DOMAINS.map((d) => ({
          email: { endsWith: `@${d}` },
        })),
        ...LEGACY_TEST_PREFIXES.map((p) => ({
          email: { startsWith: p },
        })),
      ],
    },
    select: { id: true },
  });

  if (users.length === 0) return 0;

  const userIds = users.map((u) => u.id);
  const projects = await prisma.project.findMany({
    where: { clientId: { in: userIds } },
    select: { id: true },
  });
  const projectIds = projects.map((p) => p.id);

  await prisma.message.deleteMany({
    where: {
      OR: [{ projectId: { in: projectIds } }, { senderId: { in: userIds } }],
    },
  });
  await prisma.quote.deleteMany({ where: { projectId: { in: projectIds } } });
  await prisma.project.deleteMany({ where: { id: { in: projectIds } } });
  await prisma.setupToken.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.referral.deleteMany({
    where: {
      OR: [{ referrerId: { in: userIds } }, { refereeId: { in: userIds } }],
    },
  });
  await prisma.user.updateMany({
    where: { referredById: { in: userIds } },
    data: { referredById: null },
  });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });

  return userIds.length;
}

/**
 * Provision the accounts the auth-dependent suites log in as.
 *
 * These are created fresh with a password generated per run and destroyed on
 * teardown, rather than relying on a fixed seeded credential. The suites used
 * to hard-code `admin123` against the *real* admin account, which meant they
 * silently started failing as soon as that password was changed — and would
 * only have started passing again if a known password were restored on a
 * live admin, which is not something a test run should require.
 */
export async function setup({ provide }: TestProject) {
  await purgeTestUsers();

  const adminPassword = randomBytes(18).toString("base64url");
  const clientPassword = randomBytes(18).toString("base64url");

  await prisma.user.create({
    data: {
      email: TEST_ADMIN_EMAIL,
      name: "E2E Admin",
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: "ADMIN",
      emailVerified: true,
      referralCode: `E2EA-${randomBytes(2).toString("hex").toUpperCase()}`,
    },
  });

  await prisma.user.create({
    data: {
      email: TEST_CLIENT_EMAIL,
      name: "E2E Client",
      passwordHash: await bcrypt.hash(clientPassword, 10),
      role: "CLIENT",
      // Credentials login refuses unverified non-admin accounts, so a client
      // fixture is only usable if it is verified.
      emailVerified: true,
      referralCode: `E2EC-${randomBytes(2).toString("hex").toUpperCase()}`,
    },
  });

  const credentials: TestCredentials = {
    adminEmail: TEST_ADMIN_EMAIL,
    adminPassword,
    clientEmail: TEST_CLIENT_EMAIL,
    clientPassword,
  };

  provide("testCredentials", credentials);

  // Counters are per-IP and per-account; a suite that logs in repeatedly from
  // one host would otherwise trip the login throttle partway through. Scoped
  // rather than blanket: this table is shared with a live site, and an
  // unfiltered delete here would reset rate-limit state for every real
  // account and visitor, not just this run's fixtures.
  await prisma.rateLimit.deleteMany({ where: testRateLimitWhere() });
}

export async function teardown() {
  const removed = await purgeTestUsers();
  await prisma.rateLimit.deleteMany({ where: testRateLimitWhere() });
  await prisma.$disconnect();
  if (removed > 0) {
    console.log(`[global-setup] removed ${removed} test user(s)`);
  }
}

declare module "vitest" {
  interface ProvidedContext {
    testCredentials: TestCredentials;
  }
}
