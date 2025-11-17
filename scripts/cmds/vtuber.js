const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "vtuber",
    aliases: ["vtubers"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "entertainment",
    shortDescription: {
      en: "𝑅𝑎𝑛𝑑𝑜𝑚 𝑉𝑇𝑢𝑏𝑒𝑟 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑣𝑎𝑟𝑖𝑜𝑢𝑠 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠"
    },
    longDescription: {
      en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑉𝑇𝑢𝑏𝑒𝑟 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑝𝑜𝑝𝑢𝑙𝑎𝑟 𝐻𝑜𝑙𝑜𝑙𝑖𝑣𝑒 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠"
    },
    guide: {
      en: "{p}vtuber [𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟_𝑛𝑎𝑚𝑒]\n𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠: 𝑔𝑢𝑟𝑎/𝑚𝑎𝑟𝑖𝑛𝑒/𝑟𝑢𝑠ℎ𝑖𝑎/𝑝𝑒𝑘𝑜𝑟𝑎/𝑐𝑜𝑐𝑜/𝑘𝑜𝑟𝑜𝑛𝑒/𝑎𝑚𝑒𝑙𝑖𝑎/𝑓𝑢𝑏𝑢𝑘𝑖/𝑜𝑘𝑎𝑦𝑢/𝑤𝑎𝑡𝑎𝑚𝑒/𝑢𝑡𝑜/𝑐ℎ𝑙𝑜𝑒/𝑎𝑦𝑎𝑚𝑒/𝑝𝑜𝑙𝑘𝑎/𝑏𝑜𝑡𝑎𝑛/𝑎𝑙𝑜𝑒"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const { threadID, messageID } = event;

      // normalize input
      const input = args && args[0] ? args[0].toString().toLowerCase() : "";

      // map synonyms to canonical types
      let type;
      switch (input) {
        case "rushia":
          type = "rushia";
          break;
        case "pekora":
        case "peko":
          type = "pekora";
          break;
        case "coco":
          type = "coco";
          break;
        case "gura":
        case "gawr":
          type = "gura";
          break;
        case "marine":
        case "marin":
          type = "marine";
          break;
        case "korone":
          type = "korone";
          break;
        case "amelia":
        case "ame":
          type = "amelia";
          break;
        case "fubuki":
          type = "fubuki";
          break;
        case "okayu":
          type = "okayu";
          break;
        case "watame":
          type = "watame";
          break;
        case "uto":
          type = "uto";
          break;
        case "chloe":
          type = "chloe";
          break;
        case "ayame":
          type = "ayame";
          break;
        case "polka":
          type = "polka";
          break;
        case "botan":
          type = "botan";
          break;
        case "aloe":
          type = "aloe";
          break;
        default:
          return message.reply(
            `𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠:\n[𝑔𝑢𝑟𝑎/𝑚𝑎𝑟𝑖𝑛𝑒/𝑟𝑢𝑠ℎ𝑖𝑎/𝑝𝑒𝑘𝑜𝑟𝑎/𝑐𝑜𝑐𝑜/𝑘𝑜𝑟𝑜𝑛𝑒/𝑎𝑚𝑒𝑙𝑖𝑎/𝑓𝑢𝑏𝑢𝑘𝑖/𝑜𝑘𝑎𝑦𝑢/𝑤𝑎𝑡𝑎𝑚𝑒/𝑢𝑡𝑜/𝑐ℎ𝑙𝑜𝑒/𝑎𝑦𝑎𝑚𝑒/𝑝𝑜𝑙𝑘𝑎/𝑏𝑜𝑡𝑎𝑛/𝑎𝑙𝑜𝑒]\n\n𝑈𝑠𝑎𝑔𝑒:\n${global.config?.PREFIX || "."}vtuber 𝑔𝑢𝑟𝑎`
          );
      }

      // API list (DO NOT CHANGE)
      const apis = [
        `https://api.randvtuber-saikidesu.ml?character=${type}`,
        `https://api.waifu.pics/sfw/waifu`,
        `https://nekos.life/api/v2/img/neko`,
        `https://api.nekosapi.com/v2/images/neko`
      ];

      // ensure cache folder exists
      const cacheDir = path.join(__dirname, "cache");
      try {
        fs.mkdirSync(cacheDir, { recursive: true });
      } catch (e) {
        // ignore
      }

      let success = false;

      for (let i = 0; i < apis.length; i++) {
        try {
          const res = await axios.get(apis[i], { timeout: 10000 });
          let imageUrl = null;
          let name = type;
          let count = "𝑁/𝐴";
          let author = "𝑉𝑎𝑟𝑖𝑜𝑢𝑠";

          // Primary API assumed structure
          if (i === 0 && res.data) {
            if (res.data.url) imageUrl = res.data.url;
            else if (res.data.image) imageUrl = res.data.image;
            else if (res.data.data?.url) imageUrl = res.data.data.url;

            name = res.data.name || res.data.title || name;
            count = res.data.count || count;
            author = res.data.author || author;
          } else if (res.data) {
            // backup APIs handling
            if (res.data.url) imageUrl = res.data.url;
            else if (res.data.message) imageUrl = res.data.message;
            else if (res.data.file) imageUrl = res.data.file;
            else if (typeof res.data === "string" && res.data.startsWith("http")) imageUrl = res.data;
          }

          if (!imageUrl) continue;

          // determine extension
          let ext = imageUrl.split("?")[0].split(".").pop();
          if (!ext || ext.length > 5) ext = "jpg";

          const filePath = path.join(cacheDir, `${type}_${Date.now()}.${ext}`);

          // download image
          const imageResp = await axios({
            url: imageUrl,
            method: "GET",
            responseType: "stream",
            timeout: 15000
          });

          const writer = fs.createWriteStream(filePath);
          imageResp.data.pipe(writer);

          await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
          });

          // send message with attachment
          const msgBody = `=== ${name} ===\n𝑈𝑝𝑙𝑜𝑎𝑑𝑠: ${count}\n𝐴𝑢𝑡ℎ𝑜𝑟: ${author}\n\n𝐶𝑟𝑒𝑑𝑖𝑡𝑠: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`;

          await message.reply({
            body: msgBody,
            attachment: fs.createReadStream(filePath)
          });

          // cleanup
          fs.unlinkSync(filePath);
          success = true;
          break;

        } catch (err) {
          console.error(`API ${apis[i]} error:`, err.message);
          continue;
        }
      }

      if (!success) {
        await message.reply("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
      }

    } catch (err) {
      console.error("𝑉𝑇𝑢𝑏𝑒𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", err);
      await message.reply("𝐸𝑟𝑟𝑜𝑟: " + (err.message || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑"));
    }
  }
};
