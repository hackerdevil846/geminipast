const fs = require('fs-extra');
const axios = require('axios');
const { createCanvas, loadImage, registerFont } = require('canvas');

module.exports = {
    config: {
        name: 'bboard',
        aliases: [],
        version: '1.0.1',
        author: '𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑',
        countDown: 10,
        role: 0,
        category: 'media',
        shortDescription: {
            en: '𝖡𝖾𝖺𝗎𝗍𝗂𝖿𝗎𝗅 𝖻𝗂𝗅𝗅𝖻𝗈𝖺𝗋𝖽 𝖼𝗋𝖾𝖺𝗍𝗈𝗋'
        },
        longDescription: {
            en: '𝖢𝗋𝖾𝖺𝗍𝖾𝗌 𝖺 𝖻𝖾𝖺𝗎𝗍𝗂𝖿𝗎𝗅 𝖻𝗂𝗅𝗅𝖻𝗈𝖺𝗋𝖽 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋 𝗍𝖾𝗑𝗍 𝖺𝗇𝖽 𝗉𝗋𝗈𝖿𝗂𝗅𝖾'
        },
        guide: {
            en: '{p}bboard [𝗍𝖾𝗑𝗍]'
        },
        dependencies: {
            'canvas': '',
            'axios': '',
            'fs-extra': ''
        }
    },

    onStart: async function({ message, event, args, api }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require('canvas');
                require('axios');
                require('fs-extra');
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply('❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖼𝖺𝗇𝗏𝖺𝗌, 𝖺𝗑𝗂𝗈𝗌, 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.');
            }

            const { senderID } = event;
            const text = args.join(' ');
            
            if (!text) {
                return message.reply('🌟 𝖯𝗅𝖾𝖺𝗌𝖾 𝖺𝖽𝖽 𝗍𝖾𝗑𝗍 𝖿𝗈𝗋 𝗒𝗈𝗎𝗋 𝖻𝗂𝗅𝗅𝖻𝗈𝖺𝗋𝖽!');
            }

            // Validate text length
            if (text.length > 100) {
                return message.reply('❌ 𝖳𝖾𝗑𝗍 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 100 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.');
            }

            const processingMsg = await message.reply('🔄 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝖻𝖾𝖺𝗎𝗍𝗂𝖿𝗎𝗅 𝖻𝗂𝗅𝗅𝖻𝗈𝖺𝗋𝖽, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...');
            
            const bgPath = __dirname + `/cache/bboard_bg_${Date.now()}.jpg`;
            const avtPath = __dirname + `/cache/avt_${senderID}_${Date.now()}.png`;
            const outputPath = __dirname + `/cache/bboard_${senderID}_${Date.now()}.png`;
            
            try {
                // Get user info
                let userInfo;
                let name = "𝖴𝗌𝖾𝗋";
                try {
                    userInfo = await api.getUserInfo(senderID);
                    if (userInfo && userInfo[senderID] && userInfo[senderID].name) {
                        name = userInfo[senderID].name;
                    }
                } catch (userError) {
                    console.warn('❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈:', userError.message);
                }

                const avatarUrl = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                
                // Download background and avatar with error handling
                let bgResponse, avtResponse;
                try {
                    bgResponse = await axios.get('https://i.imgur.com/PkAGPu4.jpg', { 
                        responseType: 'arraybuffer',
                        timeout: 30000 
                    });
                } catch (bgError) {
                    console.error('❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽:', bgError.message);
                    await message.unsendMessage(processingMsg.messageID);
                    return message.reply('❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.');
                }

                try {
                    avtResponse = await axios.get(avatarUrl, { 
                        responseType: 'arraybuffer',
                        timeout: 30000 
                    });
                } catch (avtError) {
                    console.error('❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗏𝖺𝗍𝖺𝗋:', avtError.message);
                    // Continue without avatar
                }

                // Write files
                await fs.writeFile(bgPath, bgResponse.data);
                if (avtResponse) {
                    await fs.writeFile(avtPath, avtResponse.data);
                }

                // Load images with Canvas
                let bgImage, avtImage;
                try {
                    bgImage = await loadImage(bgPath);
                } catch (bgReadError) {
                    console.error('❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽 𝗂𝗆𝖺𝗀𝖾:', bgReadError.message);
                    await message.unsendMessage(processingMsg.messageID);
                    return message.reply('❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.');
                }

                if (avtResponse && fs.existsSync(avtPath)) {
                    try {
                        avtImage = await loadImage(avtPath);
                    } catch (avtReadError) {
                        console.warn('❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝖺𝗏𝖺𝗍𝖺𝗋:', avtReadError.message);
                    }
                }

                // Create canvas
                const canvas = createCanvas(bgImage.width, bgImage.height);
                const ctx = canvas.getContext('2d');

                // Draw background
                ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

                // Draw circular avatar
                if (avtImage) {
                    ctx.save();
                    // Create circular clipping path
                    ctx.beginPath();
                    ctx.arc(200, 90, 35, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.clip();
                    
                    // Draw avatar
                    ctx.drawImage(avtImage, 165, 55, 70, 70);
                    ctx.restore();
                }

                // Set font styles
                ctx.font = 'bold 16px Arial';
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'left';

                // Draw name
                ctx.fillText(name, 250, 90);

                // Set text style
                ctx.font = 'bold 28px Arial';
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'center';

                // Text wrapping function for Canvas
                function wrapText(context, text, x, y, maxWidth, lineHeight) {
                    const words = text.split(' ');
                    const lines = [];
                    let currentLine = words[0];

                    for (let i = 1; i < words.length; i++) {
                        const word = words[i];
                        const width = context.measureText(currentLine + ' ' + word).width;
                        if (width < maxWidth) {
                            currentLine += ' ' + word;
                        } else {
                            lines.push(currentLine);
                            currentLine = word;
                        }
                    }
                    lines.push(currentLine);

                    // Draw lines
                    for (let i = 0; i < lines.length; i++) {
                        context.fillText(lines[i], x, y + (i * lineHeight));
                    }

                    return lines.length;
                }

                // Draw wrapped text
                try {
                    const lineCount = wrapText(ctx, text, canvas.width / 2, 200, 340, 40);
                    
                    // Adjust position if too many lines
                    let startY = 200;
                    if (lineCount > 3) {
                        startY = 180;
                    }
                    
                    // Redraw with adjusted position
                    wrapText(ctx, text, canvas.width / 2, startY, 340, 40);
                } catch (textError) {
                    console.error('❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗋𝖺𝗐 𝗍𝖾𝗑𝗍:', textError.message);
                    await message.unsendMessage(processingMsg.messageID);
                    return message.reply('❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝗍𝖾𝗑𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗐𝗂𝗍𝗁 𝖽𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝗍𝖾𝗑𝗍.');
                }

                // Add some shadow effects for better appearance
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 5;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;

                // Save image
                const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
                await fs.writeFile(outputPath, buffer);

                // Verify output file
                if (!fs.existsSync(outputPath)) {
                    throw new Error('𝖮𝗎𝗍𝗉𝗎𝗍 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖼𝗋𝖾𝖺𝗍𝖾𝖽');
                }

                const stats = await fs.stat(outputPath);
                if (stats.size === 0) {
                    throw new Error('𝖮𝗎𝗍𝗉𝗎𝗍 𝖿𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒');
                }

                // Send result
                await message.reply({
                    body: `🎉 𝖧𝖾𝗋𝖾'𝗌 𝗒𝗈𝗎𝗋 𝖻𝖾𝖺𝗎𝗍𝗂𝖿𝗎𝗅 𝖻𝗂𝗅𝗅𝖻𝗈𝖺𝗋𝖽!\n\n𝖭𝖺𝗆𝖾: ${name}\n𝖳𝖾𝗑𝗍: ${text}`,
                    attachment: fs.createReadStream(outputPath)
                });
                
            } catch (processingError) {
                console.error('💥 𝖡𝗂𝗅𝗅𝖻𝗈𝖺𝗋𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:', processingError);
                await message.unsendMessage(processingMsg.messageID);
                return message.reply('❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖻𝗂𝗅𝗅𝖻𝗈𝖺𝗋𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.');
            } finally {
                // Clean up files
                const filesToClean = [bgPath, avtPath, outputPath];
                for (const file of filesToClean) {
                    try {
                        if (fs.existsSync(file)) {
                            await fs.remove(file);
                        }
                    } catch (cleanError) {
                        console.warn(`❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 ${file}:`, cleanError.message);
                    }
                }
            }
            
            await message.unsendMessage(processingMsg.messageID);
            
        } catch (error) {
            console.error('💥 𝖡𝖡𝗈𝖺𝗋𝖽 𝖤𝗋𝗋𝗈𝗋:', error);
            // Don't send error message to avoid spam
        }
    }
};
