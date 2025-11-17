const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "sexvid",
    aliases: ["pornvid"],
    version: "2.2",
    author: "Asif",
    countDown: 30,
    role: 0,
    shortDescription: "Send naughty dark fantasy adult videos",
    longDescription: "Get random dark fantasy styled adult videos from Google Drive links",
    category: "18+",
    guide: "{p}{n}",
  },

  onStart: async function ({ api, event, message }) {
    let loadingMessage;
    
    try {
      loadingMessage = await message.reply("🖤🦇 Wait up, baby... the night's hottest desires are being unleashed... 🥵💦");

      const videoLinks = [
        "https://drive.google.com/uc?export=download&id=1-gJdG8bxmZLyOC7-6E4A5Hm95Q9gWIPO",
        "https://drive.google.com/uc?export=download&id=1-ryNR8j529EZyTCuMur9wmkFz4ahlv-f",
        "https://drive.google.com/uc?export=download&id=1-vHh7XBtPOS3s42q-s8s30Bzsx2u6czu",
        "https://drive.google.com/uc?export=download&id=11IUd-PDHozLmh_RtvSf0S-f3G6wut1ZT",
        "https://drive.google.com/uc?export=download&id=12YCqZovJ8sVZZZTDLu8dv8NAwsMGfqiB",
        "https://drive.google.com/uc?export=download&id=12eIiCYpd_Jm8zIVRSkqlSt7W-7OsxB6g",
        "https://drive.google.com/uc?export=download&id=13utWruipZ_3fR0QSMtGMnFjGt3bthnbf",
        "https://drive.google.com/uc?export=download&id=14GYNaYL-pkEh3UH0oIUXVamru5h830DY",
        "https://drive.google.com/uc?export=download&id=14UGb2fH4wyUbVSQ-Vt5yf-4sH3-icXGC",
        "https://drive.google.com/uc?export=download&id=161O9_EbCQJ8nHTT7VeE7BWtHvEjHAT4k",
        "https://drive.google.com/uc?export=download&id=170YWB4jpMfR5GpmPb_Lymh6OmrmWDE0x",
        "https://drive.google.com/uc?export=download&id=17nvXNBpMWVmuWLK-kkLzkbrbpW43rD4r",
        "https://drive.google.com/uc?export=download&id=17w7sehThOv6IRrcsLboi7Zk6zZvfBHr5",
        "https://drive.google.com/uc?export=download&id=17yaPd3PoYJkuL0IEZHzcBic9pX4AmGiK",
        "https://drive.google.com/uc?export=download&id=18Dyc1vkysNhHSGi5OYpa6AzD5rk3_vkf",
        "https://drive.google.com/uc?export=download&id=18brau5aYmiMAxfhDTLz_nFWuIcb_mja5",
        "https://drive.google.com/uc?export=download&id=19GcLpOzFYypYFu1FboQyVjWxC9Jh3JC5",
        "https://drive.google.com/uc?export=download&id=19lKQChg0hv2MOTphkyI4zTiUIxuujd03",
        "https://drive.google.com/uc?export=download&id=1AjrBOBRWKpKjLOYV1oof2mVZBzx0ebgD",
        "https://drive.google.com/uc?export=download&id=1BPOEwIt7lGv66w5pUTDU937q4i5ym5S_",
        "https://drive.google.com/uc?export=download&id=1C-VxCoO5gMKCq2rg7PxjlitK4bOg7pt2",
        "https://drive.google.com/uc?export=download&id=1C9t9VNpLT9DelBeDnbFNjdAA0tK_cXh-",
        "https://drive.google.com/uc?export=download&id=1DrhAOOeYIHlTWJU5e26OMjO0R5nueyf7",
        "https://drive.google.com/uc?export=download&id=1Dz7UfOejW9rDFYFAtxmAq_ncv04WaTTL",
        "https://drive.google.com/uc?export=download&id=1EcBmrdqYfQbwSPr2kiKY2QV_6CXLJJj6",
        "https://drive.google.com/uc?export=download&id=1F5Xc5Qff4RGyUuHzuqPfmOn2EZKQIn7P",
        "https://drive.google.com/uc?export=download&id=1FTxkmgt2sWf8U2h8a5HszyKINMr6Gnwm",
        "https://drive.google.com/uc?export=download&id=1Frf4GUg26Abw2lJdQ_RHycNhDMZXfMm2",
        "https://drive.google.com/uc?export=download&id=1FtdiGL244Kcj7tiA6F_2mKeTmMpVCyjr",
        "https://drive.google.com/uc?export=download&id=1G2tE1VdFzzqochfGwXwc46nuwkTeRRSc",
        "https://drive.google.com/uc?export=download&id=1GB6VOhgA3-JUSUZ3D1xgjlKH1Jswy0Z4",
        "https://drive.google.com/uc?export=download&id=1G_04XtbUP-QZNWFzdLohwY_w6BRdmijk",
        "https://drive.google.com/uc?export=download&id=1GpvlwryNcsRz2i6VYEV3NqSLr0WtGGn_",
        "https://drive.google.com/uc?export=download&id=1HYn-ZCVB0JcipKWrMxPnSrAVP4oSjePT",
        "https://drive.google.com/uc?export=download&id=1H_5i2V6W8Fl0N5QIKPACEUcljd8-q_dT",
        "https://drive.google.com/uc?export=download&id=1HhFPMOMXI7DDKc371C-12A0yfC0101x7",
        "https://drive.google.com/uc?export=download&id=1JNRfPMJe1_SodueqhMVf4so0-vjWaK9V",
        "https://drive.google.com/uc?export=download&id=1Jjy85bIGE9efsUIlmHykEistAquEB9oT",
        "https://drive.google.com/uc?export=download&id=1JoXCYZz4YoKpWe809ttUaaSsJdsCJZNf",
        "https://drive.google.com/uc?export=download&id=1Ko-ScBYddulpKX4I4xS7BRkndIaZZ3gT",
        "https://drive.google.com/uc?export=download&id=1LU4PTBFjWlhgzP2HiiJX_Esw2iIq7Zpj",
        "https://drive.google.com/uc?export=download&id=1LaM2kIlZUdA_UbCzX8s92nxcqEJieHLN",
        "https://drive.google.com/uc?export=download&id=1LcClA0b5Qih_tIv_wVRUsWX9gk3bVmzj",
        "https://drive.google.com/uc?export=download&id=1LgVpbMhe0CXM7rIUr9pJNK46QtZcpRtK",
        "https://drive.google.com/uc?export=download&id=1MB-KTUmPMkSb1o4J_EIRQ8mJ3w-cUOtY",
        "https://drive.google.com/uc?export=download&id=1M_cHjSaNWT5b_8p9VSPmzVyz-rqBqo3S",
        "https://drive.google.com/uc?export=download&id=1NC3fFj68PqqvZeg67AdA_cHyNdOBlRfF",
        "https://drive.google.com/uc?export=download&id=1Nk534yO5owt7IaMOKjbT6IGLGW96Gv0f",
        "https://drive.google.com/uc?export=download&id=1O1Cej8MFdytRun3RmGTnmT6uk1T-Zcmu"
      ];

      // Select random video
      const randomIndex = Math.floor(Math.random() * videoLinks.length);
      const videoUrl = videoLinks[randomIndex];

      console.log(`🎬 Selected video ${randomIndex + 1}/${videoLinks.length}`);
      console.log(`📥 Downloading from: ${videoUrl}`);

      // Create cache directory
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const videoPath = path.join(cacheDir, `sexvid_${timestamp}_${randomSuffix}.mp4`);

      console.log(`💾 Saving to: ${videoPath}`);

      // Download video with axios with better error handling
      const response = await axios({
        method: 'GET',
        url: videoUrl,
        responseType: 'stream',
        timeout: 120000, // 2 minutes timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': '*/*',
          'Accept-Encoding': 'identity',
          'Connection': 'keep-alive'
        }
      });

      // Check response status
      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Create write stream with error handling
      const writer = fs.createWriteStream(videoPath);
      
      // Pipe with progress tracking
      let downloadedBytes = 0;
      const totalBytes = parseInt(response.headers['content-length']) || 0;
      
      response.data.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        if (totalBytes > 0) {
          const percent = ((downloadedBytes / totalBytes) * 100).toFixed(1);
          console.log(`📊 Download progress: ${percent}% (${downloadedBytes}/${totalBytes} bytes)`);
        }
      });

      // Wait for download to complete
      await new Promise((resolve, reject) => {
        let errorOccurred = false;
        
        writer.on('finish', () => {
          if (!errorOccurred) {
            console.log('✅ Download completed successfully');
            resolve();
          }
        });

        writer.on('error', (error) => {
          errorOccurred = true;
          console.error('❌ Write stream error:', error.message);
          reject(error);
        });

        response.data.on('error', (error) => {
          errorOccurred = true;
          console.error('❌ Response stream error:', error.message);
          reject(error);
        });

        // Pipe the data
        response.data.pipe(writer);
      });

      // Verify downloaded file
      const stats = await fs.stat(videoPath);
      console.log(`✅ File verified: ${stats.size} bytes`);
      
      if (stats.size === 0) {
        throw new Error('Downloaded file is empty (0 bytes)');
      }

      if (stats.size < 1000) {
        throw new Error('Downloaded file is too small (possibly corrupted)');
      }

      console.log(`🚀 Sending video to thread: ${event.threadID}`);

      // Send the video with retry mechanism
      let sendAttempts = 0;
      const maxAttempts = 3;
      
      while (sendAttempts < maxAttempts) {
        try {
          await api.sendMessage(
            {
              body: "💀👀 You're deep in the darkness, baby... Dark pleasures are now being released 🥵👄👅\n\n💦 Let my playful lips wet your screen 💋🫦💅",
              attachment: fs.createReadStream(videoPath)
            },
            event.threadID
          );
          console.log('✅ Video sent successfully');
          break;
        } catch (sendError) {
          sendAttempts++;
          console.error(`❌ Send attempt ${sendAttempts} failed:`, sendError.message);
          
          if (sendAttempts === maxAttempts) {
            throw new Error(`Failed to send video after ${maxAttempts} attempts: ${sendError.message}`);
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Delete loading message
      if (loadingMessage) {
        try {
          await loadingMessage.delete();
          console.log('🗑️ Loading message deleted');
        } catch (deleteError) {
          console.warn('⚠️ Could not delete loading message:', deleteError.message);
        }
      }

      // Clean up the downloaded file
      try {
        await fs.remove(videoPath);
        console.log('🧹 Temporary file cleaned up');
      } catch (cleanupError) {
        console.warn('⚠️ Could not clean up temp file:', cleanupError.message);
      }

    } catch (error) {
      console.error('💥 Error in sexvid command:', error);
      
      // Clean up loading message
      if (loadingMessage) {
        try {
          await loadingMessage.delete();
        } catch (e) {
          console.warn('Could not delete loading message during error:', e.message);
        }
      }
      
      // Clean up any temporary files
      try {
        if (videoPath && fs.existsSync(videoPath)) {
          await fs.remove(videoPath);
          console.log('🧹 Cleaned up temp file after error');
        }
      } catch (cleanupError) {
        console.warn('Could not clean up after error:', cleanupError.message);
      }
      
      // Send user-friendly error message
      const errorMessage = "💀 Something broke while getting your dark fantasy... 🥺\n\n" +
                         "Possible reasons:\n" +
                         "• Internet connection issue\n" + 
                         "• Video source temporarily unavailable\n" +
                         "• Server busy\n\n" +
                         "Try again in a moment! 😘";
      
      try {
        await message.reply(errorMessage);
      } catch (finalError) {
        console.error('💥 Even error message failed:', finalError.message);
      }
    }
  },
};
