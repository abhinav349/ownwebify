import { describe, it, expect } from "vitest";
import {
  projectIntakeSchema,
  loginSchema,
  messageSchema,
  quoteSchema,
} from "@/lib/validations";

const validProjectData = {
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  company: "Acme Corp",
  projectType: "business-site",
  budget: "200-300",
  timeline: "1-2-weeks",
  title: "My New Website",
  description: "I need a modern business website with contact form and about page.",
  referenceLinks: "https://example.com",
  howFoundUs: "google",
  referralCode: "ABHI-X7K2",
};

describe("projectIntakeSchema", () => {
  it("validates a complete valid submission", () => {
    const result = projectIntakeSchema.safeParse(validProjectData);
    expect(result.success).toBe(true);
  });

  it("validates with only required fields", () => {
    const minimal = {
      name: "Jo",
      email: "j@e.com",
      password: "123456",
      projectType: "landing-page",
      budget: "under-100",
      timeline: "asap",
      title: "My Site",
      description: "A description that is at least twenty characters long.",
    };
    const result = projectIntakeSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  it("rejects name shorter than 2 characters", () => {
    const data = { ...validProjectData, name: "J" };
    const result = projectIntakeSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("name");
    }
  });

  it("rejects invalid email", () => {
    const data = { ...validProjectData, email: "not-an-email" };
    const result = projectIntakeSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email");
    }
  });

  it("rejects password shorter than 6 characters", () => {
    const data = { ...validProjectData, password: "12345" };
    const result = projectIntakeSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("password");
    }
  });

  it("rejects empty projectType", () => {
    const data = { ...validProjectData, projectType: "" };
    const result = projectIntakeSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects empty budget", () => {
    const data = { ...validProjectData, budget: "" };
    const result = projectIntakeSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects empty timeline", () => {
    const data = { ...validProjectData, timeline: "" };
    const result = projectIntakeSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects title shorter than 5 characters", () => {
    const data = { ...validProjectData, title: "Hi" };
    const result = projectIntakeSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("title");
    }
  });

  it("rejects description shorter than 20 characters", () => {
    const data = { ...validProjectData, description: "Too short" };
    const result = projectIntakeSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("description");
    }
  });

  it("allows optional fields to be omitted", () => {
    const { company, referenceLinks, howFoundUs, referralCode, ...required } =
      validProjectData;
    const result = projectIntakeSchema.safeParse(required);
    expect(result.success).toBe(true);
  });

  it("rejects completely empty object", () => {
    const result = projectIntakeSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("validates correct credentials", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty fields", () => {
    const result = loginSchema.safeParse({ email: "", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("messageSchema", () => {
  it("validates non-empty message", () => {
    const result = messageSchema.safeParse({ content: "Hello!" });
    expect(result.success).toBe(true);
  });

  it("rejects empty message", () => {
    const result = messageSchema.safeParse({ content: "" });
    expect(result.success).toBe(false);
  });
});

describe("quoteSchema", () => {
  it("validates correct quote data", () => {
    const result = quoteSchema.safeParse({
      amount: 350,
      description: "Full website redesign with all pages",
      validUntil: "2026-08-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects zero amount", () => {
    const result = quoteSchema.safeParse({
      amount: 0,
      description: "Full website redesign with all pages",
      validUntil: "2026-08-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short description", () => {
    const result = quoteSchema.safeParse({
      amount: 100,
      description: "Short",
      validUntil: "2026-08-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty validUntil", () => {
    const result = quoteSchema.safeParse({
      amount: 100,
      description: "Full website redesign with all pages",
      validUntil: "",
    });
    expect(result.success).toBe(false);
  });
});
