const num = 10; // LIMIT: Number of messages to trigger ban. Change this if needed.
const timee = 120; // TIME: 120 seconds (2 minutes).

module.exports = {
  config: {
    name: "antispam",
    version: "2.2.0",
    permission: 0,
    credits: "asif",
    description: "Automatically ban spammers and unban after time",
    prefix: true,
    category: "system",
    usages: "none",
    cooldowns: 0,
  },

  onStart: async function({ api, event }) {
    try {
      return api.sendMessage(
        `Anti-spam active: Users will be banned if they spam ${num} times within ${timee} seconds.`,
        event.threadID,
        event.messageID
      );
    } catch (e) {
      // SILENT CATCH: Do not send error if onStart fails
      return;
    }
  },

  onChat: async function({ Users, Threads, api, event }) {
    // MASTER TRY-CATCH: Wraps the entire command to prevent ANY error message from being sent to chat
    try {
      // 1. Basic checks
      if (!event.body) return;
      
      let { senderID, messageID, threadID } = event;
      const sender = senderID;

      // 2. Initialize global spam tracking if missing
      if (!global.client.autoban) global.client.autoban = {};
      if (!global.client.autoban[sender]) {
        global.client.autoban[sender] = {
          timeStart: Date.now(),
          number: 0
        };
      }

      // 3. Get Prefix
      // Using optional chaining and OR operators to prevent crashes if data is null
      const threadSetting = (global.data.threadData && global.data.threadData.get(threadID)) || {};
      const prefix = threadSetting.PREFIX || global.config.PREFIX;

      // Only count messages that start with the prefix (commands)
      if (event.body.indexOf(prefix) !== 0) return;

      // 4. Check time window
      if ((global.client.autoban[sender].timeStart + (timee * 1000)) <= Date.now()) {
        global.client.autoban[sender] = {
          timeStart: Date.now(),
          number: 0
        };
      } else {
        // Increment spam count
        global.client.autoban[sender].number++;

        // 5. BAN TRIGGER
        if (global.client.autoban[sender].number >= num) {
          
          // Check if already banned to prevent double-execution
          let dataUser = await Users.getData(sender) || {};
          let data = dataUser.data || {};
          if (data && data.banned) return;

          const moment = require("moment-timezone");
          const timeDate = moment.tz("Asia/Manila").format("DD/MM/YYYY HH:mm:ss");

          // Try to get Group Name safely
          let threadName = "Unknown Group";
          try {
              let threadInfo = await Threads.getData(threadID);
              if (threadInfo && threadInfo.threadInfo) {
                  threadName = threadInfo.threadInfo.threadName || "Unknown Group";
              }
          } catch (error) {
              // Intentionally empty to be silent
          }

          // Apply Ban in Database
          data.banned = true;
          data.reason = `Spamming commands (${num} times in ${timee}s)`;
          data.dateAdded = timeDate;

          await Users.setData(sender, { data });
          
          if (global.data.userBanned) {
            global.data.userBanned.set(sender, {
              reason: data.reason,
              dateAdded: data.dateAdded
            });
          }

          // Reset local counter
          global.client.autoban[sender] = {
            timeStart: Date.now(),
            number: 0
          };

          // Notify the Group
          // We wrap this in a specific try-catch just in case the bot is muted/blocked in the group
          try {
            api.sendMessage(
              `🚫 Auto-Ban Alert\n\nUser: ${dataUser.name || sender}\nReason: Spamming bot ${num} times.\n\n⚠️ You have been banned from using the bot for ${timee / 60} minutes.`,
              threadID,
              () => {
                // Notify Admins
                try {
                    var idad = global.config.ADMINBOT;
                    for (let ad of idad) {
                    api.sendMessage(
                        `🚨 Spam Ban Notification\n\n` +
                        `Name: ${dataUser.name || "Unknown"}\n` +
                        `ID: ${sender}\n` +
                        `Group: ${threadName}\n` +
                        `Time: ${timeDate}\n` +
                        `Action: Banned for ${timee}s`,
                        ad
                    );
                    }
                } catch(e) { /* Silent */ }
              }
            );
          } catch (e) { /* Silent */ }

          // 6. AUTOMATIC UNBAN LOGIC - SILENT ERROR HANDLING
          setTimeout(async () => {
            try {
              // Fetch fresh data
              let unbanDataUser = await Users.getData(sender) || {};
              let unbanData = unbanDataUser.data || {};
              
              // Remove ban flags
              unbanData.banned = false;
              unbanData.reason = null;
              unbanData.dateAdded = null;

              // Save to database
              await Users.setData(sender, { data: unbanData });
              
              // Remove from global cache
              if (global.data.userBanned) {
                global.data.userBanned.delete(sender);
              }

            } catch (e) {
              // Intentionally empty to be silent. 
              // If this fails, user stays banned until manual unban, but no error is printed.
            }
          }, timee * 1000);
        }
      }
    } catch (masterError) {
      // ABSOLUTE SILENCE
      // If ANY part of the code above fails (Threads undefined, API down, Database error),
      // this block catches it and does absolutely nothing.
      // This ensures "messenger do not sent error or any problem msg".
      return;
    }
  }
};
