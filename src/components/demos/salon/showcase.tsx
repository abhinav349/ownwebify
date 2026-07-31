import { PinnedShowcase } from "@/components/demos/shared/pinned-showcase";
import { img, demoImages } from "@/lib/demos/images";

export function Showcase() {
  const items = [
    { ...img(demoImages.salon.hero, 800, 75), title: "The Studio", caption: "Light-filled chairs, considered down to the last detail" },
    { ...img(demoImages.salon.spa, 800, 75), title: "The Ritual", caption: "Slow treatments, unhurried and hands-on" },
    { ...img(demoImages.salon.nails, 800, 75), title: "The Finish", caption: "Detail work that makes the difference" },
    { ...img(demoImages.salon.styling, 800, 75), title: "The Craft", caption: "Stylists trained to listen first, style second" },
  ];

  return (
    <PinnedShowcase
      eyebrow="Inside Glow Studio"
      title="A sanctuary built for you"
      items={items}
    />
  );
}
