const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
  config: {
    name: "xbin",
    aliases: ["pastebin", "uploadcmd"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 2,
    category: "system",
    shortDescription: {
      en: "📤 𝑈𝑝𝑙𝑜𝑎𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑓𝑖𝑙𝑒𝑠 𝑡𝑜 𝑝𝑎𝑠𝑡𝑒𝑏𝑖𝑛 𝑠𝑒𝑟𝑣𝑖𝑐𝑒"
    },
    longDescription: {
      en: "𝑈𝑝𝑙𝑜𝑎𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑓𝑖𝑙𝑒𝑠 𝑡𝑜 𝑝𝑎𝑠𝑡𝑒𝑏𝑖𝑛 𝑓𝑜𝑟 𝑠ℎ𝑎𝑟𝑖𝑛𝑔 𝑜𝑟 𝑏𝑎𝑐𝑘𝑢𝑝"
    },
    guide: {
      en: "{p}xbin [𝑓𝑖𝑙𝑒𝑛𝑎𝑚𝑒]"
    },
    countDown: 5,
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function({ api, event, args, message }) {
    try {
      // Validate input
      if (!args[0]) {
        return message.reply(
          "📁 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑎 𝑓𝑖𝑙𝑒𝑛𝑎𝑚𝑒.\n𝑈𝑠𝑎𝑔𝑒: 𝑥𝑏𝑖𝑛 [𝑓𝑖𝑙𝑒𝑛𝑎𝑚𝑒]"
        );
      }

      const fileName = args[0].replace(/\.js$/i, "");
      const commandsPath = path.join(__dirname, '..', 'commands');
      const possiblePaths = [
        path.join(commandsPath, `${fileName}.js`),
        path.join(commandsPath, fileName)
      ];

      // Find existing file
      let filePath = null;
      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          filePath = p;
          break;
        }
      }

      if (!filePath) {
        return message.reply(
          `❌ 𝐹𝑖𝑙𝑒 "${fileName}" 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑓𝑜𝑙𝑑𝑒𝑟.`
        );
      }

      // Read file content
      const fileContent = await fs.promises.readFile(filePath, 'utf8');
      if (!fileContent.trim()) {
        return message.reply(
          `⚠️ 𝐹𝑖𝑙𝑒 "${path.basename(filePath)}" 𝑖𝑠 𝑒𝑚𝑝𝑡𝑦.`
        );
      }

      // Send progress message
      const progressMsg = await message.reply(
        "📤 𝑈𝑝𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑓𝑖𝑙𝑒 𝑡𝑜 𝑃𝑎𝑠𝑡𝑒𝐵𝑖𝑛, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡..."
      );

      // Upload to pastebin
      const pastebinAPI = "https://pastebin-api.vercel.app";
      const response = await axios.post(
        `${pastebinAPI}/paste`,
        { text: fileContent },
        { timeout: 15000 }
      );

      if (!response.data?.id) {
        throw new Error('𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑃𝑎𝑠𝑡𝑒𝐵𝑖𝑛 𝐴𝑃𝐼 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒: 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑝𝑎𝑠𝑡𝑒 𝐼𝐷');
      }

      const rawUrl = `${pastebinAPI}/raw/${response.data.id}`;
      const successMessage = `✅ 𝐹𝑖𝑙𝑒 𝑢𝑝𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!\n\n📝 𝐹𝑖𝑙𝑒𝑛𝑎𝑚𝑒: ${path.basename(filePath)}\n🔗 𝑅𝑎𝑤 𝑈𝑅𝐿: ${rawUrl}`;

      // Delete progress message
      await api.unsendMessage(progressMsg.messageID);

      // Send success message
      return message.reply(successMessage);

    } catch (error) {
      console.error('𝑋𝑏𝑖𝑛 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:', error);

      let errorMessage;
      if (error.code === 'ECONNABORTED') {
        errorMessage = '⚠️ 𝑈𝑝𝑙𝑜𝑎𝑑 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.';
      } else if (error.response) {
        errorMessage = '❌ 𝑃𝑎𝑠𝑡𝑒𝐵𝑖𝑛 𝐴𝑃𝐼 𝑖𝑠 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.';
      } else if (error.message.includes('ENOENT')) {
        errorMessage = '❌ 𝐹𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒 𝑓𝑖𝑙𝑒𝑛𝑎𝑚𝑒.';
      } else {
        errorMessage = '❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡.';
      }

      return message.reply(errorMessage);
    }
  }
};
