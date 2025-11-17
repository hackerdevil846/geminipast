const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "zodiac",
    aliases: ["horoscope", "zodiacsign"],
    version: "1.5.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "🐉 𝐼𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑏𝑜𝑢𝑡 𝑡ℎ𝑒 12 𝑧𝑜𝑑𝑖𝑎𝑐 𝑎𝑛𝑖𝑚𝑎𝑙𝑠"
    },
    longDescription: {
      en: "𝐺𝑒𝑡 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑏𝑜𝑢𝑡 𝐶ℎ𝑖𝑛𝑒𝑠𝑒 𝑧𝑜𝑑𝑖𝑎𝑐 𝑠𝑖𝑔𝑛𝑠 𝑤𝑖𝑡ℎ 𝑖𝑚𝑎𝑔𝑒𝑠"
    },
    guide: {
      en: "{p}zodiac"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  // Constants
  ZODIAC_DIR: path.join(__dirname, "cache", "zodiac_images"),
  IMAGE_URLS: {
    "sửu": "https://i.ibb.co/2F8sV2Q/11-RFXQx.jpg",
    "tý": "https://i.ibb.co/0QrVkzF/5-Hx-GOz7.jpg",
    "dần": "https://i.ibb.co/6wY3S2Q/g-Sz-X7n-L.jpg",
    "mão": "https://i.ibb.co/6rWvWcG/SVcd-KJp.jpg",
    "thìn": "https://i.ibb.co/Ks1qQfq/ANd-QTeq.jpg",
    "tỵ": "https://i.ibb.co/0X5yD6X/lnx-S2-Xr.jpg",
    "ngọ": "https://i.ibb.co/KyXz8b6/Fn-KVUKI.jpg",
    "mùi": "https://i.ibb.co/rZ6N0H6/f-OSI3wz.jpg",
    "thân": "https://i.ibb.co/7nW4XJj/h-PTcp-V5.jpg",
    "dậu": "https://i.ibb.co/2KvTtXk/ch-W3-Tc1.jpg",
    "tuất": "https://i.ibb.co/VtLk2W0/7i7-GU1t.jpg",
    "hợi": "https://i.ibb.co/fDvFpGx/h-J5nf-Ua.jpg"
  },

  // Zodiac data
  ZODIAC_DATA: {
    1: {
      body: "🐭 𝑅𝑎𝑡 (𝑇ý) - (23:00-01:00)\n\n𝑃𝑒𝑜𝑝𝑙𝑒 𝑏𝑜𝑟𝑛 𝑖𝑛 𝑡ℎ𝑒 𝑦𝑒𝑎𝑟 𝑜𝑓 𝑡ℎ𝑒 𝑅𝑎𝑡 𝑎𝑟𝑒 𝑢𝑠𝑢𝑎𝑙𝑙𝑦 𝑣𝑒𝑟𝑦 𝑠𝑚𝑎𝑟𝑡, 𝑞𝑢𝑖𝑐𝑘-𝑤𝑖𝑡𝑡𝑒𝑑 𝑎𝑛𝑑 𝑎𝑑𝑎𝑝𝑡𝑎𝑏𝑙𝑒. 𝑇ℎ𝑒𝑦 ℎ𝑎𝑣𝑒 𝑠𝑡𝑟𝑜𝑛𝑔 𝑜𝑏𝑠𝑒𝑟𝑣𝑎𝑡𝑖𝑜𝑛 𝑠𝑘𝑖𝑙𝑙𝑠 𝑎𝑛𝑑 𝑎𝑟𝑒 𝑔𝑜𝑜𝑑 𝑎𝑡 𝑠𝑒𝑖𝑧𝑖𝑛𝑔 𝑜𝑝𝑝𝑜𝑟𝑡𝑢𝑛𝑖𝑡𝑖𝑒𝑠. 𝑅𝑎𝑡𝑠 𝑎𝑟𝑒 𝑡ℎ𝑟𝑖𝑓𝑡𝑦 𝑎𝑛𝑑 𝑢𝑠𝑢𝑎𝑙𝑙𝑦 ℎ𝑎𝑣𝑒 𝑠𝑎𝑣𝑖𝑛𝑔𝑠. 𝐻𝑜𝑤𝑒𝑣𝑒𝑟, 𝑡ℎ𝑒𝑦 𝑐𝑎𝑛 𝑠𝑜𝑚𝑒𝑡𝑖𝑚𝑒𝑠 𝑏𝑒 𝑡𝑖𝑚𝑖𝑑 𝑎𝑛𝑑 𝑐𝑜𝑛𝑠𝑒𝑟𝑣𝑎𝑡𝑖𝑣𝑒 𝑖𝑛 𝑡ℎ𝑒 𝑓𝑎𝑐𝑒 𝑜𝑓 𝑚𝑎𝑗𝑜𝑟 𝑑𝑒𝑐𝑖𝑠𝑖𝑜𝑛𝑠.",
      image: "tý.jpg"
    },
    2: {
      body: "🐂 𝑂𝑥 (𝑆ử𝑢) - (01:00-03:00)\n\n𝑃𝑒𝑜𝑝𝑙𝑒 𝑏𝑜𝑟𝑛 𝑖𝑛 𝑡ℎ𝑒 𝑦𝑒𝑎𝑟 𝑜𝑓 𝑡ℎ𝑒 𝑂𝑥 𝑎𝑟𝑒 𝑑𝑖𝑙𝑖𝑔𝑒𝑛𝑡, 𝑝𝑒𝑟𝑠𝑖𝑠𝑡𝑒𝑛𝑡, 𝑎𝑛𝑑 𝑠𝑖𝑚𝑝𝑙𝑒. 𝑇ℎ𝑒𝑦 𝑎𝑟𝑒 𝑘𝑛𝑜𝑤𝑛 𝑓𝑜𝑟 𝑡ℎ𝑒𝑖𝑟 𝑠𝑡𝑟𝑜𝑛𝑔 𝑠𝑒𝑛𝑠𝑒 𝑜𝑓 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑖𝑏𝑖𝑙𝑖𝑡𝑦 𝑎𝑛𝑑 𝑝𝑎𝑡𝑖𝑒𝑛𝑐𝑒. 𝑂𝑥𝑒𝑛 𝑎𝑟𝑒 𝑑𝑒𝑝𝑒𝑛𝑑𝑎𝑏𝑙𝑒 𝑤𝑜𝑟𝑘𝑒𝑟𝑠 𝑏𝑢𝑡 𝑐𝑎𝑛 𝑏𝑒 𝑠𝑡𝑢𝑏𝑏𝑜𝑟𝑛 𝑎𝑡 𝑡𝑖𝑚𝑒𝑠. 𝑇ℎ𝑒𝑦 𝑣𝑎𝑙𝑢𝑒 𝑡𝑟𝑎𝑑𝑖𝑡𝑖𝑜𝑛 𝑎𝑛𝑑 𝑎𝑟𝑒 𝑢𝑠𝑢𝑎𝑙𝑙𝑦 𝑓𝑎𝑚𝑖𝑙𝑦-𝑜𝑟𝑖𝑒𝑛𝑡𝑒𝑑.",
      image: "sửu.jpg"
    },
    3: {
      body: "🐅 𝑇𝑖𝑔𝑒𝑟 (𝐷ầ𝑛) - (03:00-05:00)\n\n𝑇𝑖𝑔𝑒𝑟𝑠 𝑎𝑟𝑒 𝑏𝑟𝑎𝑣𝑒, 𝑐𝑜𝑚𝑝𝑒𝑡𝑖𝑡𝑖𝑣𝑒, 𝑎𝑛𝑑 𝑐𝑜𝑛𝑓𝑖𝑑𝑒𝑛𝑡. 𝑇ℎ𝑒𝑦 ℎ𝑎𝑣𝑒 𝑠𝑡𝑟𝑜𝑛𝑔 𝑙𝑒𝑎𝑑𝑒𝑟𝑠ℎ𝑖𝑝 𝑞𝑢𝑎𝑙𝑖𝑡𝑖𝑒𝑠 𝑎𝑛𝑑 𝑎𝑟𝑒 𝑔𝑜𝑜𝑑 𝑎𝑡 𝑠𝑜𝑙𝑣𝑖𝑛𝑔 𝑐𝑟𝑖𝑠𝑒𝑠. 𝑇𝑖𝑔𝑒𝑟𝑠 𝑎𝑟𝑒 𝑎𝑑𝑣𝑒𝑛𝑡𝑢𝑟𝑜𝑢𝑠 𝑏𝑢𝑡 𝑐𝑎𝑛 𝑏𝑒 𝑖𝑚𝑝𝑢𝑙𝑠𝑖𝑣𝑒. 𝑇ℎ𝑒𝑦 𝑎𝑟𝑒 𝑢𝑠𝑢𝑎𝑙𝑙𝑦 𝑟𝑒𝑠𝑝𝑒𝑐𝑡𝑒𝑑 𝑏𝑢𝑡 𝑛𝑒𝑒𝑑 𝑡𝑜 𝑏𝑒 𝑐𝑎𝑟𝑒𝑓𝑢𝑙 𝑎𝑏𝑜𝑢𝑡 𝑏𝑒𝑖𝑛𝑔 𝑡𝑜𝑜 𝑎𝑢𝑡ℎ𝑜𝑟𝑖𝑡𝑎𝑡𝑖𝑣𝑒.",
      image: "dần.jpg"
    },
    4: {
      body: "🐈 𝐶𝑎𝑡 (𝑀ã𝑜) - (05:00-07:00)\n\n𝑃𝑒𝑜𝑝𝑙𝑒 𝑏𝑜𝑟𝑛 𝑖𝑛 𝑡ℎ𝑒 𝑦𝑒𝑎𝑟 𝑜𝑓 𝑡ℎ𝑒 𝐶𝑎𝑡 𝑎𝑟𝑒 𝑔𝑒𝑛𝑡𝑙𝑒, 𝑒𝑙𝑒𝑔𝑎𝑛𝑡, 𝑎𝑛𝑑 𝑘𝑖𝑛𝑑. 𝑇ℎ𝑒𝑦 ℎ𝑎𝑣𝑒 𝑎𝑟𝑡𝑖𝑠𝑡𝑖𝑐 𝑡𝑎𝑙𝑒𝑛𝑡𝑠 𝑎𝑛𝑑 𝑎𝑝𝑝𝑟𝑒𝑐𝑖𝑎𝑡𝑒 𝑏𝑒𝑎𝑢𝑡𝑦 𝑖𝑛 𝑙𝑖𝑓𝑒. 𝐶𝑎𝑡𝑠 𝑎𝑣𝑜𝑖𝑑 𝑐𝑜𝑛𝑓𝑙𝑖𝑐𝑡 𝑎𝑛𝑑 𝑠𝑒𝑒𝑘 ℎ𝑎𝑟𝑚𝑜𝑛𝑖𝑜𝑢𝑠 𝑟𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝𝑠. 𝑇ℎ𝑒𝑦 𝑐𝑎𝑛 𝑏𝑒 𝑟𝑒𝑠𝑒𝑟𝑣𝑒𝑑 𝑎𝑛𝑑 𝑐𝑎𝑢𝑡𝑖𝑜𝑢𝑠 𝑖𝑛 𝑛𝑒𝑤 𝑠𝑖𝑡𝑢𝑎𝑡𝑖𝑜𝑛𝑠.",
      image: "mão.jpg"
    },
    5: {
      body: "🐉 𝐷𝑟𝑎𝑔𝑜𝑛 (𝑇ℎì𝑛) - (07:00-09:00)\n\n𝐷𝑟𝑎𝑔𝑜𝑛𝑠 𝑎𝑟𝑒 𝑒𝑛𝑒𝑟𝑔𝑒𝑡𝑖𝑐, 𝑐ℎ𝑎𝑟𝑖𝑠𝑚𝑎𝑡𝑖𝑐, 𝑎𝑛𝑑 𝑎𝑚𝑏𝑖𝑡𝑖𝑜𝑢𝑠. 𝑇ℎ𝑒𝑦 𝑎𝑟𝑒 𝑛𝑎𝑡𝑢𝑟𝑎𝑙 𝑙𝑒𝑎𝑑𝑒𝑟𝑠 𝑤ℎ𝑜 𝑖𝑛𝑠𝑝𝑖𝑟𝑒 𝑜𝑡ℎ𝑒𝑟𝑠. 𝐷𝑟𝑎𝑔𝑜𝑛𝑠 𝑎𝑟𝑒 𝑐𝑜𝑛𝑓𝑖𝑑𝑒𝑛𝑡 𝑏𝑢𝑡 𝑐𝑎𝑛 𝑏𝑒 𝑎𝑟𝑟𝑜𝑔𝑎𝑛𝑡. 𝑇ℎ𝑒𝑦 𝑎𝑟𝑒 𝑙𝑢𝑐𝑘𝑦 𝑖𝑛 𝑤𝑒𝑎𝑙𝑡ℎ 𝑏𝑢𝑡 𝑛𝑒𝑒𝑑 𝑡𝑜 𝑐𝑜𝑛𝑡𝑟𝑜𝑙 𝑡ℎ𝑒𝑖𝑟 𝑡𝑒𝑚𝑝𝑒𝑟.",
      image: "thìn.jpg"
    },
    6: {
      body: "🐍 𝑆𝑛𝑎𝑘𝑒 (𝑇ỵ) - (09:00-11:00)\n\n𝑆𝑛𝑎𝑘𝑒𝑠 𝑎𝑟𝑒 𝑤𝑖𝑠𝑒, 𝑖𝑛𝑡𝑢𝑖𝑡𝑖𝑣𝑒, 𝑎𝑛𝑑 𝑚𝑦𝑠𝑡𝑒𝑟𝑖𝑜𝑢𝑠. 𝑇ℎ𝑒𝑦 ℎ𝑎𝑣𝑒 𝑒𝑥𝑐𝑒𝑙𝑙𝑒𝑛𝑡 𝑎𝑛𝑎𝑙𝑦𝑡𝑖𝑐𝑎𝑙 𝑠𝑘𝑖𝑙𝑙𝑠 𝑎𝑛𝑑 𝑎𝑟𝑒 𝑔𝑜𝑜𝑑 𝑎𝑡 𝑏𝑢𝑠𝑖𝑛𝑒𝑠𝑠. 𝑆𝑛𝑎𝑘𝑒𝑠 𝑣𝑎𝑙𝑢𝑒 𝑝𝑟𝑖𝑣𝑎𝑐𝑦 𝑎𝑛𝑑 𝑐𝑎𝑛 𝑏𝑒 𝑠𝑢𝑠𝑝𝑖𝑐𝑖𝑜𝑢𝑠 𝑜𝑓 𝑜𝑡ℎ𝑒𝑟𝑠. 𝑇ℎ𝑒𝑦 𝑎𝑟𝑒 𝑑𝑒𝑡𝑒𝑟𝑚𝑖𝑛𝑒𝑑 𝑏𝑢𝑡 𝑛𝑒𝑒𝑑 𝑡𝑜 𝑎𝑣𝑜𝑖𝑑 𝑏𝑒𝑖𝑛𝑔 𝑜𝑣𝑒𝑟𝑙𝑦 𝑗𝑒𝑎𝑙𝑜𝑢𝑠.",
      image: "tỵ.jpg"
    },
    7: {
      body: "🐎 𝐻𝑜𝑟𝑠𝑒 (𝑁𝑔ọ) - (11:00-13:00)\n\n𝐻𝑜𝑟𝑠𝑒𝑠 𝑎𝑟𝑒 𝑐ℎ𝑒𝑒𝑟𝑓𝑢𝑙, 𝑝𝑜𝑝𝑢𝑙𝑎𝑟, 𝑎𝑛𝑑 𝑖𝑛𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑡. 𝑇ℎ𝑒𝑦 ℎ𝑎𝑣𝑒 𝑠𝑡𝑟𝑜𝑛𝑔 𝑐𝑜𝑚𝑚𝑢𝑛𝑖𝑐𝑎𝑡𝑖𝑜𝑛 𝑠𝑘𝑖𝑙𝑙𝑠 𝑎𝑛𝑑 𝑙𝑜𝑣𝑒 𝑓𝑟𝑒𝑒𝑑𝑜𝑚. 𝐻𝑜𝑟𝑠𝑒𝑠 𝑎𝑟𝑒 ℎ𝑎𝑟𝑑𝑤𝑜𝑟𝑘𝑖𝑛𝑔 𝑏𝑢𝑡 𝑐𝑎𝑛 𝑏𝑒 𝑖𝑚𝑝𝑎𝑡𝑖𝑒𝑛𝑡. 𝑇ℎ𝑒𝑦 𝑛𝑒𝑒𝑑 𝑡𝑜 𝑏𝑒 𝑐𝑎𝑟𝑒𝑓𝑢𝑙 𝑎𝑏𝑜𝑢𝑡 𝑎𝑐𝑡𝑖𝑛𝑔 𝑏𝑒𝑓𝑜𝑟𝑒 𝑡ℎ𝑖𝑛𝑘𝑖𝑛𝑔.",
      image: "ngọ.jpg"
    },
    8: {
      body: "🐐 𝐺𝑜𝑎𝑡 (𝑀ù𝑖) - (13:00-15:00)\n\n𝐺𝑜𝑎𝑡𝑠 𝑎𝑟𝑒 𝑔𝑒𝑛𝑡𝑙𝑒, 𝑐𝑎𝑙𝑚, 𝑎𝑛𝑑 𝑐𝑜𝑚𝑝𝑎𝑠𝑠𝑖𝑜𝑛𝑎𝑡𝑒. 𝑇ℎ𝑒𝑦 ℎ𝑎𝑣𝑒 𝑎𝑟𝑡𝑖𝑠𝑡𝑖𝑐 𝑡𝑎𝑙𝑒𝑛𝑡𝑠 𝑎𝑛𝑑 𝑣𝑎𝑙𝑢𝑒 𝑟𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝𝑠. 𝐺𝑜𝑎𝑡𝑠 𝑐𝑎𝑛 𝑏𝑒 𝑖𝑛𝑑𝑒𝑐𝑖𝑠𝑖𝑣𝑒 𝑎𝑛𝑑 𝑜𝑣𝑒𝑟𝑙𝑦 𝑠𝑒𝑛𝑠𝑖𝑡𝑖𝑣𝑒. 𝑇ℎ𝑒𝑦 𝑛𝑒𝑒𝑑 𝑚𝑜𝑟𝑒 𝑐𝑜𝑛𝑓𝑖𝑑𝑒𝑛𝑐𝑒 𝑖𝑛 𝑑𝑒𝑐𝑖𝑠𝑖𝑜𝑛-𝑚𝑎𝑘𝑖𝑛𝑔 𝑎𝑛𝑑 𝑠ℎ𝑜𝑢𝑙𝑑 𝑎𝑣𝑜𝑖𝑑 𝑝𝑒𝑠𝑠𝑖𝑚𝑖𝑠𝑚.",
      image: "mùi.jpg"
    },
    9: {
      body: "🐒 𝑀𝑜𝑛𝑘𝑒𝑦 (𝑇ℎâ𝑛) - (15:00-17:00)\n\n𝑀𝑜𝑛𝑘𝑒𝑦𝑠 𝑎𝑟𝑒 𝑐𝑙𝑒𝑣𝑒𝑟, 𝑖𝑛𝑛𝑜𝑣𝑎𝑡𝑖𝑣𝑒, 𝑎𝑛𝑑 𝑝𝑙𝑎𝑦𝑓𝑢𝑙. 𝑇ℎ𝑒𝑦 𝑎𝑟𝑒 𝑞𝑢𝑖𝑐𝑘 𝑙𝑒𝑎𝑟𝑛𝑒𝑟𝑠 𝑎𝑛𝑑 𝑝𝑟𝑜𝑏𝑙𝑒𝑚 𝑠𝑜𝑙𝑣𝑒𝑟𝑠. 𝑀𝑜𝑛𝑘𝑒𝑦𝑠 𝑐𝑎𝑛 𝑏𝑒 𝑚𝑖𝑠𝑐ℎ𝑖𝑒𝑣𝑜𝑢𝑠 𝑎𝑛𝑑 𝑚𝑎𝑛𝑖𝑝𝑢𝑙𝑎𝑡𝑖𝑣𝑒 𝑖𝑓 𝑛𝑜𝑡 𝑐𝑎𝑟𝑒𝑓𝑢𝑙. 𝑇ℎ𝑒𝑦 𝑛𝑒𝑒𝑑 𝑡𝑜 𝑓𝑜𝑐𝑢𝑠 𝑡ℎ𝑒𝑖𝑟 𝑒𝑛𝑒𝑟𝑔𝑦 𝑎𝑛𝑑 𝑎𝑣𝑜𝑖𝑑 𝑏𝑒𝑖𝑛𝑔 𝑜𝑝𝑝𝑜𝑟𝑡𝑢𝑛𝑖𝑠𝑡𝑖𝑐.",
      image: "thân.jpg"
    },
    10: {
      body: "🐓 𝑅𝑜𝑜𝑠𝑡𝑒𝑟 (𝐷ậ𝑢) - (17:00-19:00)\n\n𝑅𝑜𝑜𝑠𝑡𝑒𝑟𝑠 𝑎𝑟𝑒 𝑜𝑏𝑠𝑒𝑟𝑣𝑎𝑛𝑡, ℎ𝑎𝑟𝑑𝑤𝑜𝑟𝑘𝑖𝑛𝑔, 𝑎𝑛𝑑 𝑐𝑜𝑢𝑟𝑎𝑔𝑒𝑜𝑢𝑠. 𝑇ℎ𝑒𝑦 𝑎𝑟𝑒 𝑑𝑒𝑡𝑎𝑖𝑙-𝑜𝑟𝑖𝑒𝑛𝑡𝑒𝑑 𝑎𝑛𝑑 𝑔𝑜𝑜𝑑 𝑎𝑡 𝑝𝑙𝑎𝑛𝑛𝑖𝑛𝑔. 𝑅𝑜𝑜𝑠𝑡𝑒𝑟𝑠 𝑐𝑎𝑛 𝑏𝑒 𝑐𝑟𝑖𝑡𝑖𝑐𝑎𝑙 𝑎𝑛𝑑 𝑝𝑒𝑟𝑓𝑒𝑐𝑡𝑖𝑜𝑛𝑖𝑠𝑡𝑖𝑐. 𝑇ℎ𝑒𝑦 𝑛𝑒𝑒𝑑 𝑡𝑜 𝑏𝑒 𝑚𝑜𝑟𝑒 𝑓𝑙𝑒𝑥𝑖𝑏𝑙𝑒 𝑎𝑛𝑑 𝑙𝑒𝑠𝑠 𝑑𝑒𝑚𝑎𝑛𝑑𝑖𝑛𝑔 𝑜𝑓 𝑜𝑡ℎ𝑒𝑟𝑠.",
      image: "dậu.jpg"
    },
    11: {
      body: "🐕 𝐷𝑜𝑔 (𝑇𝑢ấ𝑡) - (19:00-21:00)\n\n𝐷𝑜𝑔𝑠 𝑎𝑟𝑒 𝑙𝑜𝑦𝑎𝑙, ℎ𝑜𝑛𝑒𝑠𝑡, 𝑎𝑛𝑑 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑖𝑏𝑙𝑒. 𝑇ℎ𝑒𝑦 ℎ𝑎𝑣𝑒 𝑠𝑡𝑟𝑜𝑛𝑔 𝑚𝑜𝑟𝑎𝑙𝑠 𝑎𝑛𝑑 𝑝𝑟𝑜𝑡𝑒𝑐𝑡 𝑙𝑜𝑣𝑒𝑑 𝑜𝑛𝑒𝑠. 𝐷𝑜𝑔𝑠 𝑐𝑎𝑛 𝑏𝑒 𝑎𝑛𝑥𝑖𝑜𝑢𝑠 𝑎𝑛𝑑 𝑝𝑒𝑠𝑠𝑖𝑚𝑖𝑠𝑡𝑖𝑐. 𝑇ℎ𝑒𝑦 𝑛𝑒𝑒𝑑 𝑡𝑜 𝑟𝑒𝑙𝑎𝑥 𝑚𝑜𝑟𝑒 𝑎𝑛𝑑 𝑛𝑜𝑡 𝑤𝑜𝑟𝑟𝑦 𝑒𝑥𝑐𝑒𝑠𝑠𝑖𝑣𝑒𝑙𝑦 𝑎𝑏𝑜𝑢𝑡 𝑝𝑟𝑜𝑏𝑙𝑒𝑚𝑠.",
      image: "tuất.jpg"
    },
    12: {
      body: "🐖 𝑃𝑖𝑔 (𝐻ợ𝑖) - (21:00-23:00)\n\n𝑃𝑖𝑔𝑠 𝑎𝑟𝑒 𝑔𝑒𝑛𝑒𝑟𝑜𝑢𝑠, 𝑑𝑖𝑙𝑖𝑔𝑒𝑛𝑡, 𝑎𝑛𝑑 𝑐𝑜𝑚𝑝𝑎𝑠𝑠𝑖𝑜𝑛𝑎𝑡𝑒. 𝑇ℎ𝑒𝑦 𝑒𝑛𝑗𝑜𝑦 𝑙𝑖𝑓𝑒'𝑠 𝑝𝑙𝑒𝑎𝑠𝑢𝑟𝑒𝑠 𝑎𝑛𝑑 𝑎𝑟𝑒 𝑔𝑜𝑜𝑑 𝑐𝑜𝑚𝑝𝑎𝑛𝑖𝑜𝑛𝑠. 𝑃𝑖𝑔𝑠 𝑐𝑎𝑛 𝑏𝑒 𝑛𝑎ï𝑣𝑒 𝑎𝑛𝑑 𝑜𝑣𝑒𝑟-𝑡𝑟𝑢𝑠𝑡𝑖𝑛𝑔. 𝑇ℎ𝑒𝑦 𝑛𝑒𝑒𝑑 𝑡𝑜 𝑏𝑒 𝑚𝑜𝑟𝑒 𝑑𝑖𝑠𝑐𝑒𝑟𝑛𝑖𝑛𝑔 𝑤𝑖𝑡ℎ 𝑝𝑒𝑜𝑝𝑙𝑒 𝑎𝑛𝑑 𝑚𝑎𝑛𝑎𝑔𝑒 𝑟𝑒𝑠𝑜𝑢𝑟𝑐𝑒𝑠 𝑤𝑖𝑠𝑒𝑙𝑦.",
      image: "hợi.jpg"
    }
  },

  onStart: async function({ api, event, message }) {
    // Create cache directory if not exists
    if (!fs.existsSync(this.ZODIAC_DIR)) {
      fs.mkdirSync(this.ZODIAC_DIR, { recursive: true });
    }

    const menuMessage = `
🐉 𝑍𝑜𝑑𝑖𝑎𝑐 𝐴𝑛𝑖𝑚𝑎𝑙𝑠 𝐼𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 🐉
━━━━━━━━━━━━━━━━━━━━━

𝐶ℎ𝑜𝑜𝑠𝑒 𝑎 𝑧𝑜𝑑𝑖𝑎𝑐 𝑎𝑛𝑖𝑚𝑎𝑙:
1. 𝑅𝑎𝑡 (𝑇ý) 🐭
2. 𝑂𝑥 (𝑆ử𝑢) 🐂
3. 𝑇𝑖𝑔𝑒𝑟 (𝐷ầ𝑛) 🐅
4. 𝐶𝑎𝑡 (𝑀ã𝑜) 🐈
5. 𝐷𝑟𝑎𝑔𝑜𝑛 (𝑇ℎì𝑛) 🐉
6. 𝑆𝑛𝑎𝑘𝑒 (𝑇ỵ) 🐍
7. 𝐻𝑜𝑟𝑠𝑒 (𝑁𝑔ọ) 🐎
8. 𝐺𝑜𝑎𝑡 (𝑀ù𝑖) 🐐
9. 𝑀𝑜𝑛𝑘𝑒𝑦 (𝑇ℎâ𝑛) 🐒
10. 𝑅𝑜𝑜𝑠𝑡𝑒𝑟 (𝐷ậ𝑢) 🐓
11. 𝐷𝑜𝑔 (𝑇𝑢ấ𝑡) 🐕
12. 𝑃𝑖𝑔 (𝐻ợ𝑖) 🐖

𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 𝑜𝑓 𝑦𝑜𝑢𝑟 𝑐ℎ𝑜𝑖𝑐𝑒 (1-12)`;

    const sentMessage = await message.reply(menuMessage);
    
    // Store reply handler
    global.zodiacReply = global.zodiacReply || new Map();
    global.zodiacReply.set(sentMessage.messageID, {
      commandName: this.config.name,
      author: event.senderID
    });
  },

  onReply: async function({ api, event, message }) {
    const { threadID, messageID, body } = event;
    const choice = parseInt(body);

    if (isNaN(choice) || choice < 1 || choice > 12) {
      return message.reply("⚠️ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐ℎ𝑜𝑖𝑐𝑒! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑒𝑙𝑒𝑐𝑡 𝑎 𝑛𝑢𝑚𝑏𝑒𝑟 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 1-12");
    }

    try {
      const zodiac = this.ZODIAC_DATA[choice];
      const imagePath = path.join(this.ZODIAC_DIR, zodiac.image);
      const animal = zodiac.image.split('.')[0];
      
      if (!fs.existsSync(imagePath)) {
        await message.reply("⏳ 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑧𝑜𝑑𝑖𝑎𝑐 𝑖𝑚𝑎𝑔𝑒...");
        
        const url = this.IMAGE_URLS[animal];
        if (url) {
          try {
            const response = await axios.get(url, {
              responseType: 'arraybuffer',
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            });
            await fs.writeFile(imagePath, Buffer.from(response.data, 'binary'));
          } catch (error) {
            return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑧𝑜𝑑𝑖𝑎𝑐 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
          }
        } else {
          return message.reply("⚠️ 𝐼𝑚𝑎𝑔𝑒 𝑈𝑅𝐿 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑧𝑜𝑑𝑖𝑎𝑐 𝑠𝑖𝑔𝑛");
        }
      }

      await message.reply({
        body: zodiac.body,
        attachment: fs.createReadStream(imagePath)
      });
      
    } catch (error) {
      console.error("𝑍𝑜𝑑𝑖𝑎𝑐 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑧𝑜𝑑𝑖𝑎𝑐 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
