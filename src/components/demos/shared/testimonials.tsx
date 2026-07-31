import { Star } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";

export type Testimonial = {
  text: string;
  author: string;
  rating: number;
};

export function Testimonials({
  id,
  eyebrow,
  title,
  items,
  accent,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  items: Testimonial[];
  accent: string;
}) {
  return (
    <section id={id} className="py-28 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p className="eyebrow-demo">{eyebrow}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">{title}</h2>
          </Reveal>
        </div>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8" stagger={0.1}>
          {items.map((item) => (
            <StaggerItem key={item.author}>
              <div className="h-full p-8 border border-white/10 rounded-sm transition-colors hover:border-white/20">
                <div className="flex gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4" style={{ fill: accent, color: accent }} />
                  ))}
                </div>
                <p className="font-display italic text-lg leading-relaxed text-white/80">
                  &ldquo;{item.text}&rdquo;
                </p>
                <p className="mt-6 text-xs uppercase tracking-wider" style={{ color: accent }}>
                  — {item.author}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
