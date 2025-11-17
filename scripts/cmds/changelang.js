module.exports = {
    config: {
        name: "changelang",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 2,
        category: "admin",
        shortDescription: {
            en: "𝖢𝗁𝖺𝗇𝗀𝖾 𝖻𝗈𝗍 𝗅𝖺𝗇𝗀𝗎𝖺𝗀𝖾"
        },
        longDescription: {
            en: "𝖢𝗁𝖺𝗇𝗀𝖾 𝗍𝗁𝖾 𝖻𝗈𝗍'𝗌 𝗅𝖺𝗇𝗀𝗎𝖺𝗀𝖾 𝗉𝗋𝖾𝖿𝖾𝗋𝖾𝗇𝖼𝖾"
        },
        guide: {
            en: "{p}changelang [𝖾𝗇|𝖻𝗇]"
        },
        dependencies: {
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args, api }) {
        try {
            // Dependency check with better validation
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
                    "𝖲𝗒𝗇𝗍𝖺𝗑 𝖾𝗋𝗋𝗈𝗋, 𝗎𝗌𝖾: 𝖼𝗁𝖺𝗇𝗀𝖾𝗅𝖺𝗇𝗀 [𝖾𝗇 | 𝖻𝗇]\n\n" +
                    "• 𝖾𝗇 - 𝖤𝗇𝗀𝗅𝗂𝗌𝗁\n" +
                    "• 𝖻𝗇 - 𝖡𝖺𝗇𝗀𝗅𝖺"
                );
            }

            // Check if user has admin role (role: 2)
            try {
                const threadInfo = await api.getThreadInfo(threadID);
                const isUserAdmin = threadInfo.adminIDs?.some(admin => admin.id === senderID);
                
                if (!isUserAdmin) {
                    return message.reply("❌ 𝖮𝗇𝗅𝗒 𝖺𝖽𝗆𝗂𝗇𝗌 𝖼𝖺𝗇 𝖼𝗁𝖺𝗇𝗀𝖾 𝗍𝗁𝖾 𝖻𝗈𝗍'𝗌 𝗅𝖺𝗇𝗀𝗎𝖺𝗀𝖾.");
                }
            } catch (apiError) {
                console.error("𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", apiError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗏𝖾𝗋𝗂𝖿𝗒 𝗎𝗌𝖾𝗋 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            const language = args[0].toLowerCase().trim();

            // Validate global.config exists
            if (!global.config) {
                console.error("❌ 𝗀𝗅𝗈𝖻𝖺𝗅.𝖼𝗈𝗇𝖿𝗂𝗀 𝗂𝗌 𝗇𝗈𝗍 𝖽𝖾𝖿𝗂𝗇𝖾𝖽");
                return message.reply("❌ 𝖡𝗈𝗍 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗈𝗇𝗍𝖺𝖼𝗍 𝗍𝗁𝖾 𝖻𝗈𝗍 𝗈𝗐𝗇𝖾𝗋.");
            }

            let successMessage = "";
            let languageCode = "";

            switch (language) {
                case "english":
                case "en":
                case "𝖾𝗇":
                    global.config.language = "en";
                    successMessage = "✅ 𝖫𝖺𝗇𝗀𝗎𝖺𝗀𝖾 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖼𝗁𝖺𝗇𝗀𝖾𝖽 𝗍𝗈 𝖤𝗇𝗀𝗅𝗂𝗌𝗁";
                    languageCode = "en";
                    break;
                
                case "bangla":
                case "bn":
                case "bengali":
                case "𝖻𝗇":
                    global.config.language = "bn";
                    successMessage = "✅ 𝖫𝖺𝗇𝗀𝗎𝖺𝗀𝖾 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖼𝗁𝖺𝗇𝗀𝖾𝖽 𝗍𝗈 𝖡𝖺𝗇𝗀𝗅𝖺";
                    languageCode = "bn";
                    break;
            
                default:
                    return message.reply(
                        "❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗅𝖺𝗇𝗀𝗎𝖺𝗀𝖾.\n\n" +
                        "𝖠𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝗅𝖺𝗇𝗀𝗎𝖺𝗀𝖾𝗌:\n" +
                        "• 𝖾𝗇 - 𝖤𝗇𝗀𝗅𝗂𝗌𝗁\n" +
                        "• 𝖻𝗇 - 𝖡𝖺𝗇𝗀𝗅𝖺"
                    );
            }

            // Save language preference to file if fs-extra is available
            try {
                const fs = require("fs-extra");
                const configPath = require("path").join(__dirname, "../../config.json");
                
                if (fs.existsSync(configPath)) {
                    const configData = fs.readJsonSync(configPath);
                    configData.language = languageCode;
                    fs.writeJsonSync(configPath, configData, { spaces: 2 });
                    console.log(`✅ 𝖫𝖺𝗇𝗀𝗎𝖺𝗀𝖾 𝗌𝖺𝗏𝖾𝖽 𝗍𝗈 𝖼𝗈𝗇𝖿𝗂𝗀: ${languageCode}`);
                }
            } catch (fsError) {
                console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗌𝖺𝗏𝖾 𝗅𝖺𝗇𝗀𝗎𝖺𝗀𝖾 𝗍𝗈 𝖿𝗂𝗅𝖾:", fsError.message);
                // Continue even if file save fails - at least global config is updated
            }

            console.log(`✅ 𝖫𝖺𝗇𝗀𝗎𝖺𝗀𝖾 𝖼𝗁𝖺𝗇𝗀𝖾𝖽 𝗍𝗈: ${languageCode} 𝖻𝗒 𝗎𝗌𝖾𝗋 ${senderID}`);
            return message.reply(successMessage);

        } catch (error) {
            console.error("💥 𝖢𝗁𝖺𝗇𝗀𝖾𝖫𝖺𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝖼𝗁𝖺𝗇𝗀𝗂𝗇𝗀 𝗅𝖺𝗇𝗀𝗎𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('global.config')) {
                errorMessage = "❌ 𝖡𝗈𝗍 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗈𝗇𝗍𝖺𝖼𝗍 𝗍𝗁𝖾 𝖻𝗈𝗍 𝗈𝗐𝗇𝖾𝗋.";
            } else if (error.message.includes('permission')) {
                errorMessage = "❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖮𝗇𝗅𝗒 𝖺𝖽𝗆𝗂𝗇𝗌 𝖼𝖺𝗇 𝖼𝗁𝖺𝗇𝗀𝖾 𝗅𝖺𝗇𝗀𝗎𝖺𝗀𝖾.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
