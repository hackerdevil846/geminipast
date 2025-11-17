const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
    config: {
      name: "rbg",
      aliases: [],
      author: "Asif",
      version: "69",
      cooldowns: 5,
      role: 0,
      shortDescription: {
        en: "Remove background in your photo"
      },
      longDescription: {
        en: "Remove background in your photo"
      },
      category: "img",
      guide: {
        en: "{p}{n} [reply to an img]"
      }
    },

onStart: async function({ api, event }) {
  const args = event.body.split(/\s+/);
  args.shift();

  try {
    const REMOVEBG_API_KEY = "RJLhNxKvywkX7BWxYts6cLqD"; // Replace with your actual remove.bg API key

    let pathie = __dirname + `/cache/removed_bg.jpg`;
    const { threadID, messageID } = event;

    let photoUrl = event.messageReply ? event.messageReply.attachments[0].url : args.join(" ");

    if (!photoUrl) {
      api.sendMessage("📸 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗎 𝗍𝗈 𝖺 𝗉𝗁𝗈𝗍𝗈 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝖺𝗇𝖽 𝗋𝖾𝖾𝗆𝗈𝗏𝖾 𝖻𝖺𝖼𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽𝗌.", threadID, messageID);
      return;
    }

    api.sendMessage("🕟 | 𝖱𝖾𝗆𝗈𝗏𝗂𝗇𝗀 𝖡𝖺𝖼𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...", threadID, async () => {
      try {
        const response = await axios({
          method: 'post',
          url: 'https://api.remove.bg/v1.0/removebg',
          headers: { 'X-API-Key': REMOVEBG_API_KEY },
          data: { 'image_url': photoUrl, 'size': 'auto' },
          responseType: 'arraybuffer'
        });

        fs.writeFileSync(pathie, Buffer.from(response.data, 'binary'));

        api.sendMessage({
          body: "✨ 𝖧𝖾𝗋𝖾'𝗌 𝗒𝗈𝗎𝗋 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁𝗈𝗎𝗍 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽.",
          attachment: fs.createReadStream(pathie)
        }, threadID, () => fs.unlinkSync(pathie), messageID);
      } catch (error) {
        api.sendMessage(`🔴 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾: ${error.message}`, threadID, messageID);
      }
    });
  } catch (error) {
    api.sendMessage(`𝖤𝗋𝗋𝗈𝗋: ${error.message}`, event.threadID, event.messageID);
   }
 }
};

