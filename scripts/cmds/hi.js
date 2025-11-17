const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "hi",
        aliases: [],
        version: "12.0.4",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "islamic",
        shortDescription: {
            en: "Ultra-Stylish Islamic Greetings with Stickers"
        },
        longDescription: {
            en: "Automatic Islamic greetings with ultra-stylish fonts, stickers, and smart detection"
        },
        guide: {
            en: "{p}hi [on/off/status]"
        }
    },

    onChat: async function({ event, message, usersData, threadsData, api }) {
        try {
            const { threadID, senderID, body } = event;
            
            // Skip if message is from bot
            if (senderID === global.GoatBot?.botID) return;

            // Get thread data
            let threadData;
            try {
                threadData = await threadsData.get(threadID);
            } catch (error) {
                return;
            }
            
            // Check if module is enabled (default: disabled - manual activation required)
            if (!threadData?.data?.salam) return;

            // Comprehensive Islamic greeting triggers
            const triggers = [
                "salam", "assalamualaikum", "assalamu alaikum", "as salam", 
                "allah hu akbar", 
                "subhanallah", 
                "alhamdulillah", 
                "mashallah", 
                "astagfirullah", 
                "inshallah", 
                "bismillah", 
                "ramadan", 
                "eid mubarak", 
                "jazakallah", 
                "fi amanillah", 
                "barakallahu", 
                "ya allah", 
                "la ilaha illallah", 
                "muhammad",
                "hello", "hi", "hey", "hola", "namaste"
            ];

            const userMsg = body?.toLowerCase() || "";
            const hasTrigger = triggers.some(trigger => userMsg.includes(trigger));
            
            if (!hasTrigger) return;

            // Get user data
            let userData;
            try {
                userData = await usersData.get(senderID);
            } catch (error) {
                return;
            }

            const name = userData?.name || "Friend";
            
            // Get current time and prayer session
            let hours, session, sessionEmoji;
            try {
                hours = parseInt(moment.tz('Asia/Dhaka').format('HH'));
                if (hours >= 0 && hours < 4) {
                    session = "TAHAJJUD TIME"; sessionEmoji = "🌙";
                } else if (hours >= 4 && hours < 6) {
                    session = "FAJR PRAYER"; sessionEmoji = "🌄";
                } else if (hours >= 6 && hours < 12) {
                    session = "DUHA TIME"; sessionEmoji = "☀️";
                } else if (hours >= 12 && hours < 14) {
                    session = "DHUHR PRAYER"; sessionEmoji = "🕛";
                } else if (hours >= 14 && hours < 16) {
                    session = "ASR PRAYER"; sessionEmoji = "🕒";
                } else if (hours >= 16 && hours < 19) {
                    session = "MAGHRIB PRAYER"; sessionEmoji = "🌅";
                } else {
                    session = "ISHA PRAYER"; sessionEmoji = "🌃";
                }
            } catch (timeError) {
                session = "BLESSED TIME"; sessionEmoji = "📿";
            }

            // Islamic sticker IDs
            const stickerIDs = [
                "789381034156662", "789381067489992", "789381100823322", 
                "789381134156652", "789381167489982", "789381200823315", 
                "789381234156645", "789381267489975", "789381300823305", 
                "789381334156635", "789381367489965", "789381400823295", 
                "789381434156625", "789381467489955", "789381500823285", 
                "789381534156615", "789381567489945", "789381600823275", 
                "789381634156605", "789381667489935"
            ];

            // Ultra-stylish font messages (FIXED: Removed problematic characters)
            const messages = [
                `✦ ISLAMIC GREETINGS ✦
▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃

🕌 ASSALAMUALAIKUM WARAHMATULLAHI WABARAKATUH

╭───────────────╮
│ NAME: ${name}
│ TIME: ${session} ${sessionEmoji}
╰───────────────╯

✨ May Allah's peace & blessings be upon you
▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃`,

                `☪️ ALLAH HU AKBAR ☪️
✧･ﾟ: *✧･ﾟ:* ✧･ﾟ: *✧･ﾟ:*

╔═══════════════╗
   GREETING FOR:
   👤 ${name}
   ⏰ ${session} ${sessionEmoji}
╚═══════════════╝

🌟 May Allah's greatness fill your heart
✧･ﾟ: *✧･ﾟ:* ✧･ﾟ: *✧･ﾟ:*`,

                `📿 SUBHANALLAH 📿
༶•┈┈┈┈┈┈┈┈┈┈┈•༶

┌────────────────┐
│ DEAR: ${name}    │
│ SESSION: ${session} ${sessionEmoji} │
└────────────────┘

🌙 Glory to Allah in this blessed moment
༶•┈┈┈┈┈┈┈┈┈┈┈•༶`,

                `🌙 ALHAMDULILLAH 🌙
✦ ─────────── ✦

◈ USER: ${name}
◈ PRAYER: ${session} ${sessionEmoji}

🕯️ All praise to Allah for this beautiful time
✦ ─────────── ✦`,

                `🕋 MASHALLAH 🕋
╰┈➤ ❝ Islamic Greeting ❞

• Name: ${name}
• Time: ${session} ${sessionEmoji}

💫 Allah has willed this beautiful moment
╰┈➤ ❝ Blessed Response ❞`,

                `🌹 BISMILLAH 🌹
★・・・・・★・・・・・★

    Greeting for:
    ✨ ${name}
    📿 ${session} ${sessionEmoji}

✨ Begin in the name of Allah, the Most Gracious
★・・・・・★・・・・・★`,

                `🙏 JAZAKALLAH KHAIR 🙏
»»————- ★ ————-««

  ╭────────────────╮
  │ RECIPIENT: ${name} │
  │ TIME: ${session} ${sessionEmoji}    │
  ╰────────────────╯

⭐ May Allah reward you with goodness
»»————- ★ ————-««`,

                `🕌 FI AMANILLAH 🕌
✼  ҉    ✼    ҉  ✼

   ┌────────────┐
   │ FOR: ${name} │
   │ AT: ${session} ${sessionEmoji}  │
   └────────────┘

🕌 May Allah protect you in His care
✼  ҉    ✼    ҉  ✼`,

                `🌙 LA ILAHA ILLALLAH 🌙
♡₊˚ 🦢・₊✧

    MESSAGE FOR:
    💫 ${name}
    📿 ${session} ${sessionEmoji}

💫 There is no god but Allah
♡₊˚ 🦢・₊✧`,

                `☪️ RAMADAN MUBARAK ☪️
✦•······•✦•······•✦

   ╔════════════╗
   ║ TO: ${name}   ║
   ║ WITH: ${session} ${sessionEmoji} ║
   ╚════════════╝

🕋 Blessed Ramadan to you and your family
✦•······•✦•······•✦`
            ];

            // Random selection
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            const randomSticker = stickerIDs[Math.floor(Math.random() * stickerIDs.length)];

            // Send response with slight delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Send text message
            const response = {
                body: randomMessage,
                mentions: [{ tag: name, id: senderID }]
            };

            await message.reply(response);

            // Send sticker after short delay
            await new Promise(resolve => setTimeout(resolve, 500));
            await message.reply({
                sticker: randomSticker
            });

        } catch (error) {
            console.error("Ultra-Stylish Islamic Greeting Error:", error);
        }
    },

    onStart: async function({ message, event, threadsData, args }) {
        try {
            const { threadID } = event;
            
            // Get current thread data
            let threadData;
            try {
                threadData = await threadsData.get(threadID);
            } catch (error) {
                return await message.reply("❌ Failed to access thread settings.");
            }

            // Initialize data if not exists
            if (!threadData.data) {
                threadData.data = {};
            }

            const action = args[0]?.toLowerCase();

            // Handle different commands
            if (action === 'off') {
                threadData.data.salam = false;
                await threadsData.set(threadID, threadData);
                return await message.reply(`╔══════════════════════════╗
🔕 ISLAMIC GREETINGS DISABLED

✦ Auto-responses are now OFF
✦ Use "hi on" to enable again
╚══════════════════════════╝`);
            } 
            else if (action === 'on') {
                threadData.data.salam = true;
                await threadsData.set(threadID, threadData);
                return await message.reply(`╔══════════════════════════╗
🔔 ISLAMIC GREETINGS ENABLED

✦ Auto-responses are now ACTIVE
✦ Use "hi off" to disable
╚══════════════════════════╝`);
            }
            else if (action === 'status') {
                const isEnabled = threadData.data.salam === true;
                const statusMessage = isEnabled ?
                    `╔══════════════════════════╗
✅ STATUS: ENABLED

✦ Islamic greetings: ACTIVE
✦ Sticker responses: ACTIVE
✦ Smart detection: ACTIVE
╚══════════════════════════╝` :
                    `╔══════════════════════════╗
❌ STATUS: DISABLED

✦ Islamic greetings: INACTIVE
✦ Sticker responses: INACTIVE
✦ Smart detection: INACTIVE
╚══════════════════════════╝`;
                return await message.reply(statusMessage);
            }

            // Show main help menu
            const isEnabled = threadData.data.salam === true;
            const status = isEnabled ? "🟢 ENABLED" : "🔴 DISABLED";

            const helpMessage = `╔══════════════════════════════╗
          🕌 ISLAMIC GREETING SYSTEM 🕌

📊 CURRENT STATUS: ${status}

╭────────────────────────────╮
│ COMMANDS:                 │
│ • hi on    ➤ Enable       │
│ • hi off   ➤ Disable      │
│ • hi status ➤ Check status │
╰────────────────────────────╯

🤲 TRIGGER PHRASES:
• Salam / Assalamualaikum
• Allah Hu Akbar
• Subhanallah / Alhamdulillah
• Ramadan / Eid Mubarak
• And many more...

🎨 FEATURES:
✦ Ultra-stylish fonts
✦ Islamic stickers
✦ Prayer time detection
✦ Personalized responses
╚══════════════════════════════╝`;

            await message.reply(helpMessage);

        } catch (error) {
            console.error("Hi Command Error:", error);
            await message.reply("❌ Error accessing settings. Please try again.");
        }
    }
};
