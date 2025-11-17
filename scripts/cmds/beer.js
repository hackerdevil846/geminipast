/*const fs = require("fs-extra");

module.exports = {
  config: {
    name: "beer",
    aliases: ["cheers", "alcohol", "daru"],
    version: "1.1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🍺 𝖡𝖾𝖾𝗋 𝗉𝗂𝗍𝖾 𝖾𝗋 𝗃𝗈𝗇𝗇𝗈 𝖻𝗁𝖺𝗅𝗈𝖻𝖺𝗌𝗁𝖺"
    },
    longDescription: {
      en: "𝖠𝗎𝗍𝗈-𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝗌 𝗍𝗈 𝖽𝗋𝗂𝗇𝗄-𝗋𝖾𝗅𝖺𝗍𝖾𝖽 𝗄𝖾𝗒𝗐𝗈𝗋𝖽𝗌"
    },
    guide: {
      en: "𝖩𝗎𝗌𝗍 𝗍𝗒𝗉𝖾 𝖽𝗋𝗂𝗇𝗄-𝗋𝖾𝗅𝖺𝗍𝖾𝖽 𝗐𝗈𝗋𝖽𝗌"
    },
    countDown: 3,
    dependencies: {
      "fs-extra": ""
    }
  },

  onStart: async function ({ message }) {
    try {
      // Dependency check
      let dependenciesAvailable = true;
      try {
        require("fs-extra");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
      }

      const videoPath = __dirname + '/noprefix/daru.mp4';
      let hasVideo = false;
      
      // Check if video file exists and is readable
      try {
        if (fs.existsSync(videoPath)) {
          fs.accessSync(videoPath, fs.constants.R_OK);
          hasVideo = true;
        }
      } catch (fileError) {
        console.warn("❌ 𝖵𝗂𝖽𝖾𝗈 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖺𝖼𝖼𝖾𝗌𝗌𝗂𝖻𝗅𝖾:", fileError.message);
        hasVideo = false;
      }

      const msg = {
        body: `🍻 𝖡𝖾𝖾𝗋 𝗄𝗁𝗂𝗍𝖾 𝖼𝖺𝗈? 𝖤𝗂 𝗇𝖾𝗈! 🥂\n` +
              `▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂\n` +
              `𝖳𝗒𝗉𝖾 𝖺𝗇𝗒 𝖽𝗋𝗂𝗇𝗄-𝗋𝖾𝗅𝖺𝗍𝖾𝖽 𝗐𝗈𝗋𝖽 𝗍𝗈 𝗌𝖾𝖾 𝗆𝖺𝗀𝗂𝖼!\n` +
              `▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂\n` +
              `💖 𝖯𝗈𝗐𝖾𝗋𝖾𝖽 𝖻𝗒 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽`
      };
      
      if (hasVideo) {
        msg.attachment = fs.createReadStream(videoPath);
      } else {
        msg.body += `\n\n📹 𝖵𝗂𝖽𝖾𝗈 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾, 𝖻𝗎𝗍 𝖾𝗇𝗃𝗈𝗒 𝗍𝗁𝖾 𝗆𝖾𝗌𝗌𝖺𝗀𝖾!`;
      }
      
      await message.reply(msg);
    } catch (error) {
      console.error("💥 𝖡𝖾𝖾𝗋 𝖲𝗍𝖺𝗋𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
      // Don't send error message to avoid spam
    }
  },

  onChat: async function ({ api, event, message }) {
    try {
      // Dependency check
      let dependenciesAvailable = true;
      try {
        require("fs-extra");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        return;
      }

      const { threadID, messageID, body } = event;
      
      // Validate input
      if (!body) return;

      const triggers = [
        "beer", "daru", "drink", "sharab", "party", "alcohol", 
        "whisky", "vodka", "rum", "🍻", "🍺", "🍷", "cheers",
        "bottoms up", "let's drink", "booze", "liquor"
      ];
      
      const messageText = body.toLowerCase().trim();
      const shouldTrigger = triggers.some(trigger => messageText.includes(trigger));
      
      if (!shouldTrigger) return;

      console.log(`🍺 𝖡𝖾𝖾𝗋 𝗍𝗋𝗂𝗀𝗀𝖾𝗋𝖾𝖽 𝖻𝗒: ${event.senderID}`);

      const videoPath = __dirname + '/noprefix/daru.mp4';
      let hasVideo = false;
      
      // Check if video file exists and is readable
      try {
        if (fs.existsSync(videoPath)) {
          fs.accessSync(videoPath, fs.constants.R_OK);
          hasVideo = true;
        }
      } catch (fileError) {
        console.warn("❌ 𝖵𝗂𝖽𝖾𝗈 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖺𝖼𝖼𝖾𝗌𝗌𝗂𝖻𝗅𝖾:", fileError.message);
        hasVideo = false;
      }

      const msg = {
        body: `🍻 𝖢𝗁𝗈𝗅𝗈 𝗆𝗂𝗅𝖺 𝖻𝖾𝖾𝗋 𝗄𝗁𝖺𝗂! 🥂\n` + 
              `▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂\n` +
              `🍷 𝖠𝗉𝗇𝗂 𝖺𝗀𝖺 𝗌𝗎𝗋𝗎 𝗄𝗈𝗋𝖾𝗇\n` +
              `🍾 𝖠𝗆𝗂 𝖺𝗌𝖼𝗁𝗂 𝗍𝗁𝗂𝗄 𝖾𝗄𝗁𝗈𝗇𝖾\n` +
              `▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂\n` +
              `💖 𝖯𝗈𝗐𝖾𝗋𝖾𝖽 𝖻𝗒 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽`
      };
      
      if (hasVideo) {
        msg.attachment = fs.createReadStream(videoPath);
      } else {
        msg.body += `\n\n📹 𝖵𝗂𝖽𝖾𝗈 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾, 𝖻𝗎𝗍 𝖾𝗇𝗃𝗈𝗒 𝗍𝗁𝖾 𝗆𝖾𝗌𝗌𝖺𝗀𝖾!`;
      }
      
      await message.reply(msg);
      
      // Add reaction with error handling
      try {
        await api.setMessageReaction("🍻", messageID, () => {}, true);
      } catch (reactionError) {
        console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError.message);
      }
    } catch (error) {
      console.error("💥 𝖡𝖾𝖾𝗋 𝖢𝗁𝖺𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
      // Don't send error message to avoid spam
    }
  }
};
*/
