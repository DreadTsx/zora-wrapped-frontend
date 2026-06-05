"use client";

import { useState } from "react";
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
        ...styles[type],
        display: "inline-block",
      }}
    >
      {type}
    </span>
  );
}

const COLS = [
  "Rank",
  "Wallet",
  "Coins Held",
  "First Purchase",
  "Total Spent",
  "Loyalty Badge",
];

export default function CollectorsTable({
  collectors,
}: {
  collectors: Collector[];
}) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const { format } = useCurrency();

  return (
    <div
      style={{
        background: "#141414",
        border: "1px solid #2a2a2a",
        overflowX: "auto",
      }}
    >
      <table
        style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}
      >
        {/* Header */}
        <thead>
          <tr style={{ borderBottom: "1px solid #2a2a2a" }}>
            {COLS.map((col) => (
              <th
                key={col}
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "#9f8e7a66",
                  fontWeight: 700,
                  padding: "14px 20px",
                  textAlign: "left",
                  whiteSpace: "nowrap",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* Rows */}
        <tbody>
          {collectors.map((c, i) => (
            <tr
              key={c.wallet}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                borderBottom:
                  i < collectors.length - 1 ? "1px solid #2a2a2a" : "none",
                background: hoveredRow === i ? "#1c1b1b" : "transparent",
                transition: "background 0.15s",
                cursor: "default",
              }}
            >
              {/* Rank */}
              <td style={{ padding: "16px 20px" }}>
                <span
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: 12,
                    color: "#9f8e7a44",
                  }}
                >
                  {String(c.rank).padStart(2, "0")}
                </span>
              </td>

              {/* Wallet */}
              <td style={{ padding: "16px 20px" }}>
                <span
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: 13,
                    color: "#F5A623",
                    letterSpacing: "0.04em",
                  }}
                >
                  {c.wallet}
                </span>
              </td>

              {/* Coins held */}
              <td style={{ padding: "16px 20px" }}>
                <span
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: 13,
                    color: "#e5e2e1",
                  }}
                >
                  {c.coins_held.toLocaleString()}
                </span>
              </td>

              {/* First purchase */}
              <td style={{ padding: "16px 20px" }}>
                <span
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: 12,
                    color: "#9f8e7a88",
                  }}
                >
                  {c.first_purchase}
                </span>
              </td>

              {/* Total spent */}
              <td style={{ padding: "16px 20px" }}>
                <span
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: 13,
                    color: "#e5e2e1",
                  }}
                >
                  {format(c.total_spent_eth)}
                </span>
              </td>

              {/* Badge */}
              <td style={{ padding: "16px 20px" }}>
                <Badge type={c.badge} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
