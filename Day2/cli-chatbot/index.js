import readline from "readline";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🤖 CLI Chatbot (type 'exit' to quit)\n");

let conversationHistory = [];

const chat = async (userInput) => {
  conversationHistory.push({ role: "user", content: userInput });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...conversationHistory,
      ],
    });

    const reply = response.choices[0].message.content;
    conversationHistory.push({ role: "assistant", content: reply });
    console.log(`Bot: ${reply}\n`);
    promptUser();
  } catch (error) {
    console.error("Error:", error.message);
    promptUser();
  }
};

const promptUser = () => {
  rl.question("You: ", (input) => {
    if (input.toLowerCase() === "exit") {
      console.log("Goodbye!");
      rl.close();
    } else {
      chat(input);
    }
  });
};

promptUser();
