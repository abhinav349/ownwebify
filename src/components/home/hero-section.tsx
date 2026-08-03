"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useScroll } from "motion/react";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";
import { GeoPrice } from "@/components/shared/geo-price";
import { Magnetic } from "@/components/demos/shared/magnetic";
import { LazyHeroParticlesCanvas as HeroParticlesCanvas } from "@/components/demos/three/lazy-hero-particles-canvas";
import { useDeviceTier } from "@/hooks/use-device-tier";
import { useMediaQuery } from "@/hooks/use-media-query";

const headlineLines = [
  ["Websites", "that", "look"],
  ["expensive."],
];

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const deviceTier = useDeviceTier();
  // Desktop only. What is left in this canvas is ambient drift behind the
  // copy, which is not worth a WebGL context, a bloom pass and three.js on a
  // phone — the aurora and grid layers already carry the hero without it.
  const canShow3D = useMediaQuery("(min-width: 1024px)");
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // three.js is ~970KB and costs ~1s of script evaluation. Mounting it during
  // hydration blocks the main thread while the user is trying to read/click,
  // so wait for idle — the hero reads as complete without it, and the field
  // easing in a beat later is part of the effect rather than a regression.
  const [canvasReady, setCanvasReady] = useState(false);
  useEffect(() => {
    const schedule =
      window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = schedule(() => setCanvasReady(true), { timeout: 2500 });
    return () => cancel(id as number);
  }, []);

  // Stop drawing once the hero is off screen. Without this the particle field
  // and its bloom pass kept rendering at 60fps for the whole page — invisible
  // behind everything below, and stealing frames from the work section's
  // laptop scene while it initialises.
  const [heroVisible, setHeroVisible] = useState(true);
  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { rootMargin: "100px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  let wordIndex = 0;

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[100svh] flex items-center overflow-hidden"
    >
      <div className="aurora-bg">
        <div className="aurora-layer" />
      </div>
      <div className="noise-overlay" />
      <div className="absolute inset-0 -z-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {deviceTier !== "reduced" && canShow3D && canvasReady && (
        <div className="absolute inset-0 z-0 animate-fade-in">
          <HeroParticlesCanvas
            scrollProgress={scrollYProgress}
            deviceTier={deviceTier}
            active={heroVisible}
          />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 lg:px-8 w-full">
        <div className="text-center max-w-4xl mx-auto">
          <div className="hero-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full border glass text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Launch offer — up to 71% off</span>
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse-glow" />
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl leading-[1.05]">
            {headlineLines.map((line, lineIdx) => (
              <span key={lineIdx}>
                {lineIdx > 0 && <br />}
                {line.map((word) => {
                  const i = wordIndex++;
                  return (
                    <span
                      key={word}
                      style={{ animationDelay: `${0.1 + i * 0.06}s` }}
                      className={cn("hero-word mr-[0.25em]", lineIdx === 1 && "gradient-text")}
                    >
                      {word}
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          <p
            style={{ animationDelay: "0.18s" }}
            className="hero-fade-up mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed"
          >
            Agency-quality web development, honestly priced — starting at{" "}
            <span className="font-semibold text-foreground">
              <GeoPrice amount={59} />
            </span>
            . Cinematic, high-converting digital experiences built to turn
            visitors into customers.
          </p>

          <div
            style={{ animationDelay: "0.5s" }}
            className="hero-fade-up mt-12 flex items-center justify-center gap-4 flex-wrap"
          >
            <Magnetic strength={0.3}>
              <Link
                href="/hire"
                className={cn(
                  buttonVariants({ size: "xl" }),
                  "rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                )}
              >
                Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link
                href="/services"
                className={cn(buttonVariants({ variant: "outline", size: "xl" }), "rounded-full glass")}
              >
                View Services
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>

      <div
        style={{ animationDelay: "0.9s" }}
        className="hero-fade-up absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown className="h-4 w-4 animate-float" />
      </div>
    </section>
  );
}
