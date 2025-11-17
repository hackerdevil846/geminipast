const { createCanvas } = require("canvas");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "tagall",
    aliases: [],
    version: "1.1.0",
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    countDown: 80,
    role: 0,
    category: "system",
    shortDescription: {
      en: "🌟 𝖲𝗈𝖻𝖺𝗂𝗄𝖾 𝗍𝖺𝗀 𝗄𝗈𝗋𝖺 𝗐𝗂𝗍𝗁 𝗌𝗍𝗒𝗅𝗂𝗌𝗁 𝖽𝖾𝗌𝗂𝗀𝗇"
    },
    longDescription: {
      en: "🌟 𝖲𝗈𝖻𝖺𝗂𝗄𝖾 𝗍𝖺𝗀 𝗄𝗈𝗋𝖺 𝗐𝗂𝗍𝗁 𝗌𝗍𝗒𝗅𝗂𝗌𝗁 𝖽𝖾𝗌𝗂𝗀𝗇 𝖺𝗇𝖽 𝖼𝗎𝗌𝗍𝗈𝗆 𝖼𝖺𝗇𝗏𝖺𝗌"
    },
    guide: {
      en: "{p}tagall [𝖳𝖾𝗑𝗍]"
    },
    dependencies: {
      "canvas": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // Dependency check
      let dependenciesAvailable = true;
      try {
        require("canvas");
        require("fs-extra");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        return api.sendMessage(
          "❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖼𝖺𝗇𝗏𝖺𝗌 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.",
          event.threadID,
          event.messageID
        );
      }

      const botID = api.getCurrentUserID();
      
      // Get AFK users safely
      let listAFK = [];
      try {
        if (global.moduleData && global.moduleData["afk"] && global.moduleData["afk"].afkList) {
          listAFK = Object.keys(global.moduleData["afk"].afkList);
        }
      } catch (afkError) {
        console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖺𝖼𝖼𝖾𝗌𝗌 𝖠𝖥𝖪 𝖽𝖺𝗍𝖺:", afkError);
      }

      // Filter participants safely
      let allUsers = [];
      try {
        if (event.participantIDs && Array.isArray(event.participantIDs)) {
          allUsers = event.participantIDs.filter(id => 
            id && 
            id !== botID && 
            id !== event.senderID &&
            !listAFK.includes(id)
          );
        }
      } catch (filterError) {
        console.error("𝖤𝗋𝗋𝗈𝗋 𝖿𝗂𝗅𝗍𝖾𝗋𝗂𝗇𝗀 𝗎𝗌𝖾𝗋𝗌:", filterError);
        return api.sendMessage(
          "❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉 𝗆𝖾𝗆𝖻𝖾𝗋𝗌.",
          event.threadID,
          event.messageID
        );
      }

      // Check if there are users to tag
      if (allUsers.length === 0) {
        return api.sendMessage(
          "❌ 𝖭𝗈 𝗎𝗌𝖾𝗋𝗌 𝖿𝗈𝗎𝗇𝖽 𝗍𝗈 𝗍𝖺𝗀.",
          event.threadID,
          event.messageID
        );
      }

      // Canvas setup with error handling
      let canvas, ctx, path;
      try {
        canvas = createCanvas(1200, 600);
        ctx = canvas.getContext('2d');
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 1200, 600);
        gradient.addColorStop(0, "#8A2BE2");
        gradient.addColorStop(1, "#1E90FF");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1200, 600);

        // Decorative elements
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 15;
        ctx.beginPath();
        ctx.arc(600, 300, 250, 0, Math.PI * 2);
        ctx.stroke();

        // Main text
        ctx.font = "bold 80px Arial";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText("💫 𝖯𝖨𝖭𝖦 𝖢𝖮𝖬𝖬𝖠𝖭𝖣 💫", 600, 180);

        // User count display
        ctx.font = "bold 60px Arial";
        ctx.fillText(`👥 𝖳𝖮𝖳𝖠𝖫 𝖴𝖲𝖤𝖱𝖲: ${allUsers.length}`, 600, 300);

        // Decorative emojis
        ctx.font = "bold 90px Arial";
        ctx.fillText("✨🌟⚡🎯", 600, 420);

        // Save image
        path = __dirname + `/cache/ping_${event.threadID}_${Date.now()}.png`;
        const buffer = canvas.toBuffer();
        await fs.writeFile(path, buffer);

      } catch (canvasError) {
        console.error("💥 𝖢𝖺𝗇𝗏𝖺𝗌 𝖾𝗋𝗋𝗈𝗋:", canvasError);
        // Fall through to text-only version
      }

      // Prepare message
      const body = args.join(" ") || "💖 𝖲𝖴𝖲𝖧𝖨 𝖣𝖠𝖱𝖴𝖭 𝖠𝖬𝖠𝖨𝖪𝖤 𝖳𝖠𝖦 𝖪𝖮𝖱𝖠 💖";
      const mentions = allUsers.map(id => ({
        id,
        tag: "‎",
        fromIndex: 0
      }));

      // Send message with attachment and mentions
      if (path && await fs.pathExists(path)) {
        try {
          await api.sendMessage({
            body: `🎯 ${body}\n\n` + 
                   "=".repeat(20) + "\n" +
                   `🔔 𝖭𝖮𝖳𝖨𝖥𝖤: ${allUsers.length} 𝗎𝗌𝖾𝗋𝗌 𝗍𝖺𝗀𝗀𝖾𝖽!\n` +
                   "=".repeat(20),
            attachment: fs.createReadStream(path),
            mentions
          }, event.threadID);
          
          // Cleanup file
          await fs.unlink(path);
          return;
          
        } catch (sendError) {
          console.error("💥 𝖲𝖾𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", sendError);
          // Fall through to text-only version
        }
      }

      // Text-only fallback
      await api.sendMessage({
        body: `🎯 ${body}\n\n` + 
               "=".repeat(20) + "\n" +
               `🔔 𝖭𝖮𝖳𝖨𝖥𝖤: ${allUsers.length} 𝗎𝗌𝖾𝗋𝗌 𝗍𝖺𝗀𝗀𝖾𝖽!\n` +
               "=".repeat(20),
        mentions
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error("💥 𝖳𝖺𝗀𝖺𝗅𝗅 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
      
      // Final fallback - simple tag without any formatting
      try {
        const botID = api.getCurrentUserID();
        const allUsers = event.participantIDs?.filter(id => 
          id && id !== botID && id !== event.senderID
        ) || [];
        
        const body = args.join(" ") || "💫 𝖲𝗈𝖻𝖺𝗂𝗄𝖾 𝗍𝖺𝗀 𝗄𝗈𝗋𝖺 𝗁𝗈𝗅𝗈!";
        const mentions = allUsers.map(id => ({
          id,
          tag: "‎",
          fromIndex: 0
        }));

        await api.sendMessage({
          body: `⚠️ ${body}`,
          mentions
        }, event.threadID, event.messageID);
        
      } catch (finalError) {
        console.error("💥 𝖥𝗂𝗇𝖺𝗅 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖾𝗋𝗋𝗈𝗋:", finalError);
        // Complete failure - no message sent
      }
    }
  }
};
