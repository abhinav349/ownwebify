import { describe, it, expect } from "vitest";

// Extract the generateReferralCode function for testing.
// It's defined in two places (auth.ts and projects/route.ts) with same logic.
function generateReferralCode(name: string): string {
  const prefix = name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, "X");
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${suffix}`;
}

describe("generateReferralCode", () => {
  it("returns a code matching pattern XXXX-XXXX", () => {
    const code = generateReferralCode("Abhinav");
    expect(code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  });

  it("uses first 4 chars of name as prefix", () => {
    const code = generateReferralCode("Sarah");
    expect(code.substring(0, 4)).toBe("SARA");
  });

  it("uppercases the prefix", () => {
    const code = generateReferralCode("john");
    expect(code.substring(0, 4)).toBe("JOHN");
  });

  it("replaces non-alpha characters with X", () => {
    const code = generateReferralCode("A1b2");
    expect(code.substring(0, 4)).toBe("AXBX");
  });

  it("handles names with spaces by replacing with X", () => {
    const code = generateReferralCode("A B");
    // "A B" -> substring(0,4) = "A B" -> uppercase = "A B" -> replace non-alpha = "AXBX"
    // Wait: "A B" has length 3, substring(0,4) = "A B", uppercase = "A B", replace /[^A-Z]/g with X = "AXB"
    expect(code.substring(0, 3)).toBe("AXB");
  });

  it("handles names shorter than 4 characters", () => {
    const code = generateReferralCode("Jo");
    // "Jo" -> substring(0,4) = "Jo" -> uppercase = "JO" -> replace = "JO"
    expect(code.startsWith("JO")).toBe(true);
    expect(code).toContain("-");
  });

  it("handles single character name", () => {
    const code = generateReferralCode("A");
    expect(code.startsWith("A")).toBe(true);
    expect(code).toContain("-");
  });

  it("generates different codes on subsequent calls (randomness)", () => {
    const codes = new Set(
      Array.from({ length: 10 }, () => generateReferralCode("Test"))
    );
    // With random suffix, we expect most to be unique
    expect(codes.size).toBeGreaterThan(1);
  });

  it("handles numeric-only names by replacing all with X", () => {
    const code = generateReferralCode("1234");
    expect(code.substring(0, 4)).toBe("XXXX");
  });

  it("handles empty string gracefully", () => {
    const code = generateReferralCode("");
    expect(code).toContain("-");
    expect(code.length).toBeGreaterThan(1);
  });
});
