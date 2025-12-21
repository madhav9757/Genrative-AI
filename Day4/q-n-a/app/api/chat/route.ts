import { NextResponse } from "next/server";
import { embed } from "@/lib/embeddings";
import { index } from "@/lib/pinecone";
import { chatWithReasoning } from "@/lib/openrouter";
import { TOP_K } from "@/utils/constants";

export async function POST(req: Request) {
  const { message } = await req.json();

  // 1️⃣ Embed the user message
  const vector = await embed(message);

  // 2️⃣ Retrieve context from Pinecone
  const results = await index.query({
    vector,
    topK: TOP_K,
    includeMetadata: true,
  });

  const context = results.matches?.map((m) => m.metadata?.text).join("\n");

  // 3️⃣ Prepare conversation messages
  const messages = [
    { role: "system", content: "Answer using the PDF context." },
    { role: "user", content: `Context:\n${context}\n\nQuestion: ${message}` },
  ];

  // 4️⃣ Call OpenRouter LLM with reasoning enabled
  const assistantMessage = await chatWithReasoning(messages);

  return NextResponse.json({
    answer: assistantMessage.content,
    reasoning: assistantMessage.reasoning_details, // preserved reasoning
  });
}
