const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
    config: {
        name: "fact2",
        aliases: [],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "𝖱𝖺𝗇𝖽𝗈𝗆 𝖿𝖺𝖼𝗍𝗌 𝗂𝗆𝖺𝗀𝖾 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗈𝗋"
        },
        longDescription: {
            en: "𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝗌 𝗂𝗆𝖺𝗀𝖾𝗌 𝗐𝗂𝗍𝗁 𝖿𝖺𝖼𝗍 𝗍𝖾𝗑𝗍 𝗎𝗌𝗂𝗇𝗀 𝖯𝗈𝗉𝖼𝖺𝗍 𝖠𝖯𝖨"
        },
        guide: {
            en: "{p}fact2 [𝗍𝖾𝗑𝗍]"
        },
        dependencies: {
            "fs-extra": "",
            "axios": ""
        }
    },

    onStart: async function({ message, args, event }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("axios");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺 𝖺𝗇𝖽 𝖺𝗑𝗂𝗈𝗌.");
            }

            if (!args[0]) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝖺 𝗍𝖾𝗑𝗍 𝗍𝗈 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖿𝖺𝖼𝗍 𝗂𝗆𝖺𝗀𝖾!");
            }

            const text = args.join(" ").trim();
            
            // Validate text length
            if (text.length > 100) {
                return message.reply("❌ 𝖳𝖾𝗑𝗍 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 100 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
            }

            if (text.length < 2) {
                return message.reply("❌ 𝖳𝖾𝗑𝗍 𝗂𝗌 𝗍𝗈𝗈 𝗌𝗁𝗈𝗋𝗍! 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝖺 𝗆𝖾𝖺𝗇𝗂𝗇𝗀𝖿𝗎𝗅 𝖿𝖺𝖼𝗍.");
            }

            const cacheDir = path.join(__dirname, "cache");
            const filePath = path.join(cacheDir, `fact_${Date.now()}.png`);

            // Ensure cache directory exists
            try {
                await fs.ensureDir(cacheDir);
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }

            console.log(`🎯 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗇𝗀 𝖿𝖺𝖼𝗍 𝗂𝗆𝖺𝗀𝖾 𝖿𝗈𝗋: "${text}"`);

            try {
                const apiUrl = `https://api.popcat.xyz/facts?text=${encodeURIComponent(text)}`;
                console.log(`🔗 𝖠𝖯𝖨 𝖴𝖱𝖫: ${apiUrl}`);

                const response = await axios.get(apiUrl, {
                    responseType: 'arraybuffer',
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'image/png,image/*'
                    },
                    maxContentLength: 10 * 1024 * 1024 // 10MB limit
                });

                // Check content type
                const contentType = response.headers['content-type'];
                if (!contentType || !contentType.includes('image')) {
                    throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗈𝗇𝗍𝖾𝗇𝗍 𝗍𝗒𝗉𝖾: " + contentType);
                }

                await fs.writeFileSync(filePath, Buffer.from(response.data, 'binary'));

                // Verify file was written successfully
                const stats = await fs.stat(filePath);
                if (stats.size === 0) {
                    throw new Error("𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝗂𝗆𝖺𝗀𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                }

                console.log(`✅ 𝖥𝖺𝖼𝗍 𝗂𝗆𝖺𝗀𝖾 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 (${(stats.size / 1024).toFixed(2)}𝖪𝖡)`);

                await message.reply({
                    body: `✨ 𝖥𝖺𝖼𝗍 𝖨𝗆𝖺𝗀𝖾 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒!\n\n📝 𝖳𝖾𝗑𝗍: "${text}"`,
                    attachment: fs.createReadStream(filePath)
                });

                // Clean up file
                try {
                    await fs.unlink(filePath);
                    console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝗂𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾");
                } catch (cleanupError) {
                    console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
                }

            } catch (apiError) {
                console.error("❌ 𝖯𝗈𝗉𝖼𝖺𝗍 𝖠𝖯𝖨 𝖾𝗋𝗋𝗈𝗋:", apiError.message);
                
                let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖿𝖺𝖼𝗍 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
                
                if (apiError.code === 'ECONNREFUSED') {
                    errorMessage = "❌ 𝖢𝖺𝗇𝗇𝗈𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍 𝗍𝗈 𝖯𝗈𝗉𝖼𝖺𝗍 𝖠𝖯𝖨. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
                } else if (apiError.code === 'ETIMEDOUT') {
                    errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
                } else if (apiError.response?.status === 400) {
                    errorMessage = "❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗍𝖾𝗑𝗍 𝗉𝗋𝗈𝗏𝗂𝖽𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺 𝖽𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝖿𝖺𝖼𝗍.";
                } else if (apiError.response?.status === 404) {
                    errorMessage = "❌ 𝖠𝖯𝖨 𝖾𝗇𝖽𝗉𝗈𝗂𝗇𝗍 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
                }
                
                await message.reply(errorMessage);
                
                // Clean up file if it exists
                try {
                    if (await fs.pathExists(filePath)) {
                        await fs.unlink(filePath);
                    }
                } catch (cleanupError) {
                    console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
                }
            }

        } catch (error) {
            console.error("💥 𝖥𝖺𝖼𝗍𝟤 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            // Don't send generic error message to avoid spam
        }
    }
};
