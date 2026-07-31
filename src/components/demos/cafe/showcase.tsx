import { PinnedShowcase } from "@/components/demos/shared/pinned-showcase";
import { img, demoImages } from "@/lib/demos/images";

export function Showcase() {
  const items = [
    { ...img(demoImages.cafe.interior, 800, 75), title: "The Roastery", caption: "Sunlit seating around our in-house roaster" },
    { ...img(demoImages.cafe.counter, 800, 75), title: "The Bar", caption: "Where every order becomes a small ceremony" },
    { ...img(demoImages.cafe.latteArt, 800, 75), title: "The Pour", caption: "Latte art finished tableside, cup by cup" },
    { ...img(demoImages.cafe.cup, 800, 75), title: "The Ritual", caption: "A quiet moment, however you take it" },
  ];

  return (
    <PinnedShowcase
      eyebrow="Inside Brew & Bean"
      title="A space built for slowing down"
      items={items}
    />
  );
}
