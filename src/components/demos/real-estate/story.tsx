import Image from "next/image";
import { Reveal } from "@/components/demos/shared/reveal";
import { StatsRow } from "@/components/demos/shared/stats-row";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#d4af61";

const stats = [
  { value: 850, suffix: "+", label: "Happy Families" },
  { value: 15, suffix: "+", label: "Years Experience" },
  { value: 99, suffix: "%", label: "Client Satisfaction" },
];

export function Story() {
  const photo = img(demoImages.realEstate.interior, 900, 75);

  return (
    <section id="about" className="py-28 md:py-36 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <Reveal>
            <p className="eyebrow-demo">Why Skyline</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-balance">
              Guidance you can
              <br />
              <em className="italic" style={{ color: ACCENT }}>
                actually trust
              </em>
            </h2>
            <p className="mt-8 text-white/60 leading-relaxed">
              For fifteen years, Skyline Properties has paired deep local
              market knowledge with a genuinely client-first process —
              whether you&apos;re buying your first apartment or selling a
              generational estate.
            </p>
            <p className="mt-4 text-white/60 leading-relaxed">
              Our team negotiates, stages, and markets every listing with
              the same rigor, because the address changes but the standard
              doesn&apos;t.
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
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden sm:block p-6 bg-[#0a0f14] border border-white/10 rounded-sm">
              <p className="text-xs uppercase tracking-wider" style={{ color: ACCENT }}>
                Total Sales
              </p>
              <p className="text-sm text-white/80 mt-1">$2.1B+ in closed transactions</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
