const axios = require("axios");
const fs = require("fs");
const path = require("path");

const TMP_DIR = path.join(__dirname, "tmp");
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR);

module.exports = {
  config: {
    name: "tiktok",
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐻𝐷 𝑇𝑖𝑘𝑇𝑜𝑘 𝑣𝑖𝑑𝑒𝑜/𝑎𝑢𝑑𝑖𝑜/𝑝ℎ𝑜𝑡𝑜"
    },
    description: {
      en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑇𝑖𝑘𝑇𝑜𝑘 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑖𝑛 𝐻𝐷 𝑞𝑢𝑎𝑙𝑖𝑡𝑦 𝑤𝑖𝑡ℎ𝑜𝑢𝑡 𝑤𝑎𝑡𝑒𝑟𝑚𝑎𝑟𝑘"
    },
    category: "media",
    guide: {
      en: "{pn} <𝑇𝑖𝑘𝑇𝑜𝑘 𝑙𝑖𝑛𝑘>"
    }
  },

  onStart: async function ({ message, args }) {
    const url = args[0];
    if (!url || !url.includes("tiktok")) {
      return message.reply("❌ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑇𝑖𝑘𝑇𝑜𝑘 𝑈𝑅𝐿.");
    }

    const apiUrl = `https://tikdownpro.vercel.app/api/download?url=${encodeURIComponent(url)}`;
    try {
      const res = await axios.get(apiUrl);
      const data = res.data;

      if (data.status !== "success") {
        return message.reply("❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑤𝑖𝑡ℎ 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑙𝑖𝑛𝑘.");
      }

      // 🎥 Video
      if (data.type === "video") {
        const videoPath = path.join(TMP_DIR, `${Date.now()}.mp4`);
        const videoRes = await axios.get(data.video_hd || data.video, { responseType: "arraybuffer" });
        fs.writeFileSync(videoPath, videoRes.data);

        message.reply(
          { body: "✅ | 𝐻𝑒𝑟𝑒 𝑖𝑠 𝑦𝑜𝑢𝑟 𝑇𝑖𝑘𝑇𝑜𝑘 𝑣𝑖𝑑𝑒𝑜 (𝐻𝐷, 𝑁𝑜 𝑊𝑎𝑡𝑒𝑟𝑚𝑎𝑟𝑘):", attachment: fs.createReadStream(videoPath) },
          () => fs.unlinkSync(videoPath) // 🧹 cleanup
        );
        return;
      }

      // 🖼️ Slideshow
      if (data.type === "slideshow") {
        const images = data.slideshow;
        const attachments = [];

        for (let i = 0; i < images.length; i++) {
          const imgRes = await axios.get(images[i], { responseType: "arraybuffer" });
          const imgPath = path.join(TMP_DIR, `${Date.now()}_${i}.jpg`);
          fs.writeFileSync(imgPath, imgRes.data);
          attachments.push(fs.createReadStream(imgPath));
          setTimeout(() => fs.unlinkSync(imgPath), 60_000); // cleanup later
        }

        return message.reply({ body: "🖼️ | 𝑆𝑙𝑖𝑑𝑒𝑠ℎ𝑜𝑤 𝑃ℎ𝑜𝑡𝑜𝑠 (𝐻𝐷):", attachment: attachments });
      }

      // 🎵 Audio
      if (data.type === "audio") {
        const audioPath = path.join(TMP_DIR, `${Date.now()}.mp3`);
        const audioRes = await axios.get(data.audio, { responseType: "arraybuffer" });
        fs.writeFileSync(audioPath, audioRes.data);

        message.reply(
          { body: "🎵 | 𝐴𝑢𝑑𝑖𝑜 𝑒𝑥𝑡𝑟𝑎𝑐𝑡𝑒𝑑 𝑓𝑟𝑜𝑚 𝑇𝑖𝑘𝑇𝑜𝑘:", attachment: fs.createReadStream(audioPath) },
          () => fs.unlinkSync(audioPath)
        );
        return;
      }

      return message.reply("❌ | 𝑈𝑛𝑠𝑢𝑝𝑝𝑜𝑟𝑡𝑒𝑑 𝑇𝑖𝑘𝑇𝑜𝑘 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑡𝑦𝑝𝑒.");

    } catch (err) {
      console.error("TikTok Error:", err.message);
      return message.reply("⚠️ | 𝐸𝑟𝑟𝑜𝑟 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑛𝑔 𝑡𝑜 𝑇𝑖𝑘𝑇𝑜𝑘 𝑠𝑒𝑟𝑣𝑒𝑟.");
    }
  }
};
