const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
    config: {
        name: "bday",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "system",
        shortDescription: {
            en: "𝖬𝗒 𝖻𝗂𝗋𝗍𝗁𝖽𝖺𝗒 𝖼𝗈𝗎𝗇𝗍𝖽𝗈𝗐𝗇"
        },
        longDescription: {
            en: "𝖲𝗁𝗈𝗐𝗌 𝖼𝗈𝗎𝗇𝗍𝖽𝗈𝗐𝗇 𝗍𝗈 𝗆𝗒 𝖻𝗂𝗋𝗍𝗁𝖽𝖺𝗒"
        },
        guide: {
            en: "{p}bday"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event }) {
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
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            // Set target date to December 9, 2025 (next birthday)
            const targetDate = Date.parse("December 9, 2025 00:00:00");
            const now = Date.parse(new Date());
            const t = targetDate - now;

            if (t <= 0) {
                return message.reply("🎉 𝖳𝗈𝖽𝖺𝗒 𝗂𝗌 𝗆𝗒 𝖡𝗂𝗋𝗍𝗁𝖽𝖺𝗒! 𝖳𝗁𝖺𝗇𝗄 𝗒𝗈𝗎 𝖾𝗏𝖾𝗋𝗒𝗈𝗇𝖾! 🎂❤️");
            }

            const seconds = Math.floor((t / 1000) % 60);
            const minutes = Math.floor((t / 1000 / 60) % 60);
            const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            const days = Math.floor(t / (1000 * 60 * 60 * 24));

            // Use mathematical bold script for dark stylish font
            const mathBold = text => {
                return text.replace(/[a-zA-Z]/g, char => {
                    const code = char.charCodeAt(0);
                    if (char >= 'A' && char <= 'Z') {
                        return String.fromCodePoint(0x1D468 + (code - 65));
                    } else if (char >= 'a' && char <= 'z') {
                        return String.fromCodePoint(0x1D482 + (code - 97));
                    }
                    return char;
                });
            };

            const messageText = 
                `🎂 ${mathBold("My Birthday Countdown")} 🎂\n\n` +
                `📆 ${days} ${mathBold("days")}\n` +
                `⏰ ${hours} ${mathBold("hours")}\n` +
                `⏱️ ${minutes} ${mathBold("minutes")}\n` +
                `⏲️ ${seconds} ${mathBold("seconds")}\n\n` +
                `❤️ ${mathBold("Thank you for the wishes!")} ❤️`;

            // Use Facebook profile picture with access token and error handling
            const profileImageURL = 'https://graph.facebook.com/61571630409265/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662';
            
            let imageStream;
            try {
                imageStream = await global.utils.getStreamFromURL(profileImageURL);
                
                if (!imageStream) {
                    throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗂𝗆𝖺𝗀𝖾 𝗌𝗍𝗋𝖾𝖺𝗆");
                }

                await message.reply({
                    body: messageText,
                    attachment: imageStream
                });

            } catch (imageError) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝗌𝗍𝗋𝖾𝖺𝗆 𝖾𝗋𝗋𝗈𝗋:", imageError.message);
                
                // Fallback: send text-only message
                await message.reply({
                    body: messageText + `\n\n📸 𝖨𝗆𝖺𝗀𝖾 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾, 𝖻𝗎𝗍 𝗁𝖾𝗋𝖾'𝗌 𝗍𝗁𝖾 𝖼𝗈𝗎𝗇𝗍𝖽𝗈𝗐𝗇!`
                });
            }

        } catch (error) {
            console.error("💥 𝖡𝖣𝖠𝖸 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝖻𝗂𝗋𝗍𝗁𝖽𝖺𝗒 𝖼𝗈𝗎𝗇𝗍𝖽𝗈𝗐𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('getStreamFromURL')) {
                errorMessage = "❌ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            } else if (error.message.includes('Date.parse')) {
                errorMessage = "❌ 𝖣𝖺𝗍𝖾 𝖼𝖺𝗅𝖼𝗎𝗅𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
