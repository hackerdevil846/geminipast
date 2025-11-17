module.exports = {
  config: {
    name: "language",
    aliases: ["botlang", "langset"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "system",
    shortDescription: {
        en: "𝐶ℎ𝑎𝑛𝑔𝑒 𝑏𝑜𝑡'𝑠 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 𝐵𝑒𝑛𝑔𝑎𝑙𝑖 𝑎𝑛𝑑 𝐸𝑛𝑔𝑙𝑖𝑠ℎ"
    },
    longDescription: {
        en: "𝐶ℎ𝑎𝑛𝑔𝑒 𝑡ℎ𝑒 𝑏𝑜𝑡'𝑠 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒 𝑝𝑟𝑒𝑓𝑒𝑟𝑒𝑛𝑐𝑒 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 𝐵𝑒𝑛𝑔𝑎𝑙𝑖 𝑎𝑛𝑑 𝐸𝑛𝑔𝑙𝑖𝑠ℎ"
    },
    guide: {
        en: "{p}language [𝑏𝑛 | 𝑒𝑛]"
    }
  },

  langs: {
    "𝑏𝑛": {
        "success": "🤖 𝐵𝑜𝑡'𝑠 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑡𝑜 𝐵𝑒𝑛𝑔𝑎𝑙𝑖 🇧🇩"
    },
    "𝑒𝑛": {
        "success": "🤖 𝐵𝑜𝑡 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑡𝑜 𝐸𝑛𝑔𝑙𝑖𝑠ℎ 🇬🇧"
    }
  },

  onStart: async function({ message, event, args, getText }) {
    try {
        const { threadID, messageID } = event;

        if (!args[0]) {
            return message.reply(
                `⚠️ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑈𝑠𝑎𝑔𝑒\n━━━━━━━━━━━━━━━━━━\n✨ 𝐸𝑥𝑎𝑚𝑝𝑙𝑒:\n• ${global.config.PREFIX}language 𝑏𝑛\n• ${global.config.PREFIX}language 𝑒𝑛`
            );
        }

        const selectedLanguage = args[0].toLowerCase();
        
        if (selectedLanguage === "𝑏𝑛" || selectedLanguage === "𝑏𝑎𝑛𝑔𝑙𝑎") {
            global.config.language = "𝑏𝑛";
            return message.reply(getText("success"));
        }
        else if (selectedLanguage === "𝑒𝑛" || selectedLanguage === "𝑒𝑛𝑔𝑙𝑖𝑠ℎ") {
            global.config.language = "𝑒𝑛";
            return message.reply(getText("success"));
        }
        else {
            return message.reply(
                `❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝐿𝑎𝑛𝑔𝑢𝑎𝑔𝑒\n━━━━━━━━━━━━━━━━━━\n📌 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑂𝑝𝑡𝑖𝑜𝑛𝑠:\n• 𝑏𝑛 - 𝐵𝑒𝑛𝑔𝑎𝑙𝑖/𝐵𝑎𝑛𝑔𝑙𝑎\n• 𝑒𝑛 - 𝐸𝑛𝑔𝑙𝑖𝑠ℎ`
            );
        }
    } catch (error) {
        console.error("𝐿𝑎𝑛𝑔𝑢𝑎𝑔𝑒 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑐ℎ𝑎𝑛𝑔𝑖𝑛𝑔 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒.");
    }
  }
};
