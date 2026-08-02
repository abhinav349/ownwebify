import {
  renderDemoOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/demos/og-image";

export const alt = "Aurelia Bay Resort - Boutique Hotel website demo by OwnWebify";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderDemoOgImage({
    name: "Aurelia Bay Resort",
    type: "Boutique Hotel",
    accent: "#e8a87c",
    background: "#14100d",
  });
}
