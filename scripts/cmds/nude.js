const axios = require("axios");

module.exports = {
	config: {
		name: "nude",
		aliases: [],
		version: "1.0",
		author: "Asif",
		countDown: 5,
		role: 2,
		shortDescription: "send you pic of nude",
		longDescription: "sends u pic of girls nude",
		category: "18+",
		guide: "{pn}",
		dependencies: {
			"axios": ""
		}
	},

	onStart: async function ({ message }) {
		try {
			// Dependency check
			let axiosAvailable = true;
			try {
				require("axios");
			} catch (e) {
				axiosAvailable = false;
			}

			if (!axiosAvailable) {
				console.error("❌ Missing dependencies");
				return; // Don't send error message to avoid spam
			}

			const link = [
				"https://i.imgur.com/GxPSGo9.jpg",
				"https://i.imgur.com/junGPIa.jpg",
				"https://i.imgur.com/BoJDDpm.jpg",
				"https://i.imgur.com/dxbjwmx.jpg",
				"https://i.imgur.com/pzJq8ay.jpg",
				"https://i.imgur.com/2iy9KnD.jpg",
				"https://i.imgur.com/CgAc5ux.jpg",
				"https://i.imgur.com/0bRLqAR.jpg",
				"https://i.imgur.com/E9PYK7J.jpg",
				"https://i.imgur.com/1oaM7ai.jpg"
			];

			// Select random image
			const randomIndex = Math.floor(Math.random() * link.length);
			const imgUrl = link[randomIndex];

			console.log(`🔄 Selected image: ${imgUrl}`);

			// Helper: download image with retry
			const downloadImageWithRetry = async (url, maxRetries = 2) => {
				for (let attempt = 1; attempt <= maxRetries; attempt++) {
					try {
						console.log(`📥 Downloading image (attempt ${attempt}): ${url}`);
						
						// Test if URL is accessible
						const headResponse = await axios.head(url, {
							timeout: 10000,
							headers: {
								'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
							}
						});

						// Verify content type is image
						const contentType = headResponse.headers['content-type'];
						if (!contentType || !contentType.startsWith('image/')) {
							throw new Error('URL does not point to an image');
						}

						// Download the image
						const response = await axios.get(url, {
							responseType: "stream",
							timeout: 15000,
							headers: {
								'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
							}
						});

						// Verify file has content
						if (!response.data) {
							throw new Error('Downloaded empty file');
						}

						console.log(`✅ Successfully downloaded image`);
						return response.data;

					} catch (error) {
						console.error(`❌ Download attempt ${attempt} failed:`, error.message);
						
						if (attempt === maxRetries) {
							throw error;
						}
						
						// Add delay between retries
						await new Promise(resolve => setTimeout(resolve, 1000));
					}
				}
			};

			console.log("🔄 Pre-caching image...");

			let imageStream;
			let attempts = 0;
			const maxTotalAttempts = 3;

			// Try multiple images if one fails
			while (attempts < maxTotalAttempts) {
				try {
					const currentIndex = (randomIndex + attempts) % link.length;
					const currentUrl = link[currentIndex];
					
					console.log(`🔄 Trying image ${attempts + 1}/${maxTotalAttempts}: ${currentUrl}`);
					
					imageStream = await downloadImageWithRetry(currentUrl);
					
					// Verify stream is readable
					if (!imageStream) {
						throw new Error('Image stream is invalid');
					}
					
					console.log("✅ Image stream verified successfully");
					break;
					
				} catch (error) {
					attempts++;
					console.error(`❌ Image ${attempts} failed:`, error.message);
					
					if (attempts >= maxTotalAttempts) {
						// Don't send error message to avoid spam
						console.error("❌ All image attempts failed");
						return;
					}
					
					// Add delay between different image attempts
					await new Promise(resolve => setTimeout(resolve, 500));
				}
			}

			// Send the image
			await message.send({
				body: '「 Sugar Mumma Ahh💦🥵 」',
				attachment: imageStream
			});

			console.log("✅ Successfully sent nude image");

		} catch (error) {
			console.error("💥 Nude command error:", error.message);
			
			// Don't send error message to avoid spam
			console.error("❌ Failed to send image");
		}
	}
};
