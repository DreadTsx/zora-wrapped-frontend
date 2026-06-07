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
import { useCurrency } from "@/providers/CurrencyProvider";

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function formatLabel(dateStr: string): string {
  const d = parseDate(dateStr);
  if (!d) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTooltipDate(dateStr: string): string {
  const d = parseDate(dateStr);
  if (!d) return "Unknown date";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatETHValue(value: number): string {
  if (value === 0) return "0 ETH";
  if (value >= 1) return `${value.toFixed(4)} ETH`;
  const precision = value < 0.0001 ? 4 : 6;
  return `${parseFloat(value.toPrecision(precision))} ETH`;
}

function formatUSDValue(value: number): string {
  if (value < 0.01) {
    return `$${value.toFixed(6)}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

function makeYAxisFormatter(currency: "ETH" | "USD", ethPrice: number) {
  return (value: number): string => {
    if (currency === "USD") {
      const usd = value * ethPrice;
      if (usd === 0) return "$0";
      if (usd >= 1000) return `$${(usd / 1000).toFixed(1)}k`;
      if (usd >= 1) return `$${usd.toFixed(2)}`;
      if (usd >= 0.01) return `$${usd.toFixed(4)}`;
      return `$${usd.toFixed(6)}`;
    }
    // ETH
    if (value === 0) return "0";
    if (value >= 1) return `${value.toFixed(2)}`;
    if (value < 0.00001) return `${(value * 1e6).toFixed(1)}μ`;
    if (value < 0.001) return `${(value * 1000).toFixed(3)}m`;
    return value.toPrecision(3);
  };
}

type CustomTooltipProps = {
  active?: boolean;
  payload?: { value: number; payload: { rawDate: string } }[];
  currency: "ETH" | "USD";
  ethPrice: number;
};

function CustomTooltip({
  active,
  payload,
  currency,
  ethPrice,
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const rawDate = payload[0]?.payload?.rawDate ?? "";
  const ethValue = payload[0]?.value ?? 0;

  const displayValue =
    currency === "USD"
      ? formatUSDValue(ethValue * ethPrice)
      : formatETHValue(ethValue);

  return (
    <div
      style={{
        background: "#1c1b1b",
        border: "1px solid #2a2a2a",
        padding: "10px 14px",
        minWidth: 150,
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
        {displayValue}
      </p>
    </div>
  );
}

export default function RevenueChart({ data }: Props) {
  const { currency, ethPrice } = useCurrency();

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

  // Dot & tick spacing
  const allSameMonth =
    processedData.length > 1 &&
    processedData.every(
      (p) =>
        formatLabel(p.rawDate).split(" ")[0] ===
        formatLabel(processedData[0].rawDate).split(" ")[0],
    );

  const MAX_VISIBLE_DOTS = 6;
  const dotStep = Math.max(
    1,
    Math.floor(processedData.length / MAX_VISIBLE_DOTS),
  );

  const MAX_XTICKS = 5;
  const tickInterval = Math.max(
    1,
    Math.floor(processedData.length / MAX_XTICKS),
  );

  const yAxisFormatter = makeYAxisFormatter(currency, ethPrice);

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
          {currency === "USD" ? "All Time · USD" : "All Time"}
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

            <YAxis
              tickFormatter={yAxisFormatter}
              tick={{
                fontFamily: "var(--f-mono)",
                fontSize: 10,
                fill: "#9f8e7a55",
              }}
              axisLine={false}
              tickLine={false}
              width={64}
            />

            <Tooltip
              content={
                <CustomTooltip
                  currency={currency}
                  ethPrice={ethPrice}
                  // Recharts injects active/payload automatically
                  {...({} as Pick<CustomTooltipProps, "active" | "payload">)}
                />
              }
              cursor={{ stroke: "#2a2a2a", strokeWidth: 1 }}
            />

            <Area
              type="monotone"
              dataKey="volume"
              stroke="#F5A623"
              strokeWidth={2}
              fill="url(#revenueGrad)"
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
