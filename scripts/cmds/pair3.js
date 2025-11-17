const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pair3",
    aliases: [],
    version: "1.0.0",
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "✨ 𝖯𝖺𝗂𝗋 𝗎𝗉 𝗎𝗌𝖾𝗋𝗌 ✨"
    },
    longDescription: {
      en: "𝖱𝖺𝗇𝖽𝗈𝗆𝗅𝗒 𝗉𝖺𝗂𝗋 𝗎𝗌𝖾𝗋𝗌 𝖺𝗇𝖽 𝗌𝗁𝗈𝗐 𝖼𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗂𝗅𝗂𝗍𝗒"
    },
    category: "𝗅𝗈𝗏𝖾",
    guide: {
      en: "{p}pair3"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": ""
    }
  },

  onStart: async function({ api, event, usersData }) {
    // Dependency check
    let axiosAvailable, fsAvailable, pathAvailable;
    try {
      axiosAvailable = true;
      fsAvailable = true;
      pathAvailable = true;
    } catch (e) {
      console.error("❌ Missing dependencies");
      return;
    }

    try {
      const { threadID, senderID } = event;
      
      console.log("🔄 𝖯𝗋𝖾-𝖼𝖺𝖼𝗁𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾𝗌...");
      
      // Get thread participants
      const threadInfo = await api.getThreadInfo(threadID);
      const participantIDs = threadInfo.participantIDs;
      
      // Calculate compatibility
      const tle = Math.floor(Math.random() * 101);
      const namee = (await usersData.get(senderID)).name;
      
      const botID = api.getCurrentUserID();
      const listUserID = participantIDs.filter(ID => ID != botID && ID != senderID);
      
      if (listUserID.length === 0) {
        return api.sendMessage("😢 𝖭𝗈 𝖾𝗅𝗂𝗀𝗂𝖻𝗅𝖾 𝗉𝖺𝗋𝗍𝗇𝖾𝗋𝗌 𝖿𝗈𝗎𝗇𝖽!", threadID);
      }
      
      // Select random user
      const id = listUserID[Math.floor(Math.random() * listUserID.length)];
      const name = (await usersData.get(id)).name;
      
      // Background selection
      const backgrounds = [
        "https://i.postimg.cc/wjJ29HRB/background1.png",
        "https://i.postimg.cc/zf4Pnshv/background2.png", 
        "https://i.postimg.cc/5tXRQ46D/background3.png"
      ];
      const selectedBG = backgrounds[Math.floor(Math.random() * backgrounds.length)];

      // Create cache directory
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // File paths
      const avt1Path = path.join(cacheDir, `avt1_${Date.now()}.png`);
      const bgPath = path.join(cacheDir, `bg_${Date.now()}.png`);
      const avt2Path = path.join(cacheDir, `avt2_${Date.now()}.png`);

      console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾𝗌");

      // Download files sequentially to avoid overwhelming the network
      let downloadSuccess = true;

      // Download Avatar 1
      try {
        console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 1 𝖺𝗏𝖺𝗍𝖺𝗋...");
        const Avatar1 = await axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
          responseType: "arraybuffer",
          timeout: 15000
        });
        
        // Verify file has content
        if (Avatar1.data && Avatar1.data.length > 100) {
          fs.writeFileSync(avt1Path, Buffer.from(Avatar1.data, "binary"));
          console.log("✅ 𝖴𝗌𝖾𝗋 1 𝖺𝗏𝖺𝗍𝖺𝗋 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽");
        } else {
          throw new Error("Empty avatar data");
        }
        
        // Add delay between downloads to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗎𝗌𝖾𝗋 1 𝖺𝗏𝖺𝗍𝖺𝗋:", error.message);
        downloadSuccess = false;
      }

      // Download Background
      if (downloadSuccess) {
        try {
          console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽...");
          const Background = await axios.get(selectedBG, { 
            responseType: "arraybuffer",
            timeout: 15000
          });
          
          // Verify file has content
          if (Background.data && Background.data.length > 100) {
            fs.writeFileSync(bgPath, Buffer.from(Background.data, "binary"));
            console.log("✅ 𝖡𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽");
          } else {
            throw new Error("Empty background data");
          }
          
          // Add delay between downloads to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽:", error.message);
          downloadSuccess = false;
        }
      }

      // Download Avatar 2
      if (downloadSuccess) {
        try {
          console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 2 𝖺𝗏𝖺𝗍𝖺𝗋...");
          const Avatar2 = await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
            responseType: "arraybuffer",
            timeout: 15000
          });
          
          // Verify file has content
          if (Avatar2.data && Avatar2.data.length > 100) {
            fs.writeFileSync(avt2Path, Buffer.from(Avatar2.data, "binary"));
            console.log("✅ 𝖴𝗌𝖾𝗋 2 𝖺𝗏𝖺𝗍𝖺𝗋 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽");
          } else {
            throw new Error("Empty avatar data");
          }
          
        } catch (error) {
          console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗎𝗌𝖾𝗋 2 𝖺𝗏𝖺𝗍𝖺𝗋:", error.message);
          downloadSuccess = false;
        }
      }

      // Verify files are readable before sending
      const attachments = [];
      if (downloadSuccess) {
        const filesToCheck = [
          { path: avt1Path, name: "avatar1" },
          { path: bgPath, name: "background" },
          { path: avt2Path, name: "avatar2" }
        ];

        for (const file of filesToCheck) {
          try {
            if (fs.existsSync(file.path)) {
              const stats = fs.statSync(file.path);
              if (stats.size > 100) {
                attachments.push(fs.createReadStream(file.path));
                console.log(`✅ ${file.name} 𝗏𝖾𝗋𝗂𝖿𝗂𝖾𝖽`);
              } else {
                throw new Error("File too small");
              }
            } else {
              throw new Error("File not found");
            }
          } catch (fileError) {
            console.error(`❌ ${file.name} 𝗏𝖾𝗋𝗂𝖿𝗂𝖼𝖺𝗍𝗂𝗈𝗇 𝖿𝖺𝗂𝗅𝖾𝖽:`, fileError.message);
            downloadSuccess = false;
            break;
          }
        }
      }

      // Send message with attachments if all downloads succeeded
      if (downloadSuccess && attachments.length === 3) {
        const msg = {
          body: `💌 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅 𝗉𝖺𝗂𝗋𝗂𝗇𝗀!\n\n✨ 𝖢𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗂𝗅𝗂𝗍𝗒: ${tle}%\n${namee} 💓 ${name}`,
          mentions: [
            { id: senderID, tag: namee },
            { id: id, tag: name }
          ],
          attachment: attachments
        };

        await api.sendMessage(msg, threadID);
        console.log("✅ 𝖯𝖺𝗂𝗋𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗌𝖾𝗇𝗍 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");

      } else {
        // Send text-only message if downloads failed
        const textMsg = {
          body: `💌 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅 𝗉𝖺𝗂𝗋𝗂𝗇𝗀!\n\n✨ 𝖢𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗂𝗅𝗂𝗍𝗒: ${tle}%\n${namee} 💓 ${name}\n\n📷 (𝖨𝗆𝖺𝗀𝖾𝗌 𝖼𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖻𝖾 𝗅𝗈𝖺𝖽𝖾𝖽)`,
          mentions: [
            { id: senderID, tag: namee },
            { id: id, tag: name }
          ]
        };
        await api.sendMessage(textMsg, threadID);
        console.log("✅ 𝖯𝖺𝗂𝗋𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗌𝖾𝗇𝗍 (𝗍𝖾𝗑𝗍-𝗈𝗇𝗅𝗒)");
      }

      // Clean up cache files
      const filesToClean = [avt1Path, bgPath, avt2Path];
      filesToClean.forEach(filePath => {
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (cleanError) {
          console.warn("⚠️ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉:", cleanError.message);
        }
      });

    } catch (error) {
      console.error("💥 𝖯𝖺𝗂𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
      // Don't send error message to avoid spam
    }
  }
};
