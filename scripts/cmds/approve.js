const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "approve",
        aliases: [],
        version: "1.0.2",
        author: "Asif Mahmud",
        countDown: 5,
        role: 2,
        category: "admin",
        shortDescription: {
            en: "𝖬𝖺𝗇𝖺𝗀𝖾 𝗀𝗋𝗈𝗎𝗉 𝖺𝗉𝗉𝗋𝗈𝗏𝖺𝗅𝗌 𝖿𝗈𝗋 𝖻𝗈𝗍"
        },
        longDescription: {
            en: "𝖠𝗉𝗉𝗋𝗈𝗏𝖾 𝗈𝗋 𝗆𝖺𝗇𝖺𝗀𝖾 𝗀𝗋𝗈𝗎𝗉𝗌 𝖿𝗈𝗋 𝖻𝗈𝗍 𝗎𝗌𝖺𝗀𝖾"
        },
        guide: {
            en: "{p}approve [𝗅𝗂𝗌𝗍/𝗉𝖾𝗇𝖽𝗂𝗇𝗀/𝖽𝖾𝗅/𝗁𝖾𝗅𝗉]"
        },
        dependencies: {
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            let fsAvailable = true;
            try {
                require("fs-extra");
            } catch (e) {
                fsAvailable = false;
            }

            if (!fsAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            const dataPath = path.join(__dirname, "approvedThreads.json");
            const dataPending = path.join(__dirname, "pendingThreads.json");

            // Ensure data files exist with proper initialization
            try {
                if (!fs.existsSync(dataPath)) {
                    fs.writeFileSync(dataPath, JSON.stringify([]));
                    console.log("✅ 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽𝖳𝗁𝗋𝖾𝖺𝖽𝗌.𝗃𝗌𝗈𝗇");
                }
                if (!fs.existsSync(dataPending)) {
                    fs.writeFileSync(dataPending, JSON.stringify([]));
                    console.log("✅ 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝗉𝖾𝗇𝖽𝗂𝗇𝗀𝖳𝗁𝗋𝖾𝖺𝖽𝗌.𝗃𝗌𝗈𝗇");
                }
            } catch (fileError) {
                console.error("💥 𝖥𝗂𝗅𝖾 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", fileError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖽𝖺𝗍𝖺 𝖿𝗂𝗅𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌.");
            }

            let approved = [];
            let pending = [];
            
            // Load data with error handling
            try {
                const approvedData = fs.readFileSync(dataPath, "utf8");
                const pendingData = fs.readFileSync(dataPending, "utf8");
                
                approved = JSON.parse(approvedData);
                pending = JSON.parse(pendingData);
                
                // Ensure arrays
                if (!Array.isArray(approved)) approved = [];
                if (!Array.isArray(pending)) pending = [];
                
            } catch (parseError) {
                console.error("💥 𝖣𝖺𝗍𝖺 𝗉𝖺𝗋𝗌𝖾 𝖾𝗋𝗋𝗈𝗋:", parseError);
                // Reset corrupted files
                approved = [];
                pending = [];
                fs.writeFileSync(dataPath, JSON.stringify(approved, null, 2));
                fs.writeFileSync(dataPending, JSON.stringify(pending, null, 2));
                console.log("✅ 𝖱𝖾𝗌𝖾𝗍 𝖼𝗈𝗋𝗋𝗎𝗉𝗍𝖾𝖽 𝖽𝖺𝗍𝖺 𝖿𝗂𝗅𝖾𝗌");
            }

            const { threadID } = event;
            let targetID = args[0] ? args[0].trim() : threadID;

            // HELP COMMAND
            if (args[0] === "help" || args[0] === "h") {
                const helpMessage = `𝖠𝖯𝖯𝖱𝖮𝖵𝖤 𝖢𝖮𝖬𝖬𝖠𝖭𝖣𝖲

${global.config.PREFIX + this.config.name} 𝗅𝗂𝗌𝗍 - 𝗏𝗂𝖾𝗐 𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽 𝗀𝗋𝗈𝗎𝗉𝗌
${global.config.PREFIX + this.config.name} 𝗉𝖾𝗇𝖽𝗂𝗇𝗀 - 𝗏𝗂𝖾𝗐 𝗉𝖾𝗇𝖽𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉𝗌
${global.config.PREFIX + this.config.name} 𝖽𝖾𝗅 [𝗂𝖽] - 𝗋𝖾𝗆𝗈𝗏𝖾 𝖿𝗋𝗈𝗆 𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽
${global.config.PREFIX + this.config.name} [𝗂𝖽] - 𝖺𝗉𝗉𝗋𝗈𝗏𝖾 𝖺 𝗀𝗋𝗈𝗎𝗉

𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖻𝗒: ${this.config.author}`;
                return message.reply(helpMessage);
            }

            // LIST APPROVED GROUPS
            if (args[0] === "list" || args[0] === "l") {
                if (approved.length === 0) {
                    return message.reply("❌ 𝖭𝗈 𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽 𝗀𝗋𝗈𝗎𝗉𝗌 𝖿𝗈𝗎𝗇𝖽");
                }

                let msg = `𝖠𝖯𝖯𝖱𝖮𝖵𝖤𝖣 𝖦𝖱𝖮𝖴𝖯𝖲 [${approved.length}]:\n\n`;
                approved.forEach((id, index) => {
                    msg += `〘${index + 1}〙 » ${id}\n`;
                });
                
                return message.reply(msg);
            }

            // LIST PENDING GROUPS
            if (args[0] === "pending" || args[0] === "p") {
                if (pending.length === 0) {
                    return message.reply("❌ 𝖭𝗈 𝗉𝖾𝗇𝖽𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉𝗌 𝖿𝗈𝗎𝗇𝖽");
                }

                let msg = `𝖯𝖤𝖭𝖣𝖨𝖭𝖦 𝖦𝖱𝖮𝖴𝖯𝖲 [${pending.length}]:\n\n`;
                pending.forEach((id, index) => {
                    msg += `〘${index + 1}〙 » ${id}\n`;
                });
                
                return message.reply(msg);
            }

            // DELETE FROM APPROVED
            if (args[0] === "del" || args[0] === "d") {
                const idToRemove = args[1] ? args[1].trim() : threadID;
                
                // Validate ID format
                if (!idToRemove || isNaN(idToRemove)) {
                    return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖦𝗋𝗈𝗎𝗉 𝖨𝖣. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗇𝗎𝗆𝖾𝗋𝗂𝖼 𝖨𝖣.");
                }

                if (!approved.includes(idToRemove)) {
                    return message.reply("❌ 𝖦𝗋𝗈𝗎𝗉 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽 𝗂𝗇 𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽 𝗅𝗂𝗌𝗍");
                }

                approved = approved.filter(id => id !== idToRemove);
                
                try {
                    fs.writeFileSync(dataPath, JSON.stringify(approved, null, 2));
                    console.log(`✅ 𝖱𝖾𝗆𝗈𝗏𝖾𝖽 𝗀𝗋𝗈𝗎𝗉 ${idToRemove} 𝖿𝗋𝗈𝗆 𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽 𝗅𝗂𝗌𝗍`);
                } catch (writeError) {
                    console.error("💥 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝖽𝖺𝗍𝖺:", writeError);
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝖼𝗁𝖺𝗇𝗀𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                }
                
                return message.reply(`✅ 𝖦𝗋𝗈𝗎𝗉 ${idToRemove} 𝗋𝖾𝗆𝗈𝗏𝖾𝖽 𝖿𝗋𝗈𝗆 𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽 𝗅𝗂𝗌𝗍`);
            }

            // APPROVE A GROUP
            if (!isNaN(targetID)) {
                // Validate target ID
                if (!targetID || targetID.trim() === "") {
                    return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖦𝗋𝗈𝗎𝗉 𝖨𝖣. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗏𝖺𝗅𝗂𝖽 𝖨𝖣.");
                }

                if (approved.includes(targetID)) {
                    return message.reply("✅ 𝖦𝗋𝗈𝗎𝗉 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽");
                }

                // Add to approved
                approved.push(targetID);
                
                // Remove from pending if it was there
                if (pending.includes(targetID)) {
                    pending = pending.filter(id => id !== targetID);
                    try {
                        fs.writeFileSync(dataPending, JSON.stringify(pending, null, 2));
                    } catch (pendingError) {
                        console.error("💥 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗎𝗉𝖽𝖺𝗍𝖾 𝗉𝖾𝗇𝖽𝗂𝗇𝗀 𝗅𝗂𝗌𝗍:", pendingError);
                    }
                }
                
                try {
                    fs.writeFileSync(dataPath, JSON.stringify(approved, null, 2));
                    console.log(`✅ 𝖠𝗉𝗉𝗋𝗈𝗏𝖾𝖽 𝗀𝗋𝗈𝗎𝗉 ${targetID}`);
                } catch (writeError) {
                    console.error("💥 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽 𝗅𝗂𝗌𝗍:", writeError);
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝖺𝗉𝗉𝗋𝗈𝗏𝖺𝗅. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                }
                
                return message.reply(`✅ 𝖦𝗋𝗈𝗎𝗉 ${targetID} 𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒`);
            }

            // DEFAULT: SHOW HELP
            return message.reply(`❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽. 𝖴𝗌𝖾 ${global.config.PREFIX}approve 𝗁𝖾𝗅𝗉 𝖿𝗈𝗋 𝗂𝗇𝗌𝗍𝗋𝗎𝖼𝗍𝗂𝗈𝗇𝗌`);

        } catch (error) {
            console.error("💥 𝖠𝗉𝗉𝗋𝗈𝗏𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('permission') || error.code === 'EACCES') {
                errorMessage = "❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝖿𝗂𝗅𝖾 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌.";
            } else if (error.message.includes('JSON')) {
                errorMessage = "❌ 𝖣𝖺𝗍𝖺 𝖼𝗈𝗋𝗋𝗎𝗉𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖣𝖺𝗍𝖺 𝖿𝗂𝗅𝖾𝗌 𝗁𝖺𝗏𝖾 𝖻𝖾𝖾𝗇 𝗋𝖾𝗌𝖾𝗍.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
