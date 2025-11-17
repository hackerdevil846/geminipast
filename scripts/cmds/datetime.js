const moment = require('moment-timezone');

module.exports = {
    config: {
        name: "datetime",
        aliases: ["bdtime", "timebd", "bangladeshtime", "time"],
        version: "2.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "𝐒𝐡𝐨𝐰 𝐁𝐚𝐧𝐠𝐥𝐚𝐝𝐞𝐬𝐡 𝐝𝐚𝐭𝐞 𝐚𝐧𝐝 𝐭𝐢𝐦𝐞 𝐰𝐢𝐭𝐡 𝐢𝐧𝐟𝐨"
        },
        longDescription: {
            en: "𝐃𝐢𝐬𝐩𝐥𝐚𝐲𝐬 𝐛𝐞𝐚𝐮𝐭𝐢𝐟𝐮𝐥 𝐁𝐚𝐧𝐠𝐥𝐚𝐝𝐞𝐬𝐡 𝐝𝐚𝐭𝐞 𝐚𝐧𝐝 𝐭𝐢𝐦𝐞 𝐰𝐢𝐭𝐡 𝐚𝐝𝐝𝐢𝐭𝐢𝐨𝐧𝐚𝐥 𝐢𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧"
        },
        guide: {
            en: "💡 𝐇𝐨𝐰 𝐭𝐨 𝐮𝐬𝐞:\n\n⌨️ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝: /datetime\n   𝐎𝐑\n💬 𝐉𝐮𝐬𝐭 𝐭𝐲𝐩𝐞: 'bangladesh time' or 'bd time'\n\n📌 𝐀𝐮𝐭𝐨-𝐫𝐞𝐬𝐩𝐨𝐧𝐬𝐞: Bot will automatically reply when you mention Bangladesh time in chat"
        },
        dependencies: {
            "moment-timezone": ""
        }
    },

    onStart: async function ({ message, event, args }) {
        try {
            console.log("🕒 DateTime command started");
            
            // Validate message object
            if (!message || typeof message.reply !== 'function') {
                console.error("❌ Invalid message object in onStart");
                return;
            }

            // Check if moment-timezone is available
            let moment;
            try {
                moment = require("moment-timezone");
                if (typeof moment !== 'function') {
                    throw new Error("Moment is not a function");
                }
                console.log("✅ Moment-timezone loaded successfully");
            } catch (depError) {
                console.error("❌ Moment-timezone dependency error:", depError);
                try {
                    await message.reply("🔧 𝐌𝐢𝐬𝐬𝐢𝐧𝐠 𝐝𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐲!\n\nPlease install moment-timezone:\n📦 npm install moment-timezone\n\nThen restart your bot.");
                } catch (replyError) {
                    console.error("❌ Failed to send error message:", replyError);
                }
                return;
            }

            // Get Bangladesh time
            let bdTime;
            try {
                bdTime = moment().tz("Asia/Dhaka");
                if (!bdTime || !bdTime.isValid()) {
                    throw new Error("Invalid timezone result");
                }
                console.log("✅ Bangladesh time retrieved:", bdTime.format());
            } catch (timeError) {
                console.error("❌ Timezone error, using fallback:", timeError);
                try {
                    bdTime = moment();
                    if (!bdTime.isValid()) {
                        throw new Error("Fallback moment also invalid");
                    }
                    console.log("✅ Using fallback time:", bdTime.format());
                } catch (fallbackError) {
                    console.error("❌ All time methods failed:", fallbackError);
                    try {
                        await message.reply("⏰ 𝐓𝐢𝐦𝐞 𝐬𝐞𝐫𝐯𝐢𝐜𝐞 𝐭𝐞𝐦𝐩𝐨𝐫𝐚𝐫𝐢𝐥𝐲 𝐮𝐧𝐚𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐢𝐧 𝐚 𝐟𝐞𝐰 𝐦𝐢𝐧𝐮𝐭𝐞𝐬.");
                    } catch (replyError) {
                        console.error("❌ Failed to send time error:", replyError);
                    }
                    return;
                }
            }

            // Format date and time
            try {
                const date = bdTime.format("DD MMMM YYYY");
                const day = bdTime.format("dddd");
                const time = bdTime.format("hh:mm:ss A");
                const week = bdTime.isoWeek();
                const dayOfYear = bdTime.dayOfYear();
                const daysInYear = bdTime.isLeapYear() ? 366 : 365;
                const daysLeft = daysInYear - dayOfYear;

                // Validate formatted values
                if (!date || !day || !time) {
                    throw new Error("Invalid formatted date values");
                }

                // Create beautiful response
                const response = `✨ 𝐁𝐀𝐍𝐆𝐋𝐀𝐃𝐄𝐒𝐇 𝐓𝐈𝐌𝐄 𝐈𝐍𝐅𝐎 ✨

📅 𝐃𝐀𝐓𝐄: ${date}
🗓️ 𝐃𝐀𝐘: ${day}
⏰ 𝐓𝐈𝐌𝐄: ${time}

📊 𝐖𝐄𝐄𝐊 𝐍𝐔𝐌𝐁𝐄𝐑: ${week}
🌤️ 𝐃𝐀𝐘 𝐎𝐅 𝐘𝐄𝐀𝐑: ${dayOfYear}
⏳ 𝐃𝐀𝐘𝐒 𝐋𝐄𝐅𝐓: ${daysLeft}

🌏 𝐓𝐈𝐌𝐄𝐙𝐎𝐍𝐄: Asia/Dhaka (GMT+6)
🔮 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘: Asif Mahmud

🇧🇩 𝐒𝐇𝐎𝐍𝐀𝐑 𝐁𝐀𝐍𝐆𝐋𝐀 𝐃𝐄𝐒𝐇 𝐓𝐈𝐌𝐄 🇧🇩`;

                // Send message
                try {
                    await message.reply(response);
                    console.log("✅ DateTime command executed successfully");
                } catch (sendError) {
                    console.error("❌ Failed to send message:", sendError);
                }
                
            } catch (formatError) {
                console.error("❌ Date formatting error:", formatError);
                try {
                    await message.reply("❌ 𝐃𝐚𝐭𝐞 𝐟𝐨𝐫𝐦𝐚𝐭𝐭𝐢𝐧𝐠 𝐞𝐫𝐫𝐨𝐫. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧.");
                } catch (replyError) {
                    console.error("❌ Failed to send format error:", replyError);
                }
            }
            
        } catch (error) {
            console.error("💥 DateTime Main Error:", error);
            try {
                await message.reply("❌ 𝐀𝐧 𝐮𝐧𝐞𝐱𝐩𝐞𝐜𝐭𝐞𝐝 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.");
            } catch (finalError) {
                console.error("💥 Final fallback error:", finalError);
            }
        }
    },

    onChat: async function ({ event, message, args }) {
        try {
            console.log("💬 DateTime onChat triggered");
            
            // Comprehensive input validation
            if (!event || typeof event !== 'object') {
                console.log("❌ Invalid event object in onChat");
                return;
            }

            if (!message || typeof message.reply !== 'function') {
                console.log("❌ Invalid message object in onChat");
                return;
            }

            // Safe body extraction with multiple fallbacks
            const rawBody = event.body || event.content || event.message || event.text || "";
            const body = String(rawBody).toLowerCase().trim();
            
            // Early return checks
            if (!body || body.length < 3 || body.length > 500) {
                return;
            }

            console.log("📝 Checking message:", body.substring(0, 50));

            // Check if this is a command (starts with prefix) to avoid conflicts
            const prefixes = ['/', '!', '.', '-', '\\'];
            const firstChar = body.charAt(0);
            if (prefixes.includes(firstChar)) {
                console.log("⏩ Skipping command message");
                return;
            }

            // Specific triggers
            const triggers = [
                "bangladesh time",
                "bd time", 
                "বাংলাদেশ সময়",
                "bd সময়",
                "time bangladesh", 
                "time bd",
                "current time bangladesh",
                "what time in bangladesh",
                "bangladesh time now",
                "bd time now",
                "what's the time in bangladesh",
                "time in bangladesh"
            ];

            // Smart matching
            const cleanBody = body.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
            
            const shouldTrigger = triggers.some(trigger => {
                const cleanTrigger = trigger.toLowerCase();
                const patterns = [
                    cleanBody === cleanTrigger,
                    cleanBody.includes(` ${cleanTrigger} `),
                    cleanBody.startsWith(`${cleanTrigger} `),
                    cleanBody.endsWith(` ${cleanTrigger}`),
                    cleanBody.includes(`what is the ${cleanTrigger}`),
                    cleanBody.includes(`show me ${cleanTrigger}`),
                    cleanBody.includes(`tell me ${cleanTrigger}`),
                    cleanBody.includes(`what's the ${cleanTrigger}`)
                ];
                return patterns.some(pattern => pattern === true);
            });

            if (shouldTrigger) {
                console.log("🕒 DateTime auto-triggered by chat");
                
                // Add small delay to avoid race conditions
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Execute main function
                try {
                    await this.onStart({ message, event, args });
                    console.log("✅ Auto-response sent successfully");
                } catch (execError) {
                    console.error("❌ onChat execution error:", execError);
                }
            } else {
                console.log("⏩ No trigger match found");
            }
        } catch (error) {
            console.error("💥 DateTime onChat Critical Error:", error);
        }
    }
};
