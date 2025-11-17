const { GoatBotApis } = global.utils;
const axios = require('axios');

module.exports = {
	config: {
		name: "texttoimage",
		aliases: ["midjourney", "openjourney", "text2image"],
		version: "1.0",
		author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
		countDown: 5,
		role: 0,
		description: {
			uid: "Tạo ảnh từ văn bản của bạn",
			en: "Create image from your text"
		},
		category: "info",
		guide: {
			vi: "{pn} <api_choice> <prompt>: tạo ảnh từ văn bản của bạn"
				+ "\nVí dụ: {pn} stable create a gta style house, gta, 4k, hyper detailed, cinematic, realistic, unreal engine, cinematic lighting, bright lights"
				+ "\nExample: {pn} deepai create a gta style house, gta, 4k, hyper detailed, cinematic, realistic, unreal engine, cinematic lighting, bright lights"
		}
	},

	langs: {
		vi: {
			syntaxError: "⚠️ Vui lòng nhập lựa chọn API (stable/deepai) và prompt",
			error: "❗ Đã có lỗi xảy ra, vui lòng thử lại sau:\n%1",
			serverError: "❗ Server đang quá tải, vui lòng thử lại sau",
			missingApiKey: "❗ Chưa cài đặt apikey cho %1, vui lòng thêm apikey vào file configCommands.json > envGlobal.%2 và lưu lại"
		},
		en: {
			syntaxError: "⚠️ Please enter API choice (stable/deepai) and prompt",
			error: "❗ An error has occurred, please try again later:\n%1",			
			serverError: "❗ Server is overloaded, please try again later",
			missingApiKey: "❗ Not set apikey for %1, please add apikey to configCommands.json > envGlobal.%2 and save"
		}
	},

	envGlobal: {
		stableDiffusionApiKey: "h6TMPu4DCHISmzjWmWRCyRV8oCAcT9YrVEVOSJGpsIGz9F4wTshJPvD1zPFa",
		deepAiApiKey: "fe19d7f9-083d-464e-a24f-ce410a281914"
	},

	onStart: async function ({ message, args, getLang, envGlobal }) {
		const apiChoice = args[0]?.toLowerCase();
		const prompt = args.slice(1).join(" ");

		if (!apiChoice || !prompt) {
			return message.reply(getLang("syntaxError"));
		}

		let imageUrl;

		try {
			switch (apiChoice) {
				case "stable":
					const stableKey = envGlobal.stableDiffusionApiKey;
					if (!stableKey) return message.reply(getLang("missingApiKey", "Stable Diffusion API", "stableDiffusionApiKey"));

					const stableResponse = await axios.post('https://stablediffusionapi.com/api/v3/text2img', {
						key: stableKey,
						prompt: prompt,
						width: "512",
						height: "512",
						samples: "1",
						num_inference_steps: "20",
						seed: null,
						guidance_scale: 7.5
					});

					if (stableResponse.data.status === 'success' && stableResponse.data.output?.length > 0) {
						imageUrl = stableResponse.data.output[0];
					} else if (stableResponse.data.status === 'processing' || stableResponse.data.status === 'queued') {
						throw new Error('Image generation is still processing or queued. Please try again later.');
					} else {
						throw new Error(stableResponse.data.messege || 'Stable Diffusion API error');
					}
					break;

				case "deepai":
					const deepaiKey = envGlobal.deepAiApiKey;
					if (!deepaiKey) return message.reply(getLang("missingApiKey", "DeepAI API", "deepAiApiKey"));

					const deepaiResponse = await axios.post('https://api.deepai.org/api/text2img', 
						{ text: prompt },
						{ headers: { 'api-key': deepaiKey } }
					);
					imageUrl = deepaiResponse.data.output_url;
					break;

				default:
					return message.reply(getLang("syntaxError"));
			}

			if (imageUrl) {
				const imageStream = await axios.get(imageUrl, { responseType: 'stream' });
				imageStream.data.path = "image.jpg";
				return message.reply({ attachment: imageStream.data });
			} else {
				throw new Error("Could not retrieve image URL.");
			}

		} catch (err) {
			console.error(err);
			return message.reply(getLang("error", err.message));
		}
	}
};
