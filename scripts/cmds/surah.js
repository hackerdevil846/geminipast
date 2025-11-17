const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Quran Metadata
const QuranData = {
  Sura: [
    [],
    [0, 7, 5, 1, 'الفاتحة', "Al-Faatiha", 'The Opening', 'Meccan'],
    [7, 286, 87, 40, 'البقرة', "Al-Baqara", 'The Cow', 'Medinan'],
    [293, 200, 89, 20, 'آل عمران', "Aal-i-Imraan", 'The Family of Imraan', 'Medinan'],
    [493, 176, 92, 24, 'النساء', "An-Nisaa", 'The Women', 'Medinan'],
    [669, 120, 112, 16, 'المائدة', "Al-Maaida", 'The Table', 'Medinan'],
    [789, 165, 55, 20, 'الأنعام', "Al-An'aam", 'The Cattle', 'Meccan'],
    [954, 206, 39, 24, 'الأعراف', "Al-A'raaf", 'The Heights', 'Meccan'],
    [1160, 75, 88, 10, 'الأنفال', "Al-Anfaal", 'The Spoils of War', 'Medinan'],
    [1235, 129, 113, 16, 'التوبة', "At-Tawba", 'The Repentance', 'Medinan'],
    [1364, 109, 51, 11, 'يونس', "Yunus", 'Jonas', 'Meccan'],
    [1473, 123, 52, 10, 'هود', "Hud", 'Hud', 'Meccan'],
    [1596, 111, 53, 12, 'يوسف', "Yusuf", 'Joseph', 'Meccan'],
    [1707, 43, 96, 6, 'الرعد', "Ar-Ra'd", 'The Thunder', 'Medinan'],
    [1750, 52, 72, 7, 'ابراهيم', "Ibrahim", 'Abraham', 'Meccan'],
    [1802, 99, 54, 6, 'الحجر', "Al-Hijr", 'The Rock', 'Meccan'],
    [1901, 128, 70, 16, 'النحل', "An-Nahl", 'The Bee', 'Meccan'],
    [2029, 111, 50, 12, 'الإسراء', "Al-Israa", 'The Night Journey', 'Meccan'],
    [2140, 110, 69, 12, 'الكهف', "Al-Kahf", 'The Cave', 'Meccan'],
    [2250, 98, 44, 6, 'مريم', "Maryam", 'Mary', 'Meccan'],
    [2348, 135, 45, 8, 'طه', "Taa-Haa", 'Taa-Haa', 'Meccan'],
    [2483, 112, 73, 7, 'الأنبياء', "Al-Anbiyaa", 'The Prophets', 'Meccan'],
    [2595, 78, 103, 10, 'الحج', "Al-Hajj", 'The Pilgrimage', 'Medinan'],
    [2673, 118, 74, 6, 'المؤمنون', "Al-Muminoon", 'The Believers', 'Meccan'],
    [2791, 64, 102, 9, 'النور', "An-Noor", 'The Light', 'Medinan'],
    [2855, 77, 42, 6, 'الفرقان', "Al-Furqaan", 'The Criterion', 'Meccan'],
    [2932, 227, 47, 11, 'الشعراء', "Ash-Shu'araa", 'The Poets', 'Meccan'],
    [3159, 93, 48, 7, 'النمل', "An-Naml", 'The Ant', 'Meccan'],
    [3252, 88, 49, 8, 'القصص', "Al-Qasas", 'The Stories', 'Meccan'],
    [3340, 69, 85, 7, 'العنكبوت', "Al-Ankaboot", 'The Spider', 'Meccan'],
    [3409, 60, 84, 6, 'الروم', "Ar-Room", 'The Romans', 'Meccan'],
    [3469, 34, 57, 3, 'لقمان', "Luqman", 'Luqman', 'Meccan'],
    [3503, 30, 75, 3, 'السجدة', "As-Sajda", 'The Prostration', 'Meccan'],
    [3533, 73, 90, 9, 'الأحزاب', "Al-Ahzaab", 'The Clans', 'Medinan'],
    [3606, 54, 58, 6, 'سبإ', "Saba", 'Sheba', 'Meccan'],
    [3660, 45, 43, 5, 'فاطر', "Faatir", 'The Originator', 'Meccan'],
    [3705, 83, 41, 5, 'يس', "Yaseen", 'Yaseen', 'Meccan'],
    [3788, 182, 56, 5, 'الصافات', "As-Saaffaat", 'Those drawn up in Ranks', 'Meccan'],
    [3970, 88, 38, 5, 'ص', "Saad", 'The letter Saad', 'Meccan'],
    [4058, 75, 59, 8, 'الزمر', "Az-Zumar", 'The Groups', 'Meccan'],
    [4133, 85, 60, 9, 'غافر', "Al-Ghaafir", 'The Forgiver', 'Meccan'],
    [4218, 54, 61, 6, 'فصلت', "Fussilat", 'Explained in detail', 'Meccan'],
    [4272, 53, 62, 5, 'الشورى', "Ash-Shura", 'Consultation', 'Meccan'],
    [4325, 89, 63, 7, 'الزخرف', "Az-Zukhruf", 'Ornaments of gold', 'Meccan'],
    [4414, 59, 64, 3, 'الدخان', "Ad-Dukhaan", 'The Smoke', 'Meccan'],
    [4473, 37, 65, 4, 'الجاثية', "Al-Jaathiya", 'Crouching', 'Meccan'],
    [4510, 35, 66, 4, 'الأحقاف', "Al-Ahqaf", 'The Dunes', 'Meccan'],
    [4545, 38, 95, 4, 'محمد', "Muhammad", 'Muhammad', 'Medinan'],
    [4583, 29, 111, 4, 'الفتح', "Al-Fath", 'The Victory', 'Medinan'],
    [4612, 18, 106, 2, 'الحجرات', "Al-Hujuraat", 'The Inner Apartments', 'Medinan'],
    [4630, 45, 34, 3, 'ق', "Qaaf", 'The letter Qaaf', 'Meccan'],
    [4675, 60, 67, 3, 'الذاريات', "Adh-Dhaariyat", 'The Winnowing Winds', 'Meccan'],
    [4735, 49, 76, 2, 'الطور', "At-Tur", 'The Mount', 'Meccan'],
    [4784, 62, 23, 3, 'النجم', "An-Najm", 'The Star', 'Meccan'],
    [4846, 55, 37, 3, 'القمر', "Al-Qamar", 'The Moon', 'Meccan'],
    [4901, 78, 97, 3, 'الرحمن', "Ar-Rahmaan", 'The Beneficent', 'Medinan'],
    [4979, 96, 46, 3, 'الواقعة', "Al-Waaqia", 'The Inevitable', 'Meccan'],
    [5075, 29, 94, 4, 'الحديد', "Al-Hadid", 'The Iron', 'Medinan'],
    [5104, 22, 105, 3, 'المجادلة', "Al-Mujaadila", 'The Pleading Woman', 'Medinan'],
    [5126, 24, 101, 3, 'الحشر', "Al-Hashr", 'The Exile', 'Medinan'],
    [5150, 13, 91, 2, 'الممتحنة', "Al-Mumtahana", 'She that is to be examined', 'Medinan'],
    [5163, 14, 109, 2, 'الصف', "As-Saff", 'The Ranks', 'Medinan'],
    [5177, 11, 110, 2, 'الجمعة', "Al-Jumu'a", 'Friday', 'Medinan'],
    [5188, 11, 104, 2, 'المنافقون', "Al-Munaafiqoon", 'The Hypocrites', 'Medinan'],
    [5199, 18, 108, 2, 'التغابن', "At-Taghaabun", 'Mutual Disillusion', 'Medinan'],
    [5217, 12, 99, 2, 'الطلاق', "At-Talaaq", 'Divorce', 'Medinan'],
    [5229, 12, 107, 2, 'التحريم', "At-Tahrim", 'The Prohibition', 'Medinan'],
    [5241, 30, 77, 2, 'الملك', "Al-Mulk", 'The Sovereignty', 'Meccan'],
    [5271, 52, 2, 2, 'القلم', "Al-Qalam", 'The Pen', 'Meccan'],
    [5323, 52, 78, 2, 'الحاقة', "Al-Haaqqa", 'The Reality', 'Meccan'],
    [5375, 44, 79, 2, 'المعارج', "Al-Ma'aarij", 'The Ascending Stairways', 'Meccan'],
    [5419, 28, 71, 2, 'نوح', "Nooh", 'Noah', 'Meccan'],
    [5447, 28, 40, 2, 'الجن', "Al-Jinn", 'The Jinn', 'Meccan'],
    [5475, 20, 3, 2, 'المزمل', "Al-Muzzammil", 'The Enshrouded One', 'Meccan'],
    [5495, 56, 4, 2, 'المدثر', "Al-Muddaththir", 'The Cloaked One', 'Meccan'],
    [5551, 40, 31, 2, 'القيامة', "Al-Qiyaama", 'The Resurrection', 'Meccan'],
    [5591, 31, 98, 2, 'الانسان', "Al-Insaan", 'Man', 'Medinan'],
    [5622, 50, 33, 2, 'المرسلات', "Al-Mursalaat", 'The Emissaries', 'Meccan'],
    [5672, 40, 80, 2, 'النبإ', "An-Naba", 'The Announcement', 'Meccan'],
    [5712, 46, 81, 2, 'النازعات', "An-Naazi'aat", 'Those who drag forth', 'Meccan'],
    [5758, 42, 24, 1, 'عبس', "Abasa", 'He frowned', 'Meccan'],
    [5800, 29, 7, 1, 'التكوير', "At-Takwir", 'The Overthrowing', 'Meccan'],
    [5829, 19, 82, 1, 'الإنفطار', "Al-Infitaar", 'The Cleaving', 'Meccan'],
    [5848, 36, 86, 1, 'المطففين', "Al-Mutaffifin", 'Defrauding', 'Meccan'],
    [5884, 25, 83, 1, 'الإنشقاق', "Al-Inshiqaaq", 'The Splitting Open', 'Meccan'],
    [5909, 22, 27, 1, 'البروج', "Al-Burooj", 'The Constellations', 'Meccan'],
    [5931, 17, 36, 1, 'الطارق', "At-Taariq", 'The Morning Star', 'Meccan'],
    [5948, 19, 8, 1, 'الأعلى', "Al-A'laa", 'The Most High', 'Meccan'],
    [5967, 26, 68, 1, 'الغاشية', "Al-Ghaashiya", 'The Overwhelming', 'Meccan'],
    [5993, 30, 10, 1, 'الفجر', "Al-Fajr", 'The Dawn', 'Meccan'],
    [6023, 20, 35, 1, 'البلد', "Al-Balad", 'The City', 'Meccan'],
    [6043, 15, 26, 1, 'الشمس', "Ash-Shams", 'The Sun', 'Meccan'],
    [6058, 21, 9, 1, 'الليل', "Al-Lail", 'The Night', 'Meccan'],
    [6079, 11, 11, 1, 'الضحى', "Ad-Dhuhaa", 'The Morning Hours', 'Meccan'],
    [6090, 8, 12, 1, 'الشرح', "Ash-Sharh", 'The Consolation', 'Meccan'],
    [6098, 8, 28, 1, 'التين', "At-Tin", 'The Fig', 'Meccan'],
    [6106, 19, 1, 1, 'العلق', "Al-Alaq", 'The Clot', 'Meccan'],
    [6125, 5, 25, 1, 'القدر', "Al-Qadr", 'The Power, Fate', 'Meccan'],
    [6130, 8, 100, 1, 'البينة', "Al-Bayyina", 'The Evidence', 'Medinan'],
    [6138, 8, 93, 1, 'الزلزلة', "Az-Zalzala", 'The Earthquake', 'Medinan'],
    [6146, 11, 14, 1, 'العاديات', "Al-Aadiyaat", 'The Chargers', 'Meccan'],
    [6157, 11, 30, 1, 'القارعة', "Al-Qaari'a", 'The Calamity', 'Meccan'],
    [6168, 8, 16, 1, 'التكاثر', "At-Takaathur", 'Competition', 'Meccan'],
    [6176, 3, 13, 1, 'العصر', "Al-Asr", 'The Declining Day, Epoch', 'Meccan'],
    [6179, 9, 32, 1, 'الهمزة', "Al-Humaza", 'The Traducer', 'Meccan'],
    [6188, 5, 19, 1, 'الفيل', "Al-Fil", 'The Elephant', 'Meccan'],
    [6193, 4, 29, 1, 'قريش', "Quraish", 'Quraysh', 'Meccan'],
    [6197, 7, 17, 1, 'الماعون', "Al-Maa'un", 'Almsgiving', 'Meccan'],
    [6204, 3, 15, 1, 'الكوثر', "Al-Kawthar", 'Abundance', 'Meccan'],
    [6207, 6, 18, 1, 'الكافرون', "Al-Kaafiroon", 'The Disbelievers', 'Meccan'],
    [6213, 3, 114, 1, 'النصر', "An-Nasr", 'Divine Support', 'Medinan'],
    [6216, 5, 6, 1, 'المسد', "Al-Masad", 'The Palm Fibre', 'Meccan'],
    [6221, 4, 22, 1, 'الإخلاص', "Al-Ikhlaas", 'Sincerity', 'Meccan'],
    [6225, 5, 20, 1, 'الفلق', "Al-Falaq", 'The Dawn', 'Meccan'],
    [6230, 6, 21, 1, 'الناس', "An-Naas", 'Mankind', 'Meccan']
  ]
};

