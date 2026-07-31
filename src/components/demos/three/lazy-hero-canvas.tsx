"use client";

import dynamic from "next/dynamic";

/**
 * `next/dynamic({ ssr: false })` can only be called from inside a Client
 * Component (Next.js 16 app router rule) — this wrapper exists so Server
 * Component demo pages can still statically import a client-only, lazily
 * loaded R3F canvas.
 */
export const LazyHeroCanvas = dynamic(
  () => import("@/components/demos/three/hero-canvas"),
  { ssr: false }
);
