const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "animegifpro",
    aliases: [],
    version: "1.0",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    category: "media",
    shortDescription: {
      en: "Generate an anime GIF based on a prompt"
    },
    longDescription: {
      en: "Generate an anime GIF based on a text prompt"
    },
    guide: {
      en: "{p}animegifpro [prompt]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ message, args, event }) {
    try {
      // Dependency check with better validation
      let dependenciesAvailable = true;
      try {
        require("axios");
        require("fs-extra");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        return message.reply("❌ Missing dependencies. Please install axios and fs-extra.");
      }

      if (!args[0]) {
        return message.reply(
          "🎨 Please provide a prompt for generating an anime GIF.\n\nExample: /animegifpro cute anime girl dancing"
        );
      }

      const userPrompt = args.join(" ").trim();
      
      // Validate prompt length
      if (userPrompt.length > 100) {
        return message.reply("❌ Prompt is too long. Please keep it under 100 characters.");
      }

      if (userPrompt.length < 2) {
        return message.reply("❌ Prompt is too short. Please provide a meaningful description.");
      }

      const loadingMsg = await message.reply("⏳ Generating anime GIF... please wait ✨");

      // Create cache directory
      const cacheDir = path.join(__dirname, "cache");
      try {
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
        }
      } catch (dirError) {
        console.error("Directory creation error:", dirError);
        await message.unsend(loadingMsg.messageID);
        return message.reply("❌ Failed to create cache directory.");
      }

      const gifPath = path.join(cacheDir, `anime_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.gif`);
      const encodedPrompt = encodeURIComponent(userPrompt + " anime");

      let success = false;
      let lastError = null;

      // Tenor API with enhanced error handling
      try {
        console.log(`🔍 Searching Tenor for: ${userPrompt}`);
        
        const tenorUrl = `https://tenor.googleapis.com/v2/search?q=${encodedPrompt}&key=AIzaSyBv0DNbrwe7XyGoRu1xx_lrlaAcyKNThkA&limit=8&media_filter=gif&contentfilter=high`;
        
        const tenorResponse = await axios.get(tenorUrl, {
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json'
          }
        });

        if (tenorResponse.data && tenorResponse.data.results && tenorResponse.data.results.length > 0) {
          // Filter for GIFs and try multiple results
          const gifResults = tenorResponse.data.results.filter(result => 
            result.media_formats && result.media_formats.gif
          );

          if (gifResults.length > 0) {
            // Try up to 3 different GIFs
            for (let i = 0; i < Math.min(3, gifResults.length); i++) {
              try {
                const gifUrl = gifResults[i].media_formats.gif.url;
                console.log(`📥 Attempting to download GIF ${i + 1}: ${gifUrl}`);

                const gifData = await axios.get(gifUrl, {
                  responseType: "arraybuffer",
                  timeout: 30000,
                  headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': 'https://tenor.com/'
                  },
                  maxContentLength: 10 * 1024 * 1024 // 10MB limit
                });

                // Check if it's actually a GIF
                const contentType = gifData.headers['content-type'];
                if (contentType && contentType.includes('gif')) {
                  await fs.writeFile(gifPath, Buffer.from(gifData.data));

                  // Verify file was written and has content
                  const stats = await fs.stat(gifPath);
                  if (stats.size > 1000) { // At least 1KB
                    console.log(`✅ GIF downloaded successfully (${(stats.size / 1024 / 1024).toFixed(2)}MB)`);

                    // Unsend loading message
                    try {
                      await message.unsend(loadingMsg.messageID);
                    } catch (unsendError) {
                      console.warn("Could not unsend loading message:", unsendError.message);
                    }

                    await message.reply({
                      body: `✅ Anime GIF Generated!\n\n📝 Prompt: "${userPrompt}"\n🎯 Source: Tenor API\n✨ Enjoy your anime GIF!`,
                      attachment: fs.createReadStream(gifPath)
                    });
                    
                    success = true;
                    break;
                  } else {
                    console.log("❌ Downloaded file is too small, trying next GIF...");
                    await fs.unlink(gifPath).catch(() => {});
                  }
                }
              } catch (downloadError) {
                console.error(`❌ GIF download attempt ${i + 1} failed:`, downloadError.message);
                // Continue to next GIF
                continue;
              }
            }
          } else {
            throw new Error("No GIF results found in API response");
          }
        } else {
          throw new Error("No results from Tenor API");
        }
      } catch (tenorError) {
        lastError = tenorError;
        console.error("❌ Tenor API failed:", tenorError.message);
      }

      // Clean up loading message if still exists
      if (!success) {
        try {
          await message.unsend(loadingMsg.messageID);
        } catch (unsendError) {
          console.warn("Could not unsend loading message:", unsendError.message);
        }

        const errorMessages = [
          `❌ Could not find an anime GIF for "${userPrompt}". Try a different prompt.`,
          `❌ No anime GIFs found for "${userPrompt}". Please try another description.`,
          `❌ Sorry, couldn't generate a GIF for "${userPrompt}". Try being more specific.`
        ];
        
        const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        await message.reply(randomError);
      }

      // Clean up GIF file
      try {
        if (await fs.pathExists(gifPath)) {
          await fs.unlink(gifPath);
          console.log("🧹 Cleaned up temporary GIF file");
        }
      } catch (cleanupError) {
        console.warn("Cleanup error:", cleanupError.message);
      }

    } catch (error) {
      console.error("💥 AnimeGIFPro command error:", error);
      
      // Don't send error message to chat to avoid spam
      // Just log it for debugging
    }
  }
};
