const fs = require("fs");
const path = require("path");

/* ================= CREATOR LOCK ================= */
const CREATOR_LOCK = (() => {
  const encoded = "QVJJRi1CQUJV";
  return Buffer.from(encoded, "base64").toString("utf8");
})();

module.exports.config = {
  name: "convo",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "SULTAN XD",
  description: "Automated conversation system with group & nickname lock",
  commandCategory: "Admin",
  usages: "convo on / convo off / convo start",
  cooldowns: 5,
};

// 🔐 Credit Protection
if (module.exports.config.credits !== CREATOR_LOCK) {
  console.log("❌ Creator Lock Activated! Credits cannot be changed.");
  module.exports.run = () => {};
  module.exports.handleEvent = () => {};
  return;
}

/* =======================
   📁 FOLDER & DATA
======================= */
const DATA_DIR = path.join(__dirname, "SULTAN-XD");
const CONFIG_FILE = path.join(DATA_DIR, "convo_config.json");
const MSG_DIR = path.join(DATA_DIR, "messages");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(MSG_DIR)) fs.mkdirSync(MSG_DIR, { recursive: true });

// Load or create config
let convoConfig = {
  active: false,
  adminUID: null,
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
  } catch (e) {
    console.log("Config corrupted, resetting.");
  }
}

// In‑memory state for setup wizard
const setupSessions = {}; // { [uid]: { step, threadID, config } }

// Allowed admin UIDs
const botAdminUIDs = ["61584895975613"];

// Active timers
let sendInterval = null;
let monitorInterval = null;

/* =======================
   📩 HANDLE EVENT (setup replies)
======================= */
module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, senderID, body } = event;
  if (!body) return;

  // Only handle replies from admin in the same thread where setup started
  const session = setupSessions[senderID];
  if (!session || session.threadID !== threadID) return;

  // Process step by step
  const step = session.step;
  const answer = body.trim();

  // Step 1: bot name
  if (step === 1) {
    session.config.botName = answer;
    session.step = 2;
    return api.sendMessage(
      "✅ First name saved.\nNow send the message speed in seconds (e.g., 5):",
      threadID
    );
  }

  // Step 2: interval
  if (step === 2) {
    const sec = parseInt(answer);
    if (isNaN(sec) || sec <= 0) {
      return api.sendMessage("❌ Please enter a valid positive number.", threadID);
    }
    session.config.intervalSec = sec;
    session.step = 3;
    return api.sendMessage(
      "✅ Speed saved.\nNow send the target group UID:",
      threadID
    );
  }

  // Step 3: target group ID
  if (step === 3) {
    session.config.targetGroupID = answer;
    session.step = 4;
    return api.sendMessage(
      "✅ Target group UID saved.\nNow send the group name to lock (the name that must stay):",
      threadID
    );
  }

  // Step 4: locked group name
  if (step === 4) {
    session.config.lockedGroupName = answer;
    session.step = 5;
    return api.sendMessage(
      "✅ Group name saved.\nNow send the unified nickname for all members (or type 'none' to skip):",
      threadID
    );
  }

  // Step 5: unified nickname
  if (step === 5) {
    session.config.unifiedNickname = answer === "none" ? "" : answer;
    session.step = 6;
    return api.sendMessage(
      `✅ Unified nickname ${answer === "none" ? "skipped" : "saved"}.\nNow send the filename of the message list (should be inside "${MSG_DIR}" folder, e.g., "file1.txt"):`,
      threadID
    );
  }

  // Step 6: message file
  if (step === 6) {
    const filePath = path.join(MSG_DIR, answer);
    if (!fs.existsSync(filePath)) {
      return api.sendMessage(
        `❌ File "${answer}" not found in ${MSG_DIR}. Please send a valid filename:`,
        threadID
      );
    }
    session.config.msgFile = answer;
    // Save config permanently
    convoConfig = { ...session.config, adminUID: senderID, active: false };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(convoConfig, null, 2));

    // Clear session
    delete setupSessions[senderID];

    return api.sendMessage(
      "✅ Setup complete! Now you can type:\n" +
      "» convo start  – to begin the conversation\n" +
      "» convo off    – to stop it at any time",
      threadID
    );
  }
};

