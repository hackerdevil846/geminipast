const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "rip",
    aliases: [],
    version: "2.0",
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🪦 𝖢𝗋𝖾𝖺𝗍𝖾 𝖱𝖨𝖯 𝗍𝗈𝗆𝖻𝗌𝗍𝗈𝗇𝖾 𝗐𝗂𝗍𝗁 𝗎𝗌𝖾𝗋'𝗌 𝖺𝗏𝖺𝗍𝖺𝗋"
    },
    longDescription: {
      en: "🪦 𝖢𝗋𝖾𝖺𝗍𝖾 𝖺 𝖱𝖨𝖯 𝗍𝗈𝗆𝖻𝗌𝗍𝗈𝗇𝖾 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗎𝗌𝖾𝗋'𝗌 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗂𝖼𝗍𝗎𝗋𝖾"
    },
    guide: {
      en: "{𝗉}rip [@𝗆𝖾𝗇𝗍𝗂𝗈𝗇]"
    },
    dependencies: {
      "discord-image-generation": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    try {
      // Dependency check
      let dependenciesAvailable = true;
      try {
        require("discord-image-generation");
        require("fs-extra");
        require("path");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        return api.sendMessage("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝗋𝖾𝗊𝗎𝗂𝗋𝖾𝖽 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖽𝗂𝗌𝖼𝗈𝗋𝖽-𝗂𝗆𝖺𝗀𝖾-𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.", event.threadID, event.messageID);
      }

      const { threadID, messageID, senderID, mentions } = event;
      const mentionID = Object.keys(mentions)[0] || senderID;
      const targetName = mentions[mentionID] || "𝗒𝗈𝗎";

      // Get user info with error handling
      let userInfo;
      try {
        userInfo = await api.getUserInfo(mentionID);
      } catch (userError) {
        console.error("𝖤𝗋𝗋𝗈𝗋 𝖿𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈:", userError);
        return api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇!", threadID, messageID);
      }

      if (!userInfo || !userInfo[mentionID]) {
        return api.sendMessage("❌ 𝖴𝗌𝖾𝗋 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽!", threadID, messageID);
      }

      const avatarURL = userInfo[mentionID].profileUrl;
      
      if (!avatarURL) {
        return api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗂𝖼𝗍𝗎𝗋𝖾!", threadID, messageID);
      }

      // Validate avatar URL
      if (!avatarURL.startsWith('http')) {
        return api.sendMessage("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖺𝗏𝖺𝗍𝖺𝗋 𝖴𝖱𝖫!", threadID, messageID);
      }

      const processingMsg = await api.sendMessage("🪦 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗍𝗈𝗆𝖻𝗌𝗍𝗈𝗇𝖾...", threadID, messageID);

      // Generate RIP image with error handling
      let imgBuffer;
      try {
        imgBuffer = await new DIG.Rip().getImage(avatarURL);
        
        // Validate image buffer
        if (!imgBuffer || imgBuffer.length < 1000) {
          throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗂𝗆𝖺𝗀𝖾 𝖻𝗎𝖿𝖿𝖾𝗋 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽");
        }
      } catch (imageError) {
        console.error("𝖨𝗆𝖺𝗀𝖾 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", imageError);
        await api.unsendMessage(processingMsg.messageID);
        return api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝗂𝗆𝖺𝗀𝖾! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.", threadID, messageID);
      }

      // Create temporary directory
      const tmpDir = path.join(__dirname, "tmp");
      try {
        await fs.ensureDir(tmpDir);
      } catch (dirError) {
        console.error("𝖣𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", dirError);
        await api.unsendMessage(processingMsg.messageID);
        return api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒!", threadID, messageID);
      }

      const filePath = path.join(tmpDir, `${mentionID}_rip_${Date.now()}.png`);

      try {
        // Write file with validation
        await fs.writeFile(filePath, imgBuffer);
        
        // Verify file was written
        const stats = await fs.stat(filePath);
        if (stats.size < 1000) {
          throw new Error("𝖥𝗂𝗅𝖾 𝗐𝗋𝗂𝗍𝖾 𝖿𝖺𝗂𝗅𝖾𝖽");
        }
      } catch (fileError) {
        console.error("𝖥𝗂𝗅𝖾 𝗐𝗋𝗂𝗍𝖾 𝖾𝗋𝗋𝗈𝗋:", fileError);
        await api.unsendMessage(processingMsg.messageID);
        return api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗂𝗆𝖺𝗀𝖾!", threadID, messageID);
      }

      try {
        // Send message with image
        await api.sendMessage({
          body: `🪦 𝖱𝖾𝗌𝗍 𝗂𝗇 𝗉𝖾𝖺𝖼𝖾 ${targetName}...\n\n✨ 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖻𝗒 ${this.config.author}`,
          attachment: fs.createReadStream(filePath)
        }, threadID, messageID);

        // Clean up processing message
        await api.unsendMessage(processingMsg.messageID);
        
      } catch (sendError) {
        console.error("𝖬𝖾𝗌𝗌𝖺𝗀𝖾 𝗌𝖾𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", sendError);
        await api.unsendMessage(processingMsg.messageID);
        throw sendError;
      } finally {
        // Clean up file
        try {
          if (await fs.pathExists(filePath)) {
            await fs.unlink(filePath);
          }
        } catch (cleanupError) {
          console.warn("𝖥𝗂𝗅𝖾 𝖼𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError);
        }
      }
      
    } catch (error) {
      console.error("💥 𝖱𝖨𝖯 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
      
      let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
      
      if (error.message.includes('DIG') || error.message.includes('Rip')) {
        errorMessage = "❌ 𝖨𝗆𝖺𝗀𝖾 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖿𝖺𝗂𝗅𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
      } else if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
        errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
      }
      
      await api.sendMessage(errorMessage, event.threadID, event.messageID);
    }
  }
};
