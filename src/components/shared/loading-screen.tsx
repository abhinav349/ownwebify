"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { Logo } from "@/components/ui/logo";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

const SESSION_KEY = "ownwebify-loaded";

const neverChanges = () => () => {};

/**
 * The loader covers real content, so it is pure cost for anyone on a metered
 * or slow connection — skip it for them entirely.
 */
function isConstrainedConnection() {
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  return Boolean(conn?.saveData) || /(^|-)(2g|slow-2g)$/.test(conn?.effectiveType ?? "");
}

/** Cinematic one-time loader: logo + progress counter, shown once per browser session on first entry to "/". */
export function LoadingScreen() {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  const shouldRender = useSyncExternalStore(
    neverChanges,
    () =>
      pathname === "/" &&
      !reducedMotion &&
      !sessionStorage.getItem(SESSION_KEY) &&
      !isConstrainedConnection(),
    () => false
  );

  useEffect(() => {
    if (!shouldRender) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const counter = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem(SESSION_KEY, "1");
        document.body.style.overflow = previousOverflow;
        setHidden(true);
      },
    });

    // Total ~1.3s. Every extra 100ms here lands directly on LCP for
    // first-time visitors, so the sequence is kept deliberately tight.
    tl.set(logoRef.current, { scale: 0.7, autoAlpha: 0 })
      .to(logoRef.current, { scale: 1, autoAlpha: 1, duration: 0.4, ease: "power3.out" })
      .to(
        counter,
        {
          value: 100,
          duration: 0.75,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(Math.round(counter.value));
            }
          },
        },
        "-=0.15"
      )
      .to(barRef.current, { scaleX: 1, duration: 0.75, ease: "power2.inOut" }, "<")
      .to(containerRef.current, { autoAlpha: 0, duration: 0.35, ease: "power2.inOut" });

    return () => {
      tl.kill();
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldRender]);

  if (!shouldRender || hidden) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
      aria-hidden="true"
    >
      <div className="aurora-bg opacity-60">
        <div className="aurora-layer" />
      </div>
      <div ref={logoRef} className="relative">
        <Logo size={64} />
      </div>
      <div className="relative mt-10 h-px w-48 overflow-hidden rounded-full bg-border">
        <div
          ref={barRef}
          className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-primary to-pink-500"
        />
      </div>
      <div className="relative mt-4 font-mono text-sm tabular-nums text-muted-foreground">
        <span ref={counterRef}>0</span>%
      </div>
    </div>
  );
}
