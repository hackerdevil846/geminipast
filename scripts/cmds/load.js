module.exports = {
    config: {
        name: "load",
        aliases: [],
        version: "1.0.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 30,
        role: 2,
        category: "𝗌𝗒𝗌𝗍𝖾𝗆",
        shortDescription: {
            en: "🔄 𝖢𝗈𝗇𝖿𝗂𝗀 𝖿𝖺𝗂𝗅 𝗋𝖾𝗅𝗈𝖺𝖽 𝗌𝗒𝗌𝗍𝖾𝗆"
        },
        longDescription: {
            en: "𝖱𝖾𝗅𝗈𝖺𝖽𝗌 𝗍𝗁𝖾 𝖻𝗈𝗍'𝗌 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗍𝗂𝗈𝗇 𝖿𝗂𝗅𝖾 𝗐𝗂𝗍𝗁𝗈𝗎𝗍 𝗋𝖾𝗌𝗍𝖺𝗋𝗍𝗂𝗇𝗀"
        },
        guide: {
            en: "{p}load"
        },
        dependencies: {
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, global, threadsData }) {
        try {
            // Dependency check with multiple fallbacks
            let fs;
            let fsAvailable = false;
            
            try {
                // Try global nodemodule first
                if (global.nodemodule && global.nodemodule.fs) {
                    fs = global.nodemodule.fs;
                    fsAvailable = true;
                } 
                // Try requiring directly
                else {
                    fs = require("fs-extra");
                    fsAvailable = true;
                }
            } catch (e) {
                fsAvailable = false;
            }

            if (!fsAvailable) {
                return message.reply("❌ 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺 𝗆𝗈𝖽𝗎𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝗂𝗍.");
            }

            // Get config path with fallbacks
            let configPath;
            try {
                configPath = global.client?.configPath;
                
                // If no configPath found, try common paths
                if (!configPath) {
                    const possiblePaths = [
                        `${process.cwd()}/config.json`,
                        `${process.cwd()}/config.cjs`,
                        `${process.cwd()}/config.js`,
                        `${__dirname}/../../config.json`,
                        `${__dirname}/../../../config.json`
                    ];
                    
                    for (const path of possiblePaths) {
                        if (fs.existsSync(path)) {
                            configPath = path;
                            break;
                        }
                    }
                }
                
                if (!configPath) {
                    return message.reply("❌ 𝖢𝗈𝗇𝖿𝗂𝗀 𝗉𝖺𝗍𝗁 𝖼𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖻𝖾 𝖽𝖾𝗍𝖾𝗋𝗆𝗂𝗇𝖾𝖽.");
                }
            } catch (pathError) {
                console.error("𝖢𝗈𝗇𝖿𝗂𝗀 𝗉𝖺𝗍𝗁 𝖾𝗋𝗋𝗈𝗋:", pathError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝖾𝗍𝖾𝗋𝗆𝗂𝗇𝖾 𝖼𝗈𝗇𝖿𝗂𝗀 𝗉𝖺𝗍𝗁.");
            }

            // Check if config file exists
            if (!fs.existsSync(configPath)) {
                return message.reply(`❌ 𝖢𝗈𝗇𝖿𝗂𝗀 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽 𝖺𝗍: ${configPath}`);
            }

            // Verify config file is readable
            try {
                const stats = fs.statSync(configPath);
                if (!stats.isFile()) {
                    return message.reply("❌ 𝖢𝗈𝗇𝖿𝗂𝗀 𝗉𝖺𝗍𝗁 𝗂𝗌 𝗇𝗈𝗍 𝖺 𝖿𝗂𝗅𝖾.");
                }
            } catch (statError) {
                return message.reply("❌ 𝖢𝖺𝗇𝗇𝗈𝗍 𝖺𝖼𝖼𝖾𝗌𝗌 𝖼𝗈𝗇𝖿𝗂𝗀 𝖿𝗂𝗅𝖾.");
            }

            const loadingMsg = await message.reply("🔄 𝖱𝖾𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗍𝗂𝗈𝗇...");

            try {
                // Clear cache for config file
                const resolvedPath = require.resolve(configPath);
                delete require.cache[resolvedPath];
                
                // Backup current config
                const oldConfig = { ...global.config };
                
                // Load new config
                const newConfig = require(configPath);
                
                // Validate new config structure
                if (!newConfig || typeof newConfig !== 'object') {
                    throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗈𝗇𝖿𝗂𝗀 𝗌𝗍𝗋𝗎𝖼𝗍𝗎𝗋𝖾");
                }
                
                // Required config fields
                const requiredFields = ['timezone', 'language', 'prefix'];
                for (const field of requiredFields) {
                    if (!newConfig[field]) {
                        throw new Error(`𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝗋𝖾𝗊𝗎𝗂𝗋𝖾𝖽 𝖿𝗂𝖾𝗅𝖽: ${field}`);
                    }
                }
                
                // Update global config
                global.config = newConfig;
                
                console.log(`✅ 𝖢𝗈𝗇𝖿𝗂𝗀 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗋𝖾𝗅𝗈𝖺𝖽𝖾𝖽 𝖿𝗋𝗈𝗆: ${configPath}`);
                
                // Unsend loading message
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }
                
                return message.reply(
                    "✅ 𝖢𝗈𝗇𝖿𝗂𝗀 𝖿𝖺𝗂𝗅 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗋𝖾𝗅𝗈𝖺𝖽𝖾𝖽!\n\n" +
                    "🔄 𝖡𝗈𝗍 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗍𝗂𝗈𝗇 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝗎𝗉𝖽𝖺𝗍𝖾𝖽!\n" +
                    `📁 𝖯𝖺𝗍𝗁: ${configPath}`
                );
                
            } catch (loadError) {
                console.error("𝖢𝗈𝗇𝖿𝗂𝗀 𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", loadError);
                
                // Restore old config if new one failed
                if (oldConfig) {
                    global.config = oldConfig;
                    console.log("🔄 𝖱𝖾𝗌𝗍𝗈𝗋𝖾𝖽 𝗈𝗅𝖽 𝖼𝗈𝗇𝖿𝗂𝗀 𝗎𝗉𝗈𝗇 𝖿𝖺𝗂𝗅𝗎𝗋𝖾");
                }
                
                // Unsend loading message
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }
                
                throw new Error(`𝖢𝗈𝗇𝖿𝗂𝗀 𝗋𝖾𝗅𝗈𝖺𝖽 𝖿𝖺𝗂𝗅𝖾𝖽: ${loadError.message}`);
            }
            
        } catch (error) {
            console.error("💥 𝖱𝖾𝗅𝗈𝖺𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖢𝗈𝗇𝖿𝗂𝗀 𝗋𝖾𝗅𝗈𝖺𝖽 𝖿𝖺𝗂𝗅𝖾𝖽!";
            
            if (error.message.includes('not found')) {
                errorMessage += "\n📄 𝖢𝗈𝗇𝖿𝗂𝗀 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽.";
            } else if (error.message.includes('permission')) {
                errorMessage += "\n🔒 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖽𝖾𝗇𝗂𝖾𝖽.";
            } else if (error.message.includes('Invalid')) {
                errorMessage += "\n📋 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗈𝗇𝖿𝗂𝗀 𝗌𝗍𝗋𝗎𝖼𝗍𝗎𝗋𝖾.";
            } else {
                errorMessage += `\n📄 𝖤𝗋𝗋𝗈𝗋: ${error.message}`;
            }
            
            await message.reply(errorMessage);
        }
    }
};
