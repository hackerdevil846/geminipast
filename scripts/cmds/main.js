const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "main",
        aliases: [],
        version: "1.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 2,
        category: "owner",
        shortDescription: {
            en: "𝖬𝖺𝗂𝗇 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌 𝗆𝖺𝗇𝖺𝗀𝖾𝗆𝖾𝗇𝗍 𝖿𝗈𝗋 𝗍𝗁𝗋𝖾𝖺𝖽𝗌"
        },
        longDescription: {
            en: "𝖠𝗉𝗉𝗋𝗈𝗏𝖾, 𝗋𝖾𝗆𝗈𝗏𝖾, 𝗈𝗋 𝖼𝗁𝖾𝖼𝗄 𝗆𝖺𝗂𝗇 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌 𝖿𝗈𝗋 𝗍𝗁𝗋𝖾𝖺𝖽𝗌"
        },
        guide: {
            en: "{p}main 𝖺𝗉𝗉𝗋𝗈𝗏𝖾/𝗋𝖾𝗆𝗈𝗏𝖾/𝖽𝗂𝗌𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽/𝖼𝗁𝖾𝖼𝗄 [𝗍𝗁𝗋𝖾𝖺𝖽𝖨𝖣] [𝗋𝖾𝖺𝗌𝗈𝗇/𝗆𝖾𝗌𝗌𝖺𝗀𝖾]"
        },
        dependencies: {
            "fs": "",
            "path": ""
        }
    },

    onStart: async function({ api, args, message, event }) {
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

            const { getPrefix } = global.utils;
            const p = getPrefix(event.threadID);
            const threadID = event.threadID;
            const approvedIDsPath = path.join(__dirname, "assist_json", "approved_main.json");
            const pendingIDsPath = path.join(__dirname, "assist_json", "pending_main.json");

            // Ensure directories exist with error handling
            try {
                if (!fs.existsSync(path.dirname(approvedIDsPath))) {
                    fs.mkdirSync(path.dirname(approvedIDsPath), { recursive: true });
                }
                if (!fs.existsSync(approvedIDsPath)) {
                    fs.writeFileSync(approvedIDsPath, JSON.stringify([]));
                }
                if (!fs.existsSync(pendingIDsPath)) {
                    fs.writeFileSync(pendingIDsPath, JSON.stringify([]));
                }
            } catch (fileError) {
                console.error("💥 𝖥𝗂𝗅𝖾 𝗌𝗒𝗌𝗍𝖾𝗆 𝖾𝗋𝗋𝗈𝗋:", fileError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖼𝖼𝖾𝗌𝗌 𝖿𝗂𝗅𝖾 𝗌𝗒𝗌𝗍𝖾𝗆. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌.");
            }

            // Validate arguments
            if (!args[0]) {
                return message.reply(`❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗎𝗌𝖺𝗀𝖾. 𝖴𝗌𝖾 "${p}𝗁𝖾𝗅𝗉 𝗆𝖺𝗂𝗇" 𝗍𝗈 𝗌𝖾𝖾 𝗁𝗈𝗐 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.`);
            }

            const action = args[0].toLowerCase();

            if (action === "approve" && args[1]) {
                const id = args[1];
                const messageFromAdmin = args.slice(2).join(" ") || "𝖭𝗈 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾𝖽";

                // Validate thread ID
                if (!id || isNaN(id)) {
                    return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗍𝗁𝗋𝖾𝖺𝖽 𝖨𝖣. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗇𝗎𝗆𝖾𝗋𝗂𝖼 𝖨𝖣.");
                }

                try {
                    let approvedIDs = JSON.parse(fs.readFileSync(approvedIDsPath, 'utf8'));
                    if (approvedIDs.includes(id)) {
                        await message.reply("✅ 𝖳𝗁𝗂𝗌 𝗍𝗁𝗋𝖾𝖺𝖽 𝖨𝖣 𝗂𝗌 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽 𝗍𝗈 𝗎𝗌𝖾 𝗆𝖺𝗂𝗇 𝖼𝗆𝖽𝗌 𝖿𝗋𝗈𝗆 𝖻𝗈𝗍");
                    } else {
                        approvedIDs.push(id);
                        fs.writeFileSync(approvedIDsPath, JSON.stringify(approvedIDs, null, 2));
                        
                        // Send notification to the thread
                        try {
                            await api.sendMessage(
                                `✅ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝖠𝖼𝖼𝖾𝗉𝗍𝖾𝖽\n\n` +
                                `𝖬𝖺𝗂𝗇 𝖢𝗆𝖽𝗌 𝖴𝗇𝗅𝗈𝖼𝗄𝖾𝖽\n\n` +
                                `𝖸𝗈𝗎𝗋 𝗋𝖾𝗊𝗎𝖾𝗌𝗍 𝖿𝗈𝗋 𝗎𝗌𝖾 𝗆𝖺𝗂𝗇 𝖼𝗆𝖽𝗌 𝖿𝗈𝗋 𝖻𝗈𝗍 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽 𝖻𝗒 𝖡𝗈𝗍𝖠𝖽𝗆𝗂𝗇\n` +
                                `𝖭𝗈𝗐 𝖺𝗅𝗅 𝗅𝗈𝖼𝗄𝖾𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌 𝗐𝗂𝗅𝗅 𝗐𝗈𝗋𝗄 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝗍𝗁𝗋𝖾𝖺𝖽.\n\n` +
                                `𝖬𝖾𝗌𝗌𝖺𝗀𝖾 𝖿𝗋𝗈𝗆 𝖺𝖽𝗆𝗂𝗇: ${messageFromAdmin}\n\n` +
                                `𝖨𝖿 𝗒𝗈𝗎 𝖽𝗈𝗇'𝗍 𝗄𝗇𝗈𝗐 𝗁𝗈𝗐 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖻𝗈𝗍 𝗍𝗁𝖾𝗇 𝗃𝗈𝗂𝗇 𝗍𝗁𝖾 𝗌𝗎𝗉𝗉𝗈𝗋𝗍 𝖡𝗈𝗑\n` +
                                `𝖳𝗒𝗉𝖾: ${p}𝗌𝗎𝗉𝗉𝗈𝗋𝗍\n𝗍𝗈 𝗃𝗈𝗂𝗇.`,
                                id
                            );
                        } catch (sendError) {
                            console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗍𝗈 𝗍𝗁𝗋𝖾𝖺𝖽 ${id}:`, sendError.message);
                        }

                        await message.reply("✅ 𝖳𝗁𝗂𝗌 𝖳𝗁𝗋𝖾𝖺𝖽 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽 𝗇𝗈𝗐 𝗍𝗈 𝗎𝗌𝖾 𝗆𝖺𝗂𝗇 𝖼𝗈𝗆𝗆𝖺𝗇𝖽");

                        // Remove from pending IDs list
                        try {
                            let pendingIDs = JSON.parse(fs.readFileSync(pendingIDsPath, 'utf8'));
                            if (pendingIDs.includes(id)) {
                                pendingIDs.splice(pendingIDs.indexOf(id), 1);
                                fs.writeFileSync(pendingIDsPath, JSON.stringify(pendingIDs, null, 2));
                            }
                        } catch (pendingError) {
                            console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗉𝖽𝖺𝗍𝖾 𝗉𝖾𝗇𝖽𝗂𝗇𝗀 𝗅𝗂𝗌𝗍:", pendingError.message);
                        }
                    }
                } catch (readError) {
                    console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗋𝖾𝖺𝖽𝗂𝗇𝗀 𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽 𝖨𝖣𝗌:", readError);
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝖺𝖽 𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽 𝗅𝗂𝗌𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                }

            } else if (action === "remove" && args[1]) {
                const id = args[1];
                const reason = args.slice(2).join(" ") || "𝖭𝗈 𝗋𝖾𝖺𝗌𝗈𝗇 𝗉𝗋𝗈𝗏𝗂𝖽𝖾𝖽";

                // Validate thread ID
                if (!id || isNaN(id)) {
                    return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗍𝗁𝗋𝖾𝖺𝖽 𝖨𝖣. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗇𝗎𝗆𝖾𝗋𝗂𝖼 𝖨𝖣.");
                }

                try {
                    let approvedIDs = JSON.parse(fs.readFileSync(approvedIDsPath, 'utf8'));
                    if (!approvedIDs.includes(id)) {
                        await message.reply("❌ 𝖳𝗁𝗂𝗌 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝖽 𝗂𝗌 𝗇𝗈𝗍 𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽, 𝗌𝗈 𝗇𝗈 𝗇𝖾𝖾𝖽 𝗍𝗈 𝗋𝖾𝗆𝗈𝗏𝖾");
                    } else {
                        approvedIDs.splice(approvedIDs.indexOf(id), 1);
                        fs.writeFileSync(approvedIDsPath, JSON.stringify(approvedIDs, null, 2));
                        
                        // Send notification to the thread
                        try {
                            await api.sendMessage(
                                `⚠️ 𝖶𝖺𝗋𝗇𝗂𝗇𝗀\n\n` +
                                `𝖭𝗈𝗐 𝗍𝗁𝗂𝗌 𝖳𝗁𝗋𝖾𝖺𝖽 𝖨𝖣'𝗌 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖽𝗂𝗌𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽 𝗈𝗋 𝗋𝖾𝗆𝗈𝗏𝖾𝖽 𝗍𝗈 𝗎𝗌𝖾 𝗆𝖺𝗂𝗇 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌 𝖿𝗋𝗈𝗆 𝖻𝗈𝗍 𝖻𝗒 𝖠𝖽𝗆𝗂𝗇.\n\n` +
                                `𝖱𝖾𝖺𝗌𝗈𝗇: ${reason}\n` +
                                `𝖢𝗈𝗇𝗍𝖺𝖼𝗍: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽 𝖿𝗈𝗋 𝗆𝗈𝗋𝖾 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇.\n` +
                                `𝖥𝖡: https://www.facebook.com/share/15yVioQQyq/\n\n` +
                                `𝖠𝗅𝗌𝗈 𝗒𝗈𝗎 𝖼𝖺𝗇 𝗃𝗈𝗂𝗇 𝗌𝗎𝗉𝗉𝗈𝗋𝗍 𝖻𝗈𝗑 𝖿𝗈𝗋 𝗆𝗈𝗋𝖾 𝗂𝗇𝖿𝗈\n` +
                                `𝖳𝗒𝗉𝖾: ${p}𝗌𝗎𝗉𝗉𝗈𝗋𝗍\n𝗍𝗈 𝗃𝗈𝗂𝗇`,
                                id
                            );
                        } catch (sendError) {
                            console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗍𝗈 𝗍𝗁𝗋𝖾𝖺𝖽 ${id}:`, sendError.message);
                        }
                        
                        await message.reply("✅ 𝖳𝗁𝖾 𝗍𝗁𝗋𝖾𝖺𝖽 𝖨𝖣 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝗋𝖾𝗆𝗈𝗏𝖾𝖽 𝖿𝗋𝗈𝗆 𝗎𝗌𝗂𝗇𝗀 𝗆𝖺𝗂𝗇 𝖼𝗈𝗆𝗆𝖺𝗇𝖽");
                    }
                } catch (readError) {
                    console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗋𝖾𝖺𝖽𝗂𝗇𝗀 𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽 𝖨𝖣𝗌:", readError);
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝖺𝖽 𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽 𝗅𝗂𝗌𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                }

            } else if (action === "disapproved" && args[1] && args[2]) {
                const id = args[1];
                const reason = args.slice(2).join(" ") || "𝖭𝗈 𝗋𝖾𝖺𝗌𝗈𝗇 𝗉𝗋𝗈𝗏𝗂𝖽𝖾𝖽";

                // Validate thread ID
                if (!id || isNaN(id)) {
                    return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗍𝗁𝗋𝖾𝖺𝖽 𝖨𝖣. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗇𝗎𝗆𝖾𝗋𝗂𝖼 𝖨𝖣.");
                }

                try {
                    let pendingIDs = JSON.parse(fs.readFileSync(pendingIDsPath, 'utf8'));
                    if (!pendingIDs.includes(id)) {
                        await message.reply("❌ 𝖳𝗁𝗂𝗌 𝗍𝗁𝗋𝖾𝖺𝖽 𝖨𝖣 𝗂𝗌 𝗇𝗈𝗍 𝗉𝖾𝗇𝖽𝗂𝗇𝗀 𝖺𝗉𝗉𝗋𝗈𝗏𝖺𝗅.");
                    } else {
                        // Remove from pending IDs list
                        pendingIDs.splice(pendingIDs.indexOf(id), 1);
                        fs.writeFileSync(pendingIDsPath, JSON.stringify(pendingIDs, null, 2));
                        
                        // Send notification to the thread
                        try {
                            await api.sendMessage(
                                `⚠️ 𝖶𝖺𝗋𝗇𝗂𝗇𝗀\n\n` +
                                `𝖸𝗈𝗎𝗋 𝗍𝗁𝗋𝖾𝖺𝖽 𝖨𝖣'𝗌 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝗍𝗈 𝗎𝗌𝖾 𝗆𝖺𝗂𝗇 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌 𝖿𝗈𝗋 𝖻𝗈𝗍 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖽𝗂𝗌𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽 𝖻𝗒 𝖠𝖽𝗆𝗂𝗇. 𝖺𝗅𝗅 𝖼𝗆𝖽𝗌 𝗐𝗂𝗅𝗅 𝖻𝖾 𝗅𝗈𝖼𝗄𝖾𝖽\n\n` +
                                `𝖱𝖾𝖺𝗌𝗈𝗇: ${reason}\n` +
                                `𝖢𝗈𝗇𝗍𝖺𝖼𝗍: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽 𝖿𝗈𝗋 𝗆𝗈𝗋𝖾 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇.\n` +
                                `𝖥𝖡: https://www.facebook.com/share/15yVioQQyq/\n\n` +
                                `𝗈𝗋 𝗃𝗈𝗂𝗇 𝗍𝗁𝖾 𝗌𝗎𝗉𝗉𝗈𝗋𝗍 𝖻𝗈𝗑 𝖿𝗈𝗋 𝗆𝗈𝗋𝖾 𝗂𝗇𝖿𝗈\n` +
                                `𝖳𝗒𝗉𝖾: ${p}𝗌𝗎𝗉𝗉𝗈𝗋𝗍\n𝗍𝗈 𝗃𝗈𝗂𝗇`,
                                id
                            );
                        } catch (sendError) {
                            console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗍𝗈 𝗍𝗁𝗋𝖾𝖺𝖽 ${id}:`, sendError.message);
                        }
                        
                        await message.reply("✅ 𝖳𝗁𝖾 𝗍𝗁𝗋𝖾𝖺𝖽 𝖨𝖣 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖽𝗂𝗌𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽 𝖿𝗈𝗋 𝗎𝗌𝗂𝗇𝗀 𝗆𝖺𝗂𝗇 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌.");
                    }
                } catch (readError) {
                    console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗋𝖾𝖺𝖽𝗂𝗇𝗀 𝗉𝖾𝗇𝖽𝗂𝗇𝗀 𝖨𝖣𝗌:", readError);
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝖺𝖽 𝗉𝖾𝗇𝖽𝗂𝗇𝗀 𝗅𝗂𝗌𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                }

            } else if (action === "check") {
                try {
                    let approvedIDs = JSON.parse(fs.readFileSync(approvedIDsPath, 'utf8'));
                    if (approvedIDs.includes(threadID)) {
                        await message.reply("✅ 𝖬𝖺𝗂𝗇 𝗂𝗌 𝖼𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 𝗈𝗇 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝗍𝗁𝗋𝖾𝖺𝖽.");
                    } else {
                        await message.reply("❌ 𝖬𝖺𝗂𝗇 𝖼𝗆𝖽𝗌 𝗂𝗌 𝖼𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 𝗈𝖿𝖿 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝗍𝗁𝗋𝖾𝖺𝖽.");
                    }
                } catch (readError) {
                    console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗋𝖾𝖺𝖽𝗂𝗇𝗀 𝖺𝗉𝗉𝗋𝗈𝗏𝖾𝖽 𝖨𝖣𝗌:", readError);
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗁𝖾𝖼𝗄 𝗌𝗍𝖺𝗍𝗎𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                }
            } else {
                await message.reply(`❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗎𝗌𝖺𝗀𝖾. 𝖴𝗌𝖾 "${p}𝗁𝖾𝗅𝗉 𝗆𝖺𝗂𝗇" 𝗍𝗈 𝗌𝖾𝖾 𝗁𝗈𝗐 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.`);
            }
        } catch (error) {
            console.error("💥 𝖬𝖺𝗂𝗇 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    }
};
