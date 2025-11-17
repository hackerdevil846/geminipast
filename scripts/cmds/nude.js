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
				"https://i.imgur.com/T5BPkRG.jpg",
				"https://i.imgur.com/69MT3Wg.jpg",
				"https://i.imgur.com/z6EtvVm.jpg",
				"https://i.imgur.com/hf3KluZ.jpg",
				"https://i.imgur.com/9XxaYI3.jpg",
				"https://i.imgur.com/rCSoCaA.jpg",
				"https://i.imgur.com/6olWIAr.jpg",
				"https://i.imgur.com/AcKfCpt.jpg",
				"https://i.imgur.com/OA6wMjp.jpg",
				"https://i.imgur.com/WBUspj9.jpg",
				"https://i.imgur.com/GBzR0aY.jpg",
				"https://i.imgur.com/EefsUX3.jpg",
				"https://i.imgur.com/kWqwF1K.jpg",
				"https://i.imgur.com/tUee6NZ.jpg",
				"https://i.imgur.com/NJSUN9k.jpg",
				"https://i.imgur.com/GxPSGo9.jpg",
				"https://i.imgur.com/junGPIa.jpg",
				"https://i.imgur.com/fj0WV5S.jpg",
				"https://i.imgur.com/trR1T6P.jpg",
				"https://i.imgur.com/5GPy7MZ.jpg",
				"https://i.imgur.com/kPpcoFe.jpg",
				"https://i.imgur.com/DibHjLg.jpg",
				"https://i.imgur.com/lzY1HP3.jpg",
				"https://i.imgur.com/z7oHPeD.jpg",
				"https://i.imgur.com/2kW0UrZ.jpg",
				"https://i.imgur.com/2TJXTM8.jpg",
				"https://i.imgur.com/hHkxDMt.jpg",
				"https://i.imgur.com/H7vs8c6.jpg",
				"https://i.imgur.com/jVSz5tX.jpg",
				"https://i.imgur.com/vF32mr2.jpg",
				"https://i.imgur.com/BoJDDpm.jpg",
				"https://i.imgur.com/GbAkVR3.jpg",
				"https://i.imgur.com/aMw2mEz.jpg",
				"https://i.imgur.com/egPMyvA.jpg",
				"https://i.imgur.com/OPZDGUY.jpg",
				"https://i.imgur.com/dxbjwmx.jpg",
				"https://i.imgur.com/FNQQETm.jpg",
				"https://i.imgur.com/hT7bbZr.jpg",
				"https://i.imgur.com/0Eg5ZN4.jpg",
				"https://i.imgur.com/Qle3LJi.jpg",
				"https://i.imgur.com/pzJq8ay.jpg",
				"https://i.imgur.com/NyqSI83.jpg",
				"https://i.imgur.com/p41qMvY.jpg",
				"https://i.imgur.com/p7EiSkE.jpg",
				"https://i.imgur.com/JYUOHUd.jpg",
				"https://i.imgur.com/cWxtrc2.jpg",
				"https://i.imgur.com/2pSSMtl.jpg",
				"https://i.imgur.com/DAnirH8.jpg",
				"https://i.imgur.com/8XyrCGu.jpg",
				"https://i.imgur.com/I7rtkwT.jpg",
				"https://i.imgur.com/KCo1P0u.jpg",
				"https://i.imgur.com/GLIwmQk.jpg",
				"https://i.imgur.com/Mue8s3E.jpg",
				"https://i.imgur.com/Fak0Ahg.jpg",
				"https://i.imgur.com/EDsi80I.jpg",
				"https://i.imgur.com/JvVpF6W.jpg",
				"https://i.imgur.com/I3CE748.jpg",
				"https://i.imgur.com/CH0PxJP.jpg",
				"https://i.imgur.com/3T1q41U.jpg",
				"https://i.imgur.com/WD3uX9V.jpg",
				"https://i.imgur.com/7sS6lji.jpg",
				"https://i.imgur.com/kFAfAC3.jpg",
				"https://i.imgur.com/EpyMadP.jpg",
				"https://i.imgur.com/9AJt2Tt.jpg",
				"https://i.imgur.com/55EbaeY.jpg",
				"https://i.imgur.com/xRJSAmJ.jpg",
				"https://i.imgur.com/kXA2fSX.jpg",
				"https://i.imgur.com/dy1YlJs.jpg",
				"https://i.imgur.com/0LlpoXG.jpg",
				"https://i.imgur.com/Kof1KXr.jpg",
				"https://i.imgur.com/xIgnYGo.jpg",
				"https://i.imgur.com/4cFgFZq.jpg",
				"https://i.imgur.com/d8k4a6G.jpg",
				"https://i.imgur.com/eraz44H.jpg",
				"https://i.imgur.com/uSHLM8y.jpg",
				"https://i.imgur.com/2iy9KnD.jpg",
				"https://i.imgur.com/Aew0gjm.jpg",
				"https://i.imgur.com/sxXm5cI.jpg",
				"https://i.imgur.com/2or8urJ.jpg",
				"https://i.imgur.com/cslJLNt.jpg",
				"https://i.imgur.com/zQztjGM.jpg",
				"https://i.imgur.com/dyluWmm.jpg",
				"https://i.imgur.com/CgAc5ux.jpg",
				"https://i.imgur.com/Z5ph1wc.jpg",
				"https://i.imgur.com/0bRLqAR.jpg",
				"https://i.imgur.com/x68KtYI.jpg",
				"https://i.imgur.com/cAich41.jpg",
				"https://i.imgur.com/BMcYATY.jpg",
				"https://i.imgur.com/E9PYK7J.jpg",
				"https://i.imgur.com/1oaM7ai.jpg",
				"https://i.imgur.com/Urx9Ijl.jpg",
				"https://i.imgur.com/QYGOZuK.jpg"
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
