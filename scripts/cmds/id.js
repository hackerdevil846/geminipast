const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
    config: {
        name: "id",
        aliases: [],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "User ID information"
        },
        longDescription: {
            en: "Shows user ID information with profile picture"
        },
        guide: {
            en: "{p}id [reply/mention/url/uid]"
        }
    },

    onStart: async function({ api, event, args, usersData }) {
        try {
            const { threadID, messageID, type, messageReply, mentions } = event;
            
            let uid;
            let name;

            // Determine user ID and name based on input
            if (type === "message_reply") {
                uid = messageReply.senderID;
                try {
                    name = await usersData.getName(uid);
                } catch {
                    name = "Unknown User";
                }
            } else if (args.length === 0) {
                uid = event.senderID;
                try {
                    const res = await axios.get(`https://www.nguyenmanh.name.vn/api/fbInfo?id=${uid}&apikey=LV7LWgAp`, {
                        timeout: 10000
                    });
                    name = res.data?.result?.name || await usersData.getName(uid) || "Your Name";
                } catch {
                    try {
                        name = await usersData.getName(uid) || "Your Name";
                    } catch {
                        name = "Your Name";
                    }
                }
            } else if (args[0].match(/(https?:\/\/)?(www\.)?facebook\.com\/.+/)) {
                try {
                    uid = await api.getUID(args[0]);
                    try {
                        const userInfo = await api.getUserInfo(uid);
                        name = userInfo[uid]?.name || "Unknown User";
                    } catch {
                        name = "Unknown User";
                    }
                } catch {
                    return api.sendMessage("❌ Invalid Facebook link or unable to get UID", threadID, messageID);
                }
            } else if (Object.keys(mentions).length > 0) {
                uid = Object.keys(mentions)[0];
                name = mentions[uid] || "Unknown User";
            } else {
                uid = args[0];
                try {
                    name = await usersData.getName(uid) || "Unknown User";
                } catch {
                    name = "Unknown User";
                }
            }

            // Validate UID
            if (!uid || isNaN(uid)) {
                return api.sendMessage("❌ Invalid user ID", threadID, messageID);
            }

            const callback = () => {
                api.sendMessage({
                    body: `🎭 USER INFO CARD\n━━━━━━━━━━━━━━\n✨ Name: ${name}\n🔖 UID: ${uid}\n📨 Messenger: m.me/${uid}\n🔗 Profile Link: https://facebook.com/${uid}\n━━━━━━━━━━━━━━`,
                    attachment: fs.createReadStream(__dirname + "/cache/1.png")
                }, threadID, () => {
                    // Clean up file after sending
                    try {
                        if (fs.existsSync(__dirname + "/cache/1.png")) {
                            fs.unlinkSync(__dirname + "/cache/1.png");
                        }
                    } catch (cleanupError) {
                        console.error("Cleanup error:", cleanupError);
                    }
                }, messageID);
            };

            // Ensure cache directory exists
            const cacheDir = __dirname + "/cache";
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            // Download profile picture
            request(encodeURI(`https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
                .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
                .on('close', callback)
                .on('error', (err) => {
                    console.error("Image download error:", err);
                    // Send without image if download fails
                    api.sendMessage({
                        body: `🎭 USER INFO CARD\n━━━━━━━━━━━━━━\n✨ Name: ${name}\n🔖 UID: ${uid}\n📨 Messenger: m.me/${uid}\n🔗 Profile Link: https://facebook.com/${uid}\n━━━━━━━━━━━━━━\n❌ Could not load profile picture`
                    }, threadID, messageID);
                });

        } catch (error) {
            console.error("ID command error:", error);
            let errorMessage = "❌ An error occurred while processing your request.";
            
            if (error.message.includes("timeout")) {
                errorMessage = "❌ Request timeout. Please try again.";
            } else if (error.message.includes("ENOTFOUND")) {
                errorMessage = "❌ Network error. Please check your connection.";
            }
            
            api.sendMessage(errorMessage, event.threadID, event.messageID);
        }
    }
};
