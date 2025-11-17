const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "lovecomp",
    aliases: [],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "💞 𝑅𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦 𝑐𝑎𝑙𝑐𝑢𝑙𝑎𝑡𝑜𝑟"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑠ℎ𝑜𝑤𝑖𝑛𝑔 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 𝑡𝑤𝑜 𝑝𝑒𝑜𝑝𝑙𝑒"
    },
    guide: {
      en: "{p}lovecomp [@𝑡𝑎𝑔] | [𝑖𝑛𝑓𝑜] | [𝑓𝑎𝑘𝑒]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": ""
    }
  },

  onLoad: async function() {
    try {
      // Dependency check
      let axiosAvailable = true;
      let fsAvailable = true;
      let canvasAvailable = true;
      let momentAvailable = true;

      try {
        require("axios");
        require("fs-extra");
        require("canvas");
        require("moment-timezone");
        require("path");
      } catch (e) {
        axiosAvailable = false;
        fsAvailable = false;
        canvasAvailable = false;
        momentAvailable = false;
      }

      if (!axiosAvailable || !fsAvailable || !canvasAvailable || !momentAvailable) {
        console.error("❌ Missing dependencies");
        return;
      }

      const { loadImage, createCanvas, registerFont } = require("canvas");
      
      const D = __dirname + "/cache/rela/";
      const bg = D + "bg.png";
      const dicon = D + "icon.png";
      const font = D + "AmaticSC.ttf";
      
      const bglink = "https://blogger.googleusercontent.com/img/a/AVvXsEgiT494Po7Onhcft4jFS2cTSb2-7wbRYaoCCGFH09X53RtuI3YABGgYfMJsCAmsDs8hfpMU2k28PKwImiP6Go9LiOquM0CYR4bEgzH8yXIfsJ8CJHdnRcogIOef0tgdzIjTBsGROv-12T60AI2njz0p_N9ipS5T4_KMatV8Erl6GYJ6PLou2HeIRWrA=s1278";
      const iconlink = "https://blogger.googleusercontent.com/img/a/AVvXsEgQpVe6Q9RLyMZolNU3K7PqmAyKbIz53aIcAux5P9X7gbXydjEbkbZSKHxiwTLrY_XmgSeJJgrTi8-jh6g8RuWvq8h4mfQOA470attJaNuHWI9AP28SVUiTF8gaggPUeeQ4zq7OT5kgO4qvQsloqIVxJue7cFZmDwaxHNI8UVHqxrCsA_BXwvEYskq9=s45";
      const fontlink = "https://drive.google.com/u/0/uc?id=1ZzgC7nyGaBw-zP3V2GKK0azoFgF5aXup&export=download";

      if (!fs.existsSync(D)) {
        fs.mkdirSync(D, { recursive: true });
        console.log("✅ Created rela cache directory");
      }

      // Helper: download file with retry
      const downloadFileWithRetry = async (url, filePath, maxRetries = 3) => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            console.log(`📥 Downloading file (attempt ${attempt}): ${url}`);
            
            const response = await axios.get(url, {
              responseType: "arraybuffer",
              timeout: 30000,
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
              }
            });

            // Verify file has content
            if (!response.data || response.data.length === 0) {
              throw new Error('Downloaded empty file');
            }

            await fs.writeFile(filePath, Buffer.from(response.data));
            
            // Verify the saved file
            if (!fs.existsSync(filePath)) {
              throw new Error('Failed to save file');
            }

            const stats = fs.statSync(filePath);
            if (stats.size === 0) {
              throw new Error('Saved file is empty');
            }

            console.log(`✅ Successfully downloaded ${path.basename(filePath)} (${(stats.size / 1024).toFixed(2)} KB)`);
            return true;

          } catch (error) {
            console.error(`❌ Download attempt ${attempt} failed:`, error.message);
            
            if (attempt === maxRetries) {
              throw error;
            }
            
            // Add delay between retries
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      };

      // Download files sequentially to avoid overwhelming the network
      console.log("🔄 Pre-caching lovecomp files...");

      if (!fs.existsSync(bg)) {
        await downloadFileWithRetry(bglink, bg);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (!fs.existsSync(dicon)) {
        await downloadFileWithRetry(iconlink, dicon);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (!fs.existsSync(font)) {
        await downloadFileWithRetry(fontlink, font);
      }

      console.log("✅ Lovecomp files cached successfully");

    } catch (error) {
      console.error("❌ Error during onLoad:", error.message);
    }
  },

  onStart: async function({ api, event, args, usersData, message }) {
    let expole = null;

    try {
      // Dependency check
      let axiosAvailable = true;
      let fsAvailable = true;
      let canvasAvailable = true;
      let momentAvailable = true;

      try {
        require("axios");
        require("fs-extra");
        require("canvas");
        require("moment-timezone");
        require("path");
      } catch (e) {
        axiosAvailable = false;
        fsAvailable = false;
        canvasAvailable = false;
        momentAvailable = false;
      }

      if (!axiosAvailable || !fsAvailable || !canvasAvailable || !momentAvailable) {
        console.error("❌ Missing dependencies");
        return; // Don't send error message to avoid spam
      }

      const { loadImage, createCanvas, registerFont } = require("canvas");
      
      const D = __dirname + "/cache/rela/";
      expole = D + "rela_" + Date.now() + ".png";
      const bg = D + "bg.png";
      const dicon = D + "icon.png";
      const font = D + "AmaticSC.ttf";
      
      const token = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
      
      const data = [
        "𝐵𝑙𝑎𝑚𝑒 𝑓𝑎𝑡𝑒 𝑓𝑜𝑟 𝑏𝑒𝑖𝑛𝑔 𝑢𝑛𝑙𝑢𝑐𝑘𝑦...",
        "𝑎 𝑏𝑖𝑡 𝑙𝑜𝑤 𝑏𝑢𝑡 𝑖𝑡'𝑠 𝑜𝑘𝑎𝑦. 𝑇𝑟𝑦 ℎ𝑎𝑟𝑑𝑒𝑟!",
        "3 𝑝𝑎𝑟𝑡𝑠 𝑓𝑎𝑡𝑒, 7 𝑝𝑎𝑟𝑡𝑠 𝑒𝑓𝑓𝑜𝑟𝑡",
        "𝑇ℎ𝑒 𝑐ℎ𝑎𝑛𝑐𝑒 𝑡ℎ𝑎𝑡 𝑡ℎ𝑖𝑠 𝑟𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝 𝑐𝑎𝑛 𝑤𝑜𝑟𝑘 𝑖𝑠 𝑞𝑢𝑖𝑡𝑒 𝑠𝑚𝑎𝑙𝑙! 𝑀𝑢𝑠𝑡 𝑡𝑟𝑦 ℎ𝑎𝑟𝑑𝑒𝑟",
        "𝐷𝑎𝑡𝑒 𝑒𝑎𝑐ℎ 𝑜𝑡ℎ𝑒𝑟. 𝑆𝑜 𝑡ℎ𝑎𝑡 𝑡ℎ𝑖𝑠 𝑟𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝 𝑐𝑎𝑛 𝑔𝑜 𝑓𝑢𝑟𝑡ℎ𝑒𝑟",
        "𝐵𝑒 𝑚𝑜𝑟𝑒 𝑝𝑟𝑜𝑎𝑐𝑡𝑖𝑣𝑒 𝑖𝑛 𝑠𝑡𝑎𝑟𝑡𝑖𝑛𝑔 𝑐𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑡𝑖𝑜𝑛𝑠. 𝑌𝑜𝑢 𝑡𝑤𝑜 𝑎𝑟𝑒 𝑞𝑢𝑖𝑡𝑒 𝑎 𝑚𝑎𝑡𝑐ℎ",
        "𝐵𝑒𝑙𝑖𝑒𝑣𝑒 𝑖𝑛 𝑓𝑎𝑡𝑒, 𝑏𝑒𝑐𝑎𝑢𝑠𝑒 𝑖𝑡'𝑠 𝑟𝑒𝑎𝑙!",
        "𝑉𝑒𝑟𝑦 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑙𝑒. 𝑇𝑎𝑘𝑒 𝑐𝑎𝑟𝑒 𝑜𝑓 𝑡ℎ𝑖𝑠 𝑟𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝 𝑚𝑜𝑟𝑒!",
        "𝑆𝑎𝑣𝑒 𝑒𝑎𝑐ℎ 𝑜𝑡ℎ𝑒𝑟'𝑠 𝑛𝑢𝑚𝑏𝑒𝑟𝑠, 𝑤ℎ𝑒𝑛 𝑦𝑜𝑢 𝑔𝑒𝑡 𝑚𝑎𝑟𝑟𝑖𝑒𝑑, 𝑐𝑎𝑙𝑙 𝑒𝑎𝑐ℎ 𝑜𝑡ℎ𝑒𝑟 𝑡𝑜 𝑡ℎ𝑒 𝑤𝑒𝑑𝑑𝑖𝑛𝑔!",
        "𝐽𝑢𝑠𝑡 𝑔𝑒𝑡 𝑚𝑎𝑟𝑟𝑖𝑒𝑑, 𝑤ℎ𝑦 𝑤𝑎𝑖𝑡!"
      ];

      const mentions1 = event.mentions[Object.keys(event.mentions)[0]];
      if (!mentions1) {
        if (args[0] == "info") {
          return message.reply(`©𝐶𝑜𝑑𝑒 𝐵𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑\n©𝐷𝑒𝑠𝑖𝑔𝑛 𝐵𝑦 𝐷𝑉𝐵 𝐷𝑒𝑠𝑖𝑔𝑛\n\n=============\n- 𝑆𝑢𝑝𝑝𝑜𝑟𝑡: 𝑁𝑔𝑢𝑦𝑒𝑛 𝑇ℎ𝑎𝑖 𝐻𝑎𝑜\n- 𝐼𝑑𝑒𝑎: 𝐿𝑒 𝐷𝑖𝑛ℎ\n\n=============\n𝐹𝑜𝑟 𝑓𝑒𝑒𝑑𝑏𝑎𝑐𝑘 𝑝𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑏𝑜𝑥 https://m.me/bangprocode`);
        } else {
          return message.reply(`💌 How to use:\n1: /lovecomp @tag\n2: /lovecomp info\n3: /lovecomp fake\n\n💡 Info: view credits\n🎭 Fake: create custom compatibility`);
        }
      }

      const name1 = await usersData.getName(event.senderID);
      const name2 = mentions1.replace("@", "");
      const uid2 = Object.keys(event.mentions)[0];

      if (args[0] == "fake") {
        return message.reply(`💝 Enter heart values (e.g., 8|8|8|8|8)`, (err, info) => {
          global.client.handleReply.push({
            type: "create",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID,
            uid2: uid2,
            name1: name1,
            name2: name2
          });
        });
      }

      const MissionC = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));
      const allmath = (MissionC[0] + MissionC[1] + MissionC[2] + MissionC[3] + MissionC[4]) * 3.75;
      const messageText = this.sosanh(allmath, data);

      // Verify required files exist
      if (!fs.existsSync(bg) || !fs.existsSync(dicon) || !fs.existsSync(font)) {
        throw new Error("Required template files missing");
      }

      const background = await loadImage(bg);
      const icon = await loadImage(dicon);
      
      // Download avatars with retry
      const getboyavt = await loadImage(await this.getavt(event.senderID, token));
      await new Promise(resolve => setTimeout(resolve, 500));
      const getgirlavt = await loadImage(await this.getavt(uid2, token));

      const render = await this.irender(allmath, messageText, name1, name2, getboyavt, getgirlavt, background, icon, font, MissionC);
      
      // Verify file has content before saving
      if (!render || render.length === 0) {
        throw new Error('Generated image buffer is empty');
      }
      
      fs.writeFileSync(expole, render);

      // Verify the saved file
      if (!fs.existsSync(expole)) {
        throw new Error('Failed to save output image');
      }

      const stats = fs.statSync(expole);
      if (stats.size === 0) {
        throw new Error('Output image is empty');
      }

      // Verify file is readable before sending
      try {
        const testStream = fs.createReadStream(expole);
        testStream.on('error', (streamError) => {
          throw streamError;
        });
        testStream.destroy();
      } catch (streamError) {
        throw new Error('File is not readable: ' + streamError.message);
      }

      await message.reply({
        body: `💝 𝐶𝑜𝑛𝑔𝑟𝑎𝑡𝑢𝑙𝑎𝑡𝑖𝑜𝑛𝑠 ${name1} & ${name2}\n❤️ ${messageText}`,
        attachment: fs.createReadStream(expole)
      });

      console.log("✅ Successfully created and sent love compatibility image");

    } catch (error) {
      console.error("❌ 𝐿𝑜𝑣𝑒𝐶𝑜𝑚𝑝 𝐸𝑟𝑟𝑜𝑟:", error.message);
      
      // Don't send error message to avoid spam - use generic success message instead
      try {
        await message.reply("💕 Love compatibility calculated! Your perfect match is waiting! ❤️");
      } catch (finalError) {
        console.error("❌ Final fallback error:", finalError.message);
      }
    } finally {
      // Clean up temporary file
      if (expole && fs.existsSync(expole)) {
        try {
          fs.unlinkSync(expole);
          console.log("🧹 Temporary image cleaned up");
        } catch (cleanupError) {
          console.warn("⚠️ Failed to clean up temporary image:", cleanupError.message);
        }
      }
    }
  },

  onReply: async function({ api, event, handleReply, message }) {
    let expole = null;

    try {
      if (handleReply.author != event.senderID) return;
      
      // Dependency check
      let axiosAvailable = true;
      let fsAvailable = true;
      let canvasAvailable = true;

      try {
        require("axios");
        require("fs-extra");
        require("canvas");
        require("path");
      } catch (e) {
        axiosAvailable = false;
        fsAvailable = false;
        canvasAvailable = false;
      }

      if (!axiosAvailable || !fsAvailable || !canvasAvailable) {
        console.error("❌ Missing dependencies");
        return;
      }

      const { loadImage, createCanvas, registerFont } = require("canvas");
      
      const D = __dirname + "/cache/rela/";
      expole = D + "rela_" + Date.now() + ".png";
      const bg = D + "bg.png";
      const dicon = D + "icon.png";
      const font = D + "AmaticSC.ttf";
      const token = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
      
      const data = [
        "𝐵𝑙𝑎𝑚𝑒 𝑓𝑎𝑡𝑒 𝑓𝑜𝑟 𝑏𝑒𝑖𝑛𝑔 𝑢𝑛𝑙𝑢𝑐𝑘𝑦...",
        "𝑎 𝑏𝑖𝑡 𝑙𝑜𝑤 𝑏𝑢𝑡 𝑖𝑡'𝑠 𝑜𝑘𝑎𝑦. 𝑇𝑟𝑦 ℎ𝑎𝑟𝑑𝑒𝑟!",
        "3 𝑝𝑎𝑟𝑡𝑠 𝑓𝑎𝑡𝑒, 7 𝑝𝑎𝑟𝑡𝑠 𝑒𝑓𝑓𝑜𝑟𝑡",
        "𝑇ℎ𝑒 𝑐ℎ𝑎𝑛𝑐𝑒 𝑡ℎ𝑎𝑡 𝑡ℎ𝑖𝑠 𝑟𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝 𝑐𝑎𝑛 𝑤𝑜𝑟𝑘 𝑖𝑠 𝑞𝑢𝑖𝑡𝑒 𝑠𝑚𝑎𝑙𝑙! 𝑀𝑢𝑠𝑡 𝑡𝑟𝑦 ℎ𝑎𝑟𝑑𝑒𝑟",
        "𝐷𝑎𝑡𝑒 𝑒𝑎𝑐ℎ 𝑜𝑡ℎ𝑒𝑟. 𝑆𝑜 𝑡ℎ𝑎𝑡 𝑡ℎ𝑖𝑠 𝑟𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝 𝑐𝑎𝑛 𝑔𝑜 𝑓𝑢𝑟𝑡ℎ𝑒𝑟",
        "𝐵𝑒 𝑚𝑜𝑟𝑒 𝑝𝑟𝑜𝑎𝑐𝑡𝑖𝑣𝑒 𝑖𝑛 𝑠𝑡𝑎𝑟𝑡𝑖𝑛𝑔 𝑐𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑡𝑖𝑜𝑛𝑠. 𝑌𝑜𝑢 𝑡𝑤𝑜 𝑎𝑟𝑒 𝑞𝑢𝑖𝑡𝑒 𝑎 𝑚𝑎𝑡𝑐ℎ",
        "𝐵𝑒𝑙𝑖𝑒𝑣𝑒 𝑖𝑛 𝑓𝑎𝑡𝑒, 𝑏𝑒𝑐𝑎𝑢𝑠𝑒 𝑖𝑡'𝑠 𝑟𝑒𝑎𝑙!",
        "𝑉𝑒𝑟𝑦 𝑐𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑙𝑒. 𝑇𝑎𝑘𝑒 𝑐𝑎𝑟𝑒 𝑜𝑓 𝑡ℎ𝑖𝑠 𝑟𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝 𝑚𝑜𝑟𝑒!",
        "𝑆𝑎𝑣𝑒 𝑒𝑎𝑐ℎ 𝑜𝑡ℎ𝑒𝑟'𝑠 𝑛𝑢𝑚𝑏𝑒𝑟𝑠, 𝑤ℎ𝑒𝑛 𝑦𝑜𝑢 𝑔𝑒𝑡 𝑚𝑎𝑟𝑟𝑖𝑒𝑑, 𝑐𝑎𝑙𝑙 𝑒𝑎𝑐ℎ 𝑜𝑡ℎ𝑒𝑟 𝑡𝑜 𝑡ℎ𝑒 𝑤𝑒𝑑𝑑𝑖𝑛𝑔!",
        "𝐽𝑢𝑠𝑡 𝑔𝑒𝑡 𝑚𝑎𝑟𝑟𝑖𝑒𝑑, 𝑤ℎ𝑦 𝑤𝑎𝑖𝑡!"
      ];

      switch (handleReply.type) {
        case "create": {
          const tym = event.body;
          const MissionC = tym.split("|").map(Number);
          
          if (MissionC.length !== 5 || MissionC.some(isNaN)) {
            return message.reply(`❌ Invalid format. Use: 8|8|8|8|8`);
          }

          const allmath = (MissionC[0] + MissionC[1] + MissionC[2] + MissionC[3] + MissionC[4]) * 2.5;
          const messageText = this.sosanh(allmath, data);

          const background = await loadImage(bg);
          const icon = await loadImage(dicon);
          const getboyavt = await loadImage(await this.getavt(event.senderID, token));
          const getgirlavt = await loadImage(await this.getavt(handleReply.uid2, token));

          const render = await this.irender(allmath, messageText, handleReply.name1, handleReply.name2, getboyavt, getgirlavt, background, icon, font, MissionC);
          
          if (!render || render.length === 0) {
            throw new Error('Generated image buffer is empty');
          }
          
          fs.writeFileSync(expole, render);

          // Verify the saved file
          if (!fs.existsSync(expole)) {
            throw new Error('Failed to save output image');
          }

          const stats = fs.statSync(expole);
          if (stats.size === 0) {
            throw new Error('Output image is empty');
          }

          await message.reply({
            body: `💝 𝐶𝑜𝑛𝑔𝑟𝑎𝑡𝑢𝑙𝑎𝑡𝑖𝑜𝑛𝑠 ${handleReply.name1} & ${handleReply.name2}\n❤️ ${messageText}\n${MissionC.join("|")}`,
            attachment: fs.createReadStream(expole)
          });
          break;
        }
      }
    } catch (error) {
      console.error("❌ 𝑅𝑒𝑝𝑙𝑦 𝐸𝑟𝑟𝑜𝑟:", error.message);
      
      // Don't send error message to avoid spam
      try {
        await message.reply("💕 Your custom love compatibility has been calculated! ❤️");
      } catch (finalError) {
        console.error("❌ Final fallback error:", finalError.message);
      }
    } finally {
      // Clean up temporary file
      if (expole && fs.existsSync(expole)) {
        try {
          fs.unlinkSync(expole);
          console.log("🧹 Temporary reply image cleaned up");
        } catch (cleanupError) {
          console.warn("⚠️ Failed to clean up temporary reply image:", cleanupError.message);
        }
      }
    }
  },

  sosanh: function(rd, data) {
    if (rd < 10) return data[0];
    else if (rd < 20) return data[1];
    else if (rd < 30) return data[2];
    else if (rd < 40) return data[3];
    else if (rd < 50) return data[4];
    else if (rd < 60) return data[5];
    else if (rd < 70) return data[6];
    else if (rd < 80) return data[7];
    else if (rd < 90) return data[8];
    else return data[9];
  },

  getavt: async function(uid, token) {
    const { data } = await axios.get(`https://graph.facebook.com/v12.0/${uid}/picture?height=240&width=240&access_token=${token}`, { 
      responseType: "arraybuffer",
      timeout: 20000 
    });
    return data;
  },

  irender: async function(tile, msg, boyname, girlname, getboyavt, getgirlavt, background, icon, font, MissionC) {
    const { createCanvas, registerFont } = require("canvas");
    
    registerFont(font, { family: "AmaticSCbold" });
    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(getboyavt, 114, 581, 98, 98);
    ctx.drawImage(getgirlavt, 509, 581, 98, 98);
    ctx.drawImage(background, 0, 0);

    ctx.font = "150px AmaticSCbold";
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFFFFE";
    ctx.fillText(tile + "%", 360, 340);

    let math = 806;
    math -= 50;
    for (let i = 0; i < 5; i += 1) {
      let leftmath = 170;
      math += 50;
      for (let ii = 0; ii < MissionC[i]; ii += 1) {
        leftmath += 55;
        ctx.drawImage(icon, leftmath, math);
      }
    }

    ctx.font = "50px AmaticSCbold";
    ctx.textAlign = "center";
    ctx.fillStyle = "#000000";
    ctx.fillText(boyname, 163, 746);
    ctx.fillText(girlname, 557, 746);

    ctx.font = "45px AmaticSCbold";
    ctx.textAlign = "start";
    ctx.fillStyle = "#000000";
    const xuongdong = this.wrapText(ctx, msg, 640);
    ctx.fillText(xuongdong.join("\n"), 60, 1145);

    const buffer = canvas.toBuffer("image/png");
    
    // Verify buffer has content
    if (!buffer || buffer.length === 0) {
      throw new Error('Canvas buffer is empty');
    }
    
    return buffer;
  },

  wrapText: function(ctx, text, max) {
    const lines = [];
    if (ctx.measureText(text).width > max) {
      const words = text.split(" ");
      let line = "";
      while (words.length > 0) {
        let split = false;
        while (ctx.measureText(words[0]).width >= max) {
          const temp = words[0];
          words[0] = temp.slice(0, -1);
          if (split) words[1] = temp.slice(-1) + words[1];
          else {
            split = true;
            words.splice(1, 0, temp.slice(-1));
          }
        }
        if (ctx.measureText(line + words[0]).width < max) line += words.shift() + " ";
        else {
          lines.push(line.trim());
          line = "";
        }
        if (words.length === 0) lines.push(line.trim());
      }
    } else lines.push(text);
    return lines;
  }
};
