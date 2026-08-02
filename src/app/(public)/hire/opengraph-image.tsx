import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-image";

export const alt = "Start Your Project | OwnWebify";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    name: "Start Your Project",
    type: "Free Quote in 48 Hours",
    accent: "#f59e0b",
    background: "#0a0a0d",
  });
}
