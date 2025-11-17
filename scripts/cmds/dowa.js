const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "dowa",
        aliases: [],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "islam",
        shortDescription: {
            en: "ইসলামিক দোয়ার সংগ্রহ"
        },
        longDescription: {
            en: "ইসলামিক দোয়া ও প্রার্থনার সংগ্রহ"
        },
        guide: {
            en: "{p}dowa [দোয়ার নম্বর]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": ""
        }
    },

    onLoad: async function() {
        try {
            const cacheDir = path.join(__dirname, 'cache', 'dowa_images');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
                console.log("✅ Created dowa images cache directory");
            }
        } catch (error) {
            console.error("❌ Cache directory creation error:", error);
        }
    },

    onStart: async function({ message, args, event }) {
        try {
            const { threadID, senderID } = event;
            
            const doyaContent = [
                {
                    title: "📖 ঈমানের সাথে মৃত্যু বরণ করার দোয়া",
                    body: "✨ হে আমাদের পালনকর্তা, আমাদের গুনাহসমূহ মাফ করে দাও, আমাদের থেকে সকল মন্দ দূর করে দাও এবং আমাদের নেক লোকদের সাহচার্য দান কর।",
                    image: "https://i.imgur.com/aESlOKd.jpeg"
                },
                {
                    title: "🌺 উত্তম জীবনসঙ্গী লাভের দোয়া",
                    body: "📜 রাব্বানা হাব্লানা মিন আযওয়াঝিনা ওয়া জুর্রিয়াতিনা কুর্রাতা আইয়ুনিও ওয়াঝআলনা লিলমুত্তাক্বিনা ইমামা।\n\n💫 অর্থ: 'হে আমাদের রব! আমাদেরকে আমাদের স্ত্রী ও সন্তান-সন্ততির মধ্যে চোখের শীতলতা দান করুন এবং আমাদেরকে মুত্তাকীদের নেতা বানিয়ে দিন।'",
                    image: "https://i.imgur.com/3Bmg4Nd.jpeg"
                },
                {
                    title: "❤️ সহবাস করার দোয়া",
                    body: "📜 বিসমিল্লাহি আল্লাহুম্মা জান্নিবনাশ শায়ত্বানা ওয়া জান্নিবিশ শায়ত্বানা মা রাযাক্বতানা।\n\n💫 অর্থ: 'আল্লাহর নামে শুরু করছি, हे আল্লাহ! আমাদেরকে তুমি শয়তান থেকে দূরে রাখ।'",
                    image: "https://i.imgur.com/TUm1LQW.jpeg"
                },
                {
                    title: "🕋 আল্লাহর গযব থেকে মুক্ত থাকার দোয়া",
                    body: "📜 আল্লাহুম্মা ক্বিনি আজাবাকা ইয়াওমা تَبْعَثُ عِبَادَكَ\n\n💫 অর্থ: 'হে আল্লাহ! যেদিন তুমি তোমার বান্দাদের পুনরায় জীবিত করবে; সেদিন আমাকে তোমার আজাব থেকে হেফাজতে রাখ।'",
                    image: "https://i.imgur.com/wp7hM0m.jpeg"
                },
                {
                    title: "🌙 ক্ষমা ও রহমতের দোয়া",
                    body: "📜 রাব্বানা আমান্না فاغفرلنا وارحمنا وانت خير الراحمين।\n\n💫 অর্থ: 'হে আমাদের রব! আমরা ঈমান এনেছি, তাই আমাদেরকে ক্ষমা করুন ও আমাদের উপর রহম করুন এবং আপনি সর্বশ্রেষ্ঠ দয়ালু।'",
                    image: "https://i.imgur.com/pFvUmsm.jpeg"
                },
                {
                    title: "👨‍👩‍👧‍👦 সুসন্তান লাভের দোয়া",
                    body: "📜 ربي هب لي من لدنك ذرية طيبة إنك سميع الدعاء\n\n💫 অর্থ: 'হে আমার রব! আপনার পক্ষ থেকে আমাকে পবিত্র সন্তান দান করুন, নিশ্চয়ই আপনি প্রার্থনা শ্রবণকারী।'",
                    image: "https://i.imgur.com/LH2qVcm.jpeg"
                },
                {
                    title: "🕌 কবর জিয়ারতের নিয়ম",
                    body: "✨ কবর জিয়ারত এর নিয়ম:\n\n• ১ বার সূরা ফাতিহা\n• ১ বার সূরা আন নাস\n• ১ বার সূরা ফালাক\n• ৩ বার সূরা ইখলাস\n• ১ বার সূরা কাফিরুন\n• ২ বার সূরা তাকাছুর\n• ১১ বার দুরুদ শরীফ\n• ১১ বার আস্তাগফিরুল্লাহ\n\n💫 আর অবশ্যই পশ্চিম দিকে তাকিয়ে দোয়া পড়বেন",
                    image: "https://i.imgur.com/28Et6s2.jpeg"
                },
                {
                    title: "📿 সাধারণ দোয়া",
                    body: "📜 اللهم إني أسألك الثبات في الأمر والعزيمة على الرشد\n\n💫 অর্থ: 'হে আল্লাহ! আমি আপনার কাছে প্রার্থনা করি দীনের বিষয়ে অবিচলতা এবং আপনার কাছে প্রার্থনা করি উন্নত যোগ্যতা'",
                    image: "https://i.imgur.com/NIjfdfz.jpeg"
                }
            ];

            // Handle number selection directly
            if (args[0] && !isNaN(args[0])) {
                const choice = parseInt(args[0]);
                if (choice < 1 || choice > doyaContent.length) {
                    return message.reply(`⚠️ অবৈধ নির্বাচন! দয়া করে 1-${doyaContent.length} এর মধ্যে একটি নম্বর লিখুন।`);
                }
                
                const doya = doyaContent[choice - 1];
                const cacheDir = path.join(__dirname, 'cache', 'dowa_images');
                const imagePath = path.join(cacheDir, `dowa_${choice}.jpeg`);
                
                try {
                    // Check if image exists in cache
                    if (fs.existsSync(imagePath)) {
                        console.log(`✅ Using cached image for dowa ${choice}`);
                        await message.reply({
                            body: `${doya.title}\n\n${doya.body}`,
                            attachment: fs.createReadStream(imagePath)
                        });
                    } else {
                        // Download and cache the image
                        console.log(`📥 Downloading image for dowa ${choice}`);
                        const response = await axios({
                            method: 'GET',
                            url: doya.image,
                            responseType: 'stream',
                            timeout: 30000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                            }
                        });

                        const writer = fs.createWriteStream(imagePath);
                        response.data.pipe(writer);
                        
                        await new Promise((resolve, reject) => {
                            writer.on('finish', resolve);
                            writer.on('error', reject);
                        });

                        await message.reply({
                            body: `${doya.title}\n\n${doya.body}`,
                            attachment: fs.createReadStream(imagePath)
                        });
                    }
                } catch (imageError) {
                    console.error(`❌ Image error for dowa ${choice}:`, imageError.message);
                    // Send text only if image fails
                    await message.reply(`${doya.title}\n\n${doya.body}\n\n🖼️ ছবি লোড করতে সমস্যা হচ্ছে, শুধুমাত্র টেক্সট দেখানো হচ্ছে।`);
                }
                return;
            }
            
            // Show menu if no number provided
            let menuMessage = "📖 ইসলামিক দোয়া সংগ্রহ:\n\n";
            doyaContent.forEach((doya, index) => {
                menuMessage += `${index + 1}. ${doya.title}\n`;
            });
            
            menuMessage += `\n💫 আপনার পছন্দের দোয়ার নম্বরটি লিখুন (1-${doyaContent.length})`;
            
            // Auto-download all images in background when menu is shown
            this.preDownloadImages(doyaContent);
            
            await message.reply(menuMessage);
            
        } catch (error) {
            console.error("💥 Dowa command error:", error);
            await message.reply("❌ দোয়া লোড করতে সমস্যা হচ্ছে। দয়া করে আবার চেষ্টা করুন।");
        }
    },

    // Auto-download all images in background
    preDownloadImages: async function(doyaContent) {
        try {
            const cacheDir = path.join(__dirname, 'cache', 'dowa_images');
            
            console.log("🔄 Starting auto-download of all dowa images...");
            
            for (let i = 0; i < doyaContent.length; i++) {
                const imagePath = path.join(cacheDir, `dowa_${i + 1}.jpeg`);
                
                // Skip if already downloaded
                if (fs.existsSync(imagePath)) {
                    console.log(`✅ Image ${i + 1} already exists`);
                    continue;
                }
                
                try {
                    console.log(`📥 Auto-downloading image ${i + 1}...`);
                    
                    const response = await axios({
                        method: 'GET',
                        url: doyaContent[i].image,
                        responseType: 'stream',
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });

                    const writer = fs.createWriteStream(imagePath);
                    response.data.pipe(writer);
                    
                    await new Promise((resolve, reject) => {
                        writer.on('finish', resolve);
                        writer.on('error', reject);
                    });
                    
                    console.log(`✅ Successfully auto-downloaded image ${i + 1}`);
                    
                } catch (downloadError) {
                    console.error(`❌ Failed to auto-download image ${i + 1}:`, downloadError.message);
                }
            }
            
            console.log("🎯 Auto-download completed");
            
        } catch (error) {
            console.error("💥 Auto-download error:", error);
        }
    }
};
