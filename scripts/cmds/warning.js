const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "warning",
    aliases: [],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 2,
    category: "system",
    shortDescription: {
      en: "⚠️ 𝑈𝑠𝑒𝑟 𝑤𝑎𝑟𝑛𝑖𝑛𝑔 𝑠𝑦𝑠𝑡𝑒𝑚 𝑤𝑖𝑡ℎ 3-𝑠𝑡𝑟𝑖𝑘𝑒 𝑏𝑎𝑛"
    },
    longDescription: {
      en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑢𝑠𝑒𝑟 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠 𝑤𝑖𝑡ℎ 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐 𝑏𝑎𝑛 𝑎𝑓𝑡𝑒𝑟 3 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠"
    },
    guide: {
      en: "{p}warning [𝑎𝑙𝑙 | 𝑟𝑒𝑠𝑒𝑡 | 𝑟𝑒𝑝𝑙𝑦 <𝑟𝑒𝑎𝑠𝑜𝑛>]"
    },
    countDown: 5,
    dependencies: {
      "fs-extra": "",
      "path": ""
    }
  },

  onLoad: function () {
    const { existsSync, writeFileSync, ensureDirSync } = fs;
    const { resolve } = path;
    const cacheDir = resolve(__dirname, "cache");
    const dataPath = resolve(cacheDir, "listwarning.json");
    try {
      if (!existsSync(cacheDir)) ensureDirSync(cacheDir);
      if (!existsSync(dataPath)) writeFileSync(dataPath, JSON.stringify({}), "utf-8");
    } catch (e) {
      console.error("𝑊𝐴𝑅𝑁𝐼𝑁𝐺 𝑀𝑂𝐷𝑈𝐿𝐸 𝐿𝑂𝐴𝐷 𝐸𝑅𝑅𝑂𝑅:", e);
    }
  },

  onStart: async function ({ event, api, args, message, usersData }) {
    const { readFileSync, writeFileSync } = fs;
    const { resolve } = path;
    const { threadID, messageID, mentions, senderID } = event;
    const mention = mentions ? Object.keys(mentions) : [];
    const dataPath = resolve(__dirname, "cache", "listwarning.json");

    // Load data safely
    let warningData = {};
    try {
      const dataFile = readFileSync(dataPath, "utf-8");
      warningData = JSON.parse(dataFile || "{}");
    } catch {
      warningData = {};
    }

    const sub = args[0] ? args[0].toString().toLowerCase() : "";

    switch (sub) {
      case "all": {
        let listUser = "";
        for (const IDUser in warningData) {
          try {
            const name = await usersData.getName(IDUser);
            listUser += `👤 ${name} → ${warningData[IDUser].warningLeft} 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠 𝑟𝑒𝑚𝑎𝑖𝑛𝑖𝑛𝑔\n`;
          } catch {
            listUser += `👤 ${IDUser} → ${warningData[IDUser].warningLeft} 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠 𝑟𝑒𝑚𝑎𝑖𝑛𝑖𝑛𝑔\n`;
          }
        }
        if (listUser.length == 0) listUser = "✅ 𝑁𝑜 𝑢𝑠𝑒𝑟𝑠 ℎ𝑎𝑣𝑒 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠 𝑦𝑒𝑡";
        return message.reply(listUser);
      }

      case "reset": {
        try {
          writeFileSync(dataPath, JSON.stringify({}), "utf-8");
          return message.reply("♻️ 𝐴𝑙𝑙 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠 ℎ𝑎𝑣𝑒 𝑏𝑒𝑒𝑛 𝑟𝑒𝑠𝑒𝑡!");
        } catch (e) {
          console.error(e);
          return message.reply("⚠️ 𝐸𝑟𝑟𝑜𝑟: 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑟𝑒𝑠𝑒𝑡 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠");
        }
      }

      default: {
        // View own or mentioned user's warning
        try {
          const targetID = args[0] || mention[0] || senderID;
          const data = warningData[targetID];
          const name = await usersData.getName(targetID);

          if (!data) return message.reply(`✅ ${name} ℎ𝑎𝑠 𝑛𝑜 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠 𝑦𝑒𝑡`);

          let reason = "";
          for (const n of data.warningReason) reason += `• ${n}\n`;
          return message.reply(
            `⚠️ ${name} ℎ𝑎𝑠 ${data.warningLeft} 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠 𝑟𝑒𝑚𝑎𝑖𝑛𝑖𝑛𝑔:\n\n${reason}`
          );
        } catch (e) {
          console.error(e);
          return message.reply("⚠️ 𝐸𝑟𝑟𝑜𝑟: 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑣𝑖𝑒𝑤 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠");
        }
      }
    }
  },

  onChat: async function ({ event, api, args, message, usersData }) {
    const { readFileSync, writeFileSync } = fs;
    const { resolve } = path;
    const dataPath = resolve(__dirname, "cache", "listwarning.json");

    // Load data safely
    let warningData = {};
    try {
      const dataFile = readFileSync(dataPath, "utf-8");
      warningData = JSON.parse(dataFile || "{}");
    } catch {
      warningData = {};
    }

    // Give warning via reply (admin only)
    if (event.type === "message_reply" && event.body?.toLowerCase().startsWith("warning")) {
      try {
        if (event.messageReply.senderID == api.getCurrentUserID()) 
          return message.reply("🤖 𝐶𝑎𝑛𝑛𝑜𝑡 𝑤𝑎𝑟𝑛 𝑏𝑜𝑡 𝑎𝑐𝑐𝑜𝑢𝑛𝑡");

        const reason = args.slice(1).join(" ");
        if (!reason) return message.reply("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑟𝑒𝑎𝑠𝑜𝑛 𝑓𝑜𝑟 𝑤𝑎𝑟𝑛𝑖𝑛𝑔");

        const target = event.messageReply.senderID;
        const entry = warningData[target] || { warningLeft: 3, warningReason: [], banned: false };

        if (entry.banned) 
          return message.reply("⛔ 𝑇ℎ𝑖𝑠 𝑎𝑐𝑐𝑜𝑢𝑛𝑡 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑏𝑎𝑛𝑛𝑒𝑑 (3 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠)");

        const name = await usersData.getName(target);
        entry.warningLeft -= 1;
        entry.warningReason.push(reason);
        if (entry.warningLeft <= 0) entry.banned = true;

        warningData[target] = entry;
        writeFileSync(dataPath, JSON.stringify(warningData, null, 4), "utf-8");

        if (entry.banned) {
          try {
            const userData = await usersData.get(target);
            userData.banned = true;
            await usersData.set(target, userData);
          } catch (e) {
            console.error("𝐸𝑟𝑟𝑜𝑟 𝑠𝑒𝑡𝑡𝑖𝑛𝑔 𝑢𝑠𝑒𝑟 𝑏𝑎𝑛𝑛𝑒𝑑 𝑑𝑎𝑡𝑎:", e);
          }
        }

        return message.reply(
          `⚠️ 𝑊𝑎𝑟𝑛𝑒𝑑 ${name}!\n📌 𝑅𝑒𝑎𝑠𝑜𝑛: ${reason}\n\n` +
          `${entry.banned ? `⛔ 𝐴𝑐𝑐𝑜𝑢𝑛𝑡 𝑏𝑎𝑛𝑛𝑒𝑑 𝑑𝑢𝑒 𝑡𝑜 3 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠!` : `🟡 ${entry.warningLeft} 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠 𝑟𝑒𝑚𝑎𝑖𝑛𝑖𝑛𝑔`}`
        );
      } catch (e) {
        console.error("𝐸𝑅𝑅𝑂𝑅:", e);
        return message.reply("⚠️ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑");
      }
    }
  }
};
