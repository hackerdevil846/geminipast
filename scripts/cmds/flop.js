module.exports = {
    config: {
        name: "flop",
        aliases: ["nuke", "cleargroup"],
        version: "1.0.1",
        author: "𝗔𝘀𝗶𝗳 𝗠𝗮𝗵𝗺𝘂𝗱",
        countDown: 1,
        role: 1,
        category: "group",
        shortDescription: {
            en: "🔄 𝐑𝐄𝐌𝐎𝐕𝐄 𝐀𝐋𝐋 𝐆𝐑𝐎𝐔𝐏 𝐌𝐄𝐌𝐁𝐄𝐑𝐒 𝐀𝐍𝐃 𝐁𝐎𝐓 𝐋𝐄𝐀𝐕𝐄𝐒 𝐆𝐑𝐎𝐔𝐏"
        },
        longDescription: {
            en: "𝐑𝐄𝐌𝐎𝐕𝐄𝐒 𝐀𝐋𝐋 𝐌𝐄𝐌𝐁𝐄𝐑𝐒 𝐅𝐑𝐎𝐌 𝐓𝐇𝐄 𝐆𝐑𝐎𝐔𝐏 𝐀𝐍𝐃 𝐓𝐇𝐄𝐍 𝐓𝐇𝐄 𝐁𝐎𝐓 𝐋𝐄𝐀𝐕𝐄𝐒"
        },
        guide: {
            en: "{p}flop"
        },
        dependencies: {}
    },

    onStart: async function({ message, event, api }) {
        const { threadID, messageID } = event;

        try {
            // Fetch thread info
            const threadInfo = await api.getThreadInfo(threadID);
            const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
            const botID = api.getCurrentUserID();

            // Check if bot is admin
            if (!adminIDs.includes(botID)) {
                return message.reply(
                    "❌ 𝐁𝐎𝐓 𝐌𝐔𝐒𝐓 𝐁𝐄 𝐆𝐑𝐎𝐔𝐏 𝐀𝐃𝐌𝐈𝐍 𝐓𝐎 𝐔𝐒𝐄 𝐓𝐇𝐈𝐒 𝐂𝐎𝐌𝐌𝐀𝐍𝐃!",
                    threadID,
                    messageID
                );
            }

            const participantIDs = threadInfo.participantIDs;

            // Notify start
            await message.reply(
                "🌀 𝐒𝐓𝐀𝐑𝐓𝐈𝐍𝐆 𝐆𝐑𝐎𝐔𝐏 𝐅𝐋𝐎𝐏 𝐎𝐏𝐄𝐑𝐀𝐓𝐈𝐎𝐍...",
                threadID,
                messageID
            );

            // Remove each member except bot
            for (const userID of participantIDs) {
                if (userID !== botID) {
                    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
                    await api.removeUserFromGroup(userID, threadID);
                }
            }

            // Notify completion
            await message.reply(
                "✅ 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 𝐑𝐄𝐌𝐎𝐕𝐄𝐃 𝐀𝐋𝐋 𝐌𝐄𝐌𝐁𝐄𝐑𝐒! 𝐁𝐎𝐓 𝐖𝐈𝐋𝐋 𝐍𝐎𝐖 𝐋𝐄𝐀𝐕𝐄 𝐓𝐇𝐄 𝐆𝐑𝐎𝐔𝐏.",
                threadID
            );

            await new Promise(resolve => setTimeout(resolve, 2000));
            await api.removeUserFromGroup(botID, threadID);

        } catch (error) {
            console.error("𝐅𝐋𝐎𝐏 𝐄𝐑𝐑𝐎𝐑:", error);
            await message.reply(
                `❌ 𝐄𝐑𝐑𝐎𝐑 𝐎𝐂𝐂𝐔𝐑𝐑𝐄𝐃 𝐖𝐇𝐈𝐋𝐄 𝐅𝐋𝐎𝐏𝐈𝐍𝐆 𝐆𝐑𝐎𝐔𝐏: ${error.message}`,
                threadID,
                messageID
            );
        }
    }
};
