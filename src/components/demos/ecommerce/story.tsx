import Image from "next/image";
import { Reveal } from "@/components/demos/shared/reveal";
import { StatsRow } from "@/components/demos/shared/stats-row";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#e8e6e1";

const stats = [
  { value: 4, label: "Collections / Year" },
  { value: 100, suffix: "%", label: "Natural Fibers" },
  { value: 30, label: "Countries Shipped" },
];

export function Story() {
  const photo = img(demoImages.ecommerce.boutique, 900, 75);

  return (
    <section id="about" className="py-28 md:py-36 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <Reveal>
            <p className="eyebrow-demo">Our Story</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-balance">
              Made to be worn,
              <br />
              not replaced
            </h2>
            <p className="mt-8 text-white/50 leading-relaxed">
              Velvet &amp; Thread was founded on a simple principle: fewer,
              better things. Every piece is cut from natural fibers, finished
              by hand, and built to outlast trends.
            </p>
            <p className="mt-4 text-white/50 leading-relaxed">
              We work with a small number of ateliers, keeping runs
              deliberately limited so nothing feels mass-produced — because
              it isn&apos;t.
            </p>
            <div className="mt-12">
              <StatsRow stats={stats} accent={ACCENT} />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
