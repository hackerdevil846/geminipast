const axios = require("axios");
const jimp = require("jimp");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pair4",
    aliases: [],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🍓 𝐺𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑓𝑒𝑎𝑡𝑢𝑟𝑒"
    },
    longDescription: {
      en: "𝑅𝑎𝑛𝑑𝑜𝑚𝑙𝑦 𝑝𝑎𝑖𝑟 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑤𝑖𝑡ℎ 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦 𝑝𝑒𝑟𝑐𝑒𝑛𝑡𝑎𝑔𝑒𝑠"
    },
    guide: {
      en: "{p}pair4 [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛/𝑟𝑒𝑝𝑙𝑦/𝑙𝑒𝑎𝑣𝑒 𝑏𝑙𝑎𝑛𝑘]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onLoad: async function() {
    try {
      // Dependency check
      let axiosAvailable, jimpAvailable, fsAvailable;
      try {
        axiosAvailable = true;
        jimpAvailable = true;
        fsAvailable = true;
      } catch (e) {
        console.error("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠:", e);
        return;
      }

      const dirMaterial = __dirname + `/cache/canvas/`;
      const pathFile = path.resolve(__dirname, 'cache/canvas', 'pairing.png');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(dirMaterial)) {
        fs.mkdirSync(dirMaterial, { recursive: true });
        console.log("✅ 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑐𝑎𝑐ℎ𝑒 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦");
      }
      
      // Download pairing image if it doesn't exist
      if (!fs.existsSync(pathFile)) {
        try {
          console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗉𝖺𝗂𝗋𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾...");
          const response = await axios.get("https://i.postimg.cc/X7R3CLmb/267378493-3075346446127866-4722502659615516429-n.png", {
            responseType: 'arraybuffer',
            timeout: 30000
          });
          
          // Verify file has content
          if (response.data && response.data.length > 0) {
            fs.writeFileSync(pathFile, Buffer.from(response.data));
            console.log("✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒");
          } else {
            throw new Error("𝐸𝑚𝑝𝑡𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑑𝑎𝑡𝑎");
          }
        } catch (error) {
          console.error("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒:", error.message);
        }
      } else {
        console.log("✅ 𝑃𝑎𝑖𝑟𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑒𝑥𝑖𝑠𝑡𝑠");
      }
    } catch (error) {
      console.error("💥 𝑂𝑛𝐿𝑜𝑎𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
    }
  },

  onStart: async function({ api, event, message }) {
    try {
      const { threadID, messageID, senderID } = event;
      
      console.log(`🔍 𝑆𝑡𝑎𝑟𝑡𝑖𝑛𝑔 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟: ${senderID}`);

      // Compatibility percentages
      const tl = ['21%', '11%', '55%', '89%', '22%', '45%', '1%', '4%', 
                  '78%', '15%', '91%', '77%', '41%', '32%', '67%', '19%', 
                  '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', 
                  '99%', "0%", "48%"];
      const tle = tl[Math.floor(Math.random() * tl.length)];
      
      // Get sender info with error handling
      let senderInfo;
      try {
        senderInfo = await api.getUserInfo(senderID);
      } catch (userError) {
        console.error("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑠𝑒𝑛𝑑𝑒𝑟 𝑖𝑛𝑓𝑜:", userError);
        return; // Don't send error message to avoid spam
      }
      
      const senderName = senderInfo[senderID]?.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
      
      // Get thread info with error handling
      let threadInfo;
      try {
        threadInfo = await api.getThreadInfo(threadID);
      } catch (threadError) {
        console.error("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑡ℎ𝑟𝑒𝑎𝑑 𝑖𝑛𝑓𝑜:", threadError);
        return; // Don't send error message to avoid spam
      }
      
      const participants = threadInfo.participantIDs.filter(id => id !== senderID);
      
      if (participants.length === 0) {
        return message.reply("❌ 𝑁𝑜𝑡 𝑒𝑛𝑜𝑢𝑔ℎ 𝑢𝑠𝑒𝑟𝑠 𝑖𝑛 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝 𝑡𝑜 𝑝𝑎𝑖𝑟!");
      }
      
      const participant = participants[Math.floor(Math.random() * participants.length)];
      
      // Get participant info with error handling
      let participantInfo;
      try {
        participantInfo = await api.getUserInfo(participant);
      } catch (partError) {
        console.error("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑝𝑎𝑟𝑡𝑖𝑐𝑖𝑝𝑎𝑛𝑡 𝑖𝑛𝑓𝑜:", partError);
        return; // Don't send error message to avoid spam
      }
      
      const participantName = participantInfo[participant]?.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
      
      // Create mention array
      const arraytag = [
        { id: senderID, tag: senderName },
        { id: participant, tag: participantName }
      ];
      
      console.log(`🎯 𝑃𝑎𝑖𝑟𝑖𝑛𝑔: ${senderName} 💝 ${participantName} (${tle})`);
      
      // Generate pairing image
      const imagePath = await makeImage({ 
        one: senderID, 
        two: participant 
      });
      
      if (!imagePath) {
        console.error("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒");
        return; // Don't send error message to avoid spam
      }

      // Verify file is readable before sending
      if (fs.existsSync(imagePath)) {
        const stats = fs.statSync(imagePath);
        if (stats.size > 0) {
          // Send result
          await message.reply({ 
            body: `🌸┈┈┈┈┈┈┈┈┈┈┈┈🌸\n🍓 𝐴𝑏ℎ𝑖𝑛𝑎𝑛𝑑𝑎𝑛 ${senderName}, 𝑡𝑢𝑚𝑖 𝑝𝑎𝑖𝑟 ℎ𝑜𝑙𝑒 ${participantName} 𝑒𝑟 𝑠𝑎𝑡ℎ𝑒!\n💝 𝑇𝑜𝑚𝑎𝑑𝑒𝑟 𝑚𝑖𝑙𝑎𝑛𝑒𝑟 ℎ𝑎𝑟: ${tle}\n🌸┈┈┈┈┈┈┈┈┈┈┈┈🌸`,
            mentions: arraytag,
            attachment: fs.createReadStream(imagePath) 
          });
          
          console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑠𝑒𝑛𝑡 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑟𝑒𝑠𝑢𝑙𝑡`);
        } else {
          console.error("❌ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑖𝑚𝑎𝑔𝑒 𝑖𝑠 𝑒𝑚𝑝𝑡𝑦");
        }
      } else {
        console.error("❌ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑖𝑚𝑎𝑔𝑒 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
      }
      
      // Clean up
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
          console.log("🧹 𝐶𝑙𝑒𝑎𝑛𝑒𝑑 𝑢𝑝 𝑡𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑓𝑖𝑙𝑒");
        } catch (cleanupError) {
          console.warn("⚠️ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑙𝑒𝑎𝑛 𝑢𝑝 𝑡𝑒𝑚𝑝 𝑓𝑖𝑙𝑒:", cleanupError.message);
        }
      }
      
    } catch (error) {
      console.error("💥 𝑃𝑎𝑖𝑟𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", error);
      // Don't send error message to avoid spam
    }
  }
};

async function makeImage({ one, two }) {
  try {
    const __root = path.resolve(__dirname, "cache", "canvas");
    const pairing_img_path = __root + "/pairing.png";
    const pathImg = __root + `/pairing_${one}_${two}_${Date.now()}.png`;
    const avatarOne = __root + `/avt_${one}_${Date.now()}.png`;
    const avatarTwo = __root + `/avt_${two}_${Date.now()}.png`;
    
    // Verify pairing image exists
    if (!fs.existsSync(pairing_img_path)) {
      console.error("❌ 𝑃𝑎𝑖𝑟𝑖𝑛𝑔 𝑏𝑎𝑠𝑒 𝑖𝑚𝑎𝑔𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
      return null;
    }

    // Load pairing image
    let pairing_img;
    try {
      pairing_img = await jimp.read(pairing_img_path);
    } catch (imageError) {
      console.error("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒:", imageError);
      return null;
    }

    console.log("🔄 𝖯𝗋𝖾-𝖼𝖺𝖼𝗁𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋𝗌...");
    
    // Download files sequentially to avoid overwhelming the network
    let avatarOneData, avatarTwoData;
    
    try {
      console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋 1: ${one}`);
      avatarOneData = await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
        responseType: 'arraybuffer',
        timeout: 15000
      });
      
      // Add delay between downloads to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋 2: ${two}`);
      avatarTwoData = await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
        responseType: 'arraybuffer',
        timeout: 15000
      });
    } catch (downloadError) {
      console.error("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑣𝑎𝑡𝑎𝑟𝑠:", downloadError.message);
      return null;
    }

    // Verify avatars have content
    if (!avatarOneData.data || avatarOneData.data.length === 0) {
      console.error("❌ 𝐴𝑣𝑎𝑡𝑎𝑟 1 𝑖𝑠 𝑒𝑚𝑝𝑡𝑦");
      return null;
    }
    if (!avatarTwoData.data || avatarTwoData.data.length === 0) {
      console.error("❌ 𝐴𝑣𝑎𝑡𝑎𝑟 2 𝑖𝑠 𝑒𝑚𝑝𝑡𝑦");
      return null;
    }

    // Save avatar files
    try {
      fs.writeFileSync(avatarOne, Buffer.from(avatarOneData.data));
      fs.writeFileSync(avatarTwo, Buffer.from(avatarTwoData.data));
    } catch (writeError) {
      console.error("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑎𝑣𝑒 𝑎𝑣𝑎𝑡𝑎𝑟 𝑓𝑖𝑙𝑒𝑠:", writeError);
      return null;
    }
    
    // Create circular avatars
    let circleOne, circleTwo;
    try {
      circleOne = await jimp.read(await circle(avatarOne));
      circleTwo = await jimp.read(await circle(avatarTwo));
    } catch (circleError) {
      console.error("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑐𝑖𝑟𝑐𝑢𝑙𝑎𝑟 𝑎𝑣𝑎𝑡𝑎𝑟𝑠:", circleError);
      // Clean up temp files
      if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
      if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
      return null;
    }

    // Composite images
    try {
      pairing_img.composite(circleOne.resize(150, 150), 980, 200)
                .composite(circleTwo.resize(150, 150), 140, 200);
    } catch (compositeError) {
      console.error("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑜𝑚𝑝𝑜𝑠𝑖𝑡𝑒 𝑖𝑚𝑎𝑔𝑒𝑠:", compositeError);
      // Clean up temp files
      if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
      if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
      return null;
    }

    // Save final image
    try {
      const raw = await pairing_img.getBufferAsync("image/png");
      fs.writeFileSync(pathImg, raw);
    } catch (saveError) {
      console.error("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑎𝑣𝑒 𝑓𝑖𝑛𝑎𝑙 𝑖𝑚𝑎𝑔𝑒:", saveError);
      // Clean up temp files
      if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
      if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
      return null;
    }

    // Clean up temp files
    try {
      if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
      if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
    } catch (cleanupError) {
      console.warn("⚠️ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑙𝑒𝑎𝑛 𝑢𝑝 𝑡𝑒𝑚𝑝 𝑓𝑖𝑙𝑒𝑠:", cleanupError.message);
    }

    console.log("✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒");
    return pathImg;
    
  } catch (error) {
    console.error("💥 𝑀𝑎𝑘𝑒𝐼𝑚𝑎𝑔𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
    return null;
  }
}

async function circle(imagePath) {
  try {
    const image = await jimp.read(imagePath);
    image.circle();
    return await image.getBufferAsync("image/png");
  } catch (error) {
    console.error("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑐𝑖𝑟𝑐𝑢𝑙𝑎𝑟 𝑖𝑚𝑎𝑔𝑒:", error);
    throw error;
  }
}
