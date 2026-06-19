import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name}: ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social share card. Generated at build time, so no runtime cost. Every div has
// display:flex because Satori (next/og) requires it on multi-child elements.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          background: "#f6f3ec", padding: "70px", fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64, height: 64, display: "flex", flexDirection: "column",
              justifyContent: "center", gap: 7, padding: "0 16px",
              background: "linear-gradient(135deg, #136a51, #0f241b)", borderRadius: 16,
            }}
          >
            <div style={{ display: "flex", width: 22, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.55)" }} />
            <div style={{ display: "flex", width: 32, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.85)" }} />
            <div style={{ display: "flex", width: 16, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.4)" }} />
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "#16201b" }}>
            Wage<span style={{ color: "#0d543f" }}>Calc HQ</span>
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 56, fontSize: 66, fontWeight: 800, color: "#16201b", lineHeight: 1.08, maxWidth: 1020 }}>
          Overtime and time-and-a-half pay, itemized to the cent.
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 30, color: "#4d554f", maxWidth: 1000 }}>
          Federal FLSA and 2026 state rules for all 50 states and DC. Overtime, minimum wage, tipped pay and final paychecks.
        </div>

        <div style={{ display: "flex", marginTop: "auto", gap: 16 }}>
          {["Time and a half = 1.5×", "Minimum wage by state", "Final-pay deadlines"].map((t) => (
            <div key={t} style={{ display: "flex", background: "#d2e9df", color: "#0d543f", padding: "12px 22px", borderRadius: 999, fontSize: 26, fontWeight: 600 }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
