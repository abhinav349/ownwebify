import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";
import { Magnetic } from "@/components/demos/shared/magnetic";

const ACCENT = "#c8873f";

const menu = [
  { name: "Ethiopian Single Origin", category: "Pour Over", price: "$5.50", desc: "Fruity, bright, with notes of blueberry and jasmine" },
  { name: "Artisan Pour Over", category: "Pour Over", price: "$6.50", desc: "Hand-poured, single origin, brewed fresh to order" },
  { name: "Caramel Oat Latte", category: "Espresso", price: "$6.00", desc: "Smooth double shot with oat milk & house caramel" },
  { name: "Cold Brew Flight", category: "Cold Brew", price: "$8.00", desc: "Three house-made cold brews to explore side by side" },
  { name: "Honey Lavender Latte", category: "Espresso", price: "$6.25", desc: "Floral lavender syrup with raw honey sweetness" },
  { name: "Matcha Ceremony", category: "Tea", price: "$5.75", desc: "Ceremonial grade matcha, hand whisked to order" },
];

export function Offerings() {
  return (
    <section id="menu" className="py-28 md:py-36">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p className="eyebrow-demo">Crafted With Intention</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">The Menu</h2>
          </Reveal>
        </div>
        <StaggerGroup className="space-y-1" stagger={0.06}>
          {menu.map((item) => (
            <StaggerItem key={item.name}>
              <div className="flex items-center justify-between py-6 border-b border-white/10 group transition-colors hover:border-white/25">
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: `${ACCENT}cc` }}>
                    {item.category}
                  </p>
                  <h3 className="font-display text-lg transition-colors group-hover:text-white">
                    {item.name}
                  </h3>
                  <p className="text-sm text-white/40 mt-1">{item.desc}</p>
                </div>
                <span className="font-display text-xl shrink-0 ml-6" style={{ color: ACCENT }}>
                  {item.price}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
        <div className="mt-12 text-center">
          <Magnetic className="inline-block">
            <button className="px-10 py-4 border border-white/15 text-sm tracking-wider uppercase hover:border-white/30 transition-colors rounded-sm">
              Full Menu &amp; Seasonal Drinks
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
