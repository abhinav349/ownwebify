"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function GsapLenisBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
    };
  }, [lenis]);

  return null;
}

/**
 * Re-measures both scroll systems after a client-side route change.
 *
 * Lenis caches the document height as its scroll limit. A Next.js navigation
 * swaps the content without ever resizing the viewport, so that limit stays at
 * the *previous* page's height and scrolling clamps dead at it — arriving on
 * the home page from /services stopped at exactly 2207px, which is that page's
 * maximum, roughly a third of the way down. Its `autoResize` ResizeObserver
 * does not reliably catch this, so the resize has to be driven explicitly.
 *
 * ScrollTrigger has the same blind spot for its own reasons: it only
 * auto-refreshes on `load` / `DOMContentLoaded` / `resize` (see
 * gsap/ScrollTrigger.js), none of which fire again on a route transition, so a
 * pinned section's cached start/end can go stale against the new layout.
 *
 * Order matters — Lenis first, so ScrollTrigger measures against the corrected
 * scroll range rather than the stale one.
 */
function RouteScrollSync() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    const sync = () => {
      lenis?.resize();
      ScrollTrigger.refresh();
    };

    // Let the new route's DOM paint before measuring.
    const raf = requestAnimationFrame(() => requestAnimationFrame(sync));
    document.fonts?.ready?.then(sync);

    const images = Array.from(document.images).filter((img) => !img.complete);
    images.forEach((img) => img.addEventListener("load", sync, { once: true }));

    // Deliberately no ResizeObserver on the document: ScrollTrigger.refresh()
    // resizes its own pin-spacers, which changes document height and would
    // retrigger the observer in a loop that pins scroll at 0.
    const settle = window.setTimeout(sync, 600);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
      images.forEach((img) => img.removeEventListener("load", sync));
    };
  }, [pathname, lenis]);

  return null;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        autoRaf: false,
      }}
    >
      <GsapLenisBridge />
      <RouteScrollSync />
      {children}
    </ReactLenis>
  );
}
