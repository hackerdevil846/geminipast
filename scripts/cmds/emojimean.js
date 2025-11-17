const axios = require("axios");
const cheerio = require("cheerio");
const Canvas = require("canvas");
const fs = require("fs-extra");
const path = require("path");

const langsSupported = [
	'sq', 'ar', 'az', 'bn', 'bs', 'bg', 'my', 'zh-hans',
	'zh-hant', 'hr', 'cs', 'da', 'nl', 'en', 'et', 'fil',
	'fi', 'fr', 'ka', 'de', 'el', 'he', 'hi', 'hu', 'id',
	'it', 'ja', 'kk', 'ko', 'lv', 'lt', 'ms', 'nb', 'fa',
	'pl', 'pt', 'ro', 'ru', 'sr', 'sk', 'sl', 'es', 'sv',
	'th', 'tr', 'uk', 'vi'
];

module.exports = {
    config: {
        name: "emojimean",
        aliases: [],
        version: "1.4",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "wiki",
        shortDescription: {
            en: "𝖥𝗂𝗇𝖽 𝗍𝗁𝖾 𝗆𝖾𝖺𝗇𝗂𝗇𝗀 𝗈𝖿 𝖺𝗇 𝖾𝗆𝗈𝗃𝗂 📌"
        },
        longDescription: {
            en: "𝖥𝗂𝗇𝖽 𝗍𝗁𝖾 𝗆𝖾𝖺𝗇𝗂𝗇𝗀 𝗈𝖿 𝖺𝗇 𝖾𝗆𝗈𝗃𝗂 𝖿𝗋𝗈𝗆 𝖽𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝗉𝗅𝖺𝗍𝖿𝗈𝗋𝗆𝗌"
        },
        guide: {
            en: "{p}emojimean [𝖾𝗆𝗈𝗃𝗂]"
        },
        dependencies: {
            "axios": "",
            "cheerio": "",
            "canvas": "",
            "fs-extra": "",
            "moment-timezone": ""
        }
    },

    langs: {
        "en": {
            "missingEmoji": "⚠️ 𝖸𝗈𝗎 𝗁𝖺𝗏𝖾 𝗇𝗈𝗍 𝖾𝗇𝗍𝖾𝗋𝖾𝖽 𝖺𝗇 𝖾𝗆𝗈𝗃𝗂",
            "meaningOfEmoji": "📌 𝖬𝖾𝖺𝗇𝗂𝗇𝗀 𝗈𝖿 𝖾𝗆𝗈𝗃𝗂 %1:\n\n📄 𝖥𝗂𝗋𝗌𝗍 𝗆𝖾𝖺𝗇𝗂𝗇𝗀: %2\n\n📑 𝖬𝗈𝗋𝖾 𝗆𝖾𝖺𝗇𝗂𝗇𝗀: %3%4\n\n📄 𝖲𝗁𝗈𝗋𝗍𝖼𝗈𝖽𝖾: %5\n\n©️ 𝖲𝗈𝗎𝗋𝖼𝖾: %6\n\n📺 𝖡𝖾𝗅𝗈𝗐 𝖺𝗋𝖾 𝗂𝗆𝖺𝗀𝖾𝗌 𝗈𝖿 𝗍𝗁𝖾 𝖾𝗆𝗈𝗃𝗂 𝖽𝗂𝗌𝗉𝗅𝖺𝗒𝖾𝖽 𝗈𝗇 𝗌𝗈𝗆𝖾 𝗉𝗅𝖺𝗍𝖿𝗈𝗋𝗆𝗌:",
            "meaningOfWikipedia": "\n\n📝 𝖱𝖾𝖺𝖼𝗍 𝗍𝗈 𝗍𝗁𝗂𝗌 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗍𝗈 𝗌𝖾𝖾 𝗍𝗁𝖾 𝗆𝖾𝖺𝗇𝗂𝗇𝗀 \"%1\" 𝖿𝗋𝗈𝗆 𝖶𝗂𝗄𝗂𝗉𝖾𝖽𝗂𝖺",
            "meanOfWikipedia": "📑 𝖬𝖾𝖺𝗇𝗂𝗇𝗀 𝗈𝖿 \"%1\" 𝗈𝗇 𝖶𝗂𝗄𝗂𝗉𝖾𝖽𝗂𝖺:\n%2",
            "manyRequest": "⚠️ 𝖳𝗁𝖾 𝖻𝗈𝗍 𝗁𝖺𝗌 𝗌𝖾𝗇𝗍 𝗍𝗈𝗈 𝗆𝖺𝗇𝗒 𝗋𝖾𝗊𝗎𝖾𝗌𝗍𝗌, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋",
            "notHave": "𝖭𝗈𝗍 𝗁𝖺𝗏𝖾"
        }
    },

    onLoad: function () {
        try {
            const tmpDir = path.join(__dirname, "tmp");
            fs.ensureDirSync(tmpDir);
        } catch (e) {
            console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗍𝗆𝗉 𝖿𝗈𝗅𝖽𝖾𝗋:", e);
        }
    },

    onStart: async function({ api, event, args, message, threadsData }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("cheerio");
                require("canvas");
                require("fs-extra");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖼𝗁𝖾𝖾𝗋𝗂𝗈, 𝖼𝖺𝗇𝗏𝖺𝗌, 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            const emoji = args[0];
            if (!emoji) {
                return message.reply(this.langs.en.missingEmoji);
            }

            let threadLang = "en";
            try {
                if (threadsData && typeof threadsData.get === "function") {
                    const tdata = await threadsData.get(event.threadID);
                    threadLang = (tdata && tdata.data && tdata.data.lang) || "en";
                }
            } catch (e) {
                threadLang = "en";
            }

            let getMeaning;
            try {
                getMeaning = await this.getEmojiMeaning(emoji, threadLang);
            } catch (e) {
                if (e.response && e.response.status == 429) {
                    let tryNumber = 0;
                    while (tryNumber < 3) {
                        try {
                            getMeaning = await this.getEmojiMeaning(emoji, threadLang);
                            break;
                        } catch (err) {
                            tryNumber++;
                        }
                    }
                    if (tryNumber == 3)
                        return message.reply(this.langs.en.manyRequest);
                } else {
                    console.error("❌ 𝖤𝗆𝗈𝗃𝗂 𝗆𝖾𝖺𝗇𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", e);
                    return message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝖿𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝖾𝗆𝗈𝗃𝗂 𝖽𝖺𝗍𝖺. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
                }
            }

            const {
                meaning,
                moreMeaning,
                wikiText,
                meaningOfWikipedia,
                shortcode,
                source,
                images
            } = getMeaning;

            // Create image with enhanced error handling
            let imageBuffer;
            let imageSuccess = false;
            
            try {
                const sizeImage = 190;
                const imageInRow = 5;
                const paddingOfTable = 20;
                const marginImageAndText = 10;
                const marginImage = 20;
                const marginText = 2;
                const fontSize = 30;
                const addWidthImage = 150;

                const font = `${fontSize}px Arial`;
                const _canvas = Canvas.createCanvas(0, 0);
                const _ctx = _canvas.getContext("2d");

                const widthOfOneImage = sizeImage + marginImage * 2 + addWidthImage;
                for (const item of images) {
                    const text = this.wrapped(item.platform, widthOfOneImage, font, _ctx);
                    item.text = text;
                }

                const maxRowText = Math.max(...images.map(item => item.text.length || 0));
                const heightForText = maxRowText * fontSize + marginText * 2 + fontSize;

                const heightOfOneImage = sizeImage + marginImageAndText + heightForText + marginImage + marginText;

                const witdhTable = paddingOfTable + imageInRow * widthOfOneImage + paddingOfTable;
                const heightTable = paddingOfTable + Math.ceil(images.length / imageInRow) * heightOfOneImage + paddingOfTable;

                const canvas = Canvas.createCanvas(witdhTable, heightTable);
                const ctx = canvas.getContext("2d");
                ctx.font = font;
                ctx.fillStyle = "#303342";
                ctx.fillRect(0, 0, witdhTable, heightTable);

                const loadedImages = await Promise.all(images.map(async (el) => {
                    let imageLoaded;
                    const url = `https://www.emojiall.com/${el.url}`;
                    try {
                        imageLoaded = await Canvas.loadImage(url);
                    } catch (e) {
                        try {
                            const splitUrl = url.split("/");
                            imageLoaded = await Canvas.loadImage(`https://www.emojiall.com/images/svg/${splitUrl[splitUrl.length - 2]}/${splitUrl[splitUrl.length - 1].replace(".png", ".svg")}`);
                        } catch (e) {
                            imageLoaded = null;
                        }
                    }
                    return {
                        ...el,
                        imageLoaded
                    };
                }));

                const filteredImages = loadedImages.filter(item => item.imageLoaded);

                let xStart = paddingOfTable + marginImage;
                let yStart = paddingOfTable + marginImage;

                ctx.fillStyle = "white";
                ctx.textAlign = "center";

                for (const el of filteredImages) {
                    const image = el.imageLoaded;

                    ctx.fillStyle = "#2c2f3b";
                    this.drawSquareRounded(ctx, xStart - marginImage + marginImage / 2, yStart - marginImage + marginImage / 2, widthOfOneImage - marginImage, heightOfOneImage - marginImage, 30);
                    this.drawLineSquareRounded(ctx, xStart - marginImage + marginImage / 2, yStart - marginImage + marginImage / 2, widthOfOneImage - marginImage, heightOfOneImage - marginImage, 30, "#3f4257", 5);

                    ctx.drawImage(image, xStart + addWidthImage / 2, yStart, sizeImage, sizeImage);

                    ctx.fillStyle = "white";
                    const texts = this.wrapped(el.platform, widthOfOneImage, ctx.font, ctx);
                    for (let i = 0; i < texts.length; i++) {
                        ctx.fillText(texts[i], xStart + sizeImage / 2 + addWidthImage / 2, yStart + sizeImage + marginImageAndText + 2 + fontSize * (i + 1));
                    }

                    xStart += sizeImage + marginImage * 2 + addWidthImage;
                    if (xStart >= witdhTable - paddingOfTable) {
                        xStart = paddingOfTable + marginImage;
                        yStart += heightOfOneImage;
                    }
                }

                imageBuffer = canvas.toBuffer("image/png");
                imageSuccess = true;

            } catch (imageError) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", imageError);
                imageSuccess = false;
            }

            const body = this.langs.en.meaningOfEmoji
                .replace("%1", emoji)
                .replace("%2", meaning || this.langs.en.notHave)
                .replace("%3", moreMeaning || this.langs.en.notHave)
                .replace("%4", wikiText ? this.langs.en.meaningOfWikipedia.replace("%1", wikiText) : "")
                .replace("%5", shortcode || this.langs.en.notHave)
                .replace("%6", source);

            if (imageSuccess && imageBuffer) {
                const pahtSave = `${__dirname}/tmp/${Date.now()}.png`;
                try {
                    fs.writeFileSync(pahtSave, imageBuffer);

                    await message.reply({
                        body,
                        attachment: fs.createReadStream(pahtSave)
                    });

                    fs.unlinkSync(pahtSave);
                } catch (fileError) {
                    console.error("❌ 𝖥𝗂𝗅𝖾 𝗈𝗉𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", fileError);
                    // Fallback to text-only
                    await message.reply(body);
                }
            } else {
                // Text-only fallback
                await message.reply(body);
            }

        } catch (error) {
            console.error("💥 𝖬𝖺𝗂𝗇 𝖾𝗋𝗋𝗈𝗋:", error);
            await message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗆𝗈𝗃𝗂 𝗆𝖾𝖺𝗇𝗂𝗇𝗀.");
        }
    },

    getEmojiMeaning: async function(emoji, lang) {
        try {
            const url = `https://www.emojiall.com/${lang}/emoji/${encodeURI(emoji)}`;
            const urlImages = `https://www.emojiall.com/${lang}/image/${encodeURI(emoji)}`;

            const { data } = await axios.get(url, { timeout: 30000 });
            const { data: dataImages } = await axios.get(urlImages, { timeout: 30000 });

            const $ = cheerio.load(data);

            const getElMeaning = $(".emoji_card_list.pages > div.emoji_card_content.px-4.py-3");
            const meaning = getElMeaning.eq(0).text().trim();
            const moreMeaning = getElMeaning.eq(1).text().trim();

            const getEl1 = $(".emoji_card_list.pages > .emoji_card_list.border_top > .emoji_card_content.pointer");
            const getWikiText = getEl1.text().replace(/\s+/g, " ").trim();
            let wikiText;
            if (getWikiText)
                wikiText = getWikiText.split(':').find(item => item.includes(emoji))?.trim();

            const getEl2 = $(".emoji_card_list.border_top > div.emoji_card_content.border_top.small > div.category_all_list");
            const meaningOfWikipedia = getEl2.text().trim();

            const getEl3 = $("table.table.table-hover.top_no_border").eq(0);
            const getEl4 = getEl3.find("tr").has(`sup > a[href='/${lang}/help-shortcode']`);
            const shortcode = getEl4.text().match(/(:.*:)/)?.[1];

            const $images = cheerio.load(dataImages);
            const getEl5 = $images(".emoji_card_content").find('img[loading="lazy"]');
            const arr = [];

            getEl5.each((i, el) => {
                const content = $images(el).parent().find("p[class='capitalize'] > a[class='text_blue']").eq(1).text().trim();
                const href = $images(el).attr("data-src") || $images(el).attr("src");
                arr.push({
                    url: href,
                    platform: content
                });
            });

            return {
                meaning,
                moreMeaning,
                wikiText: wikiText || null,
                meaningOfWikipedia: meaningOfWikipedia || null,
                shortcode,
                images: arr,
                source: url
            };
        } catch (error) {
            console.error("❌ 𝖦𝖾𝗍 𝖾𝗆𝗈𝗃𝗂 𝗆𝖾𝖺𝗇𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", error);
            throw error;
        }
    },

    wrapped: function(text, max, font, ctx) {
        const words = (text || "").split(" ");
        const lines = [];
        let line = "";
        try {
            ctx.font = font;
        } catch (e) {}
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + " ";
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > max && i > 0) {
                lines.push(line.trim());
                line = words[i] + " ";
            } else {
                line = testLine;
            }
        }
        if (line) lines.push(line.trim());
        return lines;
    },

    drawSquareRounded: function(ctx, x, y, w, h, r, color) {
        ctx.save();
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        if (color) ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    },

    drawLineSquareRounded: function(ctx, x, y, w, h, r, color, lineWidth) {
        ctx.save();
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        ctx.lineWidth = lineWidth || 1;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        if (color) ctx.strokeStyle = color;
        ctx.stroke();
        ctx.restore();
    }
};
