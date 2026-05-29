"use client";

// ── STATIC DATA
const STATIC_GROWTH = [
  { date: "Jan", holders: 120 },
  { date: "Feb", holders: 280 },
  { date: "Mar", holders: 410 },
  { date: "Apr", holders: 520 },
  { date: "May", holders: 680 },
  { date: "Jun", holders: 892 },
];

// ── PRODUCTION: I need to uncomment this and and pass real data as prop ──
// interface Props { data: { date: string; holders: number }[] }
// export default function HolderGrowthChart({ data }: Props) {

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#1c1b1b",
        border: "1px solid #2a2a2a",
        padding: "10px 14px",
      }}
    >
      <p
        style={{
          fontFamily: "var(--f-mono)",
          fontSize: 10,
          color: "#9f8e7a",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--f-mono)",
          fontSize: 14,
          fontWeight: 700,
          color: "#F5A623",
        }}
      >
        {payload[0].value} holders
      </p>
    </div>
  );
}

export default function HolderGrowthChart() {
  // STATIC
  const data = STATIC_GROWTH;

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
          Holder Growth
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
            data={data}
            margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
          >
            <defs>
              <linearGradient id="holderGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F5A623" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#F5A623" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#2a2a2a"
              strokeDasharray="0"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tick={{
                fontFamily: "var(--f-mono)",
                fontSize: 10,
                fill: "#9f8e7a66",
                textTransform: "uppercase",
              }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />

            <YAxis
              tick={{
                fontFamily: "var(--f-mono)",
                fontSize: 10,
                fill: "#9f8e7a55",
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#2a2a2a", strokeWidth: 1 }}
            />

            <Area
              type="monotone"
              dataKey="holders"
              stroke="#F5A623"
              strokeWidth={2.5}
              fill="url(#holderGrad)"
              dot={{ fill: "#0e0e0e", stroke: "#F5A623", strokeWidth: 2, r: 4 }}
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
    </div>
  );
}
