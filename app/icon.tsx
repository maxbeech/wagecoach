import { ImageResponse } from "next/og";

// Favicon: the ledger mark — three itemized bars on an ink-green tile.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "center", gap: 4, padding: "0 8px",
          background: "linear-gradient(135deg, #136a51, #0f241b)", borderRadius: 8,
        }}
      >
        <div style={{ display: "flex", width: 11, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.55)" }} />
        <div style={{ display: "flex", width: 16, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.85)" }} />
        <div style={{ display: "flex", width: 8, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.4)" }} />
      </div>
    ),
    { ...size },
  );
}
