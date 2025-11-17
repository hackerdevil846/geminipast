const axios = require("axios");

module.exports = {
    config: {
        name: "alime",
        aliases: [],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "anime",
        shortDescription: {
            en: "𝐀𝐧𝐢𝐦𝐞 𝐢𝐦𝐚𝐠𝐞𝐬 - 𝐛𝐨𝐭𝐡 𝐒𝐅𝐖 𝐚𝐧𝐝 𝐍𝐒𝐅𝐖"
        },
        longDescription: {
            en: "𝐆𝐞𝐭 𝐚𝐧𝐢𝐦𝐞 𝐢𝐦𝐚𝐠𝐞𝐬 𝐟𝐫𝐨𝐦 𝐯𝐚𝐫𝐢𝐨𝐮𝐬 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐞𝐬"
        },
        guide: {
            en: "{p}alime [tag]\n{p}alime list - 𝐒𝐡𝐨𝐰 𝐚𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐭𝐚𝐠𝐬"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, event, args, api }) {
        try {
            // Dependency check
            try {
                require("axios");
            } catch (e) {
                return message.reply("❌ 𝐌𝐢𝐬𝐬𝐢𝐧𝐠 𝐝𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐢𝐞𝐬. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐢𝐧𝐬𝐭𝐚𝐥𝐥 𝐚𝐱𝐢𝐨𝐬.");
            }

            // All API endpoints
            const apiEndpoints = {
                "sfw": {
                    "waifu": "https://api.waifu.pics/sfw/waifu",
                    "neko": "https://api.waifu.pics/sfw/neko",
                    "shinobu": "https://api.waifu.pics/sfw/shinobu",
                    "megumin": "https://api.waifu.pics/sfw/megumin",
                    "bully": "https://api.waifu.pics/sfw/bully",
                    "cuddle": "https://api.waifu.pics/sfw/cuddle",
                    "cry": "https://api.waifu.pics/sfw/cry",
                    "hug": "https://api.waifu.pics/sfw/hug",
                    "awoo": "https://api.waifu.pics/sfw/awoo",
                    "kiss": "https://api.waifu.pics/sfw/kiss",
                    "lick": "https://api.waifu.pics/sfw/lick",
                    "pat": "https://api.waifu.pics/sfw/pat",
                    "smug": "https://api.waifu.pics/sfw/smug",
                    "bonk": "https://api.waifu.pics/sfw/bonk",
                    "yeet": "https://api.waifu.pics/sfw/yeet",
                    "blush": "https://api.waifu.pics/sfw/blush",
                    "smile": "https://api.waifu.pics/sfw/smile",
                    "wave": "https://api.waifu.pics/sfw/wave",
                    "highfive": "https://api.waifu.pics/sfw/highfive",
                    "handhold": "https://api.waifu.pics/sfw/handhold",
                    "nom": "https://api.waifu.pics/sfw/nom",
                    "bite": "https://api.waifu.pics/sfw/bite",
                    "glomp": "https://api.waifu.pics/sfw/glomp",
                    "slap": "https://api.waifu.pics/sfw/slap",
                    "kill": "https://api.waifu.pics/sfw/kill",
                    "kick": "https://api.waifu.pics/sfw/kick",
                    "happy": "https://api.waifu.pics/sfw/happy",
                    "wink": "https://api.waifu.pics/sfw/wink",
                    "poke": "https://api.waifu.pics/sfw/poke",
                    "dance": "https://api.waifu.pics/sfw/dance",
                    "cringe": "https://api.waifu.pics/sfw/cringe"
                },
                "nsfw": {
                    "neko": "https://api.waifu.pics/nsfw/neko",
                    "waifu": "https://api.waifu.pics/nsfw/waifu",
                    "blowjob": "https://api.waifu.pics/nsfw/blowjob",
                    "hentai": "https://nekobot.xyz/api/image?type=hentai",
                    "pgif": "https://nekobot.xyz/api/image?type=pgif"
                }
            };

            // Show tag list if requested
            if (!args[0] || args[0].toLowerCase() === 'list') {
                const sfwTags = Object.keys(apiEndpoints.sfw).join(", ");
                const nsfwTags = Object.keys(apiEndpoints.nsfw).join(", ");
                
                const tagList = `🎨 𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐀𝐧𝐢𝐦𝐞 𝐓𝐚𝐠𝐬:\n\n` +
                               `🌈 𝐒𝐅𝐖 𝐓𝐚𝐠𝐬:\n${sfwTags}\n\n` +
                               `🔞 𝐍𝐒𝐅𝐖 𝐓𝐚𝐠𝐬:\n${nsfwTags}\n\n` +
                               `💡 𝐔𝐬𝐞: /alime [tag]`;
                
                return message.reply(tagList);
            }

            const tag = args[0].toLowerCase().trim();
            let apiUrl;
            let selectedTag = tag;

            // Check if tag exists in either category
            if (apiEndpoints.sfw.hasOwnProperty(tag)) {
                apiUrl = apiEndpoints.sfw[tag];
            } else if (apiEndpoints.nsfw.hasOwnProperty(tag)) {
                apiUrl = apiEndpoints.nsfw[tag];
            } else {
                return message.reply(`❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐭𝐚𝐠: ${tag}\n💡 𝐔𝐬𝐞 '/alime list' 𝐭𝐨 𝐬𝐞𝐞 𝐚𝐥𝐥 𝐚𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐭𝐚𝐠𝐬.`);
            }

            console.log(`🎨 𝐑𝐞𝐪𝐮𝐞𝐬𝐭𝐢𝐧𝐠 𝐚𝐧𝐢𝐦𝐞 𝐢𝐦𝐚𝐠𝐞: ${selectedTag} (${apiUrl})`);

            // Show processing message
            let processingMsg;
            try {
                processingMsg = await message.reply("🔄 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐚𝐧𝐢𝐦𝐞 𝐢𝐦𝐚𝐠𝐞...");
            } catch (msgError) {
                console.warn("𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐬𝐞𝐧𝐝 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐦𝐞𝐬𝐬𝐚𝐠𝐞:", msgError.message);
            }

            try {
                const response = await axios.get(apiUrl, { 
                    timeout: 15000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                let imageUrl;
                
                // Handle different API response formats
                if (apiUrl.includes('nekobot.xyz')) {
                    imageUrl = response.data.message;
                } else if (apiUrl.includes('waifu.pics')) {
                    imageUrl = response.data.url;
                } else {
                    imageUrl = response.data?.url || response.data?.message;
                }
                
                if (!imageUrl) {
                    throw new Error("𝐍𝐨 𝐢𝐦𝐚𝐠𝐞 𝐔𝐑𝐋 𝐟𝐨𝐮𝐧𝐝 𝐢𝐧 𝐀𝐏𝐈 𝐫𝐞𝐬𝐩𝐨𝐧𝐬𝐞");
                }

                console.log(`📥 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐢𝐦𝐚𝐠𝐞: ${imageUrl}`);

                // Get image stream with error handling
                let imageStream;
                try {
                    imageStream = await global.utils.getStreamFromURL(imageUrl);
                    if (!imageStream) {
                        throw new Error("𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐜𝐫𝐞𝐚𝐭𝐞 𝐢𝐦𝐚𝐠𝐞 𝐬𝐭𝐫𝐞𝐚𝐦");
                    }
                } catch (streamError) {
                    console.error("❌ 𝐈𝐦𝐚𝐠𝐞 𝐬𝐭𝐫𝐞𝐚𝐦 𝐞𝐫𝐫𝐨𝐫:", streamError.message);
                    throw new Error("𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐥𝐨𝐚𝐝 𝐢𝐦𝐚𝐠𝐞");
                }

                const messageBody = `🎨 𝐀𝐧𝐢𝐦𝐞 𝐈𝐦𝐚𝐠𝐞\n━━━━━━━━━━━━━━\n✨ 𝐓𝐚𝐠: ${selectedTag}\n💫 𝐒𝐨𝐮𝐫𝐜𝐞: 𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝`;

                // Send the image
                await message.reply({
                    body: messageBody,
                    attachment: imageStream
                });

                console.log(`✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐬𝐞𝐧𝐭 𝐚𝐧𝐢𝐦𝐞 𝐢𝐦𝐚𝐠𝐞: ${selectedTag}`);

                // Clean up processing message with correct API function
                if (processingMsg && processingMsg.messageID) {
                    try {
                        await api.unsendMessage(processingMsg.messageID);
                    } catch (unsendError) {
                        console.warn("𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐮𝐧𝐬𝐞𝐧𝐝 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐦𝐞𝐬𝐬𝐚𝐠𝐞:", unsendError.message);
                    }
                }

            } catch (error) {
                console.error("❌ 𝐈𝐦𝐚𝐠𝐞 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐞𝐫𝐫𝐨𝐫:", error.message);
                
                // Clean up processing message on error
                if (processingMsg && processingMsg.messageID) {
                    try {
                        await api.unsendMessage(processingMsg.messageID);
                    } catch (unsendError) {
                        console.warn("𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐮𝐧𝐬𝐞𝐧𝐝 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐦𝐞𝐬𝐬𝐚𝐠𝐞:", unsendError.message);
                    }
                }
                
                await message.reply(`❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐥𝐨𝐚𝐝 𝐢𝐦𝐚𝐠𝐞 𝐟𝐨𝐫 𝐭𝐚𝐠: ${selectedTag}\n💡 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐧𝐨𝐭𝐡𝐞𝐫 𝐭𝐚𝐠 𝐨𝐫 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.`);
            }

        } catch (error) {
            console.error("💥 𝐀𝐥𝐢𝐦𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐞𝐫𝐫𝐨𝐫:", error);
            
            let errorMessage = "❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝐍𝐞𝐭𝐰𝐨𝐫𝐤 𝐞𝐫𝐫𝐨𝐫. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐜𝐡𝐞𝐜𝐤 𝐲𝐨𝐮𝐫 𝐜𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝐑𝐞𝐪𝐮𝐞𝐬𝐭 𝐭𝐢𝐦𝐞𝐝 𝐨𝐮𝐭. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
