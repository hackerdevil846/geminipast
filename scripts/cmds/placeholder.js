const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "dummyimage",
    aliases: ["dummyimg", "placeholderimg"],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "utility",
    shortDescription: {
      en: "🖼️ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑑𝑢𝑚𝑚𝑦 𝑡𝑒𝑥𝑡 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑜𝑝𝑡𝑖𝑜𝑛𝑎𝑙 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑐𝑜𝑙𝑜𝑟"
    },
    longDescription: {
      en: "🖼️ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑑𝑢𝑚𝑚𝑦 𝑡𝑒𝑥𝑡 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑐𝑜𝑙𝑜𝑟𝑠"
    },
    guide: {
      en: "{𝑝}𝑑𝑢𝑚𝑚𝑦𝑖𝑚𝑎𝑔𝑒 𝑡𝑒𝑥𝑡 [𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑𝐶𝑜𝑙𝑜𝑟]\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {𝑝}𝑑𝑢𝑚𝑚𝑦𝑖𝑚𝑎𝑔𝑒 𝐻𝑒𝑙𝑙𝑜 𝑤𝑜𝑟𝑙𝑑 𝑟𝑒𝑑"
    },
    dependencies: {
      "fs-extra": "",
      "https": ""
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      // 𝐶ℎ𝑒𝑐𝑘 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠
      try {
        if (!fs || !path || !https) {
          throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }
      } catch (err) {
        return api.sendMessage("❌ | 𝑅𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠 𝑎𝑟𝑒 𝑚𝑖𝑠𝑠𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑎𝑛𝑑 ℎ𝑡𝑡𝑝𝑠.", event.threadID, event.messageID);
      }

      if (args.length === 0) {
        return api.sendMessage("❗ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡𝑒𝑥𝑡. 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: `{𝑝}𝑑𝑢𝑚𝑚𝑦𝑖𝑚𝑎𝑔𝑒 𝐻𝑒𝑙𝑙𝑜 𝑤𝑜𝑟𝑙𝑑 𝑟𝑒𝑑`", event.threadID, event.messageID);
      }

      // 𝐶ℎ𝑒𝑐𝑘 𝑖𝑓 𝑙𝑎𝑠𝑡 𝑎𝑟𝑔 𝑖𝑠 𝑎 𝑐𝑜𝑙𝑜𝑟 (ℎ𝑒𝑥 𝑜𝑟 𝑐𝑜𝑙𝑜𝑟 𝑛𝑎𝑚𝑒)
      let bgColor = "000000"; // 𝑑𝑒𝑓𝑎𝑢𝑙𝑡 𝑏𝑙𝑎𝑐𝑘
      let textArgs = args;

      const lastArg = args[args.length - 1].toLowerCase();

      // 𝑉𝑎𝑙𝑖𝑑𝑎𝑡𝑒 ℎ𝑒𝑥 𝑐𝑜𝑙𝑜𝑟 (𝑤𝑖𝑡ℎ 𝑜𝑟 𝑤𝑖𝑡ℎ𝑜𝑢𝑡 #)
      const hexMatch = lastArg.match(/^#?([0-9a-f]{6})$/i);

      // 𝐿𝑖𝑠𝑡 𝑜𝑓 𝑐𝑜𝑚𝑚𝑜𝑛 𝑐𝑜𝑙𝑜𝑟 𝑛𝑎𝑚𝑒𝑠 𝑠𝑢𝑝𝑝𝑜𝑟𝑡𝑒𝑑 𝑏𝑦 𝑑𝑢𝑚𝑚𝑦𝑖𝑚𝑎𝑔𝑒.𝑐𝑜𝑚
      const colorNames = ["black","white","red","green","blue","yellow","gray","grey","orange","purple","pink","brown","cyan","magenta"];

      if (hexMatch) {
        bgColor = hexMatch[1];
        textArgs = args.slice(0, -1);
      } else if (colorNames.includes(lastArg)) {
        bgColor = lastArg;
        textArgs = args.slice(0, -1);
      }

      if (textArgs.length === 0) {
        return api.sendMessage("❗ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡𝑒𝑥𝑡 𝑏𝑒𝑓𝑜𝑟𝑒 𝑡ℎ𝑒 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑐𝑜𝑙𝑜𝑟.", event.threadID, event.messageID);
      }

      const text = encodeURIComponent(textArgs.join(" "));
      const imageUrl = `https://dummyimage.com/600x300/${bgColor}/fff&text=${text}`;
      const fileName = `dummy_${Date.now()}.png`;
      const filePath = path.join(__dirname, "cache", fileName);

      // 𝐸𝑛𝑠𝑢𝑟𝑒 𝑐𝑎𝑐ℎ𝑒 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦 𝑒𝑥𝑖𝑠𝑡𝑠
      await fs.ensureDir(path.join(__dirname, "cache"));

      const writer = fs.createWriteStream(filePath);
      https.get(imageUrl, (res) => {
        res.pipe(writer);
        writer.on("finish", () => {
          api.sendMessage({
            body: `🖼️ 𝐷𝑢𝑚𝑚𝑦 𝑖𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑤𝑖𝑡ℎ 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑐𝑜𝑙𝑜𝑟 \`${bgColor}\`:\n📝 *${decodeURIComponent(text)}*`,
            attachment: fs.createReadStream(filePath)
          }, event.threadID, () => {
            // 𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑓𝑖𝑙𝑒
            fs.unlinkSync(filePath);
          }, event.messageID);
        });
      }).on("error", (err) => {
        console.error(err);
        api.sendMessage("⚠️ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑑𝑢𝑚𝑚𝑦 𝑖𝑚𝑎𝑔𝑒.", event.threadID, event.messageID);
      });

    } catch (e) {
      console.error(e);
      api.sendMessage("⚠️ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑑𝑢𝑚𝑚𝑦 𝑖𝑚𝑎𝑔𝑒.", event.threadID, event.messageID);
    }
  }
};
