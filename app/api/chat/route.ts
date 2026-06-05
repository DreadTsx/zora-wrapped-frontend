import { NextRequest, NextResponse } from "next/server";
import type { CreatorStats } from "@/lib/zora";

interface ChatRequest {
  message: string;
  stats: CreatorStats;
  history?: Array<{ role: string; text: string }>;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "https://zora-wrapped-back.onrender.com";

// Shortens any 0x address to  0x1234...abcd
function shortAddr(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

// Zora coin amounts come back as raw 18-decimal token units (wei-scale).
// e.g. 2.28e+21 → 2.28
function fromWei(amount: number): number {
  return amount / 1e18;
}

// ─── REST helpers (use FrontendService which resolves wallet → coin internally) ───

async function fetchTopBuyers(wallet: string): Promise<string> {
  const res = await fetch(
    `${API_BASE}/api/creator/${wallet}/top-buyers?top_n=5`,
  );
  if (!res.ok) throw new Error(`top-buyers: ${res.status}`);

  const buyers: Array<{
    rank: number;
    wallet: string;
    percentage: number;
    amount_eth: number;
  }> = await res.json();

  if (!buyers.length) return "No buyers found for this creator yet.";

  const lines = buyers.map(
    (b) =>
      `#${b.rank}  ${shortAddr(b.wallet)}  —  ${b.percentage.toFixed(1)}%  (${fromWei(b.amount_eth).toFixed(2)} coins)`,
  );
  console.log(
    "[debug] raw amount_eth:",
    buyers.map((b) => b.amount_eth),
  );
  return `Top buyers:\n${lines.join("\n")}`;
}

async function fetchVolume(wallet: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/creator/${wallet}`);
  if (!res.ok) throw new Error(`creator-stats: ${res.status}`);

  const stats: CreatorStats = await res.json();
  return `Total volume: ${stats.volume_eth.toFixed(2)} ETH across all coins.`;
}

async function fetchHolderCount(wallet: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/creator/${wallet}`);
  if (!res.ok) throw new Error(`creator-stats: ${res.status}`);

  const stats: CreatorStats = await res.json();
  return `Unique collectors: ${stats.unique_holders.toLocaleString()}`;
}

// ─── Intent router ────────────────────────────────────────────────────────────

type IntentFn = (wallet: string) => Promise<string>;

function matchIntent(message: string): IntentFn | null {
  const lower = message.toLowerCase().trim();

  if (
    lower.includes("biggest whale") ||
    lower.includes("who is my biggest") ||
    lower.includes("top whale") ||
    lower.includes("top buyer") ||
    lower.includes("biggest collector")
  )
    return fetchTopBuyers;

  if (
    lower.includes("total volume") ||
    lower.includes("what is my volume") ||
    lower.includes("my volume") ||
    lower.includes("volume")
  )
    return fetchVolume;

  if (
    lower.includes("unique collector") ||
    lower.includes("how many collector") ||
    lower.includes("how many holder") ||
    lower.includes("unique holder") ||
    lower.includes("how many unique")
  )
    return fetchHolderCount;

  return null;
}

// ─── Fallback: NLP /query endpoint (coin address already resolved above) ──────

async function askNlp(message: string, wallet: string): Promise<string> {
  const nlpEndpoint =
    process.env.NLP_AGENT_URL ?? "https://zora-wrapped-back.onrender.com/query";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  let nlpResponse: Response;
  try {
    nlpResponse = await fetch(nlpEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: `${message} ${wallet}`, wallet }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!nlpResponse.ok) throw new Error(`NLP Agent: ${nlpResponse.status}`);

  const data = await nlpResponse.json();
  if (data.error) return ""; // signal to use fallback message
  return data.result ?? "";
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest;
    const { message, stats } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }
    if (!stats?.wallet) {
      return NextResponse.json(
        { error: "Creator stats required" },
        { status: 400 },
      );
    }

    const wallet = stats.wallet;
    console.log("[chat] message:", message, "| wallet:", wallet);

    // 1. Try a known intent → call REST directly (wallet→coin resolved server-side)
    const intentFn = matchIntent(message);
    if (intentFn) {
      const reply = await intentFn(wallet);
      return NextResponse.json({ reply });
    }

    // 2. Unknown intent → try the NLP endpoint
    const nlpReply = await askNlp(message, wallet);
    if (nlpReply) {
      return NextResponse.json({ reply: nlpReply });
    }

    // 3. Total fallback
    return NextResponse.json({
      reply: `I couldn't answer that. Try: "Who is my biggest whale?", "What is my total volume?", or "How many unique collectors?"`,
    });
  } catch (error) {
    console.error("[chat] error:", error);
    const msg =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      {
        error:
          msg.includes("ECONNREFUSED") || msg.includes("fetch failed")
            ? "NLP service unavailable. Please try again."
            : msg.includes("abort") || msg.includes("AbortError")
              ? "Request timed out. Please try again."
              : msg,
      },
      { status: 500 },
    );
  }
}
