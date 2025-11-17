const axios = require("axios");

module.exports = {
  config: {
    name: "currency",
    aliases: [],
    version: "2.2.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 0,
    category: "economy",
    shortDescription: {
      en: "💰 𝐶ℎ𝑒𝑐𝑘 𝑜𝑟 𝑚𝑜𝑑𝑖𝑓𝑦 𝑐𝑢𝑟𝑟𝑒𝑛𝑐𝑦 𝑏𝑎𝑙𝑎𝑛𝑐𝑒"
    },
    longDescription: {
      en: "𝑉𝑖𝑒𝑤 𝑦𝑜𝑢𝑟 𝑏𝑎𝑙𝑎𝑛𝑐𝑒 𝑜𝑟 𝑝𝑒𝑟𝑓𝑜𝑟𝑚 𝑐𝑢𝑟𝑟𝑒𝑛𝑐𝑦 𝑜𝑝𝑒𝑟𝑎𝑡𝑖𝑜𝑛𝑠 (𝑎𝑑𝑚𝑖𝑛 𝑜𝑛𝑙𝑦)"
    },
    guide: {
      en: "{p}currency [ + | - | * | / | +- | 𝑝𝑎𝑦 ] [𝑎𝑚𝑜𝑢𝑛𝑡]"
    },
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function({ message, event, args, usersData }) {
    try {
      const { threadID, senderID, messageID, mentions, type, messageReply } = event;
      let targetID = senderID;
      
      if (type === 'message_reply') targetID = messageReply.senderID;
      else if (Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];

      const userData = await usersData.get(targetID);
      const name = userData.name;
      let money = Math.round(userData.money || 0);

      const formatMoney = (num) => num.toLocaleString("en-US").replace(/,/g, ".");
      const emojis = ["💰", "💸", "💲", "🤑", "💎", "🏦"];

      if (!args[0]) {
        return message.reply(`━━━━━━━━━━━━━━\n🔹 𝐴𝑐𝑐𝑜𝑢𝑛𝑡: ${name}\n🔹 𝐵𝑎𝑙𝑎𝑛𝑐𝑒: ${formatMoney(money)}$\n${emojis[Math.floor(Math.random() * emojis.length)]} 𝑀𝑎𝑛𝑎𝑔𝑒 𝑦𝑜𝑢𝑟 𝑚𝑜𝑛𝑒𝑦 𝑤𝑖𝑠𝑒𝑙𝑦!\n━━━━━━━━━━━━━━`);
      }

      const mon = Math.round(parseFloat(args[1]));
      if (isNaN(mon)) return message.reply("⚠️ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑎𝑚𝑜𝑢𝑛𝑡!");

      // Admin check - replace with your admin IDs
      const adminIDs = ["61571630409265"]; // Add your admin user IDs here
      const isAdmin = adminIDs.includes(senderID);

      switch (args[0]) {
        case "+":
          if (!isAdmin) return message.reply("🚫 𝐼𝑛𝑠𝑢𝑓𝑓𝑖𝑐𝑖𝑒𝑛𝑡 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛𝑠!");
          await usersData.set(targetID, { money: money + mon });
          money += mon;
          break;
        case "-":
          if (!isAdmin) return message.reply("🚫 𝐼𝑛𝑠𝑢𝑓𝑓𝑖𝑐𝑖𝑒𝑛𝑡 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛𝑠!");
          if (money < mon) return message.reply("⚠️ 𝑁𝑜𝑡 𝑒𝑛𝑜𝑢𝑔ℎ 𝑚𝑜𝑛𝑒𝑦 𝑡𝑜 𝑑𝑒𝑑𝑢𝑐𝑡!");
          await usersData.set(targetID, { money: money - mon });
          money -= mon;
          break;
        case "*":
          if (!isAdmin) return message.reply("🚫 𝐼𝑛𝑠𝑢𝑓𝑓𝑖𝑐𝑖𝑒𝑛𝑡 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛𝑠!");
          money *= mon;
          await usersData.set(targetID, { money });
          break;
        case "/":
          if (!isAdmin) return message.reply("🚫 𝐼𝑛𝑠𝑢𝑓𝑓𝑖𝑐𝑖𝑒𝑛𝑡 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛𝑠!");
          if (mon === 0) return message.reply("⚠️ 𝐶𝑎𝑛𝑛𝑜𝑡 𝑑𝑖𝑣𝑖𝑑𝑒 𝑏𝑦 𝑧𝑒𝑟𝑜!");
          money = Math.round(money / mon);
          await usersData.set(targetID, { money });
          break;
        case "+-":
          if (!isAdmin) return message.reply("🚫 𝐼𝑛𝑠𝑢𝑓𝑓𝑖𝑐𝑖𝑒𝑛𝑡 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛𝑠!");
          await usersData.set(targetID, { money: mon });
          money = mon;
          break;
        case "pay":
          const senderMoney = Math.round((await usersData.get(senderID)).money || 0);
          if (senderMoney < mon) return message.reply("⚠️ 𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑒𝑛𝑜𝑢𝑔ℎ 𝑚𝑜𝑛𝑒𝑦 𝑡𝑜 𝑡𝑟𝑎𝑛𝑠𝑓𝑒𝑟!");
          await usersData.set(senderID, { money: senderMoney - mon });
          await usersData.set(targetID, { money: money + mon });
          return message.reply(`💳 𝑇𝑟𝑎𝑛𝑠𝑓𝑒𝑟𝑟𝑒𝑑 **${formatMoney(mon)}$** 𝑡𝑜 **${name}** 💸`);
        default:
          return message.reply("⚠️ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑!");
      }

      return message.reply(`━━━━━━━━━━━━━━\n✅ 𝐵𝑎𝑙𝑎𝑛𝑐𝑒 𝑢𝑝𝑑𝑎𝑡𝑒𝑑\n🔹 𝐴𝑐𝑐𝑜𝑢𝑛𝑡: ${name}\n🔹 𝐵𝑎𝑙𝑎𝑛𝑐𝑒: ${formatMoney(money)}$\n${emojis[Math.floor(Math.random() * emojis.length)]} 𝑈𝑠𝑒 𝑦𝑜𝑢𝑟 𝑚𝑜𝑛𝑒𝑦 𝑤𝑖𝑠𝑒𝑙𝑦!\n━━━━━━━━━━━━━━`);

    } catch (error) {
      console.error("𝐶𝑢𝑟𝑟𝑒𝑛𝑐𝑦 𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑟𝑒𝑞𝑢𝑒𝑠𝑡.");
    }
  }
};
