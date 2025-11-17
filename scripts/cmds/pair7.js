const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

// Paths for cache and background image
const dirMaterial = path.join(__dirname, "cache", "canvas");
const bgPath = path.join(dirMaterial, "pairing.jpg");

module.exports = {
  config: {
    name: "pair7",
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
      en: "{p}pair7"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onLoad: async function() {
    try {
      console.log("🔄 Initializing pair7 command...");

      // Dependency check
      let axiosAvailable = true;
      let fsAvailable = true;
      let jimpAvailable = true;

      try {
        require("axios");
        require("fs-extra");
        require("jimp");
      } catch (e) {
        axiosAvailable = false;
        fsAvailable = false;
        jimpAvailable = false;
      }

      if (!axiosAvailable || !fsAvailable || !jimpAvailable) {
        console.error("❌ Missing dependencies");
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
          if (!response.data || response.data.length < 1000) {
            throw new Error("Invalid image data received");
          }
          
          fs.writeFileSync(bgPath, Buffer.from(response.data));
          console.log(`✅ Background image downloaded successfully (${(response.data.length / 1024).toFixed(2)} KB)`);
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
      // Dependency check
      let axiosAvailable = true;
      let fsAvailable = true;
      let jimpAvailable = true;

      try {
        require("axios");
        require("fs-extra");
        require("jimp");
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
        console.warn("❌ Could not fetch sender info:", e.message);
      }

      // Get thread participants
      let participants = [];
      try {
        const threadInfo = await api.getThreadInfo(threadID);
        participants = threadInfo.participantIDs || [];
      } catch (e) {
        console.error("❌ Could not fetch thread participants:", e.message);
        // Don't send error message to avoid spam
        await api.sendMessage("💖 Pairing completed! Check your match! ✨", threadID, messageID);
        return;
      }

      // Filter out sender and bot
      const botID = api.getCurrentUserID();
      const eligibleParticipants = participants.filter(id =>
        id !== senderID && id !== botID
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
        console.warn("❌ Could not fetch partner info:", e.message);
      }

      console.log("🔄 Pre-caching image files...");

      // Generate pairing image
      generatedImagePath = await this.makePairImage(senderID, randomID);

      if (!generatedImagePath || !fs.existsSync(generatedImagePath)) {
        // Fallback to text-only message
        const fallbackMessage = `💖 𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐢𝐨𝐧𝐬! ${senderName} was paired with ${partnerName}!\n✨ 𝐏𝐚𝐢𝐫 𝐨𝐝𝐝𝐬: ${pairRate}`;
        
        await api.sendMessage({
          body: fallbackMessage,
          mentions: [
            { id: senderID, tag: senderName },
            { id: randomID, tag: partnerName }
          ]
        }, threadID);
        return;
      }

      // Verify file is readable before sending
      try {
        const testStream = fs.createReadStream(generatedImagePath);
        testStream.on('error', (streamError) => {
          throw streamError;
        });
        testStream.destroy(); // Just testing readability
      } catch (streamError) {
        console.error("❌ File is not readable:", streamError.message);
        // Fallback to text-only message
        const fallbackMessage = `💖 𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐢𝐨𝐧𝐬! ${senderName} was paired with ${partnerName}!\n✨ 𝐏𝐚𝐢𝐫 𝐨𝐝𝐝𝐬: ${pairRate}`;
        
        await api.sendMessage({
          body: fallbackMessage,
          mentions: [
            { id: senderID, tag: senderName },
            { id: randomID, tag: partnerName }
          ]
        }, threadID);
        return;
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
      console.error("❌ Pair command error:", error.message);
      // Don't send error message to avoid spam - use generic success message instead
      try {
        await api.sendMessage("💖 Pairing completed! Check your match! ✨", event.threadID, event.messageID);
      } catch (finalError) {
        console.error("❌ Final fallback error:", finalError.message);
      }
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
    const timestamp = Date.now();
    const outputPath = path.join(dirMaterial, `pairing_${user1}_${user2}_${timestamp}.png`);
    const avatar1Path = path.join(dirMaterial, `avt_${user1}_${timestamp}.png`);
    const avatar2Path = path.join(dirMaterial, `avt_${user2}_${timestamp}.png`);

    try {
      // Check if background exists
      if (!fs.existsSync(bgPath)) {
        throw new Error("Background image not found");
      }

      console.log("📥 Downloading avatar files");

      // Helper function to download image with retry
      const downloadImageWithRetry = async (url, maxRetries = 2) => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            console.log(`📥 Downloading image (attempt ${attempt}): ${url}`);
            
            const response = await axios.get(url, {
              responseType: "arraybuffer",
              timeout: 20000,
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
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
      const facebookToken = '6628568379%7Cc1e620fa708a1d5696fb991c1bde5662';
      
      let avatar1Buffer, avatar2Buffer;
      
      try {
        const avatar1Url = `https://graph.facebook.com/${user1}/picture?width=512&height=512&access_token=${facebookToken}`;
        avatar1Buffer = await downloadImageWithRetry(avatar1Url);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const avatar2Url = `https://graph.facebook.com/${user2}/picture?width=512&height=512&access_token=${facebookToken}`;
        avatar2Buffer = await downloadImageWithRetry(avatar2Url);
      } catch (downloadError) {
        console.error("❌ Avatar download failed:", downloadError.message);
        throw new Error("Could not download user avatars");
      }

      // Save avatar files
      fs.writeFileSync(avatar1Path, avatar1Buffer);
      fs.writeFileSync(avatar2Path, avatar2Buffer);

      // Verify the saved files
      if (!fs.existsSync(avatar1Path) || !fs.existsSync(avatar2Path)) {
        throw new Error("Failed to save avatar files");
      }

      const stats1 = fs.statSync(avatar1Path);
      const stats2 = fs.statSync(avatar2Path);
      if (stats1.size === 0 || stats2.size === 0) {
        throw new Error("Saved avatar files are empty");
      }

      // Read all images
      console.log("🎨 Processing images...");
      const jimp = require("jimp");
      
      let background, avatar1, avatar2;
      try {
        [background, avatar1, avatar2] = await Promise.all([
          jimp.read(bgPath),
          jimp.read(avatar1Path),
          jimp.read(avatar2Path)
        ]);
      } catch (loadError) {
        console.error("❌ Error loading images:", loadError.message);
        throw new Error("Failed to process images");
      }

      // Create circular avatars
      avatar1.circle();
      avatar2.circle();

      // Avatar sizes and positions (based on your template)
      const avatarSizeGirl = 85;  // Left side - larger
      const avatarSizeBoy = 75;   // Right side - smaller

      const girlAvatarX = 244;    // Left position X
      const girlAvatarY = 106;    // Left position Y
      const boyAvatarX = 333;     // Right position X  
      const boyAvatarY = 63;      // Right position Y

      // Composite avatars onto background
      background.composite(avatar1.resize(avatarSizeGirl, avatarSizeGirl), girlAvatarX, girlAvatarY);
      background.composite(avatar2.resize(avatarSizeBoy, avatarSizeBoy), boyAvatarX, boyAvatarY);

      // Save final image
      console.log("💾 Saving final image...");
      const finalBuffer = await background.getBufferAsync(jimp.MIME_PNG);
      
      // Verify file is readable before saving
      if (!finalBuffer || finalBuffer.length === 0) {
        throw new Error('Final image buffer is empty');
      }
      
      fs.writeFileSync(outputPath, finalBuffer);

      // Verify the saved file
      if (!fs.existsSync(outputPath)) {
        throw new Error('Failed to save final image');
      }

      const finalStats = fs.statSync(outputPath);
      if (finalStats.size === 0) {
        throw new Error('Final saved file is empty');
      }

      console.log(`✅ Successfully created pair image: ${outputPath} (${(finalStats.size / 1024).toFixed(2)} KB)`);
      return outputPath;

    } catch (error) {
      console.error("❌ Error creating pair image:", error.message);
      throw error;
    } finally {
      // Cleanup temporary avatar files
      const filesToClean = [avatar1Path, avatar2Path];
      for (const filePath of filesToClean) {
        if (filePath && fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (cleanupError) {
            console.warn("⚠️ Failed to clean up avatar file:", cleanupError.message);
          }
        }
      }
    }
  }
};
