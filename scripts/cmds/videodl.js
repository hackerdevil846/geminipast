const axios = require("axios");

module.exports = {
    config: {
        name: "videodl",
        aliases: [],
        version: "2.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 10,
        role: 0,
        category: "media",
        shortDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼 𝗏𝗂𝖽𝖾𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝗋 𝖿𝗋𝗈𝗆 𝖺𝗇𝗒 𝗉𝗅𝖺𝗍𝖿𝗈𝗋𝗆"
        },
        longDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝖽𝖾𝗍𝖾𝖼𝗍𝗌 𝗅𝗂𝗇𝗄𝗌, 𝗂𝖽𝖾𝗇𝗍𝗂𝖿𝗂𝖾𝗌 𝗉𝗅𝖺𝗍𝖿𝗈𝗋𝗆𝗌, 𝖺𝗇𝖽 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗌 𝗏𝗂𝖽𝖾𝗈𝗌 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒"
        },
        guide: {
            en: "𝖩𝗎𝗌𝗍 𝗌𝖾𝗇𝖽 𝖺𝗇𝗒 𝗏𝗂𝖽𝖾𝗈 𝗅𝗂𝗇𝗄 𝖺𝗇𝖽 𝗂𝗍 𝗐𝗂𝗅𝗅 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽"
        },
        dependencies: {
            "axios": ""
        }
    },

    // Backup APIs for downloading videos
    apis: [
        {
            name: "all-videos-downloader",
            url: (link) => `https://all-videos-downloader-by-tabbu.vercel.app/?url=${encodeURIComponent(link)}`,
            timeout: 45000,
            extractor: (data) => data.videoUrl
        },
        {
            name: "youtube-dl-api",
            url: (link) => `https://api.github.com/repos/yt-dlp/yt-dlp`,
            timeout: 30000,
            extractor: (data) => data.url || data.videoUrl
        },
        {
            name: "cobalt-api",
            url: (link) => `https://api.cobalt.tools/api/json`,
            timeout: 35000,
            method: "POST",
            payload: (link) => ({ url: link }),
            extractor: (data) => data.url || data.stream?.url
        },
        {
            name: "vdownloader",
            url: (link) => `https://vdownloader.net/api.php?url=${encodeURIComponent(link)}`,
            timeout: 40000,
            extractor: (data) => data.link || data.videoUrl
        },
        {
            name: "savefrom-api",
            url: (link) => `https://savefrom.net/api/info?url=${encodeURIComponent(link)}&lang=en`,
            timeout: 35000,
            extractor: (data) => data.url || data.videoUrl || (data.formats && data.formats[0]?.url)
        },
        {
            name: "direct-download",
            url: (link) => `https://rere.qweCode.cc/api?url=${encodeURIComponent(link)}`,
            timeout: 30000,
            extractor: (data) => data.data?.url || data.url
        }
    ],

    // Function to try downloading with all APIs
    tryDownloadWithAPIs: async function(link, platform) {
        for (const api of this.apis) {
            try {
                let response;
                const config = {
                    timeout: api.timeout,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'application/json'
                    }
                };

                console.log(`🔗 𝖳𝗋𝗒𝗂𝗇𝗀 ${api.name} 𝖿𝗈𝗋 ${platform}...`);

                if (api.method === "POST") {
                    response = await axios.post(api.url(link), api.payload(link), config);
                } else {
                    response = await axios.get(api.url(link), config);
                }

                const videoUrl = api.extractor(response.data);
                
                if (videoUrl && videoUrl.startsWith('http')) {
                    console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌 𝗐𝗂𝗍𝗁 ${api.name} 𝖠𝖯𝖨`);
                    return videoUrl;
                }
            } catch (err) {
                console.warn(`⚠️ ${api.name} 𝖿𝖺𝗂𝗅𝖾𝖽: ${err.message}`);
                continue;
            }
        }
        return null;
    },

    onChat: async function({ event, message }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
            }

            const { body, threadID } = event;
            
            if (!body) return;

            // Regular expressions to detect video links from various platforms
            const linkPatterns = {
                youtube: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
                facebook: /(?:https?:\/\/)?(?:www\.|m\.)?(?:facebook\.com|fb\.watch)\/(?:[a-zA-Z0-9\.]+\/)?(?:video|watch|story\.php|reel)\/(?:[a-zA-Z0-9\.\/\?=&_-]+)/,
                tiktok: /(?:https?:\/\/)?(?:www\.|vm\.|vt\.)?tiktok\.com\/(?:@[\w\.-]+\/video\/|t\/|v\/|embed\/)?(\d+)/,
                instagram: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/,
                twitter: /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/(?:\w+)\/status\/(\d+)/,
                pinterest: /(?:https?:\/\/)?(?:www\.)?pinterest\.(?:com|fr|de|it|es|ru|jp)\/(?:pin|pin\/\d+)\/(\d+)/,
                dailymotion: /(?:https?:\/\/)?(?:www\.)?dailymotion\.com\/(?:video|embed\/video)\/([a-zA-Z0-9]+)/,
                vimeo: /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/
            };

            let detectedLink = null;
            let platform = null;

            // Check for any matching links
            for (const [plat, pattern] of Object.entries(linkPatterns)) {
                const match = body.match(pattern);
                if (match) {
                    detectedLink = match[0];
                    platform = plat;
                    break;
                }
            }

            if (detectedLink && platform) {
                const processingMsg = await message.reply(`🔍 𝖣𝖾𝗍𝖾𝖼𝗍𝖾𝖽 ${platform} 𝗅𝗂𝗇𝗄...\n📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗏𝗂𝖽𝖾𝗈 𝗐𝗂𝗍𝗁 𝖻𝖺𝖼𝗄𝗎𝗉 𝖠𝖯𝖨𝗌...`);

                try {
                    // Try downloading with backup APIs
                    const videoUrl = await this.tryDownloadWithAPIs(detectedLink, platform);
                    
                    if (videoUrl) {
                        console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗀𝗈𝗍 𝗏𝗂𝖽𝖾𝗈 𝖿𝗋𝗈𝗆 ${platform}: ${videoUrl}`);
                        
                        // Get video stream with timeout
                        const videoStream = await global.utils.getStreamFromURL(videoUrl);

                        await message.reply({
                            body: `✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖿𝗋𝗈𝗆 ${platform.toUpperCase()}!\n🔗 ${detectedLink}`,
                            attachment: videoStream
                        });

                        await message.unsendMessage(processingMsg.messageID);

                    } else {
                        throw new Error("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖿𝗂𝗇𝖽 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗅𝗂𝗇𝗄");
                    }

                } catch (apiError) {
                    console.error(`❌ 𝖠𝗅𝗅 𝖠𝖯𝖨𝗌 𝖿𝖺𝗂𝗅𝖾𝖽 𝖿𝗈𝗋 ${platform}:`, apiError.message);
                    
                    // Unsend processing message
                    try {
                        await message.unsendMessage(processingMsg.messageID);
                    } catch (unsendError) {
                        console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                    }

                    const errorMessages = [
                        `❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝗋𝗈𝗆 ${platform}. 𝖳𝗁𝗂𝗌 𝗏𝗂𝖽𝖾𝗈 𝗆𝖺𝗒 𝖻𝖾 𝗉𝗋𝗂𝗏𝖺𝗍𝖾 𝗈𝗋 𝗎𝗇𝗌𝗎𝗉𝗉𝗈𝗋𝗍𝖾𝖽.`,
                        `❌ 𝖢𝗈𝗎𝗅𝖽𝗇'𝗍 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 ${platform} 𝗏𝗂𝖽𝖾𝗈. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺 𝗇𝖾𝗐 𝗅𝗂𝗇𝗄.`,
                        `❌ 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝖺𝗂𝗅𝖾𝖽 𝖿𝗈𝗋 ${platform}. 𝖠𝗅𝗅 𝖠𝖯𝖨𝗌 𝖺𝗋𝖾 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾.`
                    ];
                    
                    const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
                    await message.reply(randomError);
                }
            }

        } catch (error) {
            console.error("💥 𝖵𝗂𝖽𝖾𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    },

    onStart: async function({ message }) {
        await message.reply(`🎬 𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼 𝖵𝗂𝖽𝖾𝗈 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝗋

𝖲𝗎𝗉𝗉𝗈𝗋𝗍𝖾𝖽 𝖯𝗅𝖺𝗍𝖿𝗈𝗋𝗆𝗌:
• 𝖸𝗈𝗎𝖳𝗎𝖻𝖾
• 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄
• 𝖳𝗂𝗄𝖳𝗈𝗄
• 𝖨𝗇𝗌𝗍𝖺𝗀𝗋𝖺𝗆
• 𝖳𝗐𝗂𝗍𝗍𝖾𝗋/𝖷
• 𝖯𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍
• 𝖣𝖺𝗂𝗅𝗒𝗆𝗈𝗍𝗂𝗈𝗇
• 𝖵𝗂𝗆𝖾𝗈

𝖩𝗎𝗌𝗍 𝗌𝖾𝗇𝖽 𝖺𝗇𝗒 𝗏𝗂𝖽𝖾𝗈 𝗅𝗂𝗇𝗄 𝖺𝗇𝖽 𝗂𝗍 𝗐𝗂𝗅𝗅 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽`);
    }
};
