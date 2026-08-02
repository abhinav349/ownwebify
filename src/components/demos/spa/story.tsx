import Image from "next/image";
import { Reveal } from "@/components/demos/shared/reveal";
import { StatsRow } from "@/components/demos/shared/stats-row";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#9fb89a";

const stats = [
  { value: 14, label: "Years Open" },
  { value: 8, label: "Therapists" },
  { value: 3, label: "Thermal Pools" },
];

export function Story() {
  const photo = img(demoImages.spa.treatment, 900, 75);

  return (
    <section id="about" className="py-28 md:py-36 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <Reveal className="lg:order-2">
            <p className="eyebrow-demo">The Retreat</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight tracking-wide text-balance">
              Built around
              <br />
              <span style={{ color: ACCENT }}>doing less</span>
            </h2>
            <p className="mt-8 text-white/55 leading-relaxed">
              Willow &amp; Stone takes eighteen guests a day. Not because
              we couldn&apos;t take more, but because the whole point is
              that you never queue, never feel processed, and never hear a
              conversation you didn&apos;t want to be part of.
            </p>
            <p className="mt-4 text-white/55 leading-relaxed">
              Our therapists average eleven years of practice. Our products
              are made forty minutes from here. The rest is just warmth,
              water, and time.
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
            <div className="absolute -bottom-6 -right-6 hidden sm:block p-6 bg-[#101410] border border-white/10 rounded-sm">
              <p className="text-xs uppercase tracking-wider" style={{ color: ACCENT }}>
                Eighteen Guests
              </p>
              <p className="text-sm text-white/80 mt-1">Per day, by design</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
