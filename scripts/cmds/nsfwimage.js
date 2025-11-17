const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "nsfwimage",
    aliases: [],
    version: "1.0.2",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒂𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    category: "🔞 18+",
    shortDescription: {
      en: "🔞 𝐍𝐔𝐃𝐄 𝐈𝐌𝐀𝐆𝐄𝐒 📸"
    },
    longDescription: {
      en: "🔞 𝐆𝐄𝐓 𝐍𝐔𝐃𝐄 𝐈𝐌𝐀𝐆𝐄𝐒 𝐅𝐑𝐎𝐌 𝐕𝐀𝐑𝐈𝐎𝐔𝐒 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐈𝐄𝐒"
    },
    guide: {
      en: "{𝑝}nsfwimage"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ message, event, api }) {
    let imgPath = null;
    try {
      // Dependency check
      if (!axios) throw new Error("𝐌𝐈𝐒𝐒𝐈𝐍𝐆 𝐃𝐄𝐏𝐄𝐍𝐃𝐄𝐍𝐂𝐘: 𝐀𝐗𝐈𝐎𝐒");
      if (!fs) throw new Error("𝐌𝐈𝐒𝐒𝐈𝐍𝐆 𝐃𝐄𝐏𝐄𝐍𝐃𝐄𝐍𝐂𝐘: 𝐅𝐒-𝐄𝐗𝐓𝐑𝐀");

      // Define categories for image search
      const categories = ["boobs", "ass", "pussy", "feet"];
      // Select a random category
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      // Configuration for the primary RapidAPI endpoint
      const primaryOptions = {
        method: "GET",
        url: "https://girls-nude-image.p.rapidapi.com/",
        params: { type: randomCategory },
        headers: {
          "x-rapidapi-key": "44a0d41bb0msh7963185219ba506p117328jsned41eee4c796",
          "x-rapidapi-host": "girls-nude-image.p.rapidapi.com"
        },
        timeout: 10000
      };

      let imageUrl;
      let imageList;
      let apiSuccess = false;

      // Try primary API with retries
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`𝐀𝐓𝐓𝐄𝐌𝐏𝐓 ${attempt} 𝐅𝐎𝐑 𝐏𝐑𝐈𝐌𝐀𝐑𝐘 𝐀𝐏𝐈`);
          const response = await axios.request(primaryOptions);
          
          // Check the structure of the response
          if (response.data && Array.isArray(response.data)) {
            imageList = response.data;
          } else if (response.data && response.data.images && Array.isArray(response.data.images)) {
            imageList = response.data.images;
          } else if (response.data && response.data.urls && Array.isArray(response.data.urls)) {
            imageList = response.data.urls;
          } else {
            console.log("𝐔𝐍𝐊𝐍𝐎𝐖𝐍 𝐀𝐏𝐈 𝐑𝐄𝐒𝐏𝐎𝐍𝐒𝐄 𝐅𝐎𝐑𝐌𝐀𝐓 𝐅𝐑𝐎𝐌 𝐏𝐑𝐈𝐌𝐀𝐑𝐘 𝐀𝐏𝐈:", JSON.stringify(response.data));
            throw new Error("𝐔𝐍𝐊𝐍𝐎𝐖𝐍 𝐀𝐏𝐈 𝐑𝐄𝐒𝐏𝐎𝐍𝐒𝐄 𝐅𝐎𝐑𝐌𝐀𝐓");
          }
          
          apiSuccess = true;
          break;
        } catch (primaryError) {
          console.error(`𝐏𝐑𝐈𝐌𝐀𝐑𝐘 𝐀𝐏𝐈 𝐀𝐓𝐓𝐄𝐌𝐏𝐓 ${attempt} 𝐅𝐀𝐈𝐋𝐄𝐃:`, primaryError.message);
          if (attempt === 3) {
            console.error("𝐀𝐋𝐋 𝐏𝐑𝐈𝐌𝐀𝐑𝐘 𝐀𝐏𝐈 𝐀𝐓𝐓𝐄𝐌𝐏𝐓𝐒 𝐅𝐀𝐈𝐋𝐄𝐃, 𝐓𝐑𝐘𝐈𝐍𝐆 𝐁𝐀𝐂𝐊𝐔𝐏");
          }
        }
      }

      // If primary API failed, try backup API with retries
      if (!apiSuccess) {
        const backupOptions = {
          method: "GET",
          url: "https://porn-image1.p.rapidapi.com/",
          params: { type: randomCategory },
          headers: {
            "x-rapidapi-key": "44a0d41bb0msh7963185219ba506p117328jsned41eee4c796",
            "x-rapidapi-host": "porn-image1.p.rapidapi.com"
          },
          timeout: 10000
        };

        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            console.log(`𝐀𝐓𝐓𝐄𝐌𝐏𝐓 ${attempt} 𝐅𝐎𝐑 𝐁𝐀𝐂𝐊𝐔𝐏 𝐀𝐏𝐈`);
            const backupResponse = await axios.request(backupOptions);
            
            // Check the structure of the backup response
            if (backupResponse.data && Array.isArray(backupResponse.data)) {
              imageList = backupResponse.data;
            } else if (backupResponse.data && backupResponse.data.images && Array.isArray(backupResponse.data.images)) {
              imageList = backupResponse.data.images;
            } else if (backupResponse.data && backupResponse.data.urls && Array.isArray(backupResponse.data.urls)) {
              imageList = backupResponse.data.urls;
            } else {
              console.log("𝐔𝐍𝐊𝐍𝐎𝐖𝐍 𝐀𝐏𝐈 𝐑𝐄𝐒𝐏𝐎𝐍𝐒𝐄 𝐅𝐎𝐑𝐌𝐀𝐓 𝐅𝐑𝐎𝐌 𝐁𝐀𝐂𝐊𝐔𝐏 𝐀𝐏𝐈:", JSON.stringify(backupResponse.data));
              throw new Error("𝐔𝐍𝐊𝐍𝐎𝐖𝐍 𝐀𝐏𝐈 𝐑𝐄𝐒𝐏𝐎𝐍𝐒𝐄 𝐅𝐎𝐑𝐌𝐀𝐓");
            }
            
            apiSuccess = true;
            break;
          } catch (backupError) {
            console.error(`𝐁𝐀𝐂𝐊𝐔𝐏 𝐀𝐏𝐈 𝐀𝐓𝐓𝐄𝐌𝐏𝐓 ${attempt} 𝐅𝐀𝐈𝐋𝐄𝐃:`, backupError.message);
            if (attempt === 3) {
              console.error("𝐀𝐋𝐋 𝐁𝐀𝐂𝐊𝐔𝐏 𝐀𝐏𝐈 𝐀𝐓𝐓𝐄𝐌𝐏𝐓𝐒 𝐅𝐀𝐈𝐋𝐄𝐃, 𝐓𝐑𝐘𝐈𝐍𝐆 𝐓𝐇𝐈𝐑𝐃 𝐀𝐏𝐈");
            }
          }
        }
      }

      // If both primary and backup APIs failed, try third API
      if (!apiSuccess) {
        const thirdOptions = {
          method: 'GET',
          url: 'https://ai-porn-nsfw-generator.p.rapidapi.com/',
          params: {
            prompt: 'a sexy woman'
          },
          headers: {
            'x-rapidapi-key': '993b22aa9cmshe07fbbcb8f9a9fbp14d7c0jsnd8230deaa169',
            'x-rapidapi-host': 'ai-porn-nsfw-generator.p.rapidapi.com'
          },
          timeout: 15000
        };

        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            console.log(`𝐀𝐓𝐓𝐄𝐌𝐏𝐓 ${attempt} 𝐅𝐎𝐑 𝐓𝐇𝐈𝐑𝐃 𝐀𝐏𝐈`);
            const thirdResponse = await axios.request(thirdOptions);
            
            // Handle different possible response structures from third API
            if (thirdResponse.data && thirdResponse.data.image) {
              imageUrl = thirdResponse.data.image;
            } else if (thirdResponse.data && thirdResponse.data.url) {
              imageUrl = thirdResponse.data.url;
            } else if (thirdResponse.data && thirdResponse.data.images && Array.isArray(thirdResponse.data.images) && thirdResponse.data.images.length > 0) {
              imageUrl = thirdResponse.data.images[0];
            } else if (thirdResponse.data && thirdResponse.data.urls && Array.isArray(thirdResponse.data.urls) && thirdResponse.data.urls.length > 0) {
              imageUrl = thirdResponse.data.urls[0];
            } else {
              console.log("𝐔𝐍𝐊𝐍𝐎𝐖𝐍 𝐀𝐏𝐈 𝐑𝐄𝐒𝐏𝐎𝐍𝐒𝐄 𝐅𝐎𝐑𝐌𝐀𝐓 𝐅𝐑𝐎𝐌 𝐓𝐇𝐈𝐑𝐃 𝐀𝐏𝐈:", JSON.stringify(thirdResponse.data));
              throw new Error("𝐔𝐍𝐊𝐍𝐎𝐖𝐍 𝐀𝐏𝐈 𝐑𝐄𝐒𝐏𝐎𝐍𝐒𝐄 𝐅𝐎𝐑𝐌𝐀𝐓");
            }
            
            if (imageUrl) {
              apiSuccess = true;
              break;
            }
          } catch (thirdError) {
            console.error(`𝐓𝐇𝐈𝐑𝐃 𝐀𝐏𝐈 𝐀𝐓𝐓𝐄𝐌𝐏𝐓 ${attempt} 𝐅𝐀𝐈𝐋𝐄𝐃:`, thirdError.message);
            if (attempt === 3) {
              throw new Error("𝐀𝐋𝐋 𝐀𝐏𝐈 𝐀𝐓𝐓𝐄𝐌𝐏𝐓𝐒 𝐅𝐀𝐈𝐋𝐄𝐃");
            }
          }
        }
      }
      
      // If we got an image URL directly from the third API, skip the list processing
      if (!imageUrl && imageList) {
        // Select a random image from the list
        const randomIndex = Math.floor(Math.random() * imageList.length);
        
        // Handle different possible image URL formats
        if (typeof imageList[randomIndex] === 'string') {
          imageUrl = imageList[randomIndex];
        } else if (imageList[randomIndex] && imageList[randomIndex].url) {
          imageUrl = imageList[randomIndex].url;
        } else if (imageList[randomIndex] && imageList[randomIndex].src) {
          imageUrl = imageList[randomIndex].src;
        } else {
          console.log("𝐂𝐎𝐔𝐋𝐃 𝐍𝐎𝐓 𝐄𝐗𝐓𝐑𝐀𝐂𝐓 𝐈𝐌𝐀𝐆𝐄 𝐔𝐑𝐋 𝐅𝐑𝐎𝐌:", JSON.stringify(imageList[randomIndex]));
          throw new Error("𝐂𝐎𝐔𝐋𝐃 𝐍𝐎𝐓 𝐄𝐗𝐓𝐑𝐀𝐂𝐓 𝐈𝐌𝐀𝐆𝐄 𝐔𝐑𝐋");
        }
      }
      
      // Verify the URL is valid
      if (!imageUrl || !imageUrl.startsWith('http')) {
        console.log("𝐈𝐍𝐕𝐀𝐋𝐈𝐃 𝐈𝐌𝐀𝐆𝐄 𝐔𝐑𝐋:", imageUrl);
        throw new Error("𝐈𝐍𝐕𝐀𝐋𝐈𝐃 𝐈𝐌𝐀𝐆𝐄 𝐔𝐑𝐋");
      }
      
      console.log("𝐅𝐄𝐓𝐂𝐇𝐈𝐍𝐆 𝐈𝐌𝐀𝐆𝐄 𝐅𝐑𝐎𝐌:", imageUrl);
      
      // Download the image with retries
      let imgResponse;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          imgResponse = await axios.get(imageUrl, { 
            responseType: "arraybuffer",
            timeout: 15000
          });
          break;
        } catch (downloadError) {
          console.error(`𝐈𝐌𝐀𝐆𝐄 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐀𝐓𝐓𝐄𝐌𝐏𝐓 ${attempt} 𝐅𝐀𝐈𝐋𝐄𝐃:`, downloadError.message);
          if (attempt === 3) {
            throw new Error("𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐈𝐌𝐀𝐆𝐄 𝐀𝐅𝐓𝐄𝐑 3 𝐀𝐓𝐓𝐄𝐌𝐏𝐓𝐒");
          }
        }
      }
      
      // Check if we got a valid image response
      if (!imgResponse || !imgResponse.data) {
        throw new Error("𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐈𝐌𝐀𝐆𝐄");
      }
      
      // Create cache directory if it doesn't exist
      const cacheDir = __dirname + "/cache";
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      // Save the image
      imgPath = cacheDir + `/nude_${event.senderID}_${event.threadID}.jpg`;
      fs.writeFileSync(imgPath, Buffer.from(imgResponse.data, "binary"));
      
      // Verify the file was created and is not empty
      if (!fs.existsSync(imgPath) || fs.statSync(imgPath).size === 0) {
        throw new Error("𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 𝐒𝐀𝐕𝐄 𝐈𝐌𝐀𝐆𝐄");
      }
      
      // Send the image with a success message
      await message.reply({
        body: `📸 𝐈𝐌𝐀𝐆𝐄 𝐅𝐎𝐔𝐍𝐃: ✨\n🔞 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐘: ${randomCategory.toUpperCase()}`,
        attachment: fs.createReadStream(imgPath)
      });

    } catch (error) {
      console.error("𝐄𝐑𝐑𝐎𝐑 𝐈𝐍 𝐍𝐒𝐅𝐖𝐈𝐌𝐀𝐆𝐄 𝐂𝐎𝐌𝐌𝐀𝐍𝐃: ", error);
      // Send an error message to the user
      await message.reply("❌ 𝐄𝐑𝐑𝐎𝐑: 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 𝐅𝐄𝐓𝐂𝐇 𝐈𝐌𝐀𝐆𝐄 😔");
    } finally {
      // Clean up the image file if it exists
      if (imgPath && fs.existsSync(imgPath)) {
        try {
          fs.unlinkSync(imgPath);
        } catch (cleanupError) {
          console.error("𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 𝐂𝐋𝐄𝐀𝐍 𝐔𝐏 𝐈𝐌𝐀𝐆𝐄 𝐅𝐈𝐋𝐄:", cleanupError);
        }
      }
    }
  }
};
