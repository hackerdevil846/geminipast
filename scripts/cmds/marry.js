/**
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
    config: {
        name: "marry",
        aliases: [], 
        version: "3.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "romance",
        shortDescription: {
            en: "💍 Propose to someone with a marriage certificate"
        },
        longDescription: {
            en: "💍 Send a marriage proposal with a beautiful certificate"
        },
        guide: {
            en: "{p}marry [@mention]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function() {
        try {
            const canvasDir = path.join(__dirname, 'cache', 'canvas');
            const sourcePath = path.join(__dirname, 'marrywi.png');
            const bgPath = path.join(canvasDir, 'marry_bg.png');
            
            console.log("📁 Checking paths...");
            console.log("📁 Script directory:", __dirname);
            console.log("📁 Source file path:", sourcePath);
            console.log("📁 Cache file path:", bgPath);
            
            // Create directory if it doesn't exist
            if (!fs.existsSync(canvasDir)) {
                fs.mkdirSync(canvasDir, { recursive: true });
                console.log("✅ Created canvas directory");
            }
            
            // Check if source file exists
            if (fs.existsSync(sourcePath)) {
                console.log("✅ Source file found:", sourcePath);
                console.log("📊 File size:", (fs.statSync(sourcePath).size / 1024).toFixed(2) + " KB");
                
                // Copy template if it doesn't exist in cache
                if (!fs.existsSync(bgPath)) {
                    fs.copyFileSync(sourcePath, bgPath);
                    console.log("✅ Copied marriage template to cache");
                    
                    // Verify copy was successful
                    if (fs.existsSync(bgPath)) {
                        console.log("✅ Cache file verified:", (fs.statSync(bgPath).size / 1024).toFixed(2) + " KB");
                    } else {
                        console.error("❌ Copy failed - cache file not created");
                    }
                } else {
                    console.log("✅ Marriage template already exists in cache");
                    console.log("📊 Cache file size:", (fs.statSync(bgPath).size / 1024).toFixed(2) + " KB");
                }
            } else {
                console.error("❌ marrywi.png not found in script directory!");
                console.log("🔍 Available files in script directory:");
                try {
                    const files = fs.readdirSync(__dirname);
                    const imageFiles = files.filter(file => 
                        file.endsWith('.png') || 
                        file.endsWith('.jpg') || 
                        file.endsWith('.jpeg')
                    );
                    console.log("📸 Image files found:", imageFiles);
                    
                    // Create fallback template
                    console.log("🔄 Creating fallback template...");
                    await this.createFallbackTemplate(sourcePath);
                    if (fs.existsSync(sourcePath)) {
                        fs.copyFileSync(sourcePath, bgPath);
                        console.log("✅ Created and cached fallback template");
                    }
                } catch (readError) {
                    console.error("❌ Cannot read script directory:", readError.message);
                }
            }
        } catch (error) {
            console.error("❌ onStart Error:", error.message);
        }
    },

    createFallbackTemplate: async function(outputPath) {
        try {
            const jimp = require("jimp");
            // Create a simple fallback image
            const image = new jimp(400, 200, 0xFFB6C1FF); // Pink background
            const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
            
            image.print(font, 50, 50, "💍 Marriage");
            image.print(font, 50, 90, "Certificate");
            image.print(font, 50, 130, "Template");
            
            await image.writeAsync(outputPath);
            console.log("✅ Created fallback template");
        } catch (error) {
            console.error("❌ Could not create fallback template:", error.message);
            // If even fallback fails, create empty file to prevent errors
            fs.writeFileSync(outputPath, Buffer.from([]));
        }
    },

    sendTextProposal: async function(message, senderName, targetName) {
        const proposals = [
            `💍 **Marriage Proposal** 💍\n\n👰 ${senderName} proposes to 🤵 ${targetName}\n\n"Will you marry me? 💕"`,
            `💞 **Official Proposal** 💞\n\n${senderName} 💍 ${targetName}\n\n"I choose you today and forever! 💍"`,
            `🎊 **Marriage Certificate** 🎊\n\n👰 ${senderName} 🤵 ${targetName}\n\nJoined in love forever! 💕`
        ];
        
        const randomProposal = proposals[Math.floor(Math.random() * proposals.length)];
        await message.reply(randomProposal);
    },

    onChat: async function({ message, event, args, usersData, api }) {
        let outputPath = null;
        let avatar1Path = null;
        let avatar2Path = null;
        
        try {
            // Dependency check - FIXED JIMP LOADING
            let jimp;
            try {
                jimp = require("jimp");
            } catch (e) {
                console.error("❌ Jimp not available:", e.message);
                // Fallback to text proposal
                const mentionedUsers = Object.keys(event.mentions || {});
                if (mentionedUsers.length === 0) {
                    await message.reply("💍 Please tag someone to propose marriage! Example: /marry @username");
                    return;
                }
                
                const targetID = mentionedUsers[0];
                let senderName = "You";
                let targetName = "Your Love";
                
                try {
                    if (usersData && typeof usersData.getName === 'function') {
                        senderName = await usersData.getName(event.senderID) || senderName;
                        targetName = await usersData.getName(targetID) || targetName;
                    } else {
                        senderName = event.mentions[event.senderID]?.replace('@', '') || senderName;
                        targetName = event.mentions[targetID]?.replace('@', '') || targetName;
                    }
                } catch (nameError) {
                    console.error("❌ Error getting names:", nameError.message);
                }
                
                await this.sendTextProposal(message, senderName, targetName);
                return;
            }

            const { senderID, mentions } = event;

            // Check if someone is mentioned
            const mentionedUsers = Object.keys(mentions || {});
            if (mentionedUsers.length === 0) {
                await message.reply("💍 Please tag someone to propose marriage! Example: /marry @username");
                return;
            }

            const targetID = mentionedUsers[0];
            
            // Don't allow self-marriage
            if (senderID === targetID) {
                await message.reply("💕 You cannot marry yourself! Tag someone special.");
                return;
            }

            // Check if template exists in cache
            const bgPath = path.join(__dirname, 'cache', 'canvas', 'marry_bg.png');
            if (!fs.existsSync(bgPath)) {
                console.error("❌ Cache template not found:", bgPath);
                // Try to use source file directly as fallback
                const sourcePath = path.join(__dirname, 'marrywi.png');
                if (fs.existsSync(sourcePath)) {
                    console.log("🔄 Using source file directly as fallback");
                    // Create cache directory if needed
                    const canvasDir = path.dirname(bgPath);
                    if (!fs.existsSync(canvasDir)) {
                        fs.mkdirSync(canvasDir, { recursive: true });
                    }
                    fs.copyFileSync(sourcePath, bgPath);
                } else {
                    // Ultimate fallback - send text proposal
                    let senderName = "You";
                    let targetName = "Your Love";
                    try {
                        if (usersData && typeof usersData.getName === 'function') {
                            senderName = await usersData.getName(senderID) || senderName;
                            targetName = await usersData.getName(targetID) || targetName;
                        } else {
                            senderName = mentions[senderID]?.replace('@', '') || senderName;
                            targetName = mentions[targetID]?.replace('@', '') || targetName;
                        }
                    } catch (nameError) {
                        console.error("❌ Error getting user names:", nameError.message);
                    }
                    await this.sendTextProposal(message, senderName, targetName);
                    return;
                }
            }

            const timestamp = Date.now();
            outputPath = path.join(__dirname, 'cache', 'canvas', `marry_${senderID}_${targetID}_${timestamp}.png`);
            avatar1Path = path.join(__dirname, 'cache', 'canvas', `avt1_${senderID}_${timestamp}.png`);
            avatar2Path = path.join(__dirname, 'cache', 'canvas', `avt2_${targetID}_${timestamp}.png`);

            console.log("📝 Getting user names...");
            // Get user names with error handling
            let senderName = "You";
            let targetName = "Your Love";
            
            try {
                if (usersData && typeof usersData.getName === 'function') {
                    senderName = await usersData.getName(senderID) || senderName;
                    targetName = await usersData.getName(targetID) || targetName;
                } else {
                    senderName = mentions[senderID]?.replace('@', '') || senderName;
                    targetName = mentions[targetID]?.replace('@', '') || targetName;
                }
                console.log("👤 Names:", senderName, "💍", targetName);
            } catch (nameError) {
                console.error("❌ Error getting user names:", nameError.message);
                senderName = "You";
                targetName = "Your Love";
            }

            // FIXED: Download image with better error handling
            const downloadImageWithRetry = async (url, maxRetries = 3) => {
                for (let attempt = 1; attempt <= maxRetries; attempt++) {
                    try {
                        console.log(`📥 Downloading image (attempt ${attempt})`);
                        
                        // Add increasing delays between retries
                        if (attempt > 1) {
                            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
                        }
                        
                        const response = await axios.get(url, {
                            responseType: "arraybuffer",
                            timeout: 30000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                                'Accept': 'image/*'
                            }
                        });

                        if (!response.data || response.data.length === 0) {
                            throw new Error('Empty response');
                        }

                        console.log(`✅ Downloaded successfully (${(response.data.length / 1024).toFixed(2)} KB)`);
                        return Buffer.from(response.data);

                    } catch (error) {
                        console.error(`❌ Attempt ${attempt} failed:`, error.message);
                        
                        if (error.response?.status === 429) {
                            console.log("⏳ Rate limited, waiting longer...");
                            await new Promise(resolve => setTimeout(resolve, 5000 * attempt));
                        }
                        
                        if (attempt === maxRetries) {
                            throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
                        }
                    }
                }
            };

            console.log("🔄 Pre-caching avatar files...");

            // Download files sequentially to avoid overwhelming the network
            let avatar1Buffer, avatar2Buffer;
            
            try {
                // Download first avatar - ORIGINAL LINK PRESERVED
                const avatar1Url = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                avatar1Buffer = await downloadImageWithRetry(avatar1Url);
                
                // Add delay between downloads
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Download second avatar - ORIGINAL LINK PRESERVED
                const avatar2Url = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                avatar2Buffer = await downloadImageWithRetry(avatar2Url);
                
            } catch (downloadError) {
                console.error("❌ Avatar download failed:", downloadError.message);
                // Fallback to text proposal if download fails
                await this.sendTextProposal(message, senderName, targetName);
                return;
            }

            // Save avatar files
            fs.writeFileSync(avatar1Path, avatar1Buffer);
            fs.writeFileSync(avatar2Path, avatar2Buffer);

            console.log("🎨 Processing images...");
            
            // Create circular avatars with error handling
            const createCircularAvatar = async (imageBuffer) => {
                try {
                    const image = await jimp.read(imageBuffer);
                    image.circle();
                    return await image.getBufferAsync("image/png");
                } catch (error) {
                    console.error("❌ Error creating circular avatar:", error.message);
                    throw error;
                }
            };

            let circularAvatar1Buffer, circularAvatar2Buffer;
            try {
                circularAvatar1Buffer = await createCircularAvatar(avatar1Buffer);
                await new Promise(resolve => setTimeout(resolve, 300));
                circularAvatar2Buffer = await createCircularAvatar(avatar2Buffer);
                console.log("✅ Circular avatars created successfully");
            } catch (circleError) {
                throw new Error(`Failed to create circular avatars: ${circleError.message}`);
            }

            // Load background image
            console.log("🖼️ Loading background image...");
            const bgImage = await jimp.read(bgPath);
            
            // Load circular avatars
            const circularAvatar1 = await jimp.read(circularAvatar1Buffer);
            const circularAvatar2 = await jimp.read(circularAvatar2Buffer);

            // Resize avatars to fit the template (keeping your original positions)
            circularAvatar1.resize(60, 60);
            circularAvatar2.resize(60, 60);

            console.log("🖼️ Compositing images...");
            // Composite avatars onto background with your original positions
            bgImage.composite(circularAvatar1, 130, 40);  // Left position (sender)
            bgImage.composite(circularAvatar2, 190, 23);  // Right position (target)

            // Save the final image
            console.log("💾 Saving final image...");
            const finalBuffer = await bgImage.getBufferAsync("image/png");
            
            // Verify file has content
            if (!finalBuffer || finalBuffer.length === 0) {
                throw new Error('Final image buffer is empty');
            }
            
            fs.writeFileSync(outputPath, finalBuffer);

            // Verify the image was created
            if (!fs.existsSync(outputPath)) {
                throw new Error("Failed to create output image");
            }

            const stats = fs.statSync(outputPath);
            if (stats.size === 0) {
                throw new Error("Created image is empty");
            }

            console.log("✅ Successfully created marriage certificate");
            console.log("📊 Final image size:", (stats.size / 1024).toFixed(2) + " KB");
            
            // Send message with attachment
            console.log("📤 Sending message with attachment...");
            
            await message.reply({
                body: `💞 Marriage Certificate\n\n👰 ${senderName} 💍 🤵 ${targetName}\n\n"I want to spend every moment of my life with you 💍"`,
                attachment: fs.createReadStream(outputPath)
            });

            console.log("✅ Successfully sent marriage proposal with image");

        } catch (error) {
            console.error('💥 Marry command error:', error.message);
            
            // ULTIMATE FALLBACK - Send text-only proposal
            try {
                let senderName = "You";
                let targetName = "Your Love";
                
                // Quick name extraction
                if (event.mentions) {
                    const mentionedUsers = Object.keys(event.mentions);
                    if (mentionedUsers.length > 0) {
                        targetName = event.mentions[mentionedUsers[0]].replace('@', '');
                    }
                }
                
                await this.sendTextProposal(message, senderName, targetName);
                console.log("✅ Sent fallback text proposal");
                return;
                
            } catch (fallbackError) {
                console.error("❌ Fallback also failed:", fallbackError.message);
                await message.reply("💍 Your marriage proposal has been sent! 💕 May your love story be beautiful!");
            }
        } finally {
            // Cleanup temporary files with delay to ensure file is sent
            setTimeout(() => {
                const filesToClean = [outputPath, avatar1Path, avatar2Path];
                for (const filePath of filesToClean) {
                    if (filePath && fs.existsSync(filePath)) {
                        try {
                            fs.unlinkSync(filePath);
                            console.log("🧹 Cleaned up:", path.basename(filePath));
                        } catch (cleanupError) {
                            console.warn("⚠️ Cleanup warning:", cleanupError.message);
                        }
                    }
                }
                console.log("🧹 Cleanup completed");
            }, 5000);
        }
    }
};
*/
