const axios = require('axios');
const fs = require('fs-extra');
const jimp = require('jimp');

module.exports = {
    config: {
        name: "hackv2",
        aliases: ["hackprank", "fakehack"],
        version: "1.0.4",
        author: "Asif Mahmud",
        countDown: 0,
        role: 0,
        category: "group",
        shortDescription: {
            en: "Prank friends with hack simulation"
        },
        longDescription: {
            en: "Simulates a hacking process for pranking friends"
        },
        guide: {
            en: "{p}hackv2 @mention"
        }
    },

    onStart: async function ({ event, message, usersData, api }) {
        try {
            const cachePath = __dirname + "/cache";
            if (!fs.existsSync(cachePath)) {
                fs.mkdirSync(cachePath, { recursive: true });
            }

            const pathImg = cachePath + "/background_" + Date.now() + ".png";
            const pathAvt1 = cachePath + "/Avtmot_" + Date.now() + ".png";
            
            // Get mentioned user or use sender
            const mentionID = Object.keys(event.mentions)[0] || event.senderID;
            
            // Get user info
            const userInfo = await usersData.get(mentionID);
            const name = userInfo.name || "Unknown User";
            
            const backgroundUrl = "https://drive.google.com/uc?id=1RwJnJTzUmwOmP3N_mZzxtp63wbvt9bLZ";
            const avatarUrl = `https://graph.facebook.com/${mentionID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

            // Show processing message
            const processingMsg = await message.reply("🔄 Initializing hack sequence...");

            try {
                // Download avatar
                const avatarResponse = await axios.get(avatarUrl, { 
                    responseType: "arraybuffer",
                    timeout: 30000
                });
                fs.writeFileSync(pathAvt1, Buffer.from(avatarResponse.data, "binary"));

                // Download background
                const bgResponse = await axios.get(backgroundUrl, { 
                    responseType: "arraybuffer",
                    timeout: 30000
                });
                fs.writeFileSync(pathImg, Buffer.from(bgResponse.data, "binary"));

                // Load images with jimp
                const baseImage = await jimp.read(pathImg);
                const avatarImage = await jimp.read(pathAvt1);

                // Resize avatar to fit the template
                avatarImage.resize(100, 100);

                // Composite avatar onto background at the correct position
                baseImage.composite(avatarImage, 83, 437);

                // Save the final image
                await baseImage.writeAsync(pathImg);

                // Verify the image was created
                if (!fs.existsSync(pathImg)) {
                    throw new Error("Failed to create final image");
                }

                const stats = fs.statSync(pathImg);
                if (stats.size === 0) {
                    throw new Error("Final image is empty");
                }

                // Send the result
                await message.reply({
                    body: `✅ Successfully Hacked This User! My Lord, Please Check Your Inbox. 💌\n\n🎯 Target: ${name}\n🆔 User ID: ${mentionID}`,
                    attachment: fs.createReadStream(pathImg)
                });

                // Clean up processing message
                try {
                    if (processingMsg && processingMsg.messageID) {
                        await api.unsendMessage(processingMsg.messageID);
                    }
                } catch (unsendError) {
                    // Ignore unsend errors
                }

            } catch (imageError) {
                console.error("Image processing error:", imageError);
                
                // Fallback: Send text-only response
                await message.reply({
                    body: `✅ Successfully Hacked This User! 💻\n\n🎯 Target: ${name}\n🆔 User ID: ${mentionID}\n\n📧 Data extraction complete!\n🔓 Security bypassed!\n💾 Information retrieved!`
                });
            }

            // Clean up temporary files
            try {
                if (fs.existsSync(pathAvt1)) {
                    fs.unlinkSync(pathAvt1);
                }
                if (fs.existsSync(pathImg)) {
                    fs.unlinkSync(pathImg);
                }
            } catch (cleanupError) {
                console.error("Cleanup error:", cleanupError);
            }

        } catch (error) {
            console.error("Hack module error:", error);
            
            let errorMessage = "❌ Hack failed! Please try again later.";
            
            if (error.message.includes("timeout")) {
                errorMessage = "❌ Hack timeout! Target system is slow to respond.";
            } else if (error.message.includes("ENOTFOUND")) {
                errorMessage = "❌ Network connection lost during hack!";
            } else if (error.message.includes("404")) {
                errorMessage = "❌ Target profile not found!";
            }
            
            await message.reply(errorMessage);
        }
    }
};
