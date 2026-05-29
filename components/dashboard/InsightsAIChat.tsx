"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Cpu } from "lucide-react";
import type { CreatorStats } from "@/lib/zora";
import { useSearchParams } from "next/navigation";

type Msg = { role: "user" | "ai"; text: string };

const CHIPS = [
  "Who is my biggest whale?",
  "Project revenue projection",
  "Collector retention",
];

function generateResponse(q: string, stats: CreatorStats): string {
  const ql = q.toLowerCase();
  if (ql.includes("whale") || ql.includes("biggest"))
    return `Your biggest whale is 0x8f...2a1b — largest share of your coins, holding since genesis. Consider messaging them directly to build loyalty.`;
  if (ql.includes("revenue") || ql.includes("projection"))
    return `At +${stats.growth30d}% over 30 days, you're on track for ${(stats.volumeETH * 1.4).toFixed(1)} ETH volume next month. Your best collection drives ~60% of that.`;
  if (ql.includes("retention"))
    return `68.4% of your collectors have held for 30+ days — strong conviction. Only 12% have flipped.`;
  return `${stats.totalMints} total mints · ${stats.volumeETH} ETH volume · ${stats.uniqueHolders} holders. What would you like to dig into?`;
}

export default function InsightsAIChat({ stats }: { stats: CreatorStats }) {
  const searchParams = useSearchParams();
  const wallet = searchParams.get("wallet") ?? "";
  const short = wallet
    ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
    : "0x1234...5678";

  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      text: `System initialized. I've analyzed your wallet ${short}. How can I assist you with your data today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const msgCountRef = useRef(1);

  useEffect(() => {
    // Only scroll when a NEW message is added
    if (msgs.length > msgCountRef.current) {
      msgCountRef.current = msgs.length;
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgs]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setMsgs((p) => [...p, { role: "user", text: text.trim() }]);
    setInput("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setMsgs((p) => [...p, { role: "ai", text: generateResponse(text, stats) }]);
    setLoading(false);
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
      {/* Header */}
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
      </div>

      {/* Chips */}
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
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              padding: "6px 10px",
              border: "1px solid #2a2a2a",
              background: "transparent",
              color: "#9f8e7a",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#F5A623";
              e.currentTarget.style.color = "#F5A623";
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
                lineHeight: 1.6,
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
        {loading && (
          <div style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  background: "#F5A623",
                  opacity: 0.5,
                  animation: "chatPulse 1.2s ease infinite",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
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
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Query your contract..."
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
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || loading}
          style={{
            color: input.trim() ? "#F5A623" : "#2a2a2a",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
          }}
        >
          <Send size={14} strokeWidth={2} />
        </button>
      </div>
      <style>{`@keyframes chatPulse{0%,100%{transform:scaleY(.5);opacity:.3}50%{transform:scaleY(1.4);opacity:1}}`}</style>
    </div>
  );
}
