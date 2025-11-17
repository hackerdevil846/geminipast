module.exports = {
    config: {
        name: "idst",
        aliases: [],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "sticker",
        shortDescription: {
            en: "Get sticker ID or send sticker by ID"
        },
        longDescription: {
            en: "Get sticker ID from reply or send sticker using ID"
        },
        guide: {
            en: "{p}idst [reply|stickerID]"
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Handle sticker reply to get ID
            if (event.type === "message_reply") {
                if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
                    const stickerAttachment = event.messageReply.attachments[0];
                    
                    if (stickerAttachment.type === "sticker") {
                        const stickerID = stickerAttachment.ID;
                        const stickerURL = stickerAttachment.url;
                        const description = stickerAttachment.description || "No description";
                        
                        return message.reply({
                            body: `🎟️ 𝐒𝐓𝐈𝐂𝐊𝐄𝐑 𝐈𝐍𝐅𝐎\n━━━━━━━━━━━━━━\n🆔 𝐈𝐃: ${stickerID}\n📝 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧: ${description}\n🔗 𝐔𝐑𝐋: ${stickerURL}\n━━━━━━━━━━━━━━\n💡 Use: idst ${stickerID} to send this sticker`
                        });
                    } else {
                        return message.reply("❌ The replied message does not contain a sticker. Please reply to a sticker message.");
                    }
                } else {
                    return message.reply("❌ Please reply to a message that contains a sticker.");
                }
            }

            // Handle sending sticker by ID
            if (args[0]) {
                const stickerID = args[0].trim();
                
                // Validate sticker ID format
                if (!stickerID || stickerID.length < 5) {
                    return message.reply("❌ Invalid sticker ID format. Sticker ID should be a valid numeric ID.");
                }

                try {
                    await message.reply({
                        body: "✨ 𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐬𝐭𝐢𝐜𝐤𝐞𝐫:",
                        sticker: stickerID
                    });
                } catch (sendError) {
                    console.error("Sticker send error:", sendError);
                    
                    if (sendError.message.includes("sticker")) {
                        return message.reply(`❌ Invalid sticker ID or sticker not found: ${stickerID}\n💡 Make sure the sticker ID is correct and exists.`);
                    } else {
                        return message.reply("❌ Failed to send sticker. The sticker ID might be invalid or the sticker doesn't exist.");
                    }
                }
                return;
            }

            // Show help if no valid arguments
            return message.reply({
                body: `🎟️ 𝐒𝐓𝐈𝐂𝐊𝐄𝐑 𝐈𝐃 𝐂𝐎𝐌𝐌𝐀𝐍𝐃\n━━━━━━━━━━━━━━\n💡 𝐔𝐬𝐚𝐠𝐞:\n• Reply to a sticker to get its ID\n• Provide sticker ID to send it\n━━━━━━━━━━━━━━\n📖 𝐄𝐱𝐚𝐦𝐩𝐥𝐞𝐬:\n• Reply to sticker + "idst"\n• "idst 123456789"\n━━━━━━━━━━━━━━\n🎯 Get sticker IDs by replying to them!`
            });

        } catch (error) {
            console.error("Sticker ID Command Error:", error);
            
            let errorMessage = "❌ An error occurred while processing the sticker command.";
            
            if (error.message.includes("sticker")) {
                errorMessage = "❌ Sticker operation failed. Please check the sticker ID and try again.";
            }
            
            return message.reply(errorMessage);
        }
    }
};
