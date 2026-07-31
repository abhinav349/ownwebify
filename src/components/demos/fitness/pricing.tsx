import { Check } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";
import { Magnetic } from "@/components/demos/shared/magnetic";
import { cn } from "@/lib/utils";

const ACCENT = "#b6ff3c";

const plans = [
  {
    name: "Starter",
    price: "$29",
    features: ["Full gym access", "Locker room", "Free WiFi", "1 PT session / month"],
    popular: false,
  },
  {
    name: "Pro",
    price: "$59",
    features: ["Everything in Starter", "Unlimited classes", "Nutrition plan", "4 PT sessions / month", "Sauna & steam"],
    popular: true,
  },
  {
    name: "Elite",
    price: "$99",
    features: ["Everything in Pro", "Personal trainer", "Recovery zone", "Guest passes", "Priority booking"],
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-28 md:py-36 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p className="eyebrow-demo">Membership</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-4xl md:text-6xl uppercase">Pick Your Plan</h2>
          </Reveal>
        </div>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.08}>
          {plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <div
                className={cn(
                  "h-full flex flex-col p-8 rounded-sm border transition-colors",
                  plan.popular ? "border-[var(--accent)] bg-white/[0.03]" : "border-white/10 hover:border-white/25"
                )}
              >
                {plan.popular && (
                  <span
                    className="self-start mb-4 text-[0.65rem] uppercase tracking-wider px-3 py-1 rounded-full"
                    style={{ backgroundColor: ACCENT, color: "#0b0c09" }}
                  >
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-2xl uppercase">{plan.name}</h3>
                <p className="mt-2">
                  <span className="font-display text-4xl" style={{ color: ACCENT }}>{plan.price}</span>
                  <span className="text-white/40 text-sm"> /month</span>
                </p>
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-white/60">
                      <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: ACCENT }} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Magnetic className="mt-8 block">
                  <button
                    className={cn(
                      "w-full py-3.5 text-sm font-semibold uppercase tracking-wider rounded-sm transition-transform hover:scale-[1.02]",
                      plan.popular ? "" : "border border-white/20 text-white"
                    )}
                    style={plan.popular ? { backgroundColor: ACCENT, color: "#0b0c09" } : undefined}
                  >
                    Join {plan.name}
                  </button>
                </Magnetic>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
