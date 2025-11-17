const axios = require('axios');

module.exports = {
    config: {
        name: "test_weather",
        version: "1.0",
        author: "Your Name",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "Get weather information",
            bn: "আবহাওয়ার তথ্য পান"
        },
        longDescription: {
            en: "Get current weather information for a location",
            bn: "একটি অবস্থানের জন্য বর্তমান আবহাওয়ার তথ্য পান"
        },
        category: "utility",
        guide: {
            en: "{pn} [location]",
            bn: "{pn} [অবস্থান]"
        }
    },
    
    languages: {
        en: {
            missingLocation: "Please provide a location. Usage: {pn} [location]",
            error: "Failed to get weather information. Please try again later.",
            notFound: "Location not found. Please check the spelling and try again.",
            weatherInfo: "🌤️ Weather Information for %1:\n\n🌡️ Temperature: %2°C (%3°F)\n📝 Condition: %4\n💧 Humidity: %5%\n💨 Wind Speed: %6 km/h\n🌫️ Pressure: %7 hPa\n👁️ Visibility: %8 km"
        },
        bn: {
            missingLocation: "একটি অবস্থান প্রদান করুন। ব্যবহার: {pn} [অবস্থান]",
            error: "আবহাওয়ার তথ্য পাওয়া যায়নি। পরে আবার চেষ্টা করুন।",
            notFound: "অবস্থান পাওয়া যায়নি। বানান পরীক্ষা করে আবার চেষ্টা করুন।",
            weatherInfo: "🌤️ %1-এর জন্য আবহাওয়ার তথ্য:\n\n🌡️ তাপমাত্রা: %2°C (%3°F)\n📝 অবস্থা: %4\n💧 আর্দ্রতা: %5%\n💨 বাতাসের গতি: %6 km/h\n🌫️ চাপ: %7 hPa\n👁️ দৃশ্যমানতা: %8 km"
        }
    },
    
    onStart: async function({ api, event, args, getText }) {
        const { threadID, messageID } = event;
        
        if (args.length === 0) {
            return api.sendMessage(getText("missingLocation").replace(/{pn}/g, this.config.name), threadID, messageID);
        }
        
        const location = args.join(" ");
        
        try {
            // You need to replace this with a real weather API or your existing implementation
            // This is a mock implementation for testing
            if (location.toLowerCase() === "asdfghjkl") {
                return api.sendMessage(getText("notFound"), threadID, messageID);
            }
            
            // Mock weather data for testing
            const mockWeatherData = {
                name: "Dhaka",
                main: {
                    temp: 28,
                    humidity: 78,
                    pressure: 1013
                },
                weather: [{
                    description: "partly cloudy"
                }],
                wind: {
                    speed: 12
                },
                visibility: 10000
            };
            
            const weatherInfo = getText(
                "weatherInfo",
                mockWeatherData.name,
                Math.round(mockWeatherData.main.temp),
                Math.round((mockWeatherData.main.temp * 9/5) + 32),
                mockWeatherData.weather[0].description,
                mockWeatherData.main.humidity,
                Math.round(mockWeatherData.wind.speed * 3.6),
                mockWeatherData.main.pressure,
                (mockWeatherData.visibility / 1000).toFixed(1)
            );
            
            api.sendMessage(weatherInfo, threadID, messageID);
        } catch (error) {
            console.error(error);
            api.sendMessage(getText("error"), threadID, messageID);
        }
    },
    
    // For backward compatibility with your test script
    run: async function({ api, event, args, getText }) {
        return this.onStart({ api, event, args, getText });
    }
};