// Configuration for local cache (if needed for other functionalities, but not for verse fetching directly)
const BACKUP_CONFIG = {
  cacheDir: './quran_cache',
  maxRetries: 3,
  retryDelay: 1000,
  cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours
};

function toArabDigits(num) {
  const arabdigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(digit => arabdigits[digit]).join('');
}

// Ensure cache directory exists (for other potential local uses, not critical for API fetch)
async function ensureCacheDir() {
  try {
    await fs.mkdir(BACKUP_CONFIG.cacheDir, { recursive: true });
  } catch (error) {
    console.warn('Could not create cache directory:', error.message);
  }
}

// Working Quran APIs (more reliable than Google Sheets)
const QURAN_APIS = [
  {
    name: "AlQuran.cloud",
    url: (chapter, verse) => `https://api.alquran.cloud/v1/ayah/${chapter}:${verse}/editions/quran-uthmani,en.asad`,
    parser: (data) => {
      if (data.data && data.data.length >= 2) {
        return {
          arabic: data.data[0].text,
          translation: data.data[1].text
        };
      }
      return null;
    }
  },
  {
    name: "Quran.com",
    url: (chapter, verse) => `https://api.quran.com/api/v4/verses/by_key/${chapter}:${verse}?fields=text_uthmani&translations=131`,
    parser: (data) => {
      if (data.verse) {
        return {
          arabic: data.verse.text_uthmani,
          translation: data.verse.translations && data.verse.translations[0] ? data.verse.translations[0].text : 'Translation not available'
        };
      }
      return null;
    }
  }
];

