const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

// Function to convert text to Math Bold Italic
function toMathBoldItalic(text) {
    const map = {
        A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫', E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰', J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴',
        N: '𝑵', O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺', T: '𝑻', U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿', Y: '𝒀', Z: '𝒁',
        a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆', f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋', k: '𝒌', l: '𝒍', m: '𝒎',
        n: '𝒏', o: '𝒐', p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕', u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚', z: '𝒛'
    };
    return text.split('').map(char => map[char] || char).join('');
}

// Shared image download function with retry logic
async function downloadBaseImageWithRetry() {
    const dirMaterial = path.resolve(__dirname, "cache/canvas");
    const arrPath = path.resolve(dirMaterial, "arr2.png");
    
    if (!fs.existsSync(dirMaterial)) {
        fs.mkdirSync(dirMaterial, { recursive: true });
    }
    
    // If image already exists, no need to download
    if (fs.existsSync(arrPath)) {
        return true;
    }
    
    // If another file is currently downloading, wait
    const lockFile = path.resolve(dirMaterial, "downloading.lock");
    if (fs.existsSync(lockFile)) {
        // Wait for other download to complete
        let attempts = 0;
        while (fs.existsSync(lockFile) && attempts < 30) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
        }
        // If file exists after waiting, download was successful
        if (fs.existsSync(arrPath)) {
            return true;
        }
    }
    
    // Create lock file and download
    try {
        fs.writeFileSync(lockFile, "downloading");
        
        const imageUrl = "https://i.imgur.com/iaOiAXe.jpeg";
        let lastError;
        
        // Retry logic with exponential backoff
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                console.log(`Download attempt ${attempt} for base image...`);
                const imageBuffer = await global.utils.getStreamFromURL(imageUrl);
                await fs.writeFileSync(arrPath, imageBuffer);
                console.log("Base image downloaded successfully");
                return true;
            } catch (error) {
                lastError = error;
                if (attempt < 3) {
                    const delay = attempt * 2000; // 2, 4, 6 seconds
                    console.log(`Attempt ${attempt} failed, waiting ${delay}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        
        throw lastError;
        
    } finally {
        // Always remove lock file
        if (fs.existsSync(lockFile)) {
            fs.unlinkSync(lockFile);
        }
    }
}

module.exports = {
  config: {
    name: "bf",
    aliases: [],
    version: "7.3.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: toMathBoldItalic("Get couple from mention")
    },
    longDescription: {
      en: toMathBoldItalic("Create couple image from mentioned user")
    },
    category: "image",
    guide: {
      en: "{p}bf [mention]"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
    }
  },

  onLoad: async function() {
    try {
        await downloadBaseImageWithRetry();
    } catch (error) {
        console.error("Failed to load base image after all retries:", error);
    }
  }
};

// Create circular avatar
async function circle(imagePath) {
  let image = await jimp.read(imagePath);
  image.circle();
  return await image.getBufferAsync("image/png");
}

// Generate couple image
async function makeImage({ one, two }) {
  const __root = path.resolve(__dirname, "cache/canvas");
  
  // Ensure base image exists before proceeding
  const arrPath = path.join(__root, "arr2.png");
  if (!fs.existsSync(arrPath)) {
      await downloadBaseImageWithRetry();
  }
  
  let baseImage = await jimp.read(arrPath);

  const avatarOnePath = path.join(__root, `avt_${one}.png`);
  const avatarTwoPath = path.join(__root, `avt_${two}.png`);
  const finalPath = path.join(__root, `batman${one}_${two}.png`);

  // Download avatars
  try {
    const avatarOneBuffer = await global.utils.getStreamFromURL(
      `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
    );
    fs.writeFileSync(avatarOnePath, avatarOneBuffer);

    const avatarTwoBuffer = await global.utils.getStreamFromURL(
      `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
    );
    fs.writeFileSync(avatarTwoPath, avatarTwoBuffer);

    // Apply circle effect
    let circleOne = await jimp.read(await circle(avatarOnePath));
    let circleTwo = await jimp.read(await circle(avatarTwoPath));

    // Composite images
    baseImage.composite(circleOne.resize(200, 200), 70, 110)
             .composite(circleTwo.resize(200, 200), 465, 110);

    const buffer = await baseImage.getBufferAsync("image/png");
    fs.writeFileSync(finalPath, buffer);

    // Cleanup avatars
    fs.unlinkSync(avatarOnePath);
    fs.unlinkSync(avatarTwoPath);

    return finalPath;
  } catch (error) {
    console.error("Image creation error:", error);
    throw error;
  }
}

module.exports.onStart = async function({ api, event, args, message }) {
  try {
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions);

    if (!mention[0]) {
      return message.reply(
        toMathBoldItalic("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 1 𝑝𝑒𝑟𝑠𝑜𝑛")
      );
    }

    const one = senderID;
    const two = mention[0];

    const imagePath = await makeImage({ one, two });

    const bodyMsg = toMathBoldItalic(
      "💞 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙 𝐶𝑜𝑢𝑝𝑙𝑒 💞\n\n" +
      "✨ 𝐼 𝐺𝑜𝑡 𝑌𝑜𝑢 ❤\n" +
      "👑 𝑌𝑜𝑢𝑟 𝐵𝑜𝑦𝑓𝑟𝑖𝑒𝑛𝑑 🩷\n\n" +
      "💖 𝑇𝑜𝑔𝑒𝑡ℎ𝑒𝑟 𝐹𝑜𝑟𝑒𝑣𝑒𝑟 💖"
    );

    await message.reply({
      body: bodyMsg,
      attachment: fs.createReadStream(imagePath)
    }, (error, info) => {
      if (!error) {
        fs.unlinkSync(imagePath);
      }
    });

  } catch (error) {
    console.error("BF command error:", error);
    message.reply(
      toMathBoldItalic("❌ 𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑐𝑜𝑢𝑝𝑙𝑒 𝑖𝑚𝑎𝑔𝑒")
    );
  }
};
