const fs = require("fs-extra");

module.exports = {
    config: {
        name: "bruh",
        aliases: [],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "𝖡𝗋𝗎𝗁 𝗌𝗈𝗎𝗇𝖽 𝖾𝖿𝖿𝖾𝖼𝗍"
        },
        longDescription: {
            en: "𝖯𝗅𝖺𝗒𝗌 𝖻𝗋𝗎𝗁 𝗌𝗈𝗎𝗇𝖽 𝖾𝖿𝖿𝖾𝖼𝗍 𝗐𝗁𝖾𝗇 𝗍𝗋𝗂𝗀𝗀𝖾𝗋𝖾𝖽"
        },
        guide: {
            en: "𝖩𝗎𝗌𝗍 𝗍𝗒𝗉𝖾 '𝖻𝗋𝗎𝗁' 𝗂𝗇 𝖼𝗁𝖺𝗍"
        },
        dependencies: {
            "fs-extra": ""
        }
    },

    onLoad: function () {
        try {
            // Dependency check
            let fsAvailable = true;
            try {
                require("fs-extra");
            } catch (e) {
                fsAvailable = false;
            }

            if (!fsAvailable) {
                console.warn("❌ [𝖻𝗋𝗎𝗁] 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗒: 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺");
                return;
            }

            const filePath = __dirname + "/noprefix/xxx.mp3";
            if (!fs.existsSync(filePath)) {
                console.warn("⚠️ [𝖻𝗋𝗎𝗁] 𝖲𝗈𝗎𝗇𝖽 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽 𝖺𝗍:", filePath);
            } else {
                console.log("✅ [𝖻𝗋𝗎𝗁] 𝖲𝗈𝗎𝗇𝖽 𝖿𝗂𝗅𝖾 𝗏𝖾𝗋𝗂𝖿𝗂𝖾𝖽");
            }
        } catch (e) {
            console.warn("❌ [𝖻𝗋𝗎𝗁] 𝖮𝗇𝖫𝗈𝖺𝖽 𝖼𝗁𝖾𝖼𝗄 𝖿𝖺𝗂𝗅𝖾𝖽:", e.message);
        }
    },

    onStart: async function({ message }) {
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

            const filePath = __dirname + "/noprefix/xxx.mp3";
            
            if (fs.existsSync(filePath)) {
                // Check if file is readable and has content
                try {
                    const stats = fs.statSync(filePath);
                    if (stats.size > 0) {
                        await message.reply({
                            body: "𝖡𝗋𝗎𝗁 𝖡𝗋𝗎𝗎𝗎𝗁 😏",
                            attachment: fs.createReadStream(filePath)
                        });
                        console.log("✅ [𝖻𝗋𝗎𝗁] 𝖲𝗈𝗎𝗇𝖽 𝗌𝖾𝗇𝗍 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                    } else {
                        throw new Error("𝖥𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                    }
                } catch (fileError) {
                    console.error("❌ [𝖻𝗋𝗎𝗁] 𝖥𝗂𝗅𝖾 𝖺𝖼𝖼𝖾𝗌𝗌 𝖾𝗋𝗋𝗈𝗋:", fileError.message);
                    await message.reply("𝖡𝗋𝗎𝗁 𝖡𝗋𝗎𝗎𝗎𝗁 😏\n⚠️ 𝖲𝗈𝗎𝗇𝖽 𝖿𝗂𝗅𝖾 𝖼𝗈𝗋𝗋𝗎𝗉𝗍𝖾𝖽. 𝖲𝖾𝗇𝖽𝗂𝗇𝗀 𝗍𝖾𝗑𝗍 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄...");
                }
            } else {
                await message.reply("𝖡𝗋𝗎𝗁 𝖡𝗋𝗎𝗎𝗎𝗁 😏\n⚠️ 𝖡𝗋𝗎𝗁 𝗌𝗈𝗎𝗇𝖽 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖲𝖾𝗇𝖽𝗂𝗇𝗀 𝗍𝖾𝗑𝗍 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄...");
            }
        } catch (error) {
            console.error("💥 [𝖻𝗋𝗎𝗁] 𝖮𝗇𝖲𝗍𝖺𝗋𝗍 𝖾𝗋𝗋𝗈𝗋:", error);
            await message.reply("𝖡𝗋𝗎𝗁 𝖡𝗋𝗎𝗎𝗎𝗁 😏");
        }
    },

    onChat: async function({ event, message }) {
        try {
            // Dependency check
            let fsAvailable = true;
            try {
                require("fs-extra");
            } catch (e) {
                fsAvailable = false;
            }

            if (!fsAvailable) {
                return;
            }

            if (!event || !event.body) return;

            const { senderID, body } = event;

            // Get first word and check if it's "bruh"
            const firstWord = body.trim().split(/\s+/)[0] || "";
            if (firstWord.toLowerCase() !== "bruh") return;

            // Check if sender is another bot
            let otherBots = [];
            try {
                if (global.config && Array.isArray(global.config.OTHERBOT)) {
                    otherBots = global.config.OTHERBOT;
                }
            } catch (err) {
                console.warn("❌ [𝖻𝗋𝗎𝗁] 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝖮𝖳𝖧𝖤𝖱𝖡𝖮𝖳 𝖼𝗈𝗇𝖿𝗂𝗀:", err.message);
                otherBots = [];
            }

            if (otherBots.includes(senderID)) {
                console.log("🔇 [𝖻𝗋𝗎𝗁] 𝖨𝗀𝗇𝗈𝗋𝖾𝖽 𝗋𝖾𝗊𝗎𝖾𝗌𝗍 𝖿𝗋𝗈𝗆 𝗈𝗍𝗁𝖾𝗋 𝖻𝗈𝗍:", senderID);
                return;
            }

            const filePath = __dirname + "/noprefix/xxx.mp3";

            if (fs.existsSync(filePath)) {
                // Check if file is readable and has content
                try {
                    const stats = fs.statSync(filePath);
                    if (stats.size > 0) {
                        await message.reply({
                            body: "𝖡𝗋𝗎𝗁 𝖡𝗋𝗎𝗎𝗎𝗁 😏",
                            attachment: fs.createReadStream(filePath)
                        });
                        console.log("✅ [𝖻𝗋𝗎𝗁] 𝖠𝗎𝗍𝗈-𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝗌𝖾𝗇𝗍 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                    } else {
                        throw new Error("𝖥𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                    }
                } catch (fileError) {
                    console.error("❌ [𝖻𝗋𝗎𝗁] 𝖥𝗂𝗅𝖾 𝖺𝖼𝖼𝖾𝗌𝗌 𝖾𝗋𝗋𝗈𝗋:", fileError.message);
                    await message.reply("𝖡𝗋𝗎𝗁 𝖡𝗋𝗎𝗎𝗎𝗁 😏\n⚠️ 𝖲𝗈𝗎𝗇𝖽 𝖿𝗂𝗅𝖾 𝖼𝗈𝗋𝗋𝗎𝗉𝗍𝖾𝖽. 𝖲𝖾𝗇𝖽𝗂𝗇𝗀 𝗍𝖾𝗑𝗍 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄...");
                }
            } else {
                await message.reply("𝖡𝗋𝗎𝗁 𝖡𝗋𝗎𝗎𝗎𝗁 😏\n⚠️ 𝖡𝗋𝗎𝗁 𝗌𝗈𝗎𝗇𝖽 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖲𝖾𝗇𝖽𝗂𝗇𝗀 𝗍𝖾𝗑𝗍 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄...");
            }
        } catch (error) {
            console.error("💥 [𝖻𝗋𝗎𝗁] 𝖮𝗇𝖢𝗁𝖺𝗍 𝖾𝗋𝗋𝗈𝗋:", error);
            // Silent fail to avoid spam
        }
    }
};
