const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "cry",
        aliases: [],
        version: "1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 3,
        role: 0,
        category: "meme",
        shortDescription: {
            en: "𝖢𝗋𝗒 𝗆𝖾𝗆𝖾 𝖾𝖿𝖿𝖾𝖼𝗍 𝗐𝗂𝗍𝗁 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝖾𝖽/𝗋𝖾𝗉𝗅𝗂𝖾𝖽 𝗎𝗌𝖾𝗋 𝖺𝗏𝖺𝗍𝖺𝗋 😭"
        },
        longDescription: {
            en: "𝖠𝗉𝗉𝗅𝗒 𝖼𝗋𝗒𝗂𝗇𝗀 𝗆𝖾𝗆𝖾 𝖾𝖿𝖿𝖾𝖼𝗍 𝗈𝗇 𝗎𝗌𝖾𝗋'𝗌 𝖺𝗏𝖺𝗍𝖺𝗋"
        },
        guide: {
            en: "{p}cry [𝗍𝖺𝗀/𝗋𝖾𝗉𝗅𝗒]"
        },
        dependencies: {
            "discord-image-generation": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ api, event, args, message }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("discord-image-generation");
                require("fs-extra");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖽𝗂𝗌𝖼𝗈𝗋𝖽-𝗂𝗆𝖺𝗀𝖾-𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            let mention = Object.keys(event.mentions);
            let uid;

            if (event.type === "message_reply") {
                uid = event.messageReply.senderID;
            }
            else if (mention[0]) {
                uid = mention[0];
            }
            else {
                uid = event.senderID;
            }

            // Validate user ID
            if (!uid || isNaN(uid)) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗎𝗌𝖾𝗋 𝖨𝖣. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            // Get user info with error handling
            let userInfo;
            try {
                userInfo = await api.getUserInfo(uid);
                if (!userInfo || !userInfo[uid]) {
                    throw new Error("𝖴𝗌𝖾𝗋 𝗂𝗇𝖿𝗈 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽");
                }
            } catch (userError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈:", userError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            const avatarUrl = userInfo[uid].thumbSrc;
            
            if (!avatarUrl) {
                return message.reply("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖿𝖾𝗍𝖼𝗁 𝗎𝗌𝖾𝗋'𝗌 𝖺𝗏𝖺𝗍𝖺𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            // Create temporary directory
            const tmpDir = path.join(__dirname, "tmp");
            try {
                if (!fs.existsSync(tmpDir)) {
                    fs.mkdirSync(tmpDir, { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗍𝖾𝗆𝗉 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }

            const pathSave = path.join(tmpDir, `cry_${Date.now()}.png`);
            
            let img;
            try {
                img = await new DIG.Mikkelsen().getImage(avatarUrl);
                if (!img || img.length === 0) {
                    throw new Error("𝖨𝗆𝖺𝗀𝖾 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖿𝖺𝗂𝗅𝖾𝖽");
                }
            } catch (imgError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝗂𝗆𝖺𝗀𝖾:", imgError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖼𝗋𝗒𝗂𝗇𝗀 𝗆𝖾𝗆𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗐𝗂𝗍𝗁 𝖺 𝖽𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝗎𝗌𝖾𝗋.");
            }

            try {
                fs.writeFileSync(pathSave, Buffer.from(img));
            } catch (writeError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗂𝗆𝖺𝗀𝖾:", writeError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            // Verify file was written
            if (!fs.existsSync(pathSave)) {
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗂𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            let body;
            if (!mention[0] && event.type !== "message_reply") {
                body = "😂 𝖫𝗈𝗅, 𝗒𝗈𝗎 𝗆𝖺𝖽𝖾 𝗒𝗈𝗎𝗋𝗌𝖾𝗅𝖿 𝖼𝗋𝗒!\n👉 𝖱𝖾𝗆𝖾𝗆𝖻𝖾𝗋 𝗍𝗈 𝗋𝖾𝗉𝗅𝗒 𝗈𝗋 𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝗌𝗈𝗆𝖾𝗈𝗇𝖾.";
            } else {
                body = "😭 𝖳𝗁𝗂𝗌 𝗉𝖾𝗋𝗌𝗈𝗇 𝖺𝗅𝗐𝖺𝗒𝗌 𝗆𝖺𝗄𝖾𝗌 𝗆𝖾 𝖼𝗋𝗒...";
            }

            await message.reply({
                body: body,
                attachment: fs.createReadStream(pathSave)
            });

            // Clean up with error handling
            try {
                if (fs.existsSync(pathSave)) {
                    fs.unlinkSync(pathSave);
                }
            } catch (cleanupError) {
                console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗍𝖾𝗆𝗉 𝖿𝗂𝗅𝖾:", cleanupError);
            }

        } catch (err) {
            console.error("💥 𝖢𝗋𝗒 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", err);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (err.message.includes('getImage')) {
                errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝗐𝗂𝗍𝗁 𝖺 𝖽𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝗎𝗌𝖾𝗋.";
            } else if (err.message.includes('avatar')) {
                errorMessage = "❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖿𝖾𝗍𝖼𝗁 𝗎𝗌𝖾𝗋'𝗌 𝖺𝗏𝖺𝗍𝖺𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
