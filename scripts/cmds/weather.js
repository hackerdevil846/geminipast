const axios = require("axios");
const moment = require("moment-timezone");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "weather",
    aliases: ["mosam", "forecast"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "🌤️ 𝑊𝑒𝑎𝑡ℎ𝑒𝑟 𝑓𝑜𝑟𝑒𝑐𝑎𝑠𝑡 𝑎𝑛𝑑 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
    },
    longDescription: {
      en: "𝐺𝑒𝑡 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑤𝑒𝑎𝑡ℎ𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑛𝑑 7-𝑑𝑎𝑦 𝑓𝑜𝑟𝑒𝑐𝑎𝑠𝑡 𝑓𝑜𝑟 𝑎𝑛𝑦 𝑙𝑜𝑐𝑎𝑡𝑖𝑜𝑛"
    },
    guide: {
      en: "{p}weather [𝑙𝑜𝑐𝑎𝑡𝑖𝑜𝑛 𝑛𝑎𝑚𝑒]"
    },
    countDown: 15,
    dependencies: {
      "axios": "",
      "moment-timezone": "",
      "canvas": "",
      "fs-extra": "",
      "path": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const { threadID, messageID } = event;
      const area = args.length > 0 ? args.join(" ") : "Dhaka";
      
      const loadingMsg = await message.reply(`⏳ 𝐺𝑒𝑡𝑡𝑖𝑛𝑔 𝑤𝑒𝑎𝑡ℎ𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑓𝑜𝑟 ${area}...`);

      let coordinates;
      if (area.toLowerCase().trim() === "dhaka") {
        coordinates = { lat: 23.8103, lon: 90.4125, name: "Dhaka" };
      } else {
        coordinates = await getCoordinates(area);
      }

      if (!coordinates) {
        await api.unsendMessage(loadingMsg.messageID);
        return message.reply(`❌ 𝐿𝑜𝑐𝑎𝑡𝑖𝑜𝑛 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑: ${area}`);
      }

      const weatherResponse = await axios.get("https://api.open-meteo.com/v1/forecast", {
        params: {
          latitude: coordinates.lat,
          longitude: coordinates.lon,
          hourly: "temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,wind_speed_10m,wind_direction_10m",
          daily: "weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset",
          timezone: "auto",
          forecast_days: 7
        }
      });

      const weatherData = weatherResponse.data;
      if (!weatherData || (!weatherData.hourly && !weatherData.daily)) {
        throw new Error("𝑁𝑜 𝑤𝑒𝑎𝑡ℎ𝑒𝑟 𝑑𝑎𝑡𝑎 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒");
      }

      const apiTimezone = weatherData.timezone || "UTC";
      const nowIso = moment().tz(apiTimezone).startOf("hour").format();
      const hourly = weatherData.hourly || {};
      const daily = weatherData.daily || {};
      
      let currentIndex = -1;
      if (hourly.time && Array.isArray(hourly.time)) {
        currentIndex = hourly.time.indexOf(nowIso);
        if (currentIndex === -1) {
          currentIndex = findNearestIndex(hourly.time, nowIso);
        }
      }

      const currentTemperature = (hourly.temperature_2m && hourly.temperature_2m[currentIndex] != null)
        ? hourly.temperature_2m[currentIndex]
        : null;

      const currentApparent = (hourly.apparent_temperature && hourly.apparent_temperature[currentIndex] != null)
        ? hourly.apparent_temperature[currentIndex]
        : null;

      const currentHumidity = (hourly.relativehumidity_2m && hourly.relativehumidity_2m[currentIndex] != null)
        ? hourly.relativehumidity_2m[currentIndex]
        : null;

      const currentWindSpeed = (hourly.wind_speed_10m && hourly.wind_speed_10m[currentIndex] != null)
        ? hourly.wind_speed_10m[currentIndex]
        : null;

      const currentWeatherCode = (hourly.weathercode && hourly.weathercode[currentIndex] != null)
        ? hourly.weathercode[currentIndex]
        : (daily.weathercode && daily.weathercode[0]);

      const areaName = coordinates.name || area;

      const summary = `📍 ${areaName}

🌡️ 𝐶𝑢𝑟𝑟𝑒𝑛𝑡: ${currentTemperature != null ? Math.round(currentTemperature) + "°C" : "N/A"}
🌡️ 𝐹𝑒𝑒𝑙𝑠 𝑙𝑖𝑘𝑒: ${currentApparent != null ? Math.round(currentApparent) + "°C" : "N/A"}
🌡️ 𝑇𝑜𝑑𝑎𝑦: ${daily.temperature_2m_min && daily.temperature_2m_min[0] != null ? Math.round(daily.temperature_2m_min[0]) + "°C" : "N/A"} | ${daily.temperature_2m_max && daily.temperature_2m_max[0] != null ? Math.round(daily.temperature_2m_max[0]) + "°C" : "N/A"}
💧 𝐻𝑢𝑚𝑖𝑑𝑖𝑡𝑦: ${currentHumidity != null ? Math.round(currentHumidity) + "%" : "N/A"}
🌅 𝑆𝑢𝑛𝑟𝑖𝑠𝑒: ${daily.sunrise && daily.sunrise[0] ? formatHours(daily.sunrise[0], apiTimezone) : "N/A"}
🌄 𝑆𝑢𝑛𝑠𝑒𝑡: ${daily.sunset && daily.sunset[0] ? formatHours(daily.sunset[0], apiTimezone) : "N/A"}
☁️ 𝐶𝑜𝑛𝑑𝑖𝑡𝑖𝑜𝑛: ${getWeatherDescription(currentWeatherCode)}
💨 𝑊𝑖𝑛𝑑: ${currentWindSpeed != null ? Math.round(currentWindSpeed) + " km/h" : "N/A"}`;

      const canvasWidth = 900;
      const canvasHeight = 400;
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext("2d");

      const bgCanvas = createGradientBackground(canvasWidth, canvasHeight);
      ctx.drawImage(bgCanvas, 0, 0, canvasWidth, canvasHeight);

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";

      ctx.font = "bold 32px Arial";
      ctx.fillText(areaName, canvasWidth / 2, 40);

      ctx.font = "20px Arial";
      ctx.fillText(moment().tz("Asia/Dhaka").format("dddd, MMMM D, YYYY"), canvasWidth / 2, 70);

      ctx.font = "bold 24px Arial";
      ctx.fillText("7-𝐷𝑎𝑦 𝐹𝑜𝑟𝑒𝑐𝑎𝑠𝑡", canvasWidth / 2, 110);

      const days = ["𝑆𝑢𝑛", "𝑀𝑜𝑛", "𝑇𝑢𝑒", "𝑊𝑒𝑑", "𝑇ℎ𝑢", "𝐹𝑟𝑖", "𝑆𝑎𝑡"];
      const startX = 80;
      const y = 180;
      const spacing = 140;

      const dayCount = Math.min(6, (daily.time && daily.time.length) ? daily.time.length : 0);
      for (let i = 0; i < dayCount; i++) {
        const dateIso = daily.time[i];
        const date = moment(dateIso).tz(apiTimezone);
        const x = startX + (i * spacing);

        ctx.font = "bold 20px Arial";
        ctx.fillText(days[date.day()], x, y - 20);

        ctx.font = "16px Arial";
        ctx.fillText(date.format("MMM D"), x, y);

        try {
          const iconCode = getWeatherIcon((daily.weathercode && daily.weathercode[i] != null) ? daily.weathercode[i] : (currentWeatherCode || 0));
          const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
          const { data: iconBuffer } = await axios.get(iconUrl, { responseType: 'arraybuffer' });
          const icon = await loadImage(iconBuffer);
          ctx.drawImage(icon, x - 30, y + 10, 60, 40);
        } catch (iconError) {
          console.error("Weather icon error:", iconError);
          ctx.font = "30px Arial";
          ctx.fillText("☁️", x, y + 35);
        }

        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const minTemp = Math.round(daily.temperature_2m_min[i]);
        ctx.font = "bold 18px Arial";
        ctx.fillText(`↑ ${maxTemp}°C`, x, y + 80);
        ctx.font = "16px Arial";
        ctx.fillText(`↓ ${minTemp}°C`, x, y + 100);
      }

      ctx.font = "14px Arial";
      ctx.fillText("𝑃𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑", canvasWidth / 2, canvasHeight - 20);

      const cacheDir = path.join(__dirname, "cache", "weather");
      await fs.ensureDir(cacheDir);

      const outputPath = path.join(cacheDir, `weather_${Date.now()}.jpg`);
      const buffer = canvas.toBuffer("image/jpeg", { quality: 0.95 });
      await fs.writeFile(outputPath, buffer);

      await api.unsendMessage(loadingMsg.messageID);

      await message.reply({
        body: summary,
        attachment: fs.createReadStream(outputPath)
      });

      setTimeout(() => {
        fs.unlink(outputPath, () => {});
      }, 5000);

    } catch (error) {
      console.error("Weather command error:", error);
      let errorMessage = `❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑡𝑡𝑖𝑛𝑔 𝑤𝑒𝑎𝑡ℎ𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑓𝑜𝑟 ${area}.`;
      if (error.response && error.response.status === 404) {
        errorMessage = `❌ 𝐿𝑜𝑐𝑎𝑡𝑖𝑜𝑛 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑: ${area}`;
      }
      return message.reply(errorMessage);
    }
  }
};

