module.exports = {
  config: {
    name: "unban",
    aliases: ["ub", "unblock"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 2,
    category: "system",
    shortDescription: {
      en: "🔓 𝑈𝑛𝑏𝑎𝑛 𝑢𝑠𝑒𝑟𝑠 𝑜𝑟 𝑔𝑟𝑜𝑢𝑝𝑠 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑠𝑒𝑟𝑣𝑒𝑟"
    },
    longDescription: {
      en: "𝑅𝑒𝑚𝑜𝑣𝑒 𝑏𝑎𝑛 𝑟𝑒𝑠𝑡𝑟𝑖𝑐𝑡𝑖𝑜𝑛𝑠 𝑓𝑟𝑜𝑚 𝑢𝑠𝑒𝑟𝑠, 𝑔𝑟𝑜𝑢𝑝𝑠, 𝑜𝑟 𝑎𝑑𝑚𝑖𝑛𝑠"
    },
    guide: {
      en: "{p}unban [𝑜𝑝𝑡𝑖𝑜𝑛: 𝑎𝑑𝑚𝑖𝑛/𝑛𝑑ℎ/𝑎𝑙𝑙𝑏𝑜𝑥/𝑏𝑜𝑥/𝑎𝑙𝑙𝑢𝑠𝑒𝑟/𝑎𝑙𝑙𝑞𝑡𝑣/𝑞𝑡𝑣/𝑚𝑒𝑚𝑏𝑒𝑟]"
    },
    countDown: 2,
    dependencies: {}
  },

  onStart: async function ({ api, event, args, message, usersData, threadsData }) {
    try {
      const { threadID, messageID } = event;

      // Credit check (preserved exactly as requested)
      const { commands } = global.client;
      const command = commands.get("unban");
      const credit = command && command.config ? command.config.credits : "";
      const requiredCredit = "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑";
      
      if (credit !== requiredCredit) {
        return message.reply("❌ 𝑊𝑟𝑜𝑛𝑔 𝑐𝑟𝑒𝑑𝑖𝑡! 𝐾ℎ𝑎𝑙𝑖 𝑀𝑎ℎ𝑚𝑢𝑑 𝑏𝑎𝑏𝑜ℎ𝑎𝑟 𝑘𝑜𝑟𝑡𝑒 𝑝𝑎𝑟𝑏𝑒𝑛");
      }

      const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
      const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

      switch ((args[0] || "").toLowerCase()) {
        case 'admin':
        case 'ad': {
          const listAdmin = Array.isArray(global.config.ADMINBOT) ? global.config.ADMINBOT : [];
          for (const idad of listAdmin) {
            const userData = (await usersData.getData(idad)).data || {};
            userData.banned = 0;
            userData.reason = null;
            userData.dateAdded = null;
            await usersData.setData(idad, { data: userData });
            if (global.data.userBanned && typeof global.data.userBanned.delete === 'function') 
              global.data.userBanned.delete(idad);
          }
          return message.reply("✅ 𝑆𝑎𝑏 𝐴𝑑𝑚𝑖𝑛 𝐵𝑜𝑡 𝑘𝑒 𝑢𝑛𝑏𝑎𝑛 𝑘𝑜𝑟𝑎 ℎ𝑜𝑦𝑒𝑐ℎ𝑒");
        }

        case 'ndh': {
          const listNDH = Array.isArray(global.config.NDH) ? global.config.NDH : [];
          for (const idNDH of listNDH) {
            const userData = (await usersData.getData(idNDH)).data || {};
            userData.banned = 0;
            userData.reason = null;
            userData.dateAdded = null;
            await usersData.setData(idNDH, { data: userData });
            if (global.data.userBanned && typeof global.data.userBanned.delete === 'function') 
              global.data.userBanned.delete(idNDH);
          }
          return message.reply("✅ 𝑆𝑎𝑏 𝑆𝑢𝑝𝑝𝑜𝑟𝑡𝑒𝑟𝑑𝑒𝑟 𝑘𝑒 𝑢𝑛𝑏𝑎𝑛 𝑘𝑜𝑟𝑎 ℎ𝑜𝑦𝑒𝑐ℎ𝑒");
        }

        case 'allbox':
        case 'allthread': {
          const threadBanned = (global.data.threadBanned && typeof global.data.threadBanned.keys === 'function')
            ? Array.from(global.data.threadBanned.keys())
            : [];
          for (const singleThread of threadBanned) {
            const threadData = (await threadsData.getData(singleThread)).data || {};
            threadData.banned = 0;
            threadData.reason = null;
            threadData.dateAdded = null;
            await threadsData.setData(singleThread, { data: threadData });
            if (global.data.threadBanned && typeof global.data.threadBanned.delete === 'function') 
              global.data.threadBanned.delete(singleThread);
          }
          return message.reply("✅ 𝑆𝑎𝑟𝑏𝑎𝑠𝑤𝑎𝑠𝑒𝑟𝑖 𝑔𝑟𝑢𝑝 𝑠𝑎𝑚𝑢ℎ𝑒 𝑠𝑒𝑟𝑣𝑒𝑟 𝑡ℎ𝑒𝑘𝑒 𝑢𝑛𝑏𝑎𝑛 𝑘𝑜𝑟𝑎 ℎ𝑜𝑦𝑒𝑐ℎ𝑒");
        }

        case 'box':
        case 'thread': {
          const idbox = threadID;
          const tData = (await threadsData.getData(idbox)).data || {};
          tData.banned = 0;
          tData.reason = null;
          tData.dateAdded = null;
          await threadsData.setData(idbox, { data: tData });
          if (global.data.threadBanned && typeof global.data.threadBanned.delete === 'function') 
            global.data.threadBanned.delete(idbox);
          return message.reply("✅ 𝐸 𝑔𝑟𝑢𝑝𝑒𝑟 𝑏𝑎𝑛 𝑚𝑢𝑐ℎ𝑒 𝑑𝑒𝑜𝑎 ℎ𝑜𝑦𝑒𝑐ℎ𝑒");
        }

        case 'allmember':
        case 'alluser': {
          const userBanned = (global.data.userBanned && typeof global.data.userBanned.keys === 'function')
            ? Array.from(global.data.userBanned.keys())
            : [];
          for (const singleUser of userBanned) {
            const uData = (await usersData.getData(singleUser)).data || {};
            uData.banned = 0;
            uData.reason = null;
            uData.dateAdded = null;
            await usersData.setData(singleUser, { data: uData });
            if (global.data.userBanned && typeof global.data.userBanned.delete === 'function') 
              global.data.userBanned.delete(singleUser);
          }
          return message.reply("✅ 𝑆𝑎𝑟𝑏𝑎𝑠𝑤𝑎𝑠𝑒𝑟𝑖 𝑢𝑠𝑒𝑟𝑑𝑒𝑟 𝑠𝑒𝑟𝑣𝑒𝑟 𝑡ℎ𝑒𝑘𝑒 𝑢𝑛𝑏𝑎𝑛 𝑘𝑜𝑟𝑎 ℎ𝑜𝑦𝑒𝑐ℎ𝑒");
        }

        case 'qtvall':
        case 'allqtv': {
          const allThreads = await threadsData.getAll();
          for (let i = 0; i < allThreads.length; i++) {
            const threadInfo = allThreads[i].threadInfo || {};
            const idAdmins = Array.isArray(threadInfo.adminIDs) ? threadInfo.adminIDs : [];
            for (let j = 0; j < idAdmins.length; j++) {
              const idad = idAdmins[j].id;
              if (!idad) continue;
              const uData = (await usersData.getData(idad)).data || {};
              uData.banned = 0;
              uData.reason = null;
              uData.dateAdded = null;
              await usersData.setData(idad, { data: uData });
              if (global.data.userBanned && typeof global.data.userBanned.delete === 'function') 
                global.data.userBanned.delete(idad);
            }
          }
          return message.reply('✅ 𝑆𝑎𝑏 𝑆𝑒𝑟𝑣𝑒𝑟 𝐸𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟𝑑𝑒𝑟 𝑘𝑒 𝑢𝑛𝑏𝑎𝑛 𝑘𝑜𝑟𝑎 ℎ𝑜𝑦𝑒𝑐ℎ𝑒');
        }

        case 'qtv': {
          const threadData = await threadsData.getData(threadID);
          const threadInfo = threadData.threadInfo || {};
          const listQTV = Array.isArray(threadInfo.adminIDs) ? threadInfo.adminIDs : [];
          for (const adminObj of listQTV) {
            const idQtv = adminObj.id;
            if (!idQtv) continue;
            const uData = (await usersData.getData(idQtv)).data || {};
            uData.banned = 0;
            uData.reason = null;
            uData.dateAdded = null;
            await usersData.setData(idQtv, { data: uData });
            if (global.data.userBanned && typeof global.data.userBanned.delete === 'function') 
              global.data.userBanned.delete(idQtv);
          }
          return message.reply("✅ 𝐸 𝑔𝑟𝑢𝑝𝑒𝑟 𝑠𝑎𝑏 𝑒𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟 𝑢𝑛𝑏𝑎𝑛 𝑘𝑜𝑟𝑎 ℎ𝑜𝑦𝑒𝑐ℎ𝑒");
        }

        case 'member':
        case 'mb':
        case 'user': {
          if (!args[1]) {
            const listMember = Array.isArray(event.participantIDs) ? event.participantIDs : [];
            for (const idMember of listMember) {
              const uData = (await usersData.getData(idMember)).data || {};
              uData.banned = 0;
              uData.reason = null;
              uData.dateAdded = null;
              await usersData.setData(idMember, { data: uData });
              if (global.data.userBanned && typeof global.data.userBanned.delete === 'function') 
                global.data.userBanned.delete(idMember);
            }
            return message.reply("✅ 𝐸 𝑔𝑟𝑢𝑝𝑒𝑟 𝑠𝑎𝑏 𝑚𝑒𝑚𝑏𝑒𝑟 𝑘𝑒 𝑢𝑛𝑏𝑎𝑛 𝑘𝑜𝑟𝑎 ℎ𝑜𝑦𝑒𝑐ℎ𝑒");
          }

          if (args.join().indexOf('@') !== -1 && event.mentions && Object.keys(event.mentions).length > 0) {
            const mentions = Object.keys(event.mentions);
            const userID = mentions[0];
            const nameUser = event.mentions[userID] || userID;
            const uData = (await usersData.getData(userID)).data || {};
            uData.banned = 0;
            uData.reason = null;
            uData.dateAdded = null;
            await usersData.setData(userID, { data: uData });
            if (global.data.userBanned && typeof global.data.userBanned.delete === 'function') 
              global.data.userBanned.delete(userID);
            return message.reply(`✅ 𝑈𝑠𝑒𝑟 ${nameUser} 𝑟 𝑏𝑎𝑛 𝑚𝑢𝑐ℎ𝑒 𝑑𝑒𝑜𝑎 ℎ𝑜𝑦𝑒𝑐ℎ𝑒`);
          }
          break;
        }

        default: {
          const helpMsg = `「    𝑈𝑁𝐵𝐴𝑁    𝐶𝑂𝑁𝐹𝐼𝐺    」\n◆━━━━━━━━━━━◆\n\n✅ 𝑈𝑛𝑏𝑎𝑛 𝑎𝑑𝑚𝑖𝑛 => 𝑆𝑎𝑏 𝐴𝑑𝑚𝑖𝑛 𝐵𝑜𝑡 𝑘𝑒 𝑏𝑎𝑛 𝑚𝑢𝑐ℎ𝑒 𝑑𝑒𝑜𝑎\n✅ 𝑈𝑛𝑏𝑎𝑛 𝑛𝑑ℎ => 𝑆𝑎𝑏 𝑆𝑢𝑝𝑝𝑜𝑟𝑡𝑒𝑟 𝑘𝑒 𝑏𝑎𝑛 𝑚𝑢𝑐ℎ𝑒 𝑑𝑒𝑜𝑎\n✅ 𝑈𝑛𝑏𝑎𝑛 𝑎𝑙𝑙𝑏𝑜𝑥 => 𝑆𝑎𝑟𝑏𝑎𝑠𝑤𝑎𝑠𝑒𝑟𝑖 𝑔𝑟𝑢𝑝 𝑠𝑎𝑚𝑢ℎ𝑒 𝑏𝑎𝑛 𝑚𝑢𝑐ℎ𝑒 𝑑𝑒𝑜𝑎\n✅ 𝑈𝑛𝑏𝑎𝑛 𝑏𝑜𝑥 => 𝐸𝑘ℎ𝑜𝑛𝑘𝑎𝑟 𝑔𝑟𝑢𝑝𝑒𝑟 𝑏𝑎𝑛 𝑚𝑢𝑐ℎ𝑒 𝑑𝑒𝑜𝑎 (1 𝑔𝑟𝑢𝑝)\n✅ 𝑈𝑛𝑏𝑎𝑛 𝑎𝑙𝑙𝑢𝑠𝑒𝑟 => 𝑆𝑎𝑟𝑏𝑎𝑠𝑤𝑎𝑠𝑒𝑟𝑖 𝑢𝑠𝑒𝑟𝑑𝑒𝑟 𝑏𝑎𝑛 𝑚𝑢𝑐ℎ𝑒 𝑑𝑒𝑜𝑎\n✅ 𝑈𝑛𝑏𝑎𝑛 𝑎𝑙𝑙𝑞𝑡𝑣 => 𝑆𝑎𝑏 𝑆𝑒𝑟𝑣𝑒𝑟 𝐸𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟 𝑘𝑒 𝑏𝑎𝑛 𝑚𝑢𝑐ℎ𝑒 𝑑𝑒𝑜𝑎\n✅ 𝑈𝑛𝑏𝑎𝑛 𝑞𝑡𝑣 => 𝐸 𝑔𝑟𝑢𝑝𝑒𝑟 𝑠𝑎𝑏 𝑒𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟 𝑘𝑒 𝑏𝑎𝑛 𝑚𝑢𝑐ℎ𝑒 𝑑𝑒𝑜𝑎 (1 𝑔𝑟𝑢𝑝)\n✅ 𝑈𝑛𝑏𝑎𝑛 𝑚𝑒𝑚𝑏𝑒𝑟 => 𝐸 𝑔𝑟𝑢𝑝𝑒𝑟 𝑠𝑎𝑏 𝑚𝑒𝑚𝑏𝑒𝑟 𝑘𝑒 𝑏𝑎𝑛 𝑚𝑢𝑐ℎ𝑒 𝑑𝑒𝑜𝑎\n✅ 𝑈𝑛𝑏𝑎𝑛 𝑚𝑒𝑚𝑏𝑒𝑟 𝑡𝑎𝑔 => 𝑇𝑎𝑔 𝑘𝑎𝑟𝑎 𝑢𝑠𝑒𝑟 𝑒𝑟 𝑏𝑎𝑛 𝑚𝑢𝑐ℎ𝑒 𝑑𝑒𝑜𝑎`;
          return message.reply(helpMsg);
        }
      }
    } catch (error) {
      console.error("Unban Error:", error);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑢𝑛𝑏𝑎𝑛 𝑟𝑒𝑞𝑢𝑒𝑠𝑡");
    }
  }
};
