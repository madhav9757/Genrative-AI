import fs from "fs";
import { extractText } from "unpdf";
import { embedAndStoreChunks } from "./embedding.service.js";

export async function processPDF(filePath) {
  try {
    // 1️⃣ Read PDF file
    const buffer = fs.readFileSync(filePath);

    // 2️⃣ Convert Buffer → Uint8Array (REQUIRED)
    const uint8Array = new Uint8Array(buffer);

    // 3️⃣ Extract text
    let extracted = await extractText(uint8Array);

    // ✅ Normalize to string
    let text = normalizeText(extracted);

    // 5️⃣ Chunk text
    const chunks = chunkText(text, 500, 50);

    // 6️⃣ Generate embeddings & store
    await embedAndStoreChunks(chunks);

    // 7️⃣ Clean up file after processing
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return { success: true, chunks: chunks.length };
  } catch (err) {
    console.error("PDF processing failed:", err);
    throw err;
  }
}

function cleanText(text) {
  return text.replace(/\s+/g, " ").replace(/\n+/g, "\n").trim();
}

function chunkText(text, chunkSize = 500, overlap = 50) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;
    chunks.push(text.slice(start, end));
    start = end - overlap;
  }

  return chunks;
}

function normalizeText(extracted) {
  if (typeof extracted === "string") {
    return extracted;
  }

  if (Array.isArray(extracted)) {
    return extracted.join(" ");
  }

  if (typeof extracted === "object" && extracted !== null) {
    // common unpdf shape
    if (Array.isArray(extracted.text)) {
      return extracted.text.join(" ");
    }
    if (typeof extracted.text === "string") {
      return extracted.text;
    }
  }

  // fallback
  return String(extracted);
}
