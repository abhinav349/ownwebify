import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-image";

export const alt = "Lens & Light - Photography Studio website demo by OwnWebify";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    name: "Lens & Light",
    type: "Photography Studio",
    accent: "#d8d8d8",
    background: "#0d0d0d",
    subtitle: "A live website demo, built by OwnWebify",
  });
}
