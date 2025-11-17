const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "owner",
        aliases: ["boss"], // Remove "admin" from here
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "✨ 𝑃𝑟𝑒𝑚𝑖𝑢𝑚 𝑂𝑤𝑛𝑒𝑟 𝑃𝑟𝑜𝑓𝑖𝑙𝑒"
        },
        longDescription: {
            en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑜𝑤𝑛𝑒𝑟'𝑠 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑖𝑛 𝑝𝑟𝑒𝑚𝑖𝑢𝑚 𝑎𝑡𝑜𝑚𝑖𝑐 𝑑𝑒𝑠𝑖𝑔𝑛 𝑠𝑡𝑦𝑙𝑒 𝑤𝑖𝑡ℎ 𝑣𝑖𝑑𝑒𝑜 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡"
        },
        category: "𝑎𝑑𝑚𝑖𝑛",
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
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            // --- Owner Information ---
            const ownerInfo = {
                name: '𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑',
                preference: '🕋 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝐿𝑖𝑓𝑒𝑠𝑡𝑦𝑙𝑒',
                hobbies: '🎧 𝑀𝑢𝑠𝑖𝑐, 🎮 𝐺𝑎𝑚𝑖𝑛𝑔, 📚 𝐿𝑒𝑎𝑟𝑛𝑖𝑛𝑔',
                gender: '𝑀𝑎𝑙𝑒',
                age: '18+',
                height: '5𝑓𝑡+',
                facebookLink: '🌐 https://www.facebook.com/share/1HPjorq8ce/',
                nick: '𝐽𝑎𝑚𝑎𝑖'
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

            // --- Beautiful Knight Design with Mathematical Bold Italic ---
            const response = `
╭───────『 ✧  𝑂𝑊𝑁𝐸𝑅 𝑃𝑅𝑂𝐹𝐼𝐿𝐸  ✧ 』───────╮
┃
┃  ❄️ 𝐵𝐴𝑆𝐼𝐶 𝐼𝑁𝐹𝑂
┠────────────────────────────────────
┃  ✦ 𝑁𝑎𝑚𝑒      ➠ ${ownerInfo.name}
┃  ✦ 𝑁𝑖𝑐𝑘𝑛𝑎𝑚𝑒  ➠ ${ownerInfo.nick}
┃  ✦ 𝐴𝑔𝑒        ➠ ${ownerInfo.age}
┃  ✦ 𝐺𝑒𝑛𝑑𝑒𝑟   ➠ ${ownerInfo.gender}
┃  ✦ 𝐻𝑒𝑖𝑔ℎ𝑡    ➠ ${ownerInfo.height}
┠────────────────────────────────────
┃  ❄️ 𝐿𝐼𝐹𝐸𝑆𝑇𝑌𝐿𝐸
┠────────────────────────────────────
┃  ✦ 𝑃𝑟𝑒𝑓𝑒𝑟𝑒𝑛𝑐𝑒 ➠ ${ownerInfo.preference}
┃  ✦ 𝐻𝑜𝑏𝑏𝑖𝑒𝑠      ➠ ${ownerInfo.hobbies}
┠────────────────────────────────────
┃  ❄️ 𝐶𝑂𝑁𝑇𝐴𝐶𝑇
┠────────────────────────────────────
┃  ✦ 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 ➠ ${ownerInfo.facebookLink}
┃
╰───────『 ✧  𝐴𝑇𝑂𝑀𝐼𝐶 𝐵𝑌 𝐴𝑆𝐼𝐹  ✧ 』───────╯`;

            // --- Sending the Message ---
            await message.reply({
                body: response,
                attachment: fs.createReadStream(videoPath)
            });

            // Clean up the video file after sending
            fs.unlinkSync(videoPath);

        } catch (error) {
            console.error('❌ 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 "𝑜𝑤𝑛𝑒𝑟" 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:', error);
            await message.reply('❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑒𝑥𝑒𝑐𝑢𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.');
        }
    }
};
