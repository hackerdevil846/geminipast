const axios = require("axios");

module.exports = {
  config: {
    name: "nsfgif",
    aliases: [],
    version: "1.0.0",
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    countDown: 5,
    role: 1,
    category: "adult",
    shortDescription: {
      en: "🔞 𝖭𝖲𝖥𝖶 𝖦𝖨𝖥 𝖼𝗈𝗆𝗆𝖺𝗇𝖽"
    },
    longDescription: {
      en: "🔞 𝖦𝖾𝗍 𝖭𝖲𝖥𝖶 𝖦𝖨𝖥𝗌"
    },
    guide: {
      en: "{p}nsfw"
    },
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function({ message, event }) {
    try {
      // Dependency check
      let axiosAvailable = true;
      try {
        require("axios");
      } catch (e) {
        axiosAvailable = false;
      }

      if (!axiosAvailable) {
        return;
      }

      const response = await axios.get('https://nekobot.xyz/api/image?type=pgif', {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.data || !response.data.message) {
        return;
      }
      
      const url = response.data.message;
      
      if (!url || typeof url !== 'string' || !url.startsWith('http')) {
        return;
      }

      const imageStream = await global.utils.getStreamFromURL(url);
      
      if (!imageStream) {
        return;
      }

      await message.reply({
        body: `🔞 | 𝖭𝖲𝖥𝖶 𝖦𝖨𝖥\n━━━━━━━━━━━━━━\n\n✨ 𝖦𝗂𝖿 𝖿𝗈𝗋 𝗒𝗈𝗎 𝖻𝖺𝖻𝗒...`,
        attachment: imageStream
      });
      
    } catch (error) {
      console.error("🔞 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗇𝗌𝖿𝗀𝗂𝖿:", error);
    }
  }
};
