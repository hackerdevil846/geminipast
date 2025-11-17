const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "sub",
    aliases: ["subscribe"],
    version: "1.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "no prefix",
    shortDescription: {
      en: "🔔 𝐒𝐮𝐛𝐬𝐜𝐫𝐢𝐛𝐞 𝐬𝐚𝐦𝐩𝐚𝐫𝐤𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"
    },
    longDescription: {
      en: "𝐀𝐮𝐭𝐨-𝐫𝐞𝐬𝐩𝐨𝐧𝐝 𝐰𝐢𝐭𝐡 𝐬𝐮𝐛𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐰𝐡𝐞𝐧 𝐭𝐫𝐢𝐠𝐠𝐞𝐫 𝐰𝐨𝐫𝐝𝐬 𝐚𝐫𝐞 𝐝𝐞𝐭𝐞𝐜𝐭𝐞𝐝"
    },
    guide: {
      en: ""
    },
    countDown: 5,
    dependencies: {
      "fs-extra": ""
    }
  },

  onChat: async function({ api, event, message }) {
    try {
      // Validate all required parameters exist
      if (!event || !api || !message) {
        console.warn("⚠️ Missing required parameters in onChat");
        return;
      }

      const { body, messageID } = event;

      // Comprehensive body validation
      if (!body || typeof body !== 'string' || body.trim() === '') {
        return;
      }

      const triggerWord = "subscribe";
      const lowerBody = body.toLowerCase().trim();
      
      // Only trigger on exact "subscribe" word with word boundaries
      const regex = new RegExp(`(^|\\s)${triggerWord}(\\s|$|\\?|\\.|!)`, 'i');
      const hasTriggerWord = regex.test(lowerBody);

      if (!hasTriggerWord) {
        return;
      }

      // Define audio path - CORRECT PATH based on your structure
      const audioPath = path.join(__dirname, 'noprefix', 'sub.mp3');
      
      try {
        // Ensure directory exists
        await fs.ensureDir(path.dirname(audioPath));
        
        // Check if audio file exists
        const fileExists = await fs.pathExists(audioPath);
        
        if (!fileExists) {
          console.warn("⚠️ Audio file not found at:", audioPath);
          // Send text-only response
          const textMsg = {
            body: "👋 𝐊𝐨𝐧𝐨 𝐬𝐨𝐡𝐚𝐲𝐨𝐭𝐚 𝐥𝐚𝐠𝐥𝐚 @𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 𝐤𝐞 𝐜𝐨𝐧𝐭𝐚𝐜𝐭 𝐤𝐨𝐫𝐮𝐧 😇\n\n📞 𝐂𝐨𝐧𝐭𝐚𝐜𝐭: 𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝\n💬 𝐌𝐞𝐬𝐬𝐚𝐠𝐞 𝐟𝐨𝐫 𝐬𝐮𝐛𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧 𝐝𝐞𝐭𝐚𝐢𝐥𝐬"
          };
          await message.reply(textMsg);
        } else {
          // Send message with audio attachment
          const msg = {
            body: "👋 𝐊𝐨𝐧𝐨 𝐬𝐨𝐡𝐚𝐲𝐨𝐭𝐚 𝐥𝐚𝐠𝐥𝐚 @𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 𝐤𝐞 𝐜𝐨𝐧𝐭𝐚𝐜𝐭 𝐤𝐨𝐫𝐮𝐧 😇",
            attachment: fs.createReadStream(audioPath)
          };
          
          await message.reply(msg);
        }

        // Add reaction with comprehensive error handling
        try {
          if (messageID) {
            await api.setMessageReaction("🔔", messageID, () => {}, true);
          }
        } catch (reactionError) {
          console.warn("⚠️ Could not set reaction:", reactionError.message);
          // Continue execution even if reaction fails
        }

      } catch (fileError) {
        console.error("❌ File operation error:", fileError);
        // Fallback to text response if file operations fail
        const fallbackMsg = {
          body: "👋 𝐊𝐨𝐧𝐨 𝐬𝐨𝐡𝐚𝐲𝐨𝐭𝐚 𝐥𝐚𝐠𝐥𝐚 @𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 𝐤𝐞 𝐜𝐨𝐧𝐭𝐚𝐜𝐭 𝐤𝐨𝐫𝐮𝐧 😇\n\n📞 𝐂𝐨𝐧𝐭𝐚𝐜𝐭: 𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝\n💬 𝐌𝐞𝐬𝐬𝐚𝐠𝐞 𝐟𝐨𝐫 𝐬𝐮𝐛𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧 𝐝𝐞𝐭𝐚𝐢𝐥𝐬"
        };
        await message.reply(fallbackMsg);
      }

    } catch (error) {
      console.error("❌ Sub command error:", error);
      // Prevent the error from crashing the bot
    }
  },

  onStart: async function({ api, event, message }) {
    try {
      // Validate parameters
      if (!api || !message) {
        console.warn("⚠️ Missing required parameters in onStart");
        return;
      }

      const startMsg = {
        body: `🔔 𝐒𝐮𝐛𝐬𝐜𝐫𝐢𝐛𝐞 𝐂𝐨𝐦𝐦𝐚𝐧𝐝\n\n𝐓𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐚𝐮𝐭𝐨𝐦𝐚𝐭𝐢𝐜𝐚𝐥𝐥𝐲 𝐫𝐞𝐬𝐩𝐨𝐧𝐝𝐬 𝐰𝐡𝐞𝐧 𝐬𝐨𝐦𝐞𝐨𝐧𝐞 𝐭𝐲𝐩𝐞𝐬:\n• 𝐬𝐮𝐛𝐬𝐜𝐫𝐢𝐛𝐞\n\n𝐉𝐮𝐬𝐭 𝐭𝐲𝐩𝐞 "𝐬𝐮𝐛𝐬𝐜𝐫𝐢𝐛𝐞" 𝐢𝐧 𝐜𝐡𝐚𝐭!`
      };
      
      await message.reply(startMsg);
    } catch (error) {
      console.error("❌ Sub start command error:", error);
      // Prevent the error from crashing the bot
    }
  }
};
