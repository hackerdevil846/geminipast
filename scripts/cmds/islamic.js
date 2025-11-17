const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "islamic",
        aliases: [],
        version: "1.0.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑟𝑒𝑙𝑖𝑔𝑖𝑜𝑛",
        shortDescription: {
            en: "🕌 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑖𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑝𝑜𝑠𝑡𝑠"
        },
        longDescription: {
            en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑟𝑎𝑛𝑑𝑜𝑚 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑖𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑝𝑜𝑠𝑡𝑠 𝑤𝑖𝑡ℎ 𝑖𝑚𝑎𝑔𝑒𝑠"
        },
        guide: {
            en: "{p}islamic"
        },
        countDown: 11,
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message }) {
        let imagePath = null;
        
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");
            }

            const islamicMessages = [
                "•—»✨「 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝐼𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛 」✨«—•\n\n᭄࿐-ইচ্ছে!!!গুলো!!!যদি!!!পবিত্র!!হয়!✿᭄\n\n✿᭄তাহলে!!!স্বপ্ন!!! গুলো..🖤🥀\n\n✿᭄ ࿐- একদিন!!!পূরণ!!!হবেই!!! ✿᭄\n\n✿᭄࿐ইনশাআল্লাহ..🖤🥀",

                "•—»✨「 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝐼𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛 」✨«—•\n\n_____✵♡︎\n\n___কি  হবে  এত  মানুষের প্রিয় হয়ে__🦋🌻\n\n__যদি আল্লাহ   প্রিয় না হতে পারি__🙂🦋\n\n_____✵♡︎",

                "•—»✨「 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝐼𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛 」✨«—•\n\n┏╮/╱╰️❥☆••\n╱/╰┛🍁࿐চিরস্থায়ী কি \nজানেন͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌༒࿐͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌\n༄আপনার সুন্দর ব্যবহার!!🍁!!࿐͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌\n\n࿐͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌͌🍁যেটা মৃত্যুর পরও সবার সৃতিতে থাকবে🥰❁ཻ͜͡ღ᭄",

                "•—»✨「 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝐼𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛 」✨«—•\n\n🦋\n\n-মক্কা তুমি ধন্য.༏༏😽🕋࿐\n\n-তোমার বুকে হয়েছিলো বিশ্ব নবীর জন্ম.༏༏࿐💛🙆\n\n🦋",

                "•—»✨「 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝐼𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛 」✨«—•\n\n●══❥𝄞⋆⃝🥰 ভাগ্যর ༅༎༅ উপর ༅༎༅ কারো ༅༎༅ হাত নেই !!💚🌺🥀\n\n────😕\n🦋🌺-༅༎༅ সব ༅ ༎༅ কিছু ༅༎༅ পরিবর্তন ლ🌼\n༅༎༅ করার  মালিক  🌻😽💖\n\n🕊༎༅ একমাত্র ༅༎༅ আল্লাহ",

                "•—»✨「 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝐼𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛 」✨«—•\n\n>🐰✨𝑻𝒉𝒊𝒔 𝒍𝒊𝒏𝒆 𝒊𝒔 𝒇𝒐𝒓 𝒚𝒐𝒖🖤🌸\nwish 🤗\n\nমৃত্যুর কয়েক সেকেন্ড আগে যেন প্রত্যেকটা\nমুসলমানের মুখে\nউচ্চারিত হয় !\nলা ইলাহা ইল্লাল্লাহু\n মুহাম্মাদুর রাসূলুল্লাহ ( সঃ )\n\nআমিন🤲🤲🥰",

                "•—»✨「 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝐼𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛 」✨«—•\n\n ༅༎❥~🦋\n\n༅༎❥━-কালি ছাড়া যেমন কলম 🖊️\nমূল্যহীন🗑️\n\nতেমনি নামাজ ছাড়া মুসলিম মূল্যহীন!!❥༅༎\n\n🖤~🦋",

                "•—»✨「 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝐼𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛 」✨«—•\n\n°\n\n—𝐒𝐮𝐩𝐞𝐫𝐦𝐚𝐧 𝐎𝐟 𝐓𝐡𝐞 𝐖𝐨𝐫𝐥𝐝—\n—হযরত মুহাম্মদ (সা:)💚🌼\n\n°",

                "•—»✨「 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝐼𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛 」✨«—•\n\n🦋࿐\n\nহীরার চেয়েও দামি\nহযরত মুহাম্মদ (সাঃ) এর মুখের বাণী🫰🖤\n\n🦋࿐\nসুবহানাল্লাহ-🖤🥀",

                "•—»✨「 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝐼𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛 」✨«—•\n\n🥀\n- প্রতিশোধ নয়.!🙂💌\n- হ্মমা করাই ইসলামের আদর্শ.!❤️🥰\n\n- হযরত মোহাম্মদ (সাঃ)😍🤎"
            ];

            const imageLinks = [
                "https://i.postimg.cc/d3QDPNZJ/412b962177524045a2eb43c0f9cfa8b6.jpg",
                "https://i.postimg.cc/XJHGSrn6/ramadan-ninth-month-islamic-calendar-observed-by-muslims-around-world-as-month-fasting-prayer-reperc.jpg",
                "https://i.postimg.cc/mhWWRHpQ/received-1202913210365646.jpg",
                "https://i.postimg.cc/yxZCwPj1/received-179416495132916.jpg",
                "https://i.postimg.cc/nh4xgMJR/ornamental-arabic-lantern-with-burning-candle-glowing-night-muslim-holy-month-ramadan-kareem-1034-24.jpg",
                "https://i.postimg.cc/8c2N53cf/received-2183981171798286.jpg",
                "https://i.postimg.cc/6QWwyCWc/received-259795433354586.jpg",
                "https://i.postimg.cc/JzWRC9S9/received-317063074088232.jpg",
                "https://i.postimg.cc/5tsJvjjV/received-583147497311518.jpg",
                "https://i.postimg.cc/7ZMwHKkb/received-598373762409967.jpg",
                "https://i.postimg.cc/05SPq6kG/a360f6b18ac94e86a7ba87a884a7d295.jpg",
                "https://i.postimg.cc/DZDKjDqp/received-659497149400143.jpg",
                "https://i.postimg.cc/WpC2XD8p/received-659559285696847.jpg",
                "https://i.postimg.cc/4NcXMJ26/received-819496329472643.jpg"
            ];

            const randomMessage = islamicMessages[Math.floor(Math.random() * islamicMessages.length)];
            const randomImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];

            // Ensure cache directory exists
            const cacheDir = path.join(__dirname, "cache");
            await fs.ensureDir(cacheDir);
            
            imagePath = path.join(cacheDir, `islamic_${Date.now()}.jpg`);

            try {
                console.log(`📥 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐢𝐦𝐚𝐠𝐞: ${randomImage}`);
                
                // Download image with timeout and headers
                const response = await axios.get(randomImage, { 
                    responseType: "arraybuffer",
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                // Verify image data
                if (!response.data || response.data.length === 0) {
                    throw new Error("Empty image data received");
                }
                
                await fs.writeFile(imagePath, Buffer.from(response.data, "binary"));
                
                // Verify file was written
                const stats = await fs.stat(imagePath);
                if (stats.size === 0) {
                    throw new Error("Empty file written");
                }

                console.log(`✅ 𝐈𝐦𝐚𝐠𝐞 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲: ${stats.size} bytes`);
                
                // Send message with image
                await message.reply({
                    body: randomMessage,
                    attachment: fs.createReadStream(imagePath)
                });

                console.log("✅ 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐩𝐨𝐬𝐭 𝐬𝐞𝐧𝐭 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲");

            } catch (imageError) {
                console.error("❌ 𝐈𝐦𝐚𝐠𝐞 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐞𝐫𝐫𝐨𝐫:", imageError.message);
                
                // Try alternative image if first one fails
                try {
                    const altImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];
                    console.log(`🔄 𝐓𝐫𝐲𝐢𝐧𝐠 𝐚𝐥𝐭𝐞𝐫𝐧𝐚𝐭𝐢𝐯𝐞 𝐢𝐦𝐚𝐠𝐞: ${altImage}`);
                    
                    const altResponse = await axios.get(altImage, { 
                        responseType: "arraybuffer",
                        timeout: 20000
                    });
                    
                    await fs.writeFile(imagePath, Buffer.from(altResponse.data, "binary"));
                    
                    await message.reply({
                        body: randomMessage,
                        attachment: fs.createReadStream(imagePath)
                    });
                    
                    console.log("✅ 𝐀𝐥𝐭𝐞𝐫𝐧𝐚𝐭𝐢𝐯𝐞 𝐢𝐦𝐚𝐠𝐞 𝐬𝐞𝐧𝐭 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲");
                    
                } catch (altError) {
                    console.error("❌ 𝐀𝐥𝐭𝐞𝐫𝐧𝐚𝐭𝐢𝐯𝐞 𝐢𝐦𝐚𝐠𝐞 𝐟𝐚𝐢𝐥𝐞𝐝:", altError.message);
                    
                    // Final fallback: send text only
                    await message.reply(randomMessage + "\n\n🖼️ 𝐈𝐦𝐚𝐠𝐞 𝐜𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐛𝐞 𝐥𝐨𝐚𝐝𝐞𝐝");
                }
            }

        } catch (error) {
            console.error("💥 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐞𝐫𝐫𝐨𝐫:", error);
            
            try {
                await message.reply("❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐭𝐡𝐞 𝐩𝐨𝐬𝐭. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.");
            } catch (finalError) {
                console.error("💥 𝐅𝐢𝐧𝐚𝐥 𝐞𝐫𝐫𝐨𝐫 𝐡𝐚𝐧𝐝𝐥𝐢𝐧𝐠 𝐟𝐚𝐢𝐥𝐞𝐝:", finalError);
            }
        } finally {
            // Clean up image file if it exists
            try {
                if (imagePath && await fs.pathExists(imagePath)) {
                    await fs.unlink(imagePath);
                    console.log("🧹 𝐂𝐥𝐞𝐚𝐧𝐞𝐝 𝐮𝐩 𝐭𝐞𝐦𝐩𝐨𝐫𝐚𝐫𝐲 𝐢𝐦𝐚𝐠𝐞");
                }
            } catch (cleanupError) {
                console.warn("⚠️ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐜𝐥𝐞𝐚𝐧 𝐮𝐩 𝐭𝐞𝐦𝐩 𝐟𝐢𝐥𝐞:", cleanupError.message);
            }
        }
    }
};
