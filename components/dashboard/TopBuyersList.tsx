"use client";

import type { TopBuyer } from "@/lib/zora";

export default function TopBuyersList({ buyers }: { buyers: TopBuyer[] }) {
  return (
    <div style={{ background: "#141414", border: "1px solid #2a2a2a" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #2a2a2a" }}>
        <h3 style={{ fontFamily: "var(--f-serif)", fontWeight: 600, fontSize: 22, color: "#e5e2e1" }}>Top Buyers</h3>
        <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "#9f8e7a55" }}>All Time</span>
      </div>

      {/* Rows */}
      {buyers.map((b, i) => (
        <div
          key={b.wallet}
          style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: "14px 24px",
            borderBottom: i < buyers.length - 1 ? "1px solid #2a2a2a" : "none",
            transition: "background 0.15s",
            cursor: "default",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#1c1b1b")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          {/* Rank */}
          <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "#9f8e7a44", width: 24, flexShrink: 0 }}>
            {String(b.rank).padStart(2, "0")}
          </span>

          {/* Wallet */}
          <span style={{ fontFamily: "var(--f-mono)", fontSize: 13, color: "#e5e2e1", width: 110, flexShrink: 0 }}>
            {b.wallet}
          </span>

          {/* Bar track */}
          <div style={{ flex: 1, height: 1, background: "#2a2a2a", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${b.percentage}%`, background: "#F5A623", opacity: 0.65 }} />
          </div>

          {/* Pct */}
          <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "#9f8e7a88", width: 36, textAlign: "right", flexShrink: 0 }}>
            {b.percentage}%
          </span>

          {/* ETH */}
          <span style={{ fontFamily: "var(--f-mono)", fontSize: 13, fontWeight: 700, color: "#F5A623", width: 72, textAlign: "right", flexShrink: 0 }}>
            {b.amountETH} ETH
          </span>
        </div>
      ))}
    </div>
  );
}
