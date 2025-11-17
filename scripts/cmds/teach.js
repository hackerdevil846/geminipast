module.exports = {
  config: {
    name: "teach",
    version: "1.0.0",
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    role: 0,
    category: "𝗌𝗂𝗆",
    shortDescription: {
      en: "𝖲𝗂𝗆𝗆𝗂𝗄𝖾 𝗌𝗁𝗂𝗄𝗁𝖺𝗇𝗈 𝗄𝖺𝗃 - 𝗉𝗋𝗈𝗌𝗇𝗈 𝗈 𝗎𝗍𝗍𝗈𝗋 𝖺𝖽𝖽 𝗄𝗈𝗋𝗈"
    },
    longDescription: {
      en: "𝖲𝗂𝗆𝗆𝗂𝗄𝖾 𝗌𝗁𝗂𝗄𝗁𝖺𝗇𝗈 𝗄𝖺𝗃 - 𝗉𝗋𝗈𝗌𝗇𝗈 𝗈 𝗎𝗍𝗍𝗈𝗋 𝖺𝖽𝖽 𝗄𝗈𝗋𝗈"
    },
    guide: {
      en: "{𝗉}𝗍𝖾𝖺𝖼𝗁"
    },
    countDown: 2,
    dependencies: {
      "axios": ""
    },
    envConfig: {
      SIM_API_KEY: "" // 𝗌𝖾𝗍 𝗒𝗈𝗎𝗋 𝖠𝖯𝖨 𝗄𝖾𝗒 𝗁𝖾𝗋𝖾 𝗂𝖿 𝗒𝗈𝗎 𝗁𝖺𝗏𝖾 𝗈𝗇𝖾
    }
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID, senderID } = event;
    return api.sendMessage(
      "⸙͎ 𝖯𝗋𝗈𝗌𝗇𝗈 𝗅𝗂𝗄𝗁𝖾𝗇 — 𝗌𝗂𝗆𝗆𝗂𝗄𝖾 𝗌𝗁𝗂𝗄𝗁𝖺𝗇𝗈 𝗃𝗈𝗇𝗇𝗈 𝖾𝗂 𝗆𝖾𝗌𝗌𝖺𝗀𝖾-𝖾𝗋 𝗋𝖾𝗉𝗅𝗒 𝖾 𝗉𝗋𝗈𝗌𝗇𝗈 𝗉𝖺𝗍𝗁𝖺𝗇.",
      threadID,
      (err, info) => {
        if (err) return console.error(err);
        // 𝗋𝖾𝗀𝗂𝗌𝗍𝖾𝗋 𝖺 𝗁𝖺𝗇𝖽𝗅𝖾𝖱𝖾𝗉𝗅𝗒 𝗈𝖻𝗃𝖾𝖼𝗍 𝗌𝗈 𝗇𝖾𝗑𝗍 𝗋𝖾𝗉𝗅𝗒 𝗂𝗌 𝗁𝖺𝗇𝖽𝗅𝖾𝖽 𝖻𝗒 𝗁𝖺𝗇𝖽𝗅𝖾𝖱𝖾𝗉𝗅𝗒
        global.client.handleReply.push({
          step: 1,
          name: this.config.name,
          messageID: info.messageID,
          content: {
            id: senderID,
            ask: "",
            ans: ""
          }
        });
      },
      messageID
    );
  },

  onReply: async function({ api, event, handleReply }) {
    const axios = require("axios");
    const { threadID, messageID, senderID, body } = event;

    // 𝗈𝗇𝗅𝗒 𝖺𝖼𝖼𝖾𝗉𝗍 𝗋𝖾𝗉𝗅𝗂𝖾𝗌 𝖿𝗋𝗈𝗆 𝗍𝗁𝖾 𝗈𝗋𝗂𝗀𝗂𝗇𝖺𝗅 𝗎𝗌𝖾𝗋 𝗐𝗁𝗈 𝗂𝗇𝗏𝗈𝗄𝖾𝖽 𝗍𝗁𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽
    if (!handleReply || !handleReply.content || handleReply.content.id !== senderID) return;

    const userInput = (body || "").trim();

    // 𝗁𝖾𝗅𝗉𝖾𝗋: 𝗋𝖾𝗆𝗈𝗏𝖾 𝗈𝗅𝖽 𝗌𝗍𝗈𝗋𝖾𝖽 𝗁𝖺𝗇𝖽𝗅𝖾𝖱𝖾𝗉𝗅𝗒 𝖺𝗇𝖽 𝗈𝗉𝗍𝗂𝗈𝗇𝖺𝗅𝗅𝗒 𝗉𝗎𝗌𝗁 𝗇𝖾𝗐 𝗈𝗇𝖾
    const replaceHandleReply = (newObj) => {
      try {
        const idx = global.client.handleReply.findIndex(i => i.messageID == handleReply.messageID && i.name == handleReply.name);
        if (idx !== -1) global.client.handleReply.splice(idx, 1);
        if (newObj) global.client.handleReply.push(newObj);
        // 𝗍𝗋𝗒 𝗍𝗈 𝗎𝗇𝗌𝖾𝗇𝖽 𝗍𝗁𝖾 𝖻𝗈𝗍'𝗌 𝗉𝗋𝖾𝗏𝗂𝗈𝗎𝗌 𝗉𝗋𝗈𝗆𝗉𝗍 (𝖼𝗅𝖾𝖺𝗇𝗎𝗉)
        try { api.unsendMessage(handleReply.messageID); } catch(e) {}
      } catch(e) { console.error(e); }
    };

    switch (handleReply.step) {
      case 1:
        // 𝗎𝗌𝖾𝗋 𝗁𝖺𝗌 𝗋𝖾𝗉𝗅𝗂𝖾𝖽 𝗐𝗂𝗍𝗁 𝗍𝗁𝖾 𝗊𝗎𝖾𝗌𝗍𝗂𝗈𝗇 (𝗉𝗋𝗈𝗌𝗇𝗈)
        handleReply.content.ask = userInput;
        // 𝗌𝖾𝗇𝖽 𝗇𝖾𝗑𝗍 𝗉𝗋𝗈𝗆𝗉𝗍 𝗍𝗈 𝗀𝖾𝗍 𝗍𝗁𝖾 𝖺𝗇𝗌𝗐𝖾𝗋
        api.sendMessage(
          "⸙͎ 𝖴𝗍𝗍𝗈𝗋 𝗅𝗂𝗄𝗁𝖾𝗇 — 𝖾𝗄𝗁𝗈𝗇 𝖾𝗂 𝗆𝖾𝗌𝗌𝖺𝗀𝖾-𝖾𝗋 𝗋𝖾𝗉𝗅𝗒 𝖾 𝗎𝗍𝗍𝗈𝗋 𝗉𝖺𝗍𝗁𝖺𝗇.",
          threadID,
          (err, info) => {
            if (err) return console.error(err);
            // 𝗋𝖾𝗆𝗈𝗏𝖾 𝗈𝗅𝖽 𝖺𝗇𝖽 𝗉𝗎𝗌𝗁 𝗎𝗉𝖽𝖺𝗍𝖾𝖽 𝗁𝖺𝗇𝖽𝗅𝖾𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗌𝗍𝖾𝗉 𝟤
            replaceHandleReply({
              step: 2,
              name: this.config.name,
              messageID: info.messageID,
              content: handleReply.content
            });
          },
          messageID
        );
        break;

      case 2:
        // 𝗎𝗌𝖾𝗋 𝗋𝖾𝗉𝗅𝗂𝖾𝖽 𝗐𝗂𝗍𝗁 𝗍𝗁𝖾 𝖺𝗇𝗌𝗐𝖾𝗋 (𝗎𝗍𝗍𝗈𝗋)
        handleReply.content.ans = userInput;

        // 𝗋𝖾𝗆𝗈𝗏𝖾 𝗌𝗍𝗈𝗋𝖾𝖽 𝗁𝖺𝗇𝖽𝗅𝖾𝖱𝖾𝗉𝗅𝗒 (𝗐𝖾 𝗐𝗂𝗅𝗅 𝖿𝗂𝗇𝗂𝗌𝗁 𝗇𝗈𝗐)
        replaceHandleReply(null);

        // 𝗉𝗋𝖾𝗉𝖺𝗋𝖾 𝗍𝗂𝗆𝖾𝗌𝗍𝖺𝗆𝗉 𝗂𝗇 𝖠𝗌𝗂𝖺/𝖣𝗁𝖺𝗄𝖺 𝗐𝗂𝗍𝗁𝗈𝗎𝗍 𝖾𝗑𝗍𝖾𝗋𝗇𝖺𝗅 𝗅𝗂𝖻𝗌
        const timeZ = new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" });

        // 𝖼𝖺𝗅𝗅 𝖾𝗑𝗍𝖾𝗋𝗇𝖺𝗅 𝖠𝖯𝖨 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗍𝗁𝖾 𝖰/𝖠 (𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝗍𝗈 𝖯𝗋𝗂𝗒𝖺𝗇𝗌𝗁𝖵𝗂𝗉 𝗂𝖿 𝗇𝗈 𝖾𝗇𝗏 𝗄𝖾𝗒)
        const apikey = (this.config.envConfig && this.config.envConfig.SIM_API_KEY) ? this.config.envConfig.SIM_API_KEY : "PriyanshVip";
        const ask = encodeURIComponent(handleReply.content.ask);
        const ans = encodeURIComponent(handleReply.content.ans);
        const url = `https://sim-api-by-priyansh.glitch.me/sim?type=teach&ask=${ask}&ans=${ans}&apikey=${apikey}`;

        try {
          const res = await axios.get(url);
          if (res.data && res.data.error) {
            return api.sendMessage(`❌ 𝖯𝗋𝗈𝖻𝗅𝖾𝗆: ${res.data.error}`, threadID, messageID);
          }

          // 𝗌𝗎𝖼𝖼𝖾𝗌𝗌 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 (𝖡𝖺𝗇𝗀𝗅𝗂𝗌𝗁)
          return api.sendMessage(
            `✅ 𝖲𝖺𝖿𝗈𝗅𝗅𝗈 — 𝗌𝗂𝗆𝗆𝗂𝗄𝖾 𝗌𝗂𝗄𝗄𝗁𝖺𝗇𝗈 𝗁𝗈𝗒𝖾 𝗀𝖾𝖼𝗁𝖾.\n\n` +
            `🤤 𝖯𝗋𝗈𝗌𝗇𝗈: ${handleReply.content.ask}\n` +
            `🤓 𝖴𝗍𝗍𝗈𝗋: ${handleReply.content.ans}\n\n` +
            `⏱ 𝖲𝗈𝗆𝗈𝗒: ${timeZ}`,
            threadID,
            messageID
          );
        } catch (error) {
          console.error("𝖤𝗋𝗋𝗈𝗋 𝗐𝗁𝗂𝗅𝖾 𝗌𝖺𝗏𝗂𝗇𝗀 𝗍𝖾𝖺𝖼𝗁:", error);
          return api.sendMessage(
            "❌ 𝖪𝗂𝖼𝗁𝗎 𝖾𝗄𝗍𝖺 𝗉𝗋𝗈𝖻𝗅𝖾𝗆 𝗁𝗈𝗒𝖾𝖼𝗁𝖾, 𝗉𝗈𝗋𝗈𝖻𝗈𝗋𝗍𝗂 𝗍𝖾 𝖺𝖻𝖺𝗋 𝖼𝗁𝖾𝗌𝗍𝖺 𝗄𝗈𝗋𝗎𝗇.",
            threadID,
            messageID
          );
        }

      default:
        break;
    }
  }
};
