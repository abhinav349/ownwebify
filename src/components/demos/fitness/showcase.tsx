import { PinnedShowcase } from "@/components/demos/shared/pinned-showcase";
import { img, demoImages } from "@/lib/demos/images";

export function Showcase() {
  const items = [
    { ...img(demoImages.fitness.equipment, 800, 75), title: "The Floor", caption: "Full free-weight rig, purpose-built" },
    { ...img(demoImages.fitness.workout, 800, 75), title: "The Work", caption: "Coached sets, every single rep" },
    { ...img(demoImages.fitness.dumbbells, 800, 75), title: "The Setup", caption: "Everything within arm's reach" },
    { ...img(demoImages.fitness.hero, 800, 75), title: "The Grind", caption: "Open 24/7, no excuses" },
  ];

  return (
    <PinnedShowcase
      eyebrow="Inside IronPulse"
      title="A gym built to be used hard"
      items={items}
    />
  );
}
