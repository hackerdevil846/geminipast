const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "textpro",
    aliases: ["logo", "textlogo"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "image",
    shortDescription: {
      en: "✨ 𝐶𝑟𝑒𝑎𝑡𝑒 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡 𝑙𝑜𝑔𝑜𝑠"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡-𝑏𝑎𝑠𝑒𝑑 𝑙𝑜𝑔𝑜𝑠 𝑤𝑖𝑡ℎ 𝐴𝐼"
    },
    guide: {
      en: "{p}textpro [𝑡𝑒𝑥𝑡]"
    },
    countDown: 10,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const { threadID, messageID } = event;

      // Check if user provided text
      if (!args.length) {
        return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑! 𝑈𝑠𝑒: .𝑡𝑒𝑥𝑡𝑝𝑟𝑜 [𝑡𝑒𝑥𝑡]");
      }

      const text = args.join(" ");
      if (!text) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑒𝑥𝑡 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑙𝑜𝑔𝑜!");
      }

      // Notify user about processing
      await message.reply("🔄 𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑙𝑜𝑔𝑜, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡...");

      // Pollinations.AI text-to-image
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(text)}`;

      const response = await axios.get(imageUrl, { 
        responseType: "arraybuffer",
        timeout: 30000
      });
      
      const imageData = response.data;
      const path = __dirname + `/cache/logo_${Date.now()}.png`;

      await fs.writeFile(path, Buffer.from(imageData, "binary"));

      await message.reply({
        body: `✨ 𝑌𝑜𝑢𝑟 𝑙𝑜𝑔𝑜 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑏𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑\n\n📝 𝑇𝑒𝑥𝑡: ${text}`,
        attachment: fs.createReadStream(path)
      });

      // Clean up file
      fs.unlinkSync(path);

    } catch (error) {
      console.error("TextPro Error:", error);
      message.reply("❌ 𝐿𝑜𝑔𝑜 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛 𝑓𝑎𝑖𝑙𝑒𝑑! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
