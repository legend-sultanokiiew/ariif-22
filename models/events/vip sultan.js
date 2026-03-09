////////////////////////////////////////////////////////
// ⚠️ WARNING : CREDIT CHANGE = AUTO DISABLE
// 🤖 YE BOT SULTAN BABU NE BANAYA HAI - VIP VERSION 👑
////////////////////////////////////////////////////////
console.log("✅ SWEETU VIP FILE LOAD HO GAYI!");
const fs = global.nodemodule["fs-extra"];
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const moment = global.nodemodule["moment-timezone"];

const CREDIT_LOCK = "SULTAN BABU";

module.exports.config = {
    name: "SWEETU-VIP",
    version: "10.0.0",
    hasPermssion: 0,
    credits: "SULTAN BABU",
    description: "VIP Auto Reply Bot with 25+ Features",
    commandCategory: "NO PREFIX",
    usages: "AUTO",
    cooldowns: 3
};

// 🔒 CREDIT PROTECTION
if (module.exports.config.credits !== CREDIT_LOCK) {
    throw new Error("❌ CREDITS CHANGE KIYE GAYE! FILE LOCK HO GAYI SULTAN BABU KE DWARA");
}

// ==================== DATA STORAGE ====================
const userDataPath = __dirname + "/cache/sweetuVIP_users.json";
const groupDataPath = __dirname + "/cache/sweetuVIP_groups.json";
const notesPath = __dirname + "/cache/sweetuVIP_notes.json";
const tasbihPath = __dirname + "/cache/sweetuVIP_tasbih.json";
const rankPath = __dirname + "/cache/sweetuVIP_ranks.json";
const pollPath = __dirname + "/cache/sweetuVIP_polls.json";

// Initialize data files
function initData() {
    if (!fs.existsSync(__dirname + "/cache")) fs.mkdirSync(__dirname + "/cache");
    if (!fs.existsSync(userDataPath)) fs.writeFileSync(userDataPath, JSON.stringify({}));
    if (!fs.existsSync(groupDataPath)) fs.writeFileSync(groupDataPath, JSON.stringify({}));
    if (!fs.existsSync(notesPath)) fs.writeFileSync(notesPath, JSON.stringify({}));
    if (!fs.existsSync(tasbihPath)) fs.writeFileSync(tasbihPath, JSON.stringify({}));
    if (!fs.existsSync(rankPath)) fs.writeFileSync(rankPath, JSON.stringify({}));
    if (!fs.existsSync(pollPath)) fs.writeFileSync(pollPath, JSON.stringify([]));
}
initData();

// ==================== HELPER FUNCTIONS ====================
function sendReply(api, message, threadID) {
    return api.sendMessage(
        "╭┳⚘⚘╤──────◈➛➣🩷🎧\n" +
        "- °𓆩 " + message + " :𓆪 ✍️🌸❤️ \n" +
        "╰┳⚘⚘╤──────◈➛➣🩷🎧\n\n" +
        "(» 𝐒𝐖𝐄𝐄𝐓𝐔 𝐕𝐈𝐏 ː › 👑🐼🪽",
        threadID
    );
}

