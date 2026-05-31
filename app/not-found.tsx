"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#131313",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Corner brackets (for desktop only)*/}
      <style>{`
        .corner-tl, .corner-tr, .corner-br {
          display: none;
        }
        @media (min-width: 768px) {
          .corner-tl, .corner-tr, .corner-br {
            display: block;
            position: fixed;
            width: 16px;
            height: 16px;
          }
          .corner-tl {
            top: 24px; left: 24px;
            border-top: 1px solid #2a2a2a;
            border-left: 1px solid #2a2a2a;
          }
          .corner-tr {
            top: 24px; right: 24px;
            border-top: 1px solid #2a2a2a;
            border-right: 1px solid #2a2a2a;
          }
          .corner-br {
            bottom: 24px; right: 24px;
            border-bottom: 1px solid #2a2a2a;
            border-right: 1px solid #2a2a2a;
          }
        }

        /* Desktop buttons: side by side */
        .btn-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          max-width: 640px;
          padding: 0 24px;
        }
        @media (min-width: 768px) {
          .btn-group {
            flex-direction: row;
            padding: 0;
            width: auto;
          }
          .btn-primary { width: 280px; }
          .btn-secondary { width: 220px; }
        }

        /* Watermark */
        .watermark {
          position: absolute;
          bottom: -20px;
          left: -40px;
          font-family: var(--f-mono);
          font-weight: 700;
          font-size: clamp(80px, 18vw, 220px);
          color: #e5e2e1;
          opacity: 0.04;
          letter-spacing: -0.02em;
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
          line-height: 1;
        }
        @media (min-width: 768px) {
          .watermark {
            bottom: auto;
            top: 50%;
            left: auto;
            right: -60px;
            transform: translateY(-10%);
            font-size: 220px;
            opacity: 0.05;
          }
        }

        /* Footer bottom border — mobile only */
        .footer-rule {
          display: block;
        }
        @media (min-width: 768px) {
          .footer-rule { display: none; }
        }

        /* Horizontal divider lines — desktop only */
        .divider-top, .divider-bottom {
          display: none;
        }
        @media (min-width: 768px) {
          .divider-top {
            display: block;
            position: fixed;
            top: 220px; left: 0; right: 0;
            height: 1px;
            background: #2a2a2a;
          }
          .divider-bottom {
            display: block;
            position: fixed;
            bottom: 220px; left: 0; right: 0;
            height: 1px;
            background: #2a2a2a;
          }
        }
      `}</style>

      {/* Corner brackets */}
      <div className="corner-tl" />
      <div className="corner-tr" />
      <div className="corner-br" />

      {/* Horizontal dividers (for desktop) */}
      <div className="divider-top" />
      <div className="divider-bottom" />

      {/* Watermark background text */}
      <div className="watermark" aria-hidden>
        ERR_404
      </div>

      {/*Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "60px 24px",
          position: "relative",
          zIndex: 1,
          gap: 0,
        }}
      >
        {/* 404 number */}
        <div
          style={{
            fontFamily: "var(--f-mono)",
            fontWeight: 700,
            fontSize: "clamp(96px, 20vw, 160px)",
            color: "#F5A623",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            marginBottom: 20,
          }}
        >
          404
        </div>

        {/* Amber rule */}
        <div
          style={{
            width: 60,
            height: 1,
            background: "#F5A623",
            opacity: 0.7,
            marginBottom: 28,
          }}
        />

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--f-serif)",
            fontWeight: 600,
            fontSize: "clamp(24px, 4vw, 40px)",
            color: "#e5e2e1",
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          Page not found.
        </h1>

        {/* Body text */}
        <p
          style={{
            fontFamily: "var(--f-sans)",
            fontSize: "clamp(14px, 2vw, 16px)",
            color: "#9f8e7a",
            lineHeight: 1.6,
            maxWidth: 480,
            marginBottom: 44,
          }}
        >
          The wallet you&apos;re looking for doesn&apos;t exist here. It may
          have been disconnected, burned, or moved to a different chain.
        </p>

        {/* Buttons */}
        <div className="btn-group">
          {/* Primary */}
          <Link
            href="/dashboard"
            className="btn-primary"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "16px 28px",
              fontFamily: "var(--f-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              background: "#F5A623",
              color: "#000",
              textDecoration: "none",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#ffb955")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#F5A623")}
          >
            Go to Dashboard
            <span style={{ fontSize: 14 }}>→</span>
          </Link>

          {/* Secondary */}
          <Link
            href="/"
            className="btn-secondary"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px 28px",
              fontFamily: "var(--f-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              background: "transparent",
              color: "#e5e2e1",
              border: "1px solid #e5e2e155",
              textDecoration: "none",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#F5A623";
              e.currentTarget.style.color = "#F5A623";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e2e155";
              e.currentTarget.style.color = "#e5e2e1";
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 1 }}>
        {/* Mobile: top border */}
        <div
          className="footer-rule"
          style={{ height: 1, background: "#2a2a2a" }}
        />

        <div
          style={{
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#9f8e7a",
              opacity: 0.5,
            }}
          >
            Zora Wrapped · Base Network
          </span>
        </div>
      </footer>
    </div>
  );
}
