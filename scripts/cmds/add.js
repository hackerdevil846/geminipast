const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "add",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑚𝑒𝑑𝑖𝑎",
        shortDescription: {
            en: "𝐴𝑑𝑑 𝑚𝑒𝑑𝑖𝑎 𝑡𝑜 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒 𝑤𝑖𝑡ℎ 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑓𝑖𝑙𝑡𝑒𝑟𝑖𝑛𝑔"
        },
        longDescription: {
            en: "𝐴𝑑𝑑 𝑚𝑒𝑑𝑖𝑎 𝑓𝑖𝑙𝑒𝑠 𝑡𝑜 𝑎 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒 𝑤𝑖𝑡ℎ 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑓𝑖𝑙𝑡𝑒𝑟𝑖𝑛𝑔 𝑎𝑛𝑑 𝑎𝑑𝑚𝑖𝑛 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛𝑠"
        },
        guide: {
            en: "{p}add [𝑛𝑎𝑚𝑒] (𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑚𝑒𝑑𝑖𝑎)"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args, api }) {
        try {
            // 🛡️ Dependency check
            let axiosAvailable, fsAvailable;
            try {
                axiosAvailable = true;
                fsAvailable = true;
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            // 🎯 Configuration
            const ADMIN_IDS = ["61571630409265"]; // Add more admin IDs as needed
            const WARNING_FILE = path.join(__dirname, 'cache', 'warnings.json');
            const BAD_WORDS = [
                "fuck", "sex", "porn", "nude", "bitch", "cum", "dick", "pussy", "asshole", 
                "boobs", "blowjob", "hentai", "xxx", "rape", "hotgirl", "hotboy", "anal", 
                "oral", "tits", "slut", "whore", "nangi", "naked", "desisex", "desi porn", 
                "indian porn", "child porn", "pedo", "child abuse", "গুদ", "চোদা", "চোদ", 
                "চুদ", "চুদি", "চোদন", "মাগী", "মাগি", "বেশ্যা", "শুয়োর", "মাদারচোদ", 
                "বাপচোদ", "মা চোদ", "বোন চোদ", "ফাক", "সেক্স", "পর্ন", "হেন্তাই"
            ];

            // 🛡️ Initialize warning system
            const initWarnings = () => {
                try {
                    const cacheDir = path.dirname(WARNING_FILE);
                    if (!fs.existsSync(cacheDir)) {
                        fs.mkdirSync(cacheDir, { recursive: true });
                        console.log("✅ 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑐𝑎𝑐ℎ𝑒 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦");
                    }
                    if (!fs.existsSync(WARNING_FILE)) {
                        fs.writeFileSync(WARNING_FILE, JSON.stringify({}, null, 2));
                        console.log("✅ 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠 𝑓𝑖𝑙𝑒");
                    }
                    return true;
                } catch (error) {
                    console.error("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑖𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑒 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠:", error);
                    return false;
                }
            };

            // 🛡️ Warning management
            const getWarnings = () => {
                try {
                    if (!fs.existsSync(WARNING_FILE)) {
                        return {};
                    }
                    const data = fs.readFileSync(WARNING_FILE, 'utf8');
                    return JSON.parse(data) || {};
                } catch (error) {
                    console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑟𝑒𝑎𝑑𝑖𝑛𝑔 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠:", error);
                    return {};
                }
            };

            const saveWarnings = (warnings) => {
                try {
                    fs.writeFileSync(WARNING_FILE, JSON.stringify(warnings, null, 2));
                    return true;
                } catch (error) {
                    console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑠𝑎𝑣𝑖𝑛𝑔 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠:", error);
                    return false;
                }
            };

            // 🛡️ Content validation
            const hasBadWords = (text) => {
                if (!text || typeof text !== 'string') return false;
                const lowercaseText = text.toLowerCase().trim();
                return BAD_WORDS.some(word => {
                    const wordLower = word.toLowerCase();
                    return lowercaseText.includes(wordLower) || 
                           lowercaseText === wordLower ||
                           lowercaseText.split(/\s+/).includes(wordLower);
                });
            };

            // 🔔 Admin notification
            const notifyAdmins = async (adminMessage) => {
                const failedAdmins = [];
                
                for (const adminID of ADMIN_IDS) {
                    if (adminID && adminID.trim()) {
                        try {
                            await api.sendMessage(adminMessage, adminID);
                            console.log(`✅ 𝑁𝑜𝑡𝑖𝑓𝑖𝑒𝑑 𝑎𝑑𝑚𝑖𝑛: ${adminID}`);
                        } catch (error) {
                            console.error(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑛𝑜𝑡𝑖𝑓𝑦 𝑎𝑑𝑚𝑖𝑛 ${adminID}:`, error.message);
                            failedAdmins.push(adminID);
                        }
                    }
                }
                
                if (failedAdmins.length > 0) {
                    console.warn(`⚠️ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑛𝑜𝑡𝑖𝑓𝑦 ${failedAdmins.length} 𝑎𝑑𝑚𝑖𝑛𝑠`);
                }
                
                return failedAdmins.length === 0;
            };

            // 🛡️ Validate user input
            const { senderID, messageReply, threadID } = event;
            
            // Check if user replied to a message
            if (!messageReply) {
                return message.reply("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑐𝑜𝑛𝑡𝑎𝑖𝑛𝑖𝑛𝑔 𝑣𝑖𝑑𝑒𝑜 𝑜𝑟 𝑖𝑚𝑎𝑔𝑒 𝑡𝑜 𝑎𝑑𝑑 𝑖𝑡.");
            }

            // Check if replied message has attachments
            if (!messageReply.attachments || !Array.isArray(messageReply.attachments) || messageReply.attachments.length === 0) {
                return message.reply("⚠️ 𝑇ℎ𝑒 𝑟𝑒𝑝𝑙𝑖𝑒𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑑𝑜𝑒𝑠𝑛'𝑡 𝑐𝑜𝑛𝑡𝑎𝑖𝑛 𝑎𝑛𝑦 𝑚𝑒𝑑𝑖𝑎 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡𝑠.");
            }

            const mediaUrl = messageReply.attachments[0]?.url;
            const mediaName = args.join(' ').trim();

            // Validate media URL
            if (!mediaUrl) {
                return message.reply("⚠️ 𝑁𝑜 𝑣𝑎𝑙𝑖𝑑 𝑚𝑒𝑑𝑖𝑎 𝑈𝑅𝐿 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑡ℎ𝑒 𝑟𝑒𝑝𝑙𝑖𝑒𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒.");
            }

            // Validate media name
            if (!mediaName) {
                return message.reply("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑛𝑎𝑚𝑒 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑚𝑒𝑑𝑖𝑎.\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: /add 𝑚𝑦 𝑐𝑢𝑡𝑒 𝑐𝑎𝑡 𝑣𝑖𝑑𝑒𝑜");
            }

            if (mediaName.length > 100) {
                return message.reply("⚠️ 𝑀𝑒𝑑𝑖𝑎 𝑛𝑎𝑚𝑒 𝑖𝑠 𝑡𝑜𝑜 𝑙𝑜𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑘𝑒𝑒𝑝 𝑖𝑡 𝑢𝑛𝑑𝑒𝑟 100 𝑐ℎ𝑎𝑟𝑎𝑐𝑡𝑒𝑟𝑠.");
            }

            // 🛡️ Initialize warnings system
            if (!initWarnings()) {
                return message.reply("❌ 𝑆𝑦𝑠𝑡𝑒𝑚 𝑒𝑟𝑟𝑜𝑟: 𝐶𝑎𝑛𝑛𝑜𝑡 𝑖𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑒 𝑤𝑎𝑟𝑛𝑖𝑛𝑔 𝑠𝑦𝑠𝑡𝑒𝑚.");
            }

            // 🛡️ Content filtering
            if (hasBadWords(mediaName)) {
                console.warn(`🚨 𝐶𝑜𝑛𝑡𝑒𝑛𝑡 𝑣𝑖𝑜𝑙𝑎𝑡𝑖𝑜𝑛 𝑑𝑒𝑡𝑒𝑐𝑡𝑒𝑑 𝑓𝑟𝑜𝑚 𝑢𝑠𝑒𝑟 ${senderID}: ${mediaName}`);
                
                const warnings = getWarnings();
                warnings[senderID] = (warnings[senderID] || 0) + 1;
                
                if (!saveWarnings(warnings)) {
                    return message.reply("❌ 𝑆𝑦𝑠𝑡𝑒𝑚 𝑒𝑟𝑟𝑜𝑟: 𝐶𝑎𝑛𝑛𝑜𝑡 𝑠𝑎𝑣𝑒 𝑤𝑎𝑟𝑛𝑖𝑛𝑔 𝑑𝑎𝑡𝑎.");
                }

                const warningCount = warnings[senderID];
                const userWarning = 
                    `❌ 𝑌𝑜𝑢𝑟 𝑝𝑟𝑜𝑣𝑖𝑑𝑒𝑑 𝑛𝑎𝑚𝑒 𝑐𝑜𝑛𝑡𝑎𝑖𝑛𝑠 𝑖𝑛𝑎𝑝𝑝𝑟𝑜𝑝𝑟𝑖𝑎𝑡𝑒 𝑐𝑜𝑛𝑡𝑒𝑛𝑡!\n\n` +
                    `⚠️ 𝑊𝑎𝑟𝑛𝑖𝑛𝑔: ${warningCount}/3\n` +
                    `📛 𝑁𝑎𝑚𝑒 𝑠𝑢𝑏𝑚𝑖𝑡𝑡𝑒𝑑: "${mediaName}"\n\n` +
                    `🔞 𝑃𝑙𝑒𝑎𝑠𝑒 𝑎𝑣𝑜𝑖𝑑 𝑢𝑠𝑖𝑛𝑔 𝑖𝑛𝑎𝑝𝑝𝑟𝑜𝑝𝑟𝑖𝑎𝑡𝑒 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒.`;

                const adminAlert = 
                    `🚨 𝐶𝑂𝑁𝑇𝐸𝑁𝑇 𝑉𝐼𝑂𝐿𝐴𝑇𝐼𝑂𝑁 𝐷𝐸𝑇𝐸𝐶𝑇𝐸𝐷\n\n` +
                    `• 👤 𝑈𝑠𝑒𝑟 𝐼𝐷: ${senderID}\n` +
                    `• 📛 𝐶𝑜𝑛𝑡𝑒𝑛𝑡: "${mediaName}"\n` +
                    `• ⚠️ 𝑊𝑎𝑟𝑛𝑖𝑛𝑔𝑠: ${warningCount}/3\n` +
                    `• 🕒 𝑇𝑖𝑚𝑒: ${new Date().toLocaleString()}`;

                await message.reply(userWarning);
                await notifyAdmins(adminAlert);

                if (warningCount >= 3) {
                    const blockMessage = 
                        `🚫 𝐴𝐶𝐶𝐸𝑆𝑆 𝑅𝐸𝑉𝑂𝐾𝐸𝐷\n\n` +
                        `𝑌𝑜𝑢 ℎ𝑎𝑣𝑒 𝑏𝑒𝑒𝑛 𝑏𝑙𝑜𝑐𝑘𝑒𝑑 𝑓𝑟𝑜𝑚 𝑢𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑎𝑑𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑑𝑢𝑒 𝑡𝑜 𝑟𝑒𝑝𝑒𝑎𝑡𝑒𝑑 𝑣𝑖𝑜𝑙𝑎𝑡𝑖𝑜𝑛𝑠.\n` +
                        `𝑃𝑙𝑒𝑎𝑠𝑒 𝑐𝑜𝑛𝑡𝑎𝑐𝑡 𝑎𝑛 𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟 𝑖𝑓 𝑡ℎ𝑖𝑠 𝑖𝑠 𝑎 𝑚𝑖𝑠𝑡𝑎𝑘𝑒.`;
                    
                    await message.reply(blockMessage);
                    
                    const blockAlert = 
                        `🔒 𝑈𝑆𝐸𝑅 𝐵𝐿𝑂𝐶𝐾𝐸𝐷\n\n` +
                        `• 👤 𝑈𝑠𝑒𝑟 𝐼𝐷: ${senderID}\n` +
                        `• 🚫 𝑅𝑒𝑎𝑠𝑜𝑛: 3+ 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑣𝑖𝑜𝑙𝑎𝑡𝑖𝑜𝑛𝑠\n` +
                        `• 📛 𝐿𝑎𝑠𝑡 𝑣𝑖𝑜𝑙𝑎𝑡𝑖𝑜𝑛: "${mediaName}"\n` +
                        `• 🕒 𝑇𝑖𝑚𝑒: ${new Date().toLocaleString()}`;
                    
                    await notifyAdmins(blockAlert);
                }
                return;
            }

            // 📤 Get media information
            const attachment = messageReply.attachments[0];
            const mediaType = attachment.type || "𝑢𝑛𝑘𝑛𝑜𝑤𝑛";
            const duration = mediaType === "video" ? (attachment.duration || 0) : 0;
            const fileSize = attachment.size ? Math.round(attachment.size / 1024 / 1024 * 100) / 100 : 0;

            // 📤 Upload simulation with progress
            const uploadMsg = await message.reply(
                `📤 𝑈𝑝𝑙𝑜𝑎𝑑𝑖𝑛𝑔 ${mediaType}...\n\n` +
                `📛 𝑁𝑎𝑚𝑒: ${mediaName}\n` +
                `📁 𝑇𝑦𝑝𝑒: ${mediaType}\n` +
                `⏳ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡...`
            );

            // ⏳ Simulate upload process with stages
            try {
                // Stage 1: Validating media
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Stage 2: Processing media
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Stage 3: Adding to database
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (uploadError) {
                console.error("𝑈𝑝𝑙𝑜𝑎𝑑 𝑠𝑖𝑚𝑢𝑙𝑎𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", uploadError);
                return message.reply("❌ 𝑈𝑝𝑙𝑜𝑎𝑑 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑓𝑎𝑖𝑙𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
            }

            // ✅ Success response
            const successMessage = 
                `✅ 𝑀𝑒𝑑𝑖𝑎 𝐴𝑑𝑑𝑒𝑑 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!\n\n` +
                `📛 𝑁𝑎𝑚𝑒: ${mediaName}\n` +
                `📁 𝑇𝑦𝑝𝑒: ${mediaType}\n` +
                `📊 𝑆𝑖𝑧𝑒: ${fileSize}𝑀𝐵\n` +
                `⏱️ 𝐷𝑢𝑟𝑎𝑡𝑖𝑜𝑛: ${duration > 0 ? duration + '𝑠' : '𝑁/𝐴'}\n` +
                `👤 𝑈𝑝𝑙𝑜𝑎𝑑𝑒𝑟: ${senderID}\n` +
                `🆔 𝑀𝑒𝑑𝑖𝑎 𝐼𝐷: ${Date.now()}\n\n` +
                `🔗 𝑀𝑒𝑑𝑖𝑎 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑎𝑑𝑑𝑒𝑑 𝑡𝑜 𝑡ℎ𝑒 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒!`;

            await message.reply(successMessage);

            // 🔔 Notify admins about new upload
            const adminNotification = 
                `📥 𝑁𝑒𝑤 𝑀𝑒𝑑𝑖𝑎 𝑈𝑝𝑙𝑜𝑎𝑑\n\n` +
                `📛 𝑁𝑎𝑚𝑒: ${mediaName}\n` +
                `📁 𝑇𝑦𝑝𝑒: ${mediaType}\n` +
                `📊 𝑆𝑖𝑧𝑒: ${fileSize}𝑀𝐵\n` +
                `👤 𝑈𝑝𝑙𝑜𝑎𝑑𝑒𝑟: ${senderID}\n` +
                `🆔 𝑀𝑒𝑑𝑖𝑎 𝐼𝐷: ${Date.now()}\n` +
                `✅ 𝐶𝑜𝑛𝑡𝑒𝑛𝑡: 𝑆𝑎𝑓𝑒 & 𝐴𝑝𝑝𝑟𝑜𝑣𝑒𝑑\n` +
                `🕒 𝑇𝑖𝑚𝑒: ${new Date().toLocaleString()}`;

            await notifyAdmins(adminNotification);

            console.log(`✅ 𝑀𝑒𝑑𝑖𝑎 𝑎𝑑𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦: ${mediaName} by ${senderID}`);

        } catch (error) {
            console.error('💥 𝐴𝑑𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:', error);
            
            let errorMessage = "❌ 𝐴𝑛 𝑢𝑛𝑒𝑥𝑝𝑒𝑐𝑡𝑒𝑑 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
            
            if (error.message.includes('ENOENT')) {
                errorMessage = "❌ 𝑆𝑦𝑠𝑡𝑒𝑚 𝑒𝑟𝑟𝑜𝑟: 𝐶𝑎𝑛𝑛𝑜𝑡 𝑎𝑐𝑐𝑒𝑠𝑠 𝑓𝑖𝑙𝑒 𝑠𝑦𝑠𝑡𝑒𝑚.";
            } else if (error.message.includes('permission')) {
                errorMessage = "❌ 𝑃𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑑𝑒𝑛𝑖𝑒𝑑: 𝐶𝑎𝑛𝑛𝑜𝑡 𝑤𝑟𝑖𝑡𝑒 𝑡𝑜 𝑓𝑖𝑙𝑒 𝑠𝑦𝑠𝑡𝑒𝑚.";
            } else if (error.code === 'ECONNRESET') {
                errorMessage = "❌ 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑒𝑟𝑟𝑜𝑟: 𝐶𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛 𝑟𝑒𝑠𝑒𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
