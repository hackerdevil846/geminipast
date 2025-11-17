const moment = require("moment-timezone");

const num = 10; // spam limit (number of commands within time window to trigger ban)
const timee = 120; // time window in seconds

module.exports = {
  config: {
    name: "spamban",
    aliases: ["antispam"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 1,
    category: "system",
    shortDescription: {
      en: "🛡️ 𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐 𝑠𝑝𝑎𝑚 𝑝𝑟𝑜𝑡𝑒𝑐𝑡𝑖𝑜𝑛 𝑠𝑦𝑠𝑡𝑒𝑚"
    },
    longDescription: {
      en: `𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑏𝑎𝑛𝑠 𝑢𝑠𝑒𝑟𝑠 𝑤ℎ𝑜 𝑠𝑝𝑎𝑚 ${num} 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑤𝑖𝑡ℎ𝑖𝑛 ${timee} 𝑠𝑒𝑐𝑜𝑛𝑑𝑠`
    },
    guide: {
      en: "{p}spamban"
    },
    countDown: 5,
    dependencies: {
      "moment-timezone": ""
    }
  },

  onStart: async function ({ message }) {
    try {
      const text = `🛡️ 𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐 𝑠𝑝𝑎𝑚 𝑝𝑟𝑜𝑡𝑒𝑐𝑡𝑖𝑜𝑛 𝑖𝑠 𝑎𝑐𝑡𝑖𝑣𝑒\n⚡ 𝐵𝑎𝑛 𝑡ℎ𝑟𝑒𝑠ℎ𝑜𝑙𝑑: ${num} 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑝𝑒𝑟 ${timee} 𝑠𝑒𝑐𝑜𝑛𝑑𝑠`;
      return message.reply(text);
    } catch (err) {
      console.error("spamban.onStart error:", err);
    }
  },

  onChat: async function ({ usersData, threadsData, api, event, message }) {
    try {
      // only proceed for normal messages
      if (!event || !event.threadID || !event.senderID) return;

      const { senderID, threadID } = event;

      // prepare thread data and prefix
      const threadSetting = (threadsData.get(threadID) || {}).data || {};
      const prefix = threadSetting.PREFIX || (global.config && global.config.PREFIX) || "";

      // ignore if message doesn't start with prefix (so only commands count)
      if (!event.body || prefix === "" || event.body.indexOf(prefix) !== 0) return;

      // initialize global.client.autoban map if needed
      if (!global.client) global.client = {};
      if (!global.client.autoban) global.client.autoban = {};

      // initialize user record for autoban
      if (!global.client.autoban[senderID]) {
        global.client.autoban[senderID] = {
          timeStart: Date.now(),
          number: 0
        };
      }

      // reset counter if time window expired
      const now = Date.now();
      if ((global.client.autoban[senderID].timeStart + (timee * 1000)) <= now) {
        global.client.autoban[senderID] = {
          timeStart: now,
          number: 0
        };
        return; // reset means this command is first in new window; don't increment further this event
      } else {
        // increment count within same time window
        global.client.autoban[senderID].number++;
      }

      // if limit reached -> ban user
      if (global.client.autoban[senderID].number >= num) {
        // fetch thread info safely
        let datathread = {};
        try {
          datathread = (await threadsData.get(threadID)).threadInfo || {};
        } catch (e) {
          datathread.threadName = datathread.threadName || "";
        }
        const namethread = datathread.threadName || "";

        // time string in Asia/Dhaka
        const timeDate = moment.tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss");

        // user data
        let dataUser = {};
        try {
          dataUser = await usersData.get(senderID) || {};
        } catch (e) {
          dataUser = { name: "", data: {} };
        }
        let data = dataUser.data || {};

        // if already banned, do nothing
        if (data && data.banned === true) {
          // reset counters anyway so it doesn't spam banning repeatedly
          global.client.autoban[senderID] = {
            timeStart: Date.now(),
            number: 0
          };
          return;
        }

        // set ban fields
        data.banned = true;
        data.reason = `𝑆𝑝𝑎𝑚 𝑏𝑜𝑡 ${num} 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑝𝑒𝑟 ${timee} 𝑠𝑒𝑐𝑜𝑛𝑑𝑠` || null;
        data.dateAdded = timeDate;

        // save user data
        try {
          await usersData.set(senderID, { data });
        } catch (e) {
          console.error("spamban: error setting user data:", e);
        }

        // update global banned map if exists
        try {
          if (!global.data) global.data = {};
          if (!global.data.userBanned) global.data.userBanned = new Map();
          global.data.userBanned.set(senderID, { reason: data.reason, dateAdded: data.dateAdded });
        } catch (e) {
          console.error("spamban: error updating global.data.userBanned:", e);
        }

        // reset counter after ban
        global.client.autoban[senderID] = {
          timeStart: Date.now(),
          number: 0
        };

        // notify thread and admins
        const notifyMsg =
          `🚫 𝑼𝑺𝑬𝑹 𝑩𝑨𝑵𝑵𝑬𝑫 𝑭𝑶𝑹 𝑺𝑷𝑨𝑴𝑴𝑰𝑵𝑮\n` +
          `👤 𝑰𝑫: ${senderID}\n` +
          `📛 𝑵𝑨𝑴𝑬: ${dataUser.name || ""}\n` +
          `⚡ 𝑹𝑬𝑨𝑺𝑶𝑵: ${num} 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑖𝑛 ${timee} 𝑠𝑒𝑐𝑜𝑛𝑑𝑠\n` +
          `⏰ 𝑻𝑰𝑴𝑬: ${timeDate}`;

        // send to current thread
        try {
          await message.reply(notifyMsg);
          
          // send detailed report to admins if ADMINBOT exists
          try {
            const admins = global.config && global.config.ADMINBOT ? global.config.ADMINBOT : [];
            if (Array.isArray(admins) && admins.length > 0) {
              for (let ad of admins) {
                const adminMsg =
                  `🚨 𝑺𝑷𝑨𝑴 𝑩𝑨𝑵 𝑹𝑬𝑷𝑶𝑹𝑻\n` +
                  `👤 𝑵𝑨𝑴𝑬: ${dataUser.name || ""}\n` +
                  `🆔 𝑰𝑫: ${senderID}\n` +
                  `💬 𝑩𝑶𝑿 𝑰𝑫: ${threadID}\n` +
                  `📦 𝑩𝑶𝑿 𝑵𝑨𝑴𝑬: ${namethread}\n` +
                  `⏰ 𝑻𝑰𝑴𝑬: ${timeDate}`;
                api.sendMessage(adminMsg, ad);
              }
            }
          } catch (e) {
            console.error("spamban: error notifying admins:", e);
          }
        } catch (e) {
          console.error("spamban: error sending thread/admin messages:", e);
        }
      }
    } catch (err) {
      console.error("spamban.onChat error:", err);
    }
  }
};
