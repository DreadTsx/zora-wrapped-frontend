"use client";

import { useRef, useState } from "react";
import { X, Download, Share2, Twitter, MessageCircle, Send } from "lucide-react";
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

  const handleShare = (platform: "twitter" | "x" | "whatsapp" | "telegram" | "zora") => {
    const dashboardUrl = `${window.location.origin}/dashboard?wallet=${stats.wallet}`;
    const shareText = `Check out my Zora Wrapped 🔥\n\n${stats.total_mints.toLocaleString()} total sales · ${stats.unique_holders.toLocaleString()} collectors · ${stats.volume_eth} ETH volume`;

    let shareUrl = "";

    switch (platform) {
      case "twitter":
      case "x":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + "\n\nvia @ZoraWrapped " + dashboardUrl)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + "\n\n" + dashboardUrl)}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(dashboardUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case "zora":
        // For Zora, copy URL to clipboard and open in new tab
        navigator.clipboard.writeText(dashboardUrl).catch(() => {
          const textarea = document.createElement("textarea");
          textarea.value = dashboardUrl;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand("copy");
          } catch {
            console.error("Failed to copy URL");
          }
          document.body.removeChild(textarea);
        });
        window.open("https://zora.co", "_blank");
        return;
    }

    window.open(shareUrl, `${platform}-share`, "width=550,height=420");
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
                    {new Date().getFullYear()}
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
            <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 20px 20px" }}>
              <button
                onClick={handleDownload}
                style={{
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

              {/* Share Platform Grid */}
              <div>
                <span
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: 9,
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    color: "#9f8e7a77",
                    display: "block",
                    marginBottom: 10,
                  }}
                >
                  Share on
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                  {[
                    { id: "twitter", label: "Twitter", icon: Twitter },
                    { id: "x", label: "X", icon: Twitter },
                    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
                    { id: "telegram", label: "Telegram", icon: Send },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => handleShare(id as any)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        padding: "10px 0",
                        fontFamily: "var(--f-mono)",
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        background: "transparent",
                        color: "#e5e2e1",
                        border: "1px solid #2a2a2a",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "#F5A623";
                        (e.currentTarget as HTMLButtonElement).style.color = "#F5A623";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a";
                        (e.currentTarget as HTMLButtonElement).style.color = "#e5e2e1";
                      }}
                    >
                      <Icon size={12} strokeWidth={2} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zora section - standalone */}
              <button
                onClick={() => handleShare("zora")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "10px 0",
                  fontFamily: "var(--f-mono)",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  background: "transparent",
                  color: "#e5e2e1",
                  border: "1px solid #2a2a2a",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#F5A623";
                  (e.currentTarget as HTMLButtonElement).style.color = "#F5A623";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a";
                  (e.currentTarget as HTMLButtonElement).style.color = "#e5e2e1";
                }}
              >
                <Share2 size={12} strokeWidth={2} />
                Share on Zora
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
