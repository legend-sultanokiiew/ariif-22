// events/groupAuto.js - Fully automatic, no commands needed

module.exports = {
  name: "groupAuto",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "BHAI",
  description: "Auto group updates",
  
  async handleEvent({ api, event }) {
    const { threadID, logMessageType, logMessageData, senderID } = event;

    // ============================================
    // 🎉 1. WELCOME - Jab koi group join kare
    // ============================================
    if (logMessageType === "log:subscribe") {
      const addedUsers = logMessageData.addedParticipants;
      
      for (let user of addedUsers) {
        const userName = user.fullName;
        const userID = user.userFbId;
        
        try {
          // Group info
          const threadInfo = await api.getThreadInfo(threadID);
          const memberCount = threadInfo.participantIDs.length;
          
          // Welcome message
          const welcomeMsg = `
╔═══════❖•ೋ°👑°ೋ•❖═══════╗
   
   🎉 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐁𝐇𝐀𝐈 🎉
   
   ━━━━━━━━━━━━━━━━━━━
   
   ✨ 𝐍𝐚𝐦𝐞: ${userName}
   👥 𝐌𝐞𝐦𝐛𝐞𝐫𝐬: ${memberCount}
   📍 𝐒𝐭𝐚𝐭𝐮𝐬: New Member
   
   ━━━━━━━━━━━━━━━━━━━
   
   🎯 𝐑𝐮𝐥𝐞𝐬 𝐩𝐚𝐝𝐡 𝐥𝐞
   💬 𝐈𝐧𝐭𝐫𝐨 𝐝𝐞 𝐣𝐚𝐥𝐝𝐢
   
╚═══════❖•ೋ°👑°ೋ•❖═══════╝`;
          
          await api.sendMessage(welcomeMsg, threadID);
          
          // Extra mention
          await api.sendMessage({
            body: `👉 @${userName} ko welcome karo bhaio!`,
            mentions: [{ tag: userName, id: userID }]
          }, threadID);
          
        } catch (e) {
          console.log("Welcome error:", e);
        }
      }
    }

    // ============================================
    // 👋 2. GOODBYE - Jab koi leave kare ya remove ho
    // ============================================
    else if (logMessageType === "log:unsubscribe") {
      const leftUserID = logMessageData.leftParticipantFbId;
      
      try {
        const userInfo = await api.getUserInfo(leftUserID);
        const leftName = userInfo[leftUserID]?.name || "Koi member";
        
        // Check khud leave kiya ya remove kiya gaya
        if (leftUserID === senderID) {
          // Khud leave kiya
          await api.sendMessage(
            `👋 ${leftName} ne group chhod diya!\nBye bye 👋`,
            threadID
          );
        } else {
          // Admin ne remove kiya
          const removerInfo = await api.getUserInfo(senderID);
          const removerName = removerInfo[senderID]?.name || "Admin";
          
          await api.sendMessage(
            `⚠️ ${leftName} ko group se nikaal diya!\n🔨 By: ${removerName}`,
            threadID
          );
        }
      } catch (e) {
        console.log("Leave error:", e);
      }
    }

    // ============================================
    // 📞 3. CALL UPDATE - Jab call join kare
    // ============================================
    else if (logMessageType === "log:thread-call") {
      const callData = logMessageData;
      
      try {
        if (callData.event === "joined_call") {
          const joinerID = callData.caller_id;
          const joinerInfo = await api.getUserInfo(joinerID);
          const joinerName = joinerInfo[joinerID]?.name || "Koi";
          
          const callType = callData.video ? "📹 Video Call" : "🎧 Voice Call";
          
          await api.sendMessage(
            `📞 ${joinerName} ${callType} mein aagaya!\n👥 Total in call: ${callData.participants.length}`,
            threadID
          );
        }
        else if (callData.event === "left_call") {
          const leaverID = callData.caller_id;
          const leaverInfo = await api.getUserInfo(leaverID);
          const leaverName = leaverInfo[leaverID]?.name || "Koi";
          
          await api.sendMessage(
            `📞 ${leaverName} call chhod diya\n👥 Ab ${callData.participants.length} log hain`,
            threadID
          );
        }
      } catch (e) {
        console.log("Call error:", e);
      }
    }

    // ============================================
    // 📝 4. GROUP NAME CHANGE
    // ============================================
    else if (logMessageType === "log:thread-name") {
      const oldName = logMessageData.oldName || "Purana naam";
      const newName = logMessageData.newName;
      
      try {
        const changerInfo = await api.getUserInfo(senderID);
        const changerName = changerInfo[senderID]?.name || "Kisi ne";
        
        await api.sendMessage(
          `📝 Group name update!\n\n🔄 Old: ${oldName}\n✨ New: ${newName}\n👤 Changed by: ${changerName}`,
          threadID
        );
      } catch (e) {
        console.log("Name change error:", e);
      }
    }

    // ============================================
    // 🖼️ 5. GROUP ICON CHANGE
    // ============================================
    else if (logMessageType === "log:thread-image") {
      try {
        const changerInfo = await api.getUserInfo(senderID);
        const changerName = changerInfo[senderID]?.name || "Kisi ne";
        
        await api.sendMessage(
          `🖼️ Group ki DP change hui!\n👤 Changed by: ${changerName}`,
          threadID
        );
      } catch (e) {
        console.log("Icon change error:", e);
      }
    }

    // ============================================
    // 👑 6. NEW ADMIN ADDED
    // ============================================
    else if (logMessageType === "log:thread-admins") {
      if (logMessageData.ADMIN_EVENT === "add_admin") {
        const newAdminID = logMessageData.TARGET_ID;
        
        try {
          const newAdminInfo = await api.getUserInfo(newAdminID);
          const newAdminName = newAdminInfo[newAdminID]?.name || "Koi";
          
          const adderInfo = await api.getUserInfo(senderID);
          const adderName = adderInfo[senderID]?.name || "Kisi ne";
          
          await api.sendMessage(
            `👑 NEW ADMIN ALERT!\n\n✨ ${newAdminName} ab admin ban gaye!\n👤 Added by: ${adderName}`,
            threadID
          );
        } catch (e) {
          console.log("Admin error:", e);
        }
      }
    }

    // ============================================
    // 🔑 7. JOIN REQUEST (Private groups ke liye)
    // ============================================
    else if (logMessageType === "log:thread-approval-mode") {
      if (logMessageData.event === "bylink_join_request") {
        const requesterID = logMessageData.requester_id;
        
        try {
          const requesterInfo = await api.getUserInfo(requesterID);
          const requesterName = requesterInfo[requesterID]?.name || "Koi";
          
          await api.sendMessage(
            `🔑 Join Request!\n\n👤 ${requesterName} group join karna chahte hain`,
            threadID
          );
        } catch (e) {
          console.log("Request error:", e);
        }
      }
    }
  },

  // No run function - command nahi deni
};
