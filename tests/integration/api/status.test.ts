import { describe, it, expect } from "vitest";

const BASE_URL = "http://localhost:3002";

describe("PATCH /api/projects/[id]/status", () => {
  it("returns 401 without authentication", async () => {
    const res = await fetch(`${BASE_URL}/api/projects/demo-project-1/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "IN_PROGRESS" }),
    });

    // NextAuth returns 401 for unauthenticated requests
    expect(res.status).toBe(401);
  });
});
