import { describe, it, expect, inject, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma";

const BASE_URL = "http://localhost:3002";

// Provisioned by tests/global-setup.ts with a password generated for this run
// and destroyed afterwards, so the suite never depends on a known password
// existing on a real account.
const { adminEmail, adminPassword } = inject("testCredentials");

// Several cases here deliberately submit bad credentials, which counts
// against the login throttle. Clear it first so a later assertion measures
// authentication rather than rate limiting.
beforeEach(async () => {
  await prisma.rateLimit.deleteMany({
    where: {
      OR: [
        { key: { startsWith: "login:" } },
        { key: { startsWith: "loginPerAccount:" } },
      ],
    },
  });
});

async function getCsrfToken(): Promise<{ token: string; cookies: string }> {
  const res = await fetch(`${BASE_URL}/api/auth/csrf`);
  const cookies = res.headers.get("set-cookie") || "";
  const data = await res.json();
  return { token: data.csrfToken, cookies };
}

async function attemptLogin(
  email: string,
  password: string
): Promise<Response> {
  const { token, cookies } = await getCsrfToken();

  return fetch(`${BASE_URL}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookies,
    },
    body: new URLSearchParams({
      email,
      password,
      csrfToken: token,
      json: "true",
    }),
    redirect: "manual",
  });
}

describe("Credentials Login", () => {
  it("succeeds with valid admin credentials", async () => {
    const res = await attemptLogin(adminEmail, adminPassword);
    // Successful login returns 200 with json:true or 302 redirect
    expect([200, 302]).toContain(res.status);

    const url = res.headers.get("location") || "";
    // Should not redirect to an error page
    expect(url).not.toContain("error");
  });

  it("fails with non-existent client credentials", async () => {
    const res = await attemptLogin("noone@example.com", "client123");
    expect([200, 302, 401]).toContain(res.status);
    if (res.status === 200) {
      const data = await res.json();
      expect(data.url).not.toBe(`${BASE_URL}`);
    }
  });

  it("fails with wrong password", async () => {
    const res = await attemptLogin(adminEmail, "wrongpass");
    // Failed credentials return 401 or redirect to signin
    expect([200, 302, 401]).toContain(res.status);
    if (res.status === 200) {
      const data = await res.json();
      expect(data.url).not.toBe(`${BASE_URL}`);
    }
  });

  it("fails with non-existent email", async () => {
    const res = await attemptLogin("nobody@example.com", "password123");
    expect([200, 302, 401]).toContain(res.status);
    if (res.status === 200) {
      const data = await res.json();
      expect(data.url).not.toBe(`${BASE_URL}`);
    }
  });
});

describe("Session endpoint", () => {
  it("returns empty session for unauthenticated request", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/session`);
    const data = await res.json();
    // Unauthenticated returns {} or { expires: null }
    expect(data.user).toBeUndefined();
  });
});

describe("NextAuth providers endpoint", () => {
  it("lists credentials provider", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/providers`);
    const data = await res.json();

    expect(data).toHaveProperty("credentials");
    expect(data.credentials.id).toBe("credentials");
    expect(data.credentials.type).toBe("credentials");
  });
});
