module.exports = {
    config: {
        name: "antijoin",
        aliases: [],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 1,
        category: "system",
        shortDescription: {
            en: "𝖳𝗎𝗋𝗇 𝗈𝗇/𝗈𝖿𝖿 𝖺𝗇𝗍𝗂𝗃𝗈𝗂𝗇"
        },
        longDescription: {
            en: "𝖤𝗇𝖺𝖻𝗅𝖾 𝗈𝗋 𝖽𝗂𝗌𝖺𝖻𝗅𝖾 𝖺𝗇𝗍𝗂-𝗃𝗈𝗂𝗇 𝗉𝗋𝗈𝗍𝖾𝖼𝗍𝗂𝗈𝗇 𝖿𝗈𝗋 𝗒𝗈𝗎𝗋 𝗀𝗋𝗈𝗎𝗉"
        },
        guide: {
            en: "{p}antijoin [𝗈𝗇/𝗈𝖿𝖿]"
        },
        dependencies: {
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args, threadsData, api }) {
        try {
            // Dependency check
            let fsAvailable = true;
            try {
                require("fs-extra");
            } catch (e) {
                fsAvailable = false;
            }

            if (!fsAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            const { threadID, senderID } = event;
            
            // Check if user provided argument
            if (!args[0]) {
                return message.reply(
                    "╔════════════════╗\n" +
                    "   𝕬𝖓𝖙𝖎-𝕵𝖔𝖎𝖓 𝕳𝖊𝖑𝖕\n" +
                    "╚════════════════╝\n\n" +
                    "𝖯𝗅𝖾𝖺𝗌𝖾 𝗌𝗉𝖾𝖼𝗂𝖿𝗒 '𝗈𝗇' 𝗈𝗋 '𝗈𝖿𝖿':\n\n" +
                    "• {p}antijoin 𝗈𝗇 - 𝖤𝗇𝖺𝖻𝗅𝖾 𝖺𝗇𝗍𝗂-𝗃𝗈𝗂𝗇\n" +
                    "• {p}antijoin 𝗈𝖿𝖿 - 𝖣𝗂𝗌𝖺𝖻𝗅𝖾 𝖺𝗇𝗍𝗂-𝗃𝗈𝗂𝗇"
                );
            }

            const action = args[0].toLowerCase().trim();
            
            if (action !== 'on' && action !== 'off') {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗈𝗉𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 '𝗈𝗇' 𝗈𝗋 '𝗈𝖿𝖿'");
            }

            try {
                // Get thread info to check admin status
                const threadInfo = await api.getThreadInfo(threadID);
                const botID = api.getCurrentUserID();
                
                // Check if bot is admin
                const isBotAdmin = threadInfo.adminIDs?.some(admin => admin.id === botID);
                if (!isBotAdmin) {
                    return message.reply("❌ 𝖡𝗈𝗍 𝗇𝖾𝖾𝖽𝗌 𝖺𝖽𝗆𝗂𝗇 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌 𝗍𝗈 𝗆𝖺𝗇𝖺𝗀𝖾 𝖺𝗇𝗍𝗂-𝗃𝗈𝗂𝗇 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌");
                }

                // Check if user is admin
                const isUserAdmin = threadInfo.adminIDs?.some(admin => admin.id === senderID);
                if (!isUserAdmin) {
                    return message.reply("❌ 𝖮𝗇𝗅𝗒 𝖺𝖽𝗆𝗂𝗇𝗌 𝖼𝖺𝗇 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽");
                }

                // Get current thread data with error handling
                let threadData;
                try {
                    threadData = await threadsData.get(threadID) || {};
                } catch (dataError) {
                    console.error("𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝖽𝖺𝗍𝖺:", dataError);
                    threadData = {};
                }

                const currentStatus = threadData.antijoin || false;
                
                // Update the setting
                threadData.antijoin = action === 'on';
                
                // Save the updated data
                try {
                    await threadsData.set(threadID, threadData);
                    console.log(`✅ 𝖠𝗇𝗍𝗂𝗃𝗈𝗂𝗇 ${action} 𝖿𝗈𝗋 𝗍𝗁𝗋𝖾𝖺𝖽 ${threadID}`);
                } catch (saveError) {
                    console.error("𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝖽𝖺𝗍𝖺:", saveError);
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                }

                // Update global cache if it exists
                try {
                    if (global.data && global.data.threadData) {
                        global.data.threadData.set(parseInt(threadID), threadData);
                    }
                } catch (cacheError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗉𝖽𝖺𝗍𝖾 𝗀𝗅𝗈𝖻𝖺𝗅 𝖼𝖺𝖼𝗁𝖾:", cacheError);
                }

                const statusMessage = 
                    "╔════════════════╗\n" +
                    "   𝕬𝖓𝖙𝖎-𝕵𝖔𝖎𝖓 𝕾𝖙𝖆𝖙𝖚𝖘\n" +
                    "╚════════════════╝\n\n" +
                    `🔒 𝖲𝗍𝖺𝗍𝗎𝗌: ${action === 'on' ? '✅ 𝖤𝖭𝖠𝖡𝖫𝖤𝖣' : '❌ 𝖣𝖨𝖲𝖠𝖡𝖫𝖤𝖣'}\n\n` +
                    `𝖠𝗇𝗍𝗂-𝗃𝗈𝗂𝗇 𝗉𝗋𝗈𝗍𝖾𝖼𝗍𝗂𝗈𝗇 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 ${action === 'on' ? '𝖾𝗇𝖺𝖻𝗅𝖾𝖽' : '𝖽𝗂𝗌𝖺𝖻𝗅𝖾𝖽'} 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉.`;

                return message.reply(statusMessage);

            } catch (apiError) {
                console.error("𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", apiError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖼𝖼𝖾𝗌𝗌 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

        } catch (error) {
            console.error("💥 𝖠𝗇𝗍𝗂𝗃𝗈𝗂𝗇 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('threadsData')) {
                errorMessage = "❌ 𝖣𝖺𝗍𝖺𝗌𝗍𝗈𝗋𝖾 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗍𝗁𝖾 𝖻𝗈𝗍'𝗌 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗍𝗂𝗈𝗇.";
            } else if (error.message.includes('permission')) {
                errorMessage = "❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝖻𝗈𝗍 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌.";
            }
            
            await message.reply(errorMessage);
        }
    },

    // Handle participant join events
    onEvent: async function({ event, threadsData, api }) {
        try {
            if (event.logMessageType === 'log:subscribe') {
                const { threadID } = event;
                
                // Get thread data
                const threadData = await threadsData.get(threadID) || {};
                
                if (threadData.antijoin) {
                    const botID = api.getCurrentUserID();
                    
                    // Check if bot is admin
                    const threadInfo = await api.getThreadInfo(threadID);
                    const isBotAdmin = threadInfo.adminIDs?.some(admin => admin.id === botID);
                    
                    if (isBotAdmin) {
                        // Get new participants
                        const newParticipants = event.logMessageData.addedParticipants;
                        
                        for (const user of newParticipants) {
                            try {
                                // Remove the user
                                await api.removeUserFromGroup(user.userFbId, threadID);
                                console.log(`🚫 𝖱𝖾𝗆𝗈𝗏𝖾𝖽 𝗎𝗌𝖾𝗋 ${user.userFbId} 𝖿𝗋𝗈𝗆 𝗀𝗋𝗈𝗎𝗉 ${threadID} (𝖺𝗇𝗍𝗂𝗃𝗈𝗂𝗇)`);
                            } catch (removeError) {
                                console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗆𝗈𝗏𝖾 𝗎𝗌𝖾𝗋 ${user.userFbId}:`, removeError);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error("💥 𝖠𝗇𝗍𝗂𝗃𝗈𝗂𝗇 𝖾𝗏𝖾𝗇𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    }
};
