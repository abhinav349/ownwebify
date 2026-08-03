import { describe, it, expect } from "vitest";
import { TEST_EMAIL_DOMAIN } from "../../constants";

const BASE_URL = "http://localhost:3002";

const validProject = {
  name: "Test Integration User",
  email: `test-${Date.now()}@${TEST_EMAIL_DOMAIN}`,
  password: "testpass123",
  projectType: "landing-page",
  budget: "under-100",
  timeline: "1-2-weeks",
  title: "Integration Test Project",
  description: "This is an integration test project submission with enough characters.",
  howFoundUs: "google",
};

describe("POST /api/projects", () => {
  it("creates a project with valid data and returns 201", async () => {
    const email = `test-create-${Date.now()}@${TEST_EMAIL_DOMAIN}`;
    const res = await fetch(`${BASE_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validProject, email }),
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.projectId).toBeDefined();
  });

  it("reuses existing user when email already exists", async () => {
    const email = `test-reuse-${Date.now()}@${TEST_EMAIL_DOMAIN}`;

    // First submission creates user
    const res1 = await fetch(`${BASE_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validProject, email }),
    });
    expect(res1.status).toBe(201);

    // Second submission reuses user
    const res2 = await fetch(`${BASE_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validProject,
        email,
        title: "Second Project Title",
      }),
    });
    expect(res2.status).toBe(201);
  });

  it("returns 400 for invalid data", async () => {
    const res = await fetch(`${BASE_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "X" }), // missing most fields
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Validation failed");
  });

  it("returns 400 for missing required fields", async () => {
    const res = await fetch(`${BASE_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "test@test.com",
        // missing password, projectType, budget, timeline, title, description
      }),
    });

    expect(res.status).toBe(400);
  });

  it("proceeds without error when referral code is invalid", async () => {
    const email = `test-badref-${Date.now()}@${TEST_EMAIL_DOMAIN}`;
    const res = await fetch(`${BASE_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validProject,
        email,
        referralCode: "INVALID-CODE",
      }),
    });

    expect(res.status).toBe(201);
  });

  it("proceeds when referral code is empty string", async () => {
    const email = `test-emptyref-${Date.now()}@${TEST_EMAIL_DOMAIN}`;
    const res = await fetch(`${BASE_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validProject,
        email,
        referralCode: "",
      }),
    });

    expect(res.status).toBe(201);
  });
});

// These previously asserted that an anonymous GET returned 200 and a project
// array. That is the shape of a data leak, not a passing test: the collection
// contains every client's brief, budget and contact details. The endpoint
// requires a session and scopes non-admins to their own rows, so what is
// worth pinning down here is that it refuses anonymous callers at all.
describe("GET /api/projects", () => {
  it("rejects unauthenticated requests", async () => {
    const res = await fetch(`${BASE_URL}/api/projects`);

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Unauthorized");
    expect(Array.isArray(data)).toBe(false);
  });

  it("does not leak projects through a status filter", async () => {
    const res = await fetch(`${BASE_URL}/api/projects?status=NEW`);

    expect(res.status).toBe(401);
    const body = await res.text();
    expect(body).not.toContain("clientId");
  });

  it("refuses anonymous access regardless of query parameters", async () => {
    const res = await fetch(`${BASE_URL}/api/projects?clientId=nonexistent-id`);

    expect(res.status).toBe(401);
  });
});
