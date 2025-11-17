module.exports = {
  config: {
    name: "tid",
    aliases: [],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "group",
    shortDescription: {
      en: "📋 𝐺𝑒𝑡 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑔𝑟𝑜𝑢𝑝/𝑡ℎ𝑟𝑒𝑎𝑑 𝐼𝐷"
    },
    longDescription: {
      en: "𝑆𝑒𝑛𝑑𝑠 𝑡ℎ𝑒 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑔𝑟𝑜𝑢𝑝'𝑠 𝑜𝑟 𝑡ℎ𝑟𝑒𝑎𝑑'𝑠 𝐼𝐷"
    },
    guide: {
      en: "{p}tid"
    },
    countDown: 5
  },

  onStart: async function ({ message, event }) {
    try {
      await message.reply(`📋 𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝑡ℎ𝑟𝑒𝑎𝑑 𝐼𝐷: ${event.threadID}`);
    } catch (error) {
      console.error("TID Error:", error);
      await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑟𝑒𝑡𝑟𝑖𝑒𝑣𝑒 𝑡ℎ𝑟𝑒𝑎𝑑 𝐼𝐷");
    }
  }
};
