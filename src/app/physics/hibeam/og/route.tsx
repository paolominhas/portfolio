import { ImageResponse } from "next/og";

// Social-share card for /hibeam (1200x630). Served at physics.paolo.org.uk/hibeam/og.
export const dynamic = "force-static";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 90,
          background: "linear-gradient(135deg,#0A0E1A 0%,#10172a 60%,#2a1410 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 28, color: "#FF6B3D", letterSpacing: 6, textTransform: "uppercase", marginBottom: 28 }}>
          Physics · Paolo Minhas
        </div>
        <div style={{ fontSize: 112, fontWeight: 700, lineHeight: 1.05 }}>What is HIBEAM?</div>
        <div style={{ fontSize: 38, color: "rgba(255,255,255,.7)", marginTop: 32, maxWidth: 900 }}>
          The neutron experiment planned at the European Spallation Source in Lund, Sweden
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
