import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";

const ACCENT = "#e3aab4";

const services = [
  { name: "Signature Blowout", duration: "45 min", price: "$75", desc: "Luxurious wash, conditioning treatment & styled blowout" },
  { name: "Balayage Color", duration: "3 hrs", price: "$250+", desc: "Hand-painted highlights for a natural, sun-kissed look" },
  { name: "Keratin Smoothing", duration: "2.5 hrs", price: "$300", desc: "Frizz-free, silky smooth hair for up to 3 months" },
  { name: "Bridal Styling", duration: "2 hrs", price: "$350", desc: "Trial included — your dream look for the perfect day" },
  { name: "Facial Rejuvenation", duration: "60 min", price: "$120", desc: "Deep cleanse, exfoliation, mask & LED therapy" },
  { name: "Lash Extensions", duration: "90 min", price: "$180", desc: "Full set of handcrafted mink lashes" },
];

export function Offerings() {
  return (
    <section id="services" className="py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p className="eyebrow-demo">Our Services</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Treatments You&apos;ll Love</h2>
          </Reveal>
        </div>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.07}>
          {services.map((service) => (
            <StaggerItem key={service.name}>
              <div className="h-full p-7 border border-white/10 rounded-sm transition-colors hover:border-white/25 group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[0.65rem] uppercase tracking-wider text-white/40">{service.duration}</span>
                  <span className="font-display text-lg" style={{ color: ACCENT }}>{service.price}</span>
                </div>
                <h3 className="font-display text-xl transition-colors group-hover:text-white">{service.name}</h3>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">{service.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
