module.exports = {
  config: {
    name: "theme",
    aliases: ["chatcolor"],
    version: "2.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "group",
    shortDescription: {
      en: "🎨 𝐶ℎ𝑎𝑛𝑔𝑒 𝑀𝑒𝑠𝑠𝑒𝑛𝑔𝑒𝑟 𝑡ℎ𝑟𝑒𝑎𝑑 𝑐𝑜𝑙𝑜𝑟 𝑢𝑠𝑖𝑛𝑔 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑡ℎ𝑒𝑚𝑒 𝑙𝑖𝑠𝑡"
    },
    longDescription: {
      en: "𝑆𝑒𝑡 𝑜𝑟 𝑐ℎ𝑎𝑛𝑔𝑒 𝑡ℎ𝑒 𝑐ℎ𝑎𝑡 𝑐𝑜𝑙𝑜𝑟 𝑡ℎ𝑒𝑚𝑒 𝑜𝑓 𝑎 𝑔𝑟𝑜𝑢𝑝 𝑐ℎ𝑎𝑡 𝑢𝑠𝑖𝑛𝑔 𝑝𝑟𝑒𝑑𝑒𝑓𝑖𝑛𝑒𝑑 𝑡ℎ𝑒𝑚𝑒𝑠"
    },
    guide: {
      en: "{p}theme [𝑡ℎ𝑒𝑚𝑒_𝑛𝑎𝑚𝑒]\n{p}theme 𝑙𝑖𝑠𝑡 - 𝑡𝑜 𝑠𝑒𝑒 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑡ℎ𝑒𝑚𝑒𝑠"
    },
    countDown: 5
  },

  langs: {
    "en": {
      "themeList": "🎨 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑡ℎ𝑒𝑚𝑒𝑠: 𝑑𝑒𝑓𝑎𝑢𝑙𝑡, ℎ𝑜𝑡𝑝𝑖𝑛𝑘, 𝑎𝑞𝑢𝑎𝑏𝑙𝑢𝑒, 𝑏𝑟𝑖𝑔ℎ𝑡𝑝𝑢𝑟𝑝𝑙𝑒, 𝑐𝑜𝑟𝑎𝑙𝑝𝑖𝑛𝑘, 𝑜𝑟𝑎𝑛𝑔𝑒, 𝑔𝑟𝑒𝑒𝑛, 𝑙𝑎𝑣𝑒𝑛𝑑𝑒𝑟𝑝𝑢𝑟𝑝𝑙𝑒, 𝑟𝑒𝑑, 𝑦𝑒𝑙𝑙𝑜𝑤, 𝑡𝑒𝑎𝑙𝑏𝑙𝑢𝑒, 𝑎𝑞𝑢𝑎, 𝑚𝑎𝑛𝑔𝑜, 𝑏𝑒𝑟𝑟𝑦, 𝑐𝑖𝑡𝑟𝑢𝑠",
      "noTheme": "⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑡ℎ𝑒𝑚𝑒 𝑛𝑎𝑚𝑒. 𝑈𝑠𝑒 `{p}theme 𝑙𝑖𝑠𝑡` 𝑡𝑜 𝑠𝑒𝑒 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑡ℎ𝑒𝑚𝑒𝑠.",
      "invalidTheme": "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑡ℎ𝑒𝑚𝑒. 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑡ℎ𝑒𝑚𝑒𝑠: \n%1",
      "themeChanged": "✅ 𝑇ℎ𝑒𝑚𝑒 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑡𝑜: %1",
      "themeChangeFailed": "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑡ℎ𝑒𝑚𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛."
    }
  },

  onStart: async function ({ api, event, args, message, getText }) {
    try {
      const colorMap = {
        default: "196241301102133",
        hotpink: "169463077092846",
        aquablue: "2442142322678320",
        brightpurple: "234137870477637",
        coralpink: "980963458735625",
        orange: "175615189761153",
        green: "2136751179887052",
        lavenderpurple: "2058653964378557",
        red: "2129984390566328",
        yellow: "174636906462322",
        tealblue: "1928399724138152",
        aqua: "417639218648241",
        mango: "930060997172551",
        berry: "164535220883264",
        citrus: "370940413392601"
      };

      const { threadID } = event;
      const themeName = args.join(" ").toLowerCase();

      if (!themeName || themeName === "list") {
        return message.reply(getText("themeList"));
      }

      if (!colorMap.hasOwnProperty(themeName)) {
        return message.reply(
          getText("invalidTheme").replace("%1", Object.keys(colorMap).join(", "))
        );
      }

      const colorID = colorMap[themeName];

      await api.changeThreadColor(colorID, threadID);

      return message.reply(getText("themeChanged").replace("%1", themeName));

    } catch (error) {
      console.error("Theme change error:", error);
      return message.reply(getText("themeChangeFailed"));
    }
  }
};
