import { Reveal } from "@/components/demos/shared/reveal";

const stack = [
  "React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Prisma",
  "MongoDB", "Tailwind CSS", "GSAP", "Three.js", "Docker", "AWS",
];

export function TechStackSection() {
  const loop = [...stack, ...stack];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Under the Hood
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Built With a{" "}
            <span className="gradient-text">Modern Tech Stack</span>
          </h2>
        </Reveal>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />
        <div className="flex w-max marquee-track">
          {loop.map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="mx-3 px-6 py-3 rounded-full border glass text-sm font-medium whitespace-nowrap hover-lift"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
