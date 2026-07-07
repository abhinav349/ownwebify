export type CurrencyCode = "USD" | "INR" | "CAD";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // conversion rate from USD
  locale: string;
  flag: string;
}

export const currencies: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    rate: 1,
    locale: "en-US",
    flag: "🇺🇸",
  },
  INR: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    rate: 85,
    locale: "en-IN",
    flag: "🇮🇳",
  },
  CAD: {
    code: "CAD",
    symbol: "C$",
    name: "Canadian Dollar",
    rate: 1.36,
    locale: "en-CA",
    flag: "🇨🇦",
  },
};

export const countryToCurrency: Record<string, CurrencyCode> = {
  US: "USD",
  IN: "INR",
  CA: "CAD",
};

export const basePricesUSD = [175, 349, 599, 849];

export const referralRewardUSD = 5;

export function convertPrice(usdAmount: number, currency: CurrencyCode): number {
  return Math.round(usdAmount * currencies[currency].rate);
}

export function formatPrice(usdAmount: number, currency: CurrencyCode): string {
  const converted = convertPrice(usdAmount, currency);
  const config = currencies[currency];

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(converted);
}

export function getReferralReward(currency: CurrencyCode): string {
  return formatPrice(referralRewardUSD, currency);
}

export function getDefaultCurrency(countryCode: string | null): CurrencyCode {
  if (!countryCode) return "INR";
  return countryToCurrency[countryCode.toUpperCase()] || "INR";
}

// Budget range values (stored in USD terms) mapped to localized display labels.
export const budgetRangeBoundsUSD: Record<string, [number, number | null]> = {
  "under-200": [0, 200],
  "200-400": [200, 400],
  "400-600": [400, 600],
  "600-900": [600, 900],
  "900-plus": [900, null],
};

export function formatBudget(value: string, currency: CurrencyCode): string {
  const bounds = budgetRangeBoundsUSD[value];
  if (!bounds) return value;
  const [min, max] = bounds;
  if (min === 0 && max !== null) return `Under ${formatPrice(max, currency)}`;
  if (max === null) return `${formatPrice(min, currency)}+`;
  return `${formatPrice(min, currency)} - ${formatPrice(max, currency)}`;
}

/**
 * Formats an amount that is stored in USD into the given display currency.
 * Use for values persisted in USD (quotes, referral balance, revenue).
 */
export function formatFromUSD(usdAmount: number, currency: CurrencyCode): string {
  return formatPrice(usdAmount, currency);
}
