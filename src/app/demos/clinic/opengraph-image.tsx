import {
  renderDemoOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/demos/og-image";

export const alt = "CarePlus Medical - Healthcare Clinic website demo by OwnWebify";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderDemoOgImage({
    name: "CarePlus Medical",
    type: "Healthcare Clinic",
    accent: "#4fd1c5",
    background: "#0a1210",
  });
}
