const SPAM_LIMIT = 110; // Increased to 110 messages
const TIME_FRAME = 20000; // Reduced to 20 seconds

// ==================== 🔧 CORE SYSTEM ====================
function initializeGlobals() {
  if (typeof global.antispam === 'undefined') {
    global.antispam = new Map();
  }
  if (typeof global.client === 'undefined') {
    global.client = {};
  }
  if (typeof global.client.onReaction === 'undefined') {
    global.client.onReaction = new Map();
  }
}

async function getUserName(api, usersData, userID) {
  try {
    if (usersData && typeof usersData.getName === 'function') {
      return await usersData.getName(userID);
    } else {
      const userInfo = await api.getUserInfo(userID);
      return userInfo[userID]?.name || "User";
    }
  } catch (error) {
    return "User";
  }
}

async function getThreadInfoSafe(api, threadID) {
  try {
    return await api.getThreadInfo(threadID);
  } catch (error) {
    return null;
  }
}

function isUserAdmin(threadInfo, userID) {
  if (!threadInfo || !threadInfo.adminIDs) return false;
  return threadInfo.adminIDs.some(admin => admin.id === userID);
}

function isBotAdmin(threadInfo, botID) {
  if (!threadInfo || !threadInfo.adminIDs) return false;
  return threadInfo.adminIDs.some(admin => admin.id === botID);
}

function cleanupOldData() {
  try {
    const now = Date.now();
    
    if (global.antispam && global.antispam instanceof Map) {
      for (const [threadID, thread] of global.antispam.entries()) {
        if (thread && thread.users) {
          for (const [userID, userData] of Object.entries(thread.users)) {
            if (userData && now - userData.time > TIME_FRAME * 2) {
              delete thread.users[userID];
            }
          }
          if (Object.keys(thread.users).length === 0) {
            global.antispam.delete(threadID);
          }
        }
      }
    }
    
    if (global.client && global.client.onReaction) {
      for (const [messageID, reactionData] of global.client.onReaction.entries()) {
        if (reactionData && now - reactionData.timestamp > 3600000) {
          global.client.onReaction.delete(messageID);
        }
      }
    }
  } catch (cleanupError) {
    // Silent cleanup
  }
}

// Initialize and start cleanup
initializeGlobals();
setInterval(cleanupOldData, 300000);

