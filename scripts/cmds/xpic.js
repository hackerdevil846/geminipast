const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "xpic",
    aliases: [],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "search",
    shortDescription: {
      en: "🔍 𝑆𝑒𝑎𝑟𝑐ℎ 𝑓𝑜𝑟 𝑖𝑚𝑎𝑔𝑒𝑠 𝑜𝑛 𝑃𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡"
    },
    longDescription: {
      en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑎𝑛𝑑 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑃𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑦𝑜𝑢𝑟 𝑞𝑢𝑒𝑟𝑦"
    },
    guide: {
      en: "{p}xpic [𝑞𝑢𝑒𝑟𝑦] - [𝑛𝑢𝑚𝑏𝑒𝑟 𝑜𝑓 𝑖𝑚𝑎𝑔𝑒𝑠]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID } = event;

    if (args.length === 0) {
      return message.reply(
        `🔍 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦!\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: ${global.config.PREFIX}𝑥𝑝𝑖𝑐 𝑐𝑢𝑡𝑒 𝑐𝑎𝑡𝑠 - 5`
      );
    }

    const fullQuery = args.join(" ");

    if (!fullQuery.includes("-")) {
      return message.reply(
        `⚠️ 𝐹𝑜𝑟𝑚𝑎𝑡: ${global.config.PREFIX}𝑥𝑝𝑖𝑐 [𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦] - [𝑛𝑢𝑚𝑏𝑒𝑟 𝑜𝑓 𝑖𝑚𝑎𝑔𝑒𝑠]\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: ${global.config.PREFIX}𝑥𝑝𝑖𝑐 𝑙𝑎𝑛𝑑𝑠𝑐𝑎𝑝𝑒 𝑠𝑢𝑛𝑠𝑒𝑡 - 4`
      );
    }

    const [query, numInput] = fullQuery.split("-").map(item => item.trim());
    let numberSearch = parseInt(numInput) || 4;

    if (numberSearch > 20) numberSearch = 20;
    if (numberSearch < 1) numberSearch = 1;

    try {
      const apis = await axios.get('https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json', {
        timeout: 5000
      });

      if (!apis.data || !apis.data.noobs) {
        throw new Error("𝐴𝑃𝐼 𝑐𝑜𝑛𝑓𝑖𝑔𝑢𝑟𝑎𝑡𝑖𝑜𝑛 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
      }

      const apiUrl = apis.data.noobs;
      const res = await axios.get(`${apiUrl}/pinterest?search=${encodeURIComponent(query)}`, {
        timeout: 10000
      });

      if (!res.data || !res.data.data || !Array.isArray(res.data.data)) {
        throw new Error("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝐴𝑃𝐼 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑓𝑜𝑟𝑚𝑎𝑡");
      }

      const imageUrls = res.data.data.slice(0, numberSearch);

      if (imageUrls.length === 0) {
        return message.reply(
          `❌ 𝑁𝑜 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 "${query}"`
        );
      }

      const imgData = [];
      const cacheFiles = [];

      for (let i = 0; i < imageUrls.length; i++) {
        try {
          const path = __dirname + `/cache/pic_${i}_${Date.now()}.jpg`;
          const response = await axios.get(imageUrls[i], {
            responseType: 'arraybuffer',
            timeout: 15000
          });

          fs.writeFileSync(path, Buffer.from(response.data, 'binary'));
          imgData.push(fs.createReadStream(path));
          cacheFiles.push(path);
        } catch (err) {
          console.log(`𝑆𝑘𝑖𝑝𝑝𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒 ${i + 1}: ${err.message}`);
        }
      }

      if (imgData.length === 0) {
        return message.reply(
          "❌ 𝐴𝑙𝑙 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟."
        );
      }

      await message.reply({
        body: `✅ 𝐹𝑜𝑢𝑛𝑑 ${imgData.length} 𝑖𝑚𝑎𝑔𝑒(𝑠) 𝑓𝑜𝑟: "${query}"`,
        attachment: imgData
      });

      cacheFiles.forEach(file => {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      });

    } catch (error) {
      console.error('𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑥𝑒𝑐𝑢𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:', error);
      message.reply(
        `⚠️ 𝐸𝑟𝑟𝑜𝑟: ${error.message || "𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡"}`
      );
    }
  }
};
