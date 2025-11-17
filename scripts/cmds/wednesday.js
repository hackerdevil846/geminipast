const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "wednesday",
    aliases: ["wed", "wedvid", "wenesday", "wednes"],
    version: "1.0.2",
    author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🧛🏻‍♀️ 𝐖𝐞𝐝𝐧𝐞𝐬𝐝𝐚𝐲 𝐯𝐢𝐝𝐞𝐨 𝐫𝐞𝐬𝐩𝐨𝐧𝐬𝐞"
    },
    longDescription: {
      en: "𝐀𝐮𝐭𝐨𝐦𝐚𝐭𝐢𝐜𝐚𝐥𝐥𝐲 𝐫𝐞𝐬𝐩𝐨𝐧𝐝𝐬 𝐰𝐢𝐭𝐡 𝐖𝐞𝐝𝐧𝐞𝐬𝐝𝐚𝐲 𝐯𝐢𝐝𝐞𝐨 𝐰𝐡𝐞𝐧 𝐭𝐫𝐢𝐠𝐠𝐞𝐫𝐞𝐝"
    },
    guide: {
      en: "𝐉𝐮𝐬𝐭 𝐭𝐲𝐩𝐞 '𝐰𝐞𝐝𝐧𝐞𝐬𝐝𝐚𝐲' 𝐢𝐧 𝐜𝐡𝐚𝐭"
    },
    countDown: 5
  },

  onChat: async function({ api, event, message }) {
    // Early return if critical parameters are missing
    if (!api || !event || !message) {
      console.error("❌ Missing required parameters in onChat");
      return;
    }

    try {
      // Comprehensive check for event.body
      if (!event.body || typeof event.body !== 'string' || event.body.trim() === '') {
        return;
      }

      // Safe string conversion with fallback
      let messageText = '';
      try {
        messageText = event.body.toLowerCase().trim();
      } catch (textError) {
        console.warn("⚠️ Could not convert message to lowercase:", textError.message);
        return;
      }

      // Extended trigger words with common variations
      const triggers = [
        "wednesday", "wed", "wednesday video", "wednesday addams", 
        "wenesday", "wednes", "wensday", "wednsday", "wedesday",
        "wednesday?", "wed?", "wed video", "wed addams"
      ];
      
      // Safe trigger checking
      let isTriggered = false;
      try {
        isTriggered = triggers.some(trigger => {
          if (typeof trigger !== 'string') return false;
          return messageText.includes(trigger) || messageText === trigger;
        });
      } catch (triggerError) {
        console.warn("⚠️ Error checking triggers:", triggerError.message);
        return;
      }

      if (!isTriggered) {
        return;
      }

      console.log("🔍 Wednesday trigger detected, processing...");

      // Multiple possible file paths with fallbacks
      const possiblePaths = [
        path.join(__dirname, "../noprefix/wednesday.mp4"),
        path.join(__dirname, "../../noprefix/wednesday.mp4"),
        path.join(__dirname, "../../../noprefix/wednesday.mp4"),
        path.join(__dirname, "wednesday.mp4"),
        path.join(process.cwd(), "scripts/noprefix/wednesday.mp4"),
        path.join(process.cwd(), "noprefix/wednesday.mp4"),
        path.join(process.cwd(), "wednesday.mp4")
      ];

      let videoPath = null;
      let fileStats = null;
      
      // Find existing video file
      for (const testPath of possiblePaths) {
        try {
          if (fs.existsSync(testPath)) {
            const stats = fs.statSync(testPath);
            if (stats.isFile() && stats.size > 0) {
              videoPath = testPath;
              fileStats = stats;
              console.log("✅ Found valid video file at:", videoPath);
              console.log("📊 File size:", stats.size, "bytes");
              break;
            } else {
              console.warn("⚠️ File exists but is invalid:", testPath);
            }
          }
        } catch (pathError) {
          console.warn("⚠️ Error checking path:", testPath, pathError.message);
          continue;
        }
      }

      if (!videoPath || !fileStats) {
        console.error("❌ No valid Wednesday video file found");
        try {
          await message.reply("🧛🏻‍♀️ 𝐖𝐞𝐝𝐧𝐞𝐬𝐝𝐚𝐲 𝐯𝐢𝐝𝐞𝐨 𝐟𝐢𝐥𝐞 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐜𝐨𝐧𝐭𝐚𝐜𝐭 𝐚𝐝𝐦𝐢𝐧 𝐭𝐨 𝐚𝐝𝐝 𝐭𝐡𝐞 𝐯𝐢𝐝𝐞𝐨 𝐟𝐢𝐥𝐞.");
        } catch (replyError) {
          console.error("❌ Failed to send error message:", replyError.message);
        }
        return;
      }

      // Validate file size (reasonable MP4 size range)
      if (fileStats.size < 1024 || fileStats.size > 100 * 1024 * 1024) { // 1KB to 100MB
        console.error("❌ Invalid file size:", fileStats.size);
        try {
          await message.reply("🧛🏻‍♀️ 𝐖𝐞𝐝𝐧𝐞𝐬𝐝𝐚𝐲 𝐯𝐢𝐝𝐞𝐨 𝐟𝐢𝐥𝐞 𝐢𝐬 𝐜𝐨𝐫𝐫𝐮𝐩𝐭𝐞𝐝. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐜𝐨𝐧𝐭𝐚𝐜𝐭 𝐚𝐝𝐦𝐢𝐧.");
        } catch (replyError) {
          console.error("❌ Failed to send error message:", replyError.message);
        }
        return;
      }

      // Create message object
      const msg = {
        body: "🧛🏻‍♀️ 𝐖𝐞𝐝𝐧𝐞𝐬𝐝𝐚𝐲",
        attachment: fs.createReadStream(videoPath)
      };

      // Send message with timeout protection
      let sendPromise;
      try {
        sendPromise = message.reply(msg);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Message send timeout")), 30000); // 30 second timeout
        });
        
        await Promise.race([sendPromise, timeoutPromise]);
        console.log("✅ Wednesday video sent successfully");
      } catch (sendError) {
        console.error("❌ Failed to send Wednesday video:", sendError.message);
        throw sendError;
      }

      // Add reaction with comprehensive error handling
      if (event.messageID) {
        try {
          await api.setMessageReaction("😈", event.messageID, (err) => {
            if (err) console.warn("⚠️ Reaction callback error:", err.message);
          }, true);
          console.log("✅ Reaction added successfully");
        } catch (reactionError) {
          console.warn("⚠️ Could not set reaction:", reactionError.message);
          // Non-critical error, don't throw
        }
      }

    } catch (error) {
      console.error("❌ Wednesday command error:", error);
      
      // Safe error message to user
      try {
        await message.reply("🧛🏻‍♀️ 𝐒𝐨𝐫𝐫𝐲, 𝐜𝐨𝐮𝐥𝐝𝐧'𝐭 𝐬𝐞𝐧𝐝 𝐭𝐡𝐞 𝐖𝐞𝐝𝐧𝐞𝐬𝐝𝐚𝐲 𝐯𝐢𝐝𝐞𝐨. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.");
      } catch (replyError) {
        console.error("❌ Failed to send error message:", replyError.message);
      }
    }
  },

  onStart: async function({ api, event, message }) {
    // Early return if critical parameters are missing
    if (!api || !event || !message) {
      console.error("❌ Missing required parameters in onStart");
      return;
    }

    try {
      await message.reply("🧛🏻‍♀️ 𝐓𝐲𝐩𝐞 '𝐰𝐞𝐝𝐧𝐞𝐬𝐝𝐚𝐲' 𝐢𝐧 𝐜𝐡𝐚𝐭 𝐭𝐨 𝐬𝐞𝐞 𝐭𝐡𝐞 𝐯𝐢𝐝𝐞𝐨!");
      console.log("✅ Wednesday help message sent");
    } catch (error) {
      console.error("❌ Wednesday onStart error:", error);
      // Don't try to send error message here to avoid loop
    }
  },

  // Additional safety handler
  onAnyEvent: function({ event }) {
    // Global safety check for all events
    if (!event || typeof event !== 'object') {
      console.error("❌ Invalid event received");
      return false;
    }
    return true;
  }
};
