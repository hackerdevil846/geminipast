module.exports = {
  config: {
    name: "setdatauser",
    aliases: ["updateusers", "refreshusers"],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 2,
    category: "system",
    shortDescription: {
      en: "🔄 𝑆𝑒𝑡 𝑛𝑒𝑤 𝑑𝑎𝑡𝑎 𝑜𝑓 𝑢𝑠𝑒𝑟𝑠 𝑖𝑛𝑡𝑜 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒"
    },
    longDescription: {
      en: "𝑈𝑝𝑑𝑎𝑡𝑒 𝑢𝑠𝑒𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑑𝑎𝑡𝑎 𝑖𝑛 𝑡ℎ𝑒 𝑏𝑜𝑡'𝑠 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒 𝑓𝑜𝑟 𝑎𝑙𝑙 𝑝𝑎𝑟𝑡𝑖𝑐𝑖𝑝𝑎𝑛𝑡𝑠 𝑖𝑛 𝑎 𝑡ℎ𝑟𝑒𝑎𝑑"
    },
    guide: {
      en: "{p}setdatauser"
    },
    countDown: 5
  },

  langs: {
    "en": {
      "noPermission": "❌ 𝑇ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑖𝑠 𝑟𝑒𝑠𝑡𝑟𝑖𝑐𝑡𝑒𝑑 𝑡𝑜 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 𝑜𝑛𝑙𝑦",
      "noUsers": "❌ 𝑁𝑜 𝑢𝑠𝑒𝑟𝑠 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑡ℎ𝑟𝑒𝑎𝑑",
      "criticalError": "❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑢𝑠𝑒𝑟 𝑑𝑎𝑡𝑎",
      "success": "✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑢𝑝𝑑𝑎𝑡𝑒𝑑 %1/%2 𝑢𝑠𝑒𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒𝑠",
      "failedUsers": "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑢𝑝𝑑𝑎𝑡𝑒 %1 𝑢𝑠𝑒𝑟𝑠:\n%2"
    }
  },

  onStart: async function({ api, event, usersData, threadsData, message }) {
    try {
      const allowedIDs = ["61571630409265"];
      const { senderID, threadID } = event;

      if (!allowedIDs.includes(senderID)) {
        return message.reply(this.langs.en.noPermission);
      }

      const threadInfo = await threadsData.get(threadID) || await api.getThreadInfo(threadID);
      const participantIDs = threadInfo.participantIDs || threadInfo.userInfo.map(user => user.id);

      if (!participantIDs || participantIDs.length === 0) {
        return message.reply(this.langs.en.noUsers);
      }

      let successCount = 0;
      let failedCount = 0;
      const failedUsers = [];

      for (const id of participantIDs) {
        try {
          const userData = await api.getUserInfo(id);
          const userName = userData[id]?.name || "Unknown User";
          
          await usersData.set(id, { 
            name: userName,
            data: {}
          });
          
          successCount++;
        } catch (err) {
          failedCount++;
          failedUsers.push(id);
          console.error(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑢𝑝𝑑𝑎𝑡𝑒 𝑢𝑠𝑒𝑟 𝐼𝐷: ${id}`, err);
        }
      }

      const successMessage = this.langs.en.success
        .replace("%1", successCount)
        .replace("%2", participantIDs.length);

      if (failedCount > 0) {
        const failedMessage = this.langs.en.failedUsers
          .replace("%1", failedCount)
          .replace("%2", failedUsers.join('\n'));
        
        await message.reply(`${successMessage}\n${failedMessage}`);
      } else {
        await message.reply(successMessage);
      }

    } catch (err) {
      console.error("❌ 𝐶𝑟𝑖𝑡𝑖𝑐𝑎𝑙 𝐸𝑅𝑅𝑂𝑅:", err);
      await message.reply(this.langs.en.criticalError);
    }
  }
};
