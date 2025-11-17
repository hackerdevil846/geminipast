const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "siesta",
    aliases: ["waifu", "animegirl"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "image",
    shortDescription: {
      en: "🎀 𝑅𝑎𝑛𝑑𝑜𝑚 𝑆𝑖𝑒𝑠𝑡𝑎 𝑎𝑛𝑖𝑚𝑒 𝑔𝑖𝑟𝑙 𝑝ℎ𝑜𝑡𝑜𝑠"
    },
    longDescription: {
      en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑔𝑖𝑟𝑙 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑤𝑎𝑖𝑓𝑢.𝑖𝑚 𝑎𝑝𝑖"
    },
    guide: {
      en: "{p}siesta"
    },
    countDown: 3,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, message }) {
    try {
      const response = await axios.get('https://api.waifu.im/search?included_tags=waifu');
      
      if (!response.data || !response.data.images || response.data.images.length === 0) {
        return message.reply("❌ 𝑁𝑜 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
      }

      const imgUrl = response.data.images[0].url;
      const ext = imgUrl.split('.').pop();
      const fileName = `siesta_${Date.now()}.${ext}`;
      const filePath = __dirname + `/cache/${fileName}`;

      const imageResponse = await axios.get(imgUrl, { 
        responseType: 'arraybuffer',
        timeout: 30000
      });

      await fs.outputFile(filePath, imageResponse.data);

      await message.reply({
        body: "🌸 𝑺𝒊𝒆𝒔𝒕𝒂 𝒂𝒏𝒊𝒎𝒆 𝒈𝒊𝒓𝒍 𝒊𝒎𝒂𝒈𝒆",
        attachment: fs.createReadStream(filePath)
      });

      // Clean up
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

    } catch (error) {
      console.error("Siesta command error:", error);
      
      let errorMessage = "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑆𝑖𝑒𝑠𝑡𝑎 𝑖𝑚𝑎𝑔𝑒. ";
      
      if (error.code === 'ECONNABORTED') {
        errorMessage += "𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
      } else if (error.response?.status === 404) {
        errorMessage += "𝐴𝑃𝐼 𝑒𝑛𝑑𝑝𝑜𝑖𝑛𝑡 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑.";
      } else if (error.response?.status >= 500) {
        errorMessage += "𝑆𝑒𝑟𝑣𝑒𝑟 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
      } else {
        errorMessage += "𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
      }

      message.reply(errorMessage);
    }
  }
};
