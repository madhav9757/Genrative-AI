export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { parsePDF } from "@/lib/pdf";
import { chunkText } from "@/lib/chunk";
import { embed } from "@/lib/embeddings";
import { index } from "@/lib/pinecone";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "File missing" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, error: "Only PDF allowed" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await parsePDF(buffer);

    const chunks = chunkText(text);

    const vectors = await Promise.all(
      chunks.map(async (chunk, i) => ({
        id: `chunk-${Date.now()}-${i}`,
        values: await embed(chunk),
        metadata: { text: chunk },
      }))
    );

    await index.upsert(vectors);

    return NextResponse.json({
      success: true,
      chunks: chunks.length,
    });
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
