const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// Cache for storing video data
const videoCache = new Map();

module.exports = {
  config: {
    name: "pexels",
    aliases: ["pexel", "freeimage"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "media",
    shortDescription: {
      en: "✨ 𝑃𝑒𝑥𝑒𝑙𝑠 𝑡ℎ𝑒𝑘𝑒 𝑓𝑟𝑒𝑒 𝑓𝑜𝑡𝑜 𝑏𝑎 𝑣𝑖𝑑𝑒𝑜 𝑘ℎ𝑢𝑛𝑗𝑢𝑛"
    },
    longDescription: {
      en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑎𝑛𝑑 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑟𝑒𝑒 𝑝ℎ𝑜𝑡𝑜𝑠 𝑎𝑛𝑑 𝑣𝑖𝑑𝑒𝑜𝑠 𝑓𝑟𝑜𝑚 𝑃𝑒𝑥𝑒𝑙𝑠"
    },
    guide: {
      en: "{p}pexels <𝑞𝑢𝑒𝑟𝑦> | {p}pexels video <𝑞𝑢𝑒𝑟𝑦>"
    },
    countDown: 3,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const isVideo = args[0] && args[0].toLowerCase() === "video";
      const query = isVideo ? args.slice(1).join(" ") : args.join(" ");
      
      if (!query) {
        return message.reply("🔎 𝑆𝑒𝑎𝑟𝑐ℎ 𝑘𝑒𝑦𝑤𝑜𝑟𝑑 𝑑𝑎𝑜 𝑏ℎ𝑎𝑖");
      }

      // Pexels API Key
      const API_KEY = "ce3yCvqQIaFKTiRuMUhqjFtViXJmtsbCKG9yAnEzngjWto4MtFiqzwNW";
      
      const endpoint = isVideo
        ? `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=10`
        : `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5`;

      const res = await axios.get(endpoint, {
        headers: { Authorization: API_KEY }
      });

      if (isVideo) {
        const videos = res.data.videos;
        if (!videos.length) {
          return message.reply("❌ 𝐾𝑜𝑛𝑜 𝑣𝑖𝑑𝑒𝑜 𝑝𝑎𝑤𝑎 𝑔𝑒𝑙𝑜 𝑛𝑎ℎ𝑖");
        }

        let msg = "🎬 𝑃𝑒𝑥𝑒𝑙𝑠 𝑉𝑖𝑑𝑒𝑜 𝑅𝑒𝑠𝑢𝑙𝑡𝑠:\n\n";
        videos.forEach((vid, i) => {
          msg += `${i + 1}. 📽️ ${vid.user.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛"} [${vid.duration}𝑠]\n`;
        });
        msg += "\n👉 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑘𝑜𝑟𝑎𝑟 𝑗𝑜𝑛𝑛𝑜 1–10 𝑟𝑒𝑝𝑙𝑦 𝑘𝑜𝑟𝑢𝑛";

        await message.reply(msg, (error, info) => {
          videoCache.set(info.messageID, {
            type: "video",
            data: videos,
            author: event.senderID
          });
          setTimeout(() => videoCache.delete(info.messageID), 60000);
        });

      } else {
        const photos = res.data.photos;
        if (!photos.length) {
          return message.reply("❌ 𝐾𝑜𝑛𝑜 𝑓𝑜𝑡𝑜 𝑝𝑎𝑤𝑎 𝑔𝑒𝑙𝑜 𝑛𝑎ℎ𝑖");
        }

        const attachments = [];
        const cleanFiles = [];

        for (const [i, photo] of photos.entries()) {
          try {
            const imageUrl = photo.src.large2x || photo.src.large;
            const ext = path.extname(imageUrl.split('?')[0]) || '.jpg';
            const filePath = path.join(__dirname, 'cache', `pexels_${Date.now()}_${i}${ext}`);
            
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            await fs.outputFile(filePath, Buffer.from(response.data, 'binary'));
            
            attachments.push(fs.createReadStream(filePath));
            cleanFiles.push(filePath);
          } catch (error) {
            console.error(`𝐸𝑟𝑟𝑜𝑟 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒 ${i+1}:`, error);
          }
        }

        if (attachments.length === 0) {
          return message.reply("❌ 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟 ℎ𝑜𝑦𝑒𝑐ℎ𝑒");
        }

        await message.reply({
          body: `📷 𝑇𝑜𝑝 ${attachments.length} 𝑃ℎ𝑜𝑡𝑜𝑠 𝑓𝑜𝑟 "${query}"\n✨ 𝐶𝑟𝑒𝑎𝑡𝑜𝑟𝑠: ${photos.slice(0, attachments.length).map(p => p.photographer).join(', ')}`,
          attachment: attachments
        });

        // Clean up files
        cleanFiles.forEach(file => {
          if (fs.existsSync(file)) fs.unlinkSync(file);
        });
      }
    } catch (error) {
      console.error("𝑃𝑒𝑥𝑒𝑙𝑠 𝐴𝑃𝐼 𝐸𝑟𝑟𝑜𝑟:", error.response?.data || error.message);
      message.reply("❌ 𝐴𝑃𝐼 𝑒𝑟𝑟𝑜𝑟 ℎ𝑜𝑦𝑒𝑐ℎ𝑒, 𝑝𝑢𝑛𝑜𝑟𝑖𝑏𝑎𝑟 𝑘𝑜𝑟𝑢𝑛");
    }
  },

  onReply: async function ({ api, event, message }) {
    try {
      const { messageReply } = event;
      const cachedData = videoCache.get(messageReply.messageID);
      
      if (!cachedData || event.senderID !== cachedData.author) return;
      
      const index = parseInt(event.body);
      if (isNaN(index) || index < 1 || index > cachedData.data.length) {
        return message.reply("❗ 𝑆𝑎𝑡𝑖𝑘 𝑛𝑢𝑚𝑏𝑒𝑟 𝑑𝑎𝑜 (1–10)");
      }

      const video = cachedData.data[index - 1];
      const videoFile = video.video_files.find(v => v.quality === "hd") || 
                        video.video_files.find(v => v.quality === "sd");
      
      if (!videoFile) {
        return message.reply("❌ 𝑉𝑖𝑑𝑒𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟");
      }

      const ext = path.extname(videoFile.link.split('?')[0]) || '.mp4';
      const filePath = path.join(__dirname, 'cache', `pexels_video_${Date.now()}${ext}`);
      
      const response = await axios.get(videoFile.link, { 
        responseType: 'arraybuffer',
        headers: { Authorization: "ce3yCvqQIaFKTiRuMUhqjFtViXJmtsbCKG9yAnEzngjWto4MtFiqzwNW" }
      });
      
      await fs.outputFile(filePath, Buffer.from(response.data, 'binary'));
      
      await message.reply({
        body: `🎥 ${video.user.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛"} | ${video.duration}𝑠`,
        attachment: fs.createReadStream(filePath)
      });

      // Clean up
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error("𝑉𝑖𝑑𝑒𝑜 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝑉𝑖𝑑𝑒𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟");
    }
  }
};
