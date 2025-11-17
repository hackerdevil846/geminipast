/** 
const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "autoreset",
        aliases: [],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 0,
        role: 0,
        category: "system",
        shortDescription: {
            en: "🔄 𝖠𝖴𝖳𝖮 𝖱𝖤𝖲𝖳𝖠𝖱𝖳 𝖲𝖸𝖲𝖳𝖤𝖬"
        },
        longDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗋𝖾𝗌𝗍𝖺𝗋𝗍𝗌 𝗍𝗁𝖾 𝖻𝗈𝗍 𝖺𝗍 𝗌𝗉𝖾𝖼𝗂𝖿𝗂𝖼 𝗍𝗂𝗆𝖾𝗌"
        },
        guide: {
            en: ""
        },
        dependencies: {
            "moment-timezone": ""
        }
    },

    onStart: async function({ message, event }) {
        try {
            // Dependency check
            let momentAvailable = true;
            try {
                require("moment-timezone");
            } catch (e) {
                momentAvailable = false;
            }

            if (!momentAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗒. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝗆𝗈𝗆𝖾𝗇𝗍-𝗍𝗂𝗆𝖾𝗓𝗈𝗇𝖾.");
            }

            const timeNow = moment.tz("Asia/Dhaka").format("HH:mm:ss");
            const timezone = moment.tz("Asia/Dhaka").format("ZZ");
            
            await message.reply(
                `🕒 𝖢𝗎𝗋𝗋𝖾𝗇𝗍 𝗍𝗂𝗆𝖾: ${timeNow}\n` +
                `🌏 𝖳𝗂𝗆𝖾𝗓𝗈𝗇𝖾: 𝖠𝗌𝗂𝖺/𝖣𝗁𝖺𝗄𝖺 (${timezone})\n` +
                `🔄 𝖠𝗎𝗍𝗈 𝗋𝖾𝗌𝗍𝖺𝗋𝗍 𝗌𝗒𝗌𝗍𝖾𝗆 𝗂𝗌 𝖺𝖼𝗍𝗂𝗏𝖾\n` +
                `⏰ 𝖱𝖾𝗌𝗍𝖺𝗋𝗍𝗌: 𝖤𝗏𝖾𝗋𝗒 𝗁𝗈𝗎𝗋 𝖺𝗍 :00:00`
            );
        } catch (error) {
            console.error("💥 𝖠𝗎𝗍𝗈𝗋𝖾𝗌𝗍 𝗌𝗍𝖺𝗋𝗍 𝖾𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    },

    onChat: async function({ message, event, api }) {
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

            const timeNow = moment.tz("Asia/Dhaka");
            const timeString = timeNow.format("HH:mm:ss");
            const seconds = timeNow.format("ss");
            const minutes = timeNow.format("mm");
            
            // Get admin IDs safely
            let adminIDs = [];
            try {
                adminIDs = global.config?.ADMINBOT || [];
                // Ensure adminIDs is an array
                if (!Array.isArray(adminIDs)) {
                    adminIDs = [];
                }
            } catch (configError) {
                console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖺𝖼𝖼𝖾𝗌𝗌 𝖠𝖣𝖬𝖨𝖭𝖡𝖮𝖳 𝖼𝗈𝗇𝖿𝗂𝗀:", configError.message);
                adminIDs = [];
            }

            // Check if it's exactly :00:00 to :00:05 (first 5 seconds of every hour)
            if (minutes === "00" && parseInt(seconds) < 6) {
                console.log(`🔄 𝖠𝗎𝗍𝗈 𝗋𝖾𝗌𝗍𝖺𝗋𝗍 𝗍𝗋𝗂𝗀𝗀𝖾𝗋𝖾𝖽 𝖺𝗍: ${timeString}`);
                
                // Send notification to all admins
                let notifiedAdmins = 0;
                const notificationPromises = adminIDs.map(async (adminID) => {
                    try {
                        await message.reply(
                            `⚡️ 𝖠𝗎𝗍𝗈 𝖱𝖾𝗌𝗍𝖺𝗋𝗍 𝖲𝗒𝗌𝗍𝖾𝗆\n\n` +
                            `🕒 𝖢𝗎𝗋𝗋𝖾𝗇𝗍 𝗍𝗂𝗆𝖾: ${timeString}\n` +
                            `🔄 𝖡𝗈𝗍 𝗋𝖾𝗌𝗍𝖺𝗋𝗍𝗂𝗇𝗀...\n` +
                            `⏰ 𝖭𝖾𝗑𝗍 𝗋𝖾𝗌𝗍𝖺𝗋𝗍: 𝗂𝗇 1 𝗁𝗈𝗎𝗋`,
                            adminID
                        );
                        notifiedAdmins++;
                    } catch (notifyError) {
                        console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗇𝗈𝗍𝗂𝖿𝗒 𝖺𝖽𝗆𝗂𝗇 ${adminID}:`, notifyError.message);
                    }
                });

                await Promise.allSettled(notificationPromises);
                
                console.log(`✅ 𝖭𝗈𝗍𝗂𝖿𝗂𝖾𝖽 ${notifiedAdmins} 𝖺𝖽𝗆𝗂𝗇𝗌 𝖻𝖾𝖿𝗈𝗋𝖾 𝗋𝖾𝗌𝗍𝖺𝗋𝗍`);
                
                // Add a small delay to ensure messages are sent
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Restart the bot
                console.log("🔄 𝖨𝗇𝗂𝗍𝗂𝖺𝗍𝗂𝗇𝗀 𝖻𝗈𝗍 𝗋𝖾𝗌𝗍𝖺𝗋𝗍...");
                process.exit(1);
            }
            
            // Optional: Log every 30 minutes for monitoring
            if (minutes === "30" && seconds === "00") {
                console.log(`📊 𝖠𝗎𝗍𝗈𝗋𝖾𝗌𝗍 𝗌𝗒𝗌𝗍𝖾𝗆 𝗆𝗈𝗇𝗂𝗍𝗈𝗋𝗂𝗇𝗀 - ${timeString}`);
            }
            
        } catch (error) {
            console.error("💥 𝖠𝗎𝗍𝗈𝗋𝖾𝗌𝗍 𝖼𝗁𝖺𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    },

    // Additional event handler for system monitoring
    onLoad: function() {
        try {
            const timeNow = moment.tz("Asia/Dhaka").format("HH:mm:ss");
            console.log(`✅ 𝖠𝗎𝗍𝗈𝗋𝖾𝗌𝗍 𝗌𝗒𝗌𝗍𝖾𝗆 𝗅𝗈𝖺𝖽𝖾𝖽 - ${timeNow}`);
        } catch (error) {
            console.error("💥 𝖠𝗎𝗍𝗈𝗋𝖾𝗌𝗍 𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    }
};
*/
