const axios = require('axios');

module.exports = {
    config: {
        name: "imgurv2",
        aliases: [],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "tools",
        shortDescription: {
            en: "𝖴𝗉𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾/𝗏𝗂𝖽𝖾𝗈 𝗍𝗈 𝖨𝗆𝗀𝗎𝗋"
        },
        longDescription: {
            en: "𝖴𝗉𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾𝗌 𝗈𝗋 𝗏𝗂𝖽𝖾𝗈𝗌 𝗍𝗈 𝖨𝗆𝗀𝗎𝗋 𝖺𝗇𝖽 𝗀𝖾𝗍 𝗌𝗁𝖺𝗋𝖾𝖺𝖻𝗅𝖾 𝗅𝗂𝗇𝗄𝗌"
        },
        guide: {
            en: "{p}imgurv2 [𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝗂𝗆𝖺𝗀𝖾/𝗏𝗂𝖽𝖾𝗈]"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, event }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply('❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.');
            }

            // Check if there's a replied message with attachments
            if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
                return message.reply('📸 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺𝗇 𝗂𝗆𝖺𝗀𝖾 𝗈𝗋 𝗏𝗂𝖽𝖾𝗈 𝗍𝗈 𝗎𝗉𝗅𝗈𝖺𝖽!');
            }

            const attachment = event.messageReply.attachments[0];
            const link = attachment.url;

            // Check if it's an image or video
            if (!attachment.type || (attachment.type !== 'photo' && attachment.type !== 'video')) {
                return message.reply('❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗂𝗆𝖺𝗀𝖾 𝗈𝗋 𝗏𝗂𝖽𝖾𝗈!');
            }

            // Validate URL
            if (!link || !link.startsWith('http')) {
                return message.reply('❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖺𝗍𝗍𝖺𝖼𝗁𝗆𝖾𝗇𝗍 𝖴𝖱𝖫.');
            }

            const loadingMsg = await message.reply('🔄 𝖴𝗉𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗍𝗈 𝖨𝗆𝗀𝗎𝗋... 𝖯𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍.');

            try {
                // Fetch API endpoint from GitHub with timeout
                const apiConfigResponse = await axios.get(`https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json`, {
                    timeout: 20000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });

                if (!apiConfigResponse.data || !apiConfigResponse.data.csb) {
                    throw new Error('𝖠𝖯𝖨 𝖾𝗇𝖽𝗉𝗈𝗂𝗇𝗍 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽 𝗂𝗇 𝖼𝗈𝗇𝖿𝗂𝗀');
                }

                const apiUrl = `${apiConfigResponse.data.csb}/nazrul/imgur?link=${encodeURIComponent(link)}`;
                console.log(`🔗 𝖴𝗌𝗂𝗇𝗀 𝖠𝖯𝖨: ${apiUrl}`);
                
                // Upload to Imgur with timeout
                const uploadResponse = await axios.get(apiUrl, {
                    timeout: 45000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'application/json'
                    },
                    validateStatus: function (status) {
                        return status >= 200 && status < 600;
                    }
                });

                // Check response structure
                if (!uploadResponse.data) {
                    throw new Error('𝖤𝗆𝗉𝗍𝗒 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝖿𝗋𝗈𝗆 𝖨𝗆𝗀𝗎𝗋 𝖠𝖯𝖨');
                }

                let imgurLink = null;

                // Handle different response formats
                if (uploadResponse.data.uploaded && uploadResponse.data.uploaded.image) {
                    imgurLink = uploadResponse.data.uploaded.image;
                } else if (uploadResponse.data.url) {
                    imgurLink = uploadResponse.data.url;
                } else if (uploadResponse.data.link) {
                    imgurLink = uploadResponse.data.link;
                } else if (uploadResponse.data.data && uploadResponse.data.data.link) {
                    imgurLink = uploadResponse.data.data.link;
                } else if (uploadResponse.data.image) {
                    imgurLink = uploadResponse.data.image;
                }

                if (imgurLink) {
                    // Unsend loading message
                    try {
                        await message.unsendMessage(loadingMsg.messageID);
                    } catch (unsendError) {
                        console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                    }
                    
                    return message.reply(`✅ 𝖴𝗉𝗅𝗈𝖺𝖽 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅!\n\n🔗 𝖨𝗆𝗀𝗎𝗋 𝖫𝗂𝗇𝗄: ${imgurLink}\n\n📎 𝖢𝗈𝗉𝗒 𝗍𝗁𝖾 𝗅𝗂𝗇𝗄 𝖺𝗇𝖽 𝗌𝗁𝖺𝗋𝖾 𝗂𝗍!`);
                } else {
                    throw new Error('𝖴𝗉𝗅𝗈𝖺𝖽 𝖿𝖺𝗂𝗅𝖾𝖽 - 𝗇𝗈 𝗂𝗆𝖺𝗀𝖾 𝗅𝗂𝗇𝗄 𝗋𝖾𝖼𝖾𝗂𝗏𝖾𝖽');
                }

            } catch (apiError) {
                console.error("𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", apiError);
                
                // Unsend loading message
                try {
                    await message.unsendMessage(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                let errorMessage = '⚠️ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗎𝗉𝗅𝗈𝖺𝖽𝗂𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.';
                
                if (apiError.code === 'ECONNABORTED') {
                    errorMessage = '⏰ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.';
                } else if (apiError.response) {
                    if (apiError.response.status === 404) {
                        errorMessage = '🔍 𝖠𝖯𝖨 𝖾𝗇𝖽𝗉𝗈𝗂𝗇𝗍 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗈𝗇𝗍𝖺𝖼𝗍 𝖺𝖽𝗆𝗂𝗇.';
                    } else if (apiError.response.status === 429) {
                        errorMessage = '🚫 𝖳𝗈𝗈 𝗆𝖺𝗇𝗒 𝗋𝖾𝗊𝗎𝖾𝗌𝗍𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.';
                    } else if (apiError.response.status >= 500) {
                        errorMessage = '🔧 𝖲𝖾𝗋𝗏𝖾𝗋 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.';
                    } else {
                        errorMessage = `🌐 𝖠𝖯𝖨 𝖾𝗋𝗋𝗈𝗋 (${apiError.response.status}). 𝖳𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.`;
                    }
                } else if (apiError.message.includes('API endpoint not found')) {
                    errorMessage = '🔧 𝖠𝖯𝖨 𝖾𝗇𝖽𝗉𝗈𝗂𝗇𝗍 𝗇𝗈𝗍 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗈𝗇𝗍𝖺𝖼𝗍 𝖺𝖽𝗆𝗂𝗇.';
                } else if (apiError.message.includes('no image link')) {
                    errorMessage = '❌ 𝖴𝗉𝗅𝗈𝖺𝖽 𝖿𝖺𝗂𝗅𝖾𝖽. 𝖳𝗁𝖾 𝗂𝗆𝖺𝗀𝖾 𝗆𝗂𝗀𝗁𝗍 𝖻𝖾 𝗍𝗈𝗈 𝗅𝖺𝗋𝗀𝖾 𝗈𝗋 𝗂𝗇𝗏𝖺𝗅𝗂𝖽.';
                } else if (apiError.message.includes('network') || apiError.message.includes('ENOTFOUND')) {
                    errorMessage = '🌐 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.';
                }
                
                return message.reply(errorMessage);
            }

        } catch (error) {
            console.error("💥 𝖨𝗆𝗀𝗎𝗋 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = '❌ 𝖠𝗇 𝗎𝗇𝖾𝗑𝗉𝖾𝖼𝗍𝖾𝖽 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.';
            
            if (error.message.includes('dependencies')) {
                errorMessage = '❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.';
            }
            
            return message.reply(errorMessage);
        }
    }
};
