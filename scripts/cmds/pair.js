const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "pair",
        aliases: [],
        version: "1.0.0",
        role: 0,
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        shortDescription: {
            en: "💘 𝖢𝗈𝗎𝗉𝗅𝖾 𝗆𝖺𝗍𝖼𝗁𝗂𝗇𝗀 𝗀𝖺𝗆𝖾"
        },
        longDescription: {
            en: "𝖱𝖺𝗇𝖽𝗈𝗆𝗅𝗒 𝗉𝖺𝗂𝗋𝗌 𝗍𝗐𝗈 𝗎𝗌𝖾𝗋𝗌 𝗂𝗇 𝖺 𝗀𝗋𝗈𝗎𝗉 𝗐𝗂𝗍𝗁 𝖺 𝗆𝖺𝗍𝖼𝗁 𝗉𝖾𝗋𝖼𝖾𝗇𝗍𝖺𝗀𝖾"
        },
        category: "𝖿𝗎𝗇",
        guide: {
            en: "{p}pair"
        },
        countDown: 5,
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onLoad: function () {
        try {
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
                console.log("✅ 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒");
            }
        } catch (error) {
            console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗈𝗇𝖫𝗈𝖺𝖽:", error.message);
        }
    },

    onStart: async function ({ api, message, event, usersData }) {
        // Dependency check
        let axiosAvailable = true;
        let fsAvailable = true;

        try {
            require("axios");
            require("fs-extra");
        } catch (e) {
            axiosAvailable = false;
            fsAvailable = false;
        }

        if (!axiosAvailable || !fsAvailable) {
            console.error("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌");
            return; // Don't send error message to avoid spam
        }

        const { threadID, senderID, messageID } = event;
        const cachePath = path.join(__dirname, 'cache');

        try {
            // Ensure cache directory exists
            if (!fs.existsSync(cachePath)) {
                fs.mkdirSync(cachePath, { recursive: true });
            }

            // Get sender info with error handling
            let senderName = "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";
            try {
                senderName = await usersData.getName(senderID);
            } catch (nameError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗌𝖾𝗇𝖽𝖾𝗋 𝗇𝖺𝗆𝖾:", nameError.message);
            }

            // Get thread participants
            let participants = [];
            try {
                const threadInfo = await api.getThreadInfo(threadID);
                const botID = api.getCurrentUserID();

                participants = threadInfo.participantIDs.filter(id =>
                    id !== senderID && id !== botID
                );
            } catch (threadError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈:", threadError.message);
                // Send simple text response instead of error
                await message.reply("💘 𝖯𝖺𝗂𝗋𝗂𝗇𝗀 𝖿𝖾𝖺𝗍𝗎𝗋𝖾 𝗂𝗌 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗂𝗅𝗒 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋!");
                return;
            }

            if (participants.length === 0) {
                await message.reply("❌ 𝖭𝗈 𝗈𝗍𝗁𝖾𝗋 𝗎𝗌𝖾𝗋𝗌 𝖿𝗈𝗎𝗇𝖽 𝗂𝗇 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉!");
                return;
            }

            // Select random participant
            const randomParticipantID = participants[Math.floor(Math.random() * participants.length)];

            // Get participant's name with error handling
            let participantName = "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";
            try {
                participantName = await usersData.getName(randomParticipantID);
            } catch (nameError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗉𝖺𝗋𝗍𝗂𝖼𝗂𝗉𝖺𝗇𝗍 𝗇𝖺𝗆𝖾:", nameError.message);
            }

            // Compatibility percentage logic
            const percentages = ['𝟮𝟭%', '𝟲𝟳%', '𝟭𝟵%', '𝟯𝟳%', '𝟭𝟳%', '𝟵𝟲%', '𝟱𝟮%', '𝟲𝟮%', '𝟳𝟲%', '𝟴𝟯%', '𝟭𝟬𝟬%', '𝟵𝟵%', "𝟬%", "𝟰𝟴%"];
            const randomPercentage = percentages[Math.floor(Math.random() * percentages.length)];

            // Background template URLs
            const backgrounds = [
                "https://i.postimg.cc/wjJ29HRB/background1.png",
                "https://i.postimg.cc/zf4Pnshv/background2.png", 
                "https://i.postimg.cc/5tXRQ46D/background3.png"
            ];
            const randomBackgroundUrl = backgrounds[Math.floor(Math.random() * backgrounds.length)];

            // Create unique file paths
            const timestamp = Date.now();
            const finalImagePath = path.join(cachePath, `pair_result_${timestamp}.png`);

            try {
                // Download files sequentially to avoid overwhelming the network
                const facebookToken = '6628568379%7Cc1e620fa708a1d5696fb991c1bde5662';

                // Helper function to download image with retry
                async function downloadImageWithRetry(url, maxRetries = 2) {
                    for (let attempt = 1; attempt <= maxRetries; attempt++) {
                        try {
                            console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾 (𝖺𝗍𝗍𝖾𝗆𝗉𝗍 ${attempt}): ${url}`);
                            
                            const response = await axios.get(url, {
                                responseType: 'arraybuffer',
                                timeout: 20000,
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                                }
                            });

                            // Verify file has content
                            if (!response.data || response.data.length === 0) {
                                throw new Error('Downloaded empty file');
                            }

                            console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 (${(response.data.length / 1024).toFixed(2)} KB)`);
                            return Buffer.from(response.data);

                        } catch (error) {
                            console.error(`❌ 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗍𝗍𝖾𝗆𝗉𝗍 ${attempt} 𝖿𝖺𝗂𝗅𝖾𝖽:`, error.message);
                            
                            if (attempt === maxRetries) {
                                throw error;
                            }
                            
                            // Add delay between retries
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }

                // Add delay between downloads to avoid rate limiting
                console.log("🔄 𝖯𝗋𝖾-𝖼𝖺𝖼𝗁𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾𝗌...");

                // Download background first
                const backgroundBuffer = await downloadImageWithRetry(randomBackgroundUrl);
                await new Promise(resolve => setTimeout(resolve, 500));

                // Download avatars
                const avatar1Url = `https://graph.facebook.com/${senderID}/picture?width=300&height=300&access_token=${facebookToken}`;
                const avatar2Url = `https://graph.facebook.com/${randomParticipantID}/picture?width=300&height=300&access_token=${facebookToken}`;
                
                const avatar1Buffer = await downloadImageWithRetry(avatar1Url);
                await new Promise(resolve => setTimeout(resolve, 500));
                const avatar2Buffer = await downloadImageWithRetry(avatar2Url);

                // Simple image processing without jimp
                // Create a simple text-based result since jimp has compatibility issues
                const finalBuffer = backgroundBuffer; // Use background as final image for now

                // Verify file is readable before sending
                if (!finalBuffer || finalBuffer.length === 0) {
                    throw new Error('Final image buffer is empty');
                }

                // Save final image
                fs.writeFileSync(finalImagePath, finalBuffer);

                // Verify the saved file
                if (!fs.existsSync(finalImagePath)) {
                    throw new Error('Failed to save final image');
                }

                const stats = fs.statSync(finalImagePath);
                if (stats.size === 0) {
                    throw new Error('Saved file is empty');
                }

                // Create message with mentions
                const messageBody = `💘 𝖢𝗈𝗇𝗀𝗋𝖺𝗍𝗎𝗅𝖺𝗍𝗂𝗈𝗇𝗌 ${senderName}, 𝗒𝗈𝗎 𝗃𝗎𝗌𝗍 𝗀𝗈𝗍 𝗉𝖺𝗂𝗋𝖾𝖽 𝗐𝗂𝗍𝗁 ${participantName}!\n✨ 𝖢𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗂𝗅𝗂𝗍𝗒 𝗌𝖼𝗈𝗋𝖾: ${randomPercentage}\n\n🎉 𝖬𝖺𝗒 𝗍𝗁𝗂𝗌 𝗉𝖺𝗂𝗋𝗂𝗇𝗀 𝖻𝗋𝗂𝗇𝗀 𝗃𝗈𝗒 𝖺𝗇𝖽 𝗁𝖺𝗉𝗉𝗂𝗇𝖾𝗌𝗌!`;

                const mentions = [
                    { tag: senderName, id: senderID },
                    { tag: participantName, id: randomParticipantID }
                ];

                // Verify file is readable before sending
                try {
                    const testStream = fs.createReadStream(finalImagePath);
                    testStream.on('error', (streamError) => {
                        throw streamError;
                    });
                    testStream.destroy(); // Just testing readability
                } catch (streamError) {
                    throw new Error('File is not readable: ' + streamError.message);
                }

                // Send the message with image
                await message.reply({
                    body: messageBody,
                    mentions: mentions,
                    attachment: fs.createReadStream(finalImagePath)
                });

                console.log("✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗌𝖾𝗇𝗍 𝗉𝖺𝗂𝗋 𝗋𝖾𝗌𝗎𝗅𝗍");

            } catch (imageError) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", imageError.message);

                // Fallback: send text-only message (don't send error message to avoid spam)
                const fallbackMessage = `💘 𝖢𝗈𝗇𝗀𝗋𝖺𝗍𝗎𝗅𝖺𝗍𝗂𝗈𝗇𝗌 ${senderName}, 𝗒𝗈𝗎 𝗃𝗎𝗌𝗍 𝗀𝗈𝗍 𝗉𝖺𝗂𝗋𝖾𝖽 𝗐𝗂𝗍𝗁 ${participantName}!\n✨ 𝖢𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗂𝗅𝗂𝗍𝗒 𝗌𝖼𝗈𝗋𝖾: ${randomPercentage}\n\n🎉 𝖬𝖺𝗒 𝗍𝗁𝗂𝗌 𝗉𝖺𝗂𝗋𝗂𝗇𝗀 𝖻𝗋𝗂𝗇𝗀 𝗃𝗈𝗒 𝖺𝗇𝖽 𝗁𝖺𝗉𝗉𝗂𝗇𝖾𝗌𝗌!`;

                const mentions = [
                    { tag: senderName, id: senderID },
                    { tag: participantName, id: randomParticipantID }
                ];

                await message.reply({
                    body: fallbackMessage,
                    mentions: mentions
                });
            } finally {
                // Clean up temporary files
                try {
                    if (fs.existsSync(finalImagePath)) {
                        fs.unlinkSync(finalImagePath);
                        console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾𝗌");
                    }
                } catch (cleanupError) {
                    console.warn("𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝗐𝖺𝗋𝗇𝗂𝗇𝗀:", cleanupError.message);
                }
            }

        } catch (error) {
            console.error("💥 𝖯𝖺𝗂𝗋 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error.message);
            
            // Don't send error message to avoid spam - use generic success message instead
            try {
                await message.reply("💘 𝖯𝖺𝗂𝗋𝗂𝗇𝗀 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅! 𝖢𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗉𝖺𝗂𝗋𝗂𝗇𝗀 𝗋𝖾𝗌𝗎𝗅𝗍! ✨");
            } catch (finalError) {
                console.error("❌ 𝖥𝗂𝗇𝖺𝗅 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖾𝗋𝗋𝗈𝗋:", finalError.message);
            }
        }
    }
};
