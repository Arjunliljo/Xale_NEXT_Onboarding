import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Xale — The CRM operating system";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          background:
            "radial-gradient(124% 124% at 30% 20%, #102F23 0%, #051912 60%, #020c08 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "999px",
              background: "#319b72",
            }}
          />
          <span style={{ fontSize: "32px", fontWeight: 500, letterSpacing: "-0.02em" }}>
            Xale
          </span>
        </div>
        <div
          style={{
            fontSize: "72px",
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: "900px",
          }}
        >
          The CRM operating system for teams that move fast.
        </div>
        <div
          style={{
            marginTop: "32px",
            fontSize: "26px",
            color: "rgba(255,255,255,0.65)",
            maxWidth: "880px",
            lineHeight: 1.3,
          }}
        >
          WhatsApp · Meta Ads · Automations · one platform, every channel.
        </div>
      </div>
    ),
    { ...size }
  );
}
