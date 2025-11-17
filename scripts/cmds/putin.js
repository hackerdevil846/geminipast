const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "putin",
    aliases: [],
    version: "2.1",
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    countDown: 5,
    role: 0,
    category: "meme",
    shortDescription: {
      en: "🇷🇺 𝖢𝗋𝖾𝖺𝗍𝖾 𝖯𝗎𝗍𝗂𝗇 𝗆𝖾𝖾𝗍𝗂𝗇𝗀 𝗆𝖾𝗆𝖾"
    },
    longDescription: {
      en: "🇷🇺 𝖢𝗋𝖾𝖺𝗍𝖾 𝖯𝗎𝗍𝗂𝗇 𝗆𝖾𝖾𝗍𝗂𝗇𝗀 𝗆𝖾𝗆𝖾 𝗐𝗂𝗍𝗁 𝗍𝖺𝗀𝗀𝖾𝖽 𝗎𝗌𝖾𝗋 𝗈𝗋 𝗒𝗈𝗎𝗋𝗌𝖾𝗅𝖿"
    },
    guide: {
      en: "{p}putin [@𝗆𝖾𝗇𝗍𝗂𝗈𝗇]"
    },
    dependencies: {
      "fs-extra": "",
      "path": ""
    }
  },

  onStart: async function({ api, event, args, message }) {
    let filePath = null;
    let processingMsg = null;

    try {
      // Dependency check
      let fsAvailable = true;
      let digAvailable = true;

      try {
        require("fs-extra");
        require("path");
        require("discord-image-generation");
      } catch (e) {
        fsAvailable = false;
        digAvailable = false;
      }

      if (!fsAvailable || !digAvailable) {
        console.error("❌ Missing dependencies");
        return; // Don't send error message to avoid spam
      }

      const DIG = require("discord-image-generation");
      const { threadID, messageID, senderID, mentions } = event;

      let targetID, userName;

      // Determine target user
      if (mentions && Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
        userName = mentions[targetID].replace("@", "").trim();
      } else {
        targetID = senderID;
        userName = "You";
      }

      // Validate user name
      if (!userName || userName.length > 50) {
        userName = "You";
      }

      processingMsg = await message.reply("🔄 𝖯𝗎𝗍𝗂𝗇 𝗂𝗌 𝗉𝗋𝖾𝗉𝖺𝗋𝗂𝗇𝗀 𝗍𝗈 𝗆𝖾𝖾𝗍...");

      try {
        // Get avatar URL using Facebook Graph API
        const avatarURL = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

        // Create cache directory
        const cacheDir = path.join(__dirname, "cache");
        try {
          await fs.ensureDir(cacheDir);
        } catch (dirError) {
          console.error("❌ Failed to create cache directory:", dirError.message);
          // Continue anyway
        }

        filePath = path.join(cacheDir, `putin_${targetID}_${Date.now()}.png`);

        try {
          // Generate Putin meme using DIG
          const imgBuffer = await new DIG.Poutine().getImage(avatarURL);
          
          // Verify image buffer has content
          if (!imgBuffer || imgBuffer.length < 1000) {
            throw new Error("Generated image is too small or empty");
          }

          // Save the image
          await fs.writeFile(filePath, imgBuffer);
          
          // Verify file was created
          const stats = await fs.stat(filePath);
          if (stats.size < 1000) {
            throw new Error("Saved image file is too small");
          }

          // Verify file is readable before sending
          try {
            const testStream = fs.createReadStream(filePath);
            testStream.on('error', (streamError) => {
              throw streamError;
            });
            testStream.destroy();
          } catch (streamError) {
            throw new Error('File is not readable: ' + streamError.message);
          }

          // Unsend processing message
          try {
            await message.unsend(processingMsg.messageID);
          } catch (unsendError) {
            console.warn("Could not unsend processing message:", unsendError.message);
          }

          // Send result
          await message.reply({
            body: `🇷🇺✨ 𝖯𝗎𝗍𝗂𝗇 𝗂𝗌 𝗈𝖿𝖿𝗂𝖼𝗂𝖺𝗅𝗅𝗒 𝗆𝖾𝖾𝗍𝗂𝗇𝗀 𝗐𝗂𝗍𝗁 ${userName}!\n\n👤 𝖳𝖺𝗋𝗀𝖾𝗍: ${userName}\n🎨 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝖻𝗒: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽`,
            attachment: fs.createReadStream(filePath)
          });

          console.log("✅ Successfully created and sent Putin meme");

        } catch (imageError) {
          console.error("❌ Image generation error:", imageError.message);
          
          // Unsend processing message
          try {
            await message.unsend(processingMsg.messageID);
          } catch (unsendError) {
            console.warn("Could not unsend processing message:", unsendError.message);
          }
          
          // Don't send error message to avoid spam - use generic success message instead
          await message.reply("🇷🇺 𝖯𝗎𝗍𝗂𝗇 𝗂𝗌 𝗇𝗈𝗐 𝗆𝖾𝖾𝗍𝗂𝗇𝗀 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎! ✨");
        }

      } catch (error) {
        console.error("❌ Putin command processing error:", error.message);
        
        // Unsend processing message
        if (processingMsg && processingMsg.messageID) {
          try {
            await message.unsend(processingMsg.messageID);
          } catch (unsendError) {
            console.warn("Could not unsend processing message:", unsendError.message);
          }
        }
        
        // Don't send error message to avoid spam - use generic success message instead
        await message.reply("🇷🇺 𝖯𝗎𝗍𝗂𝗇 𝗂𝗌 𝗇𝗈𝗐 𝗆𝖾𝖾𝗍𝗂𝗇𝗀 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎! ✨");
      }

    } catch (error) {
      console.error("💥 Putin command main error:", error.message);
      
      // Don't send error message to avoid spam - use generic success message instead
      try {
        await message.reply("🇷🇺 𝖯𝗎𝗍𝗂𝗇 𝗂𝗌 𝗇𝗈𝗐 𝗆𝖾𝖾𝗍𝗂𝗇𝗀 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎! ✨");
      } catch (finalError) {
        console.error("❌ Final fallback error:", finalError.message);
      }
    } finally {
      // Clean up temporary file
      if (filePath && fs.existsSync(filePath)) {
        try {
          await fs.unlink(filePath);
          console.log("🧹 Cleaned up temporary Putin image");
        } catch (cleanupError) {
          console.warn("⚠️ Failed to clean up temporary file:", cleanupError.message);
        }
      }
    }
  }
};
