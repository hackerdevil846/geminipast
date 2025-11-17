const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "outbox",
    aliases: ["scheduleleave", "timedleave"],
    version: "1.0.8",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 2,
    category: "🛡️ 𝑺𝒚𝒔𝒕𝒆𝒎",
    shortDescription: {
      en: "⏰ 𝑵𝒊𝒓𝒅𝒊𝒔𝒉𝒕𝒆 𝒔𝒐𝒎𝒐𝒚𝒆 𝒃𝒐𝒕𝒌𝒆 𝒌𝒐𝒏𝒐 𝒈𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒆𝒓𝒆 𝒌𝒐𝒓𝒆 𝒅𝒆𝒚"
    },
    longDescription: {
      en: "⏰ 𝑵𝒊𝒓𝒅𝒊𝒔𝒉𝒕𝒆 𝒔𝒐𝒎𝒐𝒚𝒆 𝒃𝒐𝒕𝒌𝒆 𝒌𝒐𝒏𝒐 𝒈𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒆𝒓𝒆 𝒌𝒐𝒓𝒆 𝒅𝒆𝒚"
    },
    guide: {
      en: "{𝑝}outbox"
    },
    dependencies: {
      "moment-timezone": ""
    }
  },

  // Helper function to format the timestamp
  convertTime: (timestamp, separator) => {
    const pad = (input) => (input < 10 ? "0" + input : input);
    const date = timestamp ? new Date(timestamp * 1000) : new Date();
    return [
      pad(date.getHours()),
      pad(date.getMinutes()),
      pad(date.getSeconds())
    ].join(typeof separator !== 'undefined' ? separator : ':');
  },

  // This function runs when a scheduled task is triggered
  handleSchedule: async function({ api, schedule }) {
    try {
      // Attempt to remove the bot from the target group
      await api.removeUserFromGroup(api.getCurrentUserID(), schedule.target);
      // Notify the admin of the successful departure
      api.sendMessage(`✅ | [𝒐𝒖𝒕𝒃𝒐𝒙]\n\n𝑺𝒂𝒑𝒉𝒂𝒍𝒃𝒉𝒂𝒃𝒆 𝒈𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒆𝒓𝒆 𝒉𝒐𝒚𝒆𝒄𝒉𝒊.\n🆔 𝑮𝒓𝒐𝒖𝒑 𝑨𝒊𝒅𝒊: ${schedule.target}`, global.config.ADMINBOT[0]);
    } catch (e) {
      console.error(`[𝑶𝑼𝑻𝑩𝑶𝑿 𝑬𝑹𝑹𝑶𝑹] 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒍𝒆𝒂𝒗𝒆 𝒈𝒓𝒐𝒖𝒑 ${schedule.target}: ${e}`);
      // Notify the admin if the bot fails to leave the group
      api.sendMessage(`❌ | [𝒐𝒖𝒕𝒃𝒐𝒙]\n\n𝑮𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒆𝒓𝒆 𝒉𝒐𝒕𝒆 𝒑𝒂𝒓𝒊𝒏𝒊.\n🆔 𝑮𝒓𝒐𝒖𝒑 𝑨𝒊𝒅𝒊: ${schedule.target}!`, global.config.ADMINBOT[0]);
    }
  },

  // This function handles replies for the interactive setup
  handleReply: async function({ api, event, handleReply }) {
    // Ensure the reply is from the original command user
    if (handleReply.author != event.senderID) return;

    switch (handleReply.type) {
      case "inputThreadID": {
        if (isNaN(event.body)) {
          return api.sendMessage("❌ | [𝒐𝒖𝒕𝒃𝒐𝒙]\n\n𝑫𝒂𝒚𝒂 𝒌𝒂𝒓𝒆𝒏 𝒆𝒌𝒕𝒊 𝒔𝒐𝒕𝒉𝒊𝒌 𝒈𝒓𝒐𝒖𝒑 𝒂𝒊𝒅𝒊 𝒅𝒊𝒏.", event.threadID, event.messageID);
        }
        api.unsendMessage(handleReply.messageID);
        return api.sendMessage("⏰ | [𝒐𝒖𝒕𝒃𝒐𝒙]\n\n𝑬𝒌𝒉𝒐𝒏 𝒅𝒂𝒚𝒂 𝒌𝒂𝒓𝒆𝒏 𝒔𝒐𝒎𝒐𝒚 𝒔𝒆𝒕 𝒌𝒂𝒓𝒖𝒏.\n𝑭𝒐𝒓𝒎𝒂𝒕: (𝑯𝑯:𝒎𝒎)", event.threadID, (err, info) => {
          global.client.handleReply.push({
            type: "inputTime",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID,
            target: event.body
          });
        });
      }

      case "inputTime": {
        const time = moment().tz("Asia/Dhaka");
        const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

        if (!regex.test(event.body)) {
          return api.sendMessage("❌ | [𝒐𝒖𝒕𝒃𝒐𝒙]\n\n𝑺𝒐𝒎𝒐𝒚𝒆𝒓 𝒇𝒐𝒓𝒎𝒂𝒕𝒕𝒊 𝒃𝒉𝒖𝒍. 𝑫𝒂𝒚𝒂 𝒌𝒂𝒓𝒆𝒏 (𝑯𝑯:𝒎𝒎) 𝒇𝒐𝒓𝒎𝒂𝒕 𝒃𝒐𝒉𝒂𝒃𝒐𝒉 𝒌𝒂𝒓𝒖𝒏.", event.threadID, event.messageID);
        }
        const [hour, minute] = event.body.split(":");

        // If the specified time is in the past for today, schedule it for the next day
        if (hour > time.hours() || (hour == time.hours() && minute > time.minutes())) {
          time.set({ hour, minute, second: 0 });
        } else {
          time.add(1, "days").set({ hour, minute, second: 0 });
        }

        api.unsendMessage(handleReply.messageID);
        return api.sendMessage("📝 | [𝒐𝒖𝒕𝒃𝒐𝒙]\n\n𝑮𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒆𝒓𝒆 𝒉𝒐𝒘𝒂𝒓 𝒆𝒌𝒕𝒊 𝒌𝒂𝒓𝒐𝒏 𝒍𝒊𝒌𝒉𝒖𝒏.", event.threadID, (err, info) => {
          global.client.handleReply.push({
            type: "inputReason",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID,
            target: handleReply.target,
            timeTarget: time.unix()
          });
        });
      }

      case "inputReason": {
        const reason = event.body || "𝑲𝒐𝒏𝒐 𝒌𝒂𝒓𝒐𝒏 𝒖𝒍𝒍𝒆𝒌𝒉 𝒌𝒂𝒓𝒂 𝒉𝒐𝒚𝒏𝒊.";
        api.unsendMessage(handleReply.messageID);

        // Send a confirmation message to the admin
        api.sendMessage(
          `🗓️ === [ 𝑶𝒖𝒕𝑩𝒐𝒙 𝑺𝒆𝒕 ] === 🗓️\n\n` +
          `🆔 𝑮𝒓𝒐𝒖𝒑 𝑨𝒊𝒅𝒊: ${handleReply.target}\n` +
          `⏰ 𝑺𝒐𝒎𝒐𝒚: ${this.convertTime(handleReply.timeTarget)}\n` +
          `📝 𝑲𝒂𝒓𝒐𝒏: ${reason}`,
          event.threadID,
          (err, info) => {
            // Send a notification to the target group
            api.sendMessage(
              `🔔 | [ 𝑶𝒖𝒕𝒃𝒐𝒙 𝑵𝒐𝒕𝒊𝒄𝒆 ] | 🔔\n\n𝑬𝒊 𝒃𝒐𝒕𝒕𝒊 ${this.convertTime(handleReply.timeTarget)} 𝒔𝒐𝒎𝒐𝒚𝒆 𝒆𝒊 𝒈𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒔𝒘𝒂𝒚𝒏𝒌𝒓𝒊𝒚𝒂𝒃𝒉𝒂𝒃𝒆 𝒃𝒆𝒓𝒆 𝒉𝒐𝒚𝒆 𝒋𝒂𝒃𝒆.\n\n📝 𝑲𝒂𝒓𝒐𝒏: ${reason}\n\n𝑬𝒕𝒊 𝒂𝒅𝒎𝒊𝒏𝒆𝒓 𝒏𝒊𝒓𝒅𝒆𝒔𝒉𝒆 𝒌𝒂𝒓𝒂 𝒉𝒐𝒄𝒄𝒉𝒆.`,
              handleReply.target,
              (error) => {
                if (error) {
                  return api.sendMessage(`❌ | [𝒐𝒖𝒕𝒃𝒐𝒙]\n\n𝑬𝒊 𝒂𝒊𝒅𝒊 (${handleReply.target}) 𝒔𝒂𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑𝒕𝒊 𝒌𝒉𝒖𝒋𝒆 𝒑𝒂𝒐𝒘𝒂 𝒋𝒂𝒚𝒏𝒊 𝒂𝒕𝒉𝒂𝒃𝒂 𝒃𝒐𝒕 𝒔𝒆𝒊 𝒈𝒓𝒐𝒖𝒑𝒆 𝒏𝒆𝒊.`, event.threadID);
                } else {
                  // Push the task to the schedule handler
                  global.client.handleSchedule.push({
                    commandName: this.config.name,
                    timestamp: handleReply.timeTarget,
                    target: handleReply.target,
                    reason: reason,
                    event
                  });
                  return api.sendMessage(`✅ | [𝒐𝒖𝒕𝒃𝒐𝒙]\n\n𝑺𝒐𝒎𝒐𝒚 𝒔𝒂𝒑𝒉𝒂𝒍𝒃𝒉𝒂𝒃𝒆 𝒔𝒆𝒕 𝒌𝒂𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆. 𝑩𝒐𝒕 𝒏𝒊𝒓𝒅𝒊𝒔𝒉𝒕𝒆 𝒔𝒐𝒎𝒐𝒚𝒆 𝒈𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒆𝒓𝒆 𝒉𝒐𝒚𝒆 𝒋𝒂𝒃𝒆.`, event.threadID);
                }
              }
            );
          }
        );
        break;
      }
    }
  },

  // This is the main function that runs when the command is called
  onStart: function({ api, event }) {
    // Dependency check
    if (!moment) {
      return api.sendMessage("❌ | [𝒐𝒖𝒕𝒃𝒐𝒙]\n\n𝑴𝒊𝒔𝒔𝒊𝒏𝒈 𝒅𝒆𝒑𝒆𝒏𝒅𝒆𝒏𝒄𝒚: 𝒎𝒐𝒎𝒆𝒏𝒕-𝒕𝒊𝒎𝒆𝒛𝒐𝒏𝒆", event.threadID, event.messageID);
    }

    return api.sendMessage("🆔 | [𝒐𝒖𝒕𝒃𝒐𝒙]\n\n𝑨𝒑𝒏𝒊 𝒌𝒐𝒏 𝒈𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒐𝒕𝒌𝒆 𝒃𝒆𝒓𝒆 𝒌𝒐𝒓𝒕𝒆 𝒄𝒉𝒂𝒏 𝒕𝒂𝒓 𝒂𝒊𝒅𝒊 𝒅𝒊𝒏.", event.threadID, (err, info) => {
      global.client.handleReply.push({
        type: "inputThreadID",
        name: this.config.name,
        author: event.senderID,
        messageID: info.messageID
      });
    });
  }
};
