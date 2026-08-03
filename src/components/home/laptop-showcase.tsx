"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useScroll } from "motion/react";
import { LazyLaptopCanvas as LaptopCanvas } from "@/components/demos/three/lazy-laptop-canvas";
import type { SiteMock } from "@/components/demos/three/site-screen-texture";
import { img, demoImages } from "@/lib/demos/images";
import { useDeviceTier } from "@/hooks/use-device-tier";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * What the screen cycles through. Four rather than all six: each one is a
 * separate 1200px photo fetch, and at a 3.4s dwell six sites is a 20s loop that
 * nobody stays long enough to finish anyway.
 */
const SITES: SiteMock[] = [
  {
    name: "Brew & Bean",
    type: "Coffee Shop",
    tagline: "Roasted this morning.",
    cta: "Order ahead",
    accent: "#e0a260",
    photo: img(demoImages.cafe.interior, 1200, 70).src,
    nav: ["Menu", "Our Roast", "Visit"],
  },
  {
    name: "IronPulse",
    type: "Gym & Fitness",
    tagline: "Train like it counts.",
    cta: "Join now",
    accent: "#b6ff3c",
    photo: img(demoImages.fitness.hero, 1200, 70).src,
    nav: ["Classes", "Coaches", "Pricing"],
  },
  {
    name: "Velvet & Thread",
    type: "Fashion Store",
    tagline: "The new season.",
    cta: "Shop now",
    accent: "#e8e6e1",
    photo: img(demoImages.ecommerce.editorial, 1200, 70).src,
    nav: ["New In", "Women", "Men"],
  },
  {
    name: "Skyline Properties",
    type: "Real Estate",
    tagline: "Room to breathe.",
    cta: "Book a viewing",
    accent: "#d4af61",
    photo: img(demoImages.realEstate.hero, 1200, 70).src,
    nav: ["Listings", "Areas", "Sell"],
  },
];

// Deliberately not the cafe, which is the first card in the grid directly
// below — the same photograph twice in one scroll reads as a duplication bug.
const FALLBACK = SITES[3];
const fallbackCover = img(demoImages.realEstate.hero, 900, 70);

/**
 * A flat stand-in for the WebGL laptop, used below `lg` and under reduced
 * motion. Not a placeholder — it's what all phone traffic sees, so it has to
 * hold the section on its own.
 */
function StaticLaptop() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12 sm:py-16">
      <div className="rounded-2xl border border-white/10 bg-[#0b0b10] p-2 shadow-2xl shadow-primary/10">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
          <Image
            src={fallbackCover.src}
            alt={fallbackCover.alt}
            fill
            sizes="(min-width: 640px) 42rem, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <p
              className="text-[0.65rem] font-semibold uppercase tracking-[0.2em]"
              style={{ color: FALLBACK.accent }}
            >
              {FALLBACK.type}
            </p>
            <p className="mt-1.5 text-xl font-bold text-white sm:text-3xl">
              {FALLBACK.tagline}
            </p>
            <span
              className="mt-3 inline-block rounded-full px-4 py-1.5 text-xs font-semibold text-[#0a0a0f]"
              style={{ backgroundColor: FALLBACK.accent }}
            >
              {FALLBACK.cta}
            </span>
          </div>
        </div>
      </div>
      {/* Base. Fixed metal tones rather than theme tokens: the chassis is a
          silver object in both themes, and `muted` renders it as a near-
          invisible smudge against a light page. The overhang is what reads as
          a laptop rather than a tablet. */}
      <div className="mx-auto h-3 w-[106%] -translate-x-[2.8%] rounded-b-2xl bg-gradient-to-b from-zinc-300 to-zinc-400 shadow-md dark:from-zinc-600 dark:to-zinc-700" />
    </div>
  );
}

export function LaptopShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const deviceTier = useDeviceTier();
  const canShow3D = useMediaQuery("(min-width: 1024px)");
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  // Measured across the tall track while the stage is pinned to it: 0 when the
  // track's top reaches the top of the viewport, 1 when its bottom reaches the
  // bottom. That window is exactly the span the sticky stage stays put for, so
  // the whole open/hold/close arc plays with the laptop held in frame.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const use3D = deviceTier !== "reduced" && canShow3D;

  // Mount the canvas just before the section arrives so the lid is already
  // rigged when the scrub starts, and freeze the render loop once it's well
  // past. `mounted` is sticky — only `active` toggles — because rebuilding the
  // WebGL context on every pass costs more than an idle canvas does.
  useEffect(() => {
    if (!use3D) return;
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setMounted(true);
        setActive(entry.isIntersecting);
      },
      { rootMargin: "500px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [use3D]);

  return (
    // The ref stays attached in both branches even though only the 3D one reads
    // the scroll progress: `useScroll` measures its target on mount regardless,
    // and an unattached ref makes it bail out with a hydration warning. Both
    // device tiers resolve to `false` on the server, so the fallback is always
    // what renders first and this would fire on every load.
    //
    // 200vh of track against a 100vh stage gives one full viewport of pinned
    // scroll to spend on the animation. Less and the lid snaps open and shut
    // inside a flick of the wheel; more and the page just feels padded.
    <div ref={sectionRef} className={use3D ? "relative h-[200vh]" : "relative"}>
      {use3D ? (
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {mounted && (
            <div className="absolute inset-0 animate-fade-in">
              <LaptopCanvas
                sites={SITES}
                scrollProgress={scrollYProgress}
                deviceTier={deviceTier}
                active={active}
              />
            </div>
          )}
        </div>
      ) : (
        <StaticLaptop />
      )}
    </div>
  );
}
