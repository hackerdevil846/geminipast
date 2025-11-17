const axios = require("axios");

module.exports = {
    config: {
        name: "infoip",
        aliases: ["ipinfo", "iplookup"],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "Get detailed information about any IP address"
        },
        longDescription: {
            en: "Fetches detailed geolocation and network information for any IP address"
        },
        guide: {
            en: "{p}infoip [ip-address]"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, args }) {
        try {
            if (!args[0]) {
                return message.reply("❓ | Please provide an IP address to check!\nExample: /infoip 8.8.8.8");
            }

            const ipAddress = args[0].trim();
            
            // Basic IP validation
            const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
            if (!ipRegex.test(ipAddress)) {
                return message.reply("❌ | Invalid IP address format. Please use format like: 8.8.8.8");
            }

            // Validate each octet
            const octets = ipAddress.split('.');
            const isValid = octets.every(octet => {
                const num = parseInt(octet, 10);
                return num >= 0 && num <= 255;
            });

            if (!isValid) {
                return message.reply("❌ | Invalid IP address. Each octet must be between 0 and 255.");
            }

            const res = await axios.get(`http://ip-api.com/json/${ipAddress}`, {
                timeout: 10000 // 10 second timeout
            });
            
            const data = res.data;

            if (data.status === 'fail') {
                return message.reply(`❌ | Failed to get IP information: ${data.message || 'Invalid IP or network error'}`);
            }

            const infoMessage = `
🌐 | IP INFORMATION
━━━━━━━━━━━━━━━━
🔹 IP Address: ${data.query}
🏳️ Country: ${data.country || 'N/A'}
🏙️ City: ${data.city || 'N/A'}
📍 Region: ${data.regionName || 'N/A'}
📡 Latitude: ${data.lat || 'N/A'}
📡 Longitude: ${data.lon || 'N/A'}
🌐 ISP: ${data.isp || 'N/A'}
🕒 Timezone: ${data.timezone || 'N/A'}
🏢 Organization: ${data.org || 'N/A'}
🇺🇸 Country Code: ${data.countryCode || 'N/A'}
📫 ZIP: ${data.zip || 'N/A'}

━━━━━━━━━━━━━━━━
📍 | Location Accuracy: Approximate
⚠️ | Note: IP location may not always be precise`;

            await message.reply(infoMessage);

        } catch (error) {
            console.error("IP Info Error:", error);
            
            let errorMessage = "❌ | An error occurred while fetching IP information.";
            
            if (error.code === 'ECONNREFUSED' || error.code === 'ENETUNREACH') {
                errorMessage = "🌐 | Network error: Cannot connect to IP service. Please check your internet connection.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "⏰ | Request timeout: IP service is taking too long to respond.";
            } else if (error.response) {
                errorMessage = `❌ | API Error: ${error.response.status} - ${error.response.statusText}`;
            } else if (error.request) {
                errorMessage = "🌐 | Network error: No response received from IP service.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