// Popular reciters with their audio URLs
const RECITERS = {
  "Abdul_Basit_Mujawwad": {
    baseUrl: "https://www.everyayah.com/data/Abdul_Basit_Mujawwad_128kbps",
    name: "Abdul Basit Mujawwad"
  },
  "Mishary_Rashid_Alafasy": {
    baseUrl: "https://www.everyayah.com/data/Mishary_Rashid_Alafasy_128kbps",
    name: "Mishary Rashid Alafasy"
  },
  "Saood_ash-Shuraym": {
    baseUrl: "https://www.everyayah.com/data/Saood_ash-Shuraym_128kbps",
    name: "Saood ash-Shuraym"
  },
  "Abdurrahmaan_As-Sudais": {
    baseUrl: "https://www.everyayah.com/data/Abdurrahmaan_As-Sudais_128kbps",
    name: "Abdurrahmaan As-Sudais"
  },
  "Maher_Al_Muaiqly": {
    baseUrl: "https://www.everyayah.com/data/Maher_Al_Muaiqly_128kbps",
    name: "Maher Al Muaiqly"
  }
};

// Fallback verses for very common verses if APIs fail completely
const FALLBACK_VERSES_DATA = {
  "1:1": {
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful."
  },
  "2:255": {
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۗ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great."
  },
  "112:1": {
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    translation: "Say, 'He is Allah, [who is] One,"
  },
  "112:2": {
    arabic: "اللَّهُ الصَّمَدُ",
    translation: "Allah, the Eternal Refuge."
  },
  "112:3": {
    arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
    translation: "He neither begets nor is born,"
  },
  "112:4": {
    arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    translation: "Nor is there to Him any equivalent.'"
  },
  "36:1": {
    arabic: "يس",
    translation: "Ya, Seen."
  },
  "36:2": {
    arabic: "وَالْقُرْآنِ الْحَكِيمِ",
    translation: "By the wise Qur'an."
  }
};

