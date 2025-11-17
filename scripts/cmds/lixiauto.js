const fs = require("fs-extra");

module.exports = {
  config: {
    name: "lixiauto",
    aliases: ["luckycoin", "hongbao"],
    version: "1.0.1",
    author: "Asif Mahmud",
    countDown: 0,
    role: 0,
    category: "utility",
    shortDescription: {
      en: "Auto-response for lucky money greetings"
    },
    longDescription: {
      en: "Automatically responds to lucky money messages with audio"
    },
    guide: {
      en: "Just type lucky money related words and the bot will respond"
    },
    dependencies: {
      "fs-extra": ""
    }
  },

  onStart: async function() {
    // Empty onStart function as this is an auto-response command
  },

  onChat: async function({ event, message }) {
    try {
      // Check if message contains lucky money related keywords (case insensitive)
      const luckyKeywords = ["li xi", "lucky money", "hong bao", "red envelope", "lucky envelope"];
      const messageText = event.body ? event.body.toLowerCase() : "";
      
      const hasKeyword = luckyKeywords.some(keyword => 
        messageText.includes(keyword.toLowerCase())
      );

      if (hasKeyword) {
        const audioPath = __dirname + "/noprefix/lixicailol.mp3";
        
        // Check if file exists
        if (fs.existsSync(audioPath)) {
          await message.reply({
            body: "Happy New Year! 🎊",
            attachment: fs.createReadStream(audioPath)
          });
        } else {
          console.error("Audio file not found at:", audioPath);
          await message.reply("🎉 Wishing you prosperity and good fortune!");
        }
      }
    } catch (error) {
      console.error("Error in lixiauto command:", error);
    }
  }
};
