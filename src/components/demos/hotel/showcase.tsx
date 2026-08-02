import { PinnedShowcase } from "@/components/demos/shared/pinned-showcase";
import { img, demoImages } from "@/lib/demos/images";

export function Showcase() {
  const items = [
    { ...img(demoImages.hotel.lobby, 800, 75), title: "The Lobby", caption: "Where arrivals slow to a stop" },
    { ...img(demoImages.hotel.pool, 800, 75), title: "The Bay Pool", caption: "Cut into the rock, open till late" },
    { ...img(demoImages.hotel.room, 800, 75), title: "The Rooms", caption: "Linen, light, and a view worth waking for" },
    { ...img(demoImages.hotel.exterior, 800, 75), title: "The Grounds", caption: "Olive groves down to the water" },
  ];

  return (
    <PinnedShowcase
      eyebrow="Inside Aurelia Bay"
      title="Fifty years of getting it quietly right"
      items={items}
    />
  );
}
