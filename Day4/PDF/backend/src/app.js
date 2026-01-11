import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import Routes
import uploadRoutes from "./routes/upload.route.js";
import chatRoutes from "./routes/chat.route.js";
import debugRoutes from "./routes/debug.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Allow all origins for dev. Restrict in production if needed
app.use(express.json()); // Essential for chat POST requests

// Serve uploaded files (optional)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Mount Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/debug", debugRoutes);

// Global Error Handler (recommended)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
