const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const yts = require("yt-search");

module.exports = {
    config: {
        name: "song",
        aliases: ["music", "audio", "ytmusic"],
        version: "4.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "media",
        shortDescription: {
            en: "Download song/audio/video from YouTube"
        },
        longDescription: {
            en: "Download high quality audio or video from YouTube"
        },
        guide: {
            en: "{p}song [song name] or {p}song [song name] video"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "yt-search": ""
        }
    },

    onStart: async function ({ api, event, args, message }) {
        const query = args.join(" ");

        if (!query) {
            return message.reply("❌ Please provide a song name.\n\nUsage: song [name] or song [name] video");
        }

        const wantVideo = query.toLowerCase().endsWith(" video");
        const searchTerm = wantVideo ? query.replace(/ video$/i, "").trim() : query.trim();
        const format = wantVideo ? "video" : "audio";

        const processingMsg = await message.reply(`🔍 Searching for "${searchTerm}"...`);

        try {
            // Search using yt-search
            const searchResults = await yts(searchTerm);
            const videos = searchResults.videos;

            if (!videos || videos.length === 0) {
                await message.unsendMessage(processingMsg.messageID);
                return message.reply("❌ No results found.");
            }

            const first = videos[0];
            const title = first.title;
            const videoUrl = first.url;
            const author = first.author.name;
            const duration = first.timestamp || "Unknown";

            await message.unsendMessage(processingMsg.messageID);
            const downloadMsg = await message.reply(`✅ Found: ${title}\n📥 Downloading ${format}...`);

            // Fetch download URL using API
            let fetchRes;
            try {
                const apiEndpoint = wantVideo ? 'ytmp4' : 'ytmp3';
                let apiUrl = `https://anabot.my.id/api/download/${apiEndpoint}?url=${encodeURIComponent(videoUrl)}&apikey=freeApikey`;
                if (wantVideo) {
                    apiUrl += '&quality=360';
                }
                
                fetchRes = await axios.get(apiUrl, {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    timeout: 60000
                });
            } catch (fetchError) {
                console.error("API Fetch Error:", fetchError);
                await message.unsendMessage(downloadMsg.messageID);
                return message.reply(`❌ Failed to fetch download link.\n\nError: ${fetchError.message}`);
            }

            if (!fetchRes.data || !fetchRes.data.success || !fetchRes.data.data || !fetchRes.data.data.result || !fetchRes.data.data.result.urls) {
                await message.unsendMessage(downloadMsg.messageID);
                return message.reply("❌ Invalid API response. Failed to get download URL.");
            }

            const downloadUrl = fetchRes.data.data.result.urls;

            // Download the file
            let downloadRes;
            try {
                downloadRes = await axios.get(downloadUrl, {
                    responseType: 'arraybuffer',
                    timeout: 180000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': '*/*'
                    }
                });
            } catch (downloadError) {
                await message.unsendMessage(downloadMsg.messageID);
                return message.reply(`❌ Download failed.\n\nError: ${downloadError.message}`);
            }

            // Check if file was downloaded successfully
            if (!downloadRes.data || downloadRes.data.length === 0) {
                await message.unsendMessage(downloadMsg.messageID);
                return message.reply("❌ Downloaded file is empty or corrupted.");
            }

            const cacheDir = path.join(__dirname, "cache");
            await fs.ensureDir(cacheDir);

            const timestamp = Date.now();
            const extension = wantVideo ? "mp4" : "mp3";
            const filePath = path.join(cacheDir, `${timestamp}.${extension}`);
            
            await fs.writeFile(filePath, downloadRes.data);

            // Check if file was written successfully
            const stats = await fs.stat(filePath);
            if (stats.size === 0) {
                await message.unsendMessage(downloadMsg.messageID);
                return message.reply("❌ File write failed. File is empty.");
            }

            await message.unsendMessage(downloadMsg.messageID);
            
            // Send the file
            await message.reply({
                body: `🎶 Title: ${title}\n🎤 Artist: ${author}\n⏱️ Duration: ${duration}\n🔗 URL: ${videoUrl}\n📦 Format: ${wantVideo ? 'Video' : 'Audio'}`,
                attachment: fs.createReadStream(filePath)
            });

            // Clean up file after 10 seconds
            setTimeout(async () => {
                try {
                    if (await fs.pathExists(filePath)) {
                        await fs.unlink(filePath);
                    }
                } catch (cleanupError) {
                    console.log("Cleanup error:", cleanupError);
                }
            }, 10000);

        } catch (err) {
            console.error("SONG CMD ERROR:", err);
            try {
                await message.reply("❌ An error occurred while processing your request. Please try again later.");
            } catch (replyError) {
                console.error("Failed to send error message:", replyError);
            }
        }
    }
};
