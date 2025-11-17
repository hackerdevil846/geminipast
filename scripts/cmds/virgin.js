const axios = require('axios');
const fs = require("fs");
const path = require("path");

module.exports = {
	config: {
		name: "virgin",
		version: "1.0.1",
		author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
		countDown: 5,
		role: 0,
		shortDescription: "Random Virgin babuder chobi",
		longDescription: "Random Virgin babuder sonder chobi dekhanor command",
		category: "random-img",
		usages: "{p}virgin"
	},

	onStart: async function ({ api, event }) {
		// Primary API URL
		const primaryApiUrl = 'https://ngoctrinh.ocvat2810.repl.co/';
		
		// Backup image links
		const backupLinks = [
			"https://i.ibb.co/jfqMF07/image.jpg",
			"https://i.ibb.co/tBBCS4y/image.jpg",
			"https://i.ibb.co/3zpyMVY/image.jpg",
			"https://i.ibb.co/gWbWT8k/image.jpg",
			"https://i.ibb.co/mHtyD1P/image.jpg",
			"https://i.ibb.co/vPHNhdY/image.jpg",
			"https://i.ibb.co/rm6rPjb/image.jpg",
			"https://i.ibb.co/7GpN2GW/image.jpg",
			"https://i.ibb.co/CnfMVpg/image.jpg"
		];

		let imageUrl;

		try {
			// Primary API try
			const res = await axios.get(primaryApiUrl);
			imageUrl = res.data.data;
		} catch (error) {
			// Backup image selection
			console.log("Primary API failed, using backup images");
			const randomIndex = Math.floor(Math.random() * backupLinks.length);
			imageUrl = backupLinks[randomIndex];
		}

		try {
			// Get image extension
			let ext = path.extname(imageUrl) || '.jpg';
			if (ext.includes('?')) ext = ext.split('?')[0];

			const imagePath = path.join(__dirname, 'cache', `virgin${ext}`);

			// Download image
			const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
			fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));

			// Send image
			api.sendMessage({
				attachment: fs.createReadStream(imagePath)
			}, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);

		} catch (error) {
			console.error("Error processing image:", error);
			api.sendMessage("❌ Image download korte parchi na, abar chesta korun", event.threadID, event.messageID);
		}
	}
};
