import { PinnedShowcase } from "@/components/demos/shared/pinned-showcase";
import { img, demoImages } from "@/lib/demos/images";

export function Showcase() {
  const items = [
    { ...img(demoImages.interiorDesign.hero, 800, 75), title: "Fenwick House", caption: "Full interior, 1930s semi-detached" },
    { ...img(demoImages.interiorDesign.furniture, 800, 75), title: "Aldgate Loft", caption: "Warehouse conversion, bespoke joinery throughout" },
    { ...img(demoImages.interiorDesign.architecture, 800, 75), title: "Marlowe Residence", caption: "New build, lime plaster and white oak" },
    { ...img(demoImages.interiorDesign.detail, 800, 75), title: "The Detail", caption: "Unlacquered brass, left to age honestly" },
  ];

  return (
    <PinnedShowcase
      eyebrow="Selected Projects"
      title="Work that ages well"
      items={items}
    />
  );
}
