"use client";

import type { Collector } from "@/lib/zora";

function Badge({ type }: { type: "WHALE" | "FAN" | "NEW" }) {
  const styles: Record<string, React.CSSProperties> = {
    WHALE: {
      background: "#F5A623",
      color: "#000",
      border: "1px solid #F5A623",
    },
    FAN: {
      background: "transparent",
      color: "#F5A623",
      border: "1px solid #F5A623",
    },
    NEW: {
      background: "transparent",
      color: "#9f8e7a",
      border: "1px solid #2a2a2a",
    },
  };
  return (
    <span
      style={{
        fontFamily: "var(--f-mono)",
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        padding: "4px 10px",
        display: "inline-block",
        ...styles[type],
      }}
    >
      {type}
    </span>
  );
}

export default function CollectorMobileCard({
  collector,
  index,
}: {
  collector: Collector;
  index: number;
}) {
  return (
    <div
      style={{
        background: "#141414",
        border: "1px solid #2a2a2a",
        padding: "16px 18px",
        opacity: 0,
        animation: "cardIn 0.45s cubic-bezier(0.22,1,0.36,1) forwards",
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Top row div: rank and badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 10,
            color: "#F5A623",
            letterSpacing: "0.1em",
          }}
        >
          {String(collector.rank).padStart(2, "0")}
        </span>
        <Badge type={collector.badge} />
      </div>

      {/* Wallet address (very very large) */}
      <div
        style={{
          fontFamily: "var(--f-mono)",
          fontSize: 17,
          fontWeight: 700,
          color: "#e5e2e1",
          letterSpacing: "0.03em",
          marginBottom: 14,
        }}
      >
        {collector.wallet}
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px 0",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#9f8e7a66",
              marginBottom: 4,
            }}
          >
            Held
          </p>
          <p
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 14,
              fontWeight: 700,
              color: "#e5e2e1",
            }}
          >
            {collector.coinsHeld.toLocaleString()}
          </p>
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#9f8e7a66",
              marginBottom: 4,
            }}
          >
            Spent
          </p>
          <p
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 14,
              fontWeight: 700,
              color: "#e5e2e1",
            }}
          >
            {collector.totalSpentETH} ETH
          </p>
        </div>
      </div>

      {/* Mini styling */}
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
