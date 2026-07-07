import { headers } from "next/headers";
import { getDefaultCurrency, type CurrencyCode } from "./pricing";

/**
 * Detects the display currency for a server component based on request geo
 * headers (Vercel / Cloudflare). Falls back to INR when the country is unknown.
 */
export async function getServerCurrency(): Promise<CurrencyCode> {
  const h = await headers();
  const country =
    h.get("x-vercel-ip-country") || h.get("cf-ipcountry") || null;
  return getDefaultCurrency(country);
}
