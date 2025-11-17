const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
 config: {
   name: "sketch",
   version: "2.0.2",
   author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
   countDown: 5,
   role: 2, // Admin-only
   shortDescription: {
     en: "Upload command files to pastebin"
   },
   longDescription: {
     en: "Upload local command files to pastebin service and get shareable links"
   },
   category: "developer",
   guide: {
     en: "{pn} [filename]"
   }
 },

 onStart: async function ({ api, event, args, message }) {
   try {
     // Check if filename was provided
     if (!args[0]) {
       return message.reply("📁 Please provide a filename.\nUsage: sketch <filename>");
     }

     const fileName = args[0].trim();
     
     // Validate filename
     if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
       return message.reply("❌ Invalid filename. Please provide a valid filename without path characters.");
     }

     // Get the absolute path to the commands directory
     const commandsPath = path.resolve(__dirname, '../../scripts/cmds');
     
     console.log(`🔍 Looking for file in: ${commandsPath}`);

     // Check if commands directory exists
     if (!fs.existsSync(commandsPath)) {
       return message.reply("❌ Commands directory not found. Please check the bot structure.");
     }

     // Check both with and without .js extension
     let filePath;
     if (fileName.endsWith('.js')) {
       filePath = path.join(commandsPath, fileName);
     } else {
       filePath = path.join(commandsPath, fileName + '.js');
     }

     // Check if file exists
     if (!fs.existsSync(filePath)) {
       // Try to find similar files
       let files = [];
       try {
         files = fs.readdirSync(commandsPath);
       } catch (readError) {
         return message.reply("❌ Cannot read commands directory.");
       }
       
       const similar = files.filter(f => 
         f.toLowerCase().includes(fileName.toLowerCase()) && f.endsWith('.js')
       );
       
       if (similar.length > 0) {
         return message.reply(`❌ File not found. Did you mean:\n${similar.slice(0, 5).join('\n')}`);
       }
       return message.reply(`❌ File "${fileName}.js" not found in commands folder.`);
     }

     // Check if it's a directory
     const stats = fs.statSync(filePath);
     if (stats.isDirectory()) {
       return message.reply("❌ The specified path is a directory, not a file.");
     }

     // Read the file
     let fileContent;
     try {
       fileContent = fs.readFileSync(filePath, 'utf8');
       
       // Check if file is empty
       if (!fileContent.trim()) {
         return message.reply("❌ The file is empty.");
       }
     } catch (readError) {
       return message.reply("❌ Cannot read the file. It may be corrupted or inaccessible.");
     }

     // Upload to pastebin
     const uploadMsg = await message.reply("📤 Uploading file to PasteBin, please wait...");
     
     try {
       const response = await axios.post('https://pastebin-api.vercel.app/paste', {
         text: fileContent,
         language: "javascript"
       }, {
         timeout: 15000 // 15 second timeout
       });

       if (response.data?.id) {
         const rawUrl = `https://pastebin-api.vercel.app/raw/${response.data.id}`;
         const viewUrl = `https://pastebin-api.vercel.app/paste/${response.data.id}`;
         
         await api.unsendMessage(uploadMsg.messageID);
         
         return message.reply(`✅ File uploaded successfully!\n\n📝 File: ${path.basename(filePath)}\n🔗 Raw URL: ${rawUrl}\n👀 View URL: ${viewUrl}`);
       }
       
       throw new Error('Invalid API response: No ID received');
       
     } catch (uploadError) {
       await api.unsendMessage(uploadMsg.messageID);
       console.error("📤 Upload error:", uploadError);
       
       let errorMsg = "❌ Failed to upload file. Please try again later.";
       
       if (uploadError.code === 'ECONNREFUSED' || uploadError.code === 'ENETUNREACH') {
         errorMsg = "🌐 Network error: Cannot connect to PasteBin service.";
       } else if (uploadError.code === 'ETIMEDOUT') {
         errorMsg = "⏰ Upload timeout: Service is taking too long to respond.";
       } else if (uploadError.response) {
         errorMsg = `❌ API Error: ${uploadError.response.status} - ${uploadError.response.statusText}`;
       }
       
       return message.reply(errorMsg);
     }

   } catch (error) {
     console.error("💥 Error:", error);
     
     let errorMessage = "❌ An unexpected error occurred while processing your request.";
     
     if (error.message.includes('ENOENT')) {
       errorMessage = "❌ File or directory not found.";
     } else if (error.message.includes('EACCES')) {
       errorMessage = "❌ Permission denied: Cannot access the file.";
     }
     
     return message.reply(errorMessage);
   }
 }
};
