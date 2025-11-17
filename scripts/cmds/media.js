const axios = require("axios");
const fs = require("fs-extra");
const ytdl = require("ytdl-core");
const { default: youtube } = require("simple-youtube-api");

module.exports = {
    config: {
        name: "media",
        aliases: ["ytdownload", "youtubedownload"],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 10,
        role: 0,
        shortDescription: {
            en: "𝑃𝑙𝑎𝑦 𝑣𝑖𝑑𝑒𝑜 𝑓𝑟𝑜𝑚 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑙𝑖𝑛𝑘 𝑜𝑟 𝑠𝑒𝑎𝑟𝑐ℎ"
        },
        longDescription: {
            en: "𝑃𝑙𝑎𝑦 𝑣𝑖𝑑𝑒𝑜 𝑡ℎ𝑟𝑜𝑢𝑔ℎ 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑙𝑖𝑛𝑘 𝑜𝑟 𝑠𝑒𝑎𝑟𝑐ℎ 𝑘𝑒𝑦𝑤𝑜𝑟𝑑𝑠"
        },
        category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
        guide: {
            en: "{p}media [𝑠𝑒𝑎𝑟𝑐ℎ𝑉𝑖𝑑𝑒𝑜𝑠]"
        },
        dependencies: {
            "ytdl-core": "",
            "simple-youtube-api": "",
            "axios": "",
            "fs-extra": ""
        }
    },

    onReply: async function({ message, event, handleReply }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            const { data: apiData } = await axios.get("https://raw.githubusercontent.com/J-JRT/api1/mainV2/video.json");
            const apiKeys = apiData.keyVideo;
            const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
            
            const choice = parseInt(event.body);
            if (isNaN(choice) || choice < 1 || choice > 6) {
                return message.reply("𝐶ℎ𝑜𝑜𝑠𝑒 𝑓𝑟𝑜𝑚 1 𝑡𝑜 6 𝑜𝑛𝑙𝑦. 𝑖𝑙𝑦 ❤️");
            }

            message.unsend(handleReply.messageID);

            const videoConfig = {
                method: "GET",
                url: "https://ytstream-download-youtube-videos.p.rapidapi.com/dl",
                params: { id: handleReply.link[choice - 1] },
                headers: {
                    "x-rapidapi-host": "ytstream-download-youtube-videos.p.rapidapi.com",
                    "x-rapidapi-key": randomKey.API_KEY
                }
            };

            const videoData = (await axios.request(videoConfig)).data;
            
            if (videoData.status === "fail") {
                return message.reply("𝐶𝑎𝑛𝑛𝑜𝑡 𝑠𝑒𝑛𝑑 𝑡ℎ𝑖𝑠 𝑓𝑖𝑙𝑒.");
            }

            const videoTitle = videoData.title;
            const qualityKey = Object.keys(videoData.link)[1];
            const videoUrl = videoData.link[qualityKey][0];
            
            const path = __dirname + "/cache/video.mp4";
            const videoBuffer = (await axios.get(videoUrl, { responseType: "arraybuffer" })).data;
            
            await fs.writeFileSync(path, Buffer.from(videoBuffer, "utf-8"));
            
            const fileSize = fs.statSync(path).size;
            if (fileSize > 25000000) {
                fs.unlinkSync(path);
                return message.reply("𝐹𝑖𝑙𝑒 𝑠𝑖𝑧𝑒 𝑒𝑥𝑐𝑒𝑒𝑑𝑠 25𝑀𝐵.");
            }

            await message.reply({
                body: `» ${videoTitle}`,
                attachment: fs.createReadStream(path)
            });

            fs.unlinkSync(path);

        } catch (error) {
            console.error("𝑅𝑒𝑝𝑙𝑦 𝐸𝑟𝑟𝑜𝑟:", error);
            message.reply("𝐶𝑎𝑛𝑛𝑜𝑡 𝑠𝑒𝑛𝑑 𝑡ℎ𝑖𝑠 𝑓𝑖𝑙𝑒!");
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("ytdl-core");
                require("simple-youtube-api");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑦𝑡𝑑𝑙-𝑐𝑜𝑟𝑒, 𝑎𝑛𝑑 𝑠𝑖𝑚𝑝𝑙𝑒-𝑦𝑜𝑢𝑡𝑢𝑏𝑒-𝑎𝑝𝑖.");
            }

            if (!args.length) {
                return message.reply("» 𝑆𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦 𝑐𝑎𝑛𝑛𝑜𝑡 𝑏𝑒 𝑒𝑚𝑝𝑡𝑦!");
            }

            const { data: apiData } = await axios.get("https://raw.githubusercontent.com/quyenkaneki/data/main/video.json");
            const apiKeys = apiData.keyVideo;
            const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

            const youtubeKeys = [
                "AIzaSyB5A3Lum6u5p2Ki2btkGdzvEqtZ8KNLeXo",
                "AIzaSyAyjwkjc0w61LpOErHY_vFo6Di5LEyfLK0", 
                "AIzaSyBY5jfFyaTNtiTSBNCvmyJKpMIGlpCSB4w",
                "AIzaSyCYCg9qpFmJJsEcr61ZLV5KsmgT1RE5aI4"
            ];
            const randomYoutubeKey = youtubeKeys[Math.floor(Math.random() * youtubeKeys.length)];
            const youtubeAPI = new youtube(randomYoutubeKey);

            const query = args.join(" ");

            if (query.includes("https://")) {
                const videoId = query.match(/^.*(youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#([^\/]*?\/)*)\??v?=?([^#\&\?]*).*/)[3];
                
                const videoConfig = {
                    method: "GET",
                    url: "https://ytstream-download-youtube-videos.p.rapidapi.com/dl",
                    params: { id: videoId },
                    headers: {
                        "x-rapidapi-host": "ytstream-download-youtube-videos.p.rapidapi.com",
                        "x-rapidapi-key": randomKey.API_KEY
                    }
                };

                const videoData = (await axios.request(videoConfig)).data;
                
                if (videoData.status === "fail") {
                    return message.reply("𝐶𝑎𝑛𝑛𝑜𝑡 𝑠𝑒𝑛𝑑 𝑡ℎ𝑖𝑠 𝑓𝑖𝑙𝑒.");
                }

                const videoTitle = videoData.title;
                const qualityKey = Object.keys(videoData.link)[1];
                const videoUrl = videoData.link[qualityKey][0];
                
                const path = __dirname + "/cache/video.mp4";
                const videoBuffer = (await axios.get(videoUrl, { responseType: "arraybuffer" })).data;
                
                await fs.writeFileSync(path, Buffer.from(videoBuffer, "utf-8"));
                
                const fileSize = fs.statSync(path).size;
                if (fileSize > 26000000) {
                    fs.unlinkSync(path);
                    return message.reply("𝐹𝑖𝑙𝑒 𝑠𝑖𝑧𝑒 𝑒𝑥𝑐𝑒𝑒𝑑𝑠 25𝑀𝐵.");
                }

                await message.reply({
                    body: `» ${videoTitle}`,
                    attachment: fs.createReadStream(path)
                });

                fs.unlinkSync(path);
                return;
            }

            const videos = await youtubeAPI.searchVideos(query, 6);
            const videoIds = [];
            const thumbnails = [];
            let resultMessage = "";
            let counter = 0;

            for (const video of videos) {
                if (!video.id) continue;
                
                videoIds.push(video.id);
                counter++;

                const thumbnailUrl = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                const thumbnailPath = __dirname + `/cache/thumb${counter}.jpg`;
                
                const thumbnailBuffer = (await axios.get(thumbnailUrl, { responseType: "arraybuffer" })).data;
                await fs.writeFileSync(thumbnailPath, Buffer.from(thumbnailBuffer, "utf-8"));
                
                thumbnails.push(fs.createReadStream(thumbnailPath));

                const durationData = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${video.id}&key=${randomYoutubeKey}`);
                const duration = durationData.data.items[0].contentDetails.duration.slice(2).replace("S", "").replace("M", ":");

                let numberSymbol;
                switch (counter) {
                    case 1: numberSymbol = "⓵"; break;
                    case 2: numberSymbol = "⓶"; break;
                    case 3: numberSymbol = "⓷"; break;
                    case 4: numberSymbol = "⓸"; break;
                    case 5: numberSymbol = "⓹"; break;
                    case 6: numberSymbol = "⓺"; break;
                    default: numberSymbol = counter.toString();
                }

                resultMessage += `${numberSymbol} 《${duration}》 ${video.title}\n\n`;
            }

            const finalMessage = `»🔎 𝐹𝑜𝑢𝑛𝑑 ${videoIds.length} 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑓𝑜𝑟 𝑦𝑜𝑢𝑟 𝑠𝑒𝑎𝑟𝑐ℎ:\n\n${resultMessage}» 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 𝑡𝑜 𝑐ℎ𝑜𝑜𝑠𝑒 𝑎 𝑣𝑖𝑑𝑒𝑜`;

            await message.reply({
                attachment: thumbnails,
                body: finalMessage
            }, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    link: videoIds
                });
                
                setTimeout(() => {
                    for (let i = 1; i <= counter; i++) {
                        if (fs.existsSync(__dirname + `/cache/thumb${i}.jpg`)) {
                            fs.unlinkSync(__dirname + `/cache/thumb${i}.jpg`);
                        }
                    }
                }, 5000);
            });

        } catch (error) {
            console.error("𝑀𝑎𝑖𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
            message.reply("𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑒𝑠𝑡: " + error.message);
        }
    }
};
