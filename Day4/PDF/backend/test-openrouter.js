import dotenv from "dotenv";
import { OpenRouter } from "@openrouter/sdk";

dotenv.config();

const client = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,

  // 🔴 REQUIRED by OpenRouter
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // can be anything in dev
    "X-Title": "PDF Chat AI",                 // your app name
  },
});

async function run() {
  try {
    const res = await client.chat.send({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [
        { role: "user", content: "Say hello" }
      ],
    });

    console.log(res.choices[0].message.content);
  } catch (err) {
    console.error("OpenRouter Error:", err);
  }
}

run();
