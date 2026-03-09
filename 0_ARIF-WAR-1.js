const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "convo",
    version: "2.0.0",
    hasPermssion: 2,
    credits: "SULTAN XD",
    description: "Auto conversation with group & nickname lock",
    commandCategory: "Admin",
    usages: "convo on / convo off / convo start",
    cooldowns: 5,
};

// 👑 Admin UIDs (apna UID yahan dalo)
const BOT_ADMIN_UIDS = ["61584895975613"];

// 📁 Data folder
const DATA_DIR = path.join(__dirname, "SULTAN-XD");
const CONFIG_FILE = path.join(DATA_DIR, "convo_config.json");
const MSG_DIR = path.join(DATA_DIR, "messages");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(MSG_DIR)) fs.mkdirSync(MSG_DIR, { recursive: true });

// Default config
let convoConfig = {
    active: false,
    botName: "",
    intervalSec: 5,
    targetGroupID: null,
    lockedGroupName: "",
    unifiedNickname: "",
    msgFile: "",
    msgIndex: 0,
};

if (fs.existsSync(CONFIG_FILE)) {
    try {
        convoConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
    } catch (e) { console.log("Config corrupted, using default."); }
}

// Setup sessions
let setupSessions = {};

// Timer IDs
let sendInterval = null;

// ------------------- HANDLE EVENT (setup wizard replies) -------------------
module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, senderID, body } = event;
    if (!body || !setupSessions[senderID] || setupSessions[senderID].threadID !== threadID) return;

    const session = setupSessions[senderID];
    const answer = body.trim();

    try {
        if (session.step === 1) {
            session.config.botName = answer;
            session.step = 2;
            return api.sendMessage("✅ Bot name saved.\nNow send interval in seconds (e.g., 5):", threadID);
        }
        if (session.step === 2) {
            const sec = parseInt(answer);
            if (isNaN(sec) || sec <= 0) throw "Invalid number";
            session.config.intervalSec = sec;
            session.step = 3;
            return api.sendMessage("✅ Interval saved.\nNow send target group UID (thread ID):", threadID);
        }
        if (session.step === 3) {
            session.config.targetGroupID = answer;
            session.step = 4;
            return api.sendMessage("✅ Target group saved.\nNow send the group name to lock (or 'none'):", threadID);
        }
        if (session.step === 4) {
            session.config.lockedGroupName = (answer === "none") ? "" : answer;
            session.step = 5;
            return api.sendMessage("✅ Group name saved.\nNow send unified nickname (or 'none'):", threadID);
        }
        if (session.step === 5) {
            session.config.unifiedNickname = (answer === "none") ? "" : answer;
            session.step = 6;
            return api.sendMessage("✅ Nickname saved.\nNow send the message filename (inside SULTAN-XD/messages/ folder):", threadID);
        }
        if (session.step === 6) {
            const filePath = path.join(MSG_DIR, answer);
            if (!fs.existsSync(filePath)) {
                return api.sendMessage(`❌ File "${answer}" not found. Available files: ${fs.readdirSync(MSG_DIR).join(", ")}`, threadID);
            }
            session.config.msgFile = answer;
            session.config.msgIndex = 0;
            // Save config
            convoConfig = { ...session.config, active: false };
            fs.writeFileSync(CONFIG_FILE, JSON.stringify(convoConfig, null, 2));
            delete setupSessions[senderID];
            return api.sendMessage(
                "✅ Setup complete!\nNow use:\n» convo start – to begin\n» convo off – to stop",
                threadID
            );
        }
    } catch (e) {
        return api.sendMessage("❌ Invalid input, please try again.", threadID);
    }
};

