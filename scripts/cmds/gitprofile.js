const axios = require("axios");

module.exports = {
    config: {
        name: "gitprofile",
        aliases: ["github", "gitinfo"],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "info",
        shortDescription: {
            en: "Get GitHub user profile info"
        },
        longDescription: {
            en: "Fetch GitHub user profile details using username"
        },
        guide: {
            en: "{p}gitprofile <username>\nExample: {p}gitprofile Asif"
        }
    },

    onStart: async function ({ message, args }) {
        try {
            if (!args[0]) {
                return message.reply("❌ Please provide a GitHub username.\n\n💡 Example: gitprofile Asif");
            }

            const username = args[0].trim();

            // Validate username format
            if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(username)) {
                return message.reply("❌ Invalid GitHub username format.");
            }

            const response = await axios.get(`https://api.popcat.xyz/v2/github/${encodeURIComponent(username)}`, {
                timeout: 10000,
                validateStatus: function (status) {
                    return status < 500; // Resolve only if status code < 500
                }
            });

            // Handle API response
            if (response.status === 404) {
                return message.reply(`❌ GitHub user "${username}" not found.`);
            }

            if (response.status !== 200) {
                return message.reply(`❌ API error (Status: ${response.status}). Please try again later.`);
            }

            const data = response.data;

            if (!data || data.error) {
                return message.reply("❌ Failed to fetch GitHub profile data.");
            }

            // Format the profile information
            const profileInfo = `
🔷 𝐆𝐢𝐭𝐇𝐮𝐛 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 𝐈𝐧𝐟𝐨 🔷

👤 𝐍𝐚𝐦𝐞: ${data.name || "Not specified"}
🔖 𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞: ${data.login || "N/A"}
📝 𝐁𝐢𝐨: ${data.bio || "No bio available"}
🏢 𝐂𝐨𝐦𝐩𝐚𝐧𝐲: ${data.company || "Not specified"}
📍 𝐋𝐨𝐜𝐚𝐭𝐢𝐨𝐧: ${data.location || "Not specified"}
🔗 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 𝐔𝐑𝐋: ${data.html_url || "N/A"}
📅 𝐂𝐫𝐞𝐚𝐭𝐞𝐝: ${data.created_at ? new Date(data.created_at).toLocaleDateString() : "N/A"}
📚 𝐏𝐮𝐛𝐥𝐢𝐜 𝐑𝐞𝐩𝐨𝐬: ${data.public_repos || 0}
👥 𝐅𝐨𝐥𝐥𝐨𝐰𝐞𝐫𝐬: ${data.followers || 0}
✅ 𝐅𝐨𝐥𝐥𝐨𝐰𝐢𝐧𝐠: ${data.following || 0}

💡 Profile: ${data.html_url || "N/A"}
            `.trim();

            await message.reply(profileInfo);

        } catch (error) {
            console.error("📛 GitProfile Error:", error);
            
            let errorMessage = "❌ An error occurred while fetching GitHub profile.";

            if (error.code === "ECONNABORTED") {
                errorMessage = "⏰ Request timeout. Please try again.";
            } 
            else if (error.code === "ENOTFOUND") {
                errorMessage = "🌐 Network error. Please check your internet connection.";
            }
            else if (error.response) {
                if (error.response.status === 404) {
                    errorMessage = `❌ GitHub user "${args[0]}" not found.`;
                } else if (error.response.status === 403) {
                    errorMessage = "🚫 API rate limit exceeded. Please try again later.";
                } else {
                    errorMessage = `❌ API error (${error.response.status}). Please try again.`;
                }
            }

            await message.reply(errorMessage);
        }
    }
};
