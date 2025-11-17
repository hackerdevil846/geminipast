const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "hugging",
    aliases: [],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🤗 𝑆𝑒𝑛𝑑 𝑣𝑖𝑟𝑡𝑢𝑎𝑙 ℎ𝑢𝑔 𝑡𝑜 𝑠𝑜𝑚𝑒𝑜𝑛𝑒"
    },
    longDescription: {
      en: "𝑆𝑒𝑛𝑑 𝑎 𝑣𝑖𝑟𝑡𝑢𝑎𝑙 ℎ𝑢𝑔 𝑡𝑜 𝑎 𝑓𝑟𝑖𝑒𝑛𝑑 𝑤𝑖𝑡ℎ 𝑎 𝑟𝑎𝑛𝑑𝑜𝑚 ℎ𝑢𝑔 𝑖𝑚𝑎𝑔𝑒"
    },
    guide: {
      en: "{p}hugging [@𝑡𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ message, event, args, usersData }) {
    try {
      // Check if someone is tagged
      if (!args[0] || !event.mentions || Object.keys(event.mentions).length === 0) {
        return message.reply("𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 ℎ𝑢𝑔 🤗");
      }

      // Get the mentioned user
      const mention = Object.keys(event.mentions)[0];
      const tag = event.mentions[mention].replace("@", "");
      
      // Get hug image from API
      const response = await axios.get('https://nekos.life/api/v2/img/hug');
      const imageUrl = response.data.url;
      
      // Get user names for personalized message
      const userName = await getUserName(usersData, mention);
      const senderName = await getUserName(usersData, event.senderID);
      
      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      // Download image
      const imagePath = path.join(cacheDir, `hug_${event.senderID}_${Date.now()}.jpg`);
      const imageResponse = await axios.get(imageUrl, { 
        responseType: 'arraybuffer' 
      });
      
      await fs.writeFile(imagePath, imageResponse.data);
      
      // Send message with attachment
      await message.reply({
        body: `${userName}, ${senderName} 𝑠𝑒𝑛𝑡 𝑦𝑜𝑢 𝑎 𝑤𝑎𝑟𝑚 ℎ𝑢𝑔! ❤️`,
        mentions: [
          {
            tag: userName,
            id: mention
          },
          {
            tag: senderName,
            id: event.senderID
          }
        ],
        attachment: fs.createReadStream(imagePath)
      });
      
      // Delete the image after sending
      await fs.unlink(imagePath);
      
    } catch (error) {
      console.error("𝐻𝑢𝑔𝑔𝑖𝑛𝑔 𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply("❌ 𝑆𝑜𝑟𝑟𝑦, 𝐼 𝑐𝑜𝑢𝑙𝑑𝑛'𝑡 𝑠𝑒𝑛𝑑 𝑎 ℎ𝑢𝑔 𝑟𝑖𝑔ℎ𝑡 𝑛𝑜𝑤. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};

// Helper function to get user name
async function getUserName(usersData, userID) {
  try {
    const userData = await usersData.get(userID);
    return userData.name || "𝑓𝑟𝑖𝑒𝑛𝑑";
  } catch {
    return "𝑓𝑟𝑖𝑒𝑛𝑑";
  }
}