// ------------------- MAIN COMMAND -------------------
module.exports.run = async function ({ api, event, args }) {
    const { threadID, senderID } = event;
    const cmd = args[0]?.toLowerCase();

    // Admin check
    if (!BOT_ADMIN_UIDS.includes(senderID)) {
        return api.sendMessage("❌ Only admin can use this command.", threadID);
    }

    if (cmd === "on") {
        if (convoConfig.active) {
            return api.sendMessage("❌ Convo already active. Use 'convo off' first.", threadID);
        }
        setupSessions[senderID] = {
            step: 1,
            threadID: threadID,
            config: {
                botName: "",
                intervalSec: 5,
                targetGroupID: null,
                lockedGroupName: "",
                unifiedNickname: "",
                msgFile: "",
                msgIndex: 0,
            }
        };
        return api.sendMessage(
            "🛠️ **Conversation Setup**\nStep 1: Send the bot name (e.g., 'SULTAN'):",
            threadID
        );
    }

    if (cmd === "start") {
        if (!convoConfig.botName || !convoConfig.targetGroupID || !convoConfig.msgFile) {
            return api.sendMessage("❌ Setup incomplete. Run 'convo on' first.", threadID);
        }
        if (convoConfig.active) {
            return api.sendMessage("❌ Already running.", threadID);
        }

        // Verify target group
        try {
            const threadInfo = await api.getThreadInfo(convoConfig.targetGroupID);
            if (!threadInfo) throw new Error();
        } catch (e) {
            return api.sendMessage("❌ Target group not found or bot not in that group.", threadID);
        }

        convoConfig.active = true;
        convoConfig.msgIndex = 0;
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(convoConfig, null, 2));

        startConvo(api);
        startMonitoring(api);

        return api.sendMessage(
            "✅ Conversation started!\n" +
            `• Target: ${convoConfig.targetGroupID}\n` +
            `• Speed: every ${convoConfig.intervalSec} seconds\n` +
            `• Group name lock: ${convoConfig.lockedGroupName || "off"}\n` +
            `• Nickname lock: ${convoConfig.unifiedNickname || "off"}`,
            threadID
        );
    }

    if (cmd === "off") {
        if (!convoConfig.active) {
            return api.sendMessage("❌ No active conversation.", threadID);
        }
        stopConvo();
        convoConfig.active = false;
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(convoConfig, null, 2));
        return api.sendMessage("✅ Conversation stopped.", threadID);
    }

    // Help
    return api.sendMessage(
        "📌 **Convo Commands**\n" +
        "» convo on    – start setup\n" +
        "» convo start – begin conversation\n" +
        "» convo off   – stop",
        threadID
    );
};

// ------------------- BACKGROUND TASKS -------------------
function startConvo(api) {
    if (sendInterval) clearInterval(sendInterval);
    sendInterval = setInterval(async () => {
        if (!convoConfig.active) return;
        const filePath = path.join(MSG_DIR, convoConfig.msgFile);
        if (!fs.existsSync(filePath)) {
            console.log("Message file missing, stopping.");
            stopConvo();
            return;
        }
        const lines = fs.readFileSync(filePath, "utf8").split("\n").filter(l => l.trim());
        if (lines.length === 0) return;
        const msg = lines[convoConfig.msgIndex % lines.length];
        convoConfig.msgIndex++;
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(convoConfig, null, 2));
        try {
            await api.sendMessage(msg, convoConfig.targetGroupID);
        } catch (e) {
            console.log("Send error:", e);
        }
    }, convoConfig.intervalSec * 1000);
}

function stopConvo() {
    if (sendInterval) clearInterval(sendInterval);
    sendInterval = null;
}

function startMonitoring(api) {
    // Monitor group name and nicknames every minute
    setInterval(async () => {
        if (!convoConfig.active) return;
        try {
            const threadInfo = await api.getThreadInfo(convoConfig.targetGroupID);
            // Group name lock
            if (convoConfig.lockedGroupName && threadInfo.threadName !== convoConfig.lockedGroupName) {
                await api.setTitle(convoConfig.lockedGroupName, convoConfig.targetGroupID);
            }
            // Nickname lock
            if (convoConfig.unifiedNickname) {
                for (const uid of threadInfo.participantIDs) {
                    const currentNick = threadInfo.nicknames?.[uid] || "";
                    if (currentNick !== convoConfig.unifiedNickname) {
                        await api.changeNickname(convoConfig.unifiedNickname, convoConfig.targetGroupID, uid);
                    }
                }
            }
        } catch (e) {
            console.log("Monitor error:", e);
        }
    }, 60000);
}
