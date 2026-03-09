const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "lockname",
    version: "1.0.0",
    hasPermssion: 2,            // Group admin bhi use kar sakte hain
    credits: "SULTAN XD",
    description: "Group name lock/unlock",
    commandCategory: "Admin",
    usages: "lockname on [name] / lockname off / lockname status",
    cooldowns: 5,
};

// 👑 Sirf ye UIDs is command ko use kar sakte hain (optional)
const ALLOWED_UIDS = ["61584895975613"];   // Apna UID yahan dalo

// 📁 Data file
const DATA_DIR = path.join(__dirname, "SULTAN-XD");
const LOCK_FILE = path.join(DATA_DIR, "locked_names.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Load locked groups
let lockedGroups = {};
if (fs.existsSync(LOCK_FILE)) {
    try {
        lockedGroups = JSON.parse(fs.readFileSync(LOCK_FILE, "utf8"));
    } catch (e) {
        console.log("Lock file corrupted, resetting.");
        lockedGroups = {};
    }
}

// Save locked groups
function saveLocks() {
    fs.writeFileSync(LOCK_FILE, JSON.stringify(lockedGroups, null, 2));
}

/* =======================
   🔍 MONITOR (handleEvent)
======================= */
module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, isGroup } = event;
    if (!isGroup) return;

    // Check if this group is locked
    if (!lockedGroups[threadID]) return;

    // Get current group name
    try {
        const threadInfo = await api.getThreadInfo(threadID);
        const currentName = threadInfo.threadName;
        const lockedName = lockedGroups[threadID];

        if (currentName !== lockedName) {
            // Revert to locked name
            await api.setTitle(lockedName, threadID);
            console.log(`Reverted group name in ${threadID} to "${lockedName}"`);
        }
    } catch (e) {
        console.log("Error in lockname monitor:", e);
    }
};

/* =======================
   🧠 MAIN COMMAND
======================= */
module.exports.run = async function ({ api, event, args }) {
    const { threadID, senderID, isGroup } = event;
    if (!isGroup) {
        return api.sendMessage("❌ This command works only in groups.", threadID);
    }

    // Admin check (optional – if you want to restrict further)
    if (ALLOWED_UIDS.length > 0 && !ALLOWED_UIDS.includes(senderID)) {
        return api.sendMessage("❌ Only my admin can use this command.", threadID);
    }

    const action = args[0]?.toLowerCase();

    // ---------- LOCKNAME ON ----------
    if (action === "on") {
        let nameToLock = args.slice(1).join(" ").trim();

        if (!nameToLock) {
            // If no name provided, use current group name
            try {
                const threadInfo = await api.getThreadInfo(threadID);
                nameToLock = threadInfo.threadName;
                if (!nameToLock) {
                    return api.sendMessage("❌ Could not fetch current group name. Please provide a name.", threadID);
                }
            } catch (e) {
                return api.sendMessage("❌ Failed to get group info.", threadID);
            }
        }

        lockedGroups[threadID] = nameToLock;
        saveLocks();

        return api.sendMessage(
            `✅ Group name locked to: "${nameToLock}"\nNow anyone changing it will be reverted automatically.`,
            threadID
        );
    }

    // ---------- LOCKNAME OFF ----------
    if (action === "off") {
        if (!lockedGroups[threadID]) {
            return api.sendMessage("❌ This group is not locked.", threadID);
        }
        delete lockedGroups[threadID];
        saveLocks();
        return api.sendMessage("✅ Group name lock removed.", threadID);
    }

    // ---------- LOCKNAME STATUS ----------
    if (action === "status") {
        if (lockedGroups[threadID]) {
            return api.sendMessage(`🔒 Group name is locked to: "${lockedGroups[threadID]}"`, threadID);
        } else {
            return api.sendMessage("🔓 Group name is not locked.", threadID);
        }
    }

    // ---------- HELP ----------
    return api.sendMessage(
        "📌 **Group Name Lock**\n\n" +
        "» lockname on [name]   – Lock group name (uses current name if not given)\n" +
        "» lockname off          – Unlock group name\n" +
        "» lockname status       – Check lock status",
        threadID
    );
};
