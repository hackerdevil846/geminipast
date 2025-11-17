const axios = require("axios");

module.exports = {
    config: {
        name: "cmdstore",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "system",
        shortDescription: {
            en: "𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌 𝖲𝗍𝗈𝗋𝖾 𝗈𝖿 𝖣𝗂𝗉𝗍𝗈 - 𝖡𝗋𝗈𝗐𝗌𝖾 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌"
        },
        longDescription: {
            en: "𝖡𝗋𝗈𝗐𝗌𝖾 𝖺𝗇𝖽 𝗌𝖾𝖺𝗋𝖼𝗁 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌 𝗂𝗇 𝗍𝗁𝖾 𝗌𝗍𝗈𝗋𝖾"
        },
        guide: {
            en: "{p}cmdstore [𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗇𝖺𝗆𝖾 | 𝗌𝗂𝗇𝗀𝗅𝖾 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋 | 𝗉𝖺𝗀𝖾 𝗇𝗎𝗆𝖻𝖾𝗋]"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
            }

            const availableCmdsUrl = "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/availableCmds.json";
            const cmdUrlsJson = "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/cmdUrls.json";
            const ITEMS_PER_PAGE = 10;

            const query = args.join(" ").trim().toLowerCase();
            
            try {
                const response = await axios.get(availableCmdsUrl, { timeout: 15000 });
                let cmds = response.data.cmdName;
                let finalArray = cmds;
                let page = 1;

                if (query) {
                    if (!isNaN(query)) {
                        page = parseInt(query);
                    } else if (query.length === 1) {
                        finalArray = cmds.filter(cmd => cmd.cmd.toLowerCase().startsWith(query));
                        if (finalArray.length === 0) {
                            return message.reply(`❌ 𝖭𝗈 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌 𝖿𝗈𝗎𝗇𝖽 𝗌𝗍𝖺𝗋𝗍𝗂𝗇𝗀 𝗐𝗂𝗍𝗁 "${query}"`);
                        }
                    } else {
                        finalArray = cmds.filter(cmd => cmd.cmd.toLowerCase().includes(query));
                        if (finalArray.length === 0) {
                            return message.reply(`❌ 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 "${query}" 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽`);
                        }
                    }
                }

                const totalPages = Math.ceil(finalArray.length / ITEMS_PER_PAGE);
                if (page < 1 || page > totalPages) {
                    return message.reply(
                        `📄 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗉𝖺𝗀𝖾 𝗇𝗎𝗆𝖻𝖾𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝖺 𝗇𝗎𝗆𝖻𝖾𝗋 𝖻𝖾𝗍𝗐𝖾𝖾𝗇 1 𝖺𝗇𝖽 ${totalPages}.`
                    );
                }

                const startIndex = (page - 1) * ITEMS_PER_PAGE;
                const endIndex = startIndex + ITEMS_PER_PAGE;
                const cmdsToShow = finalArray.slice(startIndex, endIndex);
                
                let msg = `╔═════〖 📦 𝖢𝖬𝖣 𝖲𝖳𝖮𝖱𝖤 〗═════╗\n`;
                msg += `📑 𝖯𝖺𝗀𝖾: ${page}/${totalPages}\n`;
                msg += `📊 𝖳𝗈𝗍𝖺𝗅: ${finalArray.length} 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌\n`;
                msg += `╟─────────────────────────╢\n`;

                cmdsToShow.forEach((cmd, index) => {
                    msg += `🔹 ${startIndex + index + 1}. ${cmd.cmd}\n`;
                    msg += `👤 𝖠𝗎𝗍𝗁𝗈𝗋: ${cmd.author}\n`;
                    msg += `🔄 𝖴𝗉𝖽𝖺𝗍𝖾: ${cmd.update || '𝖭/𝖠'}\n`;
                    msg += `╰─────────────────────────╯\n`;
                });

                if (page < totalPages) {
                    msg += `\n📩 𝖳𝗒𝗉𝖾 "${this.config.name} ${page + 1}" 𝖿𝗈𝗋 𝗇𝖾𝗑𝗍 𝗉𝖺𝗀𝖾`;
                }

                const sentMsg = await message.reply(msg);
                
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: sentMsg.messageID,
                    author: event.senderID,
                    cmdName: finalArray,
                    page: page
                });

            } catch (apiError) {
                console.error("❌ 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", apiError);
                
                let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗍𝗋𝗂𝖾𝗏𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌";
                
                if (apiError.code === 'ECONNREFUSED') {
                    errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
                } else if (apiError.code === 'ETIMEDOUT') {
                    errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
                } else if (apiError.response?.status === 404) {
                    errorMessage = "❌ 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝗌𝗍𝗈𝗋𝖾 𝗂𝗌 𝖼𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾.";
                }
                
                await message.reply(errorMessage);
            }
        } catch (error) {
            console.error("💥 𝖢𝗆𝖽𝖲𝗍𝗈𝗋𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
            await message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
        }
    },

    onReply: async function({ event, message, Reply }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
            }

            if (Reply.author !== event.senderID) {
                return message.reply("🚫 𝖸𝗈𝗎 𝖺𝗋𝖾 𝗇𝗈𝗍 𝖺𝗅𝗅𝗈𝗐𝖾𝖽 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾");
            }

            const { cmdName, page } = Reply;
            const reply = parseInt(event.body);
            const startIndex = (page - 1) * 10;
            const endIndex = startIndex + 10;

            if (isNaN(reply) || reply < startIndex + 1 || reply > endIndex) {
                return message.reply(
                    `❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝖺 𝗇𝗎𝗆𝖻𝖾𝗋 𝖻𝖾𝗍𝗐𝖾𝖾𝗇 ${startIndex + 1} 𝖺𝗇𝖽 ${Math.min(endIndex, cmdName.length)}`
                );
            }

            try {
                const cmdNameSelected = cmdName[reply - 1].cmd;
                const { status } = cmdName[reply - 1];
                const response = await axios.get("https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/cmdUrls.json", { timeout: 15000 });
                const selectedCmdUrl = response.data[cmdNameSelected];

                if (!selectedCmdUrl) {
                    return message.reply("❌ 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖴𝖱𝖫 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽");
                }

                // Unsend the original message
                try {
                    await message.unsend(Reply.messageID);
                } catch (unsendError) {
                    console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }
                
                const msg = 
                    `╔═════〖 🔍 𝖢𝖮𝖬𝖬𝖠𝖭𝖣 𝖨𝖭𝖥𝖮 〗════╗\n` +
                    `📛 𝖢𝗈𝗆𝗆𝖺𝗇𝖽: ${cmdNameSelected}\n` +
                    `📊 𝖲𝗍𝖺𝗍𝗎𝗌: ${status || '𝖭/𝖠'}\n` +
                    `🔗 𝖴𝖱𝖫: ${selectedCmdUrl}\n` +
                    `╚══════════════════════════════╝`;
                
                await message.reply(msg);

            } catch (apiError) {
                console.error("❌ 𝖢𝗆𝖽𝖲𝗍𝗈𝗋𝖾 𝖱𝖾𝗉𝗅𝗒 𝖤𝗋𝗋𝗈𝗋:", apiError);
                
                let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗍𝗋𝗂𝖾𝗏𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇";
                
                if (apiError.code === 'ECONNREFUSED') {
                    errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
                } else if (apiError.code === 'ETIMEDOUT') {
                    errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
                } else if (apiError.response?.status === 404) {
                    errorMessage = "❌ 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖴𝖱𝖫 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽.";
                }
                
                await message.reply(errorMessage);
            }
        } catch (error) {
            console.error("💥 𝖢𝗆𝖽𝖲𝗍𝗈𝗋𝖾 𝖱𝖾𝗉𝗅𝗒 𝖤𝗋𝗋𝗈𝗋:", error);
            await message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
        }
    }
};
