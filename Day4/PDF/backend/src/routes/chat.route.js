import express from "express";
import { searchVectors } from "../db/vectorStore.js";
import { generateAnswer } from "../services/llm.service.js";
import { InferenceClient } from "@huggingface/inference";
import "dotenv/config";

const router = express.Router();

// Get question embedding
const hf = new InferenceClient(process.env.HF_TOKEN);
const MODEL = "sentence-transformers/all-MiniLM-L6-v2";

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question)
      return res.status(400).json({ error: "Question is required" });

    const embeddingRaw = await embedQuery(question);
    const queryEmbedding = Array.isArray(embeddingRaw[0])
      ? embeddingRaw[0]
      : embeddingRaw;

    if (!queryEmbedding || queryEmbedding.length !== 384) {
      return res.status(500).json({ error: "Invalid embedding" });
    }

    const normalizedQuery = normalizeVector(queryEmbedding);

    const results = searchVectors(normalizedQuery, 10);
    if (!results.length) {
      return res.json({ answer: "No relevant info found.", sources: [] });
    }

    const context = results
      .map((r, i) => `Source ${i + 1}:\n${r.text.slice(0, 500)}`)
      .join("\n\n");

    const answer = await generateAnswer(context, question);

    res.json({
      answer,
      sources: results.map((r, i) => ({
        id: i + 1,
        preview: r.text.slice(0, 120) + "...",
        relevance: r.score,
      })),
    });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

function normalizeVector(vector) {
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  return vector.map((v) => v / norm);
}

export default router;
