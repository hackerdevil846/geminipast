const axios = require("axios");

module.exports = {
  config: {
    name: "anireact",
    aliases: [],
    version: "1.0.0",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "𝖠𝗇𝗂𝗆𝖾 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇𝗌 𝗐𝗂𝗍𝗁 𝖾𝗆𝗈𝗃𝗂"
    },
    longDescription: {
      en: "𝖲𝖾𝗇𝖽𝗌 𝖺𝗇𝗂𝗆𝖾 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇𝗌 𝖻𝖺𝗌𝖾𝖽 𝗈𝗇 𝖾𝗆𝗈𝗃𝗂"
    },
    guide: {
      en: "𝖲𝗂𝗆𝗉𝗅𝗒 𝗌𝖾𝗇𝖽 𝖺𝗇 𝖾𝗆𝗈𝗃𝗂 𝗂𝗇 𝗍𝗁𝖾 𝖼𝗁𝖺𝗍"
    },
    dependencies: {
      "axios": ""
    }
  },

  onChat: async function({ message, event }) {
    try {
      // Dependency check
      try {
        require("axios");
      } catch (e) {
        return; // Silent fail to avoid spam
      }

      const emojiReactions = {
        "😄": { apis: ["https://nekos.best/api/v2/happy", "https://api.waifu.pics/sfw/happy"], description: "𝗁𝖺𝗉𝗉𝗒" },
        "💃": { apis: ["https://nekos.best/api/v2/dance", "https://api.waifu.pics/sfw/dance"], description: "𝖽𝖺𝗇𝖼𝖾" },
        "😘": { apis: ["https://api.otakugifs.xyz/gif?reaction=kiss", "https://nekos.best/api/v2/kiss", "https://api.waifu.pics/sfw/kiss"], description: "𝗄𝗂𝗌𝗌" },
        "😢": { apis: ["https://nekos.best/api/v2/cry", "https://api.waifu.pics/sfw/cry"], description: "𝖼𝗋𝗒" },
        "😬": { apis: ["https://nekos.best/api/v2/bite", "https://api.waifu.pics/sfw/bite"], description: "𝖻𝗂𝗍𝖾" },
        "😊": { apis: ["https://nekos.best/api/v2/blush", "https://api.waifu.pics/sfw/blush"], description: "𝖻𝗅𝗎𝗌𝗁" },
        "🤗": { apis: ["https://nekos.best/api/v2/cuddle", "https://api.waifu.pics/sfw/cuddle"], description: "𝖼𝗎𝖽𝖽𝗅𝖾" },
        "🤦": { apis: ["https://nekos.best/api/v2/facepalm"], description: "𝖿𝖺𝖼𝖾𝗉𝖺𝗅𝗆" },
        "🧑‍🤝‍🧑": { apis: ["https://nekos.best/api/v2/handhold", "https://api.waifu.pics/sfw/handhold"], description: "𝗁𝖺𝗇𝖽𝗁𝗈𝗅𝖽" },
        "🫂": { apis: ["https://nekos.best/api/v2/hug", "https://api.waifu.pics/sfw/hug"], description: "𝗁𝗎𝗀" },
        "😂": { apis: ["https://nekos.best/api/v2/laugh"], description: "𝗅𝖺𝗎𝗀𝗁" },
        "🍖": { apis: ["https://nekos.best/api/v2/nom", "https://api.waifu.pics/sfw/nom"], description: "𝗇𝗈𝗆" },
        "👋": { apis: ["https://nekos.best/api/v2/pat", "https://api.waifu.pics/sfw/pat"], description: "𝗉𝖺𝗍" },
        "👉": { apis: ["https://nekos.best/api/v2/poke", "https://api.waifu.pics/sfw/poke"], description: "𝗉𝗈𝗄𝖾" },
        "😤": { apis: ["https://nekos.best/api/v2/pout"], description: "𝗉𝗈𝗎𝗍" },
        "👊": { apis: ["https://nekos.best/api/v2/punch"], description: "𝗉𝗎𝗇𝖼𝗁" },
        "🏃": { apis: ["https://nekos.best/api/v2/run"], description: "𝗋𝗎𝗇" },
        "🤷": { apis: ["https://nekos.best/api/v2/shrug"], description: "𝗌𝗁𝗋𝗎𝗀" },
        "👋": { apis: ["https://nekos.best/api/v2/slap", "https://api.waifu.pics/sfw/slap"], description: "𝗌𝗅𝖺𝗉" },
        "😴": { apis: ["https://nekos.best/api/v2/sleep"], description: "𝗌𝗅𝖾𝖾𝗉" },
        "😊": { apis: ["https://nekos.best/api/v2/smile", "https://api.waifu.pics/sfw/smile"], description: "𝗌𝗆𝗂𝗅𝖾" },
        "😏": { apis: ["https://nekos.best/api/v2/smug", "https://api.waifu.pics/sfw/smug"], description: "𝗌𝗆𝗎𝗀" },
        "👀": { apis: ["https://nekos.best/api/v2/stare"], description: "𝗌𝗍𝖺𝗋𝖾" },
        "👍": { apis: ["https://nekos.best/api/v2/thumbsup"], description: "𝗍𝗁𝗎𝗆𝖻𝗌𝗎𝗉" },
        "🤣": { apis: ["https://nekos.best/api/v2/tickle"], description: "𝗍𝗂𝖼𝗄𝗅𝖾" },
        "👋": { apis: ["https://nekos.best/api/v2/wave", "https://api.waifu.pics/sfw/wave"], description: "𝗐𝖺𝗏𝖾" },
        "😉": { apis: ["https://nekos.best/api/v2/wink", "https://api.waifu.pics/sfw/wink"], description: "𝗐𝗂𝗇𝗄" },
        "🥱": { apis: ["https://nekos.best/api/v2/yawn"], description: "𝗒𝖺𝗐𝗇" },
        "👅": { apis: ["https://api.waifu.pics/sfw/lick"], description: "𝗅𝗂𝖼𝗄" },
        "🐱": { apis: ["https://nekos.life/api/v2/img/neko", "https://nekobot.xyz/api/image?type=neko"], description: "𝗇𝖾𝗄𝗈" },
        "🔥": { apis: ["https://nekos.life/api/v2/img/lewd"], description: "𝗅𝖾𝗐𝖽" },
        "🎲": { apis: ["https://nekos.moe/api/v1/random/image?tags=neko"], description: "𝗋𝖺𝗇𝖽𝗈𝗆" }
      };

      const body = event.body?.trim();
      
      if (body && emojiReactions[body]) {
        const reaction = emojiReactions[body];
        let imageUrl = null;
        let lastError = null;

        console.log(`🎭 𝖠𝗍𝗍𝖾𝗆𝗉𝗍𝗂𝗇𝗀 𝖾𝗆𝗈𝗃𝗂 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇: ${body} (${reaction.description})`);
        
        // Try each API endpoint
        for (const apiUrl of reaction.apis) {
          try {
            console.log(`🔗 𝖳𝗋𝗒𝗂𝗇𝗀 𝖠𝖯𝖨: ${apiUrl}`);
            
            const response = await axios.get(apiUrl, {
              timeout: 15000,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            });

            // Parse response based on API
            if (apiUrl.includes("nekos.best")) {
              imageUrl = response.data?.results?.[0]?.url;
            } else if (apiUrl.includes("waifu.pics")) {
              imageUrl = response.data?.url;
            } else if (apiUrl.includes("nekos.life")) {
              imageUrl = response.data?.url;
            } else if (apiUrl.includes("nekobot.xyz")) {
              imageUrl = response.data?.message;
            } else if (apiUrl.includes("otakugifs")) {
              imageUrl = response.data?.url;
            } else if (apiUrl.includes("nekos.moe")) {
              imageUrl = response.data?.images?.[0]?.id ? `https://nekos.moe/image/${response.data.images[0].id}` : null;
            }

            if (imageUrl) {
              console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗀𝗈𝗍 𝗂𝗆𝖺𝗀𝖾 𝖿𝗋𝗈𝗆: ${apiUrl}`);
              break;
            } else {
              throw new Error("𝖭𝗈 𝗂𝗆𝖺𝗀𝖾 𝖴𝖱𝖫 𝗂𝗇 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾");
            }
          } catch (error) {
            lastError = error;
            console.error(`❌ 𝖠𝖯𝖨 𝖿𝖺𝗂𝗅𝖾𝖽: ${apiUrl} - ${error.message}`);
            continue;
          }
        }

        if (imageUrl) {
          try {
            const imageStream = await global.utils.getStreamFromURL(imageUrl);
            if (imageStream) {
              await message.reply({
                body: `🎭 ${body} ${reaction.description}!`,
                attachment: imageStream
              });
              console.log(`✨ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗌𝖾𝗇𝗍 𝖺𝗇𝗂𝗆𝖾 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇`);
              return;
            } else {
              throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗂𝗆𝖺𝗀𝖾 𝗌𝗍𝗋𝖾𝖺𝗆");
            }
          } catch (streamError) {
            console.error(`❌ 𝖨𝗆𝖺𝗀𝖾 𝗌𝗍𝗋𝖾𝖺𝗆 𝖾𝗋𝗋𝗈𝗋:`, streamError.message);
          }
        }
        
        // Fallback: send text-only response
        console.log(`⚠️ 𝖲𝖾𝗇𝖽𝗂𝗇𝗀 𝗍𝖾𝗑𝗍-𝗈𝗇𝗅𝗒 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄`);
        await message.reply(`🎭 ${body} ${reaction.description}! (𝗇𝗈 𝗂𝗆𝖺𝗀𝖾 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾)`);
      }
    } catch (error) {
      console.error("💥 𝖠𝗇𝗂𝗆𝖾 𝖾𝗆𝗈𝗃𝗂 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", error);
      // Silent fail to avoid spam
    }
  },

  onStart: async function({ message }) {
    const helpMessage = `╔════════════════╗
   𝕬𝖓𝖎𝖒𝖊 𝕽𝖊𝖆𝖈𝖙𝖎𝖔𝖓𝖘 
╚════════════════╝

𝖲𝗂𝗆𝗉𝗅𝗒 𝗌𝖾𝗇𝖽 𝖺𝗇𝗒 𝖾𝗆𝗈𝗃𝗂 𝗂𝗇 𝗍𝗁𝖾 𝖼𝗁𝖺𝗍!

╔════════════════╗
   𝕰𝖒𝖔𝖏𝖎 𝕷𝖎𝖘𝖙
╚════════════════╝

😄 - 𝖧𝖺𝗉𝗉𝗒
💃 - 𝖣𝖺𝗇𝖼𝖾
😘 - 𝖪𝗂𝗌𝗌
😢 - 𝖢𝗋𝗒
🤗 - 𝖧𝗎𝗀
😂 - 𝖫𝖺𝗎𝗀𝗁
👋 - 𝖯𝖺𝗍/𝖶𝖺𝗏𝖾/𝖲𝗅𝖺𝗉
🐱 - 𝖭𝖾𝗄𝗈
🎲 - 𝖱𝖺𝗇𝖽𝗈𝗆
😊 - 𝖡𝗅𝗎𝗌𝗁/𝖲𝗆𝗂𝗅𝖾
🤦 - 𝖥𝖺𝖼𝖾𝗉𝖺𝗅𝗆
👊 - 𝖯𝗎𝗇𝖼𝗁
👀 - 𝖲𝗍𝖺𝗋𝖾
😉 - 𝖶𝗂𝗇𝗄

...𝖺𝗇𝖽 𝗆𝖺𝗇𝗒 𝗆𝗈𝗋𝖾!

╔════════════════╗
   𝕳𝖔𝖜 𝖙𝖔 𝖀𝖘𝖊
╚════════════════╝

𝖩𝗎𝗌𝗍 𝗍𝗒𝗉𝖾 𝗍𝗁𝖾 𝖾𝗆𝗈𝗃𝗂 𝖺𝗇𝖽 𝗍𝗁𝖾 𝖻𝗈𝗍 𝗐𝗂𝗅𝗅 𝗋𝖾𝗌𝗉𝗈𝗇𝖽 𝗐𝗂𝗍𝗁 𝖺𝗇 𝖺𝗇𝗂𝗆𝖾 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇!`;

    await message.reply(helpMessage);
  }
};

/*
module.exports.config = {
	name: "anime2",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Send random anime reaction GIFs/images 🎭",
	category: "fun",
	usages: "[reaction]",
	cooldowns: 5,
	dependencies: {
		"axios": ""
	}
};

// Added to prevent "onStart of command undefined" error in loader
module.exports.onStart = async function() {
	// intentionally left empty to satisfy loader expectation
};

module.exports.run = async function({ api, event, args }) {
	const { threadID, messageID } = event;
	const axios = require("axios");
	
	// List of available reactions with emojis
	const reactions = {
		happy: { apis: [
			"https://nekos.best/api/v2/happy",
			"https://api.waifu.pics/sfw/happy"
		], emoji: "😄", description: "Happy and cheerful expressions" },
		dance: { apis: [
			"https://nekos.best/api/v2/dance",
			"https://api.waifu.pics/sfw/dance"
		], emoji: "💃", description: "Dancing animations" },
		kiss: { apis: [
			"https://api.otakugifs.xyz/gif?reaction=kiss",
			"https://nekos.best/api/v2/kiss",
			"https://api.waifu.pics/sfw/kiss"
		], emoji: "😘", description: "Romantic kissing scenes" },
		cry: { apis: [
			"https://nekos.best/api/v2/cry",
			"https://api.waifu.pics/sfw/cry"
		], emoji: "😢", description: "Sad and crying moments" },
		bite: { apis: [
			"https://nekos.best/api/v2/bite",
			"https://api.waifu.pics/sfw/bite"
		], emoji: "😬", description: "Playful biting actions" },
		blush: { apis: [
			"https://nekos.best/api/v2/blush",
			"https://api.waifu.pics/sfw/blush"
		], emoji: "😊", description: "Blushing and shy reactions" },
		cuddle: { apis: [
			"https://nekos.best/api/v2/cuddle",
			"https://api.waifu.pics/sfw/cuddle"
		], emoji: "🤗", description: "Warm cuddling moments" },
		facepalm: { apis: [
			"https://nekos.best/api/v2/facepalm"
		], emoji: "🤦", description: "Facepalm reactions" },
		handhold: { apis: [
			"https://nekos.best/api/v2/handhold",
			"https://api.waifu.pics/sfw/handhold"
		], emoji: "🧑‍🤝‍🧑", description: "Hand holding scenes" },
		hug: { apis: [
			"https://nekos.best/api/v2/hug",
			"https://api.waifu.pics/sfw/hug"
		], emoji: "🫂", description: "Warm hugs" },
		laugh: { apis: [
			"https://nekos.best/api/v2/laugh"
		], emoji: "😂", description: "Laughing out loud" },
		nom: { apis: [
			"https://nekos.best/api/v2/nom",
			"https://api.waifu.pics/sfw/nom"
		], emoji: "🍖", description: "Eating or nibbling" },
		pat: { apis: [
			"https://nekos.best/api/v2/pat",
			"https://api.waifu.pics/sfw/pat"
		], emoji: "👋", description: "Head pats" },
		poke: { apis: [
			"https://nekos.best/api/v2/poke",
			"https://api.waifu.pics/sfw/poke"
		], emoji: "👉", description: "Poking actions" },
		pout: { apis: [
			"https://nekos.best/api/v2/pout"
		], emoji: "😤", description: "Pouting expressions" },
		punch: { apis: [
			"https://nekos.best/api/v2/punch"
		], emoji: "👊", description: "Punching actions" },
		run: { apis: [
			"https://nekos.best/api/v2/run"
		], emoji: "🏃", description: "Running away" },
		shrug: { apis: [
			"https://nekos.best/api/v2/shrug"
		], emoji: "🤷", description: "Shrugging shoulders" },
		slap: { apis: [
			"https://nekos.best/api/v2/slap",
			"https://api.waifu.pics/sfw/slap"
		], emoji: "👋", description: "Slapping actions" },
		sleep: { apis: [
			"https://nekos.best/api/v2/sleep"
		], emoji: "😴", description: "Sleeping scenes" },
		smile: { apis: [
			"https://nekos.best/api/v2/smile",
			"https://api.waifu.pics/sfw/smile"
		], emoji: "😊", description: "Sweet smiles" },
		smug: { apis: [
			"https://nekos.best/api/v2/smug",
			"https://api.waifu.pics/sfw/smug"
		], emoji: "😏", description: "Smug expressions" },
		stare: { apis: [
			"https://nekos.best/api/v2/stare"
		], emoji: "👀", description: "Intense staring" },
		thumbsup: { apis: [
			"https://nekos.best/api/v2/thumbsup"
		], emoji: "👍", description: "Thumbs up approval" },
		tickle: { apis: [
			"https://nekos.best/api/v2/tickle"
		], emoji: "🤣", description: "Tickling actions" },
		wave: { apis: [
			"https://nekos.best/api/v2/wave",
			"https://api.waifu.pics/sfw/wave"
		], emoji: "👋", description: "Waving hello/goodbye" },
		wink: { apis: [
			"https://nekos.best/api/v2/wink",
			"https://api.waifu.pics/sfw/wink"
		], emoji: "😉", description: "Winking flirtily" },
		yawn: { apis: [
			"https://nekos.best/api/v2/yawn"
		], emoji: "🥱", description: "Yawning tiredly" },
		lick: { apis: [
			"https://api.waifu.pics/sfw/lick"
		], emoji: "👅", description: "Licking actions" },
		neko: { apis: [
			"https://nekos.life/api/v2/img/neko",
			"https://nekobot.xyz/api/image?type=neko"
		], emoji: "🐱", description: "Cute cat girls" },
		lewd: { apis: [
			"https://nekos.life/api/v2/img/lewd"
		], emoji: "🔥", description: "Suggestive content (use with caution)" },
		random: { apis: [
			"https://nekos.moe/api/v1/random/image?tags=neko"
		], emoji: "🎲", description: "Completely random anime image" }
	};

	// If no reaction specified, show available options
	if (args.length === 0) {
		let message = "🎭 𝗔𝗡𝗜𝗠𝗘 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦 𝗠𝗘𝗡𝗨 🎭\n\n";
		message += "𝗨𝘀𝗮𝗴𝗲: /anime [reaction]\n\n";
		message += "𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗿𝗲𝗮𝗰𝘁𝗶𝗼𝗻𝘀:\n\n";
		
		// Create a formatted list of all reactions
		Object.keys(reactions).sort().forEach(reaction => {
			const info = reactions[reaction];
			message += `✨ ${info.emoji} ${reaction.charAt(0).toUpperCase() + reaction.slice(1)} - ${info.description}\n`;
		});
		
		message += "\n📝 𝗙𝗨𝗟𝗟 𝗘𝗫𝗔𝗠𝗣𝗟𝗘 𝗟𝗜𝗦𝗧:\n";
		message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
		message += "❤️ 𝗔𝗳𝗳𝗲𝗰𝘁𝗶𝗼𝗻: /anime hug, /anime kiss, /anime cuddle, /anime handhold\n";
		message += "😊 𝗛𝗮𝗽𝗽𝘆: /anime happy, /anime smile, /anime blush, /anime laugh\n";
		message += "😭 𝗦𝗮𝗱: /anime cry, /anime pout\n";
		message += "🎉 𝗔𝗰𝘁𝗶𝗼𝗻: /anime dance, /anime wave, /anime run, /anime shrug\n";
		message += "👊 𝗔𝗴𝗴𝗿𝗲𝘀𝘀𝗶𝘃𝗲: /anime slap, /anime punch, /anime bite\n";
		message += "😴 𝗥𝗲𝗹𝗮𝘅𝗲𝗱: /anime sleep, /anime yawn\n";
		message += "🎲 𝗥𝗮𝗻𝗱𝗼𝗺: /anime random, /anime neko\n";
		message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
		message += "💡 𝗧𝗶𝗽: Try these examples to get started!\n";
		message += "• /anime hug 🤗\n";
		message += "• /anime kiss 😘\n";
		message += "• /anime dance 💃\n";
		message += "• /anime neko 🐱\n\n";
		message += "🎨 𝗖𝗿𝗲𝗱𝗶𝘁𝘀: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅";
		
		return api.sendMessage(message, threadID, messageID);
	}

	const reactionName = args[0].toLowerCase();
	
	// Check if reaction exists
	if (!reactions[reactionName]) {
		let errorMessage = `❌ 𝗥𝗲𝗮𝗰𝘁𝗶𝗼𝗻 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱: "${reactionName}"\n\n`;
		errorMessage += "𝗨𝘀𝗲 𝗼𝗻𝗲 𝗼𝗳 𝘁𝗵𝗲𝘀𝗲 𝗿𝗲𝗮𝗰𝘁𝗶𝗼𝗻𝘀:\n";
		
		// Show some suggestions
		const availableReactions = Object.keys(reactions);
		for (let i = 0; i < Math.min(8, availableReactions.length); i++) {
			errorMessage += `• ${availableReactions[i]}\n`;
		}
		
		errorMessage += "\n💡 𝗧𝗶𝗽: Use /anime without any reaction to see all options";
		
		return api.sendMessage(errorMessage, threadID, messageID);
	}

	const reaction = reactions[reactionName];
	const apis = reaction.apis;
	const emoji = reaction.emoji;
	
	// Try each API until we get a valid response
	for (const apiUrl of apis) {
		try {
			let response;
			if (apiUrl.includes("otakugifs")) {
				response = await axios.get(apiUrl);
				const gifUrl = response.data.url;
				return api.sendMessage({ 
					body: `${emoji} ${reactionName.charAt(0).toUpperCase() + reactionName.slice(1)}!`,
					attachment: await global.utils.getStreamFromURL(gifUrl)
				}, threadID, messageID);
			} else if (apiUrl.includes("nekos.best")) {
				response = await axios.get(apiUrl);
				const imgUrl = response.data.results[0].url;
				return api.sendMessage({ 
					body: `${emoji} ${reactionName.charAt(0).toUpperCase() + reactionName.slice(1)}!`,
					attachment: await global.utils.getStreamFromURL(imgUrl)
				}, threadID, messageID);
			} else if (apiUrl.includes("waifu.pics")) {
				response = await axios.get(apiUrl);
				const imgUrl = response.data.url;
				return api.sendMessage({ 
					body: `${emoji} ${reactionName.charAt(0).toUpperCase() + reactionName.slice(1)}!`,
					attachment: await global.utils.getStreamFromURL(imgUrl)
				}, threadID, messageID);
			} else if (apiUrl.includes("nekos.life")) {
				response = await axios.get(apiUrl);
				const imgUrl = response.data.url;
				return api.sendMessage({ 
					body: `${emoji} ${reactionName.charAt(0).toUpperCase() + reactionName.slice(1)}!`,
					attachment: await global.utils.getStreamFromURL(imgUrl)
				}, threadID, messageID);
			} else if (apiUrl.includes("nekobot.xyz")) {
				response = await axios.get(apiUrl);
				const imgUrl = response.data.message;
				return api.sendMessage({ 
					body: `${emoji} ${reactionName.charAt(0).toUpperCase() + reactionName.slice(1)}!`,
					attachment: await global.utils.getStreamFromURL(imgUrl)
				}, threadID, messageID);
			} else if (apiUrl.includes("nekos.moe")) {
				response = await axios.get(apiUrl);
				const imgUrl = `https://nekos.moe/image/${response.data.images[0].id}`;
				return api.sendMessage({ 
					body: `${emoji} ${reactionName.charAt(0).toUpperCase() + reactionName.slice(1)}!`,
					attachment: await global.utils.getStreamFromURL(imgUrl)
				}, threadID, messageID);
			}
		} catch (error) {
			console.log(`API ${apiUrl} failed, trying next one...`);
		}
	}
	
	// If all APIs failed
	return api.sendMessage(`❌ Sorry, couldn't fetch a ${reactionName} reaction at the moment. Please try again later.`, threadID, messageID);
};
*/
