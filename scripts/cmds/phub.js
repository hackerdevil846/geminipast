/**
 * @author 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
 * @description Create a Pornhub-style comment image with a user's avatar and text.
 */

module.exports = {
    config: {
        name: "phub",
        version: "1.0.2",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "edit-img",
        shortDescription: {
            en: "✍️ 𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑃𝑜𝑟𝑛ℎ𝑢𝑏−𝑠𝑡𝑦𝑙𝑒 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑖𝑚𝑎𝑔𝑒"
        },
        longDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑃𝑜𝑟𝑛ℎ𝑢𝑏−𝑠𝑡𝑦𝑙𝑒 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑎 𝑢𝑠𝑒𝑟'𝑠 𝑎𝑣𝑎𝑡𝑎𝑟 𝑎𝑛𝑑 𝑡𝑒𝑥𝑡"
        },
        guide: {
            en: "{𝑝}𝑝ℎ𝑢𝑏 [𝑡𝑒𝑥𝑡]"
        },
        countDown: 10,
        dependencies: {
            "canvas": "",
            "axios": "",
            "fs-extra": ""
        }
    },

    /**
     * Wraps text to fit within a specified width on a canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {string} text - The text to wrap.
     * @param {number} maxWidth - The maximum width of a line.
     * @returns {Promise<string[]>} - A promise that resolves with an array of lines.
     */
    wrapText: (ctx, text, maxWidth) => {
        return new Promise(resolve => {
            if (ctx.measureText(text).width < maxWidth) return resolve([text]);
            if (ctx.measureText('W').width > maxWidth) return resolve(null);
            const words = text.split(' ');
            const lines = [];
            let line = '';
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
                if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
                else {
                    lines.push(line.trim());
                    line = '';
                }
                if (words.length === 0) lines.push(line.trim());
            }
            return resolve(lines);
        });
    },

    /**
     * The main function that runs the command.
     * @param {object} context - The context object provided by the bot.
     */
    onStart: async function({ api, event, args, message }) {
        const { senderID, threadID, messageID } = event;
        const { loadImage, createCanvas } = require("canvas");
        const fs = require("fs-extra");
        const axios = require("axios");

        // Dependency check
        const requiredDeps = this.config.dependencies;
        for (const dep in requiredDeps) {
            try {
                require(dep);
            } catch (e) {
                return message.reply(`❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: ${dep}\n𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑤𝑖𝑡ℎ: 𝑛𝑝𝑚 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 ${dep}`);
            }
        }

        // --- Define file paths ---
        const avatarPath = __dirname + '/cache/avt.png';
        const imagePath = __dirname + '/cache/porn.png';

        // --- Get user input and info ---
        const text = args.join(" ");
        if (!text) {
            return message.reply("👋 𝐻𝑒𝑦 𝑡ℎ𝑒𝑟𝑒! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑠𝑜𝑚𝑒 𝑡𝑒𝑥𝑡 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑃𝑜𝑟𝑛ℎ𝑢𝑏 𝑐𝑜𝑚𝑚𝑒𝑛𝑡.");
        }

        try {
            const userInfo = (await api.getUserInfo(senderID))[senderID];
            const userName = userInfo.name;
            const userAvatarUrl = userInfo.thumbSrc;

            // --- Fetch images ---
            const [avatarResponse, pornHubTemplateResponse] = await Promise.all([
                axios.get(userAvatarUrl, { responseType: 'arraybuffer' }),
                axios.get('https://raw.githubusercontent.com/ProCoderMew/Module-Miraiv2/main/data/phub.png', { responseType: 'arraybuffer' })
            ]);

            // --- Write images to file ---
            fs.writeFileSync(avatarPath, Buffer.from(avatarResponse.data, 'utf-8'));
            fs.writeFileSync(imagePath, Buffer.from(pornHubTemplateResponse.data, 'utf-8'));

            // --- Load images to canvas ---
            const userAvatar = await loadImage(avatarPath);
            const baseImage = await loadImage(imagePath);
            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");

            // --- Draw background and avatar ---
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(userAvatar, 30, 310, 70, 70); // Draw avatar

            // --- Draw user name ---
            ctx.font = "700 23px Arial";
            ctx.fillStyle = "#FF9900";
            ctx.textAlign = "start";
            ctx.fillText(userName, 115, 350);

            // --- Draw the comment text ---
            ctx.font = "400 23px Arial";
            ctx.fillStyle = "#ffff";
            ctx.textAlign = "start";

            let fontSize = 23;
            while (ctx.measureText(text).width > 2600) {
                fontSize--;
                ctx.font = `400 ${fontSize}px Arial, sans-serif`;
            }

            const lines = await this.wrapText(ctx, text, 1160);
            ctx.fillText(lines.join('\n'), 30, 430);

            // --- Finalize and send the image ---
            ctx.beginPath();
            const imageBuffer = canvas.toBuffer();
            fs.writeFileSync(imagePath, imageBuffer);
            fs.removeSync(avatarPath); // Clean up the avatar file

            return message.reply({
                body: "✨ 𝐻𝑒𝑟𝑒 𝑖𝑠 𝑦𝑜𝑢𝑟 𝑃𝑜𝑟𝑛ℎ𝑢𝑏 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑖𝑚𝑎𝑔𝑒!",
                attachment: fs.createReadStream(imagePath)
            }, () => fs.unlinkSync(imagePath), messageID);

        } catch (error) {
            console.error("𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑃𝑜𝑟𝑛ℎ𝑢𝑏 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑖𝑚𝑎𝑔𝑒:", error);
            return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
