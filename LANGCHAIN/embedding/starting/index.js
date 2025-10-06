#!/usr/bin/env node
import readline from "readline";
import { pipeline } from "@huggingface/transformers";

async function main() {
  console.log("🧠 Initializing embedding model (Xenova/all-MiniLM-L6-v2)...");
  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );
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
        const embedding = await extractor(text, {
          pooling: "mean",
          normalize: true,
        });
        console.log(
          `✅ Embedding generated! Dimension: ${embedding[0].length}`
        );
        console.log("🔢 Preview:", embedding[0].slice(0, 10), "..."); // show first 10 values
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
