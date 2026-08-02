import { PinnedShowcase } from "@/components/demos/shared/pinned-showcase";
import { img, demoImages } from "@/lib/demos/images";

export function Showcase() {
  const items = [
    { ...img(demoImages.spa.treatment, 800, 75), title: "The Treatment Rooms", caption: "Warm stone, low light, no clocks" },
    { ...img(demoImages.spa.candles, 800, 75), title: "The Quiet Room", caption: "Where nobody will ask you anything" },
    { ...img(demoImages.spa.relax, 800, 75), title: "The Pools", caption: "Three temperatures, open all day" },
    { ...img(demoImages.spa.detail, 800, 75), title: "The Products", caption: "Made forty minutes from here" },
  ];

  return (
    <PinnedShowcase
      eyebrow="Inside Willow & Stone"
      title="A place designed to be unhurried"
      items={items}
    />
  );
}
