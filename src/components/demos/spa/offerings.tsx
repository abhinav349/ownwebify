import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";

const ACCENT = "#9fb89a";

const treatments = [
  { name: "Deep Tissue Massage", duration: "60 / 90 min", price: "$140", desc: "Slow, firm pressure through the layers that hold tension longest." },
  { name: "Hot Stone Ritual", duration: "90 min", price: "$185", desc: "Basalt stones warmed to body temperature, worked along the spine and shoulders." },
  { name: "Botanical Facial", duration: "60 min", price: "$120", desc: "Cold-pressed oils and a lymphatic massage, finished with a clay mask." },
  { name: "Couples Retreat", duration: "2 hrs", price: "$390", desc: "Side-by-side treatment, private thermal suite, and tea on the terrace after." },
  { name: "Forest Bathing Walk", duration: "2 hrs", price: "$95", desc: "A guided, unhurried walk through the grounds. No phones, no talking required." },
  { name: "Full Day Reset", duration: "6 hrs", price: "$460", desc: "Three treatments, lunch, and unrestricted access to the pools and quiet rooms." },
];

export function Offerings() {
  return (
    <section id="treatments" className="py-28 md:py-36">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p className="eyebrow-demo">Treatment Menu</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-4xl md:text-5xl tracking-wide">What We Offer</h2>
          </Reveal>
        </div>
        <StaggerGroup className="space-y-1" stagger={0.06}>
          {treatments.map((treatment) => (
            <StaggerItem key={treatment.name}>
              <div className="flex items-center justify-between py-6 border-b border-white/10 group transition-colors hover:border-white/25">
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: `${ACCENT}cc` }}>
                    {treatment.duration}
                  </p>
                  <h3 className="font-display text-lg tracking-wide transition-colors group-hover:text-white">
                    {treatment.name}
                  </h3>
                  <p className="text-sm text-white/45 mt-1">{treatment.desc}</p>
                </div>
                <span className="font-display text-xl shrink-0 ml-6" style={{ color: ACCENT }}>
                  {treatment.price}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
