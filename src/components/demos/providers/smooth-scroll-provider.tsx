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
 * ScrollTrigger only auto-refreshes on `load` / `DOMContentLoaded` / `resize`
 * (see gsap/ScrollTrigger.js), none of which fire again on a Next.js
 * client-side route transition. Without this, a pinned section's cached
 * start/end can go stale against the newly-mounted page's real layout
 * (fonts/images still settling) and scroll appears to "stick" once you
 * reach it, for the rest of that SPA session.
 */
function RouteScrollTriggerRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    // Let the new route's DOM paint before measuring.
    const raf = requestAnimationFrame(() => requestAnimationFrame(refresh));
    document.fonts?.ready?.then(refresh);

    const images = Array.from(document.images).filter((img) => !img.complete);
    images.forEach((img) => img.addEventListener("load", refresh, { once: true }));

    return () => {
      cancelAnimationFrame(raf);
      images.forEach((img) => img.removeEventListener("load", refresh));
    };
  }, [pathname]);

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
      <RouteScrollTriggerRefresh />
      {children}
    </ReactLenis>
  );
}
