"use client";

import dynamic from "next/dynamic";

/**
 * `next/dynamic({ ssr: false })` can only be called from inside a Client
 * Component (Next.js 16 app router rule) — mirrors lazy-hero-crystal-canvas.tsx.
 */
export const LazyLaptopCanvas = dynamic(
  () => import("@/components/demos/three/laptop-canvas"),
  { ssr: false }
);
