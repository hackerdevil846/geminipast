module.exports = {
    config: {
        name: "autooodl",
        aliases: [],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "Auto video download from URLs"
        },
        longDescription: {
            en: "Automatically downloads videos from various social media URLs"
        },
        guide: {
            en: "Send any video URL (Facebook, TikTok, Instagram, YouTube, etc.) in chat"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "shaon-videos-downloader": ""
        }
    },

    onStart: async function ({ api, event }) {
        // Empty onStart function to prevent the undefined error
        // The main functionality is in onChat
    },

    onChat: async function ({ api, event }) {
        const axios = require("axios");
        const fs = require("fs-extra");
        const path = require("path");
        const { alldown } = require("shaon-videos-downloader");

        try {
            const content = (event.body || "").trim();
            if (!content) return;

            // Extract first http/https URL from message
            const urlMatch = content.match(/https?:\/\/[^\s]+/i);
            if (!urlMatch) return;

            const inputUrl = urlMatch[0];

            // React to indicate processing started
            try { 
                api.setMessageReaction("⚠️", event.messageID, () => {}, true); 
            } catch (e) {}

            // Call shaon-videos-downloader
            const data = await alldown(inputUrl);
            if (!data) throw new Error("Downloader returned no data");

            // Extract a usable video URL from the response with safe fallbacks
            let videoUrl = null;

            // 1) If response has videos array
            if (Array.isArray(data.videos) && data.videos.length > 0) {
                const first = data.videos[0];
                if (typeof first === "string") videoUrl = first;
                else if (first && (first.url || first.video)) videoUrl = first.url || first.video;
            }

            // 2) Fallback to top-level url field if present
            if (!videoUrl && data.url && typeof data.url === "string") {
                videoUrl = data.url;
            }

            // 3) If the downloader returned a direct string URL
            if (!videoUrl && typeof data === "string" && /^https?:\/\//i.test(data)) {
                videoUrl = data;
            }

            if (!videoUrl) throw new Error("No downloadable video URL found in downloader response");

            // React to indicate download start / progress
            try { 
                api.setMessageReaction("☢️", event.messageID, () => {}, true); 
            } catch (e) {}

            // Ensure cache directory exists
            const cacheDir = path.join(__dirname, "cache");
            await fs.ensureDir(cacheDir);

            // Create a unique filename to avoid collisions
            const fileName = `auto_${Date.now()}_${Math.floor(Math.random() * 10000)}.mp4`;
            const filePath = path.join(cacheDir, fileName);

            // Download using streaming to avoid large memory usage
            const response = await axios({
                method: 'GET',
                url: videoUrl,
                responseType: 'stream',
                timeout: 120000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            // Pipe stream to file
            await new Promise((resolve, reject) => {
                const writer = fs.createWriteStream(filePath);
                response.data.pipe(writer);
                let failed = false;
                writer.on("error", (err) => {
                    failed = true;
                    writer.close();
                    reject(err);
                });
                writer.on("finish", () => {
                    if (!failed) resolve();
                });
            });

            // Verify file exists and is non-empty
            const stat = await fs.stat(filePath);
            if (!stat || stat.size === 0) {
                try { await fs.remove(filePath); } catch (e) {}
                throw new Error("Downloaded file is empty");
            }

            // Send the video file back to the thread
            await api.sendMessage({
                body: `Chat Bot💻\n📥⚡ Auto Downloader ⚡📂\n🎬 Enjoy the Video 🎀`,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, event.messageID);

            // Clean up the cached file
            try { await fs.remove(filePath); } catch (e) {}

        } catch (error) {
            console.error("Auto Download Error:", error);

            // React to signal failure
            try { 
                api.setMessageReaction("❌", event.messageID, () => {}, true); 
            } catch (e) {}
        }
    }
};
