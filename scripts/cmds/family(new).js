const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "family",
        aliases: [],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 10,
        role: 0,
        category: "image",
        shortDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝖺 𝖿𝖺𝗆𝗂𝗅𝗒 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗀𝗋𝗈𝗎𝗉 𝗆𝖾𝗆𝖻𝖾𝗋𝗌"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾𝗌 𝖺 𝖼𝗈𝗅𝗅𝖺𝗀𝖾 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝖺𝗅𝗅 𝗀𝗋𝗈𝗎𝗉 𝗆𝖾𝗆𝖻𝖾𝗋𝗌' 𝖺𝗏𝖺𝗍𝖺𝗋𝗌"
        },
        guide: {
            en: "{p}family [𝗌𝗂𝗓𝖾] [𝖼𝗈𝗅𝗈𝗋] [𝗍𝗂𝗍𝗅𝖾]"
        },
        dependencies: {
            "fs-extra": "", 
            "axios": "", 
            "canvas": "", 
            "jimp": ""
        }
    },

    onStart: async function({ message, event, args, api }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("axios");
                require("canvas");
                require("jimp");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗑𝗂𝗈𝗌, 𝖼𝖺𝗇𝗏𝖺𝗌, 𝖺𝗇𝖽 𝗃𝗂𝗆𝗉.");
            }

            const { threadID } = event;
            
            // Show help if no arguments or help requested
            if (!args[0] || args[0] === "help") {
                const helpMessage = `🎨 𝖥𝖺𝗆𝗂𝗅𝗒 𝖨𝗆𝖺𝗀𝖾 𝖢𝗋𝖾𝖺𝗍𝗈𝗋\n\n` +
                                  `𝖴𝗌𝖺𝗀𝖾: ${global.config.PREFIX}family [𝗌𝗂𝗓𝖾] [𝖼𝗈𝗅𝗈𝗋] [𝗍𝗂𝗍𝗅𝖾]\n\n` +
                                  `• 𝗌𝗂𝗓𝖾: 𝖲𝗂𝗓𝖾 𝗈𝖿 𝖾𝖺𝖼𝗁 𝖺𝗏𝖺𝗍𝖺𝗋 (𝖽𝖾𝖿𝖺𝗎𝗅𝗍: 100)\n` +
                                  `• 𝖼𝗈𝗅𝗈𝗋: 𝖧𝖾𝗑 𝖼𝗈𝗅𝗈𝗋 𝖼𝗈𝖽𝖾 (𝖽𝖾𝖿𝖺𝗎𝗅𝗍: #000000)\n` +
                                  `• 𝗍𝗂𝗍𝗅𝖾: 𝖨𝗆𝖺𝗀𝖾 𝗍𝗂𝗍𝗅𝖾 (𝖽𝖾𝖿𝖺𝗎𝗅𝗍: 𝗀𝗋𝗈𝗎𝗉 𝗇𝖺𝗆𝖾)\n\n` +
                                  `𝖤𝗑𝖺𝗆𝗉𝗅𝖾: ${global.config.PREFIX}family 150 #ffffff 𝖮𝗎𝗋 𝖥𝖺𝗆𝗂𝗅𝗒`;
                
                return message.reply(helpMessage);
            }

            // Get thread info
            let threadInfo;
            try {
                threadInfo = await api.getThreadInfo(threadID);
            } catch (threadError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈:", threadError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            const participantIDs = threadInfo.participantIDs || [];
            const adminIDs = threadInfo.adminIDs ? threadInfo.adminIDs.map(admin => admin.id) : [];
            
            if (participantIDs.length === 0) {
                return message.reply("❌ 𝖭𝗈 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝖿𝗈𝗎𝗇𝖽 𝗂𝗇 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉.");
            }

            // Default values
            const size = parseInt(args[0]) || 100;
            const color = args[1] && args[1].startsWith('#') ? args[1] : "#000000";
            const title = args.slice(args[1] && args[1].startsWith('#') ? 2 : 1).join(" ") || threadInfo.threadName || "𝖥𝖺𝗆𝗂𝗅𝗒";

            // Validate size
            if (size < 50 || size > 300) {
                return message.reply("❌ 𝖲𝗂𝗓𝖾 𝗆𝗎𝗌𝗍 𝖻𝖾 𝖻𝖾𝗍𝗐𝖾𝖾𝗇 50 𝖺𝗇𝖽 300 𝗉𝗑.");
            }

            // Create cache directory
            const cacheDir = path.join(__dirname, 'cache');
            try {
                await fs.ensureDir(cacheDir);
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }

            // Show processing message
            const processingMsg = await message.reply(`🔄 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖿𝖺𝗆𝗂𝗅𝗒 𝗂𝗆𝖺𝗀𝖾...\n📊 𝖬𝖾𝗆𝖻𝖾𝗋𝗌: ${participantIDs.length}\n🎨 𝖲𝗂𝗓𝖾: ${size}𝗉𝗑\n🌈 𝖢𝗈𝗅𝗈𝗋: ${color}`);

            // Background and frame images
            const backgroundUrl = "https://i.ibb.co/xqrFW4N/Pics-Art-06-26-12-07-26.jpg";
            const frameUrl = "https://i.ibb.co/H41cdDM/1624768781720.png";
            
            try {
                // Load background and frame
                const [background, frame] = await Promise.all([
                    loadImage(backgroundUrl),
                    loadImage(frameUrl)
                ]);

                const canvas = createCanvas(background.width, background.height);
                const ctx = canvas.getContext('2d');
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                // Draw avatars
                let x = 10;
                let y = 200;
                const spacing = 10;
                let drawnCount = 0;
                let deadAccounts = 0;

                // Register font
                try {
                    registerFont(path.join(__dirname, 'cache', 'Arial.ttf'), { family: 'Arial' });
                } catch (fontError) {
                    console.warn("𝖥𝗈𝗇𝗍 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽, 𝗎𝗌𝗂𝗇𝗀 𝖽𝖾𝖿𝖺𝗎𝗅𝗍 𝖿𝗈𝗇𝗍");
                }

                for (const userID of participantIDs) {
                    if (drawnCount >= 100) break; // Limit to 100 avatars
                    
                    try {
                        let avatarBuffer;
                        let avatarSuccess = false;
                        
                        // Try multiple avatar sources
                        const avatarSources = [
                            `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                            `https://graph.facebook.com/${userID}/picture?width=512&height=512`,
                            `https://api.apkvips.com/api/avatar.php?id=${userID}`
                        ];

                        for (const source of avatarSources) {
                            try {
                                const avatarResponse = await axios.get(source, {
                                    responseType: 'arraybuffer',
                                    timeout: 10000
                                });
                                
                                avatarBuffer = Buffer.from(avatarResponse.data);
                                
                                // Check if it's a valid image
                                if (avatarBuffer.length > 1000) {
                                    avatarSuccess = true;
                                    break;
                                }
                            } catch (sourceError) {
                                continue;
                            }
                        }

                        if (!avatarSuccess) {
                            deadAccounts++;
                            continue;
                        }

                        const avatar = await loadImage(avatarBuffer);
                        ctx.drawImage(avatar, x, y, size, size);

                        // Add frame for admins
                        if (adminIDs.includes(userID)) {
                            ctx.drawImage(frame, x, y, size, size);
                        }
                        
                        x += size + spacing;
                        if (x + size > canvas.width) {
                            x = 10;
                            y += size + spacing;
                        }
                        
                        drawnCount++;
                        
                    } catch (error) {
                        console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 ${userID}:`, error.message);
                        deadAccounts++;
                    }
                }

                if (drawnCount === 0) {
                    await message.unsendMessage(processingMsg.messageID);
                    return message.reply("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗅𝗈𝖺𝖽 𝖺𝗇𝗒 𝖺𝗏𝖺𝗍𝖺𝗋𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
                }

                // Add title
                ctx.font = "𝖻𝗈𝗅𝖽 60𝗉𝗑 𝖠𝗋𝗂𝖺𝗅";
                ctx.fillStyle = color;
                ctx.textAlign = "𝖼𝖾𝗇𝗍𝖾𝗋";
                ctx.fillText(title, canvas.width / 2, 100);

                // Save and optimize image with jimp
                const buffer = canvas.toBuffer();
                const image = await jimp.read(buffer);
                const outputPath = path.join(cacheDir, `family_${threadID}_${Date.now()}.png`);
                
                await image.writeAsync(outputPath);

                // Unsend processing message
                try {
                    await message.unsendMessage(processingMsg.messageID);
                } catch (unsendError) {
                    console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                // Send result
                await message.reply({
                    body: `✅ 𝖥𝖺𝗆𝗂𝗅𝗒 𝖨𝗆𝖺𝗀𝖾 𝖢𝗋𝖾𝖺𝗍𝖾𝖽\n👥 𝖬𝖾𝗆𝖻𝖾𝗋𝗌: ${drawnCount}/${participantIDs.length}\n💀 𝖣𝖾𝖺𝖽 𝖠𝖼𝖼𝗈𝗎𝗇𝗍𝗌: ${deadAccounts}\n📏 𝖲𝗂𝗓𝖾: ${size}𝗉𝗑\n🎨 𝖢𝗈𝗅𝗈𝗋: ${color}`,
                    attachment: fs.createReadStream(outputPath)
                });

                // Clean up
                try {
                    await fs.unlink(outputPath);
                } catch (cleanupError) {
                    console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾:", cleanupError.message);
                }

            } catch (imageError) {
                console.error("💥 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", imageError);
                await message.unsendMessage(processingMsg.messageID);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖿𝖺𝗆𝗂𝗅𝗒 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

        } catch (error) {
            console.error("💥 𝖥𝖺𝗆𝗂𝗅𝗒 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖿𝖺𝗆𝗂𝗅𝗒 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
        }
    }
};
