const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "vtuber_wiki",
    aliases: ["vtubersearch", "hololiveinfo"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "info",
    shortDescription: {
      en: "𝐻𝑜𝑙𝑜𝑑𝑒𝑥 𝐴𝑃𝐼 𝑉𝑇𝑢𝑏𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
    },
    longDescription: {
      en: "𝐺𝑒𝑡 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑏𝑜𝑢𝑡 𝑉𝑇𝑢𝑏𝑒𝑟𝑠 𝑢𝑠𝑖𝑛𝑔 𝐻𝑜𝑙𝑜𝑑𝑒𝑥 𝐴𝑃𝐼"
    },
    guide: {
      en: "{p}vtuber_wiki [𝑉𝑇𝑢𝑏𝑒𝑟 𝑛𝑎𝑚𝑒]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "request": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const API_KEY = "5ab098dd-7c70-4cdb-be66-a069ce996f7c";
      const HOLODEX_API_BASE_URL = "https://holodex.net/api/v2";

      // check args
      if (!args || args.length === 0) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑉𝑇𝑢𝑏𝑒𝑟 𝑛𝑎𝑚𝑒 𝑡𝑜 𝑠𝑒𝑎𝑟𝑐ℎ!");
      }

      const query = args.join(" ");
      const processingMsg = await message.reply(`🔎 𝑆𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔 𝑓𝑜𝑟 "${query}"...`);

      try {
        const searchResponse = await axios.get(`${HOLODEX_API_BASE_URL}/channels`, {
          headers: {
            'X-APIKEY': API_KEY
          },
          params: {
            name: query,
            limit: 1
          }
        });

        const channels = searchResponse.data;

        if (!channels || channels.length === 0) {
          await api.unsendMessage(processingMsg.messageID);
          return message.reply(`⚠️ 𝑁𝑜 𝑉𝑇𝑢𝑏𝑒𝑟 𝑓𝑜𝑢𝑛𝑑 𝑤𝑖𝑡ℎ 𝑛𝑎𝑚𝑒 "${query}"`);
        }

        const vtuber = channels[0];
        const cacheDir = path.join(__dirname, 'cache');

        if (!fs.existsSync(cacheDir)) {
          try {
            fs.mkdirSync(cacheDir);
          } catch (err) {
            console.error("𝐶𝑎𝑐ℎ𝑒 𝑑𝑖𝑟 𝑐𝑟𝑒𝑎𝑡𝑒 𝑒𝑟𝑟𝑜𝑟:", err);
          }
        }

        const imageUrl = vtuber.photo;
        const imagePath = path.join(cacheDir, `vtuber_${event.senderID}.png`);

        // build message body
        const messageBody = `
✨ 𝑽𝑻𝒖𝒃𝒆𝒓 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 ✨

𝑵𝒂𝒎𝒆: ${vtuber.name || '𝑁/𝐴'}
𝑪𝒉𝒂𝒏𝒏𝒆𝒍 𝑰𝑫: ${vtuber.id || '𝑁/𝐴'}
𝑺𝒖𝒃𝒔𝒄𝒓𝒊𝒃𝒆𝒓𝒔: ${vtuber.subscriber_count ? vtuber.subscriber_count.toLocaleString() : '𝑁/𝐴'}
𝑽𝒊𝒆𝒘𝒔: ${vtuber.view_count ? vtuber.view_count.toLocaleString() : '𝑁/𝐴'}
𝑽𝒊𝒅𝒆𝒐𝒔: ${vtuber.video_count || '𝑁/𝐴'}
𝑻𝒘𝒊𝒕𝒕𝒆𝒓: ${vtuber.twitter_link || '𝑁/𝐴'}
𝒀𝒐𝒖𝑻𝒖𝒃𝒆: ${vtuber.youtube_link || '𝑁/𝐴'}

${vtuber.description ? `𝑫𝒆𝒔𝒄𝒓𝒊𝒑𝒕𝒊𝒐𝒏: ${vtuber.description}` : ''}
        `;

        if (imageUrl) {
          // download image and send as attachment
          const writeStream = fs.createWriteStream(imagePath);
          const req = request(imageUrl);
          req.pipe(writeStream);

          req.on('error', (err) => {
            console.error("𝐼𝑚𝑎𝑔𝑒 𝑟𝑒𝑞𝑢𝑒𝑠𝑡 𝑒𝑟𝑟𝑜𝑟:", err);
            // fallback to text-only message
            api.unsendMessage(processingMsg.messageID);
            return message.reply(messageBody);
          });

          writeStream.on('error', (err) => {
            console.error("𝑊𝑟𝑖𝑡𝑒 𝑠𝑡𝑟𝑒𝑎𝑚 𝑒𝑟𝑟𝑜𝑟:", err);
            api.unsendMessage(processingMsg.messageID);
            return message.reply(messageBody);
          });

          writeStream.on('close', () => {
            // send message with attachment, then cleanup
            api.unsendMessage(processingMsg.messageID);
            message.reply({
              body: messageBody,
              attachment: fs.createReadStream(imagePath)
            }).then(() => {
              try {
                if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
              } catch (e) {
                console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", e);
              }
            });
          });
        } else {
          // no image available, send text-only
          api.unsendMessage(processingMsg.messageID);
          message.reply(messageBody);
        }

      } catch (error) {
        await api.unsendMessage(processingMsg.messageID);
        console.error("𝐴𝑃𝐼 𝐸𝑟𝑟𝑜𝑟:", error);
        return message.reply(`❌ 𝐸𝑟𝑟𝑜𝑟: ${error.message || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑"}`);
      }

    } catch (error) {
      console.error("𝑀𝑎𝑖𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
      return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡");
    }
  }
};
