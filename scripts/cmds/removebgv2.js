const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const downloader = require('image-downloader');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  config: {
    name: "removebgv2",
    aliases: [],
    version: "1.2.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 15,
    role: 0,
    category: "media",
    shortDescription: {
      en: "🖼️ Remove image backgrounds with enhanced API"
    },
    longDescription: {
      en: "🖼️ Remove image backgrounds with enhanced API handling and stylish canvas output"
    },
    guide: {
      en: "{p}removebgv2 [reply to image]"
    },
    dependencies: {
      "form-data": "",
      "image-downloader": "",
      "fs-extra": "",
      "axios": "",
      "canvas": ""
    },
    envConfig: {
      apiKeys: [
        'y5K9ssQnhr8sB9Tp4hrMsLtU',
        's6d6EanXm7pEsck9zKjgnJ5u',
        'GJkFyR3WdGAwn8xW5MDYAVWf',
        'ZLTgza4FPGii1AEUmZpkzYb7',
        'ymutgb6hEYEDR6xUbfQUiPri',
        'm6AhtWhWJBAPqZzy5BrvMmUp',
        'xHSGza4zdY8KsHGpQs4phRx9'
      ]
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // Check dependencies
      try {
        if (!fs || !path || !axios || !FormData || !downloader || !createCanvas || !loadImage) {
          throw new Error("Missing required dependencies");
        }
      } catch (err) {
        return api.sendMessage("❌ | Required dependencies are missing. Please install all required packages.", event.threadID, event.messageID);
      }

      // Validate reply
      if (event.type !== 'message_reply' || !event.messageReply.attachments || !event.messageReply.attachments.length) {
        return api.sendMessage('🖼️ | Please reply to a photo to remove its background!', event.threadID, event.messageID);
      }

      const attachment = event.messageReply.attachments[0];
      if (attachment.type !== 'photo') {
        return api.sendMessage('❌ | This is not a valid image file!', event.threadID, event.messageID);
      }

      const cachePath = path.join(__dirname, 'removebg_cache.png');

      // Download image with retry
      let downloadSuccess = false;
      for (let i = 0; i < 3; i++) {
        try {
          await downloader.image({ url: attachment.url, dest: cachePath });
          downloadSuccess = true;
          break;
        } catch (err) {
          if (i === 2) throw err;
        }
      }

      if (!downloadSuccess) return api.sendMessage('⚠️ | Failed to download image after multiple attempts.', event.threadID, event.messageID);

      // Prepare API request
      const form = new FormData();
      form.append('size', 'auto');
      form.append('image_file', fs.createReadStream(cachePath));

      // Select random API key
      const apiKeys = this.config.envConfig?.apiKeys || [
        'y5K9ssQnhr8sB9Tp4hrMsLtU',
        's6d6EanXm7pEsck9zKjgnJ5u',
        'GJkFyR3WdGAwn8xW5MDYAVWf',
        'ZLTgza4FPGii1AEUmZpkzYb7',
        'ymutgb6hEYEDR6xUbfQUiPri',
        'm6AhtWhWJBAPqZzy5BrvMmUp',
        'xHSGza4zdY8KsHGpQs4phRx9'
      ];
      const activeKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

      // Call remove.bg API
      const response = await axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: form,
        responseType: 'arraybuffer',
        headers: { ...form.getHeaders(), 'X-Api-Key': activeKey }
      });

      if (response.status !== 200 || !response.data) throw new Error('Invalid API response');

      fs.writeFileSync(cachePath, Buffer.from(response.data));

      // Canvas styling
      const originalImage = await loadImage(cachePath);
      const canvas = createCanvas(originalImage.width, originalImage.height);
      const ctx = canvas.getContext('2d');

      // Draw a cool gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#ff9a9e');
      gradient.addColorStop(1, '#fad0c4');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the removed-bg image on top
      ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

      // Optional stylish text
      ctx.font = 'bold 60px Sans';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.lineWidth = 5;
      ctx.textAlign = 'center';
      ctx.fillText('Background Removed ✅', canvas.width / 2, 80);
      ctx.strokeText('Background Removed ✅', canvas.width / 2, 80);

      const finalImagePath = path.join(__dirname, 'removebg_result.png');
      fs.writeFileSync(finalImagePath, canvas.toBuffer());

      await api.sendMessage({
        body: '✨ Successfully removed the background and added stylish canvas effect!\n👑 API Owner: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑',
        attachment: fs.createReadStream(finalImagePath)
      }, event.threadID, event.messageID);

      // Cleanup
      try {
        fs.unlinkSync(cachePath);
        fs.unlinkSync(finalImagePath);
      } catch (cleanupError) {
        console.warn('Cleanup error:', cleanupError);
      }

    } catch (error) {
      console.error('RemoveBG Error:', error);
      api.sendMessage('❌ | Failed to process image. Possible reasons:\n- API limit reached\n- Invalid image format\n- Server issues\n\nTry again later or use a different image.', event.threadID, event.messageID);
    }
  }
};
