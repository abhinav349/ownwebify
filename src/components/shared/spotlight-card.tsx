"use client";

import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

function handleSpotlight(e: PointerEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
}

/** Glass card with a radial highlight that follows the cursor. */
export function SpotlightCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div onPointerMove={handleSpotlight} className={cn("spotlight-card overflow-hidden", className)}>
      {children}
    </div>
  );
}
