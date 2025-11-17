const axios = require("axios");

module.exports = {
  config: {
    name: "flux",
    aliases: ["fluxai", "aiimg"],
    version: "2.5",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "image",
    shortDescription: {
      en: "🎨 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝐴𝐼-𝑝𝑜𝑤𝑒𝑟𝑒𝑑 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝐹𝑙𝑢𝑥"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑠𝑡𝑢𝑛𝑛𝑖𝑛𝑔 𝐴𝐼-𝑝𝑜𝑤𝑒𝑟𝑒𝑑 𝑖𝑚𝑎𝑔𝑒𝑠 𝑢𝑠𝑖𝑛𝑔 𝐹𝑙𝑢𝑥 𝑡𝑒𝑐ℎ𝑛𝑜𝑙𝑜𝑔𝑦"
    },
    guide: {
      en: "{p}flux [𝑝𝑟𝑜𝑚𝑝𝑡] --𝑟𝑎𝑡𝑖𝑜 [𝑤𝑖𝑑𝑡ℎ:ℎ𝑒𝑖𝑔ℎ𝑡]"
    },
    countDown: 20
  },

  onStart: async function ({ message, event, args }) {
    const apiUrl = "https://www.noobs-api.rf.gd/dipto/flux";
    const maxPromptLength = 500;
    
    try {
      if (args.length === 0) {
        return message.reply(
          `✨ 𝐹𝐿𝑈𝑋 𝐴𝐼 𝐼𝑀𝐴𝐺𝐸 𝐺𝐸𝑁𝐸𝑅𝐴𝑇𝑂𝑅 ✨

📝 𝑈𝑠𝑎𝑔𝑒: 
   flux [𝑝𝑟𝑜𝑚𝑝𝑡] --𝑟𝑎𝑡𝑖𝑜 [𝑑𝑖𝑚𝑒𝑛𝑠𝑖𝑜𝑛𝑠]
   
🎯 𝐸𝑥𝑎𝑚𝑝𝑙𝑒𝑠:
   • flux 𝑐𝑦𝑏𝑒𝑟𝑝𝑢𝑛𝑘 𝑐𝑖𝑡𝑦 𝑎𝑡 𝑛𝑖𝑔ℎ𝑡 --𝑟𝑎𝑡𝑖𝑜 16:9
   • flux 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑤𝑎𝑡𝑒𝑟𝑓𝑎𝑙𝑙 --𝑟𝑎𝑡𝑖𝑜 9:16
   • flux 𝑝𝑜𝑟𝑡𝑟𝑎𝑖𝑡 𝑜𝑓 𝑎 𝑤𝑎𝑟𝑟𝑖𝑜𝑟 --𝑟𝑎𝑡𝑖𝑜 1:1

📋 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑅𝑎𝑡𝑖𝑜𝑠:
   ▫️ 1:1  ▫️ 16:9  ▫️ 9:16
   ▫️ 4:3  ▫️ 3:4   ▫️ 2:3
   ▫️ 3:2  ▫️ 4:5   ▫️ 5:4

💡 𝑇𝑖𝑝: 𝐵𝑒 𝑑𝑒𝑠𝑐𝑟𝑖𝑝𝑡𝑖𝑣𝑒 𝑓𝑜𝑟 𝑏𝑒𝑡𝑡𝑒𝑟 𝑟𝑒𝑠𝑢𝑙𝑡𝑠!`
        );
      }

      const fullPrompt = args.join(" ");
      
      if (fullPrompt.length > maxPromptLength) {
        return message.reply(
          `⚠️ 𝑃𝑟𝑜𝑚𝑝𝑡 𝑇𝑜𝑜 𝐿𝑜𝑛𝑔!

𝑌𝑜𝑢𝑟 𝑝𝑟𝑜𝑚𝑝𝑡 𝑒𝑥𝑐𝑒𝑒𝑑𝑠 ${maxPromptLength} 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠.
𝐶𝑢𝑟𝑟𝑒𝑛𝑡: ${fullPrompt.length} 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠

𝑃𝑙𝑒𝑎𝑠𝑒 𝑠ℎ𝑜𝑟𝑡𝑒𝑛 𝑦𝑜𝑢𝑟 𝑝𝑟𝑜𝑚𝑝𝑡.`
        );
      }

      let prompt, ratio = "1:1";

      if (fullPrompt.includes("--ratio")) {
        const parts = fullPrompt.split("--ratio");
        prompt = parts[0].trim();
        ratio = parts[1] ? parts[1].trim() : "1:1";
      } else {
        prompt = fullPrompt;
      }

      if (!ratio.match(/^\d+:\d+$/)) {
        return message.reply(
          `⚠️ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑅𝑎𝑡𝑖𝑜 𝐹𝑜𝑟𝑚𝑎𝑡!

𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒: 16:9, 1:1, 4:3, 9:16, etc.
𝑌𝑜𝑢𝑟 𝑖𝑛𝑝𝑢𝑡: "${ratio}"`
        );
      }

      const waitMsg = await message.reply(
        `🔄 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑌𝑜𝑢𝑟 𝐹𝑙𝑢𝑥 𝐼𝑚𝑎𝑔𝑒...
⏳ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡 10-20 𝑠𝑒𝑐𝑜𝑛𝑑𝑠
📝 𝑃𝑟𝑜𝑚𝑝𝑡: ${prompt}
📐 𝑅𝑎𝑡𝑖𝑜: ${ratio}`
      );

      const startTime = Date.now();
      
      const response = await axios.get(`${apiUrl}?prompt=${encodeURIComponent(prompt)}&ratio=${ratio}`, {
        responseType: "stream",
        timeout: 120000
      });

      const generationTime = ((Date.now() - startTime) / 1000).toFixed(2);
      await message.unsend(waitMsg.messageID);

      return message.reply({
        body: `✨ 𝐹𝐿𝑈𝑋 𝐼𝑀𝐴𝐺𝐸 𝐺𝐸𝑁𝐸𝑅𝐴𝑇𝐸𝐷!

⏱️ 𝑇𝑖𝑚𝑒: ${generationTime}𝑠
📝 𝑃𝑟𝑜𝑚𝑝𝑡: "${prompt}"
📐 𝑅𝑎𝑡𝑖𝑜: ${ratio}`,
        attachment: response.data
      });

    } catch (error) {
      console.error("𝐹𝑙𝑢𝑥 𝐸𝑟𝑟𝑜𝑟:", error);
      
      let errorMessage = `⚠️ 𝐼𝑀𝐴𝐺𝐸 𝐺𝐸𝑁𝐸𝑅𝐴𝑇𝐼𝑂𝑁 𝐹𝐴𝐼𝐿𝐸𝐷!\n🔸 `;
      
      if (error.response?.status === 503) {
        errorMessage += "𝑆𝑒𝑟𝑣𝑒𝑟 𝑏𝑢𝑠𝑦";
      } else if (error.code === "ECONNABORTED") {
        errorMessage += "𝑇𝑖𝑚𝑒𝑜𝑢𝑡 - 𝑡𝑟𝑦 𝑠𝑖𝑚𝑝𝑙𝑒𝑟 𝑝𝑟𝑜𝑚𝑝𝑡";
      } else if (error.response?.status === 429) {
        errorMessage += "𝑇𝑜𝑜 𝑚𝑎𝑛𝑦 𝑟𝑒𝑞𝑢𝑒𝑠𝑡𝑠";
      } else {
        errorMessage += "𝑈𝑛𝑒𝑥𝑝𝑒𝑐𝑡𝑒𝑑 𝑒𝑟𝑟𝑜𝑟";
      }
      
      return message.reply(errorMessage);
    }
  }
};
