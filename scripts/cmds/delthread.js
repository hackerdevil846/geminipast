module.exports = {
    config: {
        name: "delthread",
        aliases: ["clearthreads", "deletegroups"],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 2,
        category: "system",
        shortDescription: {
            en: "Delete all group threads except current one"
        },
        longDescription: {
            en: "Deletes all group conversations except the currently active one"
        },
        guide: {
            en: "{p}delthread"
        }
    },

    onStart: async function({ message, event, api }) {
        try {
            const threadList = await api.getThreadList(100, null, ["INBOX"]);
            const currentThread = event.threadID;
            
            const deletionPromises = threadList.map(thread => {
                if (thread.isGroup && thread.threadID !== currentThread) {
                    return api.deleteThread(thread.threadID);
                }
            });

            await Promise.all(deletionPromises);
            
            message.reply(`✅ Successfully deleted all group threads!\nExcluded current thread: ${currentThread}`);
            
        } catch (error) {
            console.error("Deletion error:", error);
            message.reply("❌ An error occurred while deleting threads");
        }
    }
};
