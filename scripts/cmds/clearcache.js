const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "clearcache",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 2,
        role: 2,
        category: "system",
        shortDescription: {
            en: "🗑️ 𝖣𝖾𝗅𝖾𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖿𝗂𝗅𝖾(𝗌) 𝖿𝗋𝗈𝗆 𝗍𝗁𝖾 𝖻𝗈𝗍 𝗌𝖺𝖿𝖾𝗅𝗒"
        },
        longDescription: {
            en: "𝖬𝖺𝗇𝖺𝗀𝖾𝗌 𝖺𝗇𝖽 𝖼𝗅𝖾𝖺𝗇𝗌 𝖼𝖺𝖼𝗁𝖾 𝖿𝗂𝗅𝖾𝗌 𝖿𝗋𝗈𝗆 𝗍𝗁𝖾 𝖻𝗈𝗍'𝗌 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒"
        },
        guide: {
            en: "{p}clearcache [𝖿𝗂𝗅𝖾 𝖾𝗑𝗍𝖾𝗇𝗌𝗂𝗈𝗇]"
        },
        dependencies: {
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function({ message, event, args, usersData, api }) {
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

            const cachePath = __dirname + "/cache";
            const allowedUIDs = ["61571630409265"];

            // Check permission with error handling
            let userData;
            try {
                userData = await usersData.get(event.senderID);
            } catch (userError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", userError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗏𝖾𝗋𝗂𝖿𝗒 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            if ((!userData || userData.role < 2) && !allowedUIDs.includes(event.senderID)) {
                return message.reply("❌ 𝖸𝗈𝗎 𝖺𝗋𝖾 𝗇𝗈𝗍 𝖺𝗅𝗅𝗈𝗐𝖾𝖽 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.");
            }

            if (!args[0]) {
                return message.reply("⚠️ 𝖸𝗈𝗎 𝖽𝗂𝖽𝗇'𝗍 𝗌𝗉𝖾𝖼𝗂𝖿𝗒 𝗍𝗁𝖾 𝖿𝗂𝗅𝖾 𝖾𝗑𝗍𝖾𝗇𝗌𝗂𝗈𝗇 𝗍𝗈 𝖽𝖾𝗅𝖾𝗍𝖾!");
            }

            const extension = args[0].toLowerCase().replace(/\./g, '');
            
            // Validate extension
            if (!extension.match(/^[a-zA-Z0-9]+$/)) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖿𝗂𝗅𝖾 𝖾𝗑𝗍𝖾𝗇𝗌𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 𝗈𝗇𝗅𝗒 𝗅𝖾𝗍𝗍𝖾𝗋𝗌 𝖺𝗇𝖽 𝗇𝗎𝗆𝖻𝖾𝗋𝗌.");
            }

            // Create cache directory if it doesn't exist
            try {
                if (!fs.existsSync(cachePath)) {
                    fs.mkdirSync(cachePath, { recursive: true });
                    console.log("✅ 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", cachePath);
                }
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖼𝖼𝖾𝗌𝗌 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }

            let listFile;
            try {
                listFile = fs.readdirSync(cachePath).filter(file => {
                    const fileExt = path.extname(file).toLowerCase().replace('.', '');
                    return fileExt === extension;
                });
            } catch (readError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗋𝖾𝖺𝖽𝗂𝗇𝗀 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", readError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝖺𝖽 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }
            
            if (listFile.length === 0) {
                return message.reply(`ℹ️ 𝖭𝗈 𝖿𝗂𝗅𝖾𝗌 𝖿𝗈𝗎𝗇𝖽 𝗐𝗂𝗍𝗁 .${extension} 𝖾𝗑𝗍𝖾𝗇𝗌𝗂𝗈𝗇.`);
            }

            // Calculate total size
            let totalSize = 0;
            for (const file of listFile) {
                try {
                    const stats = fs.statSync(path.join(cachePath, file));
                    totalSize += stats.size;
                } catch (statsError) {
                    console.warn(`❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗀𝖾𝗍 𝗌𝗍𝖺𝗍𝗌 𝖿𝗈𝗋 ${file}:`, statsError.message);
                }
            }

            const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
            let fileListText = listFile.slice(0, 15).join("\n");
            
            if (listFile.length > 15) {
                fileListText += `\n...𝖺𝗇𝖽 ${listFile.length - 15} 𝗆𝗈𝗋𝖾 𝖿𝗂𝗅𝖾𝗌`;
            }

            const confirmMsg = await message.reply(
                `🗑️ 𝖳𝗁𝖾 𝖿𝗈𝗅𝗅𝗈𝗐𝗂𝗇𝗀 𝖿𝗂𝗅𝖾𝗌 𝗐𝗂𝗅𝗅 𝖻𝖾 𝖽𝖾𝗅𝖾𝗍𝖾𝖽:\n` +
                `📁 𝖤𝗑𝗍𝖾𝗇𝗌𝗂𝗈𝗇: .${extension}\n` +
                `📊 𝖳𝗈𝗍𝖺𝗅 𝖿𝗂𝗅𝖾𝗌: ${listFile.length}\n` +
                `💾 𝖳𝗈𝗍𝖺𝗅 𝗌𝗂𝗓𝖾: ${sizeInMB} 𝖬𝖡\n\n` +
                `${fileListText}\n\n` +
                `𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 '𝖸' 𝗍𝗈 𝖼𝗈𝗇𝖿𝗂𝗋𝗆 𝖽𝖾𝗅𝖾𝗍𝗂𝗈𝗇.\n` +
                `𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝖺𝗇𝗒𝗍𝗁𝗂𝗇𝗀 𝖾𝗅𝗌𝖾 𝗍𝗈 𝖼𝖺𝗇𝖼𝖾𝗅.`
            );
            
            global.client.handleReply.push({
                name: this.config.name,
                messageID: confirmMsg.messageID,
                author: event.senderID,
                extension: extension,
                files: listFile,
                cachePath: cachePath
            });

        } catch (error) {
            console.error("💥 𝖢𝗅𝖾𝖺𝗋𝖢𝖺𝖼𝗁𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
            await message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗍𝗁𝖾 𝗋𝖾𝗊𝗎𝖾𝗌𝗍.");
        }
    },

    onReply: async function({ event, message, Reply }) {
        try {
            if (event.senderID !== Reply.author) {
                return message.reply("❌ 𝖸𝗈𝗎 𝖺𝗋𝖾 𝗇𝗈𝗍 𝖺𝗎𝗍𝗁𝗈𝗋𝗂𝗓𝖾𝖽 𝗍𝗈 𝖼𝗈𝗇𝖿𝗂𝗋𝗆 𝗍𝗁𝗂𝗌 𝗈𝗉𝖾𝗋𝖺𝗍𝗂𝗈𝗇.");
            }

            const { cachePath, extension, files } = Reply;

            if (event.body.toLowerCase() === "y" || event.body.toLowerCase() === "yes") {
                let deletedCount = 0;
                let failedCount = 0;
                let totalFreed = 0;
                
                for (const file of files) {
                    try {
                        const filePath = path.join(cachePath, file);
                        
                        if (fs.existsSync(filePath)) {
                            // Get file size before deletion
                            let fileSize = 0;
                            try {
                                const stats = fs.statSync(filePath);
                                fileSize = stats.size;
                            } catch (statsError) {
                                console.warn(`❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗀𝖾𝗍 𝖿𝗂𝗅𝖾 𝗌𝗂𝗓𝖾 𝖿𝗈𝗋 ${file}:`, statsError.message);
                            }
                            
                            fs.unlinkSync(filePath);
                            deletedCount++;
                            totalFreed += fileSize;
                            console.log(`✅ 𝖣𝖾𝗅𝖾𝗍𝖾𝖽: ${file}`);
                        }
                    } catch (error) {
                        console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝖾𝗅𝖾𝗍𝖾 ${file}:`, error.message);
                        failedCount++;
                    }
                }

                const freedMB = (totalFreed / (1024 * 1024)).toFixed(2);
                
                let resultMessage = `✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖽𝖾𝗅𝖾𝗍𝖾𝖽 ${deletedCount} 𝖿𝗂𝗅𝖾(𝗌) 𝗐𝗂𝗍𝗁 .${extension} 𝖾𝗑𝗍𝖾𝗇𝗌𝗂𝗈𝗇.`;
                
                if (failedCount > 0) {
                    resultMessage += `\n❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝖾𝗅𝖾𝗍𝖾 ${failedCount} 𝖿𝗂𝗅𝖾(𝗌).`;
                }
                
                if (totalFreed > 0) {
                    resultMessage += `\n💾 𝖥𝗋𝖾𝖾𝖽 𝗎𝗉: ${freedMB} 𝖬𝖡 𝗈𝖿 𝗌𝗉𝖺𝖼𝖾.`;
                }

                await message.reply(resultMessage);
                
            } else {
                await message.reply("❌ 𝖮𝗉𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖼𝖺𝗇𝖼𝖾𝗅𝗅𝖾𝖽.");
            }

        } catch (error) {
            console.error("💥 𝖱𝖾𝗉𝗅𝗒 𝖤𝗋𝗋𝗈𝗋:", error);
            await message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗍𝗁𝖾 𝗋𝖾𝗊𝗎𝖾𝗌𝗍.");
        }
    }
};
