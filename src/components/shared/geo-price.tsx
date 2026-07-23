"use client";

import { formatDisplayPrice } from "@/lib/pricing";
import { useCurrency } from "@/hooks/use-currency";

/**
 * Renders a price that auto-adjusts based on the visitor's detected location.
 * Falls back to INR if geo-detection fails. Supports ?currency= override.
 */
export function GeoPrice({ amount }: { amount: number }) {
  const currency = useCurrency();
  return <>{formatDisplayPrice(amount, currency)}</>;
}
