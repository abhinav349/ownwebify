import {
  renderDemoOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/demos/og-image";

export const alt = "Lens & Light - Photography Studio website demo by OwnWebify";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderDemoOgImage({
    name: "Lens & Light",
    type: "Photography Studio",
    accent: "#d8d8d8",
    background: "#0d0d0d",
  });
}
