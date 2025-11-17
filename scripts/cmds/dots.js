module.exports = {
    config: {
        name: "dot",
        aliases: ["animation", "dots"],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 7,
        role: 2,
        category: "fun",
        shortDescription: {
            en: "War In Chatbox Animation"
        },
        longDescription: {
            en: "Displays a sequence of animated dots and symbols in the chatbox"
        },
        guide: {
            en: "{p}dot"
        },
        dependencies: {
            "fs-extra": "",
            "axios": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // Animation sequence
            const animation = [
                { delay: 1000, text: "." },
                { delay: 2000, text: "." },
                { delay: 3000, text: "#" },
                { delay: 4000, text: "/" },
                { delay: 5000, text: "/" },
                { delay: 6000, text: "/" },
                { delay: 7000, text: "#" },
                { delay: 8000, text: "." },
                { delay: 9000, text: "." },
                { delay: 10000, text: "😘" },
                { delay: 12000, text: "." },
                { delay: 14000, text: "." },
                { delay: 16000, text: "." },
                { delay: 18000, text: "." },
                { delay: 20000, text: "." },
                { delay: 22000, text: "." },
                { delay: 25000, text: "." },
                { delay: 27000, text: "." },
                { delay: 30000, text: "." },
                { delay: 34000, text: "." },
                { delay: 36000, text: "." },
                { delay: 38000, text: "." },
                { delay: 40000, text: "." },
                { delay: 43000, text: "." },
                { delay: 46000, text: "." },
                { delay: 48000, text: "." },
                { delay: 49900, text: "." },
                { delay: 50500, text: "." },
                { delay: 51000, text: "." }
            ];

            // Execute animation
            for (const frame of animation) {
                await new Promise(resolve => setTimeout(resolve, frame.delay));
                await message.reply(frame.text);
            }

        } catch (error) {
            console.error("Error in dot command:", error);
            await message.reply("❌ An error occurred while executing the animation.");
        }
    }
};
