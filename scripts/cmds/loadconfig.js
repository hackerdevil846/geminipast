const fs = require("fs-extra");

module.exports = {
	config: {
		name: "loadconfig",
		aliases: [],
		version: "2.0",
		author: "NTKhang & Asif Mahmud",
		countDown: 3,
		role: 2,
		description: {
			en: "Reload bot configuration files",
			vi: "Load lại config của bot"
		},
		category: "owner",
		guide: {
			en: "{pn}",
			vi: "{pn}"
		}
	},

	langs: {
		en: {
			success: "✅ | Config has been reloaded successfully!",
			error: "❌ | Failed to reload config files",
			missingPaths: "❌ | Config paths not defined in global.client",
			fileNotFound: "❌ | Config file not found: ",
			invalidJson: "❌ | Invalid JSON in config file: "
		},
		vi: {
			success: "✅ | Config đã được load lại thành công!",
			error: "❌ | Thất bại khi load lại config",
			missingPaths: "❌ | Đường dẫn config không được định nghĩa trong global.client",
			fileNotFound: "❌ | Không tìm thấy file config: ",
			invalidJson: "❌ | JSON không hợp lệ trong file config: "
		}
	},

	onStart: async function ({ message, getLang }) {
		try {
			// Validate global client structure
			if (!global.client || !global.client.dirConfig || !global.client.dirConfigCommands) {
				return message.reply(getLang("missingPaths"));
			}

			// Validate config files exist
			if (!fs.existsSync(global.client.dirConfig)) {
				return message.reply(getLang("fileNotFound") + "config.json");
			}

			if (!fs.existsSync(global.client.dirConfigCommands)) {
				return message.reply(getLang("fileNotFound") + "configCommands.json");
			}

			// Initialize GoatBot if not exists
			global.GoatBot = global.GoatBot || {};

			// Read and validate main config
			let configData;
			try {
				configData = fs.readJsonSync(global.client.dirConfig);
			} catch (jsonError) {
				console.error("Config JSON Error:", jsonError);
				return message.reply(getLang("invalidJson") + "config.json");
			}

			// Read and validate commands config
			let configCommandsData;
			try {
				configCommandsData = fs.readJsonSync(global.client.dirConfigCommands);
			} catch (jsonError) {
				console.error("ConfigCommands JSON Error:", jsonError);
				return message.reply(getLang("invalidJson") + "configCommands.json");
			}

			// Assign to global with validation
			if (configData && typeof configData === 'object') {
				global.GoatBot.config = configData;
			} else {
				return message.reply("❌ | Invalid config data structure");
			}

			if (configCommandsData && typeof configCommandsData === 'object') {
				global.GoatBot.configCommands = configCommandsData;
			} else {
				return message.reply("❌ | Invalid configCommands data structure");
			}

			// Send success message
			await message.reply(getLang("success"));

			// Log successful reload
			console.log("✅ | Config reloaded successfully at:", new Date().toISOString());

		} catch (error) {
			console.error("💥 | LoadConfig Critical Error:", error);
			
			// Send detailed error message for debugging
			const errorMessage = `${getLang("error")}\n💡 Error: ${error.message}`;
			await message.reply(errorMessage);
		}
	}
};
