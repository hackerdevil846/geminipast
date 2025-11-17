const os = require('os');
const moment = require('moment-timezone');

module.exports = {
    config: {
        name: "admin2",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 0,
        role: 2,
        category: "system",
        shortDescription: {
            en: "✨ 𝐴𝑑𝑚𝑖𝑛 𝑆𝑦𝑠𝑡𝑒𝑚 𝐼𝑛𝑓𝑜 ✨"
        },
        longDescription: {
            en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑟𝑒𝑎𝑙 𝑠𝑦𝑠𝑡𝑒𝑚 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑛𝑑 𝑏𝑜𝑡 𝑠𝑡𝑎𝑡𝑠"
        },
        guide: {
            en: "{p}admin2"
        },
        dependencies: {
            "moment-timezone": ""
        }
    },

    onStart: async function({ message, usersData, threadsData }) {
        try {
            // 🛡️ Dependency check
            try {
                require("moment-timezone");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑚𝑜𝑚𝑒𝑛𝑡-𝑡𝑖𝑚𝑒𝑧𝑜𝑛𝑒");
            }

            // 🛡️ Utility Functions with error handling
            const formatBytes = (bytes) => {
                try {
                    if (bytes === 0 || !bytes) return '0 𝐵';
                    if (typeof bytes !== 'number' || bytes < 0) return '𝐼𝑛𝑣𝑎𝑙𝑖𝑑';
                    
                    const k = 1024;
                    const sizes = ['𝐵', '𝐾𝐵', '𝑀𝐵', '𝐺𝐵', '𝑇𝐵'];
                    const i = Math.floor(Math.log(bytes) / Math.log(k));
                    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
                } catch (error) {
                    return '𝐸𝑟𝑟𝑜𝑟';
                }
            };

            const getCPUInfo = () => {
                try {
                    const cpus = os.cpus();
                    if (!cpus || cpus.length === 0) return '𝑁/𝐴';
                    const cpu = cpus[0];
                    return `${cpu.model.split('@')[0].trim()} | ${cpus.length} 𝑐𝑜𝑟𝑒𝑠`;
                } catch (error) {
                    return '𝑁/𝐴';
                }
            };

            const getOSInfo = () => {
                try {
                    return `${os.platform()} ${os.release()} | ${os.arch()}`;
                } catch (error) {
                    return '𝑁/𝐴';
                }
            };

            const getUptime = () => {
                try {
                    const uptime = process.uptime();
                    const days = Math.floor(uptime / 86400);
                    const hours = Math.floor((uptime % 86400) / 3600);
                    const minutes = Math.floor((uptime % 3600) / 60);
                    const seconds = Math.floor(uptime % 60);
                    
                    if (days > 0) return `${days}𝑑 ${hours}ℎ ${minutes}𝑚 ${seconds}𝑠`;
                    if (hours > 0) return `${hours}ℎ ${minutes}𝑚 ${seconds}𝑠`;
                    if (minutes > 0) return `${minutes}𝑚 ${seconds}𝑠`;
                    return `${seconds}𝑠`;
                } catch (error) {
                    return '𝑁/𝐴';
                }
            };

            // 🛡️ Get real time and date with error handling
            let formattedTime = '𝑁/𝐴';
            let formattedDate = '𝑁/𝐴';
            let dayName = '𝑁/𝐴';
            
            try {
                const now = moment().tz('Asia/Dhaka');
                formattedTime = now.format('HH:mm:ss');
                formattedDate = now.format('YYYY-MM-DD');
                dayName = now.format('dddd');
            } catch (timeError) {
                console.error('𝑇𝑖𝑚𝑒 𝑒𝑟𝑟𝑜𝑟:', timeError);
                // Use fallback time
                const fallbackDate = new Date();
                formattedTime = fallbackDate.toLocaleTimeString();
                formattedDate = fallbackDate.toLocaleDateString();
                dayName = fallbackDate.toLocaleDateString('en', { weekday: 'long' });
            }

            // 🛡️ Get real system information with error handling
            let totalMem = '𝑁/𝐴';
            let freeMem = '𝑁/𝐴';
            let usedMem = '𝑁/𝐴';
            let memoryUsage = '𝑁/𝐴';
            
            try {
                totalMem = formatBytes(os.totalmem());
                freeMem = formatBytes(os.freemem());
                usedMem = formatBytes(os.totalmem() - os.freemem());
                memoryUsage = formatBytes(process.memoryUsage().rss);
            } catch (memError) {
                console.error('𝑀𝑒𝑚𝑜𝑟𝑦 𝑒𝑟𝑟𝑜𝑟:', memError);
            }

            // 🛡️ Get real bot statistics with comprehensive error handling
            let threadCount = '𝑁/𝐴';
            let userCount = '𝑁/𝐴';
            
            try {
                if (threadsData && typeof threadsData.getAll === 'function') {
                    const allThreads = await threadsData.getAll();
                    threadCount = Array.isArray(allThreads) ? allThreads.length.toString() : '𝑁/𝐴';
                }
            } catch (threadError) {
                console.error('𝑇ℎ𝑟𝑒𝑎𝑑 𝑐𝑜𝑢𝑛𝑡 𝑒𝑟𝑟𝑜𝑟:', threadError);
            }

            try {
                if (usersData && typeof usersData.getAll === 'function') {
                    const allUsers = await usersData.getAll();
                    userCount = Array.isArray(allUsers) ? allUsers.length.toString() : '𝑁/𝐴';
                }
            } catch (userError) {
                console.error('𝑈𝑠𝑒𝑟 𝑐𝑜𝑢𝑛𝑡 𝑒𝑟𝑟𝑜𝑟:', userError);
            }

            // 🛡️ Get command count safely
            let commandCount = '𝑁/𝐴';
            try {
                if (global.client && global.client.commands && typeof global.client.commands.size === 'number') {
                    commandCount = global.client.commands.size.toString();
                } else if (global.goat && global.goat.commands) {
                    commandCount = Object.keys(global.goat.commands).length.toString();
                }
            } catch (cmdError) {
                console.error('𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑐𝑜𝑢𝑛𝑡 𝑒𝑟𝑟𝑜𝑟:', cmdError);
            }

            // 🛡️ Get Node.js version safely
            let nodeVersion = '𝑁/𝐴';
            try {
                nodeVersion = process.version || '𝑁/𝐴';
            } catch (nodeError) {
                console.error('𝑁𝑜𝑑𝑒 𝑣𝑒𝑟𝑠𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:', nodeError);
            }

            // 🛡️ Build response with guaranteed formatting
            const response = `
🦋✨ 𝑨𝒅𝒎𝒊𝒏 𝑺𝒚𝒔𝒕𝒆𝒎 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 ✨🦋
━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 𝐷𝑎𝑡𝑒: ${formattedDate} (${dayName})
🕰️ 𝑇𝑖𝑚𝑒: ${formattedTime} (𝐵𝐷𝑇)
━━━━━━━━━━━━━━━━━━━━━━━━━━
💻 𝑺𝒚𝒔𝒕𝒆𝒎 𝑰𝒏𝒇𝒐:
• 𝐹𝑟𝑒𝑒 𝑅𝐴𝑀: ${freeMem}
• 𝑈𝑠𝑒𝑑 𝑅𝐴𝑀: ${usedMem} 
• 𝑇𝑜𝑡𝑎𝑙 𝑅𝐴𝑀: ${totalMem}
• 𝐵𝑜𝑡 𝑅𝐴𝑀: ${memoryUsage}
• 𝐶𝑃𝑈: ${getCPUInfo()}
• 𝑂𝑆: ${getOSInfo()}
• 𝑁𝑜𝑑𝑒.𝑗𝑠: ${nodeVersion}
• 𝑈𝑝𝑡𝑖𝑚𝑒: ${getUptime()}
━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 𝑩𝒐𝒕 𝑺𝒕𝒂𝒕𝒔:
• 𝑇ℎ𝑟𝑒𝑎𝑑𝑠: ${threadCount}
• 𝑈𝑠𝑒𝑟𝑠: ${userCount} 
• 𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠: ${commandCount}
━━━━━━━━━━━━━━━━━━━━━━━━━━
💫 𝑺𝒚𝒔𝒕𝒆𝒎 𝑯𝒆𝒂𝒍𝒕𝒉: ✅ 𝑂𝑝𝑒𝑟𝑎𝑡𝑖𝑜𝑛𝑎𝑙
🦋━━━━━━━━━━━━━━━━━━━━🦋`;

            // 🛡️ Send response with final error handling
            await message.reply(response);

        } catch (error) {
            console.error('💥 𝐴𝑑𝑚𝑖𝑛2 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑓𝑎𝑡𝑎𝑙 𝑒𝑟𝑟𝑜𝑟:', error);
            
            // 🛡️ Final fallback response
            const fallbackResponse = `
🦋✨ 𝑨𝒅𝒎𝒊𝒏 𝑺𝒚𝒔𝒕𝒆𝒎 𝑰𝒏𝒇𝒐 ✨🦋
━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 𝐷𝑎𝑡𝑒: ${new Date().toLocaleDateString()}
🕰️ 𝑇𝑖𝑚𝑒: ${new Date().toLocaleTimeString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━
💻 𝐵𝑎𝑠𝑖𝑐 𝑆𝑦𝑠𝑡𝑒𝑚 𝐼𝑛𝑓𝑜:
• 𝑆𝑡𝑎𝑡𝑢𝑠: ✅ 𝑂𝑝𝑒𝑟𝑎𝑡𝑖𝑜𝑛𝑎𝑙
• 𝑁𝑜𝑑𝑒.𝑗𝑠: ${process.version || '𝑁/𝐴'}
• 𝑈𝑝𝑡𝑖𝑚𝑒: ${getUptime()}
━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 𝐵𝑜𝑡 𝑆𝑡𝑎𝑡𝑢𝑠: ✅ 𝑅𝑢𝑛𝑛𝑖𝑛𝑔
━━━━━━━━━━━━━━━━━━━━━━━━━━
💫 𝑁𝑜𝑡𝑒: 𝐵𝑎𝑠𝑖𝑐 𝑖𝑛𝑓𝑜 𝑑𝑖𝑠𝑝𝑙𝑎𝑦𝑒𝑑
🦋━━━━━━━━━━━━━━━━━━━━🦋`;
            
            await message.reply(fallbackResponse);
        }
    }
};
