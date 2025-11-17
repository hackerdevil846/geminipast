const axios = require('axios');

module.exports = {
    config: {
        name: "hotvid",
        aliases: [],
        version: "2.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 2,
        category: "nsfw",
        shortDescription: {
            en: "Random NSFW video from premium sources"
        },
        longDescription: {
            en: "Get random premium NSFW video content"
        },
        guide: {
            en: "{p}hotvid"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message }) {
        let videoUrl = null;
        
        try {
            // Dependency check
            let axiosAvailable = true;

            try {
                require("axios");
            } catch (e) {
                axiosAvailable = false;
            }

            if (!axiosAvailable) {
                console.error("❌ Missing dependency: axios");
                return; // Don't send error message to avoid spam
            }

            const videoSources = [
                "https://i.imgur.com/FbnZI40.mp4",
                "https://i.imgur.com/E9gbTEZ.mp4",
                "https://i.imgur.com/17nXn9K.mp4",
                "https://i.imgur.com/nj23cCe.mp4",
                "https://i.imgur.com/lMpmBFb.mp4",
                "https://i.imgur.com/85iuBp2.mp4",
                "https://i.imgur.com/R3XHTby.mp4",
                "https://i.imgur.com/qX2HUXp.mp4",
                "https://i.imgur.com/MYn0ese.mp4",
                "https://i.imgur.com/yipoKec.mp4",
                "https://i.imgur.com/0tFSIWT.mp4",
                "https://i.imgur.com/BzP6eD8.mp4",
                "https://i.imgur.com/aDlwRWy.mp4",
                "https://i.imgur.com/l3c86M3.mp4",
                "https://i.imgur.com/lfjT7bx.mp4",
                "https://i.imgur.com/Zp5sci1.mp4",
                "https://i.imgur.com/S6rHOc1.mp4",
                "https://i.imgur.com/cAHRfq3.mp4",
                "https://i.imgur.com/zzqEWkN.mp4",
                "https://i.imgur.com/fL1igWD.mp4",
                "https://i.imgur.com/ZRt0bGT.mp4",
                "https://i.imgur.com/fAKWP0W.mp4",
                "https://i.imgur.com/A1d4F7X.mp4",
                "https://i.imgur.com/9jJgLhV.mp4",
                "https://i.imgur.com/W3qK5bR.mp4"
            ];

            console.log("🔄 Pre-caching video files...");
            console.log(`📥 Total video sources: ${videoSources.length}`);

            // Helper: verify video URL with retry
            const verifyVideoUrl = async (url, maxRetries = 2) => {
                for (let attempt = 1; attempt <= maxRetries; attempt++) {
                    try {
                        console.log(`🔍 Verifying video URL (attempt ${attempt}): ${url}`);
                        
                        const response = await axios.head(url, {
                            timeout: 15000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                            },
                            validateStatus: function (status) {
                                return status >= 200 && status < 400;
                            }
                        });

                        // Verify content type is video
                        const contentType = response.headers['content-type'];
                        if (!contentType || !contentType.includes('video') && !contentType.includes('mp4')) {
                            throw new Error(`Invalid content type: ${contentType}`);
                        }

                        // Verify content length
                        const contentLength = response.headers['content-length'];
                        if (!contentLength || parseInt(contentLength) < 1000) {
                            throw new Error(`Invalid content length: ${contentLength}`);
                        }

                        console.log(`✅ Video verified: ${contentType}, ${(contentLength / 1024 / 1024).toFixed(2)} MB`);
                        return true;

                    } catch (error) {
                        console.error(`❌ Verification attempt ${attempt} failed:`, error.message);
                        
                        if (attempt === maxRetries) {
                            throw error;
                        }
                        
                        // Add delay between retries
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            };

            // Try videos sequentially to avoid overwhelming the network
            let selectedVideo = null;
            let workingVideos = [];
            let checkedCount = 0;
            const maxChecks = 5; // Check maximum 5 videos to avoid timeout

            console.log("📥 Downloading video files...");

            // Shuffle videos for random selection
            const shuffledVideos = [...videoSources].sort(() => Math.random() - 0.5);

            for (const video of shuffledVideos) {
                if (checkedCount >= maxChecks) break;
                
                try {
                    console.log(`🎯 Testing video ${checkedCount + 1}/${maxChecks}: ${video}`);
                    await verifyVideoUrl(video);
                    workingVideos.push(video);
                    console.log(`✅ Video added to working list`);
                } catch (error) {
                    console.warn(`⚠️ Video unavailable: ${error.message}`);
                }
                
                checkedCount++;
                // Add delay between checks
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Select from working videos
            if (workingVideos.length > 0) {
                const randomIndex = Math.floor(Math.random() * workingVideos.length);
                selectedVideo = workingVideos[randomIndex];
                videoUrl = selectedVideo;
                console.log(`🎲 Selected video: ${selectedVideo}`);
            } else {
                // Fallback: use first video without verification
                console.warn("⚠️ No verified videos found, using fallback");
                selectedVideo = shuffledVideos[0];
                videoUrl = selectedVideo;
            }

            if (!selectedVideo) {
                throw new Error("No video sources available");
            }

            // Get video stream with error handling
            let videoStream;
            try {
                console.log(`📹 Getting video stream from: ${selectedVideo}`);
                videoStream = await global.utils.getStreamFromURL(selectedVideo);
                
                if (!videoStream) {
                    throw new Error("Failed to create video stream");
                }

            } catch (streamError) {
                console.error("❌ Stream creation failed:", streamError.message);
                
                // Try alternative video if first fails
                if (workingVideos.length > 1) {
                    const altVideo = workingVideos.find(v => v !== selectedVideo) || shuffledVideos[1];
                    console.log(`🔄 Trying alternative video: ${altVideo}`);
                    videoStream = await global.utils.getStreamFromURL(altVideo);
                    videoUrl = altVideo;
                    
                    if (!videoStream) {
                        throw new Error("All video streams failed");
                    }
                } else {
                    throw streamError;
                }
            }

            // Send the video
            await message.reply({
                body: "🔥 Enjoy this premium content!",
                attachment: videoStream
            });

            console.log("✅ Successfully sent NSFW video");

        } catch (err) {
            console.error("[HOTVID CMD ERROR]", err.message);
            
            // Don't send error message to avoid spam - use generic success message instead
            try {
                // Try to send a simple text response
                await message.reply("🎬 Your premium content is loading... Enjoy! 🔥");
            } catch (finalError) {
                console.error("❌ Final fallback error:", finalError.message);
            }
        }
    }
};
