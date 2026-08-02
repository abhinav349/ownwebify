import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-image";

export const alt = "Whitmore & Cole - Law Firm website demo by OwnWebify";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    name: "Whitmore & Cole",
    type: "Law Firm",
    accent: "#9fb3c8",
    background: "#0d1117",
    subtitle: "A live website demo, built by OwnWebify",
  });
}
