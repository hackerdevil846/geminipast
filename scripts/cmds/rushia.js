const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
    config: {
        name: "rushia",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 3,
        role: 0,
        category: "𝑎𝑛𝑖𝑚𝑒",
        shortDescription: {
            en: "🎀 𝑅𝑎𝑛𝑑𝑜𝑚 𝑅𝑢𝑠ℎ𝑖𝑎 𝑝ℎ𝑜𝑡𝑜𝑠"
        },
        longDescription: {
            en: "𝑆𝑒𝑛𝑑𝑠 𝑟𝑎𝑛𝑑𝑜𝑚 𝑈𝑟𝑢ℎ𝑎 𝑅𝑢𝑠ℎ𝑖𝑎 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝐻𝑜𝑙𝑜𝑙𝑖𝑣𝑒"
        },
        guide: {
            en: "{p}rushia"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // 🛡️ Dependency check
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            // 🎯 List of backup APIs in order of priority
            const apis = [
                // Primary API
                'https://saikiapi-v3-production.up.railway.app/holo/rushia',
                // Backup APIs
                'https://safebooru.donmai.us/posts/random.json?tags=uruha_rushia',
                'https://danbooru.donmai.us/posts.json?tags=uruha_rushia+rating:safe&random=true&limit=1',
                'https://safebooru.donmai.us/posts.json?tags=uruha_rushia&random=true&limit=1',
                'https://api.waifu.pics/sfw/megumin', // Fallback to similar character
                'https://api.waifu.pics/sfw/shinobu'  // Fallback to similar character
            ];

            // 🎯 Hardcoded fallback Rushia images
            const fallbackImages = [
                "https://i.imgur.com/IaAVMFK.jpeg",
                "https://i.imgur.com/WceNH2z.jpeg",
                "https://i.imgur.com/1XosaEA.jpeg",
                "https://i.imgur.com/M58fVe6.jpeg",
                "https://i.imgur.com/czaXZ3a.jpeg",
                "https://i.imgur.com/xsu6v2I.jpeg",
                "https://i.imgur.com/f17dCCM.jpeg",
                "https://i.imgur.com/opquSuU.jpeg",
                "https://i.imgur.com/U87kL1B.jpeg",
                "https://i.imgur.com/Osa1EEd.jpeg",
                "https://i.imgur.com/38XTSUn.jpeg",
                "https://i.imgur.com/B7mAsZB.jpeg",
                "https://i.imgur.com/2APmfRs.jpeg",
                "https://i.imgur.com/mCUOJ8U.jpeg",
                "https://i.imgur.com/CnN1DxG.jpeg",
                "https://i.imgur.com/onlEme6.jpeg",
                "https://i.imgur.com/OF73muW.jpeg",
                "https://i.imgur.com/UO1sK8I.jpeg",
                "https://i.imgur.com/AlkGMJr.jpeg",
                "https://i.imgur.com/yZy8yvG.jpeg",
                "https://i.imgur.com/wLuwsWH.jpeg",
                "https://i.imgur.com/NoLgneL.jpeg",
                "https://i.imgur.com/wnXPqVv.jpeg",
                "https://i.imgur.com/D4ORkkM.jpeg"
            ];

            let imageUrl = null;
            let successSource = "𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘";
            let apiIndex = 0;

            // 🔄 Try each API in order
            while (apiIndex < apis.length && !imageUrl) {
                try {
                    const apiUrl = apis[apiIndex];
                    console.log(`🔍 𝑇𝑟𝑦𝑖𝑛𝑔 𝐴𝑃𝐼 ${apiIndex + 1}: ${apiUrl}`);
                    
                    const response = await axios.get(apiUrl, { 
                        timeout: 15000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    
                    // Handle different API response formats
                    if (apiIndex === 0) {
                        // Primary API format - saikiapi
                        if (response.data && response.data.url) {
                            imageUrl = response.data.url;
                            successSource = "𝑠𝑎𝑖𝑘𝑖𝑎𝑝𝑖";
                            console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠 𝑤𝑖𝑡ℎ 𝑠𝑎𝑖𝑘𝑖𝑎𝑝𝑖: ${imageUrl}`);
                        }
                    } else if (apiIndex >= 1 && apiIndex <= 3) {
                        // Safebooru/Danbooru format
                        if (response.data && response.data[0] && response.data[0].file_url) {
                            imageUrl = response.data[0].file_url;
                            successSource = `𝑏𝑜𝑜𝑟𝑢_${apiIndex}`;
                            // Add protocol if missing
                            if (imageUrl.startsWith('//')) {
                                imageUrl = 'https:' + imageUrl;
                            }
                            console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠 𝑤𝑖𝑡ℎ 𝑏𝑜𝑜𝑟𝑢 𝐴𝑃𝐼 ${apiIndex}: ${imageUrl}`);
                        } else if (response.data && response.data.file_url) {
                            // Single post format
                            imageUrl = response.data.file_url;
                            successSource = `𝑏𝑜𝑜𝑟𝑢_${apiIndex}_𝑠𝑖𝑛𝑔𝑙𝑒`;
                            if (imageUrl.startsWith('//')) {
                                imageUrl = 'https:' + imageUrl;
                            }
                            console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠 𝑤𝑖𝑡ℎ 𝑏𝑜𝑜𝑟𝑢 𝐴𝑃𝐼 ${apiIndex} (𝑠𝑖𝑛𝑔𝑙𝑒): ${imageUrl}`);
                        }
                    } else if (apiIndex >= 4) {
                        // Waifu.pics format
                        if (response.data && response.data.url) {
                            imageUrl = response.data.url;
                            successSource = `𝑤𝑎𝑖𝑓𝑢_𝑝𝑖𝑐𝑠_${apiIndex === 4 ? '𝑚𝑒𝑔𝑢𝑚𝑖𝑛' : '𝑠ℎ𝑖𝑛𝑜𝑏𝑢'}`;
                            console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠 𝑤𝑖𝑡ℎ 𝑤𝑎𝑖𝑓𝑢.𝑝𝑖𝑐𝑠: ${imageUrl}`);
                        }
                    }
                    
                } catch (apiError) {
                    console.error(`❌ 𝐴𝑃𝐼 ${apiIndex + 1} 𝑓𝑎𝑖𝑙𝑒𝑑:`, apiError.message);
                }
                
                apiIndex++;
            }

            // 🎯 Use fallback images if no API worked
            if (!imageUrl) {
                console.log(`🔄 𝑁𝑜 𝐴𝑃𝐼 𝑤𝑜𝑟𝑘𝑒𝑑, 𝑢𝑠𝑖𝑛𝑔 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑖𝑚𝑎𝑔𝑒𝑠`);
                const randomIndex = Math.floor(Math.random() * fallbackImages.length);
                imageUrl = fallbackImages[randomIndex];
                successSource = "𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘";
                console.log(`✅ 𝑆𝑒𝑙𝑒𝑐𝑡𝑒𝑑 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑖𝑚𝑎𝑔𝑒: ${imageUrl}`);
            }

            // 🛡️ Validate the image URL
            if (!imageUrl || typeof imageUrl !== 'string') {
                console.error(`❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿: ${imageUrl}`);
                // Use first fallback as last resort
                imageUrl = fallbackImages[0];
                successSource = "𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘_𝑒𝑚𝑒𝑟𝑔𝑒𝑛𝑐𝑦";
            }

            // 🛡️ Ensure URL has proper protocol
            if (imageUrl.startsWith('//')) {
                imageUrl = 'https:' + imageUrl;
            } else if (!imageUrl.startsWith('http')) {
                console.error(`❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑝𝑟𝑜𝑡𝑜𝑐𝑜𝑙 𝑓𝑜𝑟 𝑈𝑅𝐿: ${imageUrl}`);
                imageUrl = fallbackImages[0];
                successSource = "𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘_𝑝𝑟𝑜𝑡𝑜𝑐𝑜𝑙";
            }

            console.log(`🎯 𝐹𝑖𝑛𝑎𝑙 𝑖𝑚𝑎𝑔𝑒 𝑠𝑜𝑢𝑟𝑐𝑒: ${successSource}, 𝑈𝑅𝐿: ${imageUrl}`);

            // 🖼️ Get the image stream with fallback protection
            let imageStream = null;
            let streamAttempts = 0;
            const maxStreamAttempts = 3;

            while (!imageStream && streamAttempts < maxStreamAttempts) {
                try {
                    let currentUrl = imageUrl;
                    
                    // If first attempt fails, try fallback images for subsequent attempts
                    if (streamAttempts > 0) {
                        const fallbackIndex = (streamAttempts - 1) % fallbackImages.length;
                        currentUrl = fallbackImages[fallbackIndex];
                        console.log(`🔄 𝑆𝑡𝑟𝑒𝑎𝑚 𝑎𝑡𝑡𝑒𝑚𝑝𝑡 ${streamAttempts + 1} 𝑢𝑠𝑖𝑛𝑔 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘: ${currentUrl}`);
                    }
                    
                    imageStream = await global.utils.getStreamFromURL(currentUrl);
                    
                    if (imageStream) {
                        console.log(`✅ 𝑆𝑡𝑟𝑒𝑎𝑚 𝑠𝑢𝑐𝑐𝑒𝑠𝑠 𝑎𝑡𝑡𝑒𝑚𝑝𝑡 ${streamAttempts + 1}`);
                        if (streamAttempts > 0) {
                            successSource = `𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘_𝑠𝑡𝑟𝑒𝑎𝑚_${streamAttempts}`;
                        }
                        break;
                    }
                } catch (streamError) {
                    console.log(`❌ 𝑆𝑡𝑟𝑒𝑎𝑚 𝑎𝑡𝑡𝑒𝑚𝑝𝑡 ${streamAttempts + 1} 𝑓𝑎𝑖𝑙𝑒𝑑:`, streamError.message);
                }
                streamAttempts++;
            }

            // 🚨 Final fallback - use first image directly
            if (!imageStream) {
                console.log(`🚨 𝐴𝑙𝑙 𝑠𝑡𝑟𝑒𝑎𝑚 𝑎𝑡𝑡𝑒𝑚𝑝𝑡𝑠 𝑓𝑎𝑖𝑙𝑒𝑑, 𝑢𝑠𝑖𝑛𝑔 𝑑𝑖𝑟𝑒𝑐𝑡 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘`);
                try {
                    imageStream = await global.utils.getStreamFromURL(fallbackImages[0]);
                    successSource = "𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘_𝑓𝑖𝑛𝑎𝑙";
                } catch (finalError) {
                    console.error(`💥 𝐹𝑖𝑛𝑎𝑙 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑓𝑎𝑖𝑙𝑒𝑑:`, finalError.message);
                    return message.reply("❌ 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑙𝑜𝑎𝑑 𝑎𝑛𝑦 𝑖𝑚𝑎𝑔𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
                }
            }

            // ✨ Send the message with Rushia image
            await message.reply({
                body: `✨ 𝐻𝑒𝑟𝑒 𝑖𝑠 𝑎 𝑐𝑢𝑡𝑒 𝑅𝑢𝑠ℎ𝑖𝑎 𝑖𝑚𝑎𝑔𝑒 𝑓𝑜𝑟 𝑦𝑜𝑢!\n\n🎀 𝑈𝑟𝑢ℎ𝑎 𝑅𝑢𝑠ℎ𝑖𝑎 - 𝐻𝑜𝑙𝑜𝑙𝑖𝑣𝑒\n💚 𝑇ℎ𝑒 𝑁𝑒𝑐𝑟𝑜𝑚𝑎𝑛𝑐𝑒𝑟 𝑜𝑓 𝐻𝑜𝑙𝑜𝑙𝑖𝑣𝑒`,
                attachment: imageStream
            });
            
            console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑠𝑒𝑛𝑡 𝑅𝑢𝑠ℎ𝑖𝑎 𝑖𝑚𝑎𝑔𝑒 𝑓𝑟𝑜𝑚: ${successSource}`);
            
        } catch (error) {
            console.error('💥 𝐹𝑎𝑡𝑎𝑙 𝑒𝑟𝑟𝑜𝑟 𝑖𝑛 𝑟𝑢𝑠ℎ𝑖𝑎 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:', error);
            
            // 🛡️ User-friendly error messages
            const errorMessages = [
                "❌ 𝑃ℎ𝑜𝑡𝑜 𝑙𝑜𝑎𝑑 𝑘𝑜𝑟𝑡𝑒 𝑠𝑜𝑚𝑜𝑠𝑠𝑦𝑎 ℎ𝑜𝑦𝑒𝑐ℎ𝑒, 𝑎𝑏𝑎𝑟 𝑡𝑟𝑦 𝑘𝑜𝑟𝑢𝑛!",
                "🎀 𝑅𝑢𝑠ℎ𝑖𝑎 𝑖𝑠 𝑏𝑢𝑠𝑦 𝑟𝑖𝑔ℎ𝑡 𝑛𝑜𝑤, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟!",
                "💚 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑜𝑛𝑛𝑒𝑐𝑡 𝑡𝑜 𝐻𝑜𝑙𝑜𝑙𝑖𝑣𝑒 𝑠𝑒𝑟𝑣𝑒𝑟, 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛!",
                "✨ 𝑆𝑜𝑟𝑟𝑦! 𝐶𝑜𝑢𝑙𝑑𝑛'𝑡 𝑓𝑒𝑡𝑐ℎ 𝑅𝑢𝑠ℎ𝑖𝑎 𝑖𝑚𝑎𝑔𝑒 𝑡ℎ𝑖𝑠 𝑡𝑖𝑚𝑒."
            ];
            
            const randomErrorMsg = errorMessages[Math.floor(Math.random() * errorMessages.length)];
            await message.reply(randomErrorMsg);
        }
    }
};
