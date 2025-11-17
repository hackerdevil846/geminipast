const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

module.exports = {
    config: {
        name: "minari",
        aliases: ["mina", "minachat"],
        version: "3.5.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "🌸 𝐴𝐼 𝑀𝑖𝑛𝑎𝑟𝑖 𝑐ℎ𝑎𝑡𝑏𝑜𝑡"
        },
        longDescription: {
            en: "𝐴𝐼 𝑐ℎ𝑎𝑡𝑏𝑜𝑡 𝑀𝑖𝑛𝑎𝑟𝑖 𝑤ℎ𝑜 𝑐𝑎𝑛 𝑡𝑎𝑙𝑘 𝑖𝑛 𝐵𝑎𝑛𝑔𝑙𝑎 𝑎𝑛𝑑 𝐸𝑛𝑔𝑙𝑖𝑠ℎ"
        },
        category: "ai",
        guide: {
            en: "{p}minari [on|off|status] 𝑜𝑟 [𝑦𝑜𝑢𝑟 𝑚𝑒𝑠𝑠𝑎𝑔𝑒]"
        },
        countDown: 5,
        dependencies: {
            "discord-chatbot": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            const threadID = event.threadID;
            const userID = event.senderID;
            
            // File path for storing Minari status
            const statusPath = path.join(__dirname, 'minariStatus.json');

            // Initialize status file (default all OFF)
            if (!fs.existsSync(statusPath)) {
                fs.writeFileSync(statusPath, JSON.stringify({}), 'utf8');
            }

            // Function to get Minari status (default OFF)
            function getMinariStatus(threadID) {
                try {
                    const data = fs.readFileSync(statusPath, 'utf8');
                    const status = JSON.parse(data);
                    return status[threadID] === true;
                } catch (e) {
                    return false;
                }
            }

            // Function to set Minari status
            function setMinariStatus(threadID, status) {
                try {
                    const data = fs.readFileSync(statusPath, 'utf8');
                    const statusObj = JSON.parse(data);
                    statusObj[threadID] = status;
                    fs.writeFileSync(statusPath, JSON.stringify(statusObj, null, 2), 'utf8');
                    return true;
                } catch (e) {
                    console.error("𝑆𝑡𝑎𝑡𝑢𝑠 𝑠𝑎𝑣𝑒 𝑒𝑟𝑟𝑜𝑟:", e);
                    return false;
                }
            }
            
            // Handle on/off commands
            if (args[0] && ['on', 'off', 'status'].includes(args[0].toLowerCase())) {
                const command = args[0].toLowerCase();
                
                if (command === 'on') {
                    setMinariStatus(threadID, true);
                    return message.reply("🌸 𝑴𝒊𝒏𝒂𝒓𝒊 𝒏𝒐𝒘 𝑶𝑵! 𝑨𝒎𝒊 𝒆𝒌𝒉𝒐𝒏 𝒕𝒉𝒆𝒌𝒆 𝒌𝒂𝒕𝒉𝒂 𝒃𝒐𝒍𝒃𝒐 😊");
                }
                
                if (command === 'off') {
                    setMinariStatus(threadID, false);
                    return message.reply("🌸 𝑴𝒊𝒏𝒂𝒓𝒊 𝒏𝒐𝒘 𝑶𝑭𝑭! 𝑨𝒎𝒊 𝒂𝒓 𝒌𝒂𝒕𝒉𝒂 𝒃𝒐𝒍𝒃𝒐 𝒏𝒂 😢");
                }
                
                if (command === 'status') {
                    const isActive = getMinariStatus(threadID);
                    const statusMessage = isActive ? 
                        "🌸 𝑴𝒊𝒏𝒂𝒓𝒊 𝒄𝒖𝒓𝒓𝒆𝒏𝒕𝒍𝒚 𝑶𝑵 😊" : 
                        "🌸 𝑴𝒊𝒏𝒂𝒓𝒊 𝒄𝒖𝒓𝒓𝒆𝒏𝒕𝒍𝒚 𝑶𝑭𝑭 (𝒅𝒆𝒇𝒂𝒖𝒍𝒕) 😢";
                    return message.reply(statusMessage);
                }
            }
            
            // Check if Minari is turned off (DEFAULT STATE)
            if (!getMinariStatus(threadID)) {
                return;
            }
            
            // Handle empty query
            if (!args[0]) {
                const welcomeMessages = [
                    "🌸 𝑫𝒆𝒌𝒉𝒆𝒏 𝑴𝒊𝒏𝒂𝒓𝒊 𝒌𝒆 𝒃𝒐𝒍𝒕𝒆 𝒄𝒉𝒂𝒏? 😊",
                    "🌸 𝑯𝒆𝒍𝒍𝒐! 𝑲𝒊𝒔𝒉𝒖 𝒃𝒐𝒍𝒃𝒆𝒏? 💬",
                    "🌸 𝑨𝒔𝒔𝒂𝒍𝒂𝒎𝒖𝒂𝒍𝒂𝒊𝒌𝒖𝒎! 𝑲𝒆𝒎𝒐𝒏 𝒂𝒄𝒉𝒆𝒏? 😇"
                ];
                const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
                return message.reply(randomWelcome);
            }
            
            // Auto-install dependencies if missing
            try {
                require("discord-chatbot");
            } catch {
                try {
                    await message.reply("🌸 𝑷𝒍𝒆𝒂𝒔𝒆 𝒘𝒂𝒊𝒕, 𝒊𝒏𝒔𝒕𝒂𝒍𝒍𝒊𝒏𝒈 𝒓𝒆𝒒𝒖𝒊𝒓𝒆𝒅 𝒑𝒂𝒄𝒌𝒂𝒈𝒆𝒔... ⏳");
                    execSync("npm install discord-chatbot@1.0.9", { stdio: 'ignore' });
                    await message.reply("🌸 𝑷𝒂𝒄𝒌𝒂𝒈𝒆𝒔 𝒊𝒏𝒔𝒕𝒂𝒍𝒍𝒆𝒅! 𝑨𝒔𝒌 𝒎𝒆 𝒂𝒈𝒂𝒊𝒏 💫");
                    return;
                } catch (installError) {
                    return message.reply("🌸 𝑷𝒂𝒄𝒌𝒂𝒈𝒆 𝒊𝒏𝒔𝒕𝒂𝒍𝒍𝒂𝒕𝒊𝒐𝒏 𝒇𝒂𝒊𝒍𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒊𝒏𝒔𝒕𝒂𝒍𝒍 𝒎𝒂𝒏𝒖𝒂𝒍𝒍𝒚: '𝒏𝒑𝒎 𝒊𝒏𝒔𝒕𝒂𝒍𝒍 𝒅𝒊𝒔𝒄𝒐𝒓𝒅-𝒄𝒉𝒂𝒕𝒃𝒐𝒕' 😢");
                }
            }
            
            const Chatbot = require("discord-chatbot");
            const userMessage = (event.type == "message_reply") ? 
                event.messageReply.body : 
                args.join(" ");
            
            // Create chatbot instance
            const chatbot = new Chatbot({ 
                name: "𝑴𝒊𝒏𝒂𝒓𝒊", 
                gender: "Female" 
            });
            
            // Get AI response
            const response = await chatbot.chat(userMessage);
            
            // Custom Banglish responses
            const customResponses = {
                "My dear great botmaster, Asif.": "🌸 𝑨𝒎𝒂𝒌𝒆 𝒃𝒂𝒏𝒂𝒊𝒚𝒆𝒄𝒉𝒆 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅, 𝒕𝒂𝒓 𝒏𝒂𝒎 𝑨𝒔𝒊𝒇 𝒌𝒊? 😊",
                "hello": "🌸 𝑯𝒆𝒍𝒍𝒐! 𝑲𝒆𝒎𝒐𝒏 𝒂𝒄𝒉𝒆𝒏? 😊",
                "hi": "🌸 𝑯𝒊! 𝑨𝒋𝒌𝒆 𝒌𝒐𝒎𝒐 𝒂𝒄𝒉𝒆𝒏? 💬",
                "how are you": "🌸 𝑨𝒎𝒊 𝒗𝒂𝒍𝒐 𝒂𝒄𝒉𝒊, 𝒂𝒑𝒏𝒊 𝒌𝒆𝒎𝒐𝒏 𝒂𝒄𝒉𝒆𝒏? 😊",
                "what's your name": "🌸 𝑨𝒎𝒂𝒓 𝒏𝒂𝒎 𝑴𝒊𝒏𝒂𝒓𝒊, 𝒂𝒑𝒏𝒂𝒓 𝒏𝒂𝒎 𝒌𝒊? 😍"
            };
            
            // Check for custom responses
            const lowerResponse = response.toLowerCase();
            for (const [keyword, reply] of Object.entries(customResponses)) {
                if (lowerResponse.includes(keyword.toLowerCase())) {
                    return message.reply(reply);
                }
            }
            
            // Default AI response
            return message.reply(`🌸 ${response}`);
            
        } catch (error) {
            console.error("𝑀𝑖𝑛𝑎𝑟𝑖 𝐸𝑟𝑟𝑜𝑟:", error);
            const errorMessages = [
                "🌸 𝑨𝒓𝒆 𝒂𝒓𝒆! 𝑲𝒊 𝒉𝒐𝒍𝒐? 𝑨𝒃𝒂𝒓 𝒕𝒓𝒚 𝒌𝒐𝒓𝒖𝒏 😅",
                "🌸 𝑶𝒊𝒍𝒂! 𝑺𝒐𝒎𝒐𝒔𝒔𝒂 𝒉𝒐𝒊𝒆𝒄𝒉𝒆, 𝒂𝒃𝒂𝒓 𝒕𝒓𝒚 𝒌𝒐𝒓𝒖𝒏 😔"
            ];
            const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
            return message.reply(randomError);
        }
    }
};
