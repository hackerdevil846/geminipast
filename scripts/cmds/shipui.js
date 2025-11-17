const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "shipuimg",
    aliases: ["shipui"],
    version: "1.7-fix",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "𝐴𝐼 𝑖𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑜𝑟"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 𝑢𝑠𝑖𝑛𝑔 𝑆ℎ𝑖𝑝𝑢’𝑠 𝐴𝑃𝐼 (𝑐𝑜𝑠𝑡𝑠 𝑐𝑜𝑖𝑛𝑠)"
    },
    category: "𝐼𝑚𝑎𝑔𝑒 𝐺𝑒𝑛",
    guide: {
      en: "{p}shipui <prompt>"
    }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    if (args.length === 0) {
      return message.reply("📛 | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑝𝑟𝑜𝑚𝑝𝑡.");
    }

    const prompt = args.join(" ");
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    // ─── Balance Check ───
    const userData = await usersData.get(event.senderID);
    const currentBalance = userData.money || 0;
    const cost = 20;

    if (currentBalance < cost) {
      return message.reply(
        `❌ | 𝑌𝑜𝑢 𝑛𝑒𝑒𝑑 𝑎𝑡 𝑙𝑒𝑎𝑠𝑡 ${cost} 𝑐𝑜𝑖𝑛𝑠.\n💰 𝑌𝑜𝑢𝑟 𝑏𝑎𝑙𝑎𝑛𝑐𝑒: ${currentBalance}`
      );
    }

    // Deduct balance
    await usersData.set(event.senderID, {
      money: currentBalance - cost
    });

    message.reply(
      "🌸 𝑇ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑐𝑜𝑠𝑡 ❺×❹ = ❷⓿ 𝑐𝑜𝑖𝑛𝑠\n💫 𝐷𝑒𝑑𝑢𝑐𝑡𝑒𝑑 𝑓𝑟𝑜𝑚 𝑦𝑜𝑢𝑟 𝑏𝑎𝑙𝑎𝑛𝑐𝑒!"
    );

    api.sendMessage("🖌️ 𝐻𝑜𝑙𝑑 𝑜𝑛~ 𝑌𝑜𝑢𝑟 𝑝ℎ𝑜𝑡𝑜𝑠 𝑎𝑟𝑒 𝑐𝑜𝑚𝑖𝑛𝑔... 🦆", event.threadID, event.messageID);

    try {
      const styles = ["ultra detailed", "4k resolution", "realistic lighting", "artstation", "digital painting"];
      const imagePaths = [];

      for (let i = 0; i < 4; i++) {
        const enhancedPrompt = `${prompt}, ${styles[i % styles.length]}`;
        const response = await axios.post(
          `${await baseApiUrl()}/api/poli/generate`,
          { prompt: enhancedPrompt },
          {
            responseType: "arraybuffer",
            headers: { author: module.exports.config.author }
          }
        );

        const filePath = path.join(cacheDir, `generated_${Date.now()}_${i}.png`);
        fs.writeFileSync(filePath, response.data);
        imagePaths.push(filePath);
      }

      const attachments = imagePaths.map(p => fs.createReadStream(p));
      message.reply({
        body: "✅ | 𝐻𝑒𝑟𝑒 𝑎𝑟𝑒 𝑦𝑜𝑢𝑟 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑖𝑚𝑎𝑔𝑒𝑠~ 💖",
        attachment: attachments
      });

    } catch (error) {
      console.error("Image generation error:", error);
      message.reply("❌ | 𝐶𝑜𝑢𝑙𝑑𝑛’𝑡 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒𝑠. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
