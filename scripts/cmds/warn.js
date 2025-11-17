const { getTime } = global.utils;

module.exports = {
  config: {
    name: "warn",
    aliases: ["warnsystem"],
    version: "1.8",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 1,
    category: "group",
    shortDescription: {
      en: "⚠️ 𝑊𝑎𝑟𝑛 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑖𝑛 𝑔𝑟𝑜𝑢𝑝 𝑤𝑖𝑡ℎ 3-𝑠𝑡𝑟𝑖𝑘𝑒 𝑠𝑦𝑠𝑡𝑒𝑚"
    },
    longDescription: {
      en: "𝑊𝑎𝑟𝑛 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑖𝑛 𝑔𝑟𝑜𝑢𝑝, 𝑖𝑓 𝑡ℎ𝑒𝑦 ℎ𝑎𝑣𝑒 3 𝑤𝑎𝑟𝑛𝑠, 𝑡ℎ𝑒𝑦 𝑤𝑖𝑙𝑙 𝑏𝑒 𝑏𝑎𝑛𝑛𝑒𝑑"
    },
    guide: {
      en: "   {p}warn @𝑡𝑎𝑔 <𝑟𝑒𝑎𝑠𝑜𝑛>: 𝑤𝑎𝑟𝑛 𝑎 𝑚𝑒𝑚𝑏𝑒𝑟"
        + "\n   {p}warn 𝑙𝑖𝑠𝑡: 𝑣𝑖𝑒𝑤 𝑙𝑖𝑠𝑡 𝑜𝑓 𝑤𝑎𝑟𝑛𝑒𝑑 𝑚𝑒𝑚𝑏𝑒𝑟𝑠"
        + "\n   {p}warn 𝑙𝑖𝑠𝑡𝑏𝑎𝑛: 𝑣𝑖𝑒𝑤 𝑙𝑖𝑠𝑡 𝑜𝑓 𝑏𝑎𝑛𝑛𝑒𝑑 𝑚𝑒𝑚𝑏𝑒𝑟𝑠"
        + "\n   {p}warn 𝑖𝑛𝑓𝑜 [@𝑡𝑎𝑔 | <𝑢𝑖𝑑> | 𝑟𝑒𝑝𝑙𝑦 | 𝑙𝑒𝑎𝑣𝑒 𝑏𝑙𝑎𝑛𝑘]: 𝑣𝑖𝑒𝑤 𝑤𝑎𝑟𝑛𝑖𝑛𝑔 𝑖𝑛𝑓𝑜"
        + "\n   {p}warn 𝑢𝑛𝑏𝑎𝑛 [@𝑡𝑎𝑔 | <𝑢𝑖𝑑> | 𝑟𝑒𝑝𝑙𝑦 | 𝑙𝑒𝑎𝑣𝑒 𝑏𝑙𝑎𝑛𝑘]: 𝑢𝑛𝑏𝑎𝑛 𝑚𝑒𝑚𝑏𝑒𝑟"
        + "\n   {p}warn 𝑢𝑛𝑤𝑎𝑟𝑛 [@𝑡𝑎𝑔 | <𝑢𝑖𝑑> | 𝑟𝑒𝑝𝑙𝑦] [<𝑛𝑢𝑚𝑏𝑒𝑟>]: 𝑟𝑒𝑚𝑜𝑣𝑒 𝑤𝑎𝑟𝑛𝑖𝑛𝑔"
        + "\n   {p}warn 𝑟𝑒𝑠𝑒𝑡: 𝑟𝑒𝑠𝑒𝑡 𝑎𝑙𝑙 𝑤𝑎𝑟𝑛 𝑑𝑎𝑡𝑎"
        + "\n⚠️ 𝐵𝑜𝑡 𝑛𝑒𝑒𝑑𝑠 𝑎𝑑𝑚𝑖𝑛 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑡𝑜 𝑎𝑢𝑡𝑜 𝑘𝑖𝑐𝑘 𝑏𝑎𝑛𝑛𝑒𝑑 𝑚𝑒𝑚𝑏𝑒𝑟𝑠"
    }
  },

  langs: {
    en: {
      list: "📋 𝐿𝑖𝑠𝑡 𝑜𝑓 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑤ℎ𝑜 ℎ𝑎𝑣𝑒 𝑏𝑒𝑒𝑛 𝑤𝑎𝑟𝑛𝑒𝑑:\n%1\n\n𝑈𝑠𝑒 \"%2𝑤𝑎𝑟𝑛 𝑖𝑛𝑓𝑜\" 𝑡𝑜 𝑣𝑖𝑒𝑤 𝑑𝑒𝑡𝑎𝑖𝑙𝑠",
      listBan: "🚫 𝐿𝑖𝑠𝑡 𝑜𝑓 𝑏𝑎𝑛𝑛𝑒𝑑 𝑚𝑒𝑚𝑏𝑒𝑟𝑠:\n%1",
      listEmpty: "✅ 𝑌𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝 ℎ𝑎𝑠 𝑛𝑜 𝑤𝑎𝑟𝑛𝑒𝑑 𝑚𝑒𝑚𝑏𝑒𝑟𝑠",
      listBanEmpty: "✅ 𝑌𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝 ℎ𝑎𝑠 𝑛𝑜 𝑏𝑎𝑛𝑛𝑒𝑑 𝑚𝑒𝑚𝑏𝑒𝑟𝑠",
      invalidUid: "❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑢𝑖𝑑",
      noData: "📭 𝑁𝑜 𝑑𝑎𝑡𝑎 𝑓𝑜𝑢𝑛𝑑",
      noPermission: "❌ 𝑂𝑛𝑙𝑦 𝑎𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑢𝑛𝑏𝑎𝑛 𝑚𝑒𝑚𝑏𝑒𝑟𝑠",
      invalidUid2: "⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑢𝑖𝑑",
      notBanned: "⚠️ 𝑈𝑠𝑒𝑟 %1 𝑖𝑠 𝑛𝑜𝑡 𝑏𝑎𝑛𝑛𝑒𝑑",
      unbanSuccess: "✅ 𝑈𝑛𝑏𝑎𝑛𝑛𝑒𝑑 %1 (%2)",
      noPermission2: "❌ 𝑂𝑛𝑙𝑦 𝑎𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑟𝑒𝑚𝑜𝑣𝑒 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠",
      invalidUid3: "⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑢𝑖𝑑 𝑜𝑟 𝑡𝑎𝑔",
      noData2: "⚠️ 𝑁𝑜 𝑤𝑎𝑟𝑛𝑖𝑛𝑔 𝑑𝑎𝑡𝑎 𝑓𝑜𝑟 %1",
      notEnoughWarn: "❌ 𝑈𝑠𝑒𝑟 %1 ℎ𝑎𝑠 𝑜𝑛𝑙𝑦 %2 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠",
      unwarnSuccess: "✅ 𝑅𝑒𝑚𝑜𝑣𝑒𝑑 𝑤𝑎𝑟𝑛𝑖𝑛𝑔 %1 𝑓𝑟𝑜𝑚 %2 (%3)",
      noPermission3: "❌ 𝑂𝑛𝑙𝑦 𝑎𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑟𝑒𝑠𝑒𝑡 𝑑𝑎𝑡𝑎",
      resetWarnSuccess: "✅ 𝑅𝑒𝑠𝑒𝑡 𝑎𝑙𝑙 𝑤𝑎𝑟𝑛 𝑑𝑎𝑡𝑎 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦",
      noPermission4: "❌ 𝑂𝑛𝑙𝑦 𝑎𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑤𝑎𝑟𝑛 𝑚𝑒𝑚𝑏𝑒𝑟𝑠",
      invalidUid4: "⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑢𝑠𝑒𝑟",
      warnSuccess: "⚠️ 𝑊𝑎𝑟𝑛𝑒𝑑 %1 (%2 𝑡𝑖𝑚𝑒𝑠)\n📌 𝑅𝑒𝑎𝑠𝑜𝑛: %3\n⏰ 𝑇𝑖𝑚𝑒: %4\n🚫 𝐵𝑎𝑛𝑛𝑒𝑑 - 𝑈𝑠𝑒 \"%5𝑤𝑎𝑟𝑛 𝑢𝑛𝑏𝑎𝑛 %6\" 𝑡𝑜 𝑢𝑛𝑏𝑎𝑛",
      noPermission5: "⚠️ 𝐵𝑜𝑡 𝑛𝑒𝑒𝑑𝑠 𝑎𝑑𝑚𝑖𝑛 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑡𝑜 𝑘𝑖𝑐𝑘",
      warnSuccess2: "⚠️ 𝑊𝑎𝑟𝑛𝑒𝑑 %1 (%2 𝑡𝑖𝑚𝑒𝑠)\n📌 𝑅𝑒𝑎𝑠𝑜𝑛: %3\n⏰ 𝑇𝑖𝑚𝑒: %4\n❌ %5 𝑚𝑜𝑟𝑒 𝑤𝑎𝑟𝑛𝑠 𝑓𝑜𝑟 𝑏𝑎𝑛",
      hasBanned: "⚠️ 𝐵𝑎𝑛𝑛𝑒𝑑 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑗𝑜𝑖𝑛𝑒𝑑:\n%1",
      failedKick: "⚠️ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑘𝑖𝑐𝑘:\n%1",
      userNotInGroup: "⚠️ 𝑈𝑠𝑒𝑟 \"%1\" 𝑛𝑜𝑡 𝑖𝑛 𝑔𝑟𝑜𝑢𝑝"
    }
  },

  onStart: async function ({ message, api, event, args, threadsData, usersData, prefix, role, getText }) {
    if (!args[0])
      return message.SyntaxError();
    
    const { threadID, senderID } = event;
    const warnList = await threadsData.get(threadID, "data.warn", []);

    switch (args[0].toLowerCase()) {
      case "list": {
        const msg = await Promise.all(warnList.map(async user => {
          const { uid, list } = user;
          const name = await usersData.getName(uid);
          return `${name} (${uid}): ${list.length}`;
        }));
        message.reply(msg.length ? getText("list", msg.join("\n"), prefix) : getText("listEmpty"));
        break;
      }
      case "listban": {
        const result = (await Promise.all(warnList.map(async user => {
          const { uid, list } = user;
          if (list.length >= 3) {
            const name = await usersData.getName(uid);
            return `${name} (${uid})`;
          }
        }))).filter(item => item);
        message.reply(result.length ? getText("listBan", result.join("\n")) : getText("listBanEmpty"));
        break;
      }
      case "check":
      case "info": {
        let uids, msg = "";
        if (Object.keys(event.mentions).length)
          uids = Object.keys(event.mentions);
        else if (event.messageReply?.senderID)
          uids = [event.messageReply.senderID];
        else if (args.slice(1).length)
          uids = args.slice(1);
        else
          uids = [senderID];

        if (!uids || !uids.length)
          return message.reply(getText("invalidUid"));
        
        msg += (await Promise.all(uids.map(async uid => {
          if (isNaN(uid))
            return null;
          const dataWarnOfUser = warnList.find(user => user.uid == uid);
          let msg = `🔍 𝑈𝐼𝐷: ${uid}`;
          const userName = await usersData.getName(uid);

          if (!dataWarnOfUser || dataWarnOfUser.list.length == 0)
            msg += `\n👤 𝑁𝑎𝑚𝑒: ${userName}\n📭 ${getText("noData")}`;
          else {
            msg += `\n👤 𝑁𝑎𝑚𝑒: ${userName}`
              + `\n⚠️ 𝑊𝑎𝑟𝑛𝑠: ${dataWarnOfUser.list.length}` + dataWarnOfUser.list.reduce((acc, warn, index) => {
              const { dateTime, reason } = warn;
              return acc + `\n${index + 1}. 📌 ${reason}\n   ⏰ ${dateTime}`;
            }, "");
          }
          return msg;
        }))).filter(msg => msg).join("\n\n");
        message.reply(msg);
        break;
      }
      case "unban": {
        if (role < 1)
          return message.reply(getText("noPermission"));
        let uidUnban;
        if (Object.keys(event.mentions).length)
          uidUnban = Object.keys(event.mentions)[0];
        else if (event.messageReply?.senderID)
          uidUnban = event.messageReply.senderID;
        else if (args[1])
          uidUnban = args[1];
        else
          uidUnban = senderID;

        if (!uidUnban || isNaN(uidUnban))
          return message.reply(getText("invalidUid2"));

        const index = warnList.findIndex(user => user.uid == uidUnban && user.list.length >= 3);
        if (index === -1)
          return message.reply(getText("notBanned", uidUnban));

        warnList.splice(index, 1);
        await threadsData.set(threadID, warnList, "data.warn");
        const userName = await usersData.getName(uidUnban);
        message.reply(getText("unbanSuccess", uidUnban, userName));
        break;
      }
      case "unwarn": {
        if (role < 1)
          return message.reply(getText("noPermission2"));
        let uid, num;
        if (Object.keys(event.mentions)[0]) {
          uid = Object.keys(event.mentions)[0];
          num = parseInt(args[args.length - 1]) - 1;
        }
        else if (event.messageReply?.senderID) {
          uid = event.messageReply.senderID;
          num = parseInt(args[1]) - 1;
        }
        else {
          uid = args[1];
          num = parseInt(args[2]) - 1;
        }

        if (isNaN(uid))
          return message.reply(getText("invalidUid3"));

        const dataWarnOfUser = warnList.find(u => u.uid == uid);
        if (!dataWarnOfUser?.list.length)
          return message.reply(getText("noData2", uid));

        if (isNaN(num))
          num = dataWarnOfUser.list.length - 1;

        const userName = await usersData.getName(uid);
        if (num > dataWarnOfUser.list.length)
          return message.reply(getText("notEnoughWarn", userName, dataWarnOfUser.list.length));

        dataWarnOfUser.list.splice(parseInt(num), 1);
        if (!dataWarnOfUser.list.length)
          warnList.splice(warnList.findIndex(u => u.uid == uid), 1);
        await threadsData.set(threadID, warnList, "data.warn");
        message.reply(getText("unwarnSuccess", num + 1, uid, userName));
        break;
      }
      case "reset": {
        if (role < 1)
          return message.reply(getText("noPermission3"));
        await threadsData.set(threadID, [], "data.warn");
        message.reply(getText("resetWarnSuccess"));
        break;
      }
      default: {
        if (role < 1)
          return message.reply(getText("noPermission4"));
        let reason, uid;
        if (event.messageReply) {
          uid = event.messageReply.senderID;
          reason = args.join(" ").trim();
        }
        else if (Object.keys(event.mentions)[0]) {
          uid = Object.keys(event.mentions)[0];
          reason = args.join(" ").replace(event.mentions[uid], "").trim();
        }
        else {
          return message.reply(getText("invalidUid4"));
        }
        if (!reason)
          reason = "𝑁𝑜 𝑟𝑒𝑎𝑠𝑜𝑛 𝑔𝑖𝑣𝑒𝑛";
        const dataWarnOfUser = warnList.find(item => item.uid == uid);
        const dateTime = getTime("DD/MM/YYYY hh:mm:ss");
        if (!dataWarnOfUser)
          warnList.push({
            uid,
            list: [{ reason, dateTime, warnBy: senderID }]
          });
        else
          dataWarnOfUser.list.push({ reason, dateTime, warnBy: senderID });

        await threadsData.set(threadID, warnList, "data.warn");

        const times = (warnList.find(item => item.uid == uid)?.list.length) ?? 1;

        const userName = await usersData.getName(uid);
        if (times >= 3) {
          message.reply(getText("warnSuccess", userName, times, uid, reason, dateTime, prefix, uid), () => {
            api.removeUserFromGroup(uid, threadID, async (err) => {
              if (err) {
                const members = await threadsData.get(event.threadID, "members");
                if (members.find(item => item.userID == uid)?.inGroup)
                  return message.reply(getText("userNotInGroup", userName));
                else
                  return message.reply(getText("noPermission5"));
              }
            });
          });
        }
        else
          message.reply(getText("warnSuccess2", userName, times, uid, reason, dateTime, 3 - times));
        break;
      }
    }
  }
};
