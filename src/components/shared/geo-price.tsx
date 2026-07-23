"use client";

import { useState, useEffect } from "react";
import { type CurrencyCode, currencies, formatDisplayPrice } from "@/lib/pricing";

/**
 * Renders a price that auto-adjusts based on the visitor's detected location.
 * Falls back to INR if geo-detection fails.
 */
export function GeoPrice({ amount }: { amount: number }) {
  const [currency, setCurrency] = useState<CurrencyCode>("INR");

  useEffect(() => {
    fetch("/api/geo")
      .then((res) => res.json())
      .then((data) => {
        if (data.currency && currencies[data.currency as CurrencyCode]) {
          setCurrency(data.currency as CurrencyCode);
        }
      })
      .catch(() => {});
  }, []);

  return <>{formatDisplayPrice(amount, currency)}</>;
}
