import Image from "next/image";
import { Heart, Leaf, Star } from "lucide-react";
import { Reveal } from "@/components/demos/shared/reveal";
import { StatsRow } from "@/components/demos/shared/stats-row";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#c8873f";

const stats = [
  { value: 12, suffix: "+", label: "Bean Origins" },
  { value: 5, suffix: "K", label: "Cups Daily" },
  { value: 2018, label: "Est. Since" },
];

export function Story() {
  const photo = img(demoImages.cafe.counter, 900, 75);

  return (
    <section id="about" className="py-28 md:py-36 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <Reveal>
            <p className="eyebrow-demo">Our Story</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-balance">
              Born from a love of
              <br />
              <em className="italic" style={{ color: ACCENT }}>
                exceptional coffee
              </em>
            </h2>
            <p className="mt-8 text-white/60 leading-relaxed">
              Founded in 2018, Brew &amp; Bean started as a small corner shop
              with a big dream: to bring specialty, ethically-sourced coffee
              to our community. Today we partner directly with farmers across
              twelve countries to bring you the finest beans, roasted fresh
              in-house every single day.
            </p>
            <p className="mt-4 text-white/60 leading-relaxed">
              We believe great coffee is more than a drink — it&apos;s a
              ritual, a moment of peace in a busy world.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Heart className="h-4 w-4" style={{ color: ACCENT }} />
                Fair Trade
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Leaf className="h-4 w-4" style={{ color: ACCENT }} />
                Organic
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Star className="h-4 w-4" style={{ color: ACCENT }} />
                Award Winning
              </div>
            </div>
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
            <div className="absolute -bottom-6 -left-6 hidden sm:block p-6 bg-[#120d0a] border border-white/10 rounded-sm">
              <p className="text-xs uppercase tracking-wider" style={{ color: ACCENT }}>
                Today&apos;s Special
              </p>
              <p className="text-sm text-white/80 mt-1">Honey Lavender Latte</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
