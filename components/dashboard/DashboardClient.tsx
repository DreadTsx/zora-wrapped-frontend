"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCreatorStats, useVolumeData, useTopBuyers } from "@/lib/queries";
import StatCards from "./StatCards";
import VolumeChart from "./VolumeChart";
import TopBuyersList from "./TopBuyersList";
import InsightsAIChat from "./InsightsAIChat";
import ShareCardModal from "./ShareCardModal";
import DashboardLoader from "./DashboardLoader";

export default function DashboardClient() {
  const searchParams = useSearchParams();
  const wallet = searchParams.get("wallet") ?? "";

  const { data: stats, isLoading: loading1 } = useCreatorStats(wallet);
  const { data: growth, isLoading: loading2 } = useVolumeData(wallet);
  const { data: buyers, isLoading: loading3 } = useTopBuyers(wallet);

  if (loading1 || loading2 || loading3) return <DashboardLoader />;

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

  // Avatar initials fallback
  const initials = stats.name
    ? stats.name
        .split(/\s+/)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .slice(0, 2)
        .join("")
    : "ZC";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
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
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {/* Creator identity */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Avatar */}
            <div
              style={{
                width: 52,
                height: 52,
                background: "#1c1b1b",
                border: "1px solid #2a2a2a",
                flexShrink: 0,
                overflow: "hidden",
                position: "relative",
              }}
            >
              {stats.avatar ? (
                <Image
                  src={stats.avatar}
                  alt={stats.name}
                  fill
                  sizes="52px"
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--f-mono)",
                      fontSize: 13,
                      color: "#9f8e7a",
                    }}
                  >
                    {initials}
                  </span>
                </div>
              )}
            </div>

            {/* Name + label */}
            <div>
              <h1
                style={{
                  fontFamily: "var(--f-serif)",
                  fontWeight: 700,
                  fontSize: "clamp(22px, 3.5vw, 38px)",
                  color: "#e5e2e1",
                  lineHeight: 1.1,
                }}
              >
                {stats.name || "Dashboard"}
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
          </div>

          <ShareCardModal stats={stats} />
        </div>

        {/* Stat cards */}
        <div className="stat-grid">
          <StatCards stats={stats} />
        </div>

        {/* Chart */}
        <VolumeChart data={growth} />

        {/* Top buyers */}
        <TopBuyersList buyers={buyers} />

        {/* Mobile: AI chat inline */}
        <div className="mobile-only" style={{ flexDirection: "column" }}>
          <InsightsAIChat stats={stats} />
        </div>
      </div>

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
