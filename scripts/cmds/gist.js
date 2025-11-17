const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
    config: {
        name: "gist",
        aliases: ["githubgist", "codeupload"],
        version: "7.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 2,
        category: "developer",
        shortDescription: {
            en: "Convert code into a GitHub Gist link"
        },
        longDescription: {
            en: "Convert code into a beautiful GitHub Gist link for easy sharing & usage"
        },
        guide: {
            en: "{p}gist [filename] (reply to code message)"
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Ensure filename provided
            if (!args[0]) {
                return message.reply("❌ Please specify a filename.\n\n📝 Usage: gist <filename> (reply to code message)\n💡 Example: gist help");
            }

            const fileName = args[0].replace(/\.js$/i, "");
            let codeContent = "";

            // If user replies to a message (with code)
            if (event.messageReply) {
                codeContent = event.messageReply.body || "";
                if (!codeContent.trim()) {
                    return message.reply("❌ The replied message doesn't contain any text/code.");
                }
            } 
            // If user specifies a file from commands folder
            else {
                const commandsDir = path.join(__dirname, "..");
                const filePath = path.join(commandsDir, `${fileName}.js`);

                if (!fs.existsSync(filePath)) {
                    return message.reply(`❌ File "${fileName}.js" not found in commands folder.`);
                }

                try {
                    codeContent = await fs.readFile(filePath, "utf-8");
                } catch (readError) {
                    return message.reply(`❌ Failed to read file "${fileName}.js".`);
                }

                if (!codeContent.trim()) {
                    return message.reply(`❌ The file "${fileName}.js" is empty. Nothing to upload.`);
                }
            }

            // Validate code content length
            if (codeContent.length > 100000) {
                return message.reply("❌ Code content is too large (max 100KB).");
            }

            // Call external API to create gist
            const gistAPI = "https://noobs-api-sable.vercel.app/gist";
            
            const response = await axios.get(gistAPI, {
                params: {
                    filename: `${fileName}.js`,
                    code: codeContent,
                    description: "Uploaded via Bot",
                    isPublic: true
                },
                timeout: 30000,
                validateStatus: function (status) {
                    return status >= 200 && status < 500;
                }
            });

            // Handle API response
            if (response.status !== 200) {
                throw new Error(`API returned status ${response.status}`);
            }

            if (!response.data) {
                throw new Error("Empty response from API");
            }

            if (!response.data.success) {
                throw new Error(response.data.message || "API request failed");
            }

            if (!response.data.raw_url) {
                throw new Error("No raw URL received from API");
            }

            // Extract gist details
            const rawUrl = response.data.raw_url;
            const gistUrl = rawUrl.replace("/raw/", "/");
            const sourceType = event.messageReply ? "Message Reply" : "Command File";

            // Success message
            const successMsg = `
✅ 𝐆𝐢𝐬𝐭 𝐜𝐫𝐞𝐚𝐭𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!
━━━━━━━━━━━━━━━━━━
📝 𝐅𝐢𝐥𝐞𝐧𝐚𝐦𝐞: ${fileName}.js
📂 𝐒𝐨𝐮𝐫𝐜𝐞: ${sourceType}
🔗 𝐆𝐢𝐬𝐭 𝐔𝐑𝐋: ${gistUrl}
🔗 𝐑𝐚𝐰 𝐔𝐑𝐋: ${rawUrl}
━━━━━━━━━━━━━━━━━━
💡 𝐓𝐢𝐩: Use the raw URL for direct access to clean code.
            `.trim();

            return message.reply(successMsg);

        } catch (error) {
            console.error("📛 Gist Command Error:", error);

            let errorMessage = "❌ An unexpected error occurred while processing your request.";

            if (error.code === "ECONNABORTED") {
                errorMessage = "⏰ Request timed out. Please try again later.";
            } 
            else if (error.code === "ENOTFOUND") {
                errorMessage = "🌐 Cannot connect to Gist API. Check your internet connection.";
            }
            else if (error.response) {
                if (error.response.status === 404) {
                    errorMessage = "🔍 Gist API endpoint not found.";
                } else if (error.response.status === 429) {
                    errorMessage = "🚫 Too many requests. Please try again later.";
                } else {
                    errorMessage = `🌐 Gist API error (${error.response.status}). Try again later.`;
                }
            } 
            else if (error.message.includes("ENOENT")) {
                errorMessage = `📁 File "${args[0]}.js" not found in commands folder.`;
            } 
            else if (error.message.includes("No raw URL")) {
                errorMessage = "🔗 Failed to get gist URL from API.";
            }
            else if (error.message.includes("API returned status")) {
                errorMessage = `🌐 API error: ${error.message}`;
            }
            else if (error.message.includes("Empty response")) {
                errorMessage = "🌐 Empty response from Gist API.";
            }

            return message.reply(errorMessage);
        }
    }
};
