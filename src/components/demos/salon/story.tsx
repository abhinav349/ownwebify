import Image from "next/image";
import { Reveal } from "@/components/demos/shared/reveal";
import { StatsRow } from "@/components/demos/shared/stats-row";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#e3aab4";

const stats = [
  { value: 9, label: "Years of Craft" },
  { value: 4, suffix: ".9", label: "Star Rating" },
  { value: 500, suffix: "+", label: "Clients Monthly" },
];

export function Story() {
  const photo = img(demoImages.salon.styling, 900, 75);

  return (
    <section id="about" className="py-28 md:py-36 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <Reveal className="lg:order-2">
            <p className="eyebrow-demo">Our Studio</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-balance">
              Beauty, made a
              <br />
              <em className="italic" style={{ color: ACCENT }}>
                ritual
              </em>
            </h2>
            <p className="mt-8 text-white/60 leading-relaxed">
              Glow Studio was built on a simple belief: self-care should feel
              like an occasion, not an errand. Every treatment is unhurried,
              every product hand-selected, every stylist trained to listen
              first and style second.
            </p>
            <p className="mt-4 text-white/60 leading-relaxed">
              From signature blowouts to complete colour transformations,
              we tailor every visit to how you actually want to feel walking
              back out the door.
            </p>
            <div className="mt-12">
              <StatsRow stats={stats} accent={ACCENT} />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="relative lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden sm:block p-6 bg-[#180f12] border border-white/10 rounded-sm">
              <p className="text-xs uppercase tracking-wider" style={{ color: ACCENT }}>
                Next Available
              </p>
              <p className="text-sm text-white/80 mt-1">Today, 2:30 PM</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
