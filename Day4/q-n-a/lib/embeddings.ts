export async function embed(text: string): Promise<number[]> {
  const res = await fetch("http://localhost:4000/embed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Embedding service error: " + err);
  }

  const data = await res.json();
  return data.embedding;
}
