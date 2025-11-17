const Scraper = require('mal-scraper');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "animeinfo",
        aliases: [],
        version: "3.0",
        author: "Asif Mahmud",
        countDown: 20,
        role: 0,
        category: "anime",
        shortDescription: {
            en: "Get anime details from MyAnimeList"
        },
        longDescription: {
            en: "Fetch comprehensive anime information from MyAnimeList"
        },
        guide: {
            en: "{p}animeinfo [anime title]"
        },
        dependencies: {
            "mal-scraper": "",
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, args }) {
        try {
            // Dependency check with better validation
            let dependenciesAvailable = true;
            try {
                require('mal-scraper');
                require('axios');
                require('fs-extra');
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ Missing required dependencies: mal-scraper, axios, fs-extra");
            }

            const animeTitle = args.join(" ").trim();
            if (!animeTitle) {
                return message.reply("❌ Please enter an anime title!\n\nExample: /animeinfo Naruto Shippuden");
            }

            if (animeTitle.length > 100) {
                return message.reply("❌ Anime title is too long. Please keep it under 100 characters.");
            }

            const loadingMsg = await message.reply("🔍 Searching MyAnimeList database... ⏳");

            let animeData = null;
            try {
                animeData = await Scraper.getInfoFromName(animeTitle);
                if (!animeData || !animeData.title) {
                    throw new Error("No valid data received from MyAnimeList");
                }
            } catch (scraperError) {
                console.error("Scraper Error:", scraperError);
                await message.unsend(loadingMsg.messageID);
                return message.reply(`❌ No results found for "${animeTitle}"\n\n💡 Try a different title or check spelling.`);
            }

            // Create cache directory if it doesn't exist
            const cacheDir = path.join(__dirname, 'cache');
            try {
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                }
            } catch (dirError) {
                console.error("Cache directory error:", dirError);
            }

            const imagePath = path.join(cacheDir, `mal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`);
            const imageUrl = animeData.picture;
            let imageDownloaded = false;

            // Download image with enhanced error handling
            if (imageUrl && imageUrl.startsWith('http')) {
                try {
                    console.log(`📥 Downloading image: ${imageUrl}`);
                    const imageResponse = await axios.get(imageUrl, { 
                        responseType: 'arraybuffer',
                        timeout: 15000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Referer': 'https://myanimelist.net/'
                        },
                        maxContentLength: 5 * 1024 * 1024 // 5MB limit
                    });

                    // Check if it's actually an image
                    const contentType = imageResponse.headers['content-type'];
                    if (contentType && contentType.startsWith('image/')) {
                        await fs.writeFile(imagePath, Buffer.from(imageResponse.data, 'binary'));
                        
                        // Verify file was written
                        const stats = await fs.stat(imagePath);
                        if (stats.size > 1000) { // At least 1KB
                            imageDownloaded = true;
                            console.log(`✅ Image downloaded successfully (${(stats.size / 1024 / 1024).toFixed(2)}MB)`);
                        } else {
                            await fs.unlink(imagePath).catch(() => {});
                        }
                    }
                } catch (imageError) {
                    console.error("❌ Image download failed:", imageError.message);
                    // Continue without image
                }
            }

            // Format data with dark stylish font
            const genres = animeData.genres?.join(", ") || "N/A";
            const studios = animeData.studios?.join(", ") || "N/A";
            const producers = animeData.producers?.join(", ") || "N/A";
            
            // Truncate synopsis if too long
            let synopsis = animeData.synopsis || "No synopsis available";
            if (synopsis.length > 800) {
                synopsis = synopsis.substring(0, 800) + "...";
            }

            // Remove HTML tags from synopsis
            synopsis = synopsis.replace(/<[^>]*>/g, '');

            const messageBody = `╔═══════════════════════════════╗
║          🎬 ＡＮＩＭＥ ＩＮＦＯ          ║
╠═══════════════════════════════╣
║ 📖 Title: ${(animeData.title || "N/A").padEnd(30)} ║
║ 🇯🇵 Japanese: ${(animeData.japaneseTitle || "N/A").substring(0, 28).padEnd(28)} ║
╠═══════════════════════════════╣
║ 📺 Type: ${(animeData.type || "N/A").padEnd(30)} ║
║ 📊 Status: ${(animeData.status || "N/A").padEnd(29)} ║
║ 🗓️ Premiered: ${(animeData.premiered || "N/A").padEnd(25)} ║
║ 📡 Aired: ${(animeData.aired || "N/A").substring(0, 29).padEnd(29)} ║
╠═══════════════════════════════╣
║ 📈 Episodes: ${String(animeData.episodes || "N/A").padEnd(28)} ║
║ ⏱️ Duration: ${(animeData.duration || "N/A").padEnd(27)} ║
║ 📚 Source: ${(animeData.source || "N/A").padEnd(29)} ║
║ 🔞 Rating: ${(animeData.rating || "N/A").padEnd(28)} ║
╠═══════════════════════════════╣
║ 🏭 Studios: ${studios.substring(0, 28).padEnd(28)} ║
║ 🏷️ Genres: ${genres.substring(0, 29).padEnd(29)} ║
╠═══════════════════════════════╣
║ ⭐ Score: ${String(animeData.score || "N/A").padEnd(31)} ║
║ 🏆 Ranked: #${String(animeData.ranked || "N/A").padEnd(28)} ║
║ 🌟 Popularity: #${String(animeData.popularity || "N/A").padEnd(23)} ║
╠═══════════════════════════════╣
║ 📝 Synopsis:
║ ${synopsis.split('\n').join('\n║ ')}
╠═══════════════════════════════╣
║ 🔗 MyAnimeList: ${animeData.url?.substring(0, 25) || "N/A"}
╚═══════════════════════════════╝

✨ Data provided by MyAnimeList
💫 Coded by Asif Mahmud`;

            // Unsend loading message
            try {
                await message.unsend(loadingMsg.messageID);
            } catch (unsendError) {
                console.warn("Could not unsend loading message:", unsendError.message);
            }

            // Send result with or without image
            if (imageDownloaded && fs.existsSync(imagePath)) {
                await message.reply({
                    body: messageBody,
                    attachment: fs.createReadStream(imagePath)
                });
                
                // Clean up after sending
                try {
                    await fs.unlink(imagePath);
                    console.log("🧹 Cleaned up temporary image file");
                } catch (cleanupError) {
                    console.warn("Image cleanup error:", cleanupError.message);
                }
            } else {
                await message.reply(messageBody);
            }

        } catch (error) {
            console.error("💥 AnimeInfo Error:", error);
            
            let errorMessage = "❌ An error occurred while fetching anime data. Please try again later.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ Network error. Cannot connect to MyAnimeList.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ Request timeout. MyAnimeList is taking too long to respond.";
            } else if (error.message.includes('getaddrinfo')) {
                errorMessage = "❌ DNS error. Please check your internet connection.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
