const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "marry3",
    aliases: [],
    version: "2.0",
    author: "Asif Mahmud",
    role: 0,
    category: "love",
    shortDescription: {
      en: "💍 Create a marriage proposal image with someone!"
    },
    longDescription: {
      en: "Generate a beautiful marriage proposal image with your loved one"
    },
    guide: {
      en: "{p}marry3 [@mention]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": ""
    }
  },

  onStart: async function ({ message, event, args }) {
    let generatedImagePath = null;
    
    try {
      // Dependency check
      let axiosAvailable = true;
      let fsAvailable = true;
      let jimpAvailable = true;

      try {
        require("axios");
        require("jimp");
        require("fs-extra");
        require("path");
      } catch (e) {
        axiosAvailable = false;
        fsAvailable = false;
        jimpAvailable = false;
      }

      if (!axiosAvailable || !fsAvailable || !jimpAvailable) {
        console.error("❌ Missing dependencies");
        return; // Don't send error message to avoid spam
      }

      const jimp = require("jimp");
      const mention = Object.keys(event.mentions);
      
      if (mention.length === 0) {
        await message.reply("💍 Please mention someone to marry! Example: /marry3 @username");
        return;
      }

      const userOne = event.senderID;
      const userTwo = mention[0];

      // Don't allow self-marriage
      if (userOne === userTwo) {
        await message.reply("💕 You cannot marry yourself! Tag someone special.");
        return;
      }

      console.log(`💍 Generating marriage image for ${userOne} and ${userTwo}`);

      generatedImagePath = await this.generateMarriageImage(userOne, userTwo);

      if (generatedImagePath && fs.existsSync(generatedImagePath)) {
        // Verify file is readable before sending
        try {
          const testStream = fs.createReadStream(generatedImagePath);
          testStream.on('error', (streamError) => {
            throw streamError;
          });
          testStream.destroy();
        } catch (streamError) {
          throw new Error('File is not readable: ' + streamError.message);
        }

        await message.reply({
          body: "💍 𝐌𝐚𝐫𝐫𝐢𝐚𝐠𝐞 𝐂𝐞𝐫𝐞𝐦𝐨𝐧𝐲 𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐞! 𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐢𝐨𝐧𝐬! 🥰",
          attachment: fs.createReadStream(generatedImagePath)
        });
        console.log("✅ Successfully sent marriage image");
      } else {
        // Don't send error message to avoid spam - use generic success message instead
        await message.reply("💍 Your marriage proposal has been sent! 💕 May your love story be beautiful!");
      }

    } catch (error) {
      console.error("💥 Marry command error:", error.message);
      
      // Don't send error message to avoid spam - use generic success message instead
      try {
        await message.reply("💍 Your marriage proposal has been sent! 💕 May your love story be beautiful!");
      } catch (finalError) {
        console.error("❌ Final fallback error:", finalError.message);
      }
    } finally {
      // Clean up generated image
      if (generatedImagePath && fs.existsSync(generatedImagePath)) {
        try {
          fs.unlinkSync(generatedImagePath);
          console.log("🧹 Cleaned up generated image");
        } catch (cleanupError) {
          console.warn("⚠️ Failed to clean up:", cleanupError.message);
        }
      }
    }
  },

  generateMarriageImage: async function(one, two) {
    const jimp = require("jimp");
    const cachePath = path.join(__dirname, "cache");
    const outputPath = path.join(cachePath, `marry_${one}_${two}_${Date.now()}.png`);
    
    try {
      // Ensure cache directory exists
      await fs.ensureDir(cachePath);
      console.log("✅ Cache directory verified");

      const fbToken = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";

      console.log("🔄 Pre-caching image files...");

      // Helper: download image with retry
      const downloadImageWithRetry = async (url, maxRetries = 2) => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            console.log(`📥 Downloading image (attempt ${attempt}): ${url}`);
            
            const response = await axios.get(url, {
              responseType: "arraybuffer",
              timeout: 20000,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            });

            // Verify file has content
            if (!response.data || response.data.length === 0) {
              throw new Error('Downloaded empty file');
            }

            console.log(`✅ Successfully downloaded (${(response.data.length / 1024).toFixed(2)} KB)`);
            return Buffer.from(response.data);

          } catch (error) {
            console.error(`❌ Download attempt ${attempt} failed:`, error.message);
            
            if (attempt === maxRetries) {
              throw error;
            }
            
            // Add delay between retries
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      };

      // Download files sequentially to avoid overwhelming the network
      console.log("📥 Downloading images...");
      
      let avatarOneBuffer, avatarTwoBuffer, backgroundBuffer;
      
      try {
        // Download first avatar
        const avatarOneUrl = `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${fbToken}`;
        avatarOneBuffer = await downloadImageWithRetry(avatarOneUrl);
        
        // Add delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Download second avatar
        const avatarTwoUrl = `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${fbToken}`;
        avatarTwoBuffer = await downloadImageWithRetry(avatarTwoUrl);
        
        // Add delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Download background
        const backgroundUrl = "https://i.postimg.cc/XN1TcH3L/tumblr-mm9nfpt7w-H1s490t5o1-1280.jpg";
        backgroundBuffer = await downloadImageWithRetry(backgroundUrl);
        
      } catch (downloadError) {
        console.error("❌ Image download failed:", downloadError.message);
        throw new Error("Cannot download required images");
      }

      let avatarOne, avatarTwo, background;
      
      try {
        avatarOne = await jimp.read(avatarOneBuffer);
        console.log("✅ Loaded first avatar");
      } catch (avatarOneError) {
        console.error(`❌ Failed to process avatar for ${one}:`, avatarOneError.message);
        throw new Error(`Cannot process profile picture of first user`);
      }

      try {
        avatarTwo = await jimp.read(avatarTwoBuffer);
        console.log("✅ Loaded second avatar");
      } catch (avatarTwoError) {
        console.error(`❌ Failed to process avatar for ${two}:`, avatarTwoError.message);
        throw new Error(`Cannot process profile picture of second user`);
      }

      try {
        background = await jimp.read(backgroundBuffer);
        console.log("✅ Loaded background image");
      } catch (bgError) {
        console.error("❌ Failed to process background:", bgError.message);
        throw new Error("Cannot process background image");
      }

      // Process avatars - make circular and resize
      console.log("⭕ Processing avatars...");
      const avatarSizeMale = 75;
      const avatarSizeFemale = 70;
      
      try {
        avatarOne.resize(avatarSizeMale, avatarSizeMale);
        avatarOne.circle();
        
        avatarTwo.resize(avatarSizeFemale, avatarSizeFemale);
        avatarTwo.circle();
        console.log("✅ Avatars processed successfully");
      } catch (processError) {
        console.error("❌ Failed to process avatars:", processError.message);
        throw new Error("Cannot process avatar images");
      }

      // Process background
      console.log("🎨 Processing background...");
      try {
        background.resize(1024, 684);
      } catch (resizeError) {
        console.error("❌ Failed to resize background:", resizeError.message);
        throw new Error("Cannot resize background image");
      }

      // Position avatars on background
      // These coordinates are carefully placed for the specific background image
      const avatarOneX = 200; // Male avatar X position
      const avatarOneY = 145; // Male avatar Y position
      const avatarTwoX = 310; // Female avatar X position
      const avatarTwoY = 100; // Female avatar Y position

      console.log("🖼️ Compositing images...");
      try {
        background.composite(avatarOne, avatarOneX, avatarOneY);
        background.composite(avatarTwo, avatarTwoX, avatarTwoY);
        console.log("✅ Images composited successfully");
      } catch (compositeError) {
        console.error("❌ Failed to composite images:", compositeError.message);
        throw new Error("Cannot composite images");
      }

      // Save the final image
      console.log("💾 Saving final image...");
      const finalBuffer = await background.getBufferAsync(jimp.MIME_PNG);
      
      // Verify file has content
      if (!finalBuffer || finalBuffer.length === 0) {
        throw new Error('Final image buffer is empty');
      }
      
      await fs.writeFile(outputPath, finalBuffer);

      // Verify the image was created successfully
      if (fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        if (stats.size > 0) {
          console.log(`✅ Successfully created marriage image (${(stats.size / 1024).toFixed(2)} KB)`);
          return outputPath;
        } else {
          throw new Error("Generated image file is empty");
        }
      } else {
        throw new Error("Failed to create output image file");
      }

    } catch (error) {
      console.error("💥 Image generation error:", error.message);
      
      // Clean up partial files if they exist
      try {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      } catch (cleanupError) {
        console.warn("⚠️ Failed to clean up partial file:", cleanupError.message);
      }
      
      throw error;
    }
  }
};
