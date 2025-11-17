const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "xid",
    aliases: [],
    version: "1.0.7",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "info",
    shortDescription: {
      en: "👤 𝐺𝑒𝑡 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑈𝐼𝐷 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑤𝑖𝑡ℎ 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒"
    },
    longDescription: {
      en: "𝑅𝑒𝑡𝑟𝑖𝑒𝑣𝑒 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑖𝑛𝑐𝑙𝑢𝑑𝑖𝑛𝑔 𝑈𝐼𝐷, 𝑛𝑎𝑚𝑒, 𝑔𝑒𝑛𝑑𝑒𝑟, 𝑎𝑛𝑑 𝑎𝑐𝑡𝑖𝑣𝑖𝑡𝑦 𝑑𝑎𝑡𝑎"
    },
    guide: {
      en: "{p}xid [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛 | 𝑟𝑒𝑝𝑙𝑦]"
    },
    countDown: 5,
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function({ api, event, args, usersData, message }) {
    try {
      const { threadID, messageID, senderID } = event;
      const startTime = Date.now();

      // Determine target user
      let uid, targetName;
      if (event.type === "message_reply") {
        uid = event.messageReply.senderID;
        targetName = await usersData.getName(uid).catch(() => "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟");
      } else if (event.mentions && Object.keys(event.mentions).length > 0) {
        uid = Object.keys(event.mentions)[0];
        targetName = event.mentions[uid];
      } else {
        uid = senderID;
        targetName = await usersData.getName(uid).catch(() => "𝑌𝑜𝑢");
      }

      // Get user information
      const [name, userData] = await Promise.all([
        usersData.getName(uid).catch(() => "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟"),
        usersData.get(uid).catch(() => ({}))
      ]);

      // Get avatar URL
      const avatarUrl = await usersData.getAvatarUrl(uid);
      if (!avatarUrl) throw new Error("𝐴𝑣𝑎𝑡𝑎𝑟 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");

      // Calculate account metrics
      const joinDate = userData.createdAt ?
        new Date(parseInt(userData.createdAt)).toLocaleDateString() : "𝑈𝑛𝑘𝑛𝑜𝑤𝑛";

      const lastSeen = userData.lastSeen ? parseInt(userData.lastSeen) : null;
      let daysActive = "𝑈𝑛𝑘𝑛𝑜𝑤𝑛";
      if (lastSeen) {
        const days = Math.floor((Date.now() - lastSeen) / 86400000);
        daysActive = days > 365 ?
          Math.floor(days / 365) + " 𝑦𝑒𝑎𝑟𝑠" :
          days + " 𝑑𝑎𝑦𝑠";
      }

      const speed = ((Date.now() - startTime) / 1000).toFixed(2);

      // Format the information
      const infoMessage = `╭─── 𝗨𝗦𝗘𝗥 𝗜𝗡𝗙𝗢 ────⭓
│ 𝗡𝗔𝗠𝗘: ${name}
│ 𝗨𝗜𝗗: ${uid}
│ 𝗚𝗘𝗡𝗗𝗘𝗥: ${userData.gender || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛"}
│ 𝗝𝗢𝗜𝗡𝗘𝗗: ${joinDate}
│ 𝗔𝗖𝗧𝗜𝗩𝗘: ${daysActive}
│ 𝗦𝗣𝗘𝗘𝗗: ${speed} 𝑠𝑒𝑐𝑜𝑛𝑑𝑠
╰───────────────────⭓`;

      // Create cache directory
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Download avatar
      const avatarPath = path.join(cacheDir, `avatar_${uid}_${Date.now()}.jpg`);
      const response = await axios.get(avatarUrl, {
        responseType: "arraybuffer",
        timeout: 10000
      });
      fs.writeFileSync(avatarPath, Buffer.from(response.data, "binary"));

      // Send response with avatar
      await message.reply({
        body: infoMessage,
        attachment: fs.createReadStream(avatarPath)
      });

      // Cleanup
      try {
        fs.unlinkSync(avatarPath);
      } catch (cleanError) {
        console.error("𝐴𝑣𝑎𝑡𝑎𝑟 𝑐𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", cleanError);
      }

    } catch (error) {
      console.error("𝑋𝐼𝐷 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
      let errorMessage = "❌ 𝐸𝑟𝑟𝑜𝑟 𝑟𝑒𝑡𝑟𝑖𝑒𝑣𝑖𝑛𝑔 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛";

      if (error.message.includes("not found")) {
        errorMessage = "🔍 𝑈𝑠𝑒𝑟 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑜𝑟 𝑑𝑎𝑡𝑎 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒";
      } else if (error.message.includes("timeout")) {
        errorMessage = "⏱️ 𝐴𝑣𝑎𝑡𝑎𝑟 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
      }

      await message.reply(errorMessage);
    }
  }
};
