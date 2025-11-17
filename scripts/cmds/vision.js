const axios = require('axios');
const fs = require('fs-extra');
const baseApiUrl = async () => {
  const base = await axios.get(`https://raw.githubusercontent.com/ARYAN-AROHI-STORE/A4YA9-A40H1/refs/heads/main/APIRUL.json`);
  return base.data.api;
}; 

module.exports = {
  config: {
    name: "vision",
    aliases: ["aiart"],
    version: "6.9.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 15,
    role: 0,
    shortDescription: {
      en: "𝑝ℎ𝑜𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒"
    },
    longDescription: {
      en: "𝑃ℎ𝑜𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑓𝑟𝑜𝑚 𝑚𝑒𝑡𝑎 𝑎𝑖"
    },
    category: "𝑖𝑚𝑎𝑔𝑖𝑛𝑎𝑡𝑖𝑜𝑛",
    guide: {
      en: "{𝑝𝑛} [𝑝𝑟𝑜𝑚𝑝𝑡]"
    }
  },
  onStart: async function ({ args, event, api }) {
    try {
      const prompt = args.join(" ");
      const wait = await api.sendMessage("𝑊𝑎𝑖𝑡 𝑘𝑜𝑟𝑜 𝐵𝑎𝑏𝑦 <😘", event.threadID);
      const response = await axios.get(`${await baseApiUrl()}/meta?prompt=${encodeURIComponent(prompt)}&key=dipto008`);
      const data = response.data.imgUrls;
      await api.unsendMessage(wait.messageID);
      await api.sendMessage({
        body: `✅ | 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑦𝑜𝑢𝑟 𝑖𝑚𝑎𝑔𝑒𝑠`,
        attachment: await global.utils.getStreamFromURL(data)
      }, event.threadID, event.messageID);
    } catch (e) {
      console.error(e);
      await api.sendMessage(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑝ℎ𝑜𝑡𝑜!!!!\𝑟𝑟𝑜𝑟: ${e.message}`, event.threadID);
    }
  }
};
