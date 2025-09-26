import { ChatOpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { question } = await req.json();

    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo", // or "gpt-4"
      temperature: 0.3,
    });

    const response = await model.invoke(question);

    return NextResponse.json({ answer: response.content });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

