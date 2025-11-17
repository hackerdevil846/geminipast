const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
    config: {
        name: "clown",
        aliases: [],
        version: "1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "edit-img",
        shortDescription: {
            en: "🎪 𝖠𝖽𝖽 𝖼𝗅𝗈𝗐𝗇 𝗏𝗂𝖻𝖾𝗌 𝗍𝗈 𝗒𝗈𝗎𝗋𝗌𝖾𝗅𝖿 𝗈𝗋 𝖿𝗋𝗂𝖾𝗇𝖽𝗌"
        },
        longDescription: {
            en: "🎪 𝖢𝗋𝖾𝖺𝗍𝖾 𝖿𝗎𝗇𝗇𝗒 𝖼𝗅𝗈𝗐𝗇-𝗍𝗁𝖾𝗆𝖾𝖽 𝗂𝗆𝖺𝗀𝖾𝗌 𝖿𝗋𝗈𝗆 𝗎𝗌𝖾𝗋 𝖺𝗏𝖺𝗍𝖺𝗋𝗌"
        },
        guide: {
            en: "{p}clown [𝗋𝖾𝗉𝗅𝗒/𝗍𝖺𝗀 𝗌𝗈𝗆𝖾𝗈𝗇𝖾]"
        },
        dependencies: {
            "discord-image-generation": "",
            "fs-extra": "",
            "axios": "",
            "path": ""
        }
    },

    onStart: async function({ message, event, usersData }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("discord-image-generation");
                require("fs-extra");
                require("axios");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖽𝗂𝗌𝖼𝗈𝗋𝖽-𝗂𝗆𝖺𝗀𝖾-𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗈𝗇, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗑𝗂𝗈𝗌, 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            let targetID;
            
            if (event.type === "message_reply") {
                targetID = event.messageReply.senderID;
            } else if (Object.keys(event.mentions).length > 0) {
                targetID = Object.keys(event.mentions)[0];
            } else {
                targetID = event.senderID;
            }

            // Validate target ID
            if (!targetID || isNaN(targetID)) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗎𝗌𝖾𝗋 𝖨𝖣. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

            // Create tmp directory if it doesn't exist
            const tmpDir = path.join(__dirname, "tmp");
            try {
                if (!fs.existsSync(tmpDir)) {
                    fs.mkdirSync(tmpDir, { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗍𝗆𝗉 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }

            const pathSave = path.join(tmpDir, `clown_${targetID}_${Date.now()}.png`);
            
            const loadingMsg = await message.reply("🎪 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖼𝗅𝗈𝗐𝗇 𝗂𝗆𝖺𝗀𝖾...");

            try {
                // Create triggered effect with error handling
                const triggeredBuffer = await new DIG.Triggered().getImage(avatarUrl);
                
                if (!triggeredBuffer || triggeredBuffer.length === 0) {
                    throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗂𝗆𝖺𝗀𝖾 𝖻𝗎𝖿𝖿𝖾𝗋 𝗋𝖾𝗍𝗎𝗋𝗇𝖾𝖽");
                }

                fs.writeFileSync(pathSave, triggeredBuffer);

                // Verify file was written successfully
                if (!fs.existsSync(pathSave)) {
                    throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗂𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾");
                }

                const stats = fs.statSync(pathSave);
                if (stats.size === 0) {
                    throw new Error("𝖨𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                }

                let bodyMessage;
                if (targetID === event.senderID) {
                    bodyMessage = "🤡 𝖸𝗈𝗎'𝗋𝖾 𝗍𝗁𝖾 𝖼𝗅𝗈𝗐𝗇! 𝖫𝗈𝗈𝗄 𝖺𝗍 𝗒𝗈𝗎𝗋𝗌𝖾𝗅𝖿!";
                } else {
                    let targetName, senderName;
                    try {
                        targetName = await usersData.getName(targetID);
                        senderName = await usersData.getName(event.senderID);
                    } catch (nameError) {
                        console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗇𝖺𝗆𝖾𝗌:", nameError);
                        targetName = "𝖳𝗁𝖾𝗆";
                        senderName = "𝖸𝗈𝗎";
                    }
                    bodyMessage = `🤡 ${senderName} 𝖺𝖽𝖽𝖾𝖽 𝗌𝗈𝗆𝖾 𝖼𝗅𝗈𝗐𝗇𝗂𝗌𝗁 𝗏𝗂𝖻𝖾𝗌 𝗍𝗈 ${targetName}!`;
                }

                // Unsend loading message
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                await message.reply({
                    body: bodyMessage,
                    attachment: fs.createReadStream(pathSave)
                });

                console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝖼𝗅𝗈𝗐𝗇 𝗂𝗆𝖺𝗀𝖾 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋 ${targetID}`);

            } catch (imageError) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", imageError);
                
                // Unsend loading message
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                const errorMessages = [
                    "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝗅𝗈𝗐𝗇 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.",
                    "❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝗍𝗁𝖾 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺 𝖽𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝗎𝗌𝖾𝗋.",
                    "❌ 𝖨𝗆𝖺𝗀𝖾 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖿𝖺𝗂𝗅𝖾𝖽. 𝖳𝗁𝖾 𝗌𝖾𝗋𝗏𝖾𝗋 𝗆𝖺𝗒 𝖻𝖾 𝖻𝗎𝗌𝗒."
                ];
                
                const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
                await message.reply(randomError);
            }

            // Clean up with error handling
            try {
                if (fs.existsSync(pathSave)) {
                    fs.unlinkSync(pathSave);
                    console.log(`🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾: ${pathSave}`);
                }
            } catch (cleanupError) {
                console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾:", cleanupError.message);
            }

        } catch (error) {
            console.error("💥 𝖢𝗅𝗈𝗐𝗇 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('DIG')) {
                errorMessage = "❌ 𝖨𝗆𝖺𝗀𝖾 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝗅𝗂𝖻𝗋𝖺𝗋𝗒 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌.";
            } else if (error.message.includes('avatar') || error.message.includes('Facebook')) {
                errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝗎𝗌𝖾𝗋 𝖺𝗏𝖺𝗍𝖺𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