// ==================== 🤖 MAIN CODE ====================
module.exports = {
  config: {
    name: "spamkick",
    aliases: [],
    version: "2.1.0",
    author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
    role: 1,
    category: "group",
    shortDescription: {
      en: "🛡️ Auto-kick spammers from group"
    },
    longDescription: {
      en: "Automatically detect and kick spammers from the group with anti-spam protection"
    },
    guide: {
      en: "{p}spamkick on/off/status"
    },
    countDown: 5
  },

  onChat: async function ({ api, event, usersData, message, threadsData }) {
    if (!api || !event || !message) return;

    try {
      const { senderID, threadID } = event;
      const botID = api.getCurrentUserID();

      initializeGlobals();

      // Skip conditions
      if (!event.isGroup || !global.antispam?.has(threadID)) return;
      if (senderID === botID) return;

      const threadInfo = await getThreadInfoSafe(api, threadID);
      if (!threadInfo) return;

      // Skip admins
      if (isUserAdmin(threadInfo, senderID)) return;
      if (global.client?.config?.adminBot?.includes(senderID)) return;

      // Initialize thread data
      if (!global.antispam.has(threadID)) {
        global.antispam.set(threadID, { users: {} });
      }

      const thread = global.antispam.get(threadID);
      if (!thread.users) thread.users = {};

      const user = thread.users[senderID] || { count: 0, time: Date.now(), warned: false };
      user.count++;

      const timePassed = Date.now() - user.time;
      
      if (timePassed > TIME_FRAME) {
        user.count = 1;
        user.time = Date.now();
        user.warned = false;
      } else if (user.count > SPAM_LIMIT) {
        // Warning at 90% limit (99 messages)
        if (!user.warned && user.count > SPAM_LIMIT * 0.9) {
          try {
            await message.reply(`⚠️ Warning: You are sending messages too quickly! Slow down or you will be kicked.`);
            user.warned = true;
          } catch (warnError) {}
        }

        // Kick user
        if (user.count > SPAM_LIMIT) {
          try {
            if (!isBotAdmin(threadInfo, botID)) {
              global.antispam.delete(threadID);
              await message.reply("❌ SpamKick disabled: Bot needs admin permissions.");
              return;
            }

            await api.removeUserFromGroup(senderID, threadID);
            const userName = await getUserName(api, usersData, senderID);

            const msg = await message.reply({
              body: `🚫 ${userName} has been removed for spamming.\n📩 React to this message to add back.`
            });

            if (msg && msg.messageID) {
              global.client.onReaction.set(msg.messageID, {
                uid: senderID,
                messageID: msg.messageID,
                threadID: threadID,
                timestamp: Date.now()
              });
            }

            user.count = 1;
            user.time = Date.now();
            user.warned = false;

          } catch (kickError) {
            if (kickError.message?.includes('permission') || kickError.error === 1357031) {
              await message.reply("❌ No permission to remove users. Make me admin.");
              global.antispam.delete(threadID);
            }
          }
        }
      }

      thread.users[senderID] = user;
      global.antispam.set(threadID, thread);

    } catch (error) {
      console.error("SpamKick onChat error:", error);
    }
  },

  onReaction: async function ({ api, event, usersData, message }) {
    if (!api || !event || !message) return;

    try {
      const { messageID, threadID, userID } = event;
      const botID = api.getCurrentUserID();
      
      initializeGlobals();
      
      if (!global.client.onReaction?.has(messageID)) return;
      
      const reactionData = global.client.onReaction.get(messageID);
      if (!reactionData || reactionData.threadID !== threadID) return;

      const { uid } = reactionData;
      const threadInfo = await getThreadInfoSafe(api, threadID);
      if (!threadInfo) return;

      const isAdmin = isUserAdmin(threadInfo, userID);
      const isBot = userID === botID;

      if (!isAdmin && !isBot) {
        await message.reply("❌ Only admins can add users back.");
        return;
      }

      let responseMsg = "";
      try {
        await api.addUserToGroup(uid, threadID);
        const userName = await getUserName(api, usersData, uid);
        responseMsg = `✅ ${userName} added back to group.`;
        await api.unsendMessage(messageID);
        global.client.onReaction.delete(messageID);
      } catch (addError) {
        const userName = await getUserName(api, usersData, uid);
        if (addError.message?.includes('already in group')) {
          responseMsg = `✅ ${userName} already in group.`;
          await api.unsendMessage(messageID);
          global.client.onReaction.delete(messageID);
        } else if (addError.message?.includes('friendship')) {
          responseMsg = `❌ Can't add ${userName} - need to be friends.`;
        } else {
          responseMsg = `❌ Failed to add ${userName} back.`;
        }
      }

      if (responseMsg) await message.reply(responseMsg);

    } catch (error) {
      console.error("Reaction handler error:", error);
    }
  },

  onStart: async function ({ api, event, args, message }) {
    if (!api || !event || !message) return;

    try {
      const { threadID } = event;
      const botID = api.getCurrentUserID();

      initializeGlobals();

      if (!event.isGroup) {
        return await message.reply("❌ Groups only!");
      }

      const threadInfo = await getThreadInfoSafe(api, threadID);
      const botIsAdmin = isBotAdmin(threadInfo, botID);
      const action = (args[0] || '').toLowerCase();
      
      switch (action) {
        case "on":
          if (!botIsAdmin) {
            return await message.reply("❌ Make me admin first!");
          }
          global.antispam.set(threadID, { users: {} });
          await message.reply(`✅ SpamKick ACTIVATED!\n\n⚡ Settings:\n• Limit: ${SPAM_LIMIT} messages\n• Time: ${TIME_FRAME/1000}s\n• Admins: Protected`);
          break;
          
        case "off":
          if (global.antispam.has(threadID)) {
            global.antispam.delete(threadID);
            await message.reply("❌ SpamKick OFF");
          } else {
            await message.reply("⚠️ Already OFF");
          }
          break;
          
        case "status":
          const isEnabled = global.antispam.has(threadID);
          const status = isEnabled ? "🟢 ON" : "🔴 OFF";
          await message.reply(`📊 Status: ${status}\n\n⚡ Limit: ${SPAM_LIMIT} messages/${TIME_FRAME/1000}s\n🤖 Bot Admin: ${botIsAdmin ? "✅" : "❌"}`);
          break;
          
        case "settings":
          await message.reply(`⚙️ SpamKick Config:\n\n📝 Limit: ${SPAM_LIMIT} messages\n⏰ Time: ${TIME_FRAME/1000}s\n🛡️ Admin Protection: Yes\n⚠️ Warnings: Yes`);
          break;
          
        default:
          const helpMessage = `📌 HOW TO USE:\n\n` +
            `• spamkick on - Activate protection\n` +
            `• spamkick off - Deactivate\n` +
            `• spamkick status - Check status\n` +
            `• spamkick settings - View config\n\n` +
            `⚡ Current: ${SPAM_LIMIT} messages per ${TIME_FRAME/1000}s`;
          await message.reply(helpMessage);
          break;
      }

    } catch (error) {
      await message.reply("❌ Command failed. Try again.");
    }
  },

  onLoad: function() {
    initializeGlobals();
    console.log("🛡️ SpamKick READY!");
  }
};
