const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "sleep",
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "fun",
        shortDescription: {
            en: "𝐒𝐥𝐞𝐞𝐩 𝐫𝐞𝐬𝐩𝐨𝐧𝐬𝐞"
        },
        longDescription: {
            en: "𝐀𝐮𝐭𝐨𝐦𝐚𝐭𝐢𝐜𝐚𝐥𝐥𝐲 𝐫𝐞𝐬𝐩𝐨𝐧𝐝𝐬 𝐭𝐨 𝐬𝐥𝐞𝐞𝐩 𝐦𝐞𝐬𝐬𝐚𝐠𝐞𝐬"
        },
        guide: {
            en: "𝐉𝐮𝐬𝐭 𝐭𝐲𝐩𝐞: 𝐬𝐥𝐞𝐞𝐩, 𝐧𝐢𝐠𝐡𝐭, 𝐛𝐞𝐝, 𝐭𝐢𝐫𝐞𝐝, 𝐠𝐧"
        }
    },

    onStart: async function() {},
    
    onChat: async function({ event, message }) {
        try {
            // 𝐕𝐞𝐫𝐲 𝐬𝐡𝐨𝐫𝐭 𝐭𝐫𝐢𝐠𝐠𝐞𝐫 𝐰𝐨𝐫𝐝𝐬 𝐨𝐧𝐥𝐲
            const sleepKeywords = [
                "sleep", "night", "bed", "tired", "gn"
            ];
            
            // 𝐂𝐡𝐞𝐜𝐤 𝐢𝐟 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐜𝐨𝐧𝐭𝐚𝐢𝐧𝐬 𝐬𝐡𝐨𝐫𝐭 𝐤𝐞𝐲𝐰𝐨𝐫𝐝𝐬
            if (event.body && sleepKeywords.some(keyword => 
                event.body.toLowerCase().includes(keyword.toLowerCase())
            )) {
                console.log("🔍 𝐒𝐥𝐞𝐞𝐩 𝐤𝐞𝐲𝐰𝐨𝐫𝐝 𝐝𝐞𝐭𝐞𝐜𝐭𝐞𝐝:", event.body);
                
                const gifPath = path.join(__dirname, "noprefix", "sleep.gif");
                
                // 𝐂𝐡𝐞𝐜𝐤 𝐢𝐟 𝐆𝐈𝐅 𝐟𝐢𝐥𝐞 𝐞𝐱𝐢𝐬𝐭𝐬
                let fileExists = false;
                
                try {
                    fileExists = fs.existsSync(gifPath);
                    if (fileExists) {
                        const stats = fs.statSync(gifPath);
                        fileExists = stats.size > 0;
                    }
                } catch (fileError) {
                    console.error("❌ 𝐄𝐫𝐫𝐨𝐫 𝐜𝐡𝐞𝐜𝐤𝐢𝐧𝐠 𝐆𝐈𝐅:", fileError.message);
                }

                // 𝐒𝐞𝐧𝐝 𝐫𝐞𝐬𝐩𝐨𝐧𝐬𝐞
                if (fileExists) {
                    await message.reply({
                        body: "𝐒𝐥𝐞𝐞𝐩 𝐰𝐞𝐥𝐥! 💤\n𝐒𝐰𝐞𝐞𝐭 𝐝𝐫𝐞𝐚𝐦𝐬! 🌙",
                        attachment: fs.createReadStream(gifPath)
                    });
                } else {
                    await message.reply({
                        body: "𝐒𝐥𝐞𝐞𝐩 𝐰𝐞𝐥𝐥! 💤\n𝐒𝐰𝐞𝐞𝐭 𝐝𝐫𝐞𝐚𝐦𝐬! 🌙"
                    });
                }
            }
        } catch (error) {
            console.error("💥 𝐒𝐥𝐞𝐞𝐩 𝐞𝐫𝐫𝐨𝐫:", error);
            await message.reply("𝐆𝐨𝐨𝐝𝐧𝐢𝐠𝐡𝐭! 🌙");
        }
    }
};
