import { Pinecone } from "@pinecone-database/pinecone";
import records from "./records.js";

const pc = new Pinecone({
  apiKey:
    "pcsk_38XbZK_AUMzEoaSp9GsJJL6dprSKz65qCdy87SaUJ5yCrqh6oKtDTWTRLnj9LcZBLZ218z",
});

const indexName = "quickstart-js";
// await pc.createIndexForModel({
//   name: indexName,
//   cloud: "aws",
//   region: "us-east-1",
//   embed: {
//     model: "llama-text-embed-v2",
//     fieldMap: { text: "chunk_text" },
//   },
//   waitUntilReady: true,
// });

const index = pc.index(indexName).namespace("example-namespace");
// await index.upsertRecords(records);
// await new Promise((resolve) => setTimeout(resolve, 10000));

// View stats for the index
const stats = await index.describeIndexStats();
console.log("📊 Index Stats:", stats);

// Define the query
const query = "Famous historical structures and monuments";

// Search the dense index
const results = await index.searchRecords({
  query: {
    topK: 10,
    inputs: { text: query },
  },
  rerank: {
    model: "bge-reranker-v2-m3",
    topN: 10,
    rankFields: ["chunk_text"],
  },
});

// Print the results
results.result.hits.forEach((hit) => {
  console.log(
    `id: ${hit.id}, score: ${hit._score.toFixed(2)}, category: ${
      hit.fields.category
    }, text: ${hit.fields.chunk_text}`
  );
});

// Delete the index
await pc.deleteIndex(indexName);