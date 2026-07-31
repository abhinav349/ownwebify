import Image from "next/image";
import { Reveal } from "@/components/demos/shared/reveal";
import { StatsRow } from "@/components/demos/shared/stats-row";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#4fd1c5";

const stats = [
  { value: 25, suffix: "K+", label: "Patients Treated" },
  { value: 30, suffix: "+", label: "Specialists" },
  { value: 98, suffix: "%", label: "Would Recommend" },
];

export function Story() {
  const photo = img(demoImages.clinic.interior, 900, 75);

  return (
    <section id="about" className="py-28 md:py-36 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <Reveal>
            <p className="eyebrow-demo">Why CarePlus</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-balance">
              Healthcare that
              <br />
              <span style={{ color: ACCENT }}>listens first</span>
            </h2>
            <p className="mt-8 text-white/60 leading-relaxed">
              CarePlus was founded on the idea that good medicine starts with
              being genuinely heard. Our physicians take the time patients
              actually need — no rushed visits, no guesswork.
            </p>
            <p className="mt-4 text-white/60 leading-relaxed">
              With on-site diagnostics, same-day appointments, and a team
              spanning family medicine to physiotherapy, we&apos;re built to
              be your one call for care.
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
            <div className="absolute -bottom-6 -left-6 hidden sm:block p-6 bg-[#0a1210] border border-white/10 rounded-sm">
              <p className="text-xs uppercase tracking-wider" style={{ color: ACCENT }}>
                Same-Day Visits
              </p>
              <p className="text-sm text-white/80 mt-1">Most requests seen within hours</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
