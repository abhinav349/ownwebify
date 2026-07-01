import { beforeAll } from "vitest";

beforeAll(() => {
  process.env.NEXTAUTH_SECRET = "test-secret-key-for-testing";
  process.env.NEXTAUTH_URL = "http://localhost:3002";
  process.env.ADMIN_EMAIL = "admin@test.com";
});
