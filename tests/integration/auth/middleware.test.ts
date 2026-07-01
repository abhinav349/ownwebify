import { describe, it, expect } from "vitest";

const BASE_URL = "http://localhost:3002";

describe("Route Protection Middleware", () => {
  it("redirects unauthenticated users from /dashboard to login", async () => {
    const res = await fetch(`${BASE_URL}/dashboard`, {
      redirect: "manual",
    });

    // Should redirect to sign-in
    expect(res.status).toBe(307);
    const location = res.headers.get("location") || "";
    expect(location).toContain("/api/auth/signin");
  });

  it("redirects unauthenticated users from /admin to login", async () => {
    const res = await fetch(`${BASE_URL}/admin`, {
      redirect: "manual",
    });

    expect(res.status).toBe(307);
    const location = res.headers.get("location") || "";
    expect(location).toContain("/api/auth/signin");
  });

  it("redirects unauthenticated users from /admin/projects to login", async () => {
    const res = await fetch(`${BASE_URL}/admin/projects`, {
      redirect: "manual",
    });

    expect(res.status).toBe(307);
    const location = res.headers.get("location") || "";
    expect(location).toContain("/api/auth/signin");
  });

  it("allows access to public pages without auth", async () => {
    const pages = ["/", "/services", "/about", "/hire", "/login"];

    for (const page of pages) {
      const res = await fetch(`${BASE_URL}${page}`, {
        redirect: "manual",
      });
      expect(res.status).toBe(200);
    }
  });

  it("allows access to public API routes without auth", async () => {
    const routes = ["/api/geo", "/api/oauth-status"];

    for (const route of routes) {
      const res = await fetch(`${BASE_URL}${route}`);
      expect(res.status).toBe(200);
    }
  });
});
