const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "tiktok1",
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Download TikTok video/photo/audio in HD"
    },
    description: {
      en: "Download TikTok video without watermark, audio, or slideshow photos (HD)"
    },
    category: "media",
    guide: {
      en: "{pn} <TikTok URL>"
    }
  },

  onStart: async function ({ message, args }) {
    try {
      const url = args[0];
      if (!url || !/^https?:\/\/(www\.)?tiktok\.com\//.test(url)) {
        return message.reply("❌ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑇𝑖𝑘𝑇𝑜𝑘 𝑙𝑖𝑛𝑘.");
      }

      const apiUrl = `https://tikdownpro.vercel.app/api/download?url=${encodeURIComponent(url)}`;
      const res = await axios.get(apiUrl);
      const data = res.data;

      if (!data || data.status !== "success") {
        return message.reply("❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑. 𝑇𝑟𝑦 𝑎 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑙𝑖𝑛𝑘.");
      }

      // Ensure tmp folder exists
      const tmpDir = path.join(__dirname, "tmp");
      fs.ensureDirSync(tmpDir);

      if (data.type === "video") {
        const videoPath = path.join(tmpDir, `${Date.now()}.mp4`);
        const videoRes = await axios.get(data.video_hd || data.video, { responseType: "arraybuffer" });
        fs.writeFileSync(videoPath, videoRes.data);

        await message.reply({ body: "✅ | 𝐻𝑒𝑟𝑒 𝑖𝑠 𝑦𝑜𝑢𝑟 𝑇𝑖𝑘𝑇𝑜𝑘 𝑣𝑖𝑑𝑒𝑜 (𝐻𝐷, 𝑛𝑜 𝑤𝑎𝑡𝑒𝑟𝑚𝑎𝑟𝑘):", attachment: fs.createReadStream(videoPath) });

        fs.unlinkSync(videoPath); // delete after sending
        return;
      }

      if (data.type === "slideshow") {
        const attachments = [];
        for (let i = 0; i < data.slideshow.length; i++) {
          const imgUrl = data.slideshow[i];
          const imgPath = path.join(tmpDir, `${Date.now()}_${i}.jpg`);
          const imgRes = await axios.get(imgUrl, { responseType: "arraybuffer" });
          fs.writeFileSync(imgPath, imgRes.data);
          attachments.push(fs.createReadStream(imgPath));
          setTimeout(() => fs.unlinkSync(imgPath), 5000); // delete after sending
        }

        return message.reply({ body: "🖼️ | 𝑆𝑙𝑖𝑑𝑒𝑠ℎ𝑜𝑤 𝑝ℎ𝑜𝑡𝑜𝑠 (𝐻𝐷):", attachment: attachments });
      }

      if (data.type === "audio") {
        const audioPath = path.join(tmpDir, `${Date.now()}.mp3`);
        const audioRes = await axios.get(data.audio, { responseType: "arraybuffer" });
        fs.writeFileSync(audioPath, audioRes.data);

        await message.reply({ body: "🎵 | 𝐴𝑢𝑑𝑖𝑜 𝑒𝑥𝑡𝑟𝑎𝑐𝑡𝑒𝑑 𝑓𝑟𝑜𝑚 𝑇𝑖𝑘𝑇𝑜𝑘:", attachment: fs.createReadStream(audioPath) });

        fs.unlinkSync(audioPath); // delete after sending
        return;
      }

      return message.reply("❌ | 𝑈𝑛𝑠𝑢𝑝𝑝𝑜𝑟𝑡𝑒𝑑 𝑇𝑖𝑘𝑇𝑜𝑘 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑡𝑦𝑝𝑒.");

    } catch (err) {
      console.error("TikTok Download Error:", err);
      return message.reply("⚠️ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔.");
    }
  }
};
