const axios = require("axios");

module.exports = {
	config: {
		name: "setavt",
		aliases: [],
		version: "2.0",
		author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
		countDown: 5,
		role: 2,
		category: "owner",
		shortDescription: {
			en: "🖼️ 𝐂𝐡𝐚𝐧𝐠𝐞 𝐛𝐨𝐭 𝐚𝐯𝐚𝐭𝐚𝐫"
		},
		longDescription: {
			en: "🖼️ 𝐂𝐡𝐚𝐧𝐠𝐞 𝐛𝐨𝐭 𝐚𝐯𝐚𝐭𝐚𝐫 𝐰𝐢𝐭𝐡 𝐔𝐑𝐋 𝐨𝐫 𝐫𝐞𝐩𝐥𝐢𝐞𝐝 𝐢𝐦𝐚𝐠𝐞. 𝐒𝐮𝐩𝐩𝐨𝐫𝐭𝐬 𝐨𝐩𝐭𝐢𝐨𝐧𝐚𝐥 𝐜𝐚𝐩𝐭𝐢𝐨𝐧 𝐚𝐧𝐝 𝐭𝐞𝐦𝐩𝐨𝐫𝐚𝐫𝐲 𝐚𝐯𝐚𝐭𝐚𝐫 𝐞𝐱𝐩𝐢𝐫𝐚𝐭𝐢𝐨𝐧."
		},
		guide: {
			en: "╭─━━━━━━━━━━━━━─╮\n" +
				"│   𝐀𝐕𝐀𝐓𝐀𝐑 𝐆𝐔𝐈𝐃𝐄   │\n" +
				"╰─━━━━━━━━━━━━━─╯\n" +
				"🔹 {p}setavt [𝐢𝐦𝐚𝐠𝐞 𝐔𝐑𝐋]\n" +
				"🔹 {p}setavt [𝐢𝐦𝐚𝐠𝐞 𝐔𝐑𝐋] [𝐜𝐚𝐩𝐭𝐢𝐨𝐧]\n" +
				"🔹 {p}setavt [𝐢𝐦𝐚𝐠𝐞 𝐔𝐑𝐋] [𝐜𝐚𝐩𝐭𝐢𝐨𝐧] [𝐞𝐱𝐩𝐢𝐫𝐚𝐭𝐢𝐨𝐧𝐢𝐧 𝐬𝐞𝐜𝐨𝐧𝐝𝐬]\n" +
				"🔹 𝐑𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚𝐧 𝐢𝐦𝐚𝐠𝐞 𝐰𝐢𝐭𝐡: {p}setavt\n\n" +
				"╭─━━━━━━━━━━─╮\n" +
				"│  𝐄𝐗𝐀𝐌𝐏𝐋𝐄𝐒  │\n" +
				"╰─━━━━━━━━━━─╯\n" +
				"✨ {p}setavt https://example.com/avatar.jpg\n" +
				"✨ {p}setavt https://example.com/avatar.jpg \"𝐌𝐲 𝐧𝐞𝐰 𝐥𝐨𝐨𝐤\"\n" +
				"✨ {p}setavt https://example.com/avatar.jpg \"𝐓𝐞𝐦𝐩 𝐚𝐯𝐚𝐭𝐚𝐫\" 3600"
		}
	},

	onStart: async function ({ message, event, args, api }) {
		try {
			// 𝐃𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐲 𝐯𝐚𝐥𝐢𝐝𝐚𝐭𝐢𝐨𝐧
			if (typeof axios !== 'object' || typeof axios.get !== 'function') {
				return message.reply("❌ 𝐑𝐞𝐪𝐮𝐢𝐫𝐞𝐝 𝐝𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐲 '𝐚𝐱𝐢𝐨𝐬' 𝐢𝐬 𝐦𝐢𝐬𝐬𝐢𝐧𝐠 𝐨𝐫 𝐜𝐨𝐫𝐫𝐮𝐩𝐭𝐞𝐝.");
			}

			// 𝐏𝐚𝐫𝐬𝐞 𝐚𝐫𝐠𝐮𝐦𝐞𝐧𝐭𝐬 𝐚𝐧𝐝 𝐞𝐱𝐭𝐫𝐚𝐜𝐭 𝐢𝐦𝐚𝐠𝐞 𝐔𝐑𝐋
			let imageURL = null;
			let caption = "";
			let expirationAfter = null;

			// 𝐂𝐡𝐞𝐜𝐤 𝐢𝐟 𝐟𝐢𝐫𝐬𝐭 𝐚𝐫𝐠𝐮𝐦𝐞𝐧𝐭 𝐢𝐬 𝐚 𝐔𝐑𝐋
			if (args[0] && (args[0].startsWith("http://") || args[0].startsWith("https://"))) {
				imageURL = args[0];
				args.shift();
			}

			// 𝐂𝐡𝐞𝐜𝐤 𝐟𝐨𝐫 𝐚𝐭𝐭𝐚𝐜𝐡𝐦𝐞𝐧𝐭𝐬 𝐢𝐧 𝐜𝐮𝐫𝐫𝐞𝐧𝐭 𝐦𝐞𝐬𝐬𝐚𝐠𝐞
			if (!imageURL && event.attachments && event.attachments.length > 0) {
				const imageAttachment = event.attachments.find(att => 
					att.type === "photo" || att.type === "animated_image" || 
					(att.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(att.url))
				);
				if (imageAttachment) {
					imageURL = imageAttachment.url;
				}
			}

			// 𝐂𝐡𝐞𝐜𝐤 𝐟𝐨𝐫 𝐚𝐭𝐭𝐚𝐜𝐡𝐦𝐞𝐧𝐭𝐬 𝐢𝐧 𝐫𝐞𝐩𝐥𝐢𝐞𝐝 𝐦𝐞𝐬𝐬𝐚𝐠𝐞
			if (!imageURL && event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
				const imageAttachment = event.messageReply.attachments.find(att => 
					att.type === "photo" || att.type === "animated_image" || 
					(att.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(att.url))
				);
				if (imageAttachment) {
					imageURL = imageAttachment.url;
				}
			}

			// 𝐈𝐟 𝐬𝐭𝐢𝐥𝐥 𝐧𝐨 𝐢𝐦𝐚𝐠𝐞 𝐟𝐨𝐮𝐧𝐝, 𝐬𝐡𝐨𝐰 𝐮𝐬𝐚𝐠𝐞
			if (!imageURL) {
				return message.reply(`❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚𝐧 𝐢𝐦𝐚𝐠𝐞 𝐔𝐑𝐋 𝐨𝐫 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐭𝐡𝐚𝐭 𝐜𝐨𝐧𝐭𝐚𝐢𝐧𝐬 𝐚𝐧 𝐢𝐦𝐚𝐠𝐞.\n\n${this.config.guide.en.replace(/{p}/g, this.config.name)}`);
			}

			// 𝐕𝐚𝐥𝐢𝐝𝐚𝐭𝐞 𝐔𝐑𝐋 𝐟𝐨𝐫𝐦𝐚𝐭
			try {
				new URL(imageURL);
			} catch (urlError) {
				return message.reply(`❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐔𝐑𝐋 𝐟𝐨𝐫𝐦𝐚𝐭: ${imageURL}`);
			}

			// 𝐏𝐚𝐫𝐬𝐞 𝐫𝐞𝐦𝐚𝐢𝐧𝐢𝐧𝐠 𝐚𝐫𝐠𝐮𝐦𝐞𝐧𝐭𝐬 𝐟𝐨𝐫 𝐜𝐚𝐩𝐭𝐢𝐨𝐧 𝐚𝐧𝐝 𝐞𝐱𝐩𝐢𝐫𝐚𝐭𝐢𝐨𝐧
			const remainingArgs = [...args];
			
			// 𝐂𝐡𝐞𝐜𝐤 𝐢𝐟 𝐥𝐚𝐬𝐭 𝐚𝐫𝐠𝐮𝐦𝐞𝐧𝐭 𝐢𝐬 𝐚 𝐧𝐮𝐦𝐛𝐞𝐫 (𝐞𝐱𝐩𝐢𝐫𝐚𝐭𝐢𝐨𝐧)
			if (remainingArgs.length > 0) {
				const lastArg = remainingArgs[remainingArgs.length - 1];
				if (!isNaN(lastArg) && lastArg.trim() !== "") {
					expirationAfter = parseInt(lastArg);
					if (expirationAfter > 0) {
						remainingArgs.pop();
					} else {
						expirationAfter = null;
					}
				}
			}

			// 𝐑𝐞𝐦𝐚𝐢𝐧𝐢𝐧𝐠 𝐚𝐫𝐠𝐬 𝐛𝐞𝐜𝐨𝐦𝐞 𝐜𝐚𝐩𝐭𝐢𝐨𝐧
			caption = remainingArgs.join(" ").trim();

			// 𝐕𝐚𝐥𝐢𝐝𝐚𝐭𝐞 𝐞𝐱𝐩𝐢𝐫𝐚𝐭𝐢𝐨𝐧 𝐯𝐚𝐥𝐮𝐞
			if (expirationAfter !== null && (expirationAfter < 60 || expirationAfter > 2592000)) {
				return message.reply("❌ 𝐄𝐱𝐩𝐢𝐫𝐚𝐭𝐢𝐨𝐧 𝐭𝐢𝐦𝐞 𝐦𝐮𝐬𝐭 𝐛𝐞 𝐛𝐞𝐭𝐰𝐞𝐞𝐧 𝟔𝟎 𝐬𝐞𝐜𝐨𝐧𝐝𝐬 (𝟏 𝐦𝐢𝐧𝐮𝐭𝐞) 𝐚𝐧𝐝 𝟐𝟓𝟗𝟐𝟎𝟎𝟎 𝐬𝐞𝐜𝐨𝐧𝐝𝐬 (𝟑𝟎 𝐝𝐚𝐲𝐬).");
			}

			// 𝐒𝐞𝐧𝐝 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐦𝐞𝐬𝐬𝐚𝐠𝐞
			const processingMsg = await message.reply("⏳ 𝐅𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐢𝐦𝐚𝐠𝐞 𝐚𝐧𝐝 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠...");

			// 𝐅𝐞𝐭𝐜𝐡 𝐢𝐦𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐜𝐨𝐦𝐩𝐫𝐞𝐡𝐞𝐧𝐬𝐢𝐯𝐞 𝐞𝐫𝐫𝐨𝐫 𝐡𝐚𝐧𝐝𝐥𝐢𝐧𝐠
			let response;
			try {
				response = await axios.get(imageURL, { 
					responseType: "stream", 
					timeout: 30000,
					maxContentLength: 8 * 1024 * 1024,
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
						'Accept': 'image/jpeg,image/png,image/gif,image/webp,*/*'
					}
				});
			} catch (fetchError) {
				await message.unsend(processingMsg.messageID);
				
				if (fetchError.code === 'ECONNREFUSED') {
					return message.reply("❌ 𝐂𝐚𝐧𝐧𝐨𝐭 𝐜𝐨𝐧𝐧𝐞𝐜𝐭 𝐭𝐨 𝐭𝐡𝐞 𝐢𝐦𝐚𝐠𝐞 𝐬𝐞𝐫𝐯𝐞𝐫. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐜𝐡𝐞𝐜𝐤 𝐭𝐡𝐞 𝐔𝐑𝐋.");
				} else if (fetchError.code === 'ETIMEDOUT') {
					return message.reply("❌ 𝐑𝐞𝐪𝐮𝐞𝐬𝐭 𝐭𝐢𝐦𝐞𝐝 𝐨𝐮𝐭. 𝐓𝐡𝐞 𝐢𝐦𝐚𝐠𝐞 𝐬𝐞𝐫𝐯𝐞𝐫 𝐢𝐬 𝐭𝐚𝐤𝐢𝐧𝐠 𝐭𝐨𝐨 𝐥𝐨𝐧𝐠 𝐭𝐨 𝐫𝐞𝐬𝐩𝐨𝐧𝐝.");
				} else if (fetchError.response) {
					return message.reply(`❌ 𝐇𝐓𝐓𝐏 𝐄𝐫𝐫𝐨𝐫: ${fetchError.response.status} - ${fetchError.response.statusText}`);
				} else {
					return message.reply(`❌ 𝐄𝐫𝐫𝐨𝐫 𝐟𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐢𝐦𝐚𝐠𝐞: ${fetchError.message}`);
				}
			}

			// 𝐕𝐚𝐥𝐢𝐝𝐚𝐭𝐞 𝐜𝐨𝐧𝐭𝐞𝐧𝐭-𝐭𝐲𝐩𝐞 𝐡𝐞𝐚𝐝𝐞𝐫
			const contentType = response.headers['content-type'] || '';
			if (!contentType.includes('image/')) {
				await message.unsend(processingMsg.messageID);
				return message.reply(`❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐢𝐦𝐚𝐠𝐞 𝐟𝐨𝐫𝐦𝐚𝐭. 𝐑𝐞𝐜𝐞𝐢𝐯𝐞𝐝: ${contentType}. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐢𝐦𝐚𝐠𝐞 𝐔𝐑𝐋.`);
			}

			// 𝐕𝐚𝐥𝐢𝐝𝐚𝐭𝐞 𝐟𝐢𝐥𝐞 𝐬𝐢𝐳𝐞
			const contentLength = response.headers['content-length'];
			if (contentLength && parseInt(contentLength) > 8 * 1024 * 1024) {
				await message.unsend(processingMsg.messageID);
				return message.reply("❌ 𝐈𝐦𝐚𝐠𝐞 𝐢𝐬 𝐭𝐨𝐨 𝐥𝐚𝐫𝐠𝐞. 𝐌𝐚𝐱𝐢𝐦𝐮𝐦 𝐬𝐢𝐳𝐞 𝐢𝐬 𝟖𝐌𝐁.");
			}

			// 𝐒𝐞𝐭 𝐩𝐚𝐭𝐡 𝐟𝐨𝐫 𝐬𝐭𝐫𝐞𝐚𝐦 𝐜𝐨𝐦𝐩𝐚𝐭𝐢𝐛𝐢𝐥𝐢𝐭𝐲
			if (response.data && typeof response.data === 'object') {
				response.data.path = "avatar.jpg";
			}

			// 𝐔𝐩𝐝𝐚𝐭𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐦𝐞𝐬𝐬𝐚𝐠𝐞
			await message.unsend(processingMsg.messageID);
			const updatingMsg = await message.reply("🔄 𝐔𝐩𝐝𝐚𝐭𝐢𝐧𝐠 𝐛𝐨𝐭 𝐚𝐯𝐚𝐭𝐚𝐫...");

			// 𝐀𝐭𝐭𝐞𝐦𝐩𝐭 𝐭𝐨 𝐜𝐡𝐚𝐧𝐠𝐞 𝐚𝐯𝐚𝐭𝐚𝐫
			try {
				const expirationMs = expirationAfter ? expirationAfter * 1000 : null;
				
				api.changeAvatar(response.data, caption || "", expirationMs, (err) => {
					if (err) {
						message.unsend(updatingMsg.messageID);
						
						let errorMessage = "❌ 𝐄𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐜𝐡𝐚𝐧𝐠𝐢𝐧𝐠 𝐚𝐯𝐚𝐭𝐚𝐫.";
						
						if (err.message.includes('permission')) {
							errorMessage += "\n🔒 𝐈𝐧𝐬𝐮𝐟𝐟𝐢𝐜𝐢𝐞𝐧𝐭 𝐩𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧𝐬 𝐭𝐨 𝐜𝐡𝐚𝐧𝐠𝐞 𝐚𝐯𝐚𝐭𝐚𝐫.";
						} else if (err.message.includes('rate limit')) {
							errorMessage += "\n⏳ 𝐑𝐚𝐭𝐞 𝐥𝐢𝐦𝐢𝐭 𝐞𝐱𝐜𝐞𝐞𝐝𝐞𝐝. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.";
						} else if (err.message) {
							errorMessage += `\n📄 ${err.message}`;
						}
						
						return message.reply(errorMessage);
					}
					
					message.unsend(updatingMsg.messageID);
					
					let successMessage = "✅ 𝐁𝐨𝐭 𝐚𝐯𝐚𝐭𝐚𝐫 𝐜𝐡𝐚𝐧𝐠𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!";
					if (caption) {
						successMessage += `\n📝 𝐂𝐚𝐩𝐭𝐢𝐨𝐧: ${caption}`;
					}
					if (expirationAfter) {
						const hours = Math.floor(expirationAfter / 3600);
						const minutes = Math.floor((expirationAfter % 3600) / 60);
						successMessage += `\n⏰ 𝐄𝐱𝐩𝐢𝐫𝐞𝐬 𝐢𝐧: ${hours}𝐡 ${minutes}𝐦`;
					}
					
					return message.reply(successMessage);
				});
				
			} catch (avatarError) {
				await message.unsend(updatingMsg.messageID);
				
				console.error("𝐀𝐯𝐚𝐭𝐚𝐫 𝐂𝐡𝐚𝐧𝐠𝐞 𝐄𝐫𝐫𝐨𝐫:", avatarError);
				return message.reply("❌ 𝐔𝐧𝐞𝐱𝐩𝐞𝐜𝐭𝐞𝐝 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐜𝐡𝐚𝐧𝐠𝐢𝐧𝐠 𝐚𝐯𝐚𝐭𝐚𝐫.");
			}

		} catch (error) {
			console.error("💥 𝐒𝐞𝐭𝐚𝐯𝐭 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐄𝐫𝐫𝐨𝐫:", error);
			
			let errorMessage = "❌ 𝐀𝐧 𝐮𝐧𝐞𝐱𝐩𝐞𝐜𝐭𝐞𝐝 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐫𝐞𝐪𝐮𝐞𝐬𝐭.";
			
			if (error.code === 'ENOTFOUND') {
				errorMessage = "❌ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐫𝐞𝐬𝐨𝐥𝐯𝐞 𝐭𝐡𝐞 𝐝𝐨𝐦𝐚𝐢𝐧 𝐧𝐚𝐦𝐞. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐜𝐡𝐞𝐜𝐤 𝐭𝐡𝐞 𝐔𝐑𝐋.";
			} else if (error.message.includes('timeout')) {
				errorMessage = "❌ 𝐎𝐩𝐞𝐫𝐚𝐭𝐢𝐨𝐧 𝐭𝐢𝐦𝐞𝐝 𝐨𝐮𝐭. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧.";
			}
			
			return message.reply(errorMessage);
		}
	}
};
