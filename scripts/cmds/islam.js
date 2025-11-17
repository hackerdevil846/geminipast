const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "islam",
        aliases: [],
        version: "2.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "islamic",
        shortDescription: {
            en: "Get Islamic inspirational videos"
        },
        longDescription: {
            en: "Sends random Islamic inspirational videos with Quranic recitations"
        },
        guide: {
            en: "{p}islam"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function ({ message }) {
        try {
            await message.reply("🕌 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐂𝐨𝐧𝐭𝐞𝐧𝐭 𝐌𝐨𝐝𝐮𝐥𝐞\n\n📖 𝐓𝐲𝐩𝐞 '𝐢𝐬𝐥𝐚𝐦' 𝐭𝐨 𝐠𝐞𝐭 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐢𝐧𝐬𝐩𝐢𝐫𝐚𝐭𝐢𝐨𝐧𝐚𝐥 𝐯𝐢𝐝𝐞𝐨𝐬\n✨ 𝐌𝐚𝐲 𝐀𝐥𝐥𝐚𝐡 𝐛𝐥𝐞𝐬𝐬 𝐲𝐨𝐮");
        } catch (error) {
            console.error("❌ 𝐒𝐭𝐚𝐫𝐭 𝐄𝐫𝐫𝐨𝐫:", error);
        }
    },

    onChat: async function ({ event, message }) {
        try {
            if (event.body && event.body.toLowerCase().trim() === "islam") {
                await this.handleIslamicVideo({ message });
            }
        } catch (error) {
            console.error("❌ 𝐂𝐡𝐚𝐭 𝐄𝐫𝐫𝐨𝐫:", error);
        }
    },

    handleIslamicVideo: async function ({ message }) {
        let videoPath = null;
        let processingMsg = null;
        
        try {
            // Create cache directory
            const cacheDir = path.join(__dirname, 'cache', 'islamic_videos');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
                console.log("✅ 𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐯𝐢𝐝𝐞𝐨𝐬 𝐜𝐚𝐜𝐡𝐞 𝐝𝐢𝐫𝐞𝐜𝐭𝐨𝐫𝐲");
            }

            processingMsg = await message.reply("📥 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐯𝐢𝐝𝐞𝐨...\n\n⏳ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭, 𝐭𝐡𝐢𝐬 𝐦𝐚𝐲 𝐭𝐚𝐤𝐞 𝐚 𝐟𝐞𝐰 𝐬𝐞𝐜𝐨𝐧𝐝𝐬...");

            // Islamic video URLs
            const islamicVideos = [
                "https://drive.usercontent.google.com/download?id=1Y5O3qRzxt-MFR4vVhz0QsMwHQmr-34iH&export=download",
                "https://drive.usercontent.google.com/download?id=1YDyNrN-rnzsboFmYm8Q5-FhzoJD9WV3O&export=download",
                "https://drive.usercontent.google.com/download?id=1XzgEzopoYBfuDzPsml5-RiRnItXVx4zW&export=download",
                "https://drive.usercontent.google.com/download?id=1YEeal83MYRI9sjHuEhJdjXZo9nVZmfHD&export=download",
                "https://drive.usercontent.google.com/download?id=1YMEDEKVXjnHE0KcCJHbcT2PSbu8uGSk4&export=download",
                "https://drive.usercontent.google.com/download?id=1YRb2k01n4rIdA9Vf69oxIOdv54JyAprG&export=download",
                "https://drive.usercontent.google.com/download?id=1YSQCTVhrHTNl6B9xSBCQ7frBJ3bp_KoA&export=download",
                "https://drive.usercontent.google.com/download?id=1Yc9Rwwdpqha1AWeEb5BXV-goFbag0441&export=download",
                "https://drive.usercontent.google.com/download?id=1YcwtkC5wRbbHsAFuEQYQuwQsH4-ZiBS8&export=download",
                "https://drive.usercontent.google.com/download?id=1YhfyPl8oGmsIAIOjWQyzQYkDdZUPSalo&export=download"
            ];

            // Select random video
            const randomIndex = Math.floor(Math.random() * islamicVideos.length);
            const randomVideo = islamicVideos[randomIndex];
            
            // Create unique file path
            videoPath = path.join(cacheDir, `islamic_${Date.now()}.mp4`);
            
            console.log(`📥 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐯𝐢𝐝𝐞𝐨 ${randomIndex + 1}/${islamicVideos.length}`);

            // Download video with timeout and error handling
            const response = await axios({
                method: 'GET',
                url: randomVideo,
                responseType: 'stream',
                timeout: 120000, // 2 minutes timeout
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': '*/*',
                    'Accept-Encoding': 'identity',
                    'Connection': 'keep-alive'
                },
                maxRedirects: 10,
                validateStatus: function (status) {
                    return status >= 200 && status < 400;
                }
            });

            // Write file to disk
            const writer = fs.createWriteStream(videoPath);
            response.data.pipe(writer);

            // Wait for download to complete
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', (error) => {
                    console.error('❌ 𝐖𝐫𝐢𝐭𝐞𝐫 𝐞𝐫𝐫𝐨𝐫:', error);
                    reject(error);
                });
                response.data.on('error', (error) => {
                    console.error('❌ 𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐞𝐫𝐫𝐨𝐫:', error);
                    reject(error);
                });
                
                // Add timeout for download
                setTimeout(() => {
                    reject(new Error('𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐭𝐢𝐦𝐞𝐨𝐮𝐭'));
                }, 120000);
            });

            // Verify the downloaded file
            const stats = fs.statSync(videoPath);
            if (stats.size === 0) {
                throw new Error("𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐟𝐢𝐥𝐞 𝐢𝐬 𝐞𝐦𝐩𝐭𝐲 (𝟎 𝐛𝐲𝐭𝐞𝐬)");
            }

            if (stats.size < 1024) {
                throw new Error("𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐟𝐢𝐥𝐞 𝐢𝐬 𝐭𝐨𝐨 𝐬𝐦𝐚𝐥𝐥 (𝐦𝐚𝐲 𝐛𝐞 𝐢𝐧𝐯𝐚𝐥𝐢𝐝)");
            }

            console.log(`✅ 𝐕𝐢𝐝𝐞𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲: ${(stats.size / 1024 / 1024).toFixed(2)} 𝐌𝐁`);

            // Delete processing message
            if (processingMsg && processingMsg.messageID) {
                try {
                    await message.unsendMessage(processingMsg.messageID);
                    console.log("✅ 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐝𝐞𝐥𝐞𝐭𝐞𝐝");
                } catch (unsendError) {
                    console.warn("⚠️ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐝𝐞𝐥𝐞𝐭𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐦𝐞𝐬𝐬𝐚𝐠𝐞:", unsendError.message);
                }
            }

            // Send the video
            await message.reply({
                body: `🕌 𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮 𝐀𝐥𝐚𝐢𝐤𝐮𝐦\n\n📖 𝐇𝐨𝐥𝐲 𝐐𝐮𝐫𝐚𝐧 𝐑𝐞𝐜𝐢𝐭𝐚𝐭𝐢𝐨𝐧\n✨ 𝐌𝐚𝐲 𝐀𝐥𝐥𝐚𝐡 𝐛𝐥𝐞𝐬𝐬 𝐲𝐨𝐮 𝐚𝐧𝐝 𝐢𝐧𝐜𝐫𝐞𝐚𝐬𝐞 𝐲𝐨𝐮𝐫 𝐟𝐚𝐢𝐭𝐡\n\n🎥 𝐕𝐢𝐝𝐞𝐨 ${randomIndex + 1}/${islamicVideos.length}`,
                attachment: fs.createReadStream(videoPath)
            });

            console.log("✅ 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐯𝐢𝐝𝐞𝐨 𝐬𝐞𝐧𝐭 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲");

        } catch (error) {
            console.error("❌ 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐕𝐢𝐝𝐞𝐨 𝐄𝐫𝐫𝐨𝐫:", error.message);
            
            // Clean up processing message
            if (processingMsg && processingMsg.messageID) {
                try {
                    await message.unsendMessage(processingMsg.messageID);
                } catch (unsendError) {
                    console.warn("⚠️ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐝𝐞𝐥𝐞𝐭𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐦𝐞𝐬𝐬𝐚𝐠𝐞:", unsendError.message);
                }
            }
            
            // Send appropriate error message
            let errorMessage = "❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐯𝐢𝐝𝐞𝐨. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.";
            
            if (error.message.includes('timeout')) {
                errorMessage = "⏰ 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐭𝐢𝐦𝐞𝐝 𝐨𝐮𝐭. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧.";
            } else if (error.message.includes('network') || error.code === 'ECONNREFUSED') {
                errorMessage = "🌐 𝐍𝐞𝐭𝐰𝐨𝐫𝐤 𝐞𝐫𝐫𝐨𝐫. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐜𝐡𝐞𝐜𝐤 𝐲𝐨𝐮𝐫 𝐜𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧.";
            } else if (error.message.includes('empty') || error.message.includes('small')) {
                errorMessage = "📦 𝐕𝐢𝐝𝐞𝐨 𝐟𝐢𝐥𝐞 𝐢𝐬 𝐢𝐧𝐯𝐚𝐥𝐢𝐝. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐧𝐨𝐭𝐡𝐞𝐫 𝐯𝐢𝐝𝐞𝐨.";
            }
            
            try {
                await message.reply(errorMessage);
            } catch (replyError) {
                console.error("❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐬𝐞𝐧𝐝 𝐞𝐫𝐫𝐨𝐫 𝐦𝐞𝐬𝐬𝐚𝐠𝐞:", replyError.message);
            }
            
        } finally {
            // Cleanup video file
            if (videoPath) {
                try {
                    if (fs.existsSync(videoPath)) {
                        fs.unlinkSync(videoPath);
                        console.log("✅ 𝐓𝐞𝐦𝐩𝐨𝐫𝐚𝐫𝐲 𝐯𝐢𝐝𝐞𝐨 𝐟𝐢𝐥𝐞 𝐜𝐥𝐞𝐚𝐧𝐞𝐝 𝐮𝐩");
                    }
                } catch (cleanupError) {
                    console.warn("⚠️ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐜𝐥𝐞𝐚𝐧 𝐮𝐩 𝐯𝐢𝐝𝐞𝐨 𝐟𝐢𝐥𝐞:", cleanupError.message);
                }
            }
        }
    }
};
