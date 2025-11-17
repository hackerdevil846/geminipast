const axios = require("axios");

module.exports = {
  config: {
    name: "nuinfo",
    aliases: ["nuresult", "nu"],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "𝐶ℎ𝑒𝑐𝑘 𝑁𝑈 𝑎𝑑𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑟𝑒𝑠𝑢𝑙𝑡"
    },
    longDescription: {
      en: "𝐶ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑁𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑈𝑛𝑖𝑣𝑒𝑟𝑠𝑖𝑡𝑦 𝑎𝑑𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑡𝑒𝑠𝑡 𝑟𝑒𝑠𝑢𝑙𝑡 𝑢𝑠𝑖𝑛𝑔 𝑟𝑜𝑙𝑙 𝑛𝑢𝑚𝑏𝑒𝑟"
    },
    category: "𝐸𝑑𝑢𝑐𝑎𝑡𝑖𝑜𝑛",
    guide: {
      en: "{p}nuinfo [𝑟𝑜𝑙𝑙 𝑛𝑜.]\n\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}nuinfo 7056346"
    }
  },

  onStart: async function ({ message, args, api, event }) {
    const roll = args[0];
    if (!roll || isNaN(roll)) {
      return message.reply("❌ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑎𝑑𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑟𝑜𝑙𝑙 𝑛𝑢𝑚𝑏𝑒𝑟.\n\n📌 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: +nu 7056346");
    }

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const response = await axios.post(
        "http://app5.nu.edu.bd/nu-web/fetchAdmissionTestResultInformation",
        `admissionRoll=${roll}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Accept": "text/plain, */*; q=0.01",
            "X-Requested-With": "XMLHttpRequest"
          }
        }
      );

      const html = response.data;

      const extract = (label) => {
        const match = html.match(new RegExp(`<font[^>]*>${label}<\/font>\\s*(.*?)<\/div>`));
        return match ? match[1].trim() : "𝐍/𝐀";
      };

      const result = {
        applicationId: extract("Application ID :"),
        rollNo: extract("Admission Test Roll No :"),
        name: extract("Applicant Name :"),
        result: extract("Result :")
      };

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      const msg = 
`🎓 𝐍𝐔 𝐀𝐝𝐦𝐢𝐬𝐬𝐢𝐨𝐧 𝐑𝐞𝐬𝐮𝐥𝐭

📄 𝐴𝑝𝑝𝑙𝑖𝑐𝑎𝑡𝑖𝑜𝑛 𝐼𝐷: ${result.applicationId}
🎫 𝑅𝑜𝑙𝑙 𝑁𝑜: ${result.rollNo}
👤 𝐶𝑎𝑛𝑑𝑖𝑑𝑎𝑡𝑒: ${result.name}
📌 𝑅𝑒𝑠𝑢𝑙𝑡: ${result.result}`;

      message.reply(msg);

    } catch (err) {
      console.error(err);
      message.reply("❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑡ℎ𝑒 𝑟𝑒𝑠𝑢𝑙𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒 𝑟𝑜𝑙𝑙 𝑛𝑢𝑚𝑏𝑒𝑟 𝑜𝑟 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
