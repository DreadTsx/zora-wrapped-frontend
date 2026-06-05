"use client";

import { useRef, useState } from "react";
import { X, Download, Share2 } from "lucide-react";
import type { CreatorStats } from "@/lib/zora";

export default function ShareCardModal({ stats }: { stats: CreatorStats }) {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#131313",
        scale: 3,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = "zora-wrapped.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      console.error("Download failed");
    }
  };

  const handleShare = async () => {
    const text = `My Zora stats 🔥\n${stats.total_mints.toLocaleString()} total sales · ${stats.unique_holders.toLocaleString()} collectors · ${stats.volume_eth} ETH volume\n\nvia @ZoraWrapped`;
    if (navigator.share)
      await navigator.share({ text, url: window.location.href });
    else {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  const shortWallet = stats.wallet
    ? `${stats.wallet.slice(0, 6)}...${stats.wallet.slice(-4)}`
    : "0x1234...5678";

  return (
    <>
      {/* ── Trigger ──────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--f-mono)",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          padding: "10px 16px",
          background: "#F5A623",
          color: "#000",
          border: "none",
          cursor: "pointer",
          flexShrink: 0,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#ffb955")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#F5A623")}
      >
        <Share2 size={13} strokeWidth={2.5} />
        Share Stats
      </button>

      {/* Modal */}
      {open && (
        <div
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "rgba(0,0,0,0.88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              background: "#141414",
              border: "1px solid #2a2a2a",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px",
                borderBottom: "1px solid #2a2a2a",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  color: "#9f8e7a77",
                }}
              >
                Your Wrapped Card
              </span>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#9f8e7a",
                  cursor: "pointer",
                  display: "flex",
                }}
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Card preview */}
            <div style={{ padding: 20 }}>
              <div
                ref={cardRef}
                style={{
                  background: "#131313",
                  border: "1px solid #2a2a2a",
                  padding: "28px 28px 0",
                  position: "relative",
                  overflow: "hidden",
                  /* Subtle grain */
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(245,166,35,0.008) 60px, rgba(245,166,35,0.008) 61px)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 48,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        background: "#F5A623",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--f-mono)",
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.2em",
                        color: "#e5e2e1",
                      }}
                    >
                      Zora Wrapped
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--f-mono)",
                      fontSize: 11,
                      color: "#9f8e7a55",
                      letterSpacing: "0.08em",
                    }}
                  >
                    2024
                  </span>
                </div>

                <div style={{ textAlign: "center", paddingBottom: 24 }}>
                  <h2
                    style={{
                      fontFamily: "var(--f-serif)",
                      fontWeight: 700,
                      fontSize: "clamp(36px, 8vw, 52px)",
                      color: "#e5e2e1",
                      lineHeight: 1.05,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {stats.name}
                  </h2>

                  <div
                    style={{
                      width: 48,
                      height: 1,
                      background: "#F5A623",
                      opacity: 0.55,
                      margin: "16px auto 0",
                    }}
                  />
                </div>

                <div style={{ height: 32 }} />

                <div style={{ borderTop: "1px solid #2a2a2a" }}>
                  {[
                    {
                      label: "Total Sales",
                      value: stats.total_mints.toLocaleString(),
                      unit: null,
                      amber: false,
                    },
                    {
                      label: "Unique Collectors",
                      value: stats.unique_holders.toLocaleString(),
                      unit: null,
                      amber: true,
                    },
                    {
                      label: "Secondary Vol",
                      value: stats.volume_eth.toFixed(1),
                      unit: "ETH",
                      amber: false,
                    },
                  ].map((row, i, arr) => (
                    <div
                      key={row.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 0",
                        borderBottom:
                          i < arr.length - 1 ? "1px solid #2a2a2a" : "none",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--f-mono)",
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: "0.14em",
                          color: "#9f8e7a",
                        }}
                      >
                        {row.label}
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
                            fontFamily: "var(--f-mono)",
                            fontWeight: 700,
                            fontSize: 22,
                            lineHeight: 1,
                            color: row.amber ? "#F5A623" : "#e5e2e1",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {row.value}
                        </span>
                        {row.unit && (
                          <span
                            style={{
                              fontFamily: "var(--f-mono)",
                              fontSize: 11,
                              color: "#9f8e7a",
                              letterSpacing: "0.1em",
                            }}
                          >
                            {row.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    padding: "12px 0 16px",
                    textAlign: "center",
                    background: "#0e0e0e",
                    margin: "0 -28px",
                    paddingLeft: 28,
                    paddingRight: 28,
                    borderTop: "1px solid #2a2a2a",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--f-mono)",
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "#9f8e7a44",
                    }}
                  >
                    Powered by Aomi
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 12, padding: "0 20px 20px" }}>
              <button
                onClick={handleDownload}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "11px 0",
                  fontFamily: "var(--f-mono)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  background: "#F5A623",
                  color: "#000",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#ffb955")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#F5A623")
                }
              >
                <Download size={13} strokeWidth={2.5} />
                Download
              </button>
              <button
                onClick={handleShare}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "11px 0",
                  fontFamily: "var(--f-mono)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  background: "transparent",
                  color: "#e5e2e1",
                  border: "1px solid #e5e2e1",
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#F5A623")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#e5e2e1")
                }
              >
                <Share2 size={13} strokeWidth={2.5} />
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