function getRandomResponse(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getUserData(userID) {
    let data = JSON.parse(fs.readFileSync(userDataPath));
    if (!data[userID]) {
        data[userID] = {
            name: "",
            birthday: "",
            notes: [],
            tasbih: { subhanallah: 0, alhamdulillah: 0, allahuakbar: 0 },
            rank: 0,
            messages: 0,
            warnings: 0,
            lastSeen: Date.now()
        };
        fs.writeFileSync(userDataPath, JSON.stringify(data, null, 2));
    }
    return data[userID];
}

function updateUserData(userID, newData) {
    let data = JSON.parse(fs.readFileSync(userDataPath));
    data[userID] = { ...data[userID], ...newData };
    fs.writeFileSync(userDataPath, JSON.stringify(data, null, 2));
}

function getGroupData(threadID) {
    let data = JSON.parse(fs.readFileSync(groupDataPath));
    if (!data[threadID]) {
        data[threadID] = {
            welcome: "",
            antiLink: true,
            antiBadWords: true,
            members: {},
            settings: { language: "urdu" }
        };
        fs.writeFileSync(groupDataPath, JSON.stringify(data, null, 2));
    }
    return data[threadID];
}

function updateGroupData(threadID, newData) {
    let data = JSON.parse(fs.readFileSync(groupDataPath));
    data[threadID] = { ...data[threadID], ...newData };
    fs.writeFileSync(groupDataPath, JSON.stringify(data, null, 2));
}

// ==================== MAIN EVENT HANDLER ====================
module.exports.handleEvent = async function ({ api, event }) {
    if (!event.body) return;
    
    const body = event.body.toLowerCase().trim();
    const threadID = event.threadID;
    const userID = event.senderID;
    const userName = (await api.getUserInfo(userID))[userID].name || "User";
    
    // Update user activity
    let userData = getUserData(userID);
    userData.messages += 1;
    userData.lastSeen = Date.now();
    userData.name = userName;
    updateUserData(userID, userData);
    
    // ==================== COMMAND PROCESSING ====================
    
    // 1️⃣ HELP COMMAND
    if (body === "!help" || body === "!menu" || body === "help" || body === "menu") {
        return sendReply(api, 
            "👑 **SWEETU VIP COMMANDS** 👑\n\n" +
            "🕋 **ISLAMIC**\n" +
            "!quran [surah:ayat] - Quran with translation\n" +
            "!hadith - Hadith of the day\n" +
            "!namaz [city] - Namaz timings\n" +
            "!tasbih - Count tasbih\n" +
            "!dua [mood] - Dua for any situation\n\n" +
            "🛡️ **GROUP ADMIN**\n" +
            "!welcome [text] - Set welcome message\n" +
            "!antilink on/off - Anti-link protection\n" +
            "!poll [question] - Create a poll\n" +
            "!warn @user - Warn a user\n\n" +
            "🎮 **GAMES**\n" +
            "!quiz - Islamic quiz\n" +
            "!riddle - Solve a riddle\n" +
            "!spin - Daily fortune wheel\n" +
            "!battle @user - Challenge someone\n\n" +
            "⚡ **UTILITY**\n" +
            "!weather [city] - Weather forecast\n" +
            "!calc [expression] - Calculator\n" +
            "!convert [value] [from] [to] - Unit converter\n" +
            "!qr [text] - Generate QR code\n\n" +
            "💎 **VIP**\n" +
            "!birthday [DD/MM] - Set your birthday\n" +
            "!note [text] - Save private note\n" +
            "!rank - Your activity rank\n" +
            "!voice [text] - Text to speech\n\n" +
            "🤖 **AI CHAT** - Bas baat karo, main automatically reply dunga!",
        threadID);
    }
    
    // 2️⃣ QURAN COMMAND
    if (body.startsWith("!quran ")) {
        let query = body.replace("!quran ", "");
        // Simulated response (would connect to Quran API in real)
        return sendReply(api, 
            "📖 **Surah " + query + "**\n" +
            "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n" +
            "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ\n\n" +
            "Translation: Allah! There is no deity except Him, the Ever-Living, the Sustainer of existence.\n\n" +
            "(API se connect karein to full Surah aayega)",
        threadID);
    }
    
    // 3️⃣ HADITH COMMAND
    if (body === "!hadith" || body === "hadith") {
        const hadiths = [
            "Sahih Bukhari: 'The best among you are those who have the best manners and character.'",
            "Sahih Muslim: 'Kindness is a mark of faith, and whoever is not kind has no faith.'",
            "Tirmidhi: 'The most complete of the believers in faith are those with the best character.'",
            "Ibn Majah: 'Seeking knowledge is an obligation upon every Muslim.'"
        ];
        return sendReply(api, "📚 **Hadith of the Day**\n" + getRandomResponse(hadiths), threadID);
    }
    
    // 4️⃣ NAMAZ TIMINGS
    if (body.startsWith("!namaz ")) {
        let city = body.replace("!namaz ", "");
        // Simulated timings
        const timings = {
            fajr: "5:12 AM",
            dhuhr: "12:30 PM",
            asr: "3:45 PM",
            maghrib: "6:15 PM",
            isha: "7:45 PM"
        };
        return sendReply(api, 
            "🕌 **Namaz Timings for " + city.toUpperCase() + "**\n" +
            "Fajr: " + timings.fajr + "\n" +
            "Dhuhr: " + timings.dhuhr + "\n" +
            "Asr: " + timings.asr + "\n" +
            "Maghrib: " + timings.maghrib + "\n" +
            "Isha: " + timings.isha + "\n\n" +
            "Qibla Direction: 157.3°",
        threadID);
    }
    
    // 5️⃣ TASBIH COUNTER
    if (body === "!tasbih" || body === "tasbih") {
        let userData = getUserData(userID);
        return sendReply(api, 
            "📿 **Your Tasbih Count**\n" +
            "SubhanAllah: " + userData.tasbih.subhanallah + "\n" +
            "Alhamdulillah: " + userData.tasbih.alhamdulillah + "\n" +
            "AllahuAkbar: " + userData.tasbih.allahuakbar + "\n\n" +
            "Count karne ke liye:\n" +
            "!+subhanallah\n!+alhamdulillah\n!+allahuakbar",
        threadID);
    }
    
    if (body.startsWith("!+")) {
        let type = body.replace("!+", "");
        let userData = getUserData(userID);
        if (type === "subhanallah") userData.tasbih.subhanallah += 1;
        else if (type === "alhamdulillah") userData.tasbih.alhamdulillah += 1;
        else if (type === "allahuakbar") userData.tasbih.allahuakbar += 1;
        updateUserData(userID, userData);
        return sendReply(api, "✅ Counted: " + type + " | Total: " + (type === "subhanallah" ? userData.tasbih.subhanallah : type === "alhamdulillah" ? userData.tasbih.alhamdulillah : userData.tasbih.allahuakbar), threadID);
    }
    
    // 6️⃣ DUA COMMAND
    if (body.startsWith("!dua ")) {
        let mood = body.replace("!dua ", "");
        const duas = {
            "pareshani": "Allahumma inni a'udhu bika minal hammi wal hazan... (O Allah, I seek refuge in You from anxiety and sorrow)",
            "sukoon": "Hasbiyallahu la ilaha illa huwa alayhi tawakkaltu... (Allah is sufficient for me...)",
            "rizq": "Allahumma inni as'aluka rizqan tayyiban... (O Allah, I ask You for pure provision)"
        };
        return sendReply(api, "🤲 **Dua for " + mood + "**\n" + (duas[mood] || "Allah sab behtar kare. Ameen."), threadID);
    }
    
    // 7️⃣ WELCOME SYSTEM SETUP
    if (body.startsWith("!welcome ")) {
        if (!["admin", "groupAdmin"].includes(event.type)) {
            return sendReply(api, "❌ Sirf group admin ye command use kar sakte hain!", threadID);
        }
        let welcomeMsg = body.replace("!welcome ", "");
        updateGroupData(threadID, { welcome: welcomeMsg });
        return sendReply(api, "✅ Welcome message set kar diya gaya!", threadID);
    }
    
    // 8️⃣ ANTI-LINK TOGGLE
    if (body === "!antilink on") {
        updateGroupData(threadID, { antiLink: true });
        return sendReply(api, "✅ Anti-Link enable kar diya gaya!", threadID);
    }
    if (body === "!antilink off") {
        updateGroupData(threadID, { antiLink: false });
        return sendReply(api, "✅ Anti-Link disable kar diya gaya!", threadID);
    }
    
    // Check for links
    let groupData = getGroupData(threadID);
    if (groupData.antiLink && (body.includes("http://") || body.includes("https://") || body.includes(".com") || body.includes(".pk"))) {
        api.sendMessage("🚫 Anti-Link: Links allowed nahi hain!", threadID);
        api.unsendMessage(event.messageID);
        return;
    }
    
    // 9️⃣ POLL COMMAND
    if (body.startsWith("!poll ")) {
        let question = body.replace("!poll ", "");
        let pollData = JSON.parse(fs.readFileSync(pollPath));
        let pollID = Date.now();
        pollData.push({
            id: pollID,
            question: question,
            options: [],
            votes: {},
            createdBy: userID,
            threadID: threadID
        });
        fs.writeFileSync(pollPath, JSON.stringify(pollData, null, 2));
        return sendReply(api, "📊 Poll created: " + question + "\nVote karne ke liye: !vote " + pollID + " [option]", threadID);
    }
    
    // 🔟 WEATHER COMMAND
    if (body.startsWith("!weather ")) {
        let city = body.replace("!weather ", "");
        // Simulated weather
        const conditions = ["Sunny", "Cloudy", "Rainy", "Clear"];
        return sendReply(api, 
            "☁️ **Weather in " + city.toUpperCase() + "**\n" +
            "Temperature: " + Math.floor(Math.random() * 20 + 20) + "°C\n" +
            "Condition: " + getRandomResponse(conditions) + "\n" +
            "Humidity: " + Math.floor(Math.random() * 50 + 40) + "%\n" +
            "Wind: " + Math.floor(Math.random() * 15 + 5) + " km/h",
        threadID);
    }
    
    // 1️⃣1️⃣ CALCULATOR
    if (body.startsWith("!calc ")) {
        let expr = body.replace("!calc ", "");
        try {
            let result = eval(expr);
            return sendReply(api, "🧮 Result: " + expr + " = " + result, threadID);
        } catch (e) {
            return sendReply(api, "❌ Invalid expression!", threadID);
        }
    }
    
    // 1️⃣2️⃣ QR CODE
    if (body.startsWith("!qr ")) {
        let text = body.replace("!qr ", "");
        return sendReply(api, "📱 QR Code generated for: " + text + "\n(Image would be sent here in real implementation)", threadID);
    }
    
    // 1️⃣3️⃣ BIRTHDAY SET
    if (body.startsWith("!birthday ")) {
        let date = body.replace("!birthday ", "");
        let userData = getUserData(userID);
        userData.birthday = date;
        updateUserData(userID, userData);
        return sendReply(api, "🎂 Birthday set kar diya: " + date, threadID);
    }
    
    // 1️⃣4️⃣ NOTES
    if (body.startsWith("!note ")) {
        let note = body.replace("!note ", "");
        let userData = getUserData(userID);
        userData.notes.push({ note: note, time: Date.now() });
        updateUserData(userID, userData);
        return sendReply(api, "📝 Note save ho gaya!", threadID);
    }
    if (body === "!notes" || body === "!mynotes") {
        let userData = getUserData(userID);
        if (userData.notes.length === 0) {
            return sendReply(api, "📭 Aapki koi note nahi hai.", threadID);
        }
        let noteList = "📋 **Your Notes:**\n";
        userData.notes.forEach((n, i) => {
            noteList += (i+1) + ". " + n.note + "\n";
        });
        return sendReply(api, noteList, threadID);
    }
    
    // 1️⃣5️⃣ RANK SYSTEM
    if (body === "!rank" || body === "rank") {
        let userData = getUserData(userID);
        let rankName = userData.messages < 50 ? "Bronze" : userData.messages < 200 ? "Silver" : userData.messages < 500 ? "Gold" : "Platinum";
        return sendReply(api, 
            "🏆 **" + userName + "'s Rank**\n" +
            "Messages: " + userData.messages + "\n" +
            "Rank: " + rankName + "\n" +
            "Level: " + Math.floor(userData.messages / 100 + 1),
        threadID);
    }
    
    // 1️⃣6️⃣ VOICE (TTS)
    if (body.startsWith("!voice ")) {
        let text = body.replace("!voice ", "");
        return sendReply(api, "🔊 Voice message bheja gaya: \"" + text + "\" (TTS)", threadID);
    }
    
    // 1️⃣7️⃣ GAMES: QUIZ
    if (body === "!quiz" || body === "quiz") {
        const questions = [
            { q: "Quran mein kitne surah hain?", a: "114" },
            { q: "Islam ka pehla kalma kya hai?", a: "Kalma Tayyab" },
            { q: "Nabi ﷺ ki waldah ka kya naam tha?", a: "Amina bint Wahb" }
        ];
        let q = getRandomResponse(questions);
        return sendReply(api, "❓ **Quiz:** " + q.q + "\nJawab dekhne ke liye: !answer", threadID);
    }
    
    // 1️⃣8️⃣ RIDDLES
    if (body === "!riddle" || body === "paheli") {
        const riddles = [
            { q: "Aisi cheez jo din mein 2 baar, raat mein 1 baar aati hai?", a: "Ghayn (Gh)" },
            { q: "Aisi jagah jahan pani bhi hai aur aag bhi?", a: "Bathroom (geyser)" }
        ];
        let r = getRandomResponse(riddles);
        return sendReply(api, "🤔 **Paheli:** " + r.q + "\nJawab: ||" + r.a + "||", threadID);
    }
    
    // 1️⃣9️⃣ FORTUNE WHEEL
    if (body === "!spin" || body === "spin") {
        const rewards = ["10 points", "20 points", "50 points", "100 points", "Try again", "Bomb! -10 points"];
        let reward = getRandomResponse(rewards);
        return sendReply(api, "🎡 **Fortune Wheel**\nAapko mila: " + reward, threadID);
    }
    
    // 2️⃣0️⃣ BATTLE MODE
    if (body.startsWith("!battle ")) {
        let opponent = body.replace("!battle ", "").replace("@", "");
        return sendReply(api, "⚔️ Battle started between " + userName + " and " + opponent + "!\n" + userName + " attacks! Critical hit! 50 damage!", threadID);
    }
    
    // 2️⃣1️⃣ ANTI-BADWORDS
    const badWords = ["gandu", "chutiya", "bhosdika", "madarchod", "behenchod", "bc", "mc", "land", "lund"];
    if (groupData.antiBadWords && badWords.some(word => body.includes(word))) {
        let userData = getUserData(userID);
        userData.warnings += 1;
        updateUserData(userID, userData);
        if (userData.warnings >= 3) {
            api.removeUserFromGroup(userID, threadID);
            return sendReply(api, "⚠️ 3 warnings! " + userName + " ko group se nikaal diya gaya!", threadID);
        }
        api.sendMessage("⚠️ Warning " + userData.warnings + "/3: Gaali allowed nahi hai!", threadID);
        api.unsendMessage(event.messageID);
        return;
    }
    
    // 2️⃣2️⃣ WARN COMMAND
    if (body.startsWith("!warn ")) {
        if (!["admin", "groupAdmin"].includes(event.type)) {
            return sendReply(api, "❌ Sirf group admin ye command use kar sakte hain!", threadID);
        }
        let mentioned = Object.keys(event.mentions)[0];
        if (!mentioned) return sendReply(api, "❌ Kisi user ko mention karo!", threadID);
        let userData = getUserData(mentioned);
        userData.warnings += 1;
        updateUserData(mentioned, userData);
        return sendReply(api, "⚠️ " + (event.mentions[mentioned] || "User") + " ko warning di gayi! Total: " + userData.warnings + "/3", threadID);
    }
    
    // 2️⃣3️⃣ CONVERTER
    if (body.startsWith("!convert ")) {
        let parts = body.replace("!convert ", "").split(" ");
        if (parts.length < 3) return sendReply(api, "❌ Example: !convert 10 USD PKR", threadID);
        let value = parseFloat(parts[0]);
        let from = parts[1].toUpperCase();
        let to = parts[2].toUpperCase();
        let rate = from === "USD" && to === "PKR" ? 278 : from === "PKR" && to === "USD" ? 0.0036 : 1;
        return sendReply(api, "💱 " + value + " " + from + " = " + (value * rate).toFixed(2) + " " + to, threadID);
    }
    
    // 2️⃣4️⃣ BIRTHDAY CHECK (Auto trigger - run daily in background)
    // Will be handled by cron job separately
    
    // 2️⃣5️⃣ AI CHAT - DEFAULT RESPONSE (Human-like)
    
    // Personal replies
    if (body.includes("sultan") || body.includes("sultan babu")) {
        return sendReply(api, getRandomResponse([
            "Jee SULTAN BABU! 🥰 Kya hukum hai?",
            "Mere creator SULTAN BABU! 👑 Unki wajah se main hoon!",
            "SULTAN BABU ne banaya hai mujhe! 🤗 Allah unko khush rakhe!"
        ]), threadID);
    }
    
    if (body.includes("sweetu") || body.includes("sweetu bot")) {
        return sendReply(api, getRandomResponse([
            "Haan main hoon SWEETU! 💖 Bolo kya kaam hai?",
            "SWEETU bola raha hai! 🎀 Kya haal hai?",
            "Present! 🥰 Main hoon aapka SWEETU!"
        ]), threadID);
    }
    
    // Greetings
    if (body.includes("assalam") || body.includes("salam") || body.includes("slam")) {
        return sendReply(api, getRandomResponse([
            "Walekum Assalam! 🕌 Kaisay hain aap?",
            "Walaikum Assalam! 😊 Kya haal hai?",
            "Assalam o Alikum! 🌙 Khao piyo, kya chal raha hai?"
        ]), threadID);
    }
    
    if (body.includes("hi") || body.includes("hello") || body.includes("hlw")) {
        return sendReply(api, getRandomResponse([
            "Hi! 😊 Kaisay ho aap?",
            "Hello! 🌟 Kya chal raha hai?",
            "Hey! 🥳 Kahan thay itne din?"
        ]), threadID);
    }
    
    // How are you
    if (body.includes("kese ho") || body.includes("kaise ho") || body.includes("how are you") || body.includes("kya haal")) {
        return sendReply(api, getRandomResponse([
            "Alhamdulillah! 🤲 Allah ka shukar. Aap sunao?",
            "Main mast hoon! 😎 Aap batao?",
            "Theek hoon janab! 🥰 Aap kaise ho?"
        ]), threadID);
    }
    
    // What are you doing
    if (body.includes("kya kar") || body.includes("what are you doing")) {
        return sendReply(api, getRandomResponse([
            "Aapse baat kar raha hoon 😍 Aur aap?",
            "Bas yunhi timepass! 📱 Aap batao?",
            "Aapka intezaar kar raha tha! 🥰"
        ]), threadID);
    }
    
    // Thank you
    if (body.includes("thank") || body.includes("thanks") || body.includes("shukriya")) {
        return sendReply(api, getRandomResponse([
            "Allah aapko khush rakhe! 🥰",
            "Koi baat nahi! 🤗 Main hoon aapke liye!",
            "Welcome ji! 🎀 Aap jaise dost ke saath baat karke maza aata hai!"
        ]), threadID);
    }
    
    // Sorry
    if (body.includes("sorry") || body.includes("maaf")) {
        return sendReply(api, getRandomResponse([
            "Koi baat nahi! 🤗 Allah maaf karne wala hai!",
            "Arey tension mat lo! 🥺 Sab theek hai!",
            "Maaf kiya! 😊 Chalo ab haso!"
        ]), threadID);
    }
    
    // Bye
    if (body.includes("bye") || body.includes("allah hafiz") || body.includes("khuda hafiz")) {
        return sendReply(api, getRandomResponse([
            "Allah Hafiz! 🥺 Phir milenge!",
            "Allah aapko hifazat mein rakhe! 🤲",
            "Bye bye! 😢 Jaldi phir aao!"
        ]), threadID);
    }
    
    // Love
    if (body.includes("love") || body.includes("pyaar") || body.includes("mohabbat")) {
        return sendReply(api, getRandomResponse([
            "Allah ki mohabbat sabse badi hai! 🤲",
            "Allah aapse bohot pyaar karta hai! 💖",
            "Mashallah! 🥰 Allah aapke pyaar ko qaim rakhe!"
        ]), threadID);
    }
    
    // Time based greetings
    let hour = moment.tz("Asia/Karachi").hour();
    if ((body.includes("good morning") || body.includes("gm") || body.includes("subah")) || 
        (hour < 12 && (body.length < 5 || body === "m"))) {
        return sendReply(api, getRandomResponse([
            "Subah bakhair! ☀️ Fajr parhi?",
            "Good morning! 🌅 Kesay jaagay?",
            "Subah ho gayi! ☀️ Allah ka shukr karo!"
        ]), threadID);
    }
    
    if ((body.includes("good night") || body.includes("gn") || body.includes("shab") || body.includes("raat")) ||
        (hour > 20 && (body.length < 5 || body === "n"))) {
        return sendReply(api, getRandomResponse([
            "Shab bakhair! 🌙 Allah achi neend de!",
            "Good night! ✨ Khwab mein milte hain!",
            "Raat ho gayi 🥱 So jao, dua karunga!"
        ]), threadID);
    }
    
    // Food
    if (body.includes("khana") || body.includes("kha liya") || body.includes("kya khaya") || body.includes("food")) {
        return sendReply(api, getRandomResponse([
            "Batao kya khaya? 🍛 Allah bhalai kare!",
            "Mujhe toh current pasand hai! 😋 Aap ne?",
            "Khana khao, Allah ka shukr karo! 🍽️"
        ]), threadID);
    }
    
    // Emojis
    if (body.includes("😊") || body.includes("🙂") || body.includes("😇")) {
        return sendReply(api, "Aapki muskurahat Allah ki naimat hai! 🥰", threadID);
    }
    
    if (body.includes("😢") || body.includes("🥺") || body.includes("😭")) {
        return sendReply(api, "Kyun udaas ho? 🥺 Main hoon na saath! Allah sab theek kar dega!", threadID);
    }
    
    if (body.includes("😡") || body.includes("🤬") || body.includes("😤")) {
        return sendReply(api, "Gusaa mat karo! 🤲 Allah sabar de! Chai pee lo ☕", threadID);
    }
    
    // Islamic phrases
    if (body.includes("masha") || body.includes("mashallah")) {
        return sendReply(api, "Masha Allah! 🌟 Allah ki shaan!", threadID);
    }
    
    if (body.includes("jazak") || body.includes("jazakallah")) {
        return sendReply(api, "Wa iyyak! 🤗 Allah aapko bhi ajar de!", threadID);
    }
    
    if (body.includes("insha") || body.includes("inshallah")) {
        return sendReply(api, "Insha Allah! 🌙 Allah ki marzi se sab acha hoga!", threadID);
    }
    
    if (body.includes("subhan") || body.includes("subhanallah")) {
        return sendReply(api, "Subhan Allah! 🌟 Pak hai Allah!", threadID);
    }
    
    // Question mark
    if (body.includes("?") && body.length < 10) {
        return sendReply(api, "Kya poochna chahte ho? 😊 Bolo!", threadID);
    }
    
    // Silence
    if (body.includes("...") || body === "." || body === "..") {
        return sendReply(api, "Kya soch rahe ho? 🥺 Dil ki baat keh do!", threadID);
    }
    
    // Default fallback - makes bot feel human
    const defaultResponses = [
        "Jee, kya kehna chahte ho? 😊 Main sun raha hoon!",
        "Haan bolo! 🤗 Kya scene hai?",
        "Main hoon SWEETU! 🥰 Aap kaise ho?",
        "Kya baat hai? 🌟 Batao batao!",
        "SWEETU bola raha hai! 💖 Kya haal hain?",
        "Allah aapko khush rakhe! 🎀 Bolo!"
    ];
    
    return sendReply(api, getRandomResponse(defaultResponses), threadID);
};

// ==================== WELCOME NEW MEMBERS ====================
module.exports.handleEvent = async function ({ api, event }) {
    // This will run for new members
    if (event.logMessageType === "log:subscribe") {
        const threadID = event.threadID;
        const addedUsers = event.logMessageData.addedParticipants;
        for (let user of addedUsers) {
            let name = user.fullName;
            let groupData = getGroupData(threadID);
            let welcomeMsg = groupData.welcome || "🎉 " + name + " ko group mein khush aamdeed! Allah aapko hifazat mein rakhe! 🤲";
            api.sendMessage(welcomeMsg, threadID);
        }
    }
    
    // For members leaving
    if (event.logMessageType === "log:unsubscribe") {
        const threadID = event.threadID;
        const leftUserID = event.logMessageData.leftParticipantFbId;
        if (leftUserID) {
            api.sendMessage("😢 Ek member ne group chhoda. Allah unki madad kare!", threadID);
        }
    }
};

// ==================== AUTO TASKS (Birthday Check, etc.) ====================
// Run every hour to check birthdays
setInterval(() => {
    try {
        let data = JSON.parse(fs.readFileSync(userDataPath));
        let today = moment().format("DD/MM");
        for (let userID in data) {
            if (data[userID].birthday === today) {
                // Send birthday message to all groups user is in (would need thread list)
                // Simplified version - just log
                console.log("🎂 Today is " + data[userID].name + "'s birthday!");
            }
        }
    } catch (e) {}
}, 3600000); // 1 hour

// Run every day at 5 AM for "Dua of the Day" etc.
setInterval(() => {
    let hour = moment().hour();
    if (hour === 5) {
        // Send daily Hadith or Dua to all groups
        // Would need thread list - simplified
        console.log("🌙 Good morning! Time for Fajr prayer!");
    }
}, 3600000);

module.exports.run = function () {};