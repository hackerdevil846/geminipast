const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "programmer",
        aliases: [],
        version: "2.3.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "𝖠𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗉𝗋𝗈𝗀𝗋𝖺𝗆𝗆𝖾𝗋 𝗆𝖾𝗆𝖾𝗌"
        },
        longDescription: {
            en: "𝖠𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗉𝗋𝗈𝗀𝗋𝖺𝗆𝗆𝖾𝗋 𝗆𝖾𝗆𝖾𝗌"
        },
        guide: {
            en: ""
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ api }) {
        try {
            // 𝖣𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗒 𝖼𝗁𝖾𝖼𝗄
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
                return;
            }
            
            console.log("✅ 𝖯𝗋𝗈𝗀𝗋𝖺𝗆𝗆𝖾𝗋 𝗆𝗈𝖽𝗎𝗅𝖾 𝗅𝗈𝖺𝖽𝖾𝖽");
            
        } catch (error) {
            console.error("💥 𝖨𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖺𝗍𝗂𝗈𝗇 𝖤𝗋𝗋𝗈𝗋:", error);
        }
    },

    onChat: async function({ event, api }) {
        try {
            const { threadID, body, senderID, messageID } = event;
            
            // 𝖨𝗀𝗇𝗈𝗋𝖾 𝖻𝗈𝗍'𝗌 𝗈𝗐𝗇 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌
            if (senderID === api.getCurrentUserID()) return;

            const content = body ? body.toLowerCase().trim() : '';
            if (!content) return;

            // 𝖲𝗂𝗆𝗉𝗅𝗂𝖿𝗂𝖾𝖽 𝗍𝗋𝗂𝗀𝗀𝖾𝗋 𝗐𝗈𝗋𝖽𝗌 - 𝗈𝗇𝗅𝗒 𝗆𝗈𝗌𝗍 𝖼𝗈𝗆𝗆𝗈𝗇
            const triggerWords = [
                "coding", "programmer", "debug", "bug", "code", 
                "developer", "programming", "github", "javascript",
                "python", "java", "html", "css", "error"
            ];

            // 𝖢𝗁𝖾𝖼𝗄 𝗂𝖿 𝖺𝗇𝗒 𝗍𝗋𝗂𝗀𝗀𝖾𝗋 𝗐𝗈𝗋𝖽 𝗂𝗌 𝗎𝗌𝖾𝖽
            const hasTriggerWord = triggerWords.some(word => 
                content.includes(word.toLowerCase())
            );

            if (hasTriggerWord) {
                console.log(`🔍 𝖯𝗋𝗈𝗀𝗋𝖺𝗆𝗆𝖾𝗋 𝗍𝗋𝗂𝗀𝗀𝖾𝗋𝖾𝖽: ${content}`);
                
                // 𝖯𝗋𝗈𝗀𝗋𝖺𝗆𝗆𝖾𝗋 𝗆𝖾𝗆𝖾 𝗏𝗂𝖽𝖾𝗈𝗌
                const videoLinks = [
                    "https://i.imgur.com/ymvcyfg.mp4"
                ];
                
                // 𝖲𝖾𝗅𝖾𝖼𝗍 𝗋𝖺𝗇𝖽𝗈𝗆 𝗏𝗂𝖽𝖾𝗈
                const randomVideo = videoLinks[Math.floor(Math.random() * videoLinks.length)];
                
                try {
                    // 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗏𝗂𝖽𝖾𝗈 𝗐𝗂𝗍𝗁 𝗍𝗂𝗆𝖾𝗈𝗎𝗍
                    console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗏𝗂𝖽𝖾𝗈: ${randomVideo}`);
                    
                    const response = await axios.get(randomVideo, {
                        responseType: 'stream',
                        timeout: 10000, // 10 𝗌𝖾𝖼𝗈𝗇𝖽 𝗍𝗂𝗆𝖾𝗈𝗎𝗍
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });

                    // 𝖲𝖾𝗇𝖽 𝗋𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗌𝗍𝗋𝖾𝖺𝗆
                    await api.sendMessage({
                        body: "💻 𝖯𝗋𝗈𝗀𝗋𝖺𝗆𝗆𝖾𝗋 𝗅𝗂𝖿𝖾! 🤓\n\n𝖢𝗈𝖽𝗂𝗇𝗀 𝗂𝗌 𝖿𝗎𝗇! 🚀",
                        attachment: response.data
                    }, threadID, messageID);

                    console.log("✅ 𝖯𝗋𝗈𝗀𝗋𝖺𝗆𝗆𝖾𝗋 𝗏𝗂𝖽𝖾𝗈 𝗌𝖾𝗇𝗍 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                    
                } catch (error) {
                    console.error("❌ 𝖵𝗂𝖽𝖾𝗈 𝖾𝗋𝗋𝗈𝗋:", error.message);
                    
                    // 𝖥𝖺𝗅𝗅𝖻𝖺𝖼𝗄: 𝗌𝖾𝗇𝖽 𝗍𝖾𝗑𝗍 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾
                    try {
                        await api.sendMessage(
                            "💻 𝖯𝗋𝗈𝗀𝗋𝖺𝗆𝗆𝖾𝗋 𝗅𝗂𝖿𝖾! 🤓\n\n𝖢𝗈𝖽𝗂𝗇𝗀 𝗂𝗌 𝖿𝗎𝗇! 🚀\n\n(𝖵𝗂𝖽𝖾𝗈 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾)",
                            threadID,
                            messageID
                        );
                    } catch (fallbackError) {
                        console.error("❌ 𝖥𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖾𝗋𝗋𝗈𝗋:", fallbackError.message);
                    }
                }
            }
        } catch (error) {
            console.error("💥 𝖯𝗋𝗈𝗀𝗋𝖺𝗆𝗆𝖾𝗋 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
        }
    }
};
