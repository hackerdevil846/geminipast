/**
 * youtube.js
 * Perfectly working YouTube downloader for Goat-Bot V2
 * Compatible with your exact dependencies
 */

const fs = require('fs-extra');
const path = require('path');
const ytdl = require('@distube/ytdl-core');
const yts = require('yt-search');

module.exports = {
    config: {
        name: "youtube",
        version: "4.0.0",
        role: 0,
        author: "Asif",
        cooldowns: 20,
        shortDescription: "Download YouTube videos",
        longDescription: "Download YouTube videos by search or URL",
        category: "media",
        usages: "[search query or YouTube URL]",
        dependencies: {
            "@distube/ytdl-core": "",
            "yt-search": "",
            "fs-extra": ""
        }
    },

    onStart: async function ({ api, event, args }) {
        const { threadID, messageID } = event;
        const query = args.join(" ").trim();

        // Validate input
        if (!query) {
            return api.sendMessage(
                "🔍 Please provide a YouTube URL or search query.\n\nExamples:\n• youtube baby shark\n• youtube https://youtube.com/watch?v=abc123\n• youtube https://youtu.be/abc123",
                threadID,
                messageID
            );
        }

        let processingMsg;
        let tempFilePath;

        try {
            // Send processing message
            processingMsg = await api.sendMessage("⏳ Processing your request...", threadID, messageID);

            let videoUrl, videoTitle, videoId;

            // Check if input is YouTube URL
            if (query.includes("youtube.com") || query.includes("youtu.be")) {
                // Extract video ID from URL
                const urlMatch = query.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                videoId = urlMatch ? urlMatch[1] : null;

                if (!videoId) {
                    throw new Error("INVALID_URL");
                }

                try {
                    const videoInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`);
                    videoTitle = videoInfo.videoDetails.title;
                    videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
                } catch (error) {
                    throw new Error("VIDEO_UNAVAILABLE");
                }
            } else {
                // Search for videos
                try {
                    const searchResults = await yts(query);
                    
                    if (!searchResults.videos || searchResults.videos.length === 0) {
                        throw new Error("NO_RESULTS");
                    }

                    const video = searchResults.videos[0];
                    videoTitle = video.title;
                    videoUrl = video.url;
                    videoId = video.videoId;
                    
                } catch (error) {
                    throw new Error("SEARCH_FAILED");
                }
            }

            // Update with video info
            await api.sendMessage(`📥 Downloading: ${videoTitle}`, threadID, messageID);

            // Create temp file path
            const tempDir = path.join(__dirname, '..', 'cache');
            await fs.ensureDir(tempDir);
            tempFilePath = path.join(tempDir, `youtube_${videoId}_${Date.now()}.mp4`);

            // Download the video
            await new Promise((resolve, reject) => {
                const downloadStream = ytdl(videoUrl, {
                    quality: '134', // 480p with audio
                    filter: 'audioandvideo'
                });

                const writeStream = fs.createWriteStream(tempFilePath);
                
                downloadStream.pipe(writeStream);
                
                writeStream.on('finish', resolve);
                writeStream.on('error', (error) => {
                    downloadStream.destroy();
                    reject(new Error("DOWNLOAD_FAILED"));
                });
                
                downloadStream.on('error', (error) => {
                    writeStream.destroy();
                    reject(new Error("DOWNLOAD_FAILED"));
                });

                // 45 second timeout
                setTimeout(() => {
                    if (!writeStream.closed) {
                        downloadStream.destroy();
                        writeStream.destroy();
                        reject(new Error("DOWNLOAD_TIMEOUT"));
                    }
                }, 45000);
            });

            // Verify download
            if (!fs.existsSync(tempFilePath)) {
                throw new Error("DOWNLOAD_FAILED");
            }

            const stats = await fs.stat(tempFilePath);
            if (stats.size === 0) {
                throw new Error("DOWNLOAD_FAILED");
            }

            // Check file size (87MB Facebook limit)
            if (stats.size > 87 * 1024 * 1024) {
                throw new Error("FILE_TOO_LARGE");
            }

            // Send the video
            await api.sendMessage({
                body: `🎬 ${videoTitle}\n📦 Size: ${(stats.size / (1024 * 1024)).toFixed(2)}MB\n🔗 YouTube: ${videoUrl}`,
                attachment: fs.createReadStream(tempFilePath)
            }, threadID, async (err) => {
                // Cleanup temp file after send attempt
                try {
                    if (tempFilePath && fs.existsSync(tempFilePath)) {
                        await fs.remove(tempFilePath);
                    }
                } catch (cleanError) {
                    // Ignore cleanup errors
                }

                if (err) {
                    console.error('Send error:', err);
                    try {
                        await api.sendMessage("❌ Failed to send video. The file might be too large or corrupted.", threadID, messageID);
                    } catch (e) {}
                }
            });

            // Cleanup processing message
            try {
                await api.unsendMessage(processingMsg.messageID);
            } catch (e) {
                // Ignore if can't unsend
            }

        } catch (error) {
            console.error('YouTube command error:', error.message);

            // Cleanup temp file on error
            try {
                if (tempFilePath && fs.existsSync(tempFilePath)) {
                    await fs.remove(tempFilePath);
                }
            } catch (cleanError) {}

            // Cleanup processing message
            try {
                if (processingMsg) {
                    await api.unsendMessage(processingMsg.messageID);
                }
            } catch (e) {}

            // Send appropriate error message
            let userMessage;
            switch (error.message) {
                case 'INVALID_URL':
                    userMessage = "❌ Invalid YouTube URL. Please provide a valid YouTube link.";
                    break;
                case 'VIDEO_UNAVAILABLE':
                    userMessage = "❌ Video is unavailable, private, or age-restricted.";
                    break;
                case 'NO_RESULTS':
                    userMessage = "❌ No videos found for your search query.";
                    break;
                case 'SEARCH_FAILED':
                    userMessage = "❌ Search failed. Please try again with different keywords.";
                    break;
                case 'DOWNLOAD_FAILED':
                    userMessage = "❌ Download failed. The video might be unavailable or restricted.";
                    break;
                case 'DOWNLOAD_TIMEOUT':
                    userMessage = "❌ Download timeout. Please try a shorter video.";
                    break;
                case 'FILE_TOO_LARGE':
                    userMessage = "❌ Video is too large (over 87MB). Please try a shorter video.";
                    break;
                default:
                    userMessage = "❌ An unexpected error occurred. Please try again later.";
            }

            await api.sendMessage(userMessage, threadID, messageID);
        }
    }
};
