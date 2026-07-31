import Image from "next/image";
import { Award } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";
import { StatsRow } from "@/components/demos/shared/stats-row";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#d8d8d8";

const stats = [
  { value: 12, suffix: "+", label: "Years Shooting" },
  { value: 40, suffix: "+", label: "Countries" },
  { value: 300, suffix: "+", label: "Publications" },
];

const awards = [
  "International Photography Awards 2025",
  "Hasselblad Masters Finalist",
  "Vogue Italia Featured Artist",
  "National Geographic Contributor",
];

export function Story() {
  const photo = img(demoImages.photography.atWork, 900, 75);

  return (
    <section id="about" className="py-28 md:py-36 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <Reveal>
            <p className="eyebrow-demo">The Photographer</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight italic text-balance">
              Twelve years behind the lens
            </h2>
            <p className="mt-8 text-white/50 leading-relaxed">
              Lens &amp; Light is the studio of a working photographer whose
              editorial and commercial work has taken her across forty
              countries — always chasing the same thing: a frame that holds
              still long enough to mean something.
            </p>
            <div className="mt-8">
              <StaggerGroup className="space-y-2" stagger={0.06}>
                {awards.map((award) => (
                  <StaggerItem key={award}>
                    <div className="flex items-center gap-2.5 text-sm text-white/60">
                      <Award className="h-3.5 w-3.5 shrink-0" style={{ color: ACCENT }} />
                      {award}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
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
                className="object-cover grayscale"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
