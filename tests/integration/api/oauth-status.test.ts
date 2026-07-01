import { describe, it, expect } from "vitest";

const BASE_URL = "http://localhost:3002";

describe("GET /api/oauth-status", () => {
  it("returns availability status of OAuth providers", async () => {
    const res = await fetch(`${BASE_URL}/api/oauth-status`);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveProperty("google");
    expect(data).toHaveProperty("github");
    expect(typeof data.google).toBe("boolean");
    expect(typeof data.github).toBe("boolean");
  });

  it("reports false when credentials are empty", async () => {
    const res = await fetch(`${BASE_URL}/api/oauth-status`);
    const data = await res.json();

    // In test env, credentials are empty
    expect(data.google).toBe(false);
    expect(data.github).toBe(false);
  });
});
