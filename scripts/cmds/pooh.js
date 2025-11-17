const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "poohbear",
    aliases: ["pooh", "winnie"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "𝑃𝑢𝑡ℎ𝑢𝑙 𝑘ℎ𝑎𝑙𝑒𝑟 𝑚𝑜𝑛𝑑𝑜𝑙 𝑡𝑜𝑚𝑎𝑟 𝑏𝑎𝑛𝑡𝑖 𝑙𝑒𝑘ℎ𝑎"
    },
    longDescription: {
      en: "𝑃𝑢𝑡ℎ𝑢𝑙 𝑘ℎ𝑎𝑙𝑒𝑟 𝑚𝑜𝑛𝑑𝑜𝑙 𝑡𝑜𝑚𝑎𝑟 𝑏𝑎𝑛𝑡𝑖 𝑙𝑒𝑘ℎ𝑎 𝑤𝑖𝑡ℎ 𝑃𝑜𝑜ℎ 𝑏𝑒𝑎𝑟 𝑖𝑚𝑎𝑔𝑒"
    },
    guide: {
      en: "{𝑝}𝑝𝑜𝑜ℎ𝑏𝑒𝑎𝑟 [𝑡𝑒𝑥𝑡1 | 𝑡𝑒𝑥𝑡2]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // 𝐶ℎ𝑒𝑐𝑘 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠
      try {
        if (!axios || !fs) {
          throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }
      } catch (err) {
        return api.sendMessage("❌ | 𝑅𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠 𝑎𝑟𝑒 𝑚𝑖𝑠𝑠𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.", event.threadID, event.messageID);
      }

      const { threadID, messageID } = event;
      
      const inputText = args.join(" ");
      
      if (!inputText.includes(" | ")) {
        return api.sendMessage(`🌸 𝐵𝑎𝑏𝑢𝑗𝑎𝑛, 𝑡𝑜𝑚𝑎𝑘𝑒 𝑑𝑢𝑖𝑡𝑖 𝑡𝑒𝑥𝑡 𝑑𝑖𝑡𝑒 ℎ𝑜𝑏𝑒:\n"${this.config.name} 𝑡𝑒𝑥𝑡1 | 𝑡𝑒𝑥𝑡2"\n\n✨ 𝐸𝑗𝑒𝑚𝑜𝑛: ${this.config.name} 𝐴𝑠𝑖𝑓 | 𝑀𝑎ℎ𝑚𝑢𝑑`, threadID, messageID);
      }

      const [text1, text2] = inputText.split(" | ").map(text => text.trim());

      const generateImage = async () => {
        try {
          const imagePath = __dirname + '/cache/pooh.png';
          const response = await axios.get(encodeURI(`https://api.popcat.xyz/pooh?text1=${text1}&text2=${text2}`), {
            responseType: 'stream'
          });
          
          const writer = fs.createWriteStream(imagePath);
          response.data.pipe(writer);
          
          return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(imagePath));
            writer.on('error', reject);
          });
        } catch (error) {
          throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒");
        }
      };

      const imagePath = await generateImage();
      
      return api.sendMessage({
        body: `✨ 𝐸𝑖 𝑛𝑖𝑒𝑟 𝑝𝑢𝑡ℎ𝑢𝑙 𝑡𝑜𝑚𝑎𝑟 𝑏𝑎𝑛𝑡𝑖 𝑛𝑖𝑦𝑒 👇`,
        attachment: fs.createReadStream(imagePath)
      }, threadID, () => fs.unlinkSync(imagePath), messageID);
      
    } catch (error) {
      console.error(error);
      return api.sendMessage("😿 𝐵𝑎𝑏𝑢𝑗𝑎𝑛, 𝑝𝑢𝑡ℎ𝑢𝑙𝑙𝑒𝑟 𝑐ℎ𝑖𝑡𝑟𝑎 𝑏𝑎𝑛𝑎𝑛𝑜 ℎ𝑜𝑙𝑜 𝑗𝑎𝑚𝑒𝑙𝑎 ℎ𝑜𝑖𝑒𝑐ℎ𝑒!", event.threadID, event.messageID);
    }
  }
};
