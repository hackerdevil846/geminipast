const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "visualseek",
    aliases: ["imgfetch", "picdiscover"],
    version: "1.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 15,
    role: 0,
    category: "media",
    shortDescription: {
      en: "🔍 𝐼𝑚𝑎𝑔𝑒 𝑠𝑒𝑎𝑟𝑐ℎ 𝑤𝑖𝑡ℎ 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑟𝑒𝑠𝑢𝑙𝑡𝑠"
    },
    longDescription: {
      en: "🔍 𝐼𝑚𝑎𝑔𝑒 𝑠𝑒𝑎𝑟𝑐ℎ 𝑤𝑖𝑡ℎ 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑎𝑛𝑑 𝑐𝑢𝑠𝑡𝑜𝑚 ℎ𝑒𝑎𝑑𝑒𝑟"
    },
    guide: {
      en: "{𝑝}𝑣𝑖𝑠𝑢𝑎𝑙𝑠𝑒𝑒𝑘 [𝑞𝑢𝑒𝑟𝑦] - [𝑛𝑢𝑚𝑏𝑒𝑟]"
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
        return api.sendMessage(
          `✨ 𝑈𝑠𝑎𝑔𝑒 𝐸𝑥𝑎𝑚𝑝𝑙𝑒:\n𝑣𝑖𝑠𝑢𝑎𝑙𝑠𝑒𝑒𝑘 𝑐𝑎𝑡𝑠 - 5\n\n🔍 𝑆𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦 - 𝑁𝑢𝑚𝑏𝑒𝑟 𝑜𝑓 𝑖𝑚𝑎𝑔𝑒𝑠`,
          threadID, messageID
        );
      }

      const [query, number] = keySearch.split("-").map(str => str.trim());
      const numberSearch = parseInt(number) || 6;

      if (numberSearch > 10) {
        return api.sendMessage("❌ 𝑀𝑎𝑥𝑖𝑚𝑢𝑚 10 𝑖𝑚𝑎𝑔𝑒𝑠 𝑎𝑙𝑙𝑜𝑤𝑒𝑑", threadID, messageID);
      }

      api.sendMessage(`🔍 𝑆𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔 "${query}"...`, threadID, messageID);
      
      const res = await axios.get(`https://api.ndtmint.repl.co/pinterest?search=${encodeURIComponent(query)}`);
      const data = res.data.data.slice(0, numberSearch);
      
      if (!data.length) {
        return api.sendMessage("❌ 𝑁𝑜 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑦𝑜𝑢𝑟 𝑞𝑢𝑒𝑟𝑦", threadID, messageID);
      }

      // 𝐶𝑟𝑒𝑎𝑡𝑒 𝑠𝑡𝑦𝑙𝑖𝑠ℎ ℎ𝑒𝑎𝑑𝑒𝑟 𝑤𝑖𝑡ℎ 𝑐𝑎𝑛𝑣𝑎𝑠
      const canvas = createCanvas(600, 200);
      const ctx = canvas.getContext('2d');
      
      // 𝐵𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 𝑇𝑖𝑡𝑙𝑒
      ctx.font = 'bold 30px Arial';
      ctx.fillStyle = '#1abc9c';
      ctx.textAlign = 'center';
      ctx.fillText('🔍 𝐼𝑀𝐴𝐺𝐸 𝑆𝐸𝐴𝑅𝐶𝐻', canvas.width/2, 60);
      
      // 𝑄𝑢𝑒𝑟𝑦
      ctx.font = '25px Arial';
      ctx.fillStyle = '#ecf0f1';
      ctx.fillText(`"${query}"`, canvas.width/2, 110);
      
      // 𝐹𝑜𝑜𝑡𝑒𝑟
      ctx.font = '18px Arial';
      ctx.fillStyle = '#3498db';
      ctx.fillText(`𝐹𝑜𝑢𝑛𝑑: ${data.length} 𝑖𝑚𝑎𝑔𝑒${data.length > 1 ? '𝑠' : ''}`, canvas.width/2, 160);
      
      const headerPath = __dirname + '/cache/imgHeader.jpg';
      const out = fs.createWriteStream(headerPath);
      const stream = canvas.createJPEGStream({ quality: 0.95 });
      stream.pipe(out);
      
      await new Promise(resolve => out.on('finish', resolve));
      
      const imgData = [fs.createReadStream(headerPath)];
      const downloadPromises = [];
      
      for (let i = 0; i < data.length; i++) {
        const path = __dirname + `/cache/img${i + 1}.jpg`;
        downloadPromises.push(
          axios.get(data[i], { responseType: 'arraybuffer' })
            .then(res => fs.writeFile(path, res.data))
            .then(() => imgData.push(fs.createReadStream(path)))
            .catch(err => console.error(`Error downloading image ${i + 1}:`, err))
        );
      }
      
      await Promise.all(downloadPromises);
      
      await api.sendMessage({
        body: `✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑟𝑒𝑡𝑟𝑖𝑒𝑣𝑒𝑑 ${data.length} 𝑖𝑚𝑎𝑔𝑒${data.length > 1 ? '𝑠' : ''} 𝑓𝑜𝑟:\n"${query}"`,
        attachment: imgData
      }, threadID);

      // 𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑓𝑖𝑙𝑒𝑠
      fs.unlinkSync(headerPath);
      for (let i = 0; i < data.length; i++) {
        try {
          fs.unlinkSync(__dirname + `/cache/img${i + 1}.jpg`);
        } catch (cleanupErr) {
          console.error(`Error cleaning up image ${i + 1}:`, cleanupErr);
        }
      }
      
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑖𝑚𝑎𝑔𝑒 𝑠𝑒𝑎𝑟𝑐ℎ 𝑝𝑟𝑜𝑐𝑒𝑠𝑠", event.threadID, event.messageID);
    }
  }
};
