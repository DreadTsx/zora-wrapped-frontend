"use client";
import { Bell, Share2 } from "lucide-react";

export default function DashboardMobileHeader() {
  const handleShare = async () => {
    if (navigator.share)
      await navigator.share({
        title: "Zora Wrapped",
        url: window.location.href,
      });
    else await navigator.clipboard.writeText(window.location.href);
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        borderBottom: "1px solid #2a2a2a",
        background: "#0e0e0e",
        width: "100%",
      }}
    >
      <span
        style={{
          fontFamily: "var(--f-serif)",
          fontWeight: 700,
          fontSize: 20,
          color: "#F5A623",
          lineHeight: 1.15,
        }}
      >
        ZORA
        <br />
        WRAPPED
      </span>
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <button
          aria-label="Notifications"
          style={{
            background: "none",
            border: "none",
            color: "#9f8e7a",
            cursor: "pointer",
            display: "flex",
          }}
        >
          <Bell size={17} strokeWidth={1.5} />
        </button>
        <button
          aria-label="Share"
          onClick={handleShare}
          style={{
            background: "none",
            border: "none",
            color: "#9f8e7a",
            cursor: "pointer",
            display: "flex",
          }}
        >
          <Share2 size={17} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
