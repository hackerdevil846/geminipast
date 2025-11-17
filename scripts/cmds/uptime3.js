const os = require("os");
const fs = require("fs-extra");

const startTime = new Date();

module.exports = {
  config: {
    name: "uptime3",
    aliases: ["upt3", "systeminfo"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "system",
    shortDescription: {
      en: "📊 𝑆ℎ𝑜𝑤 𝑏𝑜𝑡 𝑢𝑝𝑡𝑖𝑚𝑒 𝑎𝑛𝑑 𝑠𝑦𝑠𝑡𝑒𝑚 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
    },
    longDescription: {
      en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑠𝑦𝑠𝑡𝑒𝑚 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑛𝑑 𝑏𝑜𝑡 𝑢𝑝𝑡𝑖𝑚𝑒"
    },
    guide: {
      en: "{p}uptime3"
    },
    countDown: 5,
    dependencies: {
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, message }) {
    try {
      const uptimeInSeconds = (new Date() - startTime) / 1000;

      const seconds = uptimeInSeconds;
      const days = Math.floor(seconds / (3600 * 24));
      const hours = Math.floor((seconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secondsLeft = Math.floor(seconds % 60);
      const uptimeFormatted = `${days}𝒅 ${hours}𝒉 ${minutes}𝒎 ${secondsLeft}𝒔`;

      const loadAverage = os.loadavg();
      const cpuUsage =
        os
          .cpus()
          .map((cpu) => cpu.times.user)
          .reduce((acc, curr) => acc + curr) / os.cpus().length;

      const totalMemoryGB = os.totalmem() / 1024 ** 3;
      const freeMemoryGB = os.freemem() / 1024 ** 3;
      const usedMemoryGB = totalMemoryGB - freeMemoryGB;

      const currentDate = new Date();
      const options = { year: "numeric", month: "numeric", day: "numeric" };
      const date = currentDate.toLocaleDateString("en-US", options);
      const time = currentDate.toLocaleTimeString("en-US", {
        timeZone: "Asia/Dhaka",
        hour12: true,
      });

      const timeStart = Date.now();
      await message.reply("🔎| 𝐶ℎ𝑒𝑐𝑘𝑖𝑛𝑔 𝑠𝑦𝑠𝑡𝑒𝑚...");

      const ping = Date.now() - timeStart;

      let pingStatus = "⛔| 𝐵𝑎𝑑 𝑠𝑦𝑠𝑡𝑒𝑚";
      if (ping < 1000) {
        pingStatus = "✅| 𝑆𝑚𝑜𝑜𝑡ℎ 𝑠𝑦𝑠𝑡𝑒𝑚";
      }

      const systemInfo = `♡   ∩_∩
 （„• ֊ •„)♡
╭─∪∪────────────⟡
│ 𝑈𝑃𝑇𝐼𝑀𝐸 𝐼𝑁𝐹𝑂
├───────────────⟡
│ ⏰ 𝑅𝑈𝑁𝑇𝐼𝑀𝐸
│  ${uptimeFormatted}
├───────────────⟡
│ 👑 𝑆𝑌𝑆𝑇𝐸𝑀 𝐼𝑁𝐹𝑂
│𝑂𝑆: ${os.type()} ${os.arch()}
│𝐿𝐴𝑁𝐺 𝑉𝐸𝑅: ${process.version}
│𝐶𝑃𝑈 𝑀𝑂𝐷𝐸𝐿: ${os.cpus()[0].model}
│𝑆𝑇𝑂𝑅𝐴𝐺𝐸: ${usedMemoryGB.toFixed(2)} 𝐺𝐵 / ${totalMemoryGB.toFixed(2)} 𝐺𝐵
│𝐶𝑃𝑈 𝑈𝑆𝐴𝐺𝐸: ${cpuUsage.toFixed(1)}%
│𝑅𝐴𝑀 𝑈𝑆𝐺𝐸: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} 𝑀𝐵
├───────────────⟡
│ ✅ 𝑂𝑇𝐻𝐸𝑅 𝐼𝑁𝐹𝑂
│𝐷𝐴𝑇𝐸: ${date}
│𝑇𝐼𝑀𝐸: ${time}
│𝑃𝐼𝑁𝐺: ${ping}𝑚𝑠
│𝑆𝑇𝐴𝑇𝑈𝑆: ${pingStatus}
╰───────────────⟡
`;

      await message.reply(systemInfo);

    } catch (error) {
      console.error("Error retrieving system information:", error);
      await message.reply("𝑈𝑛𝑎𝑏𝑙𝑒 𝑡𝑜 𝑟𝑒𝑡𝑟𝑖𝑒𝑣𝑒 𝑠𝑦𝑠𝑡𝑒𝑚 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛.");
    }
  }
};
