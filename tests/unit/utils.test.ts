import { describe, it, expect } from "vitest";
import { cn, formatCurrency, formatDate, getStatusColor } from "@/lib/utils";

describe("cn (class merge)", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("dedupes conflicting tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("handles conditional/falsey values", () => {
    expect(cn("a", false && "b", undefined, null, "c")).toBe("a c");
  });
});

describe("formatCurrency", () => {
  it("formats USD with a dollar sign", () => {
    const result = formatCurrency(100);
    expect(result).toContain("$");
    expect(result).toContain("100");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toContain("0");
  });

  it("formats large amounts with separators", () => {
    const result = formatCurrency(1234);
    expect(result).toMatch(/1,234/);
  });
});

describe("formatDate", () => {
  it("formats a date string into a readable format", () => {
    const result = formatDate("2026-01-15T00:00:00.000Z");
    expect(result).toMatch(/2026/);
    expect(result).toMatch(/Jan/);
  });

  it("accepts a Date object", () => {
    const result = formatDate(new Date("2026-06-20T00:00:00.000Z"));
    expect(result).toMatch(/2026/);
    expect(result).toMatch(/Jun/);
  });
});

describe("getStatusColor", () => {
  it("returns a color class for each known project status", () => {
    for (const status of [
      "NEW",
      "REVIEWING",
      "QUOTED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
    ]) {
      const color = getStatusColor(status);
      expect(color).toContain("bg-");
      expect(color).toContain("text-");
    }
  });

  it("returns a color class for each known quote status", () => {
    for (const status of ["PENDING", "ACCEPTED", "REJECTED"]) {
      expect(getStatusColor(status)).toContain("bg-");
    }
  });

  it("returns a gray fallback for unknown status", () => {
    expect(getStatusColor("SOMETHING_ELSE")).toBe("bg-gray-100 text-gray-800");
  });
});
