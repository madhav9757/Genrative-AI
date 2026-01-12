// In-memory vector store
let store = []; 

export function addVectors(vector, meta) {
  store.push({ vector, meta });
}

export function searchVectors(queryVector, k = 5) {
  // Ensure query is normalized if not already
  const normalizedQuery = normalizeVector(queryVector);

  return store
    .map(item => ({
      score: cosineSimilarity(normalizedQuery, item.vector),
      ...item.meta,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

export function getAllMetadata() {
  return store.map(item => item.meta);
}

export function normalizeVector(vector) {
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  return norm === 0 ? vector : vector.map((v) => v / norm);
}

function cosineSimilarity(a, b) {
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }
  // Since we store normalized vectors, dot product is the cosine similarity
  return dot;
}