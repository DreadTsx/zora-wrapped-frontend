"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Cpu, AlertCircle } from "lucide-react";
import type { CreatorStats } from "@/lib/zora";

type Msg = { role: "user" | "ai"; text: string };

const CHIPS = [
  "Who is my biggest whale?",
  "Project revenue projection",
  "Collector retention",
];

export default function InsightsAIChat({ stats }: { stats: CreatorStats }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      text: `System initialized. I've analyzed your contract ${
        stats.wallet
          ? `${stats.wallet.slice(0, 6)}...${stats.wallet.slice(-4)}`
          : "0x8f...2a1b"
      }. How can I assist you with your data today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const msgCountRef = useRef(1);

  useEffect(() => {
    if (msgs.length > msgCountRef.current) {
      msgCountRef.current = msgs.length;
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgs]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Msg = { role: "user", text: text.trim() };
    setMsgs((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          stats,
          // Pass conversation history for context (exclude the system greeting)
          history: msgs.slice(1),
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (data.error) throw new Error(data.error); // server sends real error message now

      setMsgs((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      const errMsg =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      setError(errMsg);
      // Restore the user message so they can retry
      setMsgs((prev) => prev.slice(0, -1));
      setInput(text.trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#141414",
        border: "1px solid #2a2a2a",
      }}
    >
      {/*  Header  */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "16px 18px",
          borderBottom: "1px solid #2a2a2a",
          flexShrink: 0,
        }}
      >
        <Cpu size={15} strokeWidth={1.5} style={{ color: "#F5A623" }} />
        <span
          style={{
            fontFamily: "var(--f-serif)",
            fontWeight: 600,
            fontSize: 20,
            color: "#e5e2e1",
          }}
        >
          Insights AI
        </span>
        {/* Live indicator */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              background: "#22c55e",
              borderRadius: "50%",
              animation: "aiPulse 2s ease infinite",
            }}
          />
          <span
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#22c55e55",
            }}
          >
            Live
          </span>
        </div>
      </div>

      {/* Suggested chips  */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          padding: "12px 16px",
          borderBottom: "1px solid #2a2a2a",
          flexShrink: 0,
        }}
      >
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => send(c)}
            disabled={loading}
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              padding: "6px 10px",
              border: "1px solid #2a2a2a",
              background: "transparent",
              color: "#9f8e7a",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              opacity: loading ? 0.4 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.borderColor = "#F5A623";
                e.currentTarget.style.color = "#F5A623";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#2a2a2a";
              e.currentTarget.style.color = "#9f8e7a";
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/*  Messages  */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          minHeight: 0,
        }}
      >
        {msgs.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "90%",
                fontFamily: "var(--f-sans)",
                fontSize: 13,
                lineHeight: 1.65,
                color: m.role === "user" ? "#e5e2e1" : "#d7c3ae",
                background: m.role === "user" ? "#1c1b1b" : "transparent",
                border: m.role === "user" ? "1px solid #2a2a2a" : "none",
                padding: m.role === "user" ? "10px 14px" : "0",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}

        {/* Loading dots */}
        {loading && (
          <div
            style={{
              display: "flex",
              gap: 4,
              alignItems: "center",
              paddingLeft: 2,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  background: "#F5A623",
                  animation: "chatPulse 1.2s ease infinite",
                  animationDelay: `${i * 0.2}s`,
                  opacity: 0.5,
                }}
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 8,
              padding: "10px 12px",
              border: "1px solid #ff4444",
              background: "transparent",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <AlertCircle
                size={13}
                strokeWidth={1.5}
                style={{ color: "#ff4444", flexShrink: 0, marginTop: 1 }}
              />
              <span
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 10,
                  color: "#ff4444",
                  letterSpacing: "0.06em",
                  lineHeight: 1.5,
                }}
              >
                {error}
              </span>
            </div>
            <button
              onClick={() => setError(null)}
              style={{
                background: "none",
                border: "none",
                color: "#ff444488",
                cursor: "pointer",
                fontSize: 14,
                flexShrink: 0,
                lineHeight: 1,
                padding: 0,
              }}
            >
              ×
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/*  Input  */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          borderTop: "1px solid #2a2a2a",
          flexShrink: 0,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
          placeholder="Query your contract..."
          disabled={loading}
          style={{
            flex: 1,
            fontFamily: "var(--f-mono)",
            fontSize: 12,
            color: "#e5e2e1",
            background: "transparent",
            border: "none",
            outline: "none",
            opacity: loading ? 0.5 : 1,
          }}
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || loading}
          style={{
            color: input.trim() && !loading ? "#F5A623" : "#2a2a2a",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            transition: "color 0.15s",
          }}
        >
          <Send size={14} strokeWidth={2} />
        </button>
      </div>

      <style>{`
        @keyframes chatPulse {
          0%, 100% { transform: scaleY(0.5); opacity: 0.3; }
          50%       { transform: scaleY(1.4); opacity: 1; }
        }
        @keyframes aiPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
