const fs = require('fs-extra');
const path = require('path');
const { createCanvas } = require('canvas');

module.exports = {
  config: {
    name: "petmonsters",
    aliases: ["monstergame", "petgame"],
    version: "2.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    category: "⚔️ 𝑮𝒂𝒎𝒆",
    shortDescription: {
      en: "🐉 𝑷𝒆𝒕 𝑴𝒐𝒏𝒔𝒕𝒆𝒓𝒔 𝑹𝒐𝒍𝒆𝒑𝒍𝒂𝒚 𝑮𝒂𝒎𝒆"
    },
    longDescription: {
      en: "🐉 𝑬𝒙𝒑𝒍𝒐𝒓𝒆 𝒂 𝒇𝒂𝒏𝒕𝒂𝒔𝒚 𝒘𝒐𝒓𝒍𝒅 𝒘𝒊𝒕𝒉 𝒚𝒐𝒖𝒓 𝒑𝒆𝒕 𝒎𝒐𝒏𝒔𝒕𝒆𝒓𝒔"
    },
    guide: {
      en: "{𝑝}petmonsters -[𝒐𝒑𝒕𝒊𝒐𝒏]"
    },
    dependencies: {
      "canvas": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ api, event, args, usersData }) {
    try {
      // Dependency check
      if (!createCanvas) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑐𝑎𝑛𝑣𝑎𝑠");
      if (!fs) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");

      const userInfo = await usersData.get(event.senderID);
      const userName = userInfo.name || "𝑨𝒅𝒗𝒆𝒏𝒕𝒖𝒓𝒆𝒓";

      if (!args[0]) {
        const menu = `
🌟 𝑷𝑬𝑻 𝑴𝑶𝑵𝑺𝑻𝑬𝑹𝑺 𝑮𝑨𝑴𝑬 🌟
━━━━━━━━━━━━━━━━━━━━━
🔹 -r » 𝑹𝒆𝒈𝒊𝒔𝒕𝒆𝒓 𝒇𝒐𝒓 𝒂𝒏 𝒂𝒄𝒄𝒐𝒖𝒏𝒕
🛒 -s » 𝑽𝒊𝒔𝒊𝒕 𝒕𝒉𝒆 𝒔𝒉𝒐𝒑
📜 -l » 𝑳𝒆𝒂𝒓𝒏 𝒂𝒃𝒐𝒖𝒕 𝒎𝒐𝒏𝒔𝒕𝒆𝒓𝒔
🎮 -p » 𝑺𝒕𝒂𝒓𝒕 𝒑𝒍𝒂𝒚𝒊𝒏𝒈
━━━━━━━━━━━━━━━━━━━━━
📌 𝑼𝒔𝒂𝒈𝒆: 𝒑𝒆𝒕𝒎𝒐𝒏𝒔𝒕𝒆𝒓𝒔 -[𝒐𝒑𝒕𝒊𝒐𝒏]`;
        return api.sendMessage(menu, event.threadID, event.messageID);
      }

      switch(args[0]) {
        case "-r":
          try {
            const imgBuffer = await this.generateWelcomeImage(userName);
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
              fs.mkdirSync(cacheDir, { recursive: true });
            }
            
            const imgPath = path.join(cacheDir, 'pet_welcome.jpg');
            fs.writeFileSync(imgPath, imgBuffer);
            
            return api.sendMessage({
              body: `🎉 𝑾𝒆𝒍𝒄𝒐𝒎𝒆 ${userName}! 𝑹𝒆𝒈𝒊𝒔𝒕𝒓𝒂𝒕𝒊𝒐𝒏 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍! 🎉\n━━━━━━━━━━━━━━━━━━━━━\n"𝑩𝒓𝒐 𝒔𝒐𝒎𝒎𝒖𝒉𝒊𝒕𝒐 𝒄𝒐𝒂𝒄𝒉 𝒉𝒐𝒍𝒐"`,
              attachment: fs.createReadStream(imgPath)
            }, event.threadID, () => {
              try {
                fs.unlinkSync(imgPath);
              } catch (e) {}
            }, event.messageID);
          } catch (e) {
            console.error("𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝒊𝒎𝒂𝒈𝒆 𝒆𝒓𝒓𝒐𝒓:", e);
            return api.sendMessage("❌ 𝑬𝒓𝒓𝒐𝒓 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒏𝒈 𝒘𝒆𝒍𝒄𝒐𝒎𝒆 𝒊𝒎𝒂𝒈𝒆!", event.threadID, event.messageID);
          }

        case "-s":
          const shop = `
🛍️ 𝗣𝗘𝗧𝗠𝗢𝗡𝗦𝗧𝗘𝗥𝗦 𝗦𝗛𝗢𝗣 🛍️
━━━━━━━━━━━━━━━━━━━━━
1. 🍖 𝑭𝑶𝑶𝑫
2. ⚔️ 𝑾𝑬𝑨𝑷𝑶𝑵𝑺
3. 🛡️ 𝑨𝑹𝑴𝑶𝑹
4. 🐾 𝑷𝑬𝑻 𝑺𝑼𝑷𝑷𝑳𝑰𝑬𝑺
━━━━━━━━━━━━━━━━━━━━━
📌 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒊𝒕𝒆𝒎 𝒏𝒖𝒎𝒃𝒆𝒓 𝒕𝒐 𝒃𝒖𝒚`;
          return api.sendMessage(shop, event.threadID, (e, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "SHOP_MENU"
            });
          });

        case "-l":
          const monsters = `
📚 𝗠𝗢𝗡𝗦𝗧𝗘𝗥 𝗟𝗜𝗕𝗥𝗔𝗥𝗬 📚
━━━━━━━━━━━━━━━━━━━━━
1. 🔥 𝑭𝒊𝒓𝒆 𝑺𝒚𝒔𝒕𝒆𝒎 𝑷𝒆𝒕
2. 💧 𝑾𝒂𝒕𝒆𝒓 𝑺𝒚𝒔𝒕𝒆𝒎 𝑷𝒆𝒕
3. 🌍 𝑬𝒂𝒓𝒕𝒉 𝑺𝒚𝒔𝒕𝒆𝒎 𝑷𝒆𝒕
4. 🌿 𝑮𝒓𝒂𝒔𝒔 𝑺𝒚𝒔𝒕𝒆𝒎 𝑷𝒆𝒕
5. ✨ 𝑳𝒊𝒈𝒉𝒕 𝑺𝒚𝒔𝒕𝒆𝒎 𝑷𝒆𝒕
6. 🌑 𝑫𝒂𝒓𝒌 𝑺𝒚𝒔𝒕𝒆𝒎 𝑷𝒆𝒕
━━━━━━━━━━━━━━━━━━━━━
📌 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒏𝒖𝒎𝒃𝒆𝒓 𝒕𝒐 𝒗𝒊𝒆𝒘 𝒅𝒆𝒕𝒂𝒊𝒍𝒔`;
          return api.sendMessage(monsters, event.threadID, (e, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "MONSTER_INFO"
            });
          });

        case "-p":
          return api.sendMessage("🎮 𝑮𝒂𝒎𝒆 𝑺𝒕𝒂𝒓𝒕𝒆𝒅!\n━━━━━━━━━━━━━━━━━━━━━\n𝑨𝒔𝒄𝒉𝒆 𝒂𝒏𝒆𝒌𝒆 𝒂𝒔𝒃𝒆...", event.threadID, event.messageID);

        default:
          return api.sendMessage("⚠️ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒐𝒑𝒕𝒊𝒐𝒏! 𝑼𝒔𝒆 -𝒉 𝒇𝒐𝒓 𝒉𝒆𝒍𝒑", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error("𝑷𝒆𝒕 𝑴𝒐𝒏𝒔𝒕𝒆𝒓𝒔 𝑬𝒓𝒓𝒐𝒓:", error);
      return api.sendMessage("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.", event.threadID, event.messageID);
    }
  },

  handleReply: async function({ api, event, handleReply }) {
    if (event.senderID != handleReply.author) return;

    switch(handleReply.type) {
      case "SHOP_MENU":
        switch(event.body) {
          case "1":
            const food = `
🍖 𝗙𝗢𝗢𝗗 𝗦𝗧𝗢𝗥𝗘 🍗
━━━━━━━━━━━━━━━━━━━━━
1. 🐟 𝑭𝒊𝒔𝒉 » 💲100 
   ▸ "𝑩𝒊𝒌𝒓𝒊𝒕𝒆 𝒌𝒂𝒓𝒕𝒆 <3 𝒅𝒓𝒐𝒑 𝒌𝒐𝒓𝒖𝒏"
   
2. 🍲 𝑪𝒐𝒖𝒏𝒕𝒓𝒚 𝑫𝒊𝒔𝒉 » 💲100 
   ▸ "𝑩𝒊𝒌𝒓𝒊𝒕𝒆 𝒌𝒂𝒓𝒕𝒆 👍 𝒅𝒓𝒐𝒑 𝒌𝒐𝒓𝒖𝒏"
   
3. 🍎 𝑭𝒓𝒖𝒊𝒕 𝑩𝒂𝒔𝒌𝒆𝒕 » 💲100 
   ▸ "𝑩𝒊𝒌𝒓𝒊𝒕𝒆 𝒌𝒂𝒓𝒕𝒆 😢 𝒅𝒓𝒐𝒑 𝒌𝒐𝒓𝒖𝒏"
━━━━━━━━━━━━━━━━━━━━━
📌 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒊𝒕𝒆𝒎 𝒏𝒖𝒎𝒃𝒆𝒓 𝒕𝒐 𝒑𝒖𝒓𝒄𝒉𝒂𝒔𝒆`;
            api.sendMessage(food, event.threadID, event.messageID);
            break;
            
          case "2":
            const weapons = `
⚔️ 𝗪𝗘𝗔𝗣𝗢𝗡𝗦 𝗦𝗧𝗢𝗥𝗘 ⚔️
━━━━━━━━━━━━━━━━━━━━━
1. 🗡️ 𝑫𝒓𝒂𝒈𝒐𝒏𝒔𝒍𝒂𝒚𝒆𝒓 𝑺𝒘𝒐𝒓𝒅 » 💲500
2. 🔫 𝑷𝒉𝒐𝒆𝒏𝒊𝒙 𝑩𝒍𝒂𝒔𝒕𝒆𝒓 » 💲1200
3. 🛡️ 𝑪𝒆𝒍𝒆𝒔𝒕𝒊𝒂𝒍 𝑺𝒉𝒊𝒆𝒍𝒅 » 💲800
━━━━━━━━━━━━━━━━━━━━━
📌 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒊𝒕𝒆𝒎 𝒏𝒖𝒎𝒃𝒆𝒓 𝒕𝒐 𝒑𝒖𝒓𝒄𝒉𝒂𝒔𝒆`;
            api.sendMessage(weapons, event.threadID, event.messageID);
            break;
            
          case "3":
            api.sendMessage("🛡️ 𝗔𝗥𝗠𝗢𝗥 𝗦𝗧𝗢𝗥𝗘\n━━━━━━━━━━━━━━━━━━━━━\n𝑨𝒔𝒄𝒉𝒆 𝒂𝒏𝒆𝒌𝒆 𝒂𝒔𝒃𝒆...", event.threadID, event.messageID);
            break;
            
          case "4":
            api.sendMessage("🐾 𝗣𝗘𝗧 𝗦𝗨𝗣𝗣𝗟𝗜𝗘𝗦\n━━━━━━━━━━━━━━━━━━━━━\n𝑪𝒐𝒎𝒊𝒏𝒈 𝒔𝒐𝒐𝒏...", event.threadID, event.messageID);
            break;
        }
        break;
        
      case "MONSTER_INFO":
        switch(event.body) {
          case "1":
            api.sendMessage(
              `🔥 𝗙𝗜𝗥𝗘 𝗦𝗬𝗦𝗧𝗘𝗠 𝗣𝗘𝗧 🔥\n━━━━━━━━━━━━━━━━━━━━━\n` +
              `𝑵𝒂𝒎𝒆: 𝑻𝒉𝒓𝒆𝒆 𝑯𝒆𝒂𝒅𝒆𝒅 𝑯𝒆𝒍𝒍𝒉𝒐𝒖𝒏𝒅\n` +
              `𝑻𝒚𝒑𝒆: 𝑰𝒏𝒇𝒆𝒓𝒏𝒐\n` +
              `❤️ 𝑯𝑷: 120\n` +
              `⚔️ 𝑨𝒕𝒕𝒂𝒄𝒌: 150\n` +
              `🌟 𝑺𝒑𝒆𝒄𝒊𝒂𝒍: 𝑯𝒆𝒍𝒍𝒇𝒊𝒓𝒆 𝑩𝒓𝒆𝒂𝒕𝒉`,
              event.threadID,
              event.messageID
            );
            break;
            
          case "2":
            api.sendMessage(
              `💧 𝗪𝗔𝗧𝗘𝗥 𝗦𝗬𝗘𝗦𝗧𝗘𝗠 𝗣𝗘𝗧 💧\n━━━━━━━━━━━━━━━━━━━━━\n` +
              `𝑵𝒂𝒎𝒆: 𝑨𝒃𝒚𝒔𝒔𝒂𝒍 𝑳𝒆𝒗𝒊𝒂𝒕𝒉𝒂𝒏\n` +
              `𝑻𝒚𝒑𝒆: 𝑨𝒒𝒖𝒂𝒕𝒊𝒄\n` +
              `❤️ 𝑯𝑷: 140\n` +
              `⚔️ 𝑨𝒕𝒕𝒂𝒄𝒌: 130\n` +
              `🌟 𝑺𝒑𝒆𝒄𝒊𝒂𝒍: 𝑻𝒔𝒖𝒏𝒂𝒎𝒊 𝑪𝒓𝒖𝒔𝒉`,
              event.threadID,
              event.messageID
            );
            break;
            
          case "3":
            api.sendMessage(
              `🌍 𝗘𝗔𝗥𝗧𝗛 𝗦𝗬𝗦𝗧𝗘𝗠 𝗣𝗘𝗧 🌍\n━━━━━━━━━━━━━━━━━━━━━\n` +
              `𝑵𝒂𝒎𝒆: 𝑮𝒓𝒂𝒏𝒊𝒕𝒆 𝑮𝒐𝒍𝒆𝒎\n` +
              `𝑻𝒚𝒑𝒆: 𝑻𝒆𝒓𝒓𝒂\n` +
              `❤️ 𝑯𝑷: 180\n` +
              `⚔️ 𝑨𝒕𝒕𝒂𝒄𝒌: 110\n` +
              `🌟 𝑺𝒑𝒆𝒄𝒊𝒂𝒍: 𝑺𝒆𝒊𝒔𝒎𝒊𝒄 𝑺𝒍𝒂𝒎`,
              event.threadID,
              event.messageID
            );
            break;
            
          case "4":
            api.sendMessage(
              `🌿 𝗚𝗥𝗔𝗦𝗦 𝗦𝗬𝗦𝗧𝗘𝗠 𝗣𝗘𝗧 🌿\n━━━━━━━━━━━━━━━━━━━━━\n` +
              `𝑵𝒂𝒎𝒆: 𝑽𝒆𝒏𝒐𝒎𝒐𝒖𝒔 𝑽𝒊𝒏𝒆𝒔𝒏𝒂𝒌𝒆\n` +
              `𝑻𝒚𝒑𝒆: 𝑭𝒍𝒐𝒓𝒂\n` +
              `❤️ 𝑯𝑷: 100\n` +
              `⚔️ 𝑨𝒕𝒕𝒂𝒄𝒌: 140\n` +
              `🌟 𝑺𝒑𝒆𝒄𝒊𝒂𝒍: 𝑷𝒐𝒊𝒔𝒐𝒏 𝑺𝒑𝒓𝒐𝒖𝒕`,
              event.threadID,
              event.messageID
            );
            break;
            
          case "5":
            api.sendMessage(
              `✨ 𝗟𝗜𝗚𝗛𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 𝗣𝗘𝗧 ✨\n━━━━━━━━━━━━━━━━━━━━━\n` +
              `𝑵𝒂𝒎𝒆: 𝑪𝒆𝒍𝒆𝒔𝒕𝒊𝒂𝒍 𝑷𝒉𝒐𝒆𝒏𝒊𝒙\n` +
              `𝑻𝒚𝒑𝒆: 𝑳𝒖𝒎𝒊𝒏𝒐𝒖𝒔\n` +
              `❤️ 𝑯𝑷: 130\n` +
              `⚔️ 𝑨𝒕𝒕𝒂𝒄𝒌: 160\n` +
              `🌟 𝑺𝒑𝒆𝒄𝒊𝒂𝒍: 𝑺𝒐𝒍𝒂𝒓 𝑭𝒍𝒂𝒓𝒆`,
              event.threadID,
              event.messageID
            );
            break;
            
          case "6":
            api.sendMessage(
              `🌑 𝗗𝗔𝗥𝗞 𝗦𝗬𝗦𝗧𝗘𝗠 𝗣𝗘𝗧 🌑\n━━━━━━━━━━━━━━━━━━━━━\n` +
              `𝑵𝒂𝒎𝒆: 𝑺𝒉𝒂𝒅𝒐𝒘 𝑺𝒑𝒆𝒄𝒕𝒆𝒓\n` +
              `𝑻𝒚𝒑𝒆: 𝑼𝒎𝒃𝒓𝒂\n` +
              `❤️ 𝑯𝑷: 90\n` +
              `⚔️ 𝑨𝒕𝒕𝒂𝒄𝒌: 170\n` +
              `🌟 𝑺𝒑𝒆𝒄𝒊𝒂𝒍: 𝑽𝒐𝒊𝒑𝒅 𝑪𝒐𝒏𝒔𝒖𝒎𝒆`,
              event.threadID,
              event.messageID
            );
            break;
        }
        break;
    }
  },

  generateWelcomeImage: async function(name) {
    const width = 700;
    const height = 350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1a2980');
    gradient.addColorStop(1, '#26d0ce');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 50; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Title
    ctx.font = 'bold 40px "Arial"';
    ctx.fillStyle = '#f1c40f';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.fillText('🐲 𝑷𝑬𝑻 𝑴𝑶𝑵𝑺𝑻𝑬𝑹𝑺 🐉', width / 2, 80);

    // Player Name
    ctx.font = 'bold 30px "Arial"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`𝑾𝒆𝒍𝒄𝒐𝒎𝒆, ${name}!`, width / 2, 150);

    // Game Tip
    ctx.font = 'italic 25px "Arial"';
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText('𝑩𝒆𝒈𝒊𝒏 𝒚𝒐𝒖𝒓 𝒋𝒐𝒖𝒓𝒏𝒆𝒚 𝒕𝒐𝒅𝒂𝒚!', width / 2, 200);

    // Decorative dragons
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.moveTo(100, 300);
    ctx.bezierCurveTo(120, 280, 140, 320, 160, 300);
    ctx.bezierCurveTo(180, 280, 200, 320, 220, 300);
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fill();

    ctx.fillStyle = '#3498db';
    ctx.beginPath();
    ctx.moveTo(600, 300);
    ctx.bezierCurveTo(580, 280, 560, 320, 540, 300);
    ctx.bezierCurveTo(520, 280, 500, 320, 480, 300);
    ctx.stroke();
    ctx.fill();

    return canvas.toBuffer('image/jpeg');
  }
};
