const moment = require("moment-timezone");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "info",
    aliases: [],
    version: "1.2.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "information",
    shortDescription: {
      en: "𝑆ℎ𝑜𝑤𝑠 𝑏𝑜𝑡 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑖𝑛 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑠𝑡𝑦𝑙𝑒"
    },
    longDescription: {
      en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑏𝑜𝑡 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑤𝑖𝑡ℎ 𝑎 𝑣𝑖𝑠𝑢𝑎𝑙 𝑒𝑙𝑒𝑚𝑒𝑛𝑡"
    },
    guide: {
      en: "{p}info"
    },
    dependencies: {
      "moment-timezone": "",
      "fs-extra": "",
      "axios": ""
    }
  },

  onStart: async function({ message, event }) {
    try {
      // Calculate uptime
      const time = process.uptime();
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = Math.floor(time % 60);
      const uptime = `${hours}ℎ ${minutes}𝑚 ${seconds}𝑠`;

      // Current date/time in Dhaka
      const date = moment.tz("Asia/Dhaka").format("D/MM/YYYY [at] hh:mm:ss A");

      // Prepare cache folder & video path
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      const videoPath = path.join(cacheDir, `info_video_${Date.now()}.mp4`);

      // Download video from provided URL
      let videoDownloaded = false;
      try {
        const response = await axios({
          method: "GET",
          url: "https://files.catbox.moe/op5iay.mp4",
          responseType: "arraybuffer",
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        // Check if response is valid
        if (response.data && response.data.length > 1000) {
          await fs.writeFile(videoPath, Buffer.from(response.data, 'binary'));
          
          // Verify file was written
          if (fs.existsSync(videoPath)) {
            const stats = fs.statSync(videoPath);
            if (stats.size > 1000) {
              videoDownloaded = true;
            }
          }
        }
      } catch (downloadError) {
        console.error("Video download error:", downloadError.message);
        // Continue without video if download fails
      }

      // Create beautifully formatted message
      const infoBody = 
`╭───────『 ✧ 𝐼-𝐴𝑀-𝐴𝑇𝑂𝑀𝐼𝐶 ✧ 』───────╮
┃
┃ ❄️ 𝐵𝑂𝑇 𝐼𝑁𝐹𝑂𝑅𝑀𝐴𝑇𝐼𝑂𝑁
┠────────────────────────────────────
┃ ✦ 𝑁𝑎𝑚𝑒: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
┃ ✦ 𝐺𝑒𝑛𝑑𝑒𝑟: 𝑀𝑎𝑙𝑒
┃ ✦ 𝐴𝑔𝑒: 18+
┠────────────────────────────────────
┃ ✦ 𝑅𝑒𝑙𝑖𝑔𝑖𝑜𝑛: 𝐼𝑠𝑙𝑎𝑚
┃ ✦ 𝑅𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝: 𝑆𝑖𝑛𝑔𝑙𝑒
┠────────────────────────────────────
┃ ✦ 𝑃𝑒𝑟𝑚𝑎𝑛𝑒𝑛𝑡 𝐴𝑑𝑑𝑟𝑒𝑠𝑠: 𝐶ℎ𝑎𝑛𝑑𝑝𝑢𝑟
┃ ✦ 𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝐴𝑑𝑑𝑟𝑒𝑠𝑠: 𝐷ℎ𝑎𝑘𝑎-1236
┠────────────────────────────────────
┃ ✦ 𝑊𝑜𝑟𝑘: 𝑆𝑡𝑢𝑑𝑒𝑛𝑡
┃ ✦ 𝐺𝑚𝑎𝑖𝑙: 𝑚𝑟𝑠𝑚𝑜𝑘𝑒𝑦232@gmail.com
┠────────────────────────────────────
┃ ✦ 𝑊ℎ𝑎𝑡𝑠𝐴𝑝𝑝: 𝑤𝑎.𝑚𝑒/+8801586400590
┃ ✦ 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘: 𝑓𝑏.𝑐𝑜𝑚/𝐴𝑠𝑖𝑓𝑀𝑎ℎ𝑚𝑢𝑑
┠────────────────────────────────────
┃ ✦ 𝑈𝑝𝑡𝑖𝑚𝑒: ${uptime}
┃ ✦ 𝐷𝑎𝑡𝑒: ${date}
╰────────────────────────────────────╯`;

      // Send message with or without video attachment
      if (videoDownloaded) {
        await message.reply({
          body: infoBody,
          attachment: fs.createReadStream(videoPath)
        });
        
        // Delete cached video after sending
        setTimeout(() => {
          try {
            if (fs.existsSync(videoPath)) {
              fs.unlinkSync(videoPath);
            }
          } catch (cleanupError) {
            console.error("Cleanup error:", cleanupError.message);
          }
        }, 5000);
      } else {
        await message.reply(infoBody);
      }

    } catch (error) {
      console.error("Info Command Error:", error);
      
      let errorMessage = "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
      
      if (error.message.includes("timeout")) {
        errorMessage = "❌ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
      } else if (error.message.includes("ENOTFOUND")) {
        errorMessage = "❌ 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛.";
      }
      
      await message.reply(errorMessage);
    }
  }
};
