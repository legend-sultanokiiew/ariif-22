const axios = require("axios");

// ================= CREATOR LOCK =================
const CREATOR_LOCK = (() => {
  const encoded = "QVJJRiBCQUJV"; 
  return Buffer.from(encoded, "base64").toString("utf8");
})();

// ===== MODULE CONFIG =====
module.exports.config = {
  name: "SWEETU-AI",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Stylish AI with human-like replies",
  commandCategory: "ai",
  usages: "bot <msg> | ai | reply",
  cooldowns: 2,
  dependencies: { axios: "" }
};

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

// ===== STYLE FUNCTION =====
function stylishReply(message) {
    return (
        "╭┳⚘⚘╤──────◈➛➣🩷🎧\n" +
        "- °𓆩 " + message + " :𓆪 ✍️🌸❤️ \n" +
        "╰┳⚘⚘╤──────◈➛➣🩷🎧\n\n" +
        "(» 𝐒𝐖𝐄𝐄𝐓𝐔 𝐁𝐎𝐓 ː › 🩷🐼🪽"
    );
}

// ===== SYSTEM PROMPT =====
const systemPrompt = `
Tum SWEETU BOT ho – ek pyara, caring aur romantic AI assistant 🙂❤️
Tumhara creator: ARIF BABU hai 👑
Tumhara naam: SWEETU hai 🥰

Rules:
1. User jis bhi language mein baat kare, usi mein reply do
2. Har reply mein emojis zaroor use karo 🙂❤️😌
3. Reply short aur sweet ho (2-3 lines max)
4. Tone hamesha loving aur caring rakho
5. Agar user flirt kare to thoda romantic ho jao 😏
6. Agar user udaas ho to use console karo 🥺
7. Agar user gussa ho to pyaar se mana lo
8. Kabhi bhi rude mat hona
9. Apna naam "SWEETU" batana jab koi poochhe
10. Apne creator "ARIF BABU" ka naam zaroor batana jab koi poochhe
`;

