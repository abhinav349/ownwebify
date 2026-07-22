export type CurrencyCode = "USD" | "INR" | "CAD";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // market exchange rate from USD (for real monetary conversions)
  displayRate: number; // PPP-adjusted rate for service/display pricing
  locale: string;
  flag: string;
}

// PPP conversion factors (World Bank, 2024):
//   India  = 20.42 INR per intl $
//   USA    = 1.00 (baseline)
//   Canada = 1.15 CAD per intl $
//
// Display rates use PPP to show regionally appropriate pricing:
//   USD displayRate = INR_market / India_PPP × USD_PPP = 85 / 20.42 × 1.00 ≈ 4.16
//   INR displayRate = 85 (unchanged — India is the anchor market)
//   CAD displayRate = 85 / 20.42 × 1.15 ≈ 4.79

export const currencies: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    rate: 1,
    displayRate: 4.16,
    locale: "en-US",
    flag: "🇺🇸",
  },
  INR: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    rate: 85,
    displayRate: 85,
    locale: "en-IN",
    flag: "🇮🇳",
  },
  CAD: {
    code: "CAD",
    symbol: "C$",
    name: "Canadian Dollar",
    rate: 1.36,
    displayRate: 4.79,
    locale: "en-CA",
    flag: "🇨🇦",
  },
};

export const countryToCurrency: Record<string, CurrencyCode> = {
  US: "USD",
  IN: "INR",
  CA: "CAD",
};

export const basePricesUSD = [59, 118, 235, 353];

export const referralRewardUSD = 5;

// Discount a referred client receives on their first project's quote.
export const referralDiscountPercent = 10;

/** Returns the payable amount after applying a discount percentage. */
export function applyDiscount(amount: number, discountPercent: number): number {
  if (!discountPercent) return amount;
  return amount * (1 - discountPercent / 100);
}

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

/** Converts an internal price unit using the PPP-adjusted display rate. */
export function convertDisplayPrice(amount: number, currency: CurrencyCode): number {
  return Math.round(amount * currencies[currency].displayRate);
}

/**
 * Formats a price using PPP-adjusted display rates.
 * Use for service/tier pricing shown to visitors (services page, budget ranges).
 * For real monetary amounts (quotes, referral balance), use formatPrice instead.
 */
export function formatDisplayPrice(amount: number, currency: CurrencyCode): string {
  const converted = convertDisplayPrice(amount, currency);
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
  "under-100": [0, 100],
  "100-200": [100, 200],
  "200-350": [200, 350],
  "350-500": [350, 500],
  "500-plus": [500, null],
};

export function formatBudget(value: string, currency: CurrencyCode): string {
  const bounds = budgetRangeBoundsUSD[value];
  if (!bounds) return value;
  const [min, max] = bounds;
  if (min === 0 && max !== null) return `Under ${formatDisplayPrice(max, currency)}`;
  if (max === null) return `${formatDisplayPrice(min, currency)}+`;
  return `${formatDisplayPrice(min, currency)} - ${formatDisplayPrice(max, currency)}`;
}

/**
 * Formats an amount that is stored in USD into the given display currency.
 * Use for values persisted in USD (e.g. referral balance).
 */
export function formatFromUSD(usdAmount: number, currency: CurrencyCode): string {
  return formatPrice(usdAmount, currency);
}

function isCurrencyCode(value: string): value is CurrencyCode {
  return value === "USD" || value === "INR" || value === "CAD";
}

export function toCurrencyCode(value: string | null | undefined): CurrencyCode {
  return value && isCurrencyCode(value) ? value : "USD";
}

/**
 * Converts an amount stored in one currency to another using USD as the pivot.
 */
export function convertBetween(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): number {
  const usd = amount / currencies[from].rate;
  return Math.round(usd * currencies[to].rate);
}

/**
 * Formats an amount stored in `from` currency for display in `to` currency.
 * Used for quotes, which store both an amount and the currency it was entered in.
 */
export function formatAmount(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): string {
  const converted = convertBetween(amount, from, to);
  const config = currencies[to];
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(converted);
}
