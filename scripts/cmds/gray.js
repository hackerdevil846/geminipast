const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "gray",
        aliases: ["greyscale", "bw"],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 10,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "Convert profile picture to grayscale"
        },
        longDescription: {
            en: "Turns your or mentioned user's profile picture into a grayscale image"
        },
        guide: {
            en: "{p}gray [@mention or reply]\nIf no mention or reply, uses your profile picture."
        }
    },

    onStart: async function({ message, event, usersData }) {
        try {
            const { senderID, mentions, type, messageReply } = event;

            // Determine user ID for avatar
            let uid;
            let userName = "User";
            
            if (Object.keys(mentions).length > 0) {
                uid = Object.keys(mentions)[0];
                try {
                    const userData = await usersData.get(uid);
                    userName = userData.name || "User";
                } catch (e) {
                    userName = mentions[uid] || "User";
                }
            } else if (type === "message_reply") {
                uid = messageReply.senderID;
                try {
                    const userData = await usersData.get(uid);
                    userName = userData.name || "User";
                } catch (e) {
                    userName = "User";
                }
            } else {
                uid = senderID;
                try {
                    const userData = await usersData.get(uid);
                    userName = userData.name || "You";
                } catch (e) {
                    userName = "You";
                }
            }

            const avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

            // Show processing message
            const processingMsg = await message.reply("🔄 Converting to grayscale... Please wait.");

            // Create cache directory if it doesn't exist
            const cacheDir = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            const filePath = path.join(cacheDir, `greyscale_${uid}_${Date.now()}.png`);
            
            try {
                const res = await axios.get(`https://api.popcat.xyz/v2/greyscale?image=${encodeURIComponent(avatarURL)}`, {
                    responseType: "arraybuffer",
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });

                // Check if response is valid
                if (!res.data || res.data.length === 0) {
                    throw new Error("Empty response from API");
                }

                // Check if it's an error image (sometimes APIs return error images)
                if (res.data.length < 1000) {
                    throw new Error("Invalid image received");
                }

                fs.writeFileSync(filePath, Buffer.from(res.data));

                // Verify the file was written
                if (!fs.existsSync(filePath)) {
                    throw new Error("Failed to save image");
                }

                const stats = fs.statSync(filePath);
                if (stats.size === 0) {
                    throw new Error("Empty file saved");
                }

                await message.reply({
                    body: `🖼️ Grayscale profile picture for ${userName}!`,
                    attachment: fs.createReadStream(filePath)
                });

            } catch (apiError) {
                console.error("API Error:", apiError);
                
                // Fallback: Download original avatar and inform user
                try {
                    const fallbackResponse = await axios.get(avatarURL, {
                        responseType: "arraybuffer",
                        timeout: 30000
                    });
                    
                    fs.writeFileSync(filePath, Buffer.from(fallbackResponse.data));
                    
                    await message.reply({
                        body: `❌ Grayscale conversion failed, but here's the original profile picture of ${userName}.`,
                        attachment: fs.createReadStream(filePath)
                    });
                } catch (fallbackError) {
                    throw new Error("Failed to get profile picture");
                }
            }

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
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (cleanupError) {
                console.error("File cleanup error:", cleanupError);
            }

        } catch (err) {
            console.error("Grayscale Command Error:", err);
            
            let errorMessage = "❌ Failed to generate grayscale image. Please try again later.";
            
            if (err.message.includes("timeout")) {
                errorMessage = "⏰ Request timeout. Please try again.";
            } else if (err.message.includes("ENOTFOUND")) {
                errorMessage = "🌐 Network error. Please check your connection.";
            } else if (err.message.includes("404")) {
                errorMessage = "🔍 Profile picture not found.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
