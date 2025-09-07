<h1 align="center">🤖 Node.js CLI Chatbot</h1>

<p align="center">
  A sleek and interactive <b>command-line chatbot</b> built with <b>Node.js</b> and the <b>OpenRouter API</b>.  
  Enjoy real-time streaming responses, a typing animation, and a clean, color-coded chat UI right in your terminal.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/OpenRouter-API-blue?style=for-the-badge&logo=openai" alt="OpenRouter">
  <img src="https://img.shields.io/badge/CLI-Chatbot-orange?style=for-the-badge" alt="CLI Chatbot">
  <img src="https://img.shields.io/github/license/your-username/cli-chatbot?style=for-the-badge" alt="License">
</p>

---

## ✨ Features  

- 🟡 **User-friendly CLI UI** with color-coded messages  
- 🤖 **Streaming AI responses** (bot types word by word)  
- ⏳ **Animated typing indicator** using spinners  
- 🔄 **Continuous conversation history**  
- ❌ Graceful **exit/quit** command  
- 🌈 Uses **chalk** for styling and **log-update** for smooth rendering  

---

## 📦 Tech Stack  

- [Node.js](https://nodejs.org/)  
- [OpenRouter API](https://openrouter.ai) (via OpenAI client)  
- [chalk](https://www.npmjs.com/package/chalk) – terminal colors  
- [cli-spinners](https://www.npmjs.com/package/cli-spinners) – spinner animations  
- [log-update](https://www.npmjs.com/package/log-update) – live terminal rendering  
- [dotenv](https://www.npmjs.com/package/dotenv) – environment variables  

---

## ⚙️ Installation  

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-username/cli-chatbot.git
   cd cli-chatbot
   ```

2. **Install dependencies**  
   ```bash
   npm install openai chalk cli-spinners log-update dotenv readline
   ```

3. **Set up your API key**  
   Create a `.env` file in the root directory:  
   ```ini
   OPENROUTER_API_KEY=your_api_key_here
   ```

---

## 🚀 Usage  

Run the chatbot with:  
```bash
node index.js
```

### Example Session  

```
🎉 CLI Chatbot started! Type 'exit' to quit.
🤖 Bot: Hey there! 👋 How can I help you today?
🟡 You: Tell me a joke
🤖 Bot: Why don’t programmers like nature?  
Because it has too many bugs! 🐛
🟡 You:
```

---

## 📂 Project Structure  

```
cli-chatbot/
│── index.js          # Main chatbot code
│── package.json      # Dependencies & scripts
│── .env              # API key (ignored in git)
│── README.md         # Project documentation
```

---

## 🛠️ Customization  

- **Change AI model** inside `index.js`:  
  ```js
  model: "mistralai/mistral-7b-instruct:free"
  ```

- **Update chatbot personality** by editing the system role:  
  ```js
  { role: "system", content: "You are a helpful assistant." }
  ```

---

## 🔑 API Key Setup  

1. Get a free key from [OpenRouter](https://openrouter.ai).  
2. Add it to `.env`:  
   ```ini
   OPENROUTER_API_KEY=sk-xxxxxxx
   ```

---

## 🌟 Future Improvements  

- 📜 Save chat history to a `chat.log` file  
- 🎨 Add themes (dark / neon mode)  
- 🧠 Support for multiple AI models  
- 🌐 Optional internet-connected responses  

---

## 📜 License  

MIT License © 2025  

<p align="center">Built with ❤️ using Node.js + OpenRouter API</p>
