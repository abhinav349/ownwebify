import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Shared social-preview card for every /demos/* page. Demo links get shared
 * directly into WhatsApp and email outreach (see lib/lead-templates.ts), so
 * each one needs its own preview rather than the generic site-wide card.
 */
export function renderDemoOgImage({
  name,
  type,
  accent,
  background,
}: {
  name: string;
  type: string;
  accent: string;
  background: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background,
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background: accent,
            }}
          />
          <span
            style={{
              fontSize: "24px",
              letterSpacing: "8px",
              textTransform: "uppercase",
              color: accent,
            }}
          >
            {type}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: "104px",
              lineHeight: 1.05,
              color: "#ffffff",
              letterSpacing: "-2px",
            }}
          >
            {name}
          </span>
          <span
            style={{
              marginTop: "24px",
              fontSize: "32px",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            A live website demo, built by OwnWebify
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: "28px",
          }}
        >
          <span style={{ fontSize: "28px", color: "rgba(255,255,255,0.75)" }}>
            ownwebify.com
          </span>
          <span style={{ fontSize: "28px", color: accent }}>
            Custom sites from ₹5,000
          </span>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
