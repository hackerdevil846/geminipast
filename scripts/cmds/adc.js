const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "adc",
    aliases: [],
    version: "1.0.0",
    author: "Asif Mahmud",
    countDown: 0,
    role: 2,
    category: "admin",
    shortDescription: {
      en: "Download and install commands from URLs"
    },
    longDescription: {
      en: "Download and install commands from various sources"
    },
    guide: {
      en: "{p}adc [command_name] [url]"
    },
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "path": ""
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      // Validate dependencies
      try {
        require("fs-extra");
        require("axios");
        require("path");
      } catch (depError) {
        return message.reply("❌ Missing dependencies. Please install: fs-extra, axios, path");
      }

      if (args.length === 0) {
        return message.reply(
          "📥 ADC Command Usage:\n\n" +
          "• {p}adc [command_name] - Create backup of existing command\n" +
          "• {p}adc [command_name] [url] - Download and install from URL\n" +
          "• Reply to a message with {p}adc [command_name] - Download from replied text\n\n" +
          "🔗 Supported URLs:\n" +
          "• Pastebin (pastebin.com)\n" +
          "• GitHub Raw (raw.githubusercontent.com)\n" +
          "• Direct file URLs"
        );
      }

      const commandName = args[0].toLowerCase();
      let fileUrl = args[1];
      let text = "";

      // Handle message reply
      if (event.type === "message_reply") {
        if (event.messageReply.attachments && event.messageReply.attachments.length > 0) {
          fileUrl = event.messageReply.attachments[0].url;
        } else if (event.messageReply.body) {
          text = event.messageReply.body;
          if (text.startsWith('http')) {
            fileUrl = text;
          }
        }
      }

      // Validate command name
      if (!commandName || !/^[a-z0-9_]+$/.test(commandName)) {
        return message.reply("❌ Invalid command name. Use only lowercase letters, numbers, and underscores.");
      }

      if (commandName.length > 30) {
        return message.reply("❌ Command name too long. Maximum 30 characters.");
      }

      const commandsDir = path.join(__dirname, '..');
      const filePath = path.join(commandsDir, `${commandName}.js`);

      // Backup existing command if no URL provided
      if (!fileUrl && !text) {
        if (!fs.existsSync(filePath)) {
          return message.reply(`❌ Command "${commandName}" does not exist. Provide a URL to install new command.`);
        }

        try {
          const commandData = await fs.readFile(filePath, "utf-8");
          
          // Create temp directory if it doesn't exist
          const tempDir = path.join(__dirname, '..', '..', 'temp');
          if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
          }
          
          const backupPath = path.join(tempDir, `${commandName}_backup_${Date.now()}.js`);
          await fs.writeFile(backupPath, commandData);
          
          return message.reply({
            body: `✅ Backup created for "${commandName}.js"\n📁 Location: ${backupPath}`,
            attachment: fs.createReadStream(backupPath)
          });
          
        } catch (err) {
          console.error("Backup error:", err);
          return message.reply(`❌ Backup failed: ${err.message}`);
        }
      }

      // Download and install command
      try {
        const finalUrl = fileUrl || text;
        
        if (!finalUrl) {
          return message.reply("❌ No URL provided.");
        }

        console.log(`📥 Downloading from: ${finalUrl}`);

        let fileContent;
        let response;

        // Handle different URL types
        if (finalUrl.includes('pastebin.com')) {
          let rawUrl;
          if (finalUrl.includes('/raw/')) {
            rawUrl = finalUrl;
          } else {
            const pasteId = finalUrl.split('/').pop();
            rawUrl = `https://pastebin.com/raw/${pasteId}`;
          }
          
          response = await axios.get(rawUrl, { 
            timeout: 15000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          fileContent = response.data;
        }
        else if (finalUrl.includes('github.com') || finalUrl.includes('raw.githubusercontent.com')) {
          response = await axios.get(finalUrl, { 
            timeout: 15000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          fileContent = response.data;
        }
        else if (finalUrl.includes('drive.google.com')) {
          return message.reply("❌ Google Drive download not supported. Please use Pastebin or GitHub Raw.");
        }
        else if (finalUrl.startsWith('http')) {
          response = await axios.get(finalUrl, { 
            timeout: 15000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          fileContent = response.data;
        }
        else {
          return message.reply("❌ Unsupported URL type. Please provide a valid HTTP/HTTPS URL.");
        }

        // Validate file content
        if (!fileContent || typeof fileContent !== 'string') {
          return message.reply("❌ Invalid file content received from URL.");
        }

        if (fileContent.trim().length === 0) {
          return message.reply("❌ Empty file content received.");
        }

        // Basic command validation
        const requiredPatterns = [
          'module.exports',
          'onStart'
        ];

        const missingPatterns = requiredPatterns.filter(pattern => !fileContent.includes(pattern));
        if (missingPatterns.length > 0) {
          return message.reply(`❌ The downloaded file does not appear to be a valid command. Missing: ${missingPatterns.join(', ')}`);
        }

        // Check for potentially dangerous code
        const dangerousPatterns = [
          'process.exit',
          'require("child_process")',
          'execSync',
          'spawnSync',
          'fs.rm',
          'fs.unlink',
          'eval('
        ];

        const foundDangerous = dangerousPatterns.filter(pattern => fileContent.includes(pattern));
        if (foundDangerous.length > 0) {
          return message.reply(`❌ Command contains potentially dangerous code: ${foundDangerous.join(', ')}. Installation blocked.`);
        }

        // Create backup of existing file
        if (fs.existsSync(filePath)) {
          const backupDir = path.join(__dirname, '..', '..', 'temp', 'backups');
          if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
          }
          const backupPath = path.join(backupDir, `${commandName}_backup_${Date.now()}.js`);
          const existingContent = await fs.readFile(filePath, "utf-8");
          await fs.writeFile(backupPath, existingContent);
          console.log(`✅ Backup created: ${backupPath}`);
        }

        // Write the new command file
        await fs.writeFile(filePath, fileContent, "utf-8");
        
        // Verify the file was written
        if (!fs.existsSync(filePath)) {
          throw new Error("File was not created successfully");
        }

        const fileStats = fs.statSync(filePath);
        if (fileStats.size === 0) {
          throw new Error("File was created but is empty");
        }

        console.log(`✅ Command installed: ${filePath}`);
        
        return message.reply(`✅ Command "${commandName}.js" installed successfully!\n\nUse "${global.config.PREFIX}load ${commandName}" to load the command.`);

      } catch (error) {
        console.error("Download/Install error:", error);
        
        let errorMessage = `❌ Download/Install failed: ${error.message}`;
        
        if (error.code === 'ECONNREFUSED') {
          errorMessage = "❌ Network error: Cannot connect to the server.";
        } else if (error.code === 'ETIMEDOUT') {
          errorMessage = "❌ Timeout error: Server is taking too long to respond.";
        } else if (error.response) {
          errorMessage = `❌ Server error: ${error.response.status} - ${error.response.statusText}`;
        }
        
        return message.reply(errorMessage);
      }

    } catch (error) {
      console.error("ADC Command Error:", error);
      await message.reply(`❌ Unexpected error: ${error.message}`);
    }
  }
};
