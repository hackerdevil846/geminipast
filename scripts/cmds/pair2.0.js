const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require("path");

module.exports = {
    config: {
        name: "pair2.0",
        aliases: [],
        version: "1.0.0",
        role: 0,
        author: "Asif Mahmud",
        shortDescription: {
            en: "💑 Pair Matching Game"
        },
        longDescription: {
            en: "Matchmaking game that pairs you with another user in the group"
        },
        category: "fun",
        guide: {
            en: "{p}pair2.0"
        },
        countDown: 5,
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "canvas": "",
            "path": ""
        }
    },

    onStart: async function ({ message, event, usersData, threadsData }) {
        let tempFiles = [];
        
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("canvas");
                require("path");
            } catch (e) {
                return message.reply("❌ Missing dependencies. Please install: axios, fs-extra, canvas, and path.");
            }

            // Define paths
            const cacheDir = path.join(__dirname, "cache");
            const pathImg = path.join(cacheDir, `pair_bg_${Date.now()}.png`);
            const pathAvt1 = path.join(cacheDir, `pair_avt1_${Date.now()}.png`);
            const pathAvt2 = path.join(cacheDir, `pair_avt2_${Date.now()}.png`);
            const resultPath = path.join(cacheDir, `pair_result_${Date.now()}.png`);
            
            tempFiles = [pathImg, pathAvt1, pathAvt2, resultPath];
            
            // Create cache directory if it doesn't exist
            await fs.ensureDir(cacheDir);

            // Get sender info
            const id1 = event.senderID;
            let name1;
            try {
                name1 = await usersData.getName(id1);
                if (!name1 || name1 === "Unknown") {
                    name1 = "User";
                }
            } catch (error) {
                name1 = "User";
            }
            
            // Get thread info
            let allUsers = [];
            try {
                const ThreadInfo = await threadsData.get(event.threadID);
                allUsers = ThreadInfo.members || [];
            } catch (error) {
                console.error("Error getting thread info:", error);
                return message.reply("❌ Cannot access group members. Please try again.");
            }
            
            // Filter out bot and sender
            const botID = global.utils?.getBotID?.() || "0";
            let candidates = allUsers.filter(u => 
                u.userID !== id1 && 
                u.userID !== botID &&
                u.userID && 
                u.userID !== "undefined"
            );

            // If no candidates found, try to get at least one user
            if (candidates.length === 0) {
                // Try to get any user from the thread except sender and bot
                for (let member of allUsers) {
                    if (member.userID && member.userID !== id1 && member.userID !== botID) {
                        candidates.push(member);
                        break;
                    }
                }
            }

            if (candidates.length === 0) {
                return message.reply("😢 No suitable match found in this group!");
            }
            
            // Select random match
            const selected = candidates[Math.floor(Math.random() * candidates.length)];
            const id2 = selected.userID;
            let name2 = selected.name;
            
            if (!name2 || name2 === "Unknown") {
                try {
                    name2 = await usersData.getName(id2);
                } catch (error) {
                    name2 = "Partner";
                }
            }

            // Generate match percentage
            let percentage;
            const randomVal = Math.random();
            if (randomVal > 0.95) {
                percentage = ["0", "-1", "99.99", "101", "0.01"][Math.floor(Math.random() * 5)];
            } else if (randomVal > 0.85) {
                percentage = Math.floor(Math.random() * 30) + 70; // 70-99%
            } else {
                percentage = Math.floor(Math.random() * 70) + 1; // 1-70%
            }

            // Background images
            const backgrounds = [
                "https://i.postimg.cc/wjJ29HRB/background1.png",
                "https://i.postimg.cc/zf4Pnshv/background2.png",
                "https://i.postimg.cc/5tXRQ46D/background3.png"
            ];
            const bgUrl = backgrounds[Math.floor(Math.random() * backgrounds.length)];
            
            // Download images with error handling
            const downloadImage = async (url, filePath) => {
                try {
                    const response = await axios.get(url, { 
                        responseType: "arraybuffer",
                        timeout: 30000 
                    });
                    await fs.writeFile(filePath, Buffer.from(response.data));
                    return true;
                } catch (error) {
                    console.error(`Download failed for ${url}:`, error.message);
                    return false;
                }
            };

            // Download all images
            const downloadResults = await Promise.all([
                downloadImage(`https://graph.facebook.com/${id1}/picture?width=500&height=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, pathAvt1),
                downloadImage(`https://graph.facebook.com/${id2}/picture?width=500&height=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, pathAvt2),
                downloadImage(bgUrl, pathImg)
            ]);

            // Check if all downloads succeeded
            if (!downloadResults.every(result => result)) {
                return message.reply("❌ Failed to download images. Please try again.");
            }

            // Load images
            let baseImage, avt1, avt2;
            try {
                baseImage = await loadImage(pathImg);
                avt1 = await loadImage(pathAvt1);
                avt2 = await loadImage(pathAvt2);
            } catch (error) {
                console.error("Error loading images:", error);
                return message.reply("❌ Error processing images. Please try again.");
            }

            // Create canvas
            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");

            // Draw background
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

            // Draw circular avatars
            this.drawCircularImage(ctx, avt1, 100, 150, 300, 300);
            this.drawCircularImage(ctx, avt2, 900, 150, 300, 300);

            // Add names with bold sans-serif style
            ctx.font = "bold 40px Arial";
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            // Truncate long names
            const displayName1 = this.truncateText(name1, 15);
            const displayName2 = this.truncateText(name2, 15);

            ctx.fillText(displayName1, 250, 500);
            ctx.fillText(displayName2, 1050, 500);

            // Add percentage with stylish font
            ctx.font = "bold 80px Arial";
            
            // Color based on percentage
            if (percentage > 70) {
                ctx.fillStyle = "#FF1493"; // Pink for high matches
            } else if (percentage > 40) {
                ctx.fillStyle = "#FFA500"; // Orange for medium matches
            } else {
                ctx.fillStyle = "#FF4444"; // Red for low matches
            }
            
            ctx.fillText(`${percentage}%`, 650, 350);

            // Add match message
            ctx.font = "bold 30px Arial";
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText("Match Percentage", 650, 400);

            // Save result
            const buffer = canvas.toBuffer("image/png");
            await fs.writeFile(resultPath, buffer);

            // Verify the file was created
            if (!fs.existsSync(resultPath)) {
                throw new Error("Failed to create result image");
            }

            // Send message
            await message.reply({
                body: `🎊 Congratulations ${name1}! You are paired with ${name2}\n💝 Your Compatibility: ${percentage}%`,
                mentions: [{ tag: name2, id: id2 }],
                attachment: fs.createReadStream(resultPath)
            });

        } catch (error) {
            console.error("Pair command error:", error);
            await message.reply("❌ An error occurred. Please try again later!");
        } finally {
            // Clean up temporary files
            for (const filePath of tempFiles) {
                try {
                    if (fs.existsSync(filePath)) {
                        await fs.unlink(filePath);
                    }
                } catch (cleanupError) {
                    console.warn(`Failed to delete ${filePath}:`, cleanupError.message);
                }
            }
        }
    },

    // Helper function to draw circular images
    drawCircularImage(ctx, image, x, y, width, height) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + width/2, y + height/2, width/2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(image, x, y, width, height);
        ctx.restore();
    },

    // Helper function to truncate long text
    truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength - 3) + "...";
        }
        return text;
    }
};
