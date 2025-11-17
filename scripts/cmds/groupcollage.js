const axios = require("axios");

async function baseApiUrl() {
  try {
    const base = await axios.get(
      `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
      { timeout: 10000 }
    );
    return base.data.api;
  } catch (error) {
    // Fallback API URL in case GitHub is unavailable
    return "https://api.d1pt0.repl.co";
  }
}

async function getAvatarUrls(userIDs) {
  let avatarURLs = [];

  for (let userID of userIDs) {
    try {
      const shortUrl = `https://graph.facebook.com/${userID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const response = await axios.get(shortUrl, { 
        timeout: 15000,
        maxRedirects: 5
      });
      let url = response.request.res.responseUrl;
      avatarURLs.push(url);
    } catch (error) {
      // Fallback avatar if user picture fails
      avatarURLs.push(
        "https://i.ibb.co/qk0bnY8/363492156-824459359287620-3125820102191295474-n-png-nc-cat-1-ccb-1-7-nc-sid-5f2048-nc-eui2-Ae-HIhi-I.png"
      );
    }
  }
  return avatarURLs;
}

module.exports = {
  config: {
    name: "groupcollage",
    aliases: ["gcollage", "grpmosaic"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "🖼️ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟 𝑐𝑜𝑙𝑙𝑎𝑔𝑒 𝑖𝑚𝑎𝑔𝑒"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑐𝑜𝑙𝑙𝑎𝑔𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠"
    },
    category: "𝑚𝑒𝑑𝑖𝑎",
    guide: {
      en: "{p}groupcollage --color [𝑐𝑜𝑙𝑜𝑟] --bgcolor [𝑐𝑜𝑙𝑜𝑟] --admincolor [𝑐𝑜𝑙𝑜𝑟] --membercolor [𝑐𝑜𝑙𝑜𝑟]"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    try {
      let color = "red";
      let bgColor = "https://telegra.ph/file/404fd6686c995d8db9ebf.jpg";
      let adminColor = "yellow";
      let memberColor = "";

      // Parse command arguments
      for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
          case "--color":
            if (args[i + 1]) {
              color = args[i + 1];
              args.splice(i, 2);
              i--;
            }
            break;
          case "--bgcolor":
            if (args[i + 1]) {
              bgColor = args[i + 1];
              args.splice(i, 2);
              i--;
            }
            break;
          case "--admincolor":
            if (args[i + 1]) {
              adminColor = args[i + 1];
              args.splice(i, 2);
              i--;
            }
            break;
          case "--membercolor":
            if (args[i + 1]) {
              memberColor = args[i + 1];
              args.splice(i, 2);
              i--;
            }
            break;
        }
      }

      // Get thread information
      let threadInfo;
      try {
        threadInfo = await api.getThreadInfo(event.threadID);
      } catch (threadError) {
        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑔𝑟𝑜𝑢𝑝 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
      }

      let participantIDs = threadInfo.participantIDs || [];
      let adminIDs = threadInfo.adminIDs ? threadInfo.adminIDs.map((admin) => admin.id) : [];
      
      if (participantIDs.length === 0) {
        return message.reply("❌ 𝑁𝑜 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝.");
      }

      // Show processing message
      let waitingMsg;
      try {
        waitingMsg = await message.reply("⏳ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑔𝑟𝑜𝑢𝑝 𝑐𝑜𝑙𝑙𝑎𝑔𝑒, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡...");
        await api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
      } catch (reactionError) {
        // Ignore reaction errors
      }

      // Get avatar URLs
      let memberURLs, adminURLs;
      try {
        memberURLs = await getAvatarUrls(participantIDs);
        adminURLs = await getAvatarUrls(adminIDs);
      } catch (avatarError) {
        if (waitingMsg) await message.unsend(waitingMsg.messageID);
        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑚𝑒𝑚𝑏𝑒𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠.");
      }

      const requestData = {
        memberURLs: memberURLs,
        groupPhotoURL: threadInfo.imageSrc || "",
        adminURLs: adminURLs,
        groupName: threadInfo.threadName || "Group Chat",
        bgcolor: bgColor,
        admincolor: adminColor,
        membercolor: memberColor,
        color: color,
      };

      let apiResponse;
      try {
        const apiUrl = await baseApiUrl();
        apiResponse = await axios.post(`${apiUrl}/groupPhoto`, requestData, {
          timeout: 60000,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (apiError) {
        if (waitingMsg) await message.unsend(waitingMsg.messageID);
        return message.reply("❌ 𝐴𝑃𝐼 𝑠𝑒𝑟𝑣𝑖𝑐𝑒 𝑖𝑠 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
      }

      if (apiResponse.data && apiResponse.data.img) {
        try {
          await api.setMessageReaction("✅", event.messageID, (err) => {}, true);
        } catch (reactionError) {
          // Ignore reaction errors
        }
        
        if (waitingMsg) await message.unsend(waitingMsg.messageID);
        
        await message.reply({
          body: `🖼️ 𝐻𝑒𝑟𝑒 𝑖𝑠 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝 𝑐𝑜𝑙𝑙𝑎𝑔𝑒 𝑖𝑚𝑎𝑔𝑒 ✨\n👥 𝑀𝑒𝑚𝑏𝑒𝑟𝑠: ${participantIDs.length}\n👑 𝐴𝑑𝑚𝑖𝑛𝑠: ${adminIDs.length}`,
          attachment: await global.utils.getStreamFromURL(apiResponse.data.img)
        });
      } else {
        if (waitingMsg) await message.unsend(waitingMsg.messageID);
        message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑐𝑜𝑙𝑙𝑎𝑔𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
      }
    } catch (error) {
      console.error("Group Collage Error:", error);
      
      let errorMessage = "❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑙𝑙𝑎𝑔𝑒.";
      
      if (error.message.includes("timeout")) {
        errorMessage = "⏰ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
      } else if (error.message.includes("Network Error")) {
        errorMessage = "🌐 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛.";
      }
      
      message.reply(errorMessage);
    }
  }
};
