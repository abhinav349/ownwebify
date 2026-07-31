"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown, Sparkles, Heart, Star } from "lucide-react";
import { LazyHeroCanvas as HeroCanvas } from "@/components/demos/three/lazy-hero-canvas";
import { Reveal } from "@/components/demos/shared/reveal";
import { Magnetic } from "@/components/demos/shared/magnetic";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#e3aab4";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fallback = img(demoImages.salon.hero, 1920, 70);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#180f12]"
    >
      {reducedMotion ? (
        <Image
          src={fallback.src}
          alt={fallback.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
      ) : (
        <HeroCanvas variant="particles" color={ACCENT} scrollProgress={scrollYProgress} />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#180f12] via-[#180f12]/10 to-[#180f12]/45 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <Reveal>
          <p className="eyebrow-demo">Voted #1 Salon 2025</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-6 font-display text-5xl md:text-8xl leading-[1.05] text-balance">
            Glow from
            <br />
            <em className="italic" style={{ color: ACCENT }}>
              the inside out
            </em>
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-8 text-base md:text-lg text-white/60 max-w-md mx-auto leading-relaxed font-light">
            Your sanctuary for beauty and self-care. Expert stylists, premium
            products, and an atmosphere designed to make you feel extraordinary.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Magnetic>
              <a
                href="#contact"
                className="inline-block w-full sm:w-auto px-10 py-4 font-medium tracking-wider uppercase text-sm rounded-sm transition-transform hover:scale-[1.03]"
                style={{ backgroundColor: ACCENT, color: "#180f12" }}
              >
                Book Appointment
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#services"
                className="inline-block w-full sm:w-auto px-10 py-4 border border-white/25 text-white font-medium tracking-wider uppercase text-sm rounded-sm hover:border-white/50 transition-colors"
              >
                View Services
              </a>
            </Magnetic>
          </div>
        </Reveal>
        <Reveal delay={0.32}>
          <div className="mt-16 flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4" style={{ fill: "#f5c04a", color: "#f5c04a" }} />
            ))}
            <span className="ml-2 text-xs text-white/40 uppercase tracking-wider">500+ happy clients this month</span>
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

      <div className="absolute top-8 right-8 hidden md:flex items-center gap-2 text-white/40 text-xs uppercase tracking-wider">
        <Heart className="h-3.5 w-3.5" style={{ color: ACCENT }} />
        <Sparkles className="h-3.5 w-3.5" style={{ color: ACCENT }} />
      </div>
    </section>
  );
}
