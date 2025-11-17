const { Innertube } = require('youtubei.js');
const https = require('https');
const http = require('http');

module.exports = {
    config: {
        name: "shairiv2",
        aliases: [],
        version: "3.1.1",
        author: "Asif Mahmud",
        countDown: 10,
        role: 0,
        category: "media",
        shortDescription: {
            en: "𝖲𝖾𝗇𝖽 𝖻𝖾𝖺𝗎𝗍𝗂𝖿𝗎𝗅 𝖲𝗁𝖺𝗂𝗋𝗂 𝗏𝗂𝖽𝖾𝗈 𝖿𝗋𝗈𝗆 𝖸𝗈𝗎𝖳𝗎𝖻𝖾"
        },
        longDescription: {
            en: "𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗇𝖽 𝗌𝖾𝗇𝖽 𝖲𝗁𝖺𝗂𝗋𝗂 𝗏𝗂𝖽𝖾𝗈𝗌 𝖿𝗋𝗈𝗆 𝖸𝗈𝗎𝖳𝗎𝖻𝖾 𝗈𝗋 𝖼𝗎𝗌𝗍𝗈𝗆 𝗅𝗂𝗇𝗄𝗌"
        },
        guide: {
            en: "{p}shairiv2 [𝖸𝗈𝗎𝖳𝗎𝖻𝖾 𝖫𝗂𝗇𝗄]"
        },
        dependencies: {
            "youtubei.js": "",
            "https": "",
            "http": ""
        }
    },

    onStart: async function({ api, event, args }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("youtubei.js");
                require("https");
                require("http");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return api.sendMessage("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌: 𝗒𝗈𝗎𝗍𝗎𝖻𝖾𝗂.𝗃𝗌, 𝗁𝗍𝗍𝗉𝗌, 𝖺𝗇𝖽 𝗁𝗍𝗍𝗉", event.threadID, event.messageID);
            }

            const DEFAULT_URL = "https://youtu.be/v7v3TTWaaWU";
            
            // Use user-provided URL if available, else default
            const inputUrl = args[0] ? args[0] : DEFAULT_URL;
            
            // Extract video ID with better regex
            const extractVideoId = (url) => {
                const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/watch\?.*v=)([^&\n?#]+)/;
                const match = url.match(regex);
                return match ? match[1] : null;
            };

            const videoId = extractVideoId(inputUrl);

            if (!videoId) {
                return api.sendMessage("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖸𝗈𝗎𝖳𝗎𝖻𝖾 𝗅𝗂𝗇𝗄! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗏𝖺𝗅𝗂𝖽 𝖸𝗈𝗎𝖳𝗎𝖻𝖾 𝖴𝖱𝖫.", event.threadID, event.messageID);
            }

            // Send downloading message
            const processingMsg = await api.sendMessage("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗏𝗂𝖽𝖾𝗈... 𝖯𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍!", event.threadID, event.messageID);

            // Initialize YouTube client with error handling
            let youtube;
            try {
                youtube = await Innertube.create();
                console.log("✅ 𝖸𝗈𝗎𝖳𝗎𝖻𝖾 𝖼𝗅𝗂𝖾𝗇𝗍 𝗂𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
            } catch (err) {
                console.error('❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗂𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖾 𝖸𝗈𝗎𝖳𝗎𝖻𝖾 𝖼𝗅𝗂𝖾𝗇𝗍:', err);
                await api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗈𝗇𝗇𝖾𝖼𝗍 𝗍𝗈 𝖸𝗈𝗎𝖳𝗎𝖻𝖾 𝗌𝖾𝗋𝗏𝗂𝖼𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.", event.threadID, event.messageID);
                return;
            }

            // Fetch video info with timeout
            try {
                console.log(`🔍 𝖥𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝗂𝗇𝖿𝗈 𝖿𝗈𝗋 𝗏𝗂𝖽𝖾𝗈 𝖨𝖣: ${videoId}`);
                const info = await youtube.getInfo(videoId);
                
                if (!info || !info.basic_info) {
                    throw new Error("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖿𝖾𝗍𝖼𝗁 𝗏𝗂𝖽𝖾𝗈 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇");
                }

                console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗀𝗈𝗍 𝗏𝗂𝖽𝖾𝗈 𝗂𝗇𝖿𝗈: ${info.basic_info.title || '𝖴𝗇𝗄𝗇𝗈𝗐𝗇'}`);

                const formats = info.streaming_data?.formats || [];
                const adaptive = info.streaming_data?.adaptive_formats || [];
                const allFormats = [...formats, ...adaptive];

                // Filter for video formats with audio
                const videoFormats = allFormats.filter(f =>
                    f.mime_type?.includes('video/mp4') && f.has_audio !== false
                );

                if (!videoFormats.length) {
                    console.log("❌ 𝖭𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖺𝖻𝗅𝖾 𝗏𝗂𝖽𝖾𝗈 𝖿𝗈𝗋𝗆𝖺𝗍𝗌 𝖿𝗈𝗎𝗇𝖽");
                    await api.sendMessage("❌ 𝖭𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖺𝖻𝗅𝖾 𝗏𝗂𝖽𝖾𝗈 𝖿𝗈𝗋𝗆𝖺𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖳𝗁𝖾 𝗏𝗂𝖽𝖾𝗈 𝗆𝗂𝗀𝗁𝗍 𝖻𝖾 𝗋𝖾𝗌𝗍𝗋𝗂𝖼𝗍𝖾𝖽.", event.threadID, event.messageID);
                    return;
                }

                // Sort by quality (highest first)
                videoFormats.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
                const selected = videoFormats[0];
                
                console.log(`🎯 𝖲𝖾𝗅𝖾𝖼𝗍𝖾𝖽 𝖿𝗈𝗋𝗆𝖺𝗍: ${selected.quality_label || '𝖴𝗇𝗄𝗇𝗈𝗐𝗇'}`);
                
                if (!selected.decipher) {
                    throw new Error("𝖵𝗂𝖽𝖾𝗈 𝖿𝗈𝗋𝗆𝖺𝗍 𝗇𝗈𝗍 𝗌𝗎𝗉𝗉𝗈𝗋𝗍𝖾𝖽 𝖿𝗈𝗋 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽");
                }

                const downloadUrl = await selected.decipher(youtube.session.player);

                if (!downloadUrl) {
                    throw new Error("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖴𝖱𝖫");
                }

                console.log(`🔗 𝖦𝗈𝗍 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖴𝖱𝖫: ${downloadUrl.substring(0, 100)}...`);

                const protocol = downloadUrl.startsWith('https:') ? https : http;

                // Download and send video
                const request = protocol.get(downloadUrl, (response) => {
                    if (response.statusCode !== 200) {
                        console.error(`❌ 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝖺𝗂𝗅𝖾𝖽 𝗐𝗂𝗍𝗁 𝗌𝗍𝖺𝗍𝗎𝗌 𝖼𝗈𝖽𝖾: ${response.statusCode}`);
                        api.sendMessage(`❌ 𝖵𝗂𝖽𝖾𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝖺𝗂𝗅𝖾𝖽 (𝖧𝖳𝖳𝖯 ${response.statusCode})`, event.threadID, event.messageID);
                        return;
                    }

                    // Clean up processing message
                    try {
                        if (processingMsg && processingMsg.messageID) {
                            api.unsendMessage(processingMsg.messageID);
                        }
                    } catch (unsendError) {
                        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError);
                    }

                    // Format duration
                    const duration = info.basic_info.duration?.seconds_total;
                    const durationText = duration ? 
                        `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` : 
                        '𝖴𝗇𝗄𝗇𝗈𝗐𝗇';

                    // Send video as attachment
                    api.sendMessage({
                        body: `🎬《 𝖵𝖨𝖣𝖤𝖮 𝖱𝖤𝖠𝖣𝖸 》\n\n📹 𝖳𝗂𝗍𝗅𝖾: ${info.basic_info.title || '𝖴𝗇𝗄𝗇𝗈𝗐𝗇'}\n⏱️ 𝖣𝗎𝗋𝖺𝗍𝗂𝗈𝗇: ${durationText}\n👤 𝖠𝗎𝗍𝗁𝗈𝗋: ${info.basic_info.author || '𝖴𝗇𝗄𝗇𝗈𝗐𝗇'}\n\n𝖤𝗇𝗃𝗈𝗒 𝗍𝗁𝖾 𝗏𝗂𝖽𝖾𝗈! 🌹`,
                        attachment: response
                    }, event.threadID, (err) => {
                        if (err) {
                            console.error('❌ 𝖲𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖾𝗋𝗋𝗈𝗋:', err);
                            api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗏𝗂𝖽𝖾𝗈. 𝖳𝗁𝖾 𝖿𝗂𝗅𝖾 𝗆𝗂𝗀𝗁𝗍 𝖻𝖾 𝗍𝗈𝗈 𝗅𝖺𝗋𝗀𝖾.", event.threadID, event.messageID);
                        } else {
                            console.log("✅ 𝖵𝗂𝖽𝖾𝗈 𝗌𝖾𝗇𝗍 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                        }
                    });

                });

                // Set timeout for download
                request.setTimeout(60000, () => {
                    console.error("❌ 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗍𝗂𝗆𝖾𝗈𝗎𝗍");
                    request.destroy();
                    api.sendMessage("❌ 𝖵𝗂𝖽𝖾𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗍𝗂𝗆𝖾𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.", event.threadID, event.messageID);
                });

                request.on('error', (err) => {
                    console.error('❌ 𝖵𝗂𝖽𝖾𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:', err);
                    api.sendMessage(`❌ 𝖵𝗂𝖽𝖾𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝖺𝗂𝗅𝖾𝖽: ${err.message}`, event.threadID, event.messageID);
                });

            } catch (error) {
                console.error('❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗏𝗂𝖽𝖾𝗈 𝗂𝗇𝖿𝗈:', error);
                
                let errorMessage = "❌ 𝖤𝗋𝗋𝗈𝗋 𝖿𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝗏𝗂𝖽𝖾𝗈 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇";
                
                if (error.message.includes("private") || error.message.includes("restricted")) {
                    errorMessage = "❌ 𝖳𝗁𝗂𝗌 𝗏𝗂𝖽𝖾𝗈 𝗂𝗌 𝗉𝗋𝗂𝗏𝖺𝗍𝖾 𝗈𝗋 𝗋𝖾𝗌𝗍𝗋𝗂𝖼𝗍𝖾𝖽 𝖺𝗇𝖽 𝖼𝖺𝗇𝗇𝗈𝗍 𝖻𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽.";
                } else if (error.message.includes("not found")) {
                    errorMessage = "❌ 𝖵𝗂𝖽𝖾𝗈 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖳𝗁𝖾 𝗅𝗂𝗇𝗄 𝗆𝗂𝗀𝗁𝗍 𝖻𝖾 𝗂𝗇𝗏𝖺𝗅𝗂𝖽 𝗈𝗋 𝗍𝗁𝖾 𝗏𝗂𝖽𝖾𝗈 𝗐𝖺𝗌 𝗋𝖾𝗆𝗈𝗏𝖾𝖽.";
                } else if (error.message.includes("format")) {
                    errorMessage = "❌ 𝖵𝗂𝖽𝖾𝗈 𝖿𝗈𝗋𝗆𝖺𝗍 𝗇𝗈𝗍 𝗌𝗎𝗉𝗉𝗈𝗋𝗍𝖾𝖽 𝖿𝗈𝗋 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽.";
                }
                
                await api.sendMessage(errorMessage, event.threadID, event.messageID);
            }

        } catch (error) {
            console.error('💥 𝖲𝗁𝖺𝗂𝗋𝗂 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:', error);
            
            let errorMessage = "❌ 𝖠𝗇 𝗎𝗇𝖾𝗑𝗉𝖾𝖼𝗍𝖾𝖽 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋!";
            
            if (error.message.includes("timeout")) {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            } else if (error.message.includes("network")) {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            }
            
            await api.sendMessage(errorMessage, event.threadID, event.messageID);
        }
    }
};
