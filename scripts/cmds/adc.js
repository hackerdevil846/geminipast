const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
    config: {
        name: "adc",
        aliases: [],
        version: "2.1.0", // Updated version
        author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
        countDown: 5,
        role: 2, // Admin/Owner only
        category: "𝐬𝐲𝐬𝐭𝐞𝐦",
        shortDescription: {
            en: "📥 𝐈𝐧𝐬𝐭𝐚𝐥𝐥/𝐔𝐩𝐝𝐚𝐭𝐞 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬"
        },
        longDescription: {
            en: "Advanced command installer: Download from Pastebin/GitHub, Auto-Backup, Security Check, and Hot-Load."
        },
        guide: {
            en: "{p}adc <filename> <url>\n{p}adc <filename> (Reply to code/file)"
        },
        dependencies: {
            "fs-extra": "",
            "axios": "",
            "path": ""
        }
    },

    onStart: async function({ message, event, args, api }) {
        try {
            // --- 1. Dependency Check ---
            try {
                require("fs-extra");
                require("axios");
                require("path");
            } catch (e) {
                return message.reply("❌ 𝐌𝐢𝐬𝐬𝐢𝐧𝐠 𝐃𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐢𝐞𝐬: Please install fs-extra, axios, and path.");
            }

            // --- 2. Help Menu (Atomic Style) ---
            if (args.length === 0) {
                return message.reply(
                    `╭──────『 𝐀𝐃𝐂 𝐈𝐍𝐒𝐓𝐀𝐋𝐋𝐄𝐑 』──────╮\n` +
                    `│\n` +
                    `│ 📥 𝐔𝐬𝐚𝐠𝐞:\n` +
                    `│ • {p}adc <name> <url>\n` +
                    `│ • {p}adc <name> (Reply to file/link/code)\n` +
                    `│\n` +
                    `│ 🔗 𝐒𝐮𝐩𝐩𝐨𝐫𝐭𝐞𝐝 𝐒𝐨𝐮𝐫𝐜𝐞𝐬:\n` +
                    `│ • Pastebin (Raw/Link)\n` +
                    `│ • GitHub (Raw/Blob)\n` +
                    `│ • Direct File URLs\n` +
                    `│\n` +
                    `╰──────────────────────────────╯`
                );
            }

            const commandName = args[0].toLowerCase();
            let fileUrl = args[1];
            let codeContent = "";

            // --- 3. Handle Replies (Text or Attachment) ---
            if (event.type === "message_reply") {
                const reply = event.messageReply;
                if (reply.attachments && reply.attachments.length > 0) {
                    // Get URL from attachment (js file)
                    fileUrl = reply.attachments[0].url;
                } else if (reply.body) {
                    // Check if body is a URL or Raw Code
                    const body = reply.body;
                    if (body.startsWith('http')) {
                        fileUrl = body;
                    } else {
                        // Treat body as code content directly
                        codeContent = body;
                    }
                }
            }

            // --- 4. Validation ---
            if (!/^[a-z0-9_]+$/.test(commandName)) {
                return message.reply("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐍𝐚𝐦𝐞: Use lowercase letters, numbers, and underscores only.");
            }

            // POINT OF FIX: Use __dirname to target the actual commands folder directly
            const commandsDir = __dirname; 
            const filePath = path.join(commandsDir, `${commandName}.js`);

            // --- 5. Backup/Create Mode (If no URL/Code provided) ---
            // If user just types "adc cmdname" without content, try to backup existing
            if (!fileUrl && !codeContent) {
                if (fs.existsSync(filePath)) {
                     try {
                        const currentData = await fs.readFile(filePath, "utf-8");
                        const backupDir = path.join(commandsDir, "cache", "backups");
                        await fs.ensureDir(backupDir); 
                        
                        const backupPath = path.join(backupDir, `${commandName}_${Date.now()}.js`);
                        await fs.writeFile(backupPath, currentData);

                        return message.reply({
                            body: `✅ 𝐁𝐚𝐜𝐤𝐮𝐩 𝐂𝐫𝐞𝐚𝐭𝐞𝐝:\n📂 ${path.basename(backupPath)}`,
                            attachment: fs.createReadStream(backupPath)
                        });
                    } catch (err) {
                        return message.reply(`❌ 𝐁𝐚𝐜𝐤𝐮𝐩 𝐅𝐚𝐢𝐥𝐞𝐝: ${err.message}`);
                    }
                } else {
                     return message.reply(`❌ 𝐅𝐢𝐥𝐞 𝐍𝐨𝐭 𝐅𝐨𝐮𝐧𝐝: "${commandName}.js" does not exist. Provide URL or Code to install.`);
                }
            }

            // --- 6. Download Logic ---
            try {
                let finalContent = codeContent;

                if (fileUrl) {
                    // Smart URL Processing
                    // Fix Pastebin
                    if (fileUrl.includes('pastebin.com') && !fileUrl.includes('/raw/')) {
                         const pasteId = fileUrl.split('/').pop();
                         fileUrl = `https://pastebin.com/raw/${pasteId}`;
                    }
                    // Fix GitHub Blob
                    if (fileUrl.includes('github.com') && fileUrl.includes('/blob/')) {
                        fileUrl = fileUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
                    }

                    message.reply(`📥 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 from: ${fileUrl.substring(0, 30)}...`);

                    // POINT OF FIX: responseType: 'text' to prevent axios trying to parse JSON
                    const response = await axios.get(fileUrl, { 
                        responseType: 'text',
                        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
                    });
                    finalContent = response.data;
                }

                if (!finalContent || typeof finalContent !== 'string' || finalContent.trim().length === 0) {
                    return message.reply("❌ 𝐄𝐫𝐫𝐨𝐫: Received empty or invalid content.");
                }

                // --- 7. Security & Validity Check ---
                // Check if it's a valid bot command structure
                if (!finalContent.includes('module.exports') || (!finalContent.includes('config') && !finalContent.includes('onStart'))) {
                    return message.reply("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐅𝐨𝐫𝐦𝐚𝐭: Code missing 'module.exports' or 'config/onStart'.");
                }

                // Dangerous patterns check
                const dangerous = ['process.exit', 'child_process', 'execSync', 'spawnSync', 'eval('];
                const found = dangerous.filter(d => finalContent.includes(d));
                
                if (found.length > 0) {
                    return message.reply(`❌ 𝐒𝐞𝐜𝐮𝐫𝐢𝐭𝐲 𝐀𝐥𝐞𝐫𝐭: Blocked code containing: ${found.join(', ')}`);
                }

                // --- 8. Installation ---
                // Auto-Backup before overwrite
                if (fs.existsSync(filePath)) {
                    const backupDir = path.join(commandsDir, "cache", "backups");
                    await fs.ensureDir(backupDir);
                    await fs.copy(filePath, path.join(backupDir, `${commandName}.old.js`));
                }

                await fs.writeFile(filePath, finalContent, "utf-8");
                
                // Verify Write
                if (!fs.existsSync(filePath)) throw new Error("File write verification failed.");
                
                // Get File Size
                const stats = fs.statSync(filePath);
                const sizeKB = (stats.size / 1024).toFixed(2);

                return message.reply(
                    `✅ 𝐈𝐧𝐬𝐭𝐚𝐥𝐥𝐚𝐭𝐢𝐨𝐧 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥!\n` +
                    `━━━━━━━━━━━━━━━━━━\n` +
                    `📂 𝐍𝐚𝐦𝐞: ${commandName}.js\n` +
                    `💾 𝐒𝐢𝐳𝐞: ${sizeKB} KB\n` +
                    `━━━━━━━━━━━━━━━━━━\n` +
                    `⚠️ 𝐓𝐨 𝐋𝐨𝐚𝐝: Use command '${global.config.PREFIX}load ${commandName}'`
                );

            } catch (err) {
                console.error(err);
                return message.reply(`❌ 𝐅𝐚𝐢𝐥𝐞𝐝: ${err.message}`);
            }

        } catch (e) {
            console.error(e);
            return message.reply("❌ 𝐂𝐫𝐢𝐭𝐢𝐜𝐚𝐥 𝐄𝐫𝐫𝐨𝐫 in ADC.");
        }
    }
};
