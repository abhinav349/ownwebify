import { PinnedShowcase } from "@/components/demos/shared/pinned-showcase";
import { img, demoImages } from "@/lib/demos/images";

export function Showcase() {
  const items = [
    { ...img(demoImages.clinic.hero, 800, 75), title: "Reception", caption: "Calm, unhurried, and easy to navigate" },
    { ...img(demoImages.clinic.corridor, 800, 75), title: "The Clinic", caption: "Clean, modern spaces throughout" },
    { ...img(demoImages.clinic.consult, 800, 75), title: "Consultation", caption: "Time to actually be heard" },
    { ...img(demoImages.clinic.interior, 800, 75), title: "Care Rooms", caption: "Comfort at every step of your visit" },
  ];

  return (
    <PinnedShowcase
      eyebrow="Inside CarePlus"
      title="A clinic built to feel calm"
      items={items}
    />
  );
}
