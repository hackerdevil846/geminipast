const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "animeguess",
        aliases: [],
        version: "1.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "game",
        shortDescription: {
            en: "Guess the anime character for rewards"
        },
        longDescription: {
            en: "Guess the anime character from the image and win coins! You have 30 seconds to answer."
        },
        guide: {
            en: "{p}animeguess"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, usersData, api, event }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ Missing dependencies. Please install axios and fs-extra.");
            }

            // Fetch a random anime character with enhanced error handling
            let character;
            try {
                console.log("🔍 Fetching anime character data...");
                const response = await axios.get('https://global-prime-mahis-apis.vercel.app', {
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });

                if (!response.data || !response.data.data) {
                    throw new Error("Invalid API response structure");
                }

                const characters = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
                
                if (characters.length === 0) {
                    throw new Error("No characters found in API response");
                }

                character = characters[Math.floor(Math.random() * characters.length)];
                
                if (!character.image || !character.fullName) {
                    throw new Error("Invalid character data structure");
                }

                console.log(`🎯 Selected character: ${character.fullName}`);

            } catch (apiError) {
                console.error("❌ API Error:", apiError.message);
                return message.reply("❌ Failed to fetch anime character data. Please try again later.");
            }

            // Download character image with enhanced error handling
            const imagePath = path.join(__dirname, 'cache', `character_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`);
            
            try {
                console.log(`📥 Downloading character image: ${character.image}`);
                await fs.ensureDir(path.dirname(imagePath));
                
                const imageRes = await axios.get(character.image, { 
                    responseType: 'arraybuffer',
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Referer': 'https://global-prime-mahis-apis.vercel.app/'
                    },
                    maxContentLength: 10 * 1024 * 1024 // 10MB limit
                });

                // Check if it's actually an image
                const contentType = imageRes.headers['content-type'];
                if (!contentType || !contentType.startsWith('image/')) {
                    throw new Error("Invalid content type: " + contentType);
                }

                await fs.writeFile(imagePath, Buffer.from(imageRes.data));

                // Verify file was written
                const stats = await fs.stat(imagePath);
                if (stats.size < 1000) { // At least 1KB
                    throw new Error("Downloaded file is too small");
                }

                console.log(`✅ Image downloaded successfully (${(stats.size / 1024 / 1024).toFixed(2)}MB)`);

            } catch (imageError) {
                console.error("❌ Image download error:", imageError.message);
                await this.cleanup(imagePath);
                return message.reply("❌ Failed to download character image. Please try again.");
            }

            // Prepare correct answers
            const correctAnswers = [character.fullName.toLowerCase()];
            if (character.firstName) {
                correctAnswers.push(character.firstName.toLowerCase());
            }
            if (character.lastName) {
                correctAnswers.push(character.lastName.toLowerCase());
            }
            // Add common variations
            correctAnswers.push(...correctAnswers.map(ans => ans.replace(/\s+/g, '')));

            // Send game message with dark stylish font
            const gameMsg = 
                `🎮 𝗔𝗡𝗜𝗠𝗘 𝗚𝗨𝗘𝗦𝗦 𝗚𝗔𝗠𝗘 🎮\n\n` +
                `👤 𝗖𝗵𝗮𝗿𝗮𝗰𝘁𝗲𝗿 𝗧𝗿𝗮𝗶𝘁𝘀: ${character.traits || 'Classic Anime Character'}\n` +
                `🏷️  𝗧𝗮𝗴𝘀: ${character.tags || 'Anime, Character'}\n\n` +
                `⏰ 𝗬𝗼𝘂 𝗵𝗮𝘃𝗲 𝟯𝟬 𝘀𝗲𝗰𝗼𝗻𝗱𝘀 𝘁𝗼 𝗮𝗻𝘀𝘄𝗲𝗿!\n` +
                `💎 𝗥𝗲𝘄𝗮𝗿𝗱: 𝟭,𝟬𝟬𝟬 𝗰𝗼𝗶𝗻𝘀\n\n` +
                `✨ 𝗚𝘂𝗲𝘀𝘀 𝘁𝗵𝗲 𝗮𝗻𝗶𝗺𝗲 𝗰𝗵𝗮𝗿𝗮𝗰𝘁𝗲𝗿 𝗻𝗮𝗺𝗲!`;

            const sentMsg = await message.reply({
                body: gameMsg,
                attachment: fs.createReadStream(imagePath)
            });

            // Set game state with enhanced data
            const gameData = {
                name: this.config.name,
                messageID: sentMsg.messageID,
                author: event.senderID,
                correctAnswer: correctAnswers,
                imagePath: imagePath,
                startTime: Date.now(),
                characterName: character.fullName
            };

            if (!global.client.handleReply) {
                global.client.handleReply = [];
            }
            global.client.handleReply.push(gameData);

            console.log(`🎯 Game started for user ${event.senderID}, correct answer: ${character.fullName}`);

            // Set timeout with better cleanup
            const timeoutId = setTimeout(async () => {
                const replyIndex = global.client.handleReply.findIndex(reply => reply.messageID === sentMsg.messageID);
                if (replyIndex !== -1) {
                    try {
                        await message.reply(`⏰ 𝗧𝗶𝗺𝗲'𝘀 𝘂𝗽! 𝗧𝗵𝗲 𝗮𝗻𝘀𝘄𝗲𝗿 𝘄𝗮𝘀: ${character.fullName}\n\n💡 𝗕𝗲𝘁𝘁𝗲𝗿 𝗹𝘂𝗰𝗸 𝗻𝗲𝘅𝘁 𝘁𝗶𝗺𝗲!`);
                        await this.cleanup(imagePath, sentMsg.messageID);
                    } catch (timeoutError) {
                        console.error("Timeout cleanup error:", timeoutError);
                    }
                }
            }, 30000);

            // Store timeout ID for cleanup
            gameData.timeoutId = timeoutId;

        } catch (err) {
            console.error("💥 Main game error:", err);
            await message.reply("❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.");
        }
    },

    onReply: async function({ event, message, Reply, usersData }) {
        try {
            // Validate reply
            if (event.senderID !== Reply.author) {
                return; // Ignore replies from other users
            }

            const userAnswer = event.body.trim().toLowerCase();
            console.log(`🎯 User answer: "${userAnswer}", Correct answers:`, Reply.correctAnswer);

            let isCorrect = false;
            
            // Check if answer is correct (with fuzzy matching)
            for (const correctAnswer of Reply.correctAnswer) {
                if (userAnswer === correctAnswer || 
                    userAnswer.includes(correctAnswer) || 
                    correctAnswer.includes(userAnswer)) {
                    isCorrect = true;
                    break;
                }
            }

            if (isCorrect) {
                const reward = 1000;
                let userData;
                
                try {
                    userData = await usersData.get(event.senderID);
                } catch (userError) {
                    console.error("User data error:", userError);
                    userData = { money: 0 };
                }

                const currentMoney = userData.money || 0;
                const newBalance = currentMoney + reward;
                
                try {
                    await usersData.set(event.senderID, { money: newBalance });
                } catch (setError) {
                    console.error("Set user data error:", setError);
                }

                const winMessage = 
                    `🎉 𝗖𝗢𝗡𝗚𝗥𝗔𝗧𝗨𝗟𝗔𝗧𝗜𝗢𝗡𝗦! 🎉\n\n` +
                    `✅ 𝗖𝗼𝗿𝗿𝗲𝗰𝘁 𝗮𝗻𝘀𝘄𝗲𝗿!\n` +
                    `👤 𝗖𝗵𝗮𝗿𝗮𝗰𝘁𝗲𝗿: ${Reply.characterName}\n` +
                    `💰 𝗥𝗲𝘄𝗮𝗿𝗱: ${reward} 𝗰𝗼𝗶𝗻𝘀\n` +
                    `💎 𝗡𝗲𝘄 𝗯𝗮𝗹𝗮𝗻𝗰𝗲: ${newBalance} 𝗰𝗼𝗶𝗻𝘀\n\n` +
                    `🎮 𝗣𝗹𝗮𝘆 𝗮𝗴𝗮𝗶𝗻 𝘄𝗶𝘁𝗵: ${global.config.PREFIX}animeguess`;

                await message.reply(winMessage);
                
            } else {
                const loseMessage = 
                    `❌ 𝗪𝗥𝗢𝗡𝗚 𝗔𝗡𝗦𝗪𝗘𝗥!\n\n` +
                    `👤 𝗧𝗵𝗲 𝗰𝗼𝗿𝗿𝗲𝗰𝘁 𝗮𝗻𝘀𝘄𝗲𝗿 𝘄𝗮𝘀: ${Reply.characterName}\n` +
                    `💡 𝗕𝗲𝘁𝘁𝗲𝗿 𝗹𝘂𝗰𝗸 𝗻𝗲𝘅𝘁 𝘁𝗶𝗺𝗲!\n\n` +
                    `🎮 𝗧𝗿𝘆 𝗮𝗴𝗮𝗶𝗻: ${global.config.PREFIX}animeguess`;

                await message.reply(loseMessage);
            }
            
            // Cleanup
            await this.cleanup(Reply.imagePath, Reply.messageID);
            
        } catch (err) {
            console.error("💥 Reply processing error:", err);
            await message.reply("❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗮𝗻𝘀𝘄𝗲𝗿.");
        }
    },

    // Enhanced cleanup function
    cleanup: async function(imagePath, messageID) {
        try {
            // Clean up image file
            if (imagePath && await fs.pathExists(imagePath)) {
                await fs.unlink(imagePath);
                console.log("🧹 Cleaned up image file");
            }
            
            // Clean up game state
            if (global.client.handleReply) {
                const replyIndex = global.client.handleReply.findIndex(reply => reply.messageID === messageID);
                if (replyIndex !== -1) {
                    // Clear timeout if exists
                    if (global.client.handleReply[replyIndex].timeoutId) {
                        clearTimeout(global.client.handleReply[replyIndex].timeoutId);
                    }
                    global.client.handleReply.splice(replyIndex, 1);
                    console.log("🧹 Cleaned up game state");
                }
            }
        } catch (err) {
            console.error("Cleanup error:", err);
        }
    }
};
