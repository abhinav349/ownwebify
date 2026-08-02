import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-image";

export const alt = "Pricing & Packages | OwnWebify";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    name: "Pricing & Packages",
    type: "From ₹5,000",
    accent: "#ec4899",
    background: "#0a0a0d",
  });
}
