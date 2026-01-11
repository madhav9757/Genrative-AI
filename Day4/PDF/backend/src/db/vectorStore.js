// In-memory vector store
let store = []; // { vector: [...], meta: { text: "...", ... } }

// Add a vector + metadata
export function addVectors(vector, meta) {
  store.push({ vector, meta });
}

// Search for top-k nearest neighbors using cosine similarity
export function searchVectors(queryVector, k = 5) {
  return store
    .map(item => ({
      score: cosineSimilarity(queryVector, item.vector),
      ...item.meta,
    }))
    .sort((a, b) => b.score - a.score) // sort descending
    .slice(0, k);
}

// Return all stored metadata (for debugging)
export function getAllMetadata() {
  return store.map(item => item.meta);
}

// Cosine similarity helper
function cosineSimilarity(a, b) {
  let dot = 0,
    na = 0,
    nb = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }

  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
