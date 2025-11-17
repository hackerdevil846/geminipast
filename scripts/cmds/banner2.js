const axios = require('axios');
const fs = require('fs-extra');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

// Define the toBI function for bold italic text
const toBI = (text) => {
  const map = {
    a: '𝒂', b: '𝒃', c: '𝒄', d: '𝒅', e: '𝒆',
    f: '𝒇', g: '𝒈', h: '𝒉', i: '𝒊', j: '𝒋',
    k: '𝒌', l: '𝒍', m: '𝒎', n: '𝒏', o: '𝒐',
    p: '𝒑', q: '𝒒', r: '𝒓', s: '𝒔', t: '𝒕',
    u: '𝒖', v: '𝒗', w: '𝒘', x: '𝒙', y: '𝒚',
    z: '𝒛', A: '𝑨', B: '𝑩', C: '𝑪', D: '𝑫',
    E: '𝑬', F: '𝑭', G: '𝑮', H: '𝑯', I: '𝑰',
    J: '𝑱', K: '𝑲', L: '𝑳', M: '𝑴', N: '𝑵',
    O: '𝑶', P: '𝑷', Q: '𝑸', R: '𝑹', S: '𝑺',
    T: '𝑻', U: '𝑼', V: '𝑽', W: '𝑾', X: '𝑿',
    Y: '𝒀', Z: '𝒁', 
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
    '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return text.split('').map(char => map[char] || char).join('');
};

module.exports = {
    config: {
        name: "banner2",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 10,
        role: 0,
        category: "media",
        shortDescription: {
            en: "𝖡𝖺𝗇𝗇𝖾𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝗍𝗈𝗈𝗅"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝖼𝗎𝗌𝗍𝗈𝗆 𝖺𝗇𝗂𝗆𝖾 𝖻𝖺𝗇𝗇𝖾𝗋𝗌 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋 𝗇𝖺𝗆𝖾"
        },
        guide: {
            en: "{p}banner2 [𝖿𝗂𝗇𝖽/𝗅𝗂𝗌𝗍] 𝗈𝗋 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝗎𝗌𝖾"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "canvas": "",
            "path": ""
        }
    },

    onStart: async function ({ event, message, args, api }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("canvas");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply(toBI("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖼𝖺𝗇𝗏𝖺𝗌, 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁."));
            }

            const lengthchar = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864', { timeout: 30000 })).data;
            
            if (args[0] == "find" || args[0] == "tìm") {
                if (!args[1]) {
                    return message.reply(toBI("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋 𝖨𝖣. 𝖴𝗌𝖾 '𝖻𝖺𝗇𝗇𝖾𝗋𝟤 𝗅𝗂𝗌𝗍' 𝗍𝗈 𝗌𝖾𝖾 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌"));
                }
                
                const character = lengthchar[args[1]];
                if (!character) {
                    return message.reply(toBI("❌ 𝖢𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖴𝗌𝖾 '𝖻𝖺𝗇𝗇𝖾𝗋𝟤 𝗅𝗂𝗌𝗍' 𝗍𝗈 𝗌𝖾𝖾 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌"));
                }
                
                const imageStream = (await axios.get(character.imgAnime, { responseType: "stream", timeout: 30000 })).data;
                const msg = {
                    body: toBI(`𝖢𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋 𝖨𝖣: ${args[1]}, 𝖣𝖾𝖿𝖺𝗎𝗅𝗍 𝖢𝗈𝗅𝗈𝗋: ${character.colorBg}`),
                    attachment: imageStream
                };
                return message.reply(msg);
            }
            else if (args[0] == "list") {
                const alime = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864', { timeout: 30000 })).data;
                const count = alime.listAnime.length;
                const data = alime.listAnime;
                let page = parseInt(args[1]) || 1;
                page = page < 1 ? 1 : page;
                
                const limit = 20;
                const numPage = Math.ceil(count / limit);
                
                if (page > numPage) {
                    return message.reply(toBI(`❌ 𝖯𝖺𝗀𝖾 ${page} 𝖽𝗈𝖾𝗌𝗇'𝗍 𝖾𝗑𝗂𝗌𝗍. 𝖳𝗁𝖾𝗋𝖾 𝖺𝗋𝖾 𝗈𝗇𝗅𝗒 ${numPage} 𝗉𝖺𝗀𝖾𝗌`));
                }
                
                let msg = toBI("𝖠𝗇𝗂𝗆𝖾 𝖫𝗂𝗌𝗍:\n\n");
                const startIndex = limit * (page - 1);
                const endIndex = Math.min(startIndex + limit, count);
                
                for (let i = startIndex; i < endIndex; i++) {
                    msg += `[ ${i + 1} ] - ${data[i].ID} | ${data[i].name}\n`;
                }
                
                msg += toBI(`\n𝖯𝖺𝗀𝖾 (${page}/${numPage})\n𝖴𝗌𝖾 ${global.config.PREFIX}𝖻𝖺𝗇𝗇𝖾𝗋𝟤 𝗅𝗂𝗌𝗍 <𝗉𝖺𝗀𝖾 𝗇𝗎𝗆𝖻𝖾𝗋>`);
                return message.reply(msg);
            } 
            else {
                return message.reply(toBI("𝖱𝖾𝗉𝗅𝗒 𝗍𝗈 𝗍𝗁𝗂𝗌 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝖺 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋 𝖨𝖣"), (err, info) => {
                    global.client.handleReply.push({
                        step: 1,
                        name: this.config.name,
                        author: event.senderID,
                        messageID: info.messageID
                    });
                });
            }
        } catch (error) {
            console.error("💥 𝖡𝖺𝗇𝗇𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
            return message.reply(toBI("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋"));
        }
    },

    onReply: async function({ event, message, Reply, api }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("canvas");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply(toBI("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖼𝖺𝗇𝗏𝖺𝗌, 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁."));
            }

            if (event.senderID !== Reply.author) {
                return message.reply(toBI("❌ 𝖠𝖼𝖼𝖾𝗌𝗌 𝖽𝖾𝗇𝗂𝖾𝖽"));
            }

            const lengthchar = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864', { timeout: 30000 })).data;

            if (Reply.step === 1) {
                const characterId = event.body.trim();
                const character = lengthchar[characterId];
                
                if (!character) {
                    return message.reply(toBI("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋 𝖨𝖣. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇"), (err, info) => {
                        global.client.handleReply.push({
                            step: 1,
                            name: this.config.name,
                            author: event.senderID,
                            messageID: info.messageID
                        });
                    });
                }

                message.unsend(Reply.messageID);
                return message.reply(toBI(`𝖸𝗈𝗎 𝗌𝖾𝗅𝖾𝖼𝗍𝖾𝖽: ${characterId}\n𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋 𝗇𝖺𝗆𝖾`), (err, info) => {
                    global.client.handleReply.push({
                        step: 2,
                        name: this.config.name,
                        chartid: characterId,
                        author: event.senderID,
                        messageID: info.messageID
                    });
                });
            } 
            else if (Reply.step === 2) {
                message.unsend(Reply.messageID);
                return message.reply(toBI(`𝖸𝗈𝗎𝗋 𝗇𝖺𝗆𝖾: ${event.body}\n𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝖼𝗈𝗅𝗈𝗋 𝗇𝖺𝗆𝖾 𝗈𝗋 𝗁𝖾𝗑 𝖼𝗈𝖽𝖾 (𝗈𝗋 𝗍𝗒𝗉𝖾 '𝗇𝗈' 𝖿𝗈𝗋 𝖽𝖾𝖿𝖺𝗎𝗅𝗍)`), (err, info) => {
                    global.client.handleReply.push({
                        step: 3,
                        name: this.config.name,
                        chartid: Reply.chartid,
                        ten: event.body,
                        author: event.senderID,
                        messageID: info.messageID
                    });
                });
            } 
            else if (Reply.step === 3) {
                message.unsend(Reply.messageID);
                
                const color = event.body.trim();
                const id = Reply.chartid;
                const title = Reply.ten;
                const character = lengthchar[id];
                
                if (!character) {
                    return message.reply(toBI("❌ 𝖢𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋 𝖽𝖺𝗍𝖺 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽"));
                }
                
                const color_ = (!color || color.toLowerCase() === "no") ? character.colorBg : color;
                
                // Create cache directory if it doesn't exist
                const cacheDir = path.join(__dirname, 'cache');
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                }
                
                // Define paths with unique names
                const timestamp = Date.now();
                const pathImg = path.join(cacheDir, `banner_${timestamp}_output.png`);
                const pathAva = path.join(cacheDir, `banner_${timestamp}_character.png`);
                const fontPath = path.join(cacheDir, 'MTOJamai.ttf');
                
                try {
                    // Download font if missing
                    if (!fs.existsSync(fontPath)) {
                        try {
                            const fontData = (await axios.get('https://github.com/hanakuUwU/font/raw/main/MTOJamai.ttf', { 
                                responseType: 'arraybuffer',
                                timeout: 30000
                            })).data;
                            fs.writeFileSync(fontPath, Buffer.from(fontData));
                        } catch (fontError) {
                            console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝗈𝗇𝗍:", fontError);
                            return message.reply(toBI("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝗈𝗇𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋"));
                        }
                    }
                    
                    // Download character image
                    try {
                        const avtAnime = (await axios.get(character.imgAnime, { responseType: 'arraybuffer', timeout: 30000 })).data;
                        fs.writeFileSync(pathAva, Buffer.from(avtAnime));
                    } catch (imgError) {
                        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋 𝗂𝗆𝖺𝗀𝖾:", imgError);
                        return message.reply(toBI("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋"));
                    }
                    
                    // Download assets
                    const assetUrls = [
                        'https://lh3.googleusercontent.com/-tZ8DTN-bXEY/YhScBI5VuSI/AAAAAAAA5QI/8OxatfQvJU8q4TWk8vo9OWawDRn0aQhOACNcBGAsYHQ/s0/a1.png',
                        'https://lh3.googleusercontent.com/-_GlhDWCWQLA/YhScA7so4UI/AAAAAAAA5QA/4NqayceKTTkbQrPT0Cu5TQCuEp-V95T3ACNcBGAsYHQ/s0/a2.png',
                        'https://lh3.googleusercontent.com/-IiDSkRdLuK4/YhScA1Xd7WI/AAAAAAAA5QE/KlFoQuZpFc8W31A2C8-uUmXkpvLbmL6JQCNcBGAsYHQ/s0/a3.png',
                        'https://lh3.googleusercontent.com/-jagDZ8l1rwc/YhSbpTKubAI/AAAAAAAA5P4/GYy2WICTkHAM0AoJvYhsLc6asVsnbAR2wCNcBGAsYHQ/s0/l1.png',
                        'https://lh3.googleusercontent.com/-EE6U5xmi_QY/YhScRCT94XI/AAAAAAAA5QY/6WJM0j7URsgjisGTEN-tgOJ6NVx_Ql5-ACNcBGAsYHQ/s0/l2.png',
                        'https://lh3.googleusercontent.com/-hkTkESFE1OU/YhSdWD3kR_I/AAAAAAAA5Qk/Fw4rwDc5CxEaLacLatZJLT6FAnm5dNYYACNcBGAsYHQ/s0/b1.png',
                        'https://lh3.googleusercontent.com/-U-P92f1nTfk/YhSdVnqbEFI/AAAAAAAA5Qg/UgA37F2XTCY0u_Cu0fghfppITmPZIokFwCNcBGAsYHQ/s0/b2.png'
                    ];
                    
                    const assetPaths = [];
                    for (let i = 0; i < assetUrls.length; i++) {
                        try {
                            const assetPath = path.join(cacheDir, `banner_${timestamp}_asset_${i}.png`);
                            const assetData = (await axios.get(assetUrls[i], { responseType: 'arraybuffer', timeout: 30000 })).data;
                            fs.writeFileSync(assetPath, Buffer.from(assetData));
                            assetPaths.push(assetPath);
                        } catch (assetError) {
                            console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗌𝗌𝖾𝗍 ${i}:`, assetError);
                            // Continue with other assets
                        }
                    }
                    
                    // Create banner
                    const canvas = createCanvas(1080, 1920);
                    const ctx = canvas.getContext('2d');
                    
                    // Load all images
                    let characterImage, assetImages;
                    try {
                        characterImage = await loadImage(pathAva);
                        assetImages = await Promise.all(assetPaths.map(path => loadImage(path)));
                    } catch (loadError) {
                        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾𝗌:", loadError);
                        return message.reply(toBI("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋"));
                    }
                    
                    // Draw background
                    ctx.fillStyle = color_;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    // Draw assets
                    if (assetImages[0]) ctx.drawImage(assetImages[0], 0, 0, canvas.width, canvas.height); // a1.png
                    ctx.drawImage(characterImage, -100, -1000, 1700, 1700);
                    if (assetImages[3]) ctx.drawImage(assetImages[3], 0, 0, canvas.width, canvas.height); // l1.png
                    if (assetImages[4]) ctx.drawImage(assetImages[4], 0, 0, canvas.width, canvas.height); // l2.png
                    if (assetImages[1]) ctx.drawImage(assetImages[1], 0, 0, canvas.width, canvas.height); // a2.png
                    if (assetImages[5]) ctx.drawImage(assetImages[5], -50, 130, 800, 800); // b1.png
                    if (assetImages[6]) ctx.drawImage(assetImages[6], 0, 0, canvas.width, canvas.height); // b2.png
                    
                    // Draw text
                    try {
                        registerFont(fontPath, { family: 'MTOJamai' });
                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 80px MTOJamai';
                        ctx.setTransform(1, -0.1, 0, 1, 0, 0);
                        ctx.textAlign = 'center';
                        ctx.shadowColor = '#000';
                        ctx.shadowBlur = 10;
                        
                        for (let i = 0; i < 5; i++) {
                            ctx.fillText(title, 370, 580);
                        }
                        
                        // Reset transform
                        ctx.setTransform(1, 0, 0, 1, 0, 0);
                    } catch (textError) {
                        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗋𝖺𝗐 𝗍𝖾𝗑𝗍:", textError);
                        // Continue without text
                    }
                    
                    // Save image
                    const buffer = canvas.toBuffer();
                    fs.writeFileSync(pathImg, buffer);
                    
                    // Send result
                    return message.reply({
                        body: toBI("𝖧𝖾𝗋𝖾'𝗌 𝗒𝗈𝗎𝗋 𝖻𝖺𝗇𝗇𝖾𝗋:"),
                        attachment: fs.createReadStream(pathImg)
                    }, async () => {
                        // Cleanup files
                        try {
                            const filesToDelete = [pathImg, pathAva, ...assetPaths];
                            filesToDelete.forEach(file => {
                                if (fs.existsSync(file)) {
                                    fs.unlinkSync(file);
                                }
                            });
                        } catch (cleanupError) {
                            console.error('❌ 𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:', cleanupError);
                        }
                    });
                } catch (error) {
                    console.error('💥 𝖡𝖺𝗇𝗇𝖾𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:', error);
                    return message.reply(toBI("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖻𝖺𝗇𝗇𝖾𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋"));
                }
            }
        } catch (error) {
            console.error('💥 𝖱𝖾𝗉𝗅𝗒 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:', error);
            return message.reply(toBI("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇"));
        }
    }
};
