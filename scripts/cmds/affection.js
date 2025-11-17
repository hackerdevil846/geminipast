const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "affection",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 10,
        role: 0,
        category: "𝑓𝑢𝑛",
        shortDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑙𝑜𝑣𝑒 𝑠ℎ𝑖𝑝 𝑖𝑚𝑎𝑔𝑒 𝑜𝑓 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟𝑠"
        },
        longDescription: {
            en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑠 𝑎 𝑐𝑢𝑡𝑒 𝑠ℎ𝑖𝑝 𝑖𝑚𝑎𝑔𝑒 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟 𝑎𝑣𝑎𝑡𝑎𝑟𝑠"
        },
        guide: {
            en: "{p}affection @𝑢𝑠𝑒𝑟1 @𝑢𝑠𝑒𝑟2"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            const { mentions } = event;

            // Require exactly two mentions
            const mentionIDs = Object.keys(mentions);
            if (mentionIDs.length < 2) {
                return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟𝑠 𝑡𝑜 𝑠ℎ𝑖𝑝.\n💡 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}affection @𝑢𝑠𝑒𝑟1 @𝑢𝑠𝑒𝑟2");
            }

            const uid1 = mentionIDs[0];
            const uid2 = mentionIDs[1];
            const name1 = mentions[uid1].replace("@", "");
            const name2 = mentions[uid2].replace("@", "");

            // Get profile picture URLs
            const avatar1 = `https://graph.facebook.com/${uid1}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;
            const avatar2 = `https://graph.facebook.com/${uid2}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

            // Create cache directory if it doesn't exist
            const cacheDir = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            const filePath = path.join(cacheDir, `affection_${uid1}_${uid2}_${Date.now()}.png`);

            try {
                // Generate ship image
                const res = await axios.get(`https://api.popcat.xyz/v2/ship?user1=${encodeURIComponent(avatar1)}&user2=${encodeURIComponent(avatar2)}`, {
                    responseType: "arraybuffer",
                    timeout: 30000
                });

                // Save the image
                fs.writeFileSync(filePath, Buffer.from(res.data));

                // Send the image with mention
                await message.reply({
                    body: `❤️ ${name1} 💞 ${name2} ❤️\n\n✨ 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑎𝑓𝑓𝑒𝑐𝑡𝑖𝑜𝑛 𝑖𝑚𝑎𝑔𝑒!`,
                    mentions: [
                        {
                            tag: name1,
                            id: uid1
                        },
                        {
                            tag: name2,
                            id: uid2
                        }
                    ],
                    attachment: fs.createReadStream(filePath)
                });

            } catch (apiError) {
                console.error("𝐴𝑃𝐼 𝐸𝑟𝑟𝑜𝑟:", apiError);
                await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑠ℎ𝑖𝑝 𝑖𝑚𝑎𝑔𝑒. 𝑇ℎ𝑒 𝑎𝑝𝑖 𝑚𝑖𝑔ℎ𝑡 𝑏𝑒 𝑑𝑜𝑤𝑛.");
            }

            // Clean up file after sending
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (cleanupError) {
                console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝐸𝑟𝑟𝑜𝑟:", cleanupError);
            }

        } catch (error) {
            console.error("𝐴𝑓𝑓𝑒𝑐𝑡𝑖𝑜𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎𝑓𝑓𝑒𝑐𝑡𝑖𝑜𝑛 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
