const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "npx",
    aliases: [],
    version: "1.0.1",
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "💖 𝖱𝖾𝖺𝖼𝗍𝗌 𝗐𝗂𝗍𝗁 𝖺 𝗌𝗉𝖾𝖼𝗂𝖺𝗅 𝗏𝗂𝖽𝖾𝗈 𝖿𝗈𝗋 𝖾𝗆𝗈𝗃𝗂 𝗍𝗋𝗂𝗀𝗀𝖾𝗋𝗌"
    },
    longDescription: {
      en: "💖 𝖱𝖾𝖺𝖼𝗍𝗌 𝗐𝗂𝗍𝗁 𝖺 𝗌𝗉𝖾𝖼𝗂𝖺𝗅 𝗏𝗂𝖽𝖾𝗈 𝗐𝗁𝖾𝗇 𝖽𝖾𝗍𝖾𝖼𝗍𝗂𝗇𝗀 𝗌𝗉𝖾𝖼𝗂𝖿𝗂𝖼 𝖾𝗆𝗈𝗃𝗂𝗌"
    },
    category: "𝖾𝗇𝗍𝖾𝗋𝗍𝖺𝗂𝗇𝗆𝖾𝗇𝗍",
    guide: {
      en: "𝖲𝖾𝗇𝖽: 🥰 𝗈𝗋 🤩"
    },
    dependencies: {
      "request": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ message }) {
    try {
      // Dependency validation
      let requestAvailable = true;
      let fsAvailable = true;
      
      try {
        require("request");
      } catch (e) {
        requestAvailable = false;
      }
      
      try {
        require("fs-extra");
      } catch (e) {
        fsAvailable = false;
      }

      if (!requestAvailable || !fsAvailable) {
        return; // Silent fail
      }
    } catch (error) {
      // Silent fail
    }
  },

  onChat: async function ({ api, event, message }) {
    try {
      const { threadID, messageID, body } = event;
      
      // Validate input
      if (!body || typeof body !== 'string') {
        return;
      }

      const content = body.trim();
      const triggerEmojis = ["🥰", "🤩"];
      
      // Check if message starts with trigger emoji
      const shouldReact = triggerEmojis.some(emoji => content.startsWith(emoji));

      if (!shouldReact) {
        return;
      }

      console.log(`🎭 𝖤𝗆𝗈𝗃𝗂 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇 𝗍𝗋𝗂𝗀𝗀𝖾𝗋𝖾𝖽: ${content.substring(0, 2)}`);

      const videoLinks = [
        "https://i.imgur.com/LLucP15.mp4",
        "https://i.imgur.com/DEBRSER.mp4"
      ];
      
      const randomIndex = Math.floor(Math.random() * videoLinks.length);
      const selectedVideo = videoLinks[randomIndex];
      
      console.log(`📹 𝖲𝖾𝗅𝖾𝖼𝗍𝖾𝖽 𝗏𝗂𝖽𝖾𝗈: ${selectedVideo}`);

      // Download video with timeout and error handling
      const media = await new Promise((resolve, reject) => {
        const req = request.get({ 
          url: selectedVideo, 
          encoding: null,
          timeout: 30000 // 30 second timeout
        }, (error, response, body) => {
          if (error) {
            reject(error);
            return;
          }
          
          if (response.statusCode !== 200) {
            reject(new Error(`𝖧𝖳𝖳𝖯 ${response.statusCode}`));
            return;
          }
          
          if (!body || body.length === 0) {
            reject(new Error("𝖤𝗆𝗉𝗍𝗒 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾"));
            return;
          }
          
          resolve(body);
        });
        
        // Handle request timeout
        req.on('timeout', () => {
          req.destroy();
          reject(new Error("𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍"));
        });
      });

      // Create unique file path
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const filePath = __dirname + `/tmp_emojireact_${timestamp}_${randomSuffix}.mp4`;
      
      // Write file with error handling
      try {
        await fs.writeFile(filePath, media);
        console.log(`✅ 𝖵𝗂𝖽𝖾𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽: ${(media.length / 1024 / 1024).toFixed(2)}𝖬𝖡`);
      } catch (writeError) {
        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗐𝗋𝗂𝗍𝖾 𝗏𝗂𝖽𝖾𝗈 𝖿𝗂𝗅𝖾:", writeError);
        return;
      }

      // Verify file exists and has content
      try {
        const stats = await fs.stat(filePath);
        if (stats.size === 0) {
          throw new Error("𝖤𝗆𝗉𝗍𝗒 𝖿𝗂𝗅𝖾");
        }
      } catch (statError) {
        console.error("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖿𝗂𝗅𝖾:", statError);
        await this.cleanupFile(filePath);
        return;
      }

      // Send message with video
      await message.reply({
        body: "🖤🥀 𝖧𝖾𝗋𝖾'𝗌 𝖺 𝗌𝗉𝖾𝖼𝗂𝖺𝗅 𝖼𝗅𝗂𝗉 𝖿𝗈𝗋 𝗒𝗈𝗎! 💫",
        attachment: fs.createReadStream(filePath)
      });

      // Add reaction
      try {
        await api.setMessageReaction("🖤", messageID, () => {}, true);
        console.log("✅ 𝖱𝖾𝖺𝖼𝗍𝗂𝗈𝗇 𝖺𝖽𝖽𝖾𝖽");
      } catch (reactionError) {
        console.warn("⚠️ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖺𝖽𝖽 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError.message);
      }

      // Cleanup file after delay
      setTimeout(async () => {
        await this.cleanupFile(filePath);
      }, 5000);

    } catch (error) {
      console.error("💥 𝖤𝗆𝗈𝗃𝗂𝖱𝖾𝖺𝖼𝗍 𝖾𝗋𝗋𝗈𝗋:", error);
      // Silent fail - no error messages to user
    }
  },

  // Helper function for file cleanup
  cleanupFile: async function(filePath) {
    try {
      if (await fs.pathExists(filePath)) {
        await fs.unlink(filePath);
        console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾");
      }
    } catch (cleanupError) {
      console.warn("⚠️ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
    }
  }
};
