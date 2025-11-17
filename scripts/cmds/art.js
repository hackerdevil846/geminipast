const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "art",
    aliases: [],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "image",
    shortDescription: {
      en: "🎨 𝐴𝑛𝑖𝑚𝑒 𝑒𝑓𝑓𝑒𝑐𝑡 𝑎𝑑𝑑"
    },
    longDescription: {
      en: "𝐴𝑑𝑑𝑠 𝑎𝑛𝑖𝑚𝑒 𝑒𝑓𝑓𝑒𝑐𝑡𝑠 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒𝑠"
    },
    guide: {
      en: "{p}art (𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒)"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, message }) {
    try {
      const { threadID, messageID } = event;

      if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒");
      }

      const imageUrl = event.messageReply.attachments[0].url;
      const pathie = __dirname + `/cache/animefied.jpg`;

      const processingMsg = await message.reply("🔄 𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡...");

      try {
        const lim = await axios.get(`https://animeify.shinoyama.repl.co/convert-to-anime?imageUrl=${encodeURIComponent(imageUrl)}`);
        const image = lim.data.urls[1];
        const img = (await axios.get(`https://www.drawever.com${image}`, { responseType: "arraybuffer" })).data;
        
        fs.writeFileSync(pathie, Buffer.from(img, 'binary'));

        await message.reply({
          body: "✅ 𝐴𝑛𝑖𝑚𝑒𝑓𝑖𝑒𝑑 𝑖𝑚𝑎𝑔𝑒 𝑟𝑒𝑎𝑑𝑦!",
          attachment: fs.createReadStream(pathie)
        });

        fs.unlinkSync(pathie);
        api.unsendMessage(processingMsg.messageID);

      } catch (e) {
        console.error("𝐴𝑟𝑡 𝐸𝑟𝑟𝑜𝑟:", e);
        api.unsendMessage(processingMsg.messageID);
        return message.reply(`❌ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑:\n${e.message}`);
      }

    } catch (e) {
      console.error("𝐴𝑟𝑡 𝐸𝑟𝑟𝑜𝑟:", e);
      return message.reply(`❌ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑:\n${e.message}`);
    }
  }
};
