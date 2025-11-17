const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "wanted2",
    aliases: ["wantedposter", "wantedframe"],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🎭 𝑊𝑎𝑛𝑡𝑒𝑑 𝑝𝑜𝑠𝑡𝑒𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑜𝑟"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑤𝑎𝑛𝑡𝑒𝑑 𝑝𝑜𝑠𝑡𝑒𝑟 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑢𝑠𝑒𝑟'𝑠 𝑎𝑣𝑎𝑡𝑎𝑟"
    },
    guide: {
      en: "{p}wanted2 [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛 | 𝑟𝑒𝑝𝑙𝑦]"
    },
    countDown: 1,
    dependencies: {
      "discord-image-generation": "",
      "fs-extra": ""
    }
  },

  langs: {
    en: {
      noTag: "❌ 𝑌𝑜𝑢 𝑚𝑢𝑠𝑡 𝑡𝑎𝑔 𝑡ℎ𝑒 𝑝𝑒𝑟𝑠𝑜𝑛 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎 𝑤𝑎𝑛𝑡𝑒𝑑 𝑝𝑜𝑠𝑡𝑒𝑟 𝑓𝑜𝑟."
    }
  },

  onStart: async function ({ event, message, usersData, args, getText }) {
    try {
      const mentions = Object.keys(event.mentions || {});
      let uid;

      if (event.type === "message_reply" && event.messageReply) {
        uid = event.messageReply.senderID;
      } else {
        uid = mentions[0] || event.senderID;
      }

      // get avatar URL and generate image
      let url = await usersData.getAvatarUrl(uid);
      let avt = await new DIG.Wanted().getImage(url);

      // ensure tmp directory exists (path kept as requested)
      const tmpDir = `${__dirname}/tmp`;
      fs.ensureDirSync(tmpDir);

      const pathSave = `${tmpDir}/wanted.png`;
      fs.writeFileSync(pathSave, Buffer.from(avt));

      // message body: same behavior as original
      let body = mentions[0] ? "𝑁𝐸𝑃𝐴𝐿 𝐾𝑂 𝑊𝐴𝑁𝑇𝐸𝐷 𝑀𝐴𝑁𝑋𝐸" : "𝑌𝑜𝑢 𝑎𝑟𝑒 𝑤𝑎𝑛𝑡𝑒𝑑!";

      // send reply with attachment, then remove temp file
      message.reply(
        {
          body: body,
          attachment: fs.createReadStream(pathSave)
        },
        () => {
          try {
            fs.unlinkSync(pathSave);
          } catch (e) {
            // ignore unlink errors
          }
        }
      );
    } catch (err) {
      console.error(err);
      return message.reply(getText("noTag"));
    }
  }
};
