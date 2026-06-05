import { NextRequest, NextResponse } from "next/server";
import type { CreatorStats, TopBuyer, Collector, Collection } from "@/lib/zora";

interface ChatRequest {
  message: string;
  stats: CreatorStats;
  history?: Array<{ role: string; text: string }>;
}

/**
 * POST /api/chat
 * Accepts a natural language query and returns AI-generated insights
 * about the user's contract/creator data
 */
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

    // Call the NLP agent endpoint
    const nlpEndpoint =
      process.env.NLP_AGENT_URL || "http://localhost:3001/query";

    const nlpResponse = await fetch(nlpEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: message,
        wallet: stats.wallet,
      }),
    });

    if (!nlpResponse.ok) {
      throw new Error(`NLP Agent error: ${nlpResponse.status}`);
    }

    const nlpData = await nlpResponse.json();

    // Handle NLP agent response
    if (nlpData.error) {
      // NLP agent couldn't understand the query
      return NextResponse.json(
        {
          reply: `I couldn't understand that query. Try asking about: "Who is my biggest whale?", "What's my total volume?", or "How many unique collectors do I have?"`,
        },
        { status: 200 }
      );
    }

    // Return the NLP agent's response
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
          errorMsg.includes("ECONNREFUSED") ||
          errorMsg.includes("fetch failed")
            ? "NLP service unavailable. Please try again."
            : errorMsg,
      },
      { status: 500 }
    );
  }
}
