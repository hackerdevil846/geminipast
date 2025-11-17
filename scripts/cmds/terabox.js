const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "terabox",
    aliases: ["teradownload", "tbdownload"],
    version: "1.3.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "media",
    shortDescription: {
      en: "📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑇𝑒𝑟𝑎𝑏𝑜𝑥 𝑣𝑖𝑑𝑒𝑜𝑠"
    },
    longDescription: {
      en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑣𝑖𝑑𝑒𝑜𝑠 𝑓𝑟𝑜𝑚 𝑇𝑒𝑟𝑎𝑏𝑜𝑥 𝑙𝑖𝑛𝑘𝑠"
    },
    guide: {
      en: "{p}terabox [𝑇𝑒𝑟𝑎𝑏𝑜𝑥_𝑈𝑅𝐿]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      if (args.length === 0) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑇𝑒𝑟𝑎𝑏𝑜𝑥 𝑈𝑅𝐿");
      }

      await message.reply("⏳ 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑣𝑖𝑑𝑒𝑜...");

      const videoUrl = args[0];
      const apiUrl = 'https://ytshorts.savetube.me/api/v1/terabox-downloader';
      const payload = { url: videoUrl };

      const response = await axios.post(apiUrl, payload);
      const data = response.data;

      if (data && data.response && data.response[0].resolutions && data.response[0].resolutions['Fast Download']) {
        const fastDownloadUrl = data.response[0].resolutions['Fast Download'];
        const title = data.response[0].title;

        // Get the file size
        const headResponse = await axios.head(fastDownloadUrl);
        const fileSize = headResponse.headers['content-length'];

        // Check if the file size exceeds 75 MB
        const MAX_SIZE = 75 * 1024 * 1024;
        if (fileSize > MAX_SIZE) {
          return message.reply("❌ 𝑇ℎ𝑒 𝑣𝑖𝑑𝑒𝑜 𝑖𝑠 𝑡𝑜𝑜 𝑙𝑎𝑟𝑔𝑒 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 (𝑜𝑣𝑒𝑟 75 𝑀𝐵)");
        }

        // Download and send the video
        const videoResponse = await axios.get(fastDownloadUrl, { responseType: 'stream' });
        
        await message.reply({
          body: `📹 𝑇𝑖𝑡𝑙𝑒: ${title}`,
          attachment: videoResponse.data
        });

      } else {
        await message.reply("❌ 𝑁𝑜 𝑓𝑎𝑠𝑡 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑣𝑖𝑑𝑒𝑜 𝑓𝑜𝑢𝑛𝑑. 𝑆𝑜𝑚𝑒𝑡ℎ𝑖𝑛𝑔 𝑤𝑒𝑛𝑡 𝑤𝑟𝑜𝑛𝑔.");
      }
    } catch (error) {
      console.error('𝑇𝑒𝑟𝑎𝑏𝑜𝑥 𝑒𝑟𝑟𝑜𝑟:', error);
      await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑜𝑟 𝑠𝑒𝑛𝑑𝑖𝑛𝑔 𝑣𝑖𝑑𝑒𝑜");
    }
  }
};
