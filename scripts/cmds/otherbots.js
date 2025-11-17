const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "otherbots",
        aliases: [],
        version: "1.1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "system",
        shortDescription: {
            en: "🛡️ 𝖮𝗍𝗁𝖾𝗋 𝖡𝗈𝗍𝗌 𝖣𝖾𝗍𝖾𝖼𝗍𝗂𝗈𝗇 & 𝖠𝗎𝗍𝗈-𝖡𝖺𝗇 𝖲𝗒𝗌𝗍𝖾𝗆"
        },
        longDescription: {
            en: "🛡️ 𝖮𝗍𝗁𝖾𝗋 𝖡𝗈𝗍𝗌 𝖣𝖾𝗍𝖾𝖼𝗍𝗂𝗈𝗇 & 𝖠𝗎𝗍𝗈-𝖡𝖺𝗇 𝖲𝗒𝗌𝗍𝖾𝗆"
        },
        guide: {
            en: "{p}otherbots [𝗂𝗇𝖿𝗈|𝗌𝗍𝖺𝗍𝗎𝗌]"
        },
        dependencies: {
            "moment-timezone": ""
        },
        envConfig: {
            autoBan: true,
            notifyAdmins: true,
            logBans: true
        }
    },

    onLoad: function() {
        console.log('🛡️ 𝖮𝗍𝗁𝖾𝗋𝖡𝗈𝗍𝗌 𝖣𝖾𝗍𝖾𝖼𝗍𝗂𝗈𝗇 𝖲𝗒𝗌𝗍𝖾𝗆 𝖫𝗈𝖺𝖽𝖾𝖽 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒!');
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            let momentAvailable = true;
            try {
                require("moment-timezone");
            } catch (e) {
                momentAvailable = false;
            }

            if (!momentAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝗆𝗈𝗆𝖾𝗇𝗍-𝗍𝗂𝗆𝖾𝗓𝗈𝗇𝖾.");
            }

            const status = this.config.envConfig.autoBan ? 
                "✅ 𝖠𝖼𝗍𝗂𝗏𝖾" : 
                "❌ 𝖨𝗇𝖺𝖼𝗍𝗂𝗏𝖾";
                
            const infoMessage = `ℹ️ 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖨𝗇𝖿𝗈:

𝖳𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝖽𝖾𝗍𝖾𝖼𝗍𝗌 𝖺𝗇𝖽 𝖻𝖺𝗇𝗌 𝗈𝗍𝗁𝖾𝗋 𝖻𝗈𝗍𝗌 𝗍𝗈 𝗉𝗋𝖾𝗏𝖾𝗇𝗍 𝗌𝗉𝖺𝗆𝗆𝗂𝗇𝗀. 𝖭𝗈 𝖺𝖽𝖽𝗂𝗍𝗂𝗈𝗇𝖺𝗅 𝖺𝖼𝗍𝗂𝗈𝗇 𝗂𝗌 𝗋𝖾𝗊𝗎𝗂𝗋𝖾𝖽. 🔍

📊 𝖲𝗍𝖺𝗍𝗎𝗌: ${status}`;

            return message.reply(infoMessage);

        } catch (error) {
            console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗈𝗇𝖲𝗍𝖺𝗋𝗍:", error);
            // Don't send error message to avoid spam
        }
    },

    onChat: async function({ event, api, usersData }) {
        try {
            // Dependency check
            let momentAvailable = true;
            try {
                require("moment-timezone");
            } catch (e) {
                momentAvailable = false;
            }

            if (!momentAvailable) {
                return;
            }

            const { threadID, messageID, senderID, body } = event;
            
            // Don't process if it's the bot itself
            if (senderID === api.getCurrentUserID()) return;
            
            // Check if auto-ban is enabled
            if (!this.config.envConfig.autoBan) return;

            // Bot detection triggers
            const botTriggers = [
                "your keyboard level has reached level",
                "Command not found",
                "The command you used",
                "Uy may lumipad",
                "Unsend this message",
                "You are unable to use bot",
                "»» NOTICE «« Update user nicknames",
                "just removed 1 Attachments",
                "message removedcontent",
                "The current preset is",
                "Here Is My Prefix",
                "just removed 1 attachment.",
                "Unable to re-add members",
                "removed 1 message content:",
                "Here's your music, enjoy!🥰",
                "Ye Raha Aapka Music, enjoy!🥰",
                "your keyboard Power level Up",
                "bot ki mc",
                "your keyboard hero level has reached level"
            ];

            // Check if message contains bot triggers
            if (body && botTriggers.some(trigger => body.toLowerCase().includes(trigger.toLowerCase()))) {
                let userName = "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖴𝗌𝖾𝗋";
                
                try {
                    // Get user name with error handling
                    userName = await usersData.getName(senderID) || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖴𝗌𝖾𝗋";
                } catch (nameError) {
                    console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗇𝖺𝗆𝖾:", nameError.message);
                }

                const time = moment.tz("Asia/Dhaka").format("HH:mm:ss DD/MM/YYYY");

                try {
                    // Get and update user data
                    let userData;
                    try {
                        userData = await usersData.get(senderID) || {};
                    } catch (dataError) {
                        console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", dataError);
                        userData = {};
                    }

                    userData.banned = 1;
                    userData.reason = "𝖮𝗍𝗁𝖾𝗋 𝖡𝗈𝗍 𝖣𝖾𝗍𝖾𝖼𝗍𝖾𝖽";
                    userData.dateAdded = time;
                    
                    try {
                        await usersData.set(senderID, userData);
                    } catch (setError) {
                        console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", setError);
                    }

                    // Update global ban list
                    if (!global.data.userBanned) {
                        global.data.userBanned = new Map();
                    }
                    global.data.userBanned.set(senderID, {
                        reason: userData.reason,
                        dateAdded: userData.dateAdded
                    });

                    // Send ban notification
                    const banMessage = `🛡️ 𝖡𝗈𝗍 𝖣𝖾𝗍𝖾𝖼𝗍𝖾𝖽!

${userName}, 𝖸𝗈𝗎 𝗁𝖺𝗏𝖾 𝖻𝖾𝖾𝗇 𝖽𝖾𝗍𝖾𝖼𝗍𝖾𝖽 𝖺𝗌 𝖺𝗇𝗈𝗍𝗁𝖾𝗋 𝖻𝗈𝗍! 𝖸𝗈𝗎𝗋 𝖺𝖼𝖼𝗈𝗎𝗇𝗍 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖻𝖺𝗇𝗇𝖾𝖽 𝗍𝗈 𝗉𝗋𝖾𝗏𝖾𝗇𝗍 𝗌𝗉𝖺𝗆𝗆𝗂𝗇𝗀. 😔`;

                    try {
                        await api.sendMessage({
                            body: banMessage
                        }, threadID, messageID);
                    } catch (sendError) {
                        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝖻𝖺𝗇 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", sendError.message);
                    }

                    // Notify admins if enabled
                    if (this.config.envConfig.notifyAdmins && global.config && global.config.ADMINBOT) {
                        const adminAlert = `⚠️ 𝖭𝖾𝗐 𝖡𝗈𝗍 𝖡𝖺𝗇𝗇𝖾𝖽 ⚠️

👤 𝖭𝖺𝗆𝖾: ${userName}
🆔 𝖡𝗈𝗍 𝖴𝖨𝖣: ${senderID}
📅 𝖣𝖺𝗍𝖾: ${time}

𝖳𝗁𝗂𝗌 𝗎𝗌𝖾𝗋 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖽𝖾𝗍𝖾𝖼𝗍𝖾𝖽 𝖺𝗌 𝖺𝗇 𝗈𝗍𝗁𝖾𝗋 𝖻𝗈𝗍 𝖺𝗇𝖽 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝖻𝖺𝗇𝗇𝖾𝖽! 🔒`;

                        try {
                            if (Array.isArray(global.config.ADMINBOT)) {
                                const adminPromises = global.config.ADMINBOT.map(async (adminID) => {
                                    try {
                                        await api.sendMessage(adminAlert, adminID);
                                    } catch (adminError) {
                                        console.warn(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗇𝗈𝗍𝗂𝖿𝗒 𝖺𝖽𝗆𝗂𝗇 ${adminID}:`, adminError.message);
                                    }
                                });
                                await Promise.allSettled(adminPromises);
                            }
                        } catch (adminNotifyError) {
                            console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗇𝗈𝗍𝗂𝖿𝗒𝗂𝗇𝗀 𝖺𝖽𝗆𝗂𝗇𝗌:", adminNotifyError);
                        }
                    }

                    // Log ban if enabled
                    if (this.config.envConfig.logBans) {
                        console.log(`[🛡️ 𝖡𝖮𝖳 𝖡𝖠𝖭𝖭𝖤𝖣] ${userName} (${senderID}) 𝖺𝗍 ${time}`);
                    }

                } catch (banError) {
                    console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖽𝗎𝗋𝗂𝗇𝗀 𝖻𝖺𝗇 𝗉𝗋𝗈𝖼𝖾𝗌𝗌:", banError);
                }
            }
        } catch (error) {
            console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗈𝗇𝖢𝗁𝖺𝗍:", error);
        }
    }
};
