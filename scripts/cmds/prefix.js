const fs = require("fs-extra");
const { utils } = global;

module.exports = {
	config: {
		name: "prefix",
		version: "2.0",
		author: "NTKhang + Modified by XNIL & Asif Mahmud",
		countDown: 5,
		role: 0,
		description: "Change bot prefix in your group or globally",
		category: "config",
		guide: {
			en: "{pn} <new prefix>: change prefix in this group\n"
				+ "{pn} <new prefix> -g: change global prefix (admin only)\n"
				+ "{pn} reset: reset prefix to default"
		}
	},

	langs: {
		en: {
			reset: "✅ Prefix reset to default:\n➡️  System prefix: %1",
			onlyAdmin: "⛔ Only admin can change the system-wide prefix.",
			confirmGlobal: "⚙️ Global prefix change requested.\n🪄 React to confirm.\n📷 See media below.",
			confirmThisThread: "🛠️ Group prefix change requested.\n🪄 React to confirm.\n📷 See media below.",
			successGlobal: "✅ Global prefix changed successfully!\n🆕 New prefix: %1",
			successThisThread: "✅ Group prefix updated!\n🆕 New prefix: %1",
			mediaError: "📄 Showing prefix information"
		}
	},

	// Random media URLs array
	mediaUrls: [
		"https://drive.google.com/uc?export=download&id=1cyB6E3z4-_Dr4mlYFB87DlWkUlC_KvrR",
		"https://drive.google.com/uc?export=download&id=1Q5L8SGKYpNrXtJ6mffcwMA9bcUtegtga",
		"https://drive.google.com/uc?export=download&id=1u8JzKCTubRhnh0APo2mMob-mQM0CoNYj",
		"https://drive.google.com/uc?export=download&id=1JBIo966g0MmUT27S1yc0B06lASt4dD9V",
		"https://drive.google.com/uc?export=download&id=1w_HUyAFHnVfkUl8XLY01pxs8dnmQNEVn",
		"https://drive.google.com/uc?export=download&id=1EoeMITZrSNB1PpPjsh5cmsFzbjMZKH2c",
		"https://drive.google.com/uc?export=download&id=1Kh4qvle57FlMjcam-JNxTQtPZe2uxrJ8",
		"https://drive.google.com/uc?export=download&id=1KtyLzqbyJpq5_ke0Cb6gD89ZNf0NQm0t",
		"https://drive.google.com/uc?export=download&id=1vy0ZldnlTqXgwJ36HxOXC9hLObgNkTZ-",
		"https://i.imgur.com/QlnhAph.mp4",
		"https://i.imgur.com/kOzX5YP.mp4",
		"https://i.imgur.com/9A2uka3.mp4",
		"https://i.imgur.com/wFQfVfE.mp4",
		"https://i.imgur.com/CSdSAi7.mp4",
		"https://i.imgur.com/oOD0jJW.mp4",
		"https://i.imgur.com/s7l7Sjm.mp4",
		"https://i.imgur.com/YGfF4tz.mp4",
		"https://i.imgur.com/F5UzBPK.mp4",
		"https://i.imgur.com/AQj1Rhz.mp4",
		"https://i.imgur.com/1hYLk2n.mp4",
		"https://i.imgur.com/gksDFfF.mp4",
		"https://i.imgur.com/8atPovs.mp4",
		"https://i.imgur.com/8BbEtUG.mp4",
		"https://i.imgur.com/ZYNE9XV.mp4",
		"https://i.imgur.com/1MmiyS2.mp4",
		"https://i.imgur.com/j6UUgCC.mp4",
		"https://i.imgur.com/eaIeQI3.mp4",
		"https://i.imgur.com/yTLLAB9.mp4",
		"https://i.imgur.com/8OlhZRR.mp4",
		"https://i.imgur.com/THk7qF4.mp4",
		"https://i.imgur.com/ahvJHns.mp4",
		"https://i.imgur.com/uf4EBBk.mp4",
		"https://i.imgur.com/eTOLz0x.mp4"
	],

	// Fallback image
	fallbackImage: "https://files.catbox.moe/e7bozl.jpg",

	// Function to get random media
	getRandomMedia: function() {
		const randomIndex = Math.floor(Math.random() * this.mediaUrls.length);
		return this.mediaUrls[randomIndex];
	},

	// Function to safely get media stream
	getMediaStream: async function(url) {
		try {
			const stream = await global.utils.getStreamFromURL(url);
			if (stream) return stream;
			throw new Error("Stream not available");
		} catch (error) {
			console.log("Media failed, using fallback:", url);
			return await global.utils.getStreamFromURL(this.fallbackImage);
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		if (!args[0]) return message.SyntaxError();

		if (args[0] === "reset") {
			await threadsData.set(event.threadID, null, "data.prefix");
			const randomMedia = this.getRandomMedia();
			const mediaStream = await this.getMediaStream(randomMedia);
			
			return message.reply({
				body: getLang("reset", global.GoatBot.config.prefix),
				attachment: mediaStream
			});
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix,
			setGlobal: args[1] === "-g"
		};

		if (formSet.setGlobal && role < 2)
			return message.reply(getLang("onlyAdmin"));

		const confirmMsg = formSet.setGlobal ? getLang("confirmGlobal") : getLang("confirmThisThread");
		const randomMedia = this.getRandomMedia();
		const mediaStream = await this.getMediaStream(randomMedia);

		return message.reply({
			body: confirmMsg,
			attachment: mediaStream
		}, (err, info) => {
			if (err) {
				console.error("Error sending message:", err);
				return message.reply(getLang("mediaError"));
			}
			formSet.messageID = info.messageID;
			global.GoatBot.onReaction.set(info.messageID, formSet);
		});
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author) return;

		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			
			const randomMedia = this.getRandomMedia();
			const mediaStream = await this.getMediaStream(randomMedia);
			
			return message.reply({
				body: getLang("successGlobal", newPrefix),
				attachment: mediaStream
			});
		} else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			
			const randomMedia = this.getRandomMedia();
			const mediaStream = await this.getMediaStream(randomMedia);
			
			return message.reply({
				body: getLang("successThisThread", newPrefix),
				attachment: mediaStream
			});
		}
	},

	onChat: async function ({ event, message }) {
		if (event.body && event.body.toLowerCase() === "prefix") {
			const systemPrefix = global.GoatBot.config.prefix;
			const groupPrefix = utils.getPrefix(event.threadID);
			const senderID = event.senderID;

			const dateTime = new Date().toLocaleString("en-US", {
				timeZone: "Asia/Dhaka",
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
				day: "2-digit",
				month: "2-digit",
				year: "numeric"
			});

			const [datePart, timePart] = dateTime.split(", ");

			const infoBox = `
╔═════『✨ 𝖠𝖲𝖲𝖠𝖫𝖠𝖬𝖴𝖠𝖫𝖠𝖨𝖪𝖴𝖬 CHATBOT 𝐏𝐑𝐄𝐅𝐈𝐗 ✨』════╗
🌐 System Prefix  : ${systemPrefix.padEnd(10)}
💬 Group Prefix   : ${groupPrefix.padEnd(10)} 
🕒 Time           : ${timePart.padEnd(10)} 
📅 Date           : ${datePart.padEnd(10)}
╚══════════════════╝`;

			const randomMedia = this.getRandomMedia();
			const mediaStream = await this.getMediaStream(randomMedia);

			return message.reply({
				body: infoBox,
				attachment: mediaStream
			});
		}
	}
};
