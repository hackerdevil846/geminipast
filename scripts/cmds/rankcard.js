const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");
const request = require("node-superfetch");
const Canvas = require("canvas");

module.exports = {
    config: {
        name: "rankcard",
        aliases: [],
        version: "2.2.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "group",
        shortDescription: {
            en: "🌟 View stylish game-style rank cards with animated effects"
        },
        longDescription: {
            en: "🌟 View beautiful animated rank cards with neon effects, glow auras, and game-style progression for group members"
        },
        guide: {
            en: "{p}rankcard [user] or {p}rankcard @mention"
        },
        dependencies: {
            "fs-extra": "",
            "path": "",
            "jimp": "",
            "node-superfetch": "",
            "canvas": ""
        }
    },

    onLoad: async function() {
        try {
            const { downloadFile } = global.utils;
            const __root = path.resolve(__dirname, "cache");

            // Create necessary directories
            if (!fs.existsSync(__root)) 
                fs.mkdirSync(__root, { recursive: true });
            if (!fs.existsSync(path.join(__root, "customrank"))) 
                fs.mkdirSync(path.join(__root, "customrank"), { recursive: true });

            const files = [
                { 
                    url: "https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/fonts/regular-font.ttf", 
                    path: "regular-font.ttf" 
                },
                { 
                    url: "https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/fonts/bold-font.ttf", 
                    path: "bold-font.ttf" 
                },
                { 
                    url: "https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/rank_card/rankcard.png", 
                    path: "rankcard.png" 
                }
            ];

            for (const file of files) {
                const filePath = path.join(__root, file.path);
                if (!fs.existsSync(filePath)) {
                    try {
                        await downloadFile(file.url, filePath);
                        console.log(`✅ Downloaded ${file.path}`);
                    } catch (downloadError) {
                        console.error(`❌ Failed to download ${file.path}:`, downloadError);
                    }
                }
            }
        } catch (error) {
            console.error("❌ Error in onLoad:", error);
        }
    },

    onStart: async function({ event, api, args, usersData, currenciesData }) {
        try {
            // Check dependencies
            try {
                if (!fs || !path || !jimp || !request || !Canvas) {
                    throw new Error("Missing required dependencies");
                }
            } catch (err) {
                return api.sendMessage("❌ | Required dependencies are missing. Please install fs-extra, path, jimp, node-superfetch, and canvas.", event.threadID, event.messageID);
            }

            const { threadID, messageID, senderID, mentions } = event;
            
            // Get all users with exp data
            const dataAll = (await currenciesData.getAll()).filter(item => item.exp > 0);
            dataAll.sort((a, b) => b.exp - a.exp);

            // Determine target users
            let targetIDs;
            if (Object.keys(mentions).length > 0) {
                targetIDs = Object.keys(mentions);
            } else if (args[0] && args[0].toLowerCase() === "all") {
                targetIDs = dataAll.slice(0, 5).map(item => item.userID); // Limit to 5 users for "all"
            } else {
                targetIDs = [senderID];
            }

            for (const userID of targetIDs) {
                const rankIndex = dataAll.findIndex(item => item.userID == userID);
                if (rankIndex === -1) {
                    api.sendMessage(`❌ | User ${userID} not found in ranking system`, threadID, messageID);
                    continue;
                }

                const rank = rankIndex + 1;
                let userName;
                try {
                    const userInfo = await api.getUserInfo(userID);
                    userName = userInfo[userID]?.name || "Unknown User";
                } catch (error) {
                    userName = "Unknown User";
                }

                const pointInfo = await getInfo(userID, currenciesData);

                // Send processing message
                await api.sendMessage({
                    body: `🔄 Processing rank card for ${userName}...`,
                    mentions: [{
                        tag: userName,
                        id: userID
                    }]
                }, threadID, messageID);

                const timeStart = Date.now();

                try {
                    const pathRankCard = await makeRankCard({
                        id: userID,
                        name: userName,
                        rank,
                        ...pointInfo
                    });

                    if (!fs.existsSync(pathRankCard)) {
                        throw new Error("Failed to create rank card image");
                    }

                    await api.sendMessage({
                        body: `✨ 𝐑𝐀𝐍𝐊 𝐂𝐀𝐑𝐃 ✨\n👤 User: ${userName}\n🏆 Rank: #${rank}\n⭐ Level: ${pointInfo.level}\n⏱️ Generated in ${Date.now() - timeStart}ms`,
                        attachment: fs.createReadStream(pathRankCard),
                        mentions: [{
                            tag: userName,
                            id: userID
                        }]
                    }, threadID, async (error) => {
                        if (!error && fs.existsSync(pathRankCard)) {
                            fs.unlinkSync(pathRankCard);
                        }
                    });

                } catch (cardError) {
                    console.error("❌ Error creating rank card:", cardError);
                    api.sendMessage(`❌ Failed to create rank card for ${userName}`, threadID, messageID);
                }
            }
        } catch (error) {
            console.error("❌ Rankcard Command Error:", error);
            api.sendMessage("❌ | An error occurred while processing rank card. Please try again later.", event.threadID, event.messageID);
        }
    }
};

