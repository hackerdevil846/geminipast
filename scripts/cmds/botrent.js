const fs = require('fs-extra');
const path = require('path');
const moment = require('moment-timezone');
const crypto = require('crypto');
const cron = require('node-cron');

module.exports = {
    config: {
        name: "botrent",
        aliases: [],
        version: "1.7.0",
        author: "Asif Mahmud",
        countDown: 1,
        role: 3,
        category: "system",
        shortDescription: {
            en: "Bot rental system management"
        },
        longDescription: {
            en: "Manage bot rental system with key generation and expiration tracking"
        },
        guide: {
            en: "{p}botrent [add|list|info|newkey|check]"
        },
        dependencies: {
            "fs-extra": "",
            "path": "",
            "moment-timezone": "",
            "crypto": "",
            "node-cron": ""
        }
    },

    onLoad: function() {
        try {
            console.log("🔄 Initializing bot rental system...");
            
            // Create necessary directories
            const dataDir = path.join(__dirname, 'cache/data');
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
                console.log("✅ Created data directory");
            }

            // Initialize data files
            this.rentData = [];
            this.keys = {};
            this.setNameCheck = {};

            console.log("✅ Bot rental system initialized");
            
        } catch (error) {
            console.error("❌ BotRent onLoad error:", error);
        }
    },

    saveData: function() {
        try {
            const RENT_DATA_PATH = path.join(__dirname, 'cache/data/thuebot.json');
            fs.writeFileSync(RENT_DATA_PATH, JSON.stringify(this.rentData, null, 2), 'utf8');
        } catch (error) {
            console.error("❌ Error saving rent data:", error);
        }
    },

    saveKeys: function() {
        try {
            const RENT_KEY_PATH = path.join(__dirname, 'cache/data/keys.json');
            fs.writeFileSync(RENT_KEY_PATH, JSON.stringify(this.keys, null, 2), 'utf8');
        } catch (error) {
            console.error("❌ Error saving keys:", error);
        }
    },

    formatDate: function(input) {
        try {
            return input.split('/').reverse().join('/');
        } catch (error) {
            console.error("❌ Error formatting date:", error);
            return input;
        }
    },

    isInvalidDate: function(date) {
        try {
            return isNaN(new Date(date).getTime());
        } catch (error) {
            return true;
        }
    },

    generateKey: function() {
        try {
            const randomString = crypto.randomBytes(6).toString('hex').slice(0, 6);
            return `hphong_${randomString}_key_2025`.toLowerCase();
        } catch (error) {
            console.error("❌ Error generating key:", error);
            return `hphong_${Date.now().toString(36)}_key_2025`;
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Check if user is admin
            if (!global.config.ADMINBOT || !global.config.ADMINBOT.includes(event.senderID)) {
                return message.reply("⚠️ Only main admins can use this command!");
            }

            const prefix = global.config.PREFIX || "!";

            if (!args[0]) {
                return message.reply(`🤖 Bot Rental System\n──────────────────\n⩺ ${prefix}botrent add [date] - Add group to rental system\n⩺ ${prefix}botrent newkey [days] - Generate new rental key\n⩺ ${prefix}botrent info - View rental info for current group\n⩺ ${prefix}botrent check - Check available keys\n⩺ ${prefix}botrent list - List all rented groups`);
            }

            const command = args[0].toLowerCase();

            switch (command) {
                case 'add':
                    if (!args[1]) {
                        return message.reply(`❌ Usage: ${prefix}botrent add DD/MM/YYYY`);
                    }
                    
                    let userId = event.senderID;
                    if (event.type === "message_reply") {
                        userId = event.messageReply.senderID;
                    } else if (Object.keys(event.mentions).length > 0) {
                        userId = Object.keys(event.mentions)[0];
                    }
                    
                    const t_id = event.threadID;
                    const time_start = moment().tz('Asia/Dhaka').format('DD/MM/YYYY');
                    const time_end = args[1];
                    
                    if (this.isInvalidDate(this.formatDate(time_start)) || this.isInvalidDate(this.formatDate(time_end))) {
                        return message.reply("❌ Invalid date format! Use DD/MM/YYYY");
                    }
                    
                    // Check if group already exists
                    const existingIndex = this.rentData.findIndex(entry => entry.t_id === t_id);
                    if (existingIndex !== -1) {
                        this.rentData[existingIndex] = { t_id, id: userId, time_start, time_end };
                        this.saveData();
                        return message.reply("✅ Updated group rental information!");
                    } else {
                        this.rentData.push({ t_id, id: userId, time_start, time_end });
                        this.saveData();
                        return message.reply("✅ Added group to rental system!");
                    }

                case 'list':
                    if (this.rentData.length === 0) {
                        return message.reply('📭 No groups in rental system!');
                    }
                    
                    let listMessage = "🤖 Rented Groups:\n\n";
                    this.rentData.forEach((item, index) => {
                        try {
                            const timeEnd = new Date(this.formatDate(item.time_end)).getTime();
                            const now = Date.now();
                            const daysRemaining = Math.floor((timeEnd - now) / (1000 * 60 * 60 * 24));
                            
                            listMessage += `${index + 1}. Group ID: ${item.t_id}\n`;
                            listMessage += `   User: ${item.id}\n`;
                            listMessage += `   End Date: ${item.time_end}\n`;
                            listMessage += `   Status: ${daysRemaining > 0 ? '✅ Active' : '❌ Expired'}\n`;
                            listMessage += `   Days Left: ${daysRemaining}\n\n`;
                        } catch (error) {
                            listMessage += `${index + 1}. Group ID: ${item.t_id} (Error processing dates)\n\n`;
                        }
                    });
                    
                    return message.reply(listMessage);

                case 'info':
                    const rentInfo = this.rentData.find(entry => entry.t_id === event.threadID);
                    if (!rentInfo) {
                        return message.reply("❌ No rental data for this group");
                    }
                    
                    try {
                        const timeEnd = new Date(this.formatDate(rentInfo.time_end)).getTime();
                        const now = Date.now();
                        const daysRemaining = Math.floor((timeEnd - now) / (1000 * 60 * 60 * 24));
                        const hoursRemaining = Math.floor((timeEnd - now) / (1000 * 60 * 60) % 24);
                        
                        return message.reply(`📊 Rental Information\n──────────────────\n👤 User ID: ${rentInfo.id}\n🏷️ Group ID: ${rentInfo.t_id}\n📅 Start Date: ${rentInfo.time_start}\n⏰ End Date: ${rentInfo.time_end}\n⏳ Time Remaining: ${daysRemaining} days ${hoursRemaining} hours`);
                    } catch (dateError) {
                        return message.reply("❌ Error processing date information");
                    }

                case 'newkey':
                    const days = parseInt(args[1], 10) || 31;
                    if (isNaN(days) || days <= 0) {
                        return message.reply("❌ Invalid days value! Use a positive number.");
                    }
                    
                    const generatedKey = this.generateKey();
                    this.keys[generatedKey] = {
                        days: days,
                        used: false,
                        groupId: null,
                        createdAt: moment().format('DD/MM/YYYY HH:mm:ss')
                    };
                    this.saveKeys();
                    return message.reply(`🔑 New Key Generated\n──────────────────\nKey: ${generatedKey}\nValid For: ${days} days\nCreated: ${this.keys[generatedKey].createdAt}`);

                case 'check':
                    if (Object.keys(this.keys).length === 0) {
                        return message.reply('🔑 No keys available!');
                    }
                    
                    let keyList = "🔑 Available Keys:\n\n";
                    Object.entries(this.keys).forEach(([key, info], index) => {
                        keyList += `${index + 1}. Key: ${key}\n`;
                        keyList += `   Days: ${info.days}\n`;
                        keyList += `   Status: ${info.used ? '✅ Used' : '❌ Unused'}\n`;
                        keyList += `   Group: ${info.groupId || 'N/A'}\n`;
                        keyList += `   Created: ${info.createdAt || 'Unknown'}\n\n`;
                    });
                    
                    return message.reply(keyList);

                default:
                    return message.reply(`❌ Unknown command. Use:\n${prefix}botrent add/list/info/newkey/check`);
            }
        } catch (error) {
            console.error("💥 BotRent Error:", error);
            return message.reply("❌ An error occurred while processing the command.");
        }
    },

    onChat: async function({ event, message }) {
        try {
            const msg = event.body.toLowerCase();
            const groupId = event.threadID;
            const keyMatch = msg.match(/hphong_[0-9a-f]{6}_key_2025/);

            if (keyMatch && event.senderID) {
                const key = keyMatch[0];
                
                if (this.keys.hasOwnProperty(key)) {
                    const keyInfo = this.keys[key];
                    if (!keyInfo.used) {
                        const time_start = moment().format('DD/MM/YYYY');
                        let time_end;

                        try {
                            // Find existing rental for this group
                            const existingIndex = this.rentData.findIndex(entry => entry.t_id === groupId);
                            
                            if (existingIndex !== -1) {
                                // Extend existing rental
                                const oldEndDate = moment(this.rentData[existingIndex].time_end, 'DD/MM/YYYY');
                                time_end = oldEndDate.add(keyInfo.days, 'days').format('DD/MM/YYYY');
                                this.rentData[existingIndex].time_end = time_end;
                            } else {
                                // Create new rental
                                time_end = moment().add(keyInfo.days, 'days').format('DD/MM/YYYY');
                                this.rentData.push({ 
                                    t_id: groupId, 
                                    id: event.senderID, 
                                    time_start, 
                                    time_end 
                                });
                            }

                            // Mark key as used
                            keyInfo.used = true;
                            keyInfo.groupId = groupId;
                            keyInfo.usedAt = moment().format('DD/MM/YYYY HH:mm:ss');
                            
                            this.saveKeys();
                            this.saveData();
                            
                            return message.reply(`✅ Key activated successfully!\nBot rental extended for ${keyInfo.days} days.\nNew end date: ${time_end}`);
                            
                        } catch (dateError) {
                            console.error("❌ Error processing date:", dateError);
                            return message.reply("❌ Error processing key. Please try again.");
                        }
                    } else {
                        return message.reply("❌ This key has already been used!");
                    }
                } else {
                    return message.reply("❌ Invalid key format!");
                }
            }
        } catch (error) {
            console.error("💥 Key Handling Error:", error);
        }
    }
};
