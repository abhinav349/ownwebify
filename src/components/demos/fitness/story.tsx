import Image from "next/image";
import { Reveal } from "@/components/demos/shared/reveal";
import { StatsRow } from "@/components/demos/shared/stats-row";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#b6ff3c";

const stats = [
  { value: 10, suffix: "K+", label: "Members" },
  { value: 50, suffix: "+", label: "Trainers" },
  { value: 24, suffix: "/7", label: "Access" },
];

export function Story() {
  const photo = img(demoImages.fitness.training, 900, 75);

  return (
    <section id="about" className="py-28 md:py-36 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <Reveal>
            <p className="eyebrow-demo">Why IronPulse</p>
            <h2 className="mt-4 font-display text-4xl md:text-6xl leading-[0.95] uppercase text-balance">
              Built for
              <br />
              <span style={{ color: ACCENT }}>Relentless</span>
            </h2>
            <p className="mt-8 text-white/60 leading-relaxed">
              IronPulse isn&apos;t a gym you visit — it&apos;s a standard you
              hold yourself to. Elite coaching, science-backed programming,
              and a floor full of people who push you harder than you push
              yourself.
            </p>
            <p className="mt-4 text-white/60 leading-relaxed">
              From strength to conditioning to full recovery, every space
              is engineered for one outcome: progress you can measure.
            </p>
            <div className="mt-12">
              <StatsRow stats={stats} accent={ACCENT} />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover grayscale contrast-125"
              />
              <div className="absolute inset-0 mix-blend-multiply" style={{ backgroundColor: "#0b0c09aa" }} />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden sm:block p-6 bg-[#0b0c09] border border-white/10 rounded-sm">
              <p className="text-xs uppercase tracking-wider" style={{ color: ACCENT }}>
                Open 24/7
              </p>
              <p className="text-sm text-white/80 mt-1">Train on your schedule</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
