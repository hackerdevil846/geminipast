const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "hololive",
        aliases: ["vtuber", "holo"],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "media",
        shortDescription: {
            en: "Hololive VTuber Photo Gallery"
        },
        longDescription: {
            en: "Fetches Hololive VTuber images from an API"
        },
        guide: {
            en: "{p}hololive [character_name]"
        }
    },

    onStart: async function({ message, args, event }) {
        try {
            const characterList = {
                rushia: "🌸 Urusha Rushia (烏羽らすえ)",
                pekora: "🐰 Usada Pekora (兎田ぺこら)", 
                coco: "🐉 Kiyru Coco (桐生ココ)",
                gura: "🐋 Gawr Gura (がうる・ぐら)",
                marine: "🏴‍☠️ Houshou Marine (宝鐘マリン)",
                fubuki: "🦊 Shirakami Fubuki (白上フブキ)",
                matsuri: "🎀 Natsuiro Matsuri (夏色まつり)",
                aqua: "👾 Minato Aqua (湊あくあ)",
                shion: "🔮 Murasaki Shion (紫咲シオン)",
                ayame: "👹 Nakiri Ayame (百鬼あやめ)"
            };

            if (!args[0]) {
                const availableCharacters = Object.entries(characterList)
                    .map(([key, value]) => `• ${key} - ${value}`)
                    .join('\n');
                
                return message.reply(
                    `🎌 HOLOLIVE VTUBER GALLERY\n\n` +
                    `Available characters:\n${availableCharacters}\n\n` +
                    `Usage: ${this.config.name} [character_name]\n\n` +
                    `Example: ${this.config.name} rushia`
                );
            }

            const character = args[0].toLowerCase();
            if (!characterList[character]) {
                return message.reply(
                    `❌ Invalid character "${character}"!\n\n` +
                    `📋 Available characters:\n${Object.keys(characterList).join(', ')}`
                );
            }

            // Show processing message
            const processingMsg = await message.reply(`🔄 Fetching ${characterList[character]}...`);

            try {
                const res = await axios.get(`https://api.randvtuber-saikidesu.ml?character=${character}`, {
                    timeout: 30000
                });

                if (!res.data || !res.data.url) {
                    throw new Error("No image URL received from API");
                }

                const ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
                const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
                
                if (!validExtensions.includes(ext.toLowerCase())) {
                    throw new Error("Invalid image format received");
                }

                const path = __dirname + `/cache/${character}_${Date.now()}.${ext}`;

                // Ensure cache directory exists
                const cacheDir = __dirname + '/cache';
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                }

                const imageResponse = await axios.get(res.data.url, { 
                    responseType: "arraybuffer",
                    timeout: 30000
                });

                if (!imageResponse.data || imageResponse.data.length === 0) {
                    throw new Error("Empty image data received");
                }

                await fs.writeFileSync(path, Buffer.from(imageResponse.data, "binary"));

                // Verify file was written
                if (!fs.existsSync(path)) {
                    throw new Error("Failed to save image file");
                }

                const stats = fs.statSync(path);
                if (stats.size === 0) {
                    throw new Error("Downloaded file is empty");
                }

                await message.reply({
                    body: `🎀 Character: ${characterList[character]}\n` +
                          `📦 Available images: ${res.data.count || 'Unknown'}\n` +
                          `✨ Credits: ${res.data.author || "Hololive API"}`,
                    attachment: fs.createReadStream(path)
                });

                // Clean up processing message
                try {
                    if (processingMsg && processingMsg.messageID) {
                        await message.unsend(processingMsg.messageID);
                    }
                } catch (unsendError) {
                    // Ignore unsend errors
                }

                // Clean up file
                try {
                    if (fs.existsSync(path)) {
                        fs.unlinkSync(path);
                    }
                } catch (cleanupError) {
                    console.error("File cleanup error:", cleanupError);
                }

            } catch (apiError) {
                console.error("API Error:", apiError);
                throw new Error(`Failed to fetch ${characterList[character]} image`);
            }
            
        } catch (err) {
            console.error("Hololive Command Error:", err);
            
            let errorMessage = "❌ Error fetching VTuber image!";
            
            if (err.message.includes("timeout")) {
                errorMessage = "⏰ Request timeout. Please try again.";
            } else if (err.message.includes("ENOTFOUND")) {
                errorMessage = "🌐 Network error. Please check your connection.";
            } else if (err.message.includes("Failed to fetch")) {
                errorMessage = `❌ ${err.message}`;
            }
            
            await message.reply(errorMessage);
        }
    }
};
