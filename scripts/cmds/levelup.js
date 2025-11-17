const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "levelup",
        aliases: [],
        version: "0.0.2",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 1,
        category: "system",
        shortDescription: {
            en: "𝖫𝖾𝗏𝖾𝗅 𝗎𝗉 𝖺𝗅𝖾𝗋𝗍𝗌"
        },
        longDescription: {
            en: "𝖭𝗈𝗍𝗂𝖿𝗂𝖾𝗌 𝗐𝗁𝖾𝗇 𝗎𝗌𝖾𝗋𝗌 𝗅𝖾𝗏𝖾𝗅 𝗎𝗉"
        },
        guide: {
            en: "{p}levelup 𝗈𝗇/𝗈𝖿𝖿"
        },
        dependencies: {
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function({ message, event, args, threadsData, api }) {
        try {
            // Dependency check
            let fsAvailable = true;
            let pathAvailable = true;
            try {
                require("fs-extra");
                require("path");
            } catch (e) {
                fsAvailable = false;
                pathAvailable = false;
            }

            if (!fsAvailable || !pathAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            const { threadID, senderID } = event;

            if (!args[0]) {
                return message.reply(
                    "❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗌𝗉𝖾𝖼𝗂𝖿𝗒 '𝗈𝗇' 𝗈𝗋 '𝗈𝖿𝖿':\n\n" +
                    "• {p}levelup 𝗈𝗇 - 𝖤𝗇𝖺𝖻𝗅𝖾 𝗅𝖾𝗏𝖾𝗅 𝗎𝗉 𝖺𝗅𝖾𝗋𝗍𝗌\n" +
                    "• {p}levelup 𝗈𝖿𝖿 - 𝖣𝗂𝗌𝖺𝖻𝗅𝖾 𝗅𝖾𝗏𝖾𝗅 𝗎𝗉 𝖺𝗅𝖾𝗋𝗍𝗌"
                );
            }

            const action = args[0].toLowerCase().trim();
            
            if (action !== 'on' && action !== 'off') {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗈𝗉𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 '𝗈𝗇' 𝗈𝗋 '𝗈𝖿𝖿'");
            }

            try {
                // Get thread info to check admin status
                const threadInfo = await api.getThreadInfo(threadID);
                
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

                const newStatus = action === 'on';
                
                // Save the setting with error handling
                try {
                    threadData.levelup = newStatus;
                    await threadsData.set(threadID, threadData);
                    console.log(`✅ 𝖫𝖾𝗏𝖾𝗅𝗎𝗉 𝖺𝗅𝖾𝗋𝗍𝗌 ${action} 𝖿𝗈𝗋 𝗍𝗁𝗋𝖾𝖺𝖽 ${threadID}`);
                } catch (saveError) {
                    console.error("𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝖽𝖺𝗍𝖺:", saveError);
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                }

                const statusMessage = newStatus ? 
                    "✅ 𝖫𝖾𝗏𝖾𝗅 𝗎𝗉 𝖺𝗅𝖾𝗋𝗍𝗌 𝖾𝗇𝖺𝖻𝗅𝖾𝖽!\n\n✨ 𝖴𝗌𝖾𝗋𝗌 𝗐𝗂𝗅𝗅 𝗇𝗈𝗐 𝗋𝖾𝖼𝖾𝗂𝗏𝖾 𝗇𝗈𝗍𝗂𝖿𝗂𝖼𝖺𝗍𝗂𝗈𝗇𝗌 𝗐𝗁𝖾𝗇 𝗍𝗁𝖾𝗒 𝗅𝖾𝗏𝖾𝗅 𝗎𝗉." :
                    "✅ 𝖫𝖾𝗏𝖾𝗅 𝗎𝗉 𝖺𝗅𝖾𝗋𝗍𝗌 𝖽𝗂𝗌𝖺𝖻𝗅𝖾𝖽!\n\n🔇 𝖴𝗌𝖾𝗋𝗌 𝗐𝗂𝗅𝗅 𝗇𝗈 𝗅𝗈𝗇𝗀𝖾𝗋 𝗋𝖾𝖼𝖾𝗂𝗏𝖾 𝗇𝗈𝗍𝗂𝖿𝗂𝖼𝖺𝗍𝗂𝗈𝗇𝗌 𝗐𝗁𝖾𝗇 𝗅𝖾𝗏𝖾𝗅𝗂𝗇𝗀 𝗎𝗉.";

                return message.reply(statusMessage);

            } catch (apiError) {
                console.error("𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", apiError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖼𝖼𝖾𝗌𝗌 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

        } catch (error) {
            console.error("💥 𝖫𝖾𝗏𝖾𝗅𝗎𝗉 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('threadsData')) {
                errorMessage = "❌ 𝖣𝖺𝗍𝖺𝗌𝗍𝗈𝗋𝖾 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗍𝗁𝖾 𝖻𝗈𝗍'𝗌 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗍𝗂𝗈𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    },

    onChat: async function({ event, message, usersData, threadsData, api }) {
        try {
            const { threadID, senderID } = event;

            // Skip if message is from bot or system
            if (event.type !== "message" || event.senderID === api.getCurrentUserID()) {
                return;
            }

            // Get thread data with error handling
            let threadData;
            try {
                threadData = await threadsData.get(threadID) || {};
            } catch (dataError) {
                console.error("𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝖽𝖺𝗍𝖺:", dataError);
                return;
            }

            // If levelup alerts are disabled for this thread, just add exp and return
            if (threadData.levelup === false) {
                try {
                    const userData = await usersData.get(senderID) || {};
                    const userExp = parseInt(userData.exp) || 0;
                    await usersData.set(senderID, { exp: userExp + 1 });
                } catch (expError) {
                    console.error("𝖤𝗋𝗋𝗈𝗋 𝖺𝖽𝖽𝗂𝗇𝗀 𝖾𝗑𝗉:", expError);
                }
                return;
            }

            // Get user data with error handling
            let userData;
            try {
                userData = await usersData.get(senderID) || {};
            } catch (userError) {
                console.error("𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", userError);
                return;
            }

            let exp = parseInt(userData.exp) || 0;
            exp += 1;

            if (isNaN(exp)) {
                return;
            }

            // Calculate current and next level
            const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
            const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3) + 1) / 2));

            // Check if user leveled up
            if (level > curLevel && level !== 1) {
                let userInfo;
                try {
                    userInfo = await api.getUserInfo(senderID);
                } catch (error) {
                    console.error("𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈:", error);
                    userInfo = { [senderID]: { name: "𝖴𝗌𝖾𝗋" } };
                }
                
                const name = userInfo[senderID]?.name || "𝖴𝗌𝖾𝗋";
                
                let msg = threadData.customLevelup || "🎉 {𝗇𝖺𝗆𝖾} 𝗋𝖾𝖺𝖼𝗁𝖾𝖽 𝗅𝖾𝗏𝖾𝗅 {𝗅𝖾𝗏𝖾𝗅}! ✨";
                
                msg = msg
                    .replace(/\{𝗇𝖺𝗆𝖾}/g, name)
                    .replace(/\{𝗅𝖾𝗏𝖾𝗅}/g, level);

                let attachment = null;
                
                // Check if levelup GIF exists with error handling
                try {
                    const gifPath = path.join(__dirname, "cache", "levelup", "levelup.gif");
                    if (await fs.pathExists(gifPath)) {
                        // Ensure directory exists
                        const gifDir = path.dirname(gifPath);
                        if (!await fs.pathExists(gifDir)) {
                            await fs.mkdir(gifDir, { recursive: true });
                        }
                        attachment = fs.createReadStream(gifPath);
                    }
                } catch (gifError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗅𝗈𝖺𝖽 𝗅𝖾𝗏𝖾𝗅𝗎𝗉 𝖦𝖨𝖥:", gifError.message);
                }

                try {
                    if (attachment) {
                        await message.reply({
                            body: msg,
                            attachment: attachment,
                            mentions: [{ tag: name, id: senderID }]
                        });
                    } else {
                        await message.reply({
                            body: msg,
                            mentions: [{ tag: name, id: senderID }]
                        });
                    }
                    console.log(`🎊 ${name} 𝗅𝖾𝗏𝖾𝗅𝖾𝖽 𝗎𝗉 𝗍𝗈 𝗅𝖾𝗏𝖾𝗅 ${level} 𝗂𝗇 𝗀𝗋𝗈𝗎𝗉 ${threadID}`);
                } catch (sendError) {
                    console.error("𝖫𝖾𝗏𝖾𝗅𝗎𝗉 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖾𝗋𝗋𝗈𝗋:", sendError);
                }
            }

            // Save updated exp
            try {
                await usersData.set(senderID, { exp });
            } catch (saveError) {
                console.error("𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖾𝗑𝗉:", saveError);
            }

        } catch (error) {
            console.error("💥 𝖫𝖾𝗏𝖾𝗅𝗎𝗉 𝖼𝗁𝖺𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    }
};
