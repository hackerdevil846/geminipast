const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

// Paths for cache and background image
const dirMaterial = path.join(__dirname, "cache", "canvas");
const bgPath = path.join(dirMaterial, "pairing.jpg");

module.exports = {
  config: {
    name: "pair1",
    aliases: [],
    version: "1.0.3",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    category: "Love",
    shortDescription: {
      en: "💖 Pair with people in the group"
    },
    longDescription: {
      en: "💖 Pair with random people in the group with cute images"
    },
    guide: {
      en: "{p}pair1"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onLoad: async function() {
    try {
      console.log("🔄 Initializing pair1 command...");

      // Dependency check
      try {
        require("axios");
        require("fs-extra");
        require("jimp");
      } catch (e) {
        console.error("❌ Missing dependencies:", e.message);
        return;
      }

      // Ensure cache directory exists
      if (!fs.existsSync(dirMaterial)) {
        fs.mkdirSync(dirMaterial, { recursive: true });
        console.log(`✅ Created cache directory: ${dirMaterial}`);
      }

      // Download background image if not exists
      if (!fs.existsSync(bgPath)) {
        console.log("📥 Downloading background image...");
        try {
          const response = await axios.get(
            "https://i.pinimg.com/736x/15/fa/9d/15fa9d71cdd07486bb6f728dae2fb264.jpg",
            {
              responseType: "arraybuffer",
              timeout: 30000,
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
              }
            }
          );
          
          // Verify file has content
          if (response.data && response.data.length > 1000) {
            fs.writeFileSync(bgPath, Buffer.from(response.data));
            console.log(`✅ Background image downloaded successfully (${(response.data.length / 1024).toFixed(2)} KB)`);
          } else {
            throw new Error("Invalid image data received");
          }
        } catch (downloadError) {
          console.error("❌ Failed to download background image:", downloadError.message);
        }
      } else {
        console.log(`✅ Background image already exists`);
      }
    } catch (error) {
      console.error("❌ Error in onLoad:", error.message);
    }
  },

  onStart: async function({ api, event }) {
    let generatedImagePath = null;

    try {
      const { threadID, messageID, senderID } = event;

      // Random pair percentage
      const pairPercentages = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', "0%", "48%"];
      const pairRate = pairPercentages[Math.floor(Math.random() * pairPercentages.length)];

      // Get sender info
      let senderName = "Unknown User";
      try {
        const senderInfo = await api.getUserInfo(senderID);
        senderName = senderInfo[senderID]?.name || senderName;
      } catch (e) {
        console.warn("Could not fetch sender info:", e.message);
      }

      // Get thread participants
      let participants = [];
      try {
        const threadInfo = await api.getThreadInfo(threadID);
        participants = threadInfo.participantIDs || [];
      } catch (e) {
        console.error("Could not fetch thread participants:", e.message);
        // Don't send error message to avoid spam
        return;
      }

      // Filter out sender and bot
      const eligibleParticipants = participants.filter(id =>
        id !== senderID &&
        id !== api.getCurrentUserID()
      );

      if (eligibleParticipants.length === 0) {
        await api.sendMessage("😢 No other members found for pairing!", threadID, messageID);
        return;
      }

      // Select random partner
      const randomID = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];
      
      let partnerName = "Unknown User";
      try {
        const userInfo = await api.getUserInfo(randomID);
        partnerName = userInfo[randomID]?.name || partnerName;
      } catch (e) {
        console.warn("Could not fetch partner info:", e.message);
      }

      // Send loading message
      await api.sendMessage("💖 Creating your pairing image...", threadID, messageID);

      // Generate pairing image
      generatedImagePath = await this.makePairImage(senderID, randomID);

      if (!generatedImagePath || !fs.existsSync(generatedImagePath)) {
        throw new Error("Failed to generate pairing image");
      }

      // Verify file is readable before sending
      try {
        const stats = fs.statSync(generatedImagePath);
        if (stats.size === 0) {
          throw new Error("Generated image file is empty");
        }
      } catch (fileError) {
        console.error("❌ Generated image file error:", fileError.message);
        throw new Error("Generated image file is corrupted");
      }

      // Prepare message with mentions
      const messageText = `💖 𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐢𝐨𝐧𝐬! ${senderName} was paired with ${partnerName}!\n✨ 𝐏𝐚𝐢𝐫 𝐨𝐝𝐝𝐬: ${pairRate}`;

      await api.sendMessage({
        body: messageText,
        mentions: [
          { id: senderID, tag: senderName },
          { id: randomID, tag: partnerName }
        ],
        attachment: fs.createReadStream(generatedImagePath)
      }, threadID);

      console.log("✅ Successfully sent pairing image");

    } catch (error) {
      console.error("❌ Pair command error:", error);
      // Don't send error message to avoid spam
    } finally {
      // Cleanup temporary image
      if (generatedImagePath && fs.existsSync(generatedImagePath)) {
        try {
          fs.unlinkSync(generatedImagePath);
          console.log("🧹 Cleaned up temporary pairing image");
        } catch (cleanupError) {
          console.warn("⚠️ Cleanup error:", cleanupError.message);
        }
      }
    }
  },

  makePairImage: async function(user1, user2) {
    const outputPath = path.join(dirMaterial, `pairing_${user1}_${user2}_${Date.now()}.png`);
    const avatar1Path = path.join(dirMaterial, `avt_${user1}_${Date.now()}.png`);
    const avatar2Path = path.join(dirMaterial, `avt_${user2}_${Date.now()}.png`);

    try {
      // Check if background exists
      if (!fs.existsSync(bgPath)) {
        throw new Error("Background image not found");
      }

      console.log("📥 Downloading avatars...");

      // Download files sequentially to avoid overwhelming the network
      let avatar1Buffer, avatar2Buffer;
      
      // Download first avatar
      try {
        console.log(`📥 Downloading avatar for ${user1}...`);
        const avatar1Response = await axios.get(
          `https://graph.facebook.com/${user1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { 
            responseType: "arraybuffer",
            timeout: 15000
          }
        );
        
        // Verify file has content
        if (!avatar1Response.data || avatar1Response.data.length < 1000) {
          throw new Error("Invalid avatar data received");
        }
        
        avatar1Buffer = Buffer.from(avatar1Response.data);
        console.log(`✅ Downloaded avatar 1 (${(avatar1Buffer.length / 1024).toFixed(2)} KB)`);
      } catch (error) {
        console.error(`❌ Failed to download avatar for ${user1}:`, error.message);
        // Try to re-download the file with different parameters
        try {
          const retryResponse = await axios.get(
            `https://graph.facebook.com/${user1}/picture?width=300&height=300`,
            { 
              responseType: "arraybuffer",
              timeout: 10000
            }
          );
          if (retryResponse.data && retryResponse.data.length > 1000) {
            avatar1Buffer = Buffer.from(retryResponse.data);
            console.log(`✅ Successfully re-downloaded avatar 1`);
          } else {
            throw new Error("Retry failed - invalid data");
          }
        } catch (retryError) {
          console.error(`❌ Retry failed for ${user1}:`, retryError.message);
          throw new Error(`Could not get avatar for first user`);
        }
      }

      // Add delay between downloads to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Download second avatar
      try {
        console.log(`📥 Downloading avatar for ${user2}...`);
        const avatar2Response = await axios.get(
          `https://graph.facebook.com/${user2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { 
            responseType: "arraybuffer",
            timeout: 15000
          }
        );
        
        // Verify file has content
        if (!avatar2Response.data || avatar2Response.data.length < 1000) {
          throw new Error("Invalid avatar data received");
        }
        
        avatar2Buffer = Buffer.from(avatar2Response.data);
        console.log(`✅ Downloaded avatar 2 (${(avatar2Buffer.length / 1024).toFixed(2)} KB)`);
      } catch (error) {
        console.error(`❌ Failed to download avatar for ${user2}:`, error.message);
        // Try to re-download the file with different parameters
        try {
          const retryResponse = await axios.get(
            `https://graph.facebook.com/${user2}/picture?width=300&height=300`,
            { 
              responseType: "arraybuffer",
              timeout: 10000
            }
          );
          if (retryResponse.data && retryResponse.data.length > 1000) {
            avatar2Buffer = Buffer.from(retryResponse.data);
            console.log(`✅ Successfully re-downloaded avatar 2`);
          } else {
            throw new Error("Retry failed - invalid data");
          }
        } catch (retryError) {
          console.error(`❌ Retry failed for ${user2}:`, retryError.message);
          throw new Error(`Could not get avatar for second user`);
        }
      }

      // Save avatar files
      fs.writeFileSync(avatar1Path, avatar1Buffer);
      fs.writeFileSync(avatar2Path, avatar2Buffer);

      // Verify saved files
      if (!fs.existsSync(avatar1Path) || !fs.existsSync(avatar2Path)) {
        throw new Error("Failed to save avatar files");
      }

      // Read all images
      console.log("🎨 Processing images...");
      const [background, avatar1, avatar2] = await Promise.all([
        jimp.read(bgPath),
        jimp.read(avatar1Path),
        jimp.read(avatar2Path)
      ]);

      // Create circular avatars
      avatar1.circle();
      avatar2.circle();

      // Avatar sizes and positions
      const avatarSizeGirl = 85;
      const avatarSizeBoy = 75;

      const girlAvatarX = 244;
      const girlAvatarY = 106;
      const boyAvatarX = 333;
      const boyAvatarY = 63;

      // Composite avatars onto background
      background.composite(avatar1.resize(avatarSizeGirl, avatarSizeGirl), girlAvatarX, girlAvatarY);
      background.composite(avatar2.resize(avatarSizeBoy, avatarSizeBoy), boyAvatarX, boyAvatarY);

      // Save final image
      console.log("💾 Saving final image...");
      await background.writeAsync(outputPath);

      // Verify the image was created
      if (fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        if (stats.size > 1000) {
          console.log(`✅ Successfully created pair image: ${outputPath} (${(stats.size / 1024).toFixed(2)} KB)`);
          return outputPath;
        } else {
          throw new Error("Generated image file is empty");
        }
      } else {
        throw new Error("Failed to create output image file");
      }

    } catch (error) {
      console.error("❌ Error creating pair image:", error.message);
      throw error;
    } finally {
      // Cleanup temporary avatar files
      try {
        if (fs.existsSync(avatar1Path)) fs.unlinkSync(avatar1Path);
        if (fs.existsSync(avatar2Path)) fs.unlinkSync(avatar2Path);
      } catch (cleanupError) {
        console.warn("⚠️ Failed to clean up avatar files:", cleanupError.message);
      }
    }
  }
};
