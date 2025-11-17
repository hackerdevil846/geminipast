const axios = require('axios');

module.exports = {
    config: {
        name: "animated",
        aliases: [],
        version: "1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑓𝑢𝑛",
        shortDescription: {
            en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑓𝑜𝑟 𝐺𝐼𝐹𝑠"
        },
        longDescription: {
            en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑎𝑛𝑑 𝑠𝑒𝑛𝑑 𝑟𝑎𝑛𝑑𝑜𝑚 𝐺𝐼𝐹𝑠 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑘𝑒𝑦𝑤𝑜𝑟𝑑𝑠"
        },
        guide: {
            en: "{p}animated [𝑘𝑒𝑦𝑤𝑜𝑟𝑑] - 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}animated ℎ𝑢𝑔𝑔𝑖𝑛𝑔"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, args }) {
        try {
            // Dependency check with better validation
            let axiosAvailable = true;
            try {
                require("axios");
            } catch (e) {
                axiosAvailable = false;
            }

            if (!axiosAvailable) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠.");
            }

            const keyword = args.join(" ").trim();
            
            if (!keyword || keyword === "") {
                return message.reply(`🎭 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑘𝑒𝑦𝑤𝑜𝑟𝑑 𝑡𝑜 𝑠𝑒𝑎𝑟𝑐ℎ 𝑓𝑜𝑟 𝐺𝐼𝐹𝑠.\n\n💡 𝐸𝑥𝑎𝑚𝑝𝑙𝑒:\n${global.config.PREFIX}animated ℎ𝑢𝑔𝑔𝑖𝑛𝑔\n${global.config.PREFIX}animated 𝑙𝑎𝑢𝑔ℎ𝑖𝑛𝑔\n${global.config.PREFIX}animated 𝑑𝑎𝑛𝑐𝑒`);
            }

            // Validate keyword length
            if (keyword.length > 50) {
                return message.reply("❌ 𝐾𝑒𝑦𝑤𝑜𝑟𝑑 𝑖𝑠 𝑡𝑜𝑜 𝑙𝑜𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 𝑎 𝑠ℎ𝑜𝑟𝑡𝑒𝑟 𝑘𝑒𝑦𝑤𝑜𝑟𝑑.");
            }

            // Show searching message
            const searchMsg = await message.reply(`╔═══❖•°•°•°❖═══╗\n𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 ✨\n🔎 𝑆𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔 "${keyword}" 𝑔𝑖𝑓𝑠...\n╚═══❖•°•°•°❖═══╝`);

            try {
                // Search for GIFs using Giphy API with enhanced error handling
                const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
                    params: {
                        api_key: 'wBUEVK7mbqAaiCBRrYKYYEMMqZ1sPujI',
                        q: keyword,
                        limit: 25,
                        offset: 0,
                        rating: 'g',
                        lang: 'en',
                        bundle: 'messaging_non_clips'
                    },
                    timeout: 20000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    validateStatus: function (status) {
                        return status >= 200 && status < 500;
                    }
                });

                // Handle API response errors
                if (response.status !== 200) {
                    throw new Error(`𝐴𝑃𝐼 𝑟𝑒𝑡𝑢𝑟𝑛𝑒𝑑 𝑠𝑡𝑎𝑡𝑢𝑠 ${response.status}`);
                }

                if (!response.data || !response.data.data) {
                    throw new Error("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝐴𝑃𝐼 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑓𝑜𝑟𝑚𝑎𝑡");
                }

                const gifs = response.data.data;
                
                if (!gifs || gifs.length === 0) {
                    // Try to unsend search message
                    try {
                        await message.unsend(searchMsg.messageID);
                    } catch (e) {}
                    
                    return message.reply(`❌ 𝑁𝑜 𝐺𝐼𝐹𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 "${keyword}".\n\n💡 𝑇𝑟𝑦 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑘𝑒𝑦𝑤𝑜𝑟𝑑𝑠 𝑙𝑖𝑘𝑒:\n• 𝑙𝑜𝑣𝑒\n• 𝑓𝑢𝑛𝑛𝑦\n• 𝑐𝑎𝑡\n• 𝑑𝑎𝑛𝑐𝑒\n• 𝑐𝑒𝑙𝑒𝑏𝑟𝑎𝑡𝑒`);
                }

                // Filter out invalid GIFs and select a random one
                const validGifs = gifs.filter(gif => 
                    gif && 
                    gif.images && 
                    gif.images.original && 
                    gif.images.original.url &&
                    gif.images.original.url.startsWith('http')
                );

                if (validGifs.length === 0) {
                    throw new Error("𝑁𝑜 𝑣𝑎𝑙𝑖𝑑 𝐺𝐼𝐹𝑠 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒");
                }

                // Select a random GIF from the valid results
                const randomGif = validGifs[Math.floor(Math.random() * validGifs.length)];
                const gifUrl = randomGif.images.original.url;

                // Validate GIF URL
                if (!gifUrl || typeof gifUrl !== 'string') {
                    throw new Error("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝐺𝐼𝐹 𝑈𝑅𝐿");
                }

                // Get GIF info with fallbacks
                const title = randomGif.title || "𝐴𝑛𝑖𝑚𝑎𝑡𝑒𝑑 𝐺𝐼𝐹";
                const username = randomGif.username || "𝐺𝑖𝑝ℎ𝑦 𝑈𝑠𝑒𝑟";

                // Get the GIF stream with validation
                let gifStream;
                try {
                    gifStream = await global.utils.getStreamFromURL(gifUrl);
                    
                    if (!gifStream) {
                        throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝐺𝐼𝐹 𝑠𝑡𝑟𝑒𝑎𝑚");
                    }
                } catch (streamError) {
                    throw new Error(`𝐺𝐼𝐹 𝑠𝑡𝑟𝑒𝑎𝑚 𝑒𝑟𝑟𝑜𝑟: ${streamError.message}`);
                }

                // Unsend search message before sending result
                try {
                    await message.unsend(searchMsg.messageID);
                } catch (e) {}

                // Send the GIF as an attachment
                await message.reply({
                    body: `✨ 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 "${keyword}" 𝐺𝐼𝐹!\n\n📛 𝑇𝑖𝑡𝑙𝑒: ${title}\n👤 𝑈𝑝𝑙𝑜𝑎𝑑𝑒𝑟: ${username}\n🔗 𝑆𝑜𝑢𝑟𝑐𝑒: 𝐺𝑖𝑝ℎ𝑦`,
                    attachment: gifStream
                });
                
                console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑠𝑒𝑛𝑡 𝐺𝐼𝐹 𝑓𝑜𝑟: ${keyword}`);
                
            } catch (apiError) {
                // Unsend search message on error
                try {
                    await message.unsend(searchMsg.messageID);
                } catch (e) {}
                throw apiError;
            }
            
        } catch (error) {
            console.error("💥 𝐺𝐼𝐹 𝑆𝑒𝑎𝑟𝑐ℎ 𝐸𝑟𝑟𝑜𝑟:", error);
            
            let errorMessage = "❌ 𝑆𝑜𝑟𝑟𝑦, 𝑎𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑠𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔 𝑓𝑜𝑟 𝐺𝐼𝐹𝑠.";
            
            if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
            } else if (error.code === 'ENOTFOUND') {
                errorMessage = "❌ 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛 𝑓𝑎𝑖𝑙𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑖𝑛𝑡𝑒𝑟𝑛𝑒𝑡.";
            } else if (error.response?.status === 429) {
                errorMessage = "❌ 𝐴𝑃𝐼 𝑙𝑖𝑚𝑖𝑡 𝑟𝑒𝑎𝑐ℎ𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑖𝑛 𝑎 𝑓𝑒𝑤 𝑚𝑖𝑛𝑢𝑡𝑒𝑠.";
            } else if (error.response?.status === 403) {
                errorMessage = "❌ 𝐴𝑃𝐼 𝑎𝑐𝑐𝑒𝑠𝑠 𝑑𝑒𝑛𝑖𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑙𝑎𝑡𝑒𝑟.";
            } else if (error.message.includes('𝑁𝑜 𝐺𝐼𝐹𝑠 𝑓𝑜𝑢𝑛𝑑')) {
                errorMessage = `❌ 𝑁𝑜 𝐺𝐼𝐹𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 "${args.join(" ")}". 𝑇𝑟𝑦 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑘𝑒𝑦𝑤𝑜𝑟𝑑𝑠.`;
            } else if (error.message.includes('𝐺𝐼𝐹 𝑠𝑡𝑟𝑒𝑎𝑚 𝑒𝑟𝑟𝑜𝑟')) {
                errorMessage = "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝐺𝐼𝐹. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
