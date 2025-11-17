const fs = require("fs-extra");

module.exports = {
  config: {
    name: "status",
    aliases: [],
    version: "1.2.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "system",
    shortDescription: {
      en: "🌟 𝐷𝑖𝑠𝑝𝑙𝑎𝑦 𝑏𝑜𝑡 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠 𝑠𝑡𝑎𝑡𝑢𝑠 𝑣𝑖𝑠𝑢𝑎𝑙𝑙𝑦"
    },
    longDescription: {
      en: "𝑆ℎ𝑜𝑤𝑠 𝑡ℎ𝑒 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑠𝑡𝑎𝑡𝑢𝑠 𝑜𝑓 𝑣𝑎𝑟𝑖𝑜𝑢𝑠 𝑏𝑜𝑡 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠 𝑖𝑛 𝑎 𝑣𝑖𝑠𝑢𝑎𝑙 𝑓𝑜𝑟𝑚𝑎𝑡"
    },
    guide: {
      en: "{p}status"
    },
    countDown: 3,
    dependencies: {
      "fs-extra": ""
    }
  },

  onStart: async function({ api, event, threadsData, message }) {
    try {
      const { threadID, messageID } = event;

      // Fetch thread data
      const dataThread = await threadsData.get(threadID);
      const data = dataThread.data || {};

      // Define status variables with default fallbacks
      const log = data.log != null ? data.log : true;
      const rankup = data.rankup != null ? data.rankup : false;
      const resend = data.resend != null ? data.resend : false;
      const tagadmin = data.tagadmin != null ? data.tagadmin : true;
      const guard = data.guard != null ? data.guard : true;
      const antiout = data.antiout != null ? data.antiout : true;

      // Helper function for emoji ON/OFF
      const statusEmoji = state => state ? "🟢 ON" : "🔴 OFF";

      // Dynamic thread name (if available)
      const threadName = dataThread.threadName || "Unknown Thread";

      // Construct status message
      const statusMessage = 
`🌟 𝗕𝗼𝘁 𝗦𝘁𝗮𝘁𝘂𝘀 - ${threadName} 🌟

🍄────•🦋•────🍄
❯ 🍉 𝑳𝒐𝒈: ${statusEmoji(log)}
❯ 🍇 𝑹𝒂𝒏𝒌𝒖𝒑: ${statusEmoji(rankup)}
❯ 🍓 𝑹𝒆𝒔𝒆𝒏𝒅: ${statusEmoji(resend)}
❯ 🥕 𝑻𝒂𝒈 𝑨𝒅𝒎𝒊𝒏: ${statusEmoji(tagadmin)}
❯ 🛡️ 𝑨𝒏𝒕𝒊𝒓𝒐𝒃𝒃𝒆𝒓𝒚: ${statusEmoji(guard)}
❯ 🍒 𝑨𝒏𝒕𝒊𝒐𝒖𝒕: ${statusEmoji(antiout)}
🍄────•🦋•────🍄

✨ 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑏𝑦: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 ✨`;

      // Send the message
      return message.reply(statusMessage);

    } catch (error) {
      console.error("Error in status command:", error);
      return message.reply("⚠️ 𝑆𝑜𝑚𝑒𝑡ℎ𝑖𝑛𝑔 𝑤𝑒𝑛𝑡 𝑤𝑟𝑜𝑛𝑔 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑠𝑡𝑎𝑡𝑢𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.");
    }
  }
};
