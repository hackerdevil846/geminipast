const fs = require("fs-extra");
const request = require("request");

module.exports = {
    config: {
        name: "groupinfo",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 3,
        role: 1,
        category: "group",
        shortDescription: {
            en: "𝖦𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇"
        },
        longDescription: {
            en: "𝖲𝗁𝗈𝗐𝗌 𝖽𝖾𝗍𝖺𝗂𝗅𝖾𝖽 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 𝖺𝖻𝗈𝗎𝗍 𝗒𝗈𝗎𝗋 𝗀𝗋𝗈𝗎𝗉"
        },
        guide: {
            en: "{p}groupinfo"
        },
        dependencies: {
            "fs-extra": "",
            "request": ""
        }
    },

    onStart: async function({ api, event, message }) {
        try {
            // Dependency check with better validation
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("request");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝗋𝖾𝗊𝗎𝗂𝗋𝖾𝖽 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺 𝖺𝗇𝖽 𝗋𝖾𝗊𝗎𝖾𝗌𝗍.");
            }

            // Ensure cache directory exists
            const cacheDir = __dirname + "/cache";
            try {
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
            }

            // Function to convert text to mathematical bold script
            function toMathBold(text) {
                const mapping = {
                    'A': '𝖠','B': '𝖡','C': '𝖢','D': '𝖣','E': '𝖤','F': '𝖥','G': '𝖦','H': '𝖧',
                    'I': '𝖨','J': '𝖩','K': '𝖪','L': '𝖫','M': '𝖬','N': '𝖭','O': '𝖮','P': '𝖯',
                    'Q': '𝖰','R': '𝖱','S': '𝖲','T': '𝖳','U': '𝖴','V': '𝖵','W': '𝖶','X': '𝖷',
                    'Y': '𝖸','Z': '𝖹',
                    'a': '𝖺','b': '𝖻','c': '𝖼','d': '𝖽','e': '𝖾','f': '𝖿','g': '𝗀','h': '𝗁',
                    'i': '𝗂','j': '𝗃','k': '𝗄','l': '𝗅','m': '𝗆','n': '𝗇','o': '𝗈','p': '𝗉',
                    'q': '𝗊','r': '𝗋','s': '𝗌','t': '𝗍','u': '𝗎','v': '𝗏','w': '𝗐','x': '𝗑',
                    'y': '𝗒','z': '𝗓',
                    '0': '𝟢','1': '𝟣','2': '𝟤','3': '𝟥','4': '𝟦','5': '𝟧','6': '𝟨','7': '𝟩','8': '𝟪','9': '𝟫'
                };
                return text.split('').map(c => mapping[c] || c).join('');
            }

            // Get thread information with error handling
            let threadInfo;
            try {
                threadInfo = await api.getThreadInfo(event.threadID);
            } catch (threadError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈:", threadError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            // Validate thread info
            if (!threadInfo || !threadInfo.participantIDs) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗀𝗋𝗈𝗎𝗉 𝖽𝖺𝗍𝖺 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽.");
            }

            let threadMem = threadInfo.participantIDs.length;
            let males = 0, females = 0, unknown = 0;

            // Count genders with error handling
            try {
                if (threadInfo.userInfo && Array.isArray(threadInfo.userInfo)) {
                    for (let u of threadInfo.userInfo) {
                        if (u.gender === "MALE") males++;
                        else if (u.gender === "FEMALE") females++;
                        else unknown++;
                    }
                }
            } catch (genderError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗈𝗎𝗇𝗍𝗂𝗇𝗀 𝗀𝖾𝗇𝖽𝖾𝗋𝗌:", genderError);
                // Continue with default values
            }

            let admins = threadInfo.adminIDs ? threadInfo.adminIDs.length : 0;
            let totalMsg = threadInfo.messageCount || 0;
            let icon = threadInfo.emoji ? threadInfo.emoji : "𝖭𝗈𝗇𝖾";
            let threadName = threadInfo.threadName ? threadInfo.threadName : "𝖴𝗇𝗇𝖺𝗆𝖾𝖽";
            let threadID = threadInfo.threadID || event.threadID;
            let approval = threadInfo.approvalMode ? "𝖮𝗇" : "𝖮𝖿𝖿";

            // Create formatted message
            let messageText = `🆔 | 𝖦𝗋𝗈𝗎𝗉 𝖨𝖣: ${threadID}
🔖 | 𝖭𝖺𝗆𝖾: ${threadName}
👑 | 𝖠𝖽𝗆𝗂𝗇𝗌: ${admins}
👥 | 𝖬𝖾𝗆𝖻𝖾𝗋𝗌: ${threadMem}
👨 | 𝖬𝖺𝗅𝖾𝗌: ${males}
👩 | 𝖥𝖾𝗆𝖺𝗅𝖾𝗌: ${females}
💬 | 𝖬𝖾𝗌𝗌𝖺𝗀𝖾𝗌: ${totalMsg}
✅ | 𝖠𝗉𝗉𝗋𝗈𝗏𝖺𝗅 𝖬𝗈𝖽𝖾: ${approval}
😀 | 𝖤𝗆𝗈𝗃𝗂: ${icon}

❤️ | 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖡𝗒: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽`;

            let formattedMessage = toMathBold(messageText);

            // Handle group image if available
            if (threadInfo.imageSrc) {
                const imagePath = __dirname + "/cache/groupinfo_" + Date.now() + ".png";
                
                try {
                    // Download image with timeout and error handling
                    await new Promise((resolve, reject) => {
                        const req = request(encodeURI(threadInfo.imageSrc))
                            .pipe(fs.createWriteStream(imagePath))
                            .on("finish", resolve)
                            .on("error", reject);

                        // Set timeout for download
                        setTimeout(() => {
                            req.destroy();
                            reject(new Error("𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗍𝗂𝗆𝖾𝗈𝗎𝗍"));
                        }, 15000);
                    });

                    // Verify file was downloaded successfully
                    if (fs.existsSync(imagePath) && fs.statSync(imagePath).size > 0) {
                        await message.reply({
                            body: formattedMessage,
                            attachment: fs.createReadStream(imagePath)
                        });

                        // Clean up image file
                        try {
                            fs.unlinkSync(imagePath);
                        } catch (cleanupError) {
                            console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖽𝖾𝗅𝖾𝗍𝖾 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝗂𝗆𝖺𝗀𝖾:", cleanupError);
                        }
                    } else {
                        throw new Error("𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖿𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                    }

                } catch (imageError) {
                    console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", imageError);
                    // Fallback to text-only response
                    await message.reply(formattedMessage);
                    
                    // Clean up if file exists
                    try {
                        if (fs.existsSync(imagePath)) {
                            fs.unlinkSync(imagePath);
                        }
                    } catch (cleanupError) {
                        console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝖺𝗂𝗅𝖾𝖽 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽:", cleanupError);
                    }
                }
            } else {
                // Text-only response if no image
                await message.reply(formattedMessage);
            }

        } catch (error) {
            console.error("💥 𝖦𝗋𝗈𝗎𝗉𝖨𝗇𝖿𝗈 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇.";
            
            if (error.message.includes('permission') || error.message.includes('access')) {
                errorMessage = "❌ 𝖡𝗈𝗍 𝗅𝖺𝖼𝗄𝗌 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌 𝗍𝗈 𝖺𝖼𝖼𝖾𝗌𝗌 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇.";
            } else if (error.message.includes('timeout')) {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
