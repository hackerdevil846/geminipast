module.exports = {
  config: {
    name: "rnamebot",
    aliases: ["botname", "setbotname"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 20,
    role: 2,
    category: "system",
    shortDescription: {
      en: "📛 Change bot's nickname in all groups"
    },
    longDescription: {
      en: "📛 Change bot's nickname in all groups or reset to default name"
    },
    guide: {
      en: "{p}rnamebot [name]"
    }
  },

  onStart: async function ({ event, api, args, threadsData }) {
    try {
      const customName = args.join(" ");
      const allThread = await threadsData.getAll();
      const botID = api.getCurrentUserID();
      
      let threadError = [];
      let count = 0;
      
      if (customName) {
        // Custom name mode
        for (const thread of allThread) {
          try {
            await api.changeNickname(customName, thread.threadID, botID);
            count++;
            await new Promise(resolve => setTimeout(resolve, 300));
          } catch (err) {
            threadError.push(thread.threadID);
          }
        }
        
        let msg = `✅ | Successfully changed bot name in ${count} groups!`;
        if (threadError.length) {
          msg += `\n⚠️ | Failed in ${threadError.length} groups`;
        }
        return api.sendMessage(msg, event.threadID);
      } else {
        // Reset to default mode
        for (const thread of allThread) {
          try {
            const threadSetting = await threadsData.get(thread.threadID) || {};
            const prefix = threadSetting.prefix || global.GoatBot.config.prefix;
            const botName = global.GoatBot.config.botName || "Goat Bot";
            
            await api.changeNickname(
              `[ ${prefix} ] • ${botName}`,
              thread.threadID,
              botID
            );
            count++;
            await new Promise(resolve => setTimeout(resolve, 300));
          } catch (err) {
            threadError.push(thread.threadID);
          }
        }
        
        let msg = `🔄 | Successfully reset bot name in ${count} groups!`;
        if (threadError.length) {
          msg += `\n⚠️ | Failed in ${threadError.length} groups`;
        }
        return api.sendMessage(msg, event.threadID);
      }
    } catch (error) {
      console.error("Rnamebot Command Error:", error);
      return api.sendMessage("❌ | An error occurred while processing your request", event.threadID);
    }
  }
};
