const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "cony",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "𝖯𝗋𝖾𝖽𝗂𝖼𝗍 𝗅𝗈𝗏𝖾 𝗉𝗋𝗈𝖻𝖺𝖻𝗂𝗅𝗂𝗍𝗒"
        },
        longDescription: {
            en: "𝖯𝗋𝖾𝖽𝗂𝖼𝗍𝗌 𝗒𝗈𝗎𝗋 𝖼𝗁𝖺𝗇𝖼𝖾 𝗈𝖿 𝗁𝖺𝗏𝗂𝗇𝗀 𝖺 𝖻𝗈𝗒𝖿𝗋𝗂𝖾𝗇𝖽/𝗀𝗂𝗋𝗅𝖿𝗋𝗂𝖾𝗇𝖽 𝗍𝗁𝗂𝗌 𝗒𝖾𝖺𝗋"
        },
        guide: {
            en: "{p}cony"
        },
        dependencies: {
            "fs": "",
            "path": ""
        }
    },

    onStart: async function({ message, event, usersData }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            const probabilities = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', "0%", "48%", "1%", "10%", "99.9%"];
            const randomProbability = probabilities[Math.floor(Math.random() * probabilities.length)];
            
            // Get user data with error handling
            let name = "𝖴𝗌𝖾𝗋";
            try {
                const userData = await usersData.get(event.senderID);
                if (userData && userData.name) {
                    name = userData.name;
                }
            } catch (userError) {
                console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", userError.message);
                // Continue with default name
            }

            // Path to the GIF file
            const imagePath = path.join(__dirname, "cache", "chucmung.gif");
            
            // Check if file exists
            if (!fs.existsSync(imagePath)) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽 𝖺𝗍:", imagePath);
                return message.reply("❌ 𝖨𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽 𝗂𝗇 𝖼𝖺𝖼𝗁𝖾 𝖿𝗈𝗅𝖽𝖾𝗋! 𝖯𝗅𝖾𝖺𝗌𝖾 𝖺𝖽𝖽 𝖺 '𝖼𝗁𝗎𝖼𝗆𝗎𝗇𝗀.𝗀𝗂𝖿' 𝖿𝗂𝗅𝖾 𝗍𝗈 𝗍𝗁𝖾 𝖼𝖺𝖼𝗁𝖾 𝖿𝗈𝗅𝖽𝖾𝗋.");
            }

            // Check if file is readable
            try {
                fs.accessSync(imagePath, fs.constants.R_OK);
            } catch (accessError) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝗋𝖾𝖺𝖽𝖺𝖻𝗅𝖾:", accessError.message);
                return message.reply("❌ 𝖨𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾 𝗂𝗌 𝗇𝗈𝗍 𝖺𝖼𝖼𝖾𝗌𝗌𝗂𝖻𝗅𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌.");
            }

            // Check file size to avoid sending huge files
            try {
                const stats = fs.statSync(imagePath);
                const fileSize = stats.size / (1024 * 1024); // Convert to MB
                if (fileSize > 10) {
                    console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾 𝗍𝗈𝗈 𝗅𝖺𝗋𝗀𝖾:", fileSize + "𝖬𝖡");
                    return message.reply("❌ 𝖨𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾 𝗂𝗌 𝗍𝗈𝗈 𝗅𝖺𝗋𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 𝖺 𝗌𝗆𝖺𝗅𝗅𝖾𝗋 𝖿𝗂𝗅𝖾.");
                }
            } catch (sizeError) {
                console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗁𝖾𝖼𝗄 𝖿𝗂𝗅𝖾 𝗌𝗂𝗓𝖾:", sizeError.message);
            }

            // Send message with attachment
            await message.reply({
                body: `🌸 𝖢𝗈𝗇𝗀𝗋𝖺𝗍𝗎𝗅𝖺𝗍𝗂𝗈𝗇𝗌 ${name}!\n𝖸𝗈𝗎𝗋 𝗅𝗈𝗏𝖾 𝗉𝗋𝗈𝖻𝖺𝖻𝗂𝗅𝗂𝗍𝗒 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝗒𝖾𝖺𝗋 𝗂𝗌: ${randomProbability} ❤️`,
                attachment: fs.createReadStream(imagePath)
            });

            console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗌𝖾𝗇𝗍 𝗅𝗈𝗏𝖾 𝗉𝗋𝖾𝖽𝗂𝖼𝗍𝗂𝗈𝗇 𝗍𝗈 ${name}: ${randomProbability}`);

        } catch (error) {
            console.error("💥 𝖢𝗈𝗇𝗒 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗍𝗁𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.";
            
            if (error.message.includes('ENOENT')) {
                errorMessage = "❌ 𝖨𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗈𝗇𝗍𝖺𝖼𝗍 𝗍𝗁𝖾 𝖻𝗈𝗍 𝖺𝖽𝗆𝗂𝗇.";
            } else if (error.message.includes('EACCES')) {
                errorMessage = "❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝖿𝗂𝗅𝖾 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌.";
            } else if (error.message.includes('usersData')) {
                errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
