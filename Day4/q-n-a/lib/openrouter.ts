// lib/openrouter.ts
export async function chatWithReasoning(messages: any[]) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b:free",
      messages: messages,
      reasoning: { enabled: true },
    }),
  });

  const data = await res.json();
  const message = data.choices[0].message;

  return message; // contains content + reasoning_details
}
