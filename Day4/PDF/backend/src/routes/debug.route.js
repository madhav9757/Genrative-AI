import express from "express";
import { getAllMetadata } from "../db/vectorStore.js";

const router = express.Router();

/**
 * GET /api/debug/vectors
 * Returns all stored text chunks and their metadata
 */
router.get("/vectors", (req, res) => {
  try {
    const data = getAllMetadata();

    res.json({
      count: data.length,
      entries: data, // array of { text: "...", ... }
    });
  } catch (err) {
    console.error("Debug route error:", err);
    res.status(500).json({ error: "Failed to retrieve vector store" });
  }
});

export default router;
