import Image from "next/image";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";
import { img, demoImages } from "@/lib/demos/images";
import { cn } from "@/lib/utils";

const source = [
  demoImages.photography.camera,
  demoImages.photography.lens,
  demoImages.photography.atWork,
  demoImages.photography.detail,
  demoImages.photography.hero,
  demoImages.photography.camera,
  demoImages.photography.lens,
  demoImages.photography.atWork,
];

const portfolio = [
  { title: "Golden Hour", category: "Portrait", tall: true },
  { title: "Urban Lines", category: "Architecture", tall: false },
  { title: "Silent Morning", category: "Landscape", tall: false },
  { title: "The Gaze", category: "Portrait", tall: true },
  { title: "Steel & Glass", category: "Architecture", tall: false },
  { title: "Midnight Bloom", category: "Still Life", tall: false },
  { title: "In Motion", category: "Editorial", tall: true },
  { title: "Reflections", category: "Landscape", tall: false },
];

export function Gallery() {
  return (
    <section id="portfolio" className="py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p className="eyebrow-demo">Selected Work</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-4xl md:text-5xl italic">The Portfolio</h2>
          </Reveal>
        </div>
        <StaggerGroup className="grid grid-cols-2 md:grid-cols-4 gap-4" stagger={0.05}>
          {portfolio.map((piece, i) => {
            const photo = img(source[i], 600, 75);
            return (
              <StaggerItem key={piece.title} className={cn(piece.tall && "md:row-span-2")}>
                <div className={cn("group relative overflow-hidden", piece.tall ? "aspect-[3/4] md:h-full" : "aspect-square")}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="hover-reveal-scrim absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                  <div className="hover-reveal absolute bottom-4 left-4">
                    <p className="text-[0.65rem] uppercase tracking-wider text-white/60">{piece.category}</p>
                    <p className="font-display italic text-lg text-white">{piece.title}</p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
