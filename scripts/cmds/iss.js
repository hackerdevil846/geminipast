const axios = require("axios");

module.exports = {
    config: {
        name: "iss",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "tool",
        shortDescription: {
            en: "International Space Station current location"
        },
        longDescription: {
            en: "See the current location of the International Space Station"
        },
        guide: {
            en: "{p}iss"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // Dependency check
            let axiosAvailable = true;
            try {
                require("axios");
            } catch (e) {
                axiosAvailable = false;
            }

            if (!axiosAvailable) {
                return message.reply("❌ Missing dependencies. Please install axios.");
            }

            const loadingMsg = await message.reply("🛰️ Fetching ISS location...");

            // List of ISS API endpoints to try
            const apiEndpoints = [
                "http://api.open-notify.org/iss-now.json",
                "https://api.wheretheiss.at/v1/satellites/25544",
                "http://api.open-notify.org/iss-now.json"
            ];

            let issData = null;
            let lastError = null;

            // Try each API endpoint
            for (const endpoint of apiEndpoints) {
                try {
                    console.log(`Trying ISS API: ${endpoint}`);
                    
                    const response = await axios.get(endpoint, {
                        timeout: 15000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Accept': 'application/json'
                        }
                    });

                    if (endpoint.includes('open-notify.org')) {
                        // Open Notify API format
                        if (response.data && response.data.iss_position) {
                            issData = {
                                latitude: response.data.iss_position.latitude,
                                longitude: response.data.iss_position.longitude,
                                timestamp: response.data.timestamp,
                                source: "Open Notify API"
                            };
                            console.log("Success from Open Notify API");
                            break;
                        }
                    } else if (endpoint.includes('wheretheiss.at')) {
                        // Where The ISS At API format
                        if (response.data && response.data.latitude !== undefined) {
                            issData = {
                                latitude: response.data.latitude,
                                longitude: response.data.longitude,
                                altitude: response.data.altitude,
                                velocity: response.data.velocity,
                                source: "Where The ISS At API"
                            };
                            console.log("Success from Where The ISS At API");
                            break;
                        }
                    }
                    
                } catch (apiError) {
                    lastError = apiError;
                    console.error(`API failed: ${endpoint} - ${apiError.message}`);
                    continue;
                }
            }

            // Unsend loading message
            try {
                await message.unsendMessage(loadingMsg.messageID);
            } catch (unsendError) {
                console.warn("Could not unsend loading message:", unsendError.message);
            }

            if (!issData) {
                console.error("All ISS APIs failed");
                
                // Send fallback information
                return message.reply(
                    "🛰️ ━━━━━━━━━━━━━━━━━━━━ 🛰️\n" +
                    "       INTERNATIONAL SPACE STATION\n" +
                    "🛰️ ━━━━━━━━━━━━━━━━━━━━ 🛰️\n\n" +
                    "❌ Unable to fetch current location\n\n" +
                    "🔭 Real-time tracking:\n" +
                    "https://spotthestation.nasa.gov/tracking_map.cfm\n\n" +
                    "🛰️ Current speed: 28,000 km/h\n" +
                    "🌎 Orbit time: 90 minutes\n" +
                    "👨‍🚀 Crew: 7 astronauts"
                );
            }

            // Format coordinates
            const lat = parseFloat(issData.latitude).toFixed(4);
            const lon = parseFloat(issData.longitude).toFixed(4);
            
            // Determine position over Earth
            let position = "Over ocean";
            if (lat > 0) {
                position = "Northern hemisphere";
            } else {
                position = "Southern hemisphere";
            }

            // Create the response message
            const issMessage = 
                "🛰️ ━━━━━━━━━━━━━━━━━━━━ 🛰️\n" +
                "       INTERNATIONAL SPACE STATION\n" +
                "🛰️ ━━━━━━━━━━━━━━━━━━━━ 🛰️\n\n" +
                `📍 Latitude: ${lat}°\n` +
                `📍 Longitude: ${lon}°\n` +
                `🌍 Position: ${position}\n\n` +
                `🔭 Real-time tracking:\n` +
                `https://spotthestation.nasa.gov/tracking_map.cfm\n\n` +
                `🛰️ Current speed: 28,000 km/h\n` +
                `🌎 Orbit time: 90 minutes\n` +
                `👨‍🚀 Crew: 7 astronauts\n` +
                `📡 Data source: ${issData.source}`;

            await message.reply(issMessage);

        } catch (error) {
            console.error("ISS Error:", error);
            
            let errorMessage = "❌ Failed to fetch ISS data. Please try again later.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ Network error. Please check your internet connection.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ Request timed out. Please try again.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
