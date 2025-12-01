const axios = require("axios");

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
        name: "friends",
        aliases: [],
        version: "2.0.0",
        author: "Asif Mahmud", // Modified by AI
        countDown: 5,
        role: 2, // Admin Only
        category: "admin",
        shortDescription: {
            en: "𝐌𝐚𝐧𝐚𝐠𝐞 𝐅𝐫𝐢𝐞𝐧𝐝𝐬 & 𝐑𝐞𝐪𝐮𝐞𝐬𝐭𝐬"
        },
        longDescription: {
            en: "𝐕𝐢𝐞𝐰/𝐑𝐞𝐦𝐨𝐯𝐞 𝐅𝐫𝐢𝐞𝐧𝐝𝐬 𝐚𝐧𝐝 𝐀𝐜𝐜𝐞𝐩𝐭/𝐃𝐞𝐥𝐞𝐭𝐞 𝐅𝐫𝐢𝐞𝐧𝐝 𝐑𝐞𝐪𝐮𝐞𝐬𝐭𝐬 𝐰𝐢𝐭𝐡 𝐩𝐚𝐠𝐢𝐧𝐚𝐭𝐢𝐨𝐧."
        },
        guide: {
            en: "{p}friends"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ api, event, args }) {
        const { threadID, senderID } = event;
        
        try {
            // --- 𝐌𝐚𝐢𝐧 𝐌𝐞𝐧𝐮 ---
            const msg = toBold(
                "👋 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐭𝐨 𝐅𝐫𝐢𝐞𝐧𝐝 𝐌𝐚𝐧𝐚𝐠𝐞𝐫\n\n" +
                "𝟏. 𝐕𝐢𝐞𝐰 𝐅𝐫𝐢𝐞𝐧𝐝 𝐋𝐢𝐬𝐭 (𝐑𝐞𝐦𝐨𝐯𝐞)\n" +
                "𝟐. 𝐕𝐢𝐞𝐰 𝐅𝐫𝐢𝐞𝐧𝐝 𝐑𝐞𝐪𝐮𝐞𝐬𝐭𝐬 (𝐀𝐜𝐜𝐞𝐩𝐭/𝐃𝐞𝐥𝐞𝐭𝐞)\n\n" +
                "👉 𝐑𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝟏 𝐨𝐫 𝟐 𝐭𝐨 𝐜𝐨𝐧𝐭𝐢𝐧𝐮𝐞."
            );

            return api.sendMessage(msg, threadID, (err, info) => {
                if(err) return;
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    type: "main_menu"
                });
            });

        } catch(e) {
            console.error(e);
            api.sendMessage(toBold("❌ 𝐄𝐫𝐫𝐨𝐫 𝐬𝐭𝐚𝐫𝐭𝐢𝐧𝐠 𝐜𝐨𝐦𝐦𝐚𝐧𝐝."), threadID);
        }
    },

    onReply: async function({ api, event, handleReply }) {
        const { threadID, senderID, body } = event;
        
        // Security Check
        if(senderID !== handleReply.author) return;

        const { type } = handleReply;

        try {
            // ====================================================
            //                 𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔 𝐋𝐎𝐆𝐈𝐂
            // ====================================================
            if (type === "main_menu") {
                if(body === "1") {
                    // --- 𝐅𝐞𝐭𝐜𝐡 𝐅𝐫𝐢𝐞𝐧𝐝𝐬 ---
                    api.sendMessage(toBold("⏳ 𝐅𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐅𝐫𝐢𝐞𝐧𝐝𝐬 𝐋𝐢𝐬𝐭..."), threadID);
                    const friends = await api.getFriendsList();
                    
                    if(!friends || friends.length === 0) 
                        return api.sendMessage(toBold("❌ 𝐘𝐨𝐮 𝐡𝐚𝐯𝐞 𝐧𝐨 𝐟𝐫𝐢𝐞𝐧𝐝𝐬."), threadID);
                    
                    const list = friends.map(f => ({
                        name: f.fullName || "Unknown",
                        uid: f.userID,
                        gender: f.gender || "Unknown",
                        profile: f.profileUrl || `https://www.facebook.com/${f.userID}`
                    }));

                    this.sendPage(api, threadID, list, 1, "friend_list", senderID);
                } 
                else if (body === "2") {
                    // --- 𝐅𝐞𝐭𝐜𝐡 𝐑𝐞𝐪𝐮𝐞𝐬𝐭𝐬 ---
                    api.sendMessage(toBold("⏳ 𝐅𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐅𝐫𝐢𝐞𝐧𝐝 𝐑𝐞𝐪𝐮𝐞𝐬𝐭𝐬..."), threadID);
                    
                    // Note: Depending on FCA version, this might vary. Standard is getFriendRequests
                    try {
                        const requests = await api.getFriendRequests(); 
                        
                        if(!requests || requests.length === 0) 
                            return api.sendMessage(toBold("✅ 𝐍𝐨 𝐩𝐞𝐧𝐝𝐢𝐧𝐠 𝐟𝐫𝐢𝐞𝐧𝐝 𝐫𝐞𝐪𝐮𝐞𝐬𝐭𝐬."), threadID);

                        const list = requests.map(r => ({
                            name: r.fullName || r.name || "Unknown",
                            uid: r.userID || r.senderID,
                            profile: r.profileUrl || `https://www.facebook.com/${r.userID || r.senderID}`
                        }));

                        this.sendPage(api, threadID, list, 1, "request_list", senderID);
                    } catch(err) {
                        console.error(err);
                        api.sendMessage(toBold("❌ 𝐄𝐫𝐫𝐨𝐫: 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐟𝐞𝐭𝐜𝐡 𝐫𝐞𝐪𝐮𝐞𝐬𝐭𝐬."), threadID);
                    }
                }
                else {
                    api.sendMessage(toBold("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐨𝐩𝐭𝐢𝐨𝐧. 𝐑𝐞𝐩𝐥𝐲 𝟏 𝐨𝐫 𝟐."), threadID);
                }
            }

            // ====================================================
            //                 𝐅𝐑𝐈𝐄𝐍𝐃 𝐋𝐈𝐒𝐓 𝐀𝐂𝐓𝐈𝐎𝐍𝐒
            // ====================================================
            else if (type === "friend_list") {
                const list = handleReply.list;
                
                // Pagination
                if (body.toLowerCase() === "next") {
                    if (handleReply.page * 10 >= list.length) return api.sendMessage(toBold("❌ 𝐍𝐨 𝐦𝐨𝐫𝐞 𝐩𝐚𝐠𝐞𝐬."), threadID);
                    return this.sendPage(api, threadID, list, handleReply.page + 1, "friend_list", senderID);
                }
                if (body.toLowerCase() === "prev") {
                     if (handleReply.page <= 1) return api.sendMessage(toBold("❌ 𝐀𝐥𝐫𝐞𝐚𝐝𝐲 𝐨𝐧 𝐟𝐢𝐫𝐬𝐭 𝐩𝐚𝐠𝐞."), threadID);
                    return this.sendPage(api, threadID, list, handleReply.page - 1, "friend_list", senderID);
                }

                // Unfriend Logic
                const indices = this.parseSelection(body, list.length, handleReply.page);
                if(indices.length === 0) return api.sendMessage(toBold("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐬𝐞𝐥𝐞𝐜𝐭𝐢𝐨𝐧."), threadID);

                let msg = "";
                for(const i of indices) {
                    const target = list[i-1];
                    try {
                        await api.removeFriend(target.uid);
                        msg += toBold(`🗑️ 𝐑𝐞𝐦𝐨𝐯𝐞𝐝: ${target.name}\n`);
                    } catch(e) {
                        msg += toBold(`⚠️ 𝐅𝐚𝐢𝐥𝐞𝐝: ${target.name}\n`);
                    }
                }
                api.sendMessage(msg, threadID);
            }

            // ====================================================
            //                𝐑𝐄𝐐𝐔𝐄𝐒𝐓 𝐋𝐈𝐒𝐓 𝐀𝐂𝐓𝐈𝐎𝐍𝐒
            // ====================================================
            else if (type === "request_list") {
                const list = handleReply.list;

                // Pagination
                if (body.toLowerCase() === "next") {
                    if (handleReply.page * 10 >= list.length) return api.sendMessage(toBold("❌ 𝐍𝐨 𝐦𝐨𝐫𝐞 𝐩𝐚𝐠𝐞𝐬."), threadID);
                    return this.sendPage(api, threadID, list, handleReply.page + 1, "request_list", senderID);
                }
                if (body.toLowerCase() === "prev") {
                    if (handleReply.page <= 1) return api.sendMessage(toBold("❌ 𝐀𝐥𝐫𝐞𝐚𝐝𝐲 𝐨𝐧 𝐟𝐢𝐫𝐬𝐭 𝐩𝐚𝐠𝐞."), threadID);
                    return this.sendPage(api, threadID, list, handleReply.page - 1, "request_list", senderID);
                }

                // Logic: "del 1" = Delete, "1" = Accept
                let isDelete = false;
                let cleanBody = body;
                if(body.toLowerCase().startsWith("del")) {
                    isDelete = true;
                    cleanBody = body.substring(3).trim();
                }

                const indices = this.parseSelection(cleanBody, list.length, handleReply.page);
                if(indices.length === 0) return api.sendMessage(toBold("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐬𝐞𝐥𝐞𝐜𝐭𝐢𝐨𝐧."), threadID);

                let msg = "";
                for(const i of indices) {
                    const target = list[i-1];
                    try {
                        if(isDelete) {
                            await api.handleFriendRequest(target.uid, false); // false = Delete
                            msg += toBold(`🗑️ 𝐃𝐞𝐥𝐞𝐭𝐞𝐝 𝐑𝐞𝐪: ${target.name}\n`);
                        } else {
                            await api.handleFriendRequest(target.uid, true); // true = Confirm
                            msg += toBold(`✅ 𝐀𝐜𝐜𝐞𝐩𝐭𝐞𝐝: ${target.name}\n`);
                        }
                    } catch(e) {
                         msg += toBold(`⚠️ 𝐄𝐫𝐫𝐨𝐫: ${target.name}\n`);
                    }
                }
                api.sendMessage(msg, threadID);
            }

        } catch(e) {
            console.error(e);
            api.sendMessage(toBold("❌ 𝐄𝐫𝐫𝐨𝐫 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐫𝐞𝐪𝐮𝐞𝐬𝐭."), threadID);
        }
    },

    // --- 𝐇𝐞𝐥𝐩𝐞𝐫: 𝐒𝐞𝐧𝐝 𝐏𝐚𝐠𝐢𝐧𝐚𝐭𝐞𝐝 𝐋𝐢𝐬𝐭 ---
    sendPage: function(api, threadID, list, page, type, author) {
        const perPage = 10;
        const totalPages = Math.ceil(list.length / perPage);
        
        if(page < 1 || page > totalPages) return;

        const start = (page - 1) * perPage;
        const end = Math.min(start + perPage, list.length);
        const pageItems = list.slice(start, end);

        let title = type === "friend_list" ? "👥 𝐅𝐫𝐢𝐞𝐧𝐝 𝐋𝐢𝐬𝐭" : "📩 𝐅𝐫𝐢𝐞𝐧𝐝 𝐑𝐞𝐪𝐮𝐞𝐬𝐭𝐬";
        let msg = toBold(`${title}\n📄 𝐏𝐚𝐠𝐞 ${page}/${totalPages} | 𝐓𝐨𝐭𝐚𝐥: ${list.length}\n\n`);
        
        pageItems.forEach((item, index) => {
            const displayIndex = start + index + 1; // Global Index
            // We use global index for selection to avoid confusion
            msg += toBold(`${displayIndex}. ${item.name}\n🆔 ${item.uid}\n\n`);
        });

        if(type === "friend_list") {
            msg += toBold("👉 𝐑𝐞𝐩𝐥𝐲 𝐍𝐮𝐦𝐛𝐞𝐫 𝐭𝐨 𝐔𝐧𝐟𝐫𝐢𝐞𝐧𝐝\n👉 '𝐧𝐞𝐱𝐭' / '𝐩𝐫𝐞𝐯' 𝐟𝐨𝐫 𝐩𝐚𝐠𝐞𝐬");
        } else {
            msg += toBold("👉 𝐑𝐞𝐩𝐥𝐲 𝐍𝐮𝐦𝐛𝐞𝐫 𝐭𝐨 𝐀𝐂𝐂𝐄𝐏𝐓\n👉 '𝐝𝐞𝐥 <𝐧𝐮𝐦>' 𝐭𝐨 𝐃𝐄𝐋𝐄𝐓𝐄\n👉 '𝐧𝐞𝐱𝐭' / '𝐩𝐫𝐞𝐯' 𝐟𝐨𝐫 𝐩𝐚𝐠𝐞𝐬");
        }

        api.sendMessage(msg, threadID, (err, info) => {
            if(err) return;
             global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: author,
                type: type,
                list: list,
                page: page
            });
        });
    },

    // --- 𝐇𝐞𝐥𝐩𝐞𝐫: 𝐏𝐚𝐫𝐬𝐞 𝐍𝐮𝐦𝐛𝐞𝐫 𝐒𝐞𝐥𝐞𝐜𝐭𝐢𝐨𝐧 ---
    parseSelection: function(body, max, page) {
         try {
            const indices = new Set();
            const parts = body.split(/[\s,]+/);
            
            for(const part of parts) {
                if(part.includes('-')) {
                    const [s, e] = part.split('-').map(Number);
                    if(!isNaN(s) && !isNaN(e)) {
                        for(let i=s; i<=e; i++) indices.add(i);
                    }
                } else {
                    const n = Number(part);
                    if(!isNaN(n)) indices.add(n);
                }
            }
            // Filter numbers to be within valid range
            return Array.from(indices).filter(i => i > 0 && i <= max);
        } catch(e) { return []; }
    }
};
