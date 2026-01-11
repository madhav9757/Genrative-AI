import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";
import { addVectors } from "../db/vectorStore.js";

dotenv.config();

if (!process.env.HF_TOKEN) {
  throw new Error("HF_TOKEN missing");
}

const hf = new InferenceClient(process.env.HF_TOKEN);
const MODEL = "sentence-transformers/all-MiniLM-L6-v2";
const VECTOR_SIZE = 384;

export async function embedAndStoreChunks(chunks) {
  let stored = 0;

  for (const chunk of chunks) {
    try {
      const embeddingRaw = await retryEmbedding(chunk);
      const vector = Array.isArray(embeddingRaw[0])
        ? embeddingRaw[0]
        : embeddingRaw;

      if (!vector || vector.length !== VECTOR_SIZE) continue;

      const normalized = normalizeVector(vector);
      addVectors(normalized, { text: chunk });
      stored++;
    } catch (err) {
      console.error("Embedding failed:", err.message);
    }
  }

  console.log(`✅ Stored ${stored}/${chunks.length} embeddings`);
}

async function retryEmbedding(text, retries = 2) {
  try {
    return await hf.featureExtraction({
      model: MODEL,
      inputs: text,
    });
  } catch (err) {
    if (retries === 0) throw err;
    await new Promise((r) => setTimeout(r, 1000));
    return retryEmbedding(text, retries - 1);
  }
}

function normalizeVector(vector) {
  const norm = Math.sqrt(vector.reduce((s, v) => s + v * v, 0));
  return vector.map((v) => v / norm);
}
