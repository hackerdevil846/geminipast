const axios = require("axios");
const fs = require("fs-extra");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "drip",
        aliases: ["drippic", "stylish"],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 3,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "Drip effect on your image"
        },
        longDescription: {
            en: "Adds drip effect to your profile picture"
        },
        guide: {
            en: "{p}drip"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "jimp": ""
        }
    },

    circle: async function(image) {
        const imageBuffer = await jimp.read(image);
        imageBuffer.circle();
        return await imageBuffer.getBufferAsync("image/png");
    },

    onStart: async function({ message, event }) {
        try {
            const pathImg = __dirname + `/cache/${event.threadID}_${event.senderID}.png`;
            const pathAva = __dirname + `/cache/avt${event.senderID}.png`;

            // Get user's avatar
            const Avatar = (await axios.get(
                `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                { responseType: "arraybuffer" }
            )).data;
            
            await fs.writeFileSync(pathAva, Buffer.from(Avatar, 'utf-8'));

            // Process avatar to circle
            const avatar = await this.circle(pathAva);
            
            // Get drip template
            const dripTemplate = await axios.get("https://i.imgur.com/e3YvQWP.jpg", {
                responseType: "arraybuffer"
            });
            
            await fs.writeFileSync(pathImg, Buffer.from(dripTemplate.data, "utf-8"));

            // Load both images using jimp
            const template = await jimp.read(pathImg);
            const avaImage = await jimp.read(avatar);
            
            // Resize avatar to fit the template
            avaImage.resize(239, 239);
            
            // Composite the avatar onto the template
            template.composite(avaImage, 320, 80);

            // Save the result
            await template.writeAsync(pathImg);
            await fs.unlinkSync(pathAva);

            await message.reply({
                body: "Drip Effect Image Created Successfully!",
                attachment: fs.createReadStream(pathImg)
            });

            await fs.unlinkSync(pathImg);

        } catch (error) {
            console.error("Drip Error:", error);
            await message.reply("Error processing image");
        }
    }
};
