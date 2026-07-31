import { PinnedShowcase } from "@/components/demos/shared/pinned-showcase";
import { img, demoImages } from "@/lib/demos/images";

export function Showcase() {
  const items = [
    { ...img(demoImages.ecommerce.editorial, 800, 75), title: "Summer 2026", caption: "42 pieces, effortless layering" },
    { ...img(demoImages.ecommerce.rack, 800, 75), title: "Resort Wear", caption: "28 pieces, warm-weather essentials" },
    { ...img(demoImages.ecommerce.hero, 800, 75), title: "Evening Edit", caption: "35 pieces, made for after dark" },
    { ...img(demoImages.ecommerce.shelf, 800, 75), title: "Essentials", caption: "56 pieces, the everyday uniform" },
  ];

  return (
    <PinnedShowcase
      eyebrow="Collections"
      title="Curated by season"
      items={items}
    />
  );
}
