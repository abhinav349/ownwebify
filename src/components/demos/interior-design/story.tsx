import Image from "next/image";
import { Reveal } from "@/components/demos/shared/reveal";
import { StatsRow } from "@/components/demos/shared/stats-row";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#c9a87c";

const stats = [
  { value: 140, suffix: "+", label: "Projects Completed" },
  { value: 11, label: "Years in Practice" },
  { value: 6, label: "Design Awards" },
];

export function Story() {
  const photo = img(demoImages.interiorDesign.moodboard, 900, 75);

  return (
    <section id="about" className="py-28 md:py-36 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <Reveal>
            <p className="eyebrow-demo">The Studio</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-balance">
              Material first,
              <br />
              <span style={{ color: ACCENT }}>trend never</span>
            </h2>
            <p className="mt-8 text-white/55 leading-relaxed">
              Studio Loam works in oak, lime plaster, wool, stone, and
              unlacquered brass - materials that record time rather than
              resist it. We start every project with samples on a table,
              not a mood board on a screen.
            </p>
            <p className="mt-4 text-white/55 leading-relaxed">
              We take on a limited number of projects each year so the
              designer you meet is the one who sees it through to the final
              site visit.
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
            <div className="absolute -bottom-6 -left-6 hidden sm:block p-6 bg-[#15120e] border border-white/10 rounded-sm">
              <p className="text-xs uppercase tracking-wider" style={{ color: ACCENT }}>
                Now Booking
              </p>
              <p className="text-sm text-white/80 mt-1">Q1 2027 project slots</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
