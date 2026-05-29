"use client";

import { useEffect, useState } from "react";

/* Fake stat cards */
const PREVIEW_STATS = [
  { value: "1.2K", label: "Total Mints" },
  { value: "45.8", label: "Volume (ETH)" },
  { value: "892", label: "Unique Holders" },
  { value: "+12%", label: "Growth 30D" },
];

/* SVG chart path for the fake holder-growth curve */
const CHART_PATH =
  "M0,260 C80,250 130,230 220,215 C310,200 360,228 460,195 C560,162 610,132 720,92 C830,52 930,30 1180,12";

export default function DashboardPreview() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        // transform:  visible ? "translateY(0)" : "translateY(30px)",
        transition:
          "opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* DESKTOP preview */}
      <div
        className="hidden md:block mx-16 border border-surface-high overflow-hidden"
        style={{ background: "#0e0e0e", height: "500px", position: "relative" }}
      >
        {/* Corner labels */}
        <span className="absolute top-4 left-5 font-mono text-[10px] uppercase tracking-[0.15em] text-outline/40 select-none">
          Volume_01
        </span>
        <span className="absolute top-4 right-5 font-mono text-[10px] uppercase tracking-[0.15em] text-outline/40 select-none flex items-center gap-1">
          Indexing
          <span className="inline-block w-1 h-1 bg-primary animate-blink" />
        </span>

        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "55%",
            left: "55%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "280px",
            background:
              "radial-gradient(ellipse at center, rgba(245,166,35,0.13) 0%, rgba(245,166,35,0.04) 45%, transparent 70%)",
            filter: "blur(48px)",
            pointerEvents: "none",
          }}
        />

        {/* Blurred fake stat cards row */}
        <div
          className="absolute top-10 left-5 right-5 flex gap-3"
          style={{ filter: "blur(2.5px)", opacity: 0.28 }}
        >
          {PREVIEW_STATS.map((s) => (
            <div
              key={s.label}
              className="flex-1 border border-surface-high p-3"
              style={{ background: "#141414" }}
            >
              <div className="font-mono text-lg font-bold text-primary leading-none">
                {s.value}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-outline mt-1.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Fake chart SVG */}
        <div
          className="absolute inset-0 top-28"
          style={{ filter: "blur(5px)", opacity: 0.38 }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1200 300"
            preserveAspectRatio="none"
          >
            {/* Horizontal grid lines */}
            {[60, 120, 180, 240].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="1200"
                y2={y}
                stroke="#2a2a2a"
                strokeWidth="1"
              />
            ))}
            {/* Chart line */}
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F5A623" stopOpacity="0" />
                <stop offset="25%" stopColor="#F5A623" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#F5A623" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F5A623" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path
              d={`${CHART_PATH} L1180,300 L0,300 Z`}
              fill="url(#areaGrad)"
            />
            {/* Stroke */}
            <path
              d={CHART_PATH}
              stroke="url(#lineGrad)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Fade-to-background gradient at the bottom */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: "65%",
            background:
              "linear-gradient(to bottom, transparent 0%, #0e0e0e 100%)",
          }}
        />

        {/* "VIEW DASHBOARD" ghost CTA at the very bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-outline/40">
            Enter wallet above to unlock →
          </span>
        </div>
      </div>

      {/*MOBILE preview card*/}
      <div className="md:hidden mx-5 mb-6">
        <div
          className="border border-surface-high overflow-hidden"
          style={{ background: "#141414" }}
        >
          {/* Card header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-surface-high">
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-outline/50">
              Vol. 01
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-outline/50 flex items-center gap-1">
              Analysis
              <span className="inline-block w-1 h-1 bg-primary animate-blink" />
            </span>
          </div>

          {/* Amber glow and fake mini chart */}
          <div className="relative px-4 pt-4" style={{ height: "180px" }}>
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "40%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "300px",
                height: "120px",
                background:
                  "radial-gradient(ellipse at center, rgba(245,166,35,0.18) 0%, transparent 70%)",
                filter: "blur(22px)",
                pointerEvents: "none",
              }}
            />
            <div style={{ filter: "blur(3px)", opacity: 0.38 }}>
              <svg width="100%" height="150" viewBox="0 0 400 150">
                <defs>
                  <linearGradient
                    id="mobileGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#F5A623" stopOpacity="0" />
                    <stop offset="40%" stopColor="#F5A623" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#F5A623" stopOpacity="1" />
                  </linearGradient>
                </defs>
                {[40, 80, 120].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="400"
                    y2={y}
                    stroke="#2a2a2a"
                    strokeWidth="1"
                  />
                ))}
                <path
                  d="M0,135 C50,125 90,118 140,100 C190,82 220,95 270,70 C320,45 360,22 400,8"
                  stroke="url(#mobileGrad)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Big stat */}
          <div className="px-4 pb-5 border-t border-surface-high pt-4">
            <div className="font-mono text-[28px] font-bold text-primary leading-none">
              84.2K
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-outline mt-1.5">
              Interactions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
