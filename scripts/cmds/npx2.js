const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "npx2",
    aliases: [],
    version: "1.0.1",
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "𝖥𝗎𝗇 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇 𝖼𝗈𝗆𝗆𝖺𝗇𝖽"
    },
    longDescription: {
      en: "𝖱𝖾𝗌𝗉𝗈𝗇𝖽𝗌 𝗍𝗈 𝖾𝗆𝗈𝗃𝗂𝗌 𝗐𝗂𝗍𝗁 𝖿𝗎𝗇 𝗏𝗂𝖽𝖾𝗈𝗌"
    },
    guide: {
      en: "𝖴𝗌𝖾 𝖾𝗆𝗈𝗃𝗂𝗌: 😇 😶‍🌫️ 😽"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ message }) {
    try {
      // Dependency check
      let axiosAvailable = true;
      let fsAvailable = true;
      try {
        require("axios");
        require("fs-extra");
      } catch (e) {
        axiosAvailable = false;
        fsAvailable = false;
      }

      if (!axiosAvailable || !fsAvailable) {
        return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
      }

      await message.reply("🖤 𝖤𝗆𝗈𝗃𝗂𝖱𝖾𝖺𝖼𝗍𝟤 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗂𝗌 𝖺𝖼𝗍𝗂𝗏𝖾! 💫\n𝖲𝖾𝗇𝖽 😇, 😶‍🌫️, 𝗈𝗋 😽 𝗍𝗈 𝗀𝖾𝗍 𝖺 𝗌𝗉𝖾𝖼𝗂𝖺𝗅 𝗏𝗂𝖽𝖾𝗈");
    } catch (error) {
      console.error("💥 𝖤𝗆𝗈𝗃𝗂𝖱𝖾𝖺𝖼𝗍𝟤 𝗈𝗇𝖲𝗍𝖺𝗋𝗍 𝖾𝗋𝗋𝗈𝗋:", error);
    }
  },

  onChat: async function({ api, event, message }) {
    try {
      // Dependency check
      let axiosAvailable = true;
      let fsAvailable = true;
      try {
        require("axios");
        require("fs-extra");
      } catch (e) {
        axiosAvailable = false;
        fsAvailable = false;
      }

      if (!axiosAvailable || !fsAvailable) {
        return;
      }

      const content = event.body ? event.body.trim() : '';
      
      // Emojis to trigger the response
      const triggerEmojis = ["😇", "😶‍🌫️", "😽"];
      
      // Check if the message starts with any of the trigger emojis
      const shouldRespond = triggerEmojis.some(emoji => content.startsWith(emoji));
      
      if (!shouldRespond) {
        return;
      }

      console.log(`🎭 𝖤𝗆𝗈𝗃𝗂 𝖽𝖾𝗍𝖾𝖼𝗍𝖾𝖽: ${content}`);
      
      // Video URLs (same as original)
      const videoUrls = [
        "https://i.imgur.com/LLucP15.mp4", 
        "https://i.imgur.com/DEBRSER.mp4"
      ];
      
      // Select random video
      const randomVideoUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];
      
      console.log(`📥 𝖲𝖾𝗅𝖾𝖼𝗍𝖾𝖽 𝗏𝗂𝖽𝖾𝗈: ${randomVideoUrl}`);
      
      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache');
      try {
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
        }
      } catch (dirError) {
        console.error("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
        return;
      }
      
      const videoPath = path.join(cacheDir, `emojireact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp4`);
      
      // Download the video using axios with timeout and error handling
      try {
        const response = await axios({
          method: 'GET',
          url: randomVideoUrl,
          responseType: 'stream',
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        const writer = fs.createWriteStream(videoPath);
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        // Verify file was written successfully
        const stats = await fs.stat(videoPath);
        if (stats.size < 1000) { // At least 1KB
          throw new Error("𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖿𝗂𝗅𝖾 𝗂𝗌 𝗍𝗈𝗈 𝗌𝗆𝖺𝗅𝗅");
        }

        console.log(`✅ 𝖵𝗂𝖽𝖾𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 (${(stats.size / 1024 / 1024).toFixed(2)}𝖬𝖡)`);
        
        // Send the video response
        await message.reply({
          body: "🖤🥀 𝖧𝖾𝗋𝖾'𝗌 𝖺 𝗌𝗉𝖾𝖼𝗂𝖺𝗅 𝖼𝗅𝗂𝗉 𝖿𝗈𝗋 𝗒𝗈𝗎! 💫",
          attachment: fs.createReadStream(videoPath)
        });
        
        console.log("✨ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗌𝖾𝗇𝗍 𝖾𝗆𝗈𝗃𝗂 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇");
        
      } catch (downloadError) {
        console.error("❌ 𝖵𝗂𝖽𝖾𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", downloadError.message);
        return;
      }
      
      // Clean up after sending
      setTimeout(async () => {
        try {
          if (await fs.pathExists(videoPath)) {
            await fs.unlink(videoPath);
            console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝗏𝗂𝖽𝖾𝗈 𝖿𝗂𝗅𝖾");
          }
        } catch (cleanupError) {
          console.warn("𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError.message);
        }
      }, 5000);
      
    } catch (error) {
      console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝖤𝗆𝗈𝗃𝗂𝖱𝖾𝖺𝖼𝗍𝟤:", error);
    }
  }
};
