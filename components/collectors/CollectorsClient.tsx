"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useCollectors } from "@/lib/queries";
import CollectorSummaryCards from "./CollectorSummaryCards";
import CollectorsTable from "./CollectorsTable";
import CollectorMobileCard from "./CollectorMobileCard";
import DashboardLoader from "@/components/dashboard/DashboardLoader";
import type { Collector } from "@/lib/zora";

type BadgeFilter = "ALL" | "WHALE" | "FAN" | "NEW";
const BADGE_OPTIONS: BadgeFilter[] = ["ALL", "WHALE", "FAN", "NEW"];

export default function CollectorsClient() {
  const searchParams = useSearchParams();
  const wallet = searchParams.get("wallet") ?? "";
  const [search, setSearch] = useState("");
  const [badge, setBadge] = useState<BadgeFilter>("ALL");
  const [showFilter, setShowFilter] = useState(false);

  const { data: collectors, isLoading } = useCollectors(wallet);

  const filtered = useMemo<Collector[]>(() => {
    if (!collectors) return [];
    return collectors.filter((c) => {
      const matchBadge = badge === "ALL" || c.badge === badge;
      const matchSearch =
        !search.trim() || c.wallet.toLowerCase().includes(search.toLowerCase());
      return matchBadge && matchSearch;
    });
  }, [collectors, search, badge]);

  if (isLoading) return <DashboardLoader />;

  return (
    <div
      className="dash-pad"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 28,
        minHeight: "100vh",
      }}
    >
      {/*DESKTOP Header*/}
      <div
        className="desktop-only"
        style={{
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--f-serif)",
              fontWeight: 700,
              fontSize: "clamp(28px,4vw,42px)",
              color: "#e5e2e1",
              lineHeight: 1.1,
            }}
          >
            Collectors
          </h1>
          <p
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 13,
              color: "#9f8e7a77",
              marginTop: 6,
              letterSpacing: "0.06em",
            }}
          >
            Every wallet holding your coins.
          </p>
        </div>

        {/* Desktop search */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid #2a2a2a",
              padding: "9px 14px",
              background: "#141414",
              width: 260,
              transition: "border-color 0.2s",
            }}
            onFocusCapture={(e) =>
              (e.currentTarget.style.borderColor = "#F5A623")
            }
            onBlurCapture={(e) =>
              (e.currentTarget.style.borderColor = "#2a2a2a")
            }
          >
            <Search
              size={12}
              strokeWidth={1.5}
              style={{ color: "#9f8e7a55", flexShrink: 0 }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 0x..."
              style={{
                flex: 1,
                fontFamily: "var(--f-mono)",
                fontSize: 12,
                color: "#e5e2e1",
                background: "transparent",
                border: "none",
                outline: "none",
                letterSpacing: "0.04em",
              }}
            />
          </div>

          {/* Badge filter*/}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowFilter((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--f-mono)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                padding: "9px 16px",
                border: "1px solid #2a2a2a",
                background: badge !== "ALL" ? "#F5A623" : "#141414",
                color: badge !== "ALL" ? "#000" : "#e5e2e1",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <SlidersHorizontal size={12} strokeWidth={1.5} />
              {badge === "ALL" ? "All Badges" : badge}
            </button>

            {showFilter && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  right: 0,
                  background: "#141414",
                  border: "1px solid #2a2a2a",
                  zIndex: 20,
                  minWidth: 130,
                }}
              >
                {BADGE_OPTIONS.map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      setBadge(b);
                      setShowFilter(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 16px",
                      fontFamily: "var(--f-mono)",
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: badge === b ? "#F5A623" : "#9f8e7a",
                      background: badge === b ? "#1c1b1b" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#1c1b1b")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        badge === b ? "#1c1b1b" : "transparent")
                    }
                  >
                    {b === "ALL" ? "All Badges" : b}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/*MOBILE HEADER */}
      <div className="mobile-only" style={{ flexDirection: "column", gap: 4 }}>
        <h1
          style={{
            fontFamily: "var(--f-serif)",
            fontWeight: 700,
            fontSize: 32,
            color: "#e5e2e1",
            lineHeight: 1.1,
          }}
        >
          Collectors
        </h1>
        <p
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            color: "#9f8e7a55",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Every wallet holding your coins.
        </p>
      </div>

      {/* Summary stat cards */}
      {collectors && <CollectorSummaryCards collectors={collectors} />}

      {/*Mobile searhc and filter*/}
      <div className="mobile-only" style={{ flexDirection: "column", gap: 10 }}>
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: "1px solid #2a2a2a",
            padding: "11px 14px",
            background: "#141414",
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search wallet addresses..."
            style={{
              flex: 1,
              fontFamily: "var(--f-mono)",
              fontSize: 12,
              color: "#e5e2e1",
              background: "transparent",
              border: "none",
              outline: "none",
            }}
          />
          <Search size={13} strokeWidth={1.5} style={{ color: "#9f8e7a55" }} />
        </div>

        {/* Filter chips */}
        <button
          onClick={() => setShowFilter((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "10px 0",
            border: "1px solid #2a2a2a",
            background: "#141414",
            fontFamily: "var(--f-mono)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "#9f8e7a",
            cursor: "pointer",
            width: "100%",
          }}
        >
          <SlidersHorizontal size={12} strokeWidth={1.5} />
          Filters {badge !== "ALL" && `· ${badge}`}
        </button>

        {showFilter && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {BADGE_OPTIONS.map((b) => (
              <button
                key={b}
                onClick={() => setBadge(b)}
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  padding: "7px 14px",
                  background: badge === b ? "#F5A623" : "transparent",
                  color: badge === b ? "#000" : "#9f8e7a",
                  border:
                    badge === b ? "1px solid #F5A623" : "1px solid #2a2a2a",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {b === "ALL" ? "All" : b}
              </button>
            ))}
          </div>
        )}
      </div>

      {/*Desktop Table*/}
      <div className="desktop-only" style={{ flexDirection: "column" }}>
        <CollectorsTable collectors={filtered} />
      </div>

      {/*MOBILE CARDS LIST*/}
      <div className="mobile-only" style={{ flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 ? (
          <p
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 11,
              color: "#9f8e7a44",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              textAlign: "center",
              padding: "32px 0",
            }}
          >
            No collectors found
          </p>
        ) : (
          filtered.map((c, i) => (
            <CollectorMobileCard key={c.wallet} collector={c} index={i} />
          ))
        )}

        {/* Load more for mobile only */}
        {filtered.length > 0 && (
          <button
            style={{
              width: "100%",
              padding: "14px 0",
              marginTop: 8,
              fontFamily: "var(--f-mono)",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "#F5A623",
              background: "transparent",
              border: "none",
              borderBottom: "1px solid #F5A62366",
              cursor: "pointer",
            }}
          >
            Load More →
          </button>
        )}
      </div>

      {/* Empty state desktop */}
      {filtered.length === 0 && (
        <div
          className="desktop-only"
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 160,
          }}
        >
          <p
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 11,
              color: "#9f8e7a44",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
            }}
          >
            No collectors match your filter
          </p>
        </div>
      )}
    </div>
  );
}
