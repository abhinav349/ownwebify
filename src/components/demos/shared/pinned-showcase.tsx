"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type PinnedShowcaseItem = {
  src: string;
  alt: string;
  title: string;
  caption: string;
};

/**
 * Pins the section and scrubs a horizontal row of cards as the user scrolls
 * past it, GSAP ScrollTrigger pin+scrub. Falls back to a static grid when
 * the user prefers reduced motion or on narrow viewports where a pinned
 * horizontal scroll is more disorienting than helpful.
 */
export function PinnedShowcase({
  items,
  eyebrow,
  title,
  className,
  cardClassName,
}: {
  items: PinnedShowcaseItem[];
  eyebrow: string;
  title: string;
  className?: string;
  cardClassName?: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const distance = () => track.scrollWidth - section.clientWidth;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={sectionRef}
      className={cn("relative overflow-hidden py-24 md:py-0 md:h-screen md:flex md:items-center", className)}
    >
      <div className="w-full">
        <div className="mx-auto max-w-7xl px-6 mb-10 md:mb-14">
          <p className="eyebrow-demo">{eyebrow}</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-[var(--font-display)] text-balance">{title}</h2>
        </div>
        <div
          ref={trackRef}
          className="flex flex-col gap-6 px-6 md:flex-row md:gap-8 md:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] md:w-max"
        >
          {items.map((item) => (
            <div
              key={item.title}
              className={cn(
                "relative w-full shrink-0 overflow-hidden rounded-sm md:w-[min(60vw,32rem)]",
                cardClassName
              )}
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 32rem, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-[var(--font-display)] text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-white/70">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
