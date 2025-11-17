module.exports = {
  config: {
    name: "news",
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "𝑁𝑒𝑤𝑠 𝑓𝑟𝑜𝑚 V𝑁𝑒𝑥𝑝𝑟𝑒𝑠𝑠"
    },
    longDescription: {
      en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑓𝑜𝑟 𝑙𝑎𝑡𝑒𝑠𝑡 𝑛𝑒𝑤𝑠 𝑓𝑟𝑜𝑚 V𝑁𝑒𝑥𝑝𝑟𝑒𝑠𝑠.𝑛𝑒𝑡"
    },
    guide: {
      en: "{p}news [𝑘𝑒𝑦𝑤𝑜𝑟𝑑𝑠]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "cheerio": "",
      "https": ""
    }
  },

  onStart: async function({ api, event, args }) {
    const axios = require('axios');
    const https = require('https');
    const cheerio = require('cheerio');
    
    const out = (msg) => api.sendMessage(msg, event.threadID);
    const q = args.join(" ");
    
    if (!q) return out("𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑘𝑒𝑦𝑤𝑜𝑟𝑑𝑠 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑠𝑒𝑎𝑟𝑐ℎ");

    const certificate = ({ url }) => {
      return new Promise(async (resolve, reject) => {
        try {
          const data = (await axios({
            url,
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
          })).data;
          resolve(data);
        } catch (e) {
          reject(e);
        }
      });
    };

    try {
      const url = "https://timkiem.vnexpress.net/?q=" + encodeURIComponent(q);
      const data = await certificate({ url });
      const $ = cheerio.load(data);

      if (!$('h3.title-news').eq(0).text()) 
        return out("𝑁𝑜 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑦𝑜𝑢𝑟 𝑘𝑒𝑦𝑤𝑜𝑟𝑑𝑠");

      for (let e = 0; e < 3; e++) {
        const title = $('h3.title-news').eq(e).text().replace(/\n|\t|\"/g, "");
        const desc = $('p.description').eq(e).text();
        const link = $('h3.title-news a').eq(e).attr('href');
        await new Promise(resolve => setTimeout(resolve, 1000));
        out(`📰 ${title}\n\n📝 ${desc}\n🔗 ${link}`);
      }
    } catch (error) {
      console.error(error);
      out("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑠𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔 𝑓𝑜𝑟 𝑛𝑒𝑤𝑠");
    }
  }
};
