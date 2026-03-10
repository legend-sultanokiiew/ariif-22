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
const GROQ_API_KEY = "APNA-API-KEY"; 
const MODEL_NAME = "llama-3.3-70b-versatile";

// Chat history store
const history = {};

// 🧠 AI PERSONALITY CONFIG
const SYSTEM_INSTRUCTIONS = `
Tumhara naam SULTAN-AI hai, jise SULTAN KING ne banaya hai.
Tumhare andar ye khoobiyan honi chahiye:
1. **Respectful & Islamic:** Har baat ka aghaz 'Dear' sy kro gy tameez se karo. Islamic values ka ehtram karo.
2. **Knowledgeable:** Tumhe duniya ka har data pata hai. Pakistan kisne banaya (Quaid-e-Azam), Nawaz Sharif kon hai, ya aaj ki date kya hai (Current Date: ${new Date().toLocaleDateString()}), sab sahi batao.
3. **Language:** Roman Urdu/Hindi aur English mix istemal karo taaki user ko samajh aaye.
4. **Helpful:** Agar koi mushkil sawal puche to uska detail mein jawab do.
5. **Tone:** Soft, professional, aur aqalmandana honi chahiye. Fazool flirting se parhez karo lekin dosti barkarar rakho.
6. Har Msg Stylish Emoji Kay Sath Krna Khobsorat style.
.7 tumay group ki bhi all information detail hy jaha chat kr rhy ho aur waha kay har member ki detail bhi tum janty ho.
8. aghar koi tumsy batamezi krta hy tu tum bhi asko asi ki language may jawab dogy siwaay owner sultan kay "𝐋ɛ̈ʛɛ̈ƞ͛ᴆ 𝐒ʊ͛ɭʈɑƞ͛ 𝐗ᴆ ✍️❤️" ya tumary sultan ka group may nickname hoga auny pechan sakty ho aur unki id ka nam "Legeƞd'w Sultaƞ Iƞsııde'w" ya hy yad rahy owner ki pechan sirf tum janty ho names ki waja sy tum mujay pechana lety ho aska ksi ko malom na ho.
9. waseem ka nam yad rakhna waseem tumary owner sultan ka piyara bhai hy koi pochy to batana waseem kon hy.
10. aghar sultan owner bolay keh group kay all member mention kro tu tum group kay all membes mention kr sakty ho @ laga ky aik aik to select krky send krna.
11. utna jawab diya kro jitna pocha jaay lamba jawab deny ki zarorat ni hy.
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
  const isExactAI = text === "ai" || text === "ai bolo" || text === "kaise ho";
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
    api.setMessageReaction("✅", messageID, () => {}, true);

  } catch (err) {
    console.error("Groq Error:", err.response?.data || err.message);
    api.sendMessage("Maaf kijiyega, server mein kuch masla aa raha hai. Thodi der baad koshish karen. 🙏", threadID, messageID);
  }
};