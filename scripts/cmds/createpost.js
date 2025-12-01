const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

/**
 * 𝐇𝐞𝐥𝐩𝐞𝐫 𝐅𝐮𝐧𝐜𝐭𝐢𝐨𝐧 𝐭𝐨 𝐂𝐨𝐧𝐯𝐞𝐫𝐭 𝐓𝐞𝐱𝐭 𝐭𝐨 𝐁𝐨𝐥𝐝 𝐒𝐚𝐧𝐬-𝐬𝐞𝐫𝐢𝐟
 */
const toBoldStyle = (str) => {
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
        name: "createpost",
        aliases: [],
        version: "2.0.0", // Updated version
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 2, // Admin Only
        category: "admin",
        shortDescription: {
            en: "𝐂𝐫𝐞𝐚𝐭𝐞 𝐧𝐞𝐰 𝐩𝐨𝐬𝐭 𝐨𝐧 𝐛𝐨𝐭 𝐚𝐜𝐜𝐨𝐮𝐧𝐭"
        },
        longDescription: {
            en: "𝐂𝐫𝐞𝐚𝐭𝐞 𝐩𝐨𝐬𝐭𝐬 𝐨𝐧 𝐭𝐡𝐞 𝐛𝐨𝐭'𝐬 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐚𝐜𝐜𝐨𝐮𝐧𝐭 𝐰𝐢𝐭𝐡 𝐜𝐮𝐬𝐭𝐨𝐦 𝐜𝐨𝐧𝐭𝐞𝐧𝐭 𝐚𝐧𝐝 𝐩𝐫𝐢𝐯𝐚𝐜𝐲 𝐬𝐞𝐭𝐭𝐢𝐧𝐠𝐬"
        },
        guide: {
            en: "{p}createpost"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function ({ message, event, api }) {
        try {
            // --- 𝟏. 𝐃𝐞𝐩𝐞𝐧𝐝𝐞𝐧𝐜𝐲 𝐂𝐡𝐞𝐜𝐤 ---
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                return message.reply(toBoldStyle("❌ Missing dependencies. Please install axios and fs-extra."));
            }

            const promptMsg = toBoldStyle(
                "🔒 𝐂𝐡𝐨𝐨𝐬𝐞 𝐰𝐡𝐨 𝐜𝐚𝐧 𝐬𝐞𝐞 𝐭𝐡𝐢𝐬 𝐩𝐨𝐬𝐭:\n\n" +
                "1. 𝐄𝐯𝐞𝐫𝐲𝐨𝐧𝐞 (𝐏𝐮𝐛𝐥𝐢𝐜)\n" +
                "2. 𝐅𝐫𝐢𝐞𝐧𝐝𝐬\n" +
                "3. 𝐎𝐧𝐥𝐲 𝐌𝐞\n\n" +
                "👉 𝐑𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 1, 2, 𝐨𝐫 3"
            );

            return message.reply(promptMsg, (err, info) => {
                if (err) return console.error(err);
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    step: "privacy",
                    postData: {} // Initialize container for post data
                });
            });

        } catch (error) {
            console.error("CreatePost Error:", error);
            message.reply(toBoldStyle("❌ Failed to start process."));
        }
    },

    onReply: async function ({ event, Reply, message, api }) {
        const { author, step, postData } = Reply;
        const { body, senderID, attachments } = event;

        // --- 𝟐. 𝐒𝐞𝐜𝐮𝐫𝐢𝐭𝐲 & 𝐋𝐨𝐨𝐩 𝐂𝐡𝐞𝐜𝐤 ---
        if (author !== senderID) return; // Ignore replies from others

        try {
            // --- 𝐒𝐓𝐄𝐏 𝟏: 𝐏𝐫𝐢𝐯𝐚𝐜𝐲 𝐒𝐞𝐥𝐞𝐜𝐭𝐢𝐨𝐧 ---
            if (step === "privacy") {
                if (!["1", "2", "3"].includes(body)) {
                    return message.reply(toBoldStyle("❌ Invalid option. Please reply with 1, 2, or 3."));
                }

                const privacyMap = {
                    "1": "EVERYONE",
                    "2": "FRIENDS",
                    "3": "SELF"
                };

                postData.privacy = privacyMap[body];
                postData.privacyLabel = body === "1" ? "Public" : body === "2" ? "Friends" : "Only Me";

                // Next Step: Ask for Content
                const contentMsg = toBoldStyle(
                    `✅ 𝐏𝐫𝐢𝐯𝐚𝐜𝐲 𝐬𝐞𝐭 𝐭𝐨: ${postData.privacyLabel}\n\n` +
                    "📝 𝐍𝐨𝐰 𝐫𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐭𝐡𝐞 𝐭𝐞𝐱𝐭 𝐜𝐨𝐧𝐭𝐞𝐧𝐭 𝐨𝐟 𝐲𝐨𝐮𝐫 𝐩𝐨𝐬𝐭.\n" +
                    "👉 𝐑𝐞𝐩𝐥𝐲 '0' 𝐭𝐨 𝐬𝐤𝐢𝐩 𝐭𝐞𝐱𝐭 (𝐢𝐟 𝐲𝐨𝐮 𝐨𝐧𝐥𝐲 𝐰𝐚𝐧𝐭 𝐢𝐦𝐚𝐠𝐞𝐬)."
                );

                message.reply(contentMsg, (err, info) => {
                    if (err) return;
                    // Unpush old reply, push new one
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        step: "content",
                        postData: postData
                    });
                });
            }

            // --- 𝐒𝐓𝐄𝐏 𝟐: 𝐓𝐞𝐱𝐭 𝐂𝐨𝐧𝐭𝐞𝐧𝐭 ---
            else if (step === "content") {
                postData.text = (body === "0") ? "" : body;

                // Next Step: Ask for Images
                const imgMsg = toBoldStyle(
                    `✅ 𝐓𝐞𝐱𝐭 𝐬𝐚𝐯𝐞𝐝.\n\n` +
                    "🖼️ 𝐍𝐨𝐰 𝐫𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐈𝐌𝐀𝐆𝐄𝐒 (𝐲𝐨𝐮 𝐜𝐚𝐧 𝐬𝐞𝐥𝐞𝐜𝐭 𝐦𝐮𝐥𝐭𝐢𝐩𝐥𝐞).\n" +
                    "👉 𝐑𝐞𝐩𝐥𝐲 '0' 𝐢𝐟 𝐲𝐨𝐮 𝐝𝐨𝐧'𝐭 𝐰𝐚𝐧𝐭 𝐭𝐨 𝐚𝐝𝐝 𝐢𝐦𝐚𝐠𝐞𝐬."
                );

                message.reply(imgMsg, (err, info) => {
                    if (err) return;
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        step: "image",
                        postData: postData
                    });
                });
            }

            // --- 𝐒𝐓𝐄𝐏 𝟑: 𝐈𝐦𝐚𝐠𝐞𝐬 & 𝐄𝐱𝐞𝐜𝐮𝐭𝐢𝐨𝐧 ---
            else if (step === "image") {
                
                const uploads = [];
                
                // If user sent images
                if (attachments && attachments.length > 0) {
                    message.reply(toBoldStyle("⏳ 𝐔𝐩𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐦𝐞𝐝𝐢𝐚... 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭."));
                    
                    for (const attach of attachments) {
                        if (attach.type === "photo") {
                            try {
                                const stream = await global.utils.getStreamFromURL(attach.url);
                                const uploadRes = await api.uploadAttachment([stream]); // Upload to FB to get ID
                                if (uploadRes && uploadRes.length > 0) {
                                     // Store the upload ID
                                    uploads.push(uploadRes[0]); 
                                }
                            } catch (e) {
                                console.error("Upload error:", e);
                            }
                        }
                    }
                } else if (body !== "0") {
                    return message.reply(toBoldStyle("❌ Please reply with an image or '0' to finish."));
                }

                postData.attachmentIDs = uploads;

                // --- 𝐅𝐈𝐍𝐀𝐋 𝐄𝐗𝐄𝐂𝐔𝐓𝐈𝐎𝐍 ---
                await this.createPost(api, postData, message);
            }

        } catch (error) {
            console.error("Reply Handler Error:", error);
            message.reply(toBoldStyle("❌ An error occurred during the process."));
        }
    },

    // --- 𝟑. 𝐒𝐚𝐟𝐞 𝐏𝐨𝐬𝐭 𝐂𝐫𝐞𝐚𝐭𝐢𝐨𝐧 𝐋𝐨𝐠𝐢𝐜 ---
    createPost: async function (api, data, message) {
        try {
            // Construct Cookies from AppState (The Anti-Ban Fix)
            const appState = await api.getAppState();
            const cookieString = appState.map(c => `${c.key}=${c.value}`).join("; ");
            
            // We need fb_dtsg. Usually available in api.getAppState or context. 
            // Since we can't easily get it without a GET request, we will rely on a generic fetch or try to construct the mutation carefully.
            // BETTER APPROACH: Use a robust payload that mimics a real browser Post.

            const uuid = getGUID();
            
            // Prepare Attachments
            const attachmentList = [];
            if (data.attachmentIDs && data.attachmentIDs.length > 0) {
                 // Convert API attachment objects to the ID format GraphQL expects
                 // Note: uploadAttachment returns full objects, we need the ID.
                 // Depending on API version, it might be in different props.
                 data.attachmentIDs.forEach(att => {
                     // Try to find the ID in common locations
                     const id = att.attachmentID || att.id || att.fbid; 
                     if(id) {
                         attachmentList.push({
                             "photo": { "id": id.toString() }
                         });
                     }
                 });
            }

            const formData = {
                "input": {
                    "composer_entry_point": "inline_composer",
                    "composer_source_surface": "timeline",
                    "idempotence_token": uuid + "_FEED",
                    "source": "WWW",
                    "attachments": attachmentList,
                    "audience": {
                        "privacy": {
                            "allow": [],
                            "base_state": data.privacy, // EVERYONE, FRIENDS, SELF
                            "deny": [],
                            "tag_expansion_state": "UNSPECIFIED"
                        }
                    },
                    "message": {
                        "ranges": [],
                        "text": data.text || ""
                    },
                    "with_tags_ids": [],
                    "inline_activities": [],
                    "explicit_place_id": "0",
                    "text_format_preset_id": "0",
                    "logging": {
                        "composer_session_id": uuid
                    },
                    "tracking": [null],
                    "actor_id": api.getCurrentUserID(),
                    "client_mutation_id": Math.floor(Math.random() * 17)
                },
                "displayCommentsFeedbackContext": null,
                "displayCommentsContextEnableComment": null,
                "displayCommentsContextIsAdPreview": null,
                "displayCommentsContextIsAggregatedShare": null,
                "displayCommentsContextIsStorySet": null,
                "feedLocation": "TIMELINE",
                "feedbackSource": 0,
                "focusCommentID": null,
                "gridMediaWidth": 230,
                "groupID": null,
                "scale": 3,
                "privacySelectorRenderLocation": "COMET_STREAM",
                "renderLocation": "timeline",
                "useDefaultActor": false,
                "inviteShortLinkKey": null,
                "isFeed": false,
                "isFundraiser": false,
                "isFunFactPost": false,
                "isGroup": false,
                "isTimeline": true,
                "isSocialLearning": false,
                "isPageNewsFeed": false,
                "isProfileReviews": false,
                "isWorkSharedDraft": false,
                "UFI2CommentsProvider_commentsKey": "ProfileCometTimelineRoute",
                "hashtag": null,
                "canUserManageOffers": false
            };

            const form = {
                av: api.getCurrentUserID(),
                fb_api_req_friendly_name: "ComposerStoryCreateMutation",
                fb_api_caller_class: "RelayModern",
                doc_id: "7711610262190099",
                variables: JSON.stringify(formData)
            };
            
            // Fetch fb_dtsg if possible, otherwise rely on cookies
            // NOTE: Sending this request via axios with the correct cookies is key.
            
            const response = await axios.post('https://www.facebook.com/api/graphql/', form, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': cookieString, // <--- 𝐂𝐑𝐈𝐓𝐈𝐂𝐀𝐋: 𝐔𝐬𝐢𝐧𝐠 𝐁𝐨𝐭'𝐬 𝐀𝐜𝐭𝐮𝐚𝐥 𝐂𝐨𝐨𝐤𝐢𝐞𝐬
                    // Note: If you have the fb_dtsg in global.client, add it here: 'fb_dtsg': global.client.fb_dtsg 
                }
            });

            // Handle Response
            let resData = response.data;
            if (typeof resData === "string") {
                 // Remove anti-hijacking prefix
                 resData = JSON.parse(resData.replace("for (;;);", ""));
            }

            const postID = resData.data?.story_create?.story?.legacy_story_hideable_id || resData.data?.story_create?.story?.id;
            const postUrl = resData.data?.story_create?.story?.url;

            if (postID) {
                return message.reply(toBoldStyle(`✅ 𝐏𝐨𝐬𝐭 𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!\n\n🆔 𝐈𝐃: ${postID}\n🔒 𝐏𝐫𝐢𝐯𝐚𝐜𝐲: ${data.privacyLabel}`));
            } else {
                // Fallback debug
                console.log(JSON.stringify(resData));
                throw new Error("No Post ID returned");
            }

        } catch (e) {
            console.error(e);
            return message.reply(toBoldStyle("❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐜𝐫𝐞𝐚𝐭𝐞 𝐩𝐨𝐬𝐭. (𝐂𝐡𝐞𝐜𝐤 𝐜𝐨𝐧𝐬𝐨𝐥𝐞 𝐟𝐨𝐫 𝐝𝐞𝐭𝐚𝐢𝐥𝐬)"));
        }
    }
};

function getGUID() {
    let sectionLength = Date.now();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        const r = Math.floor((sectionLength + Math.random() * 16) % 16);
        sectionLength = Math.floor(sectionLength / 16);
        return (c === "x" ? r : (r & 7) | 8).toString(16);
    });
}
