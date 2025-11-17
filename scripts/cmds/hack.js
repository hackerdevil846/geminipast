const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

module.exports = {
    config: {
        name: "hack",
        aliases: ["hacking", "simulatehack"],
        version: "1.2.0",
        author: "Asif Mahmud",
        countDown: 15,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "Hacking simulation with visual effects"
        },
        longDescription: {
            en: "Simulates hacking with visual terminal effects and data extraction"
        },
        guide: {
            en: "{p}hack [@mention]"
        }
    },

    onStart: async function({ api, event, args, usersData }) {
        try {
            const targetID = Object.keys(event.mentions)[0] || event.senderID;
            const targetData = await usersData.get(targetID);
            const targetName = targetData.name || "Unknown User";
            
            // Send initial message
            const initMsg = await api.sendMessage(`🔍 Initiating hacking sequence for ${targetName}...\n⏳ Please wait, this may take a moment...`, event.threadID);
            
            // Ensure cache directory exists
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            // Get user's profile picture with error handling
            let avatarBuffer = null;
            try {
                const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                const avatarResponse = await axios.get(avatarUrl, { 
                    responseType: 'arraybuffer',
                    timeout: 30000 
                });
                avatarBuffer = Buffer.from(avatarResponse.data, 'binary');
                
                // Validate avatar buffer
                if (!avatarBuffer || avatarBuffer.length === 0) {
                    throw new Error("Empty avatar response");
                }
            } catch (avatarError) {
                console.error("Avatar download failed:", avatarError);
                // Continue without avatar
            }
            
            // Create hacking simulation
            const canvas = createCanvas(800, 500);
            const ctx = canvas.getContext('2d');
            
            // Draw background
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add matrix code effect
            ctx.font = '14px "Courier New"';
            ctx.fillStyle = '#00ff00';
            for (let i = 0; i < 50; i++) {
                ctx.fillText(
                    Math.random().toString(36).substring(2, 15),
                    Math.random() * canvas.width,
                    Math.random() * canvas.height
                );
            }
            
            // Draw terminal window
            ctx.fillStyle = 'rgba(0, 30, 0, 0.8)';
            ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
            
            // Add terminal text
            ctx.font = 'bold 16px "Courier New"';
            ctx.fillStyle = '#00ff00';
            ctx.fillText('> INITIATING HACKING SEQUENCE...', 70, 80);
            ctx.fillText('> TARGET: ' + targetName, 70, 105);
            ctx.fillText('> BYPASSING SECURITY PROTOCOLS...', 70, 130);
            
            // Add progress bar
            ctx.fillStyle = '#003300';
            ctx.fillRect(70, 160, 600, 25);
            ctx.fillStyle = '#00cc00';
            ctx.fillRect(70, 160, 600 * 0.75, 25);
            ctx.fillStyle = '#00ff00';
            ctx.fillText('75% COMPLETE', 300, 178);
            
            // Add more terminal output
            ctx.fillText('> EXTRACTING PERSONAL DATA...', 70, 220);
            ctx.fillText('> FOUND: Email - ' + generateFakeEmail(targetName), 90, 245);
            ctx.fillText('> FOUND: Password - ' + generatePassword(12), 90, 270);
            ctx.fillText('> ACCESSING PRIVATE MESSAGES...', 70, 295);
            ctx.fillText('> ENCRYPTION BYPASSED SUCCESSFULLY!', 70, 320);
            
            // Draw user avatar if available
            if (avatarBuffer) {
                try {
                    const avatar = await loadImage(avatarBuffer);
                    // Draw circular avatar
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(650, 350, 40, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(avatar, 610, 310, 80, 80);
                    ctx.restore();
                    
                    // Draw border around avatar
                    ctx.beginPath();
                    ctx.arc(650, 350, 40, 0, Math.PI * 2, true);
                    ctx.strokeStyle = '#00ff00';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } catch (avatarLoadError) {
                    console.error("Error loading avatar image:", avatarLoadError);
                }
            }
            
            // Add hack complete message
            ctx.font = 'bold 20px "Courier New"';
            ctx.fillStyle = '#00ff00';
            ctx.fillText('>>> HACK COMPLETE - ALL DATA EXTRACTED <<<', 150, 370);
            
            // Add target info
            ctx.font = '16px "Courier New"';
            ctx.fillText('Target: ' + targetName, 70, 410);
            ctx.fillText('Status: COMPROMISED', 70, 435);
            ctx.fillText('Data Security: BREACHED', 70, 460);
            
            // Save the image
            const buffer = canvas.toBuffer('image/png');
            const imagePath = path.join(__dirname, 'cache', 'hack_result_' + Date.now() + '.png');
            await fs.writeFile(imagePath, buffer);
            
            // Verify file was created
            if (!fs.existsSync(imagePath)) {
                throw new Error("Failed to create hack result image");
            }

            // Send the result
            await api.sendMessage({
                body: `🔓 Hacking completed successfully!\n👨‍💻 Target: ${targetName}\n📂 Data extracted and sent to secure server!`,
                attachment: fs.createReadStream(imagePath)
            }, event.threadID);
            
            // Clean up
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
                if (initMsg && initMsg.messageID) {
                    await api.unsendMessage(initMsg.messageID);
                }
            } catch (cleanupError) {
                console.error("Cleanup error:", cleanupError);
            }
            
        } catch (error) {
            console.error("Hack Command Error:", error);
            
            let errorMessage = '❌ Error in hacking procedure. Please try again.';
            
            if (error.message.includes('timeout')) {
                errorMessage = '❌ Request timeout. Please try again.';
            } else if (error.message.includes('ENOTFOUND')) {
                errorMessage = '❌ Network error. Please check your connection.';
            }
            
            api.sendMessage(errorMessage, event.threadID, event.messageID);
        }
    }
};

// Helper function to generate fake email
function generateFakeEmail(name) {
    const domains = ['gmail.com', 'yahoo.com', 'protonmail.com', 'hushmail.com'];
    const namePart = name.replace(/\s+/g, '').toLowerCase().substring(0, 8);
    const randomNum = Math.floor(Math.random() * 1000);
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${namePart}${randomNum}@${domain}`;
}

// Helper function to generate random password
function generatePassword(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}
