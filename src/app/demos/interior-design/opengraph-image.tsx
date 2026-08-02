import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-image";

export const alt = "Studio Loam - Interior Design website demo by OwnWebify";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    name: "Studio Loam",
    type: "Interior Design",
    accent: "#c9a87c",
    background: "#15120e",
    subtitle: "A live website demo, built by OwnWebify",
  });
}
