"use client";

import { useCurrency } from "@/providers/CurrencyProvider";
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

function formatDate(raw: string): string {
  if (!raw || raw.trim() === "") return "—";
  const d = new Date(`${raw}T00:00:00Z`);
  if (isNaN(d.getTime())) return "—";
  const day = d.getUTCDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
          ? "rd"
          : "th";
  const month = d.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  return `${day}${suffix} ${month} ${d.getUTCFullYear()}`;
}

function formatCoins(coins: number): string {
  if (coins === 0) return "0 coins";
  if (coins >= 1_000)
    return `${coins.toLocaleString("en-US", { maximumFractionDigits: 2 })} coins`;
  if (coins >= 1) return `${coins.toFixed(4)} coins`;
  return `${parseFloat(coins.toPrecision(4))} coins`;
}

export default function CollectorMobileCard({
  collector,
  index,
}: {
  collector: Collector;
  index: number;
}) {
  const { format } = useCurrency();

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
        {`${collector.wallet.slice(0, 6)}...${collector.wallet.slice(-4)}`}
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
              fontSize: 13,
              fontWeight: 700,
              color: "#e5e2e1",
            }}
          >
            {formatCoins(collector.coins_held)}
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
              fontSize: 13,
              fontWeight: 700,
              color: "#e5e2e1",
            }}
          >
            {collector.total_spent_eth === 0
              ? "—"
              : format(collector.total_spent_eth)}
          </p>
        </div>

        <div style={{ gridColumn: "1 / -1", marginTop: 4 }}>
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
            First Purchase
          </p>
          <p
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 12,
              color: "#9f8e7a88",
            }}
          >
            {formatDate(collector.first_purchase)}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
