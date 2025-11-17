const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "bslap",
    aliases: [],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🦇 𝐵𝑎𝑡𝑠𝑙𝑎𝑝 𝑖𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑜𝑟"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝐵𝑎𝑡𝑚𝑎𝑛 𝑠𝑙𝑎𝑝 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑡𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟"
    },
    guide: {
      en: "{p}bslap @𝑡𝑎𝑔 [𝑚𝑒𝑠𝑠𝑎𝑔𝑒]"
    },
    countDown: 5,
    dependencies: {
      "discord-image-generation": "",
      "fs-extra": ""
    }
  },

  langs: {
    "en": {
      "noTag": "❌ 𝑌𝑜𝑢 𝑚𝑢𝑠𝑡 𝑡𝑎𝑔 𝑡ℎ𝑒 𝑝𝑒𝑟𝑠𝑜𝑛 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑠𝑙𝑎𝑝!"
    }
  },

  onStart: async function({ api, event, args, message, getText }) {
    try {
      const uid1 = event.senderID;
      const uid2 = Object.keys(event.mentions)[0];
      
      if (!uid2) {
        return message.reply(getText("noTag"));
      }

      // Get avatar URLs
      const avatarURL1 = `https://graph.facebook.com/${uid1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const avatarURL2 = `https://graph.facebook.com/${uid2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      // Generate batslap image
      const img = await new DIG.Batslap().getImage(avatarURL1, avatarURL2);
      const pathSave = `${__dirname}/cache/${uid1}_${uid2}_batslap.png`;
      
      await fs.writeFileSync(pathSave, Buffer.from(img));

      // Prepare message content
      const content = args.join(' ').replace(Object.keys(event.mentions)[0], "").trim() || "𝐵𝑜𝑝𝑝𝑝𝑝 😵‍💫😵";
      
      // Send message with attachment
      await message.reply({
        body: `💥 ${content}`,
        attachment: fs.createReadStream(pathSave)
      });

      // Clean up temporary file
      await fs.unlinkSync(pathSave);

    } catch (error) {
      console.error("𝐵𝑎𝑡𝑠𝑙𝑎𝑝 𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply("❌ 𝑆𝑜𝑚𝑒𝑡ℎ𝑖𝑛𝑔 𝑤𝑒𝑛𝑡 𝑤𝑟𝑜𝑛𝑔 𝑤ℎ𝑖𝑙𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝐵𝑎𝑡𝑠𝑙𝑎𝑝 𝑖𝑚𝑎𝑔𝑒!");
    }
  }
};
