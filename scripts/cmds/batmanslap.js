const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const jimp = require('jimp');

// Define the toBI function for bold italic text
const toBI = (text) => {
  const map = {
    a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆',
    f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋',
    k: '𝒌', l: '𝒍', m: '𝒎', n: '𝒏', o: '𝒐',
    p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕',
    u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚',
    z: '𝒛', A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫',
    E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰',
    J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴', N: '𝑵',
    O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺',
    T: '𝑻', U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿',
    Y: '𝒀', Z: '𝒁',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
    '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return text.split('').map(char => map[char] || char).join('');
};

module.exports = {
  config: {
    name: "batmanslap",
    aliases: [], 
    version: "2.1.1", // Minor version bump for increased robustness
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: toBI("🦇 𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝐵𝑎𝑡𝑚𝑎𝑛 𝑠𝑙𝑎𝑝 𝑚𝑒𝑚𝑒.")
    },
    longDescription: {
      en: toBI("𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝐵𝑎𝑡𝑚𝑎𝑛 𝑠𝑙𝑎𝑝𝑝𝑖𝑛𝑔 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑡𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟 𝑎𝑛𝑑 𝑐𝑢𝑠𝑡𝑜𝑚𝑖𝑧𝑎𝑏𝑙𝑒 𝑡𝑒𝑥𝑡.")
    },
    guide: {
      en: toBI("{p}batmanslap [𝑡𝑎𝑔] <𝑜𝑝𝑡𝑖𝑜𝑛𝑎𝑙_𝑡𝑒𝑥𝑡_𝑓𝑜𝑟_𝑏𝑢𝑏𝑏𝑙𝑒>")
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": "",
      "path": ""
    }
  },

  onStart: async function ({ message, event, args }) {
    // Initialize paths to null to ensure they are undefined if not assigned,
    // which helps in the finally block's existence checks.
    let slapperAvatarPath = null;
    let slappedAvatarPath = null;
    let finalImagePath = null;

    try {
      const { senderID, mentions } = event;

      // Check for mentions
      if (!mentions || Object.keys(mentions).length === 0) {
        return message.reply(toBI("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑠𝑙𝑎𝑝!"));
      }

      const mentionID = Object.keys(mentions)[0];
      const tagName = mentions[mentionID].replace("@", "");
      const slapperID = senderID;
      const slappedID = mentionID;

      // Determine the text for the speech bubble
      // Remove the mention from the arguments to get clean custom text
      const mentionRegex = new RegExp(`@${tagName}`, 'g');
      const messageArgs = args.join(" ").replace(mentionRegex, '').trim();
      const speechBubbleText = messageArgs || `𝑆𝐻𝑈𝑇 𝑈𝑃, ${tagName.toUpperCase()}`;

      // Define cache directories
      const cacheDir = path.join(__dirname, 'cache', 'batslap');
      const canvasDir = path.join(__dirname, 'cache', 'canvas'); // This is where the template should be

      // Ensure directories exist. Using await fs.ensureDir for robustness.
      try {
        await fs.ensureDir(cacheDir);
        await fs.ensureDir(canvasDir);
      } catch (dirError) {
        console.error("𝐷𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", dirError);
        return message.reply(toBI("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑛𝑒𝑐𝑒𝑠𝑠𝑎𝑟𝑦 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑖𝑒𝑠 𝑓𝑜𝑟 𝑐𝑎𝑐ℎ𝑒."));
      }

      // Template path
      const templatePath = path.join(canvasDir, 'batmanslap.jpg');

      // Check if template exists
      if (!await fs.pathExists(templatePath)) {
        return message.reply(toBI("❌ 𝐵𝑎𝑡𝑚𝑎𝑛 𝑠𝑙𝑎𝑝 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑠𝑢𝑟𝑒 'scripts/cmds/cache/canvas/batmanslap.jpg' 𝑒𝑥𝑖𝑠𝑡𝑠."));
      }

      // Circle function for avatars
      async function circleImage(imagePathOrBuffer) {
        try {
          const image = await jimp.read(imagePathOrBuffer);
          image.circle();
          return await image.getBufferAsync("image/png");
        } catch (error) {
          console.error("𝐶𝑖𝑟𝑐𝑙𝑒 𝑖𝑚𝑎𝑔𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", error);
          throw error; // Re-throw to be caught by the outer try-catch
        }
      }

      // Define paths for temporary avatar files with unique names using timestamp
      const timestamp = Date.now();
      slapperAvatarPath = path.join(cacheDir, `avt_slapper_${slapperID}_${timestamp}.png`);
      slappedAvatarPath = path.join(cacheDir, `avt_slapped_${slappedID}_${timestamp}.png`);
      finalImagePath = path.join(cacheDir, `batslap_final_${slapperID}_${slappedID}_${timestamp}.png`);

      // Download and process slapper avatar (Batman)
      try {
        const slapperAvatarResponse = await axios.get(
          `https://graph.facebook.com/${slapperID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          {
            responseType: 'arraybuffer',
            timeout: 15000 // 15-second timeout for avatar download
          }
        );
        await fs.writeFile(slapperAvatarPath, Buffer.from(slapperAvatarResponse.data));
      } catch (slapperError) {
        console.error("𝑆𝑙𝑎𝑝𝑝𝑒𝑟 𝑎𝑣𝑎𝑡𝑎𝑟 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", slapperError.message);
        return message.reply(toBI("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑦𝑜𝑢𝑟 𝑎𝑣𝑎𝑡𝑎𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝐼𝐷 𝑜𝑟 𝑛𝑒𝑡𝑤𝑜𝑟𝑘 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛."));
      }

      // Download and process slapped avatar (Robin)
      try {
        const slappedAvatarResponse = await axios.get(
          `https://graph.facebook.com/${slappedID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          {
            responseType: 'arraybuffer',
            timeout: 15000 // 15-second timeout for avatar download
          }
        );
        await fs.writeFile(slappedAvatarPath, Buffer.from(slappedAvatarResponse.data));
      } catch (slappedError) {
        console.error("𝑆𝑙𝑎𝑝𝑝𝑒𝑑 𝑎𝑣𝑎𝑡𝑎𝑟 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", slappedError.message);
        return message.reply(toBI("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑡𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟'𝑠 𝑎𝑣𝑎𝑡𝑎𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒𝑖𝑟 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝐼𝐷 𝑜𝑟 𝑛𝑒𝑡𝑤𝑜𝑟𝑘 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛."));
      }

      // Make circular avatars
      let slapperCircleBuffer, slappedCircleBuffer;
      try {
        slapperCircleBuffer = await circleImage(slapperAvatarPath);
        slappedCircleBuffer = await circleImage(slappedAvatarPath);
      } catch (circleError) {
        console.error("𝐴𝑣𝑎𝑡𝑎𝑟 𝑐𝑖𝑟𝑐𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", circleError.message);
        return message.reply(toBI("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑎𝑣𝑎𝑡𝑎𝑟 𝑠ℎ𝑎𝑝𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛."));
      }

      // Load template and avatars
      let template, slapperAvatar, slappedAvatar;
      try {
        template = await jimp.read(templatePath);
        slapperAvatar = await jimp.read(slapperCircleBuffer);
        slappedAvatar = await jimp.read(slappedCircleBuffer);
      } catch (loadError) {
        console.error("𝐼𝑚𝑎𝑔𝑒 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", loadError.message);
        return message.reply(toBI("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑚𝑒𝑚𝑒 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑒𝑑 𝑎𝑣𝑎𝑡𝑎𝑟𝑠."));
      }

      // Resize avatars
      slapperAvatar.resize(120, 120); // Batman's face
      slappedAvatar.resize(170, 170); // Robin's face

      // Composite avatars onto template with exact positions
      template
        .composite(slapperAvatar, 390, 80)   // Batman's face position
        .composite(slappedAvatar, 145, 155); // Robin's face position

      // Load font for speech bubble
      let font;
      try {
        font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
      } catch (fontError) {
        console.warn("⚠️ 𝐹𝑜𝑛𝑡 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑤𝑎𝑟𝑛𝑖𝑛𝑔:", fontError.message);
        // Fallback to a smaller, more common font if the desired one fails
        font = await jimp.loadFont(jimp.FONT_SANS_16_BLACK); // Fallback to smaller font
        if (!font) {
            console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑎𝑛𝑦 𝑓𝑜𝑛𝑡.");
            // Optionally, you could return here or set text to empty
        }
      }

      // Add text to the speech bubble with exact position
      if (font) { // Only try to print if a font was successfully loaded
        try {
          template.print(
            font,
            630,  // X position
            240,  // Y position
            {
              text: speechBubbleText,
              alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
              alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
            },
            220,  // Width of text area
            150   // Height of text area
          );
        } catch (textError) {
          console.error("𝑇𝑒𝑥𝑡 𝑟𝑒𝑛𝑑𝑒𝑟𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", textError.message);
          // If text rendering fails, continue without text. Meme still generates.
        }
      }

      // Save final image
      try {
        await template.writeAsync(finalImagePath);
      } catch (writeError) {
        console.error("𝐼𝑚𝑎𝑔𝑒 𝑤𝑟𝑖𝑡𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", writeError.message);
        return message.reply(toBI("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑎𝑣𝑒 𝑡ℎ𝑒 𝑓𝑖𝑛𝑎𝑙 𝑚𝑒𝑚𝑒 𝑖𝑚𝑎𝑔𝑒."));
      }

      // Verify final image exists and has content before sending
      if (!await fs.pathExists(finalImagePath)) {
        return message.reply(toBI("❌ 𝐹𝑖𝑛𝑎𝑙 𝑚𝑒𝑚𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑎𝑠 𝑛𝑜𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛."));
      }
      const stats = await fs.stat(finalImagePath);
      if (stats.size === 0) {
        return message.reply(toBI("❌ 𝐹𝑖𝑛𝑎𝑙 𝑚𝑒𝑚𝑒 𝑖𝑚𝑎𝑔𝑒 𝑖𝑠 𝑒𝑚𝑝𝑡𝑦 𝑜𝑟 𝑐𝑜𝑟𝑟𝑢𝑝𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛."));
      }

      // Send the result
      await message.reply({
        body: toBI(`🦇 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝐵𝑎𝑡𝑚𝑎𝑛 𝑠𝑙𝑎𝑝 𝑚𝑒𝑚𝑒! @${tagName}`),
        mentions: [{
          tag: `@${tagName}`,
          id: slappedID
        }],
        attachment: fs.createReadStream(finalImagePath)
      });

      console.log("✅ 𝐵𝑎𝑡𝑚𝑎𝑛 𝑠𝑙𝑎𝑝 𝑚𝑒𝑚𝑒 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦");

    } catch (error) {
      console.error("💥 𝐺𝑒𝑛𝑒𝑟𝑎𝑙 𝐵𝑎𝑡𝑚𝑎𝑛 𝑠𝑙𝑎𝑝 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error.message);
      // Only reply if an error hasn't been handled by a more specific catch block
      if (!message.replied) {
         await message.reply(toBI("❌ 𝐴𝑛 𝑢𝑛𝑒𝑥𝑝𝑒𝑐𝑡𝑒𝑑 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑑𝑢𝑟𝑖𝑛𝑔 𝑚𝑒𝑚𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟."));
      }
    } finally {
      // Cleanup temporary files - guaranteed execution
      try {
        if (slapperAvatarPath && await fs.pathExists(slapperAvatarPath)) {
          await fs.remove(slapperAvatarPath);
        }
        if (slappedAvatarPath && await fs.pathExists(slappedAvatarPath)) {
          await fs.remove(slappedAvatarPath);
        }
        if (finalImagePath && await fs.pathExists(finalImagePath)) {
          await fs.remove(finalImagePath);
        }
        console.log("🧹 𝑇𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑓𝑖𝑙𝑒𝑠 𝑐𝑙𝑒𝑎𝑛𝑒𝑑 𝑢𝑝.");
      } catch (cleanupError) {
        console.warn("⚠️ 𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑤𝑎𝑟𝑛𝑖𝑛𝑔: 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑟𝑒𝑚𝑜𝑣𝑒 𝑠𝑜𝑚𝑒 𝑡𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑓𝑖𝑙𝑒𝑠:", cleanupError.message);
      }
    }
  }
};
