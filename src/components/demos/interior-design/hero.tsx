"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown, Ruler, Sofa, Lightbulb } from "lucide-react";
import { LazyHeroCanvas as HeroCanvas } from "@/components/demos/three/lazy-hero-canvas";
import { Reveal } from "@/components/demos/shared/reveal";
import { Magnetic } from "@/components/demos/shared/magnetic";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#c9a87c";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fallback = img(demoImages.interiorDesign.hero, 1920, 70);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#15120e]"
    >
      {reducedMotion ? (
        <Image
          src={fallback.src}
          alt={fallback.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
      ) : (
        <HeroCanvas variant="rings" color={ACCENT} scrollProgress={scrollYProgress} />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#15120e] via-[#15120e]/15 to-[#15120e]/50 pointer-events-none" />

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <Reveal>
          <p className="eyebrow-demo">Studio Loam &middot; Interiors</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-6 font-display text-5xl md:text-8xl leading-[1.02] tracking-tight text-balance">
            Rooms that
            <br />
            <span style={{ color: ACCENT }}>hold their weight</span>
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-8 text-base md:text-lg text-white/55 max-w-lg mx-auto leading-relaxed font-light">
            We design interiors meant to be lived in hard and still look
            considered in ten years - natural materials, honest proportions,
            nothing decorative for its own sake.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Magnetic>
              <a
                href="#contact"
                className="inline-block w-full sm:w-auto px-10 py-4 font-medium tracking-wider uppercase text-sm rounded-sm transition-transform hover:scale-[1.03]"
                style={{ backgroundColor: ACCENT, color: "#15120e" }}
              >
                Start a Project
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#services"
                className="inline-block w-full sm:w-auto px-10 py-4 border border-white/25 text-white font-medium tracking-wider uppercase text-sm rounded-sm hover:border-white/50 transition-colors"
              >
                Our Services
              </a>
            </Magnetic>
          </div>
        </Reveal>
        <Reveal delay={0.32}>
          <div className="mt-16 flex items-center justify-center gap-6 sm:gap-12 text-center">
            <div>
              <Ruler className="h-5 w-5 mx-auto mb-2" style={{ color: `${ACCENT}99` }} />
              <p className="text-xs text-white/40 uppercase tracking-wider">Space Planning</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <Sofa className="h-5 w-5 mx-auto mb-2" style={{ color: `${ACCENT}99` }} />
              <p className="text-xs text-white/40 uppercase tracking-wider">Full Fit-Out</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <Lightbulb className="h-5 w-5 mx-auto mb-2" style={{ color: `${ACCENT}99` }} />
              <p className="text-xs text-white/40 uppercase tracking-wider">Lighting Design</p>
            </div>
          </div>
        </Reveal>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-5 w-5" />
      </motion.div>
    </section>
  );
}
