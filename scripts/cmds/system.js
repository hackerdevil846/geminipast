const si = require('systeminformation');
const pidusage = require('pidusage');
const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "system",
    aliases: [],
    version: "2.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    shortDescription: "𝑺𝒚𝒔𝒕𝒆𝒎 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒅𝒆𝒌𝒉𝒂𝒐",
    longDescription: "𝑩𝒐𝒕 𝒆𝒓 𝒉𝒂𝒓𝒅𝒘𝒂𝒓𝒆 𝒂𝒏𝒅 𝑶𝑺 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒅𝒆𝒌𝒉𝒂𝒐",
    category: "𝑺𝒚𝒔𝒕𝒆𝒎",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    try {
      const timeStart = Date.now();
      
      // 𝑮𝒆𝒕 𝒂𝒍𝒍 𝒔𝒚𝒔𝒕𝒆𝒎 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏
      const [cpuData, tempData, loadData, diskInfo, memLayout, memData, osInfo, timeInfo, procUsage] = await Promise.all([
        si.cpu(),
        si.cpuTemperature(),
        si.currentLoad(),
        si.diskLayout(),
        si.memLayout(),
        si.mem(),
        si.osInfo(),
        si.time(),
        pidusage(process.pid)
      ]);
      
      // 𝑪𝒂𝒍𝒄𝒖𝒍𝒂𝒕𝒆 𝒖𝒑𝒕𝒊𝒎𝒆𝒔
      const botUptime = process.uptime();
      const botHours = String(Math.floor(botUptime / 3600)).padStart(2, '0');
      const botMinutes = String(Math.floor((botUptime % 3600) / 60)).padStart(2, '0');
      const botSeconds = String(Math.floor(botUptime % 60)).padStart(2, '0');
      
      const sysHours = String(Math.floor(timeInfo.uptime / 3600)).padStart(2, '0');
      const sysMinutes = String(Math.floor((timeInfo.uptime % 3600) / 60)).padStart(2, '0');
      const sysSeconds = String(Math.floor(timeInfo.uptime % 60)).padStart(2, '0');
      
      // 𝑭𝒐𝒓𝒎𝒂𝒕 𝒔𝒊𝒛𝒆𝒔
      const formatBytes = (bytes) => {
        const units = ['𝑩𝒚𝒕𝒆𝒔', '𝑲𝑩', '𝑴𝑩', '𝑮𝑩', '𝑻𝑩'];
        let l = 0;
        let n = parseInt(bytes, 10);
        while (n >= 1024 && ++l) n = n / 1024;
        return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
      };

      // 𝑩𝒖𝒊𝒍𝒅 𝒅𝒊𝒔𝒌 𝒊𝒏𝒇𝒐
      let diskDetails = [];
      diskInfo.forEach((disk, i) => {
        diskDetails.push(`▣ 𝑫𝒊𝒔𝒌 ${i+1}:
  ➤ 𝑵𝒂𝒎𝒆: ${disk.name || '𝑵/𝑨'}
  ➤ 𝑻𝒚𝒑𝒆: ${disk.interfaceType || '𝑵/𝑨'}
  ➤ 𝑺𝒊𝒛𝒆: ${formatBytes(disk.size)}
  ➤ 𝑻𝒆𝒎𝒑: ${disk.temperature || '𝑵/𝑨'}°𝑪`);
      });

      // 𝑩𝒖𝒊𝒍𝒅 𝒇𝒖𝒍𝒍 𝒎𝒆𝒔𝒔𝒂𝒈𝒆
      const message = `📊 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗧𝗔𝗧𝗨𝗦 𝗥𝗘𝗣𝗢𝗥𝗧 📊

🖥️ 𝗖𝗣𝗨 𝗗𝗘𝗧𝗔𝗜𝗟𝗦:
  ➤ 𝑴𝒐𝒅𝒆𝒍: ${cpuData.manufacturer} ${cpuData.brand}
  ➤ 𝑺𝒑𝒆𝒆𝒅: ${cpuData.speed} 𝑮𝒉𝒛
  ➤ 𝑪𝒐𝒓𝒆𝒔: ${cpuData.cores} (${cpuData.physicalCores} 𝒑𝒉𝒚𝒔𝒊𝒄𝒂𝒍)
  ➤ 𝑻𝒆𝒎𝒑: ${tempData.main || '𝑵/𝑨'}°𝑪
  ➤ 𝑳𝒐𝒂𝒅: ${loadData.currentLoad.toFixed(1)}%
  ➤ 𝑵𝒐𝒅𝒆 𝑼𝒔𝒂𝒈𝒆: ${procUsage.cpu.toFixed(1)}%

💾 𝗠𝗘𝗠𝗢𝗥𝗬 𝗜𝗡𝗙𝗢:
  ➤ 𝑹𝑨𝑴 𝑻𝒚𝒑𝒆: ${memLayout[0]?.type || '𝑵/𝑨'}
  ➤ 𝑹𝑨𝑴 𝑺𝒊𝒛𝒆: ${formatBytes(memLayout[0]?.size || 0)}
  ➤ 𝑻𝒐𝒕𝒂𝒍: ${formatBytes(memData.total)}
  ➤ 𝑨𝒗𝒂𝒊𝒍𝒂𝒃𝒍𝒆: ${formatBytes(memData.available)}
  ➤ 𝑵𝒐𝒅𝒆 𝑼𝒔𝒂𝒈𝒆: ${formatBytes(procUsage.memory)}

💽 𝗦𝗧𝗢𝗥𝗔𝗚𝗘 𝗗𝗘𝗧𝗔𝗜𝗟𝗦:
${diskDetails.join('\n\n')}

🖳 𝗦𝗬𝗦𝗧𝗘𝗠 𝗗𝗧𝗧𝗔𝗜𝗟𝗦:
  ➤ 𝑷𝒍𝒂𝒕𝒇𝒐𝒓𝒎: ${osInfo.platform}
  ➤ 𝑩𝒖𝒊𝒍𝒅: ${osInfo.build}
  ➤ 𝑩𝒐𝒕 𝑼𝒑𝒕𝒊𝒎𝒆: ${botHours}:${botMinutes}:${botSeconds}
  ➤ 𝑺𝒚𝒔𝒕𝒆𝒎 𝑼𝒑𝒕𝒊𝒎𝒆: ${sysHours}:${sysMinutes}:${sysSeconds}
  ➤ 𝑷𝒊𝒏𝒈: ${Date.now() - timeStart}𝒎𝒔`;

      // 𝑰𝒎𝒂𝒈𝒆 𝒉𝒂𝒏𝒅𝒍𝒊𝒏𝒈
      const images = [
        "https://i.imgur.com/u1WkhXi.jpg",
        "https://i.imgur.com/zuUMUDp.jpg",
        "https://i.imgur.com/skHrcq9.jpg",
        "https://i.imgur.com/TE9tH8w.jpg",
        "https://i.imgur.com/on9p0FK.jpg",
        "https://i.imgur.com/mriBW5m.jpg",
        "https://i.imgur.com/ju7CyHo.jpg",
        "https://i.imgur.com/KJunp2s.jpg",
        "https://i.imgur.com/6knPOgd.jpg",
        "https://i.imgur.com/Nxcbwxk.jpg",
        "https://i.imgur.com/FgtghTN.jpg"
      ];

      const imgPath = __dirname + "/cache/system.jpg";
      const chosenImage = images[Math.floor(Math.random() * images.length)];
      
      const callback = () => {
        api.sendMessage({ 
          body: message, 
          attachment: fs.createReadStream(imgPath)
        }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);
      };
      
      request(encodeURI(chosenImage))
        .pipe(fs.createWriteStream(imgPath))
        .on("close", callback);
        
    } catch (err) {
      console.error("🔴 𝑺𝒚𝒔𝒕𝒆𝒎 𝑰𝒏𝒇𝒐 𝑬𝒓𝒓𝒐𝒓:", err);
      api.sendMessage("❌ 𝑺𝒚𝒔𝒕𝒆𝒎 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒇𝒆𝒕𝒄𝒉 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊 𝒏𝒂", event.threadID);
    }
  }
};
