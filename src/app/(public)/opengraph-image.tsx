import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

/**
 * Social card for `/`, and the fallback for the rest of the (public) group.
 *
 * It has to live in this segment rather than relying on app/opengraph-image.tsx:
 * static image files are merged into the metadata of the segment they sit in,
 * and the homepage's own `openGraph` block replaces the root layout's wholesale
 * — images included. That left `/`, the most-shared URL on the site, emitting
 * no og:image at all, while /about, /services and /hire looked fine because
 * each already had an opengraph-image.tsx of its own.
 *
 * Uses the shared renderer for the same reason those do: one card design, so
 * the homepage does not preview as a different brand from every page it links
 * to. `name` is kept short deliberately — the renderer sets it at 104px, and
 * anything past ~20 characters wraps and pushes the layout out of the frame.
 */
export const alt = "OwnWebify | Affordable Website Development";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    name: "Affordable Websites",
    type: "Web Development",
    accent: "#8b5cf6",
    background: "#0a0a0d",
    subtitle: "Agency-quality web development, honestly priced",
  });
}
