"use client";

import { useSearchParams } from "next/navigation";
import { useCreatorStats, useHolderGrowth, useTopBuyers } from "@/lib/queries";
import StatCards from "./StatCards";
import HolderGrowthChart from "./HolderGrowthChart";
import TopBuyersList from "./TopBuyersList";
import InsightsAIChat from "./InsightsAIChat";
import ShareCardModal from "./ShareCardModal";
import DashboardLoader from "./DashboardLoader";

export default function DashboardClient() {
  const searchParams = useSearchParams();
  const wallet = searchParams.get("wallet") ?? "";

  const { data: stats, isLoading: l1 } = useCreatorStats(wallet);
  const { data: growth, isLoading: l2 } = useHolderGrowth(wallet);
  const { data: buyers, isLoading: l3 } = useTopBuyers(wallet);

  if (l1 || l2 || l3) return <DashboardLoader />;

  if (!stats || !growth || !buyers)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 260,
        }}
      >
        <p
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 12,
            color: "#9f8e7a55",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          No data found for this wallet.
        </p>
      </div>
    );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/*LEFT: main content */}
      <div
        className="dash-pad"
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Page heading */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--f-serif)",
                fontWeight: 700,
                fontSize: "clamp(26px,4vw,42px)",
                color: "#e5e2e1",
                lineHeight: 1.1,
              }}
            >
              Dashboard
            </h1>
            <p
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "#9f8e7a55",
                marginTop: 5,
              }}
            >
              Overview &amp; Analytics
            </p>
          </div>
          <ShareCardModal stats={stats} />
        </div>

        {/* Stat cards */}
        <div className="stat-grid">
          <StatCards stats={stats} />
        </div>

        {/* Chart */}
        <HolderGrowthChart growth={growth} />

        {/* Top buyers */}
        <TopBuyersList buyers={buyers} />

        {/* Mobile: AI chat inline */}
        <div className="mobile-only" style={{ flexDirection: "column" }}>
          <InsightsAIChat stats={stats} />
        </div>
      </div>

      {/* RIGHT: AI chat sidebar (desktop only)*/}
      <div
        className="desktop-only"
        style={{
          width: 280,
          flexShrink: 0,
          borderLeft: "1px solid #2a2a2a",
          background: "#0e0e0e",
          position: "sticky",
          top: 0,
          height: "100vh",
          alignSelf: "flex-start",
          flexDirection: "column",
        }}
      >
        <InsightsAIChat stats={stats} />
      </div>
    </div>
  );
}
