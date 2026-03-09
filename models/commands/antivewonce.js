////////////////////////////////////////////////////////
// ANTI-VIEWONCE FEATURE (EXPERIMENTAL)
// YE BOT SULTAN BABU NE BANAYA HAI
////////////////////////////////////////////////////////

const fs = require('fs-extra');
const axios = require('axios');
const path = __dirname + '/cache/viewonce';

module.exports.config = {
    name: "antiviewonce",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "SULTAN BABU",
    description: "Try to save view-once media (experimental)",
    commandCategory: "UTILITY",
    usages: "",
    cooldowns: 5
};

module.exports.handleEvent = async function({ api, event }) {
    if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
    
    // Check if message is view-once
    if (event.type === "message" && event.messageReply) {
        // This is when someone replies to a view-once message
        // Sometimes the original media is still accessible
        try {
            const msg = event.messageReply;
            if (msg.attachments && msg.attachments.length > 0) {
                const attachment = msg.attachments[0];
                
                // Try to download
                const url = attachment.url;
                const filename = `${Date.now()}_${attachment.filename || 'media'}`;
                const filePath = `${path}/${filename}`;
                
                const response = await axios({
                    method: 'GET',
                    url: url,
                    responseType: 'stream'
                });
                
                response.data.pipe(fs.createWriteStream(filePath));
                
                // Send back to group
                api.sendMessage({
                    body: `🔓 View-Once media saved (experimental): ${filename}`,
                    attachment: fs.createReadStream(filePath)
                }, event.threadID);
            }
        } catch (e) {
            console.log("Anti-ViewOnce error:", e);
        }
    }
    
    // Another method - check for unsend/delete events
    if (event.type === "message_unsend") {
        // When a message is unsent, sometimes we can still access it if we logged it
        // This requires storing messages in database
        // Too complex for basic script
    }
};

module.exports.run = async function({ api, event }) {
    return api.sendMessage(
        "📸 Anti-ViewOnce feature active!\n" +
        "Note: Ye experimental hai, 100% kaam nahi karta.\n" +
        "Jab koi view-once media bheje, uske baad us message ko reply karo.\n" +
        "Bot try karega save karne ka.",
        event.threadID
    );
};
