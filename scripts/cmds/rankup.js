const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "rankup",
    version: "7.6.8",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 2,
    role: 1,
    category: "system",
    shortDescription: {
      en: "𝐴𝑛𝑛𝑜𝑢𝑛𝑐𝑒 𝑟𝑎𝑛𝑘𝑢𝑝 𝑓𝑜𝑟 𝑒𝑎𝑐ℎ 𝑔𝑟𝑜𝑢𝑝/𝑢𝑠𝑒𝑟"
    },
    longDescription: {
      en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑎𝑛𝑛𝑜𝑢𝑛𝑐𝑒𝑠 𝑤ℎ𝑒𝑛 𝑎 𝑢𝑠𝑒𝑟 𝑙𝑒𝑣𝑒𝑙𝑠 𝑢𝑝"
    },
    guide: {
      en: "{p}rankup [𝑜𝑛/𝑜𝑓𝑓]"
    },
    dependencies: {
      "canvas": "",
      "fs-extra": "",
      "axios": ""
    }
  },

  langs: {
    en: {
      on: "𝑂𝑛",
      off: "𝑂𝑓𝑓",
      successText: "𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑡𝑜𝑔𝑔𝑙𝑒𝑑 𝑟𝑎𝑛𝑘𝑢𝑝 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛𝑠!",
      levelup: "💫 ওমা! {name} লেভেল {level} এ পৌঁছেছে! এখন আরও বেশি অ্যাটিটিউড!😎অভিনন্দন এবার বেশি মজা পাবেন সবাই!"
    }
  },

  onStart: async function({ api, event, args, threadsData, getText }) {
    const { threadID, messageID } = event;
    let data = (await threadsData.get(threadID)).data || {};

    if (args[0] === "on") {
      data.rankup = true;
    } else if (args[0] === "off") {
      data.rankup = false;
    } else {
      data.rankup = !data.rankup;
    }

    await threadsData.set(threadID, { data });
    return api.sendMessage(`${(data.rankup == true) ? getText("on") : getText("off")} ${getText("successText")}`, threadID, messageID);
  },

  onChat: async function({ api, event, usersData, threadsData, getText }) {
    try {
      const { threadID, senderID } = event;
      
      // Get thread data first
      const threadData = await threadsData.get(threadID);
      
      // Check if rankup is disabled - if yes, just add exp and return
      if (threadData.data?.rankup === false) {
        const currentUserData = await usersData.get(senderID);
        const currentExp = currentUserData.exp || 0;
        await usersData.set(senderID, { exp: currentExp + 1 });
        return;
      }

      // Get current user data and increment exp
      const currentUserData = await usersData.get(senderID);
      let exp = currentUserData.exp || 0;
      exp = exp + 1;

      if (isNaN(exp)) return;

      // Calculate current and next level
      const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
      const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3) + 1) / 2));

      // Check if level up occurred
      if (level > curLevel && level != 1) {
        const name = await usersData.getName(senderID);
        let message = getText("levelup")
          .replace(/\{name}/g, name)
          .replace(/\{level}/g, level);

        const pathImg = __dirname + "/cache/rankup.png";
        const pathAvt1 = __dirname + "/cache/Avtmot.png";

        // Background links - ALL ORIGINAL LINKS PRESERVED
        const background = [
          "https://i.ibb.co/DffbB7x/2-7-BDCACE.png",
          "https://i.ibb.co/606p1ZF/1-C0-CF112.png", 
          "https://i.ibb.co/54b5KY6/3-10100-BC.png",
          "https://i.ibb.co/4RHd3mM/4-AB4-CF2-B.png",
          "https://i.ibb.co/7WHKF0H/9-498-C5-E0.png",
          "https://i.ibb.co/nPfY3HN/8-ADA7767.png",
          "https://i.ibb.co/Ldctgw4/5-49-F92-DC.png",
          "https://i.ibb.co/J29hdFW/6-EB49-EF4.png"
        ];

        const rd = background[Math.floor(Math.random() * background.length)];
        
        // Download user avatar - ORIGINAL LINK PRESERVED
        const getAvtmot = (await axios.get(
          `https://graph.facebook.com/${senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { responseType: "arraybuffer" }
        )).data;
        fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));

        // Download background
        const getbackground = (await axios.get(rd, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

        // Create rankup image
        let baseImage = await loadImage(pathImg);
        let baseAvt1 = await loadImage(pathAvt1);
        let canvas = createCanvas(baseImage.width, baseImage.height);
        let ctx = canvas.getContext("2d");
        
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        ctx.rotate(-25 * Math.PI / 180);
        ctx.drawImage(baseAvt1, 90, 330, 340, 340);
        
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        fs.removeSync(pathAvt1);

        // Send rankup notification
        await api.sendMessage({
          body: message, 
          mentions: [{ tag: name, id: senderID }], 
          attachment: fs.createReadStream(pathImg)
        }, threadID);

        fs.unlinkSync(pathImg);
      }

      // Update user exp
      await usersData.set(senderID, { exp: exp });
      
    } catch (error) {
      console.error("𝑅𝑎𝑛𝑘𝑢𝑝 𝐸𝑟𝑟𝑜𝑟:", error);
    }
  }
};
