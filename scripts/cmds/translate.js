const axios = require('axios');
const defaultEmojiTranslate = "🌐";

module.exports = {
	config: {
		name: "translate",
		aliases: [],
		version: "2.0.0",
		author: "Asif Mahmud",
		countDown: 5,
		role: 0,
		category: "utility",
		shortDescription: {
			en: "🌍 Translate text to any language"
		},
		longDescription: {
			en: "Advanced text translation with auto-translate on reaction feature"
		},
		guide: {
			en: "   {p}translate <text> -> <language>: Translate text to specific language\n   {p}translate <text>: Translate to bot's default language\n   {p}translate -r on/off: Toggle auto-translate on reaction\n   {p}translate -r set <emoji>: Set custom translate emoji\n   Example: {p}translate hello -> vi\n   Example: {p}translate -r on"
		}
	},

	langs: {
		en: {
			translateTo: "🌐 Translated from %1 to %2",
			invalidArgument: "❌ Invalid argument. Please use 'on' or 'off'",
			turnOnTransWhenReaction: `✅ Auto-translate enabled! React with "${defaultEmojiTranslate}" to any message to translate it.`,
			turnOffTransWhenReaction: "✅ Auto-translate disabled",
			inputEmoji: "🌀 Please react to this message to set a custom translate emoji",
			emojiSet: "✅ Translate emoji set to: %1",
			noText: "❌ Please provide text to translate",
			translationError: "❌ Translation failed. Please try again.",
			invalidLanguage: "❌ Invalid language code. Use 2-3 letter codes like: en, es, fr, de, ja, ko, vi, zh, ar, hi"
		}
	},

	onStart: async function ({ message, event, args, threadsData, getLang, commandName }) {
		try {
			// Handle reaction settings
			if (["-r", "-react", "-reaction"].includes(args[0]?.toLowerCase())) {
				if (args[1]?.toLowerCase() === "set") {
					return message.reply(getLang("inputEmoji"), (err, info) => {
						if (err) return;
						
						global.GoatBot.onReaction.set(info.messageID, {
							type: "setEmoji",
							commandName,
							messageID: info.messageID,
							authorID: event.senderID,
							threadID: event.threadID
						});
					});
				}
				
				const isEnable = args[1]?.toLowerCase() === "on" ? true : 
								args[1]?.toLowerCase() === "off" ? false : null;
				
				if (isEnable === null) {
					return message.reply(getLang("invalidArgument"));
				}
				
				await threadsData.set(event.threadID, isEnable, "data.translate.autoTranslateWhenReaction");
				return message.reply(isEnable ? getLang("turnOnTransWhenReaction") : getLang("turnOffTransWhenReaction"));
			}

			const { body = "" } = event;
			let content;
			let targetLanguage;

			// Handle message replies
			if (event.messageReply) {
				content = event.messageReply.body;
				if (!content || content.trim() === "") {
					return message.reply(getLang("noText"));
				}

				// Extract language from command if provided
				const langMatch = body.match(/(?:->|=>)\s*(\w{2,3})$/i);
				if (langMatch) {
					targetLanguage = langMatch[1].toLowerCase();
				} else {
					// Use thread language or bot default
					const threadLang = await threadsData.get(event.threadID, "data.lang");
					targetLanguage = threadLang || global.GoatBot.config.language;
				}
			} 
			// Handle direct text input
			else {
				const text = body.replace(new RegExp(`^\.?${commandName}\\s*`, 'i'), '').trim();
				
				// Check for language specification
				const langMatch = text.match(/(.*?)\s*(?:->|=>)\s*(\w{2,3})$/i);
				if (langMatch) {
					content = langMatch[1].trim();
					targetLanguage = langMatch[2].toLowerCase();
				} else {
					content = text;
					const threadLang = await threadsData.get(event.threadID, "data.lang");
					targetLanguage = threadLang || global.GoatBot.config.language;
				}
			}

			// Validate content
			if (!content || content.trim() === "") {
				return message.reply(getLang("noText"));
			}

			// Validate language code (2-3 letters)
			if (!targetLanguage || !/^[a-z]{2,3}$/i.test(targetLanguage)) {
				return message.reply(getLang("invalidLanguage"));
			}

			// Perform translation
			await this.translateAndSendMessage(content, targetLanguage, message, getLang);

		} catch (error) {
			console.error("Translate command error:", error);
			await message.reply(getLang("translationError"));
		}
	},

	onChat: async function ({ event, threadsData }) {
		try {
			// Check if auto-translate is enabled for this thread
			const isAutoTranslateEnabled = await threadsData.get(event.threadID, "data.translate.autoTranslateWhenReaction");
			
			if (!isAutoTranslateEnabled || event.senderID === global.GoatBot.botID) {
				return;
			}

			// Set up reaction for translation
			global.GoatBot.onReaction.set(event.messageID, {
				commandName: 'translate',
				messageID: event.messageID,
				body: event.body,
				type: "translate",
				threadID: event.threadID
			});

		} catch (error) {
			console.error("Translate onChat error:", error);
		}
	},

	onReaction: async function ({ message, Reaction, event, threadsData, getLang }) {
		try {
			switch (Reaction.type) {
				case "setEmoji": {
					// Only allow the original author to set emoji
					if (event.userID !== Reaction.authorID) {
						return;
					}

					const emoji = event.reaction;
					if (!emoji) {
						return;
					}

					// Save custom emoji for this thread
					await threadsData.set(event.threadID, emoji, "data.translate.emojiTranslate");
					
					await message.reply(getLang("emojiSet", emoji));
					await message.unsend(Reaction.messageID);
					
					break;
				}

				case "translate": {
					// Get custom emoji or use default
					const customEmoji = await threadsData.get(event.threadID, "data.translate.emojiTranslate");
					const translateEmoji = customEmoji || defaultEmojiTranslate;

					// Check if the reaction matches our translate emoji
					if (event.reaction === translateEmoji) {
						const content = Reaction.body;
						
						if (!content || content.trim() === "") {
							return;
						}

						// Get target language for this thread
						const threadLang = await threadsData.get(event.threadID, "data.lang");
						const targetLanguage = threadLang || global.GoatBot.config.language;

						// Delete the reaction data
						Reaction.delete();

						// Perform translation
						await this.translateAndSendMessage(content, targetLanguage, message, getLang);
					}
					break;
				}
			}
		} catch (error) {
			console.error("Translate onReaction error:", error);
		}
	},

	// Helper function for translation
	translateAndSendMessage: async function (content, targetLanguage, message, getLang) {
		try {
			const { text, sourceLang } = await this.performTranslation(content, targetLanguage);
			
			const responseMessage = `${text}\n\n${getLang("translateTo", sourceLang, targetLanguage)}`;
			await message.reply(responseMessage);
			
		} catch (error) {
			console.error("Translation error:", error);
			await message.reply(getLang("translationError"));
		}
	},

	// Core translation function
	performTranslation: async function (text, targetLang) {
		try {
			const response = await axios.get(
				`https://translate.googleapis.com/translate_a/single`, {
				params: {
					client: 'gtx',
					sl: 'auto',
					tl: targetLang,
					dt: 't',
					q: text
				},
				timeout: 10000
			});

			if (!response.data || !Array.isArray(response.data[0])) {
				throw new Error("Invalid translation response");
			}

			const translatedText = response.data[0]
				.map(item => item[0])
				.filter(Boolean)
				.join('');

			const detectedLang = response.data[2] || 'auto';

			return {
				text: translatedText || text,
				sourceLang: detectedLang
			};

		} catch (error) {
			console.error("Translation API error:", error);
			throw new Error("Translation service unavailable");
		}
	}
};
