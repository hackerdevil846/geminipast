const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "hit",
    aliases: [],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "👊 𝑃𝑢𝑛𝑐ℎ 𝑠𝑜𝑚𝑒𝑜𝑛𝑒"
    },
    longDescription: {
      en: "𝑆𝑒𝑛𝑑 𝑝𝑢𝑛𝑐ℎ 𝐺𝐼𝐹 𝑡𝑜 𝑡𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟"
    },
    guide: {
      en: "{p}hit @𝑡𝑎𝑔"
    }
  },

  onStart: async function ({ message, event, usersData }) {
    try {
      const { mentions, senderID } = event;
      const mention = Object.keys(mentions);
      
      if (!mention[0]) {
        return message.reply("❌ 𝑇𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 ℎ𝑖𝑡! 👊");
      }

      const targetId = mention[0];
      const targetName = mentions[targetId].replace("@", "");
      
      // Get sender name
      let senderName = "You";
      try {
        const senderData = await usersData.get(senderID);
        senderName = senderData.name || "You";
      } catch (e) {
        // If usersData fails, use default name
      }

      const gifLinks = [
        "https://i.postimg.cc/SNX8pD8Z/13126.gif",
        "https://i.postimg.cc/TYZb2gJT/1467506881-1016b5fd386cf30488508cf6f0a2bee5.gif",
        "https://i.postimg.cc/fyV3DR33/anime-punch.gif",
        "https://i.postimg.cc/P5sLnhdx/onehit-30-5-2016-3.gif",
      ];
      
      const randomGif = gifLinks[Math.floor(Math.random() * gifLinks.length)];
      
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      const gifPath = path.join(cacheDir, `hit_${Date.now()}.gif`);
      
      // Download GIF with timeout and error handling
      const response = await axios.get(randomGif, {
        responseType: 'arraybuffer',
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      // Validate response
      if (!response.data || response.data.length === 0) {
        throw new Error("Empty response from GIF server");
      }

      await fs.writeFileSync(gifPath, Buffer.from(response.data, 'binary'));

      // Verify file was created
      if (!fs.existsSync(gifPath)) {
        throw new Error("Failed to save GIF file");
      }

      const stats = fs.statSync(gifPath);
      if (stats.size === 0) {
        throw new Error("Downloaded GIF is empty");
      }

      await message.reply({
        body: `👊 ${senderName} ℎ𝑖𝑡 ${targetName}! 𝑇𝑎𝑘𝑒 𝑡ℎ𝑎𝑡! 💥`,
        mentions: [
          {
            tag: targetName,
            id: targetId
          },
          {
            tag: senderName,
            id: senderID
          }
        ],
        attachment: fs.createReadStream(gifPath)
      });

      // Clean up after sending
      setTimeout(() => {
        try {
          if (fs.existsSync(gifPath)) {
            fs.unlinkSync(gifPath);
          }
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }
      }, 5000);
      
    } catch (error) {
      console.error("𝐻𝑖𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
      
      let errorMessage = "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑝𝑢𝑛𝑐ℎ! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
      
      if (error.message.includes("timeout")) {
        errorMessage = "⏰ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
      } else if (error.message.includes("ENOTFOUND")) {
        errorMessage = "🌐 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛.";
      } else if (error.message.includes("404")) {
        errorMessage = "🔍 𝐺𝐼𝐹 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
      }
      
      await message.reply(errorMessage);
    }
  }
};
