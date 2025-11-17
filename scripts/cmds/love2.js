const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "love2",
    aliases: [],
    version: "1.0.3", // Incremented version for this streamlined fix
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    category: "edit-img",
    shortDescription: {
      en: "Create a romantic love image with two users ❤️"
    },
    longDescription: {
      en: "Generates a romantic image with two users' profile pictures"
    },
    guide: {
      en: "{p}love2 @mention"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onLoad: async function () {
    const Jimp = require("jimp");
    const cacheDir = path.join(__dirname, "cache");
    const baseImagePath = path.join(cacheDir, "canvas", "frtwb.jpg");

    // Ensure cache/canvas directory exists
    await fs.ensureDir(path.dirname(baseImagePath));

    // Basic check for the base image on load
    if (!fs.existsSync(baseImagePath)) {
      console.warn(`[LOVE2] Base image template 'frtwb.jpg' not found at: ${baseImagePath}. Please ensure it is placed there.`);
    } else {
      try {
        await Jimp.read(baseImagePath); // Quick check if Jimp can read it
        console.log(`[LOVE2] Base image 'frtwb.jpg' is ready.`);
      } catch (e) {
        console.error(`[LOVE2] Error reading base image 'frtwb.jpg': ${e.message}. It might be corrupted.`);
      }
    }
  },

  onStart: async function ({ message, event, usersData }) {
    const Jimp = require("jimp"); // Ensure Jimp is available
    let generatedImagePath = null;

    try {
      const { senderID, mentions } = event;

      if (!Object.keys(mentions).length) {
        return message.reply("💌 Please tag someone to create a love image!\n\nExample: /love2 @username");
      }

      const [mentionId] = Object.keys(mentions);
      const mentionName = mentions[mentionId].replace(/@/g, "").trim();

      if (mentionId === senderID) {
        return message.reply("💕 You can't create a love image with yourself! Tag someone special.");
      }

      const loadingMsg = await message.reply("💖 Creating your love image...");

      try {
        generatedImagePath = await createLoveImage(senderID, mentionId, Jimp);

        if (!generatedImagePath || !fs.existsSync(generatedImagePath)) {
          throw new Error("Failed to generate image file.");
        }

        let userName = (await usersData.get(senderID))?.name || "You";
        let targetName = mentionName || "Them";

        const messageObj = {
          body: `❤️ ${userName} & ${targetName}\n\nI love you so much! 🤗🥀`,
          mentions: [
            { tag: userName, id: senderID },
            { tag: targetName, id: mentionId }
          ],
          attachment: fs.createReadStream(generatedImagePath)
        };

        await message.unsend(loadingMsg.messageID).catch(console.warn);
        await message.reply(messageObj);
        console.log("[LOVE2] Successfully sent love image");

      } catch (imageError) {
        console.error("[LOVE2] Image generation failed:", imageError.message);
        await message.unsend(loadingMsg.messageID).catch(console.warn);
        await message.reply(`Oops! Something went wrong while creating the image: ${imageError.message}`);
      }

    } catch (error) {
      console.error("[LOVE2] Unexpected error:", error.message);
      await message.reply("An unexpected error occurred. Please try again later.");
    } finally {
      if (generatedImagePath && fs.existsSync(generatedImagePath)) {
        await fs.unlink(generatedImagePath).catch(console.warn); // Use async unlink
        console.log("[LOVE2] Temporary image cleaned up");
      }
    }
  }
};

async function createLoveImage(user1Id, user2Id, Jimp) {
  const cacheDir = path.join(__dirname, "cache");
  const baseImagePath = path.join(cacheDir, "canvas", "frtwb.jpg");

  if (!fs.existsSync(baseImagePath)) {
    throw new Error(`Base image 'frtwb.jpg' not found at: ${baseImagePath}`);
  }

  const baseImage = await Jimp.read(baseImagePath);
  const targetBaseWidth = 720;
  const targetBaseHeight = 720;
  const resizedBase = baseImage.resize(targetBaseWidth, targetBaseHeight);

  const outputPath = path.join(cacheDir, `love_${user1Id}_${user2Id}_${Date.now()}.png`);

  const avatar1 = await downloadAndProcessAvatar(user1Id, Jimp);
  await new Promise(resolve => setTimeout(resolve, 500)); // Delay
  const avatar2 = await downloadAndProcessAvatar(user2Id, Jimp);

  // Positions based on the image you provided.
  const x1 = 155; // X position for the first avatar
  const y1 = 280; // Y position for the first avatar
  const x2 = 360; // X position for the second avatar
  const y2 = 280; // Y position for the second avatar

  resizedBase
    .composite(avatar1, x1, y1)
    .composite(avatar2, x2, y2);

  await resizedBase.writeAsync(outputPath);
  return outputPath;
}

async function downloadAndProcessAvatar(userId, Jimp) {
  const avatarOptions = [
    `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
    `https://graph.facebook.com/${userId}/picture?width=512&height=512`,
    `https://graph.facebook.com/${userId}/picture?type=large`,
    `https://graph.facebook.com/${userId}/picture`,
    `https://graph.facebook.com/v19.0/${userId}/picture?width=512&height=512`
  ];

  let avatarBuffer;
  for (const url of avatarOptions) {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer", timeout: 15000 });
      if (response.data && response.data.length > 1000) { // Basic size check
        avatarBuffer = Buffer.from(response.data);
        break;
      }
    } catch (error) {
      // console.warn(`[LOVE2] Avatar download attempt failed for ${url}: ${error.message}`);
    }
    await new Promise(resolve => setTimeout(resolve, 300)); // Small delay between attempts
  }

  if (!avatarBuffer) {
    throw new Error(`Failed to download avatar for user ${userId}.`);
  }

  let avatar = await Jimp.read(avatarBuffer);
  const size = Math.min(avatar.bitmap.width, avatar.bitmap.height);

  return avatar
    .crop(0, 0, size, size)
    .resize(200, 200, Jimp.RESIZE_BEZIER)
    .circle();
}
