import express from "express";
import { searchVectors, normalizeVector } from "../db/vectorStore.js";
import { generateAnswer } from "../services/llm.service.js";
import { InferenceClient } from "@huggingface/inference";
import "dotenv/config";

const router = express.Router();
const hf = new InferenceClient(process.env.HF_TOKEN);
const MODEL = "sentence-transformers/all-MiniLM-L6-v2";

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });

    console.log(`\n💬 Query: "${question}"`);

    // 1. Get Query Embedding
    const embeddingRaw = await hf.featureExtraction({ model: MODEL, inputs: question });
    const queryVector = Array.isArray(embeddingRaw[0]) ? embeddingRaw[0] : embeddingRaw;

    // 2. Search Store
    const results = searchVectors(queryVector, 4);
    console.log(`🔍 Retrieved ${results.length} relevant context chunks`);

    if (results.length === 0) {
      return res.json({ answer: "I have no documents to reference. Please upload a PDF first.", sources: [] });
    }

    // 3. Generate Answer
    const context = results.map((r, i) => `[Doc ${i + 1}]: ${r.text}`).join("\n\n");
    const answer = await generateAnswer(context, question);

    console.log("✅ Response generated successfully\n");

    res.json({
      answer,
      sources: results.map((r, i) => ({
        id: i + 1,
        preview: r.text.slice(0, 100) + "...",
        score: r.score.toFixed(4)
      })),
    });
  } catch (err) {
    console.error("❌ Chat Route Error:", err.message);
    res.status(500).json({ error: "Failed to process chat request" });
  }
});

export default router;