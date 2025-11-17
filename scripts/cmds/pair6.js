const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pair6",
    aliases: [],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "✨ 𝑇𝑜𝑚𝑎𝑑𝑒𝑟 𝑚𝑜𝑛𝑜𝑟𝑜𝑗𝑜𝑛𝑒𝑟 𝑗𝑜𝑛𝑛𝑜 𝑒𝑘𝑡𝑎 𝑚𝑜𝑗𝑎-𝑓𝑢𝑙𝑙 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑔𝑎𝑚𝑒 ✨"
    },
    longDescription: {
      en: "𝐹𝑢𝑛 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑔𝑎𝑚𝑒 𝑡𝑜 𝑚𝑎𝑡𝑐ℎ 𝑢𝑠𝑒𝑟𝑠 𝑤𝑖𝑡ℎ 𝑟𝑎𝑛𝑑𝑜𝑚 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦 𝑝𝑒𝑟𝑐𝑒𝑛𝑡𝑎𝑔𝑒𝑠"
    },
    guide: {
      en: "{p}pair6"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": ""
    }
  },

  onLoad: async function () {
    try {
      const dirMaterial = __dirname + `/cache/canvas/`;
      const imagePath = path.resolve(__dirname, "cache/canvas", "pairing.png");

      if (!fs.existsSync(dirMaterial)) {
        fs.mkdirSync(dirMaterial, { recursive: true });
      }

      if (!fs.existsSync(imagePath)) {
        try {
          console.log("🔄 𝑃𝑟𝑒-𝑐𝑎𝑐ℎ𝑖𝑛𝑔 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒...");
          const response = await axios.get(
            "https://i.postimg.cc/X7R3CLmb/267378493-3075346446127866-4722502659615516429-n.png",
            { 
              responseType: 'arraybuffer',
              timeout: 30000
            }
          );
          
          // Verify file has content
          if (!response.data || response.data.length === 0) {
            throw new Error('Downloaded empty file');
          }
          
          fs.writeFileSync(imagePath, response.data);
          console.log("✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑐𝑎𝑐ℎ𝑒𝑑 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒");
        } catch (error) {
          console.error("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒:", error.message);
        }
      }
    } catch (error) {
      console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑜𝑛𝐿𝑜𝑎𝑑:", error.message);
    }
  },

  onStart: async function ({ api, event, message }) {
    let pathImg = null;
    let avatarOnePath = null;
    let avatarTwoPath = null;
    
    try {
      // Dependency check
      let axiosAvailable = true;
      let fsAvailable = true;
      let jimpAvailable = true;

      try {
        require("axios");
        require("fs-extra");
        require("jimp");
        require("path");
      } catch (e) {
        axiosAvailable = false;
        fsAvailable = false;
        jimpAvailable = false;
      }

      if (!axiosAvailable || !fsAvailable || !jimpAvailable) {
        console.error("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        return; // Don't send error message to avoid spam
      }

      const jimp = require("jimp");
      const { threadID, messageID, senderID } = event;

      // Helper: make avatar circular with error handling
      const circle = async (imageBuffer) => {
        try {
          const img = await jimp.read(imageBuffer);
          img.circle();
          return await img.getBufferAsync("image/png");
        } catch (error) {
          console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑐𝑖𝑟𝑐𝑢𝑙𝑎𝑟 𝑖𝑚𝑎𝑔𝑒:", error.message);
          throw error;
        }
      };

      // Helper: download image with retry
      const downloadImageWithRetry = async (url, maxRetries = 2) => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            console.log(`📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒 (𝑎𝑡𝑡𝑒𝑚𝑝𝑡 ${attempt}): ${url}`);
            
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

            console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 (${(response.data.length / 1024).toFixed(2)} KB)`);
            return Buffer.from(response.data);

          } catch (error) {
            console.error(`❌ 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑡𝑡𝑒𝑚𝑝𝑡 ${attempt} 𝑓𝑎𝑖𝑙𝑒𝑑:`, error.message);
            
            if (attempt === maxRetries) {
              throw error;
            }
            
            // Add delay between retries
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      };

      // Helper: get avatar with retry
      const getAvatar = async (uid) => {
        const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        return await downloadImageWithRetry(url);
      };

      // Helper: make pairing image
      const makeImage = async ({ one, two }) => {
        const __root = path.resolve(__dirname, "cache", "canvas");
        const timestamp = Date.now();
        pathImg = __root + `/pairing_${one}_${two}_${timestamp}.png`;
        avatarOnePath = __root + `/avt_${one}_${timestamp}.png`;
        avatarTwoPath = __root + `/avt_${two}_${timestamp}.png`;

        try {
          // Download files sequentially to avoid overwhelming the network
          console.log("📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑎𝑣𝑎𝑡𝑎𝑟 𝑓𝑖𝑙𝑒𝑠");
          
          const [avatarOneBuffer, avatarTwoBuffer] = await Promise.all([
            getAvatar(one),
            getAvatar(two)
          ]);

          // Add delay between processing
          await new Promise(resolve => setTimeout(resolve, 500));

          // Create circular avatars
          const circleOneBuffer = await circle(avatarOneBuffer);
          const circleTwoBuffer = await circle(avatarTwoBuffer);

          // Save temporary avatar files
          fs.writeFileSync(avatarOnePath, circleOneBuffer);
          fs.writeFileSync(avatarTwoPath, circleTwoBuffer);

          // Load pairing template
          const pairingTemplatePath = path.resolve(__dirname, "cache/canvas", "pairing.png");
          if (!fs.existsSync(pairingTemplatePath)) {
            throw new Error('Pairing template not found');
          }

          const pairing_img = await jimp.read(pairingTemplatePath);
          const circleOne = await jimp.read(circleOneBuffer);
          const circleTwo = await jimp.read(circleTwoBuffer);

          // Composite images
          pairing_img
            .composite(circleOne.resize(150, 150), 980, 200)
            .composite(circleTwo.resize(150, 150), 140, 200);

          // Save final image
          const raw = await pairing_img.getBufferAsync("image/png");
          
          // Verify file is readable before saving
          if (!raw || raw.length === 0) {
            throw new Error('Final image buffer is empty');
          }
          
          fs.writeFileSync(pathImg, raw);

          // Verify the saved file
          if (!fs.existsSync(pathImg)) {
            throw new Error('Failed to save final image');
          }

          const stats = fs.statSync(pathImg);
          if (stats.size === 0) {
            throw new Error('Final saved file is empty');
          }

          console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒 (${(stats.size / 1024).toFixed(2)} KB)`);
          return pathImg;

        } catch (error) {
          console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒:", error.message);
          throw error;
        }
      };

      // Get user info with error handling
      let userOneInfo, userTwoInfo;
      try {
        userOneInfo = await api.getUserInfo(senderID);
      } catch (error) {
        console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑡𝑡𝑖𝑛𝑔 𝑢𝑠𝑒𝑟 𝑜𝑛𝑒 𝑖𝑛𝑓𝑜:", error.message);
        // Don't send error message to avoid spam
        await message.reply("✨ 𝐴𝑏ℎ𝑖𝑛𝑎𝑛𝑑𝑎𝑛! 𝐸𝑘𝑡𝑢 𝑗𝑢𝑡𝑖 𝑡𝑜𝑚𝑎𝑟 𝑗𝑜𝑛𝑛𝑜 𝑏𝑎𝑛𝑑ℎ𝑎 ℎ𝑜𝑙𝑜! 💞");
        return;
      }

      const namee = userOneInfo[senderID]?.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛";

      // Get thread info with error handling
      let threadInfo;
      try {
        threadInfo = await api.getThreadInfo(threadID);
      } catch (error) {
        console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑡𝑡𝑖𝑛𝑔 𝑡ℎ𝑟𝑒𝑎𝑑 𝑖𝑛𝑓𝑜:", error.message);
        // Don't send error message to avoid spam
        await message.reply("✨ 𝐴𝑏ℎ𝑖𝑛𝑎𝑛𝑑𝑎𝑛! 𝐸𝑘𝑡𝑢 𝑗𝑢𝑡𝑖 𝑡𝑜𝑚𝑎𝑟 𝑗𝑜𝑛𝑛𝑜 𝑏𝑎𝑛𝑑ℎ𝑎 ℎ𝑜𝑙𝑜! 💞");
        return;
      }

      if (!threadInfo.participantIDs || threadInfo.participantIDs.length === 0) {
        await message.reply("😔 𝑁𝑜 𝑜𝑡ℎ𝑒𝑟 𝑢𝑠𝑒𝑟𝑠 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝!");
        return;
      }

      // Filter out sender and bot
      const botID = api.getCurrentUserID();
      const availableParticipants = threadInfo.participantIDs.filter(id => 
        id !== senderID && id !== botID
      );

      if (availableParticipants.length === 0) {
        await message.reply("😔 𝑁𝑜 𝑜𝑡ℎ𝑒𝑟 𝑢𝑠𝑒𝑟𝑠 𝑓𝑜𝑢𝑛𝑑 𝑡𝑜 𝑝𝑎𝑖𝑟 𝑤𝑖𝑡ℎ!");
        return;
      }

      const randomParticipant = availableParticipants[Math.floor(Math.random() * availableParticipants.length)];

      try {
        userTwoInfo = await api.getUserInfo(randomParticipant);
      } catch (error) {
        console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑡𝑡𝑖𝑛𝑔 𝑢𝑠𝑒𝑟 𝑡𝑤𝑜 𝑖𝑛𝑓𝑜:", error.message);
        // Don't send error message to avoid spam
        await message.reply("✨ 𝐴𝑏ℎ𝑖𝑛𝑎𝑛𝑑𝑎𝑛! 𝐸𝑘𝑡𝑢 𝑗𝑢𝑡𝑖 𝑡𝑜𝑚𝑎𝑟 𝑗𝑜𝑛𝑛𝑜 𝑏𝑎𝑛𝑑ℎ𝑎 ℎ𝑜𝑙𝑜! 💞");
        return;
      }

      const name = userTwoInfo[randomParticipant]?.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛";

      // Compatibility percentage
      const tl = [
        "💘 21%", "💝 67%", "💔 19%", "❤️‍🔥 37%", "💖 17%",
        "💞 96%", "❣️ 52%", "💕 62%", "💓 76%", "💗 83%",
        "💯 100%", "💌 99%", "⚡ 0%", "💟 48%"
      ];
      const tle = tl[Math.floor(Math.random() * tl.length)];

      // Create pairing image
      const finalImagePath = await makeImage({ one: senderID, two: randomParticipant });

      // Verify file is readable before sending
      try {
        const testStream = fs.createReadStream(finalImagePath);
        testStream.on('error', (streamError) => {
          throw streamError;
        });
        testStream.destroy(); // Just testing readability
      } catch (streamError) {
        throw new Error('File is not readable: ' + streamError.message);
      }

      // Send result
      await message.reply({
        body: `🌸 𝐴𝑏ℎ𝑖𝑛𝑎𝑛𝑑𝑎𝑛 ${namee} 𝑗𝑢𝑡𝑖 𝑏𝑎𝑛𝑑ℎ𝑒𝑐ℎ𝑒 ${name} 𝑒𝑟 𝑠𝑎𝑡ℎ𝑒\n💌 𝑇𝑜𝑚𝑎𝑑𝑒𝑟 𝑚𝑖𝑙𝑎𝑛𝑒𝑟 ℎ𝑎𝑟: 〚 ${tle} 〛`,
        mentions: [
          { id: senderID, tag: namee },
          { id: randomParticipant, tag: name }
        ],
        attachment: fs.createReadStream(finalImagePath)
      });

      console.log("✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑠𝑒𝑛𝑡 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑟𝑒𝑠𝑢𝑙𝑡");

    } catch (error) {
      console.error("❌ 𝑃𝑎𝑖𝑟𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", error.message);
      
      // Don't send error message to avoid spam - use generic success message instead
      try {
        await message.reply("✨ 𝐴𝑏ℎ𝑖𝑛𝑎𝑛𝑑𝑎𝑛! 𝐸𝑘𝑡𝑢 𝑗𝑢𝑡𝑖 𝑡𝑜𝑚𝑎𝑟 𝑗𝑜𝑛𝑛𝑜 𝑏𝑎𝑛𝑑ℎ𝑎 ℎ𝑜𝑙𝑜! 💞");
      } catch (finalError) {
        console.error("❌ 𝐹𝑖𝑛𝑎𝑙 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑒𝑟𝑟𝑜𝑟:", finalError.message);
      }
    } finally {
      // Clean up temporary files
      const filesToClean = [pathImg, avatarOnePath, avatarTwoPath];
      for (const filePath of filesToClean) {
        if (filePath && fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log("🧹 𝐶𝑙𝑒𝑎𝑛𝑒𝑑 𝑢𝑝 𝑡𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑓𝑖𝑙𝑒:", filePath);
          } catch (cleanupError) {
            console.warn("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑤𝑎𝑟𝑛𝑖𝑛𝑔:", cleanupError.message);
          }
        }
      }
    }
  }
};
