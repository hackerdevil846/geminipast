const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "ayaka",
        aliases: [],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "random-img",
        shortDescription: {
            en: "✨ 𝖠𝗒𝖺𝗄𝖺 𝗋𝖺𝗇𝖽𝗈𝗆 𝗂𝗆𝖺𝗀𝖾"
        },
        longDescription: {
            en: "𝖲𝖾𝗇𝖽𝗌 𝗋𝖺𝗇𝖽𝗈𝗆 𝖠𝗒𝖺𝗄𝖺 𝗂𝗆𝖺𝗀𝖾𝗌 𝖿𝗋𝗈𝗆 𝖦𝖾𝗇𝗌𝗁𝗂𝗇 𝖨𝗆𝗉𝖺𝖼𝗍"
        },
        guide: {
            en: "{p}ayaka"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            const imageLinks = [
            "https://i.imgur.com/uXWLBeC.jpeg",
            "https://i.imgur.com/7Dc9GrN.jpeg",
            "https://i.imgur.com/IaAVMFK.jpeg",
            "https://i.imgur.com/WceNH2z.jpeg",
            "https://i.imgur.com/1XosaEA.jpeg",
            "https://i.imgur.com/M58fVe6.jpeg",
            "https://i.imgur.com/czaXZ3a.jpeg",
            "https://i.imgur.com/xsu6v2I.jpeg",
            "https://i.imgur.com/f17dCCM.jpeg",
            "https://i.imgur.com/opquSuU.jpeg",
            "https://i.imgur.com/U87kL1B.jpeg",
            "https://i.imgur.com/Osa1EEd.jpeg",
            "https://i.imgur.com/38XTSUn.jpeg",
            "https://i.imgur.com/B7mAsZB.jpeg",
            "https://i.imgur.com/2APmfRs.jpeg",
            "https://i.imgur.com/mCUOJ8U.jpeg",
            "https://i.imgur.com/CnN1DxG.jpeg",
            "https://i.imgur.com/onlEme6.jpeg",
            "https://i.imgur.com/OF73muW.jpeg",
            "https://i.imgur.com/UO1sK8I.jpeg",
            "https://i.imgur.com/AlkGMJr.jpeg",
            "https://i.imgur.com/yZy8yvG.jpeg",
            "https://i.imgur.com/wLuwsWH.jpeg",
            "https://i.imgur.com/NoLgneL.jpeg",
            "https://i.imgur.com/wnXPqVv.jpeg",
            "https://i.imgur.com/D4ORkkM.jpeg",
            "https://i.imgur.com/bXZCoXT.jpeg",
            "https://i.imgur.com/ixx7Psr.jpeg",
            "https://i.imgur.com/TWP438b.jpeg",
            "https://i.imgur.com/zEiGsZE.jpeg",
            "https://i.imgur.com/pFbFkvj.jpeg",
            "https://i.imgur.com/U9fPLgz.jpeg",
            "https://i.imgur.com/VjOIoAg.jpeg",
            "https://i.imgur.com/gmYkkFF.jpeg",
            "https://i.imgur.com/4o5MRal.jpeg",
            "https://i.imgur.com/XDGkXfZ.jpeg",
            "https://i.imgur.com/B50Pi6m.jpeg",
            "https://i.imgur.com/BZKVLfn.jpeg",
            "https://i.imgur.com/wSQv7mM.jpeg",
            "https://i.imgur.com/2Ky8mww.jpeg",
            "https://i.imgur.com/4fhxxts.jpeg",
            "https://i.imgur.com/rvFm33m.jpeg",
            "https://i.imgur.com/J2EG5QV.jpeg",
            "https://i.imgur.com/JwkXNeQ.jpeg",
            "https://i.imgur.com/S9AGlH6.jpeg",
            "https://i.imgur.com/L9Jg1pg.jpeg",
            "https://i.imgur.com/urJBEyk.jpeg",
            "https://i.imgur.com/Hpw0D8O.jpeg",
            "https://i.imgur.com/i5hdv5w.jpeg",
            "https://i.imgur.com/O2uymjw.jpeg",
            "https://i.imgur.com/GiSKHaT.jpeg",
            "https://i.imgur.com/dAs2g30.jpeg",
            "https://i.imgur.com/RIhBJhH.jpeg",
            "https://i.imgur.com/pvSpSEb.jpeg",
            "https://i.imgur.com/XUJdz0T.jpeg",
            "https://i.imgur.com/jad2M8w.jpeg",
            "https://i.imgur.com/vbOsMtC.jpeg",
            "https://i.imgur.com/ZTtxhm8.jpeg",
            "https://i.imgur.com/8Qf8hLj.jpeg",
            "https://i.imgur.com/FXGMlHp.jpeg",
            "https://i.imgur.com/jWDw41w.jpeg",
            "https://i.imgur.com/LgvUCju.jpeg",
            "https://i.imgur.com/sdBRGt3.jpeg",
            "https://i.imgur.com/I32E7mo.jpeg",
            "https://i.imgur.com/OBbsiOY.jpeg",
            "https://i.imgur.com/ZlwE7gK.jpeg",
            "https://i.imgur.com/RjTJEia.jpeg",
            "https://i.imgur.com/mihSwWi.jpeg",
            "https://i.imgur.com/XLLJjEM.jpeg",
            "https://i.imgur.com/NkMNc9U.jpeg",
            "https://i.imgur.com/DscSpW9.jpeg",
            "https://i.imgur.com/jA1JB8Z.jpeg",
            "https://i.imgur.com/4744YOK.jpeg",
            "https://i.imgur.com/L7ZmAdP.jpeg",
            "https://i.imgur.com/fnqGUzZ.jpeg",
            "https://i.imgur.com/4r5vG6y.jpeg",
            "https://i.imgur.com/mOZyIBN.jpeg",
            "https://i.imgur.com/5nKPTdH.jpeg",
            "https://i.imgur.com/2DoiyZg.jpeg",
            "https://i.imgur.com/BDvYK5e.jpeg",
            "https://i.imgur.com/JImr4HA.jpeg",
            "https://i.imgur.com/SDYcTdB.jpeg",
            "https://i.imgur.com/GH3rmiF.jpeg",
            "https://i.imgur.com/tUjsJk6.jpeg",
            "https://i.imgur.com/jvjWcZ9.jpeg",
            "https://i.imgur.com/9l5tHki.jpeg",
            "https://i.imgur.com/P4GYTjs.jpeg",
            "https://i.imgur.com/4qXII5h.jpeg",
            "https://i.imgur.com/wix18FM.jpeg",
            "https://i.imgur.com/h6JyuUd.jpeg",
            "https://i.imgur.com/agZEIfN.jpeg",
            "https://i.imgur.com/qQJmQ7X.jpeg",
            "https://i.imgur.com/SJ7tHsd.jpeg",
            "https://i.imgur.com/IWsuHJN.jpeg",
            "https://i.imgur.com/PshaE6A.jpeg",
            "https://i.imgur.com/OvAjaUQ.jpeg",
            "https://i.imgur.com/CW4Id3o.jpeg",
            "https://i.imgur.com/5SWTCJ4.jpeg"
        ];

            // Create cache directory
            const cacheDir = path.join(__dirname, 'cache');
            try {
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }

            const imagePath = path.join(cacheDir, `ayaka_${Date.now()}.jpg`);
            const randomImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];

            console.log(`🎯 𝖲𝖾𝗅𝖾𝖼𝗍𝖾𝖽 𝖠𝗒𝖺𝗄𝖺 𝗂𝗆𝖺𝗀𝖾: ${randomImage}`);

            try {
                const response = await axios.get(randomImage, {
                    responseType: 'arraybuffer',
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'image/jpeg,image/png,image/webp,image/*'
                    },
                    maxContentLength: 10 * 1024 * 1024 // 10MB limit
                });

                // Check content type
                const contentType = response.headers['content-type'];
                if (!contentType || !contentType.startsWith('image/')) {
                    throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗈𝗇𝗍𝖾𝗇𝗍 𝗍𝗒𝗉𝖾: " + contentType);
                }

                await fs.writeFileSync(imagePath, Buffer.from(response.data));

                // Verify file was written successfully
                const stats = await fs.stat(imagePath);
                if (stats.size < 1000) { // At least 1KB
                    throw new Error("𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖿𝗂𝗅𝖾 𝗂𝗌 𝗍𝗈𝗈 𝗌𝗆𝖺𝗅𝗅");
                }

                console.log(`✅ 𝖠𝗒𝖺𝗄𝖺 𝗂𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 (${(stats.size / 1024 / 1024).toFixed(2)}𝖬𝖡)`);

                await message.reply({
                    body: `✨ 𝖠𝗒𝖺𝗄𝖺 𝗋𝖺𝗇𝖽𝗈𝗆 𝗂𝗆𝖺𝗀𝖾...\n📊 𝖳𝗈𝗍𝖺𝗅 𝗂𝗆𝖺𝗀𝖾𝗌: ${imageLinks.length}`,
                    attachment: fs.createReadStream(imagePath)
                });

                // Clean up file
                try {
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                        console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾");
                    }
                } catch (cleanupError) {
                    console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
                }

            } catch (downloadError) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", downloadError.message);
                
                // Clean up file if it exists
                try {
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                } catch (cleanupError) {
                    console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
                }

                // Try fallback images
                await this.sendFallbackImage(message, imageLinks, cacheDir);
            }

        } catch (error) {
            console.error("💥 𝖠𝗒𝖺𝗄𝖺 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝖠𝗒𝖺𝗄𝖺 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            } else if (error.message.includes('maxContentLength')) {
                errorMessage = "❌ 𝖨𝗆𝖺𝗀𝖾 𝗂𝗌 𝗍𝗈𝗈 𝗅𝖺𝗋𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    },

    // Fallback method for sending images
    sendFallbackImage: async function(message, imageLinks, cacheDir) {
        try {
            console.log("🔄 𝖳𝗋𝗒𝗂𝗇𝗀 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝗂𝗆𝖺𝗀𝖾𝗌...");
            
            // Try up to 3 different images
            for (let i = 0; i < Math.min(3, imageLinks.length); i++) {
                try {
                    const fallbackImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];
                    const fallbackPath = path.join(cacheDir, `ayaka_fallback_${Date.now()}.jpg`);
                    
                    console.log(`🔄 𝖳𝗋𝗒𝗂𝗇𝗀 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝗂𝗆𝖺𝗀𝖾 ${i + 1}: ${fallbackImage}`);
                    
                    const response = await axios.get(fallbackImage, {
                        responseType: 'arraybuffer',
                        timeout: 15000
                    });

                    await fs.writeFileSync(fallbackPath, Buffer.from(response.data));

                    await message.reply({
                        body: `✨ 𝖠𝗒𝖺𝗄𝖺 𝗋𝖺𝗇𝖽𝗈𝗆 𝗂𝗆𝖺𝗀𝖾 (𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄)...\n📊 𝖳𝗈𝗍𝖺𝗅 𝗂𝗆𝖺𝗀𝖾𝗌: ${imageLinks.length}`,
                        attachment: fs.createReadStream(fallbackPath)
                    });

                    // Clean up
                    try {
                        if (fs.existsSync(fallbackPath)) {
                            fs.unlinkSync(fallbackPath);
                        }
                    } catch (cleanupError) {
                        console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝖿𝗂𝗅𝖾:", cleanupError.message);
                    }

                    console.log("✅ 𝖥𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝗂𝗆𝖺𝗀𝖾 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗌𝖾𝗇𝗍");
                    return;
                    
                } catch (fallbackError) {
                    console.error(`❌ 𝖥𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝗂𝗆𝖺𝗀𝖾 ${i + 1} 𝖿𝖺𝗂𝗅𝖾𝖽:`, fallbackError.message);
                    continue;
                }
            }
            
            // If all fallbacks fail
            throw new Error("𝖠𝗅𝗅 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝗂𝗆𝖺𝗀𝖾𝗌 𝖿𝖺𝗂𝗅𝖾𝖽");
            
        } catch (fallbackError) {
            console.error("💥 𝖠𝗅𝗅 𝖿𝖺𝗅𝗅𝖻𝖺𝖼𝗄𝗌 𝖿𝖺𝗂𝗅𝖾𝖽:", fallbackError);
            throw fallbackError;
        }
    }
};
