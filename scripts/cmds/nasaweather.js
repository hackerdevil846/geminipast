const axios = require('axios');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "nasaweather",
    version: "2.1",
    role: 0,
    author: "Asif Mahmud",
    category: "utility",
    shortDescription: {
      en: "Automatic weather updates from NASA satellites"
    },
    longDescription: {
      en: "Get weather information from NASA satellite data with automatic updates"
    },
    guide: {
      en: "nasaweather [city/province]"
    },
    countDown: 3
  },

  onLoad: function({ api }) {
    // Check if global.data exists before setting interval
    if (!global.data) {
      console.log('🌤️ NASA Weather: global.data not available, skipping auto updates');
      return;
    }

    const weatherSchedules = [
      {
        timer: '12:05:00 AM',
        message: ['🌤️ NASA Weather Update\n{weatherInfo}']
      }
    ];

    let isRunning = false;
    
    setInterval(async () => {
      // Prevent multiple simultaneous executions
      if (isRunning) return;
      isRunning = true;

      try {
        const currentTime = new Date(Date.now() + 25200000).toLocaleString().split(/,/).pop().trim();
        const schedule = weatherSchedules.find(i => i.timer === currentTime);
        
        if (schedule) {
          console.log(`🌤️ NASA Weather: Processing scheduled update for ${currentTime}`);
          
          const randomMessage = schedule.message[Math.floor(Math.random() * schedule.message.length)];
          
          // Fetch weather data with timeout
          const res = await Promise.race([
            axios.get(`https://api.popcat.xyz/weather?q=${encodeURIComponent('Ho Chi Minh')}`, {
              timeout: 10000
            }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Weather API timeout')), 10000)
            )
          ]);

          // Check if response data is valid
          if (!res.data || !res.data[0]) {
            console.error('❌ NASA Weather: Invalid API response');
            return;
          }

          const weatherData = res.data[0];
          
          // Validate required fields
          if (!weatherData.location || !weatherData.current) {
            console.error('❌ NASA Weather: Incomplete weather data');
            return;
          }

          let dayOfWeek = moment.tz('Asia/Dhaka').format('dddd');
          const date = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");
          
          // Weather condition mapping with safe access
          let weatherCondition = 'Unknown';
          if (weatherData.current.skytext) {
            weatherCondition = weatherData.current.skytext;
          }
          const conditions = {
            'Sunny': 'Sunny',
            'Mostly Sunny': 'Mostly Sunny',
            'Partly Sunny': 'Partly Sunny',
            'Rain Showers': 'Rain Showers',
            'T-Storms': 'Thunderstorms',
            'Light Rain': 'Light Rain',
            'Mostly Cloudy': 'Mostly Cloudy',
            'Rain': 'Rain',
            'Heavy T-Storms': 'Heavy Thunderstorms',
            'Partly Cloudy': 'Partly Cloudy',
            'Mostly Clear': 'Mostly Clear',
            'Cloudy': 'Cloudy',
            'Clear': 'Clear'
          };
          weatherCondition = conditions[weatherCondition] || weatherCondition;

          // Wind direction mapping with safe access
          let windDirection = 'Unknown';
          if (weatherData.current.winddisplay) {
            try {
              const windParts = weatherData.current.winddisplay.toString().split(" ");
              windDirection = windParts[2] || 'Unknown';
            } catch (e) {
              windDirection = 'Unknown';
            }
          }
          const directions = {
            'Northeast': 'Northeast',
            'Northwest': 'Northwest',
            'Southeast': 'Southeast',
            'Southwest': 'Southwest',
            'East': 'East',
            'West': 'West',
            'North': 'North',
            'South': 'South'
          };
          windDirection = directions[windDirection] || windDirection;

          const weatherInfo = `📍 Location: ${weatherData.location.name || 'Unknown'}\n📅 Date: ${dayOfWeek}, ${date}\n🌡️ Temperature: ${weatherData.current.temperature || 'N/A'}°${weatherData.location.degreetype || 'C'}\n🌈 Condition: ${weatherCondition}\n💧 Humidity: ${weatherData.current.humidity || 'N/A'}%\n💨 Wind: ${weatherData.current.windspeed || 'N/A'} ${windDirection}\n🕒 Recorded: ${weatherData.current.observationtime || 'N/A'}\n\n🔭 Use "nasaweather [city]" for detailed forecast`;

          // 🔥 COMPLETELY FIXED: Safe thread iteration with batch processing
          if (global.data && global.data.allThreadID && Array.isArray(global.data.allThreadID)) {
            const threads = global.data.allThreadID;
            console.log(`🌤️ NASA Weather: Sending to ${threads.length} threads`);
            
            // Process in batches to avoid rate limits
            const batchSize = 5;
            for (let i = 0; i < threads.length; i += batchSize) {
              const batch = threads.slice(i, i + batchSize);
              
              await Promise.allSettled(batch.map(async (threadID) => {
                try {
                  await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
                  await api.sendMessage(
                    randomMessage.replace(/{weatherInfo}/g, weatherInfo), 
                    threadID
                  );
                  console.log(`✅ NASA Weather: Sent to thread ${threadID}`);
                } catch (sendError) {
                  console.error(`❌ NASA Weather: Failed to send to thread ${threadID}:`, sendError.message);
                }
              }));
            }
          } else {
            console.log('🌤️ NASA Weather: No threads available for update');
          }
        }
      } catch (error) {
        console.error('❌ NASA Weather update error:', error.message);
      } finally {
        isRunning = false;
      }
    }, 60000); // Check every minute
  },

  onStart: async function({ message, event, args }) {
    try {
      const city = args.join(" ").trim();
      if (!city) {
        return message.reply("🌍 Please enter a city or province name to check weather\n\nExample: nasaweather Dhaka\nExample: nasaweather New York");
      }

      // Validate city name
      if (city.length < 2 || city.length > 50) {
        return message.reply("❌ Please enter a valid city name (2-50 characters)");
      }

      console.log(`🌤️ NASA Weather: Fetching data for ${city}`);

      // Fetch weather data with timeout and error handling
      const res = await Promise.race([
        axios.get(`https://api.popcat.xyz/weather?q=${encodeURIComponent(city)}`, {
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Weather API timeout')), 15000)
        )
      ]);
      
      // Check if response data is valid
      if (!res.data || !res.data[0]) {
        return message.reply(`❌ Could not find weather information for "${city}".\n\nPlease check:\n• City name spelling\n• Internet connection\n• Try again later`);
      }

      const weatherData = res.data[0];
      const forecast = weatherData.forecast;
      
      if (!forecast || !Array.isArray(forecast) || forecast.length === 0) {
        return message.reply("❌ No forecast data available for this location.");
      }

      let weatherText = `🌤️ NASA Weather Forecast for: ${city}\n\n`;
      
      // Process forecast for next 5 days
      for (let i = 0; i < Math.min(5, forecast.length); i++) {
        const dayForecast = forecast[i];
        
        if (!dayForecast) continue;

        // Day mapping with safe access
        let dayOfWeek = 'Unknown';
        if (dayForecast.day) {
          const days = {
            'Sun': 'Sunday', 'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday',
            'Thu': 'Thursday', 'Fri': 'Friday', 'Sat': 'Saturday',
            'Sunday': 'Sunday', 'Monday': 'Monday', 'Tuesday': 'Tuesday', 'Wednesday': 'Wednesday',
            'Thursday': 'Thursday', 'Friday': 'Friday', 'Saturday': 'Saturday'
          };
          dayOfWeek = days[dayForecast.day] || dayForecast.day;
        }

        // Weather condition mapping with safe access
        let weatherCondition = 'Unknown';
        if (dayForecast.skytextday) {
          const conditions = {
            'Sunny': 'Sunny', 'Mostly Sunny': 'Mostly Sunny', 'Partly Sunny': 'Partly Sunny',
            'Rain Showers': 'Rain Showers', 'T-Storms': 'Thunderstorms', 'Light Rain': 'Light Rain',
            'Mostly Cloudy': 'Mostly Cloudy', 'Rain': 'Rain', 'Heavy T-Storms': 'Heavy Thunderstorms',
            'Partly Cloudy': 'Partly Cloudy', 'Mostly Clear': 'Mostly Clear', 'Cloudy': 'Cloudy',
            'Clear': 'Clear', 'Cloudy with showers': 'Cloudy with Rain'
          };
          weatherCondition = conditions[dayForecast.skytextday] || dayForecast.skytextday;
        }

        weatherText += `📅 ${i+1}. ${dayOfWeek} (${dayForecast.date || 'N/A'})\n` +
                      `🌡️  Temperature: ${dayForecast.low || 'N/A'}°C - ${dayForecast.high || 'N/A'}°C\n` +
                      `🌈  Condition: ${weatherCondition}\n` +
                      `🌧️  Rain Chance: ${dayForecast.precip || '0'}%\n\n`;
      }

      // Add current weather info if available
      if (weatherData.current) {
        weatherText += `📍 Current Weather:\n` +
                      `🌡️  Temperature: ${weatherData.current.temperature || 'N/A'}°C\n` +
                      `💧  Humidity: ${weatherData.current.humidity || 'N/A'}%\n` +
                      `💨  Wind: ${weatherData.current.winddisplay || 'N/A'}\n` +
                      `🔭  Source: NASA Satellite Data via PopCat API`;
      }

      // Send the weather information
      await message.reply(weatherText);
      console.log(`✅ NASA Weather: Successfully sent forecast for ${city}`);
      
    } catch (error) {
      console.error('❌ NASA Weather command error:', error.message);
      
      let errorMessage = "❌ Error getting weather information. ";
      
      if (error.message.includes('timeout')) {
        errorMessage += "The weather service is taking too long to respond. Please try again later.";
      } else if (error.message.includes('Network Error') || error.message.includes('ENOTFOUND')) {
        errorMessage += "Network connection issue. Please check your internet connection.";
      } else if (error.message.includes('404') || error.message.includes('Not Found')) {
        errorMessage += "Weather service temporarily unavailable.";
      } else {
        errorMessage += "Please check the city name and try again.";
      }
      
      await message.reply(errorMessage);
    }
  }
};
