# 🧠 Embedding CLI Bot — Using Hugging Face Transformers (JavaScript)

This guide walks you through creating a **CLI-based embedding generator** using the model **Xenova/all-MiniLM-L6-v2**.

---

## 🚀 Overview
This CLI bot allows you to:
- Input any sentence or paragraph
- Generate sentence embeddings locally
- See the embedding dimension and preview the first few vector values
- Run completely offline after the first model download

---

## ⚙️ Setup Instructions

### 1️⃣ Initialize Project
```bash
npm init -y
```

### 2️⃣ Install Dependencies
```bash
npm install @huggingface/transformers
```

### 3️⃣ Create File — `embed-cli.js`
```js
#!/usr/bin/env node
import readline from "readline";
import { pipeline } from "@huggingface/transformers";

async function main() {
  console.log("🧠 Initializing embedding model (Xenova/all-MiniLM-L6-v2)...");
  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  console.log("✅ Model loaded! Type any text to get its embedding.\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askInput = () => {
    rl.question("📝 Enter text (or type 'exit' to quit): ", async (text) => {
      if (text.toLowerCase() === "exit") {
        console.log("👋 Exiting. Goodbye!");
        rl.close();
        return;
      }

      console.log("⚙️ Generating embedding...");
      try {
        const embedding = await extractor(text, { pooling: "mean", normalize: true });
        console.log(`✅ Embedding generated! Dimension: ${embedding[0].length}`);
        console.log("🔢 Preview:", embedding[0].slice(0, 10), "...");
      } catch (err) {
        console.error("❌ Error generating embedding:", err.message);
      }

      console.log("\n");
      askInput();
    });
  };

  askInput();
}

main().catch((err) => console.error("❌ Initialization Error:", err));
```

---

### 4️⃣ Run the CLI
```bash
node embed-cli.js
```

---

## 🕒 Notes

- The first run will **download the model**, so it may take **30–90 seconds**.
- Subsequent runs are **offline and instant**.
- Each embedding is a **dense numerical vector** (usually 384 dimensions for MiniLM).

---

## 💡 Optional Improvements
- Add **sentence similarity** comparison mode.
- Save embeddings to `.json` files for reuse.
- Integrate with **LangChain** for Q&A or document search.

---

**Author:** *Your Name*  
**Date:** 2025  
**Topic:** Generative AI — Embedding Models & CLI Tools
