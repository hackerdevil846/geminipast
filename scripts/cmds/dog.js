const axios = require('axios');
const request = require('request');
const fs = require("fs-extra");

module.exports.config = {
    name: "dog",
    aliases: ["puppy", "doggie"],
    version: "1.0.1",
    author: "Asif Mahmud",
    countDown: 1,
    role: 0,
    category: "media",
    shortDescription: {
        en: "Boss ke dekhkar jonno"
    },
    longDescription: {
        en: "Get random dog pictures"
    },
    guide: {
        en: "{p}dog"
    },
    dependencies: {
        "axios": "",
        "request": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event }) {
    try {
        const response = await axios.get('https://nekos.life/api/v2/img/woof');
        const ext = response.data.url.substring(response.data.url.lastIndexOf(".") + 1);
        const path = __dirname + `/cache/dog.${ext}`;
        
        request(response.data.url).pipe(fs.createWriteStream(path)).on("close", () => {
            message.reply({
                body: `🐕‍🦺 | Dog Pic for you boss!`,
                attachment: fs.createReadStream(path)
            }, (err) => {
                if (!err) fs.unlinkSync(path);
            });
        });
    } catch (error) {
        console.error("Dog Error:", error);
        message.reply("❌ | Error fetching dog image!");
    }
};
