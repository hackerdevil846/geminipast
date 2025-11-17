const axios = require("axios");
const FormData = require("form-data");

module.exports = {
  config: {
    name: "upscale",
    aliases: ["enhanced", "hdphoto"],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "image",
    shortDescription: {
      en: "🖼️ 𝐸𝑛ℎ𝑎𝑛𝑐𝑒 𝑖𝑚𝑎𝑔𝑒 𝑞𝑢𝑎𝑙𝑖𝑡𝑦 (𝑢𝑛𝑏𝑙𝑢𝑟 + 𝑢𝑝𝑠𝑐𝑎𝑙𝑒)"
    },
    longDescription: {
      en: "𝑈𝑠𝑒𝑠 𝐶𝑢𝑡𝑜𝑢𝑡 𝑃𝑟𝑜 𝐴𝑃𝐼 𝑡𝑜 𝑒𝑛ℎ𝑎𝑛𝑐𝑒 𝑝ℎ𝑜𝑡𝑜 𝑞𝑢𝑎𝑙𝑖𝑡𝑦 𝑎𝑛𝑑 𝑟𝑒𝑠𝑜𝑙𝑢𝑡𝑖𝑜𝑛"
    },
    guide: {
      en: "𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑜𝑟 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑈𝑅𝐿\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {𝑝}𝑢𝑝𝑠𝑐𝑎𝑙𝑒 [𝑖𝑚𝑎𝑔𝑒_𝑢𝑟𝑙] [𝑜𝑢𝑡𝑝𝑢𝑡 𝑓𝑜𝑟𝑚𝑎𝑡]\n𝐹𝑜𝑟𝑚𝑎𝑡𝑠: 𝑝𝑛𝑔, 𝑗𝑝𝑔_90, 𝑗𝑝𝑔_80"
    },
    countDown: 10,
    dependencies: {
      "axios": "",
      "form-data": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      let imageUrl;
      const outputFormat = args[1] || "png";

      if (event.messageReply?.attachments?.[0]?.type === "photo") {
        imageUrl = event.messageReply.attachments[0].url;
      } else if (args[0]?.match(/^https?:\/\/.+\.(jpe?g|png|gif|bmp)$/i)) {
        imageUrl = args[0];
      } else {
        return message.reply("🔍 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑜𝑟 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿");
      }

      const imageBuffer = (await axios.get(imageUrl, { responseType: "arraybuffer" })).data;

      const form = new FormData();
      form.append("file", imageBuffer, { filename: "input.jpg", contentType: "image/jpeg" });

      const apiUrl = `https://www.cutout.pro/api/v1/photoEnhance?outputFormat=${outputFormat}`;
      const response = await axios.post(apiUrl, form, {
        headers: {
          "APIKEY": "db95b47632c54582b5bb24271de428bc",
          ...form.getHeaders()
        },
        responseType: "stream"
      });

      await message.reply({
        body: `🖼️ 𝐸𝑛ℎ𝑎𝑛𝑐𝑒𝑑 𝐻𝐷 𝐼𝑚𝑎𝑔𝑒 (𝐹𝑜𝑟𝑚𝑎𝑡: ${outputFormat})`,
        attachment: response.data
      });

    } catch (error) {
      console.error("CutoutPro Error:", error.response?.data || error.message);

      let errorMsg = "❌ 𝐸𝑟𝑟𝑜𝑟 𝑒𝑛ℎ𝑎𝑛𝑐𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒";
      if (error.response?.status === 429) {
        errorMsg = "⚠️ 𝐴𝑃𝐼 𝑙𝑖𝑚𝑖𝑡 𝑟𝑒𝑎𝑐ℎ𝑒𝑑 (𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟)";
      } else if (error.message.includes("timeout")) {
        errorMsg = "⌛ 𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡𝑜𝑜𝑘 𝑡𝑜𝑜 𝑙𝑜𝑛𝑔 (𝑡𝑟𝑦 𝑠𝑚𝑎𝑙𝑙𝑒𝑟 𝑖𝑚𝑎𝑔𝑒)";
      }
      message.reply(errorMsg);
    }
  }
};
