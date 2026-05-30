"use client";

import { useState } from "react";
import { useCurrency } from "@/providers/CurrencyProvider";
import type { Collection } from "@/lib/zora";

/* Unique gradient per card */
const THUMBNAILS: Record<string, string> = {
  "1": "linear-gradient(135deg, #1a1a1a 0%, #2a2420 40%, #1c1510 100%)",
  "2": "linear-gradient(160deg, #0e0e0e 0%, #1a1208 50%, #2a1f00 100%)",
  "3": "linear-gradient(120deg, #131313 0%, #1c1c14 45%, #24200a 100%)",
  "4": "linear-gradient(145deg, #0e0e0e 0%, #1a1410 60%, #201a10 100%)",
  "5": "linear-gradient(155deg, #131313 0%, #181410 50%, #201c14 100%)",
  "6": "linear-gradient(130deg, #0e0e0e 0%, #1e1800 55%, #2a2000 100%)",
};

/* Subtle SVG pattern overlay on thumbnail */
function ThumbnailPattern({ id }: { id: string }) {
  const grad = THUMBNAILS[id] ?? THUMBNAILS["1"];
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: grad,
        overflow: "hidden",
      }}
    >
      {/* Diagonal grain lines */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.07,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`p-${id}`}
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="40"
              x2="40"
              y2="0"
              stroke="#F5A623"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#p-${id})`} />
      </svg>
      {/* Amber glow in corner */}
      <div
        style={{
          position: "absolute",
          bottom: -20,
          right: -20,
          width: 120,
          height: 120,
          background:
            "radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default function CollectionCard({
  collection,
  index,
}: {
  collection: Collection;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const { format } = useCurrency();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#141414",
        border: `1px solid ${hovered ? "#F5A623" : "#2a2a2a"}`,
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s ease",
        opacity: 0,
        animation: "cardIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards",
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/*  Thumbnail  */}
      {/* For Desktop */}
      <div
        className="card-thumb-desktop"
        style={{ height: 180, flexShrink: 0, overflow: "hidden" }}
      >
        <ThumbnailPattern id={collection.id} />
      </div>
      {/* For Mobile */}
      <div
        className="card-thumb-mobile"
        style={{ height: 200, flexShrink: 0, overflow: "hidden" }}
      >
        <ThumbnailPattern id={collection.id} />
      </div>

      {/* Card body */}
      <div
        style={{
          padding: "18px 20px 20px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* Name */}
        <h3
          style={{
            fontFamily: "var(--f-serif)",
            fontWeight: 700,
            fontSize: 22,
            color: "#e5e2e1",
            lineHeight: 1.1,
            marginBottom: 6,
          }}
        >
          {collection.name}
        </h3>

        {/* Amber rule */}
        <div
          style={{
            width: 32,
            height: 1,
            background: "#F5A623",
            opacity: 0.6,
            marginBottom: 16,
          }}
        />

        {/* Stats */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: 0, flex: 1 }}
        >
          {[
            {
              label: "Current Price",
              value: format(collection.priceETH),
              amber: true,
            },
            {
              label: "Total Volume",
              value: format(collection.volumeETH),
              amber: false,
            },
            {
              label: "Holders",
              value: collection.holders.toLocaleString(),
              amber: false,
            },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 0",
                borderBottom: i < arr.length - 1 ? "1px solid #2a2a2a" : "none",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#9f8e7a77",
                }}
              >
                {row.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: row.amber ? "#F5A623" : "#e5e2e1",
                  letterSpacing: "0.02em",
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <button
          style={{
            marginTop: 18,
            width: "100%",
            padding: "11px 0",
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            background: hovered ? "#ffb955" : "#F5A623",
            color: "#000",
            border: "none",
            cursor: "pointer",
            transition: "background 0.2s ease",
          }}
        >
          View Analytics
        </button>
      </div>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* Desktop: show desktop thumb, hide mobile thumb */
        .card-thumb-desktop { display: block; }
        .card-thumb-mobile  { display: none; }
        @media (max-width: 767px) {
          .card-thumb-desktop { display: none; }
          .card-thumb-mobile  { display: block; }
        }
      `}</style>
    </div>
  );
}
