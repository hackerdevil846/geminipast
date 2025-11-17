const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "drizzle",
        aliases: ["drip"],
        version: "1.0",
        author: "Asif Mahmud",
        countDown: 10,
        role: 0,
        category: "image",
        shortDescription: {
            en: "Add drip effect to profile picture"
        },
        longDescription: {
            en: "Applies a cool drip effect to your or mentioned user's profile picture"
        },
        guide: {
            en: "{p}drizzle [@mention or reply]\nIf no mention or reply, uses your profile picture."
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ Missing dependencies: axios and fs-extra");
            }

            const { senderID, mentions, type, messageReply } = event;

            // Determine user ID for avatar
            let uid;
            if (Object.keys(mentions).length > 0) {
                uid = Object.keys(mentions)[0];
            } else if (type === "message_reply") {
                uid = messageReply.senderID;
            } else {
                uid = senderID;
            }

            const avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

            const cacheDir = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            const res = await axios.get(`https://api.popcat.xyz/v2/drip?image=${encodeURIComponent(avatarURL)}`, {
                responseType: "arraybuffer"
            });

            const filePath = path.join(cacheDir, `drip_${uid}_${Date.now()}.png`);
            await fs.writeFile(filePath, res.data);

            await message.reply({
                body: "💧 Here's your drip effect image!",
                attachment: fs.createReadStream(filePath)
            });

            // Clean up after sending
            fs.unlinkSync(filePath);

        } catch (err) {
            console.error("Drizzle Error:", err);
            await message.reply("❌ Failed to generate drip image.");
        }
    }
};
