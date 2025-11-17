const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "shoti",
    aliases: ["tiktok", "shortvideo"],
    version: "2.0.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "entertainment",
    shortDescription: {
      en: "🎬 𝑆𝑒𝑛𝑑 𝑟𝑎𝑛𝑑𝑜𝑚 𝑇𝑖𝑘𝑇𝑜𝑘 𝑠ℎ𝑜𝑟𝑡 𝑣𝑖𝑑𝑒𝑜𝑠"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎𝑛𝑑 𝑠𝑒𝑛𝑑 𝑟𝑎𝑛𝑑𝑜𝑚 𝑇𝑖𝑘𝑇𝑜𝑘-𝑠𝑡𝑦𝑙𝑒 𝑠ℎ𝑜𝑟𝑡 𝑣𝑖𝑑𝑒𝑜𝑠"
    },
    guide: {
      en: "{p}shoti"
    },
    countDown: 10,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, message }) {
    try {
      const { threadID, messageID } = event;

      // Fetch API config
      const apiConfig = await axios.get(
        "https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json",
        { timeout: 10000 }
      );

      const shotiAPI = apiConfig.data.alldl + "/api/shoti";
      const response = await axios.get(shotiAPI, { timeout: 15000 });
      let videoData = response.data;

      if (Array.isArray(videoData)) {
        if (videoData.length === 0) {
          return message.reply("❌ 𝐶𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑛𝑜 𝑣𝑖𝑑𝑒𝑜𝑠 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
        videoData = videoData[Math.floor(Math.random() * videoData.length)];
      }

      const videoUrl = videoData.shotiurl || videoData.url;
      if (!videoUrl) {
        return message.reply("⚠️ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑣𝑖𝑑𝑒𝑜 𝐴𝑃𝐼 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑜𝑟𝑡 𝑡ℎ𝑖𝑠 𝑖𝑠𝑠𝑢𝑒.");
      }

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const fileName = `shoti_${Date.now()}.mp4`;
      const filePath = path.join(cacheDir, fileName);

      const videoRes = await axios.get(videoUrl, {
        responseType: "arraybuffer",
        timeout: 45000
      });

      await fs.writeFile(filePath, Buffer.from(videoRes.data, "binary"));

      const caption = `✨ 𝗦𝗛𝗢𝗧𝗜 𝗩𝗜𝗗𝗘𝗢 ✨
━━━━━━━━━━━━━━━
🎬 𝗧𝗶𝘁𝗹𝗲: ${videoData.title || "𝑁/𝐴"}
👤 𝗨𝘀𝗲𝗿: @${videoData.username || "𝑁/𝐴"}
📛 𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲: ${videoData.nickname || "𝑁/𝐴"}
🌍 𝗥𝗲𝗴𝗶𝗼𝗻: ${videoData.region || "𝑁/𝐴"}
⏱️ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${videoData.duration || "𝑁/𝐴"} 𝑠𝑒𝑐𝑜𝑛𝑑𝑠
━━━━━━━━━━━━━━━
💬 𝗖𝗼𝗺𝗺𝗲𝗻𝘁: "😍" 𝑡𝑜 𝑟𝑒𝑞𝑢𝑒𝑠𝑡 𝑚𝑜𝑟𝑒!`;

      await message.reply({
        body: caption,
        attachment: fs.createReadStream(filePath)
      });

      await fs.unlink(filePath);

    } catch (error) {
      console.error("Shoti Command Error:", error);

      let userMessage = "❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡.";
      if (error.code === "ECONNABORTED") {
        userMessage = "⚠️ 𝑇ℎ𝑒 𝑟𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
      } else if (error.response && error.response.status >= 500) {
        userMessage = "❌ 𝐴𝑃𝐼 𝑠𝑒𝑟𝑣𝑒𝑟 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
      } else if (error.message.includes("ENOENT")) {
        userMessage = "⚠️ 𝐹𝑖𝑙𝑒 𝑠𝑦𝑠𝑡𝑒𝑚 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐𝑜𝑛𝑡𝑎𝑐𝑡 𝑎𝑑𝑚𝑖𝑛.";
      }

      message.reply(userMessage);
    }
  }
};
