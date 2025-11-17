const { findUid } = global.utils;
const regExCheckURL = /^(http|https):\/\/[^ "]+$/;

module.exports = {
	config: {
		name: "uid",
		aliases: [],
		version: "2.0.0",
		author: "Asif Mahmud",
		countDown: 5,
		role: 0,
		category: "info",
		shortDescription: {
			en: "🆔 Get user ID information"
		},
		longDescription: {
			en: "Get Facebook user IDs from multiple sources: self, mentions, message replies, or profile links"
		},
		guide: {
			en: "   {p}uid - View your own user ID\n   {p}uid @mention - View ID of mentioned users\n   {p}uid <profile_url> - Get ID from Facebook profile link\n   Reply to a message with {p}uid - Get sender's ID"
		}
	},

	langs: {
		en: {
			syntaxError: "❌ Please tag users, provide profile links, or leave empty to see your own ID",
			urlError: "❌ Failed to get UID from: %1\nError: %2",
			noValidURLs: "❌ No valid profile links provided",
			yourUID: "👤 Your User ID: %1",
			multipleResults: "📋 User ID Results:",
			singleResult: "👤 User ID: %1"
		}
	},

	onStart: async function ({ message, event, args, getLang }) {
		try {
			// Case 1: Message reply - get replier's ID
			if (event.messageReply) {
				const replyUID = event.messageReply.senderID;
				return message.reply(getLang("singleResult", replyUID));
			}

			// Case 2: No arguments - get own ID
			if (!args[0] || args[0].trim() === "") {
				return message.reply(getLang("yourUID", event.senderID));
			}

			// Case 3: Profile URLs provided
			const urlArgs = args.filter(arg => regExCheckURL.test(arg.trim()));
			if (urlArgs.length > 0) {
				return await this.handleURLs(urlArgs, message, getLang);
			}

			// Case 4: Mentions provided
			const { mentions } = event;
			if (Object.keys(mentions).length > 0) {
				return await this.handleMentions(mentions, message);
			}

			// Case 5: Invalid input
			return message.reply(getLang("syntaxError"));

		} catch (error) {
			console.error("UID Command Error:", error);
			return message.reply("❌ An error occurred while processing the command. Please try again.");
		}
	},

	// Handle profile URLs
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
				responseMessage = results[0].replace(/^🔗\s.*?→\s/, "👤 User ID: ");
			}

			await message.reply(responseMessage);

		} catch (error) {
			console.error("URL handling error:", error);
			throw new Error("Failed to process profile links");
		}
	},

	// Handle user mentions
	handleMentions: async function (mentions, message) {
		try {
			let results = [];

			for (const [userId, userName] of Object.entries(mentions)) {
				const cleanName = userName.replace(/@/g, '').trim();
				results.push(`👤 ${cleanName} → ${userId}`);
			}

			let responseMessage = "";
			if (results.length > 1) {
				responseMessage = "📋 User ID Results:\n\n" + results.join("\n");
			} else {
				responseMessage = results[0].replace(/^👤\s.*?→\s/, "👤 User ID: ");
			}

			await message.reply(responseMessage);

		} catch (error) {
			console.error("Mentions handling error:", error);
			throw new Error("Failed to process user mentions");
		}
	}
};
