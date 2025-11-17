const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "imprison",
    aliases: ["cell", "behindbars"],
    version: "1.3",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🚔 𝐽𝑎𝑖𝑙 𝑖𝑚𝑎𝑔𝑒 𝑒𝑓𝑓𝑒𝑐𝑡"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑗𝑎𝑖𝑙 𝑖𝑚𝑎𝑔𝑒 𝑒𝑓𝑓𝑒𝑐𝑡 𝑤𝑖𝑡ℎ 𝑢𝑠𝑒𝑟'𝑠 𝑎𝑣𝑎𝑡𝑎𝑟"
    },
    guide: {
      en: "{p}imprison @𝑡𝑎𝑔"
    },
    countDown: 5
  },

  onStart: async function({ event, message, usersData, args }) {
    try {
      const uid2 = Object.keys(event.mentions)[0];
      if (!uid2) {
        return message.reply("❌ 𝑌𝑜𝑢 𝑚𝑢𝑠𝑡 𝑡𝑎𝑔 𝑡ℎ𝑒 𝑝𝑒𝑟𝑠𝑜𝑛 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑖𝑚𝑝𝑟𝑖𝑠𝑜𝑛");
      }

      // Create tmp directory if it doesn't exist
      const tmpDir = path.join(__dirname, "tmp");
      await fs.ensureDir(tmpDir);

      const pathSave = path.join(tmpDir, `${uid2}_Imprison_${Date.now()}.png`);
      
      // Get user's avatar URL (using both methods for reliability)
      let avatarURL2;
      try {
        avatarURL2 = await usersData.getAvatarUrl(uid2);
      } catch (avatarError) {
        // Fallback to Facebook Graph API
        avatarURL2 = `https://graph.facebook.com/${uid2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      }

      // Generate jail image
      const img = await new DIG.Jail().getImage(avatarURL2);
      
      // Save image to file (no need for Buffer.from since img is already a Buffer)
      await fs.writeFile(pathSave, img);
      
      // Prepare message content
      const content = args.join(' ').replace(Object.keys(event.mentions)[0], "").replace(/@/g, "");
      const userName = event.mentions[uid2] || "User";
      
      await message.reply({
        body: `${(content || `🔒 ${userName} 𝑖𝑠 𝑛𝑜𝑤 𝑖𝑛 𝑗𝑎𝑖𝑙!`)} 🚔`,
        attachment: fs.createReadStream(pathSave)
      });
      
      // Clean up file after sending
      await fs.unlink(pathSave);
      
    } catch (error) {
      console.error("𝐼𝑚𝑝𝑟𝑖𝑠𝑜𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
      
      let errorMessage = "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑗𝑎𝑖𝑙 𝑖𝑚𝑎𝑔𝑒 𝑒𝑓𝑓𝑒𝑐𝑡";
      
      if (error.message.includes("getImage")) {
        errorMessage = "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑎𝑣𝑎𝑡𝑎𝑟 𝑖𝑚𝑎𝑔𝑒";
      } else if (error.message.includes("ENOENT")) {
        errorMessage = "❌ 𝑇𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑";
      } else if (error.message.includes("usersData")) {
        errorMessage = "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑢𝑠𝑒𝑟 𝑎𝑣𝑎𝑡𝑎𝑟";
      }
      
      await message.reply(errorMessage);
    }
  }
};
