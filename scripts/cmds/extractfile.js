const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "extractfile",
        aliases: [],
        version: "1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "𝖤𝗑𝗍𝗋𝖺𝖼𝗍 𝖿𝗂𝗅𝖾 𝖼𝗈𝗇𝗍𝖾𝗇𝗍𝗌"
        },
        longDescription: {
            en: "𝖤𝗑𝗍𝗋𝖺𝖼𝗍 𝖺𝗇𝖽 𝗏𝗂𝖾𝗐 𝗍𝗁𝖾 𝖼𝗈𝗇𝗍𝖾𝗇𝗍𝗌 𝗈𝖿 𝖺 𝖿𝗂𝗅𝖾"
        },
        category: "owner",
        guide: {
            en: "{p}extractfile <𝖿𝗂𝗅𝖾𝗇𝖺𝗆𝖾>"
        },
        dependencies: {
            "fs": "",
            "path": ""
        }
    },

    onStart: async function ({ message, args, event }) {
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

            const permission = ["61571630409265"];
            if (!permission.includes(event.senderID)) {
                return message.reply("⩸__ ✨🦋 𝖸𝗈𝗎 𝖽𝖺𝗋𝖾 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝗌𝖺𝖼𝗋𝖾𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽!? 💥\n\n⚠️ 𝖮𝗇𝗅𝗒 𝗍𝗁𝖾 𝗆𝗒𝗍𝗁, 𝗍𝗁𝖾 𝗅𝖾𝗀𝖾𝗇𝖽 — 🧧 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽 🧧 — 𝗁𝗈𝗅𝖽𝗌 𝗍𝗁𝖾 𝗄𝖾𝗒 𝗍𝗈 𝗎𝗇𝗅𝖾𝖺𝗌𝗁 𝗍𝗁𝗂𝗌 𝗉𝗈𝗐𝖾𝗋~! 🗝️\n\n💢 𝗌𝗍𝖺𝗇𝖽 𝖽𝗈𝗐𝗇, 𝗆𝗈𝗋𝗍𝖺𝗅... 𝗈𝗋 𝖿𝖺𝖼𝖾 𝗍𝗁𝖾 𝖼𝗎𝗋𝗌𝖾 𝗈𝖿 𝗍𝗁𝖾 𝖿𝗈𝗋𝖻𝗂𝖽𝖽𝖾𝗇 𝖿𝗂𝗅𝖾 💀");
            }

            const fileName = args[0];
            if (!fileName) {
                return message.reply("🔰 𝖯𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝖿𝗂𝗅𝖾 𝗇𝖺𝗆𝖾!");
            }

            // Security: Prevent directory traversal attacks
            if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖿𝗂𝗅𝖾 𝗇𝖺𝗆𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 𝗈𝗇𝗅𝗒 𝖻𝖺𝗌𝖾 𝗇𝖺𝗆𝖾𝗌 𝗐𝗂𝗍𝗁𝗈𝗎𝗍 𝗉𝖺𝗍𝗁 𝗍𝗋𝖺𝗏𝖾𝗋𝗌𝖺𝗅.");
            }

            // Security: Prevent accessing system files
            const forbiddenExtensions = ['.exe', '.bat', '.sh', '.cmd', '.bin', '.dll', '.sys'];
            const fileExtension = path.extname(fileName).toLowerCase();
            if (forbiddenExtensions.includes(fileExtension)) {
                return message.reply("❌ 𝖠𝖼𝖼𝖾𝗌𝗌 𝗍𝗈 𝗍𝗁𝗂𝗌 𝖿𝗂𝗅𝖾 𝗍𝗒𝗉𝖾 𝗂𝗌 𝗋𝖾𝗌𝗍𝗋𝗂𝖼𝗍𝖾𝖽 𝖿𝗈𝗋 𝗌𝖾𝖼𝗎𝗋𝗂𝗍𝗒.");
            }

            const filePath = __dirname + `/${fileName}.js`;
            
            // Additional security check
            const normalizedPath = path.normalize(filePath);
            if (!normalizedPath.startsWith(__dirname)) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖿𝗂𝗅𝖾 𝗉𝖺𝗍𝗁. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 𝗏𝖺𝗅𝗂𝖽 𝖿𝗂𝗅𝖾 𝗇𝖺𝗆𝖾𝗌.");
            }

            if (!fs.existsSync(filePath)) {
                return message.reply(`❌ 𝖥𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽: ${fileName}.𝗃𝗌`);
            }

            // Check if it's actually a file and not a directory
            const stats = fs.statSync(filePath);
            if (!stats.isFile()) {
                return message.reply("❌ 𝖳𝗁𝖾 𝗌𝗉𝖾𝖼𝗂𝖿𝗂𝖾𝖽 𝗉𝖺𝗍𝗁 𝗂𝗌 𝗇𝗈𝗍 𝖺 𝖿𝗂𝗅𝖾.");
            }

            // Check file size to prevent memory issues
            const fileSize = stats.size;
            const maxFileSize = 50 * 1024; // 50KB limit
            if (fileSize > maxFileSize) {
                return message.reply(`❌ 𝖥𝗂𝗅𝖾 𝗂𝗌 𝗍𝗈𝗈 𝗅𝖺𝗋𝗀𝖾 (${(fileSize / 1024).toFixed(2)}𝖪𝖡). 𝖬𝖺𝗑𝗂𝗆𝗎𝗆 𝖺𝗅𝗅𝗈𝗐𝖾𝖽: 50𝖪𝖡.`);
            }

            // Read file with encoding validation
            let fileContent;
            try {
                fileContent = fs.readFileSync(filePath, 'utf8');
                
                // Validate that the content is readable text
                if (!fileContent || fileContent.trim().length === 0) {
                    return message.reply("❌ 𝖥𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒 𝗈𝗋 𝖼𝗈𝗇𝗍𝖺𝗂𝗇𝗌 𝗇𝗈 𝗋𝖾𝖺𝖽𝖺𝖻𝗅𝖾 𝖼𝗈𝗇𝗍𝖾𝗇𝗍.");
                }

                // Check for binary content (non-printable characters)
                const nonPrintableChars = fileContent.match(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g);
                if (nonPrintableChars && nonPrintableChars.length > fileContent.length * 0.1) {
                    return message.reply("❌ 𝖥𝗂𝗅𝖾 𝖺𝗉𝗉𝖾𝖺𝗋𝗌 𝗍𝗈 𝖼𝗈𝗇𝗍𝖺𝗂𝗇 𝖻𝗂𝗇𝖺𝗋𝗒 𝖽𝖺𝗍𝖺. 𝖢𝖺𝗇𝗇𝗈𝗍 𝖽𝗂𝗌𝗉𝗅𝖺𝗒.");
                }

            } catch (readError) {
                console.error("𝖥𝗂𝗅𝖾 𝗋𝖾𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", readError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝖺𝖽 𝖿𝗂𝗅𝖾. 𝖨𝗍 𝗆𝖺𝗒 𝖼𝗈𝗇𝗍𝖺𝗂𝗇 𝗂𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌 𝗈𝗋 𝖻𝖾 𝖻𝗂𝗇𝖺𝗋𝗒.");
            }

            // Split large content into multiple messages if needed
            const maxMessageLength = 20000; // Facebook message limit
            if (fileContent.length > maxMessageLength) {
                const chunks = [];
                for (let i = 0; i < fileContent.length; i += maxMessageLength) {
                    chunks.push(fileContent.substring(i, i + maxMessageLength));
                }
                
                await message.reply(`📁 𝖥𝗂𝗅𝖾: ${fileName}.𝗃𝗌\n📊 𝖲𝗂𝗓𝖾: ${(fileSize / 1024).toFixed(2)}𝖪𝖡\n🔢 𝖢𝗁𝗎𝗇𝗄𝗌: ${chunks.length}\n\n📋 𝖢𝗈𝗇𝗍𝖾𝗇𝗍 (𝗉𝖺𝗋𝗍 𝟣/${chunks.length}):`);
                
                for (let i = 0; i < chunks.length; i++) {
                    if (i > 0) {
                        await message.reply({
                            body: `📋 𝖢𝗈𝗇𝗍𝖾𝗇𝗍 (𝗉𝖺𝗋𝗍 ${i + 1}/${chunks.length}):\n${chunks[i]}`
                        });
                    } else {
                        await message.reply(chunks[i]);
                    }
                    // Small delay to avoid rate limiting
                    if (i < chunks.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            } else {
                await message.reply({
                    body: `📁 𝖥𝗂𝗅𝖾: ${fileName}.𝗃𝗌\n📊 𝖲𝗂𝗓𝖾: ${(fileSize / 1024).toFixed(2)}𝖪𝖡\n\n${fileContent}`
                });
            }

            console.log(`✅ 𝖥𝗂𝗅𝖾 𝖾𝗑𝗍𝗋𝖺𝖼𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒: ${fileName}.𝗃𝗌`);

        } catch (error) {
            console.error("💥 𝖤𝗑𝗍𝗋𝖺𝖼𝗍𝖥𝗂𝗅𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖾𝗑𝗍𝗋𝖺𝖼𝗍 𝖿𝗂𝗅𝖾.";
            
            if (error.code === 'ENOENT') {
                errorMessage = "❌ 𝖥𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽.";
            } else if (error.code === 'EACCES') {
                errorMessage = "❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖽𝖾𝗇𝗂𝖾𝖽.";
            } else if (error.code === 'ENOMEM') {
                errorMessage = "❌ 𝖥𝗂𝗅𝖾 𝗍𝗈𝗈 𝗅𝖺𝗋𝗀𝖾 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
