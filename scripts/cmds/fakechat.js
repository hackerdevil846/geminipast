const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
    config: {
        name: "fakechat",
        aliases: [],
        version: "1.4",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖿𝖺𝗄𝖾 𝖬𝖾𝗌𝗌𝖾𝗇𝗀𝖾𝗋 𝗌𝖼𝗋𝖾𝖾𝗇𝗌𝗁𝗈𝗍"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝖺 𝖿𝖺𝗄𝖾 𝖬𝖾𝗌𝗌𝖾𝗇𝗀𝖾𝗋 𝗌𝖼𝗋𝖾𝖾𝗇𝗌𝗁𝗈𝗍 𝗐𝗂𝗍𝗁 𝖴𝖨𝖣/𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝖺𝗇𝖽 𝖼𝗎𝗌𝗍𝗈𝗆 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌"
        },
        category: "𝖿𝗎𝗇",
        guide: {
            en: "{p}fakechat <@𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝗈𝗋 𝖴𝖨𝖣> - <𝗍𝖾𝗑𝗍𝟣> - [𝗍𝖾𝗑𝗍𝟤] - [𝗆𝗈𝖽𝖾=𝖽𝖺𝗋𝗄]\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}fakechat @𝗆𝖾𝗇𝗍𝗂𝗈𝗇 - 𝖧𝖾𝗅𝗅𝗈 - 𝖧𝗈𝗐 𝖺𝗋𝖾 𝗒𝗈𝗎? - 𝖽𝖺𝗋𝗄\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}fakechat 123456789 - 𝖧𝗂 𝗍𝗁𝖾𝗋𝖾! - 𝖳𝗁𝗂𝗌 𝗂𝗌 𝖺 𝗍𝖾𝗌𝗍 - 𝗅𝗂𝗀𝗁𝗍\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}fakechat @𝖿𝗋𝗂𝖾𝗇𝖽 - 𝖦𝗈𝗈𝖽 𝗆𝗈𝗋𝗇𝗂𝗇𝗀! - 𝖽𝖺𝗋𝗄"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "https": ""
        }
    },

    onStart: async function({ args, message, event, api, usersData }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("https");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗇𝖽 𝗁𝗍𝗍𝗉𝗌.");
            }

            if (args.length < 2) {
                return message.reply("⚠️ 𝖴𝗌𝖺𝗀𝖾:\n{p}fakechat <@𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝗈𝗋 𝖴𝖨𝖣> - <𝗍𝖾𝗑𝗍𝟣> - [𝗍𝖾𝗑𝗍𝟤] - [𝗆𝗈𝖽𝖾]\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}fakechat @𝗆𝖾𝗇𝗍𝗂𝗈𝗇 - 𝖧𝖾𝗅𝗅𝗈 - 𝖧𝗈𝗐 𝖺𝗋𝖾 𝗒𝗈𝗎? - 𝖽𝖺𝗋𝗄");
            }

            const input = args.join(" ").split("-").map(i => i.trim());
            let [target, text1, text2 = "", modeRaw = "light"] = input;

            // Validate required fields
            if (!target || !text1) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗍𝖺𝗋𝗀𝖾𝗍 𝖴𝖨𝖣/𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝖺𝗇𝖽 𝖺𝗍 𝗅𝖾𝖺𝗌𝗍 𝗈𝗇𝖾 𝗍𝖾𝗑𝗍.");
            }

            // Get UID from mention or raw input
            let uid;
            if (Object.keys(event.mentions).length > 0) {
                uid = Object.keys(event.mentions)[0];
            } else if (/^\d{6,}$/.test(target)) {
                uid = target;
            } else {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖴𝖨𝖣 𝗈𝗋 𝗆𝖾𝗇𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 𝖺 𝗏𝖺𝗅𝗂𝖽 𝖴𝖨𝖣 𝗈𝗋 𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝖺 𝗎𝗌𝖾𝗋.");
            }

            // Fetch user name from Facebook API
            let name = "𝖴𝗌𝖾𝗋";
            try {
                const userInfo = await api.getUserInfo(uid);
                name = userInfo[uid]?.name || name;
                console.log(`✅ 𝖥𝖾𝗍𝖼𝗁𝖾𝖽 𝗎𝗌𝖾𝗋 𝗇𝖺𝗆𝖾: ${name}`);
            } catch (e) {
                console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝗎𝗌𝖾𝗋 𝗇𝖺𝗆𝖾, 𝗎𝗌𝗂𝗇𝗀 𝖽𝖾𝖿𝖺𝗎𝗅𝗍:", e.message);
            }

            const mode = modeRaw.toLowerCase() === "dark" ? "dark" : "light";

            // 💸 Check and deduct 50 coins
            let userData;
            try {
                userData = await usersData.get(event.senderID);
                const balance = userData?.money || 0;
                
                if (balance < 50) {
                    return message.reply("❌ 𝖸𝗈𝗎 𝗇𝖾𝖾𝖽 𝖺𝗍 𝗅𝖾𝖺𝗌𝗍 50 𝖼𝗈𝗂𝗇𝗌 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.");
                }
                
                await usersData.set(event.senderID, {
                    money: balance - 50
                });
                console.log(`💰 𝖣𝖾𝖽𝗎𝖼𝗍𝖾𝖽 50 𝖼𝗈𝗂𝗇𝗌 𝖿𝗋𝗈𝗆 𝗎𝗌𝖾𝗋 ${event.senderID}`);
            } catch (coinError) {
                console.error("❌ 𝖢𝗈𝗂𝗇 𝖽𝖾𝖽𝗎𝖼𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", coinError);
                return message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝖽𝖾𝖽𝗎𝖼𝗍𝗂𝗇𝗀 𝖼𝗈𝗂𝗇𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            // Prepare API URL
            const apiURL = `https://fchat-5pni.onrender.com/fakechat?uid=${encodeURIComponent(uid)}&name=${encodeURIComponent(name)}&text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}&mode=${mode}`;
            
            console.log(`🔗 𝖠𝖯𝖨 𝖴𝖱𝖫: ${apiURL}`);

            const cacheDir = path.join(__dirname, "tmp");
            try {
                await fs.ensureDir(cacheDir);
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }
            
            const cachePath = path.join(cacheDir, `fchat_${event.senderID}_${Date.now()}.png`);

            const loadingMsg = await message.reply("⏳ 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗇𝗀 𝖿𝖺𝗄𝖾 𝖼𝗁𝖺𝗍 𝗌𝖼𝗋𝖾𝖾𝗇𝗌𝗁𝗈𝗍...");

            return new Promise((resolve, reject) => {
                const file = fs.createWriteStream(cachePath);
                
                const request = https.get(apiURL, (res) => {
                    if (res.statusCode !== 200) {
                        file.close();
                        fs.unlinkSync(cachePath);
                        throw new Error(`𝖠𝖯𝖨 𝗋𝖾𝗍𝗎𝗋𝗇𝖾𝖽 𝗌𝗍𝖺𝗍𝗎𝗌 ${res.statusCode}`);
                    }
                    
                    res.pipe(file);
                    
                    file.on("finish", async () => {
                        file.close(async () => {
                            try {
                                // Verify file was created successfully
                                const stats = await fs.stat(cachePath);
                                if (stats.size === 0) {
                                    throw new Error("𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽 𝗂𝗆𝖺𝗀𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                                }

                                console.log(`✅ 𝖥𝖺𝗄𝖾 𝖼𝗁𝖺𝗍 𝗂𝗆𝖺𝗀𝖾 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 (${(stats.size / 1024).toFixed(2)}𝖪𝖡)`);

                                // Unsend loading message
                                try {
                                    await api.unsendMessage(loadingMsg.messageID);
                                } catch (unsendError) {
                                    console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                                }

                                await message.reply({
                                    body: `🎭 𝖥𝖺𝗄𝖾 𝖢𝗁𝖺𝗍 𝖢𝗋𝖾𝖺𝗍𝖾𝖽\n👤 𝖭𝖺𝗆𝖾: ${name}\n💬 𝖳𝖾𝗑𝗍𝟣: ${text1}${text2 ? `\n💬 𝖳𝖾𝗑𝗍𝟤: ${text2}` : ""}\n🎨 𝖬𝗈𝖽𝖾: ${mode.toUpperCase()}\n💸 -50 𝖼𝗈𝗂𝗇𝗌`,
                                    attachment: fs.createReadStream(cachePath)
                                });

                                // Clean up file
                                try {
                                    await fs.unlink(cachePath);
                                    console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾");
                                } catch (cleanupError) {
                                    console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
                                }

                                resolve();
                            } catch (fileError) {
                                console.error("❌ 𝖥𝗂𝗅𝖾 𝗏𝖾𝗋𝗂𝖿𝗂𝖼𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", fileError);
                                reject(fileError);
                            }
                        });
                    });
                    
                }).on("error", (err) => {
                    console.error("❌ 𝖧𝖳𝖳𝖯𝖲 𝖤𝗋𝗋𝗈𝗋:", err.message);
                    file.close();
                    
                    // Clean up file if it exists
                    if (fs.existsSync(cachePath)) {
                        fs.unlinkSync(cachePath);
                    }
                    
                    reject(err);
                });

                // Set timeout for the request
                request.setTimeout(30000, () => {
                    request.destroy();
                    console.error("❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍");
                    reject(new Error("𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍"));
                });

            }).catch(async (error) => {
                console.error("💥 𝖥𝖺𝗄𝖾𝖼𝗁𝖺𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
                
                // Refund coins on error
                try {
                    const currentBalance = userData?.money || 0;
                    await usersData.set(event.senderID, {
                        money: currentBalance + 50
                    });
                    console.log("💰 𝖱𝖾𝖿𝗎𝗇𝖽𝖾𝖽 50 𝖼𝗈𝗂𝗇𝗌 𝖽𝗎𝖾 𝗍𝗈 𝖾𝗋𝗋𝗈𝗋");
                } catch (refundError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝖿𝗎𝗇𝖽 𝖼𝗈𝗂𝗇𝗌:", refundError);
                }

                // Unsend loading message
                try {
                    await api.unsendMessage(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖿𝖺𝗄𝖾 𝖼𝗁𝖺𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋. 𝖢𝗈𝗂𝗇𝗌 𝗁𝖺𝗏𝖾 𝖻𝖾𝖾𝗇 𝗋𝖾𝖿𝗎𝗇𝖽𝖾𝖽.");
            });

        } catch (error) {
            console.error("💥 𝖥𝖺𝗄𝖾𝖢𝗁𝖺𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            
            // Don't send error message to avoid spam, just log it
        }
    }
};
