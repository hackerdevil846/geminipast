const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "slap",
    aliases: [],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑓𝑢𝑛",
    shortDescription: {
      en: "👊 𝑆𝑙𝑎𝑝 𝑚𝑒𝑚𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑜𝑟"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑠𝑙𝑎𝑝 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟'𝑠 𝑝ℎ𝑜𝑡𝑜"
    },
    guide: {
      en: "{p}slap @𝑢𝑠𝑒𝑟"
    },
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "path": "",
      "jimp": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    let slapperAvatarPath = null;
    let slappedAvatarPath = null;
    let finalImagePath = null;
    let uploadMsg = null;

    try {
      const { senderID, threadID, messageID } = event;

      // Check if someone is mentioned
      const mentionIds = Object.keys(event.mentions || {});
      if (!mentionIds.length) {
        return message.reply("❌ 𝑁𝑜 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑠𝑙𝑎𝑝.\n\n📝 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑠𝑙𝑎𝑝 @𝑢𝑠𝑒𝑟𝑛𝑎𝑚𝑒");
      }

      const mentionId = mentionIds[0];
      const tagName = event.mentions[mentionId].replace("@", "");

      // Validation checks
      if (mentionId === senderID) {
        return message.reply("😳 𝑌𝑜𝑢 𝑐𝑎𝑛𝑛𝑜𝑡 𝑠𝑙𝑎𝑝 𝑦𝑜𝑢𝑟𝑠𝑒𝑙𝑓. 𝑀𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑒𝑙𝑠𝑒.");
      }
      if (mentionId === api.getCurrentUserID()) {
        return message.reply("😅 𝐼 𝑐𝑎𝑛𝑛𝑜𝑡 𝑠𝑙𝑎𝑝 𝑚𝑦𝑠𝑒𝑙𝑓. 𝑀𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑒𝑙𝑠𝑒.");
      }

      // Create necessary directories
      const cacheDir = path.join(__dirname, 'cache', 'slap');
      const canvasDir = path.join(__dirname, 'cache', 'canvas');
      const templatePath = path.join(canvasDir, 'slap.png');

      await fs.ensureDir(cacheDir);
      await fs.ensureDir(canvasDir);

      // Check if template exists
      if (!await fs.pathExists(templatePath)) {
        return message.reply(`❌ 𝑆𝑙𝑎𝑝 𝑚𝑒𝑚𝑒 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑.\n\n📁 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑙𝑎𝑐𝑒 '𝑠𝑙𝑎𝑝.𝑝𝑛𝑔' 𝑎𝑡:\n${canvasDir}`);
      }

      uploadMsg = await message.reply("⏳ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑠𝑙𝑎𝑝 𝑚𝑒𝑚𝑒, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡...");

      // Helper function to create circular images
      async function circleImage(input) {
        try {
          const img = await jimp.read(input);
          img.resize(512, 512);
          img.circle();
          return await img.getBufferAsync(jimp.MIME_PNG);
        } catch (error) {
          console.error("𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑐𝑖𝑟𝑐𝑢𝑙𝑎𝑟 𝑖𝑚𝑎𝑔𝑒:", error);
          throw error;
        }
      }

      // Generate unique file names
      const timestamp = Date.now();
      slapperAvatarPath = path.join(cacheDir, `avt_slapper_${senderID}_${timestamp}.png`);
      slappedAvatarPath = path.join(cacheDir, `avt_slapped_${mentionId}_${timestamp}.png`);
      finalImagePath = path.join(cacheDir, `slap_final_${senderID}_${mentionId}_${timestamp}.png`);

      // Facebook access token for profile pictures
      const fbToken = `6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      // Helper function to download images
      async function downloadToFile(url, dest) {
        try {
          const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 20000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          await fs.writeFile(dest, Buffer.from(response.data));
          console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑: ${path.basename(dest)}`);
        } catch (error) {
          console.error(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 ${path.basename(dest)}:`, error.message);
          throw error;
        }
      }

      // Download both profile pictures
      console.log("📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠...");
      await downloadToFile(
        `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=${fbToken}`,
        slapperAvatarPath
      );

      await downloadToFile(
        `https://graph.facebook.com/${mentionId}/picture?width=512&height=512&access_token=${fbToken}`,
        slappedAvatarPath
      );

      // Create circular avatars
      console.log("🔄 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑐𝑖𝑟𝑐𝑢𝑙𝑎𝑟 𝑎𝑣𝑎𝑡𝑎𝑟𝑠...");
      const slapperCircleBuffer = await circleImage(slapperAvatarPath);
      const slappedCircleBuffer = await circleImage(slappedAvatarPath);

      // Load images for composition
      console.log("🎨 𝐶𝑜𝑚𝑝𝑜𝑠𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒𝑠...");
      const template = await jimp.read(templatePath);
      const slapperAvatar = await jimp.read(slapperCircleBuffer);
      const slappedAvatar = await jimp.read(slappedCircleBuffer);

      const templateWidth = template.bitmap.width;
      const templateHeight = template.bitmap.height;

      // Coordinates and sizes for avatar placement
      const slapperPosition = { x: 700, y: 150, size: 160 };
      const slappedPosition = { x: 235, y: 160, size: 110 };

      const referenceWidth = 1080;
      const referenceHeight = 607;
      const scaleX = templateWidth / referenceWidth;
      const scaleY = templateHeight / referenceHeight;

      // Calculate scaled positions and sizes
      const slapperX = Math.round(slapperPosition.x * scaleX);
      const slapperY = Math.round(slapperPosition.y * scaleY);
      const slapperSize = Math.round(slapperPosition.size * Math.min(scaleX, scaleY));

      const slappedX = Math.round(slappedPosition.x * scaleX);
      const slappedY = Math.round(slappedPosition.y * scaleY);
      const slappedSize = Math.round(slappedPosition.size * Math.min(scaleX, scaleY));

      // Resize and position avatars
      slapperAvatar.resize(slapperSize, slapperSize);
      slappedAvatar.resize(slappedSize, slappedSize);

      // Composite avatars onto template
      template.composite(slapperAvatar, slapperX, slapperY);
      template.composite(slappedAvatar, slappedX, slappedY);

      // Add caption text
      try {
        // Load a bold font for better visibility
        let font;
        try {
          font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
        } catch (fontError) {
          console.warn("⚠️ 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑙𝑜𝑎𝑑 𝑏𝑜𝑙𝑑 𝑓𝑜𝑛𝑡, 𝑢𝑠𝑖𝑛𝑔 𝑑𝑒𝑓𝑎𝑢𝑙𝑡:", fontError.message);
          font = jimp.FONT_SANS_32_WHITE;
        }

        const caption = `𝑆𝑙𝑎𝑝𝑝𝑒𝑑: @${tagName}`;
        const margin = Math.round(15 * Math.min(scaleX, scaleY));
        const textY = templateHeight - 55 * Math.min(scaleX, scaleY) - margin;

        template.print(
          font,
          margin,
          textY,
          {
            text: caption,
            alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
            alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
          },
          templateWidth - margin * 2
        );
      } catch (fontError) {
        console.warn("⚠️ 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑎𝑑𝑑 𝑐𝑎𝑝𝑡𝑖𝑜𝑛 𝑡𝑒𝑥𝑡:", fontError.message);
      }

      // Save final image
      await template.writeAsync(finalImagePath);
      console.log(`✅ 𝐹𝑖𝑛𝑎𝑙 𝑖𝑚𝑎𝑔𝑒 𝑠𝑎𝑣𝑒𝑑: ${finalImagePath}`);

      // Verify final image
      if (!await fs.pathExists(finalImagePath)) {
        throw new Error("❌ 𝐹𝑖𝑛𝑎𝑙 𝑖𝑚𝑎𝑔𝑒 𝑤𝑎𝑠 𝑛𝑜𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑.");
      }

      const stats = await fs.stat(finalImagePath);
      if (stats.size === 0) {
        throw new Error("❌ 𝐹𝑖𝑛𝑎𝑙 𝑖𝑚𝑎𝑔𝑒 𝑖𝑠 𝑒𝑚𝑝𝑡𝑦 𝑜𝑟 𝑐𝑜𝑟𝑟𝑢𝑝𝑡.");
      }

      // Clean up upload message
      try {
        if (uploadMsg && uploadMsg.messageID) {
          await api.unsendMessage(uploadMsg.messageID);
        }
      } catch (unsendError) {
        console.warn("⚠️ 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑢𝑛𝑠𝑒𝑛𝑑 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒:", unsendError.message);
      }

      // Add reaction to original message
      try {
        await api.setMessageReaction("✅", messageID, () => {}, true);
      } catch (reactionError) {
        // Ignore reaction failures
      }

      // Send the final slap meme
      await message.reply({
        body: `👊 𝑆𝑙𝑎𝑝𝑝𝑒𝑑! @${tagName}`,
        mentions: [
          {
            tag: `@${tagName}`,
            id: mentionId
          }
        ],
        attachment: fs.createReadStream(finalImagePath)
      });

      console.log("✅ 𝑆𝑙𝑎𝑝 𝑚𝑒𝑚𝑒 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑎𝑛𝑑 𝑠𝑒𝑛𝑡 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦.");

    } catch (error) {
      console.error("💥 𝑆𝑙𝑎𝑝 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error.message);

      // Clean up upload message on error
      try {
        if (uploadMsg && uploadMsg.messageID) {
          await api.unsendMessage(uploadMsg.messageID);
        }
      } catch (unsendError) {
        // Ignore cleanup errors
      }

      // Determine error message
      let userMessage = "❌ 𝐴𝑛 𝑢𝑛𝑒𝑥𝑝𝑒𝑐𝑡𝑒𝑑 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑚𝑒𝑚𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
      
      if (error.message.includes('𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒') || error.message.includes('𝑠𝑙𝑎𝑝.𝑝𝑛𝑔')) {
        userMessage = `❌ 𝑆𝑙𝑎𝑝 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑.\n\n📁 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑙𝑎𝑐𝑒 '𝑠𝑙𝑎𝑝.𝑝𝑛𝑔' 𝑖𝑛:\n${path.join(__dirname, 'cache', 'canvas')}`;
      } else if (error.message.includes('𝑝𝑟𝑜𝑓𝑖𝑙𝑒') || error.message.includes('𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘')) {
        userMessage = "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
      } else if (error.message.includes('𝑡𝑖𝑚𝑒𝑜𝑢𝑡')) {
        userMessage = "⏰ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
      }

      try {
        await message.reply(userMessage);
        // Add sad reaction to original message
        try {
          await api.setMessageReaction("😢", event.messageID, () => {}, true);
        } catch (reactionError) {
          // Ignore reaction failures
        }
      } catch (sendError) {
        console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑒𝑟𝑟𝑜𝑟 𝑚𝑒𝑠𝑠𝑎𝑔𝑒:", sendError.message);
      }
    } finally {
      // Clean up temporary files
      try {
        const filesToClean = [slapperAvatarPath, slappedAvatarPath, finalImagePath];
        for (const filePath of filesToClean) {
          if (filePath && await fs.pathExists(filePath)) {
            await fs.remove(filePath);
            console.log(`🧹 𝐶𝑙𝑒𝑎𝑛𝑒𝑑 𝑢𝑝: ${path.basename(filePath)}`);
          }
        }
        console.log("✅ 𝑇𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑓𝑖𝑙𝑒𝑠 𝑐𝑙𝑒𝑎𝑛𝑒𝑑 𝑢𝑝.");
      } catch (cleanupError) {
        console.warn("⚠️ 𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑓𝑎𝑖𝑙𝑒𝑑:", cleanupError.message);
      }
    }
  }
};