async function fetchVerseFromAPI(chapter, verse) {
  const verseKey = `${chapter}:${verse}`;

  // Try each API in order with retries
  for (const api of QURAN_APIS) {
    console.log(`🔄 𝐓𝐫𝐲𝐢𝐧𝐠 ${api.name} 𝐀𝐏𝐈 𝐟𝐨𝐫 ${verseKey}...`);
    for (let retry = 0; retry < BACKUP_CONFIG.maxRetries; retry++) {
      try {
        const response = await axios.get(api.url(chapter, verse), {
          timeout: 15000, // Increased timeout for potentially slower APIs
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        const verseData = api.parser(response.data);
        if (verseData && verseData.arabic && verseData.translation) {
          console.log(`✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬 𝐟𝐫𝐨𝐦 ${api.name} 𝐟𝐨𝐫 ${verseKey}`);
          return verseData;
        } else {
          throw new Error('𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐨𝐫 𝐞𝐦𝐩𝐭𝐲 𝐝𝐚𝐭𝐚 𝐫𝐞𝐜𝐞𝐢𝐯𝐞𝐝 𝐟𝐫𝐨𝐦 𝐀𝐏𝐈');
        }
      } catch (error) {
        console.warn(`❌ ${api.name} 𝐟𝐚𝐢𝐥𝐞𝐝 (𝐚𝐭𝐭𝐞𝐦𝐩𝐭 ${retry + 1}): ${error.message}`);
        if (retry < BACKUP_CONFIG.maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, BACKUP_CONFIG.retryDelay));
        }
      }
    }
  }

  // If all APIs fail after retries, use hardcoded fallback data
  if (FALLBACK_VERSES_DATA[verseKey]) {
    console.log(`📦 𝐔𝐬𝐢𝐧𝐠 𝐡𝐚𝐫𝐝𝐜𝐨𝐝𝐞𝐝 𝐟𝐚𝐥𝐥𝐛𝐚𝐜𝐤 𝐝𝐚𝐭𝐚 𝐟𝐨𝐫 ${verseKey}`);
    return FALLBACK_VERSES_DATA[verseKey];
  }

  // Final generic fallback
  console.log(`⚠️ 𝐆𝐞𝐧𝐞𝐫𝐢𝐜 𝐟𝐚𝐥𝐥𝐛𝐚𝐜𝐤 𝐟𝐨𝐫 ${verseKey}`);
  return {
    arabic: `[𝐀𝐫𝐚𝐛𝐢𝐜 𝐭𝐞𝐱𝐭 𝐮𝐧𝐚𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐟𝐨𝐫 ${verseKey}]`,
    translation: `[𝐓𝐫𝐚𝐧𝐬𝐥𝐚𝐭𝐢𝐨𝐧 𝐮𝐧𝐚𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐟𝐨𝐫 ${verseKey}]`
  };
}

function getRandomReciter() {
  const reciterNames = Object.keys(RECITERS);
  const randomIndex = Math.floor(Math.random() * reciterNames.length);
  return reciterNames[randomIndex];
}

