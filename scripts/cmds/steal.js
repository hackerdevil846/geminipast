module.exports = {
  config: {
    name: "steal",
    aliases: ["churi", "rob"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "economy",
    shortDescription: {
      en: "🤑 𝑆𝑡𝑒𝑎𝑙 𝑚𝑜𝑛𝑒𝑦 𝑓𝑟𝑜𝑚 𝑜𝑡ℎ𝑒𝑟 𝑢𝑠𝑒𝑟𝑠"
    },
    longDescription: {
      en: "𝑅𝑎𝑛𝑑𝑜𝑚𝑙𝑦 𝑠𝑡𝑒𝑎𝑙 𝑚𝑜𝑛𝑒𝑦 𝑓𝑟𝑜𝑚 𝑜𝑡ℎ𝑒𝑟 𝑢𝑠𝑒𝑟𝑠 𝑜𝑟 𝑟𝑖𝑠𝑘 𝑙𝑜𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑜𝑤𝑛 𝑚𝑜𝑛𝑒𝑦"
    },
    guide: {
      en: "{p}steal"
    },
    countDown: 5
  },

  onStart: async function ({ api, event, usersData, currenciesData, message }) {
    try {
      const allUserIDs = Object.keys(global.db.allUserData);
      let victimID = allUserIDs[Math.floor(Math.random() * allUserIDs.length)];
      let victimData = await usersData.get(victimID);
      let nameVictim = victimData.name;

      if (victimID == api.getCurrentUserID() || event.senderID == victimID) {
        return message.reply('𝘿𝙪𝙠𝙝𝙞𝙩𝙤, 𝙖𝙥𝙣𝙞 𝙚𝙞 𝙗𝙮𝙖𝙠𝙩𝙞𝙧 𝙠𝙖𝙘𝙝𝙚 𝙩𝙝𝙚𝙠𝙚 𝙘𝙝𝙪𝙧𝙞 𝙠𝙤𝙧𝙩𝙚 𝙥𝙖𝙧𝙗𝙚𝙣 𝙣𝙖. 𝘼𝙗𝙖𝙧 𝙘𝙝𝙚𝙨𝙩𝙖 𝙠𝙤𝙧𝙪𝙣.');
      }

      let route = Math.floor(Math.random() * 2);

      if (route === 0) {
        const victimMoney = (await currenciesData.get(victimID)).money || 0;
        const moneyToSteal = Math.floor(Math.random() * 1000) + 1;

        if (victimMoney <= 0) {
          return message.reply(`𝘼𝙥𝙣𝙞 𝙘𝙝𝙪𝙧𝙞 𝙠𝙤𝙧𝙡𝙚𝙣 ${nameVictim} 𝙚𝙧 𝙠𝙖𝙘𝙝𝙚, 𝙠𝙞𝙣𝙩𝙪 𝙩𝙖𝙧 𝙠𝙖𝙘𝙝𝙚 𝙩𝙖𝙠𝙖 𝙣𝙚𝙞. 𝙏𝙖𝙞 𝙖𝙥𝙣𝙖 𝙠𝙞𝙘𝙝𝙪 𝙥𝙖𝙞𝙡𝙚𝙣 𝙣𝙖!`);
        } else if (victimMoney >= moneyToSteal) {
          await currenciesData.decreaseMoney(victimID, moneyToSteal);
          await currenciesData.increaseMoney(event.senderID, moneyToSteal);
          return message.reply(`𝘼𝙥𝙣𝙞 𝙘𝙝𝙪𝙧𝙞 𝙠𝙤𝙧𝙡𝙚𝙣 ${moneyToSteal}$ ${nameVictim} 𝙚𝙧 𝙠𝙖𝙘𝙝𝙚 𝙚𝙞 𝙜𝙧𝙪𝙥 𝙚!`);
        } else {
          await currenciesData.decreaseMoney(victimID, victimMoney);
          await currenciesData.increaseMoney(event.senderID, victimMoney);
          return message.reply(`𝘼𝙥𝙣𝙞 𝙘𝙝𝙪𝙧𝙞 𝙠𝙤𝙧𝙡𝙚𝙣 ${nameVictim} 𝙚𝙧 𝙨𝙤𝙗 𝙩𝙖𝙠𝙖 ${victimMoney}$ 𝙚𝙞 𝙜𝙧𝙪𝙥 𝙚!`);
        }
      } else {
        const senderData = await usersData.get(event.senderID);
        const senderMoney = (await currenciesData.get(event.senderID)).money || 0;
        const senderName = senderData.name;

        if (senderMoney <= 0) {
          return message.reply("𝘼𝙥𝙣𝙖𝙧 𝙠𝙖𝙘𝙝𝙚 𝙩𝙖𝙠𝙖 𝙣𝙚𝙞, 𝙩𝙖𝙠𝙖 𝙠𝙖𝙢𝙖𝙞𝙩𝙚 𝙠𝙖𝙟 𝙠𝙤𝙧𝙪𝙣!");
        } else {
          const reward = Math.floor(senderMoney / 2);
          await currenciesData.decreaseMoney(event.senderID, senderMoney);
          await currenciesData.increaseMoney(victimID, reward);

          return message.reply({
            body: `𝘼𝙥𝙣𝙞 𝙙𝙝𝙤𝙧𝙧𝙖 𝙠𝙝𝙖𝙚𝙣 𝙚𝙗𝙤𝙣𝙜 𝙝𝙖𝙧𝙖𝙡𝙚𝙣 ${senderMoney}$!`,
            mentions: [
              { tag: nameVictim, id: victimID },
              { tag: senderName, id: event.senderID }
            ]
          });
        }
      }
    } catch (error) {
      console.error(error);
      return message.reply("⚠ 𝙀𝙧𝙧𝙤𝙧 𝙖𝙧𝙧𝙤𝙧 𝙝𝙤𝙞𝙩𝙚 𝙜𝙚𝙡𝙚.");
    }
  }
};
