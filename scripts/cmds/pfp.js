const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");
const axios = require("axios");
const moment = require("moment-timezone");

// Register custom fonts if available
try {
  registerFont(path.join(__dirname, 'fonts', 'ArialBlack.ttf'), { family: 'Arial Black' });
  registerFont(path.join(__dirname, 'fonts', 'Montserrat-Bold.ttf'), { family: 'Montserrat', weight: 'bold' });
} catch (e) {
  console.log("ℹ️ Custom fonts not found, using system fonts");
}

// Add roundRect method to canvas context
function addRoundRectMethod(ctx) {
  if (!ctx.roundRect) {
    ctx.roundRect = function(x, y, width, height, radius) {
      if (width < 2 * radius) radius = width / 2;
      if (height < 2 * radius) radius = height / 2;
      
      this.beginPath();
      this.moveTo(x + radius, y);
      this.arcTo(x + width, y, x + width, y + height, radius);
      this.arcTo(x + width, y + height, x, y + height, radius);
      this.arcTo(x, y + height, x, y, radius);
      this.arcTo(x, y, x + width, y, radius);
      this.closePath();
      return this;
    };
  }
}

module.exports = {
  config: {
    name: "pfp",
    aliases: [],
    version: "3.5",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "✨ 𝑈𝑙𝑡𝑟𝑎-𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑐𝑎𝑟𝑑 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑜𝑟 𝑤𝑖𝑡ℎ 𝑎𝑛𝑖𝑚𝑎𝑡𝑒𝑑 𝑒𝑓𝑓𝑒𝑐𝑡𝑠"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑠 𝑎 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑐𝑎𝑟𝑑 𝑤𝑖𝑡ℎ 𝑔𝑟𝑎𝑑𝑖𝑒𝑛𝑡 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑𝑠, 𝑔𝑙𝑜𝑤 𝑒𝑓𝑓𝑒𝑐𝑡𝑠, 𝑎𝑛𝑑 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
    },
    guide: {
      en: "{p}pfp [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛|𝑈𝐼𝐷]"
    },
    countDown: 5,
    dependencies: {
      "canvas": "",
      "fs-extra": "",
      "axios": "",
      "moment-timezone": ""
    }
  },

  onLoad: async function() {
    const TMP_DIR = path.join(__dirname, "cache");
    await fs.ensureDir(TMP_DIR);
    console.log("✅ Profile card generator loaded successfully!");
  },

  onStart: async function({ api, event, args, message, usersData }) {
    try {
      const { senderID, threadID, mentions, messageReply } = event;

      let targetID = senderID;
      if (mentions && Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
      } else if (messageReply && messageReply.senderID) {
        targetID = messageReply.senderID;
      } else if (args && args.length > 0 && args[0].match(/\d+/)) {
        targetID = args[0].replace(/[^0-9]/g, "");
      }

      const processingMsg = await message.reply("🎨 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑐𝑎𝑟𝑑...");

      // Get user info
      const userInfo = await api.getUserInfo(targetID);
      if (!userInfo || !userInfo[targetID]) {
        await api.unsendMessage(processingMsg.messageID);
        return message.reply("❌ 𝑈𝑠𝑒𝑟 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
      }

      const user = userInfo[targetID];
      
      // Download avatar with better error handling
      const avatarURL = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const avatarPath = path.join(__dirname, "cache", `avatar_${targetID}_${Date.now()}.jpg`);
      
      try {
        const resp = await axios.get(avatarURL, { 
          responseType: "arraybuffer",
          timeout: 10000 
        });
        await fs.writeFile(avatarPath, Buffer.from(resp.data));
      } catch (error) {
        await api.unsendMessage(processingMsg.messageID);
        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑣𝑎𝑡𝑎𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
      }

      // Get additional user data
      let userData = {};
      try {
        if (usersData && typeof usersData.getData === 'function') {
          userData = await usersData.getData(targetID);
        }
      } catch (e) {
        console.log("ℹ️ Could not fetch additional user data");
      }

      // Format user information
      const formatData = {
        joinDate: userData?.createdAt ? moment(userData.createdAt).format("DD MMM YYYY") : "𝑈𝑛𝑘𝑛𝑜𝑤𝑛",
        lastActive: userData?.lastUpdated ? moment(userData.lastUpdated).fromNow() : "𝑅𝑒𝑐𝑒𝑛𝑡𝑙𝑦",
        gender: userData?.gender === 1 ? "👨 𝑀𝑎𝑙𝑒" : userData?.gender === 2 ? "👩 𝐹𝑒𝑚𝑎𝑙𝑒" : "⚧️ 𝑈𝑛𝑘𝑛𝑜𝑤𝑛",
        followers: user?.follow || userData?.followers || "0",
        relationship: user?.relationship_status || "𝑆𝑖𝑛𝑔𝑙𝑒"
      };

      // Create enhanced canvas
      const canvas = createCanvas(800, 450);
      const ctx = canvas.getContext("2d");

      // Add roundRect method to this context
      addRoundRectMethod(ctx);

      // Enhanced gradient background
      const gradients = [
        ["#667eea", "#764ba2"],
        ["#f093fb", "#f5576c"],
        ["#4facfe", "#00f2fe"],
        ["#43e97b", "#38f9d7"],
        ["#fa709a", "#fee140"]
      ];
      
      const selectedGradient = gradients[Math.floor(Math.random() * gradients.length)];
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, selectedGradient[0]);
      gradient.addColorStop(1, selectedGradient[1]);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add subtle pattern overlay
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      for (let i = 0; i < 100; i++) {
        const size = Math.random() * 15 + 5;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw avatar with enhanced effects
      try {
        const avatarImg = await loadImage(avatarPath);
        const avatarSize = 180;
        const avatarX = 60;
        const avatarY = 60;

        // Avatar glow effect
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2 + 15, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fill();
        ctx.shadowBlur = 0;

        // Circular avatar with border
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        
        // Add subtle shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();

        // Avatar border
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
        ctx.stroke();

      } catch (error) {
        console.error("Avatar loading error:", error);
      }

      // User information panel
      const panelX = 280;
      const panelY = 50;
      const panelWidth = 500;
      const panelHeight = 350;

      // Panel background with blur effect
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 20);
      ctx.fill();

      // Panel border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 20);
      ctx.stroke();

      // User name with glow effect
      ctx.font = "bold 38px 'Arial Black', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#ff6b6b";
      ctx.shadowBlur = 20;
      ctx.fillText(user.name, panelX + 20, panelY + 50);
      ctx.shadowBlur = 0;

      // User info items
      const infoItems = [
        { icon: "🆔", text: `UID: ${targetID}` },
        { icon: "👤", text: `Gender: ${formatData.gender}` },
        { icon: "❤️", text: `Relationship: ${formatData.relationship}` },
        { icon: "👥", text: `Followers: ${formatData.followers}` },
        { icon: "📅", text: `Joined: ${formatData.joinDate}` },
        { icon: "🕒", text: `Last Active: ${formatData.lastActive}` }
      ];

      ctx.font = "22px 'Montserrat', sans-serif";
      ctx.fillStyle = "#e0e0e0";
      
      infoItems.forEach((item, index) => {
        const yPos = panelY + 90 + (index * 40);
        ctx.fillText(`${item.icon} ${item.text}`, panelX + 30, yPos);
      });

      // Add decorative elements
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      for (let i = 0; i < 8; i++) {
        const size = Math.random() * 8 + 4;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Footer text
      ctx.font = "16px 'Montserrat', sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillText("✨ Created by 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 ✨", canvas.width - 300, canvas.height - 20);

      // Save and send the image
      const outputPath = path.join(__dirname, "cache", `profile_card_${targetID}_${Date.now()}.png`);
      const buffer = canvas.toBuffer();
      await fs.writeFile(outputPath, buffer);

      await message.reply({
        body: `🎉 𝑷𝒓𝒐𝒇𝒊𝒍𝒆 𝑪𝒂𝒓𝒅 𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒆𝒅!\n━━━━━━━━━━━━━━━━━━\n✨ 𝑵𝒂𝒎𝒆: ${user.name}\n🆔 𝑼𝑰𝑫: ${targetID}\n📊 𝑭𝒐𝒍𝒍𝒐𝒘𝒆𝒓𝒔: ${formatData.followers}\n━━━━━━━━━━━━━━━━━━\n💫 𝑬𝒏𝒋𝒐𝒚 𝒚𝒐𝒖𝒓 𝒔𝒕𝒚𝒍𝒊𝒔𝒉 𝒑𝒓𝒐𝒇𝒊𝒍𝒆 𝒄𝒂𝒓𝒅!`,
        attachment: fs.createReadStream(outputPath)
      });

      // Clean up
      await api.unsendMessage(processingMsg.messageID);
      if (fs.existsSync(avatarPath)) await fs.unlink(avatarPath);
      if (fs.existsSync(outputPath)) await fs.unlink(outputPath);

    } catch (error) {
      console.error("Profile card error:", error);
      try {
        if (processingMsg && processingMsg.messageID) {
          await api.unsendMessage(processingMsg.messageID);
        }
      } catch {}
      message.reply("❌ 𝑺𝒐𝒓𝒓𝒚, 𝒕𝒉𝒆𝒓𝒆 𝒘𝒂𝒔 𝒂𝒏 𝒆𝒓𝒓𝒐𝒓 𝒄𝒓𝒆𝒂𝒕𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒑𝒓𝒐𝒇𝒊𝒍𝒆 𝒄𝒂𝒓𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
    }
  }
};
