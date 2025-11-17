const axios = require('axios');

module.exports = {
  config: {
    name: "memefetch",
    aliases: ["randomeme", "humorpic"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "😂 𝐹𝑒𝑡𝑐ℎ 𝑟𝑎𝑛𝑑𝑜𝑚 𝑚𝑒𝑚𝑒𝑠 𝑓𝑟𝑜𝑚 𝐼𝑚𝑔𝑓𝑙𝑖𝑝"
    },
    longDescription: {
      en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑝𝑜𝑝𝑢𝑙𝑎𝑟 𝑚𝑒𝑚𝑒𝑠 𝑓𝑟𝑜𝑚 𝐼𝑚𝑔𝑓𝑙𝑖𝑝 𝑎𝑝𝑖"
    },
    guide: {
      en: "{p}memefetch"
    },
    countDown: 5,
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function ({ message }) {
    try {
      const response = await axios.get('https://api.imgflip.com/get_memes');

      if (response.data.success) {
        const memes = response.data.data.memes;
        const randomMeme = memes[Math.floor(Math.random() * memes.length)];

        await message.reply({
          body: `😂 ${randomMeme.name}`,
          attachment: await global.utils.getStreamFromURL(randomMeme.url)
        });
      } else {
        await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑚𝑒𝑚𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
      }
    } catch (error) {
      console.error('𝐸𝑟𝑟𝑜𝑟 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑚𝑒𝑚𝑒:', error);
      await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑎 𝑚𝑒𝑚𝑒.");
    }
  }
};