function generateAudioUrl(chapter, verse, reciter = null) {
  const selectedReciterKey = reciter || getRandomReciter();
  const reciterData = RECITERS[selectedReciterKey];
  if (!reciterData) {
      console.warn(`Reciter ${selectedReciterKey} not found, defaulting to Abdul Basit Mujawwad.`);
      const defaultReciterKey = "Abdul_Basit_Mujawwad";
      const defaultReciterData = RECITERS[defaultReciterKey];
      const leadZero = (num, digits) => num.toString().padStart(digits, '0');
      return {
          url: `${defaultReciterData.baseUrl}/${leadZero(chapter, 3)}${leadZero(verse, 3)}.mp3`,
          reciter: defaultReciterData.name,
          reciterKey: defaultReciterKey
      };
  }

  const leadZero = (num, digits) => num.toString().padStart(digits, '0');

  return {
    url: `${reciterData.baseUrl}/${leadZero(chapter, 3)}${leadZero(verse, 3)}.mp3`,
    reciter: reciterData.name,
    reciterKey: selectedReciterKey
  };
}

function getRandomSurahAndVerse() {
  // Exclude the first empty element
  const validSurahs = QuranData.Sura.slice(1);
  const randomSurahIndex = Math.floor(Math.random() * validSurahs.length) + 1; // +1 to map back to 1-based index
  const surahData = QuranData.Sura[randomSurahIndex];
  const maxVerse = surahData[1];
  const randomVerse = Math.floor(Math.random() * maxVerse) + 1;

  return {
    chapter: randomSurahIndex,
    verse: randomVerse,
    surahName: surahData[4],
    surahEnglish: surahData[6]
  };
}

async function sendAudioVerse(api, threadID, chapter, verse, reciter = null, messageID) {
  try {
    const audioInfo = generateAudioUrl(chapter, verse, reciter);
    const verseData = await fetchVerseFromAPI(chapter, verse);

    // Check if global.utils.getStreamFromURL exists
    if (!global.utils || typeof global.utils.getStreamFromURL !== 'function') {
        console.error("global.utils.getStreamFromURL is not available. Cannot send audio.");
        return api.sendMessage("❌ 𝐀𝐮𝐝𝐢𝐨 𝐟𝐮𝐧𝐜𝐭𝐢𝐨𝐧𝐚𝐥𝐢𝐭𝐲 𝐢𝐬 𝐜𝐮𝐫𝐫𝐞𝐧𝐭𝐥𝐲 𝐮𝐧𝐚𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 (𝐦𝐢𝐬𝐬𝐢𝐧𝐠 𝐠𝐥𝐨𝐛𝐚𝐥.𝐮𝐭𝐢𝐥𝐬.𝐠𝐞𝐭𝐒𝐭𝐫𝐞𝐚𝐦𝐅𝐫𝐨𝐦𝐔𝐑𝐋).", threadID, messageID);
    }

    const message = {
      body: `🎧 𝐑𝐚𝐧𝐝𝐨𝐦 𝐐𝐮𝐫𝐚𝐧 𝐑𝐞𝐜𝐢𝐭𝐚𝐭𝐢𝐨𝐧\n\n📖 𝐒𝐮𝐫𝐚𝐡: ${QuranData.Sura[chapter][4]} (${QuranData.Sura[chapter][6]})\n🔸 𝐕𝐞𝐫𝐬𝐞: ${chapter}:${verse}\n🎙️ 𝐑𝐞𝐜𝐢𝐭𝐞𝐫: ${audioInfo.reciter}\n\n${verseData.arabic}\n﴿${toArabDigits(verse)}﴾\n\n📝 ${verseData.translation}\n\n𝐔𝐬𝐞 "${global.config.prefix}surah random" 𝐟𝐨𝐫 𝐚𝐧𝐨𝐭𝐡𝐞𝐫 𝐫𝐚𝐧𝐝𝐨𝐦 𝐫𝐞𝐜𝐢𝐭𝐚𝐭𝐢𝐨𝐧!`,
      attachment: await global.utils.getStreamFromURL(audioInfo.url)
    };

    await api.sendMessage(message, threadID, messageID);
    console.log(`✅ 𝐒𝐞𝐧𝐭 𝐚𝐮𝐝𝐢𝐨 𝐟𝐨𝐫 ${chapter}:${verse} 𝐛𝐲 ${audioInfo.reciter}`);

  } catch (error) {
    console.error(`❌ 𝐄𝐫𝐫𝐨𝐫 𝐬𝐞𝐧𝐝𝐢𝐧𝐠 𝐚𝐮𝐝𝐢𝐨 𝐟𝐨𝐫 ${chapter}:${verse}:`, error);
    await api.sendMessage(`❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐬𝐞𝐧𝐝 𝐚𝐮𝐝𝐢𝐨 𝐟𝐨𝐫 𝐒𝐮𝐫𝐚𝐡 ${chapter}, 𝐕𝐞𝐫𝐬𝐞 ${verse}. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.`, threadID, messageID);
  }
}

