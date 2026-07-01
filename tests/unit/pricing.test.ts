import { describe, it, expect } from "vitest";
import {
  convertPrice,
  formatPrice,
  getDefaultCurrency,
  getReferralReward,
  currencies,
  countryToCurrency,
  basePricesUSD,
  referralRewardUSD,
} from "@/lib/pricing";

describe("convertPrice", () => {
  it("returns same amount for USD (rate = 1)", () => {
    expect(convertPrice(100, "USD")).toBe(100);
    expect(convertPrice(399, "USD")).toBe(399);
  });

  it("converts to INR at rate 85", () => {
    expect(convertPrice(100, "INR")).toBe(8500);
    expect(convertPrice(50, "INR")).toBe(4250);
    expect(convertPrice(1, "INR")).toBe(85);
  });

  it("converts to CAD at rate 1.36", () => {
    expect(convertPrice(100, "CAD")).toBe(136);
    expect(convertPrice(50, "CAD")).toBe(68);
    expect(convertPrice(399, "CAD")).toBe(543);
  });

  it("rounds to nearest integer", () => {
    expect(convertPrice(7, "CAD")).toBe(10); // 7 * 1.36 = 9.52 -> 10
  });

  it("handles zero", () => {
    expect(convertPrice(0, "USD")).toBe(0);
    expect(convertPrice(0, "INR")).toBe(0);
    expect(convertPrice(0, "CAD")).toBe(0);
  });
});

describe("formatPrice", () => {
  it("formats USD with dollar sign", () => {
    const result = formatPrice(99, "USD");
    expect(result).toContain("$");
    expect(result).toContain("99");
  });

  it("formats INR with rupee symbol", () => {
    const result = formatPrice(99, "INR");
    expect(result).toContain("₹");
  });

  it("formats CAD correctly", () => {
    const result = formatPrice(100, "CAD");
    expect(result).toContain("$");
    expect(result).toContain("136");
  });

  it("formats large INR amounts with proper separators", () => {
    const result = formatPrice(399, "INR");
    expect(result).toContain("₹");
    // 399 * 85 = 33915
    expect(result).toMatch(/33,915|33915/);
  });
});

describe("getDefaultCurrency", () => {
  it("returns INR for India", () => {
    expect(getDefaultCurrency("IN")).toBe("INR");
  });

  it("returns USD for USA", () => {
    expect(getDefaultCurrency("US")).toBe("USD");
  });

  it("returns CAD for Canada", () => {
    expect(getDefaultCurrency("CA")).toBe("CAD");
  });

  it("returns USD for unknown country codes", () => {
    expect(getDefaultCurrency("XX")).toBe("USD");
    expect(getDefaultCurrency("GB")).toBe("USD");
    expect(getDefaultCurrency("DE")).toBe("USD");
  });

  it("returns USD for null", () => {
    expect(getDefaultCurrency(null)).toBe("USD");
  });

  it("handles case-insensitive input", () => {
    expect(getDefaultCurrency("in")).toBe("INR");
    expect(getDefaultCurrency("us")).toBe("USD");
    expect(getDefaultCurrency("ca")).toBe("CAD");
  });
});

describe("getReferralReward", () => {
  it("returns formatted $50 for USD", () => {
    const result = getReferralReward("USD");
    expect(result).toContain("$");
    expect(result).toContain("50");
  });

  it("returns formatted INR equivalent", () => {
    const result = getReferralReward("INR");
    expect(result).toContain("₹");
    // 50 * 85 = 4250
    expect(result).toMatch(/4,250|4250/);
  });

  it("returns formatted CAD equivalent", () => {
    const result = getReferralReward("CAD");
    expect(result).toContain("$");
    // 50 * 1.36 = 68
    expect(result).toContain("68");
  });
});

describe("currency configs", () => {
  it("has 3 currencies defined", () => {
    expect(Object.keys(currencies)).toHaveLength(3);
  });

  it("all currencies have required fields", () => {
    for (const config of Object.values(currencies)) {
      expect(config.code).toBeDefined();
      expect(config.symbol).toBeDefined();
      expect(config.name).toBeDefined();
      expect(config.rate).toBeGreaterThan(0);
      expect(config.locale).toBeDefined();
      expect(config.flag).toBeDefined();
    }
  });

  it("USD rate is 1", () => {
    expect(currencies.USD.rate).toBe(1);
  });
});

describe("countryToCurrency mapping", () => {
  it("maps US to USD", () => {
    expect(countryToCurrency.US).toBe("USD");
  });

  it("maps IN to INR", () => {
    expect(countryToCurrency.IN).toBe("INR");
  });

  it("maps CA to CAD", () => {
    expect(countryToCurrency.CA).toBe("CAD");
  });
});

describe("basePricesUSD", () => {
  it("has 4 pricing tiers", () => {
    expect(basePricesUSD).toHaveLength(4);
  });

  it("all prices are within $400 max", () => {
    for (const price of basePricesUSD) {
      expect(price).toBeLessThanOrEqual(400);
    }
  });

  it("prices are in ascending order", () => {
    for (let i = 1; i < basePricesUSD.length; i++) {
      expect(basePricesUSD[i]).toBeGreaterThan(basePricesUSD[i - 1]);
    }
  });
});

describe("referralRewardUSD", () => {
  it("is $50", () => {
    expect(referralRewardUSD).toBe(50);
  });
});
