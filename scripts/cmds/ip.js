const axios = require('axios');

module.exports = {
  config: {
    name: "ip",
    aliases: ["ipchecker", "ipdetails"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "utility",
    shortDescription: {
      en: "🌐 𝐶ℎ𝑒𝑐𝑘 𝐼𝑃 𝑎𝑑𝑑𝑟𝑒𝑠𝑠 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
    },
    longDescription: {
      en: "𝐺𝑒𝑡 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑏𝑜𝑢𝑡 𝑎𝑛 𝐼𝑃 𝑎𝑑𝑑𝑟𝑒𝑠𝑠"
    },
    guide: {
      en: "{p}ip [𝑖𝑝 𝑎𝑑𝑑𝑟𝑒𝑠𝑠]"
    },
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function({ message, args, event }) {
    try {
      const timeStart = Date.now();
      
      if (!args[0]) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎𝑛 𝐼𝑃 𝑎𝑑𝑑𝑟𝑒𝑠𝑠 𝑡𝑜 𝑐ℎ𝑒𝑐𝑘 🌐");
      }

      const { data: infoip } = await axios.get(`http://ip-api.com/json/${args[0]}?fields=66846719`);
      
      if (infoip.status === 'fail') {
        return message.reply(`❌ 𝐸𝑟𝑟𝑜𝑟: ${infoip.message}`);
      }

      const responseTime = Date.now() - timeStart;
      
      const messageBody = `🌐 𝐼𝑃 𝐼𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 [${responseTime}ms]
━━━━━━━━━━━━━━━━━━
🗺️ 𝐶𝑜𝑛𝑡𝑖𝑛𝑒𝑛𝑡: ${infoip.continent}
🏳️ 𝑁𝑎𝑡𝑖𝑜𝑛: ${infoip.country}
🎊 𝐶𝑜𝑢𝑛𝑡𝑟𝑦 𝐶𝑜𝑑𝑒: ${infoip.countryCode}
🕋 𝐴𝑟𝑒𝑎: ${infoip.region}
⛱️ 𝑅𝑒𝑔𝑖𝑜𝑛/𝑆𝑡𝑎𝑡𝑒: ${infoip.regionName}
🏙️ 𝐶𝑖𝑡𝑦: ${infoip.city}
🛣️ 𝐷𝑖𝑠𝑡𝑟𝑖𝑐𝑡: ${infoip.district || '𝑁/𝐴'}
📮 𝑍𝐼𝑃 𝑐𝑜𝑑𝑒: ${infoip.zip}
🧭 𝐿𝑎𝑡𝑖𝑡𝑢𝑑𝑒: ${infoip.lat}
🧭 𝐿𝑜𝑛𝑔𝑖𝑡𝑢𝑑𝑒: ${infoip.lon}
⏱️ 𝑇𝑖𝑚𝑒𝑧𝑜𝑛𝑒: ${infoip.timezone}
👨‍✈️ 𝑂𝑟𝑔𝑎𝑛𝑖𝑧𝑎𝑡𝑖𝑜𝑛: ${infoip.org}
💵 𝐶𝑢𝑟𝑟𝑒𝑛𝑐𝑦: ${infoip.currency}
━━━━━━━━━━━━━━━━━━`;

      await message.reply(messageBody);

    } catch (error) {
      console.error("𝐼𝑃 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝐼𝑃 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛");
    }
  }
};
