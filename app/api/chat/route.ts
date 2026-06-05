import { NextRequest, NextResponse } from "next/server";
import type { CreatorStats } from "@/lib/zora";

interface ChatRequest {
  message: string;
  stats: CreatorStats;
  history?: Array<{ role: string; text: string }>;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest;
    const { message, stats } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!stats?.wallet) {
      return NextResponse.json(
        { error: "Creator stats required" },
        { status: 400 }
      );
    }

    const nlpEndpoint =
      process.env.NLP_AGENT_URL || "https://zora-wrapped-back.onrender.com/query";

    // ✅ AbortController replaces the invalid `timeout` option
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    let nlpResponse: Response;
    try {
      nlpResponse = await fetch(nlpEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: message,
          wallet: stats.wallet,
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

    if (nlpData.error) {
      return NextResponse.json(
        {
          reply: `I couldn't understand that query. Try asking about: "Who is my biggest whale?", "What's my total volume?", or "How many unique collectors do I have?"`,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        reply: nlpData.result || "Unable to process your query.",
      },
      { status: 200 }
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
      { status: 500 }
    );
  }
}