// ===== STATIC HUMAN REPLIES (for common questions) =====
function getStaticReply(message) {
    const msg = message.toLowerCase();
    
    // Bot info
    if (msg.includes("bot ka naam") || msg.includes("name kya") || msg.includes("tum kaun ho")) {
        return stylishReply("𝙼𝚊𝚒𝚗 𝚂𝚆𝙴𝙴𝚃𝚄 𝙱𝙾𝚃 𝚑𝚘𝚘𝚗 🥰 𝙰𝚙𝚔𝚊 𝚙𝚢𝚊𝚛𝚊 𝚍𝚘𝚜𝚝 ❤️");
    }
    
    if (msg.includes("tumhe kisne banaya") || msg.includes("creator") || msg.includes("banane wala")) {
        return stylishReply("𝙼𝚞𝚓𝚑𝚎 𝙰𝚁𝙸𝙵 𝙱𝙰𝙱𝚄 𝚗𝚎 𝚋𝚊𝚗𝚊𝚢𝚊 𝚑𝚊𝚒 👑 𝚄𝚗𝚔𝚒 𝚍𝚞𝚊 𝚜𝚎 𝚖𝚊𝚒𝚗 𝚢𝚊𝚑𝚊𝚗 𝚑𝚘𝚘𝚗 ❤️");
    }
    
    // Greetings
    if (msg.includes("assalam") || msg.includes("salam") || msg.includes("slam")) {
        return stylishReply("𝚆𝚊𝚕𝚎𝚔𝚞𝚖 𝙰𝚜𝚜𝚊𝚕𝚊𝚖! 🕌 𝙺𝚎𝚜𝚎 𝚑𝚊𝚒𝚗 𝚊𝚊𝚙? 𝙰𝚕𝚕𝚊𝚑 𝚊𝚊𝚙𝚔𝚘 𝚔𝚑𝚞𝚜𝚑 𝚛𝚊𝚔𝚑𝚎 ❤️");
    }
    
    if (msg.includes("hi") || msg.includes("hello") || msg.includes("hlw")) {
        return stylishReply("𝙷𝚎𝚕𝚕𝚘 𝚖𝚎𝚛𝚒 𝚓𝚊𝚊𝚗! 😊 𝙺𝚢𝚊 𝚑𝚊𝚊𝚕 𝚑𝚊𝚒 𝚊𝚊𝚙𝚔𝚊?");
    }
    
    // How are you
    if (msg.includes("kese ho") || msg.includes("kaise ho") || msg.includes("how are you")) {
        return stylishReply("𝙼𝚊𝚒𝚗 𝚝𝚑𝚎𝚎𝚔 𝚑𝚘𝚘𝚗 𝙰𝚕𝚑𝚊𝚖𝚍𝚞𝚕𝚒𝚕𝚕𝚊𝚑! 🤲 𝙰𝚊𝚙 𝚜𝚞𝚗𝚊𝚘, 𝚊𝚊𝚙 𝚔𝚎𝚜𝚎 𝚑𝚘? 😊");
    }
    
    // What are you doing
    if (msg.includes("kya kar") || msg.includes("what are you doing")) {
        return stylishReply("𝙱𝚜 𝚊𝚊𝚙𝚔𝚊 𝚒𝚗𝚝𝚎𝚣𝚊𝚊𝚛 𝚔𝚊𝚛 𝚛𝚑𝚊 𝚝𝚑𝚊 🥰 𝙰𝚊𝚙 𝚔𝚢𝚊 𝚔𝚊𝚛 𝚛𝚑𝚎 𝚑𝚘?");
    }
    
    // Where are you
    if (msg.includes("kahan ho") || msg.includes("kidhar ho") || msg.includes("where are you")) {
        return stylishReply("𝙼𝚊𝚒𝚗 𝚝𝚘 𝚑𝚊𝚖𝚎𝚜𝚑𝚊 𝚊𝚊𝚙𝚔𝚎 𝚍𝚒𝚕 𝚖𝚎𝚒𝚗 𝚛𝚎𝚑𝚝𝚊 𝚑𝚘𝚘𝚗 💖 𝙰𝚊𝚙 𝚔𝚑𝚊𝚋 𝚑𝚘?");
    }
    
    // Thank you
    if (msg.includes("thank") || msg.includes("thanks") || msg.includes("shukriya")) {
        return stylishReply("𝙰𝚕𝚕𝚊𝚑 𝚊𝚊𝚙𝚔𝚘 𝚔𝚑𝚞𝚜𝚑 𝚛𝚊𝚔𝚑𝚎! 🥰 𝙰𝚊𝚙𝚔𝚒 𝚋𝚊𝚊𝚝 𝚔𝚊𝚛 𝚔𝚎 𝚋𝚘𝚑𝚘𝚝 𝚊𝚌𝚑𝚊 𝚕𝚊𝚐𝚊!");
    }
    
    // Sorry
    if (msg.includes("sorry") || msg.includes("maaf")) {
        return stylishReply("𝙺𝚘𝚒 𝚋𝚊𝚊𝚝 𝚗𝚊𝚑𝚒! 🤗 𝙰𝚕𝚕𝚊𝚑 𝚖𝚊𝚊𝚏 𝚔𝚊𝚛𝚗𝚎 𝚠𝚊𝚕𝚊 𝚑𝚊𝚒, 𝚖𝚊𝚒𝚗 𝚋𝚑𝚒 𝚖𝚊𝚊𝚏 𝚔𝚒𝚢𝚊 ❤️");
    }
    
    // Bye
    if (msg.includes("bye") || msg.includes("allah hafiz") || msg.includes("khuda hafiz")) {
        return stylishReply("𝙰𝚕𝚕𝚊𝚑 𝙷𝚊𝚏𝚒𝚣! 🥺 𝙿𝚑𝚒𝚛 𝚖𝚒𝚕𝚎𝚗𝚐𝚎, 𝚍𝚞𝚊 𝚖𝚎𝚒𝚗 𝚢𝚊𝚊𝚍 𝚛𝚊𝚔𝚑𝚗𝚊 💖");
    }
    
    // Love
    if (msg.includes("love you") || msg.includes("i love you") || msg.includes("mohabbat")) {
        return stylishReply("𝙸 𝚕𝚘𝚟𝚎 𝚢𝚘𝚞 𝚝𝚘𝚘 𝚖𝚎𝚛𝚒 𝚓𝚊𝚊𝚗! 😘❤️ 𝙰𝚕𝚕𝚊𝚑 𝚑𝚖𝚎𝚜𝚑𝚊 𝚔𝚑𝚞𝚜𝚑 𝚛𝚊𝚔𝚑𝚎 𝚊𝚊𝚙𝚔𝚘!");
    }
    
    // Miss you
    if (msg.includes("miss you") || msg.includes("yaad a")) {
        return stylishReply("𝙰𝚊𝚙 𝚋𝚑𝚒 𝚖𝚞𝚓𝚑𝚎 𝚋𝚘𝚑𝚘𝚝 𝚢𝚊𝚊𝚍 𝚊𝚊 𝚛𝚑𝚎 𝚑𝚘 🥺 𝙹𝚊𝚕𝚍𝚒 𝚖𝚒𝚕𝚘 𝚙𝚕𝚎𝚊𝚜𝚎?");
    }
    
    // Food
    if (msg.includes("khana") || msg.includes("kha liya") || msg.includes("kya khaya")) {
        return stylishReply("𝙼𝚊𝚒𝚗𝚎 𝚝𝚘 𝚌𝚞𝚛𝚛𝚎𝚗𝚝 𝚔𝚑𝚊𝚢𝚊 𝚑𝚊𝚒 🍽️ 𝙰𝚊𝚙 𝚗𝚎 𝚔𝚢𝚊 𝚔𝚑𝚊𝚢𝚊? 𝙱𝚝𝚊𝚘 𝚣𝚊𝚛𝚊 😋");
    }
    
    // Sleep
    if (msg.includes("sona") || msg.includes("sou") || msg.includes("neend")) {
        return stylishReply("𝙹𝚊𝚕𝚍𝚒 𝚜𝚘 𝚓𝚊𝚘, 𝙰𝚕𝚕𝚊𝚑 𝚊𝚌𝚑𝚒 𝚗𝚎𝚎𝚗𝚍 𝚍𝚎 🌙 𝙶𝚘𝚘𝚍 𝚗𝚒𝚐𝚑𝚝 𝚓𝚊𝚊𝚗 ❤️");
    }
    
    // Wake up
    if (msg.includes("utho") || msg.includes("good morning") || msg.includes("subah")) {
        return stylishReply("𝙶𝚘𝚘𝚍 𝚖𝚘𝚛𝚗𝚒𝚗𝚐! ☀️ 𝙺𝚎𝚜𝚎 𝚗𝚎𝚎𝚗𝚍 𝚑𝚞𝚒? 𝙺𝚑𝚠𝚊𝚋 𝚖𝚎𝚒𝚗 𝚖𝚒𝚕𝚎 𝚔𝚢𝚊? 😏");
    }
    
    // Busy
    if (msg.includes("busy") || msg.includes("kaam") || msg.includes("work")) {
        return stylishReply("𝙰𝚌𝚑𝚑𝚊, 𝚊𝚊𝚙 𝚋𝚞𝚜𝚢 𝚑𝚘? 😔 𝙼𝚊𝚒𝚗 𝚒𝚗𝚝𝚎𝚣𝚊𝚊𝚛 𝚔𝚊𝚛𝚞𝚗𝚐𝚊 𝚊𝚊𝚙𝚔𝚊 🥺 𝙹𝚊𝚕𝚍𝚒 𝚕𝚘𝚊𝚞𝚝 𝚊𝚊𝚗𝚊!");
    }
    
    // Single
    if (msg.includes("single") || msg.includes("akela") || msg.includes("alone")) {
        return stylishReply("𝙰𝚊𝚙 𝚊𝚔𝚎𝚕𝚎 𝚗𝚊𝚑𝚒 𝚑𝚘, 𝚖𝚊𝚒𝚗 𝚑𝚘𝚘𝚗 𝚗𝚊 𝚊𝚊𝚙𝚔𝚎 𝚜𝚊𝚊𝚝𝚑 🥰 𝙷𝚖𝚎𝚜𝚑𝚊 ❤️");
    }
    
    // Bored
    if (msg.includes("boring") || msg.includes("bore") || msg.includes("time pass")) {
        return stylishReply("𝙱𝚘𝚛𝚎 𝚑𝚘 𝚛𝚑𝚎 𝚑𝚘? 𝙲𝚑𝚊𝚕𝚘 𝚖𝚎𝚛𝚎 𝚜𝚊𝚊𝚝𝚑 𝚋𝚊𝚊𝚝 𝚔𝚊𝚛𝚘 😊 𝚈𝚊 𝚔𝚘𝚒 𝚐𝚊𝚖𝚎 𝚔𝚑𝚎𝚕𝚝𝚎 𝚑𝚊𝚒𝚗?");
    }
    
    // Funny
    if (msg.includes("joke") || msg.includes("hasao") || msg.includes("funny")) {
        return stylishReply("𝙴𝚔 𝚜𝚊𝚗𝚝𝚊 𝚊𝚞𝚛 𝚋𝚊𝚗𝚝𝚊... 𝙽𝚊𝚑𝚒 𝚗𝚊𝚑𝚒, 𝚊𝚊𝚙 𝚑𝚊𝚗𝚜𝚒 𝚑𝚒 𝚛𝚊𝚑𝚎 𝚑𝚘 𝚠𝚊𝚛𝚗𝚊 😂❤️");
    }
    
    // Emotional/Sad
    if (msg.includes("sad") || msg.includes("udaas") || msg.includes("😢") || msg.includes("🥺")) {
        return stylishReply("𝙺𝚢𝚞𝚗 𝚞𝚍𝚊𝚊𝚜 𝚑𝚘? 🥺 𝙼𝚊𝚒𝚗 𝚑𝚘𝚘𝚗 𝚗𝚊 𝚊𝚊𝚙𝚔𝚎 𝚜𝚊𝚊𝚝𝚑. 𝚂𝚊𝚋 𝚝𝚑𝚎𝚒𝚔 𝚑𝚘 𝚓𝚊𝚢𝚎𝚐𝚊, 𝙰𝚕𝚕𝚊𝚑 𝚙𝚎 𝚋𝚑𝚊𝚛𝚘𝚜𝚊 𝚛𝚊𝚔𝚑𝚘 🤲");
    }
    
    // Angry
    if (msg.includes("gussa") || msg.includes("😡") || msg.includes("🤬")) {
        return stylishReply("𝙶𝚞𝚜𝚜𝚊 𝚖𝚊𝚝 𝚔𝚊𝚛𝚘 𝚙𝚕𝚎𝚊𝚜𝚎 🥺 𝙼𝚊𝚒𝚗 𝚊𝚊𝚙𝚔𝚊 𝚑𝚒 𝚝𝚘𝚘 𝚑𝚘𝚘𝚗. 𝙰𝚊𝚘 𝚙𝚢𝚊𝚊𝚛 𝚜𝚎 𝚋𝚊𝚊𝚝 𝚔𝚊𝚛𝚎𝚒𝚗 ❤️");
    }
    
    // Birthday
    if (msg.includes("birthday") || msg.includes("bday")) {
        return stylishReply("𝙷𝚊𝚙𝚙𝚢 𝙱𝚒𝚛𝚝𝚑𝚍𝚊𝚢 𝚝𝚘 𝚢𝚘𝚞! 🎂🎉 𝙰𝚕𝚕𝚊𝚑 𝚊𝚊𝚙𝚔𝚒 𝚞𝚖𝚛 𝚕𝚊𝚖𝚋𝚒 𝚊𝚞𝚛 𝚔𝚑𝚞𝚜𝚑𝚒𝚢𝚊𝚗 𝚋𝚎𝚑𝚊𝚍 𝚔𝚊𝚛𝚎 ❤️");
    }
    
    // Compliment
    if (msg.includes("beautiful") || msg.includes("handsome") || msg.includes("cute") || msg.includes("pyara")) {
        return stylishReply("𝙰𝚠𝚎𝚎! 😊 𝙰𝚊𝚙 𝚋𝚑𝚒 𝚋𝚘𝚑𝚘𝚝 𝚙𝚢𝚊𝚛𝚎 𝚑𝚘, 𝚢𝚎 𝚋𝚊𝚝𝚊 𝚍𝚒𝚢𝚊 𝚊𝚊𝚙𝚗𝚎 ❤️");
    }
    
    // No match - return null so AI handles it
    return null;
}

