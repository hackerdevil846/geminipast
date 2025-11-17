// scripts/cmds/sharecmd.js
// Fixed: removed top-level cheerio require and added defensive runtime checks.
// Purpose: share a module file by uploading to Pastebin and sending the raw link to a user.

const axios = require('axios');
const fs = require('fs-extra');
const request = require('request');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "sharecmd",
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 (fixed)",
    role: 2,
    category: "admin",
    shortDescription: { en: "Share a command module with a user via Pastebin" },
    longDescription: { en: "Read a local command file and share it as a Pastebin raw link to a user." },
    guide: { en: "{p}sharecmd [reply|tag|uid|leave blank] moduleName [optionalLabel]" },
    countDown: 0,
    dependencies: {
      axios: "",
      request: "",
      "pastebin-api": "",
      "moment-timezone": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // permission check (safe access)
      const admins = Array.isArray(global.config && global.config.ADMINBOT) ? global.config.ADMINBOT : (global.config && global.config.ADMINBOT ? [global.config.ADMINBOT] : []);
      if (!admins.includes(event.senderID)) {
        return api.sendMessage("⛔ You don't have permission to use this command.", event.threadID, event.messageID);
      }

      // fetch picture (best-effort; if it fails, continue without attachment)
      let pictureAttachment = null;
      try {
        const pictureResp = await axios.get('https://quatangabc.com/vnt_upload/File/Image/share_1.jpg', { responseType: 'arraybuffer', timeout: 10000 });
        const tmpPath = `${__dirname}/tmp_sharecmd_img.jpg`;
        await fs.ensureDir(`${__dirname}`);
        await fs.writeFile(tmpPath, pictureResp.data);
        pictureAttachment = fs.createReadStream(tmpPath);
      } catch (e) {
        // don't block operation if image fetch fails
        console.warn("Could not fetch share image:", e && e.message);
        pictureAttachment = null;
      }

      const now = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");

      // Determine recipient uid:
      // priority: reply -> mentions -> first arg (uid string) -> fallback to sender
      let uid = null;
      if (event.type === 'message_reply' && event.messageReply && event.messageReply.senderID) {
        uid = event.messageReply.senderID;
      } else if (event.mentions && Object.keys(event.mentions).length) {
        uid = Object.keys(event.mentions)[0];
      } else if (args && args[0] && /^\d+$/.test(args[0])) {
        uid = args[0];
      } else {
        uid = event.senderID; // fallback
      }

      const { threadID, messageID, messageReply, type } = event;
      const moduleName = args && args[0] && !/^\d+$/.test(args[0]) ? args[0] : null;
      const pasteLabel = args && args[1] ? args[1] : (args && args[0] && /^\d+$/.test(args[0]) && args[1]) ? args[1] : 'noname';

      // if user didn't reply/mention or provide a module name -> show help message
      if (type !== 'message_reply' && !moduleName) {
        const body = `🌸--「 Share Private Module 」--🌸
◆━━━━━━━━━━━━━━━━━◆
⏰ Time: ${now}
📌 You can reply to a message, tag a user, or pass a user id plus module name to share a module.
Usage examples:
• Reply to a message that contains the module code.
• Or: ${global.config.PREFIX || '!'}sharecmd 1234567890 myModule
• Or: reply to user message then: ${global.config.PREFIX || '!'}sharecmd myModule

What is required: module filename (without .js) or reply to a message that contains the module code.`;
        return api.sendMessage({ body, attachment: pictureAttachment }, threadID, messageID);
      }

      // If the user replied to a message, use that message body as code if present
      let code = null;
      if (type === 'message_reply' && messageReply && messageReply.body) {
        code = messageReply.body;
      }

      // If code is not present in reply and a moduleName is given, try to read local file
      if (!code && moduleName) {
        const filePath = `${process.cwd()}/modules/commands/${moduleName}.js`; // adapt to repo structure
        try {
          if (!(await fs.pathExists(filePath))) {
            // notify not found
            const body = `📝 Module "${moduleName}" not found on the bot system.\nTime: ${now}`;
            return api.sendMessage({ body, attachment: pictureAttachment }, threadID, messageID);
          }
          code = await fs.readFile(filePath, 'utf8');
        } catch (e) {
          console.error("Error reading module file:", e && e.message);
          return api.sendMessage(`❌ Error reading module file "${moduleName}": ${e.message || e}`, threadID, messageID);
        }
      }

      // If still no code, return error
      if (!code) {
        return api.sendMessage("❌ Could not find module code to share. Reply with the code or supply a module name.", threadID, messageID);
      }

      // Paste to Pastebin using pastebin-api
      let pasteUrlRaw = null;
      try {
        const { PasteClient } = require('pastebin-api');
        const client = new PasteClient("R02n6-lNPJqKQCd5VtL4bKPjuK6ARhHb"); // keep your token or replace
        const created = await client.createPaste({
          code: code,
          expireDate: 'N',
          format: "javascript",
          name: pasteLabel || moduleName || 'shared-module',
          publicity: 1
        });
        // created is a URL like https://pastebin.com/XXXXX
        const id = created.split('/').pop();
        pasteUrlRaw = `https://pastebin.com/raw/${id}`;
      } catch (e) {
        console.error("Pastebin upload failed:", e && e.message);
        return api.sendMessage("❌ Failed to upload to Pastebin. Please try again later.", threadID, messageID);
      }

      // Notify the thread that the module was shared
      try {
        await api.sendMessage(`✅ Shared command at ${now}\nRaw: ${pasteUrlRaw}`, threadID, messageID);
      } catch (e) {
        console.warn("Could not notify thread:", e && e.message);
      }

      // Send the paste link and optional attachment to target user (uid)
      try {
        const bodyToUser = `${now}
Here is the shared command${moduleName ? `: ${moduleName}` : ''}.
Raw link: ${pasteUrlRaw}
(You can open the raw link to copy the code.)`;
        await api.sendMessage({ body: bodyToUser, attachment: pictureAttachment }, uid);
      } catch (e) {
        console.error("Failed to send share message to user:", e && e.message);
        return api.sendMessage("❌ Failed to deliver the shared command to the user.", threadID, messageID);
      } finally {
        // cleanup temporary image if created
        try {
          if (pictureAttachment) {
            const tmpPath = `${__dirname}/tmp_sharecmd_img.jpg`;
            if (await fs.pathExists(tmpPath)) await fs.unlink(tmpPath);
          }
        } catch (_) { /* ignore cleanup errors */ }
      }

    } catch (err) {
      console.error("sharecmd error:", err && (err.stack || err.message || err));
      try { return api.sendMessage("❌ An unexpected error occurred while sharing the module.", event.threadID, event.messageID); } catch (_) {}
    }
  }
};
