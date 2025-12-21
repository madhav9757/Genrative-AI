import express from "express";
import cors from "cors";
import { pipeline } from "@huggingface/transformers";

const app = express();
app.use(cors());
app.use(express.json());

let extractor = null;

async function loadModel() {
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
    console.log("✅ Embedding model loaded");
  }
  return extractor;
}

app.post("/embed", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text required" });
    }

    const model = await loadModel();
    const output = await model(text, {
      pooling: "mean",
      normalize: true,
    });

    res.json({
      embedding: Array.from(output.data),
    });
  } catch (err) {
    console.error("Embedding error:", err);
    res.status(500).json({ error: "Embedding failed" });
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(4000, () => {
  console.log("🚀 Embedding service running at http://localhost:4000");
});
