const axios = require('axios');
const jimp = require('jimp');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: 'wanted',
    aliases: ['chorgang'],
    version: '1.1',
    author: '𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑',
    role: 0,
    category: 'fun',
    shortDescription: {
      en: '🎭 𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑓𝑢𝑛 𝑤𝑎𝑛𝑡𝑒𝑑 𝑓𝑟𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑓𝑟𝑖𝑒𝑛𝑑𝑠'
    },
    longDescription: {
      en: '𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑤𝑎𝑛𝑡𝑒𝑑 𝑝𝑜𝑠𝑡𝑒𝑟 𝑤𝑖𝑡ℎ 3 𝑡𝑎𝑔𝑔𝑒𝑑 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑓𝑟𝑖𝑒𝑛𝑑𝑠'
    },
    guide: {
      en: '{p}wanted @𝑡𝑎𝑔1 @𝑡𝑎𝑔2'
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "jimp": "",
      "fs-extra": ""
    }
  },

  langs: {
    en: {
      tagMore: '❌ 𝑇𝑎𝑔 𝑦𝑜𝑢𝑟 𝑡𝑤𝑜 𝑓𝑟𝑖𝑒𝑛𝑑𝑠 𝑡𝑜 𝑖𝑛𝑣𝑖𝑡𝑒 𝑡ℎ𝑒𝑚 𝑖𝑛 𝑤𝑎𝑛𝑡𝑒𝑑 𝑓𝑟𝑎𝑚𝑒',
      result: '✅ 𝑇ℎ𝑒𝑠𝑒 𝑔𝑢𝑦𝑠 𝑎𝑟𝑒 𝑤𝑎𝑛𝑡𝑒𝑑!',
      error: '❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒.'
    }
  },

  onStart: async function ({ message, event, args, getText }) {
    try {
      const mention = Object.keys(event.mentions || {});
      if (mention.length < 2) return message.reply(getText('tagMore'));

      // include the command sender as the third person
      mention.push(event.senderID);
      const [one, two, three] = mention;

      const imagePath = await generateImage(one, two, three);

      // send and then remove the temp file
      await message.reply({
        body: getText('result'),
        attachment: fs.createReadStream(imagePath)
      });

      // cleanup
      try {
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      } catch (e) {
        console.error('Failed to remove temp file:', e);
      }
    } catch (error) {
      console.error('Error while running command:', error);
      return message.reply(getText('error'));
    }
  }
};

async function generateImage(one, two, three) {
  // NOTE: token and image URL kept unchanged as requested
  const token = '6628568379%7Cc1e620fa708a1d5696fb991c1bde5662';

  // load avatars in parallel
  const [avatarOne, avatarTwo, avatarThree] = await Promise.all([
    jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${token}`),
    jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${token}`),
    jimp.read(`https://graph.facebook.com/${three}/picture?width=512&height=512&access_token=${token}`)
  ]);

  const image = await jimp.read('https://i.ibb.co/7yPR6Xf/image.jpg');
  image
    .resize(2452, 1226)
    .composite(avatarOne.resize(405, 405), 206, 345)
    .composite(avatarTwo.resize(400, 400), 1830, 350)
    .composite(avatarThree.resize(450, 450), 1010, 315);

  const tmpDir = `${__dirname}/tmp`;
  await fs.ensureDir(tmpDir);
  const imagePath = `${tmpDir}/wanted_output.png`;
  await image.writeAsync(imagePath);
  return imagePath;
}
