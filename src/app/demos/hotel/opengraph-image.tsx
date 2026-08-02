import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-image";

export const alt = "Aurelia Bay Resort - Boutique Hotel website demo by OwnWebify";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    name: "Aurelia Bay Resort",
    type: "Boutique Hotel",
    accent: "#e8a87c",
    background: "#14100d",
    subtitle: "A live website demo, built by OwnWebify",
  });
}
