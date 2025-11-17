const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "nobita",
    aliases: ["doraemon", "nobitavideo"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "entertainment",
    shortDescription: {
      en: "📺 𝐷𝑜𝑟𝑎𝑒𝑚𝑜𝑛 𝑐𝑎𝑟𝑡𝑜𝑜𝑛 𝑣𝑖𝑑𝑒𝑜𝑠"
    },
    longDescription: {
      en: "𝑅𝑎𝑛𝑑𝑜𝑚 𝐷𝑜𝑟𝑎𝑒𝑚𝑜𝑛 𝑎𝑛𝑑 𝑁𝑜𝑏𝑖𝑡𝑎 𝑐𝑎𝑟𝑡𝑜𝑜𝑛 𝑣𝑖𝑑𝑒𝑜𝑠"
    },
    guide: {
      en: "{p}nobita"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ message }) {
    try {
      const hi = ["𝐃𝐎𝐑𝐄𝐌𝐎𝐍 𝐂𝐀𝐑𝐓𝐎𝐎𝐍𝐒 𝐍𝐎𝐁𝐈𝐓𝐀 𝐏𝐀𝐑𝐓 𝐎𝐅 𝐒𝐓𝐎𝐑𝐘 𝐕𝐈𝐃𝐄𝐎"];
      const know = hi[Math.floor(Math.random() * hi.length)];
      
      const link = [
        "https://i.imgur.com/u5N7sqe.mp4",
        "https://i.imgur.com/0u32UXX.mp4",
        "https://i.imgur.com/sj3Asr2.mp4",
        "https://i.imgur.com/sJ3iQFR.mp4",
        "https://i.imgur.com/6IxQjHb.mp4",
        "https://i.imgur.com/SpQImVm.mp4",
        "https://i.imgur.com/rsXHTME.mp4",
        "https://i.imgur.com/bVCNwBl.mp4",
        "https://i.imgur.com/lpLN8j6.mp4",
        "https://i.imgur.com/mNekuge.mp4",
        "https://i.imgur.com/5EXQnUm.mp4",
        "https://i.imgur.com/sn1nM55.mp4",
        "https://i.imgur.com/vatwDvn.mp4",
        "https://i.imgur.com/Is914QQ.mp4",
        "https://i.imgur.com/4EGKkBr.mp4",
        "https://i.imgur.com/KMhExnR.mp4",
        "https://i.imgur.com/2exQMrj.mp4",
        "https://i.imgur.com/yjDclse.mp4",
        "https://i.imgur.com/OxkI89B.mp4",
        "https://i.imgur.com/Ma5IKum.mp4",
        "https://i.imgur.com/TDx2wE5.mp4",
        "https://i.imgur.com/xgAoeB9.mp4",
        "https://i.imgur.com/vKtOrOC.mp4",
        "https://i.imgur.com/BfeZuuR.mp4",
        "https://i.imgur.com/8zvYfUL.mp4",
        "https://i.imgur.com/dUtiu6e.mp4",
        "https://i.imgur.com/brJkCMN.mp4",
        "https://i.imgur.com/A7jM45X.mp4",
        "https://i.imgur.com/g7DH0YU.mp4",
        "https://i.imgur.com/4aWS06D.mp4",
        "https://i.imgur.com/pHsTWyQ.mp4"
      ];

      const randomLink = link[Math.floor(Math.random() * link.length)];
      
      const response = await axios.get(randomLink, { responseType: "stream" });
      const path = __dirname + "/cache/nobita_video.mp4";
      
      const writer = fs.createWriteStream(path);
      response.data.pipe(writer);
      
      writer.on("finish", async () => {
        await message.reply({
          body: know,
          attachment: fs.createReadStream(path)
        });
        
        fs.unlinkSync(path);
      });

      writer.on("error", (error) => {
        console.error("Error writing file:", error);
        message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑣𝑖𝑑𝑒𝑜. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
      });

    } catch (error) {
      console.error("Error in nobita command:", error);
      message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑣𝑖𝑑𝑒𝑜. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
