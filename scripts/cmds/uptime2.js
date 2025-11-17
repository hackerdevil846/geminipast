const fs = require("fs-extra");
const axios = require("axios");
const os = require("os");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports = {
  config: {
    name: "uptime2",
    aliases: ["upt2", "botinfo2"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 1,
    category: "system",
    shortDescription: {
      en: "📊 𝑆ℎ𝑜𝑤 𝑏𝑜𝑡 𝑢𝑝𝑡𝑖𝑚𝑒 𝑎𝑛𝑑 𝑠𝑦𝑠𝑡𝑒𝑚 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑤𝑖𝑡ℎ 𝑎𝑛𝑖𝑚𝑒 𝑡ℎ𝑒𝑚𝑒"
    },
    longDescription: {
      en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑠𝑦𝑠𝑡𝑒𝑚 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑤𝑖𝑡ℎ 𝑎𝑛𝑖𝑚𝑒-𝑡ℎ𝑒𝑚𝑒𝑑 𝑔𝑟𝑎𝑝ℎ𝑖𝑐𝑠"
    },
    guide: {
      en: "{p}uptime2 [𝑎𝑛𝑖𝑚𝑒_𝑖𝑑] 𝑜𝑟 {p}uptime2 list [𝑝𝑎𝑔𝑒]"
    },
    countDown: 2,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "canvas": "",
      "moment-timezone": "",
      "pidusage": ""
    }
  },

  onStart: async function ({ api, event, args, message, threadsData }) {
    try {
      const time = process.uptime();
      const hours = Math.floor(time / (60 * 60));
      const minutes = Math.floor((time % (60 * 60)) / 60);
      const seconds = Math.floor(time % 60);

      const z_1 = (hours < 10) ? '0' + hours : hours;
      const x_1 = (minutes < 10) ? '0' + minutes : minutes;
      const y_1 = (seconds < 10) ? '0' + seconds : seconds;

      const { commands } = global.client || { commands: new Map() };
      const moment = require("moment-timezone");
      const timeNow = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");
      const pidusage = require("pidusage");
      const timeStart = Date.now();

      // ensure asset folder exists
      const tadDir = __dirname + '/tad';
      fs.ensureDirSync(tadDir);

      // CPU info
      const cpus = os.cpus() || [];
      let chips = "Unknown";
      let speed = 0;
      if (cpus.length > 0) {
        chips = cpus[0].model || "Unknown";
        speed = cpus[0].speed || 0;
      }

      // handle list command
      if (args[0] === "list") {
        try {
          const alime = (await axios.get('https://raw.githubusercontent.com/quyenkaneki/data/main/dataanime.json')).data;
          const count = alime.listAnime.length;
          const data = alime.listAnime;
          const page = parseInt(args[1]) || 1;
          const limit = 20;
          const numPage = Math.ceil(count / limit);
          
          let msg = "╔═════════════════╗\n";
          msg +=     "║  𝐴𝑁𝐼𝑀𝐸 𝐿𝐼𝑆𝑇  ║\n";
          msg +=     "╚═════════════════╝\n\n";

          const start = limit * (page - 1);
          const end = Math.min(start + limit, count);

          for (let i = start; i < end; i++) {
            msg += `[${i + 1}] - ${data[i].ID} | ${data[i].name}\n`;
          }

          msg += `\n╔═════════════════════════╗\n`;
          msg += `║ 𝑃𝑎𝑔𝑒: ${page}/${numPage}          ║\n`;
          msg += `║ 𝑈𝑠𝑒: ${global.config.PREFIX}uptime2 list <𝑝𝑎𝑔𝑒> ║\n`;
          msg += `╚═════════════════════════╝`;

          return message.reply(msg);
        } catch (errList) {
          console.error("Error fetching anime list:", errList);
          return message.reply("Failed to fetch anime list.");
        }
      }

      // choose id
      const k = args[0];
      const id = (!k) ? (Math.floor(Math.random() * 848) + 1) : k;

      // download fonts if not present
      const fontUrls = {
        "UTM-Avo.ttf": "https://github.com/quyenkaneki/data/blob/main/UTM-Avo.ttf?raw=true",
        "phenomicon.ttf": "https://github.com/quyenkaneki/data/blob/main/phenomicon.ttf?raw=true",
        "CaviarDreams.ttf": "https://github.com/quyenkaneki/data/blob/main/CaviarDreams.ttf?raw=true"
      };

      for (const [fontName, fontUrl] of Object.entries(fontUrls)) {
        const fontPath = tadDir + `/${fontName}`;
        if (!fs.existsSync(fontPath)) {
          try {
            const fontData = (await axios.get(fontUrl, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(fontPath, Buffer.from(fontData));
          } catch (err) {
            console.error(`Failed to download font ${fontName}:`, err.message);
          }
        }
      }

      // fetch image data
      let lengthchar = [];
      try {
        lengthchar = (await axios.get('https://raw.githubusercontent.com/quyenkaneki/data/main/dataimganime.json')).data;
      } catch (err) {
        console.error("Failed to fetch character data:", err);
        return message.reply("Failed to load character data.");
      }

      const pathImg = tadDir + `/${id}.png`;
      const pathAva = tadDir + `/${event.senderID}.png`;

      // Download images
      try {
        const backgroundUrl = "https://imgur.com/x5JpRYu.png";
        const avatarUrl = lengthchar[id]?.imgAnime || backgroundUrl;

        const [bgResp, avaResp] = await Promise.all([
          axios.get(encodeURI(backgroundUrl), { responseType: "arraybuffer" }),
          axios.get(encodeURI(avatarUrl), { responseType: "arraybuffer" })
        ]);

        fs.writeFileSync(pathImg, Buffer.from(bgResp.data));
        fs.writeFileSync(pathAva, Buffer.from(avaResp.data));
      } catch (errImg) {
        console.error("Failed to download images:", errImg);
        return message.reply("Failed to download background/avatar images.");
      }

      // Build canvas
      const [l1, a] = await Promise.all([loadImage(pathAva), loadImage(pathImg)]);
      const canvas = createCanvas(a.width, a.height);
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = lengthchar[id]?.colorBg || "#2c3e50";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(l1, -200, -200, 1200, 1200);
      ctx.drawImage(a, 0, 0, canvas.width, canvas.height);

      // Register and use fonts
      try {
        registerFont(tadDir + `/phenomicon.ttf`, { family: "phenomicon" });
        ctx.font = "130px phenomicon";
        ctx.fillStyle = lengthchar[id]?.colorBg || "#2c3e50";
        ctx.fillText(global.config.BOTNAME, 835, 340);
      } catch (e) {
        ctx.font = "80px Arial";
        ctx.fillText(global.config.BOTNAME, 835, 340);
      }

      try {
        registerFont(tadDir + `/UTM-Avo.ttf`, { family: "UTM" });
        ctx.font = "70px UTM";
        ctx.fillStyle = "#000000";
        ctx.fillText(`${z_1} : ${x_1} : ${y_1}`, 980, 440);
      } catch (e) {
        ctx.font = "50px Arial";
        ctx.fillText(`${z_1} : ${x_1} : ${y_1}`, 980, 440);
      }

      try {
        registerFont(tadDir + `/CaviarDreams.ttf`, { family: "time" });
        ctx.font = "55px time";
        ctx.fillText("𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑", 930, 540);
        ctx.fillText("61571630409265", 930, 610);
      } catch (e) {
        ctx.font = "40px Arial";
        ctx.fillText("Asif Mahmud", 930, 540);
        ctx.fillText("61571630409265", 930, 610);
      }

      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);

      // Get system info
      const usage = await pidusage(process.pid);
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const usedPercent = ((usedMem * 100) / totalMem).toFixed();

      const infoBody = `======= 𝑆𝐸𝑅𝑉𝐸𝑅 𝐼𝑁𝐹𝑂𝑅𝑀𝐴𝑇𝐼𝑂𝑁 =======\n\n` +
        `𝐶ℎ𝑖𝑝: ${chips}\n` +
        `𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑆𝑝𝑒𝑒𝑑: ${speed}𝑀𝐻𝑧\n\n` +
        `𝑇𝑜𝑡𝑎𝑙 𝑀𝑒𝑚𝑜𝑟𝑦: ${this.byte2mb(totalMem)}\n` +
        `𝑈𝑠𝑒𝑑: ${this.byte2mb(usedMem)} (${usedPercent}%)\n\n` +
        `𝐵𝑜𝑡 𝑢𝑝𝑡𝑖𝑚𝑒: ${hours} ℎ𝑜𝑢𝑟𝑠 ${minutes} 𝑚𝑖𝑛𝑢𝑡𝑒𝑠 ${seconds} 𝑠𝑒𝑐𝑜𝑛𝑑𝑠\n\n` +
        `❯ 𝑇𝑜𝑡𝑎𝑙 𝑢𝑠𝑒𝑟𝑠: ${global.data?.allUserID?.length || 0}\n` +
        `❯ 𝑇𝑜𝑡𝑎𝑙 𝐺𝑟𝑜𝑢𝑝𝑠: ${global.data?.allThreadID?.length || 0}\n` +
        `❯ 𝐶𝑃𝑈 𝑢𝑠𝑎𝑔𝑒: ${usage?.cpu?.toFixed(1) || "N/A"}%\n` +
        `❯ 𝑅𝐴𝑀 𝑢𝑠𝑎𝑔𝑒: ${this.byte2mb(usage?.memory) || "N/A"}\n` +
        `❯ 𝑃𝑖𝑛𝑔: ${Date.now() - timeStart}𝑚𝑠\n` +
        `❯ 𝐶ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟 𝐼𝐷: ${id}\n` +
        `❯ 𝑂𝑤𝑛𝑒𝑟: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑\n` +
        `❯ 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝐼𝐷: 61571630409265`;

      await message.reply({
        body: infoBody,
        attachment: fs.createReadStream(pathImg)
      });

      // Cleanup
      try { fs.unlinkSync(pathImg); } catch (e) {}
      try { fs.unlinkSync(pathAva); } catch (e) {}

    } catch (error) {
      console.error("Uptime2 command error:", error);
      return message.reply("An error occurred while running the uptime command.");
    }
  },

  byte2mb: function(bytes) {
    if (!bytes && bytes !== 0) return '0 MB';
    const units = ['𝐵𝑦𝑡𝑒𝑠', '𝐾𝐵', '𝑀𝐵', '𝐺𝐵', '𝑇𝐵', '𝑃𝐵', '𝐸𝐵', '𝑍𝐵', '𝑌𝐵'];
    let l = 0;
    let n = Number(bytes) || 0;
    while (n >= 1024 && ++l) n = n / 1024;
    return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
  }
};
