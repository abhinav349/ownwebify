"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Search, Palette, Code2, TestTube2, Rocket } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  { icon: Sparkles, title: "Discovery", desc: "Understanding your goals, audience, and what success looks like." },
  { icon: Search, title: "Research", desc: "Studying your market and competitors to inform every decision." },
  { icon: Palette, title: "Design", desc: "Visual direction and prototypes so you can feel the product before it's built." },
  { icon: Code2, title: "Development", desc: "Clean, performant code with regular demos to track progress." },
  { icon: TestTube2, title: "Testing", desc: "Rigorous QA across devices, with performance tuning throughout." },
  { icon: Rocket, title: "Launch", desc: "Smooth deployment, monitoring, and 30 days of free support." },
];

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  // Scroll-jacked horizontal pins are notoriously janky with touch/momentum
  // scrolling on phones — fall back to the same simple grid used for
  // prefers-reduced-motion below the tablet breakpoint.
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const useSimpleLayout = reducedMotion || !isDesktop;

  useEffect(() => {
    if (useSimpleLayout) return;
    if (!trackRef.current || !pinRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const scrollLength = Math.max(track.scrollWidth - window.innerWidth, 0);
      if (scrollLength <= 0) return;

      gsap.to(track, {
        x: -scrollLength,
        ease: "none",
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${scrollLength}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [useSimpleLayout]);

  return (
    <section ref={sectionRef} className="relative py-24" id="process">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-12">
        <Reveal className="text-center">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Simple Process
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            From Idea to Launch in{" "}
            <span className="gradient-text">6 Steps</span>
          </h2>
        </Reveal>
      </div>

      {useSimpleLayout ? (
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.08}>
            {steps.map((step, i) => (
              <StaggerItem key={step.title}>
                <ProcessCard step={step} index={i} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      ) : (
        <div ref={pinRef} className="h-screen flex items-center overflow-hidden">
          <div ref={trackRef} className="flex gap-6 pl-[6vw] pr-[20vw] will-change-transform">
            {steps.map((step, i) => (
              <div key={step.title} className="w-[80vw] sm:w-[380px] shrink-0">
                <ProcessCard step={step} index={i} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function ProcessCard({
  step,
  index,
}: {
  step: (typeof steps)[number];
  index: number;
}) {
  return (
    <div className="relative p-8 rounded-2xl border glass hover-lift group h-full">
      {/* Decorative watermark: CSS-generated so it is exempt from contrast
          rules — the step number is already conveyed by order and heading. */}
      <div
        aria-hidden="true"
        data-step={String(index + 1).padStart(2, "0")}
        className="pointer-events-none select-none absolute top-4 right-4 text-6xl font-black text-primary/5 group-hover:text-primary/10 transition-colors before:content-[attr(data-step)]"
      />
      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center mb-5">
        <step.icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
    </div>
  );
}
