const fs = require("fs-extra");

/**
 * 𝐇𝐞𝐥𝐩𝐞𝐫 𝐅𝐮𝐧𝐜𝐭𝐢𝐨𝐧 𝐭𝐨 𝐂𝐨𝐧𝐯𝐞𝐫𝐭 𝐓𝐞𝐱𝐭 𝐭𝐨 𝐁𝐨𝐥𝐝 𝐒𝐚𝐧𝐬-𝐬𝐞𝐫𝐢𝐟
 */
const toBold = (str) => {
    return str.replace(/[a-zA-Z0-9]/g, (char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(code + 120211); // A-Z
        if (code >= 97 && code <= 122) return String.fromCodePoint(code + 120205); // a-z
        if (code >= 48 && code <= 57) return String.fromCodePoint(code + 120764); // 0-9
        return char;
    });
};

module.exports = {
    config: {
        name: "listban",
        aliases: [],
        version: "2.0.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 2, // Admin Only
        category: "𝐬𝐲𝐬𝐭𝐞𝐦",
        shortDescription: {
            en: "𝐌𝐚𝐧𝐚𝐠𝐞 𝐁𝐚𝐧𝐧𝐞𝐝 𝐔𝐬𝐞𝐫𝐬/𝐆𝐫𝐨𝐮𝐩𝐬"
        },
        longDescription: {
            en: "𝐕𝐢𝐞𝐰 𝐚𝐧𝐝 𝐔𝐧𝐛𝐚𝐧 𝐮𝐬𝐞𝐫𝐬 𝐨𝐫 𝐠𝐫𝐨𝐮𝐩𝐬 𝐰𝐢𝐭𝐡 𝐩𝐚𝐠𝐢𝐧𝐚𝐭𝐢𝐨𝐧."
        },
        guide: {
            en: "{p}listban [𝐮𝐬𝐞𝐫 | 𝐭𝐡𝐫𝐞𝐚𝐝]"
        },
        dependencies: {
            "fs-extra": "",
            "axios": ""
        }
    },

    onStart: async function ({ message, event, args, Users, Threads }) {
        try {
            // --- 𝟏. 𝐃𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐲 & 𝐃𝐚𝐭𝐚 𝐂𝐡𝐞𝐜𝐤 ---
            if (!global.data.userBanned) global.data.userBanned = new Map();
            if (!global.data.threadBanned) global.data.threadBanned = new Map();

            const type = (args[0] || "").toLowerCase();
            const { threadID, senderID } = event;

            // --- 𝟐. 𝐌𝐚𝐢𝐧 𝐒𝐞𝐥𝐞𝐜𝐭𝐢𝐨𝐧 𝐋𝐨𝐠𝐢𝐜 ---
            if (["thread", "t", "group"].includes(type)) {
                // Handle Thread Ban List
                const bannedThreads = Array.from(global.data.threadBanned.keys());
                
                if (bannedThreads.length === 0) {
                    return message.reply(toBold("✅ 𝐂𝐮𝐫𝐫𝐞𝐧𝐭𝐥𝐲, 𝐭𝐡𝐞𝐫𝐞 𝐚𝐫𝐞 𝐧𝐨 𝐛𝐚𝐧𝐧𝐞𝐝 𝐠𝐫𝐨𝐮𝐩𝐬!"));
                }

                message.reply(toBold(`🔄 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 ${bannedThreads.length} 𝐛𝐚𝐧𝐧𝐞𝐝 𝐠𝐫𝐨𝐮𝐩𝐬...`));

                const list = [];
                for (const tid of bannedThreads) {
                    const name = await Threads.getName(tid) || "Unknown Group";
                    list.push({ id: tid, name: name });
                }

                this.sendPage(message, threadID, list, 1, "thread", senderID);

            } else if (["user", "u", "member"].includes(type)) {
                // Handle User Ban List
                const bannedUsers = Array.from(global.data.userBanned.keys());

                if (bannedUsers.length === 0) {
                    return message.reply(toBold("✅ 𝐂𝐮𝐫𝐫𝐞𝐧𝐭𝐥𝐲, 𝐭𝐡𝐞𝐫𝐞 𝐚𝐫𝐞 𝐧𝐨 𝐛𝐚𝐧𝐧𝐞𝐝 𝐮𝐬𝐞𝐫𝐬!"));
                }

                message.reply(toBold(`🔄 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 ${bannedUsers.length} 𝐛𝐚𝐧𝐧𝐞𝐝 𝐮𝐬𝐞𝐫𝐬...`));

                const list = [];
                for (const uid of bannedUsers) {
                    const name = await Users.getNameUser(uid) || "Unknown User";
                    list.push({ id: uid, name: name });
                }

                this.sendPage(message, threadID, list, 1, "user", senderID);

            } else {
                // Help Message
                return message.reply(toBold(
                    "⚠️ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐅𝐨𝐫𝐦𝐚𝐭!\n\n" +
                    "🔹 𝐔𝐬𝐚𝐠𝐞:\n" +
                    "• listban user  → 𝐒𝐡𝐨𝐰 𝐛𝐚𝐧𝐧𝐞𝐝 𝐮𝐬𝐞𝐫𝐬\n" +
                    "• listban thread → 𝐒𝐡𝐨𝐰 𝐛𝐚𝐧𝐧𝐞𝐝 𝐠𝐫𝐨𝐮𝐩𝐬"
                ));
            }

        } catch (error) {
            console.error("Listban Error:", error);
            message.reply(toBold("❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝."));
        }
    },

    onReply: async function ({ event, message, Reply, Users, Threads, api }) {
        try {
            const { senderID, body } = event;
            if (senderID !== Reply.author) return; // Strict Author Check

            const { list, page, type } = Reply;
            const input = body.toLowerCase().trim();

            // --- 𝟑. 𝐏𝐚𝐠𝐢𝐧𝐚𝐭𝐢𝐨𝐧 𝐋𝐨𝐠𝐢𝐜 ---
            if (input === "next") {
                const totalPages = Math.ceil(list.length / 10);
                if (page >= totalPages) return message.reply(toBold("❌ 𝐍𝐨 𝐦𝐨𝐫𝐞 𝐩𝐚𝐠𝐞𝐬."));
                return this.sendPage(message, event.threadID, list, page + 1, type, senderID);
            }

            if (input === "prev") {
                if (page <= 1) return message.reply(toBold("❌ 𝐀𝐥𝐫𝐞𝐚𝐝𝐲 𝐨𝐧 𝐟𝐢𝐫𝐬𝐭 𝐩𝐚𝐠𝐞."));
                return this.sendPage(message, event.threadID, list, page - 1, type, senderID);
            }

            // --- 𝟒. 𝐔𝐧𝐛𝐚𝐧 𝐋𝐨𝐠𝐢𝐜 ---
            const index = parseInt(input);
            if (isNaN(index)) return message.reply(toBold("❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐧𝐮𝐦𝐛𝐞𝐫."));

            // Calculate actual index from pagination
            const actualIndex = (page - 1) * 10 + (index - 1);
            
            if (actualIndex < 0 || actualIndex >= list.length) {
                return message.reply(toBold("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐬𝐞𝐥𝐞𝐜𝐭𝐢𝐨𝐧."));
            }

            const target = list[actualIndex];
            
            if (type === "thread") {
                // Unban Thread
                const threadData = (await Threads.getData(target.id)).data || {};
                threadData.banned = false;
                threadData.reason = null;
                threadData.dateAdded = null;
                
                await Threads.setData(target.id, { data: threadData });
                global.data.threadBanned.delete(target.id);

                message.reply(toBold(`✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐔𝐧𝐛𝐚𝐧𝐧𝐞𝐝 𝐆𝐫𝐨𝐮𝐩:\n📛 ${target.name}\n🆔 ${target.id}`));

            } else {
                // Unban User
                const userData = (await Users.getData(target.id)).data || {};
                userData.banned = false;
                userData.reason = null;
                userData.dateAdded = null;

                await Users.setData(target.id, { data: userData });
                global.data.userBanned.delete(target.id);

                message.reply(toBold(`✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐔𝐧𝐛𝐚𝐧𝐧𝐞𝐝 𝐔𝐬𝐞𝐫:\n👤 ${target.name}\n🆔 ${target.id}`));
            }

        } catch (error) {
            console.error("Listban Reply Error:", error);
            message.reply(toBold("❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐩𝐫𝐨𝐜𝐞𝐬𝐬 𝐫𝐞𝐪𝐮𝐞𝐬𝐭."));
        }
    },

    // --- 𝟓. 𝐇𝐞𝐥𝐩𝐞𝐫: 𝐒𝐞𝐧𝐝 𝐏𝐚𝐠𝐞 ---
    sendPage: function (message, threadID, list, page, type, author) {
        const perPage = 10;
        const totalPages = Math.ceil(list.length / perPage);
        const start = (page - 1) * perPage;
        const end = Math.min(start + perPage, list.length);
        const pageItems = list.slice(start, end);

        const title = type === "thread" ? "🚫 𝐁𝐚𝐧𝐧𝐞𝐝 𝐆𝐫𝐨𝐮𝐩𝐬" : "🚫 𝐁𝐚𝐧𝐧𝐞𝐝 𝐔𝐬𝐞𝐫𝐬";
        
        let msg = toBold(`${title}\n📄 𝐏𝐚𝐠𝐞: ${page}/${totalPages}\n\n`);

        pageItems.forEach((item, i) => {
            // Display Number (1-10 relative to page)
            msg += toBold(`${i + 1}. ${item.name}\n🆔 ${item.id}\n\n`);
        });

        msg += toBold("👉 𝐑𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐧𝐮𝐦𝐛𝐞𝐫 𝐭𝐨 𝐔𝐍𝐁𝐀𝐍\n👉 𝐑𝐞𝐩𝐥𝐲 '𝐧𝐞𝐱𝐭' 𝐨𝐫 '𝐩𝐫𝐞𝐯' 𝐭𝐨 𝐧𝐚𝐯𝐢𝐠𝐚𝐭𝐞");

        message.reply(msg, (err, info) => {
            if (err) return;
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: author,
                list: list,
                page: page,
                type: type
            });
        });
    }
};
