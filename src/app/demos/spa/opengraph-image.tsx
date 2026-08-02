import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-image";

export const alt = "Willow & Stone - Spa & Wellness website demo by OwnWebify";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    name: "Willow & Stone",
    type: "Spa & Wellness",
    accent: "#9fb89a",
    background: "#101410",
    subtitle: "A live website demo, built by OwnWebify",
  });
}
