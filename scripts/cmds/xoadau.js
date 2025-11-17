const request = require("request");
const fs = require("fs");
const axios = require("axios");

module.exports = {
  config: {
    name: "xoadau",
    aliases: [],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "👋 𝑃𝑎𝑡 𝑠𝑜𝑚𝑒𝑜𝑛𝑒'𝑠 ℎ𝑒𝑎𝑑 𝑔𝑒𝑛𝑡𝑙𝑦"
    },
    longDescription: {
      en: "𝑆𝑒𝑛𝑑 𝑎 𝑔𝑒𝑛𝑡𝑙𝑒 ℎ𝑒𝑎𝑑 𝑝𝑎𝑡 𝑔𝑖𝑓 𝑡𝑜 𝑎 𝑡𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟"
    },
    category: "fun",
    guide: {
      en: "{p}xoadau [@𝑡𝑎𝑔]"
    },
    dependencies: {
      "request": "",
      "fs": "",
      "axios": ""
    }
  },

  onStart: async function({ api, event, args, message }) {
    try {
      // Check dependencies
      if (!request) throw new Error("𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
      if (!fs) throw new Error("𝐹𝑆 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
      
      var link = [    
        "https://i.postimg.cc/FFpGKWYN/anime-head-pat-1.gif",
        "https://i.postimg.cc/k5WvPfrr/tumblr-0c8250dafba85bb286426ce1c364a1cf-37b7a99b-1280.gif",
        "https://i.postimg.cc/wvHcqLH1/tumblr-13717a06189c0af93ea4b58b86accd5a-bc3ce2fe-250.gif",
        "https://i.postimg.cc/tJ43Pbsy/tumblr-nom2ap-Cfio1tydz8to2-500.gif",
      ];
      
      if (Object.keys(event.mentions).length === 0) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑝𝑎𝑡 𝑡ℎ𝑒𝑖𝑟 ℎ𝑒𝑎𝑑");
      }
      
      var mention = Object.keys(event.mentions);
      let tag = event.mentions[mention].replace("@", "");
      
      var callback = () => message.reply({
        body: `${tag} 𝐺𝑜𝑜𝑑 𝑏𝑜𝑦/𝑔𝑖𝑟𝑙! 𝑌𝑜𝑢 𝑑𝑒𝑠𝑒𝑟𝑣𝑒 𝑎 ℎ𝑒𝑎𝑑 𝑝𝑎𝑡 🥰`,
        mentions: [{
          tag: tag,
          id: Object.keys(event.mentions)[0]
        }],
        attachment: fs.createReadStream(__dirname + "/cache/xoa.gif")
      });
      
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/xoa.gif")).on("close", () => callback());
      
    } catch (error) {
      console.error("𝐻𝑒𝑎𝑑 𝑝𝑎𝑡 𝑒𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑: " + error.message);
    }
  }
};
