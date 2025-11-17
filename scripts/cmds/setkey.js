const fs = require("fs-extra");

module.exports = {
  config: {
    name: "setkey",
    aliases: ["apikey", "youtubeapi"],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "system",
    shortDescription: {
      en: "🔑 Edit YouTube API v3 key in configuration"
    },
    longDescription: {
      en: "🔑 Edit YouTube API v3 key in bot configuration file"
    },
    guide: {
      en: "{p}setkey [your-YouTube-API-key]"
    },
    dependencies: {
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      // Check dependencies
      try {
        if (!fs || !fs.writeFileSync) {
          throw new Error("Missing required dependencies");
        }
      } catch (err) {
        return api.sendMessage("❌ | Required dependencies are missing. Please install fs-extra.", event.threadID, event.messageID);
      }

      const { exec } = require("child_process");
      const configPath = global.client.dirConfig || `${__dirname}/../../config.json`;

      // Check if key is provided
      if (!args[0]) {
        return api.sendMessage("❌ Please provide a valid YouTube API v3 key!", event.threadID, event.messageID);
      }

      // Validate key format
      if (!/^[A-Za-z0-9_-]{39}$/.test(args[0])) {
        return api.sendMessage("⚠️ Invalid key format! YouTube API keys should be 39 characters long", event.threadID, event.messageID);
      }

      try {
        // Load existing config
        const config = require(configPath);

        // Update YouTube API key
        config.video = config.video || {};
        config.video.YOUTUBE_API = args[0];

        // Save config
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");

        // Notify and attempt restart
        api.sendMessage("🔄 Successfully updated YouTube API key!\n\nRebooting system to apply changes...", event.threadID, async (err) => {
          if (err) return;
          
          try {
            exec("pm2 restart 0", (error) => {
              if (error) {
                console.error("❌ Restart Error:", error);
                return api.sendMessage("✅ API key updated!\n⚠️ Please manually restart the bot to apply changes", event.threadID);
              }
            });
          } catch (err) {
            console.error("❌ Restart Exception:", err);
            api.sendMessage("✅ API key updated!\n⚠️ Please manually restart the bot to apply changes", event.threadID);
          }
        });

      } catch (error) {
        console.error("❌ Config File Error:", error);
        return api.sendMessage("❌ An error occurred while updating the API key. Check config file permissions.", event.threadID, event.messageID);
      }

    } catch (error) {
      console.error("❌ SetKey Command Error:", error);
      return api.sendMessage("❌ An error occurred while processing your request", event.threadID, event.messageID);
    }
  }
};
