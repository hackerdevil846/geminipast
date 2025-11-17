const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// 🔒 Enhanced security with immutable credits
const lockedCredits = Object.freeze("𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽");
const lockedTagline = Object.freeze("💚 𝖯𝗈𝗐𝖾𝗋𝖾𝖽 𝖻𝗒 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽");

// 🔐 Tamper-proof verification
function verifyTagline(text) {
  if (!text.includes(lockedTagline)) {
    throw new Error("🚫 𝖴𝗇𝖺𝗎𝗍𝗁𝗈𝗋𝗂𝗓𝖾𝖽 𝗆𝗈𝖽𝗂𝖿𝗂𝖼𝖺𝗍𝗂𝗈𝗇 𝖽𝖾𝗍𝖾𝖼𝗍𝖾𝖽");
  }
}

module.exports = {
  config: {
    name: "pintrest",
    aliases: [],
    version: "2.0.0",
    author: lockedCredits,
    countDown: 3,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "𝖥𝖾𝗍𝖼𝗁 𝖼𝗈𝗎𝗉𝗅𝖾 𝖽𝗉 𝗂𝗆𝖺𝗀𝖾𝗌 𝖿𝗋𝗈𝗆 𝖯𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍"
    },
    longDescription: {
      en: "𝖲𝖾𝖺𝗋𝖼𝗁 𝖺𝗇𝖽 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖼𝗈𝗎𝗉𝗅𝖾 𝖽𝗉 𝗂𝗆𝖺𝗀𝖾𝗌 𝖿𝗋𝗈𝗆 𝖯𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍"
    },
    guide: {
      en: "{p}pintrest [𝗊𝗎𝖾𝗋𝗒] - [𝗇𝗎𝗆𝖻𝖾𝗋]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": ""
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      // Dependency check with validation
      let dependenciesAvailable = true;
      try {
        require("axios");
        require("fs-extra");
        require("path");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝗋𝖾𝗊𝗎𝗂𝗋𝖾𝖽 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
      }

      const query = args.join(" ");
      if (!query) {
        return message.reply(`✨ 𝖴𝗌𝖺𝗀𝖾 𝖦𝗎𝗂𝖽𝖾:\n${this.config.name} [𝗊𝗎𝖾𝗋𝗒] - [𝗇𝗎𝗆𝖻𝖾𝗋]\n📌 𝖤𝗑𝖺𝗆𝗉𝗅𝖾: ${this.config.name} 𝖼𝗎𝗍𝖾 𝖼𝗈𝗎𝗉𝗅𝖾 - 5`);
      }

      if (!query.includes("-")) {
        return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 𝗍𝗁𝖾 𝖿𝗈𝗋𝗆𝖺𝗍: [𝗊𝗎𝖾𝗋𝗒] - [𝗇𝗎𝗆𝖻𝖾𝗋]");
      }

      const [searchTerm, countStr] = query.split("-").map(str => str.trim());
      
      if (!searchTerm) {
        return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗌𝖾𝖺𝗋𝖼𝗁 𝗍𝖾𝗋𝗆.");
      }

      const count = Math.min(parseInt(countStr) || 1, 10);
      
      if (count < 1 || count > 10) {
        return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗌𝗉𝖾𝖼𝗂𝖿𝗒 𝖺 𝗇𝗎𝗆𝖻𝖾𝗋 𝖻𝖾𝗍𝗐𝖾𝖾𝗇 1 𝖺𝗇𝖽 10.");
      }

      // Create cache directory
      const cacheDir = path.join(__dirname, "cache", "pintrest");
      try {
        await fs.ensureDir(cacheDir);
      } catch (dirError) {
        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError.message);
        return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
      }

      const loadingMsg = await message.reply("⏳ 𝖲𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖯𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍...");

      try {
        const apiUrl = `https://rudra-pintrest-server-wg55.onrender.com/dp?q=${encodeURIComponent(searchTerm)}&n=${count}`;
        const response = await axios.get(apiUrl, { 
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        if (!response.data?.data?.length) {
          await message.unsend(loadingMsg.messageID);
          return message.reply("❌ 𝖭𝗈 𝗂𝗆𝖺𝗀𝖾𝗌 𝖿𝗈𝗎𝗇𝖽. 𝖳𝗋𝗒 𝖺 𝖽𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝗌𝖾𝖺𝗋𝖼𝗁 𝗍𝖾𝗋𝗆!");
        }

        const images = response.data.data.slice(0, count);
        const attachments = [];
        const downloadedFiles = [];

        for (const [index, imageUrl] of images.entries()) {
          try {
            const imagePath = path.join(cacheDir, `pinterest_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}.jpg`);
            
            const imageResponse = await axios.get(imageUrl, {
              responseType: 'arraybuffer',
              timeout: 25000,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://www.pinterest.com/'
              },
              maxContentLength: 10 * 1024 * 1024 // 10MB limit
            });

            // Verify it's actually an image
            const contentType = imageResponse.headers['content-type'];
            if (!contentType || !contentType.startsWith('image/')) {
              console.warn(`❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗈𝗇𝗍𝖾𝗇𝗍 𝗍𝗒𝗉𝖾 𝖿𝗈𝗋 𝗂𝗆𝖺𝗀𝖾 ${index + 1}:`, contentType);
              continue;
            }

            await fs.writeFile(imagePath, imageResponse.data);
            
            // Verify file was written successfully
            const stats = await fs.stat(imagePath);
            if (stats.size > 1000) { // At least 1KB
              attachments.push(fs.createReadStream(imagePath));
              downloadedFiles.push(imagePath);
            } else {
              console.warn(`❌ 𝖨𝗆𝖺𝗀𝖾 ${index + 1} 𝗂𝗌 𝗍𝗈𝗈 𝗌𝗆𝖺𝗅𝗅, 𝗌𝗄𝗂𝗉𝗉𝗂𝗇𝗀`);
              await fs.unlink(imagePath).catch(() => {});
            }
          } catch (error) {
            console.error(`❌ 𝖤𝗋𝗋𝗈𝗋 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾 ${index + 1}:`, error.message);
          }
        }

        if (attachments.length === 0) {
          await message.unsend(loadingMsg.messageID);
          return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗇𝗒 𝗂𝗆𝖺𝗀𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
        }

        const successMessage = `✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖿𝖾𝗍𝖼𝗁𝖾𝖽 ${attachments.length} 𝗂𝗆𝖺𝗀𝖾(𝗌) 𝗎𝗌𝗂𝗇𝗀 "${searchTerm}"\n${lockedTagline}`;
        verifyTagline(successMessage);

        // Unsend loading message
        try {
          await message.unsend(loadingMsg.messageID);
        } catch (unsendError) {
          console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
        }

        await message.reply({
          body: successMessage,
          attachment: attachments
        });

        // Cleanup downloaded files after sending
        setTimeout(async () => {
          try {
            for (const file of downloadedFiles) {
              if (await fs.pathExists(file)) {
                await fs.unlink(file);
              }
            }
            console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾𝗌");
          } catch (cleanupError) {
            console.error("❌ 𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError.message);
          }
        }, 10000);

      } catch (apiError) {
        await message.unsend(loadingMsg.messageID);
        console.error("❌ 𝖠𝖯𝖨 𝖾𝗋𝗋𝗈𝗋:", apiError.message);
        
        let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝗂𝗆𝖺𝗀𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
        
        if (apiError.code === 'ECONNREFUSED') {
          errorMessage = "❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍 𝗍𝗈 𝖯𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍 𝖠𝖯𝖨. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
        } else if (apiError.code === 'ETIMEDOUT') {
          errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
        }
        
        await message.reply(errorMessage);
      }

    } catch (error) {
      console.error("💥 𝖯𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
      // Don't send error message to avoid spam
    }
  }
};
