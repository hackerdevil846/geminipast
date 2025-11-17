const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const FormData = require('form-data');

module.exports = {
    config: {
        name: "removebg",
        aliases: [],
        version: "1.3.0",
        author: "𝘼𝙨𝙞𝙛 𝙈𝙖𝙝𝙢𝙪𝙙",
        countDown: 10,
        role: 0,
        category: "image",
        shortDescription: {
            en: "🖼️ 𝙍𝙚𝙢𝙤𝙫𝙚 𝙞𝙢𝙖𝙜𝙚 𝙗𝙖𝙘𝙠𝙜𝙧𝙤𝙪𝙣𝙙 𝙪𝙨𝙞𝙣𝙜 𝘼𝙄"
        },
        longDescription: {
            en: "𝙍𝙚𝙢𝙤𝙫𝙚𝙨 𝙩𝙝𝙚 𝙗𝙖𝙘𝙠𝙜𝙧𝙤𝙪𝙣𝙙 𝙛𝙧𝙤𝙢 𝙖𝙣 𝙞𝙢𝙖𝙜𝙚 𝙪𝙨𝙞𝙣𝙜 𝙖𝙙𝙫𝙖𝙣𝙘𝙚𝙙 𝘼𝙄 𝙩𝙚𝙘𝙝𝙣𝙤𝙡𝙤𝙜𝙮"
        },
        guide: {
            en: "{p}removebg [𝙧𝙚𝙥𝙡𝙮 𝙩𝙤 𝙞𝙢𝙖𝙜𝙚]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "form-data": ""
        }
    },

    onStart: async function ({ message, event, api }) {
        let processingMsg = null;
        let inputPath = null;
        let outputPath = null;
        
        try {
            // Check dependencies
            try {
                if (typeof require !== 'undefined') {
                    require("axios");
                    require("fs-extra");
                    require("form-data");
                }
            } catch (e) {
                console.error("𝙈𝙞𝙨𝙨𝙞𝙣𝙜 𝙙𝙚𝙥𝙚𝙣𝙙𝙚𝙣𝙘𝙞𝙚𝙨:", e);
                return message.reply("❌ 𝙈𝙞𝙨𝙨𝙞𝙣𝙜 𝙧𝙚𝙦𝙪𝙞𝙧𝙚𝙙 𝙙𝙚𝙥𝙚𝙣𝙙𝙚𝙣𝙘𝙞𝙚𝙨. 𝙋𝙡𝙚𝙖𝙨𝙚 𝙞𝙣𝙨𝙩𝙖𝙡𝙡: 𝙖𝙭𝙞𝙤𝙨, 𝙛𝙨-𝙚𝙭𝙩𝙧𝙖, 𝙛𝙤𝙧𝙢-𝙙𝙖𝙩𝙖");
            }

            // Validate message reply
            if (event.type !== "message_reply") {
                return message.reply("🖼️ 𝙋𝙡𝙚𝙖𝙨𝙚 𝙧𝙚𝙥𝙡𝙮 𝙩𝙤 𝙖𝙣 𝙞𝙢𝙖𝙜𝙚 𝙩𝙤 𝙧𝙚𝙢𝙤𝙫𝙚 𝙞𝙩𝙨 𝙗𝙖𝙘𝙠𝙜𝙧𝙤𝙪𝙣𝙙.");
            }

            if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
                return message.reply("❌ 𝙉𝙤 𝙖𝙩𝙩𝙖𝙘𝙝𝙢𝙚𝙣𝙩 𝙛𝙤𝙪𝙣𝙙 𝙞𝙣 𝙩𝙝𝙚 𝙧𝙚𝙥𝙡𝙞𝙚𝙙 𝙢𝙚𝙨𝙨𝙖𝙜𝙚.");
            }

            const attachment = event.messageReply.attachments[0];
            if (!attachment || !["photo", "image", "sticker"].includes(attachment.type)) {
                return message.reply("❌ 𝙊𝙣𝙡𝙮 𝙞𝙢𝙖𝙜𝙚 𝙖𝙩𝙩𝙖𝙘𝙝𝙢𝙚𝙣𝙩𝙨 𝙖𝙧𝙚 𝙨𝙪𝙥𝙥𝙤𝙧𝙩𝙚𝙙.");
            }

            if (!attachment.url) {
                return message.reply("❌ 𝙄𝙣𝙫𝙖𝙡𝙞𝙙 𝙞𝙢𝙖𝙜𝙚 𝙪𝙧𝙡.");
            }

            processingMsg = await message.reply("✨ 𝙍𝙚𝙢𝙤𝙫𝙞𝙣𝙜 𝙗𝙖𝙘𝙠𝙜𝙧𝙤𝙪𝙣𝙙... 𝙋𝙡𝙚𝙖𝙨𝙚 𝙬𝙖𝙞𝙩...");

            // Create cache directory
            const cacheDir = path.join(__dirname, 'cache', 'removebg');
            try {
                if (!fs.existsSync(cacheDir)) {
                    await fs.mkdirSync(cacheDir, { recursive: true });
                }
            } catch (dirError) {
                console.error("𝙁𝙖𝙞𝙡𝙚𝙙 𝙩𝙤 𝙘𝙧𝙚𝙖𝙩𝙚 𝙘𝙖𝙘𝙝𝙚 𝙙𝙞𝙧𝙚𝙘𝙩𝙤𝙧𝙮:", dirError);
                throw new Error("𝙁𝙖𝙞𝙡𝙚𝙙 𝙩𝙤 𝙨𝙚𝙩 𝙪𝙥 𝙨𝙩𝙤𝙧𝙖𝙜𝙚");
            }

            const timestamp = Date.now();
            inputPath = path.join(cacheDir, `input-${timestamp}.jpg`);
            outputPath = path.join(cacheDir, `nobg-${timestamp}.png`);

            // Download the image with validation
            let imageBuffer;
            try {
                const imageResponse = await axios({
                    method: 'GET',
                    url: attachment.url,
                    responseType: 'arraybuffer',
                    timeout: 30000,
                    maxContentLength: 10 * 1024 * 1024 // 10MB limit
                });
                
                if (!imageResponse.data || imageResponse.data.length === 0) {
                    throw new Error("𝙀𝙢𝙥𝙩𝙮 𝙞𝙢𝙖𝙜𝙚 𝙙𝙖𝙩𝙖 𝙧𝙚𝙘𝙚𝙞𝙫𝙚𝙙");
                }
                
                imageBuffer = Buffer.from(imageResponse.data);
                
                // Validate image size
                if (imageBuffer.length > 8 * 1024 * 1024) { // 8MB
                    throw new Error("𝙄𝙢𝙖𝙜𝙚 𝙞𝙨 𝙩𝙤𝙤 𝙡𝙖𝙧𝙜𝙚 (𝙢𝙖𝙭 8𝙈𝘽)");
                }
                
                if (imageBuffer.length < 100) { // 100 bytes minimum
                    throw new Error("𝙄𝙢𝙖𝙜𝙚 𝙞𝙨 𝙩𝙤𝙤 𝙨𝙢𝙖𝙡𝙡 𝙤𝙧 𝙞𝙣𝙫𝙖𝙡𝙞𝙙");
                }
                
                await fs.writeFileSync(inputPath, imageBuffer);
                
                // Verify file was written
                if (!fs.existsSync(inputPath)) {
                    throw new Error("𝙁𝙖𝙞𝙡𝙚𝙙 𝙩𝙤 𝙨𝙖𝙫𝙚 𝙞𝙢𝙖𝙜𝙚 𝙛𝙞𝙡𝙚");
                }
                
                const stats = await fs.statSync(inputPath);
                if (stats.size === 0) {
                    throw new Error("𝙎𝙖𝙫𝙚𝙙 𝙞𝙢𝙖𝙜𝙚 𝙛𝙞𝙡𝙚 𝙞𝙨 𝙚𝙢𝙥𝙩𝙮");
                }
                
            } catch (downloadError) {
                console.error("𝙄𝙢𝙖𝙜𝙚 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙚𝙧𝙧𝙤𝙧:", downloadError);
                throw new Error(`𝙁𝙖𝙞𝙡𝙚𝙙 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙞𝙢𝙖𝙜𝙚: ${downloadError.message}`);
            }

            let backgroundRemoved = false;

            // Try remove.bg API first
            try {
                console.log("🔧 𝙏𝙧𝙮𝙞𝙣𝙜 𝙧𝙚𝙢𝙤𝙫𝙚.𝙗𝙜 𝘼𝙋𝙄...");
                
                const formData = new FormData();
                formData.append('image_file', fs.createReadStream(inputPath));
                formData.append('size', 'auto');

                const response = await axios({
                    method: 'POST',
                    url: 'https://api.remove.bg/v1.0/removebg',
                    data: formData,
                    headers: {
                        'X-Api-Key': 'C3tFmS6WbZ8EY6tqRvp6mJ35',
                        ...formData.getHeaders()
                    },
                    responseType: 'arraybuffer',
                    timeout: 45000,
                    maxContentLength: 10 * 1024 * 1024
                });

                if (response.data && response.data.length > 1000) { // Minimum reasonable size for PNG
                    await fs.writeFileSync(outputPath, response.data);
                    
                    // Verify output file
                    const outputStats = await fs.statSync(outputPath);
                    if (outputStats.size > 1000) {
                        backgroundRemoved = true;
                        console.log("✅ 𝘼𝙋𝙄 𝙨𝙪𝙘𝙘𝙚𝙨𝙨!");
                    } else {
                        throw new Error("𝙎𝙢𝙖𝙡𝙡 𝙤𝙪𝙩𝙥𝙪𝙩 𝙛𝙞𝙡𝙚 - 𝙥𝙧𝙤𝙗𝙖𝙗𝙡𝙮 𝙛𝙖𝙞𝙡𝙚𝙙");
                    }
                } else {
                    throw new Error("𝙀𝙢𝙥𝙩𝙮 𝙤𝙧 𝙞𝙣𝙫𝙖𝙡𝙞𝙙 𝙧𝙚𝙨𝙥𝙤𝙣𝙨𝙚 𝙛𝙧𝙤𝙢 𝙧𝙚𝙢𝙤𝙫𝙚.𝙗𝙜");
                }

            } catch (apiError) {
                console.error('𝘼𝙋𝙄 𝙀𝙧𝙧𝙤𝙧:', apiError.message);
                
                // Fallback to alternative API
                try {
                    console.log("🔄 𝙏𝙧𝙮𝙞𝙣𝙜 𝙛𝙖𝙡𝙡𝙗𝙖𝙘𝙠 𝘼𝙋𝙄...");
                    
                    const fallbackResponse = await axios({
                        method: 'GET',
                        url: `https://api.memegen.cc/removebg?url=${encodeURIComponent(attachment.url)}`,
                        responseType: 'arraybuffer',
                        timeout: 45000,
                        maxContentLength: 10 * 1024 * 1024
                    });
                    
                    if (fallbackResponse.data && fallbackResponse.data.length > 1000) {
                        await fs.writeFileSync(outputPath, Buffer.from(fallbackResponse.data));
                        
                        // Verify output file
                        const outputStats = await fs.statSync(outputPath);
                        if (outputStats.size > 1000) {
                            backgroundRemoved = true;
                            console.log("✅ 𝙁𝙖𝙡𝙡𝙗𝙖𝙘𝙠 𝘼𝙋𝙄 𝙨𝙪𝙘𝙘𝙚𝙨𝙨!");
                        } else {
                            throw new Error("𝙎𝙢𝙖𝙡𝙡 𝙤𝙪𝙩𝙥𝙪𝙩 𝙛𝙞𝙡𝙚 𝙛𝙧𝙤𝙢 𝙛𝙖𝙡𝙡𝙗𝙖𝙘𝙠");
                        }
                    } else {
                        throw new Error("𝙀𝙢𝙥𝙩𝙮 𝙧𝙚𝙨𝙥𝙤𝙣𝙨𝙚 𝙛𝙧𝙤𝙢 𝙛𝙖𝙡𝙡𝙗𝙖𝙘𝙠 𝘼𝙋𝙄");
                    }
                } catch (fallbackError) {
                    console.error('𝙁𝙖𝙡𝙡𝙗𝙖𝙘𝙠 𝘼𝙋𝙄 𝙀𝙧𝙧𝙤𝙧:', fallbackError.message);
                    throw new Error('𝘼𝙡𝙡 𝙗𝙖𝙘𝙠𝙜𝙧𝙤𝙪𝙣𝙙 𝙧𝙚𝙢𝙤𝙫𝙖𝙡 𝙨𝙚𝙧𝙫𝙞𝙘𝙚𝙨 𝙖𝙧𝙚 𝙘𝙪𝙧𝙧𝙚𝙣𝙩𝙡𝙮 𝙪𝙣𝙖𝙫𝙖𝙞𝙡𝙖𝙗𝙡𝙚');
                }
            }

            if (backgroundRemoved) {
                // Send success message
                await message.reply({
                    body: "✅ 𝘽𝙖𝙘𝙠𝙜𝙧𝙤𝙪𝙣𝙙 𝙧𝙚𝙢𝙤𝙫𝙚𝙙 𝙨𝙪𝙘𝙘𝙚𝙨𝙨𝙛𝙪𝙡𝙡𝙮!",
                    attachment: fs.createReadStream(outputPath)
                });
            }

        } catch (error) {
            console.error("𝘽𝙖𝙘𝙠𝙜𝙧𝙤𝙪𝙣𝙙 𝙍𝙚𝙢𝙤𝙫𝙖𝙡 𝙀𝙧𝙧𝙤𝙧:", error);
            
            let errorMessage = "❌ 𝘼𝙣 𝙚𝙧𝙧𝙤𝙧 𝙤𝙘𝙘𝙪𝙧𝙧𝙚𝙙 𝙬𝙝𝙞𝙡𝙚 𝙥𝙧𝙤𝙘𝙚𝙨𝙨𝙞𝙣𝙜 𝙮𝙤𝙪𝙧 𝙞𝙢𝙖𝙜𝙚. 𝙋𝙡𝙚𝙖𝙨𝙚 𝙩𝙧𝙮 𝙖𝙜𝙖𝙞𝙣.";
            
            if (error.response?.status === 429) {
                errorMessage = "⚠️ 𝘼𝙋𝙄 𝙡𝙞𝙢𝙞𝙩 𝙚𝙭𝙘𝙚𝙚𝙙𝙚𝙙. 𝙋𝙡𝙚𝙖𝙨𝙚 𝙩𝙧𝙮 𝙖𝙜𝙖𝙞𝙣 𝙡𝙖𝙩𝙚𝙧.";
            } 
            else if (error.code === 'ECONNABORTED') {
                errorMessage = "⏱️ 𝙏𝙝𝙚 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙩𝙞𝙢𝙚𝙙 𝙤𝙪𝙩. 𝙋𝙡𝙚𝙖𝙨𝙚 𝙩𝙧𝙮 𝙖𝙜𝙖𝙞𝙣.";
            }
            else if (error.message.includes('unavailable')) {
                errorMessage = "🔧 𝘽𝙖𝙘𝙠𝙜𝙧𝙤𝙪𝙣𝙙 𝙧𝙚𝙢𝙤𝙫𝙖𝙡 𝙨𝙚𝙧𝙫𝙞𝙘𝙚𝙨 𝙖𝙧𝙚 𝙩𝙚𝙢𝙥𝙤𝙧𝙖𝙧𝙞𝙡𝙮 𝙪𝙣𝙖𝙫𝙖𝙞𝙡𝙖𝙗𝙡𝙚.";
            }
            else if (error.message.includes('large')) {
                errorMessage = "📁 𝙄𝙢𝙖𝙜𝙚 𝙞𝙨 𝙩𝙤𝙤 𝙡𝙖𝙧𝙜𝙚. 𝙋𝙡𝙚𝙖𝙨𝙚 𝙪𝙨𝙚 𝙖𝙣 𝙞𝙢𝙖𝙜𝙚 𝙨𝙢𝙖𝙡𝙡𝙚𝙧 𝙩𝙝𝙖𝙣 8𝙈𝘽.";
            }
            else if (error.message.includes('download')) {
                errorMessage = "🌐 𝙁𝙖𝙞𝙡𝙚𝙙 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙩𝙝𝙚 𝙞𝙢𝙖𝙜𝙚. 𝙋𝙡𝙚𝙖𝙨𝙚 𝙩𝙧𝙮 𝙖 𝙙𝙞𝙛𝙛𝙚𝙧𝙚𝙣𝙩 𝙞𝙢𝙖𝙜𝙚.";
            }
            
            await message.reply(errorMessage);
        } finally {
            // Clean up processing message
            try {
                if (processingMsg && processingMsg.messageID) {
                    await api.unsendMessage(processingMsg.messageID);
                }
            } catch (unsendError) {
                console.log("𝙉𝙤𝙩 𝙖𝙗𝙡𝙚 𝙩𝙤 𝙪𝙣𝙨𝙚𝙣𝙙 𝙥𝙧𝙤𝙘𝙚𝙨𝙨𝙞𝙣𝙜 𝙢𝙚𝙨𝙨𝙖𝙜𝙚:", unsendError);
            }
            
            // Clean up files with error handling
            const cleanupFiles = async (filePath) => {
                try {
                    if (filePath && fs.existsSync(filePath)) {
                        await fs.unlinkSync(filePath);
                        console.log(`✅ 𝘾𝙡𝙚𝙖𝙣𝙚𝙙 𝙪𝙥: ${filePath}`);
                    }
                } catch (cleanupError) {
                    console.log(`𝙁𝙖𝙞𝙡𝙚𝙙 𝙩𝙤 𝙘𝙡𝙚𝙖𝙣 𝙪𝙥 ${filePath}:`, cleanupError);
                }
            };
            
            await cleanupFiles(inputPath);
            await cleanupFiles(outputPath);
        }
    }
};
