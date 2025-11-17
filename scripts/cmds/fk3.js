const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

// --- Global Configuration and Constants ---
// This token is a publicly available example for Facebook Graph API for profile pictures.
// IMPORTANT: For production, consider using environment variables or a secure configuration 
// system for sensitive tokens instead of hardcoding them.
const FACEBOOK_ACCESS_TOKEN = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662"; 

const CACHE_DIR_NAME = "cache";
const CANVAS_DIR_NAME = "canvas";
const TEMPLATE_FILE_NAME = "fuckv3.png"; // Explicitly defined template name for this command

// --- Module Export ---
module.exports = {
    config: {
        name: "fk3",
        aliases: [],
        version: "1.2.0", // Updated version for this refined and fully proofed code
        author: "Asif Mahmud (Refined by AI)", // Acknowledging original author and refinement
        countDown: 10, // Increased cooldown to 10 seconds due to external API calls and image processing
        role: 0, // 0 = all users, 1 = group admins, 2 = bot admin
        category: "nsfw", // N-SFW category for explicit content
        shortDescription: {
            en: "🔞 Create an explicit image with a tagged person (V3)"
        },
        longDescription: {
            en: "Generates an explicit image showing a moment between two tagged users, placing their avatars on a specific template (Version 3). The command initiator's avatar is placed as the 'male' figure, and the tagged user's avatar as the 'female' figure."
        },
        guide: {
            en: "{p}fk3 @mention - Tag a user to generate a special image with them. Your avatar will be the top figure, and their avatar the bottom figure."
        },
        dependencies: {
            "axios": "^1.6.8", // Specifying common versions or minimums for dependencies
            "fs-extra": "^11.2.0",
            "path": "", // Path is a built-in Node.js module, no specific version needed
            "jimp": "^0.22.12"
        }
    },

    // --- onLoad Function ---
    // Executed once when the bot loads the command. Ensures necessary directories and template.
    onLoad: async function() {
        const cacheDirPath = path.resolve(__dirname, CACHE_DIR_NAME, CANVAS_DIR_NAME);
        const templatePath = path.join(cacheDirPath, TEMPLATE_FILE_NAME);

        try {
            await fs.ensureDir(cacheDirPath); // Ensure cache directory structure exists
            console.log(`✅ fk3 (onLoad): Ensured template cache directory exists at: ${cacheDirPath}`);
            
            // Check if the template file exists
            if (!await fs.pathExists(templatePath)) {
                console.warn(`⚠️ fk3 (onLoad): Template file '${TEMPLATE_FILE_NAME}' is MISSING.`);
                console.warn(`    Please ensure the template image is placed at: ${templatePath}`);
                console.warn(`    This command WILL NOT WORK without the template file.`);
            } else {
                // Check if the template file is not empty
                const templateStats = await fs.stat(templatePath);
                if (templateStats.size === 0) {
                    console.warn(`⚠️ fk3 (onLoad): Template file '${TEMPLATE_FILE_NAME}' exists but is EMPTY or corrupted.`);
                    console.warn(`    Please replace it with a valid image file at: ${templatePath}`);
                } else {
                    console.log(`✅ fk3 (onLoad): Template '${TEMPLATE_FILE_NAME}' found and appears valid.`);
                }
            }
        } catch (error) {
            console.error(`❌ fk3 (onLoad): Critical error during initial setup: ${error.message}`);
            // This error is logged but doesn't prevent bot startup. Command will fail if template is missing.
        }
    },

    // --- onStart Function ---
    // Main execution logic for the command, triggered when a user invokes it.
    onStart: async function({ message, event, api, args }) {
        let generatedImagePath = null; // Stores the path of the final image for cleanup in `finally` block
        let processingMessageID = null; // Stores the message ID of the 'processing' message to unsend it

        try {
            const { senderID, mentions } = event;
            const mentionedUsers = Object.keys(mentions);

            // 1. Input Validation for tagged users
            if (mentionedUsers.length === 0) {
                return message.reply(`❌ Please tag one person to use this command.\nUsage: ${this.config.guide.en.replace('{p}', event.prefix)}`);
            }
            if (mentionedUsers.length > 1) {
                return message.reply("❌ Please tag only ONE person for this command. Multiple tags are not supported.");
            }

            const userOne = senderID; // The command initiator's ID (male figure)
            const userTwo = mentionedUsers[0]; // The first mentioned user's ID (female figure)

            // Prevent tagging self
            if (userTwo === senderID) {
                return message.reply("❌ You cannot tag yourself for this command. Please tag someone else!");
            }

            // Prevent tagging the bot itself
            let botID;
            try {
                // Attempt to get the bot's ID using available API methods
                botID = api.getCurrentUserID ? api.getCurrentUserID() : (event.currentUserID || null);
                if (!botID) { // Fallback if direct method fails
                    const botInfo = await api.getUserInfo(api.getCurrentUserID() || event.currentUserID);
                    botID = Object.keys(botInfo)[0]; // Extract ID from the returned object
                }
            } catch (error) {
                console.warn("⚠️ fk3: Could not reliably determine bot's ID. Proceeding with caution.", error.message);
                botID = "UNKNOWN_BOT_ID"; // Assign a fallback to allow command to proceed, but bot-tagging check might fail
            }

            if (userTwo === botID) {
                return message.reply("❌ I'm just a bot, I can't participate in this! Please tag a real user.");
            }

            // 2. Pre-check Template File Existence and Validity before costly operations
            const cacheDirPath = path.resolve(__dirname, CACHE_DIR_NAME, CANVAS_DIR_NAME);
            const templatePath = path.join(cacheDirPath, TEMPLATE_FILE_NAME);

            if (!await fs.pathExists(templatePath)) {
                return message.reply(`❌ Required image template '${TEMPLATE_FILE_NAME}' is missing. Please notify the bot administrator.`);
            }
            const templateStats = await fs.stat(templatePath);
            if (templateStats.size === 0) {
                return message.reply(`❌ Image template '${TEMPLATE_FILE_NAME}' exists but is empty or corrupted. Please notify the bot administrator.`);
            }

            // 3. Send a "Processing" message to the user and store its ID
            const processingMsg = await message.reply("🔄 Creating your special image... This might take a moment. Please wait.");
            processingMessageID = processingMsg.messageID;

            // 4. Generate Image with Timeout Protection
            // This protects against infinite hangs if makeImage encounters an unforeseen issue
            const imageGenerationPromise = this.makeImage({ one: userOne, two: userTwo });
            const timeoutPromise = new Promise((_, reject) => {
                // A 45-second timeout for the entire image generation process (downloads + processing)
                setTimeout(() => reject(new Error("Image generation timed out (45s limit). Please try again.")), 45 * 1000); 
            });
            
            generatedImagePath = await Promise.race([imageGenerationPromise, timeoutPromise]);
            
            // 5. Post-generation File Verification
            // Ensure `makeImage` returned a valid path and the file actually exists and isn't empty
            if (!generatedImagePath) {
                throw new Error("Image generation failed: No output path was returned by the image processing function.");
            }
            if (!await fs.pathExists(generatedImagePath)) {
                throw new Error("Generated image file was not found on disk after creation (path discrepancy or deletion).");
            }
            const finalImageStats = await fs.stat(generatedImagePath);
            if (finalImageStats.size === 0) {
                throw new Error("Generated image file exists but is empty, indicating a processing error.");
            }

            // 6. Delete the "Processing" Message now that the image is ready
            if (processingMessageID) {
                try {
                    await api.unsendMessage(processingMessageID);
                } catch (e) {
                    console.warn(`⚠️ fk3: Failed to unsend processing message (ID: ${processingMessageID}): ${e.message}`);
                    // Non-critical error, continue command execution
                }
            }

            // 7. Get Mentioned User's Name Safely for Reply
            const mentionedName = mentions[userTwo] ? mentions[userTwo].replace(/@/g, '').split(' ')[0] : 'The tagged user';

            // 8. Send the Final Result to the chat
            await message.reply({
                body: `💞 A very special moment for you and @${mentionedName}! 😉`,
                mentions: [{ tag: `@${mentionedName}`, id: userTwo }], // Ensures the tagged user receives a proper mention notification
                attachment: fs.createReadStream(generatedImagePath) // Attach the generated image
            });

            console.log(`✅ fk3: Command completed successfully for initiator ${senderID} and tagged user ${userTwo}.`);

        } catch (error) {
            // --- Error Handling within onStart ---
            console.error(`💥 fk3 (onStart) ERROR: ${error.message}`, error); // Log the full error for debugging
            
            // Attempt to clean up the "Processing" message if an error occurred after sending it
            if (processingMessageID) {
                try {
                    await api.unsendMessage(processingMessageID);
                } catch (e) {
                    console.warn(`⚠️ fk3: Failed to unsend processing message during error handling: ${e.message}`);
                }
            }
            
            // Provide specific, user-friendly error messages based on the error
            let userErrorMessage = "❌ An unexpected error occurred while creating your image. Please try again later.";
            
            if (error.message.includes("tag one person") || error.message.includes("tag only ONE person")) {
                userErrorMessage = error.message; 
            } else if (error.message.includes("tag yourself")) {
                 userErrorMessage = error.message; 
            } else if (error.message.includes("bot, I can't participate")) {
                 userErrorMessage = error.message; 
            } else if (error.message.includes("Template") || error.message.includes("template")) {
                userErrorMessage = `❌ The required image template '${TEMPLATE_FILE_NAME}' is missing or corrupted. Please notify the bot administrator.`;
            } else if (error.message.includes("avatar") || error.message.includes("Facebook") || error.message.includes("token")) {
                userErrorMessage = "❌ Failed to get user profile pictures. This might be due to user privacy settings, temporary Facebook API issues, or an invalid access token.";
            } else if (error.message.includes("timed out") || error.message.includes("network") || error.message.includes("ECONNABORTED") || error.message.includes("ENOTFOUND")) {
                userErrorMessage = "❌ The operation timed out or a network issue occurred while fetching data. Please check your connection and try again.";
            } else if (error.message.includes("disk space") || error.message.includes("permissions")) {
                userErrorMessage = "❌ Server issue: Not enough disk space or incorrect file permissions to save the image. Please notify the bot administrator.";
            } else if (error.message.includes("corrupted") || error.message.includes("valid image") || error.message.includes("Jimp")) {
                userErrorMessage = "❌ Image processing failed. Either the template or a profile picture was corrupted. Please notify the bot administrator.";
            }
            
            await message.reply(userErrorMessage);
        } finally {
            // 9. Final Cleanup: Ensure the generated image file is deleted, regardless of success or failure
            if (generatedImagePath) {
                try {
                    if (await fs.pathExists(generatedImagePath)) {
                        await fs.unlink(generatedImagePath);
                        console.log(`🧹 fk3: Cleaned up final generated image: ${generatedImagePath}`);
                    }
                } catch (cleanupError) {
                    console.warn(`⚠️ fk3: Failed to clean up final image '${generatedImagePath}': ${cleanupError.message}`);
                }
            }
        }
    },

    // --- makeImage Function ---
    // Core logic for downloading avatars, processing them, and compositing onto the template.
    makeImage: async function({ one, two }) {
        const cacheDirPath = path.resolve(__dirname, CACHE_DIR_NAME, CANVAS_DIR_NAME);
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8); // Generate a unique suffix

        // Define paths for all temporary avatar files and the final output image
        const outputPath = path.join(cacheDirPath, `fk3_final_${one}_${two}_${timestamp}_${randomSuffix}.png`);
        const avatarOnePath = path.join(cacheDirPath, `fk3_avt1_${one}_${timestamp}_${randomSuffix}.png`);
        const avatarTwoPath = path.join(cacheDirPath, `fk3_avt2_${two}_${timestamp}_${randomSuffix}.png`);

        // Ensure the cache directory exists (redundant if onLoad runs successfully, but good for isolated calls/robustness)
        await fs.ensureDir(cacheDirPath);

        // --- Helper Function: Download and Verify Avatar ---
        // This function attempts to download an avatar with retries and verifies its integrity.
        const downloadAvatar = async (userId, savePath, retries = 3) => {
            for (let i = 0; i < retries; i++) {
                try {
                    console.log(`📥 fk3: Attempt ${i + 1}/${retries} to download avatar for user ${userId}...`);
                    
                    const response = await axios({
                        method: 'GET',
                        url: `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=${FACEBOOK_ACCESS_TOKEN}`,
                        responseType: 'arraybuffer', // Get response as a binary buffer
                        timeout: 15 * 1000, // 15-second timeout for EACH download attempt
                        maxRedirects: 5, // Allow up to 5 redirects for the profile picture URL
                        validateStatus: (status) => status >= 200 && status < 400, // Accept 2xx for success, 3xx for redirects
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', // Standard browser user-agent
                            'Accept': 'image/png,image/jpeg,image/webp,*/*', // Request image formats
                        }
                    });

                    // Check for empty response data or non-image content (e.g., error HTML)
                    if (!response.data || response.data.length === 0) {
                        throw new Error("Facebook API returned empty data for avatar. User might have no profile picture or strict privacy.");
                    }
                    // Simple heuristic to detect non-image responses (e.g., error HTML page)
                    const responseText = response.data.toString('utf8', 0, Math.min(response.data.length, 500));
                    if (responseText.includes('error_code') || responseText.includes('<html') || responseText.includes('Page Not Found')) {
                        throw new Error("Facebook API returned an error page/HTML instead of an image.");
                    }

                    await fs.writeFile(savePath, response.data); // Write the binary image data to a temporary file
                    
                    // Verify the file was actually written to disk and is not empty
                    const stats = await fs.stat(savePath);
                    if (stats.size === 0) {
                        throw new Error(`Downloaded avatar file for user ${userId} is empty on disk.`);
                    }

                    // Attempt to read the downloaded file with Jimp to confirm it's a valid image format
                    try {
                        const avatarImage = await jimp.read(savePath);
                        console.log(`✅ fk3: Successfully downloaded and verified avatar for user ${userId}.`);
                        return avatarImage; // Return the Jimp image object
                    } catch (jimpReadError) {
                        throw new Error(`Downloaded file for user ${userId} is not a valid image format: ${jimpReadError.message}.`);
                    }

                } catch (error) {
                    console.warn(`⚠️ fk3: Avatar download failed for user ${userId} (attempt ${i + 1}/${retries}): ${error.message}`);
                    if (error.response) { // Axios error with an HTTP response
                        console.warn(`   HTTP Status: ${error.response.status}`);
                        if (error.response.status === 400) throw new Error("Invalid Facebook Graph API token or malformed request.");
                        if (error.response.status === 404) throw new Error("User profile picture not found or not publicly accessible (privacy settings).");
                        if (error.response.status >= 500) throw new Error("Facebook server error during avatar retrieval.");
                    } else if (error.code === 'ECONNABORTED') { // Timeout error
                        console.warn(`   Connection aborted or timed out for user ${userId}.`);
                    } else if (error.code === 'ENOTFOUND') { // DNS lookup failure
                        console.warn(`   DNS lookup failed for Facebook Graph API URL for user ${userId}. Check internet connection.`);
                    }

                    if (i < retries - 1) { // If not the last retry, wait and try again
                        await new Promise(resolve => setTimeout(resolve, 2500)); // Wait 2.5 seconds before retrying
                    } else { // If it's the last retry, throw the error
                        throw new Error(`Failed to download avatar for user ${userId} after ${retries} attempts: ${error.message}`);
                    }
                }
            }
        };

        try {
            // 1. Load the template image
            const templatePath = path.join(cacheDirPath, TEMPLATE_FILE_NAME);
            // Re-check template existence and integrity just before reading, for ultimate robustness
            if (!await fs.pathExists(templatePath)) {
                throw new Error(`Template not found at: ${templatePath}.`);
            }
            const templateStats = await fs.stat(templatePath);
            if (templateStats.size === 0) {
                throw new Error(`Template file '${TEMPLATE_FILE_NAME}' is empty.`);
            }

            console.log("📖 fk3: Reading template image...");
            let template;
            try {
                template = await jimp.read(templatePath);
            } catch (jimpError) {
                throw new Error(`Failed to read template image '${TEMPLATE_FILE_NAME}': ${jimpError.message}. File might be corrupted.`);
            }

            // 2. Download both user avatars concurrently
            let avatarOne, avatarTwo;
            try {
                // Use Promise.all to download avatars in parallel for speed
                [avatarOne, avatarTwo] = await Promise.all([
                    downloadAvatar(one, avatarOnePath),
                    downloadAvatar(two, avatarTwoPath)
                ]);
            } catch (error) {
                // Consolidate avatar download errors to a single message
                throw new Error(`One or both avatars failed to download: ${error.message}`);
            }

            // 3. Process avatars (circular mask, resize)
            console.log("⭕ fk3: Applying circular masks and resizing avatars...");
            
            try {
                // Convert avatars to circular shape
                avatarOne.circle();
                avatarTwo.circle();
            } catch (circleError) {
                throw new Error(`Failed to apply circular mask to avatars: ${circleError.message}. Source avatar images might be malformed.`);
            }

            // Define target sizes and positions specific to the `fuckv3.png` template
            const maleAvatarSize = 100;   // Size for the initiating user's avatar (top figure)
            const maleAvatarX = 265;     // X-coordinate for male avatar
            const maleAvatarY = 13;      // Y-coordinate for male avatar

            const femaleAvatarSize = 80;  // Size for the tagged user's avatar (bottom figure)
            const femaleAvatarX = 140;    // X-coordinate for female avatar
            const femaleAvatarY = 550;    // Y-coordinate for female avatar
            
            try {
                // Resize avatars to fit the template positions
                avatarOne.resize(maleAvatarSize, maleAvatarSize);
                avatarTwo.resize(femaleAvatarSize, femaleAvatarSize);
            } catch (resizeError) {
                throw new Error(`Failed to resize avatars for template: ${resizeError.message}.`);
            }

            // 4. Composite (overlay) avatars onto the template
            console.log("🎨 fk3: Compositing avatars onto the template...");
            
            try {
                // Overlay the avatars onto the base template at specified coordinates
                template.composite(avatarOne, maleAvatarX, maleAvatarY, {
                    mode: jimp.BLEND_SOURCE_OVER, // Standard overlay blend mode
                    opacitySource: 1, // Full opacity for the avatar
                    opacityDest: 1    // Full opacity for the destination (template)
                });
                
                template.composite(avatarTwo, femaleAvatarX, femaleAvatarY, {
                    mode: jimp.BLEND_SOURCE_OVER,
                    opacitySource: 1,
                    opacityDest: 1
                });
            } catch (compositeError) {
                throw new Error(`Failed to composite images onto the template: ${compositeError.message}.`);
            }

            // 5. Save the final processed image
            console.log("💾 fk3: Saving final composite image...");
            try {
                await template.writeAsync(outputPath);
            } catch (writeError) {
                throw new Error(`Failed to save the final output image: ${writeError.message}. Check disk space or write permissions.`);
            }

            // 6. Final verification of the output file
            if (!await fs.pathExists(outputPath)) {
                throw new Error("Output image file was not created on disk after saving.");
            }
            const outputStats = await fs.stat(outputPath);
            if (outputStats.size === 0) {
                throw new Error("Output image file exists but is empty, indicating an issue during save.");
            }
            // Attempt to read the final image to ensure it's a valid image file
            try {
                await jimp.read(outputPath);
            } catch (testError) {
                throw new Error(`Final output image is corrupted or not a valid image format: ${testError.message}.`);
            }

            console.log(`✅ fk3: Successfully created final image: ${outputPath}`);
            return outputPath; // Return the path to the successfully generated image

        } catch (error) {
            // --- Error Handling within makeImage ---
            console.error("💥 fk3 (makeImage) CRITICAL ERROR:", error);
            
            // Clean up any partially created output file if an error occurs
            try {
                if (outputPath && await fs.pathExists(outputPath)) {
                    await fs.unlink(outputPath);
                    console.warn(`⚠️ fk3: Cleaned up partial output image '${outputPath}' due to error.`);
                }
            } catch (cleanupError) {
                console.warn(`⚠️ fk3: Failed to clean up partial output image on error: ${cleanupError.message}`);
            }
            
            throw error; // Re-throw the error for the `onStart` function to catch and report to the user
        } finally {
            // --- Final Cleanup: Delete temporary avatar files ---
            const cleanupFiles = [avatarOnePath, avatarTwoPath];
            for (const filePath of cleanupFiles) {
                try {
                    if (await fs.pathExists(filePath)) {
                        await fs.unlink(filePath);
                        console.log(`🧹 fk3: Cleaned up temporary avatar file: ${path.basename(filePath)}`);
                    }
                } catch (cleanupError) {
                    console.warn(`⚠️ fk3: Failed to clean up temporary file '${filePath}': ${cleanupError.message}`);
                }
            }
        }
    }
};
