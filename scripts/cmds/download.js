const fs = require("fs-extra");
const axios = require("axios");
const request = require("request");

module.exports = {
    config: {
        name: "download",
        aliases: ["filedownload", "getfile"],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 2,
        category: "system",
        shortDescription: {
            en: "Download files from links"
        },
        longDescription: {
            en: "Download files from external links to the bot's system"
        },
        guide: {
            en: "{p}download [path] <link>"
        },
        dependencies: {
            "fs-extra": "",
            "axios": "",
            "request": ""
        }
    },

    onStart: async function({ message, args }) {
        try {
            // Dependency check
            try {
                require("fs-extra");
                require("axios");
                require("request");
            } catch (e) {
                return message.reply("Missing required dependencies: fs-extra, axios, request");
            }

            let path, link;
            
            if (args.length < 1) {
                return message.reply("Invalid usage! Please provide a download link");
            }

            if (args.length === 1) {
                path = __dirname;
                link = args[0];
            } else {
                path = __dirname + '/' + args[0];
                link = args.slice(1).join(" ");
            }

            // Validate link
            if (!link.startsWith('http')) {
                return message.reply("Invalid link! Please provide a valid HTTP/HTTPS link");
            }

            // Create directory if it doesn't exist
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path, { recursive: true });
            }

            // Get filename from URL
            const format = request.get(link);
            const namefile = format.uri.pathname;
            const fileName = namefile.slice(namefile.lastIndexOf("/") + 1);
            const fullPath = path + '/' + fileName;

            await message.reply("Downloading file...");

            const response = await axios.get(link, { 
                responseType: "arraybuffer",
                timeout: 30000
            });
            
            fs.writeFileSync(fullPath, Buffer.from(response.data, "utf-8"));

            return message.reply(`File successfully downloaded to:\n${fullPath}`);
            
        } catch (error) {
            console.error("Download Error:", error);
            
            if (error.code === 'ENOTFOUND') {
                return message.reply("Could not resolve the domain. Please check the link.");
            } else if (error.response && error.response.status === 404) {
                return message.reply("File not found at the provided link.");
            } else if (error.code === 'ECONNABORTED') {
                return message.reply("Download timed out. Please try again.");
            }
            
            return message.reply("Download failed! Please check the link and try again");
        }
    }
};