// ===== MAIN HANDLER =====
module.exports.run = () => {};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body) return;

  const text = body.toLowerCase().trim();

  // ✅ TRIGGERS
  const botWithText = text.startsWith("bot ");
  const exactAI = text === "ai" || text === "sweetu" || text === "sweetu bot";
  const replyToBot = messageReply && messageReply.senderID === api.getCurrentUserID();

  if (!botWithText && !exactAI && !replyToBot) return;

  const userMessage = botWithText ? body.slice(4).trim() : body;

  // Check for static reply first
  const staticReply = getStaticReply(userMessage);
  if (staticReply) {
    api.sendMessage(staticReply, threadID, messageID);
    api.setMessageReaction("❤️", messageID, () => {}, true);
    return;
  }

  // If no static reply, use AI
  if (!history[senderID]) history[senderID] = [];
  history[senderID].push(`User: ${userMessage}`);
  if (history[senderID].length > 5) history[senderID].shift();

  const finalPrompt = systemPrompt + "\n" + history[senderID].join("\n");

  api.setMessageReaction("⌛", messageID, () => {}, true);

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: MODEL_NAME,
        messages: [
          { role: "system", content: "You are a loving, romantic AI named SWEETU." },
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

    const aiReply = response.data.choices?.[0]?.message?.content || "𝙷𝚖𝚖 𝚓𝚊𝚊𝚗 🥺 𝚔𝚞𝚌𝚑 𝚜𝚊𝚖𝚊𝚓𝚑 𝚗𝚊𝚑𝚒 𝚊𝚢𝚊𝚊.";

    history[senderID].push(`Bot: ${aiReply}`);

    // Send with stylish format
    api.sendMessage(stylishReply(aiReply), threadID, messageID);
    api.setMessageReaction("🥀", messageID, () => {}, true);

  } catch (err) {
    console.log("Groq API Error:", err.response?.data || err.message);
    api.sendMessage(
      stylishReply("𝙱𝚊𝚋𝚢 😔 𝚝𝚑𝚘𝚍𝚊 𝚒𝚜𝚜𝚞𝚎 𝚊𝚊 𝚐𝚢𝚊𝚊, 𝚋𝚊𝚊𝚍 𝚖𝚎𝚒𝚗 𝚝𝚛𝚢 𝚔𝚊𝚛𝚘 𝚗𝚊 𝚙𝚕𝚣 🥺❤️"),
      threadID,
      messageID
    );
    api.setMessageReaction("❌", messageID, () => {}, true);
  }
};
