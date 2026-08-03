import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";

export async function TestimonialsSection() {
  // An unreachable database must not take the homepage down with it. Neon
  // suspends idle instances, so a cold start or a network blip here would
  // otherwise throw during render and drop every section of the page — the
  // marketing site is worth far more than this one optional block.
  let testimonials: Awaited<ReturnType<typeof prisma.testimonial.findMany>> = [];
  try {
    testimonials = await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 9,
    });
  } catch (error) {
    console.error("Failed to load testimonials:", error);
    return null;
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Client Stories
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            What Clients{" "}
            <span className="gradient-text">Are Saying</span>
          </h2>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.08}>
          {testimonials.map((t) => (
            <StaggerItem key={t.id}>
              <div className="h-full rounded-2xl border glass p-8 hover-lift flex flex-col">
                {t.rating && (
                  <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  {t.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin-supplied avatar URLs can be on any host, not just the configured remotePatterns
                    <img
                      src={t.avatarUrl}
                      alt={t.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
