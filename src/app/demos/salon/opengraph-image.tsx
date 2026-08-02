import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-image";

export const alt = "Glow Studio - Beauty Salon website demo by OwnWebify";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    name: "Glow Studio",
    type: "Beauty Salon",
    accent: "#e3aab4",
    background: "#180f12",
    subtitle: "A live website demo, built by OwnWebify",
  });
}
