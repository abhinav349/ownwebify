import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-image";

export const alt = "Brew & Bean - Coffee Shop website demo by OwnWebify";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    name: "Brew & Bean",
    type: "Coffee Shop",
    accent: "#c8873f",
    background: "#120d0a",
    subtitle: "A live website demo, built by OwnWebify",
  });
}
