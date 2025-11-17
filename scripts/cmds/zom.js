const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "zom",
    aliases: [],
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: { en: "Zombie filter" },
    longDescription: { en: "Applies a zombie effect to an image" },
    category: "fun",
    guide: { en: "{p}{n} [reply to image or provide image URL]" },
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    let imageUrl = null;

    // ---- Fix reply image detection
    if (
      event.type === "message_reply" &&
      event.messageReply?.attachments?.length > 0
    ) {
      const attachment = event.messageReply.attachments[0];

      imageUrl =
        attachment.url ||
        attachment.previewUrl ||
        attachment.largePreviewUrl ||
        attachment.thumbnail;

      if (!imageUrl) {
        return api.sendMessage("Could not extract image URL.", threadID, messageID);
      }

      if (
        !attachment.type.includes("photo") &&
        !(attachment.contentType && attachment.contentType.startsWith("image"))
      ) {
        return api.sendMessage("Please reply to an image.", threadID, messageID);
      }
    }
    // ---- Argument URL provided
    else if (args.length > 0) {
      if (args[0].startsWith("http")) {
        imageUrl = args[0];
      } else {
        return api.sendMessage("The provided argument is NOT a valid image URL.", threadID, messageID);
      }
    }
    // ---- No image found
    else {
      return api.sendMessage("Please reply to an image or provide an image URL.", threadID, messageID);
    }

    try {
      api.sendMessage("🧟 Processing zombie filter... Wait a moment!", threadID, messageID);

      // Generate zombie effect
      const buffer = await new DIG.Zombie().getImage(imageUrl);

      // Temp file
      const tempDir = path.join(__dirname, "cache");
      await fs.ensureDir(tempDir);

      const tempFilePath = path.join(tempDir, `zombie_${Date.now()}.png`);
      await fs.writeFile(tempFilePath, buffer);

      // Send file
      await api.sendMessage(
        {
          attachment: fs.createReadStream(tempFilePath),
        },
        threadID,
        () => fs.unlink(tempFilePath, () => {}),
        messageID
      );
    } catch (error) {
      console.error("Zombie filter error:", error);
      api.sendMessage("❌ Error applying zombie filter: " + error.message, threadID, messageID);
    }
  },
};
