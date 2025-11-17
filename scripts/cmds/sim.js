const axios = require("axios");

module.exports = {
  config: {
    name: "sim",
    aliases: [],
    version: "4.3.8",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "ai",
    shortDescription: {
      en: "💬 𝐶ℎ𝑎𝑡 𝑤𝑖𝑡ℎ 𝐷𝑒𝑒𝑝𝑆𝑒𝑒𝑘 𝐴𝐼"
    },
    longDescription: {
      en: "𝐻𝑎𝑣𝑒 𝑐𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑡𝑖𝑜𝑛𝑠 𝑤𝑖𝑡ℎ 𝑎𝑑𝑣𝑎𝑛𝑐𝑒𝑑 𝐴𝐼 𝑝𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑦 𝐷𝑒𝑒𝑝𝑆𝑒𝑒𝑘"
    },
    guide: {
      en: "{p}sim [𝑜𝑛 | 𝑜𝑓𝑓 | 𝑚𝑒𝑠𝑠𝑎𝑔𝑒]"
    },
    countDown: 5,
    dependencies: {
      "axios": ""
    }
  },

  onLoad: function () {
    if (typeof global.simAI === "undefined") {
      global.simAI = new Map();
    }
  },

  onChat: async function ({ api, event }) {
    const { threadID, messageID, senderID, body } = event;
    
    if (global.simAI.has(threadID)) {
      if (!body || senderID === api.getCurrentUserID() || messageID === global.simAI.get(threadID)) return;

      try {
        const DEEPSEEK_API_KEY = "sk-0c82a4df00704663a260cb3c71a4f718";
        
        const response = await axios.post(
          "https://api.deepseek.com/chat/completions",
          {
            model: "deepseek-chat",
            messages: [{ role: "user", content: body }],
            temperature: 0.7
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
            },
            timeout: 30000
          }
        );

        if (response.data?.choices?.[0]?.message?.content) {
          await api.sendMessage(response.data.choices[0].message.content, threadID, messageID);
        } else {
          await api.sendMessage("❌ 𝑁𝑜 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑 𝑓𝑟𝑜𝑚 𝐴𝐼.", threadID, messageID);
        }
      } catch (error) {
        console.error("DeepSeek API Error:", error);
        await api.sendMessage("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑜𝑛𝑛𝑒𝑐𝑡 𝑡𝑜 𝐴𝐼 𝑠𝑒𝑟𝑣𝑖𝑐𝑒.", threadID, messageID);
      }
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID } = event;

    if (!args[0]) {
      return message.reply("💬 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑜𝑟 𝑢𝑠𝑒 '𝑜𝑛'/'𝑜𝑓𝑓' 𝑡𝑜 𝑐𝑜𝑛𝑡𝑟𝑜𝑙 𝐴𝐼 𝑐ℎ𝑎𝑡.");
    }

    switch (args[0].toLowerCase()) {
      case "on":
        if (global.simAI.has(threadID)) {
          return message.reply("✅ 𝐴𝐼 𝑐ℎ𝑎𝑡 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑒𝑛𝑎𝑏𝑙𝑒𝑑 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑡ℎ𝑟𝑒𝑎𝑑.");
        }
        global.simAI.set(threadID, event.messageID);
        return message.reply("✅ 𝐴𝐼 𝑐ℎ𝑎𝑡 𝑒𝑛𝑎𝑏𝑙𝑒𝑑. 𝐼 𝑤𝑖𝑙𝑙 𝑛𝑜𝑤 𝑟𝑒𝑠𝑝𝑜𝑛𝑑 𝑡𝑜 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑡ℎ𝑟𝑒𝑎𝑑.");

      case "off":
        if (!global.simAI.has(threadID)) {
          return message.reply("❌ 𝐴𝐼 𝑐ℎ𝑎𝑡 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑑𝑖𝑠𝑎𝑏𝑙𝑒𝑑 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑡ℎ𝑟𝑒𝑎𝑑.");
        }
        global.simAI.delete(threadID);
        return message.reply("✅ 𝐴𝐼 𝑐ℎ𝑎𝑡 𝑑𝑖𝑠𝑎𝑏𝑙𝑒𝑑. 𝐼 𝑤𝑜𝑛'𝑡 𝑟𝑒𝑠𝑝𝑜𝑛𝑑 𝑡𝑜 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑎𝑛𝑦𝑚𝑜𝑟𝑒.");

      default:
        try {
          const DEEPSEEK_API_KEY = "sk-0c82a4df00704663a260cb3c71a4f718";
          const userMessage = args.join(" ");
          
          const response = await axios.post(
            "https://api.deepseek.com/chat/completions",
            {
              model: "deepseek-chat",
              messages: [{ role: "user", content: userMessage }],
              temperature: 0.7
            },
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
              },
              timeout: 30000
            }
          );

          if (response.data?.choices?.[0]?.message?.content) {
            return message.reply(response.data.choices[0].message.content);
          } else {
            return message.reply("❌ 𝑁𝑜 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑 𝑓𝑟𝑜𝑚 𝐴𝐼.");
          }
        } catch (error) {
          console.error("DeepSeek API Error:", error);
          return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑜𝑛𝑛𝑒𝑐𝑡 𝑡𝑜 𝐴𝐼 𝑠𝑒𝑟𝑣𝑖𝑐𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
  }
};
