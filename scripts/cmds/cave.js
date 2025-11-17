const fs = require("fs-extra");

module.exports = {
  config: {
    name: "cave",
    aliases: ["minecave", "cavemining"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "economy",
    shortDescription: {
      en: "💰 𝑀𝑖𝑛𝑒 𝑟𝑒𝑠𝑜𝑢𝑟𝑐𝑒𝑠 𝑓𝑟𝑜𝑚 𝑦𝑜𝑢𝑟 𝑐𝑎𝑣𝑒 𝑎𝑛𝑑 𝑒𝑎𝑟𝑛 𝑟𝑒𝑤𝑎𝑟𝑑𝑠"
    },
    longDescription: {
      en: "𝑀𝑖𝑛𝑒 𝑟𝑒𝑠𝑜𝑢𝑟𝑐𝑒𝑠 𝑎𝑛𝑑 𝑒𝑎𝑟𝑛 𝑚𝑜𝑛𝑒𝑦 𝑓𝑟𝑜𝑚 𝑦𝑜𝑢𝑟 𝑝𝑒𝑟𝑠𝑜𝑛𝑎𝑙 𝑐𝑎𝑣𝑒"
    },
    guide: {
      en: "{p}cave"
    },
    countDown: 5,
    dependencies: {
      "fs-extra": ""
    },
    envConfig: {
      cooldownTime: 3600000 // 1 hour cooldown
    }
  },

  langs: {
    en: {
      cooldown: "⏳ 𝑌𝑜𝑢 ℎ𝑎𝑣𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑚𝑖𝑛𝑒𝑑 𝑡𝑜𝑑𝑎𝑦. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑖𝑛: %1 𝑚𝑖𝑛𝑢𝑡𝑒(𝑠) %2 𝑠𝑒𝑐𝑜𝑛𝑑(𝑠) 🛏",
      rewarded: "💸 𝑌𝑜𝑢 𝑚𝑖𝑛𝑒𝑑 𝑎𝑡 %1 𝑎𝑛𝑑 𝑒𝑎𝑟𝑛𝑒𝑑: %2$",
      job1: "𝐶𝑎𝑣𝑒",
      error: "❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑚𝑖𝑛𝑖𝑛𝑔."
    }
  },

  onStart: async function({ message, event, usersData, getText }) {
    try {
      const { senderID } = event;
      const cooldown = this.config.envConfig.cooldownTime;

      const userData = await usersData.get(senderID);
      const userCustomData = userData.data || {};
      
      if (userCustomData.workTime && cooldown - (Date.now() - userCustomData.workTime) > 0) {
        const time = cooldown - (Date.now() - userCustomData.workTime);
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);

        return message.reply(
          getText("cooldown")
            .replace("%1", minutes.toString())
            .replace("%2", (seconds < 10 ? "0" + seconds : seconds).toString())
        );
      } else {
        const job = getText("job1");
        const amount = Math.floor(Math.random() * 500) + 100; // 100-600 coins
        const amountText = amount.toString();

        await message.reply(
          getText("rewarded")
            .replace("%1", job)
            .replace("%2", amountText)
        );

        await usersData.increaseMoney(senderID, amount);
        userCustomData.workTime = Date.now();
        await usersData.setData(senderID, { data: userCustomData });
      }

    } catch (error) {
      console.error("𝐶𝑎𝑣𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
      message.reply(getText("error"));
    }
  }
};
