const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "zom",
    aliases: [],
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Credit changed as requested
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: "Zombie filter",
    },
    longDescription: {
      en: "Applies a zombie effect to an image",
    },
    category: "fun",
    guide: {
      en: "{p}{n} [reply to image or provide image URL]",
    },
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    let imageUrl = null;

    // Check if the message is a reply and has an image attachment
    if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
      const attachment = event.messageReply.attachments[0];
      // Ensure the attachment is an image
      if (attachment.type === "photo" || (attachment.contentType && attachment.contentType.startsWith("image"))) {
        imageUrl = attachment.url;
      } else {
        return api.sendMessage("Please reply to an image.", threadID, messageID);
      }
    } 
    // If not a reply, check if an image URL is provided in the arguments
    else if (args.length > 0) {
      // Basic validation for a URL
      if (args[0].startsWith("http")) {
        imageUrl = args[0];
      } else {
        return api.sendMessage("The provided argument is not a valid URL.", threadID, messageID);
      }
    } 
    // If no image is found
    else {
      return api.sendMessage("Please reply to an image or provide an image URL.", threadID, messageID);
    }

    try {
      // Notify the user that the process has started
      api.sendMessage("Applying the zombie filter, please wait...", threadID, messageID);

      // Generate the zombie image buffer using discord-image-generation
      const buffer = await new DIG.Zombie().getImage(imageUrl);

      // Define the path for the temporary file
      const tempDir = path.join(__dirname, "cache");
      await fs.ensureDir(tempDir); // Ensure the cache directory exists
      const tempFilePath = path.join(tempDir, `zombie_${Date.now()}.png`);

      // Write the generated image buffer to the temporary file
      await fs.writeFile(tempFilePath, buffer);

      // Send the image as an attachment
      await api.sendMessage(
        { attachment: fs.createReadStream(tempFilePath) },
        threadID,
        () => {
          // Cleanup: delete the temporary file after the message is sent
          fs.unlink(tempFilePath, (err) => {
            if (err) console.error("Error deleting temp file:", err);
          });
        },
        messageID
      );
    } catch (error) {
      console.error("Failed to apply zombie filter:", error);
      api.sendMessage("An error occurred while processing the image: " + error.message, threadID, messageID);
    }
  }
};
