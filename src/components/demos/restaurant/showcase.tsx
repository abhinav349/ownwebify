import { PinnedShowcase } from "@/components/demos/shared/pinned-showcase";
import { img, demoImages } from "@/lib/demos/images";

export function Showcase() {
  const items = [
    { ...img(demoImages.restaurant.plate, 800, 75), title: "The Plate", caption: "Every course composed like a small painting" },
    { ...img(demoImages.restaurant.dish, 800, 75), title: "The Course", caption: "Chef-plated, course by course" },
    { ...img(demoImages.restaurant.moody, 800, 75), title: "The Craft", caption: "Technique honed over fifteen years" },
    { ...img(demoImages.restaurant.interior, 800, 75), title: "The Room", caption: "Candlelight, and an open kitchen beyond" },
  ];

  return (
    <PinnedShowcase
      eyebrow="Inside Saffron Table"
      title="A dining room built for occasion"
      items={items}
    />
  );
}
