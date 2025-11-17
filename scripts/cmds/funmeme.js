const fs = require('fs-extra');
const axios = require('axios');
const jimp = require('jimp');

module.exports = {
    config: {
        name: "funmeme",
        aliases: ["profilememe", "avatarmeme"],
        version: "1.0.2",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "image",
        shortDescription: {
            en: "Create meme with user's profile picture"
        },
        longDescription: {
            en: "Generate funny memes using users' profile pictures"
        },
        guide: {
            en: "{p}funmeme [@mention]"
        },
        dependencies: {
            "axios": "",
            "jimp": "",
            "fs-extra": ""
        }
    },

    onStart: async function ({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("jimp");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ Missing dependencies: axios, jimp, fs-extra");
            }

            const { senderID } = event;
            const mentions = Object.keys(event.mentions);
            const targetID = mentions[0] || senderID;

            await message.reply("⏳ Creating your meme...");

            // Load template image
            const templateUrl = "https://i.imgur.com/jHrYZ5Y.jpg";
            const templateResponse = await axios.get(templateUrl, { responseType: "arraybuffer" });
            const template = await jimp.read(templateResponse.data);

            // Load user avatar
            const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512`;
            const avatarResponse = await axios.get(avatarUrl, { responseType: "arraybuffer" });
            const avatar = await jimp.read(avatarResponse.data);

            // Resize avatar
            avatar.resize(200, 200);

            // Create circular avatar using jimp's built-in circle method
            avatar.circle();

            // Composite avatar onto template
            template.composite(avatar, 250, 150);

            // Save the final image
            const cacheDir = __dirname + '/cache/';
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            
            const path = cacheDir + `meme_${Date.now()}.png`;
            await template.writeAsync(path);

            await message.reply({
                body: "✅ Meme Created Successfully! 😂",
                attachment: fs.createReadStream(path)
            });

            // Clean up
            fs.unlinkSync(path);

        } catch (error) {
            console.error("Meme error:", error);
            await message.reply("❌ Failed to create meme. Please try again later.");
        }
    }
};
