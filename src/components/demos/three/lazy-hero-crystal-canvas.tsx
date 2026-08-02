"use client";

import dynamic from "next/dynamic";

/**
 * `next/dynamic({ ssr: false })` can only be called from inside a Client
 * Component (Next.js 16 app router rule) — mirrors lazy-hero-canvas.tsx.
 */
export const LazyHeroCrystalCanvas = dynamic(
  () => import("@/components/demos/three/hero-crystal-canvas"),
  { ssr: false }
);
