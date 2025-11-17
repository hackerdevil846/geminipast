module.exports = {
	config: {
		name: "unsend",
		aliases: ["u"],
		version: "2.0.0",
		author: "Asif Mahmud",
		countDown: 0,
		role: 0,
		category: "box chat",
		shortDescription: {
			en: "🗑️ Unsend bot's messages"
		},
		longDescription: {
			en: "Delete bot's messages by replying to them with this command"
		},
		guide: {
			en: "Reply to bot's message and type {p}unsend"
		}
	},

	langs: {
		en: {
			syntaxError: "❌ Please reply to a bot message to unsend it",
			notBotMessage: "❌ You can only unsend bot's messages",
			success: "✅ Message unsent successfully",
			failed: "❌ Failed to unsend message"
		}
	},

	onStart: async function ({ message, event, api, getLang }) {
		try {
			// Check if it's a reply message
			if (!event.messageReply) {
				return message.reply(getLang("syntaxError"));
			}

			// Get bot's user ID
			const botID = api.getCurrentUserID();

			// Check if the replied message was sent by the bot
			if (event.messageReply.senderID != botID) {
				return message.reply(getLang("notBotMessage"));
			}

			// Get the message ID to unsend
			const messageID = event.messageReply.messageID;

			// Unsend the message using the proper method
			await message.unsend(messageID);

		} catch (error) {
			console.error("Unsend command error:", error);
			
			// Try alternative method if the first one fails
			try {
				if (event.messageReply && event.messageReply.messageID) {
					await api.unsendMessage(event.messageReply.messageID);
				}
			} catch (secondError) {
				console.error("Alternative unsend also failed:", secondError);
				await message.reply(getLang("failed"));
			}
		}
	}
};
