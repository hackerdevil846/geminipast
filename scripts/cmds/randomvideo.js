const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "randomvideo",
    aliases: ["rvideo", "randvid"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 15,
    role: 0,
    category: "media",
    shortDescription: {
      en: "🎬 Send random high-quality videos"
    },
    longDescription: {
      en: "🎬 Send random high-quality videos from various categories with multiple API sources"
    },
    guide: {
      en: "{p}randomvideo [category]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ api }) {
    try {
      // Initialize cache directory
      const cacheDir = path.join(__dirname, 'cache', 'random_videos');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      console.log("Random video command initialized. Cache directory ready.");
      
      // Start periodic cache cleaning
      this.startCacheCleaner();
    } catch (error) {
      console.error('Initialization error:', error);
    }
  },

  startCacheCleaner: function() {
    // Clean cache every 10 minutes
    setInterval(() => {
      try {
        const cacheDir = path.join(__dirname, 'cache', 'random_videos');
        if (!fs.existsSync(cacheDir)) return;
        
        const files = fs.readdirSync(cacheDir);
        const now = Date.now();
        
        files.forEach(file => {
          const filePath = path.join(cacheDir, file);
          const stats = fs.statSync(filePath);
          const fileAge = now - stats.mtimeMs;
          
          if (fileAge > 600000) { // 10 minutes
            fs.unlinkSync(filePath);
          }
        });
      } catch (cleanError) {
        console.error('Cache cleanup error:', cleanError);
      }
    }, 600000); // 10 minutes
  },

  onStart: async function({ api, event, args }) {
    try {
      // Check dependencies
      try {
        if (!axios || !fs || !path) {
          throw new Error("Missing required dependencies");
        }
      } catch (err) {
        return api.sendMessage("❌ | Required dependencies are missing. Please install axios and fs-extra.", event.threadID, event.messageID);
      }

      const { threadID, messageID } = event;
      
      // Enhanced API endpoints with multiple backup sources
      const VIDEO_CATEGORIES = {
        funny: [
          "https://api.randomvideo.repl.co/funny",
          "https://api.easy0.repl.co/v1/funnyvideo",
          "https://api.waifu.pics/sfw/dance",
          "https://nekos.life/api/v2/img/tickle",
          "https://api.otakugifs.xyz/gif?reaction=laugh",
          "https://some-random-api.ml/animu/hug",
          "https://api.nekosapi.com/v3/images/random?tag=funny",
          "https://api.catboys.com/img",
          "https://api.nekobot.xyz/api/image?type=hug"
        ],
        anime: [
          "https://api.randomvideo.repl.co/anime",
          "https://api.easy0.repl.co/v1/animevideo",
          "https://api.waifu.pics/sfw/waifu",
          "https://nekos.life/api/v2/img/neko",
          "https://api.otakugifs.xyz/gif?reaction=happy",
          "https://some-random-api.ml/animu/waifu",
          "https://api.nekosapi.com/v3/images/random?tag=anime",
          "https://api.nekobot.xyz/api/image?type=neko",
          "https://api.catboys.com/img"
        ],
        nature: [
          "https://api.randomvideo.repl.co/nature",
          "https://api.easy0.repl.co/v1/naturevideo",
          "https://picsum.photos/800/600",
          "https://source.unsplash.com/800x600/?nature",
          "https://api.unsplash.com/photos/random?query=nature&client_id=demo",
          "https://api.pexels.com/v1/search?query=nature&per_page=1",
          "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=demo&tags=nature&format=json",
          "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY",
          "https://source.unsplash.com/featured/800x600/?landscape"
        ],
        gaming: [
          "https://api.randomvideo.repl.co/gaming",
          "https://api.easy0.repl.co/v1/gamingvideo",
          "https://api.steampowered.com/ISteamApps/GetAppList/v2/",
          "https://api.rawg.io/api/games?key=demo",
          "https://api.igdb.com/v4/games",
          "https://api.giantbomb.com/api/games/",
          "https://api.twitch.tv/helix/games/top",
          "https://api.boardgameatlas.com/api/search?random=true",
          "https://api.opendota.com/api/heroes"
        ],
        animal: [
          "https://api.randomvideo.repl.co/animals",
          "https://api.easy0.repl.co/v1/animalvideo",
          "https://dog.ceo/api/breeds/image/random",
          "https://api.thecatapi.com/v1/images/search",
          "https://randomfox.ca/floof/",
          "https://some-random-api.ml/img/dog",
          "https://api.shibe.online/shibes?count=1&urls=true&httpsUrls=true",
          "https://api.thedogapi.com/v1/images/search",
          "https://aws.random.cat/meow"
        ],
        music: [
          "https://api.randomvideo.repl.co/music",
          "https://api.easy0.repl.co/v1/musicvideo",
          "https://api.spotify.com/v1/browse/featured-playlists",
          "https://api.deezer.com/chart/0/tracks",
          "https://api.soundcloud.com/tracks",
          "https://api.last.fm/2.0/?method=chart.gettoptracks&api_key=demo&format=json",
          "https://api.musixmatch.com/ws/1.1/chart.tracks.get?apikey=demo",
          "https://api.genius.com/search?q=random",
          "https://api.jamendo.com/v3.0/tracks/"
        ],
        sports: [
          "https://api.randomvideo.repl.co/sports",
          "https://api.easy0.repl.co/v1/sportsvideo",
          "https://api.football-data.org/v2/competitions/",
          "https://api.sportsdata.io/v3/nfl/scores/json/Games/2023",
          "https://api.mysportsfeeds.com/v2.1/pull/nba/current/games.json",
          "https://api.sportradar.us/soccer/trial/v4/en/tournaments/",
          "https://api.the-odds-api.com/v4/sports/",
          "https://api.espn.com/v1/sports/football/nfl/news/",
          "https://statsapi.mlb.com/api/v1/schedule"
        ],
        tech: [
          "https://api.randomvideo.repl.co/tech",
          "https://api.easy0.repl.co/v1/techvideo",
          "https://api.github.com/repos/microsoft/vscode",
          "https://hacker-news.firebaseio.com/v0/topstories.json",
          "https://api.producthunt.com/v1/posts",
          "https://newsapi.org/v2/everything?q=technology&apiKey=demo",
          "https://api.stackexchange.com/2.3/questions?order=desc&sort=activity&site=stackoverflow",
          "https://api.reddit.com/r/technology/hot.json",
          "https://api.dev.to/articles?tag=technology"
        ],
        random: [
          "https://api.randomvideo.repl.co/random",
          "https://api.easy0.repl.co/v1/randomvideo",
          "https://api.waifu.pics/sfw/neko",
          "https://nekos.life/api/v2/img/neko",
          "https://picsum.photos/800/600",
          "https://source.unsplash.com/800x600/?random",
          "https://dog.ceo/api/breeds/image/random",
          "https://api.thecatapi.com/v1/images/search",
          "https://randomfox.ca/floof/"
        ]
      };
      
      // Determine category from arguments
      let category = args[0]?.toLowerCase() || 'random';
      if (!VIDEO_CATEGORIES[category]) {
        category = 'random';
      }
      
      // Get available APIs for this category
      const categoryApis = VIDEO_CATEGORIES[category];
      
      // Send processing message with enhanced styling
      const processingMsg = await api.sendMessage(
        `🎬 𝗟𝗼𝗮𝗱𝗶𝗻𝗴 ${category.charAt(0).toUpperCase() + category.slice(1)} 𝗩𝗶𝗱𝗲𝗼...\n\n⏳ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 𝘄𝗵𝗶𝗹𝗲 𝗜 𝗳𝗲𝘁𝗰𝗵 𝗮 𝗵𝗶𝗴𝗵-𝗾𝘂𝗮𝗹𝗶𝘁𝘆 𝘃𝗶𝗱𝗲𝗼 𝗳𝗼𝗿 𝘆𝗼𝘂!`,
        threadID,
        messageID
      );
      
      let videoData;
      let apiIndex = 0;
      let apiSuccess = false;
      let attempts = 0;
      const maxAttempts = categoryApis.length * 2;
      
      // Enhanced API fallback system with retry logic
      while (apiIndex < categoryApis.length && !apiSuccess && attempts < maxAttempts) {
        try {
          const apiUrl = categoryApis[apiIndex];
          console.log(`Attempting API ${apiIndex + 1}/${categoryApis.length}: ${apiUrl}`);
          
          const response = await axios.get(apiUrl, { 
            timeout: 15000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'application/json, text/plain, */*'
            }
          });
          
          // Handle different response formats
          let videoUrl = null;
          if (response.data) {
            if (response.data.url) {
              videoUrl = response.data.url;
              videoData = response.data;
            } else if (response.data.link) {
              videoUrl = response.data.link;
              videoData = { url: response.data.link, title: response.data.title || 'Random Video' };
            } else if (response.data.message) {
              videoUrl = response.data.message;
              videoData = { url: response.data.message, title: 'Random Video' };
            } else if (typeof response.data === 'string' && response.data.startsWith('http')) {
              videoUrl = response.data;
              videoData = { url: response.data, title: 'Random Video' };
            } else if (Array.isArray(response.data) && response.data.length > 0) {
              const randomItem = response.data[Math.floor(Math.random() * response.data.length)];
              if (randomItem.url || randomItem.link) {
                videoUrl = randomItem.url || randomItem.link;
                videoData = randomItem;
              }
            }
          }
          
          if (videoUrl && videoUrl.startsWith('http')) {
            videoData = videoData || { url: videoUrl, title: 'Random Video' };
            apiSuccess = true;
            console.log(`API ${apiIndex + 1} successful!`);
          } else {
            throw new Error('Invalid response format');
          }
        } catch (error) {
          console.error(`API ${apiIndex + 1} failed:`, error.message);
          attempts++;
          
          // Move to next API after 2 attempts
          if (attempts % 2 === 0) {
            apiIndex++;
          }
          
          // Add small delay between attempts
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // If all APIs fail, use fallback content
      if (!apiSuccess) {
        console.log('All APIs failed, using fallback message');
        await api.sendMessage(
          `❌ 𝗦𝗼𝗿𝗿𝘆! 𝗔𝗹𝗹 𝘃𝗶𝗱𝗲𝗼 𝘀𝗼𝘂𝗿𝗰𝗲𝘀 𝗮𝗿𝗲 𝗰𝘂𝗿𝗿𝗲𝗻𝘁𝗹𝘆 𝘂𝗻𝗮𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲.\n\n🔄 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗶𝗻 𝗮 𝗳𝗲𝘄 𝗺𝗶𝗻𝘂𝘁𝗲𝘀.\n\n📋 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗰𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗲𝘀: ${Object.keys(VIDEO_CATEGORIES).join(', ')}\n\n💡 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: !randomvideo funny\n\n🤖 𝗕𝗼𝘁 𝗯𝘆: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`,
          threadID,
          messageID
        );
        
        // Delete processing message
        if (processingMsg) {
          api.unsendMessage(processingMsg.messageID);
        }
        return;
      }
      
      // Create unique file path
      const cacheDir = path.join(__dirname, 'cache', 'random_videos');
      const timestamp = Date.now();
      const videoPath = path.join(cacheDir, `video_${timestamp}.mp4`);
      
      try {
        // Download the video with enhanced error handling
        console.log(`Downloading video from: ${videoData.url}`);
        const videoResponse = await axios({
          url: videoData.url,
          method: 'GET',
          responseType: 'stream',
          timeout: 45000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://www.google.com/',
            'Accept': '*/*'
          }
        });
        
        const writer = fs.createWriteStream(videoPath);
        videoResponse.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
          
          // Timeout for download
          setTimeout(() => {
            writer.destroy();
            reject(new Error('Download timeout'));
          }, 60000);
        });
        
        // Verify file exists and has content
        if (!fs.existsSync(videoPath) || fs.statSync(videoPath).size === 0) {
          throw new Error('Downloaded file is empty or corrupted');
        }
        
        console.log(`Video downloaded successfully: ${videoPath}`);
        
      } catch (downloadError) {
        console.error('Download failed:', downloadError.message);
        
        // Try to send as URL if download fails
        await api.sendMessage(
          `🎬 𝗥𝗮𝗻𝗱𝗼𝗺 ${category.charAt(0).toUpperCase() + category.slice(1)} 𝗩𝗶𝗱𝗲𝗼\n\n📹 ${videoData.title || 'Random Video'}\n🔗 ${videoData.url}\n\n⚠️ 𝗗𝗶𝗿𝗲𝗰𝘁 𝗱𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗳𝗮𝗶𝗹𝗲𝗱, 𝗽𝗹𝗲𝗮𝘀𝗲 𝗰𝗹𝗶𝗰𝗸 𝘁𝗵𝗲 𝗹𝗶𝗻𝗸 𝗮𝗯𝗼𝘃𝗲.\n\n🤖 𝗕𝗼𝘁 𝗯𝘆: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`,
          threadID,
          messageID
        );
        
        // Delete processing message
        if (processingMsg) {
          api.unsendMessage(processingMsg.messageID);
        }
        return;
      }
      
      // Prepare enhanced message body
      let messageBody = `🎬 𝗥𝗮𝗻𝗱𝗼𝗺 ${category.charAt(0).toUpperCase() + category.slice(1)} 𝗩𝗶𝗱𝗲𝗼\n\n`;
      
      if (videoData.title) messageBody += `📹 𝗧𝗶𝘁𝗹𝗲: ${videoData.title}\n`;
      if (videoData.views) messageBody += `👀 𝗩𝗶𝗲𝘄𝘀: ${videoData.views}\n`;
      if (videoData.author) messageBody += `👤 𝗔𝘂𝘁𝗵𝗼𝗿: ${videoData.author}\n`;
      if (videoData.duration) messageBody += `⏱️ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${videoData.duration}\n`;
      
      messageBody += `\n🎯 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${category.toUpperCase()}\n`;
      messageBody += `🔄 𝗧𝘆𝗽𝗲 "!randomvideo [category]" 𝗳𝗼𝗿 𝗺𝗼𝗿𝗲!\n`;
      messageBody += `📋 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲: ${Object.keys(VIDEO_CATEGORIES).join(', ')}\n\n`;
      messageBody += `🤖 𝗕𝗼𝘁 𝗯𝘆: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`;
      
      // Send the video
      await api.sendMessage({
        body: messageBody,
        attachment: fs.createReadStream(videoPath)
      }, threadID, messageID);
      
      console.log('Video sent successfully!');
      
      // Delete processing message
      if (processingMsg) {
        api.unsendMessage(processingMsg.messageID);
      }
      
      // Clean up after sending
      setTimeout(() => {
        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
          console.log('Temporary file cleaned up');
        }
      }, 5000);
      
    } catch (error) {
      console.error('Random Video Command Error:', error);
      
      // Get available categories
      const availableCategories = Object.keys(VIDEO_CATEGORIES).join(', ');
      
      api.sendMessage(
        `❌ 𝗔𝗻 𝘂𝗻𝗲𝘅𝗽𝗲𝗰𝘁𝗲𝗱 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱!\n\n🔧 𝗣𝗼𝘀𝘀𝗶𝗯𝗹𝗲 𝘀𝗼𝗹𝘂𝘁𝗶𝗼𝗻𝘀:\n• 𝗧𝗿𝘆 𝗮 𝗱𝗶𝗳𝗳𝗲𝗿𝗲𝗻𝘁 𝗰𝗮𝘁𝗲𝗴𝗼𝗿𝘆\n• 𝗖𝗵𝗲𝗰𝗸 𝘆𝗼𝘂𝗿 𝗶𝗻𝘁𝗲𝗿𝗻𝗲𝘁 𝗰𝗼𝗻𝗻𝗲𝗰𝘁𝗶𝗼𝗻\n• 𝗧𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗶𝗻 𝗮 𝗳𝗲𝘄 𝗺𝗶𝗻𝘂𝘁𝗲𝘀\n\n📋 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗰𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗲𝘀: ${availableCategories}\n💡 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: !randomvideo funny\n\n🤖 𝗕𝗼𝘁 𝗯𝘆: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`,
        threadID,
        messageID
      );
    }
  }
};
