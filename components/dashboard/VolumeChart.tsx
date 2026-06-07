"use client";

interface Props {
  data: { date: string; volume: number }[];
}

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Date helpers ────────────────────────────────────────────────────────────

/**
 * Safely parse an ISO timestamp string (with or without timezone offset).
 * Returns null if the string is unparseable.
 */
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Format a raw date string into "May 9" style label.
 * Falls back to the raw string if parsing fails.
 */
function formatLabel(dateStr: string): string {
  const d = parseDate(dateStr);
  if (!d) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Format a raw date string into a full readable label for the tooltip.
 * e.g. "May 9, 2026 · 06:55 UTC"
 */
function formatTooltipDate(dateStr: string): string {
  const d = parseDate(dateStr);
  if (!d) return "Unknown date";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

//ETH value formatter
function formatETH(value: number): string {
  if (value === 0) return "0 ETH";
  if (value >= 1) return `${value.toFixed(4)} ETH`;
  // For very small values, use enough significant figures
  const precision = value < 0.0001 ? 4 : 6;
  const str = value.toPrecision(precision);
  // Remove trailing zeros after decimal
  const cleaned = parseFloat(str).toString();
  return `${cleaned} ETH`;
}

//Tooltip

type CustomTooltipProps = {
  active?: boolean;
  payload?: { value: number; payload: { rawDate: string } }[];
  label?: string;
};

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const rawDate = payload[0]?.payload?.rawDate ?? "";
  const value = payload[0]?.value ?? 0;

  return (
    <div
      style={{
        background: "#1c1b1b",
        border: "1px solid #2a2a2a",
        padding: "10px 14px",
        minWidth: 140,
      }}
    >
      <p
        style={{
          fontFamily: "var(--f-mono)",
          fontSize: 10,
          color: "#9f8e7a",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 4,
        }}
      >
        {formatTooltipDate(rawDate)}
      </p>
      <p
        style={{
          fontFamily: "var(--f-mono)",
          fontSize: 14,
          fontWeight: 700,
          color: "#F5A623",
        }}
      >
        {formatETH(value)}
      </p>
    </div>
  );
}

//Y-axis tick formatter

function formatYAxis(value: number): string {
  if (value === 0) return "0";
  if (value >= 1) return `${value.toFixed(2)}`;
  // For small numbers, show in scientific-ish notation or short form
  if (value < 0.00001) return `${(value * 1e6).toFixed(1)}μ`;
  if (value < 0.001) return `${(value * 1000).toFixed(3)}m`;
  return value.toPrecision(3);
}

//Main chart

export default function RevenueChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          background: "#141414",
          border: "1px solid #2a2a2a",
          padding: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 300,
        }}
      >
        <p
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 12,
            color: "#9f8e7a",
          }}
        >
          No volume data available.
        </p>
      </div>
    );
  }

  const processedData = data.map((point) => ({
    rawDate: point.date,
    displayDate: formatLabel(point.date),
    volume: point.volume,
  }));

  //Dot visibility
  const allSameMonth =
    processedData.length > 1 &&
    processedData.every(
      (p) =>
        formatLabel(p.rawDate).split(" ")[0] ===
        formatLabel(processedData[0].rawDate).split(" ")[0],
    );

  // Show at most one dot every N points to avoid crowding
  const MAX_VISIBLE_DOTS = 6;
  const dotStep = Math.max(
    1,
    Math.floor(processedData.length / MAX_VISIBLE_DOTS),
  );

  // X-axis tick

  const MAX_XTICKS = 5;
  const tickInterval = Math.max(
    1,
    Math.floor(processedData.length / MAX_XTICKS),
  );

  return (
    <div
      style={{
        background: "#141414",
        border: "1px solid #2a2a2a",
        padding: "24px 24px 16px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--f-serif)",
            fontWeight: 600,
            fontSize: 22,
            color: "#e5e2e1",
          }}
        >
          Monthly Revenue
        </h3>
        <span
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "#9f8e7a55",
          }}
        >
          All Time
        </span>
      </div>

      {/* Chart */}
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={processedData}
            margin={{ top: 4, right: 4, left: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F5A623" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#F5A623" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#2a2a2a"
              strokeDasharray="0"
              vertical={false}
            />

            {/* X-axis: use displayDate, spaced out to avoid crowding */}
            <XAxis
              dataKey="displayDate"
              interval={tickInterval}
              tick={{
                fontFamily: "var(--f-mono)",
                fontSize: 10,
                fill: "#9f8e7a66",
              }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />

            {/* Y-axis: custom formatter for tiny ETH values */}
            <YAxis
              tickFormatter={formatYAxis}
              tick={{
                fontFamily: "var(--f-mono)",
                fontSize: 10,
                fill: "#9f8e7a55",
              }}
              axisLine={false}
              tickLine={false}
              width={60}
            />

            {/* Tooltip: reads rawDate from payload, formats independently */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#2a2a2a", strokeWidth: 1 }}
            />

            <Area
              type="monotone"
              dataKey="volume"
              stroke="#F5A623"
              strokeWidth={2}
              fill="url(#revenueGrad)"
              // Hide dots when same-month cluster, or thin them out otherwise
              dot={
                allSameMonth
                  ? false
                  : (dotProps: {
                      index?: number;
                      cx?: number;
                      cy?: number;
                    }) => {
                      const { index = 0, cx = 0, cy = 0 } = dotProps;
                      if (index % dotStep !== 0)
                        return <g key={`dot-${index}`} />;
                      return (
                        <circle
                          key={`dot-${index}`}
                          cx={cx}
                          cy={cy}
                          r={3}
                          fill="#0e0e0e"
                          stroke="#F5A623"
                          strokeWidth={1.5}
                        />
                      );
                    }
              }
              activeDot={{
                fill: "#F5A623",
                stroke: "#0e0e0e",
                strokeWidth: 2,
                r: 5,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer note for same-month data */}
      {allSameMonth && (
        <p
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 10,
            color: "#9f8e7a44",
            textAlign: "right",
            marginTop: 8,
            letterSpacing: "0.08em",
          }}
        >
          {formatLabel(processedData[0].rawDate).split(" ")[0].toUpperCase()}{" "}
          DATA · HOVER TO EXPLORE
        </p>
      )}
    </div>
  );
}
