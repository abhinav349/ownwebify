import Image from "next/image";
import { Reveal } from "@/components/demos/shared/reveal";
import { StatsRow } from "@/components/demos/shared/stats-row";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#e8a87c";

const stats = [
  { value: 42, label: "Rooms" },
  { value: 50, suffix: "+", label: "Years on the Bay" },
  { value: 9, suffix: ".6", label: "Guest Rating" },
];

export function Story() {
  const photo = img(demoImages.hotel.pool, 900, 75);

  return (
    <section id="about" className="py-28 md:py-36 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <Reveal>
            <p className="eyebrow-demo">Our Story</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-balance">
              A family house that
              <br />
              <em className="italic" style={{ color: ACCENT }}>
                never stopped hosting
              </em>
            </h2>
            <p className="mt-8 text-white/60 leading-relaxed">
              Aurelia Bay began in 1974 as a summer house with six spare
              rooms and a standing invitation. Three generations later
              it&apos;s still run by the same family, and still built around
              the same idea: that a good stay is mostly about being left
              alone in beautiful surroundings, until the moment you&apos;d
              rather not be.
            </p>
            <p className="mt-4 text-white/60 leading-relaxed">
              Our kitchen cooks what the boats bring in. Our spa sits on the
              cliff edge. Nothing here is scaled up beyond what we can do
              properly.
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
            <div className="absolute -bottom-6 -left-6 hidden sm:block p-6 bg-[#14100d] border border-white/10 rounded-sm">
              <p className="text-xs uppercase tracking-wider" style={{ color: ACCENT }}>
                Direct Booking
              </p>
              <p className="text-sm text-white/80 mt-1">Best rate, no commission</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
