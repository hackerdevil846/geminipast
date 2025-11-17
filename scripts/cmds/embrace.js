const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "embrace",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "love",
        shortDescription: {
            en: "𝖤𝗆𝖻𝗋𝖺𝖼𝖾 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝗒𝗈𝗎 𝗐𝖺𝗇𝗍"
        },
        longDescription: {
            en: "𝖲𝖾𝗇𝖽 𝖺𝗇 𝖾𝗆𝖻𝗋𝖺𝖼𝖾 𝗍𝗈 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝗒𝗈𝗎 𝗆𝖾𝗇𝗍𝗂𝗈𝗇"
        },
        guide: {
            en: "{p}embrace @𝗍𝖺𝗀"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ api, event, args, message }) {
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

            const mention = Object.keys(event.mentions)[0];
            if (!mention) {
                return message.reply("𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝖺𝗀 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝗍𝗈 𝖾𝗆𝖻𝗋𝖺𝖼𝖾!");
            }

            const tag = event.mentions[mention].replace("@", "");
            const links = [
                "https://genk.mediacdn.vn/2016/04-1483112033497.gif",
                "https://i.pinimg.com/originals/85/72/a1/8572a1d1ebaa45fae290e6760b59caac.gif",
                "https://media1.tenor.com/m/5UynzQqlOp0AAAAC/hug-anime.gif",
                "https://media1.tenor.com/m/7SKkE4eWqjMAAAAC/hug-love.gif",
                "https://media1.tenor.com/m/7SKkE4eWqjMAAAAC/hug-love.gif"
            ];
            
            const url = links[Math.floor(Math.random() * links.length)];
            const cacheDir = path.join(__dirname, "cache");
            const filePath = path.join(cacheDir, `embrace_${Date.now()}.gif`);

            // Ensure cache directory exists
            try {
                await fs.ensureDir(cacheDir);
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }

            console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖾𝗆𝖻𝗋𝖺𝖼𝖾 𝖦𝖨𝖥 𝖿𝗋𝗈𝗆: ${url}`);

            try {
                const response = await axios({
                    method: 'GET',
                    url: url,
                    responseType: 'stream',
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'image/gif,image/*'
                    }
                });

                const writer = fs.createWriteStream(filePath);
                response.data.pipe(writer);

                await new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });

                // Verify file was written successfully
                const stats = await fs.stat(filePath);
                if (stats.size === 0) {
                    throw new Error("𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖿𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                }

                console.log(`✅ 𝖦𝖨𝖥 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 (${(stats.size / 1024 / 1024).toFixed(2)}𝖬𝖡)`);

                await message.reply({
                    body: `${tag} 💖, 𝖨 𝗐𝖺𝗇𝗍 𝗍𝗈 𝖾𝗆𝖻𝗋𝖺𝖼𝖾 𝗒𝗈𝗎!`,
                    mentions: [{
                        tag: tag,
                        id: mention
                    }],
                    attachment: fs.createReadStream(filePath)
                });

                // Clean up file
                try {
                    await fs.unlink(filePath);
                    console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖦𝖨𝖥 𝖿𝗂𝗅𝖾");
                } catch (cleanupError) {
                    console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
                }

            } catch (downloadError) {
                console.error("❌ 𝖦𝖨𝖥 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", downloadError.message);
                
                // Try fallback URLs if first one fails
                let success = false;
                for (let i = 0; i < links.length; i++) {
                    if (i === 0) continue; // Skip the first one since it already failed
                    
                    try {
                        console.log(`🔄 𝖳𝗋𝗒𝗂𝗇𝗀 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖴𝖱𝖫 ${i + 1}: ${links[i]}`);
                        
                        const fallbackResponse = await axios({
                            method: 'GET',
                            url: links[i],
                            responseType: 'stream',
                            timeout: 30000
                        });

                        const writer = fs.createWriteStream(filePath);
                        fallbackResponse.data.pipe(writer);

                        await new Promise((resolve, reject) => {
                            writer.on('finish', resolve);
                            writer.on('error', reject);
                        });

                        const stats = await fs.stat(filePath);
                        if (stats.size > 0) {
                            console.log(`✅ 𝖥𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖦𝖨𝖥 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒`);
                            
                            await message.reply({
                                body: `${tag} 💖, 𝖨 𝗐𝖺𝗇𝗍 𝗍𝗈 𝖾𝗆𝖻𝗋𝖺𝖼𝖾 𝗒𝗈𝗎!`,
                                mentions: [{
                                    tag: tag,
                                    id: mention
                                }],
                                attachment: fs.createReadStream(filePath)
                            });

                            await fs.unlink(filePath);
                            success = true;
                            break;
                        }
                    } catch (fallbackError) {
                        console.error(`❌ 𝖥𝖺𝗅𝗅𝖻𝖺𝖼𝗄 ${i + 1} 𝖿𝖺𝗂𝗅𝖾𝖽:`, fallbackError.message);
                    }
                }

                if (!success) {
                    // Send text-only message if all GIFs fail
                    await message.reply({
                        body: `${tag} 💖, 𝖨 𝗐𝖺𝗇𝗍 𝗍𝗈 𝖾𝗆𝖻𝗋𝖺𝖼𝖾 𝗒𝗈𝗎! 🫂`,
                        mentions: [{
                            tag: tag,
                            id: mention
                        }]
                    });
                }

            }

        } catch (error) {
            console.error("💥 𝖤𝗆𝖻𝗋𝖺𝖼𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
            
            // Don't send error message to avoid spam, just log it
        }
    }
};
