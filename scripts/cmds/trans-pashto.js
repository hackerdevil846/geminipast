module.exports = {
  config: {
    name: "trans-pashto",
    aliases: ["pashto", "translate-pashto"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "media",
    shortDescription: {
      en: "𝖳𝖾𝗑𝗍 𝗉𝖺𝗌𝗁𝗍𝗈 𝗍𝖺𝗒 𝖻𝖺𝖽𝖺𝗅𝖾𝗇"
    },
    longDescription: {
      en: "𝖳𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝖾 𝗍𝖾𝗑𝗍 𝗍𝗈 𝖯𝖺𝗌𝗁𝗍𝗈 𝗅𝖺𝗇𝗀𝗎𝖺𝗀𝖾"
    },
    guide: {
      en: "{p}trans-pashto [𝗍𝖾𝗑𝗍]"
    },
    dependencies: {
      "request": ""
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // Dependency check
      let requestAvailable = true;
      try {
        require("request");
      } catch (e) {
        requestAvailable = false;
      }

      if (!requestAvailable) {
        return api.sendMessage("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝗋𝖾𝗊𝗎𝖾𝗌𝗍.", event.threadID, event.messageID);
      }

      const request = global.nodemodule["request"];
      const content = args.join(" ").trim();

      if ((content.length === 0) && event.type !== "message_reply") {
        return api.sendMessage("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗍𝖾𝗑𝗍 𝗍𝗈 𝗍𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝖾", event.threadID, event.messageID);
      }

      let translateThis = "";
      let lang = (global.config && global.config.language) ? global.config.language : "auto";

      if (event.type === "message_reply") {
        translateThis = (event.messageReply && event.messageReply.body) ? event.messageReply.body : "";
        if (content.indexOf("-> ") !== -1) {
          lang = content.substring(content.indexOf("-> ") + 3).trim();
        }
      } else {
        if (content.includes(" -> ")) {
          translateThis = content.slice(0, content.indexOf(" -> ")).trim();
          lang = content.substring(content.indexOf(" -> ") + 4).trim();
        } else {
          translateThis = content;
        }
      }

      // Validate text length
      if (translateThis.length === 0) {
        return api.sendMessage("❌ 𝖭𝗈 𝗍𝖾𝗑𝗍 𝖿𝗈𝗎𝗇𝖽 𝗍𝗈 𝗍𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝖾", event.threadID, event.messageID);
      }

      if (translateThis.length > 4000) {
        return api.sendMessage("❌ 𝖳𝖾𝗑𝗍 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 4000 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌", event.threadID, event.messageID);
      }

      console.log(`🔤 𝖳𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝗂𝗇𝗀: "${translateThis.substring(0, 50)}..." 𝗍𝗈 𝖯𝖺𝗌𝗁𝗍𝗈`);

      return new Promise((resolve, reject) => {
        request(
          {
            url: encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ps&dt=t&q=${translateThis}`),
            timeout: 30000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          },
          (err, response, body) => {
            if (err) {
              console.error("❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝖾𝗋𝗋𝗈𝗋:", err);
              api.sendMessage("❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.", event.threadID, event.messageID);
              return reject(err);
            }

            if (!body || response.statusCode !== 200) {
              console.error("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾:", response?.statusCode);
              api.sendMessage("❌ 𝖳𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝗂𝗈𝗇 𝗌𝖾𝗋𝗏𝗂𝖼𝖾 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.", event.threadID, event.messageID);
              return reject(new Error("Invalid response"));
            }

            let retrieve;
            try {
              retrieve = JSON.parse(body);
            } catch (e) {
              console.error("❌ 𝖩𝖲𝖮𝖭 𝗉𝖺𝗋𝗌𝖾 𝖾𝗋𝗋𝗈𝗋:", e);
              api.sendMessage("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝖿𝗋𝗈𝗆 𝗍𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝗂𝗈𝗇 𝗌𝖾𝗋𝗏𝗂𝖼𝖾.", event.threadID, event.messageID);
              return reject(e);
            }

            let text = "";
            if (Array.isArray(retrieve) && Array.isArray(retrieve[0])) {
              retrieve[0].forEach(item => {
                if (item && item[0]) text += item[0];
              });
            }

            if (text.length === 0) {
              console.error("❌ 𝖭𝗈 𝗍𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝗂𝗈𝗇 𝗋𝖾𝗌𝗎𝗅𝗍:", retrieve);
              api.sendMessage("❌ 𝖭𝗈 𝗍𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝗂𝗈𝗇 𝗋𝖾𝗌𝗎𝗅𝗍 𝖿𝗈𝗎𝗇𝖽.", event.threadID, event.messageID);
              return reject(new Error("No translation result"));
            }

            let fromLang = "auto";
            try {
              const src1 = retrieve[2];
              const src2 = retrieve[8] && retrieve[8][0] && retrieve[8][0][0];
              fromLang = src2 || src1 || "auto";
            } catch (e) {
              console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖽𝖾𝗍𝖾𝖼𝗍 𝗌𝗈𝗎𝗋𝖼𝖾 𝗅𝖺𝗇𝗀𝗎𝖺𝗀𝖾:", e);
              fromLang = "auto";
            }

            console.log(`✅ 𝖳𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝗂𝗈𝗇 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅: ${fromLang} → 𝗉𝗌`);

            const resultMessage = 
              `📝 𝖳𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝗂𝗈𝗇 𝖱𝖾𝗌𝗎𝗅𝗍:\n\n` +
              `🔤 ${text}\n\n` +
              `🍂 ${fromLang} 𝗋𝖺 𝖯𝖺𝗌𝗁𝗍𝗈 𝗍𝖺𝗒 𝖻𝖺𝖽𝖺𝗅𝖺 𝗁𝗈𝗒𝖾𝖼𝗁𝖾 🍂`;

            api.sendMessage(resultMessage, event.threadID, event.messageID);
            resolve();
          }
        );
      });

    } catch (error) {
      console.error("💥 𝖳𝗋𝖺𝗇𝗌-𝖯𝖺𝗌𝗁𝗍𝗈 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
      
      let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
      
      if (error.code === 'ETIMEDOUT') {
        errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
      } else if (error.message.includes('network')) {
        errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
      }
      
      api.sendMessage(errorMessage, event.threadID, event.messageID);
    }
  }
};
