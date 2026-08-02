import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-image";

export const alt = "Velvet & Thread - Fashion Store website demo by OwnWebify";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    name: "Velvet & Thread",
    type: "Fashion Store",
    accent: "#e8e6e1",
    background: "#0a0a0a",
    subtitle: "A live website demo, built by OwnWebify",
  });
}
