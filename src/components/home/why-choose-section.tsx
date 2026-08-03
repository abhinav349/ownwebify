import { Code2, Palette, Rocket, Shield, Zap, Globe } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";
import { SpotlightCard } from "@/components/shared/spotlight-card";

const features = [
  {
    icon: Code2,
    title: "Modern Tech Stack",
    description: "React, Next.js, TypeScript — built with the latest tools for peak performance and scalability.",
  },
  {
    icon: Palette,
    title: "Award-Worthy Design",
    description: "Every pixel is intentional. Designs that captivate users and convert visitors into customers.",
  },
  {
    icon: Rocket,
    title: "Lightning Fast",
    description: "Sub-second load times and perfect Core Web Vitals. Your site will fly.",
  },
  {
    icon: Shield,
    title: "Rock-Solid Security",
    description: "Enterprise-grade security with SSL, secure authentication, and best practices built in.",
  },
  {
    icon: Zap,
    title: "SEO Optimized",
    description: "Built-in SEO best practices that help you rank higher and get discovered by your audience.",
  },
  {
    icon: Globe,
    title: "Direct Support",
    description: "Work directly with the person building your site — no account managers, no middlemen.",
  },
];

export function WhyChooseSection() {
  return (
    <section className="py-24 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Why Choose Us
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Budget-Friendly Web Development{" "}
            <span className="gradient-text">Without Compromise</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Every project includes modern tech, fast performance, and dedicated support.
          </p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.08}>
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <SpotlightCard className="h-full rounded-2xl border glass p-8 hover-lift">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/10 to-pink-500/10 flex items-center justify-center mb-5">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
