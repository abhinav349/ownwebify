"use client";

import { useSyncExternalStore } from "react";
import { usePrefersReducedMotion, useHoverCapable } from "@/hooks/use-reduced-motion";

export type DeviceTier = "high" | "low" | "reduced";

function subscribe() {
  return () => {};
}

function getCoresOkSnapshot() {
  return (navigator.hardwareConcurrency ?? 4) >= 6;
}

function getServerSnapshot() {
  return false;
}

/**
 * Coarse perf tier for gating expensive visuals (postprocessing/bloom, particle
 * counts, the loading sequence). Defaults to "low" during SSR/first paint so
 * nothing heavy flashes in before we know the real device capability.
 */
export function useDeviceTier(): DeviceTier {
  const reducedMotion = usePrefersReducedMotion();
  const hoverCapable = useHoverCapable();
  const coresOk = useSyncExternalStore(subscribe, getCoresOkSnapshot, getServerSnapshot);

  if (reducedMotion) return "reduced";
  if (hoverCapable && coresOk) return "high";
  return "low";
}
