module.exports = {
    config: {
        name: "listfriend",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 2,
        category: "system",
        shortDescription: {
            en: "𝖵𝗂𝖾𝗐 𝖺𝗇𝖽 𝗆𝖺𝗇𝖺𝗀𝖾 𝖿𝗋𝗂𝖾𝗇𝖽 𝗅𝗂𝗌𝗍"
        },
        longDescription: {
            en: "𝖣𝗂𝗌𝗉𝗅𝖺𝗒𝗌 𝗒𝗈𝗎𝗋 𝖿𝗋𝗂𝖾𝗇𝖽 𝗅𝗂𝗌𝗍 𝗐𝗂𝗍𝗁 𝖽𝖾𝗍𝖺𝗂𝗅𝗌 𝖺𝗇𝖽 𝖺𝗅𝗅𝗈𝗐𝗌 𝖽𝖾𝗅𝖾𝗍𝗂𝗇𝗀 𝖿𝗋𝗂𝖾𝗇𝖽𝗌"
        },
        guide: {
            en: "{p}listfriend [𝗉𝖺𝗀𝖾]"
        },
        dependencies: {
            "axios": ""
        }
    },

    languages: {
        "en": {
            "listTitle": "🎭 𝖸𝗈𝗎𝗋 𝖥𝗋𝗂𝖾𝗇𝖽 𝖫𝗂𝗌𝗍: %1 𝖥𝗋𝗂𝖾𝗇𝖽𝗌 🎭",
            "listFormat": "┏⊰ 𝖭𝗈.%1\n┣⊰ 𝖭𝖺𝗆𝖾: %2\n┣⊰ 𝖴𝖨𝖣: %3\n┣⊰ 𝖦𝖾𝗇𝖽𝖾𝗋: %4\n┣⊰ 𝖵𝖺𝗇𝗂𝗍𝗒: %5\n┗⊰ 𝖯𝗋𝗈𝖿𝗂𝗅𝖾: %6",
            "pageInfo": "📄 𝖯𝖺𝗀𝖾 %1/%2",
            "instructions": "🎭 𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗇𝗎𝗆𝖻𝖾𝗋𝗌 (1-10) 𝗍𝗈 𝖽𝖾𝗅𝖾𝗍𝖾 𝖿𝗋𝗂𝖾𝗇𝖽𝗌\n🔢 𝖬𝗎𝗅𝗍𝗂𝗉𝗅𝖾 𝗇𝗎𝗆𝖻𝖾𝗋𝗌 𝗌𝖾𝗉𝖺𝗋𝖺𝗍𝖾𝖽 𝖻𝗒 𝗌𝗉𝖺𝖼𝖾",
            "deleteSuccess": "🗑️ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖣𝖾𝗅𝖾𝗍𝖾𝖽 𝖥𝗋𝗂𝖾𝗇𝖽𝗌 🗑️\n\n%1",
            "noFriends": "❌ 𝖸𝗈𝗎 𝖽𝗈𝗇'𝗍 𝗁𝖺𝗏𝖾 𝖺𝗇𝗒 𝖿𝗋𝗂𝖾𝗇𝖽𝗌 𝗂𝗇 𝗒𝗈𝗎𝗋 𝗅𝗂𝗌𝗍",
            "invalidPage": "❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗉𝖺𝗀𝖾 𝗇𝗎𝗆𝖻𝖾𝗋",
            "deleteError": "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝖾𝗅𝖾𝗍𝖾 𝖿𝗋𝗂𝖾𝗇𝖽"
        }
    },

    onReply: async function({ api, event, Reply }) {
        try {
            // Validate reply author
            if (event.senderID != Reply.author) return;
            
            const { threadID, messageID, body } = event;
            const { listFriend, nameUser, urlUser, uidUser, messageID: replyID } = Reply;

            // Parse and validate numbers
            const numbers = body.split(" ")
                .map(n => parseInt(n.trim()))
                .filter(n => !isNaN(n) && n > 0 && n <= listFriend.length);

            if (numbers.length === 0) {
                return api.sendMessage("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗇𝗎𝗆𝖻𝖾𝗋𝗌 𝗉𝗋𝗈𝗏𝗂𝖽𝖾𝖽", threadID, messageID);
            }

            let deleteReport = "";
            let successCount = 0;
            let failCount = 0;

            // Delete friends one by one
            for (const num of numbers) {
                const index = num - 1;
                if (index < 0 || index >= listFriend.length) continue;
                
                try {
                    await api.removeFriend(uidUser[index]);
                    deleteReport += `✅ 𝖣𝖾𝗅𝖾𝗍𝖾𝖽: ${nameUser[index]}\n🔗 𝖫𝗂𝗇𝗄: ${urlUser[index]}\n\n`;
                    successCount++;
                    
                    // Small delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                } catch (error) {
                    console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝖾𝗅𝖾𝗍𝖾 ${nameUser[index]}:`, error);
                    deleteReport += `❌ 𝖥𝖺𝗂𝗅𝖾𝖽: ${nameUser[index]}\n`;
                    failCount++;
                }
            }

            const summary = `📊 𝖱𝖾𝗌𝗎𝗅𝗍: ${successCount} 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅, ${failCount} 𝖿𝖺𝗂𝗅𝖾𝖽\n\n`;
            
            api.sendMessage(summary + deleteReport, threadID, 
                (err) => {
                    if (!err) {
                        // Try to unsend the original message
                        try {
                            api.unsendMessage(replyID);
                        } catch (unsendError) {
                            console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗋𝖾𝗉𝗅𝗒 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError);
                        }
                    }
                }, 
                messageID
            );

        } catch (error) {
            console.error("💥 𝖫𝗂𝗌𝗍𝖿𝗋𝗂𝖾𝗇𝖽 𝗋𝖾𝗉𝗅𝗒 𝖾𝗋𝗋𝗈𝗋:", error);
            api.sendMessage("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝗋𝖾𝗊𝗎𝖾𝗌𝗍", event.threadID, event.messageID);
        }
    },

    onStart: async function({ api, event, args }) {
        const { threadID, messageID, senderID } = event;
        
        try {
            // Dependency check
            let axiosAvailable = true;
            try {
                require("axios");
            } catch (e) {
                axiosAvailable = false;
            }

            if (!axiosAvailable) {
                return api.sendMessage("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.", threadID, messageID);
            }

            // Get friends list
            let listFriend;
            try {
                const friendsData = await api.getFriendsList();
                listFriend = friendsData.map(friend => ({
                    name: friend.fullName || "❌ 𝖭𝖺𝗆𝖾 𝖭𝗈𝗍 𝖠𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾",
                    uid: friend.userID,
                    gender: friend.gender == 1 ? "♀️ 𝖥𝖾𝗆𝖺𝗅𝖾" : friend.gender == 2 ? "♂️ 𝖬𝖺𝗅𝖾" : "❓ 𝖴𝗇𝗄𝗇𝗈𝗐𝗇",
                    vanity: friend.vanity || "❌ 𝖭𝗈 𝖵𝖺𝗇𝗂𝗍𝗒",
                    profileUrl: friend.profileUrl || `https://facebook.com/${friend.userID}`
                }));
            } catch (friendError) {
                console.error("𝖤𝗋𝗋𝗈𝗋 𝖿𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝖿𝗋𝗂𝖾𝗇𝖽𝗌 𝗅𝗂𝗌𝗍:", friendError);
                return api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝖿𝗋𝗂𝖾𝗇𝖽𝗌 𝗅𝗂𝗌𝗍", threadID, messageID);
            }

            // Check if user has friends
            if (!listFriend || listFriend.length === 0) {
                return api.sendMessage(this.languages.en.noFriends, threadID, messageID);
            }

            // Parse page number
            const page = Math.max(parseInt(args[0]) || 1, 1);
            const limit = 10;
            const numPage = Math.ceil(listFriend.length / limit);
            
            // Validate page number
            if (page > numPage) {
                return api.sendMessage(this.languages.en.invalidPage, threadID, messageID);
            }

            const startIdx = limit * (page - 1);
            const endIdx = Math.min(startIdx + limit, listFriend.length);

            // Build message
            let msg = `🎭 𝖸𝗈𝗎𝗋 𝖥𝗋𝗂𝖾𝗇𝖽 𝖫𝗂𝗌𝗍: ${listFriend.length} 𝖥𝗋𝗂𝖾𝗇𝖽𝗌 🎭\n\n`;
            
            for (let i = startIdx; i < endIdx; i++) {
                const friend = listFriend[i];
                msg += this.languages.en.listFormat
                    .replace("%1", i + 1)
                    .replace("%2", friend.name)
                    .replace("%3", friend.uid)
                    .replace("%4", friend.gender)
                    .replace("%5", friend.vanity)
                    .replace("%6", friend.profileUrl) + "\n\n";
            }
            
            msg += `📄 𝖯𝖺𝗀𝖾 ${page}/${numPage}\n\n`;
            msg += `🎭 𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗇𝗎𝗆𝖻𝖾𝗋𝗌 (1-10) 𝗍𝗈 𝖽𝖾𝗅𝖾𝗍𝖾 𝖿𝗋𝗂𝖾𝗇𝖽𝗌\n`;
            msg += `🔢 𝖬𝗎𝗅𝗍𝗂𝗉𝗅𝖾 𝗇𝗎𝗆𝖻𝖾𝗋𝗌 𝗌𝖾𝗉𝖺𝗋𝖺𝗍𝖾𝖽 𝖻𝗒 𝗌𝗉𝖺𝖼𝖾`;

            // Send message and set up reply handler
            return api.sendMessage(msg, threadID, (err, info) => {
                if (err) {
                    console.error("𝖤𝗋𝗋𝗈𝗋 𝗌𝖾𝗇𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", err);
                    return;
                }

                // Push to reply handler
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    listFriend: listFriend.slice(startIdx, endIdx),
                    nameUser: listFriend.slice(startIdx, endIdx).map(f => f.name),
                    urlUser: listFriend.slice(startIdx, endIdx).map(f => f.profileUrl),
                    uidUser: listFriend.slice(startIdx, endIdx).map(f => f.uid)
                });

            }, messageID);

        } catch (error) {
            console.error("💥 𝖫𝗂𝗌𝗍𝖿𝗋𝗂𝖾𝗇𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            return api.sendMessage("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝖿𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝖿𝗋𝗂𝖾𝗇𝖽 𝗅𝗂𝗌𝗍", threadID, messageID);
        }
    }
};
