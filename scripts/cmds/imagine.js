const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "imagine",
    aliases: [],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 2,
    role: 0,
    category: "image",
    shortDescription: {
      en: "🎨 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝐴𝐼-𝑝𝑜𝑤𝑒𝑟𝑒𝑑 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑡𝑒𝑥𝑡 𝑝𝑟𝑜𝑚𝑝𝑡𝑠"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑠 𝐴𝐼-𝑝𝑜𝑤𝑒𝑟𝑒𝑑 𝑖𝑚𝑎𝑔𝑒𝑠 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑡𝑒𝑥𝑡 𝑝𝑟𝑜𝑚𝑝𝑡𝑠 𝑢𝑠𝑖𝑛𝑔 𝑝𝑜𝑙𝑙𝑖𝑛𝑎𝑡𝑖𝑜𝑛𝑠.𝑎𝑖 𝐴𝑃𝐼"
    },
    guide: {
      en: "{p}imagine [𝑝𝑟𝑜𝑚𝑝𝑡]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ message, args, event }) {
    try {
      const { threadID, messageID, senderID } = event;
      const query = args.join(" ");

      if (!query) {
        return message.reply("🎨 | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑑𝑒𝑠𝑐𝑟𝑖𝑝𝑡𝑖𝑜𝑛!\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: /𝑖𝑚𝑎𝑔𝑖𝑛𝑒 𝑠𝑢𝑛𝑠𝑒𝑡 𝑎𝑡 𝑏𝑒𝑎𝑐ℎ");
      }

      const path = __dirname + `/cache/imagine_${senderID}.png`;

      await message.reply("🖌️ | 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑖𝑚𝑎𝑔𝑒... 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡!");

      const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(query)}`, {
        responseType: "arraybuffer"
      });

      await fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));

      await message.reply({
        body: `✨ | 𝐼𝑚𝑎𝑔𝑒 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!\n━━━━━━━━━━━━━━\n📝 𝑃𝑟𝑜𝑚𝑝𝑡: "${query}"`,
        attachment: fs.createReadStream(path)
      });

      fs.unlinkSync(path);

    } catch (error) {
      console.error("𝐼𝑚𝑎𝑔𝑖𝑛𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply("❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
