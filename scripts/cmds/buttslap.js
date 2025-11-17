const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

// Function to convert text to Bold Italic Unicode characters
const toBI = (text) => {
  const map = {
    a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆', f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊',
    j: '𝒋', k: '𝒌', l: '𝒍', m: '𝒎', n: '𝒏', o: '𝒐', p: '𝒑', q: '𝒒', r: '𝒓',
    s: '𝒔', t: '𝒕', u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚', z: '𝒛',
    A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫', E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯',
    I: '𝑰', J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴', N: '𝑵', O: '𝑶', P: '𝑷',
    Q: '𝑸', R: '𝑹', S: '𝑺', T: '𝑻', U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿',
    Y: '𝒀', Z: '𝒁',
    ' ': ' ', '!': '!', '?': '?', '.': '.', ',': ',', '@': '@', '*': '*', '💢': '💢', '💥': '💥'
  };
  return text.split("").map(c => map[c] || c).join("");
};

module.exports = {
  config: {
    name: "buttslap",
    aliases: [],
    version: "2.0.0",
    author: "Asif Mahmud",
    role: 0,
    category: "fun",
    shortDescription: { en: toBI("🖐️ Funny spank meme creator") },
    longDescription: { en: toBI("Creates a funny spank meme using a tagged user's avatar") },
    guide: { en: toBI("{p}buttslap [@tag]") },
    dependencies: { 
      "axios": "",
      "fs-extra": "",
      "jimp": "",
      "path": ""
    }
  },

  onStart: async function ({ message, event, args }) {
    let avatar1Path = null;
    let avatar2Path = null;
    let pathImg = null;

    try {
      const { senderID, mentions, threadID } = event;

      // Check if someone is tagged
      if (!mentions || Object.keys(mentions).length === 0) {
        return message.reply(toBI("⚠️ Please tag someone to slap!"));
      }

      const mentionID = Object.keys(mentions)[0];
      const tagName = mentions[mentionID].replace("@", "");

      const one = senderID;
      const two = mentionID;

      // Create cache directories if they don't exist
      const cacheDir = path.join(__dirname, "cache", "buttslap");
      const canvasDir = path.join(__dirname, "cache", "canvas");
      
      try {
        await fs.ensureDir(cacheDir);
        await fs.ensureDir(canvasDir);
      } catch (dirError) {
        console.error("Directory creation error:", dirError);
        return message.reply(toBI("❌ Failed to create cache directories."));
      }

      // Template path (relative to the bot command file)
      const templatePath = path.join(__dirname, "cache", "canvas", "hitbutt.png");

      // Check if template exists
      if (!fs.existsSync(templatePath)) {
        return message.reply(toBI("❌ Template image 'hitbutt.png' not found in cache/canvas folder!"));
      }

      // Circle crop function with error handling
      async function circle(imagePath) {
        try {
          const img = await jimp.read(imagePath);
          img.circle();
          return await img.getBufferAsync("image/png");
        } catch (circleError) {
          console.error("Circle crop error:", circleError);
          throw new Error("Failed to create circular avatar");
        }
      }

      // Generate unique file paths
      const timestamp = Date.now();
      pathImg = path.join(cacheDir, `buttslap_${one}_${two}_${timestamp}.png`);
      avatar1Path = path.join(cacheDir, `avt_${one}_${timestamp}.png`);
      avatar2Path = path.join(cacheDir, `avt_${two}_${timestamp}.png`);

      // Download avatars with better error handling and timeout
      let avatar1Buffer, avatar2Buffer;
      
      try {
        const avatar1Response = await axios.get(
          `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { 
            responseType: "arraybuffer",
            timeout: 15000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          }
        );
        avatar1Buffer = avatar1Response.data;
        await fs.writeFile(avatar1Path, Buffer.from(avatar1Buffer));
        console.log("✅ Downloaded slapper avatar");
      } catch (dlError1) {
        console.error(`Error downloading avatar for ${one}:`, dlError1.message);
        return message.reply(toBI("❌ Failed to download slapper's avatar. Please try again."));
      }

      try {
        const avatar2Response = await axios.get(
          `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { 
            responseType: "arraybuffer",
            timeout: 15000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          }
        );
        avatar2Buffer = avatar2Response.data;
        await fs.writeFile(avatar2Path, Buffer.from(avatar2Buffer));
        console.log("✅ Downloaded target avatar");
      } catch (dlError2) {
        console.error(`Error downloading avatar for ${two}:`, dlError2.message);
        return message.reply(toBI(`❌ Failed to download @${tagName}'s avatar. Please try again.`));
      }

      // Verify avatar files were created
      if (!fs.existsSync(avatar1Path) || !fs.existsSync(avatar2Path)) {
        return message.reply(toBI("❌ Failed to save avatar images."));
      }

      // Circle crop avatars
      let circle1, circle2;
      try {
        circle1 = await circle(avatar1Path);
        circle2 = await circle(avatar2Path);
        console.log("✅ Created circular avatars");
      } catch (circleError) {
        console.error("Avatar cropping error:", circleError);
        return message.reply(toBI("❌ Failed to process avatars."));
      }

      // Load and process images
      let template, img1, img2;
      try {
        template = await jimp.read(templatePath);
        img1 = await jimp.read(circle1);
        img2 = await jimp.read(circle2);
        console.log("✅ Loaded all images");
      } catch (loadError) {
        console.error("Image loading error:", loadError);
        return message.reply(toBI("❌ Failed to load images for processing."));
      }

      // Adjust positions for the template image - EXACT SAME POSITIONS AS ORIGINAL
      try {
        template
          .composite(img1.resize(160, 160), 320, 40)    // Slapper position - EXACT SAME
          .composite(img2.resize(180, 180), 180, 140);  // Target position - EXACT SAME

        const finalBuffer = await template.getBufferAsync("image/png");
        await fs.writeFile(pathImg, finalBuffer);
        console.log("✅ Created final image");
      } catch (compositeError) {
        console.error("Image composition error:", compositeError);
        return message.reply(toBI("❌ Failed to composite the final image."));
      }

      // Verify final image was created
      if (!fs.existsSync(pathImg)) {
        return message.reply(toBI("❌ Final image was not created."));
      }

      // Send the result
      await message.reply({
        body: toBI(`💢 *Slaps* 💥 @${tagName}`),
        mentions: [{ tag: `@${tagName}`, id: mentionID }],
        attachment: fs.createReadStream(pathImg)
      });

      console.log("✅ Successfully sent buttslap image");

    } catch (error) {
      console.error("💥 Buttslap command error:", error);
      await message.reply(toBI("❌ An unexpected error occurred. Please try again later!"));
      
    } finally {
      // Cleanup temporary files with error handling
      const filesToClean = [avatar1Path, avatar2Path, pathImg];
      for (const filePath of filesToClean) {
        if (filePath && fs.existsSync(filePath)) {
          try {
            await fs.unlink(filePath);
          } catch (cleanupError) {
            console.warn(`Could not delete ${filePath}:`, cleanupError.message);
          }
        }
      }
      console.log("🧹 Cleanup completed");
    }
  }
};
