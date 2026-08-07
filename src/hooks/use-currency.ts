"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { type CurrencyCode, currencies, DEFAULT_CURRENCY } from "@/lib/pricing";

function isCurrencyCode(value: string): value is CurrencyCode {
  return value === "USD" || value === "INR" || value === "CAD";
}

/** The URL only changes across navigations, which remount this anyway. */
function subscribe() {
  return () => {};
}

function getOverrideSnapshot(): CurrencyCode | null {
  const override = new URLSearchParams(window.location.search)
    .get("currency")
    ?.toUpperCase();
  return override && isCurrencyCode(override) ? override : null;
}

function getServerOverrideSnapshot(): CurrencyCode | null {
  return null;
}

/**
 * Detects the visitor's currency via geo API.
 * Supports a ?currency= query param override for testing.
 *
 * The override is read through `useSyncExternalStore` rather than assigned
 * from an effect. It is a value that already exists at render time, so pushing
 * it through `setState` in an effect made every override render twice and
 * discard the first pass. It cannot simply be read inline either: the server
 * has no `window`, so a plain render-time read would disagree with the
 * prerendered HTML and trip a hydration mismatch. `getServerSnapshot` is the
 * mechanism built for exactly that split.
 */
export function useCurrency() {
  const override = useSyncExternalStore(
    subscribe,
    getOverrideSnapshot,
    getServerOverrideSnapshot
  );
  const [geoCurrency, setGeoCurrency] = useState<CurrencyCode | null>(null);

  useEffect(() => {
    // An explicit override wins outright, so skip the request entirely.
    if (override) return;

    let cancelled = false;
    fetch("/api/geo")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.currency && currencies[data.currency as CurrencyCode]) {
          setGeoCurrency(data.currency as CurrencyCode);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [override]);

  return override ?? geoCurrency ?? DEFAULT_CURRENCY;
}
