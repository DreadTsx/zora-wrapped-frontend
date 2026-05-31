import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { message, stats, history = [] } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentHistory = history.slice(-6).map((msg: any) => ({
      role: msg.role === "ai" ? "assistant" : "user",
      content: msg.text,
    }));

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 220,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `You are an expert onchain analytics assistant for a Zora creator dashboard called "Zora Wrapped".
You have access to this creator's real on-chain stats:

- Total Mints: ${stats?.totalMints ?? "N/A"}
- Volume: ${stats?.volumeETH ?? "N/A"} ETH
- Unique Holders: ${stats?.uniqueHolders ?? "N/A"}
- 30-Day Growth: +${stats?.growth30d ?? "N/A"}%
- Wallet: ${stats?.wallet ? stats.wallet.slice(0, 10) + "..." : "N/A"}

Rules:
- Answer in 2-3 sentences max. Be concise and sharp.
- Always reference the creator's actual numbers when relevant.
- Be specific and actionable — give real advice, not generic platitudes.
- Speak like a confident analyst, not a chatbot.
- If asked about Zora, Base, or the broader ecosystem, answer knowledgeably.
- Never say you lack access to data — work with what you have.`,
        },
        ...recentHistory,
        { role: "user", content: message.trim() },
      ],
    });

    const reply =
      completion.choices[0]?.message?.content ??
      "Unable to process that query. Try again.";

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error("Chat API error:", err);

    // Surface a meaningful message based on the actual error
    let userMessage = "Something went wrong. Please try again.";

    if (err instanceof Error) {
      const msg = err.message.toLowerCase();
      if (msg.includes("rate limit") || msg.includes("429")) {
        userMessage = "Rate limit reached. Wait a few seconds and try again.";
      } else if (
        msg.includes("api key") ||
        msg.includes("401") ||
        msg.includes("403")
      ) {
        userMessage = "Invalid API key. Check GROQ_API_KEY in .env.local.";
      } else if (msg.includes("decommissioned") || msg.includes("model")) {
        userMessage = "Model error. Check the model name in route.ts.";
      } else if (msg.includes("context") || msg.includes("token")) {
        userMessage = "Message too long. Try a shorter question.";
      }
    }

    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}
