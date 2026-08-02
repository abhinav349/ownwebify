import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-image";

export const alt = "Skyline Properties - Real Estate website demo by OwnWebify";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    name: "Skyline Properties",
    type: "Real Estate",
    accent: "#d4af61",
    background: "#0a0f14",
    subtitle: "A live website demo, built by OwnWebify",
  });
}
