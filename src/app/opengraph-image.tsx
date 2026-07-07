import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OwnWebify - Affordable Website Development";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #7c3aed 70%, #a855f7 100%)",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="3" />
            <ellipse cx="50" cy="50" rx="25" ry="45" stroke="white" strokeWidth="2.5" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="white" strokeWidth="2.5" />
            <path d="M12 30 Q50 25 88 30" stroke="white" strokeWidth="2" fill="none" />
            <path d="M12 70 Q50 75 88 70" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "20px",
          }}
        >
          OwnWebify
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255, 255, 255, 0.85)",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          Affordable Website Development Starting at ₹15,000
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "40px",
          }}
        >
          {["Modern Design", "Fast Delivery", "Budget-Friendly"].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  padding: "10px 24px",
                  borderRadius: "999px",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  color: "white",
                  fontSize: 18,
                  fontWeight: 500,
                }}
              >
                {tag}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
