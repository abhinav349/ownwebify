import { describe, it, expect } from "vitest";

const BASE_URL = "http://localhost:3002";

describe("POST /api/projects/[id]/messages", () => {
  it("returns 401 without authentication", async () => {
    const res = await fetch(
      `${BASE_URL}/api/projects/demo-project-1/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "Hello" }),
      }
    );

    expect(res.status).toBe(401);
  });
});

describe("GET /api/projects/[id]/messages", () => {
  it("returns 401 without authentication", async () => {
    const res = await fetch(
      `${BASE_URL}/api/projects/demo-project-1/messages`
    );

    expect(res.status).toBe(401);
  });
});
