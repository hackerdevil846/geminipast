const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
    name: "cheems",
    aliases: ["cheemsify", "dogememe"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 1,
    role: 0,
    category: "edit-img",
    shortDescription: {
        en: "🐶 𝑂ℎ 𝑖𝑠 𝑡ℎ𝑎𝑡 𝐶ℎ𝑒𝑒𝑚𝑠?"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝐶ℎ𝑒𝑒𝑚𝑠 𝑚𝑒𝑚𝑒𝑠 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
    },
    guide: {
        en: "{p}cheems [𝑡𝑒𝑥𝑡 1] | [𝑡𝑒𝑥𝑡 2] | [𝑡𝑒𝑥𝑡 3] | [𝑡𝑒𝑥𝑡 4]"
    },
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.wrapText = async (ctx, text, maxWidth) => {
    if (ctx.measureText(text).width < maxWidth) return [text];
    if (ctx.measureText("W").width > maxWidth) return null;

    const words = text.split(" ");
    const lines = [];
    let line = "";

    while (words.length > 0) {
        let split = false;
        while (ctx.measureText(words[0]).width >= maxWidth) {
            const temp = words[0];
            words[0] = temp.slice(0, -1);
            if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
            else {
                split = true;
                words.splice(1, 0, temp.slice(-1));
            }
        }
        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth)
            line += `${words.shift()} `;
        else {
            lines.push(line.trim());
            line = "";
        }
        if (words.length === 0) lines.push(line.trim());
    }

    return lines;
};

module.exports.onLoad = async function () {
    let Canvas;
    try {
        Canvas = require("canvas");
    } catch (error) {
        console.log("𝐶𝑎𝑛𝑣𝑎𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        return;
    }

    if (!fs.existsSync(__dirname + "/cache/SVN-Arial 2.ttf")) {
        try {
            const getfont = (await axios.get(
                "https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download",
                { responseType: "arraybuffer" }
            )).data;
            fs.writeFileSync(__dirname + "/cache/SVN-Arial 2.ttf", Buffer.from(getfont, "utf-8"));
            Canvas.registerFont(__dirname + "/cache/SVN-Arial 2.ttf", { family: "SVN-Arial 2" });
        } catch (error) {
            console.log("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑜𝑛𝑡");
        }
    } else {
        Canvas.registerFont(__dirname + "/cache/SVN-Arial 2.ttf", { family: "SVN-Arial 2" });
    }
};

module.exports.onStart = async function ({ api, event, args }) {
    try {
        let Canvas;
        try {
            Canvas = require("canvas");
        } catch (error) {
            return api.sendMessage("𝐶𝑎𝑛𝑣𝑎𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒", event.threadID, event.messageID);
        }

        const { loadImage, createCanvas } = Canvas;
        const pathImg = __dirname + "/cache/cheems.png";

        // Process input text
        const textSegments = args.join(" ")
            .trim()
            .replace(/\s+/g, " ")
            .replace(/(\s+\|)/g, "|")
            .replace(/\|\s+/g, "|")
            .split("|")
            .slice(0, 4);

        // Download base image
        let getImage;
        try {
            getImage = (await axios.get("https://i.imgur.com/KkM47H9.png", { responseType: "arraybuffer" })).data;
        } catch (error) {
            return api.sendMessage("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑏𝑎𝑠𝑒 𝑖𝑚𝑎𝑔𝑒", event.threadID, event.messageID);
        }

        fs.writeFileSync(pathImg, Buffer.from(getImage, "utf-8"));

        // Convert to Mathematical Bold Italic
        const toMathBoldItalic = (text) => {
            const map = {
                A: "𝑨", B: "𝑩", C: "𝑪", D: "𝑫", E: "𝑬", F: "𝑭", G: "𝑮", H: "𝑯", I: "𝑰", J: "𝑱", 
                K: "𝑲", L: "𝑳", M: "𝑴", N: "𝑵", O: "𝑶", P: "𝑷", Q: "𝑸", R: "𝑹", S: "𝑺", T: "𝑻", 
                U: "𝑼", V: "𝑽", W: "𝑾", X: "𝑿", Y: "𝒀", Z: "𝒁",
                a: "𝒂", b: "𝒃", c: "𝒄", d: "𝒅", e: "𝒆", f: "𝒇", g: "𝒈", h: "𝒉", i: "𝒊", j: "𝒋", 
                k: "𝒌", l: "𝒍", m: "𝒎", n: "𝒏", o: "𝒐", p: "𝒑", q: "𝒒", r: "𝒓", s: "𝒔", t: "𝒕", 
                u: "𝒖", v: "𝒗", w: "𝒘", x: "𝒙", y: "𝒚", z: "𝒛",
                "0": "𝟎", "1": "𝟏", "2": "𝟐", "3": "𝟑", "4": "𝟒", "5": "𝟓", "6": "𝟔", "7": "𝟕", "8": "𝟖", "9": "𝟗",
                " ": " ", "!": "!", "?": "?", ".": ".", ",": ",", "'": "'", '"': '"', ":": ":", ";": ";", "-": "-", "_": "_"
            };
            return text.split("").map((c) => map[c] || c).join("");
        };

        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        ctx.font = "30px SVN-Arial 2";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";

        // Wrap and draw each segment
        const drawPositions = [90, 240, 370, 500];
        for (let i = 0; i < 4; i++) {
            const segment = toMathBoldItalic(textSegments[i] || "");
            const lines = await this.wrapText(ctx, segment, 464);
            if (lines) {
                ctx.fillText(lines.join("\n"), 330, drawPositions[i]);
            }
        }

        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);

        await api.sendMessage({
            body: "🐾 𝐶ℎ𝑒𝑒𝑚𝑠 𝑖𝑚𝑎𝑔𝑒 𝑟𝑒𝑎𝑑𝑦! 𝐸𝑛𝑗𝑜𝑦 🐶",
            attachment: fs.createReadStream(pathImg)
        }, event.threadID, event.messageID);

        fs.unlinkSync(pathImg);

    } catch (error) {
        console.error("𝐶ℎ𝑒𝑒𝑚𝑠 𝑒𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝐶ℎ𝑒𝑒𝑚𝑠 𝑖𝑚𝑎𝑔𝑒", event.threadID, event.messageID);
    }
};
