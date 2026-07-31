import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";

const ACCENT = "#d8d8d8";

const services = [
  { name: "Portrait Sessions", price: "From $500", desc: "Intimate, editorial-style portraits that capture your essence." },
  { name: "Commercial Work", price: "From $2,000", desc: "Brand photography, product shoots, and campaign imagery." },
  { name: "Wedding Coverage", price: "From $5,000", desc: "Full-day documentary coverage of your most important day." },
  { name: "Fine Art Prints", price: "From $300", desc: "Museum-quality prints from the archive collection." },
];

export function Offerings() {
  return (
    <section id="services" className="py-28 md:py-36 border-t border-white/10">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p className="eyebrow-demo">Services</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-4xl md:text-5xl italic">How We Can Work Together</h2>
          </Reveal>
        </div>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-6" stagger={0.08}>
          {services.map((service) => (
            <StaggerItem key={service.name}>
              <div className="p-8 border border-white/10 rounded-sm transition-colors hover:border-white/25">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl italic">{service.name}</h3>
                  <span className="text-sm" style={{ color: ACCENT }}>{service.price}</span>
                </div>
                <p className="mt-3 text-sm text-white/50 leading-relaxed">{service.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
