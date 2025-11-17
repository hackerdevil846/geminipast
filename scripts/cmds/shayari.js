const axios = require("axios");

const images = [
  "https://i.ibb.co/KxBqKCMD/1755944202493-0-5154647769363978.jpg",
  "https://i.ibb.co/nMp3sVqB/1755944203527-0-6844357499391724.jpg",
  "https://i.ibb.co/9mybjRXR/1755944204633-0-8237185596125263.jpg",
  "https://i.ibb.co/CqDK9tp/1755944205593-0-15451265481144683.jpg",
  "https://i.ibb.co/NgvhwTHb/1755944206713-0-9248399418413817.jpg",
  "https://i.ibb.co/1fJVfkW0/1755944207548-0-8771376215258824.jpg",
  "https://i.ibb.co/ZR11HLYW/1755944208450-0-8410728131461191.jpg",
  "https://i.ibb.co/xqx5dYHz/1755944209281-0-09026138149100027.jpg",
  "https://i.ibb.co/zWQ1XnjB/image.jpg"
];

// Dark stylish font converter
function toDarkFont(text) {
  const map = {
    A:"𝗔",B:"𝗕",C:"𝗖",D:"𝗗",E:"𝗘",F:"𝗙",G:"𝗚",H:"𝗛",I:"𝗜",J:"𝗝",K:"𝗞",L:"𝗟",M:"𝗠",
    N:"𝗡",O:"𝗢",P:"𝗣",Q:"𝗤",R:"𝗥",S:"𝗦",T:"𝗧",U:"𝗨",V:"𝗩",W:"𝗪",X:"𝗫",Y:"𝗬",Z:"𝗭",
    a:"𝗮",b:"𝗯",c:"𝗰",d:"𝗱",e:"𝗲",f:"𝗳",g:"𝗴",h:"𝗵",i:"𝗶",j:"𝗷",k:"𝗸",l:"𝗹",m:"𝗺",
    n:"𝗻",o:"𝗼",p:"𝗽",q:"𝗾",r:"𝗿",s:"𝘀",t:"𝘁",u:"𝘂",v:"𝘃",w:"𝘄",x:"𝘅",y:"𝘆",z:"𝘇"
  };
  return text.split("").map(c => map[c] || c).join("");
}

