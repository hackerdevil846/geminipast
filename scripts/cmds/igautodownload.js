const fs = require("fs-extra");
const axios = require("axios");
const { createWriteStream } = require("fs");
const { tmpdir } = require("os");
const { join } = require("path");
const { randomBytes } = require("crypto");

module.exports = {
    config: {
        name: "igautodownload",
        aliases: ["igdl", "instagramdl"],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "Automatically download Instagram videos"
        },
        longDescription: {
            en: "Downloads Instagram videos automatically when a link is sent"
        },
        guide: {
            en: "Just send an Instagram video link in the chat"
        }
    },

    onStart: async function({ message, event }) {
        return message.reply(
            "✨ | This command doesn't need a prefix!\nJust send an Instagram video link in the chat 💙"
        );
    },

    onChat: async function({ message, event }) {
        if (event.type !== "message" || !event.body) return;

        const instaRegex = /https?:\/\/(?:www\.)?instagram\.com\/(?:reel|p|stories)\/([^\/\s?]+)/gi;
        const instaMatch = event.body.match(instaRegex);
        
        if (!instaMatch) return;

        for (const url of instaMatch) {
            let tempFilePath = null;
            try {
                await message.reply("⬇️ | Downloading your Instagram video...", event.threadID);

                let results;
                try {
                    console.log(`Processing Instagram URL: ${url}`);
                    
                    // Try to require the instagram module with better error handling
                    let getInstagram;
                    try {
                        getInstagram = require("instagram-url-direct");
                        // Handle both default and named exports
                        if (typeof getInstagram !== 'function') {
                            getInstagram = getInstagram.default || Object.values(getInstagram)[0];
                        }
                        
                        if (typeof getInstagram !== 'function') {
                            throw new Error("Instagram module not properly exported");
                        }
                    } catch (moduleError) {
                        console.error("Failed to load instagram-url-direct:", moduleError.message);
                        await message.reply(
                            "⚠️ | Instagram downloader module not available. Please contact admin to install: npm install instagram-url-direct"
                        );
                        continue;
                    }
                    
                    results = await getInstagram(url);
                    
                    if (!results || !results.results || !Array.isArray(results.results)) {
                        throw new Error("Invalid response from Instagram API");
                    }
                    
                    console.log(`Found ${results.results.length} media items`);
                } catch (libError) {
                    console.error("Instagram downloader library error:", libError.message);
                    await message.reply(
                        "⚠️ | Failed to process this Instagram link. It might be private, unavailable, or the module needs update."
                    );
                    continue;
                }

                if (results.results.length === 0) {
                    await message.reply(
                        "❌ | No downloadable content found at this link!"
                    );
                    continue;
                }

                // Get the highest quality video
                const videoResults = results.results.filter(r => r.type === 'video');
                const bestResult = videoResults.length > 0 ? videoResults[0] : results.results[0];
                
                if (!bestResult || !bestResult.url) {
                    throw new Error("No download URL available");
                }

                const hdLink = bestResult.url;
                console.log("Downloading from:", hdLink);

                // Download the video with timeout and proper headers
                const response = await axios({
                    method: 'GET',
                    url: hdLink,
                    responseType: "stream", 
                    timeout: 60000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                        'Accept': '*/*',
                        'Accept-Encoding': 'identity',
                        'Connection': 'keep-alive',
                        'Referer': 'https://www.instagram.com/'
                    },
                    maxContentLength: 100 * 1024 * 1024, // 100MB limit
                    maxRedirects: 5
                });

                // Create temporary file
                const randomName = randomBytes(16).toString("hex");
                tempFilePath = join(tmpdir(), `ig_video_${randomName}.mp4`);

                const writer = createWriteStream(tempFilePath);
                response.data.pipe(writer);

                // Wait for download to complete
                await new Promise((resolve, reject) => {
                    writer.on("finish", resolve);
                    writer.on("error", reject);
                    response.data.on("error", reject);
                    
                    // Add timeout for download
                    setTimeout(() => {
                        reject(new Error("Download timeout"));
                    }, 60000);
                });

                // Verify the downloaded file
                if (!fs.existsSync(tempFilePath)) {
                    throw new Error("Downloaded file not found");
                }

                const stats = fs.statSync(tempFilePath);
                if (stats.size === 0) {
                    throw new Error("Downloaded file is empty");
                }

                if (stats.size > 50 * 1024 * 1024) { // 50MB limit
                    throw new Error("File too large to send");
                }

                console.log(`Download completed. File size: ${stats.size} bytes`);

                // Send the video
                await message.reply({
                    body: "✅ | Successfully downloaded your Instagram video!\n\n📱 Credits: Asif Mahmud",
                    attachment: fs.createReadStream(tempFilePath)
                });

            } catch (error) {
                console.error("Error processing Instagram video:", error.message);
                
                let errorMessage = "❌ | Download failed! Please try again later.";
                
                if (error.message.includes("timeout")) {
                    errorMessage = "⏰ | Download timeout. The video might be too large.";
                } else if (error.message.includes("too large")) {
                    errorMessage = "📦 | Video is too large to download. Try a shorter video.";
                } else if (error.message.includes("private")) {
                    errorMessage = "🔒 | This Instagram content is private or unavailable.";
                } else if (error.message.includes("module")) {
                    errorMessage = "🔧 | Instagram downloader not configured properly.";
                }
                
                await message.reply(errorMessage);
            } finally {
                // Clean up temporary file
                if (tempFilePath) {
                    try {
                        if (fs.existsSync(tempFilePath)) {
                            fs.unlinkSync(tempFilePath);
                            console.log("Temporary file cleaned up:", tempFilePath);
                        }
                    } catch (cleanupError) {
                        console.error("Cleanup failed:", cleanupError.message);
                    }
                }
            }
        }
    }
};
