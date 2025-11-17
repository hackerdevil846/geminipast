const mongoose = require("mongoose");
const os = require("os");

module.exports = {
  config: {
    name: "instancelock",
    aliases: ["instanceguard", "botlock"],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "🔒 𝐾𝑖𝑙𝑙 𝑑𝑢𝑝𝑙𝑖𝑐𝑎𝑡𝑒 𝑏𝑜𝑡 𝑖𝑛𝑠𝑡𝑎𝑛𝑐𝑒𝑠"
    },
    longDescription: {
      en: "𝑃𝑟𝑒𝑣𝑒𝑛𝑡𝑠 𝑡ℎ𝑒 𝑠𝑎𝑚𝑒 𝑏𝑜𝑡 𝐼𝐷 𝑟𝑢𝑛𝑛𝑖𝑛𝑔 𝑖𝑛 𝑚𝑢𝑙𝑡𝑖𝑝𝑙𝑒 𝑒𝑛𝑣𝑖𝑟𝑜𝑛𝑚𝑒𝑛𝑡𝑠"
    },
    category: "𝑠𝑦𝑠𝑡𝑒𝑚",
    guide: {
      en: "𝐴𝑢𝑡𝑜 𝑟𝑢𝑛𝑠 𝑜𝑛 𝑙𝑜𝑎𝑑. 𝑁𝑜 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑛𝑒𝑒𝑑𝑒𝑑."
    },
    dependencies: {
      "mongoose": "",
      "os": ""
    }
  },

  onStart: async function() {
    try {
      // Check if mongoose is available
      if (!mongoose || !mongoose.Schema) {
        console.error("❌ 𝑀𝑜𝑛𝑔𝑜𝑜𝑠𝑒 𝑖𝑠 𝑛𝑜𝑡 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒");
        return;
      }

      const instanceSchema = new mongoose.Schema({
        activeInstanceId: String,
        updatedAt: Date
      });
      
      const Instance = mongoose.models["instancelock"] || mongoose.model("instancelock", instanceSchema);

      const myInstanceId = `${os.hostname()}-${process.pid}`;
      const HEARTBEAT_INTERVAL = 10000; // 10 seconds
      const TIMEOUT_LIMIT = 15000; // 15 seconds timeout for old instance

      const now = Date.now();
      const existing = await Instance.findOne({});

      if (existing && existing.activeInstanceId !== myInstanceId) {
        const lastUpdate = existing.updatedAt?.getTime() || 0;
        const timeDiff = now - lastUpdate;

        if (timeDiff < TIMEOUT_LIMIT) {
          console.log(`🛑 𝐴𝑛𝑜𝑡ℎ𝑒𝑟 𝑖𝑛𝑠𝑡𝑎𝑛𝑐𝑒 (${existing.activeInstanceId}) 𝑖𝑠 𝑎𝑐𝑡𝑖𝑣𝑒. 𝐸𝑥𝑖𝑡𝑖𝑛𝑔...`);
          return process.exit(0);
        } else {
          console.warn(`⚠️ 𝑃𝑟𝑒𝑣𝑖𝑜𝑢𝑠 𝑖𝑛𝑠𝑡𝑎𝑛𝑐𝑒 (${existing.activeInstanceId}) 𝑠𝑒𝑒𝑚𝑠 𝑖𝑛𝑎𝑐𝑡𝑖𝑣𝑒. 𝑂𝑣𝑒𝑟𝑟𝑖𝑑𝑖𝑛𝑔...`);
        }
      }

      await Instance.updateOne(
        {},
        { activeInstanceId: myInstanceId, updatedAt: new Date() },
        { upsert: true }
      );

      console.log(`✅ 𝑇ℎ𝑖𝑠 𝑖𝑛𝑠𝑡𝑎𝑛𝑐𝑒 (${myInstanceId}) 𝑖𝑠 𝑛𝑜𝑤 𝑡ℎ𝑒 𝑎𝑐𝑡𝑖𝑣𝑒 𝑏𝑜𝑡.`);

      // Heartbeat to keep this instance alive
      setInterval(async () => {
        try {
          await Instance.updateOne(
            { activeInstanceId: myInstanceId },
            { updatedAt: new Date() }
          );
        } catch (err) {
          console.error("❌ 𝐻𝑒𝑎𝑟𝑡𝑏𝑒𝑎𝑡 𝑒𝑟𝑟𝑜𝑟:", err);
        }
      }, HEARTBEAT_INTERVAL);

    } catch (err) {
      console.error("❌ 𝐼𝑛𝑠𝑡𝑎𝑛𝑐𝑒 𝑙𝑜𝑐𝑘 𝑒𝑟𝑟𝑜𝑟:", err);
      process.exit(1);
    }
  }
};
