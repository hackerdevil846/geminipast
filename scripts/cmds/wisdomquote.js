const axios = require("axios");
module.exports = {
  config: {
    name: "wisdomquote",
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: { en: "𝐏𝐡𝐢𝐥𝐨𝐬𝐨𝐩𝐡𝐢𝐜𝐚𝐥 𝐪𝐮𝐨𝐭𝐞" },
    longDescription: { en: "𝐆𝐞𝐭 𝐚 𝐩𝐡𝐢𝐥𝐨𝐬𝐨𝐩𝐡𝐢𝐜𝐚𝐥 𝐪𝐮𝐨𝐭𝐞 𝐟𝐫𝐨𝐦 𝐅𝐨𝐫𝐢𝐬𝐦𝐚𝐭𝐢𝐜" },
    category: "𝐅𝐮𝐧",
    guide: { en: "+𝐰𝐢𝐬𝐝𝐨𝐦𝐪𝐮𝐨𝐭𝐞" }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.get("https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en");
      const quote = res.data.quoteText;
      const author = res.data.quoteAuthor || "𝐔𝐧𝐤𝐧𝐨𝐰𝐧";
      message.reply(`🧠 𝗤𝘂𝗼𝘁𝗲:\n"${quote}"\n— *${author}*`);
    } catch {
      message.reply("❌ 𝗙𝗮𝗶𝗥𝗲𝗱 𝘁𝗼 𝗳𝗲𝘁𝗰𝗵 𝗽𝗵𝗶𝗹𝗼𝘀𝗼𝗽𝗵𝗶𝗰𝗮𝗹 𝗾𝘂𝗼𝘁𝗲.");
    }
  }
};
