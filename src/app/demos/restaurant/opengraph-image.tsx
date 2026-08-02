import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-image";

export const alt = "Saffron Table - Fine Dining website demo by OwnWebify";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    name: "Saffron Table",
    type: "Fine Dining",
    accent: "#caa25a",
    background: "#1a0a0a",
    subtitle: "A live website demo, built by OwnWebify",
  });
}
