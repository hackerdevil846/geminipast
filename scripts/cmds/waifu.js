const axios = require("axios");

module.exports = {
	config: {
		name: "waifu",
		aliases: ["wife"],
		version: "1.1",
		author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
		countDown: 6,
		role: 0,
		shortDescription: "Get random waifu",
		longDescription: "Get waifu neko: waifu, neko, shinobu, megumin, bully, cuddle, cry, kiss, lick, hug, awoo, pat, smug, bonk, yeet, blush, smile, wave, highfive, handhold, nom, bite, glomp, slap, kill, kick, happy, wink, poke, dance, cringe",
		category: "anime",
		guide: "{pn} {{<category>}}"
	},

	onStart: async function ({ message, args }) {
		const category = args.join(" ").trim() || "waifu";
		const validCategories = [
			"waifu", "neko", "shinobu", "megumin", "bully", "cuddle", "cry", "kiss", "lick", "hug", "awoo",
			"pat", "smug", "bonk", "yeet", "blush", "smile", "wave", "highfive", "handhold", "nom", "bite",
			"glomp", "slap", "kill", "kick", "happy", "wink", "poke", "dance", "cringe"
		];

		if (!validCategories.includes(category)) {
			return message.reply(
				`❌ Invalid category.\nAvailable: ${validCategories.join(", ")}`
			);
		}

		// API sources with category support
		const apis = [
			`https://api.waifu.pics/sfw/${category}`,
			`https://nekos.best/api/v2/${category}`,
			`https://api.waifu.im/search/?included_tags=${category}`,
			`https://waifu-api.vercel.app/${category}`, // some categories might not work here
			`https://nekos.life/api/v2/img/${category}`
		];

		async function fetchImage() {
			for (let api of apis) {
				try {
					let res = await axios.get(api);

					// waifu.pics & nekos.life format
					if (res?.data?.url) return res.data.url;

					// nekos.best format
					if (res?.data?.results?.[0]?.url) return res.data.results[0].url;

					// waifu.im format
					if (res?.data?.images?.[0]?.url) return res.data.images[0].url;

					// waifu-api.vercel.app format
					if (res?.data?.image) return res.data.image;
				} catch (e) {
					// Continue to next API if error
				}
			}
			return null;
		}

		const imgURL = await fetchImage();
		if (!imgURL) {
			return message.reply(`❌ Could not fetch image for category: ${category}`);
		}

		const form = {
			body: `   「 𝔀𝓪𝓲𝓯𝓾 」   `,
			attachment: await global.utils.getStreamFromURL(imgURL)
		};

		message.reply(form);
	}
};
