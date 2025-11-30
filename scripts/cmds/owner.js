const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "owner",
        aliases: ["boss"], 
        version: "2.0.0",
        role: 0,
        author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝", // Updated Font
        shortDescription: {
            en: "✨ 𝐏𝐫𝐞𝐦𝐢𝐮𝐦 𝐎𝐰𝐧𝐞𝐫 𝐏𝐫𝐨𝐟𝐢𝐥𝐞"
        },
        longDescription: {
            en: "Displays owner info in premium dark style"
        },
        category: "info",
        guide: {
            en: "{p}owner"
        },
        countDown: 5,
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function ({ message, event }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝐌𝐢𝐬𝐬𝐢𝐧𝐠 𝐝𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐢𝐞𝐬. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐢𝐧𝐬𝐭𝐚𝐥𝐥 𝐚𝐱𝐢𝐨𝐬 𝐚𝐧𝐝 𝐟𝐬-𝐞𝐱𝐭𝐫𝐚.");
            }

            // --- Owner Information (Updated with Dark Font) ---
            const ownerInfo = {
                name: '𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝',
                preference: '𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐋𝐢𝐟𝐞𝐬𝐭𝐲𝐥𝐞',
                hobbies: '𝐌𝐮𝐬𝐢𝐜, 𝐆𝐚𝐦𝐢𝐧𝐠, 𝐋𝐞𝐚𝐫𝐧𝐢𝐧𝐠',
                gender: '𝐌𝐚𝐥𝐞',
                age: '𝟏𝟖+',
                height: '𝟓𝐟𝐭+',
                facebookLink: 'https://www.facebook.com/share/1HPjorq8ce/',
                nick: '𝐉𝐚𝐦𝐚𝐢'
            };

            // --- Video and File Handling ---
            const videoUrl = 'https://files.catbox.moe/op5iay.mp4';
            const cacheFolderPath = path.join(__dirname, 'cache');
            const videoPath = path.join(cacheFolderPath, 'owner_video.mp4');

            // Create cache directory if it doesn't exist
            await fs.ensureDir(cacheFolderPath);

            // Download the video
            const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
            await fs.writeFile(videoPath, Buffer.from(videoResponse.data));

            // --- NEW DARK STYLISH DESIGN ---
            const response = `
♛ 𝐎𝐖𝐍𝐄𝐑 𝐏𝐑𝐎𝐅𝐈𝐋𝐄 ♛
━━━━━━━━━━━━━━━━━━
👑 𝐍𝐚𝐦𝐞: ${ownerInfo.name}
🔖 𝐍𝐢𝐜𝐤𝐧𝐚𝐦𝐞: ${ownerInfo.nick}

👤 𝐏𝐄𝐑𝐒𝐎𝐍𝐀𝐋 𝐈𝐍𝐅𝐎
━━━━━━━━━━━━━━━━━━
♂ 𝐆𝐞𝐧𝐝𝐞𝐫: ${ownerInfo.gender}
🎂 𝐀𝐠𝐞: ${ownerInfo.age}
📏 𝐇𝐞𝐢𝐠𝐡𝐭: ${ownerInfo.height}

🕋 𝐋𝐈𝐅𝐄𝐒𝐓𝐘𝐋𝐄
━━━━━━━━━━━━━━━━━━
☪ 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧: ${ownerInfo.preference}
🎮 𝐇𝐨𝐛𝐛𝐢𝐞𝐬: ${ownerInfo.hobbies}

🔗 𝐒𝐎𝐂𝐈𝐀𝐋 𝐂𝐎𝐍𝐍𝐄𝐂𝐓
━━━━━━━━━━━━━━━━━━
🌐 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤:
${ownerInfo.facebookLink}
━━━━━━━━━━━━━━━━━━
✨ 𝐀𝐓𝐎𝐌𝐈𝐂 𝐁𝐘 𝐀𝐒𝐈𝐅 ✨`;

            // --- Sending the Message ---
            await message.reply({
                body: response,
                attachment: fs.createReadStream(videoPath)
            });

            // Clean up the video file safely with a slight delay to ensure stream is done
            setTimeout(() => {
                try {
                    fs.unlinkSync(videoPath);
                } catch (e) {
                    console.log("Cleanup error (ignored):", e.message);
                }
            }, 5000);

        } catch (error) {
            console.error('❌ Error in owner command:', error);
            await message.reply('❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧.');
        }
    }
};
