import Image from "next/image";
import { Reveal } from "@/components/demos/shared/reveal";
import { StatsRow } from "@/components/demos/shared/stats-row";
import { img, demoImages } from "@/lib/demos/images";

const ACCENT = "#9fb3c8";

const stats = [
  { value: 37, label: "Years Practising" },
  { value: 1200, suffix: "+", label: "Matters Handled" },
  { value: 94, suffix: "%", label: "Resolved Pre-Trial" },
];

export function Story() {
  const photo = img(demoImages.lawFirm.library, 900, 75);

  return (
    <section id="about" className="py-28 md:py-36 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <Reveal className="lg:order-2">
            <p className="eyebrow-demo">The Firm</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-balance">
              Plain answers to
              <br />
              <em className="italic" style={{ color: ACCENT }}>
                complicated questions
              </em>
            </h2>
            <p className="mt-8 text-white/55 leading-relaxed">
              Whitmore &amp; Cole was founded in 1988 on a straightforward
              premise: clients deserve to understand their own position.
              We&apos;ll tell you plainly what your options are, what each
              one is likely to cost, and which one we&apos;d choose in your
              place.
            </p>
            <p className="mt-4 text-white/55 leading-relaxed">
              Most of our matters resolve before trial. When they don&apos;t,
              we&apos;re prepared - and the other side knows it.
            </p>
            <div className="mt-12">
              <StatsRow stats={stats} accent={ACCENT} />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="relative lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden sm:block p-6 bg-[#0d1117] border border-white/10 rounded-sm">
              <p className="text-xs uppercase tracking-wider" style={{ color: ACCENT }}>
                First Consultation
              </p>
              <p className="text-sm text-white/80 mt-1">Always free, always candid</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
