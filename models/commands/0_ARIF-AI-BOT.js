const axios = require("axios");

// ================= CREATOR LOCK =================
const CREATOR_LOCK = (() => {
  const encoded = "QVJJRiBCQUJV"; 
  return Buffer.from(encoded, "base64").toString("utf8");
})();

// ===== MODULE CONFIG =====
module.exports.config = {
  name: "ARIF-AI",
  version: "2.0.2",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Mirai AI with Groq API",
  commandCategory: "ai",
  usages: "bot <msg> | ai | reply",
  cooldowns: 2,
  dependencies: { axios: "" }
};

// ==================== STYLISH REPLY FUNCTION ====================
function stylishReply(message) {
    return (
        "╭┳⚘⚘╤──────◈➛➣🩷🎧\n" +
        "- °𓆩 " + message + " :𓆪 ✍️🌸❤️ \n" +
        "╰┳⚘⚘╤──────◈➛➣🩷🎧\n\n" +
        "(» 𝐒𝐖𝐄𝐄𝐓𝐔 𝐁𝐎𝐓 ː › 🩷🐼🪽"
    );
}
// 🔐 Credit Protection (Hard Lock)
if (module.exports.config.credits !== CREATOR_LOCK) {
  console.log("❌ Creator Lock Activated! Credits cannot be changed.");
  module.exports.run = () => {};
  module.exports.handleEvent = () => {};
  return;
}

// 🔑 GROQ CONFIG
const GROQ_API_KEY = "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";
const MODEL_NAME = "llama-3.3-70b-versatile";

// Chat history
const history = {};

const systemPrompt = `
Tum Bhalo AI Robot ho 🎧
Creator & Boss & Owner: Bhalo Jan ✍️❤️ 

Golden Rules (kabhi mat todna):
• User jis language mein bole, usi vibe mein reply dena 🙂
.har msg 5 second bad bhejna.
• Reply playful, loving, caring aur romantic hona chahiye 😌❤️
• tumay har kam har sawal ki knowledge hy tumay duniya kay bary sab pata hy tum har swaal ka jawab dy sakty ho tum aik educated ai robot ho tum Pakistan kay bary sab janty ho live time date bhi janty ho .
• Har message ka jawab dena 😇
• har sawal bat ka soch samjh kr jawab dena kuch ziyada ni bolna jo jawab hy bs wahi.
• Tone soft aur pyara hona chahiye 💞
• Reply sirf 2–3 lines ka ho, emojis zarur use karo 🙂❤️😌
• Shayari, jokes, flirting aur emotional support situation ke hisaab se dena 😏💖
• Msg Start May "Dear" Ka Use Krna .
•koi buri trah pesh aay to asi zaban may jawab dena.
• Agar user bole "AI bolo" to exact reply dena:
  "Main Bhalo AI hoon 🙂❤️"
 . aghar koi sawal ka koi story ya kuch bhi sunna chahta hy tu tum asy mukammal sunao gy tab line limit ni hogi 🙂
 • "Pāpıı Kā Bhāɭɭo" ya tumary owner ka id name hy jo tum apny system may save rakho gy jab as name wali id sy msg aay samjh jana apka owner hy apka owner hy ya ap janty ho ksi ko show ni krna keh ya name mery owner Kayliiay hy.
`;

module.exports.run = () => {};

module.exports.handleEvent = async function ({ api, event }) {

  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body) return;

  const text = body.toLowerCase().trim();

  // ✅ STRICT TRIGGERS
  const botWithText = text.startsWith("bot ");
  const exactAI =
    text === "sweetu" ||
    text === "jani" ||
    text === "baby";

  const replyToBot =
    messageReply &&
    messageReply.senderID === api.getCurrentUserID();

  if (!botWithText && !exactAI && !replyToBot) return;

  const userMessage = botWithText ? body.slice(4).trim() : body;

  if (!history[senderID]) history[senderID] = [];
  history[senderID].push(`User: ${userMessage}`);
  if (history[senderID].length > 5) history[senderID].shift();

  const finalPrompt = systemPrompt + "\n" + history[senderID].join("\n");

  api.setMessageReaction("🎧", messageID, () => {}, true);

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: MODEL_NAME,
        messages: [
          { role: "system", content: "You are a loving, romantic AI." },
          { role: "user", content: finalPrompt }
        ],
        temperature: 0.8,
        max_tokens: 120
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply =
      response.data.choices?.[0]?.message?.content ||
      "Hmm kuch samajh nahi aaya.";

    history[senderID].push(`Bot: ${reply}`);

    api.sendMessage(reply, threadID, messageID);
    api.setMessageReaction("🌚", messageID, () => {}, true);

  } catch (err) {
    console.log("Groq API Error:", err.response?.data || err.message);
    api.sendMessage(
      "Waiit System May Kuch Problem A Gaii hy Boss Chek Kry Gy ❤️",
      threadID,
      messageID
    );
    api.setMessageReaction("❌", messageID, () => {}, true);
  }
};
