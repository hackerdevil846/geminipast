const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

function getDomain(url) {
	const regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/im;
	const match = url.match(regex);
	return match ? match[1] : null;
}

module.exports = {
	config: {
		name: "event",
		aliases: [],
		version: "1.9",
		author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
		countDown: 5,
		role: 2,
		category: "owner",
		shortDescription: {
			en: "𝖬𝖺𝗇𝖺𝗀𝖾 𝗒𝗈𝗎𝗋 𝖾𝗏𝖾𝗇𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖿𝗂𝗅𝖾𝗌 🛠️"
		},
		longDescription: {
			en: "𝖬𝖺𝗇𝖺𝗀𝖾 𝖾𝗏𝖾𝗇𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖿𝗂𝗅𝖾𝗌 (𝗅𝗈𝖺𝖽, 𝗎𝗇𝗅𝗈𝖺𝖽, 𝗂𝗇𝗌𝗍𝖺𝗅𝗅) 📦"
		},
		guide: {
			en: "{p}event 𝗅𝗈𝖺𝖽 <𝖿𝗂𝗅𝖾> | 𝗅𝗈𝖺𝖽𝖠𝗅𝗅 | 𝗎𝗇𝗅𝗈𝖺𝖽 <𝖿𝗂𝗅𝖾> | 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 <𝗎𝗋𝗅/𝖼𝗈𝖽𝖾> <𝖿𝗂𝗅𝖾>"
		},
		dependencies: {
			"axios": "",
			"cheerio": "",
			"fs-extra": ""
		}
	},

	languages: {
		en: {
			missingFileName: "⚠️ | 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗍𝗁𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗇𝖺𝗆𝖾 𝗒𝗈𝗎 𝗐𝖺𝗇𝗍 𝗍𝗈 𝗋𝖾𝗅𝗈𝖺𝖽",
			loaded: "✅ | 𝖫𝗈𝖺𝖽𝖾𝖽 𝖾𝗏𝖾𝗇𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 \"%1\" 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 🎉",
			loadedError: "❌ | 𝖫𝗈𝖺𝖽𝖾𝖽 𝖾𝗏𝖾𝗇𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 \"%1\" 𝖿𝖺𝗂𝗅𝖾𝖽 𝗐𝗂𝗍𝗁 𝖾𝗋𝗋𝗈𝗋\n%2: %3",
			loadedSuccess: "✅ | 𝖫𝗈𝖺𝖽𝖾𝖽 \"%1\" 𝖾𝗏𝖾𝗇𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 📦",
			loadedFail: "❌ | 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 \"%1\" 𝖾𝗏𝖾𝗇𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌\n%2",
			missingCommandNameUnload: "⚠️ | 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗍𝗁𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗇𝖺𝗆𝖾 𝗒𝗈𝗎 𝗐𝖺𝗇𝗍 𝗍𝗈 𝗎𝗇𝗅𝗈𝖺𝖽",
			unloaded: "✅ | 𝖴𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖾𝗏𝖾𝗇𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 \"%1\" 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 🗑️",
			unloadedError: "❌ | 𝖴𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖾𝗏𝖾𝗇𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 \"%1\" 𝖿𝖺𝗂𝗅𝖾𝖽 𝗐𝗂𝗍𝗁 𝖾𝗋𝗋𝗈𝗋\n%2: %3",
			missingUrlCodeOrFileName: "⚠️ | 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗍𝗁𝖾 𝗎𝗋𝗅 𝗈𝗋 𝖼𝗈𝖽𝖾 𝖺𝗇𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖿𝗂𝗅𝖾 𝗇𝖺𝗆𝖾 𝗒𝗈𝗎 𝗐𝖺𝗇𝗍 𝗍𝗈 𝗂𝗇𝗌𝗍𝖺𝗅𝗅",
			missingUrlOrCode: "⚠️ | 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗍𝗁𝖾 𝗎𝗋𝗅 𝗈𝗋 𝖼𝗈𝖽𝖾 𝗈𝖿 𝗍𝗁𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖿𝗂𝗅𝖾 𝗒𝗈𝗎 𝗐𝖺𝗇𝗍 𝗍𝗈 𝗂𝗇𝗌𝗍𝖺𝗅𝗅",
			missingFileNameInstall: "⚠️ | 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗍𝗁𝖾 𝖿𝗂𝗅𝖾 𝗇𝖺𝗆𝖾 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗍𝗁𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 (𝗐𝗂𝗍𝗁 .𝗃𝗌 𝖾𝗑𝗍𝖾𝗇𝗌𝗂𝗈𝗇) 📝",
			invalidUrlOrCode: "⚠️ | 𝖴𝗇𝖺𝖻𝗅𝖾 𝗍𝗈 𝗀𝖾𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖼𝗈𝖽𝖾",
			alreadExist: "⚠️ | 𝖳𝗁𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖿𝗂𝗅𝖾 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝖾𝗑𝗂𝗌𝗍𝗌, 𝖺𝗋𝖾 𝗒𝗈𝗎 𝗌𝗎𝗋𝖾 𝗒𝗈𝗎 𝗐𝖺𝗇𝗍 𝗍𝗈 𝗈𝗏𝖾𝗋𝗐𝗋𝗂𝗍𝖾? 𝖱𝖾𝖺𝖼𝗍 𝗍𝗈 𝖼𝗈𝗇𝖿𝗂𝗋𝗆 🔄",
			installed: "✅ | 𝖨𝗇𝗌𝗍𝖺𝗅𝗅𝖾𝖽 𝖾𝗏𝖾𝗇𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 \"%1\" 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 📥\n𝖯𝖺𝗍𝗁: %2",
			installedError: "❌ | 𝖨𝗇𝗌𝗍𝖺𝗅𝗅𝖺𝗍𝗂𝗈𝗇 𝖿𝖺𝗂𝗅𝖾𝖽 𝖿𝗈𝗋 \"%1\"\n𝖤𝗋𝗋𝗈𝗋: %2: %3",
			missingFile: "⚠️ | 𝖥𝗂𝗅𝖾 \"%1\" 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽 🔍",
			invalidFileName: "⚠️ | 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖿𝗂𝗅𝖾 𝗇𝖺𝗆𝖾",
			unloadedFile: "✅ | 𝖴𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 \"%1\" 🗑️"
		}
	},

	onStart: async function ({ api, event, args, getText }) {
		try {
			// Dependency check
			let dependenciesAvailable = true;
			try {
				require("fs-extra");
				require("axios");
				require("cheerio");
			} catch (e) {
				dependenciesAvailable = false;
			}

			if (!dependenciesAvailable) {
				return api.sendMessage("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗑𝗂𝗈𝗌, 𝖺𝗇𝖽 𝖼𝗁𝖾𝖾𝗋𝗂𝗈.", event.threadID, event.messageID);
			}

			// Check if GoatBot utils are available
			if (!global.GoatBot || !global.utils) {
				return api.sendMessage("❌ 𝖦𝗈𝖺𝗍𝖡𝗈𝗍 𝗎𝗍𝗂𝗅𝗂𝗍𝗂𝖾𝗌 𝗇𝗈𝗍 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗌𝗍𝖺𝗋𝗍 𝗍𝗁𝖾 𝖻𝗈𝗍.", event.threadID, event.messageID);
			}

			const { configCommands } = global.GoatBot;
			const { log, loadScripts, unloadScripts } = global.utils;

			if (!args[0]) {
				return api.sendMessage(`⚠️ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗎𝗌𝖺𝗀𝖾!\n\n𝖦𝗎𝗂𝖽𝖾:\n${this.config.guide.en}`, event.threadID, event.messageID);
			}

			switch (args[0]) {
				case "load": {
					if (!args[1]) return api.sendMessage(getText("missingFileName"), event.threadID, event.messageID);

					try {
						const infoLoad = loadScripts("events", args[1], log, configCommands, api,
							global.GoatBot.threadModel,
							global.GoatBot.userModel,
							global.GoatBot.dashBoardModel,
							global.GoatBot.globalModel,
							global.GoatBot.threadsData,
							global.GoatBot.usersData,
							global.GoatBot.dashBoardData,
							global.GoatBot.globalData,
							getText
						);

						api.sendMessage(
							infoLoad.status === "success"
								? getText("loaded", infoLoad.name)
								: getText("loadedError", infoLoad.name, infoLoad.error, infoLoad.message),
							event.threadID,
							event.messageID
						);
					} catch (loadError) {
						console.error("💥 𝖫𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", loadError);
						api.sendMessage(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 "${args[1]}"`, event.threadID, event.messageID);
					}
					break;
				}

				case "loadAll": {
					try {
						const eventsDir = path.join(__dirname, "..", "events");
						if (!fs.existsSync(eventsDir)) {
							return api.sendMessage("❌ 𝖤𝗏𝖾𝗇𝗍𝗌 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽", event.threadID, event.messageID);
						}

						const allFile = fs.readdirSync(eventsDir)
							.filter(file => file.endsWith(".js") &&
								!file.match(/(eg)\.js$/g) &&
								(process.env.NODE_ENV === "development" ? true : !file.match(/(dev)\.js$/g)) &&
								!configCommands.commandEventUnload?.includes(file)
							)
							.map(item => item.split(".")[0]);

						const arraySucces = [];
						const arrayFail = [];

						for (const fileName of allFile) {
							try {
								const infoLoad = loadScripts("events", fileName, log, configCommands, api,
									global.GoatBot.threadModel,
									global.GoatBot.userModel,
									global.GoatBot.dashBoardModel,
									global.GoatBot.globalModel,
									global.GoatBot.threadsData,
									global.GoatBot.usersData,
									global.GoatBot.dashBoardData,
									global.GoatBot.globalData,
									getText
								);

								infoLoad.status === "success"
									? arraySucces.push(fileName)
									: arrayFail.push(`${fileName} => ${infoLoad.error.name}: ${infoLoad.error.message}`);
							} catch (fileError) {
								arrayFail.push(`${fileName} => 𝖫𝗈𝖺𝖽 𝖤𝗋𝗋𝗈𝗋: ${fileError.message}`);
							}
						}

						let msg = "";
						if (arraySucces.length > 0) msg += getText("loadedSuccess", arraySucces.length) + '\n';
						if (arrayFail.length > 0) msg += getText("loadedFail", arrayFail.length, "❗" + arrayFail.join("\n❗ "));

						api.sendMessage(msg || "⚠️ 𝖭𝗈 𝖿𝗂𝗅𝖾𝗌 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝖾𝖽", event.threadID, event.messageID);
					} catch (loadAllError) {
						console.error("💥 𝖫𝗈𝖺𝖽𝖠𝗅𝗅 𝖾𝗋𝗋𝗈𝗋:", loadAllError);
						api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝖺𝗅𝗅 𝖾𝗏𝖾𝗇𝗍𝗌", event.threadID, event.messageID);
					}
					break;
				}

				case "unload": {
					if (!args[1]) return api.sendMessage(getText("missingCommandNameUnload"), event.threadID, event.messageID);

					try {
						const infoUnload = unloadScripts("events", args[1], configCommands, getText);
						api.sendMessage(
							infoUnload.status === "success"
								? getText("unloaded", infoUnload.name)
								: getText("unloadedError", infoUnload.name, infoUnload.error.name, infoUnload.error.message),
							event.threadID,
							event.messageID
						);
					} catch (unloadError) {
						console.error("💥 𝖴𝗇𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", unloadError);
						api.sendMessage(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗎𝗇𝗅𝗈𝖺𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 "${args[1]}"`, event.threadID, event.messageID);
					}
					break;
				}

				case "install": {
					if (!args[1] || !args[2]) return api.sendMessage(getText("missingUrlCodeOrFileName"), event.threadID, event.messageID);

					let url = args[1];
					let fileName = args[2];
					let rawCode;

					try {
						if (url.endsWith(".js")) {
							[fileName, url] = [url, fileName];
						}

						if (url.match(/https?:\/\//)) {
							const domain = getDomain(url);
							if (!domain) return api.sendMessage(getText("invalidUrlOrCode"), event.threadID, event.messageID);

							// URL processing
							if (domain === "pastebin.com") {
								url = url.replace(/pastebin\.com\/(?!raw\/)/, "pastebin.com/raw/");
							} else if (domain === "github.com") {
								url = url.replace(/github\.com\/(.*)\/blob\//, "raw.githubusercontent.com/$1/");
							}

							try {
								const response = await axios.get(url, { timeout: 30000 });
								rawCode = response.data;

								if (domain === "savetext.net") {
									const $ = cheerio.load(rawCode);
									rawCode = $("#content").text();
								}
							} catch (error) {
								return api.sendMessage(getText("invalidUrlOrCode"), event.threadID, event.messageID);
							}
						} else {
							rawCode = event.body.slice(event.body.indexOf(args[0]) + args[0].length + 1);
							rawCode = rawCode.split(' ').slice(1).join(' ');
						}

						if (!rawCode) return api.sendMessage(getText("invalidUrlOrCode"), event.threadID, event.messageID);

						const filePath = path.join(__dirname, "..", "events", fileName);
						if (fs.existsSync(filePath)) {
							api.sendMessage(getText("alreadExist"), event.threadID, (err, info) => {
								if (err) {
									console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", err);
									return;
								}
								
								global.GoatBot.onReaction.set(info.messageID, {
									commandName: this.config.name,
									messageID: info.messageID,
									type: "install",
									author: event.senderID,
									data: { fileName, rawCode }
								});
							});
						} else {
							const infoLoad = loadScripts("events", fileName, log, configCommands, api,
								global.GoatBot.threadModel,
								global.GoatBot.userModel,
								global.GoatBot.dashBoardModel,
								global.GoatBot.globalModel,
								global.GoatBot.threadsData,
								global.GoatBot.usersData,
								global.GoatBot.dashBoardData,
								global.GoatBot.globalData,
								getText,
								rawCode
							);

							api.sendMessage(
								infoLoad.status === "success"
									? getText("installed", infoLoad.name, filePath)
									: getText("installedError", infoLoad.name, infoLoad.error.name, infoLoad.error.message),
								event.threadID,
								event.messageID
							);
						}
					} catch (installError) {
						console.error("💥 𝖨𝗇𝗌𝗍𝖺𝗅𝗅 𝖾𝗋𝗋𝗈𝗋:", installError);
						api.sendMessage("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖼𝗈𝗆𝗆𝖺𝗇𝖽", event.threadID, event.messageID);
					}
					break;
				}

				default:
					api.sendMessage(`⚠️ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗎𝗌𝖺𝗀𝖾!\n\n𝖦𝗎𝗂𝖽𝖾:\n${this.config.guide.en}`, event.threadID, event.messageID);
			}
		} catch (error) {
			console.error("💥 𝖤𝗏𝖾𝗇𝗍 𝖬𝖺𝗇𝖺𝗀𝖾𝗋 𝖤𝗋𝗋𝗈𝗋:", error);
			api.sendMessage("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖼𝗈𝗆𝗆𝖺𝗇𝖽", event.threadID, event.messageID);
		}
	},

	handleReaction: async function ({ event, api, getText, Reaction }) {
		try {
			const { author, messageID, data } = Reaction;
			if (event.userID !== author) return;

			const { fileName, rawCode } = data;
			const { configCommands } = global.GoatBot;
			const { log, loadScripts } = global.utils;

			const infoLoad = loadScripts("events", fileName, log, configCommands, api,
				global.GoatBot.threadModel,
				global.GoatBot.userModel,
				global.GoatBot.dashBoardModel,
				global.GoatBot.globalModel,
				global.GoatBot.threadsData,
				global.GoatBot.usersData,
				global.GoatBot.dashBoardData,
				global.GoatBot.globalData,
				getText,
				rawCode
			);

			api.sendMessage(
				infoLoad.status === "success"
					? getText("installed", infoLoad.name, path.join(__dirname, "..", "events", fileName))
					: getText("installedError", infoLoad.name, infoLoad.error.name, infoLoad.error.message),
				event.threadID,
				() => api.unsend(messageID)
			);
		} catch (error) {
			console.error("💥 𝖱𝖾𝖺𝖼𝗍𝗂𝗈𝗇 𝖧𝖺𝗇𝖽𝗅𝖾𝗋 𝖤𝗋𝗋𝗈𝗋:", error);
		}
	}
};
