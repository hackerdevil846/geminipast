const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "fyoutoo",
        aliases: [],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "auto-response",
        shortDescription: {
            en: "Fuck you too response 🖕"
        },
        longDescription: {
            en: "Automatic response when someone says fuck-related words"
        },
        guide: {
            en: "This command is auto-triggered. No manual usage needed."
        },
        dependencies: {
            "fs": "",
            "path": ""
        }
    },

    onChat: async function({ message, event }) {
        try {
            const { body } = event;
            
            // Define trigger words
            const triggers = [
                "fuck", "Fuck", "fuck you", "Fuck you", 
                "pakyu", "Pakyu", "pak you", "Pak you", 
                "pak u", "Pak u", "pak yu", "Pak yu",
                "f*ck", "F*ck", "f*ck you", "F*ck you",
                "fuk", "Fuk", "fuk you", "Fuk you"
            ];
            
            // Check if message contains any trigger word
            if (body && triggers.some(trigger => 
                body.toLowerCase().includes(trigger.toLowerCase()))) {
                
                // Path to the GIF file
                const gifPath = path.join(__dirname, "noprefix", "fuck.gif");
                
                // Check if GIF file exists
                if (!fs.existsSync(gifPath)) {
                    return message.reply("❌ Response GIF not found.");
                }
                
                // Send response
                await message.reply({
                    body: "Tumakeo fuck kori 😏",
                    attachment: fs.createReadStream(gifPath)
                });
            }
        } catch (error) {
            console.error("FYOUToo Error:", error);
        }
    },

    onStart: async function({ message }) {
        // Informational message when command is called directly
        await message.reply("⚠️ This command is auto-triggered when someone says fuck-related words.");
    }
};
