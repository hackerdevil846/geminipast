const axios = require("axios");
const fs = require("fs-extra"); // fs-extra is used for robust async fs operations
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "fk2",
        aliases: [],
        version: "1.0.1", // Updated version for this refined code
        author: "Asif Mahmud",
        countDown: 5,
        role: 0, // 0 = all users, 1 = admin, 2 = bot owner
        category: "nsfw",
        shortDescription: {
            en: "🔞 Create an explicit image with a tagged person (V2)"
        },
        longDescription: {
            en: "Generates an explicit image showing a moment between two tagged users, placing their avatars on the 'fuckv2.png' template. The initiator of the command is typically the male figure, and the tagged user is the female figure."
        },
        guide: {
            en: "{p}fk2 @mention - Tag a user to generate a special image with them."
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": "",
            "jimp": ""
        }
    },

    // --- onLoad Function ---
    // Ensures cache directories exist and checks for the template file on bot startup.
    onLoad: async function() {
        // Construct the cache directory path relative to the command's file location
        const cacheDir = path.resolve(__dirname, 'cache', 'canvas');
        const templateFileName = 'fuckv2.png';
        const templatePath = path.join(cacheDir, templateFileName);

        try {
            await fs.ensureDir(cacheDir); // Ensure directory exists asynchronously
            console.log(`✅ onLoad (fk2): Ensured template cache directory exists at ${cacheDir}`);
            
            if (!await fs.pathExists(templatePath)) { // Check if template exists asynchronously
                console.warn(`⚠️ onLoad (fk2): Template '${templateFileName}' not found!`);
                console.warn(`    Please place the template image at: ${templatePath}`);
                console.warn(`    If you need to download it, ensure the filename is exactly 'fuckv2.png'.`);
            } else {
                console.log(`✅ onLoad (fk2): Template '${templateFileName}' found at: ${templatePath}`);
            }
        } catch (error) {
            console.error("❌ onLoad (fk2): Error during setup:", error);
            // This error is logged but doesn't prevent bot startup.
            // Command execution will fail if the template is truly missing.
        }
    },

    // --- onStart Function ---
    // Main execution logic for the command.
    onStart: async function({ message, event, api, args }) { // 'api' is crucial for unsendMessage and reactions
        let generatedImagePath = null; // Path to the final generated image for cleanup
        
        try {
            const { senderID, mentions, messageID } = event;
            const mentionedUsers = Object.keys(mentions);

            // --- 1. Input Validation ---
            if (mentionedUsers.length === 0) {
                return message.reply("💌 Please tag someone for this intimate moment! Example: {p}fk2 @username");
            }
            const userOne = senderID; // User initiating the command (male avatar)
            const userTwo = mentionedUsers[0]; // Mentioned user (female avatar)

            if (userTwo === senderID) {
                return message.reply("Self-intimacy? Maybe later! 😉 Please tag someone else.");
            }
            if (userTwo === api.getCurrentUserID()) { // Use 'api.getCurrentUserID()' for bot's own ID
                return message.reply("I'm just a bot, I can't participate in such moments! 😳 Please tag another user.");
            }

            // --- 2. Send Processing Message ---
            const processingMessage = await message.reply("⏳ Generating your special moment, please wait...");

            // --- 3. Generate the Image ---
            // makeImage function will throw an error if anything goes wrong, caught by this try-catch
            generatedImagePath = await this.makeImage({ one: userOne, two: userTwo });
            
            // --- 4. Delete Processing Message ---
            try {
                if (api && api.unsendMessage) { // Check if api and unsendMessage method are available
                    await api.unsendMessage(processingMessage.messageID);
                } else {
                     console.warn("⚠️ onStart (fk2): 'api.unsendMessage' not available. Cannot delete processing message.");
                }
            } catch (e) {
                console.warn("⚠️ onStart (fk2): Failed to unsend processing message:", e.message);
            }

            // --- 5. Send Final Response (Image or Error) ---
            if (generatedImagePath && await fs.pathExists(generatedImagePath)) { // Verify generated file exists
                // Add success reaction (best effort)
                try {
                    await api.setMessageReaction("✅", messageID, () => {}, true); // React to the original command message
                } catch (e) { 
                    console.warn("⚠️ onStart (fk2): Failed to set success reaction:", e.message);
                }

                const mentionedName = mentions[userTwo].replace("@", ""); // Get clean mentioned name
                
                await message.reply({
                    body: `💞 A special moment captured for you and @${mentionedName}!`,
                    mentions: [{ tag: `@${mentionedName}`, id: userTwo }], // Ensure the user is properly tagged
                    attachment: fs.createReadStream(generatedImagePath)
                });
                
                console.log("✅ onStart (fk2): Successfully sent explicit image.");
            } else {
                // This 'else' block would be hit if makeImage returned null
                // or if the generated file somehow disappeared.
                await message.reply("❌ Failed to create the explicit image. This might be due to a missing template, an issue with avatar download (e.g., Facebook token invalid/expired, privacy settings), or a temporary network problem. Please try again later or contact the bot owner if the issue persists.");
                // Add error reaction (best effort)
                try {
                    await api.setMessageReaction("❌", messageID, () => {}, true); // React to the original command message
                } catch (e) { 
                    console.warn("⚠️ onStart (fk2): Failed to set error reaction (no image):", e.message);
                }
            }
            
        } catch (error) {
            console.error("💥 onStart (fk2): Command Error:", error);
            // Catch-all for any unhandled errors during onStart or propagated from makeImage
            await message.reply(`❌ An unexpected error occurred while processing your request. Please try again later. Error: ${error.message}`);
            // Attempt to send an error reaction on the original message if possible
            try {
                await api.setMessageReaction("❌", event.messageID, () => {}, true);
            } catch (e) {
                console.warn("⚠️ onStart (fk2): Failed to set error reaction on command error:", e.message);
            }
        } finally {
            // --- 6. Final Cleanup (Generated Image) ---
            if (generatedImagePath && await fs.pathExists(generatedImagePath)) {
                try {
                    await fs.unlink(generatedImagePath); // Delete the generated image asynchronously
                    console.log("🧹 onStart (fk2): Cleaned up generated image.");
                } catch (cleanupError) {
                    console.warn("⚠️ onStart (fk2): Failed to clean up generated image:", cleanupError.message);
                }
            }
        }
    },

    // --- makeImage Function ---
    // Handles downloading avatars, compositing them onto the template, and saving the final image.
    makeImage: async function({ one, two }) {
        const cacheDir = path.resolve(__dirname, "cache", "canvas");
        const outputPath = path.join(cacheDir, `fk2_${one}_${two}_${Date.now()}.png`);
        const avatarOnePath = path.join(cacheDir, `avt1_${one}_${Date.now()}.png`);
        const avatarTwoPath = path.join(cacheDir, `avt2_${two}_${Date.now()}.png`);

        try {
            // --- 1. Template Verification ---
            const templateFileName = "fuckv2.png"; // Specific template for this command
            const templatePath = path.join(cacheDir, templateFileName);
            if (!await fs.pathExists(templatePath)) { // Use fs-extra's async pathExists
                const errorMessage = `❌ makeImage (fk2): Template '${templateFileName}' not found at: ${templatePath}. Cannot proceed with image generation.`;
                console.error(errorMessage);
                throw new Error(errorMessage); // Critical error, propagate it
            }

            console.log("📖 makeImage (fk2): Reading template image...");
            const template = await jimp.read(templatePath);

            // --- 2. Facebook Access Token (User-provided as valid) ---
            // It is critical that this token is valid and active.
            const fbToken = `6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`; 

            // --- 3. Avatar Download Helper ---
            const downloadAvatar = async (userID, destPath) => {
                try {
                    console.log(`📥 makeImage (fk2): Downloading avatar for user ${userID}...`);
                    const response = await axios.get(
                        `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=${fbToken}`,
                        { 
                            responseType: 'arraybuffer',
                            timeout: 30000 // Increased timeout for potentially slow network/Facebook API
                        }
                    );
                    await fs.writeFile(destPath, response.data); // Write buffer to file asynchronously
                    
                    // Basic file integrity check after download
                    const stats = await fs.stat(destPath); // Get file stats asynchronously
                    if (stats.size === 0) {
                        throw new Error(`Downloaded avatar file for user ${userID} is empty.`);
                    }

                    console.log(`✅ makeImage (fk2): Downloaded avatar for user ${userID}`);
                    return await jimp.read(destPath); // Read with Jimp
                } catch (error) {
                    console.error(`❌ makeImage (fk2): Failed to download or read avatar for ${userID}:`);
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
                    // Wrap error for better context
                    throw new Error(`Failed to get avatar for user ${userID}. Possible issues: Invalid Facebook Access Token, network problems, or user's privacy settings. Original error: ${error.message}`);
                }
            };

            // --- 4. Execute Avatar Downloads ---
            let avatarOne, avatarTwo;
            try {
                avatarOne = await downloadAvatar(one, avatarOnePath);   // Sender's avatar (male figure)
                avatarTwo = await downloadAvatar(two, avatarTwoPath);   // Mentioned's avatar (female figure)
            } catch (downloadError) {
                console.error("❌ makeImage (fk2): Avatar download failed. Aborting image generation.");
                throw downloadError; // Re-throw to be caught by onStart
            }

            // --- 5. Create Circular Avatars ---
            console.log("⭕ makeImage (fk2): Creating circular avatars...");
            avatarOne.circle();
            avatarTwo.circle();

            // --- 6. Positioning Adjustments for 'fuckv2.png' Template ---
            // These coordinates are meticulously estimated from the provided image.

            // Avatar for the male character (left circle) - userOne
            const maleAvatarSize = 100;   // Estimated size
            const maleAvatarX = 175;      // Estimated X position
            const maleAvatarY = 10;       // Estimated Y position

            // Avatar for the female character (right circle) - userTwo
            const femaleAvatarSize = 80;  // Estimated size
            const femaleAvatarX = 405;    // Estimated X position
            const femaleAvatarY = 100;    // Estimated Y position
            
            // Resize avatars *before* compositing to fit the template circles
            avatarOne.resize(maleAvatarSize, maleAvatarSize);     // Male character (sender)
            avatarTwo.resize(femaleAvatarSize, femaleAvatarSize); // Female character (mentioned)

            // --- 7. Composite Avatars onto Template ---
            console.log("🎨 makeImage (fk2): Compositing avatars on template...");
            // Composite male avatar first (left position)
            template.composite(avatarOne, maleAvatarX, maleAvatarY);     
            // Composite female avatar second (right position)
            template.composite(avatarTwo, femaleAvatarX, femaleAvatarY); 

            // --- 8. Save Final Image ---
            console.log("💾 makeImage (fk2): Saving final image...");
            await template.writeAsync(outputPath);

            // --- 9. Verify Output ---
            if (await fs.pathExists(outputPath)) { // Check if file exists after write
                const stats = await fs.stat(outputPath); // Get file stats to check size
                if (stats.size > 0) {
                    console.log(`✅ makeImage (fk2): Successfully created image: ${outputPath}`);
                    return outputPath; // Return the path if successful
                } else {
                    const errorMessage = `❌ makeImage (fk2): Created image file is empty or corrupt at ${outputPath}.`;
                    console.error(errorMessage);
                    throw new Error(errorMessage); // Propagate error for empty file
                }
            } else {
                const errorMessage = `❌ makeImage (fk2): Output image was not created or found at ${outputPath}.`;
                console.error(errorMessage);
                throw new Error(errorMessage); // Propagate error for missing file
            }

        } catch (error) {
            console.error("💥 makeImage (fk2): Critical error during image generation process:", error);
            throw error; // Re-throw to ensure onStart catches and handles it appropriately
        } finally {
            // --- 10. Cleanup Temporary Avatar Files ---
            // This ensures temporary files are deleted even if an error occurred.
            try {
                if (await fs.pathExists(avatarOnePath)) await fs.unlink(avatarOnePath);
                if (await fs.pathExists(avatarTwoPath)) await fs.unlink(avatarTwoPath);
                console.log("🧹 makeImage (fk2): Cleaned up temporary avatar files.");
            } catch (cleanupError) {
                console.warn("⚠️ makeImage (fk2): Failed to clean up temp avatar files:", cleanupError.message);
            }
        }
    }
};
