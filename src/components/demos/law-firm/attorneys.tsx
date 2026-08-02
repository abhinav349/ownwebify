import Image from "next/image";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#9fb3c8";

const attorneys = [
  { name: "Eleanor Whitmore", role: "Founding Partner", focus: "Corporate & M&A" },
  { name: "David Cole", role: "Founding Partner", focus: "Civil Litigation" },
  { name: "Priya Raghunathan", role: "Senior Associate", focus: "Family Law" },
  { name: "Marcus Bell", role: "Associate", focus: "Real Estate" },
];

export function Attorneys() {
  const photo = img(demoImages.lawFirm.consult, 500, 70);

  return (
    <section id="team" className="py-28 md:py-36 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p className="eyebrow-demo">Who You&apos;ll Work With</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Our Attorneys</h2>
          </Reveal>
        </div>
        <StaggerGroup className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto" stagger={0.08}>
          {attorneys.map((person) => (
            <StaggerItem key={person.name} className="text-center group">
              <div className="relative aspect-square overflow-hidden rounded-sm mb-4">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="200px"
                  className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
              <h3 className="font-display text-lg">{person.name}</h3>
              <p className="text-xs uppercase tracking-wider mt-0.5" style={{ color: ACCENT }}>
                {person.role}
              </p>
              <p className="text-xs text-white/40 mt-1">{person.focus}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
