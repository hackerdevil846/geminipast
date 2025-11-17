module.exports = {
    config: {
        name: "antirobbery",
        aliases: [],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 1,
        category: "admin",
        shortDescription: {
            en: "𝖯𝗋𝖾𝗏𝖾𝗇𝗍 𝖼𝗁𝖺𝗇𝗀𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉 𝖺𝖽𝗆𝗂𝗇𝗂𝗌𝗍𝗋𝖺𝗍𝗈𝗋𝗌"
        },
        longDescription: {
            en: "𝖯𝗋𝗈𝗍𝖾𝖼𝗍 𝗀𝗋𝗈𝗎𝗉 𝖿𝗋𝗈𝗆 𝗎𝗇𝖺𝗎𝗍𝗁𝗈𝗋𝗂𝗓𝖾𝖽 𝖺𝖽𝗆𝗂𝗇 𝖼𝗁𝖺𝗇𝗀𝖾𝗌"
        },
        guide: {
            en: "{p}antirobbery"
        },
        dependencies: {
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, threadsData, api }) {
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

            try {
                // Get thread info to check admin status
                const threadInfo = await api.getThreadInfo(threadID);
                const botID = api.getCurrentUserID();
                
                // Check if bot is admin
                const isBotAdmin = threadInfo.adminIDs?.some(admin => admin.id === botID);
                if (!isBotAdmin) {
                    return message.reply("❌ 𝖡𝗈𝗍 𝗇𝖾𝖾𝖽𝗌 𝖺𝖽𝗆𝗂𝗇 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌 𝗍𝗈 𝗆𝖺𝗇𝖺𝗀𝖾 𝖺𝗇𝗍𝗂𝗋𝗈𝖻𝖻𝖾𝗋𝗒 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌");
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

                // Initialize data object if it doesn't exist
                if (!threadData.data) {
                    threadData.data = {};
                }

                const currentStatus = threadData.data.guard || false;
                
                // Toggle the guard setting
                const newStatus = !currentStatus;
                threadData.data.guard = newStatus;
                
                // Save the settings with error handling
                try {
                    await threadsData.set(threadID, threadData);
                    console.log(`✅ 𝖠𝗇𝗍𝗂𝗋𝗈𝖻𝖻𝖾𝗋𝗒 ${newStatus ? '𝖾𝗇𝖺𝖻𝗅𝖾𝖽' : '𝖽𝗂𝗌𝖺𝖻𝗅𝖾𝖽'} 𝖿𝗈𝗋 𝗍𝗁𝗋𝖾𝖺𝖽 ${threadID}`);
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

                const statusMessage = newStatus ? 
                    "✅ 𝖠𝗇𝗍𝗂-𝖱𝗈𝖻𝖻𝖾𝗋𝗒 𝗌𝗒𝗌𝗍𝖾𝗆 𝖺𝖼𝗍𝗂𝗏𝖺𝗍𝖾𝖽\n\n🛡️ 𝖦𝗋𝗈𝗎𝗉 𝗐𝗂𝗅𝗅 𝗇𝗈𝗐 𝖻𝖾 𝗉𝗋𝗈𝗍𝖾𝖼𝗍𝖾𝖽 𝖿𝗋𝗈𝗆 𝗎𝗇𝖺𝗎𝗍𝗁𝗈𝗋𝗂𝗓𝖾𝖽 𝖺𝖽𝗆𝗂𝗇 𝖼𝗁𝖺𝗇𝗀𝖾𝗌" :
                    "✅ 𝖠𝗇𝗍𝗂-𝖱𝗈𝖻𝖻𝖾𝗋𝗒 𝗌𝗒𝗌𝗍𝖾𝗆 𝖽𝖾𝖺𝖼𝗍𝗂𝗏𝖺𝗍𝖾𝖽\n\n⚠️ 𝖦𝗋𝗈𝗎𝗉 𝗉𝗋𝗈𝗍𝖾𝖼𝗍𝗂𝗈𝗇 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖽𝗂𝗌𝖺𝖻𝗅𝖾𝖽";

                return message.reply(statusMessage);

            } catch (apiError) {
                console.error("𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", apiError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖼𝖼𝖾𝗌𝗌 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

        } catch (error) {
            console.error("💥 𝖠𝗇𝗍𝗂𝗋𝗈𝖻𝖻𝖾𝗋𝗒 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('threadsData')) {
                errorMessage = "❌ 𝖣𝖺𝗍𝖺𝗌𝗍𝗈𝗋𝖾 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗍𝗁𝖾 𝖻𝗈𝗍'𝗌 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗍𝗂𝗈𝗇.";
            } else if (error.message.includes('permission')) {
                errorMessage = "❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝖻𝗈𝗍 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌.";
            }
            
            await message.reply(errorMessage);
        }
    },

    onEvent: async function({ event, threadsData, api }) {
        try {
            // Only process admin change events
            if (event.logMessageType !== "log:thread-admins") {
                return;
            }

            const { threadID, logMessageData } = event;
            const botID = api.getCurrentUserID();

            // Get thread data to check if antirobbery is enabled
            let threadData;
            try {
                threadData = await threadsData.get(threadID) || {};
            } catch (dataError) {
                console.error("𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝖽𝖺𝗍𝖺:", dataError);
                return;
            }

            const isAntiRobberyEnabled = threadData.data?.guard;
            
            if (!isAntiRobberyEnabled) {
                return;
            }

            console.log(`🛡️ 𝖠𝗇𝗍𝗂𝗋𝗈𝖻𝖻𝖾𝗋𝗒 𝗌𝗒𝗌𝗍𝖾𝗆 𝖽𝖾𝗍𝖾𝖼𝗍𝖾𝖽 𝖺𝖽𝗆𝗂𝗇 𝖼𝗁𝖺𝗇𝗀𝖾 𝗂𝗇 𝗀𝗋𝗈𝗎𝗉 ${threadID}`);

            try {
                // Check if bot is still admin
                const threadInfo = await api.getThreadInfo(threadID);
                const isBotAdmin = threadInfo.adminIDs?.some(admin => admin.id === botID);
                
                if (!isBotAdmin) {
                    console.log("❌ 𝖡𝗈𝗍 𝗂𝗌 𝗇𝗈 𝗅𝗈𝗇𝗀𝖾𝗋 𝖺𝖽𝗆𝗂𝗇, 𝖼𝖺𝗇𝗇𝗈𝗍 𝗉𝗋𝗈𝗍𝖾𝖼𝗍 𝗀𝗋𝗈𝗎𝗉");
                    return;
                }

                // Check if the change was removing bot as admin
                if (logMessageData && logMessageData.TARGET_ID === botID) {
                    console.log(`⚠️ 𝖡𝗈𝗍 𝗐𝖺𝗌 𝗋𝖾𝗆𝗈𝗏𝖾𝖽 𝖺𝗌 𝖺𝖽𝗆𝗂𝗇, 𝖺𝗍𝗍𝖾𝗆𝗉𝗍𝗂𝗇𝗀 𝗍𝗈 𝗋𝖾𝗌𝗍𝗈𝗋𝖾...`);
                    
                    // Try to re-add bot as admin
                    try {
                        await api.changeAdminStatus(threadID, botID, true);
                        console.log(`✅ 𝖡𝗈𝗍 𝖺𝖽𝗆𝗂𝗇 𝗌𝗍𝖺𝗍𝗎𝗌 𝗋𝖾𝗌𝗍𝗈𝗋𝖾𝖽`);
                        
                        // Send warning message
                        await api.sendMessage(
                            "⚠️ 𝖠𝗇𝗍𝗂-𝖱𝗈𝖻𝖻𝖾𝗋𝗒 𝖲𝗒𝗌𝗍𝖾𝗆 𝖠𝗅𝖾𝗋𝗍!\n\n" +
                            "𝖴𝗇𝖺𝗎𝗍𝗁𝗈𝗋𝗂𝗓𝖾𝖽 𝖺𝖽𝗆𝗂𝗇 𝖼𝗁𝖺𝗇𝗀𝖾 𝖽𝖾𝗍𝖾𝖼𝗍𝖾𝖽!\n" +
                            "𝖡𝗈𝗍 𝖺𝖽𝗆𝗂𝗇 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌 𝗁𝖺𝗏𝖾 𝖻𝖾𝖾𝗇 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗋𝖾𝗌𝗍𝗈𝗋𝖾𝖽.",
                            threadID
                        );
                    } catch (restoreError) {
                        console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗌𝗍𝗈𝗋𝖾 𝖻𝗈𝗍 𝖺𝖽𝗆𝗂𝗇 𝗌𝗍𝖺𝗍𝗎𝗌:`, restoreError);
                    }
                }

            } catch (protectionError) {
                console.error("💥 𝖠𝗇𝗍𝗂𝗋𝗈𝖻𝖻𝖾𝗋𝗒 𝗉𝗋𝗈𝗍𝖾𝖼𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", protectionError);
            }
        } catch (error) {
            console.error("💥 𝖠𝗇𝗍𝗂𝗋𝗈𝖻𝖻𝖾𝗋𝗒 𝖾𝗏𝖾𝗇𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    }
};
