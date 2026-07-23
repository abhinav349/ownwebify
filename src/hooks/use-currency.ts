"use client";

import { useState, useEffect } from "react";
import { type CurrencyCode, currencies } from "@/lib/pricing";

function isCurrencyCode(value: string): value is CurrencyCode {
  return value === "USD" || value === "INR" || value === "CAD";
}

/**
 * Detects the visitor's currency via geo API.
 * Supports a ?currency= query param override for testing.
 */
export function useCurrency() {
  const [currency, setCurrency] = useState<CurrencyCode>("INR");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const override = params.get("currency")?.toUpperCase();
    if (override && isCurrencyCode(override)) {
      setCurrency(override);
      return;
    }

    fetch("/api/geo")
      .then((res) => res.json())
      .then((data) => {
        if (data.currency && currencies[data.currency as CurrencyCode]) {
          setCurrency(data.currency as CurrencyCode);
        }
      })
      .catch(() => {});
  }, []);

  return currency;
}
