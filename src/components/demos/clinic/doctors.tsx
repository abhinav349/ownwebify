import Image from "next/image";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#4fd1c5";

const doctors = [
  { name: "Dr. Sarah Mitchell", specialty: "Family Medicine", exp: "18 years" },
  { name: "Dr. Rajiv Patel", specialty: "Pediatrics", exp: "12 years" },
  { name: "Dr. Emily Chen", specialty: "Dentistry", exp: "10 years" },
  { name: "Dr. Michael Torres", specialty: "Orthopedics", exp: "15 years" },
];

export function Doctors() {
  const photo = img(demoImages.clinic.consult, 500, 70);

  return (
    <section id="team" className="py-28 md:py-36 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p className="eyebrow-demo">Meet the Team</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Our Physicians</h2>
          </Reveal>
        </div>
        <StaggerGroup className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto" stagger={0.08}>
          {doctors.map((doctor) => (
            <StaggerItem key={doctor.name} className="text-center group">
              <div className="relative aspect-square overflow-hidden rounded-sm mb-4">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="200px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
              <h3 className="font-display text-lg">{doctor.name}</h3>
              <p className="text-xs uppercase tracking-wider mt-0.5" style={{ color: ACCENT }}>
                {doctor.specialty}
              </p>
              <p className="text-xs text-white/40 mt-1">{doctor.exp} experience</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
