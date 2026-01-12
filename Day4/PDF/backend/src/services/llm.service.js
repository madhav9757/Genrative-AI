import ollama from "ollama";

/**
 * Configuration for the LLM Service
 * Llama 3.2 is optimized for 1B and 3B sizes, making it perfect for RAG.
 */
const MODEL = "llama3.2";

/**
 * Generates an answer based on retrieved document context and a user question.
 * @param {string} context - The text chunks retrieved from the vector store.
 * @param {string} question - The user's input question.
 * @returns {Promise<string>} - The AI generated response.
 */
export async function generateAnswer(context, question) {
  try {
    // 1. Prepare a strict system prompt to prevent 'hallucinations'
    const systemPrompt = `
      You are a professional research assistant. 
      Use the provided CONTEXT to answer the user's QUESTION.
      
      RULES:
      1. Answer ONLY using the information in the CONTEXT.
      2. If the answer is not in the context, say: "I'm sorry, I don't have information about that in the uploaded documents."
      3. Keep your response professional, concise, and structured.
      4. Do not mention that you are an AI or that you are looking at context; just provide the answer.
    `.trim();

    // 2. Call Ollama Chat API
    const response = await ollama.chat({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `CONTEXT:\n${context}\n\nQUESTION: ${question}`,
        },
      ],
      options: {
        temperature: 0.1, // Low temperature for factual consistency
        num_ctx: 4096, // Sufficient context window for several PDF chunks
        top_p: 0.9, // Helps with diversity while staying focused
      },
    });

    // 3. Extract and return the message content
    const answer = response.message.content.trim();
    return answer || "I encountered an empty response from the local model.";
  } catch (err) {
    // 4. Robust Error Handling for Local LLM
    console.error("\n❌ [Ollama Error]:", err.message);

    // Specific error for missing models
    if (err.message.includes("not found")) {
      return `Error: The model '${MODEL}' is not installed. Please run 'ollama pull ${MODEL}' in your terminal.`;
    }

    // Specific error for connection issues
    if (
      err.message.includes("fetch failed") ||
      err.message.includes("ECONNREFUSED")
    ) {
      return "Error: Could not connect to Ollama. Please ensure the Ollama desktop app is running.";
    }

    return "The AI assistant is currently experiencing technical difficulties locally.";
  }
}
