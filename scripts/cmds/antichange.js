const fs = require("fs-extra");
const path = require("path");

// 𝗞𝗲𝗲𝗽 𝘁𝗵𝗲 𝘀𝗮𝗺𝗲 𝗽𝗮𝘁𝗵 𝘆𝗼𝘂 𝗽𝗿𝗼𝘃𝗶𝗱𝗲𝗱
const activeGroupsFilePath = path.join(__dirname, "..", "data", "antichange.json");
let activeGroups = {};

// 𝗟𝗼𝗮𝗱 𝗽𝗲𝗿𝘀𝗶𝘀𝘁𝗲𝗱 𝘀𝗲𝘁𝘁𝗶𝗻𝗴𝘀 𝗶𝗳 𝗲𝘅𝗶𝘀𝘁𝘀
if (fs.existsSync(activeGroupsFilePath)) {
  try {
    const fileData = fs.readFileSync(activeGroupsFilePath, "utf-8");
    if (fileData.trim()) {
      activeGroups = JSON.parse(fileData);
    }
    if (typeof activeGroups !== "object" || activeGroups === null) {
      console.warn("⚠️ 𝗮𝗰𝘁𝗶𝘃𝗲𝗚𝗿𝗼𝘂𝗽𝘀 𝗱𝗮𝘁𝗮 𝗶𝘀 𝗻𝗼𝘁 𝗮𝗻 𝗼𝗯𝗷𝗲𝗰𝘁. 𝗜𝗻𝗶𝘁𝗶𝗮𝗹𝗶𝘇𝗶𝗻𝗴 𝘁𝗼 𝗲𝗺𝗽𝘁𝘆 𝗼𝗯𝗷𝗲𝗰𝘁.");
      activeGroups = {};
    }
  } catch (error) {
    console.error("💥 𝗘𝗿𝗿𝗼𝗿 𝗹𝗼𝗮𝗱𝗶𝗻𝗴 𝗮𝗰𝘁𝗶𝘃𝗲 𝗴𝗿𝗼𝘂𝗽𝘀:", error);
    activeGroups = {};
  }
}

const saveActiveGroups = () => {
  try {
    // 𝗘𝗻𝘀𝘂𝗿𝗲 𝗳𝗼𝗹𝗱𝗲𝗿 𝗲𝘅𝗶𝘀𝘁𝘀
    fs.ensureDirSync(path.dirname(activeGroupsFilePath));
    fs.writeFileSync(activeGroupsFilePath, JSON.stringify(activeGroups, null, 2), "utf-8");
  } catch (error) {
    console.error("💥 𝗘𝗿𝗿𝗼𝗿 𝘀𝗮𝘃𝗶𝗻𝗴 𝗮𝗰𝘁𝗶𝘃𝗲 𝗴𝗿𝗼𝘂𝗽𝘀:", error);
  }
};

