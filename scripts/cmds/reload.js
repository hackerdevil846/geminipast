module.exports = {
  config: {
    name: "reload",
    aliases: [],
    version: "1.0.0",
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    countDown: 5,
    role: 1,
    category: "system",
    shortDescription: {
      en: "🔄 𝖡𝗈𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗋𝖾𝗅𝗈𝖺𝖽 𝗐𝗂𝗍𝗁 𝗌𝗍𝗒𝗅𝗂𝗌𝗁 𝗆𝖾𝗌𝗌𝖺𝗀𝖾"
    },
    longDescription: {
      en: "🔄 𝖡𝗈𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗋𝖾𝗅𝗈𝖺𝖽 𝗐𝗂𝗍𝗁 𝗌𝗍𝗒𝗅𝗂𝗌𝗁 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖺𝗇𝖽 𝗍𝗂𝗆𝖾𝗋"
    },
    guide: {
      en: "{p}reload [𝗍𝗂𝗆𝖾]"
    },
    dependencies: {
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      // Dependency check
      let fsAvailable = true;
      try {
        require("fs-extra");
      } catch (e) {
        fsAvailable = false;
      }

      if (!fsAvailable) {
        return api.sendMessage("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.", event.threadID, event.messageID);
      }

      const { threadID, messageID, senderID } = event;
      const GOD = global.config.GOD || [];

      // Permission check
      if (!GOD.includes(senderID)) {
        return api.sendMessage("⚠️ 𝖠𝗉𝗇𝖺𝗋 𝖾𝗂 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖻𝖺𝖻𝗈𝗁𝖺𝗋 𝗌𝗈𝗆𝗉𝗈𝗍𝗍𝗈 𝗇𝖾𝗂!", threadID, messageID);
      }

      // Time calculation with validation
      let time = args.join(" ").trim();
      let rstime = 69; // Default time

      if (time && !isNaN(time)) {
        const parsedTime = parseInt(time);
        if (parsedTime > 0 && parsedTime <= 300) { // Max 5 minutes
          rstime = parsedTime;
        } else if (parsedTime > 300) {
          return api.sendMessage("❌ 𝖬𝖺𝗑𝗂𝗆𝗎𝗆 𝗍𝗂𝗆𝖾 𝗅𝗂𝗆𝗂𝗍: 300 𝗌𝖾𝖼𝗈𝗇𝖽𝗌 (5 𝗆𝗂𝗇𝗎𝗍𝖾𝗌)", threadID, messageID);
        }
      }

      // Send stylish reload message
      const reloadMessage = 
        "╭───────『 🔄 𝖡𝖮𝖳 𝖱𝖤𝖫𝖮𝖠𝖣 』───────╮\n" +
        "│\n" +
        `│ 🤖 » 𝖡𝗈𝗍 𝗋𝖾𝗅𝗈𝖺𝖽 𝗌𝖼𝗁𝖾𝖽𝗎𝗅𝖾𝖽\n` +
        `│ ⏰ » 𝖳𝗂𝗆𝖾: ${rstime} 𝗌𝖾𝖼𝗈𝗇𝖽𝗌\n` +
        `│ 📍 » 𝖲𝗍𝖺𝗍𝗎𝗌: 𝖯𝗎𝗇𝖺𝗋𝖺𝗋𝗆𝖻𝗁𝗈 𝗁𝗈𝖻𝖾 ${rstime} 𝗌𝖾𝖼𝗈𝗇𝖽 𝗉𝗈𝗋\n` +
        "│\n" +
        "│ ⚡ » 𝖲𝗍𝖺𝗒 𝗍𝗎𝗇𝖾𝖽!\n" +
        "│\n" +
        "╰─────────────────────────────╯";

      await api.sendMessage(reloadMessage, threadID, messageID);

      // Set timeout for restart with error handling
      const restartTimeout = setTimeout(() => {
        try {
          const successMessage = 
            "╭───────『 ✅ 𝖱𝖤𝖫𝖮𝖠𝖣𝖨𝖭𝖦 』───────╮\n" +
            "│\n" +
            "│ 🤖 » 𝖡𝗈𝗍 𝗉𝗎𝗇𝖺𝗋𝖺𝗋𝗆𝖻𝗁𝗈 𝗁𝗈𝖼𝖼𝗁𝖾...\n" +
            "│ ⚡ » 𝖯𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍 𝖿𝗈𝗋 𝖻𝗈𝗍 𝗍𝗈 𝗋𝖾𝗌𝗍𝖺𝗋𝗍\n" +
            "│\n" +
            "╰──────────────────────────╯";
          
          api.sendMessage(successMessage, threadID, (error) => {
            if (!error) {
              process.exit(1);
            }
          });
        } catch (restartError) {
          console.error("💥 𝖱𝖾𝗌𝗍𝖺𝗋𝗍 𝖾𝗋𝗋𝗈𝗋:", restartError);
        }
      }, rstime * 1000);

      // Store timeout reference for potential cancellation
      global.reloadTimeout = restartTimeout;

      // Add safety check to prevent multiple reloads
      if (global.reloadInProgress) {
        clearTimeout(global.reloadTimeout);
        api.sendMessage("🔄 𝖯𝗋𝖾𝗏𝗂𝗈𝗎𝗌 𝗋𝖾𝗅𝗈𝖺𝖽 𝖼𝖺𝗇𝖼𝖾𝗅𝖾𝖽. 𝖭𝖾𝗐 𝗋𝖾𝗅𝗈𝖺𝖽 𝗌𝖼𝗁𝖾𝖽𝗎𝗅𝖾𝖽.", threadID);
      }
      
      global.reloadInProgress = true;

    } catch (error) {
      console.error("💥 𝖱𝖾𝗅𝗈𝖺𝖽 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
      
      let errorMessage = "❌ 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗋𝖾𝗅𝗈𝖺𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.";
      
      if (error.message.includes('permission')) {
        errorMessage = "❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝖻𝗈𝗍 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗍𝗂𝗈𝗇.";
      } else if (error.message.includes('timeout')) {
        errorMessage = "❌ 𝖳𝗂𝗆𝖾𝗈𝗎𝗍 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
      }
      
      api.sendMessage(errorMessage, event.threadID, event.messageID);
    }
  }
};
