module.exports = {
  config: {
    name: "unfriend",
    aliases: [],
    version: "2.0.0",
    author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
    role: 2,
    category: "system",
    shortDescription: {
      en: "🗑️ 𝐑𝐞𝐦𝐨𝐯𝐞 𝐟𝐫𝐢𝐞𝐧𝐝𝐬 𝐟𝐫𝐨𝐦 𝐛𝐨𝐭'𝐬 𝐟𝐫𝐢𝐞𝐧𝐝 𝐥𝐢𝐬𝐭"
    },
    longDescription: {
      en: "𝐑𝐞𝐦𝐨𝐯𝐞 𝐬𝐩𝐞𝐜𝐢𝐟𝐢𝐜 𝐮𝐬𝐞𝐫 𝐨𝐫 𝐚𝐥𝐥 𝐟𝐫𝐢𝐞𝐧𝐝𝐬 𝐟𝐫𝐨𝐦 𝐭𝐡𝐞 𝐛𝐨𝐭'𝐬 𝐟𝐫𝐢𝐞𝐧𝐝 𝐥𝐢𝐬𝐭"
    },
    guide: {
      en: "{p}unfriend [𝐔𝐈𝐃/𝐦𝐞𝐧𝐭𝐢𝐨𝐧/𝐫𝐞𝐩𝐥𝐲/𝐚𝐥𝐥]"
    },
    countDown: 5
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      let targetUID = args[0];
      
      // 𝐒𝐮𝐩𝐩𝐨𝐫𝐭 𝐟𝐨𝐫 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐫𝐞𝐩𝐥𝐲
      if (event.messageReply) {
        targetUID = event.messageReply.senderID;
      }
      // 𝐒𝐮𝐩𝐩𝐨𝐫𝐭 𝐟𝐨𝐫 𝐦𝐞𝐧𝐭𝐢𝐨𝐧𝐬
      else if (Object.keys(event.mentions).length > 0) {
        targetUID = Object.keys(event.mentions)[0];
      }

      if (!targetUID) {
        return message.reply("❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐔𝐈𝐃, 𝐦𝐞𝐧𝐭𝐢𝐨𝐧 𝐚 𝐮𝐬𝐞𝐫, 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚 𝐦𝐞𝐬𝐬𝐚𝐠𝐞, 𝐨𝐫 𝐮𝐬𝐞 '𝐚𝐥𝐥' 𝐭𝐨 𝐫𝐞𝐦𝐨𝐯𝐞 𝐚𝐥𝐥 𝐟𝐫𝐢𝐞𝐧𝐝𝐬");
      }

      // 𝐂𝐡𝐞𝐜𝐤 𝐟𝐨𝐫 𝐭𝐡𝐞 "𝐚𝐥𝐥" 𝐤𝐞𝐲𝐰𝐨𝐫𝐝 (𝐜𝐚𝐬𝐞-𝐢𝐧𝐬𝐞𝐧𝐬𝐢𝐭𝐢𝐯𝐞)
      if (typeof targetUID === "string" && targetUID.toLowerCase() === "all") {
        try {
          const friends = await api.getFriendsList();
          let count = 0;
          let failed = 0;
          
          message.reply(`🔍 𝐅𝐨𝐮𝐧𝐝 ${friends.length} 𝐟𝐫𝐢𝐞𝐧𝐝𝐬. 𝐒𝐭𝐚𝐫𝐭𝐢𝐧𝐠 𝐫𝐞𝐦𝐨𝐯𝐚𝐥 𝐩𝐫𝐨𝐜𝐞𝐬𝐬...`);
          
          for (const friend of friends) {
            try {
              await api.unfriend(friend.userID);
              count++;
              // 𝐀𝐝𝐝 𝐬𝐦𝐚𝐥𝐥 𝐝𝐞𝐥𝐚𝐲 𝐭𝐨 𝐚𝐯𝐨𝐢𝐝 𝐫𝐚𝐭𝐞 𝐥𝐢𝐦𝐢𝐭𝐢𝐧𝐠
              await new Promise(resolve => setTimeout(resolve, 500));
            } catch (err) {
              console.log(`❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐫𝐞𝐦𝐨𝐯𝐞 ${friend.userID}: ${err.message}`);
              failed++;
            }
          }
          
          return message.reply(
            `✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐫𝐞𝐦𝐨𝐯𝐞𝐝 ${count} 𝐟𝐫𝐢𝐞𝐧𝐝𝐬\n` +
            (failed > 0 ? `❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐫𝐞𝐦𝐨𝐯𝐞 ${failed} 𝐟𝐫𝐢𝐞𝐧𝐝𝐬` : "")
          );
          
        } catch (e) {
          console.error("❌ 𝐄𝐫𝐫𝐨𝐫 𝐠𝐞𝐭𝐭𝐢𝐧𝐠 𝐟𝐫𝐢𝐞𝐧𝐝 𝐥𝐢𝐬𝐭:", e);
          return message.reply("❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐠𝐞𝐭 𝐟𝐫𝐢𝐞𝐧𝐝 𝐥𝐢𝐬𝐭");
        }
      } else {
        try {
          // 𝐕𝐚𝐥𝐢𝐝𝐚𝐭𝐞 𝐔𝐈𝐃 𝐟𝐨𝐫𝐦𝐚𝐭
          if (!/^\d+$/.test(targetUID)) {
            return message.reply("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐔𝐈𝐃 𝐟𝐨𝐫𝐦𝐚𝐭. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐧𝐮𝐦𝐞𝐫𝐢𝐜 𝐔𝐈𝐃");
          }

          await api.unfriend(targetUID);
          return message.reply(`✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐫𝐞𝐦𝐨𝐯𝐞𝐝 𝐔𝐈𝐃: ${targetUID}`);
        } catch (err) {
          console.error("❌ 𝐄𝐫𝐫𝐨𝐫 𝐮𝐧𝐟𝐫𝐢𝐞𝐧𝐝𝐢𝐧𝐠 𝐮𝐬𝐞𝐫:", err);
          return message.reply(`❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐫𝐞𝐦𝐨𝐯𝐞 𝐟𝐫𝐢𝐞𝐧𝐝: ${err.message}`);
        }
      }
    } catch (error) {
      console.error("❌ 𝐔𝐧𝐟𝐫𝐢𝐞𝐧𝐝 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐞𝐫𝐫𝐨𝐫:", error);
      return message.reply("❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐭𝐡𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝");
    }
  }
};
