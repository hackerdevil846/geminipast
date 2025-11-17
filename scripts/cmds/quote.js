const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "quote",
        aliases: ["islamicquote"],
        version: "1.1.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        category: "𝑖𝑠𝑙𝑎𝑚𝑖𝑐",
        shortDescription: {
            en: "𝐺𝑒𝑡 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑞𝑢𝑜𝑡𝑒𝑠 𝑤𝑖𝑡ℎ 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑖𝑚𝑎𝑔𝑒𝑠"
        },
        longDescription: {
            en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑠 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑞𝑢𝑜𝑡𝑒𝑠 𝑤𝑖𝑡ℎ 𝑑𝑒𝑐𝑜𝑟𝑎𝑡𝑖𝑣𝑒 𝑖𝑚𝑎𝑔𝑒𝑠"
        },
        guide: {
            en: "{p}quote"
        },
        dependencies: {
            "canvas": "",
            "axios": "",
            "fs-extra": ""
        }
    },

    onLoad: function() {
        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    },

    onStart: async function({ message, event }) {
        try {
            // Dependency check
            try {
                require("canvas");
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑐𝑎𝑛𝑣𝑎𝑠, 𝑎𝑥𝑖𝑜𝑠, 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎.");
            }

            // Quotes array (kept as-is, including special characters/newlines)
            const quotes = [
                "ღ••\n– কোনো নেতার পিছনে নয়.!!🤸‍♂️\n– মসজিদের ইমামের পিছনে দাড়াও জীবন বদলে যাবে ইনশাআল্লাহ.!!🖤🌻\n৫",
                "-!\n__আল্লাহর রহমত থেকে নিরাশ হওয়া যাবে না!” আল্লাহ অবশ্যই তোমাকে ক্ষমা করে দিবেন☺️🌻\nসুরা যুমাহ্ আয়াত ৫২..৫৩💙🌸\n-!",
                "- ইসলাম অহংকার করতে শেখায় না!🌸\n\n- ইসলাম শুকরিয়া আদায় করতে শেখায়!🤲🕋🥀",
                "- বেপর্দা নারী যদি নায়িকা হতে পারে\n _____🤗🥀 -তবে পর্দাশীল নারী গুলো সব ইসলামের শাহাজাদী __🌺🥰\n  __মাশাল্লাহ।।",
                "┏━━━━ ﷽ ━━━━┓\n 🖤﷽স্মার্ট নয় ইসলামিক ﷽🥰\n 🖤﷽ জীবন সঙ্গি খুঁজুন ﷽🥰\n┗━━━━ ﷽ ━━━━┛",
                "ღ࿐– যখন বান্দার জ্বর হয়,😇\n🖤তখন গুনাহ গুলো ঝড়ে পড়তে থাকে☺️\n– হযরত মুহাম্মদ(সাঃ)●───༊༆",
                "~🍂🦋\n              ━𝐇𝐚𝐩𝐩𝐢𝐧𝐞𝐬𝐬 𝐈𝐬 𝐄𝐧𝐣𝐨𝐲𝐢𝐧𝐠 𝐓𝐡𝐢𝐧𝐠𝐬 𝐈𝐧 𝐿𝑖𝑓𝑒..♡🌸\n                          ━𝐓𝐡𝐢𝐧𝐠𝐬 𝐈𝐧 𝐿𝑖𝑓𝑒..♡🌸\n           ━𝐀𝐥𝐡𝐚𝐦𝐝𝐮𝐥𝐢𝐥𝐥𝐚𝐡 𝐅𝐨𝐫 𝐄𝐯𝐞𝐫𝐲𝐭𝐡𝐢𝐧𝐠...💗🥰",
                "•___💜🌈___•\n°___:))-তুমি আসক্ত হও-||-🖤🌸✨\n°___:))-তবে নেশায় নয় আল্লাহর ইবাদতে-||-🖤🌸✨\n•___🍒🖇️✨___•",
                "─❝হাসতে❜❜ হাসতে❜❜ একদিন❜❜😊😊\n ━❥❝সবাইকে❜❜ ─❝কাদিয়ে ❜❜বিদায়❜❜ নিবো❜❞.!!🙂💔🥀 ",
                "🦋🥀࿐\nლ_༎হাজারো༎স্বপ্নের༎শেষ༎স্থান༎••༊🙂🤲🥀\n♡_༎কবরস্থান༎_♡❤\n🦋🥀࿐",
                "•\n\nপ্রসঙ্গ যখন ধর্ম নিয়ে•🥰😊\nতখন আমাদের ইসলামই সেরা•❤️\n𝐀𝐥𝐡𝐚𝐦𝐝𝐮𝐥𝐢𝐥𝐥𝐚🌸❤️",
                "🥀😒কেউ পছন্দ না করলে,,,,\n        কি যায় আসে,,🙂\n                😇আল্লাহ তো,,\n        পছন্দ করেই বানিয়েছে,,♥️🥀\n         🥰  Alhamdulillah 🕋",
                "🌼 এত অহংকার করে লাভ নেই! 🌺 \n  মৃত্যুটা নিশ্চিত,, শুধু সময়টা\n   অ'নিশ্চিত।🖤🙂 ",
                "_🌻••ছিঁড়ে ফেলুন অতীতের\nসকল পাপের\n                 অধ্যায় ।\n_ফিরে আসুন রবের ভালোবাসায়••🖤🥀",
                "_বুকে হাজারো কষ্ট নিয়ে\n                  আলহামদুলিল্লাহ বলাটা••!☺️\n_আল্লাহর প্রতি অগাধ বিশ্বাসের নমুনা❤️🥀",
                "_আল্লাহর ভালোবাসা পেতে চাও•••!🤗\n\n_তবে রাসুল (সা:)কে অনুসরণ করো••!🥰   "
            ];

            // Images (kept exactly as provided)
            const images = [
                "https://i.postimg.cc/7LdGnyjQ/images-31.jpg",
                "https://i.postimg.cc/65c81ZDZ/images-30.jpg",
                "https://i.postimg.cc/Y0wvTzr6/images-29.jpg",
                "https://i.postimg.cc/1Rpnw2BJ/images-28.jpg",
                "https://i.postimg.cc/mgrPxDs5/images-27.jpg",
                "https://i.postimg.cc/yxXDK3xw/images-26.jpg",
                "https://i.postimg.cc/kXqVcsh9/muslim-boy-having-worship-praying-fasting-eid-islamic-culture-mosque-73899-1334.webp",
                "https://i.postimg.cc/hGzhj5h8/muslims-reading-from-quran-53876-20958.webp",
                "https://i.postimg.cc/x1Fc92jT/blue-mosque-istanbul-1157-8841.webp",
                "https://i.postimg.cc/j5y56nHL/muhammad-ali-pasha-cairo-219717-5352.webp",
                "https://i.postimg.cc/dVWyHfhr/images-1-21.jpg",
                "https://i.postimg.cc/q7MGgn3X/images-1-22.jpg",
                "https://i.postimg.cc/sX5CXtSh/images-1-16.jpg",
                "https://i.postimg.cc/66Rp2Pwz/images-1-17.jpg",
                "https://i.postimg.cc/Qtzh9pY2/images-1-18.jpg",
                "https://i.postimg.cc/MGrhdz0R/images-1-19.jpg",
                "https://i.postimg.cc/LsMSj9Ts/images-1-20.jpg",
                "https://i.postimg.cc/KzNXyttX/images-1-13.jpg"
            ];

            // pick random quote & image
            const selectedQuote = quotes[Math.floor(Math.random() * quotes.length)];
            const selectedImage = images[Math.floor(Math.random() * images.length)];

            // download image
            const res = await axios.get(selectedImage, { responseType: "arraybuffer" });
            const background = await loadImage(Buffer.from(res.data));

            // create canvas
            const canvas = createCanvas(background.width, background.height);
            const ctx = canvas.getContext("2d");

            // draw background
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            // dark overlay for readable text
            ctx.fillStyle = "rgba(0,0,0,0.55)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // text style
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillStyle = "#FFFFFF";

            // compute font size depending on canvas size
            const baseFont = Math.min(Math.max(Math.floor(canvas.width * 0.04), 18), 44);
            ctx.font = `bold ${baseFont}px Arial`;

            // wrap text while respecting explicit newlines
            const maxWidth = canvas.width * 0.78;
            const lineHeight = baseFont * 1.45;

            const lines = [];
            // split by newline paragraphs first
            const paragraphs = selectedQuote.split(/\r?\n/);
            for (const para of paragraphs) {
                if (!para.trim()) {
                    lines.push("");
                    continue;
                }
                const words = para.split(" ");
                let current = "";
                for (const word of words) {
                    const test = current ? (current + " " + word) : word;
                    const metrics = ctx.measureText(test);
                    if (metrics.width > maxWidth && current) {
                        lines.push(current);
                        current = word;
                    } else {
                        current = test;
                    }
                }
                if (current) lines.push(current);
            }

            // calculate vertical start to center text block
            const textBlockHeight = lines.length * lineHeight;
            const startY = (canvas.height - textBlockHeight) / 2;

            // decorative top & bottom lines
            ctx.strokeStyle = "#F1C40F";
            ctx.lineWidth = Math.max(2, Math.floor(canvas.width * 0.0025));
            ctx.beginPath();
            ctx.moveTo(canvas.width * 0.08, startY - lineHeight * 0.8);
            ctx.lineTo(canvas.width * 0.92, startY - lineHeight * 0.8);
            ctx.stroke();

            // draw the Arabic Bismillah/Decor
            try {
                const bismillahFontSize = Math.min(140, baseFont * 2.5);
                ctx.font = `bold ${bismillahFontSize}px Arial`;
                ctx.fillText("﷽", canvas.width / 2, startY - lineHeight * 1.6);
            } catch (e) {
                // ignore if font cannot render
            }

            // reset font to body
            ctx.font = `bold ${baseFont}px Arial`;
            ctx.fillStyle = "#FFFFFF";

            // draw lines
            lines.forEach((ln, idx) => {
                const x = canvas.width / 2;
                const y = startY + idx * lineHeight;
                // small shadow for readability
                ctx.save();
                ctx.fillStyle = "rgba(0,0,0,0.45)";
                ctx.fillText(ln, x + 2, y + 2);
                ctx.restore();
                ctx.fillText(ln, x, y);
            });

            // bottom decorative line
            ctx.beginPath();
            ctx.moveTo(canvas.width * 0.08, startY + textBlockHeight + lineHeight * 0.3);
            ctx.lineTo(canvas.width * 0.92, startY + textBlockHeight + lineHeight * 0.3);
            ctx.stroke();

            // save buffer
            const filePath = path.join(__dirname, "cache/quote.png");
            const buffer = canvas.toBuffer();
            fs.writeFileSync(filePath, buffer);

            // prepare message body
            const body = `✨🕋 ইসলমিক উক্তি 🕋✨\n━━━━━━━━━━━━━━━━━━\n\n"${selectedQuote}"\n\n━━━━━━━━━━━━━━━━━━\n🌙 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`;

            // send image with message
            await message.reply({
                body: body,
                attachment: fs.createReadStream(filePath)
            });

            // cleanup file
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

        } catch (error) {
            console.error("𝑄𝑢𝑜𝑡𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ উক্তি তৈরি করতে সমস্যা হয়েছে, আবার চেষ্টা করুন!");
        }
    }
};
