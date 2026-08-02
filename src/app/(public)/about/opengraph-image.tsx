import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-image";

export const alt = "About Abhi | OwnWebify";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    name: "About Abhi",
    type: "Freelance Web Developer",
    accent: "#a855f7",
    background: "#0a0a0d",
  });
}
