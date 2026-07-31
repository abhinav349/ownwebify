import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";
import { Magnetic } from "@/components/demos/shared/magnetic";

const ACCENT = "#caa25a";

const courses = [
  { name: "Truffle Burrata", category: "Starter", price: "$22", desc: "Heirloom tomatoes & aged balsamic" },
  { name: "Pan-Seared Scallops", category: "Starter", price: "$24", desc: "Cauliflower purée, pancetta crisp, lemon oil" },
  { name: "Saffron Risotto", category: "Main", price: "$34", desc: "Arborio rice, wild mushrooms, parmigiano" },
  { name: "Wagyu Tenderloin", category: "Main", price: "$58", desc: "A5 grade, miso-glazed, seasonal vegetables" },
  { name: "Dark Chocolate Fondant", category: "Dessert", price: "$18", desc: "Molten center, vanilla bean gelato" },
  { name: "Crème Brûlée", category: "Dessert", price: "$16", desc: "Tahitian vanilla, caramelized sugar" },
];

export function Offerings() {
  return (
    <section id="menu" className="py-28 md:py-36">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p className="eyebrow-demo">Curated Selection</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Tasting Menu</h2>
          </Reveal>
        </div>
        <StaggerGroup className="space-y-1" stagger={0.06}>
          {courses.map((item) => (
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
              Full Menu &amp; Wine List
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
