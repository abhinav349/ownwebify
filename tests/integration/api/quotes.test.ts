import { describe, it, expect } from "vitest";

const BASE_URL = "http://localhost:3002";

describe("POST /api/projects/[id]/quotes", () => {
  it("returns 401 without authentication", async () => {
    const res = await fetch(
      `${BASE_URL}/api/projects/demo-project-1/quotes`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 200,
          description: "Test quote description here",
          validUntil: "2026-12-31",
        }),
      }
    );

    expect(res.status).toBe(401);
  });
});

describe("PATCH /api/projects/[id]/quotes", () => {
  it("returns 401 without authentication", async () => {
    const res = await fetch(
      `${BASE_URL}/api/projects/demo-project-1/quotes`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: "demo-quote-1",
          status: "ACCEPTED",
        }),
      }
    );

    expect(res.status).toBe(401);
  });
});
