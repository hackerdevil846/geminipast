const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "getfbstate",
		aliases: [],
		version: "1.2",
		author: "Asif",
		countDown: 5,
		role: 2,
		description: {
			en: "𝖦𝖾𝗍 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝖿𝖻𝗌𝗍𝖺𝗍𝖾"
		},
		category: "𝗈𝗐𝗇𝖾𝗋",
		guide: {
			en: "🔐 𝖦𝖾𝗍 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖲𝗍𝖺𝗍𝖾\n\n" +
				"• {pn}: 𝖦𝖾𝗍 𝖿𝖻𝗌𝗍𝖺𝗍𝖾 (𝖺𝗉𝗉𝖲𝗍𝖺𝗍𝖾 𝖩𝖲𝖮𝖭 𝖿𝗈𝗋𝗆𝖺𝗍)\n" +
				"• {pn} 𝖼𝗈𝗈𝗄𝗂𝖾𝗌: 𝖦𝖾𝗍 𝖿𝖻𝗌𝗍𝖺𝗍𝖾 𝗐𝗂𝗍𝗁 𝖼𝗈𝗈𝗄𝗂𝖾𝗌 𝖿𝗈𝗋𝗆𝖺𝗍\n" +
				"• {pn} 𝗌𝗍𝗋𝗂𝗇𝗀: 𝖦𝖾𝗍 𝖿𝖻𝗌𝗍𝖺𝗍𝖾 𝗐𝗂𝗍𝗁 𝗌𝗍𝗋𝗂𝗇𝗀 𝖿𝗈𝗋𝗆𝖺𝗍\n\n" +
				"📝 𝖤𝗑𝖺𝗆𝗉𝗅𝖾𝗌:\n" +
				"• {pn}\n" +
				"• {pn} 𝖼𝗈𝗈𝗄𝗂𝖾𝗌\n" +
				"• {pn} 𝗌𝗍𝗋𝗂𝗇𝗀"
		},
		dependencies: {
			"fs-extra": ""
		}
	},

	langs: {
		en: {
			success: "✅ 𝖥𝖻𝗌𝗍𝖺𝗍𝖾 𝗌𝖾𝗇𝗍 𝗍𝗈 𝗒𝗈𝗎, 𝗉𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝖻𝗈𝗍'𝗌 𝗉𝗋𝗂𝗏𝖺𝗍𝖾 𝗆𝖾𝗌𝗌𝖺𝗀𝖾",
			error: "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝖿𝖻𝗌𝗍𝖺𝗍𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.",
			noAppState: "❌ 𝖭𝗈 𝖺𝗉𝗉𝗌𝗍𝖺𝗍𝖾 𝖿𝗈𝗎𝗇𝖽. 𝖡𝗈𝗍 𝗂𝗌 𝗇𝗈𝗍 𝗅𝗈𝗀𝗀𝖾𝖽 𝗂𝗇."
		}
	},

	onStart: async function ({ message, api, event, args, getLang }) {
		try {
			// Dependency check
			let fsAvailable = true;
			try {
				require("fs-extra");
			} catch (e) {
				fsAvailable = false;
			}

			if (!fsAvailable) {
				return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗒: 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺");
			}

			// Get app state with error handling
			let appState;
			try {
				appState = api.getAppState();
			} catch (error) {
				console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝖺𝗉𝗉𝖲𝗍𝖺𝗍𝖾:", error);
				return message.reply(getLang("error"));
			}

			// Check if app state is valid
			if (!appState || !Array.isArray(appState) || appState.length === 0) {
				return message.reply(getLang("noAppState"));
			}

			let fbstate;
			let fileName;
			let fileExtension;

			// Determine format based on arguments
			const formatArg = args[0] ? args[0].toLowerCase() : 'default';

			if (["cookie", "cookies", "c"].includes(formatArg)) {
				// Cookies format
				fbstate = JSON.stringify(appState.map(e => ({
					name: e.key,
					value: e.value
				})), null, 2);
				fileName = `fbstate_cookies_${Date.now()}.json`;
				fileExtension = "json";
			}
			else if (["string", "str", "s"].includes(formatArg)) {
				// String format
				fbstate = appState.map(e => `${e.key}=${e.value}`).join("; ");
				fileName = `fbstate_string_${Date.now()}.txt`;
				fileExtension = "txt";
			}
			else {
				// Default appState format
				fbstate = JSON.stringify(appState, null, 2);
				fileName = `fbstate_appstate_${Date.now()}.json`;
				fileExtension = "json";
			}

			// Create temporary directory if it doesn't exist
			const tempDir = path.join(__dirname, "tmp");
			try {
				if (!fs.existsSync(tempDir)) {
					fs.mkdirSync(tempDir, { recursive: true });
				}
			} catch (dirError) {
				console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗍𝖾𝗆𝗉 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
				// Fallback to current directory
				tempDir = __dirname;
			}

			const filePath = path.join(tempDir, fileName);

			try {
				// Write fbstate to file
				await fs.writeFile(filePath, fbstate);
				
				// Verify file was written successfully
				const stats = await fs.stat(filePath);
				if (stats.size === 0) {
					throw new Error("𝖥𝗂𝗅𝖾 𝗐𝗋𝗂𝗍𝖾 𝖿𝖺𝗂𝗅𝖾𝖽 - 𝖾𝗆𝗉𝗍𝗒 𝖿𝗂𝗅𝖾");
				}

				// Send success message if in group chat
				if (event.senderID !== event.threadID) {
					await message.reply(getLang("success"));
				}

				// Send fbstate to user
				await api.sendMessage({
					body: `🔐 𝖥𝖻𝗌𝗍𝖺𝗍𝖾 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽\n\n` +
						`📁 𝖥𝗈𝗋𝗆𝖺𝗍: ${formatArg === 'default' ? '𝖺𝗉𝗉𝖲𝗍𝖺𝗍𝖾' : formatArg}\n` +
						`📊 𝖢𝗈𝗈𝗄𝗂𝖾𝗌: ${appState.length}\n` +
						`⏰ 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝖾𝖽: ${new Date().toLocaleString()}\n\n` +
						`📄 𝖥𝗂𝗅𝖾: ${fileName}`,
					attachment: fs.createReadStream(filePath)
				}, event.senderID);

				console.log(`✅ 𝖥𝖻𝗌𝗍𝖺𝗍𝖾 𝗌𝖾𝗇𝗍 𝗍𝗈 ${event.senderID} (${fileExtension} format)`);

			} catch (fileError) {
				console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗐𝗋𝗂𝗍𝗂𝗇𝗀/𝗌𝖾𝗇𝖽𝗂𝗇𝗀 𝖿𝗂𝗅𝖾:", fileError);
				
				// Fallback: send as text if file operations fail
				const truncatedFbstate = fbstate.length > 1900 ? fbstate.substring(0, 1900) + "..." : fbstate;
				await api.sendMessage({
					body: `🔐 𝖥𝖻𝗌𝗍𝖺𝗍𝖾 (𝖳𝖾𝗑𝗍 𝖮𝗇𝗅𝗒)\n\n` +
						`📁 𝖥𝗈𝗋𝗆𝖺𝗍: ${formatArg === 'default' ? '𝖺𝗉𝗉𝖲𝗍𝖺𝗍𝖾' : formatArg}\n` +
						`📊 𝖢𝗈𝗈𝗄𝗂𝖾𝗌: ${appState.length}\n\n` +
						`📄 𝖢𝗈𝗇𝗍𝖾𝗇𝗍:\n${truncatedFbstate}`
				}, event.senderID);
			} finally {
				// Clean up temporary file
				try {
					if (await fs.pathExists(filePath)) {
						await fs.unlink(filePath);
					}
				} catch (cleanupError) {
					console.warn("⚠️ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾:", cleanupError.message);
				}
			}

		} catch (error) {
			console.error("💥 𝖦𝖾𝗍𝖥𝖻𝗌𝗍𝖺𝗍𝖾 𝖤𝗋𝗋𝗈𝗋:", error);
			
			let errorMessage = getLang("error");
			
			if (error.message.includes('permission') || error.message.includes('access')) {
				errorMessage = "❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖢𝗁𝖾𝖼𝗄 𝖿𝗂𝗅𝖾 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌.";
			} else if (error.message.includes('ENOENT') || error.message.includes('no such file')) {
				errorMessage = "❌ 𝖥𝗂𝗅𝖾 𝗌𝗒𝗌𝗍𝖾𝗆 𝖾𝗋𝗋𝗈𝗋. 𝖢𝗁𝖾𝖼𝗄 𝗌𝗍𝗈𝗋𝖺𝗀𝖾 𝗌𝗉𝖺𝖼𝖾.";
			}
			
			await message.reply(errorMessage);
		}
	}
};
