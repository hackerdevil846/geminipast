const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "fbget",
    aliases: ["fbdownload", "facebookdownload"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑖𝑒𝑠",
    shortDescription: {
      en: "𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑣𝑖𝑑𝑒𝑜/𝑎𝑢𝑑𝑖𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑟"
    },
    longDescription: {
      en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑣𝑖𝑑𝑒𝑜𝑠 𝑜𝑟 𝑎𝑢𝑑𝑖𝑜"
    },
    guide: {
      en: "{p}fbget [𝑎𝑢𝑑𝑖𝑜/𝑣𝑖𝑑𝑒𝑜]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      // Check dependencies
      if (!axios || !fs) {
        return message.reply("❌ 𝑅𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠 𝑚𝑖𝑠𝑠𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
      }

      if (!event.attachments || !event.attachments[0] || !event.attachments[0].playableUrl) {
        return message.reply("❌ 𝑁𝑜 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑣𝑖𝑑𝑒𝑜 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡 𝑓𝑜𝑢𝑛𝑑! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑎𝑡𝑡𝑎𝑐ℎ 𝑎 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑣𝑖𝑑𝑒𝑜 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.");
      }

      const downloadType = args[0]?.toLowerCase();
      
      if (downloadType === 'audio') {
        const processingMsg = await message.reply("🔊 𝐴𝑢𝑑𝑖𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑠𝑡𝑎𝑟𝑡𝑒𝑑...");
        
        const path = __dirname + `/cache/audio_${event.senderID}.mp3`;
        
        try {
          const response = await axios.get(event.attachments[0].playableUrl, { 
            responseType: 'arraybuffer',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
            },
            timeout: 30000
          });
          
          await fs.writeFileSync(path, Buffer.from(response.data, "binary"));
          
          await message.reply({
            body: `✅ 𝐴𝑢𝑑𝑖𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑐𝑜𝑚𝑝𝑙𝑒𝑡𝑒𝑑! 🎧\n━━━━━━━━━━━━━━\n𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝐵𝑦: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`,
            attachment: fs.createReadStream(path)
          });
          
          await fs.unlinkSync(path);
          await message.unsend(processingMsg.messageID);
          
        } catch (error) {
          console.error("𝐴𝑢𝑑𝑖𝑜 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
          await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑢𝑑𝑖𝑜. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
          if (fs.existsSync(path)) await fs.unlinkSync(path);
        }
      } 
      else if (downloadType === 'video') {
        const processingMsg = await message.reply("📥 𝑉𝑖𝑑𝑒𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑠𝑡𝑎𝑟𝑡𝑒𝑑...");
        
        const path = __dirname + `/cache/video_${event.senderID}.mp4`;
        
        try {
          const response = await axios.get(event.attachments[0].playableUrl, { 
            responseType: 'arraybuffer',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
            },
            timeout: 60000
          });
          
          await fs.writeFileSync(path, Buffer.from(response.data, "binary"));
          
          const fileSize = (await fs.statSync(path)).size;
          if (fileSize > 25000000) {
            await fs.unlinkSync(path);
            return message.reply("❌ 𝑉𝑖𝑑𝑒𝑜 𝑓𝑖𝑙𝑒 𝑖𝑠 𝑡𝑜𝑜 𝑙𝑎𝑟𝑔𝑒 (𝑚𝑎𝑥 25𝑀𝐵).");
          }
          
          await message.reply({
            body: `✅ 𝑉𝑖𝑑𝑒𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑐𝑜𝑚𝑝𝑙𝑒𝑡𝑒𝑑! 🎬\n━━━━━━━━━━━━━━\n𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝐵𝑦: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`,
            attachment: fs.createReadStream(path)
          });
          
          await fs.unlinkSync(path);
          await message.unsend(processingMsg.messageID);
          
        } catch (error) {
          console.error("𝑉𝑖𝑑𝑒𝑜 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
          await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑣𝑖𝑑𝑒𝑜. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
          if (fs.existsSync(path)) await fs.unlinkSync(path);
        }
      } 
      else {
        await message.reply(`📝 𝑈𝑠𝑎𝑔𝑒 𝐺𝑢𝑖𝑑𝑒:\n${global.config.PREFIX}fbget audio - 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑢𝑑𝑖𝑜\n${global.config.PREFIX}fbget video - 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑣𝑖𝑑𝑒𝑜\n\n⚠️ 𝐴𝑡𝑡𝑎𝑐ℎ 𝑎 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑣𝑖𝑑𝑒𝑜 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑`);
      }
    } 
    catch (error) {
      console.error("𝑀𝑎𝑖𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