module.exports = {
  config: {
    name: "antichange",
    aliases: [],
    version: "1.0.0",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    category: "box",
    shortDescription: {
      en: "𝖯𝗋𝖾𝗏𝖾𝗇𝗍𝗌 𝗎𝗇𝖺𝗎𝗍𝗁𝗈𝗋𝗂𝗓𝖾𝖽 𝗀𝗋𝗈𝗎𝗉 𝖼𝗁𝖺𝗇𝗀𝖾𝗌"
    },
    longDescription: {
      en: "𝖯𝗋𝖾𝗏𝖾𝗇𝗍𝗌 𝗎𝗇𝖺𝗎𝗍𝗁𝗈𝗋𝗂𝗓𝖾𝖽 𝗀𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾 𝖺𝗇𝖽 𝗂𝗆𝖺𝗀𝖾 𝖼𝗁𝖺𝗇𝗀𝖾𝗌"
    },
    guide: {
      en: "{p}antichange [on/off]"
    },
    dependencies: {
      "fs-extra": "",
      "path": ""
    }
  },

  onStart: async function({ message, args, event, threadsData, api, global }) {
    try {
      // 𝖣𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗒 𝖼𝗁𝖾𝖼𝗄
      let dependenciesAvailable = true;
      try {
        require("fs-extra");
        require("path");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        return await message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
      }

      const threadID = event.threadID;
      const senderID = String(event.senderID);

      // 𝖦𝖾𝗍 𝖻𝗈𝗍 𝖺𝖽𝗆𝗂𝗇𝗌 𝖿𝗋𝗈𝗆 𝗀𝗅𝗈𝖻𝖺𝗅 𝖼𝗈𝗇𝖿𝗂𝗀
      const botAdmins = Array.isArray(global?.config?.ADMINBOT) ? global.config.ADMINBOT.map(id => String(id)) : [];

      // 𝖥𝖾𝗍𝖼𝗁 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈 𝗐𝗂𝗍𝗁 𝖾𝗋𝗋𝗈𝗋 𝗁𝖺𝗇𝖽𝗅𝗂𝗇𝗀
      let threadInfo;
      try {
        threadInfo = await api.getThreadInfo(threadID);
        if (!threadInfo) {
          return await message.reply("⚠️ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗍𝗋𝗂𝖾𝗏𝖾 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈.");
        }
      } catch (threadError) {
        console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝖿𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈:", threadError);
        return await message.reply("⚠️ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗍𝗋𝗂𝖾𝗏𝖾 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈.");
      }

      // 𝖡𝗎𝗂𝗅𝖽 𝖺𝖽𝗆𝗂𝗇 𝗅𝗂𝗌𝗍
      const adminIDs = Array.isArray(threadInfo.adminIDs) ? threadInfo.adminIDs.map(a => String(a.id)) : [];
      const isAdmin = adminIDs.includes(senderID) || botAdmins.includes(senderID);

      if (!isAdmin) {
        return await message.reply("⚠️ 𝖮𝗇𝗅𝗒 𝗀𝗋𝗈𝗎𝗉 𝖺𝖽𝗆𝗂𝗇𝗌 𝗈𝗋 𝖻𝗈𝗍 𝖺𝖽𝗆𝗂𝗇𝗌 𝖼𝖺𝗇 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.");
      }

      const subCommand = (args[0] || "").toLowerCase().trim();

      if (subCommand === "on") {
        // 𝖨𝖿 𝗇𝗈𝗍 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝖺𝖼𝗍𝗂𝗏𝖾, 𝗌𝖺𝗏𝖾 𝗂𝗇𝗂𝗍𝗂𝖺𝗅 𝗂𝗇𝖿𝗈
        if (!activeGroups[threadID]) {
          const initialName = threadInfo.threadName || "";
          const initialImage = threadInfo.imageSrc || "";

          activeGroups[threadID] = {
            name: initialName,
            image: initialImage,
            enabledBy: senderID,
            enabledAt: Date.now(),
            originalName: initialName,
            originalImage: initialImage
          };

          // 𝖯𝖾𝗋𝗌𝗂𝗌𝗍 𝗍𝗈 𝖿𝗂𝗅𝖾
          saveActiveGroups();

          // 𝖲𝗍𝗈𝗋𝖾 𝗍𝗈 𝗍𝗁𝗋𝖾𝖺𝖽𝗌𝖣𝖺𝗍𝖺 𝖿𝗈𝗋 𝗂𝗇-𝖺𝗉𝗉 𝗎𝗌𝖺𝗀𝖾
          try {
            if (threadsData && typeof threadsData.set === "function") {
              await threadsData.set(threadID, { antichange: activeGroups[threadID] });
            }
          } catch (err) {
            console.warn("⚠️ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗍𝗁𝗋𝖾𝖺𝖽𝗌𝖣𝖺𝗍𝖺:", err);
          }

          return await message.reply("✅ 𝖠𝗇𝗍𝗂-𝖼𝗁𝖺𝗇𝗀𝖾 𝖿𝖾𝖺𝗍𝗎𝗋𝖾 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖺𝖼𝗍𝗂𝗏𝖺𝗍𝖾𝖽 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉.");
        } else {
          return await message.reply("⚠️ 𝖠𝗇𝗍𝗂-𝖼𝗁𝖺𝗇𝗀𝖾 𝗂𝗌 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝖺𝖼𝗍𝗂𝗏𝖾 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉.");
        }
      } else if (subCommand === "off") {
        if (activeGroups[threadID]) {
          delete activeGroups[threadID];
          saveActiveGroups();

          // 𝖱𝖾𝗆𝗈𝗏𝖾 𝖿𝗋𝗈𝗆 𝗍𝗁𝗋𝖾𝖺𝖽𝗌𝖣𝖺𝗍𝖺
          try {
            if (threadsData && typeof threadsData.del === "function") {
              await threadsData.del(threadID);
            } else if (threadsData && typeof threadsData.delete === "function") {
              await threadsData.delete(threadID);
            }
          } catch (err) {
            console.warn("⚠️ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝖾𝗅𝖾𝗍𝖾 𝗍𝗁𝗋𝖾𝖺𝖽𝗌𝖣𝖺𝗍𝖺:", err);
          }

          return await message.reply("🚫 𝖠𝗇𝗍𝗂-𝖼𝗁𝖺𝗇𝗀𝖾 𝖿𝖾𝖺𝗍𝗎𝗋𝖾 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖽𝖾𝖺𝖼𝗍𝗂𝗏𝖺𝗍𝖾𝖽 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉.");
        } else {
          return await message.reply("⚠️ 𝖠𝗇𝗍𝗂-𝖼𝗁𝖺𝗇𝗀𝖾 𝗂𝗌 𝗇𝗈𝗍 𝖺𝖼𝗍𝗂𝗏𝖾 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉.");
        }
      } else if (subCommand === "status") {
        if (activeGroups[threadID]) {
          const groupData = activeGroups[threadID];
          const enabledDate = new Date(groupData.enabledAt).toLocaleString();
          
          return await message.reply(`📊 𝖠𝗇𝗍𝗂-𝖼𝗁𝖺𝗇𝗀𝖾 𝖲𝗍𝖺𝗍𝗎𝗌:

✅ 𝖠𝖼𝗍𝗂𝗏𝖾: 𝖸𝖾𝗌
👤 𝖤𝗇𝖺𝖻𝗅𝖾𝖽 𝖻𝗒: ${groupData.enabledBy}
📅 𝖤𝗇𝖺𝖻𝗅𝖾𝖽 𝖺𝗍: ${enabledDate}
🏷️ 𝖯𝗋𝗈𝗍𝖾𝖼𝗍𝖾𝖽 𝗇𝖺𝗆𝖾: ${groupData.originalName || "𝖭/𝖠"}`);
        } else {
          return await message.reply("📊 𝖠𝗇𝗍𝗂-𝖼𝗁𝖺𝗇𝗀𝖾 𝖲𝗍𝖺𝗍𝗎𝗌: 𝖨𝗇𝖺𝖼𝗍𝗂𝗏𝖾");
        }
      } else {
        return await message.reply(`🎯 𝖠𝗇𝗍𝗂-𝖼𝗁𝖺𝗇𝗀𝖾 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖴𝗌𝖺𝗀𝖾:

✅ 𝖤𝗇𝖺𝖻𝗅𝖾: 𝖺𝗇𝗍𝗂𝖼𝗁𝖺𝗇𝗀𝖾 𝗈𝗇
🚫 𝖣𝗂𝗌𝖺𝖻𝗅𝖾: 𝖺𝗇𝗍𝗂𝖼𝗁𝖺𝗇𝗀𝖾 𝗈𝖿𝖿
📊 𝖲𝗍𝖺𝗍𝗎𝗌: 𝖺𝗇𝗍𝗂𝖼𝗁𝖺𝗇𝗀𝖾 𝗌𝗍𝖺𝗍𝗎𝗌

𝖯𝗋𝖾𝗏𝖾𝗇𝗍𝗌 𝗎𝗇𝖺𝗎𝗍𝗁𝗈𝗋𝗂𝗓𝖾𝖽 𝗀𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾 𝖺𝗇𝖽 𝗂𝗆𝖺𝗀𝖾 𝖼𝗁𝖺𝗇𝗀𝖾𝗌.`);
      }
    } catch (error) {
      console.error("💥 𝖠𝗇𝗍𝗂𝖼𝗁𝖺𝗇𝗀𝖾 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
      // 𝖣𝗈𝗇'𝗍 𝗌𝖾𝗇𝖽 𝖾𝗋𝗋𝗈𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗍𝗈 𝖺𝗏𝗈𝗂𝖽 𝗌𝗉𝖺𝗆
    }
  },

  // 𝖤𝗏𝖾𝗇𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋𝗌 𝖿𝗈𝗋 𝗀𝗋𝗈𝗎𝗉 𝖼𝗁𝖺𝗇𝗀𝖾𝗌
  handleEvent: async function({ event, api }) {
    try {
      const threadID = event.threadID;
      
      if (activeGroups[threadID]) {
        const groupData = activeGroups[threadID];
        
        // 𝖧𝖺𝗇𝖽𝗅𝖾 𝗀𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾 𝖼𝗁𝖺𝗇𝗀𝖾
        if (event.logMessageType === "log:thread-name") {
          const newName = event.logMessageData?.name || "";
          if (newName !== groupData.originalName) {
            try {
              // 𝖱𝖾𝗏𝖾𝗋𝗍 𝗍𝗈 𝗈𝗋𝗂𝗀𝗂𝗇𝖺𝗅 𝗇𝖺𝗆𝖾
              await api.setTitle(groupData.originalName, threadID);
              console.log(`✅ 𝖱𝖾𝗏𝖾𝗋𝗍𝖾𝖽 𝗀𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾 𝖻𝖺𝖼𝗄 𝗍𝗈: ${groupData.originalName}`);
            } catch (error) {
              console.error("💥 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗏𝖾𝗋𝗍 𝗀𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾:", error);
            }
          }
        }
        
        // 𝖧𝖺𝗇𝖽𝗅𝖾 𝗀𝗋𝗈𝗎𝗉 𝗂𝗆𝖺𝗀𝖾 𝖼𝗁𝖺𝗇𝗀𝖾
        if (event.logMessageType === "log:thread-image") {
          console.log("⚠️ 𝖦𝗋𝗈𝗎𝗉 𝗂𝗆𝖺𝗀𝖾 𝖼𝗁𝖺𝗇𝗀𝖾 𝖽𝖾𝗍𝖾𝖼𝗍𝖾𝖽 - 𝖠𝗇𝗍𝗂-𝖼𝗁𝖺𝗇𝗀𝖾 𝗂𝗌 𝖺𝖼𝗍𝗂𝗏𝖾");
          // 𝖭𝗈𝗍𝖾: 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖠𝖯𝖨 𝖽𝗈𝖾𝗌𝗇'𝗍 𝖺𝗅𝗅𝗈𝗐 𝗋𝖾𝗏𝖾𝗋𝗍𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉 𝗂𝗆𝖺𝗀𝖾𝗌
        }
      }
    } catch (error) {
      console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗁𝖺𝗇𝖽𝗅𝖾𝖤𝗏𝖾𝗇𝗍:", error);
    }
  }
};
