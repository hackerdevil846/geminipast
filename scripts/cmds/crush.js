const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "crush",
    aliases: ["lovematch", "romanticpair"],
    version: "7.3.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "love",
    shortDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑙𝑜𝑣𝑒 𝑝𝑎𝑖𝑟 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑐𝑟𝑢𝑠ℎ"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑟𝑜𝑚𝑎𝑛𝑡𝑖𝑐 𝑖𝑚𝑎𝑔𝑒 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑦𝑜𝑢 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑐𝑟𝑢𝑠ℎ"
    },
    guide: {
      en: "{p}crush [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
    }
  },

  onLoad: async function () {
    try {
      const { existsSync, mkdirSync } = fs;
      const dirMaterial = path.join(__dirname, 'cache', 'canvas');
      const filePath = path.join(dirMaterial, 'crush.png');
      
      if (!existsSync(dirMaterial)) {
        mkdirSync(dirMaterial, { recursive: true });
      }
      
      if (!existsSync(filePath)) {
        console.log("📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑐𝑟𝑢𝑠ℎ 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒...");
        const imageData = await axios.get("https://i.imgur.com/PlVBaM1.jpg", { 
          responseType: 'arraybuffer',
          timeout: 10000
        });
        
        if (imageData.status === 200) {
          await fs.writeFile(filePath, Buffer.from(imageData.data));
          console.log("✅ 𝐶𝑟𝑢𝑠ℎ 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦");
        } else {
          throw new Error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒. 𝑆𝑡𝑎𝑡𝑢𝑠: ${imageData.status}`);
        }
      }
    } catch (error) {
      console.error("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑐𝑟𝑢𝑠ℎ 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒:", error.message);
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      const { threadID, senderID } = event;
      const mention = Object.keys(event.mentions);
      
      if (!mention[0]) {
        return message.reply("💖 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎 𝑙𝑜𝑣𝑒 𝑝𝑎𝑖𝑟!");
      }

      const one = senderID;
      const two = mention[0];
      
      // Get user info with error handling
      let userName = "𝑌𝑜𝑢𝑟 𝐶𝑟𝑢𝑠ℎ";
      try {
        const userInfo = await global.utils.getUserInfo(two);
        userName = userInfo[two]?.name || "𝑌𝑜𝑢𝑟 𝐶𝑟𝑢𝑠ℎ";
      } catch (userError) {
        console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑡𝑡𝑖𝑛𝑔 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜:", userError);
      }

      const makeImage = async ({ one, two }) => {
        const __root = path.join(__dirname, "cache", "canvas");
        const crushImgPath = path.join(__root, "crush.png");
        const resultPath = path.join(__root, `crush_${one}_${two}.png`);
        const avatarOnePath = path.join(__root, `avt_${one}.png`);
        const avatarTwoPath = path.join(__root, `avt_${two}.png`);

        // Check if template exists
        if (!fs.existsSync(crushImgPath)) {
          throw new Error("𝐶𝑟𝑢𝑠ℎ 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }

        // Download avatars with better error handling
        const getAvatar = async (uid, avatarPath) => {
          try {
            const avatarData = await axios.get(
              `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
              { 
                responseType: 'arraybuffer',
                timeout: 15000 
              }
            );
            
            if (avatarData.status !== 200) {
              throw new Error(`𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝐴𝑃I 𝑟𝑒𝑡𝑢𝑟𝑛𝑒𝑑 𝑠𝑡𝑎𝑡𝑢𝑠: ${avatarData.status}`);
            }
            
            await fs.writeFile(avatarPath, Buffer.from(avatarData.data));
            
            // Verify the image was written correctly
            const stats = await fs.stat(avatarPath);
            if (stats.size === 0) {
              throw new Error("𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑖𝑚𝑎𝑔𝑒 𝑖𝑠 𝑒𝑚𝑝𝑡𝑦");
            }
            
          } catch (error) {
            console.error(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑎𝑣𝑎𝑡𝑎𝑟 𝑓𝑜𝑟 ${uid}:`, error.message);
            throw new Error(`𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑟𝑒𝑡𝑟𝑖𝑒𝑣𝑒 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟 ${uid}`);
          }
        };

        await getAvatar(one, avatarOnePath);
        await getAvatar(two, avatarTwoPath);

        // Create circular avatars with error handling
        const createCircularAvatar = async (inputPath) => {
          try {
            const image = await jimp.read(inputPath);
            const size = Math.min(image.bitmap.width, image.bitmap.height);
            
            return new Promise((resolve, reject) => {
              image.circle();
              image.getBuffer(jimp.MIME_PNG, (err, buffer) => {
                if (err) reject(err);
                else resolve(buffer);
              });
            });
          } catch (error) {
            throw new Error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑎𝑣𝑎𝑡𝑎𝑟: ${error.message}`);
          }
        };

        // Process the main image
        try {
          const crushImage = await jimp.read(crushImgPath);
          const circleOneBuffer = await createCircularAvatar(avatarOnePath);
          const circleTwoBuffer = await createCircularAvatar(avatarTwoPath);
          
          const circleOne = await jimp.read(circleOneBuffer);
          const circleTwo = await jimp.read(circleTwoBuffer);

          // Composite the avatars onto the main image
          crushImage.composite(circleOne.resize(191, 191), 93, 111);
          crushImage.composite(circleTwo.resize(190, 190), 434, 107);

          // Save the result
          await crushImage.writeAsync(resultPath);

          // Clean up temporary files
          await fs.remove(avatarOnePath).catch(() => {});
          await fs.remove(avatarTwoPath).catch(() => {});

          return resultPath;
          
        } catch (processingError) {
          throw new Error(`𝐼𝑚𝑎𝑔𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑓𝑎𝑖𝑙𝑒𝑑: ${processingError.message}`);
        }
      };

      // Send processing message
      const processingMsg = await message.reply("🔄 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑙𝑜𝑣𝑒 𝑝𝑎𝑖𝑟...");

      const resultPath = await makeImage({ one, two });
      
      await message.reply({
        body: `💘 𝐿𝑜𝑣𝑒 𝐶𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛 💘\n\n╔═════❖•❁❖═════╗\n\n   🫶 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙 𝑃𝑎𝑖𝑟𝑖𝑛𝑔 🫶\n\n╚═════❖•❁❖═════╝\n\n✨ 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑐𝑟𝑢𝑠ℎ 𝑤𝑖𝑡ℎ ${userName}!\n💌 𝐺𝑟𝑎𝑏 𝑡ℎ𝑒𝑚 𝑎𝑛𝑑 𝑚𝑎𝑘𝑒 𝑖𝑡 𝑜𝑓𝑓𝑖𝑐𝑖𝑎𝑙! 💕\n\n🔮 𝑃𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑦: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`,
        attachment: fs.createReadStream(resultPath)
      });

      // Clean up result file
      await fs.remove(resultPath).catch(() => {});
      
      // Remove processing message
      if (processingMsg && processingMsg.messageID) {
        await message.unsend(processingMsg.messageID);
      }

    } catch (error) {
      console.error("❌ 𝐶𝑟𝑢𝑠ℎ 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
      
      let errorMessage = "❌ ";
      if (error.message.includes("template")) {
        errorMessage += "𝐼𝑚𝑎𝑔𝑒 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑛𝑜𝑡 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
      } else if (error.message.includes("profile") || error.message.includes("avatar")) {
        errorMessage += "𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑟𝑒𝑡𝑟𝑖𝑒𝑣𝑒 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠. 𝑀𝑎𝑘𝑒 𝑠𝑢𝑟𝑒 𝑡ℎ𝑒 𝑢𝑠𝑒𝑟𝑠 𝑒𝑥𝑖𝑠𝑡.";
      } else if (error.message.includes("processing")) {
        errorMessage += "𝐼𝑚𝑎𝑔𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑓𝑎𝑖𝑙𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
      } else {
        errorMessage += "𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
      }
      
      return message.reply(errorMessage);
    }
  }
};
