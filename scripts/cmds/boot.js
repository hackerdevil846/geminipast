const axios = require("axios");

module.exports = {
    config: {
        name: "boot",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "𝖪𝗂𝖼𝗄 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝗐𝗂𝗍𝗁 𝖿𝗎𝗇𝗇𝗒 𝖺𝗇𝗂𝗆𝖺𝗍𝗂𝗈𝗇"
        },
        longDescription: {
            en: "𝖲𝖾𝗇𝖽 𝖺 𝖿𝗎𝗇𝗇𝗒 𝖻𝗈𝗈𝗍 𝖺𝗇𝗂𝗆𝖺𝗍𝗂𝗈𝗇 𝗐𝗁𝖾𝗇 𝗍𝖺𝗀𝗀𝗂𝗇𝗀 𝗌𝗈𝗆𝖾𝗈𝗇𝖾"
        },
        guide: {
            en: "{p}boot @𝗍𝖺𝗀"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function ({ message, event }) {
        try {
            // Dependency check
            let axiosAvailable = true;
            try {
                require("axios");
            } catch (e) {
                axiosAvailable = false;
            }

            if (!axiosAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
            }

            const { mentions, senderID } = event;
            const mention = Object.keys(mentions);
            
            if (!mention[0]) {
                return message.reply("👟 𝖳𝖺𝗀 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝗍𝗈 𝖻𝗈𝗈𝗍!");
            }

            const userId = mention[0];
            
            // Don't allow booting yourself
            if (userId === senderID) {
                return message.reply("❌ 𝖸𝗈𝗎 𝖼𝖺𝗇'𝗍 𝖻𝗈𝗈𝗍 𝗒𝗈𝗎𝗋𝗌𝖾𝗅𝖿! 𝖳𝖺𝗀 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝖾𝗅𝗌𝖾.");
            }

            const tag = mentions[userId].replace("@", "").trim();
            
            // Validate tag name
            if (!tag || tag.length === 0) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗍𝖺𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝖺𝗀 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗎𝗌𝖾𝗋.");
            }

            // List of reliable boot GIFs
            const gifLinks = [
                "https://i.postimg.cc/65TSxJYD/2ce5a017f6556ff103bce87b273b89b7.gif",
                "https://i.postimg.cc/65SP9jPT/Anime-083428-6224795.gif",
                "https://i.postimg.cc/RFXP2XfS/jXOwoHx.gif",
                "https://i.postimg.cc/jSPMRsNk/tumblr-nyc5ygy2a-Z1uz35lto1-540.gif",
            ];
            
            let gifStream = null;
            let lastError = null;

            // Try each GIF until one works
            for (const gifUrl of gifLinks) {
                try {
                    console.log(`🔗 𝖳𝗋𝗒𝗂𝗇𝗀 𝖦𝖨𝖥: ${gifUrl}`);
                    gifStream = await global.utils.getStreamFromURL(gifUrl);
                    if (gifStream) {
                        console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗅𝗈𝖺𝖽𝖾𝖽 𝖦𝖨𝖥`);
                        break;
                    }
                } catch (gifError) {
                    lastError = gifError;
                    console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝖦𝖨𝖥 ${gifUrl}:`, gifError.message);
                    continue;
                }
            }

            if (!gifStream) {
                console.error("💥 𝖠𝗅𝗅 𝖦𝖨𝖥𝗌 𝖿𝖺𝗂𝗅𝖾𝖽:", lastError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝖻𝗈𝗈𝗍 𝖺𝗇𝗂𝗆𝖺𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            // Boot messages with variety
            const bootMessages = [
                `${tag} 𝗀𝖾𝗍 𝖻𝗈𝗈𝗍𝖾𝖽! 👢`,
                `${tag} 𝗍𝖺𝗄𝖾 𝗍𝗁𝖺𝗍 𝖻𝗈𝗈𝗍! 🥾`,
                `${tag} 𝖻𝗈𝗈𝗍𝖾𝖽 𝗍𝗈 𝗍𝗁𝖾 𝖼𝗎𝗋𝖻! 👟`,
                `${tag} 𝗀𝗈𝗍 𝖺 𝗍𝖺𝗌𝗍𝖾 𝗈𝖿 𝗆𝗒 𝖻𝗈𝗈𝗍! 👢`
            ];
            
            const randomMessage = bootMessages[Math.floor(Math.random() * bootMessages.length)];
            
            await message.reply({
                body: randomMessage,
                mentions: [{
                    tag: tag,
                    id: userId
                }],
                attachment: gifStream
            });
            
            console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖻𝗈𝗈𝗍𝖾𝖽 ${tag} (${userId})`);

        } catch (error) {
            console.error("💥 𝖡𝗈𝗈𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝖻𝗈𝗈𝗍𝗂𝗇𝗀.";
            
            if (error.message.includes('getStreamFromURL')) {
                errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝖺𝗇𝗂𝗆𝖺𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            } else if (error.message.includes('mentions')) {
                errorMessage = "❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗎𝗌𝖾𝗋 𝗍𝖺𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝖺𝗀 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗎𝗌𝖾𝗋.";
            }
            
            // Don't send error message to avoid spam, just log it
        }
    }
};
