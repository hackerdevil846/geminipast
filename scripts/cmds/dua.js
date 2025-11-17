const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "dua",
    aliases: [],
    version: "1.3.0",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    category: "islamic",
    shortDescription: {
      en: "Islamic supplications and prayers with images"
    },
    longDescription: {
      en: "Provides Islamic supplications, prayers and duas with beautiful images"
    },
    guide: {
      en: "{p}dua\n{p}dua [number]"
    },
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "path": ""
    }
  },

  onLoad: async function() {
    try {
      const cacheDir = path.join(__dirname, 'cache', 'dua_images');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
        console.log("✅ Created dua images cache directory");
      }
    } catch (error) {
      console.error("❌ Cache directory creation error:", error);
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      const { threadID, messageID } = event;
      
      const duaContent = [
        {
          text: "𝐃𝐮𝐚 𝟏: 𝐅𝐨𝐫𝐠𝐢𝐯𝐞𝐧𝐞𝐬𝐬 𝐚𝐧𝐝 𝐏𝐫𝐨𝐭𝐞𝐜𝐭𝐢𝐨𝐧\n\nاللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ\n\n𝐓𝐫𝐚𝐧𝐬𝐥𝐢𝐭𝐞𝐫𝐚𝐭𝐢𝐨𝐧: 'Allahummagh-fir lee dhanbee kullah, diqqahu wa jillahu, wa awwalahu wa aakhirahu, wa 'alaaniyatahu wa sirrahu'\n\n𝐌𝐞𝐚𝐧𝐢𝐧𝐠: 'O Allah, forgive me all my sins, great and small, the first and the last, those that are apparent and those that are hidden.'",
          image: "https://i.imgur.com/aESlOKd.jpeg"
        },
        {
          text: "𝐃𝐮𝐚 𝟐: 𝐑𝐢𝐠𝐡𝐭𝐞𝐨𝐮𝐬 𝐅𝐚𝐦𝐢𝐥𝐲\n\nرَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا\n\n𝐓𝐫𝐚𝐧𝐬𝐥𝐢𝐭𝐞𝐫𝐚𝐭𝐢𝐨𝐧: 'Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lilmuttaqeena imama'\n\n𝐌𝐞𝐚𝐧𝐢𝐧𝐠: 'Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.'",
          image: "https://i.imgur.com/aESlOKd.jpeg"
        },
        {
          text: "𝐃𝐮𝐚 𝟑: 𝐏𝐫𝐨𝐭𝐞𝐜𝐭𝐢𝐨𝐧 𝐟𝐫𝐨𝐦 𝐒𝐚𝐭𝐚𝐧\n\nبِسْمِ اللّهِ اللّهُمَّ جَنِّبْنَا الشَّيْطَانَ وَ جَنِّبِ الشَّيْطَانَ مَا رَزَقْ�َنَا\n\n𝐓𝐫𝐚𝐧𝐬𝐥𝐢𝐭𝐞𝐫𝐚𝐭𝐢𝐨𝐧: 'Bismillahi Allahumma jannibnash-shaytana wa jannibish-shaytana ma razaqtana'\n\n𝐌𝐞𝐚𝐧𝐢𝐧𝐠: 'In the name of Allah. O Allah, keep us away from Satan and keep Satan away from what You provide us.'",
          image: "https://i.imgur.com/3Bmg4Nd.jpeg"
        },
        {
          text: "𝐃𝐮𝐚 𝟒: 𝐏𝐚𝐫𝐚𝐝𝐢𝐬𝐞 𝐚𝐧𝐝 𝐏𝐫𝐨𝐭𝐞𝐜𝐭𝐢𝐨𝐧 𝐟𝐫𝐨𝐦 𝐇𝐞𝐥𝐥\n\nاللّٰهُمَّ إِنَّا نَسْأَلُكَ الْجَنَّةَ وَالنَّارِ نَعُوْذُ بِكَ مِنَ النَّارِ\n\n𝐓𝐫𝐚𝐧𝐬𝐥𝐢𝐭𝐞𝐫𝐚𝐭𝐢𝐨𝐧: 'Allahumma inna nas'alukal jannata wa na'udhu bika minan-nar'\n\n𝐌𝐞𝐚𝐧𝐢𝐧𝐠: 'O Allah, we ask You for Paradise and seek refuge in You from the Hellfire.'",
          image: "https://i.imgur.com/TUm1LQW.jpeg"
        },
        {
          text: "𝐃𝐮𝐚 𝟓: 𝐏𝐫𝐨𝐭𝐞𝐜𝐭𝐢𝐨𝐧 𝐨𝐧 𝐉𝐮𝐝𝐠𝐞𝐦𝐞𝐧𝐭 𝐃𝐚𝐲\n\nاللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ\n\n𝐓𝐫𝐚𝐧𝐬𝐥𝐢𝐭𝐞𝐫𝐚𝐭𝐢𝐨𝐧: 'Allahumma qini 'adhabaka yawma tab'athu 'ibadaka'\n\n𝐌𝐞𝐚𝐧𝐢𝐧𝐠: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants.'",
          image: "https://i.imgur.com/wp7hM0m.jpeg"
        },
        {
          text: "𝐃𝐮𝐚 𝟔: 𝐅𝐨𝐫𝐠𝐢𝐯𝐞𝐧𝐞𝐬𝐬 𝐚𝐧𝐝 𝐌𝐞𝐫𝐜𝐲\n\nرَبَّنَاۤ اٰمَنَّا فَاغۡفِرۡ لَنَا وَ ارۡحَمۡنَا وَ اَنۡتَ خَیۡرُ الرّٰحِمِیۡنَ\n\n𝐓𝐫𝐚𝐧𝐬𝐥𝐢𝐭𝐞𝐫𝐚𝐭𝐢𝐨𝐧: 'Rabbana amanna faghfir lana warhamna wa anta khayrur rahimeen'\n\n𝐌𝐞𝐚𝐧𝐢𝐧𝐠: 'Our Lord, we have believed, so forgive us and have mercy upon us, and You are the best of the merciful.'",
          image: "https://i.imgur.com/pFvUmsm.jpeg"
        },
        {
          text: "𝐃𝐮𝐚 𝟕: 𝐑𝐞𝐥𝐢𝐞𝐟 𝐟𝐫𝐨𝐦 𝐁𝐮𝐫𝐝𝐞𝐧𝐬\n\nرَبَّنَا وَلَا تُحَمِّلۡنَا مَا لَا طَاقَةَ لَنَا بِهِۦ وَاعۡفُ عَنَّا وَاغۡفِرۡ لَنَا وَارۡحَمۡنَا\n\n𝐓𝐫𝐚𝐧𝐬𝐥𝐢𝐭𝐞𝐫𝐚𝐭𝐢𝐨𝐧: 'Rabbana wa la tuhammilna ma la taqata lana bihi wa'fu 'anna waghfir lana warhamna'\n\n𝐌𝐞𝐚𝐧𝐢𝐧𝐠: 'Our Lord, do not impose upon us that which we have no ability to bear. Pardon us; forgive us; and have mercy upon us.'",
          image: "https://i.imgur.com/LH2qVcm.jpeg"
        },
        {
          text: "𝐃𝐮𝐚 𝟖: 𝐑𝐢𝐠𝐡𝐭𝐞𝐨𝐮𝐬 𝐂𝐡𝐢𝐥𝐝𝐫𝐞𝐧\n\nرَبِّ هَبْ لِي مِنَ الصَّالِحِينَ\n\n𝐓𝐫𝐚𝐧𝐬𝐥𝐢𝐭𝐞𝐫𝐚𝐭𝐢𝐨𝐧: 'Rabbi hab li minas saliheen'\n\n𝐌𝐞𝐚𝐧𝐢𝐧𝐠: 'My Lord, grant me [a child] from among the righteous.'",
          image: "https://i.imgur.com/28Et6s2.jpeg"
        },
        {
          text: "𝐃𝐮𝐚 𝟗: 𝐆𝐫𝐚𝐯𝐞 𝐕𝐢𝐬𝐢𝐭 𝐒𝐮𝐩𝐩𝐥𝐢𝐜𝐚𝐭𝐢𝐨𝐧\n\nالسَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَالْمُسْلِمِينَ، وَإِنَّا إِنْ شَاءَ اللَّهُ بِكُمْ لَاحِقُونَ\n\n𝐓𝐫𝐚𝐧𝐬𝐥𝐢𝐭𝐞𝐫𝐚𝐭𝐢𝐨𝐧: 'Assalamu 'alaykum ahlad-diyari minal-mu'mineena wal-muslimeena, wa inna in sha'allahu bikum lahiqoon'\n\n𝐌𝐞𝐚𝐧𝐢𝐧𝐠: 'Peace be upon you, O inhabitants of the graves, among the believers and Muslims. Indeed, we will, if Allah wills, join you.'",
          image: "https://i.imgur.com/NIjfdfz.jpeg"
        },
        {
          text: "𝐃𝐮𝐚 𝟏𝟎: 𝐏𝐮𝐫𝐞 𝐎𝐟𝐟𝐬𝐩𝐫𝐢𝐧𝐠\n\nرَبِّ هَبْ لِي مِن لَّدُنْكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاء\n\n𝐓𝐫𝐚𝐧𝐬𝐥𝐢𝐭𝐞𝐫𝐚𝐭𝐢𝐨𝐧: 'Rabbi hab li mil ladunka dhurriyyatan tayyibatan innaka sami'ud-du'a'\n\n𝐌𝐞𝐚𝐧𝐢𝐧𝐠: 'My Lord, grant me from Yourself a good offspring. Indeed, You are the Hearer of supplication.'",
          image: "https://i.imgur.com/1ufw46l.jpeg"
        },
        {
          text: "𝐃𝐮𝐚 𝟏𝟏: 𝐂𝐨𝐦𝐩𝐫𝐞𝐡𝐞𝐧𝐬𝐢𝐯𝐞 𝐒𝐮𝐩𝐩𝐥𝐢𝐜𝐚𝐭𝐢𝐨𝐧\n\nاللّٰهُمَّ إِنِّيْ أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى\n\n𝐓𝐫𝐚𝐧𝐬𝐥𝐢𝐭𝐞𝐫𝐚𝐭𝐢𝐨𝐧: 'Allahumma inni as'alukal-huda wat-tuqa wal-'afafa wal-ghina'\n\n𝐌𝐞𝐚𝐧𝐢𝐧𝐠: 'O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.'",
          image: "https://i.imgur.com/0wcNcmI.jpeg"
        },
        {
          text: "𝐃𝐮𝐚 𝟏𝟐: 𝐆𝐫𝐚𝐯𝐞 𝐕𝐢𝐬𝐢𝐭𝐢𝐧𝐠 𝐄𝐭𝐢𝐪𝐮𝐞𝐭𝐭𝐞\n\n𝐆𝐮𝐢𝐝𝐞𝐥𝐢𝐧𝐞𝐬 𝐟𝐨𝐫 𝐕𝐢𝐬𝐢𝐭𝐢𝐧𝐠 𝐆𝐫𝐚𝐯𝐞𝐬:\n\n𝟏. Stand beside the grave and offer greetings of peace\n𝟐. Recite Surah Al-Fatihah\n𝟑. Recite Surah Al-Ikhlas, Al-Falaq, and An-Nas\n𝟒. Make dua for the deceased\n𝟓. Depart respectfully without stepping on graves\n\n𝐕𝐢𝐬𝐢𝐭𝐢𝐧𝐠 𝐠𝐫𝐚𝐯𝐞𝐬 𝐢𝐬 𝐫𝐞𝐜𝐨𝐦𝐦𝐞𝐧𝐝𝐞𝐝 (𝐦𝐮𝐬𝐭𝐚𝐡𝐚𝐛𝐛) 𝐢𝐧 𝐈𝐬𝐥𝐚𝐦 𝐭𝐨 𝐫𝐞𝐦𝐞𝐦𝐛𝐞𝐫 𝐭𝐡𝐞 𝐇𝐞𝐫𝐞𝐚𝐟𝐭𝐞𝐫.",
          image: "https://i.imgur.com/AnIgU1J.jpeg"
        }
      ];

      // Show menu if no number provided
      if (!args[0] || isNaN(args[0])) {
        const menuMessage = `𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐃𝐮𝐚 𝐂𝐨𝐥𝐥𝐞𝐜𝐭𝐢𝐨𝐧

𝐒𝐞𝐥𝐞𝐜𝐭 𝐚 𝐝𝐮𝐚 𝐟𝐫𝐨𝐦 𝐭𝐡𝐞 𝐥𝐢𝐬𝐭 𝐛𝐲 𝐞𝐧𝐭𝐞𝐫𝐢𝐧𝐠 𝐚 𝐧𝐮𝐦𝐛𝐞𝐫:

𝟏.  Forgiveness and Protection
𝟐.  Righteous Family
𝟑.  Protection from Satan
𝟒.  Paradise and Hellfire Protection
𝟓.  Judgement Day Protection
𝟔.  Forgiveness and Mercy
𝟕.  Relief from Burdens
𝟖.  Righteous Children
𝟗.  Grave Visit Supplication
𝟏𝟎. Pure Offspring
𝟏𝟏. Comprehensive Dua
𝟏𝟐. Grave Visiting Guide

𝐔𝐬𝐚𝐠𝐞: 𝐝𝐮𝐚 [𝐧𝐮𝐦𝐛𝐞𝐫] (𝐞𝐱𝐚𝐦𝐩𝐥𝐞: 𝐝𝐮𝐚 𝟓)`;

        // Auto-download all images in background when menu is shown
        this.preDownloadImages(duaContent);
        
        return message.reply(menuMessage);
      }

      // Handle number selection
      const selection = parseInt(args[0]);
      if (selection < 1 || selection > duaContent.length) {
        return message.reply(`❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐬𝐞𝐥𝐞𝐜𝐭𝐢𝐨𝐧! 𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐭𝐞𝐫 𝐚 𝐧𝐮𝐦𝐛𝐞𝐫 𝐛𝐞𝐭𝐰𝐞𝐞𝐧 𝟏-${duaContent.length}.`);
      }
      
      const dua = duaContent[selection - 1];
      const cacheDir = path.join(__dirname, 'cache', 'dua_images');
      const imagePath = path.join(cacheDir, `dua_${selection}.jpeg`);
      
      try {
        console.log(`🖼️ 𝐀𝐭𝐭𝐞𝐦𝐩𝐭𝐢𝐧𝐠 𝐭𝐨 𝐬𝐞𝐧𝐝 𝐢𝐦𝐚𝐠𝐞 𝐟𝐨𝐫 𝐝𝐮𝐚 #${selection}`);
        
        // Check if image already exists in cache
        if (fs.existsSync(imagePath)) {
          console.log(`✅ 𝐈𝐦𝐚𝐠𝐞 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐞𝐱𝐢𝐬𝐭𝐬 𝐢𝐧 𝐜𝐚𝐜𝐡𝐞, 𝐬𝐞𝐧𝐝𝐢𝐧𝐠...`);
          
          // Send cached image
          await message.reply({
            body: dua.text,
            attachment: fs.createReadStream(imagePath)
          });
          
          console.log(`✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐬𝐞𝐧𝐭 𝐜𝐚𝐜𝐡𝐞𝐝 𝐢𝐦𝐚𝐠𝐞 𝐟𝐨𝐫 𝐝𝐮𝐚 #${selection}`);
          
        } else {
          console.log(`📥 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐢𝐦𝐚𝐠𝐞 𝐟𝐨𝐫 𝐝𝐮𝐚 #${selection}...`);
          
          // Download the image immediately
          const loadingMsg = await message.reply(`📥 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐢𝐦𝐚𝐠𝐞 𝐟𝐨𝐫 𝐃𝐮𝐚 ${selection}...\n\n⏳ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭...`);
          
          const response = await axios({
            method: 'GET',
            url: dua.image,
            responseType: 'stream',
            timeout: 30000, // 30 seconds timeout for image download
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          // Create write stream
          const writer = fs.createWriteStream(imagePath);
          
          response.data.pipe(writer);
          
          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });

          console.log(`✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐢𝐦𝐚𝐠𝐞 𝐟𝐨𝐫 𝐝𝐮𝐚 #${selection}`);
          
          // Delete loading message
          try {
            await message.unsendMessage(loadingMsg.messageID);
          } catch (e) {
            console.log("ℹ️ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐝𝐞𝐥𝐞𝐭𝐞 𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐦𝐞𝐬𝐬𝐚𝐠𝐞");
          }
          
          // Send the downloaded image
          await message.reply({
            body: dua.text,
            attachment: fs.createReadStream(imagePath)
          });
          
          console.log(`✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐬𝐞𝐧𝐭 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐢𝐦𝐚𝐠𝐞 𝐟𝐨𝐫 𝐝𝐮𝐚 #${selection}`);
        }
        
      } catch (imageError) {
        console.error("❌ 𝐈𝐦𝐚𝐠𝐞 𝐞𝐫𝐫𝐨𝐫:", imageError);
        
        // Clean up failed download
        try {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        } catch (cleanupError) {
          console.log("ℹ️ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐜𝐥𝐞𝐚𝐧 𝐮𝐩 𝐟𝐚𝐢𝐥𝐞𝐝 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝");
        }
        
        // Final fallback - send text only
        await message.reply(`${dua.text}\n\n❌ 𝐈𝐦𝐚𝐠𝐞 𝐜𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐛𝐞 𝐥𝐨𝐚𝐝𝐞𝐝. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.`);
      }

    } catch (error) {
      console.error("💥 𝐃𝐮𝐚 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐄𝐫𝐫𝐨𝐫:", error);
      
      try {
        await message.reply("❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲: /𝐝𝐮𝐚 [𝟏-𝟏𝟐]");
      } catch (finalError) {
        console.error("💥 𝐅𝐢𝐧𝐚𝐥 𝐞𝐫𝐫𝐨𝐫 𝐡𝐚𝐧𝐝𝐥𝐢𝐧𝐠 𝐟𝐚𝐢𝐥𝐞𝐝:", finalError);
      }
    }
  },

  // Auto-download all images in background
  preDownloadImages: async function(duaContent) {
    try {
      const cacheDir = path.join(__dirname, 'cache', 'dua_images');
      
      console.log("🔄 𝐒𝐭𝐚𝐫𝐭𝐢𝐧𝐠 𝐚𝐮𝐭𝐨-𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐨𝐟 𝐚𝐥𝐥 𝐢𝐦𝐚𝐠𝐞𝐬...");
      
      for (let i = 0; i < duaContent.length; i++) {
        const imagePath = path.join(cacheDir, `dua_${i + 1}.jpeg`);
        
        // Skip if already downloaded
        if (fs.existsSync(imagePath)) {
          console.log(`✅ 𝐈𝐦𝐚𝐠𝐞 ${i + 1} 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐞𝐱𝐢𝐬𝐭𝐬`);
          continue;
        }
        
        try {
          console.log(`📥 𝐀𝐮𝐭𝐨-𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐢𝐦𝐚𝐠𝐞 ${i + 1}...`);
          
          const response = await axios({
            method: 'GET',
            url: duaContent[i].image,
            responseType: 'stream',
            timeout: 30000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          const writer = fs.createWriteStream(imagePath);
          response.data.pipe(writer);
          
          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });
          
          console.log(`✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐚𝐮𝐭𝐨-𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐢𝐦𝐚𝐠𝐞 ${i + 1}`);
          
        } catch (downloadError) {
          console.error(`❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐚𝐮𝐭𝐨-𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐢𝐦𝐚𝐠𝐞 ${i + 1}:`, downloadError.message);
        }
      }
      
      console.log("🎯 𝐀𝐮𝐭𝐨-𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐜𝐨𝐦𝐩𝐥𝐞𝐭𝐞𝐝");
      
    } catch (error) {
      console.error("💥 𝐀𝐮𝐭𝐨-𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐞𝐫𝐫𝐨𝐫:", error);
    }
  }
};
