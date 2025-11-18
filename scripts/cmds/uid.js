const { findUid } = global.utils;
const regExCheckURL = /^(http|https):\/\/[^ "]+$/;

module.exports = {
	config: {
		name: "uid",
		aliases: [],
		version: "2.0.0",
		author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
		countDown: 5,
		role: 0,
		category: "info",
		shortDescription: {
			en: "🆔 𝐆𝐞𝐭 𝐮𝐬𝐞𝐫 𝐈𝐃 𝐢𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧"
		},
		longDescription: {
			en: "𝐆𝐞𝐭 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐮𝐬𝐞𝐫 𝐈𝐃𝐬 𝐟𝐫𝐨𝐦 𝐦𝐮𝐥𝐭𝐢𝐩𝐥𝐞 𝐬𝐨𝐮𝐫𝐜𝐞𝐬: 𝐬𝐞𝐥𝐟, 𝐦𝐞𝐧𝐭𝐢𝐨𝐧𝐬, 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐫𝐞𝐩𝐥𝐢𝐞𝐬, 𝐨𝐫 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 𝐥𝐢𝐧𝐤𝐬"
		},
		guide: {
			en: "   {p}uid - 𝐕𝐢𝐞𝐰 𝐲𝐨𝐮𝐫 𝐨𝐰𝐧 𝐮𝐬𝐞𝐫 𝐈𝐃\n   {p}uid @mention - 𝐕𝐢𝐞𝐰 𝐈𝐃 𝐨𝐟 𝐦𝐞𝐧𝐭𝐢𝐨𝐧𝐞𝐝 𝐮𝐬𝐞𝐫𝐬\n   {p}uid <profile_url> - 𝐆𝐞𝐭 𝐈𝐃 𝐟𝐫𝐨𝐦 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 𝐥𝐢𝐧𝐤\n   𝐑𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 {p}uid - 𝐆𝐞𝐭 𝐬𝐞𝐧𝐝𝐞𝐫'𝐬 𝐈𝐃"
		}
	},

	langs: {
		en: {
			syntaxError: "❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐚𝐠 𝐮𝐬𝐞𝐫𝐬, 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 𝐥𝐢𝐧𝐤𝐬, 𝐨𝐫 𝐥𝐞𝐚𝐯𝐞 𝐞𝐦𝐩𝐭𝐲 𝐭𝐨 𝐬𝐞𝐞 𝐲𝐨𝐮𝐫 𝐨𝐰𝐧 𝐈𝐃",
			urlError: "❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐠𝐞𝐭 𝐔𝐈𝐃 𝐟𝐫𝐨𝐦: %1\n𝐄𝐫𝐫𝐨𝐫: %2",
			noValidURLs: "❌ 𝐍𝐨 𝐯𝐚𝐥𝐢𝐝 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 𝐥𝐢𝐧𝐤𝐬 𝐩𝐫𝐨𝐯𝐢𝐝𝐞𝐝",
			yourUID: "👤 𝐘𝐨𝐮𝐫 𝐔𝐬𝐞𝐫 𝐈𝐃: %1",
			multipleResults: "📋 𝐔𝐬𝐞𝐫 𝐈𝐃 𝐑𝐞𝐬𝐮𝐥𝐭𝐬:",
			singleResult: "👤 𝐔𝐬𝐞𝐫 𝐈𝐃: %1"
		}
	},

	onStart: async function ({ message, event, args, getLang }) {
		try {
			// 𝐂𝐚𝐬𝐞 𝟏: 𝐌𝐞𝐬𝐬𝐚𝐠𝐞 𝐫𝐞𝐩𝐥𝐲 - 𝐠𝐞𝐭 𝐫𝐞𝐩𝐥𝐢𝐞𝐫'𝐬 𝐈𝐃
			if (event.messageReply) {
				const replyUID = event.messageReply.senderID;
				return message.reply(getLang("singleResult", replyUID));
			}

			// 𝐂𝐚𝐬𝐞 𝟐: 𝐍𝐨 𝐚𝐫𝐠𝐮𝐦𝐞𝐧𝐭𝐬 - 𝐠𝐞𝐭 𝐨𝐰𝐧 𝐈𝐃
			if (!args[0] || args[0].trim() === "") {
				return message.reply(getLang("yourUID", event.senderID));
			}

			// 𝐂𝐚𝐬𝐞 𝟑: 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 𝐔𝐑𝐋𝐬 𝐩𝐫𝐨𝐯𝐢𝐝𝐞𝐝
			const urlArgs = args.filter(arg => regExCheckURL.test(arg.trim()));
			if (urlArgs.length > 0) {
				return await this.handleURLs(urlArgs, message, getLang);
			}

			// 𝐂𝐚𝐬𝐞 𝟒: 𝐌𝐞𝐧𝐭𝐢𝐨𝐧𝐬 𝐩𝐫𝐨𝐯𝐢𝐝𝐞𝐝
			const { mentions } = event;
			if (Object.keys(mentions).length > 0) {
				return await this.handleMentions(mentions, message);
			}

			// 𝐂𝐚𝐬𝐞 𝟓: 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐢𝐧𝐩𝐮𝐭
			return message.reply(getLang("syntaxError"));

		} catch (error) {
			console.error("❌ 𝐔𝐈𝐃 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐄𝐫𝐫𝐨𝐫:", error);
			return message.reply("❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐭𝐡𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧.");
		}
	},

	// 𝐇𝐚𝐧𝐝𝐥𝐞 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 𝐔𝐑𝐋𝐬
	handleURLs: async function (urls, message, getLang) {
		try {
			let results = [];
			let errorCount = 0;

			for (const url of urls) {
				try {
					const uid = await findUid(url.trim());
					results.push(`🔗 ${url} → ${uid}`);
				} catch (error) {
					errorCount++;
					results.push(getLang("urlError", url, error.message));
				}
			}

			if (results.length === 0) {
				return message.reply(getLang("noValidURLs"));
			}

			let responseMessage = "";
			if (urls.length > 1 || errorCount > 0) {
				responseMessage = getLang("multipleResults") + "\n\n" + results.join("\n");
			} else {
				responseMessage = results[0].replace(/^🔗\s.*?→\s/, "👤 𝐔𝐬𝐞𝐫 𝐈𝐃: ");
			}

			await message.reply(responseMessage);

		} catch (error) {
			console.error("❌ 𝐔𝐑𝐋 𝐡𝐚𝐧𝐝𝐥𝐢𝐧𝐠 𝐞𝐫𝐫𝐨𝐫:", error);
			throw new Error("𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐩𝐫𝐨𝐜𝐞𝐬𝐬 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 𝐥𝐢𝐧𝐤𝐬");
		}
	},

	// 𝐇𝐚𝐧𝐝𝐥𝐞 𝐮𝐬𝐞𝐫 𝐦𝐞𝐧𝐭𝐢𝐨𝐧𝐬
	handleMentions: async function (mentions, message) {
		try {
			let results = [];

			for (const [userId, userName] of Object.entries(mentions)) {
				const cleanName = userName.replace(/@/g, '').trim();
				results.push(`👤 ${cleanName} → ${userId}`);
			}

			let responseMessage = "";
			if (results.length > 1) {
				responseMessage = "📋 𝐔𝐬𝐞𝐫 𝐈𝐃 𝐑𝐞𝐬𝐮𝐥𝐭𝐬:\n\n" + results.join("\n");
			} else {
				responseMessage = results[0].replace(/^👤\s.*?→\s/, "👤 𝐔𝐬𝐞𝐫 𝐈𝐃: ");
			}

			await message.reply(responseMessage);

		} catch (error) {
			console.error("❌ 𝐌𝐞𝐧𝐭𝐢𝐨𝐧𝐬 𝐡𝐚𝐧𝐝𝐥𝐢𝐧𝐠 𝐞𝐫𝐫𝐨𝐫:", error);
			throw new Error("𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐩𝐫𝐨𝐜𝐞𝐬𝐬 𝐮𝐬𝐞𝐫 𝐦𝐞𝐧𝐭𝐢𝐨𝐧𝐬");
		}
	}
};
