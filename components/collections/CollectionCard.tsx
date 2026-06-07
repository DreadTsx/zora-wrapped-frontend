"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useCurrency } from "@/providers/CurrencyProvider";
import type { Collection } from "@/lib/zora";

function Lightbox({
  src,
  name,
  onClose,
}: {
  src: string;
  name: string;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.88)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "#141414",
          border: "1px solid #2a2a2a",
          color: "#9f8e7a",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          zIndex: 1001,
        }}
      >
        <X size={16} strokeWidth={1.5} />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          maxWidth: "min(680px, 90vw)",
          maxHeight: "80vh",
          width: "100%",
          aspectRatio: "1 / 1",
          border: "1px solid #2a2a2a",
          overflow: "hidden",
        }}
      >
        <Image
          src={src}
          alt={name}
          fill
          sizes="680px"
          style={{ objectFit: "contain" }}
          unoptimized
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--f-serif)",
          fontSize: 16,
          color: "#e5e2e1",
          whiteSpace: "nowrap",
          maxWidth: "80vw",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {name}
      </div>
    </div>
  );
}

function Thumbnail({
  src,
  name,
  onClick,
}: {
  src: string | null;
  name: string;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  // Fallback image
  if (!src || errored) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #1a1a1a 0%, #2a2420 40%, #1c1510 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 10,
            color: "#9f8e7a33",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          No image
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        cursor: "zoom-in",
        overflow: "hidden",
      }}
    >
      {/* Shimmer while the images are loading */}
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg,#1c1b1b 25%,#2a2a2a 50%,#1c1b1b 75%)",
            backgroundSize: "200% 100%",
            animation: "thumbShimmer 1.4s infinite",
            zIndex: 1,
          }}
        />
      )}

      <Image
        src={src}
        alt={name}
        fill
        sizes="(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 33vw"
        style={{
          objectFit: "cover",
          transition: "transform 0.3s ease",
          transform: "scale(1)",
        }}
        unoptimized
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLImageElement).style.transform =
            "scale(1.04)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")
        }
      />

      {/* Expand the image */}
      <div
        className="thumb-hint"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s",
          zIndex: 2,
        }}
      >
        <span
          className="thumb-hint-label"
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "#fff",
            background: "rgba(0,0,0,0.55)",
            padding: "5px 10px",
            opacity: 0,
            transition: "opacity 0.2s",
          }}
        >
          View full
        </span>
      </div>
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { format } = useCurrency();

  return (
    <>
      {lightboxOpen && collection.thumbnail && (
        <Lightbox
          src={collection.thumbnail}
          name={collection.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}

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
        {/* Thumbnail*/}
        <div
          style={{
            height: 200,
            flexShrink: 0,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Thumbnail
            src={collection.thumbnail}
            name={collection.name}
            onClick={() => collection.thumbnail && setLightboxOpen(true)}
          />
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
              fontSize: 20,
              color: "#e5e2e1",
              lineHeight: 1.15,
              marginBottom: 6,
              // long names wrap instead of overflow
              wordBreak: "break-word",
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
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              flex: 1,
            }}
          >
            {[
              {
                label: "Current Price",
                value: format(collection.price_eth),
                amber: true,
              },
              {
                label: "Total Volume",
                value: format(collection.volume_eth),
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
                  borderBottom:
                    i < arr.length - 1 ? "1px solid #2a2a2a" : "none",
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

          {/* CTA */}
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
      </div>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes thumbShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .thumb-hint:hover {
          background: rgba(0,0,0,0.28) !important;
        }
        .thumb-hint:hover .thumb-hint-label {
          opacity: 1 !important;
        }
      `}</style>
    </>
  );
}
