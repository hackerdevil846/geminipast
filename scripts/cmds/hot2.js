const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "hot2",
        aliases: ["islamicvid", "islamvideo"],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 2,
        role: 0,
        category: "islamic",
        shortDescription: {
            en: "Random Islamic video"
        },
        longDescription: {
            en: "Sends random Islamic videos with inspirational messages"
        },
        guide: {
            en: "{p}hot2"
        }
    },

    onLoad: async function () {
        try {
            const cacheDir = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            console.log(`[hot2] Cache directory ready: ${cacheDir}`);
        } catch (err) {
            console.error("[hot2] onLoad error:", err);
        }
    },

    onStart: async function ({ message }) {
        const cacheDir = path.join(__dirname, "cache");

        const islamicVideos = [
            "https://i.imgur.com/bFd7QRW.mp4",
            "https://i.imgur.com/4uhuwAA.mp4",
            "https://i.imgur.com/vfYOmHS.mp4",
            "https://i.imgur.com/wzR3OP7.mp4",
            "https://i.imgur.com/ka0pxxO.mp4",
            "https://i.imgur.com/zeqzgYJ.mp4",
            "https://i.imgur.com/uVBK5gc.mp4",
            "https://i.imgur.com/zSse6lu.mp4",
            "https://i.imgur.com/oBcryzJ.mp4",
            "https://i.imgur.com/yIViust.mp4",
            "https://i.imgur.com/vLcyKJ2.mp4",
            "https://i.imgur.com/6vGHjRM.mp4",
            "https://i.imgur.com/Nu5DcgN.mp4",
            "https://i.imgur.com/MwiTEUL.mp4",
            "https://i.imgur.com/tfePTdM.mp4",
            "https://i.imgur.com/HOSrfId.mp4",
            "https://i.imgur.com/GTxZZfN.mp4",
            "https://i.imgur.com/AaPoSEo.mp4",
            "https://i.imgur.com/08yfKpb.mp4",
            "https://i.imgur.com/xIi5ZjB.mp4",
            "https://i.imgur.com/FVtCcS4.mp4"
        ];

        const islamicMessage = 
            "🌿 Islamic Video 🌿\n\n" +
            "💫 When darkness falls on the human heart,\n" +
            "Only Allah's light shows the way.\n\n" +
            "✨ We seek tawfiq to stay away from haram,\n" +
            "May Allah grant us all a halal life.\n\n" +
            "🌙 Whoever forgets Allah,\n" +
            "Forgets themselves.\n\n" +
            "🕋 Those who forget Allah in the name of love,\n" +
            "Never find true peace.\n\n" +
            "📖 Let's decorate life with the light of Quran,\n" +
            "Find peace with Allah's mercy.\n\n" +
            "🤲 Let us all return to the path of Allah,\n" +
            "And attain His mercy and forgiveness.";

        try {
            // Ensure cache directory exists
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            // Send initial message
            await message.reply(islamicMessage);
            const processingMsg = await message.reply("📥 Downloading Islamic video... Please wait.");

            let videoSent = false;
            let attempts = 0;
            const maxAttempts = 3;

            while (attempts < maxAttempts && !videoSent) {
                attempts++;
                const randomIndex = Math.floor(Math.random() * islamicVideos.length);
                const randomVideo = islamicVideos[randomIndex];
                const filename = `islamic_video_${Date.now()}_${attempts}.mp4`;
                const videoPath = path.join(cacheDir, filename);

                try {
                    // Download video
                    const response = await axios({
                        method: 'GET',
                        url: randomVideo,
                        responseType: 'arraybuffer',
                        timeout: 45000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });

                    // Check if response is valid
                    if (!response.data || response.data.length === 0) {
                        throw new Error("Empty response from server");
                    }

                    // Save file
                    await fs.writeFile(videoPath, Buffer.from(response.data, 'binary'));

                    // Verify file was saved
                    if (!fs.existsSync(videoPath)) {
                        throw new Error("File not saved properly");
                    }

                    const stats = fs.statSync(videoPath);
                    if (stats.size <= 1000) { // Check if file is too small (likely error)
                        throw new Error("Downloaded file is too small");
                    }

                    const caption = 
                        "▬▬▬▬▬▬▬▬▬▬▬▬\n" +
                        "   Random Islamic Video\n" +
                        "▬▬▬▬▬▬▬▬▬▬▬▬\n\n" +
                        "🌟 May this reminder bring peace and guidance. 🤲";

                    // Send video
                    await message.reply({
                        body: caption,
                        attachment: fs.createReadStream(videoPath)
                    });

                    videoSent = true;

                    // Clean up processing message
                    try {
                        if (processingMsg && processingMsg.messageID) {
                            await message.unsend(processingMsg.messageID);
                        }
                    } catch (unsendError) {
                        console.warn("[hot2] Failed to unsend processing message:", unsendError);
                    }

                    // Clean up video file
                    try {
                        if (fs.existsSync(videoPath)) {
                            fs.unlinkSync(videoPath);
                        }
                    } catch (cleanupErr) {
                        console.warn(`[hot2] Cleanup failed for ${videoPath}:`, cleanupErr);
                    }

                } catch (innerErr) {
                    console.error(`[hot2] Attempt ${attempts} failed:`, innerErr.message);

                    // Clean up failed download
                    try {
                        if (fs.existsSync(videoPath)) {
                            fs.unlinkSync(videoPath);
                        }
                    } catch (rmErr) {
                        console.warn(`[hot2] Failed to remove partial file:`, rmErr);
                    }

                    if (attempts >= maxAttempts) {
                        await message.reply("❌ Sorry, I couldn't download an Islamic video right now. Please try again later.");
                    }
                }
            }

        } catch (err) {
            console.error("[hot2] Command error:", err);
            
            let errorMessage = "❌ Failed to process Islamic video. Please try again later.";
            
            if (err.message.includes("timeout")) {
                errorMessage = "⏰ Download timeout. Please try again.";
            } else if (err.message.includes("ENOTFOUND")) {
                errorMessage = "🌐 Network error. Please check your connection.";
            }
            
            try {
                await message.reply(errorMessage);
            } catch (sendErr) {
                console.error("[hot2] Failed to send error message:", sendErr);
            }
        }
    }
};
