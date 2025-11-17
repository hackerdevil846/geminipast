module.exports = {
	config: {
		name: "sorthelp",
		version: "1.3",
		author: "Asif Mahmud",
		countDown: 5,
		role: 0,
		shortDescription: {
			en: "Sort help list by name or category"
		},
		longDescription: {
			en: "Sort the help command list either by command name or by category for better organization"
		},
		category: "system",
		guide: {
			en: "{pn} [name | category]"
		}
	},

	langs: {
		en: {
			savedName: "✅ Help list sorting set to: Alphabetical Order (by Name)",
			savedCategory: "✅ Help list sorting set to: Category Order",
			invalidArg: "❌ Invalid argument! Please use 'name' or 'category'.\nExample: {pn} name",
			usage: "📝 Usage: {pn} [name | category]\n\nOptions:\n• name - Sort commands alphabetically\n• category - Sort commands by category"
		}
	},

	onStart: async function ({ message, event, args, threadsData, getLang, commandName }) {
		try {
			// Check if argument is provided
			if (!args[0] || args.length === 0) {
				return message.reply(getLang("usage").replace(/{pn}/g, commandName));
			}

			const sortType = args[0].toLowerCase().trim();

			// Validate and set sorting preference
			if (sortType === "name") {
				await threadsData.set(event.threadID, "name", "settings.sortHelp");
				return message.reply(getLang("savedName"));
			} 
			else if (sortType === "category") {
				await threadsData.set(event.threadID, "category", "settings.sortHelp");
				return message.reply(getLang("savedCategory"));
			}
			else {
				// Invalid argument provided
				return message.reply(getLang("invalidArg").replace(/{pn}/g, commandName));
			}
		} 
		catch (error) {
			console.error("Error in sorthelp command:", error);
			return message.reply("❌ An error occurred while setting sort preference. Please try again.");
		}
	}
};
