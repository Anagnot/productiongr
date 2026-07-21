import { ImageResponse } from "next/og";

/**
 * Shared 1200x630 social share card, rendered to PNG at build time via next/og.
 * Used by both the Open Graph and Twitter file-convention images so every page
 * ships a real raster share image (social crawlers do not render SVG).
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";
export const ogAlt = "Production LTD — Crafting Retail Conversion";

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#141414",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 30, height: 30, background: "#E65C00", borderRadius: 7, display: "flex" }} />
          <div style={{ color: "#ffffff", fontSize: 30, fontWeight: 700, letterSpacing: "0.18em" }}>
            PRODUCTION LTD
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#ffffff",
              fontSize: 80,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
            }}
          >
            Crafting Retail Conversion
          </div>
          <div style={{ color: "#bdbdbd", fontSize: 33, marginTop: 26, lineHeight: 1.32, display: "flex" }}>
            Display solutions and branded environments — Industrialized Craft in Acharnes, Greece, since 2008.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#E65C00", fontSize: 28, fontWeight: 700, letterSpacing: "0.08em" }}>
            production.gr
          </div>
          <div style={{ color: "#8a8a8a", fontSize: 22, display: "flex" }}>
            ISO 9001 · 14001 · 45001
          </div>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
