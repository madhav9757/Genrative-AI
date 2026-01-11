import { InferenceClient } from "@huggingface/inference";
import "dotenv/config";

const hf = new InferenceClient(process.env.HF_TOKEN);
const MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

export async function generateAnswer(context, question) {
  const prompt = `
You are a helpful AI assistant.
Answer ONLY using the context below.
If the answer is not present, say "I don't know".

Context:
${context}

Question:
${question}

Answer:
`;

  try {
    const res = await hf.textGeneration({
      model: MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.2,
      },
    });

    const output = res.generated_text || "";
    return output.split("Answer:").pop().trim() || "I don't know";
  } catch (err) {
    console.error("LLM error:", err.message);
    return "I don't know";
  }
}
