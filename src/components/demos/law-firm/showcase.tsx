import { PinnedShowcase } from "@/components/demos/shared/pinned-showcase";
import { img, demoImages } from "@/lib/demos/images";

export function Showcase() {
  const items = [
    { ...img(demoImages.lawFirm.desk, 800, 75), title: "Preparation", caption: "Every matter worked as if it's going to trial" },
    { ...img(demoImages.lawFirm.library, 800, 75), title: "Research", caption: "Arguments built on the record, not on bluster" },
    { ...img(demoImages.lawFirm.meeting, 800, 75), title: "Resolution", caption: "94% settled before a courtroom is needed" },
    { ...img(demoImages.lawFirm.hero, 800, 75), title: "The Practice", caption: "Downtown offices, open since 1988" },
  ];

  return (
    <PinnedShowcase
      eyebrow="How We Work"
      title="Method over theatrics"
      items={items}
    />
  );
}
