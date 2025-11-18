const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "wednesday",
    aliases: ["wed", "wedvid", "wenesday", "wednes"],
    version: "1.0.3",
    author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🧛🏻‍♀️ 𝐖𝐞𝐝𝐧𝐞𝐬𝐝𝐚𝐲 𝐯𝐢𝐝𝐞𝐨 𝐫𝐞𝐬𝐩𝐨𝐧𝐬𝐞"
    },
    longDescription: {
      en: "Automatically responds with Wednesday video when triggered"
    },
    guide: {
      en: "Just type 'wednesday' in chat"
    },
    countDown: 5
  },

  onChat: async function({ api, event, message }) {
    if (!api || !event || !message) return;

    try {
      if (!event.body || typeof event.body !== "string") return;

      const messageText = event.body.toLowerCase().trim();

      const triggers = [
        "wednesday", "wed", "wednesday video", "wednesday addams",
        "wenesday", "wednes", "wensday", "wednsday", "wedesday",
        "wednesday?", "wed?", "wed video", "wed addams"
      ];

      const isTriggered = triggers.some(trigger => messageText.includes(trigger));
      if (!isTriggered) return;

      console.log("🔍 Wednesday trigger detected");

      // Correct path to the video
      const videoPath = path.join(process.cwd(), "scripts/cmds/noprefix/wednesday.mp4");

      if (!fs.existsSync(videoPath)) {
        console.error("❌ Video file not found:", videoPath);
        await message.reply("🧛🏻‍♀️ Wednesday video file not found. Please contact admin.");
        return;
      }

      const stats = fs.statSync(videoPath);
      if (!stats.isFile() || stats.size < 1024 || stats.size > 100 * 1024 * 1024) {
        console.error("❌ Invalid video file size:", stats.size);
        await message.reply("🧛🏻‍♀️ Wednesday video file is corrupted. Please contact admin.");
        return;
      }

      const msg = {
        body: "🧛🏻‍♀️ Wednesday",
        attachment: fs.createReadStream(videoPath)
      };

      // Send message with 30s timeout
      await Promise.race([
        message.reply(msg),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Message send timeout")), 30000))
      ]);

      console.log("✅ Wednesday video sent");

      if (event.messageID) {
        try {
          await api.setMessageReaction("😈", event.messageID, (err) => {
            if (err) console.warn("⚠️ Reaction error:", err.message);
          }, true);
        } catch (err) {
          console.warn("⚠️ Could not set reaction:", err.message);
        }
      }

    } catch (err) {
      console.error("❌ Wednesday command error:", err.message);
      try {
        await message.reply("🧛🏻‍♀️ Sorry, couldn't send the Wednesday video. Please try again later.");
      } catch (_) {}
    }
  },

  onStart: async function({ api, event, message }) {
    if (!api || !event || !message) return;
    try {
      await message.reply("🧛🏻‍♀️ Type 'wednesday' in chat to see the video!");
    } catch (err) {
      console.error("❌ Wednesday onStart error:", err.message);
    }
  },

  onAnyEvent: function({ event }) {
    if (!event || typeof event !== "object") {
      console.error("❌ Invalid event received");
      return false;
    }
    return true;
  }
};