// Function to handle cache clearing and stats if needed, though less critical with direct API fetch
async function clearCache() {
    try {
        await ensureCacheDir(); // Ensure directory exists before reading
        const files = await fs.readdir(BACKUP_CONFIG.cacheDir);
        for (const file of files) {
            if (file.endsWith('.json')) {
                await fs.unlink(path.join(BACKUP_CONFIG.cacheDir, file));
            }
        }
        console.log('Cache cleared successfully');
    } catch (error) {
        // If directory doesn't exist, readdir will throw. This is fine.
        if (error.code !== 'ENOENT') {
            console.warn('Failed to clear cache:', error.message);
        } else {
            console.log('Cache directory did not exist, no cache to clear.');
        }
    }
}

async function getCacheStats() {
    try {
        await ensureCacheDir(); // Ensure directory exists before reading
        const files = await fs.readdir(BACKUP_CONFIG.cacheDir);
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        let totalSize = 0;
        let validFiles = 0;
        let expiredFiles = 0;

        for (const file of jsonFiles) {
            const filePath = path.join(BACKUP_CONFIG.cacheDir, file);
            const stats = await fs.stat(filePath);
            totalSize += stats.size;

            try {
                const content = await fs.readFile(filePath, 'utf8');
                const data = JSON.parse(content);

                if (data.timestamp && Date.now() - data.timestamp < BACKUP_CONFIG.cacheExpiry) {
                    validFiles++;
                } else {
                    expiredFiles++;
                }
            } catch (error) {
                // Invalid cache file, ignore or log for debugging
                console.warn(`Could not parse cache file ${file}:`, error.message);
            }
        }

        return {
            totalFiles: jsonFiles.length,
            validFiles,
            expiredFiles,
            totalSize: (totalSize / (1024 * 1024)).toFixed(2) + ' MB' // Convert to MB
        };
    } catch (error) {
        if (error.code === 'ENOENT') {
            return { totalFiles: 0, validFiles: 0, expiredFiles: 0, totalSize: '0.00 MB' };
        }
        return { error: error.message, totalFiles: 0, validFiles: 0, expiredFiles: 0, totalSize: '0.00 MB' };
    }
}

