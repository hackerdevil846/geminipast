const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "footkick",
    aliases: ["kick", "footattack"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "𝐾𝑖𝑐𝑘 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑤𝑖𝑡ℎ 𝑎𝑛 𝑎𝑛𝑖𝑚𝑒 𝑔𝑖𝑓"
    },
    longDescription: {
      en: "𝑆𝑒𝑛𝑑𝑠 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑎𝑛𝑖𝑚𝑒 𝑘𝑖𝑐𝑘𝑖𝑛𝑔 𝑔𝑖𝑓 𝑤ℎ𝑒𝑛 𝑡𝑎𝑔𝑔𝑖𝑛𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒"
    },
    guide: {
      en: "{p}footkick [@𝑡𝑎𝑔]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const { threadID, messageID, senderID } = event;

      var links = [    
        "https://i.postimg.cc/65TSxJYD/2ce5a017f6556ff103bce87b273b89b7.gif",
        "https://i.postimg.cc/65SP9jPT/Anime-083428-6224795.gif",
        "https://i.postimg.cc/RFXP2XfS/jXOwoHx.gif",
        "https://i.postimg.cc/jSPMRsNk/tumblr-nyc5ygy2a-Z1uz35lto1-540.gif",
      ];

      var mention = Object.keys(event.mentions);
      if (!mention[0]) {
        return message.reply("𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 1 𝑝𝑒𝑟𝑠𝑜𝑛");
      }
      
      let tag = event.mentions[mention].replace("@", "");
      
      const randomLink = links[Math.floor(Math.random() * links.length)];
      const tempPath = __dirname + `/cache/footkick_${Date.now()}.gif`;

      try {
        const response = await axios.get(randomLink, {
          responseType: 'arraybuffer',
          timeout: 10000
        });

        await fs.outputFile(tempPath, response.data);

        await message.reply({
          body: `${tag} 𝑌𝑜𝑢'𝑟𝑒 𝑠𝑜 𝑤𝑒𝑎𝑘, 𝐼'𝑙𝑙 𝑘𝑖𝑐𝑘 𝑦𝑜𝑢 𝑡𝑜 𝑑𝑒𝑎𝑡ℎ! 🎀`,
          mentions: [{ tag: tag, id: Object.keys(event.mentions)[0] }],
          attachment: fs.createReadStream(tempPath)
        });

        // Clean up
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }

      } catch (error) {
        console.error("Error downloading gif:", error);
        message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑡ℎ𝑒 𝑘𝑖𝑐𝑘𝑖𝑛𝑔 𝑔𝑖𝑓. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
      }

    } catch (error) {
      console.error("Footkick command error:", error);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑒𝑥𝑒𝑐𝑢𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.");
    }
  }
};
