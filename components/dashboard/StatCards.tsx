"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import type { CreatorStats } from "@/lib/zora";

function useCountUp(target: number, duration = 1100, enabled = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, enabled]);
  return val;
}

type Card = { label: string; raw: number; fmt: (n: number) => string };

function StatCard({ card, delay }: { card: Card; delay: number }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  const count = useCountUp(card.raw, 1100, vis);

  return (
    <div
      style={{
        padding: "16px 18px",
        background: "#141414",
        border: "1px solid #2a2a2a",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      <p
        style={{
          fontFamily: "var(--f-mono)",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "#9f8e7a77",
          marginBottom: 12,
        }}
      >
        {card.label}
      </p>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
        <span
          style={{
            fontFamily: "var(--f-mono)",
            fontWeight: 700,
            fontSize: "clamp(20px, 2.5vw, 28px)",
            color: "#F5A623",
            lineHeight: 1,
          }}
        >
          {card.fmt(count)}
        </span>
        <TrendingUp
          size={12}
          strokeWidth={2}
          style={{ color: "#F5A623", marginBottom: 2 }}
        />
      </div>
    </div>
  );
}

export default function StatCards({ stats }: { stats: CreatorStats }) {
  const cards: Card[] = [
    {
      label: "Total Mints",
      raw: stats.totalMints,
      fmt: (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)),
    },
    {
      label: "Volume (ETH)",
      raw: Math.round(stats.volumeETH * 10),
      fmt: (n) => (n / 10).toFixed(1),
    },
    {
      label: "Unique Holders",
      raw: stats.uniqueHolders,
      fmt: (n) => String(n),
    },
    { label: "Growth 30D", raw: stats.growth30d, fmt: (n) => `+${n}%` },
  ];

  // Renders 4 individual cards — parent (.stat-grid) controls the columns
  return (
    <>
      {cards.map((c, i) => (
        <StatCard key={c.label} card={c} delay={i * 90} />
      ))}
    </>
  );
}
