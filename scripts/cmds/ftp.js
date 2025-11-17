const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const ftp = require("basic-ftp");

const FTP_CONFIG = {
  host: "ftpupload.net",
  user: "cpfr_39361582",
  password: "chitron@2448766",
  secure: false,
  port: 21
};

module.exports = {
    config: {
        name: "ftp",
        aliases: ["ftpupload", "serverupload"],
        version: "2.2",
        author: "Asif Mahmud",
        countDown: 5,
        role: 2,
        category: "tools",
        shortDescription: {
            en: "Upload, list, delete FTP files"
        },
        longDescription: {
            en: "Upload .js/.txt/.html/etc to your FTP server (HTDOCS/STORE)"
        },
        guide: {
            en: "Usage:\n\nUpload:\n{p}ftp file.js console.log('hi');\n{p}ftp file.js https://link\n\nList files:\n{p}ftp list\n\nDelete file:\n{p}ftp delete file.js"
        },
        dependencies: {
            "fs-extra": "",
            "axios": "",
            "basic-ftp": ""
        }
    },

    onStart: async function({ message, args }) {
        try {
            // Dependency check
            try {
                require("fs-extra");
                require("axios");
                require("basic-ftp");
            } catch (e) {
                return message.reply("Missing dependencies: fs-extra, axios, basic-ftp");
            }

            if (!args || args.length === 0) {
                return message.reply("Please provide a command. Use: {p}ftp help");
            }
            return await handleFtp(message, args);
        } catch (error) {
            console.error("FTP Error:", error);
            return message.reply("An error occurred: " + error.message);
        }
    }
};

async function handleFtp(message, args) {
    const subCmd = args[0];

    // List files
    if (subCmd === "list") {
        return await listFiles(message);
    }

    // Delete file
    if (subCmd === "delete") {
        const filename = args[1];
        if (!filename)
            return message.reply("Please specify a filename to delete");
        return await deleteFile(message, filename);
    }

    // Help command
    if (subCmd === "help") {
        return message.reply(this.config.guide.en);
    }

    // Upload file
    const [filename, ...rest] = args;
    if (!filename || !/\.(js|php|html|txt|py|json)$/i.test(filename)) {
        return message.reply("Valid filename required (.js, .php...)");
    }

    const content = rest.join(" ");
    if (!content)
        return message.reply("Please provide code or URL");

    let code;
    try {
        code = /^https?:\/\//i.test(content.trim())
            ? (await axios.get(content.trim())).data
            : content;
    } catch (err) {
        return message.reply("Could not fetch code from URL");
    }

    const tempPath = path.join(__dirname, "cache", filename);
    await fs.ensureDir(path.dirname(tempPath));
    await fs.writeFile(tempPath, code);

    const client = new ftp.Client();
    try {
        await client.access(FTP_CONFIG);
        await client.cd("htdocs");
        try {
            await client.send("MKD store");
        } catch {}
        await client.cd("store");

        await client.uploadFrom(tempPath, filename);
        await client.close();

        return message.reply(
            `✅ Uploaded \`${filename}\`\n` +
            `📁 To \`HTDOCS/STORE\``
        );
    } catch (err) {
        return message.reply(
            `❌ Upload failed\nReason: ${err.message}`
        );
    } finally {
        client.close();
        await fs.remove(tempPath);
    }
}

// List files
async function listFiles(message) {
    const client = new ftp.Client();
    try {
        await client.access(FTP_CONFIG);
        await client.cd("htdocs/store");
        const files = await client.list();

        if (!files.length)
            return message.reply("No files found");

        const fileList = files
            .map((f, i) => `📄 ${i + 1}. ${f.name} — \`${f.size} bytes\``)
            .join("\n");

        return message.reply(
            `📁 Files in your store:\n\n${fileList}`
        );
    } catch (err) {
        return message.reply("Could not list files");
    } finally {
        client.close();
    }
}

// Delete file
async function deleteFile(message, filename) {
    const client = new ftp.Client();
    try {
        await client.access(FTP_CONFIG);
        await client.remove(`htdocs/store/${filename}`);

        return message.reply(
            `🗑️ Deleted \`${filename}\`\n` +
            `💨 From \`HTDOCS/STORE\``
        );
    } catch (err) {
        return message.reply(
            `❌ Could not delete\nReason: ${err.message}`
        );
    } finally {
        client.close();
    }
}
