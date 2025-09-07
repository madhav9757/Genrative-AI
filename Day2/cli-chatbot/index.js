import OpenAI from "openai";
import readline from "readline";
import "dotenv/config";
import chalk from "chalk";
import cliSpinners from "cli-spinners";
import logUpdate from "log-update";

// --- Config ---
const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  console.error(chalk.red.bold("❌ OPENROUTER_API_KEY is not set."));
  process.exit(1);
}

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey,
  defaultHeaders: {
    "HTTP-Referer": "https://example.com", // change to your site
    "X-Title": "CLI Chatbot",
  },
});

// --- State ---
const messages = [];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "",
});

let spinnerInterval = null;
let spinnerIndex = 0;
const spinner = cliSpinners.dots;
let isBotTyping = false;

// --- UI ---
function renderMessages() {
  let output = "";
  messages.forEach(msg => {
    if (msg.role === "user") {
      output += chalk.bold.yellow("🟡 You: ") + msg.content + "\n";
    } else {
      output += chalk.bold.cyan("🤖 Bot: ") + msg.content + "\n";
    }
  });
  return output;
}

function startSpinner() {
  if (isBotTyping) return;
  isBotTyping = true;
  spinnerIndex = 0;

  spinnerInterval = setInterval(() => {
    const frame = spinner.frames[spinnerIndex = (spinnerIndex + 1) % spinner.frames.length];
    logUpdate(renderMessages() + chalk.cyan(`🤖 Bot is typing ${frame}`));
  }, spinner.interval);
}

function stopSpinner() {
  if (!isBotTyping) return;
  isBotTyping = false;
  clearInterval(spinnerInterval);
  spinnerInterval = null;

  logUpdate(renderMessages() + chalk.bold.yellow("🟡 You: "));
}

// --- Chat Logic (Streaming Response) ---
async function chatTurn(input) {
  if (["exit", "quit"].includes(input.trim().toLowerCase())) {
    logUpdate.clear();
    console.log(chalk.yellow.bold("\n👋 Chatbot: Goodbye!"));
    rl.close();
    return;
  }

  if (!input.trim()) {
    logUpdate(renderMessages() + chalk.bold.yellow("🟡 You: "));
    return;
  }

  messages.push({ role: "user", content: input.trim() });
  startSpinner();

  try {
    // Create streaming response
    const stream = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [{ role: "system", content: "You are a helpful assistant." }, ...messages],
      stream: true,
    });

    stopSpinner();

    let botMessage = "";
    messages.push({ role: "assistant", content: "" });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || "";
      botMessage += delta;
      messages[messages.length - 1].content = botMessage;

      logUpdate(renderMessages() + chalk.bold.yellow("🟡 You: "));
    }

    // Final render
    logUpdate(renderMessages() + chalk.bold.yellow("🟡 You: "));

  } catch (e) {
    stopSpinner();
    console.error(chalk.red("\n❌ Error:"), e.message || e);
    messages.pop(); // rollback last user message
  }
}

// --- Event Listeners ---
rl.on("line", chatTurn);

// --- Greeting ---
console.log(chalk.green.bold("🎉 CLI Chatbot started! Type 'exit' to quit.\n"));
messages.push({ role: "assistant", content: "Hey there! 👋 How can I help you today?" });
logUpdate(renderMessages() + chalk.bold.yellow("🟡 You: "));
