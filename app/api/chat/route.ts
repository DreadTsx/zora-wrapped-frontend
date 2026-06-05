import { NextRequest, NextResponse } from "next/server";
import type { CreatorStats } from "@/lib/zora";

interface ChatRequest {
  message: string;
  stats: CreatorStats;
  history?: Array<{ role: string; text: string }>;
}

// Maps the UI chip labels / common short questions to backend-parseable queries.
// The backend NLP (nlp.rs) matches on keywords like "holder", "volume 24h",
// "top buyer / whale / biggest" — AND requires a 0x address in the string.
// We inject the wallet after each mapping so the regex in nlp.rs can find it.
function buildBackendQuery(userMessage: string, wallet: string): string {
  const lower = userMessage.toLowerCase().trim();

  // Chip: "Who is my biggest whale?" → TopBuyers intent
  if (
    lower.includes("biggest whale") ||
    lower.includes("who is my biggest") ||
    lower.includes("top whale") ||
    lower.includes("biggest collector")
  ) {
    return `Show top 5 buyers of ${wallet}`;
  }

  // Chip: "What is my total volume?" → Volume24h intent
  // nlp.rs needs both "volume" AND "24h" to match Volume24h.
  // Without "24h" it falls through to TokenSummary (which still works).
  if (
    lower.includes("total volume") ||
    lower.includes("what is my volume") ||
    lower.includes("my volume")
  ) {
    return `What is the 24h volume for ${wallet}`;
  }

  // Chip: "How many unique collectors?" → HolderCount intent
  if (
    lower.includes("unique collector") ||
    lower.includes("how many collector") ||
    lower.includes("how many holder") ||
    lower.includes("unique holder")
  ) {
    return `How many holders does ${wallet} have`;
  }

  // Generic: if the user typed something but forgot the address, inject it.
  // The backend will still try to parse intent from their words.
  if (!wallet || userMessage.includes("0x")) {
    // Address already in message, or no wallet — send as-is
    return userMessage;
  }

  return `${userMessage} ${wallet}`;
}

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

    const nlpEndpoint =
      process.env.NLP_AGENT_URL ||
      "https://zora-wrapped-back.onrender.com/query";

    // Build the query the backend NLP can actually parse
    const backendQuery = buildBackendQuery(message, stats.wallet);

    console.log("[API] Original message:", message);
    console.log("[API] Backend query:", backendQuery);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    let nlpResponse: Response;
    try {
      nlpResponse = await fetch(nlpEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: backendQuery,
          wallet: stats.wallet, // kept for forward-compat if backend ever uses it
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    console.log("[API] NLP response status:", nlpResponse.status);

    if (!nlpResponse.ok) {
      throw new Error(`NLP Agent error: ${nlpResponse.status}`);
    }

    const nlpData = await nlpResponse.json();

    // Backend returns { error: "..." } when parse_user_input returns None
    if (nlpData.error) {
      return NextResponse.json(
        {
          reply: `I couldn't answer that. Try: "Who is my biggest whale?", "What is my total volume?", or "How many unique collectors?"`,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        reply: nlpData.result || "Unable to process your query.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[API] Chat error:", error);

    const errorMsg =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      {
        error:
          errorMsg.includes("ECONNREFUSED") || errorMsg.includes("fetch failed")
            ? "NLP service unavailable. Please try again."
            : errorMsg.includes("abort") || errorMsg.includes("AbortError")
              ? "Request timed out. Please try again."
              : errorMsg,
      },
      { status: 500 },
    );
  }
}
