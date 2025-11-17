const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "appstate",
        aliases: [],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 2,
        category: "admin",
        shortDescription: {
            en: "𝖱𝖾𝖿𝗋𝖾𝗌𝗁 𝖺𝗉𝗉𝗌𝗍𝖺𝗍𝖾.𝗃𝗌𝗈𝗇 𝖿𝗂𝗅𝖾"
        },
        longDescription: {
            en: "𝖱𝖾𝖿𝗋𝖾𝗌𝗁𝖾𝗌 𝗍𝗁𝖾 𝖺𝗉𝗉𝗌𝗍𝖺𝗍𝖾.𝗃𝗌𝗈𝗇 𝖿𝗂𝗅𝖾 𝗐𝗂𝗍𝗁 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗌𝖾𝗌𝗌𝗂𝗈𝗇 𝖽𝖺𝗍𝖺"
        },
        guide: {
            en: "{p}appstate"
        },
        dependencies: {
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function({ message, event, api }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            // Permission check - only specific user IDs can use this command
            const authorizedUsers = ["61571630409265"];
            
            if (!authorizedUsers.includes(String(event.senderID))) {
                return message.reply("❌ 𝖸𝗈𝗎𝗋 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖣𝖾𝗇𝗂𝖾𝖽! 😾");
            }

            // Get current appstate
            let appstate;
            try {
                appstate = api.getAppState();
                
                if (!appstate || !Array.isArray(appstate) || appstate.length === 0) {
                    throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖺𝗉𝗉𝗌𝗍𝖺𝗍𝖾 𝖽𝖺𝗍𝖺");
                }
                
                console.log(`✅ 𝖦𝗈𝗍 𝖺𝗉𝗉𝗌𝗍𝖺𝗍𝖾 𝗐𝗂𝗍𝗁 ${appstate.length} 𝖼𝗈𝗈𝗄𝗂𝖾𝗌`);
            } catch (appstateError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝖺𝗉𝗉𝗌𝗍𝖺𝗍𝖾:", appstateError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗍𝗋𝗂𝖾𝗏𝖾 𝖺𝗉𝗉𝗌𝗍𝖺𝗍𝖾 𝖽𝖺𝗍𝖺. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗍𝗁𝖾 𝖻𝗈𝗍'𝗌 𝗌𝗍𝖺𝗍𝗎𝗌.");
            }

            // Convert to JSON string with proper formatting
            const data = JSON.stringify(appstate, null, 2);
            
            if (!data || data.length < 10) {
                throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖺𝗉𝗉𝗌𝗍𝖺𝗍𝖾 𝖽𝖺𝗍𝖺 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽");
            }

            // Define appstate file path
            const appstatePath = path.join(__dirname, '../../appstate.json');
            const backupPath = path.join(__dirname, '../../appstate_backup.json');
            
            console.log(`📁 𝖠𝗉𝗉𝗌𝗍𝖺𝗍𝖾 𝗉𝖺𝗍𝗁: ${appstatePath}`);

            // Check if appstate file exists and create backup
            try {
                if (await fs.pathExists(appstatePath)) {
                    const existingData = await fs.readFile(appstatePath, 'utf8');
                    await fs.writeFile(backupPath, existingData, 'utf8');
                    console.log(`✅ 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖻𝖺𝖼𝗄𝗎𝗉: ${backupPath}`);
                }
            } catch (backupError) {
                console.warn("⚠️ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗋𝖾𝖺𝗍𝖾 𝖻𝖺𝖼𝗄𝗎𝗉:", backupError.message);
            }

            // Write new appstate data
            try {
                await fs.writeFile(appstatePath, data, 'utf8');
                console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗐𝗋𝗈𝗍𝖾 𝖺𝗉𝗉𝗌𝗍𝖺𝗍𝖾.𝗃𝗌𝗈𝗇 (${data.length} 𝖻𝗒𝗍𝖾𝗌)`);
                
                // Verify the file was written correctly
                const verifyData = await fs.readFile(appstatePath, 'utf8');
                const parsedData = JSON.parse(verifyData);
                
                if (!Array.isArray(parsedData) || parsedData.length === 0) {
                    throw new Error("𝖵𝖾𝗋𝗂𝖿𝗂𝖼𝖺𝗍𝗂𝗈𝗇 𝖿𝖺𝗂𝗅𝖾𝖽: 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖽𝖺𝗍𝖺 𝗂𝗇 𝖿𝗂𝗅𝖾");
                }
                
                console.log(`✅ 𝖵𝖾𝗋𝗂𝖿𝗂𝖾𝖽 𝖺𝗉𝗉𝗌𝗍𝖺𝗍𝖾 𝖿𝗂𝗅𝖾 𝗐𝗂𝗍𝗁 ${parsedData.length} 𝖼𝗈𝗈𝗄𝗂𝖾𝗌`);

                return message.reply("✅ 𝖠𝗉𝗉𝗌𝗍𝖺𝗍𝖾 𝗋𝖾𝖿𝗋𝖾𝗌𝗁𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒! 😸\n\n" +
                                   `📊 𝖢𝗈𝗈𝗄𝗂𝖾𝗌: ${parsedData.length}\n` +
                                   `💾 𝖥𝗂𝗅𝖾 𝗌𝗂𝗓𝖾: ${(data.length / 1024).toFixed(2)} 𝖪𝖡\n` +
                                   `🔒 𝖡𝖺𝖼𝗄𝗎𝗉: ${await fs.pathExists(backupPath) ? '✅' : '❌'}`);

            } catch (writeError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗐𝗋𝗂𝗍𝖾 𝖺𝗉𝗉𝗌𝗍𝖺𝗍𝖾:", writeError);
                
                // Try to restore from backup if write failed
                try {
                    if (await fs.pathExists(backupPath)) {
                        const backupData = await fs.readFile(backupPath, 'utf8');
                        await fs.writeFile(appstatePath, backupData, 'utf8');
                        console.log("✅ 𝖱𝖾𝗌𝗍𝗈𝗋𝖾𝖽 𝖿𝗋𝗈𝗆 𝖻𝖺𝖼𝗄𝗎𝗉");
                    }
                } catch (restoreError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗌𝗍𝗈𝗋𝖾 𝖿𝗋𝗈𝗆 𝖻𝖺𝖼𝗄𝗎𝗉:", restoreError);
                }
                
                return message.reply(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝖿𝗋𝖾𝗌𝗁 𝖺𝗉𝗉𝗌𝗍𝖺𝗍𝖾: ${writeError.message}`);
            }

        } catch (error) {
            console.error("💥 𝖠𝗉𝗉𝗌𝗍𝖺𝗍𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗋𝖾𝖿𝗋𝖾𝗌𝗁𝗂𝗇𝗀 𝖺𝗉𝗉𝗌𝗍𝖺𝗍𝖾.";
            
            if (error.message.includes('permission')) {
                errorMessage = "❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝖿𝗂𝗅𝖾 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌.";
            } else if (error.message.includes('ENOENT')) {
                errorMessage = "❌ 𝖥𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗍𝗁𝖾 𝖻𝗈𝗍'𝗌 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒 𝗌𝗍𝗋𝗎𝖼𝗍𝗎𝗋𝖾.";
            } else if (error.message.includes('JSON')) {
                errorMessage = "❌ 𝖩𝖲𝖮𝖭 𝗉𝖺𝗋𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋. 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖺𝗉𝗉𝗌𝗍𝖺𝗍𝖾 𝖽𝖺𝗍𝖺.";
            }
            
            return message.reply(errorMessage);
        }
    }
};
