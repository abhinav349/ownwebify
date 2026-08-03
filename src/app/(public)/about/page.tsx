import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, Clock, Code2, Sparkles, Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { PersonJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { CountUp } from "@/components/shared/count-up";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";
import { Magnetic } from "@/components/demos/shared/magnetic";
import { LazyHeroCanvas as HeroCanvas } from "@/components/demos/three/lazy-hero-canvas";

export const metadata: Metadata = {
  title: "About Abhi - Freelance Web Developer in Bengaluru, India",
  description:
    "Affordable freelance web developer with 3+ years of experience. Specializing in React, Next.js, and modern web development. Based in Bengaluru, India. Serving clients worldwide.",
  alternates: { canonical: "https://ownwebify.com/about" },
  openGraph: {
    title: "About Abhi - Freelance Web Developer",
    description:
      "Full-stack developer building affordable, high-performance websites for businesses worldwide.",
    url: "https://ownwebify.com/about",
  },
};

const stats = [
  { icon: Code2, prefix: "", value: 10, suffix: "+", label: "Projects Delivered" },
  { icon: Clock, prefix: "", value: 3, suffix: "+", label: "Years Experience" },
  { icon: Award, prefix: "", value: 12, suffix: "+", label: "Technologies Mastered" },
];

const techStack = [
  "React", "Next.js", "TypeScript", "Node.js",
  "PostgreSQL", "MongoDB", "Tailwind CSS", "Prisma",
  "AWS", "Vercel", "Docker", "GraphQL",
];

const values = [
  {
    title: "Craft Over Speed",
    description: "I never rush. Every line of code, every design decision is intentional and purposeful.",
  },
  {
    title: "Transparency First",
    description: "No hidden fees, no surprise scope changes. You always know exactly where things stand.",
  },
  {
    title: "Results-Driven",
    description: "Beautiful design is great, but I measure success by the results your business gets.",
  },
  {
    title: "Partnership Mindset",
    description: "I don't just build and leave. I'm invested in your long-term success.",
  },
];

const journey = [
  {
    title: "Discovery & Strategy",
    description: "Deep dive into your goals, audience, and competitors. I research your market to inform every decision.",
  },
  {
    title: "Design & Prototyping",
    description: "Visual mockups and interactive prototypes so you can see and feel your site before any code is written.",
  },
  {
    title: "Development",
    description: "Clean, performant code built with modern frameworks. Regular demos keep you updated on progress.",
  },
  {
    title: "Testing & Optimization",
    description: "Rigorous testing across devices. Performance tuning to ensure lightning-fast load times.",
  },
  {
    title: "Launch & Growth",
    description: "Smooth deployment with monitoring. 30 days of free post-launch support included.",
  },
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      <PersonJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://ownwebify.com" },
          { name: "About", url: "https://ownwebify.com/about" },
        ]}
      />

      {/* Hero */}
      <section className="relative py-24">
        <div className="aurora-bg opacity-40">
          <div className="aurora-layer" />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border glass text-sm font-medium mb-6">
                <Heart className="h-4 w-4 text-pink-500" />
                Passionate about the craft
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
                Hi, I&apos;m{" "}
                <span className="gradient-text">Abhi</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                A full-stack developer who believes great websites should do more
                than look good — they should drive real business results.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Over the past 3 years, I&apos;ve helped businesses transform their
                online presence. From scrappy startups to growing companies,
                I bring the same obsessive attention to detail and commitment to
                excellence to every project.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                I specialize in high-performance web applications using React, Next.js,
                and Node.js — with a keen eye for design that converts.
              </p>
              <Magnetic strength={0.3} className="inline-block">
                <Link
                  href="/hire"
                  className={cn(buttonVariants({ size: "lg" }), "rounded-full shadow-lg shadow-primary/25")}
                >
                  Work With Me <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Magnetic>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="relative aspect-square rounded-3xl glass border p-1 overflow-hidden">
                <div className="relative h-full w-full rounded-[1.3rem] overflow-hidden bg-card">
                  <div className="absolute inset-0">
                    <HeroCanvas variant="orb" color="#6d28d9" />
                  </div>
                  <div className="relative z-10 h-full w-full flex items-center justify-center">
                    <div className="text-center p-8 rounded-2xl glass border">
                      <p className="text-xl font-bold">Abhi</p>
                      <p className="text-muted-foreground mt-1">Full-Stack Developer</p>
                      <p className="text-sm text-muted-foreground mt-1">Bengaluru, India</p>
                      <div className="flex items-center justify-center gap-1 mt-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-1.5 w-8 rounded-full bg-gradient-to-r from-primary to-pink-500" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8" stagger={0.1}>
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center p-6 rounded-2xl border glass hover-lift">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold gradient-text tabular-nums">
                    <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-secondary/20 to-background" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              My Values
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              What I Stand For
            </h2>
          </Reveal>
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto" stagger={0.1}>
            {values.map((value, index) => (
              <StaggerItem key={value.title}>
                <SpotlightCard className="h-full p-8 rounded-2xl border glass hover-lift">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Journey / Process Timeline */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              How I Work
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Process
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              A structured approach that ensures quality and keeps you in the loop at every step.
            </p>
          </Reveal>
          <div className="max-w-3xl mx-auto space-y-2">
            {journey.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.05}>
                <div className="flex gap-6 items-start group">
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-pink-500 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-110">
                      {index + 1}
                    </div>
                    {index < journey.length - 1 && (
                      <div className="w-0.5 h-full min-h-[3rem] bg-gradient-to-b from-primary/30 to-transparent mt-2" />
                    )}
                  </div>
                  <div className="pb-6 pt-2">
                    <h3 className="text-lg font-semibold mb-1 transition-colors group-hover:text-primary">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-secondary/20 to-background" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              Tools I Use
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Modern Tech Stack
            </h2>
          </Reveal>
          <StaggerGroup className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto" stagger={0.03}>
            {techStack.map((tech) => (
              <StaggerItem key={tech} y={12}>
                <Magnetic strength={0.15}>
                  <span className="inline-block px-5 py-2.5 rounded-full glass border text-sm font-medium hover-lift cursor-default">
                    {tech}
                  </span>
                </Magnetic>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <Reveal>
            <div className="relative p-12 rounded-3xl glass border overflow-hidden">
              <div className="aurora-bg opacity-30">
                <div className="aurora-layer" />
              </div>
              <div className="relative z-10">
                <Sparkles className="h-10 w-10 text-primary mx-auto mb-6" />
                <h2 className="text-3xl font-bold tracking-tight">
                  Let&apos;s Build Something Amazing
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                  Have a project in mind? I&apos;d love to hear about it. Let&apos;s turn your
                  vision into reality.
                </p>
                <Magnetic strength={0.3} className="inline-block mt-8">
                  <Link
                    href="/hire"
                    className={cn(buttonVariants({ size: "xl" }), "rounded-full shadow-lg shadow-primary/25")}
                  >
                    Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Magnetic>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
