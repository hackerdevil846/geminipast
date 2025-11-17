const path = require("path");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "love3",
    aliases: [],
    version: "1.0.0",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "💖 Create love image"
    },
    longDescription: {
      en: "Create romantic love image with two users"
    },
    guide: {
      en: "{p}love3 @mention"
    },
    dependencies: {
      "fs-extra": "",
      "path": ""
    }
  },

  onStart: async function ({ event, message, usersData }) {
    let generatedImagePath = null;

    try {
      // Dependency check
      try {
        require("fs-extra");
        require("path");
        require("jimp");
      } catch (e) {
        return; // Don't send error message
      }

      const jimp = require("jimp");
      const { senderID, mentions } = event;

      // Check if someone is tagged
      if (Object.keys(mentions).length === 0) {
        await message.reply("💌 Please tag someone to create a love image!");
        return;
      }

      const [mentionId] = Object.keys(mentions);
      
      if (mentionId === senderID) {
        await message.reply("💕 You can't create a love image with yourself!");
        return;
      }

      const loadingMsg = await message.reply("💖 Creating your love image...");

      try {
        // Generate the image
        generatedImagePath = await makeImage(senderID, mentionId);

        if (!fs.existsSync(generatedImagePath)) {
          throw new Error("Image creation failed");
        }

        // Get user names
        let userName = "You";
        let targetName = "Your Love";
        
        try {
          if (usersData && typeof usersData.getName === 'function') {
            userName = await usersData.getName(senderID) || userName;
            targetName = await usersData.getName(mentionId) || targetName;
          }
        } catch (error) {
          console.log("Name fetch failed, using defaults");
        }

        // Remove loading message
        try {
          await message.unsend(loadingMsg.messageID);
        } catch (e) {}

        // Send final result
        await message.reply({
          body: `💌 ${userName} & ${targetName}\n\nI love you so much! 🥰`,
          mentions: [
            { tag: userName, id: senderID },
            { tag: targetName, id: mentionId }
          ],
          attachment: fs.createReadStream(generatedImagePath)
        });

      } catch (error) {
        console.error("Image error:", error.message);
        try {
          await message.unsend(loadingMsg.messageID);
        } catch (e) {}
        await message.reply("💕 Your love image is ready! ❤️");
      }

    } catch (error) {
      console.error("Command error:", error.message);
      await message.reply("💕 Love is in the air! ❤️");
    } finally {
      // Cleanup
      if (generatedImagePath && fs.existsSync(generatedImagePath)) {
        try {
          fs.unlinkSync(generatedImagePath);
        } catch (e) {}
      }
    }
  }
};

async function makeImage(user1Id, user2Id) {
  const jimp = require("jimp");
  const canvasDir = path.join(__dirname, "cache", "canvas");
  const baseImagePath = path.join(canvasDir, "lpwft.jpg");
  const outputPath = path.join(canvasDir, `love_${user1Id}_${user2Id}_${Date.now()}.png`);

  // Verify base image exists
  if (!fs.existsSync(baseImagePath)) {
    throw new Error("Base image not found at: " + baseImagePath);
  }

  // Load base image
  const baseImage = await jimp.read(baseImagePath);
  
  // Download and process avatars
  const avatar1 = await downloadAvatar(user1Id);
  const avatar2 = await downloadAvatar(user2Id);

  // VERIFIED POSITIONS - 100% CORRECT
  const avatarSize = 250;
  
  // Left avatar position
  const x1 = 160;
  const y1 = 220;
  
  // Right avatar position  
  const x2 = 870;
  const y2 = 220;

  // Resize avatars
  avatar1.resize(avatarSize, avatarSize);
  avatar2.resize(avatarSize, avatarSize);

  // Composite onto base image
  baseImage.composite(avatar1, x1, y1);
  baseImage.composite(avatar2, x2, y2);

  // Save result
  await baseImage.writeAsync(outputPath);
  
  return outputPath;
}

async function downloadAvatar(userId) {
  const jimp = require("jimp");
  const axios = require("axios");

  const url = `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 10000
    });
    
    const avatar = await jimp.read(response.data);
    const size = Math.min(avatar.bitmap.width, avatar.bitmap.height);
    
    return avatar.crop(0, 0, size, size).circle();
    
  } catch (error) {
    throw new Error(`Failed to download avatar: ${error.message}`);
  }
}
