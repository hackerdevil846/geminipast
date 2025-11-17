module.exports = {
  config: {
    name: "fast",
    aliases: ["speedtest", "checkspeed"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 2,
    category: "𝑠𝑦𝑠𝑡𝑒𝑚",
    shortDescription: {
      en: "𝐶ℎ𝑒𝑐𝑘 𝑛𝑒𝑡𝑤𝑜𝑟𝑘 𝑠𝑝𝑒𝑒𝑑"
    },
    longDescription: {
      en: "𝑇𝑒𝑠𝑡𝑠 𝑡ℎ𝑒 𝑏𝑜𝑡'𝑠 𝑛𝑒𝑡𝑤𝑜𝑟𝑘 𝑠𝑝𝑒𝑒𝑑 𝑢𝑠𝑖𝑛𝑔 𝑓𝑎𝑠𝑡-𝑠𝑝𝑒𝑒𝑑𝑡𝑒𝑠𝑡-𝑎𝑝𝑖 𝑎𝑛𝑑 𝑟𝑒𝑡𝑢𝑟𝑛𝑠 𝑡ℎ𝑒 𝑟𝑒𝑠𝑢𝑙𝑡 𝑖𝑛 𝑀𝑏𝑝𝑠"
    },
    guide: {
      en: "{𝑝}𝑓𝑎𝑠𝑡"
    },
    countDown: 15,
    dependencies: {
      "fast-speedtest-api": "",
      "request": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ message, event, api }) {
    try {
      // Dependency check
      const fast = global.nodemodule["fast-speedtest-api"];
      const speedTest = new fast({
        token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
        verbose: false,
        timeout: 10000,
        https: true,
        urlCount: 5,
        bufferSize: 8,
        unit: fast.UNITS.Mbps
      });
      const result = await speedTest.getSpeed();
      
      await message.reply(
        `=== 𝑅𝑒𝑠𝑢𝑙𝑡 ===\n- 𝑆𝑝𝑒𝑒𝑑: ${result} 𝑀𝑏𝑝𝑠`,
        event.threadID,
        event.messageID
      );
      
    } catch (error) {
      console.error("𝑆𝑝𝑒𝑒𝑑𝑡𝑒𝑠𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply(
        "❌ 𝐶𝑎𝑛𝑛𝑜𝑡 𝑝𝑒𝑟𝑓𝑜𝑟𝑚 𝑠𝑝𝑒𝑒𝑑𝑡𝑒𝑠𝑡 𝑟𝑖𝑔ℎ𝑡 𝑛𝑜𝑤, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟!",
        event.threadID,
        event.messageID
      );
    }
  }
};
