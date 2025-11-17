const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "bedtime",
        aliases: [],
        version: "3.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 2,
        role: 0,
        category: "group",
        shortDescription: {
            en: "𝖲𝖾𝗇𝖽𝗌 𝗌𝗍𝗂𝖼𝗄𝖾𝗋𝗌 𝖺𝗇𝖽 𝗂𝗆𝖺𝗀𝖾𝗌 𝖿𝗈𝗋 𝖻𝖾𝖽𝗍𝗂𝗆𝖾"
        },
        longDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗌𝖾𝗇𝖽𝗌 𝗌𝗍𝗂𝖼𝗄𝖾𝗋𝗌 𝖺𝗇𝖽 𝗏𝗂𝖽𝖾𝗈𝗌 𝗐𝗁𝖾𝗇 𝗎𝗌𝖾𝗋𝗌 𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝖻𝖾𝖽𝗍𝗂𝗆𝖾-𝗋𝖾𝗅𝖺𝗍𝖾𝖽 𝗉𝗁𝗋𝖺𝗌𝖾𝗌"
        },
        guide: {
            en: "{p}bedtime [𝗈𝗇/𝗈𝖿𝖿]"
        },
        dependencies: {
            "axios": "",
            "request": "",
            "fs-extra": "",
            "moment-timezone": ""
        }
    },

    onStart: async function({ threadsData, message, event }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("request");
                require("fs-extra");
                require("moment-timezone");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝗋𝖾𝗊𝗎𝖾𝗌𝗍, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗇𝖽 𝗆𝗈𝗆𝖾𝗇𝗍-𝗍𝗂𝗆𝖾𝗓𝗈𝗇𝖾.");
            }

            const { threadID } = event;
            let data = await threadsData.get(threadID) || {};
            
            if (typeof data.bedtimeAutoResponse === "undefined") 
                data.bedtimeAutoResponse = true;
            else 
                data.bedtimeAutoResponse = !data.bedtimeAutoResponse;
            
            await threadsData.set(threadID, data);
            
            const statusText = data.bedtimeAutoResponse ? "𝗈𝗇" : "𝗈𝖿𝖿";
            return message.reply(`✅ 𝖡𝖾𝖽𝗍𝗂𝗆𝖾 𝖺𝗎𝗍𝗈-𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌 𝗎𝗉𝖽𝖺𝗍𝖾𝖽 𝗍𝗈: ${statusText}`);
            
        } catch (error) {
            console.error("💥 𝖡𝖾𝖽𝗍𝗂𝗆𝖾 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌 𝖾𝗋𝗋𝗈𝗋:", error);
            return message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝗎𝗉𝖽𝖺𝗍𝗂𝗇𝗀 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌");
        }
    },

    onChat: async function({ event, api, threadsData, usersData }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("request");
                require("fs-extra");
                require("moment-timezone");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return;
            }

            // Use Asia/Dhaka timezone for Bangladesh
            const time = moment.tz("Asia/Dhaka").format("D/MM/YYYY || HH:mm:ss");
            let day = moment.tz('Asia/Dhaka').format('dddd');
            
            const dayMap = {
                'Sunday': '𝖲𝗎𝗇𝖽𝖺𝗒',
                'Monday': '𝖬𝗈𝗇𝖽𝖺𝗒',
                'Tuesday': '𝖳𝗎𝖾𝗌𝖽𝖺𝗒',
                'Wednesday': '𝖶𝖾𝖽𝗇𝖾𝗌𝖽𝖺𝗒',
                'Thursday': '𝖳𝗁𝗎𝗋𝗌𝖽𝖺𝗒',
                'Friday': '𝖥𝗋𝗂𝖽𝖺𝗒',
                'Saturday': '𝖲𝖺𝗍𝗎𝗋𝖽𝖺𝗒'
            };
            day = dayMap[day] || day;

            const KEY = ["bedtime", "going to bed", "time for bed", "good night", "sleep time", "time to sleep", "sleep now", "goodnight", "night night"];

            let data = await threadsData.get(event.threadID) || {};
            if (typeof data.bedtimeAutoResponse === "undefined" || data.bedtimeAutoResponse === false) 
                return;

            const messageText = event.body?.toLowerCase().trim();
            if (!messageText) return;

            const shouldTrigger = KEY.some(keyword => messageText.includes(keyword));
            if (!shouldTrigger) return;

            console.log(`🌙 𝖡𝖾𝖽𝗍𝗂𝗆𝖾 𝗍𝗋𝗂𝗀𝗀𝖾𝗋𝖾𝖽 𝖻𝗒: ${event.senderID}`);

            let stickerData = [
                "526214684778630", "526220108111421", "526214684778630", "526220108111421", 
                "526220308111401", "526220484778050", "526220691444696", "526220814778017", 
                "526220978111334", "526221104777988", "526221318111300", "526221564777942", 
                "526221711444594", "526221971444568", "2523892817885618", "2523892964552270", 
                "2523893081218925", "2523893217885578", "2523893384552228", "2523892544552312", 
                "2523892391218994", "2523891461219087", "2523891767885723", "2523891204552446", 
                "2523890691219164", "2523890981219135", "2523890374552529", "2523889681219265", 
                "2523889851219248", "2523890051219228", "2523886944552872", "2523887171219516", 
                "2523888784552688", "2523888217886078", "2523888534552713", "2523887371219496", 
                "2523887771219456", "2523887571219476"
            ];
            let sticker = stickerData[Math.floor(Math.random() * stickerData.length)];
            
            let textData = ["𝖧𝖺𝗉𝗉𝗒 𝖽𝗋𝖾𝖺𝗆𝗌!", "𝖲𝗐𝖾𝖾𝗍 𝖽𝗋𝖾𝖺𝗆𝗌!", "𝖲𝗅𝖾𝖾𝗉 𝗍𝗂𝗀𝗁𝗍!", "𝖦𝗈𝗈𝖽 𝗇𝗂𝗀𝗁𝗍!"];
            let text = textData[Math.floor(Math.random() * textData.length)];

            let hours = parseInt(moment().tz("Asia/Dhaka").format("HH"));
            let session = (
                hours > 0 && hours <= 4 ? "𝗅𝖺𝗍𝖾 𝗇𝗂𝗀𝗁𝗍" :
                hours > 4 && hours <= 7 ? "𝖾𝖺𝗋𝗅𝗒 𝗆𝗈𝗋𝗇𝗂𝗇𝗀" :
                hours > 7 && hours <= 10 ? "𝗆𝗈𝗋𝗇𝗂𝗇𝗀" :
                hours > 10 && hours <= 12 ? "𝗅𝖺𝗍𝖾 𝗆𝗈𝗋𝗇𝗂𝗇𝗀" :
                hours > 12 && hours <= 17 ? "𝖺𝖿𝗍𝖾𝗋𝗇𝗈𝗈𝗇" :
                hours > 17 && hours <= 18 ? "𝖾𝖺𝗋𝗅𝗒 𝖾𝗏𝖾𝗇𝗂𝗇𝗀" :
                hours > 18 && hours <= 21 ? "𝖾𝗏𝖾𝗇𝗂𝗇𝗀" :
                hours > 21 && hours <= 24 ? "𝗇𝗂𝗀𝗁𝗍" : "𝖾𝗋𝗋𝗈𝗋"
            );

            let name = await usersData.getName(event.senderID);
            
            let videoLinks = [
                "https://i.imgur.com/zyYDajr.mp4",
                "https://i.imgur.com/I98aB1o.mp4",
                "https://i.imgur.com/6oJIcHq.mp4",
            ];

            let videoUrl = videoLinks[Math.floor(Math.random() * videoLinks.length)];
            let videoPath = __dirname + `/cache/bedtime_video_${Date.now()}.mp4`;

            try {
                // Download video with timeout
                await new Promise((resolve, reject) => {
                    const req = request(encodeURI(videoUrl))
                        .pipe(fs.createWriteStream(videoPath))
                        .on("close", resolve)
                        .on("error", reject);
                    
                    // Set timeout for download
                    setTimeout(() => {
                        req.destroy();
                        reject(new Error("𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗍𝗂𝗆𝖾𝗈𝗎𝗍"));
                    }, 30000);
                });

                // Check if file was downloaded successfully
                const stats = await fs.stat(videoPath);
                if (stats.size < 1000) { // At least 1KB
                    throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖿𝗂𝗅𝖾 𝗌𝗂𝗓𝖾");
                }

                await api.sendMessage({
                    body: `💖🏩『 𝖡𝖤𝖣𝖳𝖨𝖬𝖤 』🏩💖\n━━━━━━━━━━━━━\n👤 𝖦𝗈𝗈𝖽 𝗇𝗂𝗀𝗁𝗍 ${name}, 𝗌𝗅𝖾𝖾𝗉 𝗐𝖾𝗅𝗅 𝖺𝗇𝖽 𝗌𝗐𝖾𝖾𝗍 𝖽𝗋𝖾𝖺𝗆𝗌! 💤💤\n⏳ 𝖳𝗂𝗆𝖾: ${day} ${time} (𝖡𝖺𝗇𝗀𝗅𝖺𝖽𝖾𝗌𝗁 𝖳𝗂𝗆𝖾)\n🌙 𝖲𝖾𝗌𝗌𝗂𝗈𝗇: ${session}`,
                    attachment: fs.createReadStream(videoPath)
                }, event.threadID);

                // Clean up video file
                try {
                    if (fs.existsSync(videoPath)) {
                        fs.unlinkSync(videoPath);
                    }
                } catch (cleanupError) {
                    console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗏𝗂𝖽𝖾𝗈 𝖿𝗂𝗅𝖾:", cleanupError.message);
                }

                // Send sticker
                try {
                    await api.sendMessage({
                        sticker: sticker
                    }, event.threadID);
                } catch (stickerError) {
                    console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗌𝗍𝗂𝖼𝗄𝖾𝗋:", stickerError.message);
                }

            } catch (videoError) {
                console.error("❌ 𝖵𝗂𝖽𝖾𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", videoError);
                
                // Fallback: send text-only message
                await api.sendMessage({
                    body: `💖🏩『 𝖡𝖤𝖣𝖳𝖨𝖬𝖤 』🏩💖\n━━━━━━━━━━━━━\n👤 𝖦𝗈𝗈𝖽 𝗇𝗂𝗀𝗁𝗍 ${name}, 𝗌𝗅𝖾𝖾𝗉 𝗐𝖾𝗅𝗅 𝖺𝗇𝖽 𝗌𝗐𝖾𝖾𝗍 𝖽𝗋𝖾𝖺𝗆𝗌! 💤💤\n⏳ 𝖳𝗂𝗆𝖾: ${day} ${time} (𝖡𝖺𝗇𝗀𝗅𝖺𝖽𝖾𝗌𝗁 𝖳𝗂𝗆𝖾)\n🌙 𝖲𝖾𝗌𝗌𝗂𝗈𝗇: ${session}\n\n${text}`
                }, event.threadID);

                // Still try to send sticker
                try {
                    await api.sendMessage({
                        sticker: sticker
                    }, event.threadID);
                } catch (stickerError) {
                    console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗌𝗍𝗂𝖼𝗄𝖾𝗋:", stickerError.message);
                }
            }

        } catch (error) {
            console.error("💥 𝖡𝖾𝖽𝗍𝗂𝗆𝖾 𝖼𝗁𝖺𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    }
};
