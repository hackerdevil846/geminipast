const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pic",
    aliases: ["pin", "pics"],
    version: "1.3.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "media-search",
    shortDescription: {
      en: "🖼️ | 𝑆𝑒𝑎𝑟𝑐ℎ 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑃𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡"
    },
    longDescription: {
      en: "🖼️ | 𝑆𝑒𝑎𝑟𝑐ℎ 𝑎𝑛𝑑 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑃𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑦𝑜𝑢𝑟 𝑞𝑢𝑒𝑟𝑦"
    },
    guide: {
      en: "{𝑝}pic [𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦]-[𝑛𝑢𝑚𝑏𝑒𝑟 𝑜𝑓 𝑖𝑚𝑎𝑔𝑒𝑠]\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {𝑝}pic 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑠𝑢𝑛𝑠𝑒𝑡-5"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // 𝑆𝑒𝑡 𝑡𝑖𝑚𝑒𝑧𝑜𝑛𝑒 𝑡𝑜 𝐴𝑠𝑖𝑎/𝐷ℎ𝑎𝑘𝑎
      process.env.TZ = 'Asia/Dhaka';
      
      // 𝐶ℎ𝑒𝑐𝑘 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠
      try {
        if (!axios || !fs || !path) {
          throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }
      } catch (err) {
        return api.sendMessage("❌ | 𝑅𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠 𝑎𝑟𝑒 𝑚𝑖𝑠𝑠𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.", event.threadID, event.messageID);
      }

      const input = args.join(" ");
      
      if (!input.includes("-")) {
        return api.sendMessage("🖼️ | 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑓𝑜𝑟𝑚𝑎𝑡! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒:\n𝑝𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡 [𝑠𝑒𝑎𝑟𝑐ℎ 𝑡𝑒𝑟𝑚]-[𝑛𝑢𝑚𝑏𝑒𝑟]\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑝𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑠𝑢𝑛𝑠𝑒𝑡-5", event.threadID, event.messageID);
      }

      const parts = input.split("-").map(p => p.trim());
      const keyword = parts[0];
      let imageCount = parseInt(parts[1]) || 5;
      imageCount = Math.min(Math.max(imageCount, 1), 10);

      if (!keyword) {
        return api.sendMessage("🔍 | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑠𝑒𝑎𝑟𝑐ℎ 𝑘𝑒𝑦𝑤𝑜𝑟𝑑", event.threadID, event.messageID);
      }

      const tempDir = path.join(__dirname, 'pic_temp');
      await fs.ensureDir(tempDir);
      
      const files = await fs.readdir(tempDir);
      for (const file of files) {
        if (file.startsWith(`${event.senderID}_`) && file.endsWith('.jpg')) {
          await fs.unlink(path.join(tempDir, file));
        }
      }

      const apiUrl = 'https://api.easy0.repl.co/v1/pinterest';
      const response = await axios.get(`${apiUrl}?search=${encodeURIComponent(keyword)}`, {
        timeout: 30000
      });
      
      if (!response.data?.data) {
        return api.sendMessage("❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑖𝑚𝑎𝑔𝑒 𝑑𝑎𝑡𝑎 𝑓𝑟𝑜𝑚 𝐴𝑃𝐼", event.threadID, event.messageID);
      }
      
      const imageUrls = response.data.data.slice(0, imageCount);
      
      if (imageUrls.length === 0) {
        return api.sendMessage("❌ | 𝑁𝑜 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑦𝑜𝑢𝑟 𝑠𝑒𝑎𝑟𝑐ℎ", event.threadID, event.messageID);
      }

      const imgPaths = [];
      let downloadErrors = 0;
      
      for (let i = 0; i < imageUrls.length; i++) {
        try {
          const imagePath = path.join(tempDir, `${event.senderID}_${Date.now()}_${i}.jpg`);
          const imageRes = await axios.get(imageUrls[i], {
            responseType: 'arraybuffer',
            timeout: 30000
          });
          await fs.writeFile(imagePath, Buffer.from(imageRes.data));
          imgPaths.push(imagePath);
        } catch (error) {
          downloadErrors++;
          console.error(`𝐼𝑚𝑎𝑔𝑒 ${i+1} 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:`, error.message);
        }
      }

      if (imgPaths.length > 0) {
        const attachments = imgPaths.map(path => fs.createReadStream(path));
        
        // 𝐺𝑒𝑡 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑡𝑖𝑚𝑒 𝑖𝑛 𝐴𝑠𝑖𝑎/𝐷ℎ𝑎𝑘𝑎
        const now = new Date();
        const options = { timeZone: 'Asia/Dhaka', hour12: true, hour: 'numeric', minute: 'numeric' };
        const dhakaTime = now.toLocaleTimeString('en-US', options);
        
        let successMessage = `✅ | 𝐹𝑜𝑢𝑛𝑑 ${imgPaths.length} 𝑖𝑚𝑎𝑔𝑒(𝑠) 𝑓𝑜𝑟: "${keyword}"\n⏰ 𝑇𝑖𝑚𝑒: ${dhakaTime} (𝐷ℎ𝑎𝑘𝑎)`;
        
        if (downloadErrors > 0) {
          successMessage += `\n⚠️ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑠𝑜𝑚𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 (${downloadErrors} 𝑓𝑎𝑖𝑙𝑒𝑑)`;
        }
        
        await api.sendMessage({
          body: successMessage,
          attachment: attachments
        }, event.threadID, async (error) => {
          if (error) console.error("𝑆𝑒𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
          
          for (const filePath of imgPaths) {
            if (fs.existsSync(filePath)) {
              await fs.unlink(filePath).catch(e => console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", e));
            }
          }
        });
      } else {
        api.sendMessage("❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑛𝑦 𝑖𝑚𝑎𝑔𝑒𝑠", event.threadID, event.messageID);
      }

    } catch (error) {
      console.error("𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
      api.sendMessage(`⚠️ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑: ${error.message}`, event.threadID, event.messageID);
    }
  }
};
