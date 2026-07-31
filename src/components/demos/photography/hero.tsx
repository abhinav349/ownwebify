"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { LazyHeroCanvas as HeroCanvas } from "@/components/demos/three/lazy-hero-canvas";
import { Reveal } from "@/components/demos/shared/reveal";
import { Magnetic } from "@/components/demos/shared/magnetic";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#d8d8d8";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fallback = img(demoImages.photography.hero, 1920, 70);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#0d0d0d]"
    >
      {reducedMotion ? (
        <Image
          src={fallback.src}
          alt={fallback.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35 grayscale"
        />
      ) : (
        <HeroCanvas variant="particles" color={ACCENT} scrollProgress={scrollYProgress} />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-[#0d0d0d]/50 pointer-events-none" />

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <Reveal>
          <p className="eyebrow-demo">Lens &amp; Light Studio</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-6 font-display text-5xl md:text-8xl leading-[1.05] italic text-balance">
            Stories, held
            <br />
            in a single frame
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-8 text-base md:text-lg text-white/50 max-w-md mx-auto leading-relaxed font-light">
            Editorial portraiture, architecture, and fine art photography —
            shot on location, printed to last.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Magnetic>
              <a
                href="#portfolio"
                className="inline-block w-full sm:w-auto px-10 py-4 font-medium tracking-[0.2em] uppercase text-sm"
                style={{ backgroundColor: ACCENT, color: "#0d0d0d" }}
              >
                View Portfolio
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="inline-block w-full sm:w-auto px-10 py-4 border border-white/25 text-white font-medium tracking-[0.2em] uppercase text-sm hover:border-white/50 transition-colors"
              >
                Inquire
              </a>
            </Magnetic>
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
