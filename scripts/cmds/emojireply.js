module.exports = {
    config: {
        name: "emojireply",
        aliases: [],
        version: "1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 0,
        role: 0,
        shortDescription: {
            en: "𝖠𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖾𝗆𝗈𝗃𝗂 𝗐𝗂𝗍𝗁 𝗋𝖺𝗇𝖽𝗈𝗆 𝖾𝗆𝗈𝗃𝗂 𝗉𝖺𝗂𝗋𝗌"
        },
        longDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗋𝖾𝗉𝗅𝗂𝖾𝗌 𝗍𝗈 𝖺𝗇𝗒 𝖾𝗆𝗈𝗃𝗂 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗋𝖺𝗇𝖽𝗈𝗆 𝖾𝗆𝗈𝗃𝗂 𝖼𝗈𝗆𝖻𝗂𝗇𝖺𝗍𝗂𝗈𝗇𝗌"
        },
        category: "fun",
        guide: {
            en: "𝖴𝗌𝖾 '𝖾𝗆𝗈𝗃𝗂𝗋𝖾𝗉𝗅𝗒 𝗈𝗇' 𝗍𝗈 𝖾𝗇𝖺𝖻𝗅𝖾 𝗈𝗋 '𝖾𝗆𝗈𝗃𝗂𝗋𝖾𝗉𝗅𝗒 𝗈𝖿𝖿' 𝗍𝗈 𝖽𝗂𝗌𝖺𝖻𝗅𝖾. 𝖣𝖾𝖿𝖺𝗎𝗅𝗍 𝗂𝗌 𝗈𝖿𝖿."
        }
    },

    // Store the enabled state per thread
    threadStates: {},

    onStart: async function({ event }) {
        try {
            // Initialize as off by default
            this.threadStates[event.threadID] = false;
            console.log(`✅ 𝖤𝗆𝗈𝗃𝗂𝗋𝖾𝗉𝗅𝗒 𝗂𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖾𝖽 𝖿𝗈𝗋 𝗍𝗁𝗋𝖾𝖺𝖽: ${event.threadID}`);
        } catch (error) {
            console.error("💥 𝖤𝗆𝗈𝗃𝗂𝗋𝖾𝗉𝗅𝗒 𝗈𝗇𝖲𝗍𝖺𝗋𝗍 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    },

    onChat: async function({ api, event, args, message }) {
        try {
            const threadID = event.threadID;
            const messageBody = event.body;
            
            if (!messageBody) return;

            // Initialize thread state if not exists
            if (this.threadStates[threadID] === undefined) {
                this.threadStates[threadID] = false;
                console.log(`🔄 𝖳𝗁𝗋𝖾𝖺𝖽 ${threadID} 𝗌𝗍𝖺𝗍𝖾 𝗂𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖾𝖽`);
            }

            // Handle the command to toggle on/off
            if (messageBody.toLowerCase().startsWith("emojireply")) {
                const commandParts = messageBody.toLowerCase().split(" ");
                const command = commandParts[1];
                
                if (command === "on") {
                    this.threadStates[threadID] = true;
                    console.log(`✅ 𝖤𝗆𝗈𝗃𝗂𝗋𝖾𝗉𝗅𝗒 𝖾𝗇𝖺𝖻𝗅𝖾𝖽 𝖿𝗈𝗋 𝗍𝗁𝗋𝖾𝖺𝖽: ${threadID}`);
                    await message.reply("𝖤𝗆𝗈𝗃𝗂 𝗋𝖾𝗉𝗅𝗒 𝗆𝗈𝖽𝖾 𝗂𝗌 𝗇𝗈𝗐 𝖮𝖭 ✅");
                    return;
                } else if (command === "off") {
                    this.threadStates[threadID] = false;
                    console.log(`❌ 𝖤𝗆𝗈𝗃𝗂𝗋𝖾𝗉𝗅𝗒 𝖽𝗂𝗌𝖺𝖻𝗅𝖾𝖽 𝖿𝗈𝗋 𝗍𝗁𝗋𝖾𝖺𝖽: ${threadID}`);
                    await message.reply("𝖤𝗆𝗈𝗃𝗂 𝗋𝖾𝗉𝗅𝗒 𝗆𝗈𝖽𝖾 𝗂𝗌 𝗇𝗈𝗐 𝖮𝖥𝖥 ❌");
                    return;
                } else if (command === "status") {
                    const status = this.threadStates[threadID] ? "𝖮𝖭 ✅" : "𝖮𝖥𝖥 ❌";
                    await message.reply(`𝖤𝗆𝗈𝗃𝗂 𝗋𝖾𝗉𝗅𝗒 𝗆𝗈𝖽𝖾 𝗂𝗌 𝖼𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 ${status}`);
                    return;
                } else {
                    // Show help and current status
                    const status = this.threadStates[threadID] ? "𝖮𝖭 ✅" : "𝖮𝖥𝖥 ❌";
                    await message.reply(
                        `𝖤𝗆𝗈𝗃𝗂 𝗋𝖾𝗉𝗅𝗒 𝗆𝗈𝖽𝖾: ${status}\n\n` +
                        "𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌:\n" +
                        "• 𝖾𝗆𝗈𝗃𝗂𝗋𝖾𝗉𝗅𝗒 𝗈𝗇 - 𝖤𝗇𝖺𝖻𝗅𝖾 𝖺𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒\n" +
                        "• 𝖾𝗆𝗈𝗃𝗂𝗋𝖾𝗉𝗅𝗒 𝗈𝖿𝖿 - 𝖣𝗂𝗌𝖺𝖻𝗅𝖾 𝖺𝗎𝗍𝗈-𝗋𝖾𝗉𝗅𝗒\n" +
                        "• 𝖾𝗆𝗈𝗃𝗂𝗋𝖾𝗉𝗅𝗒 𝗌𝗍𝖺𝗍𝗎𝗌 - 𝖲𝗁𝗈𝗐 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗌𝗍𝖺𝗍𝗎𝗌"
                    );
                    return;
                }
            }

            // Check if emoji reply is enabled for this thread
            if (!this.threadStates[threadID]) {
                return;
            }

            // Don't reply to bot's own messages
            if (event.senderID === api.getCurrentUserID()) {
                return;
            }

            // Check if the message consists only of emojis
            const emojiRegex = /^(\p{Emoji}|\p{Emoji_Presentation}|\p{Emoji_Modifier}|\p{Emoji_Modifier_Base}|\p{Emoji_Component})+$/u;
            
            if (emojiRegex.test(messageBody.trim())) {
                console.log(`🎭 𝖣𝖾𝗍𝖾𝖼𝗍𝖾𝖽 𝖾𝗆𝗈𝗃𝗂 𝗆𝖾𝗌𝗌𝖺𝗀𝖾: ${messageBody}`);

                // Generate random emoji pairs
                const emojiPairs = [
                    ["😊", "😎"],
                    ["❤️", "✨"],
                    ["😂", "🤣"],
                    ["👍", "👌"],
                    ["🐐", "🤖"],
                    ["🌞", "🌝"],
                    ["🍎", "🍏"],
                    ["⚡", "🔥"],
                    ["🙈", "🙉"],
                    ["🎉", "🎊"],
                    ["🤔", "🤨"],
                    ["🥳", "🎂"],
                    ["🍕", "🍔"],
                    ["🚀", "👽"],
                    ["💯", "🔥"],
                    ["🧠", "💡"],
                    ["👀", "👉"],
                    ["🤝", "👏"],
                    ["💔", "❤️‍🩹"],
                    ["🤯", "😵"],
                    ["🎮", "👾"],
                    ["📚", "✏️"],
                    ["🎵", "🎶"],
                    ["🏆", "⭐"],
                    ["🌙", "🌟"],
                    ["🍦", "🍩"],
                    ["🏀", "⚽"],
                    ["🎯", "🎪"],
                    ["🌈", "☁️"],
                    ["🦄", "🐲"]
                ];

                try {
                    // Select a random pair
                    const randomPair = emojiPairs[Math.floor(Math.random() * emojiPairs.length)];
                    
                    // Add a small delay to make it feel more natural
                    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
                    
                    // Reply with the emoji pair
                    await message.reply(randomPair.join(' '));
                    console.log(`✅ 𝖱𝖾𝗉𝗅𝗂𝖾𝖽 𝗐𝗂𝗍𝗁: ${randomPair.join(' ')}`);
                    
                } catch (replyError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝖾𝗆𝗈𝗃𝗂 𝗋𝖾𝗉𝗅𝗒:", replyError.message);
                }
            }

        } catch (error) {
            console.error("💥 𝖤𝗆𝗈𝗃𝗂𝗋𝖾𝗉𝗅𝗒 𝖼𝗁𝖺𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    },

    // Clean up when thread is removed
    onThreadRemove: function({ event }) {
        try {
            const threadID = event.threadID;
            if (this.threadStates[threadID]) {
                delete this.threadStates[threadID];
                console.log(`🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝗁𝗋𝖾𝖺𝖽 𝗌𝗍𝖺𝗍𝖾: ${threadID}`);
            }
        } catch (error) {
            console.error("💥 𝖤𝗆𝗈𝗃𝗂𝗋𝖾𝗉𝗅𝗒 𝗍𝗁𝗋𝖾𝖺𝖽 𝗋𝖾𝗆𝗈𝗏𝖺𝗅 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    }
};
