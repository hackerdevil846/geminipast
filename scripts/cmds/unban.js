module.exports = {
  config: {
    name: "unban",
    aliases: ["ub", "unblock"],
    version: "2.0.0",
    author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
    role: 2,
    category: "system",
    shortDescription: {
      en: "🔓 𝐔𝐧𝐛𝐚𝐧 𝐮𝐬𝐞𝐫𝐬 𝐨𝐫 𝐠𝐫𝐨𝐮𝐩𝐬 𝐟𝐫𝐨𝐦 𝐭𝐡𝐞 𝐬𝐞𝐫𝐯𝐞𝐫"
    },
    longDescription: {
      en: "𝐑𝐞𝐦𝐨𝐯𝐞 𝐛𝐚𝐧 𝐫𝐞𝐬𝐭𝐫𝐢𝐜𝐭𝐢𝐨𝐧𝐬 𝐟𝐫𝐨𝐦 𝐮𝐬𝐞𝐫𝐬, 𝐠𝐫𝐨𝐮𝐩𝐬, 𝐨𝐫 𝐚𝐝𝐦𝐢𝐧𝐬"
    },
    guide: {
      en: "{p}unban [𝐨𝐩𝐭𝐢𝐨𝐧: 𝐚𝐝𝐦𝐢𝐧/𝐧𝐝𝐡/𝐚𝐥𝐥𝐛𝐨𝐱/𝐛𝐨𝐱/𝐚𝐥𝐥𝐮𝐬𝐞𝐫/𝐚𝐥𝐥𝐪𝐭𝐯/𝐪𝐭𝐯/𝐦𝐞𝐦𝐛𝐞𝐫]"
    },
    countDown: 2,
    dependencies: {}
  },

  onStart: async function ({ api, event, args, message, usersData, threadsData }) {
    try {
      const { threadID, messageID } = event;

      // 𝐂𝐫𝐞𝐝𝐢𝐭 𝐜𝐡𝐞𝐜𝐤
      const { commands } = global.client;
      const command = commands.get("unban");
      const credit = command && command.config ? command.config.credits : "";
      const requiredCredit = "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝";
      
      if (credit !== requiredCredit) {
        return message.reply("❌ 𝐖𝐫𝐨𝐧𝐠 𝐜𝐫𝐞𝐝𝐢𝐭! 𝐎𝐧𝐥𝐲 𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝 𝐜𝐚𝐧 𝐮𝐬𝐞 𝐭𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝");
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
          return message.reply("✅ 𝐀𝐥𝐥 𝐁𝐨𝐭 𝐀𝐝𝐦𝐢𝐧𝐬 𝐡𝐚𝐯𝐞 𝐛𝐞𝐞𝐧 𝐮𝐧𝐛𝐚𝐧𝐧𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲");
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
          return message.reply("✅ 𝐀𝐥𝐥 𝐒𝐮𝐩𝐩𝐨𝐫𝐭𝐞𝐫𝐬 𝐡𝐚𝐯𝐞 𝐛𝐞𝐞𝐧 𝐮𝐧𝐛𝐚𝐧𝐧𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲");
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
          return message.reply("✅ 𝐀𝐥𝐥 𝐠𝐫𝐨𝐮𝐩𝐬 𝐡𝐚𝐯𝐞 𝐛𝐞𝐞𝐧 𝐮𝐧𝐛𝐚𝐧𝐧𝐞𝐝 𝐟𝐫𝐨𝐦 𝐭𝐡𝐞 𝐬𝐞𝐫𝐯𝐞𝐫");
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
          return message.reply("✅ 𝐓𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐮𝐧𝐛𝐚𝐧𝐧𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲");
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
          return message.reply("✅ 𝐀𝐥𝐥 𝐮𝐬𝐞𝐫𝐬 𝐡𝐚𝐯𝐞 𝐛𝐞𝐞𝐧 𝐮𝐧𝐛𝐚𝐧𝐧𝐞𝐝 𝐟𝐫𝐨𝐦 𝐭𝐡𝐞 𝐬𝐞𝐫𝐯𝐞𝐫");
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
          return message.reply('✅ 𝐀𝐥𝐥 𝐒𝐞𝐫𝐯𝐞𝐫 𝐀𝐝𝐦𝐢𝐧𝐢𝐬𝐭𝐫𝐚𝐭𝐨𝐫𝐬 𝐡𝐚𝐯𝐞 𝐛𝐞𝐞𝐧 𝐮𝐧𝐛𝐚𝐧𝐧𝐞𝐝');
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
          return message.reply("✅ 𝐀𝐥𝐥 𝐚𝐝𝐦𝐢𝐧𝐢𝐬𝐭𝐫𝐚𝐭𝐨𝐫𝐬 𝐨𝐟 𝐭𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩 𝐡𝐚𝐯𝐞 𝐛𝐞𝐞𝐧 𝐮𝐧𝐛𝐚𝐧𝐧𝐞𝐝");
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
            return message.reply("✅ 𝐀𝐥𝐥 𝐦𝐞𝐦𝐛𝐞𝐫𝐬 𝐨𝐟 𝐭𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩 𝐡𝐚𝐯𝐞 𝐛𝐞𝐞𝐧 𝐮𝐧𝐛𝐚𝐧𝐧𝐞𝐝");
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
            return message.reply(`✅ 𝐔𝐬𝐞𝐫 ${nameUser} 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐮𝐧𝐛𝐚𝐧𝐧𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲`);
          }
          break;
        }

        default: {
          const helpMsg = `「    𝐔𝐍𝐁𝐀𝐍    𝐂𝐎𝐍𝐅𝐈𝐆    」\n◆━━━━━━━━━━━◆\n\n✅ 𝐮𝐧𝐛𝐚𝐧 𝐚𝐝𝐦𝐢𝐧 => 𝐔𝐧𝐛𝐚𝐧 𝐚𝐥𝐥 𝐁𝐨𝐭 𝐀𝐝𝐦𝐢𝐧𝐬\n✅ 𝐮𝐧𝐛𝐚𝐧 𝐧𝐝𝐡 => 𝐔𝐧𝐛𝐚𝐧 𝐚𝐥𝐥 𝐒𝐮𝐩𝐩𝐨𝐫𝐭𝐞𝐫𝐬\n✅ 𝐮𝐧𝐛𝐚𝐧 𝐚𝐥𝐥𝐛𝐨𝐱 => 𝐔𝐧𝐛𝐚𝐧 𝐚𝐥𝐥 𝐠𝐫𝐨𝐮𝐩𝐬 𝐟𝐫𝐨𝐦 𝐬𝐞𝐫𝐯𝐞𝐫\n✅ 𝐮𝐧𝐛𝐚𝐧 𝐛𝐨𝐱 => 𝐔𝐧𝐛𝐚𝐧 𝐜𝐮𝐫𝐫𝐞𝐧𝐭 𝐠𝐫𝐨𝐮𝐩 𝐨𝐧𝐥𝐲\n✅ 𝐮𝐧𝐛𝐚𝐧 𝐚𝐥𝐥𝐮𝐬𝐞𝐫 => 𝐔𝐧𝐛𝐚𝐧 𝐚𝐥𝐥 𝐮𝐬𝐞𝐫𝐬 𝐟𝐫𝐨𝐦 𝐬𝐞𝐫𝐯𝐞𝐫\n✅ 𝐮𝐧𝐛𝐚𝐧 𝐚𝐥𝐥𝐪𝐭𝐯 => 𝐔𝐧𝐛𝐚𝐧 𝐚𝐥𝐥 𝐒𝐞𝐫𝐯𝐞𝐫 𝐀𝐝𝐦𝐢𝐧𝐢𝐬𝐭𝐫𝐚𝐭𝐨𝐫𝐬\n✅ 𝐮𝐧𝐛𝐚𝐧 𝐪𝐭𝐯 => 𝐔𝐧𝐛𝐚𝐧 𝐚𝐥𝐥 𝐚𝐝𝐦𝐢𝐧𝐬 𝐨𝐟 𝐜𝐮𝐫𝐫𝐞𝐧𝐭 𝐠𝐫𝐨𝐮𝐩\n✅ 𝐮𝐧𝐛𝐚𝐧 𝐦𝐞𝐦𝐛𝐞𝐫 => 𝐔𝐧𝐛𝐚𝐧 𝐚𝐥𝐥 𝐦𝐞𝐦𝐛𝐞𝐫𝐬 𝐨𝐟 𝐜𝐮𝐫𝐫𝐞𝐧𝐭 𝐠𝐫𝐨𝐮𝐩\n✅ 𝐮𝐧𝐛𝐚𝐧 𝐦𝐞𝐦𝐛𝐞𝐫 @𝐭𝐚𝐠 => 𝐔𝐧𝐛𝐚𝐧 𝐬𝐩𝐞𝐜𝐢𝐟𝐢𝐜 𝐭𝐚𝐠𝐠𝐞𝐝 𝐮𝐬𝐞𝐫`;
          return message.reply(helpMsg);
        }
      }
    } catch (error) {
      console.error("❌ 𝐔𝐧𝐛𝐚𝐧 𝐄𝐫𝐫𝐨𝐫:", error);
      message.reply("❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐮𝐧𝐛𝐚𝐧 𝐫𝐞𝐪𝐮𝐞𝐬𝐭");
    }
  }
};