// Helper functions
function formatHours(dateString, tz = "Asia/Dhaka") {
  return moment(dateString).tz(tz).format("h:mm A");
}

function getWeatherIcon(weatherCode) {
  const iconMap = {
    0: "01d", 1: "02d", 2: "03d", 3: "04d", 45: "50d", 48: "50d",
    51: "09d", 53: "09d", 55: "09d", 56: "13d", 57: "13d",
    61: "10d", 63: "10d", 65: "10d", 66: "13d", 67: "13d",
    71: "13d", 73: "13d", 75: "13d", 77: "13d", 80: "09d",
    81: "09d", 82: "09d", 85: "13d", 86: "13d", 95: "11d",
    96: "11d", 99: "11d"
  };
  return iconMap[weatherCode] || "01d";
}

function getWeatherDescription(weatherCode) {
  const descriptions = {
    0: "𝐶𝑙𝑒𝑎𝑟 𝑠𝑘𝑦", 1: "𝑀𝑎𝑖𝑛𝑙𝑦 𝑐𝑙𝑒𝑎𝑟", 2: "𝑃𝑎𝑟𝑡𝑙𝑦 𝑐𝑙𝑜𝑢𝑑𝑦", 3: "𝑂𝑣𝑒𝑟𝑐𝑎𝑠𝑡",
    45: "𝐹𝑜𝑔", 48: "𝑅𝑖𝑚𝑒 𝑓𝑜𝑔", 51: "𝐿𝑖𝑔ℎ𝑡 𝑑𝑟𝑖𝑧𝑧𝑙𝑒", 53: "𝑀𝑜𝑑𝑒𝑟𝑎𝑡𝑒 𝑑𝑟𝑖𝑧𝑧𝑙𝑒",
    55: "𝐷𝑒𝑛𝑠𝑒 𝑑𝑟𝑖𝑧𝑧𝑙𝑒", 56: "𝐿𝑖𝑔ℎ𝑡 𝑓𝑟𝑒𝑒𝑧𝑖𝑛𝑔 𝑑𝑟𝑖𝑧𝑧𝑙𝑒", 57: "𝐷𝑒𝑛𝑠𝑒 𝑓𝑟𝑒𝑒𝑧𝑖𝑛𝑔 𝑑𝑟𝑖𝑧𝑧𝑙𝑒",
    61: "𝑆𝑙𝑖𝑔ℎ𝑡 𝑟𝑎𝑖𝑛", 63: "𝑀𝑜𝑑𝑒𝑟𝑎𝑡𝑒 𝑟𝑎𝑖𝑛", 65: "𝐻𝑒𝑎𝑣𝑦 𝑟𝑎𝑖𝑛",
    66: "𝐿𝑖𝑔ℎ𝑡 𝑓𝑟𝑒𝑒𝑧𝑖𝑛𝑔 𝑟𝑎𝑖𝑛", 67: "𝐻𝑒𝑎𝑣𝑦 𝑓𝑟𝑒𝑒𝑧𝑖𝑛𝑔 𝑟𝑎𝑖𝑛", 71: "𝑆𝑙𝑖𝑔ℎ𝑡 𝑠𝑛𝑜𝑤",
    73: "𝑀𝑜𝑑𝑒𝑟𝑎𝑡𝑒 𝑠𝑛𝑜𝑤", 75: "𝐻𝑒𝑎𝑣𝑦 𝑠𝑛𝑜𝑤", 77: "𝑆𝑛𝑜𝑤 𝑔𝑟𝑎𝑖𝑛𝑠",
    80: "𝑆𝑙𝑖𝑔ℎ𝑡 𝑟𝑎𝑖𝑛 𝑠ℎ𝑜𝑤𝑒𝑟𝑠", 81: "𝑀𝑜𝑑𝑒𝑟𝑎𝑡𝑒 𝑟𝑎𝑖𝑛 𝑠ℎ𝑜𝑤𝑒𝑟𝑠", 82: "𝑉𝑖𝑜𝑙𝑒𝑛𝑡 𝑟𝑎𝑖𝑛 𝑠ℎ𝑜𝑤𝑒𝑟𝑠",
    85: "𝑆𝑙𝑖𝑔ℎ𝑡 𝑠𝑛𝑜𝑤 𝑠ℎ𝑜𝑤𝑒𝑟𝑠", 86: "𝐻𝑒𝑎𝑣𝑦 𝑠𝑛𝑜𝑤 𝑠ℎ𝑜𝑤𝑒𝑟𝑠", 95: "𝑇ℎ𝑢𝑛𝑑𝑒𝑟𝑠𝑡𝑜𝑟𝑚",
    96: "𝑇ℎ𝑢𝑛𝑑𝑒𝑟𝑠𝑡𝑜𝑟𝑚 𝑤𝑖𝑡ℎ 𝑠𝑙𝑖𝑔ℎ𝑡 ℎ𝑎𝑖𝑙", 99: "𝑇ℎ𝑢𝑛𝑑𝑒𝑟𝑠𝑡𝑜𝑟𝑚 𝑤𝑖𝑡ℎ ℎ𝑒𝑎𝑣𝑦 ℎ𝑎𝑖𝑙"
  };
  return descriptions[weatherCode] || "𝐶𝑙𝑒𝑎𝑟 𝑠𝑘𝑦";
}

async function getCoordinates(location) {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: location,
        format: "json",
        limit: 1
      },
      headers: {
        'User-Agent': 'WeatherBot/1.0'
      }
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        name: (result.display_name || "").split(",")[0]
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

function createGradientBackground(width, height) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#1e5799");
  gradient.addColorStop(0.5, "#2989d8");
  gradient.addColorStop(1, "#7db9e8");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = 30 + Math.random() * 70;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

function findNearestIndex(timeArray, targetIso) {
  if (!Array.isArray(timeArray) || timeArray.length === 0) return -1;
  let nearest = 0;
  let minDiff = Math.abs(moment(timeArray[0]).diff(moment(targetIso)));
  for (let i = 1; i < timeArray.length; i++) {
    const diff = Math.abs(moment(timeArray[i]).diff(moment(targetIso)));
    if (diff < minDiff) {
      minDiff = diff;
      nearest = i;
    }
  }
  return nearest;
}
