const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "fampair",
        aliases: [],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "love",
        shortDescription: {
            en: "👨‍👩‍👧‍👦 Family Pair Command for Group Members"
        },
        longDescription: {
            en: "👨‍👩‍👧‍👦 Creates a family pair image with group members"
        },
        guide: {
            en: "{p}fampair"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "jimp": ""
        }
    },

    onLoad: async function() {
        try {
            console.log("🔄 Initializing Fampair Command...");
            
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("jimp");
            } catch (e) {
                console.error("❌ Missing dependencies. Please install: axios, fs-extra, and jimp.");
                return;
            }

            const cacheDir = path.resolve(__dirname, "cache");
            const canvasDir = path.resolve(cacheDir, "canvas");
            
            // Create directories if they don't exist
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
                console.log("✅ Created cache directory");
            }
            
            if (!fs.existsSync(canvasDir)) {
                fs.mkdirSync(canvasDir, { recursive: true });
                console.log("✅ Created canvas directory");
            }
            
            // Define paths for primary and backup background images
            const primaryBgPath = path.resolve(canvasDir, "fampair_bg.png");
            const backupBgPath = path.resolve(canvasDir, "fampairbackupimage.jpg"); // Path for your local backup image

            // --- Primary background image download (from Imgur) ---
            // Only attempt to download if primary image doesn't exist locally
            if (!fs.existsSync(primaryBgPath)) {
                try {
                    console.log("📥 Downloading primary background image from Imgur...");
                    const response = await axios.get("https://i.imgur.com/D35mTwa.jpg", {
                        responseType: 'arraybuffer',
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    
                    if (response.data && response.data.length > 0) {
                        fs.writeFileSync(primaryBgPath, Buffer.from(response.data));
                        console.log("✅ Primary background image downloaded successfully.");
                    } else {
                        throw new Error("Empty response data from primary URL.");
                    }
                } catch (error) {
                    console.error("❌ Primary background image download failed:", error.message);
                    console.log("⚠️ Primary background will be loaded from local files or fall back to solid color during execution.");
                }
            } else {
                console.log("✅ Primary background image already exists locally.");
            }

            // --- Ensure backup image exists (for robustness) ---
            // This part ensures a fallback exists. In a real scenario, the user would place their image.
            // For a "full proof" code, we make sure *some* image is there if the specified path is empty.
            if (!fs.existsSync(backupBgPath)) {
                console.log("📝 Backup image not found at specified path. Creating a dummy backup for robustness.");
                try {
                    const dummyBackup = await jimp.read("https://i.imgur.com/D35mTwa.jpg"); // Use the same base image as a dummy backup
                    await dummyBackup.writeAsync(backupBgPath);
                    console.log("✅ Dummy backup image created at:", backupBgPath);
                } catch (dummyError) {
                    console.error("❌ Failed to create dummy backup image:", dummyError.message);
                }
            } else {
                console.log("✅ Backup background image already exists at:", backupBgPath);
            }
            
            console.log("✅ Fampair command initialized successfully.");
            
        } catch (error) {
            console.error("💥 Fampair onLoad Error:", error);
        }
    },

    onStart: async function({ api, event, usersData, message }) {
        let generatedImagePath = null;
        
        try {
            console.log("🚀 Starting Fampair Command...");
            
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("jimp");
            } catch (e) {
                return message.reply("❌ Missing dependencies. Please install: axios, fs-extra, and jimp.");
            }

            const { threadID, senderID } = event;
            
            // Compatibility percentages
            const compatibilityLevels = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', "0%", "48%"];
            const randomCompatibility = compatibilityLevels[Math.floor(Math.random() * compatibilityLevels.length)];
            
            // Get sender info
            let senderName = "Unknown User";
            try {
                const userInfo = await api.getUserInfo(senderID);
                senderName = userInfo[senderID]?.name || "Unknown User";
                console.log(`✅ Got sender info: ${senderName}`);
            } catch (userError) {
                console.error("❌ Failed to get user info:", userError);
                // Continue with default name
            }
            
            // Get thread info
            let participantIDs = [];
            try {
                const threadInfo = await api.getThreadInfo(threadID);
                participantIDs = threadInfo.participantIDs?.filter(id => id !== senderID) || [];
                console.log(`✅ Got thread info with ${participantIDs.length} participants.`);
            } catch (threadError) {
                console.error("❌ Failed to get thread info:", threadError);
                return message.reply("❌ Failed to get group information. Please try again.");
            }
            
            // Check if enough participants
            if (participantIDs.length < 2) {
                return message.reply("👥 Group needs at least 2 other members to use this command!");
            }
            
            // Select two random participants
            const firstIndex = Math.floor(Math.random() * participantIDs.length);
            let secondIndex;
            do {
                secondIndex = Math.floor(Math.random() * participantIDs.length);
            } while (secondIndex === firstIndex);
            
            const user1 = participantIDs[firstIndex];
            const user2 = participantIDs[secondIndex];
            
            // Get user names
            let name1 = "Unknown", name2 = "Unknown";
            try {
                const user1Data = await usersData.get(user1);
                const user2Data = await usersData.get(user2);
                name1 = user1Data?.name || "Unknown";
                name2 = user2Data?.name || "Unknown";
                console.log(`✅ Got user names: ${name1} and ${name2}`);
            } catch (nameError) {
                console.error("❌ Failed to get user names:", nameError);
                // Continue with default names
            }
            
            // Send processing message
            const processingMsg = await message.reply("🔄 Creating family pair image... Please wait ⏳");
            
            // Generate the family pair image
            try {
                generatedImagePath = await this.makeImage({ 
                    one: senderID, 
                    two: user1, 
                    three: user2 
                });
                
                if (!generatedImagePath || !fs.existsSync(generatedImagePath)) {
                    throw new Error("Failed to create image file, path is invalid or file doesn't exist.");
                }
                
                console.log("✅ Family pair image created successfully.");
                
            } catch (imageError) {
                console.error("❌ Failed to create image:", imageError);
                await message.unsendMessage(processingMsg.messageID);
                return message.reply("❌ Failed to create family pair image. Please try again later.");
            }
            
            // Send the result
            await message.reply({ 
                body: `👨‍👩‍👧‍👦 𝐅𝐚𝐦𝐢𝐥𝐲 𝐏𝐚𝐢𝐫 𝐑𝐞𝐬𝐮𝐥𝐭\n\n✨ ${senderName}, you have successfully created a family pair with ${name1} and ${name2}!\n💞 Your Family Compatibility: ${randomCompatibility}\n\nMay your bond grow stronger! 💝`,
                mentions: [
                    { tag: senderName, id: senderID },
                    { tag: name1, id: user1 },
                    { tag: name2, id: user2 }
                ], 
                attachment: fs.createReadStream(generatedImagePath) 
            });

            // Remove processing message
            await message.unsendMessage(processingMsg.messageID);
            console.log("✅ Successfully sent family pair result.");
            
        } catch (error) {
            console.error("💥 Fampair Command Error:", error);
            await message.reply("❌ An unexpected error occurred while processing your request. Please try again later.");
        } finally {
            // Cleanup generated image file
            if (generatedImagePath && fs.existsSync(generatedImagePath)) {
                try {
                    fs.unlinkSync(generatedImagePath);
                    console.log("🧹 Cleaned up generated image file.");
                } catch (cleanupError) {
                    console.warn("⚠️ Failed to clean up image file:", cleanupError.message);
                }
            }
        }
    },

    makeImage: async function({ one, two, three }) {
        const canvasDir = path.resolve(__dirname, "cache", "canvas");
        const outputPath = path.join(canvasDir, `fampair_${one}_${two}_${three}_${Date.now()}.png`);
        
        console.log("🎨 Creating family pair image...");
        
        let background;
        const primaryBgPath = path.join(canvasDir, "fampair_bg.png"); 
        const backupBgPath = path.join(canvasDir, "fampairbackupimage.jpg"); 
        
        try {
            // Attempt 1: Load primary background image from local cache
            if (fs.existsSync(primaryBgPath)) {
                background = await jimp.read(primaryBgPath);
                console.log("✅ Loaded primary background image from local cache.");
            } else {
                console.log("⚠️ Primary background image not found locally.");
                // Attempt 2: Load backup background image from local path
                if (fs.existsSync(backupBgPath)) {
                    background = await jimp.read(backupBgPath);
                    console.log("✅ Loaded backup background image from local file system.");
                } else {
                    console.log("❌ Neither primary nor backup background image found locally. Falling back to solid color.");
                    // Final fallback: Create a simple solid color background
                    background = await jimp.create(600, 400, 0x34495Eff); 
                }
            }
        } catch (bgError) {
            console.error("❌ Error loading any background image from local paths:", bgError.message);
            console.log("⚠️ Falling back to solid color background due to read error.");
            // Ultimate fallback if reading existing files also fails
            background = await jimp.create(600, 400, 0x34495Eff); 
        }
        
        // Download and process avatars
        const avatarPaths = [];
        // The order here matches the order of positions in the 'positions' array below
        // [Left Parent, Right Parent, Child]
        const users = [one, two, three]; // Assuming 'one' is sender, 'two' is user1, 'three' is user2, map to positions as desired

        // Let's explicitly map them to the intended positions for clarity
        // Assuming:
        // users[0] -> one (sender) -> Left Parent
        // users[1] -> two (random user 1) -> Right Parent
        // users[2] -> three (random user 2) -> Child
        // If your intent for 'one', 'two', 'three' mapping to the image characters differs,
        // you'll need to adjust the order in the 'users' array or the 'positions' array.
        
        for (let i = 0; i < users.length; i++) {
            const avatarPath = path.join(canvasDir, `avatar_${users[i]}_${Date.now()}.png`);
            
            try {
                console.log(`📥 Downloading avatar for user ${users[i]}`);
                // Facebook Graph API for profile picture
                const avatarUrl = `https://graph.facebook.com/${users[i]}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                
                const response = await axios.get(avatarUrl, { 
                    responseType: 'arraybuffer',
                    timeout: 15000, // 15 seconds timeout for avatar download
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                if (response.data && response.data.length > 0) {
                    fs.writeFileSync(avatarPath, Buffer.from(response.data));
                    avatarPaths.push(avatarPath);
                    console.log(`✅ Downloaded avatar ${i + 1} for user ${users[i]}.`);
                } else {
                    throw new Error("Empty avatar data received.");
                }
                
            } catch (error) {
                console.error(`❌ Failed to download avatar for user ${users[i]}:`, error.message);
                
                // Create fallback avatar if download fails
                try {
                    const colors = [0xE74C3Cff, 0x3498DBff, 0x2ECC71ff]; // Red, Blue, Green for fallbacks
                    const fallbackAvatar = await jimp.create(512, 512, colors[i] || 0x95A5A6ff); // Grey if more than 3 users
                    await fallbackAvatar.writeAsync(avatarPath);
                    avatarPaths.push(avatarPath);
                    console.log(`✅ Created fallback avatar ${i + 1} for user ${users[i]}.`);
                } catch (fallbackError) {
                    console.error(`❌ Failed to create fallback avatar for user ${users[i]}:`, fallbackError.message);
                    // If even fallback avatar creation fails, this user won't have an avatar.
                    // The main composite loop will handle missing files.
                }
            }
        }
        
        try {
            // Process and composite avatars onto the background
            const avatarSize = 90; // Size of the circular avatars to fit the template circles
            // These positions are carefully chosen to align with the circles in the base image.
            const positions = [
                { x: 191, y: 153 },  // Position for the LEFT PARENT avatar
                { x: 304, y: 78 },   // Position for the RIGHT PARENT avatar
                { x: 260, y: 31 }    // Position for the CHILD avatar
            ];
            
            for (let i = 0; i < avatarPaths.length; i++) {
                if (fs.existsSync(avatarPaths[i])) {
                    try {
                        const avatar = await jimp.read(avatarPaths[i]);
                        avatar.resize(avatarSize, avatarSize);
                        
                        // Create a circular mask for the avatar
                        const circleMask = await jimp.create(avatarSize, avatarSize, 0x00000000); // Transparent background for the mask
                        const radius = avatarSize / 2;
                        
                        avatar.scan(0, 0, avatar.bitmap.width, avatar.bitmap.height, function(x, y, idx) {
                            const dx = x - radius;
                            const dy = y - radius;
                            if (dx * dx + dy * dy <= radius * radius) {
                                // Copy pixel data if it's within the circle
                                const r = this.bitmap.data[idx + 0];
                                const g = this.bitmap.data[idx + 1];
                                const b = this.bitmap.data[idx + 2];
                                const a = this.bitmap.data[idx + 3];
                                circleMask.setPixelColor(jimp.rgbaToInt(r, g, b, a), x, y);
                            }
                        });
                        
                        // Composite the circular avatar onto the background at the specified position
                        background.composite(circleMask, positions[i].x, positions[i].y);
                        console.log(`✅ Composited avatar ${i + 1} onto the background.`);
                        
                    } catch (avatarProcessError) {
                        console.error(`❌ Error processing or compositing avatar ${i + 1}:`, avatarProcessError.message);
                    }
                } else {
                    console.warn(`⚠️ Avatar file not found for user ${users[i]} at ${avatarPaths[i]}. Skipping composition.`);
                }
            }
            
            // Save the final image to the output path
            await background.writeAsync(outputPath);
            
            // Verify the image file was successfully created and is not empty
            if (fs.existsSync(outputPath)) {
                const stats = fs.statSync(outputPath);
                if (stats.size > 0) {
                    console.log("✅ Final family pair image created successfully:", outputPath);
                    return outputPath; // Return the path to the created image
                } else {
                    throw new Error("Created output image file is empty.");
                }
            } else {
                throw new Error("Failed to create output image file (file not found after write attempt).");
            }
            
        } catch (compositeError) {
            console.error("❌ An error occurred during image compositing or finalization:", compositeError);
            throw compositeError; // Re-throw to be caught by onStart's error handler
        } finally {
            // Cleanup temporary avatar files to prevent disk clutter
            avatarPaths.forEach(avatarPath => {
                try {
                    if (fs.existsSync(avatarPath)) {
                        fs.unlinkSync(avatarPath);
                        console.log(`🧹 Cleaned up temporary avatar file: ${avatarPath}`);
                    }
                } catch (cleanupError) {
                    console.warn(`⚠️ Failed to clean up temporary avatar file ${avatarPath}:`, cleanupError.message);
                }
            });
        }
    }
};
