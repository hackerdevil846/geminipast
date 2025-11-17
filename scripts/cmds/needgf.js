const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const https = require("https");

const encodedUrl = "aHR0cHM6Ly9yYXNpbi1hcGlzLm9ucmVuZGVyLmNvbQ==";
const encodedKey = "cnNfaGVpNTJjbTgtbzRvai11Y2ZjLTR2N2MtZzE=";

function decode(b64) {
    return Buffer.from(b64, "base64").toString("utf-8");
}

function downloadImage(url, filePath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        https.get(url, res => {
            if (res.statusCode !== 200) return reject(new Error(`Image fetch failed with status: ${res.statusCode}`));
            res.pipe(file);
            file.on("finish", () => file.close(resolve));
        }).on("error", err => {
            fs.unlinkSync(filePath);
            reject(err);
        });
    });
}

module.exports = {
    config: {
        name: "needgf",
        aliases: ["findgf", "singlehope"],
        version: "1.0.4",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "💝 Single people's last hope file"
        },
        longDescription: {
            en: "Generate random girlfriend images for single people"
        },
        category: "fun",
        guide: {
            en: "{p}needgf"
        },
        countDown: 20,
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function({ message, event }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("path");
            } catch (e) {
                return message.reply("Missing dependencies. Please install required packages.");
            }

            const apiUrl = decode(encodedUrl);
            const apiKey = decode(encodedKey);
            const fullUrl = `${apiUrl}/api/rasin/gf?apikey=${apiKey}`;

            await message.reply("💖 Your girlfriend image is being created...");

            const res = await axios.get(fullUrl);
            const title = res.data.data.title;
            const imgUrl = res.data.data.url;

            const imgPath = path.join(__dirname, "cache", `gf_${event.senderID}.jpg`);
            await downloadImage(imgUrl, imgPath);

            await message.reply({
                body: `💝 ${title}\n\n✨ Your girlfriend is coming...`,
                attachment: fs.createReadStream(imgPath)
            });

            // Clean up
            fs.unlinkSync(imgPath);

        } catch (err) {
            console.error("Error:", err.message);
            await message.reply("⚠️ Image loading problem, please try again later");
        }
    }
};
