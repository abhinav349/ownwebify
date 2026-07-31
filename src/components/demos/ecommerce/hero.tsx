"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown, Truck, RotateCcw, Shield } from "lucide-react";
import { LazyHeroCanvas as HeroCanvas } from "@/components/demos/three/lazy-hero-canvas";
import { Reveal } from "@/components/demos/shared/reveal";
import { Magnetic } from "@/components/demos/shared/magnetic";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#e8e6e1";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fallback = img(demoImages.ecommerce.hero, 1920, 70);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#0a0a0a]"
    >
      {reducedMotion ? (
        <Image
          src={fallback.src}
          alt={fallback.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30 grayscale"
        />
      ) : (
        <HeroCanvas variant="orb" color={ACCENT} />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/40 pointer-events-none" />

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <Reveal>
          <p className="eyebrow-demo">Autumn / Winter 2026</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-6 font-display text-5xl md:text-8xl leading-[1.02] tracking-tight text-balance">
            Quiet luxury,
            <br />
            worn well
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-8 text-base md:text-lg text-white/50 max-w-md mx-auto leading-relaxed font-light">
            Considered pieces, made to last. Minimal silhouettes cut from the
            finest natural fibers.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Magnetic>
              <a
                href="#shop"
                className="inline-block w-full sm:w-auto px-10 py-4 font-medium tracking-[0.2em] uppercase text-sm"
                style={{ backgroundColor: ACCENT, color: "#0a0a0a" }}
              >
                Shop the Edit
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#about"
                className="inline-block w-full sm:w-auto px-10 py-4 border border-white/25 text-white font-medium tracking-[0.2em] uppercase text-sm hover:border-white/50 transition-colors"
              >
                Our Story
              </a>
            </Magnetic>
          </div>
        </Reveal>
        <Reveal delay={0.32}>
          <div className="mt-16 flex items-center justify-center gap-6 sm:gap-12 text-center">
            <div>
              <Truck className="h-5 w-5 mx-auto mb-2 text-white/40" />
              <p className="text-[0.65rem] text-white/35 uppercase tracking-[0.2em]">Free Shipping</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <RotateCcw className="h-5 w-5 mx-auto mb-2 text-white/40" />
              <p className="text-[0.65rem] text-white/35 uppercase tracking-[0.2em]">Easy Returns</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <Shield className="h-5 w-5 mx-auto mb-2 text-white/40" />
              <p className="text-[0.65rem] text-white/35 uppercase tracking-[0.2em]">Secure Payment</p>
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
