import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/demos/shared/reveal";
import { Magnetic } from "@/components/demos/shared/magnetic";

export function DemoCta({
  id,
  eyebrow,
  title,
  subtitle,
  details,
  buttonLabel,
  accent,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  details: { icon: LucideIcon; text: string }[];
  buttonLabel: string;
  accent: string;
}) {
  return (
    <section id={id} className="relative py-28 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="eyebrow-demo">{eyebrow}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-balance">{title}</h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-6 text-white/60 leading-relaxed">{subtitle}</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-white/60">
            {details.map((detail) => (
              <div key={detail.text} className="flex items-center gap-2">
                <detail.icon className="h-4 w-4" style={{ color: accent }} />
                <span>{detail.text}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.28}>
          <Magnetic className="inline-block mt-10">
            <button
              className="px-12 py-5 font-medium tracking-wider uppercase text-sm rounded-sm transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: accent, color: "#0a0a0d" }}
            >
              {buttonLabel}
            </button>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
