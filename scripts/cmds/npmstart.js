const { exec } = require("child_process");

module.exports = {
  config: {
    name: "npmstart",
    aliases: ["restart", "boot"],
    version: "2.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 2, // ADMIN ONLY
    shortDescription: {
      en: "𝑅𝑒𝑠𝑡𝑎𝑟𝑡 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑢𝑠𝑖𝑛𝑔 𝑛𝑝𝑚"
    },
    longDescription: {
      en: "𝐸𝑥𝑒𝑐𝑢𝑡𝑒 'npm start' 𝑡𝑜 𝑟𝑒𝑙𝑎𝑢𝑛𝑐ℎ 𝑡ℎ𝑒 𝑏𝑜𝑡 (𝐴𝑑𝑚𝑖𝑛 𝑜𝑛𝑙𝑦)"
    },
    category: "𝐴𝑑𝑚𝑖𝑛",
    guide: {
      en: "{p}npmstart  —  𝑇𝑟𝑖𝑔𝑔𝑒𝑟 𝑟𝑒𝑠𝑡𝑎𝑟𝑡"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      // Inform about restart
      await api.sendMessage("🔄 | 𝐴𝑡𝑡𝑒𝑚𝑝𝑡𝑖𝑛𝑔 𝑡𝑜 𝑟𝑒𝑠𝑡𝑎𝑟𝑡 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑢𝑠𝑖𝑛𝑔 'npm start'...", event.threadID);

      // Run restart command
      exec("npm start", { windowsHide: true }, async (error, stdout, stderr) => {
        if (error) {
          console.error("Execution error:", error);
          return api.sendMessage(`❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑒𝑥𝑒𝑐𝑢𝑡𝑒:\n${error.message}`, event.threadID);
        }

        // Send execution feedback
        const response =
`✅ | 𝐵𝑜𝑡 𝑟𝑒𝑠𝑡𝑎𝑟𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑠𝑒𝑛𝑡!

📜 𝑂𝑢𝑡𝑝𝑢𝑡:
${stdout || "𝑁𝑜 𝑜𝑢𝑡𝑝𝑢𝑡"}

⚠️ 𝐸𝑟𝑟𝑜𝑟𝑠:
${stderr || "𝑁𝑜𝑛𝑒"}`;

        api.sendMessage(response, event.threadID);
      });

    } catch (err) {
      console.error("Command error:", err);
      api.sendMessage(`❌ | 𝑈𝑛𝑒𝑥𝑝𝑒𝑐𝑡𝑒𝑑 𝑒𝑟𝑟𝑜𝑟:\n${err.message}`, event.threadID);
    }
  },

  // Optional: Allow trigger without prefix ("npm start")
  onChat: async function ({ api, event }) {
    const command = event.body?.toLowerCase();
    if (command === "npm start" || command === "!npm start") {
      this.onStart({ api, event, args: [] });
    }
  }
};
