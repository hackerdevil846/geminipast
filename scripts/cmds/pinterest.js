const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "pinterestv2",
    aliases: ["pinsearch", "pinterestsearch"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 15,
    role: 0,
    category: "media",
    shortDescription: {
      en: "✨ 𝑆𝑡𝑦𝑙𝑖𝑠ℎ 𝐼𝑚𝑎𝑔𝑒 𝑆𝑒𝑎𝑟𝑐ℎ 𝑓𝑟𝑜𝑚 𝑃𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡"
    },
    longDescription: {
      en: "✨ 𝑆𝑡𝑦𝑙𝑖𝑠ℎ 𝐼𝑚𝑎𝑔𝑒 𝑆𝑒𝑎𝑟𝑐ℎ 𝑓𝑟𝑜𝑚 𝑃𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 ℎ𝑒𝑎𝑑𝑒𝑟"
    },
    guide: {
      en: "{𝑝}𝑝𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡𝑣2 [𝑘𝑒𝑦𝑤𝑜𝑟𝑑] - [𝑛𝑢𝑚𝑏𝑒𝑟]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "canvas": ""
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // 𝐶ℎ𝑒𝑐𝑘 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠
      try {
        if (!axios || !fs || !createCanvas || !loadImage) {
          throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }
      } catch (err) {
        return api.sendMessage("❌ | 𝑅𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠 𝑎𝑟𝑒 𝑚𝑖𝑠𝑠𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑛𝑑 𝑐𝑎𝑛𝑣𝑎𝑠.", event.threadID, event.messageID);
      }

      const { threadID, messageID } = event;
      const keySearch = args.join(" ");
      
      if (!keySearch.includes("-")) {
        return api.sendMessage("🌸 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 𝑐𝑜𝑟𝑟𝑒𝑐𝑡 𝑓𝑜𝑟𝑚𝑎𝑡:\n𝑝𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡𝑣2 𝑘𝑒𝑦𝑤𝑜𝑟𝑑 - 𝑛𝑢𝑚𝑏𝑒𝑟 (𝑒𝑥: 𝑝𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡𝑣2 𝑐𝑎𝑡 - 5)", threadID, messageID);
      }

      const [keySearchs, numberSearch] = keySearch.split("-").map(item => item.trim());
      const searchCount = parseInt(numberSearch) || 6;
      
      if (isNaN(searchCount) || searchCount > 20 || searchCount < 1) {
        return api.sendMessage("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑛𝑢𝑚𝑏𝑒𝑟 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 1 𝑎𝑛𝑑 20", threadID, messageID);
      }

      api.sendMessage("🔍 𝑆𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔 𝑃𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡...", threadID, messageID);

      const res = await axios.get(`https://asif-pinterest-api.onrender.com/v1/pinterest?search=${encodeURIComponent(keySearchs)}`);
      const data = res.data.data || res.data;
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        return api.sendMessage("❌ 𝑁𝑜 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑦𝑜𝑢𝑟 𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦", threadID, messageID);
      }

      const imgData = [];
      const canvas = createCanvas(600, 200);
      const ctx = canvas.getContext("2d");
      
      // 𝐶𝑟𝑒𝑎𝑡𝑒 𝑠𝑡𝑦𝑙𝑖𝑠ℎ ℎ𝑒𝑎𝑑𝑒𝑟
      ctx.fillStyle = "#e60023";
      ctx.fillRect(0, 0, 600, 200);
      ctx.font = "𝑏𝑜𝑙𝑑 28𝑝𝑥 𝐴𝑟𝑖𝑎𝑙";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "𝑐𝑒𝑛𝑡𝑒𝑟";
      ctx.fillText("✨ 𝑃𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡 𝑆𝑒𝑎𝑟𝑐ℎ 𝑅𝑒𝑠𝑢𝑙𝑡𝑠 ✨", 300, 60);
      ctx.font = "20𝑝𝑥 𝐴𝑟𝑖𝑎𝑙";
      ctx.fillText(`🔍 𝐾𝑒𝑦𝑤𝑜𝑟𝑑: ${keySearchs}`, 300, 110);
      ctx.fillText(`📸 𝐼𝑚𝑎𝑔𝑒𝑠: ${searchCount}`, 300, 150);
      
      const headerPath = __dirname + '/cache/pin_header.jpg';
      const out = fs.createWriteStream(headerPath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);
      
      await new Promise((resolve, reject) => {
        out.on('finish', resolve);
        out.on('error', reject);
      });

      imgData.push(fs.createReadStream(headerPath));

      // 𝑃𝑟𝑜𝑐𝑒𝑠𝑠 𝑖𝑚𝑎𝑔𝑒𝑠
      for (let i = 0; i < Math.min(searchCount, data.length); i++) {
        try {
          const path = __dirname + `/cache/pin_${i}.jpg`;
          const imgResponse = await axios.get(data[i], { responseType: 'arraybuffer' });
          fs.writeFileSync(path, Buffer.from(imgResponse.data, 'binary'));
          imgData.push(fs.createReadStream(path));
        } catch (e) {
          console.error("𝐸𝑟𝑟𝑜𝑟 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒:", e);
        }
      }

      // 𝑆𝑒𝑛𝑑 𝑟𝑒𝑠𝑢𝑙𝑡𝑠
      await api.sendMessage({
        body: `🌟 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑓𝑒𝑡𝑐ℎ𝑒𝑑 ${imgData.length - 1} 𝑖𝑚𝑎𝑔𝑒𝑠!\n🔍 𝐾𝑒𝑦𝑤𝑜𝑟𝑑: ${keySearchs}`,
        attachment: imgData
      }, threadID);

      // 𝐶𝑙𝑒𝑎𝑛𝑢𝑝
      fs.unlinkSync(headerPath);
      for (let i = 0; i < Math.min(searchCount, data.length); i++) {
        const path = __dirname + `/cache/pin_${i}.jpg`;
        if (fs.existsSync(path)) fs.unlinkSync(path);
      }

    } catch (error) {
      console.error(error);
      api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒𝑠", event.threadID, event.messageID);
    }
  }
};
