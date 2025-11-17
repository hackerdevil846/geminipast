const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "user",
    aliases: ["usercontrol", "uc"],
    version: "1.0.5",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 2,
    category: "system",
    shortDescription: {
      en: "🛡️ 𝐵𝑎𝑛 𝑜𝑟 𝑢𝑛𝑏𝑙𝑜𝑐𝑘 𝑢𝑠𝑒𝑟𝑠"
    },
    longDescription: {
      en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑢𝑠𝑒𝑟 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛𝑠, 𝑏𝑎𝑛/𝑢𝑛𝑏𝑎𝑛 𝑢𝑠𝑒𝑟𝑠, 𝑎𝑛𝑑 𝑐𝑜𝑛𝑡𝑟𝑜𝑙 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑎𝑐𝑐𝑒𝑠𝑠"
    },
    guide: {
      en: "{p}user [𝑢𝑛𝑏𝑎𝑛/𝑏𝑎𝑛/𝑠𝑒𝑎𝑟𝑐ℎ/𝑏𝑎𝑛𝐶𝑜𝑚𝑚𝑎𝑛𝑑/𝑢𝑛𝑏𝑎𝑛𝐶𝑜𝑚𝑚𝑎𝑛𝑑/𝑙𝑖𝑠𝑡/𝑖𝑛𝑓𝑜] [𝐼𝐷 𝑜𝑟 𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    countDown: 5
  },

  langs: {
    "en": {
      "reason": "𝑅𝑒𝑎𝑠𝑜𝑛",
      "at": "𝑎𝑡",
      "allCommand": "𝑎𝑙𝑙 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠",
      "commandList": "𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠",
      "banSuccess": "[ 𝐵𝑎𝑛 𝑈𝑠𝑒𝑟 ] 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑏𝑎𝑛𝑛𝑒𝑑 𝑢𝑠𝑒𝑟: %1",
      "unbanSuccess": "[ 𝑈𝑛𝑏𝑎𝑛 𝑈𝑠𝑒𝑟 ] 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑢𝑛𝑏𝑎𝑛𝑛𝑒𝑑 𝑢𝑠𝑒𝑟 %1",
      "banCommandSuccess": "[ 𝑏𝑎𝑛𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑈𝑠𝑒𝑟 ] 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑏𝑎𝑛𝑛𝑒𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟: %1",
      "unbanCommandSuccess": "[ 𝑈𝑛𝑏𝑎𝑛𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑈𝑠𝑒𝑟 ] 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑢𝑛𝑏𝑎𝑛𝑛𝑒𝑑 %1 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟: %2",
      "errorReponse": "%1 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑐𝑜𝑚𝑝𝑙𝑒𝑡𝑒 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡",
      "IDNotFound": "%1 𝑇ℎ𝑒 𝑢𝑠𝑒𝑟 𝐼𝐷 𝑦𝑜𝑢 𝑒𝑛𝑡𝑒𝑟𝑒𝑑 𝑑𝑜𝑒𝑠 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡 𝑖𝑛 𝑡ℎ𝑒 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒",
      "existBan": "[ 𝐵𝑎𝑛 𝑈𝑠𝑒𝑟 ] 𝑈𝑠𝑒𝑟 %1 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑏𝑎𝑛𝑛𝑒𝑑 𝑏𝑒𝑓𝑜𝑟𝑒 %2 %3",
      "notExistBan": "[ 𝑈𝑛𝑏𝑎𝑛 𝑈𝑠𝑒𝑟 ] 𝑇ℎ𝑒 𝑢𝑠𝑒𝑟 𝑦𝑜𝑢 𝑒𝑛𝑡𝑒𝑟𝑒𝑑 ℎ𝑎𝑠 𝑛𝑒𝑣𝑒𝑟 𝑏𝑒𝑒𝑛 𝑏𝑎𝑛𝑛𝑒𝑑 𝑓𝑟𝑜𝑚 𝑢𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑏𝑜𝑡",
      "missingCommandInput": "%1 𝑇ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑓𝑖𝑒𝑙𝑑 𝑡𝑜 𝑏𝑎𝑛 𝑐𝑎𝑛𝑛𝑜𝑡 𝑏𝑒 𝑒𝑚𝑝𝑡𝑦!",
      "notExistBanCommand": "[ 𝑈𝑛𝑏𝑎𝑛𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑈𝑠𝑒𝑟 ] 𝑇ℎ𝑒 𝑢𝑠𝑒𝑟 𝐼𝐷 𝑦𝑜𝑢 𝑒𝑛𝑡𝑒𝑟𝑒𝑑 ℎ𝑎𝑠 𝑛𝑒𝑣𝑒𝑟 𝑏𝑒𝑒𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑-𝑏𝑎𝑛𝑛𝑒𝑑",

      "returnBan": "[ 𝐵𝑎𝑛 𝑈𝑠𝑒𝑟 ] 𝑌𝑜𝑢 𝑎𝑟𝑒 𝑟𝑒𝑞𝑢𝑒𝑠𝑡𝑖𝑛𝑔 𝑡𝑜 𝑏𝑎𝑛 𝑎 𝑢𝑠𝑒𝑟:\n- 𝐼𝐷 𝑎𝑛𝑑 𝑛𝑎𝑚𝑒 𝑜𝑓 𝑡ℎ𝑒 𝑢𝑠𝑒𝑟 𝑡𝑜 𝑏𝑎𝑛: %1%2\n\n❮ 𝑅𝑒𝑎𝑐𝑡 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑐𝑜𝑛𝑓𝑖𝑟𝑚 ❯",
      "returnUnban": "[ 𝑈𝑛𝑏𝑎𝑛 𝑈𝑠𝑒𝑟 ] 𝑌𝑜𝑢 𝑎𝑟𝑒 𝑟𝑒𝑞𝑢𝑒𝑠𝑡𝑖𝑛𝑔 𝑡𝑜 𝑢𝑛𝑏𝑎𝑛 𝑎 𝑢𝑠𝑒𝑟:\n- 𝐼𝐷 𝑎𝑛𝑑 𝑛𝑎𝑚𝑒 𝑜𝑓 𝑡ℎ𝑒 𝑢𝑠𝑒𝑟 𝑡𝑜 𝑢𝑛𝑏𝑎𝑛: %1\n\n❮ 𝑅𝑒𝑎𝑐𝑡 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑐𝑜𝑛𝑓𝑖𝑟𝑚 ❯",
      "returnBanCommand": "[ 𝑏𝑎𝑛𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑈𝑠𝑒𝑟 ] 𝑌𝑜𝑢 𝑎𝑟𝑒 𝑟𝑒𝑞𝑢𝑒𝑠𝑡𝑖𝑛𝑔 𝑡𝑜 𝑏𝑎𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑓𝑜𝑟 𝑎 𝑢𝑠𝑒𝑟:\n - 𝐼𝐷 𝑎𝑛𝑑 𝑛𝑎𝑚𝑒 𝑜𝑓 𝑡ℎ𝑒 𝑢𝑠𝑒𝑟: %1\n- 𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑡𝑜 𝑏𝑎𝑛: %2\n\n❮ 𝑅𝑒𝑎𝑐𝑡 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑐𝑜𝑛𝑓𝑖𝑟𝑚 ❯",
      "returnUnbanCommand": "[ 𝑈𝑛𝑏𝑎𝑛𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑈𝑠𝑒𝑟 ] 𝑌𝑜𝑢 𝑎𝑟𝑒 𝑟𝑒𝑞𝑢𝑒𝑠𝑡𝑖𝑛𝑔 𝑡𝑜 𝑢𝑛𝑏𝑎𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑓𝑜𝑟 𝑎 𝑢𝑠𝑒𝑟:\n - 𝐼𝐷 𝑎𝑛𝑑 𝑛𝑎𝑚𝑒 𝑜𝑓 𝑡ℎ𝑒 𝑢𝑠𝑒𝑟: %1\n- 𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑡𝑜 𝑢𝑛𝑏𝑎𝑛: %2\n\n❮ 𝑅𝑒𝑎𝑐𝑡 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑐𝑜𝑛𝑓𝑖𝑟𝑚 ❯",
    
      "returnResult": "𝐻𝑒𝑟𝑒 𝑎𝑟𝑒 𝑡ℎ𝑒 𝑚𝑎𝑡𝑐ℎ𝑖𝑛𝑔 𝑟𝑒𝑠𝑢𝑙𝑡𝑠: \n",
      "returnNull": "𝑁𝑜 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑓𝑜𝑢𝑛𝑑 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑦𝑜𝑢𝑟 𝑠𝑒𝑎𝑟𝑐ℎ!",
      "returnList": "[ 𝑈𝑠𝑒𝑟 𝐿𝑖𝑠𝑡 ]\n𝑇ℎ𝑒𝑟𝑒 𝑎𝑟𝑒 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 %1 𝑏𝑎𝑛𝑛𝑒𝑑 𝑢𝑠𝑒𝑟𝑠, ℎ𝑒𝑟𝑒 𝑎𝑟𝑒 %2 𝑜𝑓 𝑡ℎ𝑒𝑚:\n\n%3",
      "returnInfo": "[ 𝐼𝑛𝑓𝑜 𝑈𝑠𝑒𝑟 ] 𝐻𝑒𝑟𝑒 𝑖𝑠 𝑠𝑜𝑚𝑒 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑏𝑜𝑢𝑡 𝑡ℎ𝑒 𝑢𝑠𝑒𝑟 𝑦𝑜𝑢 𝑎𝑟𝑒 𝑙𝑜𝑜𝑘𝑖𝑛𝑔 𝑓𝑜𝑟:\n- 𝑈𝑠𝑒𝑟 𝐼𝐷 𝑎𝑛𝑑 𝑛𝑎𝑚𝑒: %1\n- 𝐼𝑠 𝑏𝑎𝑛𝑛𝑒𝑑?: %2 %3 %4\n- 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑏𝑎𝑛𝑛𝑒𝑑?: %5"
    }
  },

  onStart: async function ({ api, event, args, usersData, message, getText, client }) {
    try {
      const { threadID, messageID } = event;
      const type = args[0];
      var targetID = String(args[1]);
      var reason = (args.slice(2, args.length)).join(" ") || null;

      if (!targetID) {
        const mention = Object.keys(event.mentions);
        if (mention.length > 0) {
          targetID = String(mention[0]);
          reason = args.slice(1).join(" ").replace(event.mentions[mention[0]], "").trim() || null;
        }
      } else if (isNaN(targetID)) {
        const mention = Object.keys(event.mentions);
        if (mention.length > 0) {
          const mentionedUserID = mention[0];
          const fullArg = args.join(" ");
          targetID = String(mentionedUserID);
          reason = fullArg.slice(fullArg.indexOf(event.mentions[mentionedUserID]) + event.mentions[mentionedUserID].length).trim();
        }
      }

      switch (type) {
        case "ban":
        case "-b": {
          if (!targetID) return message.reply(getText("IDNotFound", "[ 𝐵𝑎𝑛 𝑈𝑠𝑒𝑟 ]"));
          if (!global.data.allUserID.includes(targetID)) return message.reply(getText("IDNotFound", "[ 𝐵𝑎𝑛 𝑈𝑠𝑒𝑟 ]"));
          if (global.data.userBanned.has(targetID)) {
            const { reason: r, dateAdded: d } = global.data.userBanned.get(targetID) || {};
            return message.reply(getText("existBan", targetID, ((r) ? `${getText("reason")}: "${r}"` : ""), ((d) ? `${getText("at")} ${d}` : "")));
          }
          const nameTarget = global.data.userName.get(targetID) || await usersData.getName(targetID);
          return message.reply(getText("returnBan", `${targetID} - ${nameTarget}`, ((reason) ? `\n- ${getText("reason")}: ${reason}` : "")), (error, info) => {
            client.handleReaction.push({
              type: "ban",
              targetID,
              reason,
              nameTarget,
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
            });
          });
        }

        case "unban":
        case "-ub": {
          if (!targetID) return message.reply(getText("IDNotFound", "[ 𝑈𝑛𝑏𝑎𝑛 𝑈𝑠𝑒𝑟 ]"));
          if (!global.data.allUserID.includes(targetID)) return message.reply(getText("IDNotFound", "[ 𝑈𝑛𝑏𝑎𝑛 𝑈𝑠𝑒𝑟 ]"));
          if (!global.data.userBanned.has(targetID)) return message.reply(getText("notExistBan"));
          const nameTarget = global.data.userName.get(targetID) || await usersData.getName(targetID);
          return message.reply(getText("returnUnban", `${targetID} - ${nameTarget}`), (error, info) => {
            client.handleReaction.push({
              type: "unban",
              targetID,
              nameTarget,
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
            });
          });
        }

        case "search":
        case "-s": {
          const contentJoin = args.slice(1).join(" ");
          if (!contentJoin) return message.reply("𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑛𝑎𝑚𝑒 𝑡𝑜 𝑠𝑒𝑎𝑟𝑐ℎ.");
          const allUsers = await usersData.getAll();
          var matchUsers = [], a = '', b = 0;
          
          for (const user of allUsers) {
            if (user.name && user.name.toLowerCase().includes(contentJoin.toLowerCase())) {
              matchUsers.push({
                name: user.name,
                id: user.id
              });
            }
          }
          
          if (matchUsers.length > 0) {
            matchUsers.forEach(i => a += `\n${b += 1}. ${i.name} - ${i.id}`);
            message.reply(getText("returnResult", a));
          } else {
            message.reply(getText("returnNull"));
          }
          return;
        }
        
        case "banCommand":
        case "-bc": {
          if (!targetID) return message.reply(getText("IDNotFound", "[ 𝑏𝑎𝑛𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑈𝑠𝑒𝑟 ]"));
          if (!global.data.allUserID.includes(targetID)) return message.reply(getText("IDNotFound", "[ 𝑏𝑎𝑛𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑈𝑠𝑒𝑟 ]"));
          if (reason == null || reason.length == 0) return message.reply(getText("missingCommandInput", "[ 𝑏𝑎𝑛𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑈𝑠𝑒𝑟 ]"));
          
          let commandNeedBan = reason.split(" ").map(cmd => cmd.trim());
          if (commandNeedBan[0] == "all") {
            const commandValues = client.commands.keys();
            commandNeedBan = Array.from(commandValues);
          }

          const nameTarget = global.data.userName.get(targetID) || await usersData.getName(targetID);
          return message.reply(getText("returnBanCommand", `${targetID} - ${nameTarget}`, ((commandNeedBan.length === client.commands.size) ? getText("allCommand") : commandNeedBan.join(", "))), (error, info) => {
            client.handleReaction.push({
              type: "banCommand",
              targetID,
              commandNeedBan,
              nameTarget,
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
            });
          });
        }

        case "unbanCommand":
        case "-ubc": {
          if (!targetID) return message.reply(getText("IDNotFound", "[ 𝑈𝑛𝑏𝑎𝑛𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑈𝑠𝑒𝑟 ]"));
          if (!global.data.allUserID.includes(targetID)) return message.reply(getText("IDNotFound", "[ 𝑈𝑛𝑏𝑎𝑛𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑈𝑠𝑒𝑟 ]"));
          if (!global.data.commandBanned.has(targetID)) return message.reply(getText("notExistBanCommand"));
          if (reason == null || reason.length == 0) return message.reply(getText("missingCommandInput", "[ 𝑈𝑛𝑏𝑎𝑛𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑈𝑠𝑒𝑟 ]"));
          
          let commandNeedBan = reason.split(" ").map(cmd => cmd.trim());
          const userBannedCommands = global.data.commandBanned.get(targetID) || [];
          if (commandNeedBan[0] == "all") {
            commandNeedBan = [...userBannedCommands];
          }
          
          const nameTarget = global.data.userName.get(targetID) || await usersData.getName(targetID);
          return message.reply(getText("returnUnbanCommand", `${targetID} - ${nameTarget}`, ((commandNeedBan.length == userBannedCommands.length) ? getText("allCommand") : commandNeedBan.join(", "))), (error, info) => {
            client.handleReaction.push({
              type: "unbanCommand",
              targetID,
              commandNeedBan,
              nameTarget,
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
            });
          });
        }

        case "list":
        case "-l": {
          var listBan = [], i = 0;
          const bannedUsers = Array.from(global.data.userBanned.keys());
          const limit = parseInt(args[1]) || 10;

          for (const idUser of bannedUsers) {
            const userName = (await usersData.getName(idUser)) || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
            listBan.push(`${i+=1}. ${idUser} - ${userName}`);
            if (i >= limit) break;
          }
          return message.reply(getText("returnList", (global.data.userBanned.size || 0), listBan.length, listBan.join("\n")));
        }

        case "info":
        case "-i": {
          if (!targetID) return message.reply(getText("IDNotFound", "[ 𝐼𝑛𝑓𝑜 𝑈𝑠𝑒𝑟 ]"));
          if (!global.data.allUserID.includes(targetID)) return message.reply(getText("IDNotFound", "[ 𝐼𝑛𝑓𝑜 𝑈𝑠𝑒𝑟 ]"));
          
          const commandBannedData = global.data.commandBanned.get(targetID);
          const userBannedData = global.data.userBanned.get(targetID);

          const isBanned = userBannedData ? "𝑌𝑒𝑠" : "𝑁𝑜";
          const reasonText = userBannedData?.reason ? `${getText("reason")}: "${userBannedData.reason}"` : "";
          const dateAddedText = userBannedData?.dateAdded ? `${getText("at")}: ${userBannedData.dateAdded}` : "";
          
          let commandBannedText = "𝑁𝑜";
          if (commandBannedData && commandBannedData.length > 0) {
            const allCommandsBanned = commandBannedData.length === client.commands.size;
            commandBannedText = `𝑌𝑒𝑠: ${allCommandsBanned ? getText("allCommand") : commandBannedData.join(", ")}`;
          }

          const nameTarget = global.data.userName.get(targetID) || await usersData.getName(targetID);
          return message.reply(getText("returnInfo", `${targetID} - ${nameTarget}`, isBanned, reasonText, dateAddedText, commandBannedText));
        }
        
        default: {
          return message.reply(this.config.guide.en);
        }
      }
    } catch (error) {
      console.error("𝑈𝑠𝑒𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡.");
    }
  },

  onReaction: async function ({ event, api, usersData, getText, Reaction }) {
    try {
      if (parseInt(event.userID) !== parseInt(Reaction.author)) return;
      
      const { threadID } = event;
      const { messageID, type, targetID, reason, commandNeedBan, nameTarget } = Reaction;
      
      const time = moment.tz("𝐴𝑠𝑖𝑎/𝐾𝑜𝑙𝑘𝑎𝑡𝑎").format("𝐻𝐻:𝑚𝑚:𝑠𝑠 𝐿");
      
      switch (type) {
        case "ban": {
          try {
            let userData = await usersData.get(targetID);
            userData.banned = true;
            userData.reason = reason || null;
            userData.dateAdded = time;
            await usersData.set(targetID, userData);
            global.data.userBanned.set(targetID, { reason: userData.reason, dateAdded: userData.dateAdded });
            api.unsendMessage(messageID);
            return api.sendMessage(getText("banSuccess", `${targetID} - ${nameTarget}`), threadID);
          } catch { return api.sendMessage(getText("errorReponse", "[ 𝐵𝑎𝑛 𝑈𝑠𝑒𝑟 ]"), threadID) };
        }

        case "unban": {
          try {
            let userData = await usersData.get(targetID);
            userData.banned = false;
            userData.reason = null;
            userData.dateAdded = null;
            await usersData.set(targetID, userData);
            global.data.userBanned.delete(targetID);
            api.unsendMessage(messageID);
            return api.sendMessage(getText("unbanSuccess", `${targetID} - ${nameTarget}`), threadID);
          } catch { return api.sendMessage(getText("errorReponse", "[ 𝑈𝑛𝑏𝑎𝑛 𝑈𝑠𝑒𝑟 ]"), threadID) };
        }

        case "banCommand": {
          try {	
            let userData = await usersData.get(targetID);
            userData.commandBanned = [...(userData.commandBanned || []), ...commandNeedBan];
            await usersData.set(targetID, userData);
            global.data.commandBanned.set(targetID, userData.commandBanned);
            api.unsendMessage(messageID);
            return api.sendMessage(getText("banCommandSuccess", `${targetID} - ${nameTarget}`), threadID);
          } catch (e) { return api.sendMessage(getText("errorReponse", "[ 𝑏𝑎𝑛𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑈𝑠𝑒𝑟 ]"), threadID) };
        }

        case "unbanCommand": {
          try {
            let userData = await usersData.get(targetID);
            userData.commandBanned = (userData.commandBanned || []).filter(item => !commandNeedBan.includes(item));
            await usersData.set(targetID, userData);
            global.data.commandBanned.set(targetID, userData.commandBanned);
            if(userData.commandBanned.length == 0) global.data.commandBanned.delete(targetID);
            api.unsendMessage(messageID);
            return api.sendMessage(getText("unbanCommandSuccess", ((userData.commandBanned.length == 0) ? getText("allCommand") : `${getText("commandList")}: ${commandNeedBan.join(", ")}`), `${targetID} - ${nameTarget}`), threadID);
          } catch (e) { return api.sendMessage(getText("errorReponse", "[ 𝑈𝑛𝑏𝑎𝑛𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑈𝑠𝑒𝑟 ]"), threadID) };
        }
      }
    } catch (error) {
      console.error("𝑅𝑒𝑎𝑐𝑡𝑖𝑜𝑛 ℎ𝑎𝑛𝑑𝑙𝑒𝑟 𝑒𝑟𝑟𝑜𝑟:", error);
    }
  }
};
