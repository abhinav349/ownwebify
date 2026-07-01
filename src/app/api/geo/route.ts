import { NextRequest, NextResponse } from "next/server";
import { getDefaultCurrency } from "@/lib/pricing";

export async function GET(request: NextRequest) {
  // Vercel provides country via header in production
  const vercelCountry = request.headers.get("x-vercel-ip-country");

  // Cloudflare provides it via cf-ipcountry
  const cfCountry = request.headers.get("cf-ipcountry");

  // Use query param override for testing
  const { searchParams } = new URL(request.url);
  const overrideCountry = searchParams.get("country");

  const countryCode = overrideCountry || vercelCountry || cfCountry || null;
  const currency = getDefaultCurrency(countryCode);

  return NextResponse.json({
    country: countryCode || "US",
    currency,
  });
}
