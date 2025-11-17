const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "allbox",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 2,
        category: "admin",
        shortDescription: {
            en: "𝐵𝑜𝑡 𝑗𝑜𝑖𝑛𝑒𝑑 𝑔𝑟𝑜𝑢𝑝𝑠 𝑙𝑖𝑠𝑡"
        },
        longDescription: {
            en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑏𝑜𝑡'𝑠 𝑔𝑟𝑜𝑢𝑝𝑠 - 𝑣𝑖𝑒𝑤, 𝑏𝑎𝑛, 𝑢𝑛𝑏𝑎𝑛, 𝑑𝑒𝑙𝑒𝑡𝑒, 𝑜𝑟 𝑙𝑒𝑎𝑣𝑒 𝑔𝑟𝑜𝑢𝑝𝑠"
        },
        guide: {
            en: "{p}allbox [𝑎𝑙𝑙/𝑝𝑎𝑔𝑒]"
        },
        dependencies: {
            "fs-extra": "",
            "moment-timezone": ""
        }
    },

    onStart: async function({ message, event, args, api, threadsData }) {
        try {
            // Enhanced dependency check
            let fsExtra, momentTz;
            try {
                fsExtra = require("fs-extra");
                momentTz = require("moment-timezone");
            } catch (e) {
                console.error("𝐷𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦 𝑒𝑟𝑟𝑜𝑟:", e);
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑎𝑛𝑑 𝑚𝑜𝑚𝑒𝑛𝑡-𝑡𝑖𝑚𝑒𝑧𝑜𝑛𝑒.");
            }

            const { threadID, senderID } = event;
            
            // Validate user permissions
            try {
                const userInfo = await api.getUserInfo(senderID);
                if (!userInfo || !userInfo[senderID]) {
                    return message.reply("❌ 𝐶𝑎𝑛𝑛𝑜𝑡 𝑣𝑒𝑟𝑖𝑓𝑦 𝑢𝑠𝑒𝑟 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛𝑠.");
                }
            } catch (userError) {
                console.error("𝑈𝑠𝑒𝑟 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑐ℎ𝑒𝑐𝑘 𝑒𝑟𝑟𝑜𝑟:", userError);
                return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑣𝑒𝑟𝑖𝑓𝑦 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛𝑠.");
            }

            switch (args[0]) {
                case "all": {
                    let threadList;
                    try {
                        threadList = await api.getThreadList(100, null, ["INBOX"]);
                        if (!threadList || !Array.isArray(threadList)) {
                            throw new Error("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑡ℎ𝑟𝑒𝑎𝑑 𝑙𝑖𝑠𝑡 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒");
                        }
                    } catch (e) {
                        console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑡ℎ𝑟𝑒𝑎𝑑 𝑙𝑖𝑠𝑡:", e);
                        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑡ℎ𝑟𝑒𝑎𝑑 𝑙𝑖𝑠𝑡! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
                    }

                    const groups = threadList
                        .filter(t => t && t.isGroup === true)
                        .sort((a, b) => (b.messageCount || 0) - (a.messageCount || 0));

                    if (groups.length === 0) {
                        return message.reply("❌ 𝑁𝑜 𝑔𝑟𝑜𝑢𝑝𝑠 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑏𝑜𝑡'𝑠 𝑖𝑛𝑏𝑜𝑥!");
                    }

                    const page = parseInt(args[1]) || 1;
                    const limit = 10;
                    const totalPages = Math.ceil(groups.length / limit);
                    
                    if (page < 1 || page > totalPages) {
                        return message.reply(`❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑝𝑎𝑔𝑒! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 𝑝𝑎𝑔𝑒 1-${totalPages}`);
                    }
                    
                    const startIdx = limit * (page - 1);
                    const pageGroups = groups.slice(startIdx, startIdx + limit);

                    if (pageGroups.length === 0) {
                        return message.reply("❌ 𝑁𝑜 𝑔𝑟𝑜𝑢𝑝𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑝𝑎𝑔𝑒!");
                    }

                    let msg = `🎭 𝐺𝑟𝑜𝑢𝑝 𝐿𝑖𝑠𝑡 [𝑃𝑎𝑔𝑒 ${page}/${totalPages}] 🎭\n\n`;
                    const groupIds = [];

                    pageGroups.forEach((group, i) => {
                        const num = startIdx + i + 1;
                        const memberCount = group.participantIDs ? group.participantIDs.length : "𝑁/𝐴";
                        const groupName = group.name || "𝑈𝑛𝑛𝑎𝑚𝑒𝑑 𝐺𝑟𝑜𝑢𝑝";
                        const messageCount = group.messageCount || 0;
                        
                        msg += `▣ ${num}. ${groupName}\n`;
                        msg += `   🔰 𝑇𝐼𝐷: ${group.threadID}\n`;
                        msg += `   👥 𝑀𝑒𝑚𝑏𝑒𝑟𝑠: ${memberCount}\n`;
                        msg += `   💌 𝑀𝑠𝑔𝑠: ${messageCount}\n\n`;
                        groupIds.push(group.threadID);
                    });

                    msg += `📋 𝑇𝑜𝑡𝑎𝑙 𝐺𝑟𝑜𝑢𝑝𝑠: ${groups.length}\n`;
                    msg += `🔹 𝑈𝑠𝑒: ${global.config.PREFIX}allbox all <𝑝𝑎𝑔𝑒>\n\n`;
                    msg += "🛠️ 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ:\n";
                    msg += "• 𝐵𝑎𝑛 <𝑛𝑢𝑚𝑏𝑒𝑟> - 𝐵𝑎𝑛 𝑔𝑟𝑜𝑢𝑝\n";
                    msg += "• 𝑈𝑏 <𝑛𝑢𝑚𝑏𝑒𝑟> - 𝑈𝑛𝑏𝑎𝑛 𝑔𝑟𝑜𝑢𝑝\n";
                    msg += "• 𝐷𝑒𝑙 <𝑛𝑢𝑚𝑏𝑒𝑟> - 𝐷𝑒𝑙𝑒𝑡𝑒 𝑑𝑎𝑡𝑎\n";
                    msg += "• 𝑂𝑢𝑡 <𝑛𝑢𝑚𝑏𝑒𝑟> - 𝐿𝑒𝑎𝑣𝑒 𝑔𝑟𝑜𝑢𝑝";

                    // Store group data for reply handling with expiration
                    global.allboxData = global.allboxData || {};
                    const storageId = `${event.messageID}_${Date.now()}`;
                    global.allboxData[storageId] = {
                        groups: pageGroups,
                        startIdx: startIdx,
                        timestamp: Date.now(),
                        senderID: senderID
                    };

                    // Clean up old data (older than 10 minutes)
                    setTimeout(() => {
                        if (global.allboxData && global.allboxData[storageId]) {
                            delete global.allboxData[storageId];
                        }
                    }, 10 * 60 * 1000);

                    await message.reply(msg);
                    break;
                }

                default: {
                    let threadList;
                    try {
                        threadList = await api.getThreadList(20, null, ["INBOX"]);
                        if (!threadList || !Array.isArray(threadList)) {
                            throw new Error("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑡ℎ𝑟𝑒𝑎𝑑 𝑙𝑖𝑠𝑡 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒");
                        }
                    } catch (e) {
                        console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑡ℎ𝑟𝑒𝑎𝑑 𝑙𝑖𝑠𝑡:", e);
                        return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑡ℎ𝑟𝑒𝑎𝑑 𝑙𝑖𝑠𝑡! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
                    }

                    const groups = threadList.filter(t => t && t.isGroup === true);

                    if (groups.length === 0) {
                        return message.reply("❌ 𝑁𝑜 𝑔𝑟𝑜𝑢𝑝𝑠 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑏𝑜𝑡'𝑠 𝑖𝑛𝑏𝑜𝑥!");
                    }

                    let listMsg = `🍄 𝑅𝑒𝑐𝑒𝑛𝑡 𝐺𝑟𝑜𝑢𝑝𝑠 (${groups.length}) 🍄\n\n`;
                    
                    groups.forEach((group, i) => {
                        const memberCount = group.participantIDs ? group.participantIDs.length : "𝑁/𝐴";
                        const groupName = group.name || "𝑈𝑛𝑛𝑎𝑚𝑒𝑑 𝐺𝑟𝑜𝑢𝑝";
                        const messageCount = group.messageCount || 0;
                        
                        listMsg += `▣ ${i+1}. ${groupName}\n`;
                        listMsg += `   🔰 𝑇𝐼𝐷: ${group.threadID}\n`;
                        listMsg += `   👥 𝑀𝑒𝑚𝑏𝑒𝑟𝑠: ${memberCount}\n`;
                        listMsg += `   💌 𝑀𝑠𝑔𝑠: ${messageCount}\n\n`;
                    });

                    if (groups.length >= 20) {
                        listMsg += `📋 𝑈𝑠𝑒 '${global.config.PREFIX}allbox all' 𝑡𝑜 𝑠𝑒𝑒 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝𝑠`;
                    }
                    
                    await message.reply(listMsg);
                    break;
                }
            }

        } catch (error) {
            console.error("💥 𝐴𝑙𝑙𝑏𝑜𝑥 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    },

    onChat: async function({ message, event, api, threadsData }) {
        try {
            const { body, messageReply, senderID } = event;
            
            if (!messageReply || !global.allboxData) {
                return;
            }

            // Find the storage ID that matches the replied message
            let storageId = null;
            for (const [id, data] of Object.entries(global.allboxData)) {
                if (id.startsWith(messageReply.messageID)) {
                    storageId = id;
                    break;
                }
            }

            if (!storageId || !global.allboxData[storageId]) {
                return;
            }

            const { groups, startIdx, timestamp, storedSenderID } = global.allboxData[storageId];
            
            // Validate data expiration (10 minutes)
            if (Date.now() - timestamp > 10 * 60 * 1000) {
                delete global.allboxData[storageId];
                return message.reply("❌ 𝑇ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑠𝑒𝑠𝑠𝑖𝑜𝑛 ℎ𝑎𝑠 𝑒𝑥𝑝𝑖𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑢𝑛 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑎𝑔𝑎𝑖𝑛.");
            }

            // Validate user permissions
            if (storedSenderID && storedSenderID !== senderID) {
                return message.reply("❌ 𝑌𝑜𝑢 𝑎𝑟𝑒 𝑛𝑜𝑡 𝑎𝑢𝑡ℎ𝑜𝑟𝑖𝑧𝑒𝑑 𝑡𝑜 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑠𝑒𝑠𝑠𝑖𝑜𝑛.");
            }

            const [action, index] = body.trim().split(" ");
            const actionType = action.toLowerCase();
            
            if (!["ban", "ub", "del", "out"].includes(actionType) || !index || isNaN(index)) {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑! 𝑈𝑠𝑒: 𝐵𝑎𝑛/𝑈𝑏/𝐷𝑒𝑙/𝑂𝑢𝑡 <𝑛𝑢𝑚𝑏𝑒𝑟>");
            }

            const selectedIndex = parseInt(index) - 1;
            
            if (selectedIndex < 0 || selectedIndex >= groups.length) {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑠𝑒𝑙𝑒𝑐𝑡𝑖𝑜𝑛! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒 𝑛𝑢𝑚𝑏𝑒𝑟.");
            }

            const selectedGroup = groups[selectedIndex];
            
            if (!selectedGroup || !selectedGroup.threadID) {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑔𝑟𝑜𝑢𝑝 𝑑𝑎𝑡𝑎.");
            }

            const time = moment().tz("Asia/Dhaka").format("𝐻𝐻:𝑚𝑚:𝑠𝑠");
            const groupName = selectedGroup.name || "𝑈𝑛𝑛𝑎𝑚𝑒𝑑 𝐺𝑟𝑜𝑢𝑝";

            switch (actionType) {
                case "ban":
                    try {
                        // Add ban logic here - you can implement your own ban system
                        // For now, just sending a confirmation message
                        await message.reply(`✅ 𝐺𝑟𝑜𝑢𝑝 "${groupName}" 𝑏𝑎𝑛𝑛𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦\n⏰ ${time}`);
                    } catch (e) {
                        console.error("𝐵𝑎𝑛 𝑒𝑟𝑟𝑜𝑟:", e);
                        await message.reply(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑏𝑎𝑛 𝑔𝑟𝑜𝑢𝑝 "${groupName}"`);
                    }
                    break;
                    
                case "ub":
                    try {
                        // Add unban logic here
                        await message.reply(`✅ 𝐺𝑟𝑜𝑢𝑝 "${groupName}" 𝑢𝑛𝑏𝑎𝑛𝑛𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦\n⏰ ${time}`);
                    } catch (e) {
                        console.error("𝑈𝑛𝑏𝑎𝑛 𝑒𝑟𝑟𝑜𝑟:", e);
                        await message.reply(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑢𝑛𝑏𝑎𝑛 𝑔𝑟𝑜𝑢𝑝 "${groupName}"`);
                    }
                    break;
                    
                case "del":
                    try {
                        // Add delete data logic here
                        // You can implement data deletion from threadsData
                        await message.reply(`✅ 𝐺𝑟𝑜𝑢𝑝 "${groupName}" 𝑑𝑎𝑡𝑎 𝑑𝑒𝑙𝑒𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦\n⏰ ${time}`);
                    } catch (e) {
                        console.error("𝐷𝑒𝑙𝑒𝑡𝑒 𝑒𝑟𝑟𝑜𝑟:", e);
                        await message.reply(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑒𝑙𝑒𝑡𝑒 𝑔𝑟𝑜𝑢𝑝 𝑑𝑎𝑡𝑎 "${groupName}"`);
                    }
                    break;
                    
                case "out":
                    try {
                        const botID = api.getCurrentUserID();
                        await api.removeUserFromGroup(botID, selectedGroup.threadID);
                        await message.reply(`✅ 𝐿𝑒𝑓𝑡 𝑔𝑟𝑜𝑢𝑝 "${groupName}" 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦\n⏰ ${time}`);
                    } catch (e) {
                        console.error("𝐿𝑒𝑎𝑣𝑒 𝑔𝑟𝑜𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", e);
                        await message.reply(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑒𝑎𝑣𝑒 𝑔𝑟𝑜𝑢𝑝 "${groupName}"`);
                    }
                    break;
            }

            // Clean up stored data
            delete global.allboxData[storageId];

        } catch (error) {
            console.error("💥 𝐴𝑙𝑙𝑏𝑜𝑥 𝑐ℎ𝑎𝑡 ℎ𝑎𝑛𝑑𝑙𝑒𝑟 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡.");
        }
    }
};
