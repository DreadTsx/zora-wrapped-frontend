"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useCollections } from "@/lib/queries";
import CollectionCard from "./CollectionCard";
import CollectionsToolbar from "./CollectionsToolbar";
import DashboardLoader from "@/components/dashboard/DashboardLoader";
import type { Collection } from "@/lib/zora";

type SortKey = "volume" | "holders" | "price";

function sortCollections(list: Collection[], sort: SortKey): Collection[] {
  return [...list].sort((a, b) => {
    if (sort === "volume") return b.volumeETH - a.volumeETH;
    if (sort === "holders") return b.holders - a.holders;
    if (sort === "price") return b.priceETH - a.priceETH;
    return 0;
  });
}

export default function CollectionsClient() {
  const searchParams = useSearchParams();
  const wallet = searchParams.get("wallet") ?? "";
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("volume");

  // ── React Query hook ────────────────────────────────────────────
  // 🗑️ STATIC: uses fetchCollectionsStatic internally in queries.ts
  // ✅ PRODUCTION: swap queryFn in lib/queries.ts — no change needed here
  const { data: collections, isLoading } = useCollections(wallet);

  const filtered = useMemo(() => {
    if (!collections) return [];
    const searched = search.trim()
      ? collections.filter((c) =>
          c.name.toLowerCase().includes(search.toLowerCase()),
        )
      : collections;
    return sortCollections(searched, sort);
  }, [collections, search, sort]);

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
      {/* ── Page heading + toolbar ─────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Title row */}
        <div>
          <h1
            style={{
              fontFamily: "var(--f-serif)",
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 42px)",
              color: "#e5e2e1",
              lineHeight: 1.1,
            }}
          >
            Collections
          </h1>
          <p
            style={{
              fontFamily: "var(--f-sans)",
              fontSize: 14,
              color: "#9f8e7a88",
              marginTop: 6,
            }}
          >
            All coins you&apos;ve launched on Zora.
          </p>
        </div>

        {/* Toolbar — search + sort */}
        <CollectionsToolbar
          search={search}
          sort={sort}
          onSearch={setSearch}
          onSort={setSort}
        />
      </div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div style={{ height: 1, background: "#2a2a2a" }} />

      {/* ── Grid ────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 240,
          }}
        >
          <p
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#9f8e7a44",
            }}
          >
            No collections found
          </p>
        </div>
      ) : (
        <div className="collections-grid">
          {filtered.map((col, i) => (
            <CollectionCard key={col.id} collection={col} index={i} />
          ))}
        </div>
      )}

      {/* Grid responsive CSS */}
      <style>{`
        .collections-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 1024px) {
          .collections-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 767px) {
          .collections-grid { grid-template-columns: 1fr; gap: 20px; }
        }
      `}</style>
    </div>
  );
}
