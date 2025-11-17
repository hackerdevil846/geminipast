const fs = require("fs-extra");
const axios = require("axios");
const jimp = require("jimp");
const path = require("path");

module.exports = {
    config: {
        name: "delete",
        aliases: ["remove", "del"],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "media",
        shortDescription: {
            en: "Delete image generator"
        },
        longDescription: {
            en: "Delete korar jonno image generator"
        },
        guide: {
            en: "{p}delete [tag]"
        },
        dependencies: {
            "fs-extra": "",
            "axios": "",
            "jimp": ""
        }
    },

    onLoad: async function() {
        const dirMaterial = __dirname + `/cache/`;
        const imagePath = path.resolve(__dirname, 'cache', 'toilet1.png');
        
        if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
        if (!fs.existsSync(imagePath)) {
            try {
                const { data } = await axios.get("https://i.imgur.com/vsJYfw5.png", { responseType: 'arraybuffer' });
                fs.writeFileSync(imagePath, Buffer.from(data, 'utf-8'));
            } catch (error) {
                console.error("Failed to download image:", error);
            }
        }
    },

    onStart: async function({ message, event, args, usersData }) {
        try {
            const { senderID } = event;
            const mention = Object.keys(event.mentions);
            
            if (!mention[0]) return message.reply("Please tag someone to delete! 🖱️");
            
            const hc = Math.floor(Math.random() * 101);
            const rd = Math.floor(Math.random() * 100000) + 100000;
            
            // Update user money
            try {
                const userData = await usersData.get(senderID);
                await usersData.set(senderID, {
                    money: (userData?.money || 0) + parseInt(hc * rd),
                    data: userData?.data || {}
                });
            } catch (moneyError) {
                console.error("Money update error:", moneyError);
            }

            const one = senderID;
            const two = mention[0];
            const __root = path.resolve(__dirname, "cache");

            async function circle(image) {
                const img = await jimp.read(image);
                img.circle();
                return await img.getBufferAsync("image/png");
            }

            async function makeImage() {
                const hon_img = await jimp.read(__root + "/toilet1.png");
                const pathImg = __root + `/toilet1_${one}_${two}.png`;
                const avatarOne = __root + `/avt_${one}.png`;
                const avatarTwo = __root + `/avt_${two}.png`;
                
                const getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
                fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));
                
                const getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
                fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));
                
                const circleOne = await jimp.read(await circle(avatarOne));
                const circleTwo = await jimp.read(await circle(avatarTwo));
                
                hon_img.resize(748, 356)
                       .composite(circleOne.resize(100, 100), 30, 65)
                       .composite(circleTwo.resize(100, 100), 30, 65);
                
                const raw = await hon_img.getBufferAsync("image/png");
                fs.writeFileSync(pathImg, raw);
                
                fs.unlinkSync(avatarOne);
                fs.unlinkSync(avatarTwo);
                
                return pathImg;
            }

            const pathImg = await makeImage();
            await message.reply({
                body: `🧹 Delete korthe caiso ei ta? +${hc*rd}💵!`,
                attachment: fs.createReadStream(pathImg)
            });
            
            fs.unlinkSync(pathImg);

        } catch (error) {
            console.error("Delete command error:", error);
            await message.reply("❌ Failed to create delete image.");
        }
    }
};
