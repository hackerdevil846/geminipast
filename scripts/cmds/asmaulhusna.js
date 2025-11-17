const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "asmaulhusna",
    aliases: ["allahnam", "99name"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "religion",
    shortDescription: {
      en: "🕌 𝐴𝑠𝑚𝑎𝑢𝑙 𝐻𝑢𝑠𝑛𝑎 - 𝐴𝑙𝑙𝑎ℎ'𝑠 99 𝑁𝑎𝑚𝑒𝑠 (𝐵𝑎𝑛𝑔𝑙𝑎)"
    },
    longDescription: {
      en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦 𝐴𝑙𝑙𝑎ℎ'𝑠 99 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑛𝑎𝑚𝑒𝑠 𝑤𝑖𝑡ℎ 𝐵𝑎𝑛𝑔𝑙𝑎 𝑡𝑟𝑎𝑛𝑠𝑙𝑎𝑡𝑖𝑜𝑛𝑠"
    },
    guide: {
      en: "{p}asmaulhusna [𝑛𝑢𝑚𝑏𝑒𝑟]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const jsonPath = path.join(__dirname, 'data', 'islamic', 'AsmaulHusna.json');
      
      // Read and parse the JSON file
      const jsonData = await fs.readJson(jsonPath);
      const asmaulHusna = jsonData.result;

      const input = args[0];
      
      if (!input) {
        // Show random name if no input
        const randomName = asmaulHusna[Math.floor(Math.random() * asmaulHusna.length)];
        const banglaTranslation = await translateToBangla(randomName.translate_en);
        
        return message.reply(
          `🕌 𝐴𝑠𝑚𝑎𝑢𝑙 𝐻𝑢𝑠𝑛𝑎 #${randomName.number}\n\n` +
          `𝐴𝑟𝑎𝑏𝑖𝑐: ${randomName.arab}\n` +
          `𝐿𝑎𝑡𝑖𝑛: ${randomName.latin}\n` +
          `𝐵𝑎𝑛𝑔𝑙𝑎: ${banglaTranslation}\n` +
          `𝐸𝑛𝑔𝑙𝑖𝑠ℎ: ${randomName.translate_en}`
        );
      }

      if (input.toLowerCase() === "all") {
        let allNames = "🕌 𝐴𝑙𝑙𝑎ℎ'𝑠 99 𝑁𝑎𝑚𝑒𝑠 (𝐴𝑠𝑚𝑎𝑢𝑙 𝐻𝑢𝑠𝑛𝑎):\n\n";
        
        for (const name of asmaulHusna) {
          const banglaTranslation = await translateToBangla(name.translate_en);
          allNames += `${name.number}. ${name.latin} - ${banglaTranslation}\n`;
        }
        
        return message.reply(allNames);
      }

      const number = parseInt(input);
      if (isNaN(number) || number < 1 || number > 99) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑛𝑢𝑚𝑏𝑒𝑟 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 1 𝑎𝑛𝑑 99, 𝑜𝑟 '𝑎𝑙𝑙' 𝑓𝑜𝑟 𝑓𝑢𝑙𝑙 𝑙𝑖𝑠𝑡.");
      }

      const name = asmaulHusna.find(n => n.number === number.toString());
      if (!name) {
        return message.reply("❌ 𝑁𝑎𝑚𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑛𝑢𝑚𝑏𝑒𝑟 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 1 𝑎𝑛𝑑 99.");
      }

      const banglaTranslation = await translateToBangla(name.translate_en);

      await message.reply(
        `🕌 𝐴𝑠𝑚𝑎𝑢𝑙 𝐻𝑢𝑠𝑛𝑎 #${name.number}\n\n` +
        `𝐴𝑟𝑎𝑏𝑖𝑐: ${name.arab}\n` +
        `𝐿𝑎𝑡𝑖𝑛: ${name.latin}\n` +
        `𝐵𝑎𝑛𝑔𝑙𝑎: ${banglaTranslation}\n` +
        `𝐸𝑛𝑔𝑙𝑖𝑠ℎ: ${name.translate_en}`
      );

    } catch (err) {
      console.error("Asmaul Husna command error:", err);
      message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑡ℎ𝑒 𝑛𝑎𝑚𝑒𝑠.");
    }
  }
};

