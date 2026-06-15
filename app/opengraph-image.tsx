import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social share card. Generated at build time → no runtime cost. Every div has
// display:flex because Satori (next/og) requires it on multi-child elements.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          background: "#f8fafc", padding: "70px", fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64, height: 64, display: "flex", alignItems: "center",
              justifyContent: "center", background: "#059669", color: "#fff",
              fontSize: 38, fontWeight: 700, borderRadius: 14,
            }}
          >
            $
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "#0f172a" }}>
            Wage<span style={{ color: "#059669" }}>Calc HQ</span>
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 56, fontSize: 68, fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>
          Overtime, Minimum Wage & Paycheck Calculators
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 31, color: "#475569", maxWidth: 1000 }}>
          Federal FLSA + 2026 state rules for all 50 states and DC — overtime, time and a half, tipped pay and final paychecks.
        </div>

        <div style={{ display: "flex", marginTop: "auto", gap: 16 }}>
          {["Time and a half = 1.5×", "Minimum wage by state", "Final-pay deadlines"].map((t) => (
            <div key={t} style={{ display: "flex", background: "#d1fae5", color: "#065f46", padding: "12px 22px", borderRadius: 999, fontSize: 26, fontWeight: 600 }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
