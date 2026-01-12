import { InferenceClient } from "@huggingface/inference";
import "dotenv/config";

const hf = new InferenceClient(process.env.HF_TOKEN);
const MODEL = "HuggingFaceH4/zephyr-7b-beta";

export async function generateAnswer(context, question) {

  try {
    const result = await hf.textGeneration({
      model: MODEL,
      inputs: "hey wsp",
      parameters: {
        max_new_tokens: 256,
        temperature: 0.2,
        top_p: 0.9,
        repetition_penalty: 1.1,
      },
    });

    let answer = result.generated_text || "";

    answer = answer
      .replace(prompt, "")
      .replace(/<\/s>/g, "")
      .trim();

    return answer || "I don't have enough information to answer that.";
  } catch (err) {
    console.error("LLM error:", err.message);
    return "I encountered an error while processing your question.";
  }
}
