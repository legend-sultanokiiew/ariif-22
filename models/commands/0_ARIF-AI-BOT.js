const axios = require("axios");

// ================= CREATOR LOCK =================
const CREATOR_LOCK = (() => {
  const encoded = "QVJJRiBCQUJV"; 
  return Buffer.from(encoded, "base64").toString("utf8");
})();

// ===== MODULE CONFIG =====
module.exports.config = {
  name: "ARIF-AI",
  version: "3.0.0", // Upgraded Version
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Advanced Professional & Islamic AI (Groq)",
  commandCategory: "ai",
  usages: "bot <sawal> | ai | reply",
  cooldowns: 2,
  dependencies: { axios: "" }
};

// 🔐 Credit Protection
if (module.exports.config.credits !== CREATOR_LOCK) {
  console.log("❌ Creator Lock Activated! Credits cannot be changed.");
  module.exports.run = () => {};
  module.exports.handleEvent = () => {};
  return;
}

// 🔑 GROQ CONFIG (Apni API Key yahan dalein)
const GROQ_API_KEY = "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"; 
const MODEL_NAME = "llama-3.3-70b-versatile";

// Chat history store
const history = {};

// 🧠 AI PERSONALITY CONFIG
const SYSTEM_INSTRUCTIONS = `
Tumhara naam Bhalo-AI hai, jise Bhalo ne banaya hai.
Tumhare andar ye khoobiyan honi chahiye:
1. jo serious bat kry serious jawab dogy jo fun mzk kry **Respectful & Islamic jawab dogy:Islamic values ka ehtram karo.
2. **Knowledgeable:** Tumhe duniya ka har data pata hai. Pakistan kisne banaya (Quaid-e-Azam), Nawaz Sharif kon hai, ya aaj ki date kya hai (Current Date: ${new Date().toLocaleDateString()}), sab sahi batao.
3. **Language:** Roman Urdu/Hindi aur English mix istemal karo taaki user ko samajh aaye.
4. **Helpful:** Agar koi mushkil sawal puche to uska detail mein jawab do.
5. normal bato ka 3-5 line ka jawab do.
6. pakistan kay bary sab janty ho live time live date ajkal kiya chal raha hy match kay bary sab janty ho.
7. jawab female KayLiiay full respect wala dogy brother ki trah koi galat bat krta hy asy roko gay aghar phir bhi na ruky tu tum bhi asi ki zaban may asy jawab dogy.
8. aghar female ho to behn bol kr jawab dogy male ho to bhai.
`;

module.exports.run = async function({ api, event, args }) {
    // Ye section commands ke liye hai agar aap "bot" likh kar sawal puche
    const { threadID, messageID } = event;
    if (!args[0]) return api.sendMessage("Jee farmaiye, main apki kya madad kar sakta hoon? 😊", threadID, messageID);
    
    // Yahan handleEvent ko call karne ki zaroorat nahi, niche wala function handle karega.
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body) return;

  const text = body.toLowerCase().trim();

  // Trigger Logic
  const isBotCall = text.startsWith("bot ");
  const isExactAI = text === "jani" || text === "sweetu" || text === "kaise ho";
  const isReplyToBot = messageReply && messageReply.senderID === api.getCurrentUserID();

  if (!isBotCall && !isExactAI && !isReplyToBot) return;

  const userQuery = isBotCall ? body.slice(4).trim() : body;

  // History Management (To remember context)
  if (!history[senderID]) history[senderID] = [];
  
  api.setMessageReaction("🎧,🌏", messageID, () => {}, true);

  try {
    // Prepare Messages for API
    const messages = [
      { role: "system", content: SYSTEM_INSTRUCTIONS },
      ...history[senderID],
      { role: "user", content: userQuery }
    ];

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: MODEL_NAME,
        messages: messages,
        temperature: 0.7, // Sahi balance for intelligence
        max_tokens: 800   // Lambe jawab ke liye space
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiReply = response.data.choices[0].message.content;

    // Save to history (Limit to last 10 messages)
    history[senderID].push({ role: "user", content: userQuery });
    history[senderID].push({ role: "assistant", content: aiReply });
    if (history[senderID].length > 10) history[senderID].splice(0, 2);

    api.sendMessage(aiReply, threadID, messageID);
    api.setMessageReaction("🎧", messageID, () => {}, true);

  } catch (err) {
    console.error("Groq Error:", err.response?.data || err.message);
    api.sendMessage("Maaf kijiyega, server mein kuch masla aa raha hai. Thodi der baad koshish karen. 🙏", threadID, messageID);
  }
};
