const axios = require("axios");
const https = require("https");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "puppy",
    aliases: ["dogpic"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝑅𝑎𝑛𝑑𝑜𝑚 𝑑𝑜𝑔 𝑖𝑚𝑎𝑔𝑒"
    },
    longDescription: {
      en: "𝑆𝑒𝑛𝑑𝑠 𝑎 𝑟𝑎𝑛𝑑𝑜𝑚 𝑑𝑜𝑔 𝑖𝑚𝑎𝑔𝑒 𝑓𝑟𝑜𝑚 𝑑𝑜𝑔.𝑐𝑒𝑜 𝑎𝑝𝑖"
    },
    category: "𝑓𝑢𝑛",
    guide: {
      en: "{𝑝}puppy"
    },
    dependencies: {
      "axios": "",
      "https": "",
      "fs-extra": "",
      "path": ""
    }
  },

  onStart: async function ({ message }) {
    try {
      // 𝐶ℎ𝑒𝑐𝑘 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠
      try {
        if (!axios || !https || !fs || !path) {
          throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }
      } catch (err) {
        return message.reply("❌ | 𝑅𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠 𝑎𝑟𝑒 𝑚𝑖𝑠𝑠𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, ℎ𝑡𝑡𝑝𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑛𝑑 𝑝𝑎𝑡ℎ.");
      }

      const res = await axios.get("https://dog.ceo/api/breeds/image/random");
      const url = res.data.message;
      const cachePath = path.join(__dirname, "cache/dog.jpg");

      // 𝐸𝑛𝑠𝑢𝑟𝑒 𝑐𝑎𝑐ℎ𝑒 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦 𝑒𝑥𝑖𝑠𝑡𝑠
      await fs.ensureDir(path.dirname(cachePath));

      const file = fs.createWriteStream(cachePath);
      https.get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          message.reply({
            body: "🐶 𝐻𝑒𝑟𝑒'𝑠 𝑎 𝑐𝑢𝑡𝑒 𝑑𝑜𝑔𝑔𝑜!",
            attachment: fs.createReadStream(cachePath)
          }).then(() => {
            // 𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑎𝑓𝑡𝑒𝑟 𝑠𝑒𝑛𝑑𝑖𝑛𝑔
            fs.unlink(cachePath, (err) => {
              if (err) console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", err);
            });
          });
        });
      }).on("error", (err) => {
        console.error("𝐻𝑇𝑇𝑃𝑆 𝑒𝑟𝑟𝑜𝑟:", err);
        message.reply("❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑑𝑜𝑔 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
      });
    } catch (error) {
      console.error("𝐷𝑜𝑔 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑑𝑜𝑔 𝑖𝑚𝑎𝑔𝑒.");
    }
  }
};
