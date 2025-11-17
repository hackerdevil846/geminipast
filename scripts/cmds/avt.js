const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "avt",
        aliases: [],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "tools",
        shortDescription: {
            en: "𝖴𝗌𝖾𝗋 𝖺𝗏𝖺𝗍𝖺𝗋 𝗂𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝗋"
        },
        longDescription: {
            en: "𝖦𝖾𝗍 𝗎𝗌𝖾𝗋 𝗈𝗋 𝗀𝗋𝗈𝗎𝗉 𝖺𝗏𝖺𝗍𝖺𝗋 𝗂𝗆𝖺𝗀𝖾𝗌"
        },
        guide: {
            en: "{p}avt [𝖻𝗈𝗑|𝗂𝖽|𝗎𝗌𝖾𝗋]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args, api }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            if (!args[0]) {
                const helpMessage = `🎭=== 𝖥𝖠𝖢𝖤𝖡𝖮𝖮𝖪 𝖠𝖵𝖠𝖳𝖠𝖱 ===🎭

🎭→ ${global.config.PREFIX}avt 𝖻𝗈𝗑 - 𝖦𝖾𝗍 𝗀𝗋𝗈𝗎𝗉 𝖺𝗏𝖺𝗍𝖺𝗋
🎭→ ${global.config.PREFIX}avt 𝗂𝖽 [𝗂𝖽] - 𝖦𝖾𝗍 𝖺𝗏𝖺𝗍𝖺𝗋 𝖻𝗒 𝖨𝖣
🎭→ ${global.config.PREFIX}avt 𝗎𝗌𝖾𝗋 - 𝖦𝖾𝗍 𝗒𝗈𝗎𝗋 𝖺𝗏𝖺𝗍𝖺𝗋
🎭→ ${global.config.PREFIX}avt 𝗎𝗌𝖾𝗋 [@𝗆𝖾𝗇𝗍𝗂𝗈𝗇] - 𝖦𝖾𝗍 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝖾𝖽 𝗎𝗌𝖾𝗋'𝗌 𝖺𝗏𝖺𝗍𝖺𝗋

𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖻𝗒: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽`;
                return message.reply(helpMessage);
            }

            // Create cache directory if it doesn't exist
            const cacheDir = path.join(__dirname, 'cache');
            try {
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }

            const imagePath = path.join(cacheDir, `avt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.png`);

            if (args[0] === "box") {
                try {
                    let threadID = event.threadID;
                    let threadName = "𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉";
                    
                    if (args[1]) {
                        threadID = args[1];
                        try {
                            const threadInfo = await api.getThreadInfo(threadID);
                            threadName = threadInfo.threadName || "𝗎𝗇𝗄𝗇𝗈𝗐𝗇 𝗀𝗋𝗈𝗎𝗉";
                        } catch {
                            threadName = "𝗎𝗇𝗄𝗇𝗈𝗐𝗇 𝗀𝗋𝗈𝗎𝗉";
                        }
                    } else {
                        const threadInfo = await api.getThreadInfo(threadID);
                        threadName = threadInfo.threadName || "𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉";
                    }
                    
                    // Download group avatar with timeout
                    const response = await axios.get(`https://graph.facebook.com/${threadID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
                        responseType: 'arraybuffer',
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });

                    // Check if response is valid image
                    if (!response.data || response.data.length < 1000) {
                        throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗂𝗆𝖺𝗀𝖾 𝖽𝖺𝗍𝖺");
                    }
                    
                    fs.writeFileSync(imagePath, Buffer.from(response.data));

                    // Verify file was written
                    const stats = fs.statSync(imagePath);
                    if (stats.size < 1000) {
                        throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗂𝗆𝖺𝗀𝖾");
                    }
                    
                    await message.reply({
                        body: `✅ 𝖦𝗋𝗈𝗎𝗉 𝖺𝗏𝖺𝗍𝖺𝗋: ${threadName}`,
                        attachment: fs.createReadStream(imagePath)
                    });
                    
                    // Clean up
                    fs.unlinkSync(imagePath);
                    
                } catch (e) {
                    console.error("❌ 𝖦𝗋𝗈𝗎𝗉 𝖺𝗏𝖺𝗍𝖺𝗋 𝖾𝗋𝗋𝗈𝗋:", e.message);
                    await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗀𝗋𝗈𝗎𝗉 𝖺𝗏𝖺𝗍𝖺𝗋");
                }
            }
            else if (args[0] === "id") {
                try {
                    const id = args[1];
                    if (!id) return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗎𝗌𝖾𝗋 𝖨𝖣");
                    
                    // Validate ID format
                    if (!/^\d+$/.test(id)) {
                        return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖨𝖣 𝖿𝗈𝗋𝗆𝖺𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗇𝗎𝗆𝖾𝗋𝗂𝖼 𝖨𝖣.");
                    }
                    
                    // Download user avatar with timeout
                    const response = await axios.get(`https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
                        responseType: 'arraybuffer',
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });

                    // Check if response is valid image
                    if (!response.data || response.data.length < 1000) {
                        throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗂𝗆𝖺𝗀𝖾 𝖽𝖺𝗍𝖺");
                    }
                    
                    fs.writeFileSync(imagePath, Buffer.from(response.data));

                    // Verify file was written
                    const stats = fs.statSync(imagePath);
                    if (stats.size < 1000) {
                        throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗂𝗆𝖺𝗀𝖾");
                    }
                    
                    await message.reply({
                        body: `✅ 𝖴𝗌𝖾𝗋 𝖺𝗏𝖺𝗍𝖺𝗋: ${id}`,
                        attachment: fs.createReadStream(imagePath)
                    });
                    
                    // Clean up
                    fs.unlinkSync(imagePath);
                    
                } catch (e) {
                    console.error("❌ 𝖴𝗌𝖾𝗋 𝖺𝗏𝖺𝗍𝖺𝗋 𝖾𝗋𝗋𝗈𝗋:", e.message);
                    await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝖺𝗏𝖺𝗍𝖺𝗋");
                }
            }
            else if (args[0] === "user") {
                try {
                    let id = event.senderID;
                    let name = "𝖸𝗈𝗎𝗋";
                    
                    if (args[1] && event.mentions) {
                        id = Object.keys(event.mentions)[0];
                        try {
                            const userInfo = await api.getUserInfo(id);
                            name = userInfo[id]?.name || "𝖴𝗌𝖾𝗋";
                        } catch {
                            name = "𝖴𝗌𝖾𝗋";
                        }
                    }
                    
                    // Download user avatar with timeout
                    const response = await axios.get(`https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
                        responseType: 'arraybuffer',
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });

                    // Check if response is valid image
                    if (!response.data || response.data.length < 1000) {
                        throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗂𝗆𝖺𝗀𝖾 𝖽𝖺𝗍𝖺");
                    }
                    
                    fs.writeFileSync(imagePath, Buffer.from(response.data));

                    // Verify file was written
                    const stats = fs.statSync(imagePath);
                    if (stats.size < 1000) {
                        throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗂𝗆𝖺𝗀𝖾");
                    }
                    
                    await message.reply({
                        body: `✅ ${name} 𝖺𝗏𝖺𝗍𝖺𝗋`,
                        attachment: fs.createReadStream(imagePath)
                    });
                    
                    // Clean up
                    fs.unlinkSync(imagePath);
                    
                } catch (e) {
                    console.error("❌ 𝖴𝗌𝖾𝗋 𝖺𝗏𝖺𝗍𝖺𝗋 𝖾𝗋𝗋𝗈𝗋:", e.message);
                    await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝖺𝗏𝖺𝗍𝖺𝗋");
                }
            }
            else {
                await message.reply(`❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗈𝗉𝗍𝗂𝗈𝗇. 𝖴𝗌𝖾 ${global.config.PREFIX}avt 𝖿𝗈𝗋 𝗁𝖾𝗅𝗉`);
            }

        } catch (error) {
            console.error("💥 𝖠𝗏𝖺𝗍𝖺𝗋 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            await message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
        }
    }
};
