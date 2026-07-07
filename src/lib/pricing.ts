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

export const basePricesUSD = [99, 199, 299, 399];

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
