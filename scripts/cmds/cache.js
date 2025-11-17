const fs = require("fs-extra");
const { promisify } = require("util");

module.exports = {
    config: {
        name: "cache",
        aliases: [],
        version: "1.1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 3,
        role: 2,
        category: "system",
        shortDescription: {
            en: "📁 𝖬𝖺𝗇𝖺𝗀𝖾 𝖼𝖺𝖼𝗁𝖾 𝖿𝗈𝗅𝖽𝖾𝗋 𝖿𝗂𝗅𝖾𝗌 𝖺𝗇𝖽 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗂𝖾𝗌"
        },
        longDescription: {
            en: "📁 𝖬𝖺𝗇𝖺𝗀𝖾𝗌 𝖼𝖺𝖼𝗁𝖾 𝖿𝗈𝗅𝖽𝖾𝗋 𝖿𝗂𝗅𝖾𝗌 𝖺𝗇𝖽 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗂𝖾𝗌 𝗐𝗂𝗍𝗁 𝗏𝖺𝗋𝗂𝗈𝗎𝗌 𝖿𝗂𝗅𝗍𝖾𝗋𝗌"
        },
        guide: {
            en: "{p}cache [𝗌𝗍𝖺𝗋𝗍|𝖾𝗑𝗍|𝗁𝖾𝗅𝗉] [𝗍𝖾𝗑𝗍]"
        },
        dependencies: {
            "fs-extra": "",
            "util": ""
        },
        envConfig: {
            allowedUsers: ["61571630409265"]
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("util");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺 𝖺𝗇𝖽 𝗎𝗍𝗂𝗅.");
            }

            const cachePath = `${__dirname}/cache`;
            
            // Permission check
            if (!this.config.envConfig.allowedUsers.includes(event.senderID)) {
                return message.reply("⛔ 𝖠𝖼𝖼𝖾𝗌𝗌 𝖣𝖾𝗇𝗂𝖾𝖽: 𝖸𝗈𝗎 𝖽𝗈𝗇'𝗍 𝗁𝖺𝗏𝖾 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽");
            }

            // Help command
            if (args[0] === "help") {
                const helpMsg = `
🔄 𝖢𝖠𝖢𝖧𝖤 𝖬𝖠𝖭𝖠𝖦𝖤𝖬𝖤𝖭𝖳 𝖲𝖸𝖲𝖳𝖤𝖬

▸ 𝖼𝖺𝖼𝗁𝖾 𝗌𝗍𝖺𝗋𝗍 <𝗍𝖾𝗑𝗍>
   ↳ 𝖥𝗂𝗅𝗍𝖾𝗋 𝖿𝗂𝗅𝖾𝗌 𝗌𝗍𝖺𝗋𝗍𝗂𝗇𝗀 𝗐𝗂𝗍𝗁 𝗍𝖾𝗑𝗍
   ↳ 𝖤𝗑𝖺𝗆𝗉𝗅𝖾: 𝖼𝖺𝖼𝗁𝖾 𝗌𝗍𝖺𝗋𝗍 𝖺𝖻𝖼

▸ 𝖼𝖺𝖼𝗁𝖾 𝖾𝗑𝗍 <𝖾𝗑𝗍𝖾𝗇𝗌𝗂𝗈𝗇>
   ↳ 𝖥𝗂𝗅𝗍𝖾𝗋 𝖿𝗂𝗅𝖾𝗌 𝖻𝗒 𝖾𝗑𝗍𝖾𝗇𝗌𝗂𝗈𝗇
   ↳ 𝖤𝗑𝖺𝗆𝗉𝗅𝖾: 𝖼𝖺𝖼𝗁𝖾 𝖾𝗑𝗍 .𝗉𝗇𝗀

▸ 𝖼𝖺𝖼𝗁𝖾 <𝗍𝖾𝗑𝗍>
   ↳ 𝖥𝗂𝗅𝗍𝖾𝗋 𝖿𝗂𝗅𝖾𝗌 𝖼𝗈𝗇𝗍𝖺𝗂𝗇𝗂𝗇𝗀 𝗍𝖾𝗑𝗍
   ↳ 𝖤𝗑𝖺𝗆𝗉𝗅𝖾: 𝖼𝖺𝖼𝗁𝖾 𝗍𝖾𝗌𝗍

▸ 𝖼𝖺𝖼𝗁𝖾
   ↳ 𝖫𝗂𝗌𝗍 𝖺𝗅𝗅 𝖼𝖺𝖼𝗁𝖾 𝖿𝗂𝗅𝖾𝗌

▸ 𝖼𝖺𝖼𝗁𝖾 𝗁𝖾𝗅𝗉
   ↳ 𝖲𝗁𝗈𝗐 𝗍𝗁𝗂𝗌 𝗁𝖾𝗅𝗉 𝗆𝖾𝗌𝗌𝖺𝗀𝖾

📝 𝖭𝖮𝖳𝖤: 𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗇𝗎𝗆𝖻𝖾𝗋𝗌 𝗍𝗈 𝖽𝖾𝗅𝖾𝗍𝖾 𝖿𝗂𝗅𝖾𝗌/𝖿𝗈𝗅𝖽𝖾𝗋𝗌
🔒 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇: 𝖡𝗈𝗍 𝖠𝖽𝗆𝗂𝗇 𝖮𝗇𝗅𝗒
👨‍💻 𝖢𝗋𝖾𝖺𝗍𝗈𝗋: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽`;
                return message.reply(helpMsg);
            }

            // Check if cache directory exists
            if (!fs.existsSync(cachePath)) {
                return message.reply("❌ 𝖢𝖺𝖼𝗁𝖾 𝖿𝗈𝗅𝖽𝖾𝗋 𝖽𝗈𝖾𝗌 𝗇𝗈𝗍 𝖾𝗑𝗂𝗌𝗍");
            }

            // Read cache directory
            let files = [];
            try {
                files = fs.readdirSync(cachePath);
            } catch (error) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗋𝖾𝖺𝖽𝗂𝗇𝗀 𝖼𝖺𝖼𝗁𝖾 𝖿𝗈𝗅𝖽𝖾𝗋:", error);
                return message.reply(`❌ 𝖤𝗋𝗋𝗈𝗋 𝗋𝖾𝖺𝖽𝗂𝗇𝗀 𝖼𝖺𝖼𝗁𝖾 𝖿𝗈𝗅𝖽𝖾𝗋: ${error.message}`);
            }

            let filterType = "";
            let filterValue = "";
            let filteredFiles = [];

            // Apply filters
            if (args[0] === "start" && args[1]) {
                filterValue = args.slice(1).join(" ");
                filteredFiles = files.filter(file => file.startsWith(filterValue));
                filterType = `𝗌𝗍𝖺𝗋𝗍𝗂𝗇𝗀 𝗐𝗂𝗍𝗁 "${filterValue}"`;
            } else if (args[0] === "ext" && args[1]) {
                filterValue = args[1];
                filteredFiles = files.filter(file => file.endsWith(filterValue));
                filterType = `𝗐𝗂𝗍𝗁 𝖾𝗑𝗍𝖾𝗇𝗌𝗂𝗈𝗇 "${filterValue}"`;
            } else if (args.length > 0) {
                filterValue = args.join(" ");
                filteredFiles = files.filter(file => file.includes(filterValue));
                filterType = `𝖼𝗈𝗇𝗍𝖺𝗂𝗇𝗂𝗇𝗀 "${filterValue}"`;
            } else {
                filteredFiles = files;
                filterType = "𝗂𝗇 𝖼𝖺𝖼𝗁𝖾";
            }

            // Handle no results
            if (filteredFiles.length === 0) {
                return message.reply(
                    `📭 𝖭𝗈 𝖿𝗂𝗅𝖾𝗌 𝖿𝗈𝗎𝗇𝖽 ${filterType}\n💡 𝖳𝗋𝗒: {p}cache 𝗁𝖾𝗅𝗉 𝖿𝗈𝗋 𝗎𝗌𝖺𝗀𝖾 𝗂𝗇𝗌𝗍𝗋𝗎𝖼𝗍𝗂𝗈𝗇𝗌`
                );
            }

            // Format file list
            let fileList = "";
            filteredFiles.forEach((file, index) => {
                const fullPath = `${cachePath}/${file}`;
                try {
                    const stat = fs.statSync(fullPath);
                    const type = stat.isDirectory() ? "🗂️" : "📄";
                    const size = stat.isDirectory() ? "" : ` (${this.formatBytes(stat.size)})`;
                    fileList += `${index + 1}. ${type} ${file}${size}\n`;
                } catch (error) {
                    fileList += `${index + 1}. ❓ ${file} (𝗂𝗇𝖺𝖼𝖼𝖾𝗌𝗌𝗂𝖻𝗅𝖾)\n`;
                }
            });

            // Send results
            const totalSize = await this.getTotalSize(cachePath, filteredFiles);
            const messageText = `
📦 𝖢𝖠𝖢𝖧𝖤 𝖬𝖠𝖭𝖠𝖦𝖤𝖱

🔍 𝖥𝗈𝗎𝗇𝖽 ${filteredFiles.length} 𝗂𝗍𝖾𝗆𝗌 ${filterType}
💾 𝖳𝗈𝗍𝖺𝗅 𝗌𝗂𝗓𝖾: ${this.formatBytes(totalSize)}

${fileList}
✨ 𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗇𝗎𝗆𝖻𝖾𝗋𝗌 𝗍𝗈 𝖽𝖾𝗅𝖾𝗍𝖾 (𝖾𝗑: 1 3 5)
📝 𝖬𝗎𝗅𝗍𝗂𝗉𝗅𝖾 𝗇𝗎𝗆𝖻𝖾𝗋𝗌 𝗌𝖾𝗉𝖺𝗋𝖺𝗍𝖾𝖽 𝖻𝗒 𝗌𝗉𝖺𝖼𝖾𝗌
❌ 𝖳𝗒𝗉𝖾 '𝖼𝖺𝗇𝖼𝖾𝗅' 𝗍𝗈 𝖺𝖻𝗈𝗋𝗍 𝗈𝗉𝖾𝗋𝖺𝗍𝗂𝗈𝗇
            `;

            const msg = await message.reply(messageText);
            
            global.client.handleReply.push({
                name: this.config.name,
                messageID: msg.messageID,
                author: event.senderID,
                files: filteredFiles
            });

        } catch (error) {
            console.error("💥 𝖢𝖺𝖼𝗁𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            await message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
        }
    },

    onReply: async function({ event, message, Reply }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("util");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺 𝖺𝗇𝖽 𝗎𝗍𝗂𝗅.");
            }

            if (event.senderID !== Reply.author) {
                return message.reply("❌ 𝖸𝗈𝗎 𝖺𝗋𝖾 𝗇𝗈𝗍 𝖺𝗎𝗍𝗁𝗈𝗋𝗂𝗓𝖾𝖽 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝗋𝖾𝗉𝗅𝗒.");
            }

            const unlinkAsync = promisify(fs.unlink);
            const rmdirAsync = promisify(fs.rmdir);
            const cachePath = `${__dirname}/cache`;
            
            // Handle cancel
            if (event.body.toLowerCase() === 'cancel') {
                await message.reply("❌ 𝖮𝗉𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖼𝖺𝗇𝖼𝖾𝗅𝖾𝖽.");
                return;
            }

            let successList = [];
            let errorList = [];
            const nums = event.body.split(" ").map(n => parseInt(n)).filter(n => !isNaN(n) && n > 0 && n <= Reply.files.length);

            if (nums.length === 0) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗌𝖾𝗅𝖾𝖼𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗏𝖺𝗅𝗂𝖽 𝗇𝗎𝗆𝖻𝖾𝗋𝗌 𝗌𝖾𝗉𝖺𝗋𝖺𝗍𝖾𝖽 𝖻𝗒 𝗌𝗉𝖺𝖼𝖾𝗌.");
            }

            for (const num of nums) {
                const target = Reply.files[num - 1];
                const path = `${cachePath}/${target}`;
                
                try {
                    if (fs.existsSync(path)) {
                        const stat = fs.statSync(path);
                        if (stat.isDirectory()) {
                            await fs.remove(path); // Use fs-extra remove for recursive directory deletion
                            successList.push(`🗂️ ${target}`);
                        } else {
                            await unlinkAsync(path);
                            successList.push(`📄 ${target}`);
                        }
                    } else {
                        errorList.push(`❌ ${target}: 𝖥𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽`);
                    }
                } catch (error) {
                    errorList.push(`❌ ${target}: ${error.message}`);
                }
            }

            let response = "";
            if (successList.length > 0) {
                response += `✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖽𝖾𝗅𝖾𝗍𝖾𝖽 ${successList.length} 𝗂𝗍𝖾𝗆(𝗌):\n${successList.join('\n')}\n\n`;
            }
            if (errorList.length > 0) {
                response += `❌ 𝖤𝗋𝗋𝗈𝗋𝗌 ${errorList.length}:\n${errorList.join('\n')}`;
            }

            await message.reply(response || "⚠️ 𝖭𝗈 𝗂𝗍𝖾𝗆𝗌 𝗐𝖾𝗋𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝖾𝖽");
            
        } catch (error) {
            console.error("💥 𝖢𝖺𝖼𝗁𝖾 𝗋𝖾𝗉𝗅𝗒 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
            await message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝗋𝖾𝗊𝗎𝖾𝗌𝗍.");
        }
    },

    // Helper functions
    formatBytes: function(bytes, decimals = 2) {
        if (bytes === 0) return '0 𝖡𝗒𝗍𝖾𝗌';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['𝖡𝗒𝗍𝖾𝗌', '𝖪𝖡', '𝖬𝖡', '𝖦𝖡'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },

    getTotalSize: async function(cachePath, files) {
        let totalSize = 0;
        
        for (const file of files) {
            try {
                const stat = fs.statSync(`${cachePath}/${file}`);
                if (!stat.isDirectory()) {
                    totalSize += stat.size;
                }
            } catch (error) {
                // Skip inaccessible files
            }
        }
        
        return totalSize;
    }
};
