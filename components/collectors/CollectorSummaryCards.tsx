"use client";

import { useEffect, useState } from "react";
import { Users, Clock, Waves } from "lucide-react";
import type { Collector } from "@/lib/zora";

function useCountUp(target: number, duration = 1200, enabled = true) {
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

function DesktopCard({
  label,
  value,
  suffix = "",
  icon: Icon,
  delay,
}: {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ElementType;
  delay: number;
}) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  const count = useCountUp(value, 1200, vis);

  return (
    <div
      style={{
        flex: 1,
        background: "#141414",
        border: "1px solid #2a2a2a",
        padding: "24px 28px 28px",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "#9f8e7a88",
          }}
        >
          {label}
        </span>
        <Icon size={16} strokeWidth={1.4} style={{ color: "#9f8e7a33" }} />
      </div>
      {/* Thin rule */}
      <div style={{ height: 1, background: "#2a2a2a", marginBottom: 20 }} />
      {/* Big number */}
      <div
        style={{
          fontFamily: "var(--f-serif)",
          fontWeight: 700,
          fontSize: "clamp(36px, 4vw, 52px)",
          color: "#F5A623",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {count.toLocaleString()}
        {suffix}
      </div>
    </div>
  );
}

function MobileStat({
  label,
  value,
  suffix = "",
  delay,
}: {
  label: string;
  value: number;
  suffix?: string;
  delay: number;
}) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  const count = useCountUp(value, 1100, vis);

  return (
    <div
      style={{
        paddingBottom: 20,
        marginBottom: 20,
        borderBottom: "1px solid #2a2a2a",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <p
        style={{
          fontFamily: "var(--f-mono)",
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          color: "#9f8e7a77",
          marginBottom: 8,
        }}
      >
        {label}
      </p>
      <div
        style={{
          fontFamily: "var(--f-serif)",
          fontWeight: 700,
          fontSize: 40,
          color: "#F5A623",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {count.toLocaleString()}
        {suffix}
      </div>
    </div>
  );
}

export default function CollectorSummaryCards({
  collectors,
}: {
  collectors: Collector[];
}) {
  const totalCollectors = collectors.length * 1776; //? mock total
  const avgHoldDays = 84;
  const whaleCount = collectors.filter((c) => c.badge === "WHALE").length * 63;

  return (
    <>
      {/* Desktop — 3 side-by-side cards */}
      <div className="desktop-only" style={{ gap: 16 }}>
        <DesktopCard
          label="Total Collectors"
          value={totalCollectors}
          icon={Users}
          delay={80}
        />
        <DesktopCard
          label="Avg. Hold Duration"
          value={avgHoldDays}
          suffix="d"
          icon={Clock}
          delay={160}
        />
        <DesktopCard
          label="Whale Count"
          value={whaleCount}
          icon={Waves}
          delay={240}
        />
      </div>

      {/* Mobile view */}
      <div className="mobile-only" style={{ flexDirection: "column" }}>
        <MobileStat
          label="Total Collectors"
          value={totalCollectors}
          delay={80}
        />
        <MobileStat
          label="Avg. Hold Duration"
          value={avgHoldDays}
          suffix="d"
          delay={160}
        />
        <MobileStat label="Whale Count" value={whaleCount} delay={240} />
      </div>
    </>
  );
}
