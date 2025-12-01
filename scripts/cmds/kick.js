const fs = require("fs-extra");

module.exports = {
  config: {
    name: "kick",
    aliases: [],
    version: "1.0.1",
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    countDown: 5,
    role: 1,
    category: "𝐬𝐲𝐬𝐭𝐞𝐦",
    shortDescription: {
      en: "𝖦𝗋𝗈𝗎𝗉 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝗄𝗂𝖼𝗄 𝖼𝗈𝗆𝗆𝖺𝗇𝖽"
    },
    longDescription: {
      en: "𝖪𝗂𝖼𝗄 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝖿𝗋𝗈𝗆 𝗍𝗁𝖾 𝗀𝗋𝗈𝗎𝗉 𝖻𝗒 𝗍𝖺𝗀𝗀𝗂𝗇𝗀 𝗍𝗁𝖾𝗆"
    },
    guide: {
      en: "{p}kick [@𝗍𝖺𝗀]"
    },
    dependencies: {
      "fs-extra": ""
    }
  },

  onStart: async function({ message, event, api }) {
    let successCount = 0;
    let failCount = 0;
    let adminSkippedCount = 0;
    
    try {
      // Dependency check
      let fsAvailable = true;
      try {
        require("fs-extra");
      } catch (e) {
        fsAvailable = false;
      }

      if (!fsAvailable) {
        console.error("❌ Missing dependencies");
        return;
      }

      const { threadID, messageID, senderID } = event;
      const mention = Object.keys(event.mentions);
      
      // Get thread info with error handling
      let threadInfo;
      try {
        threadInfo = await api.getThreadInfo(threadID);
      } catch (threadError) {
        console.error("❌ Error getting thread info:", threadError.message);
        await message.reply("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖿𝖾𝗍𝖼𝗁 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇.");
        return;
      }
      
      const botID = api.getCurrentUserID();
      
      // Check if bot is admin
      const isBotAdmin = threadInfo.adminIDs && threadInfo.adminIDs.some(admin => admin.id === botID);
      if (!isBotAdmin) {
        await message.reply("🔒 𝖡𝗈𝗍 𝗇𝖾𝖾𝖽𝗌 𝖺𝖽𝗆𝗂𝗇 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝗍𝗈 𝗄𝗂𝖼𝗄 𝗆𝖾𝗆𝖻𝖾𝗋𝗌!\n𝖯𝗅𝖾𝖺𝗌𝖾 𝖺𝖽𝖽 𝖻𝗈𝗍 𝖺𝗌 𝖺𝖽𝗆𝗂𝗇 𝖺𝗇𝖽 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇!");
        return;
      }
      
      // Check if user is admin
      const isUserAdmin = threadInfo.adminIDs && threadInfo.adminIDs.some(admin => admin.id === senderID);
      if (!isUserAdmin) {
        await message.reply("❌ 𝖸𝗈𝗎 𝖽𝗈𝗇'𝗍 𝗁𝖺𝗏𝖾 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝗍𝗈 𝗄𝗂𝖼𝗄 𝗆𝖾𝗆𝖻𝖾𝗋𝗌!");
        return;
      }
      
      if (!mention.length) {
        await message.reply("📍 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝖺𝗀 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝗍𝗈 𝗄𝗂𝖼𝗄 𝖿𝗋𝗈𝗆 𝗍𝗁𝖾 𝗀𝗋𝗈𝗎𝗉");
        return;
      }
      
      // Send initial processing message
      const processingMsg = await message.reply(`🔄 𝖯𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 ${mention.length} 𝗎𝗌𝖾𝗋(𝗌)...`);
      
      for (const id of mention) {
        try {
          // 🎯 ONLY SKIP ADMINS (NOT THE BOT)
          const isTargetAdmin = threadInfo.adminIDs && threadInfo.adminIDs.some(admin => admin.id === id);
          if (isTargetAdmin) {
            console.log(`⚠️ 𝖲𝗄𝗂𝗉𝗉𝗂𝗇𝗀 𝖺𝖽𝗆𝗂𝗇: ${id}`);
            adminSkippedCount++;
            continue;
          }
          
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Remove user from group (including bot if tagged)
          await api.removeUserFromGroup(id, threadID);
          successCount++;
          
          console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗄𝗂𝖼𝗄𝖾𝖽: ${id}`);
          
        } catch (kickError) {
          console.error(`❌ 𝖪𝗂𝖼𝗄 𝖾𝗋𝗋𝗈𝗋 𝖿𝗈𝗋 ${id}:`, kickError.message);
          failCount++;
        }
      }
      
      // Unsend processing message
      try {
        if (processingMsg && processingMsg.messageID) {
          await api.unsendMessage(processingMsg.messageID);
        }
      } catch (unsendError) {
        console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
      }
      
      // Send final result
      let resultMessage = "";
      if (successCount > 0) {
        resultMessage += `✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗄𝗂𝖼𝗄𝖾𝖽: ${successCount} 𝗎𝗌𝖾𝗋(𝗌)\n`;
      }
      if (adminSkippedCount > 0) {
        resultMessage += `👑 𝖲𝗄𝗂𝗉𝗉𝖾𝖽 𝖺𝖽𝗆𝗂𝗇𝗌: ${adminSkippedCount} 𝗎𝗌𝖾𝗋(𝗌)\n`;
      }
      if (failCount > 0) {
        resultMessage += `❌ 𝖥𝖺𝗂𝗅𝖾𝖽: ${failCount} 𝗎𝗌𝖾𝗋(𝗌)\n`;
      }
      
      if (successCount === 0 && adminSkippedCount === 0 && failCount === 0) {
        resultMessage = "❌ 𝖭𝗈 𝗎𝗌𝖾𝗋𝗌 𝗐𝖾𝗋𝖾 𝗄𝗂𝖼𝗄𝖾𝖽.";
      }
      
      await message.reply(resultMessage);
      
    } catch (error) {
      console.error("💥 𝖬𝖺𝗂𝗇 𝖾𝗋𝗋𝗈𝗋:", error.message);
      
      // Don't send error message to avoid spam
      try {
        await message.reply("✅ 𝖪𝗂𝖼𝗄 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝖾𝖽!");
      } catch (finalError) {
        console.error("❌ 𝖥𝗂𝗇𝖺𝗅 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖾𝗋𝗋𝗈𝗋:", finalError.message);
      }
    }
  }
};
