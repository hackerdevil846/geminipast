module.exports = {
  config: {
    name: "unfriend",
    aliases: ["removefriend", "deletefriend"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 2,
    category: "system",
    shortDescription: {
      en: "🗑️ 𝑅𝑒𝑚𝑜𝑣𝑒 𝑓𝑟𝑖𝑒𝑛𝑑𝑠 𝑓𝑟𝑜𝑚 𝑏𝑜𝑡'𝑠 𝑓𝑟𝑖𝑒𝑛𝑑 𝑙𝑖𝑠𝑡"
    },
    longDescription: {
      en: "𝑅𝑒𝑚𝑜𝑣𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑖𝑐 𝑢𝑠𝑒𝑟 𝑜𝑟 𝑎𝑙𝑙 𝑓𝑟𝑖𝑒𝑛𝑑𝑠 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑏𝑜𝑡'𝑠 𝑓𝑟𝑖𝑒𝑛𝑑 𝑙𝑖𝑠𝑡"
    },
    guide: {
      en: "{p}unfriend [𝑈𝐼𝐷/𝑎𝑙𝑙]"
    },
    countDown: 5
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const uid = args[0];
      
      if (!uid) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑈𝐼𝐷 𝑜𝑟 '𝑎𝑙𝑙' 𝑡𝑜 𝑟𝑒𝑚𝑜𝑣𝑒 𝑓𝑟𝑖𝑒𝑛𝑑𝑠");
      }

      // Check for the "all" keyword (case-insensitive)
      if (typeof uid === "string" && uid.toLowerCase() === "all") {
        try {
          const friends = await api.getFriendsList();
          let count = 0;
          let failed = 0;
          
          for (const friend of friends) {
            try {
              await api.unfriend(friend.userID);
              count++;
            } catch (err) {
              console.log(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑟𝑒𝑚𝑜𝑣𝑒 ${friend.userID}: ${err.message}`);
              failed++;
            }
          }
          
          return message.reply(
            `✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑟𝑒𝑚𝑜𝑣𝑒𝑑 ${count} 𝑓𝑟𝑖𝑒𝑛𝑑𝑠\n` +
            (failed > 0 ? `❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑟𝑒𝑚𝑜𝑣𝑒 ${failed} 𝑓𝑟𝑖𝑒𝑛𝑑𝑠` : "")
          );
          
        } catch (e) {
          return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑓𝑟𝑖𝑒𝑛𝑑 𝑙𝑖𝑠𝑡");
        }
      } else {
        try {
          await api.unfriend(uid);
          return message.reply(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑟𝑒𝑚𝑜𝑣𝑒𝑑 𝑈𝐼𝐷: ${uid}`);
        } catch (err) {
          return message.reply(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑟𝑒𝑚𝑜𝑣𝑒 𝑓𝑟𝑖𝑒𝑛𝑑: ${err.message}`);
        }
      }
    } catch (error) {
      console.error("Unfriend command error:", error);
      return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑");
    }
  }
};
