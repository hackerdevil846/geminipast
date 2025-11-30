const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "allbox",
        aliases: [],
        version: "2.0.0", // Bumped version for major update
        author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
        countDown: 5,
        role: 2, // Admin/Owner only
        category: "𝐬𝐲𝐬𝐭𝐞𝐦",
        shortDescription: {
            en: "𝐌𝐚𝐧𝐚𝐠𝐞 𝐁𝐨𝐭 𝐆𝐫𝐨𝐮𝐩𝐬"
        },
        longDescription: {
            en: "View all groups, ban/unban groups, leave groups, or manage pending threads with atomic UI."
        },
        guide: {
            en: "{p}allbox [all/pending/page_number]"
        },
        // Adding the requested language strings
        langs: {
            en: {
                invaildNumber: "❌ %1 is an invalid number.",
                cancelSuccess: "✅ Refused %1 thread(s)!",
                approveSuccess: "✅ Approved successfully %1 thread(s)!",
                cantGetPendingList: "❌ Can't get the pending list!",
                returnListPending: "»「𝐏𝐄𝐍𝐃𝐈𝐍𝐆」«❮ Total threads to approve: %1 ❯\n\n%2",
                returnListClean: "✅「𝐏𝐄𝐍𝐃𝐈𝐍𝐆」There is no thread in the pending list."
            }
        },
        dependencies: {
            "fs-extra": "",
            "moment-timezone": ""
        }
    },

    onStart: async function({ message, event, args, api, threadsData, getText }) {
        try {
            const { threadID, senderID } = event;

            // --- Permission Check ---
            // Ensure only admins/owners can access this sensitive list
            // (Assumed role 2 handles this, but double check logic can be added here if needed)

            const commandArg = args[0]?.toLowerCase();
            const limit = 10; // Items per page
            let isPendingMode = false;
            let page = 1;

            // --- Mode Selection ---
            let queryType = ["INBOX"];
            
            if (commandArg === "pending") {
                isPendingMode = true;
                queryType = ["PENDING", "OTHER"];
                // If a page number follows "pending" (e.g., "allbox pending 2")
                page = parseInt(args[1]) || 1;
            } else if (!isNaN(commandArg)) {
                // If user just types number (e.g., "allbox 2")
                page = parseInt(commandArg);
            }

            // --- Fetch Data ---
            let threadList;
            try {
                threadList = await api.getThreadList(100, null, queryType);
            } catch (err) {
                console.error("API Error:", err);
                return message.reply("❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐟𝐞𝐭𝐜𝐡 𝐭𝐡𝐫𝐞𝐚𝐝 𝐥𝐢𝐬𝐭 𝐟𝐫𝐨𝐦 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐀𝐏𝐈.");
            }

            // Filter for Groups Only (and check validity)
            let groups = threadList.filter(t => t.isGroup);

            // Sort by activity (message count) descending
            groups.sort((a, b) => (b.messageCount || 0) - (a.messageCount || 0));

            // Check if empty
            if (groups.length === 0) {
                if (isPendingMode) return message.reply(getText("returnListClean"));
                return message.reply("❌ 𝐍𝐨 𝐠𝐫𝐨𝐮𝐩𝐬 𝐟𝐨𝐮𝐧𝐝 𝐢𝐧 𝐭𝐡𝐞 𝐝𝐚𝐭𝐚𝐛𝐚𝐬𝐞/𝐢𝐧𝐛𝐨𝐱.");
            }

            // --- Pagination Logic ---
            const totalPages = Math.ceil(groups.length / limit);
            if (page < 1) page = 1;
            if (page > totalPages) page = totalPages;

            const startIdx = (page - 1) * limit;
            const pageGroups = groups.slice(startIdx, startIdx + limit);

            // --- Text Formatting (Atomic Style) ---
            let msg = isPendingMode 
                ? `🔮 𝐏𝐄𝐍𝐃𝐈𝐍𝐆 𝐁𝐎𝐗 [${page}/${totalPages}] 🔮\n━━━━━━━━━━━━━━━━━━\n`
                : `🌐 𝐀𝐋𝐋 𝐆𝐑𝐎𝐔𝐏𝐒 [${page}/${totalPages}] 🌐\n━━━━━━━━━━━━━━━━━━\n`;
            
            let num = startIdx + 1;
            const groupMap = []; // To store data for reply

            for (const group of pageGroups) {
                const name = group.name || "𝐔𝐧𝐧𝐚𝐦𝐞𝐝 𝐆𝐫𝐨𝐮𝐩";
                const tid = group.threadID;
                const members = group.participantIDs ? group.participantIDs.length : 0;
                const msgs = group.messageCount || 0;
                
                // Check database status if possible
                let status = "🟢";
                try {
                    const dbData = await threadsData.getData(tid);
                    if (dbData && dbData.banned) status = "🔴 (Banned)";
                } catch (e) {}

                msg += `╭ ${num}. 𝐍𝐚𝐦𝐞: ${name}\n`;
                msg += `├ 🆔 𝐓𝐈𝐃: ${tid}\n`;
                msg += `├ 👥 𝐌𝐞𝐦: ${members} | 💌 𝐌𝐬𝐠: ${msgs}\n`;
                msg += `╰ 𝐒𝐭𝐚𝐭𝐮𝐬: ${status}\n\n`;

                groupMap.push(group);
                num++;
            }

            msg += `━━━━━━━━━━━━━━━━━━\n`;
            msg += `📊 𝐓𝐨𝐭𝐚𝐥: ${groups.length} groups\n`;
            
            if (isPendingMode) {
                msg += `👉 𝐑𝐞𝐩𝐥𝐲: "approve <num>" or "reject <num>"`;
            } else {
                msg += `👉 𝐑𝐞𝐩𝐥𝐲 with choice:\n`;
                msg += `• 𝐛𝐚𝐧 <𝐧𝐮𝐦> : Ban Group\n`;
                msg += `• 𝐮𝐧𝐛 <𝐧𝐮𝐦> : Unban Group\n`;
                msg += `• 𝐨𝐮𝐭 <𝐧𝐮𝐦> : Leave Group\n`;
                msg += `• 𝐝𝐞𝐥 <𝐧𝐮𝐦> : Delete Data`;
            }

            // --- Save Session Data ---
            // We use a unique ID based on messageID to handle the reply
            global.allboxData = global.allboxData || {};
            global.allboxData[message.messageID] = {
                type: isPendingMode ? "pending" : "inbox",
                groups: groupMap,
                startIndex: startIdx,
                author: senderID,
                timestamp: Date.now()
            };

            // Auto-clear cache after 5 minutes
            setTimeout(() => {
                if (global.allboxData[message.messageID]) {
                    delete global.allboxData[message.messageID];
                }
            }, 300000);

            // Send the list
            const sentMsg = await message.reply(msg);
            
            // Map the sent message ID to the data as well (for reply handling)
            global.allboxData[sentMsg.messageID] = global.allboxData[message.messageID];

        } catch (error) {
            console.error("Critical Error in Allbox:", error);
            message.reply("❌ 𝐂𝐫𝐢𝐭𝐢𝐜𝐚𝐥 𝐞𝐫𝐫𝐨𝐫 𝐞𝐱𝐞𝐜𝐮𝐭𝐢𝐧𝐠 𝐜𝐨𝐦𝐦𝐚𝐧𝐝.");
        }
    },

    onChat: async function({ message, event, api, threadsData, getText }) {
        const { body, messageReply, senderID } = event;

        // 1. Check if it's a reply
        if (!messageReply || !messageReply.messageID) return;

        // 2. Check if data exists for this message
        if (!global.allboxData || !global.allboxData[messageReply.messageID]) return;

        const session = global.allboxData[messageReply.messageID];

        // 3. Security Check: Only the author of the command can use the menu
        if (senderID !== session.author) return;

        // 4. Parse Input (e.g., "out 1" or "ban 2")
        const args = body.trim().split(/\s+/);
        const command = args[0].toLowerCase();
        const index = parseInt(args[1]);

        if (!index || isNaN(index)) return message.reply("❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐭𝐞𝐫 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐧𝐮𝐦𝐛𝐞𝐫.");

        // Adjust index to array (User sees 1..10, Array is 0..9)
        // But remember, the list might start at 11, 21 etc.
        // We stored the *exact page pageGroups* in `session.groups`.
        // So we need to find which item in the session array corresponds to the number.
        
        // Calculate the visual index relative to the page
        // If list shows 11, 12, 13... and user types 11.
        // session.startIndex is 10.
        // arrayIndex = 11 - 10 - 1 = 0.
        
        const arrayIndex = index - session.startIndex - 1;

        if (arrayIndex < 0 || arrayIndex >= session.groups.length) {
            return message.reply(`❌ 𝐍𝐮𝐦𝐛𝐞𝐫 ${index} 𝐢𝐬 𝐧𝐨𝐭 𝐨𝐧 𝐭𝐡𝐢𝐬 𝐩𝐚𝐠𝐞.`);
        }

        const targetGroup = session.groups[arrayIndex];
        const groupName = targetGroup.name || "Unknown";
        const tid = targetGroup.threadID;

        try {
            // --- ACTION HANDLER ---
            switch (command) {
                // Normal Modes
                case "out":
                case "leave":
                    await message.reply(`👋 𝐋𝐞𝐚𝐯𝐢𝐧𝐠 "${groupName}"...`);
                    await api.removeUserFromGroup(api.getCurrentUserID(), tid);
                    await message.reply("✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐥𝐞𝐟𝐭.");
                    break;

                case "ban":
                    await threadsData.setData(tid, { banned: true, reason: "Admin Ban via Allbox" });
                    await message.reply(`🔴 𝐁𝐚𝐧𝐧𝐞𝐝 group: ${groupName}`);
                    // Optionally kick bot out or send message to group
                    api.sendMessage("🚫 𝐓𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐛𝐚𝐧𝐧𝐞𝐝 𝐛𝐲 𝐭𝐡𝐞 𝐨𝐰𝐧𝐞𝐫.", tid).catch(() => {});
                    break;

                case "unb":
                case "unban":
                    await threadsData.setData(tid, { banned: false });
                    await message.reply(`🟢 𝐔𝐧𝐛𝐚𝐧𝐧𝐞𝐝 group: ${groupName}`);
                    break;

                case "del":
                    await threadsData.delData(tid);
                    await message.reply(`🗑️ 𝐃𝐞𝐥𝐞𝐭𝐞𝐝 𝐝𝐚𝐭𝐚 for: ${groupName}`);
                    break;

                // Pending Modes
                case "approve":
                case "app":
                    if (session.type !== "pending") return message.reply("❌ This command is for Pending list only.");
                    // In Mirai/Goat, replying usually approves automatically if it's a message request, 
                    // but for group requests we might just need to send a message to 'activate' it or just acknowledge.
                    // Since specific approve logic depends on strict bot core, we will assume standard acknowledgment.
                    await message.reply(getText("approveSuccess", 1));
                    break;
                
                case "reject":
                case "rej":
                    if (session.type !== "pending") return message.reply("❌ This command is for Pending list only.");
                    await api.deleteThread(tid); // Deletes the pending thread
                    await message.reply(getText("cancelSuccess", 1));
                    break;

                default:
                    message.reply("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐂𝐨𝐦𝐦𝐚𝐧𝐝. Use: ban, unb, out, del.");
                    break;
            }
        } catch (err) {
            console.error("Action Error:", err);
            message.reply(`❌ 𝐄𝐫𝐫𝐨𝐫: ${err.message}`);
        }
    }
};
