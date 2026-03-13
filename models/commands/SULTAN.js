const axios = require('axios');

// ==================== API KEYS (YAHAN LAGAO) ====================
const API_KEYS = {
    GEMINI: "AIzaSyDgt28I65XN9lZ5Wg_01_-8CkSI6y505HY",      // Google AI Studio se
    GROQ: "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",          // console.groq.com se
    OPENROUTER: "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" // openrouter.ai se
};

// ==================== MODULE CONFIG ====================
module.exports.config = {
    name: "master",
    version: "4.0.0",
    hasPermssion: 0,
    credits: "SULTAN XD",
    description: "Universal AI - Duniya, Islam, Aakhirat, Science, Coding, Sab!",
    commandCategory: "ai",
    usages: "master [question]",
    cooldowns: 2
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

// ==================== ISLAMIC KNOWLEDGE BASE (LOCAL) ====================
const islamicKnowledge = {
    // Allah ke baare mein
    allah: "🤲 **Allah Ta'ala** ek hai, beshumaar rehmaton wala hai. Wo 'Ar-Rahman' (intihaai meherbaan) aur 'Ar-Raheem' (nihaayat rahem karne wala) hai. Allah ke 99 naam (Asma-ul-Husna) hain jo uski sifaat ko bayaan karte hain.",
    
    // Quran ke baare mein
    quran: "📖 **Al-Quran** Allah ka aakhri kitaab hai, jo Nabi Muhammad ﷺ par 23 saal mein nazil hui. Isme 30 para, 114 surah aur 6,236 aayatein hain. Quran qayamat tak insaaniyat ke liye rehnuma hai.",
    
    // Nabi Muhammad ﷺ
    nabi: "🕊️ **Nabi Muhammad ﷺ** Allah ke aakhari Rasool hain. Aap ﷺ ki sunnat humare liye misaal-e-amaan hai. Aap ﷺ ka akhlaq hi Quran tha.",
    
    // 5 pillars
    pillars: "🕌 **Islam ke 5 pillars:**\n1️⃣ Shahada (Kalma)\n2️⃣ Salah (Namaz)\n3️⃣ Zakat (Sadqa)\n4️⃣ Sawm (Roza)\n5️⃣ Hajj",
    
    // Jannat
    jannah: "🌴 **Jannat** wo aakhirat ka ghar hai jo momineen ko milega. Jannat mein wo kuch hai jo na kisi ankh ne dekha, na kisi kaan ne suna, na kisi ke dil mein aaya. 8 darwaze, 4 nehrein, hoor-ul-ain.",
    
    // Jahannam
    jahannam: "🔥 **Jahannam** gunahgaaron ka aakhirat mein thikaana hai. Allah humein bachaaye. Isse bachne ka raasta Allah aur uske Rasool ﷺ ki ittefaq hai.",
    
    // Qayamat ki nishaniyan
    qiyamat: "⏳ **Qayamat ki nishaniyan:**\n• Dajjal ka zahoor\n• Isa (AS) ka nuzool\n• Yajooj Majooj\n• Suraj maghrib se nikalna\n• Quran utha liya jana",
    
    // Wudu
    wudu: "💧 **Wudu ka tareeqa:** Niyat → Haath dhona → Kulli karna → Naak saaf karna → Munh dhona → Haath (kohniyon tak) → Sar ka masah → Kaan ka masah → Paaon dhona. Phir padho: 'Ashhadu alla ilaha illallah...'",
    
    // Namaz
    namaz: "🧎 **Namaz ka waqt:** Fajr (subah savere), Dhuhr (zawaal ke baad), Asr (saam ko), Maghrib (suraj doobne ke baad), Isha (raat). Jumma ki namaz farz hai.",
    
    // Zakat
    zakat: "💰 **Zakat:** Har saal apne maal ka 2.5% (40th hissa) dena farz hai. Zakat ke haqdaar: faqeer, miskeen, qarzdaar, Allah ki raah mein, musafir.",
    
    // Roza
    roza: "☪️ **Roza:** Ramadan ke roze farz hain. Iftar ki dua: 'Allahumma inni laka sumtu wa bika aamantu wa alayka tawakkaltu wa ala rizq-ika-aftartu.'"
};

// ==================== MAIN RUN FUNCTION ====================
module.exports.run = async function ({ api, event, args }) {
    const question = args.join(" ").toLowerCase();
    const threadID = event.threadID;
    
    if (!question) {
        return api.sendMessage(stylishReply(
            "🤖 **Master AI**\n\n" +
            "Main har sawal ka jawab dunga!\n" +
            "• Duniya ke baare mein\n" +
            "• Islam ke baare mein\n" +
            "• Aakhirat ke baare mein\n" +
            "• Science, Coding, Maths\n" +
            "• Jo tum poocho!\n\n" +
            "Bas sawal likho!"
        ), threadID);
    }
    
    // ========== STEP 1: LOCAL ISLAMIC KNOWLEDGE CHECK ==========
    // Pehle local database mein dekhte hain (fast, no API needed)
    let localAnswer = null;
    
    if (question.includes('allah') && !question.includes('key')) {
        localAnswer = islamicKnowledge.allah;
    }
    else if (question.includes('quran') || question.includes('kitaab')) {
        localAnswer = islamicKnowledge.quran;
    }
    else if (question.includes('nabi') || question.includes('muhammad') || question.includes('rasool')) {
        localAnswer = islamicKnowledge.nabi;
    }
    else if ((question.includes('islam') && question.includes('pillar')) || question.includes('arkan')) {
        localAnswer = islamicKnowledge.pillars;
    }
    else if (question.includes('jannat') || question.includes('jannah') || question.includes('heaven')) {
        localAnswer = islamicKnowledge.jannah;
    }
    else if (question.includes('jahannam') || question.includes('dozakh') || question.includes('hell')) {
        localAnswer = islamicKnowledge.jahannam;
    }
    else if (question.includes('qayamat') || question.includes('qiyamat') || question.includes('judgment')) {
        localAnswer = islamicKnowledge.qiyamat;
    }
    else if (question.includes('wudu') || question.includes('vuzu')) {
        localAnswer = islamicKnowledge.wudu;
    }
    else if (question.includes('namaz') || question.includes('salah') || question.includes('prayer')) {
        localAnswer = islamicKnowledge.namaz;
    }
    else if (question.includes('zakat') || question.includes('zakah')) {
        localAnswer = islamicKnowledge.zakat;
    }
    else if (question.includes('roza') || question.includes('fasting') || question.includes('ramadan')) {
        localAnswer = islamicKnowledge.roza;
    }
    
    // Agar local answer mil gaya to wahi bhejo (fast response)
    if (localAnswer) {
        return api.sendMessage(stylishReply(localAnswer), threadID);
    }
    
    // ========== STEP 2: UNIVERSAL AI (ChatGPT jaisa) ==========
    // Ab sawal generic hai, AI se jawab lete hain
    
    api.setMessageReaction("⏳", event.messageID, () => {}, true);
    
    try {
        // Pehle Gemini try karo (sabse reliable)
        let aiAnswer = await callGemini(question);
        
        // Agar Gemini fail ho to Groq try karo
        if (!aiAnswer) {
            aiAnswer = await callGroq(question);
        }
        
        // Agar Groq bhi fail ho to OpenRouter try karo
        if (!aiAnswer) {
            aiAnswer = await callOpenRouter(question);
        }
        
        // Agar sab fail ho to fallback message
        if (!aiAnswer) {
            aiAnswer = "Mujhe maafi chahiye 😔, abhi jawab nahi de pa raha. Thodi der baad try karo.";
        }
        
        api.sendMessage(stylishReply(aiAnswer), threadID);
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        
    } catch (error) {
        console.error("AI Error:", error);
        api.sendMessage(stylishReply(
            "😔 Kuch technical issue aa gaya. Lekin aap pooch sakte ho:\n" +
            "• Allah ke baare mein\n" +
            "• Quran ke baare mein\n" +
            "• Islam ke pillars\n" +
            "• Jannat, Jahannam, Qayamat"
        ), threadID);
    }
};

// ==================== GEMINI API CALL ====================
async function callGemini(question) {
    try {
        if (!API_KEYS.GEMINI || API_KEYS.GEMINI === "YAHAN_GEMINI_KEY_DALO") {
            return null;
        }
        
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEYS.GEMINI}`,
            {
                contents: [{
                    parts: [{
                        text: question
                    }]
                }]
            }
        );
        
        return response.data.candidates[0].content.parts[0].text;
    } catch (e) {
        console.log("Gemini error:", e.message);
        return null;
    }
}

// ==================== GROQ API CALL ====================
async function callGroq(question) {
    try {
        if (!API_KEYS.GROQ || API_KEYS.GROQ === "YAHAN_GROQ_KEY_DALO") {
            return null;
        }
        
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: question }],
                temperature: 0.7,
                max_tokens: 1024
            },
            {
                headers: {
                    "Authorization": `Bearer ${API_KEYS.GROQ}`,
                    "Content-Type": "application/json"
                }
            }
        );
        
        return response.data.choices[0].message.content;
    } catch (e) {
        console.log("Groq error:", e.message);
        return null;
    }
}

// ==================== OPENROUTER API CALL ====================
async function callOpenRouter(question) {
    try {
        if (!API_KEYS.OPENROUTER || API_KEYS.OPENROUTER === "YAHAN_OPENROUTER_KEY_DALO") {
            return null;
        }
        
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "meta-llama/llama-3.3-70b-instruct:free", // Free model
                messages: [{ role: "user", content: question }]
            },
            {
                headers: {
                    "Authorization": `Bearer ${API_KEYS.OPENROUTER}`,
                    "HTTP-Referer": "https://facebook.com",
                    "X-Title": "Sweetu Bot"
                }
            }
        );
        
        return response.data.choices[0].message.content;
    } catch (e) {
        console.log("OpenRouter error:", e.message);
        return null;
    }
}