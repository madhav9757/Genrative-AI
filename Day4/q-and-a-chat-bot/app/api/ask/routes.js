import { ChatOpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";
import { initVectorStore } from "@/lib/vectorStore";

export async function POST(req) {
  try {
    const { question } = await req.json();

    // Step 1: Embed + retrieve context
    const vectorStore = await initVectorStore();
    const retriever = vectorStore.asRetriever();
    const relevantDocs = await retriever.getRelevantDocuments(question);

    // Step 2: Build a prompt with retrieved context
    const context = relevantDocs.map(doc => doc.pageContent).join("\n");
    const prompt = `Answer the question using the following context:\n\n${context}\n\nQuestion: ${question}`;

    // Step 3: Send to your LLM (via OpenRouter/OpenAI)
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo", 
      temperature: 0.3,
    });

    const response = await model.invoke(prompt);

    return NextResponse.json({ answer: response.content });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
