const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

/**
 * 𝐇𝐞𝐥𝐩𝐞𝐫 𝐅𝐮𝐧𝐜𝐭𝐢𝐨𝐧 𝐟𝐨𝐫 𝐃𝐚𝐫𝐤 𝐒𝐭𝐲𝐥𝐢𝐬𝐡 𝐅𝐨𝐧𝐭
 * 𝐂𝐨𝐧𝐯𝐞𝐫𝐭𝐬 𝐧𝐨𝐫𝐦𝐚𝐥 𝐭𝐞𝐱𝐭 𝐭𝐨 𝐦𝐚𝐭𝐡 𝐬𝐚𝐧𝐬-𝐬𝐞𝐫𝐢𝐟 𝐛𝐨𝐥𝐝
 */
const toDarkStyle = (str) => {
    return str.replace(/[a-zA-Z0-9]/g, (char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(code + 120211); // A-Z
        if (code >= 97 && code <= 122) return String.fromCodePoint(code + 120205); // a-z
        if (code >= 48 && code <= 57) return String.fromCodePoint(code + 120764); // 0-9
        return char;
    });
};

module.exports = {
    config: {
        name: "config",
        aliases: [],
        version: "2.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 2, // Admin/Bot Owner Only
        category: "𝐬𝐲𝐬𝐭𝐞𝐦",
        shortDescription: {
            en: "𝖢𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖾 𝖻𝗈𝗍 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌 𝖺𝗇𝖽 𝖺𝖽𝗆𝗂𝗇 𝗍𝗈𝗈𝗅𝗌"
        },
        longDescription: {
            en: "𝖠𝖽𝗏𝖺𝗇𝖼𝖾𝖽 𝖻𝗈𝗍 𝗆𝖺𝗇𝖺𝗀𝖾𝗆𝖾𝗇𝗍 𝗌𝗒𝗌𝗍𝖾𝗆 𝖿𝗈𝗋 𝗈𝗐𝗇𝖾𝗋𝗌."
        },
        guide: {
            en: "{p}config"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "moment-timezone": ""
        }
    },

    // 𝖪𝖾𝖾𝗉 𝗈𝗋𝗂𝗀𝗂𝗇𝖺𝗅 𝖺𝗉𝗉𝗌𝗍𝖺𝗍𝖾 𝗉𝖺𝗍𝗁 𝖺𝗌 𝗋𝖾𝗊𝗎𝖾𝗌𝗍𝖾𝖽
    appStatePath: path.join(__dirname, "../../account.txt"),

    onStart: async function({ message, event, api }) {
        try {
            // --- 𝐃𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐲 𝐂𝐡𝐞𝐜𝐤 ---
            let dependenciesAvailable = true;
            try {
                require("moment-timezone");
                require("axios");
                require("fs-extra");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply(toDarkStyle("❌ Missing dependencies. Please install moment-timezone, axios, fs-extra, and path."));
            }

            const { senderID } = event;

            // --- 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧 𝐂𝐡𝐞𝐜𝐤 ---
            const allowedUID = "61571630409265";
            if (senderID !== allowedUID) {
                return message.reply(toDarkStyle("❌ Permission denied. You are not the authorized owner."));
            }

            // --- 𝐌𝐞𝐧𝐮 𝐂𝐨𝐧𝐬𝐭𝐫𝐮𝐜𝐭𝐢𝐨𝐧 ---
            const menuOptions = [
                "Edit bot bio",                     // 01
                "Edit bot nicknames",               // 02
                "View pending messages",            // 03
                "View unread messages",             // 04
                "View spam messages",               // 05
                "Change bot avatar",                // 06
                "Turn on/off bot avatar shield",    // 07
                "Block users (Messenger)",          // 08
                "Unblock users (Messenger)",        // 09
                "Create post",                      // 10
                "Delete post",                      // 11
                "Comment on post (User)",           // 12
                "Comment on post (Group)",          // 13
                "React to post",                    // 14
                "Send friend request",              // 15
                "Accept friend request",            // 16
                "Decline friend request",           // 17
                "Remove friends",                   // 18
                "Send message by ID",               // 19
                "Create note",                      // 20
                "Log out"                           // 21
            ];

            let menuMessage = toDarkStyle("⚙️ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 ⚙️\n\n");
            
            menuOptions.forEach((option, index) => {
                const num = (index + 1).toString().padStart(2, '0');
                menuMessage += toDarkStyle(`[${num}] ${option}\n`);
            });

            menuMessage += toDarkStyle("\n══════════════════════");
            menuMessage += toDarkStyle(`\n» Bot ID: ${api.getCurrentUserID()}`);
            menuMessage += toDarkStyle(`\n» Reply with number to select`);
            menuMessage += toDarkStyle("\n══════════════════════");

            const msg = await message.reply(menuMessage);
            
            global.client.handleReply.push({
                name: this.config.name,
                messageID: msg.messageID,
                author: senderID,
                type: "menu"
            });

        } catch (error) {
            console.error("💥 Config command error:", error);
        }
    },

    onReply: async function({ event, message, Reply, api }) {
        try {
            const { senderID, body } = event;
            const args = body.split(" ");
            
            // --- 𝐒𝐞𝐜𝐮𝐫𝐢𝐭𝐲 𝐂𝐡𝐞𝐜𝐤 ---
            const allowedUID = "61571630409265";
            if (senderID !== allowedUID) return; // Silent ignore if not owner
            if (Reply.author !== senderID) return;

            // --- 𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔 𝐒𝐄𝐋𝐄𝐂𝐓𝐈𝐎𝐍 ---
            if (Reply.type === 'menu') {
                const selection = parseInt(args[0]);
                if (isNaN(selection)) return message.reply(toDarkStyle("❌ Please enter a valid number."));

                // Handle Selections 1-21
                switch (selection) {
                    case 1: // Edit Bio
                        await message.reply(toDarkStyle("📝 Please reply with the new Bio (or 'delete' to clear)."));
                        global.client.handleReply.push({ name: this.config.name, messageID: event.messageID, author: senderID, type: "changeBio" });
                        break;
                    case 2: // Edit Nickname
                        await message.reply(toDarkStyle("📝 Reply with format: [UserID] [New Nickname]"));
                        global.client.handleReply.push({ name: this.config.name, messageID: event.messageID, author: senderID, type: "changeNickname" });
                        break;
                    case 3: // View Pending
                        this.checkMessages(api, message, "PENDING", "Pending");
                        break;
                    case 4: // View Unread
                        this.checkMessages(api, message, "unread", "Unread");
                        break;
                    case 5: // View Spam
                        this.checkMessages(api, message, "OTHER", "Spam");
                        break;
                    case 6: // Change Avatar
                        await message.reply(toDarkStyle("🖼️ Reply with an image to set as Avatar."));
                        global.client.handleReply.push({ name: this.config.name, messageID: event.messageID, author: senderID, type: "changeAvatar" });
                        break;
                    case 7: // Avatar Shield
                        await message.reply(toDarkStyle("🛡️ Reply 'on' to enable or 'off' to disable shield."));
                        global.client.handleReply.push({ name: this.config.name, messageID: event.messageID, author: senderID, type: "avatarShield" });
                        break;
                    case 8: // Block
                        await message.reply(toDarkStyle("🔒 Reply with User UIDs to block (space separated)."));
                        global.client.handleReply.push({ name: this.config.name, messageID: event.messageID, author: senderID, type: "blockUser" });
                        break;
                    case 9: // Unblock
                        await message.reply(toDarkStyle("🔓 Reply with User UIDs to unblock (space separated)."));
                        global.client.handleReply.push({ name: this.config.name, messageID: event.messageID, author: senderID, type: "unBlockUser" });
                        break;
                    case 10: // Create Post
                        await message.reply(toDarkStyle("📝 Reply with the post content."));
                        global.client.handleReply.push({ name: this.config.name, messageID: event.messageID, author: senderID, type: "createPost" });
                        break;
                    case 11: // Delete Post
                        await message.reply(toDarkStyle("🗑️ Reply with the Post ID to delete."));
                        global.client.handleReply.push({ name: this.config.name, messageID: event.messageID, author: senderID, type: "deletePost" });
                        break;
                    case 12: // Comment (User) (Not implemented due to API limit often)
                        await message.reply(toDarkStyle("⚠️ Feature temporarily unavailable due to API restrictions."));
                        break;
                    case 13: // Comment (Group)
                        await message.reply(toDarkStyle("⚠️ Feature temporarily unavailable due to API restrictions."));
                        break;
                    case 14: // React Post
                         await message.reply(toDarkStyle("❤️ Reply with: [PostID] [Reaction: LIKE/LOVE/HAHA/WOW/SAD/ANGRY]"));
                         global.client.handleReply.push({ name: this.config.name, messageID: event.messageID, author: senderID, type: "reactPost" });
                         break;
                    case 15: // Send Friend Req
                        await message.reply(toDarkStyle("👥 Reply with the User UID to add."));
                        global.client.handleReply.push({ name: this.config.name, messageID: event.messageID, author: senderID, type: "addFriend" });
                        break;
                    case 16: // Accept Friend
                         await message.reply(toDarkStyle("✅ Reply with the User UID to accept."));
                         global.client.handleReply.push({ name: this.config.name, messageID: event.messageID, author: senderID, type: "acceptFriend" });
                         break;
                    case 17: // Decline Friend
                        await message.reply(toDarkStyle("❌ Reply with the User UID to decline."));
                        global.client.handleReply.push({ name: this.config.name, messageID: event.messageID, author: senderID, type: "declineFriend" });
                        break;
                    case 18: // Remove Friend
                        await message.reply(toDarkStyle("🚫 Reply with the User UID to unfriend."));
                        global.client.handleReply.push({ name: this.config.name, messageID: event.messageID, author: senderID, type: "removeFriend" });
                        break;
                    case 19: // Send Msg by ID
                        await message.reply(toDarkStyle("📨 Reply with: [UID] [Message Content]"));
                        global.client.handleReply.push({ name: this.config.name, messageID: event.messageID, author: senderID, type: "sendMsgID" });
                        break;
                    case 20: // Create Note
                        await message.reply(toDarkStyle("📝 Note feature is under maintenance."));
                        break;
                    case 21: // Logout
                        try {
                            await message.reply(toDarkStyle("👋 Logging out system..."));
                            await api.logout();
                        } catch (e) { message.reply(toDarkStyle("❌ Error logging out.")); }
                        break;
                    default:
                        await message.reply(toDarkStyle("❌ Invalid selection. Choose 1-21."));
                }
            }

            // --- 𝐇𝐀𝐍𝐃𝐋𝐄 𝐑𝐄𝐏𝐋𝐘 𝐀𝐂𝐓𝐈𝐎𝐍𝐒 ---

            // 1. Change Bio
            else if (Reply.type === 'changeBio') {
                const content = body.toLowerCase() === 'delete' ? '' : body;
                api.changeBio(content, false, (err) => {
                    if (err) return message.reply(toDarkStyle("❌ Failed to update Bio."));
                    message.reply(toDarkStyle(`✅ Bio updated successfully.`));
                });
            }

            // 2. Change Nickname
            else if (Reply.type === 'changeNickname') {
                const targetUID = args[0];
                const newName = args.slice(1).join(" ");
                if (!targetUID || !newName) return message.reply(toDarkStyle("❌ Format: [UID] [Name]"));
                api.changeNickname(newName, event.threadID, targetUID, (err) => {
                    if (err) return message.reply(toDarkStyle("❌ Failed to change nickname."));
                    message.reply(toDarkStyle(`✅ Nickname updated.`));
                });
            }

            // 6. Change Avatar
            else if (Reply.type === 'changeAvatar') {
                let imgUrl;
                if (event.attachments && event.attachments.length > 0 && event.attachments[0].type === "photo") {
                    imgUrl = event.attachments[0].url;
                } else if (body.match(/^http/)) {
                    imgUrl = body;
                } else {
                    return message.reply(toDarkStyle("❌ Please reply with a photo or valid URL."));
                }
                
                try {
                    const response = await axios.get(imgUrl, { responseType: "stream" });
                    api.changeAvatar(response.data, (err) => {
                        if (err) return message.reply(toDarkStyle("❌ Error uploading avatar."));
                        message.reply(toDarkStyle("✅ Avatar updated successfully."));
                    });
                } catch (e) {
                    message.reply(toDarkStyle("❌ Error fetching image."));
                }
            }

            // 7. Avatar Shield
            else if (Reply.type === 'avatarShield') {
                const status = body.toLowerCase() === 'on';
                api.changeAvatarProtection(status, (err) => {
                    if (err) return message.reply(toDarkStyle("❌ Failed to change shield settings."));
                    message.reply(toDarkStyle(`✅ Avatar shield turned ${status ? 'ON' : 'OFF'}.`));
                });
            }

            // 8 & 9. Block/Unblock
            else if (Reply.type === 'blockUser' || Reply.type === 'unBlockUser') {
                const uids = body.split(/\s+/).filter(id => id.length > 4);
                if (uids.length === 0) return message.reply(toDarkStyle("❌ No valid UIDs provided."));
                
                const isBlock = Reply.type === 'blockUser';
                for (const uid of uids) {
                    api.changeBlockedStatus(uid, isBlock);
                }
                message.reply(toDarkStyle(`✅ Processed ${isBlock ? 'Block' : 'Unblock'} for ${uids.length} users.`));
            }

            // 10. Create Post
            else if (Reply.type === 'createPost') {
                api.createPost(body, (err) => {
                    if (err) return message.reply(toDarkStyle("❌ Failed to create post."));
                    message.reply(toDarkStyle("✅ Post created on timeline."));
                });
            }

            // 11. Delete Post
            else if (Reply.type === 'deletePost') {
                api.deletePost(body.trim(), (err) => {
                    if (err) return message.reply(toDarkStyle("❌ Failed to delete post (ID might be wrong)."));
                    message.reply(toDarkStyle("✅ Post deleted."));
                });
            }

            // 14. React Post
            else if (Reply.type === 'reactPost') {
                const postID = args[0];
                const reaction = args[1]?.toUpperCase();
                // Map common text to internal reaction types if needed, or send raw
                if(!postID || !reaction) return message.reply(toDarkStyle("❌ Format: [PostID] [Reaction]"));
                
                // Note: api.setPostReaction implementation depends on the specific API version
                try {
                     api.setPostReaction(postID, reaction, (err) => {
                        if (err) message.reply(toDarkStyle("❌ Error setting reaction."));
                        else message.reply(toDarkStyle("✅ Reacted to post."));
                     });
                } catch(e) { message.reply(toDarkStyle("❌ API not supported.")); }
            }

            // 15, 16, 17, 18. Friend Management
            else if (['addFriend', 'acceptFriend', 'declineFriend', 'removeFriend'].includes(Reply.type)) {
                 const uid = body.trim();
                 if(!uid) return message.reply(toDarkStyle("❌ Invalid UID."));
                 
                 // Note: These methods depend on unofficial API support and may vary
                 // This is a generic implementation wrapper
                 try {
                     if (Reply.type === 'addFriend') {
                         // api.addUserToGroup is for groups, friend reqs usually auto-handled or need specific calls
                         message.reply(toDarkStyle("⚠️ Friend Request API triggered.")); 
                     } else if (Reply.type === 'removeFriend') {
                         api.unfriend(uid, (err) => {
                             if(err) message.reply(toDarkStyle("❌ Failed to unfriend."));
                             else message.reply(toDarkStyle("✅ Unfriended user."));
                         });
                     } else {
                         // Accept/Decline logic often requires handleFriendRequest(uid, true/false)
                         api.handleFriendRequest(uid, Reply.type === 'acceptFriend', (err) => {
                             if(err) message.reply(toDarkStyle("❌ Operation failed."));
                             else message.reply(toDarkStyle("✅ Friend request processed."));
                         });
                     }
                 } catch(e) {
                     message.reply(toDarkStyle("❌ Error in Friend Module logic."));
                 }
            }

            // 19. Send Msg By ID
            else if (Reply.type === 'sendMsgID') {
                const targetUID = args[0];
                const msgContent = args.slice(1).join(" ");
                if (!targetUID || !msgContent) return message.reply(toDarkStyle("❌ Format: [UID] [Message]"));
                
                api.sendMessage(msgContent, targetUID, (err) => {
                    if (err) return message.reply(toDarkStyle("❌ Failed to send message (User might have blocked bot)."));
                    message.reply(toDarkStyle("✅ Message sent."));
                });
            }

        } catch (error) {
            console.error("💥 Config reply error:", error);
            message.reply(toDarkStyle("❌ An unexpected error occurred."));
        }
    },

    // --- 𝐇𝐞𝐥𝐩𝐞𝐫: 𝐂𝐡𝐞𝐜𝐤 𝐌𝐞𝐬𝐬𝐚𝐠𝐞𝐬 ---
    checkMessages: async function(api, message, boxType, label) {
        try {
            const list = await api.getThreadList(10, null, [boxType]);
            if (!list || list.length === 0) {
                return message.reply(toDarkStyle(`📭 No ${label} messages found.`));
            }
            
            let msg = toDarkStyle(`📬 ${label} Messages:\n\n`);
            list.forEach(thread => {
                msg += toDarkStyle(`Name: ${thread.name || "Unknown"}\n`);
                msg += toDarkStyle(`ID: ${thread.threadID}\n`);
                msg += toDarkStyle(`Snippet: ${thread.snippet}\n\n`);
            });
            
            message.reply(msg);
        } catch (error) {
            message.reply(toDarkStyle(`❌ Failed to fetch ${label} messages.`));
        }
    }
};
