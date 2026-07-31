import { PinnedShowcase } from "@/components/demos/shared/pinned-showcase";
import { img, demoImages } from "@/lib/demos/images";

export function Showcase() {
  const items = [
    { ...img(demoImages.realEstate.exterior, 800, 75), title: "Downtown", caption: "Skyline views, minutes from everything" },
    { ...img(demoImages.realEstate.living, 800, 75), title: "Upper East Side", caption: "Prewar character, modern comfort" },
    { ...img(demoImages.realEstate.lounge, 800, 75), title: "Hudson Valley", caption: "Space to breathe, an hour from the city" },
    { ...img(demoImages.realEstate.hero, 800, 75), title: "Waterfront", caption: "Where the skyline meets the water" },
  ];

  return (
    <PinnedShowcase
      eyebrow="By Neighborhood"
      title="Every address, considered"
      items={items}
    />
  );
}
