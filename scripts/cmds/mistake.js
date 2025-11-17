const jimp = require('jimp');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "mistake",
    aliases: ["mistake"],
    version: "3.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 15,
    role: 0,
    shortDescription: "Tag someone and show them as a mistake meme",
    longDescription: "Create a funny meme showing tagged person as life's biggest mistake",
    category: "fun",
    guide: "{pn} @mention"
  },

  onStart: async function ({ event, message, usersData, args }) {
    const mention = Object.keys(event.mentions);
    if (!mention[0]) {
      return message.reply("❓ | Please tag someone to reveal life's biggest mistake!");
    }

    try {
      const targetUserID = mention[0];
      const avatarURL = `https://graph.facebook.com/${targetUserID}/picture?width=512&height=512`;
      const baseImage = "https://i.postimg.cc/2ST7x1Dw/received-6010166635719509.jpg";

      const processingMsg = await message.reply("🔄 | Creating the masterpiece of regrets...");

      const outputPath = await createMistakeMeme(avatarURL, baseImage);
      
      await message.reply({
        body: "💔 | The Biggest Mistake of My Life...",
        attachment: fs.createReadStream(outputPath)
      });
      
      fs.unlinkSync(outputPath);
      message.unsend(processingMsg.messageID);
      
    } catch (error) {
      console.error(error);
      message.reply("❌ | An error occurred while creating your regret masterpiece. Please try again later.");
    }
  }
};

async function createMistakeMeme(avatarURL, baseURL) {
  try {
    const [avatar, base] = await Promise.all([
      jimp.read(avatarURL),
      jimp.read(baseURL)
    ]);

    base.resize(512, 512);
    avatar.resize(220, 203);
    base.composite(avatar, 145, 305);

    const outputPath = `${__dirname}/tmp/mistake_${Date.now()}.png`;
    await base.writeAsync(outputPath);
    
    return outputPath;
    
  } catch (error) {
    console.error("Image processing error:", error);
    throw new Error("Failed to create the meme");
  }
}
