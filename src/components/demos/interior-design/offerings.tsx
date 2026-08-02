import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";

const ACCENT = "#c9a87c";

const services = [
  {
    name: "Full Home Design",
    scope: "12-20 weeks",
    from: "From $18,000",
    desc: "Concept through installation - layouts, materials, joinery, furniture, styling, and site supervision.",
  },
  {
    name: "Space Planning",
    scope: "3-5 weeks",
    from: "From $4,500",
    desc: "Measured drawings and a resolved floor plan for how a space should actually work before you build.",
  },
  {
    name: "Renovation Consulting",
    scope: "Hourly / retainer",
    from: "From $220/hr",
    desc: "Material and trade guidance alongside your builder, so decisions get made before they get expensive.",
  },
  {
    name: "Styling & Sourcing",
    scope: "2-4 weeks",
    from: "From $3,200",
    desc: "Furniture, art, and object sourcing for a room that's structurally done but doesn't yet feel finished.",
  },
];

export function Offerings() {
  return (
    <section id="services" className="py-28 md:py-36">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p className="eyebrow-demo">How We Work Together</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Services</h2>
          </Reveal>
        </div>
        <StaggerGroup className="space-y-1" stagger={0.07}>
          {services.map((service) => (
            <StaggerItem key={service.name}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-7 border-b border-white/10 group transition-colors hover:border-white/25">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: `${ACCENT}cc` }}>
                    {service.scope}
                  </p>
                  <h3 className="font-display text-2xl transition-colors group-hover:text-white">
                    {service.name}
                  </h3>
                  <p className="text-sm text-white/45 mt-2 max-w-xl leading-relaxed">{service.desc}</p>
                </div>
                <span className="font-display text-lg shrink-0" style={{ color: ACCENT }}>
                  {service.from}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
