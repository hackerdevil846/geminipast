const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "jobcenter",
    aliases: ["workcenter", "employment"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "economy",
    shortDescription: {
      en: "💼 𝑊𝑜𝑟𝑘 𝑡𝑜 𝑒𝑎𝑟𝑛 𝑚𝑜𝑛𝑒𝑦 𝑤𝑖𝑡ℎ 𝑣𝑎𝑟𝑖𝑜𝑢𝑠 𝑗𝑜𝑏𝑠"
    },
    longDescription: {
      en: "💼 𝑊𝑜𝑟𝑘 𝑡𝑜 𝑒𝑎𝑟𝑛 𝑚𝑜𝑛𝑒𝑦 𝑤𝑖𝑡ℎ 𝑣𝑎𝑟𝑖𝑜𝑢𝑠 𝑗𝑜𝑏𝑠 - 𝐸𝑛ℎ𝑎𝑛𝑐𝑒𝑑 𝐸𝑑𝑖𝑡𝑖𝑜𝑛"
    },
    guide: {
      en: "{p}jobcenter"
    },
    dependencies: {
      "moment-timezone": ""
    }
  },

  onStart: async function ({ event, api, message, usersData }) {
    try {
      const { threadID, senderID } = event;
      const cooldownTime = 300000; // 5 minutes
      
      const userData = await usersData.get(senderID);
      const workData = userData.data || {};
      
      if (workData.workTime && (Date.now() - workData.workTime) < cooldownTime) {
        const remainingTime = cooldownTime - (Date.now() - workData.workTime);
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        
        return message.reply(
          `⏱️ 𝐶𝑜𝑜𝑙𝑑𝑜𝑤𝑛: 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡 ${minutes} 𝑚𝑖𝑛𝑢𝑡𝑒(𝑠) ${seconds < 10 ? "0" + seconds : seconds} 𝑠𝑒𝑐𝑜𝑛𝑑(𝑠) 𝑏𝑒𝑓𝑜𝑟𝑒 𝑤𝑜𝑟𝑘𝑖𝑛𝑔 𝑎𝑔𝑎𝑖𝑛 ✨`
        );
      }

      const jobTypes = {
        1: { name: "🏭 𝐼𝑛𝑑𝑢𝑠𝑡𝑟𝑖𝑎𝑙 𝑍𝑜𝑛𝑒", minCoins: 200, maxCoins: 600, emoji: "🏭" },
        2: { name: "💼 𝑆𝑒𝑟𝑣𝑖𝑐𝑒 𝐴𝑟𝑒𝑎", minCoins: 200, maxCoins: 1000, emoji: "💼" },
        3: { name: "🛢️ 𝑂𝑖𝑙 𝐹𝑖𝑒𝑙𝑑", minCoins: 300, maxCoins: 800, emoji: "🛢️" },
        4: { name: "⛏️ 𝑀𝑖𝑛𝑖𝑛𝑔 𝑂𝑟𝑒", minCoins: 250, maxCoins: 750, emoji: "⛏️" },
        5: { name: "💎 𝐷𝑖𝑔𝑔𝑖𝑛𝑔 𝑅𝑜𝑐𝑘", minCoins: 200, maxCoins: 500, emoji: "💎" },
        6: { name: "🌟 𝑆𝑝𝑒𝑐𝑖𝑎𝑙 𝐽𝑜𝑏", minCoins: 500, maxCoins: 1500, emoji: "🌟" },
        7: { name: "🚀 𝐸𝑙𝑖𝑡𝑒 𝑀𝑖𝑠𝑠𝑖𝑜𝑛", minCoins: 800, maxCoins: 2500, emoji: "🚀" }
      };

      let menu = `✨━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✨\n`;
      menu += `         💼 𝐸𝐿𝐼𝑇𝐸 𝐽𝑂𝐵 𝐶𝐸𝑁𝑇𝐸𝑅 💼\n`;
      menu += `✨━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✨\n\n`;
      menu += `💼 𝑊𝑒𝑙𝑐𝑜𝑚𝑒 𝑡𝑜 𝑡ℎ𝑒 𝐸𝑙𝑖𝑡𝑒 𝐽𝑜𝑏 𝐶𝑒𝑛𝑡𝑒𝑟! 𝐸𝑎𝑟𝑛 𝑐𝑜𝑖𝑛𝑠 𝑎𝑛𝑑 𝑙𝑒𝑣𝑒𝑙 𝑢𝑝 𝑦𝑜𝑢𝑟 𝑐𝑎𝑟𝑒𝑒𝑟 🚀\n\n`;
      menu += `🎯 𝐶ℎ𝑜𝑜𝑠𝑒 𝑎 𝑗𝑜𝑏 𝑏𝑦 𝑟𝑒𝑝𝑙𝑦𝑖𝑛𝑔 𝑤𝑖𝑡ℎ 𝑖𝑡𝑠 𝑛𝑢𝑚𝑏𝑒𝑟:\n\n`;
      
      for (const [id, job] of Object.entries(jobTypes)) {
        menu += `🔸 ${id}. ${job.name} (${job.minCoins}-${job.maxCoins} 𝑐𝑜𝑖𝑛𝑠) ${job.emoji}\n`;
      }
      
      menu += `\n💡 𝑇𝑖𝑝: 𝐻𝑖𝑔ℎ𝑒𝑟 𝑟𝑖𝑠𝑘 𝑗𝑜𝑏𝑠 𝑜𝑓𝑓𝑒𝑟 𝑔𝑟𝑒𝑎𝑡𝑒𝑟 𝑟𝑒𝑤𝑎𝑟𝑑𝑠!\n`;
      menu += `⏱️ 𝐶𝑜𝑜𝑙𝑑𝑜𝑤𝑛: 5 𝑚𝑖𝑛𝑢𝑡𝑒𝑠 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 𝑗𝑜𝑏𝑠\n\n`;
      menu += `💝 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑗𝑜𝑏 𝑛𝑢𝑚𝑏𝑒𝑟 𝑡𝑜 𝑠𝑡𝑎𝑟𝑡 𝑤𝑜𝑟𝑘𝑖𝑛𝑔`;

      const msg = await message.reply(menu);
      
      global.client.handleReply.push({
        name: this.config.name,
        messageID: msg.messageID,
        author: senderID,
        type: "jobSelection"
      });

    } catch (error) {
      console.error("𝐽𝑜𝑏 𝑆𝑦𝑠𝑡𝑒𝑚 𝐸𝑟𝑟𝑜𝑟:", error);
      // Don't send error message to avoid spam
    }
  },

  onReply: async function({ event, message, Reply, usersData }) {
    try {
      const { senderID, body } = event;
      
      if (Reply.author !== senderID) return;
      
      const jobType = parseInt(body);
      const jobTypes = {
        1: { name: "🏭 𝐼𝑛𝑑𝑢𝑠𝑡𝑟𝑖𝑎𝑙 𝑍𝑜𝑛𝑒", minCoins: 200, maxCoins: 600, emoji: "🏭" },
        2: { name: "💼 𝑆𝑒𝑟𝑣𝑖𝑐𝑒 𝐴𝑟𝑒𝑎", minCoins: 200, maxCoins: 1000, emoji: "💼" },
        3: { name: "🛢️ 𝑂𝑖𝑙 𝐹𝑖𝑒𝑙𝑑", minCoins: 300, maxCoins: 800, emoji: "🛢️" },
        4: { name: "⛏️ 𝑀𝑖𝑛𝑖𝑛𝑔 𝑂𝑟𝑒", minCoins: 250, maxCoins: 750, emoji: "⛏️" },
        5: { name: "💎 𝐷𝑖𝑔𝑔𝑖𝑛𝑔 𝑅𝑜𝑐𝑘", minCoins: 200, maxCoins: 500, emoji: "💎" },
        6: { name: "🌟 𝑆𝑝𝑒𝑐𝑖𝑎𝑙 𝐽𝑜𝑏", minCoins: 500, maxCoins: 1500, emoji: "🌟" },
        7: { name: "🚀 𝐸𝑙𝑖𝑡𝑒 𝑀𝑖𝑠𝑠𝑖𝑜𝑛", minCoins: 800, maxCoins: 2500, emoji: "🚀" }
      };

      if (isNaN(jobType)) {
        return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑛𝑢𝑚𝑏𝑒𝑟! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑗𝑜𝑏 𝑛𝑢𝑚𝑏𝑒𝑟 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 1-7 🌟");
      }

      if (!jobTypes[jobType]) {
        return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑗𝑜𝑏 𝑠𝑒𝑙𝑒𝑐𝑡𝑖𝑜𝑛! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑜𝑜𝑠𝑒 𝑎 𝑗𝑜𝑏 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑙𝑖𝑠𝑡 📋");
      }

      const job = jobTypes[jobType];
      const coinsEarned = Math.floor(Math.random() * (job.maxCoins - job.minCoins + 1)) + job.minCoins;
      
      await usersData.increaseMoney(senderID, coinsEarned);

      const userData = await usersData.get(senderID);
      userData.data = userData.data || {};
      userData.data.workTime = Date.now();
      await usersData.set(senderID, userData);

      const messages = [
        `💼 ${job.emoji} 𝑌𝑂𝑈𝑅 𝑊𝑂𝑅𝐾 𝑅𝐸𝑆𝑈𝐿𝑇𝑆 ${job.emoji}\n\n𝐽𝑜𝑏: ${job.name}\n𝐶𝑜𝑖𝑛𝑠 𝐸𝑎𝑟𝑛𝑒𝑑: ${coinsEarned} 💰\n\n𝐾𝑒𝑒𝑝 𝑢𝑝 𝑡ℎ𝑒 𝑔𝑟𝑒𝑎𝑡 𝑤𝑜𝑟𝑘! 🚀`,
        `🎯 𝑊𝑂𝑅𝐾 𝐶𝑂𝑀𝑃𝐿𝐸𝑇𝐸𝐷!\n\n𝐿𝑜𝑐𝑎𝑡𝑖𝑜𝑛: ${job.name}\n𝑅𝑒𝑤𝑎𝑟𝑑: ${coinsEarned} 𝑐𝑜𝑖𝑛𝑠 💵\n\n𝑌𝑜𝑢𝑟 𝑐𝑎𝑟𝑒𝑒𝑟 𝑖𝑠 𝑝𝑟𝑜𝑔𝑟𝑒𝑠𝑠𝑖𝑛𝑔! 🌟`,
        `🏆 𝑆𝑈𝐶𝐶𝐸𝑆𝑆𝐹𝑈𝐿 𝑊𝑂𝑅𝐾 𝐷𝐴𝑌!\n\n𝐷𝑒𝑝𝑎𝑟𝑡𝑚𝑒𝑛𝑡: ${job.name}\n𝐸𝑎𝑟𝑛𝑖𝑛𝑔𝑠: ${coinsEarned} 𝑐𝑜𝑖𝑛𝑠 🪙\n\n𝑌𝑜𝑢'𝑟𝑒 𝑏𝑢𝑖𝑙𝑑𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑓𝑢𝑡𝑢𝑟𝑒! 💪`
      ];

      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      await message.reply(randomMessage);

    } catch (error) {
      console.error("𝐽𝑜𝑏 𝐸𝑟𝑟𝑜𝑟:", error);
      // Don't send error message to avoid spam
    }
  }
};
