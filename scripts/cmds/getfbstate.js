const fs = require("fs-extra");

module.exports = {
    config: {
        name: "getfbstate",
        aliases: ["getstate", "fbstate"],
        version: "1.2",
        author: "Asif Mahmud",
        countDown: 5,
        role: 2,
        category: "system",
        shortDescription: {
            en: "Get current fbstate in different formats"
        },
        longDescription: {
            en: "Get current Facebook state in cookies, string, or default format"
        },
        guide: {
            en: "{p}getfbstate [cookies/string]"
        },
        dependencies: {
            "fs-extra": ""
        }
    },

    onStart: async function ({ api, event, args, message }) {
        try {
            // Dependency check
            try {
                require("fs-extra");
            } catch (e) {
                return message.reply("✗ Missing dependency: fs-extra");
            }

            let fbstate;
            let fileName;
            let messageText;

            const formatType = args[0]?.toLowerCase();

            if (["cookie", "cookies", "c"].includes(formatType)) {
                fbstate = JSON.stringify(api.getAppState().map(e => ({
                    name: e.key,
                    value: e.value
                })), null, 2);
                fileName = "cookies.json";
                messageText = "🍪 COOKIES FORMAT";
            }
            else if (["string", "str", "s"].includes(formatType)) {
                fbstate = api.getAppState().map(e => `${e.key}=${e.value}`).join("; ");
                fileName = "cookies_string.txt";
                messageText = "📝 STRING FORMAT";
            }
            else {
                fbstate = JSON.stringify(api.getAppState(), null, 2);
                fileName = "appState.json";
                messageText = "🔑 DEFAULT APPSTATE";
            }

            const pathSave = `${__dirname}/tmp/${fileName}`;
            
            // Ensure tmp directory exists
            await fs.ensureDir(`${__dirname}/tmp`);
            await fs.outputFile(pathSave, fbstate);

            if (event.senderID !== event.threadID) {
                await message.reply("✓ Successfully sent fbstate to your PM! Please check your private messages");
            }

            await message.reply({
                body: `🔐 FBSTATE EXTRACTED\n────────────────────\n${messageText}\nFile: ${fileName}\nTime: ${new Date().toLocaleString()}`,
                attachment: fs.createReadStream(pathSave)
            });

            // Clean up
            try {
                fs.unlinkSync(pathSave);
            } catch (e) {
                console.error("Cleanup error:", e);
            }

        } catch (error) {
            console.error("FBState Error:", error);
            await message.reply("✗ Error: Failed to generate fbstate file");
        }
    }
};