module.exports = {
  config: {
    name: "surah",
    aliases: [],
    version: "4.0",
    author: "Asif",
    category: "Islamic",
    shortDescription: {
      en: "𝐆𝐞𝐭 𝐐𝐮𝐫𝐚𝐧 𝐯𝐞𝐫𝐬𝐞𝐬 𝐚𝐧𝐝 𝐫𝐚𝐧𝐝𝐨𝐦 𝐫𝐞𝐜𝐢𝐭𝐚𝐭𝐢𝐨𝐧𝐬"
    },
    longDescription: {
      en: "𝐅𝐞𝐭𝐜𝐡 𝐐𝐮𝐫𝐚𝐧 𝐯𝐞𝐫𝐬𝐞𝐬 𝐰𝐢𝐭𝐡 𝐭𝐫𝐚𝐧𝐬𝐥𝐚𝐭𝐢𝐨𝐧 𝐚𝐧𝐝 𝐬𝐞𝐧𝐝 𝐫𝐚𝐧𝐝𝐨𝐦 𝐫𝐞𝐜𝐢𝐭𝐚𝐭𝐢𝐨𝐧 𝐚𝐮𝐝𝐢𝐨𝐬 𝐮𝐬𝐢𝐧𝐠 𝐫𝐨𝐛𝐮𝐬𝐭 𝐛𝐚𝐜𝐤𝐮𝐩 𝐬𝐲𝐬𝐭𝐞𝐦𝐬."
    },
    guide: {
      en: `𝐔𝐬𝐚𝐠𝐞:
• {p}surah <chapter> <verse> [count] - 𝐆𝐞𝐭 𝐯𝐞𝐫𝐬𝐞𝐬
• {p}surah random - 𝐑𝐚𝐧𝐝𝐨𝐦 𝐫𝐞𝐜𝐢𝐭𝐚𝐭𝐢𝐨𝐧 𝐚𝐮𝐝𝐢𝐨
• {p}surah audio <chapter> <verse> [reciter] - 𝐒𝐩𝐞𝐜𝐢𝐟𝐢𝐜 𝐯𝐞𝐫𝐬𝐞 𝐚𝐮𝐝𝐢𝐨 (𝐎𝐩𝐭𝐢𝐨𝐧𝐚𝐥 𝐫𝐞𝐜𝐢𝐭𝐞𝐫: 𝐀𝐛𝐝𝐮𝐥_𝐁𝐚𝐬𝐢𝐭_𝐌𝐮𝐣𝐚𝐰𝐰𝐚𝐝, 𝐌𝐢𝐬𝐡𝐚𝐫𝐲_𝐑𝐚𝐬𝐡𝐢𝐝_𝐀𝐥𝐚𝐟𝐚𝐬𝐲, 𝐒𝐚𝐨𝐨𝐝_𝐚𝐬𝐡-𝐒𝐡𝐮𝐫𝐚𝐲𝐦, 𝐀𝐛𝐝𝐮𝐫𝐫𝐚𝐡𝐦𝐚𝐚𝐧_𝐀𝐬-𝐒𝐮𝐝𝐚𝐢𝐬, 𝐌𝐚𝐡𝐞𝐫_𝐀𝐥_𝐌𝐮𝐚𝐢𝐪𝐥𝐲)
• {p}surah cache-stats - 𝐆𝐞𝐭 𝐜𝐚𝐜𝐡𝐞 𝐬𝐭𝐚𝐭𝐢𝐬𝐭𝐢𝐜𝐬
• {p}surah clear-cache - 𝐂𝐥𝐞𝐚𝐫 𝐭𝐡𝐞 𝐜𝐚𝐜𝐡𝐞

𝐄𝐱𝐚𝐦𝐩𝐥𝐞𝐬:
• {p}surah 1 1
• {p}surah random
• {p}surah audio 2 255
• {p}surah audio 1 1 Mishary_Rashid_Alafasy
• {p}surah 112 1 4`
    },
    dependencies: {
      "axios": ""
    },
    countDown: 5,
    role: 0
  },

  onStart: async function ({ api, event, args, global, prefix }) {
    try {
      const { threadID, messageID } = event;

      // Handle cache management commands
      if (args[0] === 'cache-stats') {
        const stats = await getCacheStats();
        const message = stats.error
          ? `❌ 𝐄𝐫𝐫𝐨𝐫 𝐠𝐞𝐭𝐭𝐢𝐧𝐠 𝐜𝐚𝐜𝐡𝐞 𝐬𝐭𝐚𝐭𝐬: ${stats.error}`
          : `📊 𝐂𝐚𝐜𝐡𝐞 𝐒𝐭𝐚𝐭𝐢𝐬𝐭𝐢𝐜𝐬:\n` +
            `• 𝐓𝐨𝐭𝐚𝐥 𝐟𝐢𝐥𝐞𝐬: ${stats.totalFiles}\n` +
            `• 𝐕𝐚𝐥𝐢𝐝 𝐟𝐢𝐥𝐞𝐬: ${stats.validFiles}\n` +
            `• 𝐄𝐱𝐩𝐢𝐫𝐞𝐝 𝐟𝐢𝐥𝐞𝐬: ${stats.expiredFiles}\n` +
            `• 𝐓𝐨𝐭𝐚𝐥 𝐬𝐢𝐳𝐞: ${stats.totalSize}`;
        return api.sendMessage(message, threadID, messageID);
      }

      if (args[0] === 'clear-cache') {
        await clearCache();
        return api.sendMessage("🗑️ 𝐂𝐚𝐜𝐡𝐞 𝐜𝐥𝐞𝐚𝐫𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!", threadID, messageID);
      }

      // Handle random audio command
      if (args[0] === 'random') {
        await api.sendMessage("🎧 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐚 𝐫𝐚𝐧𝐝𝐨𝐦 𝐐𝐮𝐫𝐚𝐧 𝐫𝐞𝐜𝐢𝐭𝐚𝐭𝐢𝐨𝐧...", threadID, messageID);
        const randomSelection = getRandomSurahAndVerse();
        await sendAudioVerse(api, threadID, randomSelection.chapter, randomSelection.verse, null, messageID);
        return;
      }

      // Handle specific audio command
      if (args[0] === 'audio') {
        const chapter = parseInt(args[1]);
        const verse = parseInt(args[2]);
        const reciter = args[3]; // Optional reciter key

        if (isNaN(chapter) || chapter < 1 || chapter > 114) {
          return api.sendMessage("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐜𝐡𝐚𝐩𝐭𝐞𝐫. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐬𝐩𝐞𝐜𝐢𝐟𝐲 𝐚 𝐜𝐡𝐚𝐩𝐭𝐞𝐫 𝐛𝐞𝐭𝐰𝐞𝐞𝐧 𝟏-𝟏𝟏𝟒.", threadID, messageID);
        }

        const maxVerse = QuranData.Sura[chapter][1];
        if (isNaN(verse) || verse < 1 || verse > maxVerse) {
          return api.sendMessage(`❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐯𝐞𝐫𝐬𝐞. 𝐂𝐡𝐚𝐩𝐭𝐞𝐫 ${chapter} 𝐡𝐚𝐬 ${maxVerse} 𝐯𝐞𝐫𝐬𝐞𝐬.`, threadID, messageID);
        }

        await api.sendMessage(`🎧 𝐅𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐚𝐮𝐝𝐢𝐨 𝐟𝐨𝐫 𝐒𝐮𝐫𝐚𝐡 ${chapter}, 𝐕𝐞𝐫𝐬𝐞 ${verse}...`, threadID, messageID);
        await sendAudioVerse(api, threadID, chapter, verse, reciter, messageID);
        return;
      }

      // Handle normal verse fetching
      let chapter = parseInt(args[0]);
      let verse = parseInt(args[1]);
      let count = parseInt(args[2]) || 1;

      // Validate chapter
      if (isNaN(chapter) || chapter < 1 || chapter > 114) {
        // If no valid chapter is provided, show the help guide
        const helpMessage = `📖 𝐐𝐮𝐫𝐚𝐧 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐇𝐞𝐥𝐩:\n\n` +
          `• 𝐆𝐞𝐭 𝐯𝐞𝐫𝐬𝐞𝐬: ${prefix}surah <chapter> <verse> [count]\n` +
          `  𝐄𝐱: ${prefix}surah 1 1\n\n` +
          `• 𝐑𝐚𝐧𝐝𝐨𝐦 𝐫𝐞𝐜𝐢𝐭𝐚𝐭𝐢𝐨𝐧: ${prefix}surah random\n\n` +
          `• 𝐒𝐩𝐞𝐜𝐢𝐟𝐢𝐜 𝐚𝐮𝐝𝐢𝐨: ${prefix}surah audio <chapter> <verse> [reciter]\n` +
          `  𝐄𝐱: ${prefix}surah audio 2 255\n` +
          `  𝐎𝐩𝐭𝐢𝐨𝐧𝐚𝐥 𝐫𝐞𝐜𝐢𝐭𝐞𝐫𝐬: ${Object.keys(RECITERS).join(', ')}\n\n` +
          `• 𝐏𝐨𝐩𝐮𝐥𝐚𝐫 𝐯𝐞𝐫𝐬𝐞𝐬:\n` +
          `  ${prefix}surah 1 1 7    - 𝐒𝐮𝐫𝐚𝐡 𝐀𝐥-𝐅𝐚𝐭𝐢𝐡𝐚\n` +
          `  ${prefix}surah 2 255    - 𝐀𝐲𝐚𝐭𝐮𝐥 𝐊𝐮𝐫𝐬𝐢\n` +
          `  ${prefix}surah 36 1 3   - 𝐒𝐮𝐫𝐚𝐡 𝐘𝐚𝐬𝐞𝐧\n` +
          `  ${prefix}surah 112 1 4  - 𝐒𝐮𝐫𝐚𝐡 𝐀𝐥-𝐈𝐤𝐡𝐥𝐚𝐬`;

        return api.sendMessage(helpMessage, threadID, messageID);
      }

      // Validate verse
      const maxVerse = QuranData.Sura[chapter][1];
      if (isNaN(verse) || verse < 1 || verse > maxVerse) {
        return api.sendMessage(`❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐯𝐞𝐫𝐬𝐞. 𝐂𝐡𝐚𝐩𝐭𝐞𝐫 ${chapter} 𝐡𝐚𝐬 ${maxVerse} 𝐯𝐞𝐫𝐬𝐞𝐬.`, threadID, messageID);
      }

      // Validate count
      if (count < 1 || (verse + count - 1) > maxVerse) {
        return api.sendMessage(`❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐜𝐨𝐮𝐧𝐭. 𝐌𝐚𝐱𝐢𝐦𝐮𝐦 ${maxVerse - verse + 1} 𝐯𝐞𝐫𝐬𝐞𝐬 𝐚𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐟𝐫𝐨𝐦 𝐯𝐞𝐫𝐬𝐞 ${verse}.`, threadID, messageID);
      }

      // Show loading message for multiple verses
      if (count > 3) {
        api.sendMessage("🔄 𝐅𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐯𝐞𝐫𝐬𝐞𝐬... 𝐓𝐡𝐢𝐬 𝐦𝐚𝐲 𝐭𝐚𝐤𝐞 𝐚 𝐦𝐨𝐦𝐞𝐧𝐭.", threadID, messageID);
      }

      // Fetch and display verses
      const surahName = QuranData.Sura[chapter][4];
      const surahEnglish = QuranData.Sura[chapter][6];

      let output = `📖 𝐒𝐮𝐫𝐚𝐡 ${surahName} (${surahEnglish})\n`;
      output += `🔸 𝐂𝐡𝐚𝐩𝐭𝐞𝐫: ${chapter}\n`;
      output += `🔸 𝐕𝐞𝐫𝐬𝐞: ${verse}`;
      if (count > 1) {
        output += `-${verse + count - 1}`;
      }
      output += `\n\n`;

      // Fetch each verse
      for (let i = 0; i < count; i++) {
        const currentVerse = verse + i;
        const verseData = await fetchVerseFromAPI(chapter, currentVerse);

        output += `✨ 𝐕𝐞𝐫𝐬𝐞 ${currentVerse}:\n`;
        output += `${verseData.arabic}\n`;
        output += `﴿${toArabDigits(currentVerse)}﴾\n\n`;
        output += `📝 ${verseData.translation}\n\n`;
      }

      api.sendMessage(output, threadID, messageID);

    } catch (error) {
      console.error("❌ 𝐐𝐮𝐫𝐚𝐧 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐞𝐫𝐫𝐨𝐫:", error);
      api.sendMessage("❌ 𝐀𝐧 𝐮𝐧𝐞𝐱𝐩𝐞𝐜𝐭𝐞𝐝 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐫𝐞𝐪𝐮𝐞𝐬𝐭. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.", threadID, messageID);
    }
  }
};