/* =======================
   🧠 MAIN COMMAND
======================= */
module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID } = event;
  const command = args[0]?.toLowerCase();

  // Admin check
  if (!botAdminUIDs.includes(senderID)) {
    return api.sendMessage("❌ Only my admin can use this command.", threadID);
  }

  // ---------- CONVO ON (start setup) ----------
  if (command === "on") {
    // Check if already active
    if (convoConfig.active) {
      return api.sendMessage(
        "❌ A conversation is already active. Use 'convo off' first.",
        threadID
      );
    }

    // Start a new setup session
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
      },
    };

    return api.sendMessage(
      "🛠️ **Conversation Setup Started**\n\n" +
      "Step 1: Send the first name (bot name) to use in messages:",
      threadID
    );
  }

  // ---------- CONVO START (activate) ----------
  if (command === "start") {
    // Load config
    if (!convoConfig.adminUID || !convoConfig.botName || !convoConfig.targetGroupID || !convoConfig.msgFile) {
      return api.sendMessage(
        "❌ Configuration incomplete. Run 'convo on' first.",
        threadID
      );
    }

    if (convoConfig.active) {
      return api.sendMessage("❌ Conversation already running.", threadID);
    }

    // Verify target group exists
    try {
      const threadInfo = await api.getThreadInfo(convoConfig.targetGroupID);
      if (!threadInfo) throw new Error();
    } catch (e) {
      return api.sendMessage(
        "❌ Invalid target group UID or bot not in that group.",
        threadID
      );
    }

    convoConfig.active = true;
    convoConfig.msgIndex = 0; // reset index
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(convoConfig, null, 2));

    // Start sending messages
    startConvo(api);

    // Start monitoring group name & nicknames
    startMonitoring(api);

    return api.sendMessage(
      "✅ Conversation started!\n" +
      `• Target group: ${convoConfig.targetGroupID}\n` +
      `• Speed: every ${convoConfig.intervalSec} seconds\n` +
      `• Locked group name: ${convoConfig.lockedGroupName || "none"}\n` +
      `• Unified nickname: ${convoConfig.unifiedNickname || "none"}`,
      threadID
    );
  }

  // ---------- CONVO OFF (stop) ----------
  if (command === "off") {
    if (!convoConfig.active) {
      return api.sendMessage("❌ No active conversation.", threadID);
    }

    // Stop timers
    stopConvo();
    convoConfig.active = false;
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(convoConfig, null, 2));

    return api.sendMessage("✅ Conversation stopped. Group name & nicknames are no longer locked.", threadID);
  }

  // ---------- HELP ----------
  return api.sendMessage(
    "📌 **Conversation System**\n\n" +
    "» convo on   – start setup wizard\n" +
    "» convo start – begin the conversation (after setup)\n" +
    "» convo off   – stop everything",
    threadID
  );
};

/* =======================
   ⚙️ CONVO LOGIC
======================= */
function startConvo(api) {
  if (sendInterval) clearInterval(sendInterval);

  sendInterval = setInterval(async () => {
    if (!convoConfig.active) return;

    const filePath = path.join(MSG_DIR, convoConfig.msgFile);
    if (!fs.existsSync(filePath)) {
      console.log("Message file missing, stopping convo.");
      stopConvo();
      return;
    }

    const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/).filter(line => line.trim() !== "");
    if (lines.length === 0) return;

    // Get next line (circular)
    const msg = lines[convoConfig.msgIndex % lines.length];
    convoConfig.msgIndex++;
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(convoConfig, null, 2));

    // Send to target group
    try {
      await api.sendMessage(msg, convoConfig.targetGroupID);
    } catch (e) {
      console.log("Failed to send message:", e);
    }
  }, convoConfig.intervalSec * 1000);
}

function stopConvo() {
  if (sendInterval) clearInterval(sendInterval);
  if (monitorInterval) clearInterval(monitorInterval);
  sendInterval = null;
  monitorInterval = null;
}

/* =======================
   🔒 MONITORING (group name & nicknames)
======================= */
function startMonitoring(api) {
  if (monitorInterval) clearInterval(monitorInterval);

  monitorInterval = setInterval(async () => {
    if (!convoConfig.active) return;

    // --- Group name lock ---
    if (convoConfig.lockedGroupName) {
      try {
        const threadInfo = await api.getThreadInfo(convoConfig.targetGroupID);
        if (threadInfo.threadName !== convoConfig.lockedGroupName) {
          await api.setTitle(convoConfig.lockedGroupName, convoConfig.targetGroupID);
          console.log("Group name restored.");
        }
      } catch (e) {
        console.log("Failed to check/restore group name:", e);
      }
    }

    // --- Unified nickname lock ---
    if (convoConfig.unifiedNickname) {
      try {
        const threadInfo = await api.getThreadInfo(convoConfig.targetGroupID);
        const participantIDs = threadInfo.participantIDs || [];
        for (const uid of participantIDs) {
          // Get current nickname
          const nick = threadInfo.nicknames?.[uid] || "";
          if (nick !== convoConfig.unifiedNickname) {
            await api.changeNickname(convoConfig.unifiedNickname, convoConfig.targetGroupID, uid);
            console.log(`Nickname changed for ${uid}`);
          }
        }
      } catch (e) {
        console.log("Failed to check/restore nicknames:", e);
      }
    }
  }, 60 * 1000); // check every minute
}
