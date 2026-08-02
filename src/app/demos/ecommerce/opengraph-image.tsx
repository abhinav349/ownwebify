import {
  renderDemoOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/demos/og-image";

export const alt = "Velvet & Thread - Fashion Store website demo by OwnWebify";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderDemoOgImage({
    name: "Velvet & Thread",
    type: "Fashion Store",
    accent: "#e8e6e1",
    background: "#0a0a0a",
  });
}
