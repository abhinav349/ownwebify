import Image from "next/image";
import { Reveal } from "@/components/demos/shared/reveal";
import { StatsRow } from "@/components/demos/shared/stats-row";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#caa25a";

const stats = [
  { value: 15, label: "Years" },
  { value: 3, label: "Michelin Stars" },
  { value: 200, suffix: "+", label: "Wine Labels" },
];

export function Story() {
  const photo = img(demoImages.restaurant.interior, 900, 75);

  return (
    <section id="about" className="py-28 md:py-36 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <Reveal>
            <p className="eyebrow-demo">Our Philosophy</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-balance">
              Every dish tells
              <br />
              <em className="italic" style={{ color: ACCENT }}>
                a story
              </em>
            </h2>
            <p className="mt-8 text-white/60 leading-relaxed">
              Chef Ananya Sharma draws inspiration from her travels across
              India, France, and Japan, crafting a menu that celebrates the
              intersection of cultures using only the finest seasonal
              ingredients sourced from local farms and trusted suppliers
              worldwide.
            </p>
            <p className="mt-4 text-white/60 leading-relaxed">
              Our tasting menu changes with the seasons, ensuring every visit
              is a new discovery. The cellar houses over two hundred
              carefully curated bottles from the world&apos;s most revered
              vineyards.
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
            <div className="absolute -bottom-6 -left-6 hidden sm:block p-6 bg-[#1a0a0a] border border-white/10 rounded-sm">
              <p className="text-xs uppercase tracking-wider" style={{ color: ACCENT }}>
                Open Kitchen
              </p>
              <p className="text-sm text-white/80 mt-1">Watch the magic unfold</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
