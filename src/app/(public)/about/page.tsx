import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, Clock, Code2, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "About Abhi - Freelance Web Developer in Bengaluru, India",
  description:
    "Affordable freelance web developer with 3+ years of experience. Specializing in React, Next.js, and modern web development. Based in Bengaluru, India. Serving clients worldwide.",
  openGraph: {
    title: "About Abhi - Freelance Web Developer",
    description:
      "Full-stack developer building affordable, high-performance websites for businesses worldwide.",
    url: "https://ownwebify.com/about",
  },
};

const stats = [
  { icon: Code2, label: "Projects Delivered", value: "10+" },
  { icon: Clock, label: "Years Experience", value: "3+" },
  { icon: Award, label: "Technologies Mastered", value: "12+" },
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

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      <PersonJsonLd />

      {/* Hero */}
      <section className="relative py-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-card/80 text-sm font-medium mb-6">
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
              <Link href="/hire">
                <Button size="lg" className="rounded-full shadow-lg shadow-primary/25">
                  Work With Me <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/10 via-pink-500/5 to-amber-500/10 border p-1">
                <div className="h-full w-full rounded-[1.3rem] bg-card flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
                      <Code2 className="h-16 w-16 text-white" />
                    </div>
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
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-2xl border bg-card hover-lift">
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-secondary/20 to-background" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              My Values
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              What I Stand For
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="p-8 rounded-2xl border bg-card hover-lift"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              How I Work
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Process
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              A structured approach that ensures quality and keeps you in the loop at every step.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
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
            ].map((step, index) => (
              <div key={step.title} className="flex gap-6 items-start">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-pink-500 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-lg shadow-primary/20">
                    {index + 1}
                  </div>
                  {index < 4 && (
                    <div className="w-0.5 h-full min-h-[3rem] bg-gradient-to-b from-primary/30 to-transparent mt-2" />
                  )}
                </div>
                <div className="pb-6 pt-2">
                  <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-secondary/20 to-background" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              Tools I Use
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Modern Tech Stack
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-5 py-2.5 rounded-full bg-card border text-sm font-medium hover-lift cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/5 via-card to-pink-500/5 border">
            <Sparkles className="h-10 w-10 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold tracking-tight">
              Let&apos;s Build Something Amazing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Have a project in mind? I&apos;d love to hear about it. Let&apos;s turn your
              vision into reality.
            </p>
            <Link href="/hire" className="inline-block mt-8">
              <Button size="xl" className="rounded-full shadow-lg shadow-primary/25">
                Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
