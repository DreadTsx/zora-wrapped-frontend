"use client";

import { Search } from "lucide-react";

type SortKey = "volume" | "holders" | "price";

interface Props {
  search: string;
  sort: SortKey;
  onSearch: (v: string) => void;
  onSort: (v: SortKey) => void;
}

export default function CollectionsToolbar({
  search,
  sort,
  onSearch,
  onSort,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      {/* Search input */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid #2a2a2a",
          paddingBottom: 6,
          flex: "1 1 200px",
          maxWidth: 280,
          transition: "border-color 0.2s",
        }}
        onFocusCapture={(e) => (e.currentTarget.style.borderColor = "#F5A623")}
        onBlurCapture={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
      >
        <Search
          size={12}
          strokeWidth={1.5}
          style={{ color: "#9f8e7a55", flexShrink: 0 }}
        />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search collections..."
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

      {/* Sort dropdown */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "#9f8e7a55",
            whiteSpace: "nowrap",
          }}
        >
          Sort by:
        </span>
        <select
          value={sort}
          onChange={(e) => onSort(e.target.value as SortKey)}
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#e5e2e1",
            background: "#141414",
            border: "1px solid #2a2a2a",
            padding: "6px 10px",
            outline: "none",
            cursor: "pointer",
            appearance: "none",
            WebkitAppearance: "none",
            paddingRight: 28,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%239f8e7a'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 8px center",
          }}
        >
          <option value="volume">Volume</option>
          <option value="holders">Holders</option>
          <option value="price">Price</option>
        </select>
      </div>
    </div>
  );
}
