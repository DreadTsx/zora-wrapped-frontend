import { ImageResponse } from "@vercel/og";
import { getCreatorStats } from "@/lib/zora";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    // Parse wallet from query params
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get("wallet");

    if (!wallet) {
      return new ImageResponse(
        (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              background: "#131313",
              fontSize: 32,
              color: "#e5e2e1",
              fontFamily: "Space Mono",
            }}
          >
            Invalid wallet address
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    // Fetch creator stats
    let stats;
    try {
      stats = await getCreatorStats(wallet);
    } catch {
      return new ImageResponse(
        (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              background: "#131313",
              fontSize: 32,
              color: "#9f8e7a",
              fontFamily: "Space Mono",
            }}
          >
            Creator not found
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    // Build the OG image
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            background: "#131313",
            color: "#e5e2e1",
            fontFamily: "Space Mono",
            position: "relative",
            overflow: "hidden",
            /* Subtle grain */
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(245,166,35,0.008) 60px, rgba(245,166,35,0.008) 61px)",
            padding: "0 48px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 48,
              marginBottom: 40,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  background: "#F5A623",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "#e5e2e1",
                  fontWeight: "bold",
                }}
              >
                Zora Wrapped
              </span>
            </div>
            <span
              style={{
                fontSize: 13,
                color: "#9f8e7a55",
                letterSpacing: "0.08em",
              }}
            >
              {new Date().getFullYear()}
            </span>
          </div>

          {/* Creator name and stats container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Creator Name */}
            <h1
              style={{
                margin: 0,
                fontFamily: "Playfair Display",
                fontWeight: 700,
                fontSize: 68,
                color: "#e5e2e1",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                textAlign: "center",
                maxWidth: "90%",
              }}
            >
              {stats.name}
            </h1>

            {/* Divider line */}
            <div
              style={{
                width: 64,
                height: 2,
                background: "#F5A623",
                opacity: 0.55,
                margin: "24px 0 40px",
              }}
            />

            {/* Stats grid */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "80px",
                width: "100%",
              }}
            >
              {/* Total Sales */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "#9f8e7a",
                    marginBottom: 12,
                    fontWeight: 600,
                  }}
                >
                  Total Sales
                </span>
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    color: "#e5e2e1",
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                  }}
                >
                  {stats.total_mints.toLocaleString()}
                </span>
              </div>

              {/* Unique Collectors (highlighted in amber) */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "#9f8e7a",
                    marginBottom: 12,
                    fontWeight: 600,
                  }}
                >
                  Unique Collectors
                </span>
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    color: "#F5A623",
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                  }}
                >
                  {stats.unique_holders.toLocaleString()}
                </span>
              </div>

              {/* Secondary Volume */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "#9f8e7a",
                    marginBottom: 12,
                    fontWeight: 600,
                  }}
                >
                  Secondary Vol
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 36,
                      fontWeight: 700,
                      color: "#e5e2e1",
                      letterSpacing: "-0.01em",
                      lineHeight: 1,
                    }}
                  >
                    {stats.volume_eth.toFixed(1)}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      color: "#9f8e7a",
                      letterSpacing: "0.1em",
                    }}
                  >
                    ETH
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              paddingTop: 32,
              paddingBottom: 32,
              textAlign: "center",
              borderTop: "1px solid #2a2a2a",
            }}
          >
            <span
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#9f8e7a44",
              }}
            >
              Powered by Aomi
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Space Mono",
            data: await fetch(
              "https://fonts.gstatic.com/s/spacemono/v12/ie_1xntroHtnH41DHcMvsPmZChg.ttf"
            ).then((res) => res.arrayBuffer()),
            weight: 400,
          },
          {
            name: "Space Mono",
            data: await fetch(
              "https://fonts.gstatic.com/s/spacemono/v12/ie_1xntroHtnH41DHcMvs-3gUhg.ttf"
            ).then((res) => res.arrayBuffer()),
            weight: 700,
          },
          {
            name: "Playfair Display",
            data: await fetch(
              "https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vgbyD9-wlpL4K2q8lVHG3QQiRe.ttf"
            ).then((res) => res.arrayBuffer()),
            weight: 700,
          },
        ],
      }
    );
  } catch (error) {
    console.error("[v0] OG route error:", error);
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: "#131313",
            fontSize: 32,
            color: "#e5e2e1",
            fontFamily: "Space Mono",
          }}
        >
          Error generating image
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }
}
