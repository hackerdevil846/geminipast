module.exports = {
    config: {
        name: "luckynum",
        aliases: [],
        version: "1.0.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 0,
        category: "game",
        shortDescription: {
            en: "𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝗒𝗈𝗎𝗋 𝗅𝗎𝖼𝗄𝗒 𝗇𝗎𝗆𝖻𝖾𝗋 𝗐𝗂𝗍𝗁 𝖻𝖾𝖺𝗎𝗍𝗂𝖿𝗎𝗅 𝖿𝗈𝗋𝗆𝖺𝗍𝗍𝗂𝗇𝗀"
        },
        longDescription: {
            en: "𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝗌 𝖺 𝗋𝖺𝗇𝖽𝗈𝗆 𝗅𝗎𝖼𝗄𝗒 𝗇𝗎𝗆𝖻𝖾𝗋 𝗐𝗂𝗍𝗁𝗂𝗇 𝖺 𝗌𝗉𝖾𝖼𝗂𝖿𝗂𝖾𝖽 𝗋𝖺𝗇𝗀𝖾"
        },
        guide: {
            en: "{p}luckynum\n{p}luckynum [𝗆𝗂𝗇] [𝗆𝖺𝗑]"
        },
        envConfig: {
            defaultRange: [0, 10]
        }
    },

    langs: {
        "en": {
            "returnResultDefault": "✨ 𝖸𝗈𝗎𝗋 𝗅𝗎𝖼𝗄𝗒 𝗇𝗎𝗆𝖻𝖾𝗋 𝗂𝗌: 【%1】 🍀",
            "invalidMax": "⚠️ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝖻𝗈𝗍𝗁 𝖲𝖳𝖠𝖱𝖳 𝖺𝗇𝖽 𝖤𝖭𝖣 𝗋𝖺𝗇𝗀𝖾 𝗇𝗎𝗆𝖻𝖾𝗋𝗌!",
            "invalidInput": "❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗂𝗇𝗉𝗎𝗍! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 𝗉𝗈𝗌𝗂𝗍𝗂𝗏𝖾 𝗇𝗎𝗆𝖻𝖾𝗋𝗌 𝗐𝗂𝗍𝗁 𝖤𝖭𝖣 > 𝖲𝖳𝖠𝖱𝖳",
            "returnResult": "🎉 𝖸𝗈𝗎𝗋 𝗅𝗎𝖼𝗄𝗒 𝗇𝗎𝗆𝖻𝖾𝗋 𝖻𝖾𝗍𝗐𝖾𝖾𝗇 %2 𝖺𝗇𝖽 %3 𝗂𝗌: 【%1】 🌈"
        }
    },

    onStart: async function({ message, args, getText }) {
        try {
            const defaultRange = this.config.envConfig.defaultRange;

            // No arguments - use default range
            if (args.length === 0) {
                const randomNum = Math.floor(Math.random() * (defaultRange[1] - defaultRange[0] + 1)) + defaultRange[0];
                return message.reply(getText("returnResultDefault", randomNum));
            }
            
            // Invalid number of arguments
            if (args.length !== 2) {
                return message.reply(getText("invalidMax"));
            }
            
            // Parse and validate input
            const min = parseInt(args[0]);
            const max = parseInt(args[1]);
            
            // Comprehensive input validation
            if (isNaN(min) || isNaN(max)) {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗇𝗎𝗆𝖻𝖾𝗋𝗌! 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗏𝖺𝗅𝗂𝖽 𝗇𝗎𝗆𝖻𝖾𝗋𝗌.");
            }
            
            if (min < 0 || max < 0) {
                return message.reply("❌ 𝖭𝗎𝗆𝖻𝖾𝗋𝗌 𝖼𝖺𝗇𝗇𝗈𝗍 𝖻𝖾 𝗇𝖾𝗀𝖺𝗍𝗂𝗏𝖾! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 𝗉𝗈𝗌𝗂𝗍𝗂𝗏𝖾 𝗇𝗎𝗆𝖻𝖾𝗋𝗌.");
            }
            
            if (max <= min) {
                return message.reply("❌ 𝖤𝖭𝖣 𝗇𝗎𝗆𝖻𝖾𝗋 𝗆𝗎𝗌𝗍 𝖻𝖾 𝗀𝗋𝖾𝖺𝗍𝖾𝗋 𝗍𝗁𝖺𝗇 𝖲𝖳𝖠𝖱𝖳 𝗇𝗎𝗆𝖻𝖾𝗋!");
            }
            
            // Check for reasonable range size
            if (max - min > 1000000) {
                return message.reply("❌ 𝖱𝖺𝗇𝗀𝖾 𝗍𝗈𝗈 𝗅𝖺𝗋𝗀𝖾! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 𝖺 𝗌𝗆𝖺𝗅𝗅𝖾𝗋 𝗋𝖺𝗇𝗀𝖾.");
            }
            
            // Check for integer overflow
            if (max > Number.MAX_SAFE_INTEGER || min > Number.MAX_SAFE_INTEGER) {
                return message.reply("❌ 𝖭𝗎𝗆𝖻𝖾𝗋𝗌 𝖺𝗋𝖾 𝗍𝗈𝗈 𝗅𝖺𝗋𝗀𝖾! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 𝗌𝗆𝖺𝗅𝗅𝖾𝗋 𝗇𝗎𝗆𝖻𝖾𝗋𝗌.");
            }
            
            // Generate random number with secure method
            const range = max - min + 1;
            const randomNum = Math.floor(Math.random() * range) + min;
            
            // Validate the generated number
            if (randomNum < min || randomNum > max || !Number.isInteger(randomNum)) {
                console.error("𝖱𝖺𝗇𝖽𝗈𝗆 𝗇𝗎𝗆𝖻𝖾𝗋 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", { min, max, randomNum });
                return message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗇𝗀 𝗅𝗎𝖼𝗄𝗒 𝗇𝗎𝗆𝖻𝖾𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }
            
            return message.reply(getText("returnResult", randomNum, min, max));
            
        } catch (error) {
            console.error("💥 𝖫𝗎𝖼𝗄𝗒 𝖭𝗎𝗆𝖻𝖾𝗋 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝗅𝗎𝖼𝗄𝗒 𝗇𝗎𝗆𝖻𝖾𝗋.";
            
            if (error.message.includes('getText')) {
                errorMessage = "❌ 𝖫𝖺𝗇𝗀𝗎𝖺𝗀𝖾 𝗌𝗒𝗌𝗍𝖾𝗆 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            } else if (error.message.includes('range') || error.message.includes('Math')) {
                errorMessage = "❌ 𝖭𝗎𝗆𝖻𝖾𝗋 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖽𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝗇𝗎𝗆𝖻𝖾𝗋𝗌.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
