const axios = require("axios");

module.exports = {
  config: {
    name: "salattime",
    aliases: [],
    version: "1.3.0",
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    countDown: 5,
    role: 0,
    category: "utility",
    shortDescription: {
      en: "🕌 𝖦𝖾𝗍 𝖺𝖼𝖼𝗎𝗋𝖺𝗍𝖾 𝖨𝗌𝗅𝖺𝗆𝗂𝖼 𝗉𝗋𝖺𝗒𝖾𝗋 𝗍𝗂𝗆𝖾𝗌 𝖿𝗈𝗋 𝖺𝗇𝗒 𝗅𝗈𝖼𝖺𝗍𝗂𝗈𝗇"
    },
    longDescription: {
      en: "🕌 𝖦𝖾𝗍 𝖺𝖼𝖼𝗎𝗋𝖺𝗍𝖾 𝖨𝗌𝗅𝖺𝗆𝗂𝖼 𝗉𝗋𝖺𝗒𝖾𝗋 𝗍𝗂𝗆𝖾𝗌 𝖿𝗈𝗋 𝖺𝗇𝗒 𝗅𝗈𝖼𝖺𝗍𝗂𝗈𝗇 𝗐𝗈𝗋𝗅𝖽𝗐𝗂𝖽𝖾"
    },
    guide: {
      en: "{p}salattime [𝖼𝗂𝗍𝗒] 𝗈𝗋 [𝖼𝗂𝗍𝗒, 𝖼𝗈𝗎𝗇𝗍𝗋𝗒]"
    },
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function ({ message, event, args }) {
    let processingMsg;
    
    try {
      // Dependency check
      try {
        require("axios");
      } catch (e) {
        return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
      }

      const { threadID } = event;
      
      // Get location from arguments or use default
      const location = args.join(" ").trim() || "𝖣𝗁𝖺𝗄𝖺";
      
      // Validate location input
      if (location.length > 100) {
        return message.reply("❌ 𝖫𝗈𝖼𝖺𝗍𝗂𝗈𝗇 𝗇𝖺𝗆𝖾 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 100 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
      }

      if (!/^[a-zA-Z0-9\s,.-]+$/.test(location)) {
        return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌 𝗂𝗇 𝗅𝗈𝖼𝖺𝗍𝗂𝗈𝗇! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 𝗈𝗇𝗅𝗒 𝗅𝖾𝗍𝗍𝖾𝗋𝗌, 𝗇𝗎𝗆𝖻𝖾𝗋𝗌, 𝖼𝗈𝗆𝗆𝖺𝗌, 𝖺𝗇𝖽 𝗌𝗉𝖺𝖼𝖾𝗌.");
      }

      // Send processing message
      processingMsg = await message.reply(`⏳ 𝖥𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝗉𝗋𝖺𝗒𝖾𝗋 𝗍𝗂𝗆𝖾𝗌 𝖿𝗈𝗋 ${location}...`);

      // Get prayer times from API with enhanced error handling
      const apiUrl = `https://api.aladhan.com/v1/timingsByAddress?address=${encodeURIComponent(location)}`;
      const response = await axios.get(apiUrl, { 
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.data || !response.data.data || !response.data.data.timings) {
        throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖠𝖯𝖨 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝖿𝗈𝗋𝗆𝖺𝗍");
      }
      
      const prayerData = response.data.data;
      const timings = prayerData.timings;
      const dateInfo = prayerData.date;
      const meta = prayerData.meta;
      
      // Validate required timing fields
      const requiredTimings = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      for (const timing of requiredTimings) {
        if (!timings[timing]) {
          throw new Error(`𝖬𝗂𝗌𝗌𝗂𝗇𝗀 ${timing} 𝗍𝗂𝗆𝗂𝗇𝗀 𝗂𝗇 𝖠𝖯𝖨 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾`);
        }
      }

      // Create formatted message
      let prayerMessage = "🕌 𝖨𝗌𝗅𝖺𝗆𝗂𝖼 𝖯𝗋𝖺𝗒𝖾𝗋 𝖳𝗂𝗆𝖾𝗌 🕌\n\n";
      prayerMessage += `📍 𝖫𝗈𝖼𝖺𝗍𝗂𝗈𝗇: ${location}\n`;
      prayerMessage += `📅 𝖣𝖺𝗍𝖾: ${dateInfo.readable}\n`;
      prayerMessage += `📅 𝖧𝗂𝗃𝗋𝗂 𝖣𝖺𝗍𝖾: ${dateInfo.hijri.day} ${dateInfo.hijri.month.en} ${dateInfo.hijri.year}\n\n`;
      
      prayerMessage += "⏰ 𝖯𝗋𝖺𝗒𝖾𝗋 𝖲𝖼𝗁𝖾𝖽𝗎𝗅𝖾:\n";
      prayerMessage += `• 𝖥𝖺𝗃𝗋: ${timings.Fajr}\n`;
      prayerMessage += `• 𝖲𝗎𝗇𝗋𝗂𝗌𝖾: ${timings.Sunrise || '𝖭/𝖠'}\n`;
      prayerMessage += `• 𝖣𝗁𝗎𝗁𝗋: ${timings.Dhuhr}\n`;
      prayerMessage += `• 𝖠𝗌𝗋: ${timings.Asr}\n`;
      prayerMessage += `• 𝖬𝖺𝗀𝗁𝗋𝗂𝖻: ${timings.Maghrib}\n`;
      prayerMessage += `• 𝖨𝗌𝗁𝖺: ${timings.Isha}\n\n`;
      
      prayerMessage += "🌙 𝖠𝖽𝖽𝗂𝗍𝗂𝗈𝗇𝖺𝗅 𝖨𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇:\n";
      prayerMessage += `• 𝖰𝗂𝖻𝗅𝖺 𝖣𝗂𝗋𝖾𝖼𝗍𝗂𝗈𝗇: ${meta.qiblaDirection || '𝖭/𝖠'}° 𝖿𝗋𝗈𝗆 𝖭𝗈𝗋𝗍𝗁\n`;
      prayerMessage += `• 𝖢𝖺𝗅𝖼𝗎𝗅𝖺𝗍𝗂𝗈𝗇 𝖬𝖾𝗍𝗁𝗈𝖽: ${meta.method?.name || '𝖭/𝖠'}\n`;
      prayerMessage += `• 𝖳𝗂𝗆𝖾𝗓𝗈𝗇𝖾: ${meta.timezone || '𝖭/𝖠'}`;

      // Send the prayer times
      await message.reply(prayerMessage);
      
      // Delete processing message
      if (processingMsg) {
        try {
          await message.unsend(processingMsg.messageID);
        } catch (unsendError) {
          console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
        }
      }
      
    } catch (error) {
      console.error("💥 𝖯𝗋𝖺𝗒𝖾𝗋 𝗍𝗂𝗆𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
      
      // Delete processing message if exists
      if (processingMsg) {
        try {
          await message.unsend(processingMsg.messageID);
        } catch (unsendError) {
          console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
        }
      }
      
      // Send detailed error message based on error type
      let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗉𝗋𝖺𝗒𝖾𝗋 𝗍𝗂𝗆𝖾𝗌.\n\n";
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ENETUNREACH') {
        errorMessage += "🌐 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋! 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
      } else if (error.code === 'ETIMEDOUT') {
        errorMessage += "⏰ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗂𝗇 𝖺 𝖿𝖾𝗐 𝗆𝗂𝗇𝗎𝗍𝖾𝗌.";
      } else if (error.response?.status === 404) {
        errorMessage += "📍 𝖫𝗈𝖼𝖺𝗍𝗂𝗈𝗇 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒:\n";
        errorMessage += "• 𝖢𝗁𝖾𝖼𝗄 𝗅𝗈𝖼𝖺𝗍𝗂𝗈𝗇 𝗌𝗉𝖾𝗅𝗅𝗂𝗇𝗀\n";
        errorMessage += "• 𝖳𝗋𝗒 𝖺 𝗇𝖾𝖺𝗋𝖻𝗒 𝗆𝖺𝗃𝗈𝗋 𝖼𝗂𝗍𝗒\n";
        errorMessage += "• 𝖴𝗌𝖾 '𝖼𝗂𝗍𝗒, 𝖼𝗈𝗎𝗇𝗍𝗋𝗒' 𝖿𝗈𝗋𝗆𝖺𝗍";
      } else if (error.message.includes('Invalid API response')) {
        errorMessage += "🔧 𝖠𝖯𝖨 𝖾𝗋𝗋𝗈𝗋! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺 𝗌𝗍𝖺𝗇𝖽𝖺𝗋𝖽 𝗅𝗈𝖼𝖺𝗍𝗂𝗈𝗇.";
      } else {
        errorMessage += "𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒:\n";
        errorMessage += "• 𝖢𝗁𝖾𝖼𝗄 𝗅𝗈𝖼𝖺𝗍𝗂𝗈𝗇 𝗌𝗉𝖾𝗅𝗅𝗂𝗇𝗀\n";
        errorMessage += "• 𝖳𝗋𝗒 '𝖼𝗂𝗍𝗒, 𝖼𝗈𝗎𝗇𝗍𝗋𝗒' 𝖿𝗈𝗋𝗆𝖺𝗍\n";
        errorMessage += "• 𝖤𝗇𝗌𝗎𝗋𝖾 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇\n";
        errorMessage += "• 𝖳𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗂𝗇 𝖺 𝖿𝖾𝗐 𝗆𝗂𝗇𝗎𝗍𝖾𝗌";
      }
      
      errorMessage += "\n\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}salattime 𝖭𝖾𝗐 𝖸𝗈𝗋𝗄, 𝖴𝖲𝖠";
      
      await message.reply(errorMessage);
    }
  }
};
