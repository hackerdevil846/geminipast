module.exports = {
    config: {
        name: "trans",
        aliases: [],
        version: "1.0.1",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "𝖳𝖾𝗑𝗍 𝗍𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝗂𝗈𝗇 𝗐𝗂𝗍𝗁 𝖺𝗎𝗍𝗈-𝖽𝖾𝗍𝖾𝖼𝗍 𝖺𝗇𝖽 𝗆𝗎𝗅𝗍𝗂𝗅𝗂𝗇𝗀𝗎𝖺𝗅 𝗌𝗎𝗉𝗉𝗈𝗋𝗍"
        },
        longDescription: {
            en: "𝖳𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝖾 𝗍𝖾𝗑𝗍 𝖻𝖾𝗍𝗐𝖾𝖾𝗇 𝖽𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝗅𝖺𝗇𝗀𝗎𝖺𝗀𝖾𝗌 𝗐𝗂𝗍𝗁 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼 𝖽𝖾𝗍𝖾𝖼𝗍𝗂𝗈𝗇"
        },
        guide: {
            en: "{p}trans [𝗅𝖺𝗇𝗀] [𝗍𝖾𝗑𝗍] 𝖮𝖱 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝗆𝖾𝗌𝗌𝖺𝗀𝖾"
        },
        dependencies: {
            "request": ""
        }
    },

    onStart: async function({ api, event, args, message }) {
        try {
            // Dependency check
            let requestAvailable = true;
            try {
                require("request");
            } catch (e) {
                requestAvailable = false;
            }

            if (!requestAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝗋𝖾𝗊𝗎𝖾𝗌𝗍.");
            }

            const request = global.nodemodule["request"];
            
            let content;
            let targetLang = args[0]?.toLowerCase();

            // Supported languages list with full names - Bengali (bn) included
            const supportedLangs = {
                "en": "English", "es": "Spanish", "fr": "French", "de": "German", 
                "ja": "Japanese", "ko": "Korean", "zh": "Chinese", "vi": "Vietnamese", 
                "ar": "Arabic", "hi": "Hindi", "bn": "Bengali", "ru": "Russian",
                "pt": "Portuguese", "it": "Italian", "tr": "Turkish", "th": "Thai",
                "id": "Indonesian", "nl": "Dutch", "pl": "Polish", "uk": "Ukrainian"
            };

            // Show help if no arguments
            if (args.length === 0) {
                const langList = Object.entries(supportedLangs)
                    .map(([code, name]) => `• ${code} - ${name}`)
                    .join('\n');
                
                return message.reply(
                    "🌐 𝖳𝖱𝖠𝖭𝖲𝖫𝖠𝖳𝖨𝖮𝖭 𝖧𝖤𝖫𝖯\n\n" +
                    "𝖴𝗌𝖺𝗀𝖾:\n" +
                    "• {p}translate [𝗅𝖺𝗇𝗀] [𝗍𝖾𝗑𝗍]\n" +
                    "• {p}translate [𝗅𝖺𝗇𝗀] (𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝗆𝖾𝗌𝗌𝖺𝗀𝖾)\n\n" +
                    "𝖲𝗎𝗉𝗉𝗈𝗋𝗍𝖾𝖽 𝖫𝖺𝗇𝗀𝗎𝖺𝗀𝖾𝗌:\n" +
                    langList + "\n\n" +
                    "𝖤𝗑𝖺𝗆𝗉𝗅𝖾𝗌:\n" +
                    "• {p}translate es Hello world\n" +
                    "• {p}translate bn Hello world\n" +
                    "• {p}translate ja (𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝗆𝖾𝗌𝗌𝖺𝗀𝖾)"
                );
            }

            if (event.messageReply) {
                content = event.messageReply.body?.trim();
                if (supportedLangs[targetLang]) {
                    args.shift();
                } else {
                    targetLang = "en"; // Default language
                }
            } else {
                if (supportedLangs[targetLang]) {
                    args.shift();
                    content = args.join(" ").trim();
                } else {
                    targetLang = "en";
                    content = args.join(" ").trim();
                }
            }

            if (!content) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗍𝖾𝗑𝗍 𝗈𝗋 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗍𝗈 𝗍𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝖾!");
            }

            // Validate content length
            if (content.length > 2000) {
                return message.reply("❌ 𝖳𝖾𝗑𝗍 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 2000 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
            }

            if (content.length < 1) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗏𝖺𝗅𝗂𝖽 𝗍𝖾𝗑𝗍 𝗍𝗈 𝗍𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝖾.");
            }

            const loadingMsg = await message.reply("⏳ 𝖳𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝗂𝗇𝗀...");

            // Encode content for URL
            const encodedContent = encodeURIComponent(content);
            const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodedContent}`;

            console.log(`🌐 𝖳𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝗂𝗇𝗀: "${content.substring(0, 50)}..." → ${targetLang}`);

            return request({
                url: apiUrl,
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            }, 
            async (err, response, body) => {
                // Unsend loading message
                try {
                    await api.unsendMessage(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                if (err) {
                    console.error("❌ 𝖳𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", err);
                    return message.reply("❌ 𝖳𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋: " + err.message);
                }

                if (response.statusCode !== 200) {
                    console.error(`❌ 𝖠𝖯𝖨 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝖾𝗋𝗋𝗈𝗋: ${response.statusCode}`);
                    return message.reply(`❌ 𝖳𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝗂𝗈𝗇 𝗌𝖾𝗋𝗏𝗂𝖼𝖾 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 (${response.statusCode}). 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.`);
                }

                try {
                    const result = JSON.parse(body);
                    
                    if (!result || !result[0] || !Array.isArray(result[0])) {
                        throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖠𝖯𝖨 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝖿𝗈𝗋𝗆𝖺𝗍");
                    }

                    const translation = result[0].map(item => item[0]).join('');
                    const sourceLang = result[2] || "auto";
                    const sourceLangName = supportedLangs[sourceLang] || sourceLang;
                    const targetLangName = supportedLangs[targetLang] || targetLang;

                    // Validate translation result
                    if (!translation || translation.trim() === "") {
                        throw new Error("𝖤𝗆𝗉𝗍𝗒 𝗍𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝗂𝗈𝗇 𝗋𝖾𝗌𝗎𝗅𝗍");
                    }

                    console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗍𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝖾𝖽 ${sourceLang} → ${targetLang}`);

                    await message.reply(
                        `🌐 𝖳𝖱𝖠𝖭𝖲𝖫𝖠𝖳𝖨𝖮𝖭 𝖱𝖤𝖲𝖴𝖫𝖳\n\n` +
                        `📜 𝖮𝗋𝗂𝗀𝗂𝗇𝖺𝗅 (${sourceLangName}):\n"${content}"\n\n` +
                        `🔄 𝖳𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝖾𝖽 (${targetLangName}):\n"${translation}"\n\n` +
                        `✨ 𝖳𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝖾𝖽 𝖻𝗒: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽`
                    );

                } catch (parseError) {
                    console.error("❌ 𝖯𝖺𝗋𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", parseError);
                    await message.reply("❌ 𝖳𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝗂𝗈𝗇 𝖿𝖺𝗂𝗅𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
                }
            });

        } catch (error) {
            console.error("💥 𝖳𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
