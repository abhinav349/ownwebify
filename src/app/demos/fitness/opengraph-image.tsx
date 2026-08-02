import {
  renderDemoOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/demos/og-image";

export const alt = "IronPulse - Gym & Fitness website demo by OwnWebify";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderDemoOgImage({
    name: "IronPulse",
    type: "Gym & Fitness",
    accent: "#b6ff3c",
    background: "#0b0c09",
  });
}
