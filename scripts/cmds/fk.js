const axios = require("axios");
const fs = require("fs-extra"); // fs-extra is used for async fs operations
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "fk",
        aliases: [],
        version: "1.0.1", // Incrementing version for the fixed code
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "nsfw",
        shortDescription: {
            en: "🔞 Create an explicit image with a tagged person (V3)"
        },
        longDescription: {
            en: "Generates an explicit image showing a moment between two tagged users, placing their avatars on a specific template (Version 3). The initiator of the command is the male figure, and the tagged user is the female figure."
        },
        guide: {
            en: "{p}fk @mention - Tag a user to generate a special image with them."
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": "",
            "jimp": ""
        }
    },

    // --- onLoad Function ---
    // Ensures cache directories and checks for the template file on bot startup.
    onLoad: async function() {
        const cacheDir = path.resolve(__dirname, 'cache', 'canvas'); // Full path to avoid issues
        const templateFileName = 'fuckv3.png';
        const templatePath = path.join(cacheDir, templateFileName);

        try {
            await fs.ensureDir(cacheDir); // Ensure directory exists
            console.log(`✅ onLoad (fk): Ensured template cache directory exists at ${cacheDir}`);
            
            if (!await fs.pathExists(templatePath)) { // Check if template exists
                console.warn(`⚠️ onLoad (fk): Template '${templateFileName}' not found!`);
                console.warn(`    Please place the template image at: ${templatePath}`);
                console.warn(`    Fallback image link for 'fuckv3.png': https://i.ibb.co/TW9Kbwr/images-2022-08-14-T183542-356.jpg`);
            } else {
                console.log(`✅ onLoad (fk): Template '${templateFileName}' found at: ${templatePath}`);
            }
        } catch (error) {
            console.error("❌ onLoad (fk): Error during setup:", error);
            // Non-critical for bot startup, but crucial for command function
        }
    },

    // --- onStart Function ---
    // Main execution logic for the command.
    onStart: async function({ message, event, api, args }) { // Added 'api' to parameters for unsendMessage
        let generatedImagePath = null; // To store the path of the final generated image for cleanup
        
        try {
            const { senderID, mentions, messageID } = event;
            const mentionedUsers = Object.keys(mentions);

            // --- 1. Input Validation ---
            if (mentionedUsers.length === 0) {
                return message.reply("💌 Please tag someone for this intimate moment! Example: {p}fk @username");
            }
            if (mentionedUsers[0] === senderID) {
                return message.reply("Self-intimacy? Maybe later! 😉 Please tag someone else.");
            }
            if (mentionedUsers[0] === api.getCurrentUserID()) { // Use 'api.getCurrentUserID()' for bot's ID
                return message.reply("I'm just a bot, I can't participate in such moments! 😳 Please tag another user.");
            }

            const userOne = senderID; // User initiating the command (male avatar)
            const userTwo = mentionedUsers[0]; // Mentioned user (female avatar)

            // --- 2. Send Processing Message ---
            const processingMessage = await message.reply("⏳ Generating your special moment, please wait...");

            // --- 3. Generate the Image ---
            generatedImagePath = await this.makeImage({ one: userOne, two: userTwo });
            
            // --- 4. Delete Processing Message ---
            try {
                if (api && api.unsendMessage) { // Ensure api and unsendMessage method exist
                    await api.unsendMessage(processingMessage.messageID);
                } else {
                     console.warn("⚠️ onStart (fk): 'api.unsendMessage' not available. Cannot delete processing message.");
                }
            } catch (e) {
                console.warn("⚠️ onStart (fk): Failed to unsend processing message:", e.message);
            }

            // --- 5. Send Final Response (Image or Error) ---
            if (generatedImagePath && await fs.pathExists(generatedImagePath)) { // Verify generated file exists
                // Add success reaction (best effort)
                try {
                    await api.setMessageReaction("✅", messageID, () => {}, true); // Use original messageID for reaction
                } catch (e) { 
                    console.warn("⚠️ onStart (fk): Failed to set success reaction:", e.message);
                }

                const mentionedName = mentions[userTwo].replace("@", ""); // Get clean mentioned name
                
                await message.reply({
                    body: `💞 A special moment captured for you and @${mentionedName}!`,
                    mentions: [{ tag: `@${mentionedName}`, id: userTwo }], // Ensure the user is properly tagged
                    attachment: fs.createReadStream(generatedImagePath)
                });
                
                console.log("✅ onStart (fk): Successfully sent explicit image.");
            } else {
                // Add error reaction (best effort)
                try {
                    await api.setMessageReaction("❌", messageID, () => {}, true); // Use original messageID for reaction
                } catch (e) { 
                    console.warn("⚠️ onStart (fk): Failed to set error reaction:", e.message);
                }
                await message.reply("❌ Failed to create the explicit image. This might be due to a missing template, an issue with avatar download (e.g., Facebook token invalid/expired), or a temporary network problem. Please try again later or contact the bot owner if the issue persists.");
            }
            
        } catch (error) {
            console.error("💥 onStart (fk): Command Error:", error);
            // Attempt to send an error reaction if possible
            try {
                await api.setMessageReaction("❌", event.messageID, () => {}, true);
            } catch (e) {
                console.warn("⚠️ onStart (fk): Failed to set error reaction on command error:", e.message);
            }
            await message.reply("❌ An unexpected error occurred while processing your request. Please try again later.");
        } finally {
            // --- 6. Final Cleanup (Generated Image) ---
            if (generatedImagePath && await fs.pathExists(generatedImagePath)) {
                try {
                    await fs.unlink(generatedImagePath); // Delete the generated image
                    console.log("🧹 onStart (fk): Cleaned up generated image.");
                } catch (cleanupError) {
                    console.warn("⚠️ onStart (fk): Failed to clean up generated image:", cleanupError.message);
                }
            }
        }
    },

    // --- makeImage Function ---
    // Handles downloading avatars, compositing them onto the template, and saving the final image.
    makeImage: async function({ one, two }) {
        const cacheDir = path.resolve(__dirname, "cache", "canvas");
        const outputPath = path.join(cacheDir, `fk_${one}_${two}_${Date.now()}.png`);
        const avatarOnePath = path.join(cacheDir, `avt1_${one}_${Date.now()}.png`);
        const avatarTwoPath = path.join(cacheDir, `avt2_${two}_${Date.now()}.png`);

        try {
            // --- 1. Template Verification ---
            const templateFileName = "fuckv3.png";
            const templatePath = path.join(cacheDir, templateFileName);
            if (!await fs.pathExists(templatePath)) {
                const errorMessage = `❌ makeImage (fk): Template '${templateFileName}' not found at: ${templatePath}. Cannot proceed with image generation.`;
                console.error(errorMessage);
                throw new Error(errorMessage); // Critical error, propagate it
            }

            console.log("📖 makeImage (fk): Reading template image...");
            const template = await jimp.read(templatePath);

            // --- 2. Facebook Access Token (User-provided as valid) ---
            // It is critical that this token is valid and active.
            const fbToken = `6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`; 

            // --- 3. Avatar Download Helper ---
            const downloadAvatar = async (userID, destPath) => {
                try {
                    console.log(`📥 makeImage (fk): Downloading avatar for user ${userID}...`);
                    const response = await axios.get(
                        `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=${fbToken}`,
                        { 
                            responseType: 'arraybuffer',
                            timeout: 30000 // Increased timeout for potentially slow network/Facebook API
                        }
                    );
                    await fs.writeFile(destPath, response.data); // Write buffer to file
                    
                    // Basic file integrity check after download
                    const stats = await fs.stat(destPath);
                    if (stats.size === 0) {
                        throw new Error("Downloaded avatar file is empty.");
                    }

                    console.log(`✅ makeImage (fk): Downloaded avatar for user ${userID}`);
                    return await jimp.read(destPath); // Read with Jimp
                } catch (error) {
                    console.error(`❌ makeImage (fk): Failed to download or read avatar for ${userID}:`);
                    if (error.response) {
                        console.error(`    HTTP Status: ${error.response.status}`);
                        console.error(`    HTTP Data (if available): ${error.response.data ? error.response.data.toString().substring(0, 200) + "..." : 'N/A'}`);
                    } else if (error.code === 'ECONNABORTED') {
                        console.error(`    Error: Request timed out for avatar download.`);
                    } else if (error.code === 'ENOTFOUND') {
                        console.error(`    Error: DNS lookup failed for Facebook API. Check internet connection.`);
                    } else {
                        console.error(`    Unknown error during avatar download: ${error.message}`);
                    }
                    throw new Error(`Failed to get avatar for user ${userID}. Possible issues: Invalid Facebook Access Token, network problems, or user's privacy settings.`);
                }
            };

            // --- 4. Execute Avatar Downloads ---
            let avatarOne, avatarTwo;
            try {
                avatarOne = await downloadAvatar(one, avatarOnePath);   // Sender's avatar (male)
                avatarTwo = await downloadAvatar(two, avatarTwoPath);   // Mentioned's avatar (female)
            } catch (downloadError) {
                console.error("❌ makeImage (fk): Avatar download failed. Aborting image generation:", downloadError.message);
                throw downloadError; // Re-throw to be caught by onStart
            }

            // --- 5. Create Circular Avatars ---
            console.log("⭕ makeImage (fk): Creating circular avatars...");
            avatarOne.circle();
            avatarTwo.circle();

            // --- 6. Positioning Adjustments for 'fuckv3.png' Template ---
            // These coordinates are estimated from the provided image for the 'fuckv3.png' template.
            
            // Avatar for the female character (top right circle) - userTwo
            const femaleAvatarSize = 70; 
            const femaleAvatarX = 142;    
            const femaleAvatarY = 55;     

            // Avatar for the male character (bottom left circle) - userOne
            const maleAvatarSize = 70;   
            const maleAvatarX = 60;      
            const maleAvatarY = 600;     
            
            // Resize avatars *before* compositing to fit the template circles
            avatarTwo.resize(femaleAvatarSize, femaleAvatarSize); 
            avatarOne.resize(maleAvatarSize, maleAvatarSize);     

            // --- 7. Composite Avatars onto Template ---
            console.log("🎨 makeImage (fk): Compositing avatars on template...");
            template.composite(avatarTwo, femaleAvatarX, femaleAvatarY); 
            template.composite(avatarOne, maleAvatarX, maleAvatarY);     

            // --- 8. Save Final Image ---
            console.log("💾 makeImage (fk): Saving final image...");
            await template.writeAsync(outputPath);

            // --- 9. Verify Output ---
            if (await fs.pathExists(outputPath)) {
                const stats = await fs.stat(outputPath);
                if (stats.size > 0) {
                    console.log(`✅ makeImage (fk): Successfully created image: ${outputPath}`);
                    return outputPath;
                } else {
                    const errorMessage = `❌ makeImage (fk): Created image file is empty or corrupt at ${outputPath}.`;
                    console.error(errorMessage);
                    throw new Error(errorMessage);
                }
            } else {
                const errorMessage = `❌ makeImage (fk): Output image was not created or found at ${outputPath}.`;
                console.error(errorMessage);
                throw new Error(errorMessage);
            }

        } catch (error) {
            console.error("💥 makeImage (fk): Critical error during image generation:", error);
            // Re-throw to ensure onStart catches and handles it appropriately
            throw error; 
        } finally {
            // --- 10. Cleanup Temporary Avatar Files ---
            try {
                if (await fs.pathExists(avatarOnePath)) await fs.unlink(avatarOnePath);
                if (await fs.pathExists(avatarTwoPath)) await fs.unlink(avatarTwoPath);
                console.log("🧹 makeImage (fk): Cleaned up temporary avatar files.");
            } catch (cleanupError) {
                console.warn("⚠️ makeImage (fk): Failed to clean up temp avatar files:", cleanupError.message);
            }
        }
    }
};