// EXP calculation functions
const expToLevel = (point) => {
    if (point < 0) return 0;
    return Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2);
};

const levelToExp = (level) => {
    if (level <= 0) return 0;
    return 3 * level * (level - 1);
};

// Circular avatar with error handling
async function circle(imageBuffer) {
    try {
        const image = await jimp.read(imageBuffer);
        image.circle();
        return await image.getBufferAsync("image/png");
    } catch (error) {
        console.error("❌ Error creating circular avatar:", error);
        // Return default avatar or original image
        return imageBuffer;
    }
}

// Get user info from currencies data
async function getInfo(uid, currenciesData) {
    try {
        const userData = await currenciesData.getData(uid);
        const point = userData?.exp || 0;
        const level = expToLevel(point);
        
        return {
            level,
            expCurrent: point - levelToExp(level),
            expNextLevel: levelToExp(level + 1) - levelToExp(level)
        };
    } catch (error) {
        console.error("❌ Error getting user info:", error);
        return {
            level: 1,
            expCurrent: 0,
            expNextLevel: 100
        };
    }
}

// Main rank card creation function
async function makeRankCard(data) {
    const { id, name, rank, level, expCurrent, expNextLevel } = data;
    const __root = path.resolve(__dirname, "cache");
    const PI = Math.PI;

    try {
        // Register fonts
        const regularFontPath = path.join(__root, "regular-font.ttf");
        const boldFontPath = path.join(__root, "bold-font.ttf");
        
        if (fs.existsSync(regularFontPath)) {
            Canvas.registerFont(regularFontPath, { 
                family: "Manrope", 
                weight: "regular", 
                style: "normal" 
            });
        }
        if (fs.existsSync(boldFontPath)) {
            Canvas.registerFont(boldFontPath, { 
                family: "Manrope", 
                weight: "bold", 
                style: "normal" 
            });
        }

        // Select appropriate background based on level
        const pathCustom = path.join(__root, "customrank");
        let dirImage = path.join(__root, "rankcard.png"); // Default background
        
        if (fs.existsSync(pathCustom)) {
            const customFiles = fs.readdirSync(pathCustom).filter(file => file.endsWith('.png'));
            for (const file of customFiles) {
                try {
                    const filename = file.replace('.png', '');
                    const [minStr, maxStr] = filename.split('-');
                    const min = parseInt(minStr);
                    const max = parseInt(maxStr || minStr);
                    
                    if (!isNaN(min) && level >= min && (isNaN(max) || level <= max)) {
                        dirImage = path.join(pathCustom, file);
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
        }

        // Load rank card background
        if (!fs.existsSync(dirImage)) {
            dirImage = path.join(__root, "rankcard.png");
        }
        
        const rankCard = await Canvas.loadImage(dirImage);
        const pathImg = path.join(__root, `rank_${id}_${Date.now()}.png`);
        
        // Calculate XP bar width
        let expWidth = expNextLevel > 0 ? (expCurrent * 610) / expNextLevel : 0;
        if (expWidth > 590.5) expWidth = 590.5;
        if (expWidth < 0) expWidth = 0;

        // Get user avatar
        let avatarBuffer;
        try {
            const avatarResponse = await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
            avatarBuffer = await circle(avatarResponse.body);
        } catch (avatarError) {
            console.error("❌ Error getting avatar:", avatarError);
            // Create a default avatar
            const defaultCanvas = Canvas.createCanvas(512, 512);
            const defaultCtx = defaultCanvas.getContext("2d");
            defaultCtx.fillStyle = "#4a4a4a";
            defaultCtx.fillRect(0, 0, 512, 512);
            defaultCtx.fillStyle = "#ffffff";
            defaultCtx.font = "bold 100px Arial";
            defaultCtx.textAlign = "center";
            defaultCtx.textBaseline = "middle";
            defaultCtx.fillText("?", 256, 256);
            avatarBuffer = defaultCanvas.toBuffer();
        }

        // Create main canvas
        const canvas = Canvas.createCanvas(1000, 282);
        const ctx = canvas.getContext("2d");

        // Draw background
        ctx.drawImage(rankCard, 0, 0, canvas.width, canvas.height);

        // Draw avatar with glow effect
        try {
            const avatarImage = await Canvas.loadImage(avatarBuffer);
            ctx.save();
            ctx.shadowColor = "rgba(0, 255, 255, 0.7)";
            ctx.shadowBlur = 25;
            ctx.drawImage(avatarImage, 70, 75, 150, 150);
            ctx.restore();
        } catch (avatarDrawError) {
            console.error("❌ Error drawing avatar:", avatarDrawError);
        }

        // Draw username with neon flicker effect
        const currentTime = Date.now();
        ctx.font = "bold 38px Manrope";
        ctx.textAlign = "start";
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "rgba(0, 191, 255, 0.8)";
        ctx.shadowBlur = 12 + Math.sin(currentTime/150) * 5;
        
        // Truncate long names
        let displayName = name;
        if (ctx.measureText(name).width > 500) {
            displayName = name.substring(0, 15) + "...";
        }
        ctx.fillText(displayName, 270, 164);
        ctx.shadowBlur = 0;

        // Draw level with gradient
        const levelGradient = ctx.createLinearGradient(800, 50, 900, 100);
        levelGradient.addColorStop(0, "#FF4500");
        levelGradient.addColorStop(1, "#FFD700");
        ctx.font = "bold 38px Manrope";
        ctx.fillStyle = levelGradient;
        ctx.textAlign = "end";
        ctx.fillText(level.toString(), 934 - 68, 82);

        // Draw "Lv." text
        ctx.fillStyle = "#FFD700";
        ctx.fillText("Lv.", 934 - 55 - ctx.measureText(level.toString()).width - 10, 82);

        // Draw rank with shiny effect
        ctx.font = "bold 39px Manrope";
        ctx.fillStyle = "#00BFFF";
        ctx.textAlign = "end";
        ctx.fillText(rank.toString(), 934 - 55 - ctx.measureText(level.toString()).width - 16 - ctx.measureText("Lv.").width - 25, 82);
        ctx.fillStyle = "#1E90FF";
        ctx.fillText("#", 934 - 55 - ctx.measureText(level.toString()).width - 16 - ctx.measureText("Lv.").width - 16 - ctx.measureText(rank.toString()).width - 16, 82);

        // Draw XP text with shimmer effect
        ctx.shadowColor = "rgba(255, 215, 0, 0.8)";
        ctx.shadowBlur = 12 + Math.sin(currentTime/120) * 6;
        ctx.font = "bold 40px Manrope";
        ctx.fillStyle = "#FFD700";
        ctx.textAlign = "start";
        ctx.fillText(expCurrent.toString(), 710, 164);
        ctx.fillStyle = "#FFA500";
        ctx.fillText("/ " + expNextLevel.toString(), 710 + ctx.measureText(expCurrent.toString()).width + 10, 164);
        ctx.shadowBlur = 0;

        // Draw XP progress bar
        if (expWidth > 0) {
            ctx.beginPath();
            const gradient = ctx.createLinearGradient(275, 200, 900, 220);
            gradient.addColorStop(0, "#FF8C00");
            gradient.addColorStop(1, "#FFD700");
            ctx.fillStyle = gradient;
            ctx.arc(257 + 18.5, 202, 18.5, 1.5 * PI, 0.5 * PI, true);
            ctx.fill();
            ctx.fillRect(257 + 18.5, 183.5, expWidth, 37.5);
            ctx.arc(257 + 18.5 + expWidth, 202, 18.75, 1.5 * PI, 0.5 * PI, false);
            ctx.fill();
        }

        // Draw decorative circle around avatar
        ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(145, 150, 85, 0, 2 * Math.PI);
        ctx.stroke();

        // Save the final image
        fs.writeFileSync(pathImg, canvas.toBuffer());
        return pathImg;

    } catch (error) {
        console.error("❌ Error in makeRankCard:", error);
        throw error;
    }
}
