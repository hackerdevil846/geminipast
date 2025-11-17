const chalk = require('chalk');

module.exports = {
    config: {
        name: "join",
        aliases: [],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 2,
        category: "system",
        shortDescription: {
            en: "𝖡𝗈𝗍 𝗃𝗈𝗂𝗇𝗌 𝗎𝗌𝖾𝗋 𝗍𝗈 𝗀𝗋𝗈𝗎𝗉𝗌"
        },
        longDescription: {
            en: "𝖠𝗅𝗅𝗈𝗐𝗌 𝗎𝗌𝖾𝗋𝗌 𝗍𝗈 𝗃𝗈𝗂𝗇 𝖻𝗈𝗍'𝗌 𝗀𝗋𝗈𝗎𝗉𝗌 𝗍𝗁𝗋𝗈𝗎𝗀𝗁 𝖺 𝗅𝗂𝗌𝗍"
        },
        guide: {
            en: "{p}join"
        },
        dependencies: {
            "chalk": ""
        }
    },

    onLoad: function() {
        try {
            require("chalk");
            console.log(chalk.bold.hex("#00c300")("╔════════════════════════════════════════╗"));
            console.log(chalk.bold.hex("#00c300")("│          𝖩𝖮𝖨𝖭 𝖢𝖮𝖬𝖬𝖠𝖭𝖣 𝖫𝖮𝖠𝖣𝖤𝖣          │"));
            console.log(chalk.bold.hex("#00c300")("│       𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽       │"));
            console.log(chalk.bold.hex("#00c300")("╚════════════════════════════════════════╝"));
        } catch (error) {
            console.log("🔧 𝖩𝗈𝗂𝗇 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖫𝗈𝖺𝖽𝖾𝖽 (𝖼𝗁𝖺𝗅𝗄 𝗇𝗈𝗍 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾)");
        }
    },

    onReply: async function({ api, event, Reply, threadsData }) {
        try {
            // Dependency check
            let chalkAvailable = true;
            try {
                require("chalk");
            } catch (e) {
                chalkAvailable = false;
            }

            const { threadID, messageID, senderID, body } = event;
            const { ID, author } = Reply;

            // Validate author
            if (senderID !== author) {
                return api.sendMessage('❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗅𝖾𝗍 𝗍𝗁𝖾 𝗈𝗋𝗂𝗀𝗂𝗇𝖺𝗅 𝗎𝗌𝖾𝗋 𝗌𝖾𝗅𝖾𝖼𝗍 𝖺 𝗀𝗋𝗈𝗎𝗉.', threadID, messageID);
            }

            // Validate input
            if (!body || !parseInt(body)) {
                return api.sendMessage('🔢 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗇𝗎𝗆𝖻𝖾𝗋!', threadID, messageID);
            }

            const selectedIndex = parseInt(body) - 1;
            if (selectedIndex < 0 || selectedIndex >= ID.length) {
                return api.sendMessage("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗌𝖾𝗅𝖾𝖼𝗍𝗂𝗈𝗇 𝗇𝗎𝗆𝖻𝖾𝗋!", threadID, messageID);
            }

            const targetThreadID = ID[selectedIndex];

            try {
                const threadInfo = await threadsData.get(targetThreadID);
                
                if (!threadInfo) {
                    return api.sendMessage("❌ 𝖦𝗋𝗈𝗎𝗉 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽 𝗈𝗋 𝖻𝗈𝗍 𝗇𝗈 𝗅𝗈𝗇𝗀𝖾𝗋 𝗂𝗇 𝗍𝗁𝖺𝗍 𝗀𝗋𝗈𝗎𝗉.", threadID, messageID);
                }

                const { participantIDs, approvalMode, adminIDs, threadName } = threadInfo;

                // Check if user is already in group
                if (participantIDs && participantIDs.includes(senderID)) {
                    return api.sendMessage(`✅ 𝖸𝗈𝗎'𝗋𝖾 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗂𝗇 "${threadName}"!`, threadID, messageID);
                }

                // Check if bot is admin in the target group
                const botID = api.getCurrentUserID();
                const isBotAdmin = adminIDs && adminIDs.some(admin => admin.id === botID);
                
                if (!isBotAdmin) {
                    return api.sendMessage("❌ 𝖡𝗈𝗍 𝗂𝗌 𝗇𝗈𝗍 𝖺𝗇 𝖺𝖽𝗆𝗂𝗇 𝗂𝗇 𝗍𝗁𝖺𝗍 𝗀𝗋𝗈𝗎𝗉. 𝖢𝖺𝗇𝗇𝗈𝗍 𝖺𝖽𝖽 𝗎𝗌𝖾𝗋𝗌.", threadID, messageID);
                }

                // Add user to group
                await api.addUserToGroup(senderID, targetThreadID);

                if (approvalMode) {
                    return api.sendMessage("📩 𝖠𝖽𝖽𝖾𝖽 𝗍𝗈 𝖺𝗉𝗉𝗋𝗈𝗏𝖺𝗅 𝗊𝗎𝖾𝗎𝖾. 𝖶𝖺𝗂𝗍𝗂𝗇𝗀 𝖿𝗈𝗋 𝖺𝖽𝗆𝗂𝗇 𝖺𝗉𝗉𝗋𝗈𝗏𝖺𝗅...", threadID, messageID);
                } else {
                    return api.sendMessage(
                        `✨ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗃𝗈𝗂𝗇𝖾𝖽 "${threadName}"\n` +
                        `💫 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗌𝗉𝖺𝗆 𝖿𝗈𝗅𝖽𝖾𝗋 𝗂𝖿 𝗒𝗈𝗎 𝖽𝗈𝗇'𝗍 𝗌𝖾𝖾 𝗍𝗁𝖾 𝗀𝗋𝗈𝗎𝗉`,
                        threadID, messageID
                    );
                }
            } catch (error) {
                console.error("💥 𝖩𝗈𝗂𝗇 𝖤𝗋𝗋𝗈𝗋:", error);
                
                let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗃𝗈𝗂𝗇 𝗀𝗋𝗈𝗎𝗉.";
                
                if (error.message.includes('not friends')) {
                    errorMessage += "\n❌ 𝖸𝗈𝗎 𝖺𝗋𝖾 𝗇𝗈𝗍 𝖿𝗋𝗂𝖾𝗇𝖽𝗌 𝗐𝗂𝗍𝗁 𝗍𝗁𝖾 𝖻𝗈𝗍.";
                } else if (error.message.includes('block')) {
                    errorMessage += "\n❌ 𝖸𝗈𝗎 𝗁𝖺𝗏𝖾 𝖻𝗅𝗈𝖼𝗄𝖾𝖽 𝗍𝗁𝖾 𝖻𝗈𝗍.";
                } else if (error.message.includes('admin')) {
                    errorMessage += "\n❌ 𝖡𝗈𝗍 𝗇𝖾𝖾𝖽𝗌 𝖺𝖽𝗆𝗂𝗇 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌.";
                }
                
                return api.sendMessage(errorMessage, threadID, messageID);
            }
        } catch (error) {
            console.error("💥 𝖱𝖾𝗉𝗅𝗒 𝖧𝖺𝗇𝖽𝗅𝖾𝗋 𝖤𝗋𝗋𝗈𝗋:", error);
            return api.sendMessage("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.", event.threadID, event.messageID);
        }
    },

    onStart: async function({ api, event, threadsData }) {
        try {
            // Dependency check
            let chalkAvailable = true;
            try {
                require("chalk");
            } catch (e) {
                chalkAvailable = false;
            }

            const { threadID, messageID, senderID } = event;
            
            try {
                const allThreads = await threadsData.getAll();
                const availableThreads = allThreads.filter(thread => 
                    thread && 
                    thread.threadID && 
                    thread.threadInfo && 
                    thread.threadInfo.threadName &&
                    thread.participantIDs &&
                    thread.participantIDs.includes(api.getCurrentUserID())
                );

                if (availableThreads.length === 0) {
                    return api.sendMessage("❌ 𝖭𝗈 𝗀𝗋𝗈𝗎𝗉𝗌 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝗍𝗈 𝗃𝗈𝗂𝗇.", threadID, messageID);
                }

                let msg = `🎯 𝖠𝖵𝖠𝖨𝖫𝖠𝖡𝖫𝖤 𝖦𝖱𝖮𝖴𝖯𝖲 𝖫𝖨𝖲𝖳\n\n`;
                const ID = [];
                
                availableThreads.forEach((thread, index) => {
                    const threadName = thread.threadInfo.threadName || '𝖴𝗇𝗇𝖺𝗆𝖾𝖽 𝖦𝗋𝗈𝗎𝗉';
                    const memberCount = thread.participantIDs ? thread.participantIDs.length : 0;
                    
                    msg += `${index + 1}. ${threadName}\n`;
                    msg += `   👥 𝖬𝖾𝗆𝖻𝖾𝗋𝗌: ${memberCount}\n\n`;
                    ID.push(thread.threadID);
                });

                msg += `💭 𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗍𝗁𝖾 𝗇𝗎𝗆𝖻𝖾𝗋 𝗍𝗈 𝗃𝗈𝗂𝗇 𝗍𝗁𝖺𝗍 𝗀𝗋𝗈𝗎𝗉`;
                
                return api.sendMessage(msg, threadID, (error, info) => {
                    if (error) {
                        console.error("💥 𝖲𝖾𝗇𝖽 𝖬𝖾𝗌𝗌𝖺𝗀𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
                        return api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗂𝗌𝗉𝗅𝖺𝗒 𝗀𝗋𝗈𝗎𝗉 𝗅𝗂𝗌𝗍", threadID, messageID);
                    }
                    
                    global.client.handleReply.push({
                        name: this.config.name,
                        author: senderID,
                        messageID: info.messageID,
                        ID: ID      
                    });
                }, messageID);
                
            } catch (error) {
                console.error("💥 𝖬𝖺𝗂𝗇 𝖤𝗋𝗋𝗈𝗋:", error);
                return api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗍𝗋𝗂𝖾𝗏𝖾 𝗀𝗋𝗈𝗎𝗉 𝗅𝗂𝗌𝗍", threadID, messageID);
            }
        } catch (error) {
            console.error("💥 𝖲𝗍𝖺𝗋𝗍 𝖧𝖺𝗇𝖽𝗅𝖾𝗋 𝖤𝗋𝗋𝗈𝗋:", error);
            return api.sendMessage("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.", event.threadID, event.messageID);
        }
    }
};
