"use client";

import { ErrorBoundary } from "react-error-boundary";
import type { ReactNode } from "react";

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: unknown;
  resetErrorBoundary: () => void;
}) {
  const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";

  return (
    <div
      role="alert"
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        textAlign: "center",
        gap: 24,
      }}
    >
      <div
        style={{ width: 40, height: 1, background: "#F5A623", opacity: 0.6 }}
      />

      <p
        style={{
          fontFamily: "var(--f-mono)",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "#ff4444",
        }}
      >
        Runtime Error
      </p>

      <h2
        style={{
          fontFamily: "var(--f-serif)",
          fontWeight: 700,
          fontSize: "clamp(22px, 4vw, 32px)",
          color: "#e5e2e1",
          lineHeight: 1.2,
          maxWidth: 420,
        }}
      >
        Something went wrong.
      </h2>

      <div
        style={{
          background: "#141414",
          border: "1px solid #ff444433",
          padding: "12px 20px",
          maxWidth: 480,
          width: "100%",
        }}
      >
        <p
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            color: "#ff4444",
            letterSpacing: "0.04em",
            lineHeight: 1.6,
            wordBreak: "break-word",
          }}
        >
          {errorMessage}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={resetErrorBoundary}
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            padding: "11px 24px",
            background: "#F5A623",
            color: "#000",
            border: "none",
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#ffb955")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#F5A623")}
        >
          Try Again
        </button>

        <button
          onClick={() => (window.location.href = "/")}
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            padding: "11px 24px",
            background: "transparent",
            color: "#e5e2e1",
            border: "1px solid #e5e2e155",
            cursor: "pointer",
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
          Go Home
        </button>
      </div>
    </div>
  );
}

export function AppErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Nothing extra needed — ErrorBoundary resets its own state
      }}
      onError={(error, info) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("[AppErrorBoundary]", errorMessage, info.componentStack);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function DashboardErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.href = "/";
      }}
      onError={(error, info) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(
          "[DashboardErrorBoundary]",
          errorMessage,
          info.componentStack,
        );
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function ChartErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div
          style={{
            background: "#141414",
            border: "1px solid #2a2a2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 260,
          }}
        >
          <p
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 11,
              color: "#ff4444",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Chart failed to render.
          </p>
        </div>
      }
      onError={(error) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("[ChartErrorBoundary]", errorMessage);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
