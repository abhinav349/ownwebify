import { Building2, Users, Home, Gavel } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";

const ACCENT = "#9fb3c8";

const practiceAreas = [
  {
    name: "Corporate & Commercial",
    icon: Building2,
    desc: "Formation, contracts, M&A, shareholder disputes, and day-to-day counsel for growing businesses.",
  },
  {
    name: "Family Law",
    icon: Users,
    desc: "Divorce, custody, and settlement work handled with discretion and a firm eye on what comes after.",
  },
  {
    name: "Real Estate",
    icon: Home,
    desc: "Residential and commercial transactions, title disputes, leases, and development agreements.",
  },
  {
    name: "Civil Litigation",
    icon: Gavel,
    desc: "Trial-ready representation in contract, employment, and professional negligence matters.",
  },
];

export function Offerings() {
  return (
    <section id="practice" className="py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p className="eyebrow-demo">What We Do</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Practice Areas</h2>
          </Reveal>
        </div>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-5" stagger={0.08}>
          {practiceAreas.map((area) => (
            <StaggerItem key={area.name}>
              <div className="h-full p-8 border border-white/10 rounded-sm transition-colors hover:border-white/25 group">
                <area.icon
                  className="h-6 w-6 mb-4 transition-transform group-hover:-translate-y-0.5"
                  style={{ color: ACCENT }}
                />
                <h3 className="font-display text-2xl">{area.name}</h3>
                <p className="mt-3 text-sm text-white/50 leading-relaxed">{area.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
