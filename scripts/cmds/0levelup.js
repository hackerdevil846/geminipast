const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "0levelup",
    version: "7.6.8",
    author: "Asif Mahmud",
    countDown: 2,
    role: 1,
    category: "system",
    shortDescription: { en: "Announce level up for group/user" },
    longDescription: { en: "Automatically announces when a user levels up" },
    guide: { en: "{p}0levelup [on/off]" },
    dependencies: { "canvas": "", "fs-extra": "", "axios": "" }
  },

  langs: {
    en: {
      on: "On",
      off: "Off",
      successText: "Successfully toggled rankup notifications!",
      levelup: "💫 ওমা! {name} লেভেল {level} এ পৌঁছেছে! এখন আরও বেশি অ্যাটিটিউড! 😎 অভিনন্দন এবার আরও বেশি ডিস্টার্ব করবে সবাইকে!"
    }
  },

  onStart: async function({ api, event, args, threadsData, getText }) {
    const { threadID, messageID } = event;
    let data = (await threadsData.get(threadID)).data || {};
    if (args[0] === "on") data.rankup = true;
    else if (args[0] === "off") data.rankup = false;
    else data.rankup = !data.rankup;
    await threadsData.set(threadID, { data });
    return api.sendMessage(
      `${data.rankup ? getText("on") : getText("off")} ${getText("successText")}`,
      threadID,
      messageID
    );
  },

  onChat: async function({ api, event, usersData, threadsData }) {
    try {
      // Skip processing if this is not a standard message
      if (!event.body) return;

      const { threadID, senderID } = event;
      const threadData = await threadsData.get(threadID);

      // Ensure user data exists and initialize exp if needed
      let userData = (await usersData.get(senderID)) || {};
      if (typeof userData.exp !== "number") userData.exp = 0;
      userData.exp += 1;  // increment exp

      // If rank notifications are off, just save exp and exit
      if (threadData.data?.rankup === false) {
        await usersData.set(senderID, userData);
        return;
      }

      // Calculate levels (using formula from original code)
      const exp = userData.exp;
      const curLevel = Math.floor((Math.sqrt(1 + (4 * exp) / 3 + 1) / 2));
      const nextLevel = Math.floor((Math.sqrt(1 + (4 * (exp + 1)) / 3 + 1) / 2));

      // Check if level increased
      if (nextLevel > curLevel && nextLevel > 1) {
        const name = await usersData.getName(senderID);
        
        // FIXED: Use direct text instead of getText function
        let message = "💫 ওমা! {name} লেভেল {level} এ পৌঁছেছে! এখন আরও বেশি অ্যাটিটিউড! 😎 অভিনন্দন এবার আরও বেশি ডিস্টার্ব করবে সবাইকে!"
          .replace(/\{name}/g, name)
          .replace(/\{level}/g, nextLevel);

        const pathImg = __dirname + "/cache/rankup.png";
        const pathAvt1 = __dirname + "/cache/Avtmot.png";
        
        // ALL LINKS PRESERVED EXACTLY AS ORIGINAL
        const backgrounds = [
          "https://i.ibb.co/DffbB7x/2-7-BDCACE.png",
          "https://i.ibb.co/606p1ZF/1-C0-CF112.png",
          "https://i.ibb.co/54b5KY6/3-10100-BC.png",
          "https://i.ibb.co/4RHd3mM/4-AB4-CF2-B.png",
          "https://i.ibb.co/7WHKF0H/9-498-C5-E0.png",
          "https://i.ibb.co/nPfY3HN/8-ADA7767.png",
          "https://i.ibb.co/Ldctgw4/5-49-F92-DC.png",
          "https://i.ibb.co/J29hdFW/6-EB49-EF4.png"
        ];
        const bgUrl = backgrounds[Math.floor(Math.random() * backgrounds.length)];

        // Download user avatar (binary image) - LINK PRESERVED
        const avatarRes = await axios.get(
          `https://graph.facebook.com/${senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { responseType: "arraybuffer" }
        );
        fs.writeFileSync(pathAvt1, Buffer.from(avatarRes.data));

        // Download background (binary image)
        const bgRes = await axios.get(bgUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(pathImg, Buffer.from(bgRes.data));

        // Create rank-up image
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

        // Send level-up message with the generated image
        await api.sendMessage(
          { 
            body: message, 
            mentions: [{ tag: name, id: senderID }], 
            attachment: fs.createReadStream(pathImg) 
          },
          threadID
        );
        fs.unlinkSync(pathImg);
      }

      // Save updated exp
      await usersData.set(senderID, userData);

    } catch (error) {
      console.error("Rankup Error:", error);
    }
  }
};
