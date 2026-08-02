import { ImageResponse } from "next/og";

/**
 * Square raster logo for structured data. Google's logo guidelines accept
 * only jpg/png/gif, so the SVG favicon can't serve this role; generating it
 * here avoids committing a binary asset that would drift from the SVG.
 */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0d",
        }}
      >
        <svg width="360" height="360" viewBox="0 0 48 48" fill="none">
          <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r="20" stroke="url(#g)" strokeWidth="2.5" fill="none" />
          <ellipse cx="24" cy="24" rx="8" ry="20" stroke="url(#g)" strokeWidth="2" fill="none" />
          <ellipse cx="24" cy="16" rx="16" ry="4" stroke="url(#g)" strokeWidth="1.5" fill="none" />
          <ellipse cx="24" cy="32" rx="16" ry="4" stroke="url(#g)" strokeWidth="1.5" fill="none" />
          <path
            d="M 8 12 A 24 24 0 0 1 40 36"
            stroke="url(#g)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="40" cy="36" r="3" fill="url(#g)" />
        </svg>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
