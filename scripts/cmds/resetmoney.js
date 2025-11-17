const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "resetmoney",
    aliases: ["resetbal", "clearmoney"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 1,
    category: "system",
    shortDescription: {
      en: "💸 Reset all group members' money to zero"
    },
    longDescription: {
      en: "💸 Reset all group members' money balances to zero with stylish canvas output"
    },
    guide: {
      en: "{p}resetmoney"
    },
    dependencies: {
      "canvas": ""
    }
  },

  onStart: async function ({ api, event, usersData }) {
    try {
      // Check dependencies
      try {
        if (!createCanvas || !loadImage) {
          throw new Error("Missing required dependencies");
        }
      } catch (err) {
        return api.sendMessage("❌ | Required dependencies are missing. Please install canvas.", event.threadID, event.messageID);
      }

      const { threadID, senderID } = event;
      
      // Check if user has admin role (role: 1)
      const userData = await usersData.get(senderID);
      if (userData.role < 1) {
        return api.sendMessage("⚠️ You don't have permission to use this command!", threadID);
      }

      const data = await api.getThreadInfo(threadID);
      let resetCount = 0;

      for (const user of data.userInfo) {
        const currenciesData = await usersData.get(user.id);
        if (currenciesData && typeof currenciesData.money !== "undefined") {
          await usersData.set(user.id, { money: 0 });
          resetCount++;
        }
      }

      // 🎨 Create Canvas
      const canvas = createCanvas(800, 250);
      const ctx = canvas.getContext("2d");

      // Background
      ctx.fillStyle = "#1E1E2F";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gradient text
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#FF5F6D");
      gradient.addColorStop(1, "#FFC371");
      ctx.fillStyle = gradient;

      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.fillText("💰 Reset Successful 💰", canvas.width / 2, 80);

      ctx.font = "28px Arial";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(`Total members reset: ${resetCount}`, canvas.width / 2, 150);

      ctx.font = "24px Arial";
      ctx.fillStyle = "#FFD700";
      ctx.fillText("All balances are now 0 🤑", canvas.width / 2, 200);

      // Send Canvas as image
      const imageBuffer = canvas.toBuffer();

      return api.sendMessage({
        body: `✅ Sob memberder taka successfully reset kora hoyeche!\n👑 Reset by: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`,
        attachment: imageBuffer
      }, threadID);

    } catch (error) {
      console.error("ResetMoney Command Error:", error);
      api.sendMessage("❌ | Error resetting money balances.", event.threadID, event.messageID);
    }
  }
};
