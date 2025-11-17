/**  const num = 6000; // Number of times spam gets banned -1 (for example, 5 times means 6 times will get banned)
const timee = 120; // During this time (in seconds), if someone spams `num` times, they will be banned

module.exports = {
  config: {
    name: "antispam",
    version: "1.0.0",
    permission: 0,
    credits: "asif",
    description: "Automatically ban spammers",
    prefix: true,
    category: "system",
    usages: "none",
    cooldowns: 0,
  },

  // Main command handler
  onStart: async function({ api, event }) {
    return api.sendMessage(
      `Automatically ban users if they spam ${num} times within ${timee} seconds.`,
      event.threadID,
      event.messageID
    );
  },

  // Event handler for messages
  onChat: async function({ Users, Threads, api, event }) {
    let { senderID, messageID, threadID } = event;

    // Safety check for Threads
    if (!Threads || typeof Threads.getData !== 'function') {
      console.error('Threads is undefined or invalid in antispam.js onChat');
      api.sendMessage('Error: Thread data is unavailable. Contact an admin.', threadID);
      return;
    }

    var datathread = (await Threads.getData(event.threadID)).threadInfo;

    // Initialize autoban tracking if not exists
    if (!global.client.autoban) global.client.autoban = {};

    // Initialize tracking for this user if not exists
    if (!global.client.autoban[senderID]) {
      global.client.autoban[senderID] = {
        timeStart: Date.now(),
        number: 0
      };
    }

    const threadSetting = global.data.threadData.get(threadID) || {};
    const prefix = threadSetting.PREFIX || global.config.PREFIX;

    // Only check commands (messages starting with prefix)
    if (!event.body || event.body.indexOf(prefix) != 0) return;

    // Check if enough time has passed to reset the counter
    if ((global.client.autoban[senderID].timeStart + (timee * 1000)) <= Date.now()) {
      global.client.autoban[senderID] = {
        timeStart: Date.now(),
        number: 0
      };
    } else {
      global.client.autoban[senderID].number++;

      // If spam threshold reached
      if (global.client.autoban[senderID].number >= num) {
        const moment = require("moment-timezone");
        const timeDate = moment.tz("Asia/Manila").format("DD/MM/YYYY HH:mm:ss");

        // Get user data and prepare ban
        let dataUser = await Users.getData(senderID) || {};
        let data = dataUser.data || {};

        // Skip if already banned
        if (data && data.banned == true) return;

        // Apply ban
        data.banned = true;
        data.reason = `spam bot ${num} times/${timee}s` || null;
        data.dateAdded = timeDate;

        // Save ban data
        await Users.setData(senderID, { data });
        global.data.userBanned.set(senderID, {
          reason: data.reason,
          dateAdded: data.dateAdded
        });

        // Reset counter after ban
        global.client.autoban[senderID] = {
          timeStart: Date.now(),
          number: 0
        };

        // Notify group and admins
        api.sendMessage(
          `${senderID}\nname: ${dataUser.name}\nreason: spam bot ${num} times\n` +
          `automatically unban after ${timee} seconds\n\nreport sent to admins`,
          threadID,
          () => {
            var idad = global.config.ADMINBOT;
            for (let ad of idad) {
              api.sendMessage(
                `spam ban notification\n\nspam offenders ${num}/${timee}s\n` +
                `name: ${dataUser.name}\nuser id: ${senderID}\n` +
                `group ID: ${threadID}\ngroup name: ${datathread.threadName}\n` +
                `time: ${timeDate}`,
                ad
              );
            }
          }
        );
      }
    }
  }
};
**/
