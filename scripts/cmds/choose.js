module.exports = {
    config: {
        name: "choose",
        aliases: [],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "utilities",
        shortDescription: {
            en: "𝖧𝖾𝗅𝗉𝗌 𝗒𝗈𝗎 𝖼𝗁𝗈𝗈𝗌𝖾 𝖻𝖾𝗍𝗐𝖾𝖾𝗇 𝗈𝗉𝗍𝗂𝗈𝗇𝗌"
        },
        longDescription: {
            en: "𝖠𝗌𝗌𝗂𝗌𝗍𝗌 𝗂𝗇 𝗌𝖾𝗅𝖾𝖼𝗍𝗂𝗇𝗀 𝖺𝗇 𝗈𝗉𝗍𝗂𝗈𝗇 𝖿𝗋𝗈𝗆 𝗆𝗎𝗅𝗍𝗂𝗉𝗅𝖾 𝖼𝗁𝗈𝗂𝖼𝖾𝗌"
        },
        guide: {
            en: "{p}choose [𝖮𝗉𝗍𝗂𝗈𝗇 1] | [𝖮𝗉𝗍𝗂𝗈𝗇 2]"
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            const { threadID } = event;

            // Check if arguments are provided
            if (!args || args.length === 0) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗌𝗈𝗆𝖾 𝗈𝗉𝗍𝗂𝗈𝗇𝗌!\n\n𝖴𝗌𝖺𝗀𝖾: {p}choose 𝗈𝗉𝗍𝗂𝗈𝗇1 | 𝗈𝗉𝗍𝗂𝗈𝗇2");
            }

            let input = args.join(" ").trim();
            
            // Validate input length
            if (input.length === 0) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗏𝖺𝗅𝗂𝖽 𝗈𝗉𝗍𝗂𝗈𝗇𝗌!");
            }

            // Check if input contains separator
            if (!input.includes("|")) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗌𝖾𝗉𝖺𝗋𝖺𝗍𝖾 𝗈𝗉𝗍𝗂𝗈𝗇𝗌 𝗐𝗂𝗍𝗁 ' | '\n\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}choose 𝖺𝗉𝗉𝗅𝖾 | 𝖻𝖺𝗇𝖺𝗇𝖺 | 𝗈𝗋𝖺𝗇𝗀𝖾");
            }

            let array = input.split(" | ").map(option => option.trim()).filter(option => option.length > 0);
            
            // Validate number of options
            if (array.length < 2) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺𝗍 𝗅𝖾𝖺𝗌𝗍 2 𝗈𝗉𝗍𝗂𝗈𝗇𝗌!\n\n𝖴𝗌𝖺𝗀𝖾: {p}choose 𝗈𝗉𝗍𝗂𝗈𝗇1 | 𝗈𝗉𝗍𝗂𝗈𝗇2");
            }

            // Check for too many options
            if (array.length > 20) {
                return message.reply("❌ 𝖳𝗈𝗈 𝗆𝖺𝗇𝗒 𝗈𝗉𝗍𝗂𝗈𝗇𝗌! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗅𝗂𝗆𝗂𝗍 𝗍𝗈 20 𝗈𝗉𝗍𝗂𝗈𝗇𝗌 𝗈𝗋 𝗅𝖾𝗌𝗌.");
            }

            // Check for duplicate options
            const uniqueOptions = [...new Set(array)];
            if (uniqueOptions.length !== array.length) {
                return message.reply("❌ 𝖣𝗎𝗉𝗅𝗂𝖼𝖺𝗍𝖾 𝗈𝗉𝗍𝗂𝗈𝗇𝗌 𝖿𝗈𝗎𝗇𝖽! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗎𝗇𝗂𝗊𝗎𝖾 𝗈𝗉𝗍𝗂𝗈𝗇𝗌.");
            }

            // Validate option lengths
            const invalidOptions = array.filter(option => option.length > 100);
            if (invalidOptions.length > 0) {
                return message.reply("❌ 𝖲𝗈𝗆𝖾 𝗈𝗉𝗍𝗂𝗈𝗇𝗌 𝖺𝗋𝖾 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗅𝗂𝗆𝗂𝗍 𝖾𝖺𝖼𝗁 𝗈𝗉𝗍𝗂𝗈𝗇 𝗍𝗈 100 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌 𝗈𝗋 𝗅𝖾𝗌𝗌.");
            }

            console.log(`🎯 𝖢𝗁𝗈𝗈𝗌𝗂𝗇𝗀 𝖿𝗋𝗈𝗆 ${array.length} 𝗈𝗉𝗍𝗂𝗈𝗇𝗌:`, array);

            // Random selection with proper randomization
            const randomIndex = Math.floor(Math.random() * array.length);
            const selected = array[randomIndex];

            // Create response message
            const optionsList = array.map((option, index) => `${index + 1}. ${option}`).join('\n');
            const result = `🎯 𝖱𝖺𝗇𝖽𝗈𝗆 𝖲𝖾𝗅𝖾𝖼𝗍𝗂𝗈𝗇 𝖱𝖾𝗌𝗎𝗅𝗍:\n\n📋 𝖮𝗉𝗍𝗂𝗈𝗇𝗌:\n${optionsList}\n\n✨ 𝖲𝖾𝗅𝖾𝖼𝗍𝖾𝖽: "${selected}"\n\n🤔 𝖨 𝗍𝗁𝗂𝗇𝗄 "${selected}" 𝗂𝗌 𝗍𝗁𝖾 𝖻𝖾𝗌𝗍 𝖼𝗁𝗈𝗂𝖼𝖾 𝖿𝗈𝗋 𝗒𝗈𝗎!`;

            return message.reply(result);

        } catch (error) {
            console.error("💥 𝖢𝗁𝗈𝗈𝗌𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝗋𝖾𝗊𝗎𝖾𝗌𝗍";
            
            if (error.message.includes('memory') || error.message.includes('heap')) {
                errorMessage = "❌ 𝖬𝖾𝗆𝗈𝗋𝗒 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝗐𝗂𝗍𝗁 𝖿𝖾𝗐𝖾𝗋 𝗈𝗉𝗍𝗂𝗈𝗇𝗌.";
            } else if (error.message.includes('timeout')) {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            return message.reply(errorMessage);
        }
    }
};
