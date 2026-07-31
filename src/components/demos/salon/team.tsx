import Image from "next/image";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";
import { img, demoImages } from "@/lib/demos/images";

const team = [
  { name: "Priya K.", role: "Creative Director", specialty: "Color & Balayage" },
  { name: "Lena M.", role: "Senior Stylist", specialty: "Bridal & Updo" },
  { name: "Aisha R.", role: "Skin Specialist", specialty: "Facials & Peels" },
  { name: "Zoe T.", role: "Lash Artist", specialty: "Extensions & Brows" },
];

const ACCENT = "#e3aab4";

export function Team() {
  const photo = img(demoImages.salon.chair, 500, 70);

  return (
    <section id="team" className="py-28 md:py-36 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p className="eyebrow-demo">Meet the Experts</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Our Dream Team</h2>
          </Reveal>
        </div>
        <StaggerGroup className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto" stagger={0.08}>
          {team.map((member) => (
            <StaggerItem key={member.name} className="text-center group">
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
              <h3 className="font-display text-lg">{member.name}</h3>
              <p className="text-xs uppercase tracking-wider mt-0.5" style={{ color: ACCENT }}>
                {member.role}
              </p>
              <p className="text-xs text-white/40 mt-1">{member.specialty}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
