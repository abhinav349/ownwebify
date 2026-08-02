import {
  renderDemoOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/demos/og-image";

export const alt = "Whitmore & Cole - Law Firm website demo by OwnWebify";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderDemoOgImage({
    name: "Whitmore & Cole",
    type: "Law Firm",
    accent: "#9fb3c8",
    background: "#0d1117",
  });
}
