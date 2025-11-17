const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "ronaldo",
    aliases: ["cr7"],
    version: "1.2",
    author: "Asif Mahmud",
    role: 0,
    category: "football",
    shortDescription: {
      en: "𝐒𝐞𝐧𝐝 𝐫𝐚𝐧𝐝𝐨𝐦 𝐂𝐫𝐢𝐬𝐭𝐢𝐚𝐧𝐨 𝐑𝐨𝐧𝐚𝐥𝐝𝐨 𝐩𝐡𝐨𝐭𝐨𝐬 ⚽🐐"
    },
    longDescription: {
      en: "𝐒𝐞𝐧𝐝𝐬 𝐡𝐢𝐠𝐡-𝐪𝐮𝐚𝐥𝐢𝐭𝐲 𝐫𝐚𝐧𝐝𝐨𝐦 𝐢𝐦𝐚𝐠𝐞𝐬 𝐨𝐟 𝐂𝐫𝐢𝐬𝐭𝐢𝐚𝐧𝐨 𝐑𝐨𝐧𝐚𝐥𝐝𝐨"
    },
    guide: {
      en: "{p}ronaldo"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": ""
    },
    cooldowns: 5
  },

  onLoad: async function() {
    try {
      const cacheDir = path.join(__dirname, 'cache', 'ronaldo_images');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
        console.log("✅ 𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐑𝐨𝐧𝐚𝐥𝐝𝐨 𝐢𝐦𝐚𝐠𝐞𝐬 𝐜𝐚𝐜𝐡𝐞 𝐝𝐢𝐫𝐞𝐜𝐭𝐨𝐫𝐲");
      }
    } catch (error) {
      console.error("❌ 𝐂𝐚𝐜𝐡𝐞 𝐝𝐢𝐫𝐞𝐜𝐭𝐨𝐫𝐲 𝐜𝐫𝐞𝐚𝐭𝐢𝐨𝐧 𝐞𝐫𝐫𝐨𝐫:", error);
    }
  },

  onStart: async function({ message, event }) {
    try {
      // Ronaldo image links
      const allLinks = [
        "https://i.imgur.com/gwAuLMT.jpg",
        "https://i.imgur.com/MuuhaJ4.jpg",
        "https://i.imgur.com/6t0R8fs.jpg",
        "https://i.imgur.com/7RTC4W5.jpg",
        "https://i.imgur.com/VTi2dTP.jpg",
        "https://i.imgur.com/gdXJaK9.jpg",
        "https://i.imgur.com/VqZp7IU.jpg",
        "https://i.imgur.com/9pio8Lb.jpg",
        "https://i.imgur.com/iw714Ym.jpg",
        "https://i.imgur.com/zFbcrjs.jpg",
        "https://i.imgur.com/e0td0K9.jpg",
        "https://i.imgur.com/gsJWOmA.jpg",
        "https://i.imgur.com/lU8CaT0.jpg",
        "https://i.imgur.com/mmZXEYl.jpg",
        "https://i.imgur.com/d2Ot9pW.jpg",
        "https://i.imgur.com/iJ1ZGwZ.jpg",
        "https://i.imgur.com/isqQhNQ.jpg",
        "https://i.imgur.com/GoKEy4g.jpg",
        "https://i.imgur.com/TjxTUsl.jpg",
        "https://i.imgur.com/VwPPL03.jpg",
        "https://i.imgur.com/45zAhI7.jpg",
        "https://i.imgur.com/n3agkNi.jpg",
        "https://i.imgur.com/F2mynhI.jpg",
        "https://i.imgur.com/XekHaDO.jpg"
      ];

      // Get random image
      const randomImage = allLinks[Math.floor(Math.random() * allLinks.length)];
      const cacheDir = path.join(__dirname, 'cache', 'ronaldo_images');
      const imagePath = path.join(cacheDir, `ronaldo_${Date.now()}.jpg`);

      console.log(`📸 𝐀𝐭𝐭𝐞𝐦𝐩𝐭𝐢𝐧𝐠 𝐭𝐨 𝐬𝐞𝐧𝐝 𝐑𝐨𝐧𝐚𝐥𝐝𝐨 𝐢𝐦𝐚𝐠𝐞: ${randomImage}`);

      // Get sender name safely
      let senderName = "𝐅𝐫𝐢𝐞𝐧𝐝";
      try {
        if (event && event.senderID) {
          // Try to get name from event if available
          if (event.senderInfo && event.senderInfo.name) {
            senderName = event.senderInfo.name;
          } else {
            // Fallback to basic name
            senderName = "𝐂𝐑𝟕 𝐅𝐚𝐧";
          }
        }
      } catch (error) {
        console.log("ℹ️ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐠𝐞𝐭 𝐮𝐬𝐞𝐫 𝐧𝐚𝐦𝐞, 𝐮𝐬𝐢𝐧𝐠 𝐝𝐞𝐟𝐚𝐮𝐥𝐭");
      }

      let imageSent = false;
      
      // Try to send image with multiple fallbacks
      for (let attempt = 0; attempt < 3 && !imageSent; attempt++) {
        try {
          if (attempt > 0) {
            // Try different image on retry
            const newRandomImage = allLinks[Math.floor(Math.random() * allLinks.length)];
            console.log(`🔄 𝐑𝐞𝐭𝐫𝐲𝐢𝐧𝐠 𝐰𝐢𝐭𝐡 𝐝𝐢𝐟𝐟𝐞𝐫𝐞𝐧𝐭 𝐢𝐦𝐚𝐠𝐞: ${newRandomImage}`);
          }

          // Download image to cache first
          const response = await axios({
            method: 'GET',
            url: randomImage,
            responseType: 'stream',
            timeout: 15000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'image/jpeg,image/*,*/*'
            }
          });

          // Save to cache
          const writer = fs.createWriteStream(imagePath);
          response.data.pipe(writer);
          
          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });

          // Verify file was created
          if (fs.existsSync(imagePath)) {
            const stats = fs.statSync(imagePath);
            if (stats.size > 0) {
              // Send the cached image
              await message.reply({
                body: `🌟 𝐇𝐞𝐫𝐞 𝐂𝐨𝐦𝐞𝐬 𝐓𝐡𝐞 𝐆𝐎𝐀𝐓 — Cristiano Ronaldo! 🐐⚽\n\n𝐑𝐞𝐪𝐮𝐞𝐬𝐭𝐞𝐝 𝐛𝐲: ${senderName}\n\n— 𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝`,
                attachment: fs.createReadStream(imagePath)
              });
              
              imageSent = true;
              console.log("✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐬𝐞𝐧𝐭 𝐑𝐨𝐧𝐚𝐥𝐝𝐨 𝐢𝐦𝐚𝐠𝐞");
            }
          }
          
        } catch (downloadError) {
          console.error(`❌ 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐚𝐭𝐭𝐞𝐦𝐩𝐭 ${attempt + 1} 𝐟𝐚𝐢𝐥𝐞𝐝:`, downloadError.message);
          
          // Clean up failed download
          try {
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          } catch (cleanupError) {
            console.log("ℹ️ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐜𝐥𝐞𝐚𝐧 𝐮𝐩 𝐟𝐚𝐢𝐥𝐞𝐝 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝");
          }
        }
      }

      // If all download attempts failed, try direct stream
      if (!imageSent) {
        try {
          console.log("🔄 𝐀𝐭𝐭𝐞𝐦𝐩𝐭𝐢𝐧𝐠 𝐝𝐢𝐫𝐞𝐜𝐭 𝐬𝐭𝐫𝐞𝐚𝐦...");
          
          const imageStream = await global.utils.getStreamFromURL(randomImage);
          if (imageStream) {
            await message.reply({
              body: `🌟 𝐇𝐞𝐫𝐞 𝐂𝐨𝐦𝐞𝐬 𝐓𝐡𝐞 𝐆𝐎𝐀𝐓 — Cristiano Ronaldo! 🐐⚽\n\n𝐑𝐞𝐪𝐮𝐞𝐬𝐭𝐞𝐝 𝐛𝐲: ${senderName}\n\n— 𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝`,
              attachment: imageStream
            });
            imageSent = true;
            console.log("✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐬𝐞𝐧𝐭 𝐢𝐦𝐚𝐠𝐞 𝐯𝐢𝐚 𝐝𝐢𝐫𝐞𝐜𝐭 𝐬𝐭𝐫𝐞𝐚𝐦");
          }
        } catch (streamError) {
          console.error("❌ 𝐃𝐢𝐫𝐞𝐜𝐭 𝐬𝐭𝐫𝐞𝐚𝐦 𝐟𝐚𝐢𝐥𝐞𝐝:", streamError.message);
        }
      }

      // Final fallback - text only
      if (!imageSent) {
        await message.reply(`🌟 𝐇𝐞𝐫𝐞 𝐂𝐨𝐦𝐞𝐬 𝐓𝐡𝐞 𝐆𝐎𝐀𝐓 — Cristiano Ronaldo! 🐐⚽\n\n𝐑𝐞𝐪𝐮𝐞𝐬𝐭𝐞𝐝 𝐛𝐲: ${senderName}\n\n— 𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝\n\n❌ 𝐈𝐦𝐚𝐠𝐞 𝐜𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐛𝐞 𝐥𝐨𝐚𝐝𝐞𝐝, 𝐛𝐮𝐭 𝐭𝐡𝐞 𝐆𝐎𝐀𝐓 𝐬𝐩𝐢𝐫𝐢𝐭 𝐫𝐞𝐦𝐚𝐢𝐧𝐬! 💫`);
      }

      // Clean up cache file
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log("🧹 𝐂𝐥𝐞𝐚𝐧𝐞𝐝 𝐮𝐩 𝐜𝐚𝐜𝐡𝐞𝐝 𝐢𝐦𝐚𝐠𝐞");
        }
      } catch (cleanupError) {
        console.log("ℹ️ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐜𝐥𝐞𝐚𝐧 𝐮𝐩 𝐜𝐚𝐜𝐡𝐞 𝐟𝐢𝐥𝐞");
      }

    } catch (error) {
      console.error("💥 𝐑𝐨𝐧𝐚𝐥𝐝𝐨 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐞𝐫𝐫𝐨𝐫:", error);
      
      try {
        await message.reply("❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐟𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐑𝐨𝐧𝐚𝐥𝐝𝐨 𝐢𝐦𝐚𝐠𝐞. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.");
      } catch (finalError) {
        console.error("💥 𝐅𝐢𝐧𝐚𝐥 𝐞𝐫𝐫𝐨𝐫 𝐡𝐚𝐧𝐝𝐥𝐢𝐧𝐠 𝐟𝐚𝐢𝐥𝐞𝐝:", finalError);
      }
    }
  }
};