// Auto-detect language and translate to Bengali
async function autoTranslateToBengali(text) {
  try {
    // First detect the language
    const detectResponse = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|bn`, {
      timeout: 10000
    });
    
    if (detectResponse.data && detectResponse.data.responseData && detectResponse.data.responseData.translatedText) {
      return detectResponse.data.responseData.translatedText;
    }
    return text; // Return original if translation fails
  } catch (error) {
    console.error("𝖳𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", error);
    return text; // Return original if translation fails
  }
}

// Function to detect if text is already in Bengali
function isBengali(text) {
  const bengaliRegex = /[\u0980-\u09FF]/;
  return bengaliRegex.test(text);
}

module.exports = {
  config: {
    name: "shayari",
    aliases: [],
    version: "2.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝖱𝖺𝗇𝖽𝗈𝗆 𝖲𝗁𝖺𝗒𝖺𝗋𝗂 𝗐𝗂𝗍𝗁 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼 𝖡𝖾𝗇𝗀𝖺𝗅𝗂 𝗍𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝗂𝗈𝗇"
    },
    longDescription: {
      en: "𝖥𝖾𝗍𝖼𝗁𝖾𝗌 𝖲𝗁𝖺𝗒𝖺𝗋𝗂 𝖿𝗋𝗈𝗆 𝖠𝖯𝖨, 𝖺𝗎𝗍𝗈-𝖽𝖾𝗍𝖾𝖼𝗍𝗌 𝗅𝖺𝗇𝗀𝗎𝖺𝗀𝖾 𝖺𝗇𝖽 𝗍𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝖾𝗌 𝗍𝗈 𝖡𝖾𝗇𝗀𝖺𝗅𝗂"
    },
    category: "fun",
    guide: {
      en: "{p}shayari"
    },
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function ({ message, event }) {
    try {
      // Dependency check
      let dependenciesAvailable = true;
      try {
        require("axios");
      } catch (e) {
        dependenciesAvailable = false;
      }

      if (!dependenciesAvailable) {
        return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
      }

      const loadingMsg = await message.reply("⏳ 𝖲𝗁𝖺𝗒𝖺𝗋𝗂 𝖺𝗇𝖺𝗒𝗈𝗇 𝖼𝗁𝗎𝗍𝖾𝖼𝗁𝗂...");

      try {
        const randomImage = images[Math.floor(Math.random() * images.length)];

        // Fetch shayari from API with timeout
        const response = await axios.get("https://api.princetechn.com/api/fun/shayari?apikey=prince", {
          timeout: 15000
        });
        
        let shayari = response.data?.result || "𝗄𝗈𝗇𝗈 𝗌𝗁𝖺𝗒𝖺𝗋𝗂 𝗉𝖺𝗐𝖺 𝗒𝖺𝗒 𝗇𝗂 😅";

        // Auto-detect language and translate to Bengali if not already Bengali
        let finalShayari = shayari;
        if (!isBengali(shayari)) {
          try {
            finalShayari = await autoTranslateToBengali(shayari);
          } catch (translateError) {
            console.error("𝖳𝗋𝖺𝗇𝗌𝗅𝖺𝗍𝗂𝗈𝗇 𝖿𝖺𝗂𝗅𝖾𝖽, 𝗎𝗌𝗂𝗇𝗀 𝗈𝗋𝗂𝗀𝗂𝗇𝖺𝗅:", translateError.message);
            finalShayari = shayari;
          }
        }

        // Apply dark font
        const heading = toDarkFont("💌 𝖠𝗉𝗇𝖺𝗋 𝗃𝗈𝗇𝗒𝗈 𝗌𝗁𝖺𝗒𝖺𝗋𝗂");
        const darkShayari = toDarkFont(finalShayari);

        // Get image stream with error handling
        let imageStream;
        try {
          imageStream = await global.utils.getStreamFromURL(randomImage);
        } catch (streamError) {
          console.error("𝖨𝗆𝖺𝗀𝖾 𝗌𝗍𝗋𝖾𝖺𝗆 𝖾𝗋𝗋𝗈𝗋:", streamError);
          // Continue without image if stream fails
        }

        // Unsend loading message
        try {
          await message.unsendMessage(loadingMsg.messageID);
        } catch (unsendError) {
          console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
        }

        if (imageStream) {
          await message.reply({
            body: `${heading}\n\n${darkShayari}`,
            attachment: imageStream
          });
        } else {
          await message.reply({
            body: `${heading}\n\n${darkShayari}\n\n📸 𝖨𝗆𝖺𝗀𝖾 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾`
          });
        }

      } catch (apiError) {
        console.error("💥 𝖲𝗁𝖺𝗒𝖺𝗋𝗂 𝖠𝖯𝖨 𝖾𝗋𝗋𝗈𝗋:", apiError);
        
        // Unsend loading message
        try {
          await message.unsendMessage(loadingMsg.messageID);
        } catch (unsendError) {
          console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
        }

        await message.reply("😢 𝖲𝗁𝖺𝗒𝖺𝗋𝗂 𝖺𝗇𝖺𝗍𝖾 𝗌𝗈𝗆𝗈𝗌𝗌𝗒𝖺 𝗁𝗈𝗒𝖾𝖼𝗁𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖺𝗀𝖺𝗂𝗇 𝗍𝗋𝗒 𝗄𝗈𝗋𝗎𝗇.");
      }

    } catch (err) {
      console.error("💥 𝖲𝗁𝖺𝗒𝖺𝗋𝗂 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", err);
      
      try {
        await message.unsendMessage(loadingMsg.messageID);
      } catch (unsendError) {
        console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
      }
      
      await message.reply("😢 𝖲𝗁𝖺𝗒𝖺𝗋𝗂 𝖺𝗇𝖺𝗍𝖾 𝗌𝗈𝗆𝗈𝗌𝗌𝗒𝖺 𝗁𝗈𝗒𝖾𝖼𝗁𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖺𝗀𝖺𝗂𝗇 𝗍𝗋𝗒 𝗄𝗈𝗋𝗎𝗇.");
    }
  }
};
