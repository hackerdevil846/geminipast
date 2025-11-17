module.exports = {
    config: {
        name: "fuckyou",
        aliases: ["fy", "middlefinger"],
        version: "2.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "Auto-reply to fuck trigger"
        },
        longDescription: {
            en: "Automatically responds with middle finger when someone says fuck"
        },
        guide: {
            en: "[auto-trigger]"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, event }) {
        try {
            if (event.body?.toLowerCase().trim() === "fuck") {
                await message.reply({
                    body: "🖕 Fuck you too!",
                    attachment: [
                        await global.utils.getStreamFromURL(
                            "https://i.imgur.com/9bNeakd.gif"
                        )
                    ]
                });
            }
        } catch (err) {
            console.error("FuckYou Error:", err);
            await message.reply("Something went wrong! Please try again.");
        }
    },

    onChat: async function({ message, event }) {
        try {
            if (event.body?.toLowerCase().trim() === "fuck") {
                await message.reply({
                    body: "🖕 Fuck you too!",
                    attachment: [
                        await global.utils.getStreamFromURL(
                            "https://i.imgur.com/9bNeakd.gif"
                        )
                    ]
                });
            }
        } catch (err) {
            console.error("FuckYou Chat Error:", err);
        }
    }
};
