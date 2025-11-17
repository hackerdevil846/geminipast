module.exports = {
    config: {
        name: "getprofile",
        aliases: [],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 0,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "Get Facebook profile ID or link"
        },
        longDescription: {
            en: "Get Facebook profile ID or link from reply, mention or profile URL"
        },
        guide: {
            en: "{p}getprofile [reply|mention|profile_url]"
        }
    },

    onStart: async function({ api, event, args }) {
        try {
            // Fixed dependency check
            let axios, fs;
            try {
                axios = require("axios");
                fs = require("fs-extra");
            } catch (e) {
                return api.sendMessage("❌ | Missing dependencies: axios and fs-extra", event.threadID, event.messageID);
            }

            // Handle message reply
            if (event.type === "message_reply") { 
                const uid = event.messageReply.senderID;
                const profileLink = `https://www.facebook.com/profile.php?id=${uid}`;
                return api.sendMessage(`👤 Profile Link:\n${profileLink}\n\n🆔 UID: ${uid}`, event.threadID, event.messageID);
            }
            
            // No arguments - get own profile
            if (!args[0]) {
                const profileLink = `https://www.facebook.com/profile.php?id=${event.senderID}`;
                return api.sendMessage(`👤 Your Profile Link:\n${profileLink}\n\n🆔 Your UID: ${event.senderID}`, event.threadID, event.messageID);
            }
            
            // Handle profile URL
            if (args[0].includes("facebook.com") || args[0].includes("fb.com") || args[0].startsWith("http")) {
                try {
                    const res_ID = await api.getUID(args[0]);  
                    if (res_ID) {
                        const profileLink = `https://www.facebook.com/profile.php?id=${res_ID}`;
                        return api.sendMessage(`👤 Profile Link:\n${profileLink}\n\n🆔 UID: ${res_ID}`, event.threadID, event.messageID);
                    } else {
                        return api.sendMessage("❌ | Failed to get UID from the provided link", event.threadID, event.messageID);
                    }
                } catch (error) {
                    console.error("UID Extraction Error:", error);
                    return api.sendMessage("❌ | Invalid profile link or failed to extract UID", event.threadID, event.messageID);
                }
            }
            
            // Handle mentions
            if (Object.keys(event.mentions).length > 0) {
                let message = "👥 Profile Links:\n\n";
                for (const [id, name] of Object.entries(event.mentions)) {
                    const profileLink = `https://www.facebook.com/profile.php?id=${id}`;
                    message += `📛 ${name.replace('@', '')}\n🔗 ${profileLink}\n🆔 ${id}\n\n`;
                }
                return api.sendMessage(message, event.threadID, event.messageID);
            }
            
            // Default fallback - own profile
            const profileLink = `https://www.facebook.com/profile.php?id=${event.senderID}`;
            return api.sendMessage(`👤 Your Profile Link:\n${profileLink}\n\n🆔 Your UID: ${event.senderID}`, event.threadID, event.messageID);

        } catch (error) {
            console.error("GetProfile Error:", error);
            return api.sendMessage("❌ | An error occurred while processing your request", event.threadID, event.messageID);
        }
    }
};
