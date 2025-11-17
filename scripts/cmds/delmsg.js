module.exports = {
    config: {
        name: "delmsg",
        aliases: ["clearchat", "deleteall"],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 0,
        role: 2,
        category: "system",
        shortDescription: {
            en: "Delete all messages or group messages"
        },
        longDescription: {
            en: "Delete all messages in inbox or group chats"
        },
        guide: {
            en: "{p}delmsg [thread/all]"
        }
    },

    onStart: async function({ message, args, api, event }) {
        try {
            if (args[0] == "all") {
                const threadList = await api.getThreadList(1000, null, ["INBOX"]);
                let deletedCount = 0;
                
                for (const item of threadList) {
                    if (item.threadID !== event.threadID) {
                        try {
                            await api.deleteThread(item.threadID);
                            deletedCount++;
                        } catch (error) {
                            console.error(`Failed to delete thread ${item.threadID}:`, error);
                        }
                    }
                }
                message.reply(`✅ Successfully deleted ${deletedCount} threads!`);
            } else {
                const threadList = await api.getThreadList(1000, null, ["INBOX"]);
                let deletedCount = 0;
                
                for (const item of threadList) {
                    if (item.isGroup && item.threadID !== event.threadID) {
                        try {
                            await api.deleteThread(item.threadID);
                            deletedCount++;
                        } catch (error) {
                            console.error(`Failed to delete group ${item.threadID}:`, error);
                        }
                    }
                }
                message.reply(`✅ Successfully deleted ${deletedCount} group threads!`);
            }
        } catch (error) {
            console.error("Delete messages error:", error);
            message.reply("❌ An error occurred while deleting messages.");
        }
    }
};
