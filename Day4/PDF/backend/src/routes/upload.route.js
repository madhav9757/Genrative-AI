import express from "express";
import multer from "multer";
import { processPDF } from "../services/pdf.service.js";

const router = express.Router();

// Configures local storage for incoming files
const upload = multer({ dest: "uploads/" });

/**
 * POST /api/upload/pdf
 * Expects a multipart/form-data with a "file" field
 */
router.post("/pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Process extraction, chunking, and embedding
    const result = await processPDF(req.file.path);
    
    res.json({ 
      success: true, 
      message: "PDF processed and vectors stored",
      chunks: result.chunks 
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

export default router;