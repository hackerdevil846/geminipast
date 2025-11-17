const axios = require("axios");

module.exports = {
    config: {
        name: "friends",
        aliases: ["friendlist", "managefriends"],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 2,
        category: "admin",
        shortDescription: {
            en: "List friends and manage your Facebook friends list"
        },
        longDescription: {
            en: "Manage your Facebook friends list - view and remove friends"
        },
        guide: {
            en: "{p}friends [page number]"
        },
        dependencies: {
            "axios": ""
        }
    },

    onReply: async function({ api, event, handleReply }) {
        const { threadID, senderID } = event;

        try {
            if (senderID.toString() !== handleReply.author) return;

            let msg = "";
            let processed = 0;
            const { uidUser, nameUser, urlUser } = handleReply;

            // Handle "all"
            if (event.body.toLowerCase() === "all") {
                for (let i = 0; i < uidUser.length; i++) {
                    try {
                        await api.removeFriend(uidUser[i]);
                        msg += `👤 ${nameUser[i]}\n🔗 ${urlUser[i]}\n\n`;
                        processed++;
                    } catch (e) {
                        console.error(`Failed to remove ${nameUser[i]}:`, e);
                    }
                }
            } else {
                // Handle number selections
                const selections = event.body.split(',')
                    .flatMap(item => {
                        if (item.includes('-')) {
                            const [start, end] = item.split('-').map(Number);
                            if (start > end) return [];
                            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
                        }
                        return Number(item.trim());
                    })
                    .filter(num => !isNaN(num) && num > 0 && num <= uidUser.length);

                const uniqueSelections = [...new Set(selections)];

                for (const num of uniqueSelections) {
                    try {
                        await api.removeFriend(uidUser[num - 1]);
                        msg += `👤 ${nameUser[num - 1]}\n🔗 ${urlUser[num - 1]}\n\n`;
                        processed++;
                    } catch (e) {
                        console.error(`Failed to remove ${nameUser[num - 1]}:`, e);
                    }
                }
            }

            // Send result
            if (processed > 0) {
                api.sendMessage(
                    `✅ Successfully removed ${processed} friend(s):\n\n${msg}`,
                    threadID,
                    () => api.unsendMessage(handleReply.messageID)
                );
            } else {
                api.sendMessage("❌ No valid friends were selected for removal.", threadID);
            }
        } catch (err) {
            console.error("Friends reply error:", err);
            api.sendMessage("⚠️ An error occurred while processing your request.", threadID);
        }
    },

    onStart: async function({ api, event, args }) {
        const { threadID, senderID } = event;

        try {
            // Dependency check
            try {
                require("axios");
            } catch (e) {
                return api.sendMessage("❌ Missing dependency: axios", threadID);
            }

            // Fetch friends
            const friendsList = await api.getFriendsList();
            const friendCount = friendsList.length;

            if (friendCount === 0) {
                return api.sendMessage("📭 Your Facebook friends list is empty.", threadID);
            }

            // Format data
            const formattedFriends = friendsList.map(friend => ({
                name: friend.fullName || "Unknown Name",
                uid: friend.userID,
                gender: friend.gender || "Unknown",
                vanity: friend.vanity || "No Vanity",
                profileUrl: friend.profileUrl || "https://www.facebook.com"
            }));

            // Pagination
            const page = Math.max(1, parseInt(args[0]) || 1);
            const perPage = 10;
            const totalPages = Math.ceil(formattedFriends.length / perPage);

            if (page > totalPages) {
                return api.sendMessage(`⚠️ Invalid page number! Only ${totalPages} pages available.`, threadID);
            }

            let message = `👥 You have ${friendCount} friends\n📄 Page ${page}/${totalPages}\n\n`;
            const startIndex = (page - 1) * perPage;
            const endIndex = Math.min(page * perPage, formattedFriends.length);

            for (let i = startIndex; i < endIndex; i++) {
                const friend = formattedFriends[i];
                const num = i + 1;
                message += `🔢 ${num}. ${friend.name}\n🆔 ID: ${friend.uid}\n🌕 Gender: ${friend.gender}\n🎭 Vanity: ${friend.vanity}\n🔗 Profile: ${friend.profileUrl}\n\n`;
            }

            message += `📌 Removal Instructions:\n`
                + `• Single: 1, 3, 5\n`
                + `• Range: 1-5\n`
                + `• Combined: 1, 3-5, 7\n`
                + `• All: type "all"\n\n`
                + `✍️ Reply to this message with your selection`;

            // Store reply data
            const nameUser = formattedFriends.map(f => f.name);
            const urlUser = formattedFriends.map(f => f.profileUrl);
            const uidUser = formattedFriends.map(f => f.uid);

            return api.sendMessage(message, threadID, (err, info) => {
                if (err) {
                    console.error("Failed to send friends list:", err);
                    return api.sendMessage("❌ Failed to display friends list.", threadID);
                }

                global.client.handleReply.push({
                    commandName: this.config.name,
                    author: senderID,
                    messageID: info.messageID,
                    nameUser,
                    urlUser,
                    uidUser,
                    type: 'reply'
                });
            });

        } catch (err) {
            console.error("Friends command error:", err);
            return api.sendMessage("⚠️ An error occurred while fetching your friends list.", threadID);
        }
    }
};
