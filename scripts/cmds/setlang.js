const fs = require("fs-extra");

module.exports = {
  config: {
    name: "setlang",
    aliases: [],
    version: "1.5",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "system",
    shortDescription: {
      en: "🌐 Set bot language for current or all chats"
    },
    longDescription: {
      en: "🌐 Set default language of bot for current chat or all chats"
    },
    guide: {
      en: "{p}setlang <language code>\nExample: {p}setlang en\n{p}setlang vi -g (for global)"
    },
    dependencies: {
      "fs-extra": ""
    }
  },

  langs: {
    en: {
      setLangForAll: "✅ Successfully set default bot language to: %1",
      setLangForCurrent: "✅ Successfully set language for this chat to: %1",
      noPermission: "⛔ Only bot admins can use global language setting",
      langNotFound: "❌ Language not found: %1",
      syntaxError: "⚠️ Please enter language code (ex: en, vi)"
    }
  },

  onStart: async function ({ message, args, threadsData, event, usersData, getLang }) {
    try {
      // Check dependencies
      try {
        if (!fs || !fs.existsSync || !fs.readFileSync || !fs.writeFileSync) {
          throw new Error("Missing required dependencies");
        }
      } catch (err) {
        return message.reply("❌ | Required dependencies are missing. Please install fs-extra.");
      }

      const { threadID, senderID } = event;

      if (!args[0]) {
        return message.reply(getLang("syntaxError"));
      }

      let langCode = args[0].toLowerCase();
      if (["default", "reset"].includes(langCode)) {
        langCode = null;
      }

      const globalFlag = ["-g", "-global", "all"].includes(args[1]?.toLowerCase());

      if (globalFlag) {
        // Check if user has admin role (role: 2 for bot admin)
        const userData = await usersData.get(senderID);
        if (userData.role < 2) {
          return message.reply(getLang("noPermission"));
        }

        const pathLanguageFile = `${process.cwd()}/languages/${langCode}.lang`;
        if (!fs.existsSync(pathLanguageFile)) {
          return message.reply(getLang("langNotFound", langCode));
        }

        try {
          const readLanguage = fs.readFileSync(pathLanguageFile, "utf-8");
          const languageData = readLanguage
            .split(/\r?\n|\r/)
            .filter(line => line && !line.trim().startsWith("#") && !line.trim().startsWith("//") && line !== "");

          global.language = {};
          for (const sentence of languageData) {
            const getSeparator = sentence.indexOf('=');
            const itemKey = sentence.slice(0, getSeparator).trim();
            const itemValue = sentence.slice(getSeparator + 1, sentence.length).trim();
            const [head, ...keyParts] = itemKey.split('.');
            const key = keyParts.join('.');
            const value = itemValue.replace(/\\n/gi, '\n');
            
            if (!global.language[head]) {
              global.language[head] = {};
            }
            global.language[head][key] = value;
          }

          global.GoatBot.config.language = langCode;
          fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
          return message.reply(getLang("setLangForAll", langCode));
        }
        catch (err) {
          console.error("Error setting global language:", err);
          return message.reply("❌ An error occurred while updating language");
        }
      }

      await threadsData.set(threadID, langCode, "data.lang");
      const langName = langCode ? langCode.toUpperCase() : "default";
      return message.reply(getLang("setLangForCurrent", langName));

    } catch (error) {
      console.error("SetLang Command Error:", error);
      message.reply("❌ | An error occurred while processing your request");
    }
  }
};