async function translateToBangla(text) {
  try {
    // Simple English to Bangla translation mapping
    const translationMap = {
      "The All Beneficent": "পরম দয়ালু",
      "The Most Merciful": "অতি দয়ালু",
      "The King": "রাজা",
      "The Sovereign": "প্রভু",
      "The Most Holy": "পরম পবিত্র",
      "Peace and Blessing": "শান্তি ও আশীর্বাদ",
      "The Guarantor": "নিশ্চয়তাদানকারী",
      "The Guardian": "রক্ষক",
      "The Preserver": "সংরক্ষক",
      "The Almighty": "পরাক্রমশালী",
      "The Self Sufficient": "স্বয়ংসম্পূর্ণ",
      "The Powerful": "শক্তিশালী",
      "The Irresistible": "অপ্রতিরোধ্য",
      "The Tremendous": "মহান",
      "The Creator": "সৃষ্টিকর্তা",
      "The Maker": "নির্মাতা",
      "The Fashioner of Forms": "আকৃতি দানকারী",
      "The Ever Forgiving": "চিরক্ষমাশীল",
      "The All Compelling Subduer": "পরাক্রমশালী দমনকারী",
      "The Bestower": "দাতা",
      "The Ever Providing": "চিরপ্রদানকারী",
      "The Opener": "উন্মোচক",
      "The Victory Giver": "বিজয়দানকারী",
      "The All Knowing": "সর্বজ্ঞ",
      "The Omniscient": "সর্বজ্ঞানী",
      "The Restrainer": "সংযতকারী",
      "The Straightener": "সরলকারী",
      "The Expander": "প্রসারক",
      "The Munificent": "উদার",
      "The Abaser": "অপমানকারী",
      "The Exalter": "মর্যাদাদানকারী",
      "The Giver of Honor": "সম্মানদানকারী",
      "The Giver of Dishonor": "অসম্মানদানকারী",
      "The All Hearing": "সর্বশ্রোতা",
      "The All Seeing": "সর্বদ্রষ্টা",
      "The Judge": "বিচারক",
      "The Arbitrator": "মীমাংসাকারী",
      "The Utterly Just": "পরম ন্যায়বান",
      "The Subtly Kind": "সূক্ষ্ম দয়ালু",
      "The All Aware": "সবকিছু জানেন",
      "The Forbearing": "ধৈর্যশীল",
      "The Indulgent": "ক্ষমাশীল",
      "The Magnificent": "মহিমান্বিত",
      "The Infinite": "অসীম",
      "The All Forgiving": "ক্ষমাশীল",
      "The Grateful": "কৃতজ্ঞ",
      "The Sublimely Exalted": "মহান",
      "The Great": "মহান",
      "The Preserver": "সংরক্ষক",
      "The Nourisher": "পোষণকারী",
      "The Reckoner": "হিসাব নেওয়ার者",
      "The Majestic": "মহিমান্বিত",
      "The Bountiful": "উদার",
      "The Generous": "মহানুভব",
      "The Watchful": "সতর্ক",
      "The Responsive": "সাড়াদানকারী",
      "The Answerer": "উত্তরদানকারী",
      "The Vast": "বিশাল",
      "The All Encompassing": "সর্বব্যাপী",
      "The Wise": "প্রজ্ঞাময়",
      "The Loving": "ভালবাসা",
      "The Kind One": "দয়ালু",
      "The All Glorious": "মহিমান্বিত",
      "The Raiser of the Dead": "মৃতকে জীবিতকারী",
      "The Witness": "সাক্ষী",
      "The Truth": "সত্য",
      "The Real": "বাস্তব",
      "The Trustee": "বিশ্বাসভাজন",
      "The Dependable": "নির্ভরযোগ্য",
      "The Strong": "শক্তিশালী",
      "The Firm": "দৃঢ়",
      "The Steadfast": "অটল",
      "The Protecting Friend": "রক্ষাকারী বন্ধু",
      "Patron": "পৃষ্ঠপোষক",
      "Helper": "সাহায্যকারী",
      "The All Praiseworthy": "সব প্রশংসার যোগ্য",
      "The Accounter": "হিসাব নেওয়ার者",
      "The Numberer of All": "সবকিছু গণনাকারী",
      "The Producer": "উৎপাদক",
      "Originator": "উদ্ভাবক",
      "Initiator of all": "সবকিছুর সূচনাকারী",
      "The Reinstater": "পুনঃস্থাপনকারী",
      "The Giver of Life": "জীবনদানকারী",
      "The Bringer of Death": "মৃত্যুদানকারী",
      "The Destroyer": "ধ্বংসকারী",
      "The Ever Living": "চিরঞ্জীব",
      "The Self Subsisting": "স্বয়ংসম্পূর্ণ",
      "Sustainer of All": "সবকিছুর পালনকর্তা",
      "The Perceiver": "অনুভবকারী",
      "The Finder": "খোঁজকারী",
      "The Unfailing": "অবিচল",
      "The Illustrious": "মহিমান্বিত",
      "The One": "এক",
      "The Unique": "অদ্বিতীয়",
      "Manifestation of Unity": "একত্বের প্রকাশ",
      "The All Inclusive": "সবকিছু অন্তর্ভুক্ত",
      "The Indivisible": "অবিভাজ্য",
      "The Self Sufficient": "স্বয়ংসম্পূর্ণ",
      "The Impregnable": "অভেদ্য",
      "The Eternally Besought of All": "সবের চিরকাঙ্ক্ষিত",
      "The Everlasting": "চিরস্থায়ী",
      "The All Able": "সবকিছু করতে সক্ষম",
      "The All Determiner": "নির্ধারক",
      "The Dominant": "প্রভাবশালী",
      "The Expediter": "ত্বরান্বিতকারী",
      "The Delayer": "বিলম্বকারী",
      "The First": "প্রথম",
      "The Last": "শেষ",
      "The Manifest": "প্রকাশ্য",
      "The All Victorious": "সবজয়ী",
      "The Hidden": "গুপ্ত",
      "The Patron": "পৃষ্ঠপোষক",
      "The Self Exalted": "স্বয়ং মহিমান্বিত",
      "The Most Kind": "অতি দয়ালু",
      "The Righteous": "ধার্মিক",
      "The Ever Returning": "চিরফিরে আসা",
      "Ever Relenting": "ক্ষমাশীল",
      "The Avenger": "প্রতিশোধ গ্রহণকারী",
      "The Pardoner": "ক্ষমাকারী",
      "The Effacer of Sins": "পাপ মুছনেওয়ালা",
      "The Compassionate": "দয়ালু",
      "The All Pitying": "করুণাময়",
      "The Owner of All Sovereignty": "সার্বভৌমত্বের মালিক",
      "The Lord of Majesty": "মহিমার প্রভু",
      "Generosity": "উদারতা",
      "The Equitable": "ন্যায়পরায়ণ",
      "The Requiter": "প্রতিদানদাতা",
      "The Gatherer": "একত্রকারী",
      "The Unifier": "একতাবদ্ধকারী",
      "The All Rich": "ধনী",
      "The Independent": "স্বাধীন",
      "The Enricher": "সমৃদ্ধকারী",
      "The Emancipator": "মুক্তিদানকারী",
      "The Withholder": "সংযতকারী",
      "The Shielder": "রক্ষাকারী",
      "The Defender": "প্রতিরক্ষাকারী",
      "The Distressor": "কষ্টদানকারী",
      "The Harmer": "ক্ষতিসাধনকারী",
      "The Propitious": "অনুকূল",
      "The Benefactor": "উপকারকারী",
      "The Light": "আলো",
      "The Guide": "পথপ্রদর্শক",
      "Incomparable": "অতুলনীয়",
      "The Originator": "উদ্ভাবক",
      "The Ever Enduring": "চিরস্থায়ী",
      "Immutable": "অপরিবর্তনীয়",
      "The Heir": "উত্তরাধিকারী",
      "The Inheritor of All": "সবকিছুর উত্তরাধিকারী",
      "Infallible Teacher": "অভ্রান্ত শিক্ষক",
      "Knower": "জ্ঞানী",
      "The Patient": "ধৈর্যশীল"
    };

    return translationMap[text] || text;
    
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Return original text if translation fails
  }
}
