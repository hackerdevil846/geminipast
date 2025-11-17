const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "createpost",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 2,
        category: "admin",
        shortDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝗇𝖾𝗐 𝗉𝗈𝗌𝗍 𝗈𝗇 𝖻𝗈𝗍 𝖺𝖼𝖼𝗈𝗎𝗇𝗍"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝗉𝗈𝗌𝗍𝗌 𝗈𝗇 𝗍𝗁𝖾 𝖻𝗈𝗍'𝗌 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖺𝖼𝖼𝗈𝗎𝗇𝗍 𝗐𝗂𝗍𝗁 𝖼𝗎𝗌𝗍𝗈𝗆 𝖼𝗈𝗇𝗍𝖾𝗇𝗍 𝖺𝗇𝖽 𝗉𝗋𝗂𝗏𝖺𝖼𝗒 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌"
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
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            const uuid = getGUID();
            const formData = {
                "input": {
                    "composer_entry_point": "inline_composer",
                    "composer_source_surface": "timeline",
                    "idempotence_token": uuid + "_FEED",
                    "source": "WWW",
                    "attachments": [],
                    "audience": {
                        "privacy": {
                            "allow": [],
                            "base_state": "FRIENDS",
                            "deny": [],
                            "tag_expansion_state": "UNSPECIFIED"
                        }
                    },
                    "message": {
                        "ranges": [],
                        "text": ""
                    },
                    "with_tags_ids": [],
                    "inline_activities": [],
                    "explicit_place_id": "0",
                    "text_format_preset_id": "0",
                    "logging": {
                        "composer_session_id": uuid
                    },
                    "tracking": [
                        null
                    ],
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

            await message.reply("𝖢𝗁𝗈𝗈𝗌𝖾 𝗐𝗁𝗈 𝖼𝖺𝗇 𝗌𝖾𝖾 𝗍𝗁𝗂𝗌 𝗉𝗈𝗌𝗍:\n1. 𝖤𝗏𝖾𝗋𝗒𝗈𝗇𝖾\n2. 𝖥𝗋𝗂𝖾𝗇𝖽𝗌\n3. 𝖮𝗇𝗅𝗒 𝗆𝖾", (err, info) => {
                if (err) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", err);
                    return;
                }
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    formData,
                    type: "whoSee"
                });
            });

        } catch (error) {
            console.error("💥 𝖢𝗋𝖾𝖺𝗍𝖾𝖯𝗈𝗌𝗍 𝖾𝗋𝗋𝗈𝗋:", error);
            await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗂𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖾 𝗉𝗈𝗌𝗍 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇");
        }
    },

    onReply: async function ({ event, Reply, message, api }) {
        try {
            // Check if reply is from the same user
            if (event.senderID !== Reply.author) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗅𝖾𝗍 𝗍𝗁𝖾 𝗈𝗋𝗂𝗀𝗂𝗇𝖺𝗅 𝗎𝗌𝖾𝗋 𝖼𝗈𝗇𝗍𝗂𝗇𝗎𝖾 𝗍𝗁𝖾 𝗉𝗈𝗌𝗍 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇.");
            }
            
            const { type, formData } = Reply;
            const { attachments, body } = event;

            async function uploadAttachments(attachmentUrls) {
                const uploads = [];
                for (const url of attachmentUrls) {
                    try {
                        const stream = await global.utils.getStreamFromURL(url);
                        if (stream) {
                            uploads.push(stream);
                        }
                    } catch (error) {
                        console.error("❌ 𝖴𝗉𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
                    }
                }
                return uploads;
            }

            if (type === "whoSee") {
                if (!["1", "2", "3"].includes(body)) {
                    return message.reply('❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝗈𝗈𝗌𝖾 1, 2, 𝗈𝗋 3 𝖿𝗋𝗈𝗆 𝗍𝗁𝖾 𝗈𝗉𝗍𝗂𝗈𝗇𝗌 𝖺𝖻𝗈𝗏𝖾');
                }
                formData.input.audience.privacy.base_state = body === "1" ? "EVERYONE" : body === "2" ? "FRIENDS" : "SELF";
                
                await message.reply("𝖱𝖾𝗉𝗅𝗒 𝗍𝗈 𝗍𝗁𝗂𝗌 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗍𝗁𝖾 𝖼𝗈𝗇𝗍𝖾𝗇𝗍 𝗈𝖿 𝗒𝗈𝗎𝗋 𝗉𝗈𝗌𝗍, 𝗋𝖾𝗉𝗅𝗒 0 𝗍𝗈 𝗅𝖾𝖺𝗏𝖾 𝖾𝗆𝗉𝗍𝗒", (err, info) => {
                    if (err) {
                        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", err);
                        return;
                    }
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        formData,
                        type: "content"
                    });
                });
            }
            else if (type === "content") {
                if (body !== "0") formData.input.message.text = body;
                
                await message.reply("𝖱𝖾𝗉𝗅𝗒 𝗍𝗈 𝗍𝗁𝗂𝗌 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗂𝗆𝖺𝗀𝖾𝗌 (𝗒𝗈𝗎 𝖼𝖺𝗇 𝗌𝖾𝗇𝖽 𝗆𝗎𝗅𝗍𝗂𝗉𝗅𝖾 𝗂𝗆𝖺𝗀𝖾𝗌), 𝗋𝖾𝗉𝗅𝗒 0 𝗂𝖿 𝗒𝗈𝗎 𝖽𝗈𝗇'𝗍 𝗐𝖺𝗇𝗍 𝗍𝗈 𝗉𝗈𝗌𝗍 𝗂𝗆𝖺𝗀𝖾𝗌", (err, info) => {
                    if (err) {
                        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", err);
                        return;
                    }
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        formData,
                        type: "image"
                    });
                });
            }
            else if (type === "image") {
                try {
                    if (body !== "0" && attachments && attachments.length > 0) {
                        const imageUrls = attachments
                            .filter(attach => attach.type === "photo")
                            .map(attach => attach.url);
                        
                        if (imageUrls.length > 0) {
                            const uploadedFiles = await uploadAttachments(imageUrls);
                            
                            for (const result of uploadedFiles) {
                                formData.input.attachments.push({
                                    "photo": {
                                        "id": result.toString(),
                                    }
                                });
                            }
                        }
                    }

                    const form = {
                        av: api.getCurrentUserID(),
                        fb_api_req_friendly_name: "ComposerStoryCreateMutation",
                        fb_api_caller_class: "RelayModern",
                        doc_id: "7711610262190099",
                        variables: JSON.stringify(formData)
                    };

                    const response = await axios.post('https://www.facebook.com/api/graphql/', form, {
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });
                    
                    let info = response.data;
                    
                    if (typeof info === "string") {
                        try {
                            info = JSON.parse(info.replace("for (;;);", ""));
                        } catch (e) {
                            throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝖺𝗋𝗌𝖾 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾");
                        }
                    }
                    
                    const postID = info.data?.story_create?.story?.legacy_story_hideable_id;
                    const urlPost = info.data?.story_create?.story?.url;
                    
                    if (!postID) {
                        console.error("❌ 𝖭𝗈 𝗉𝗈𝗌𝗍 𝖨𝖣 𝗋𝖾𝗍𝗎𝗋𝗇𝖾𝖽:", info);
                        throw new Error("𝖭𝗈 𝗉𝗈𝗌𝗍 𝖨𝖣 𝗋𝖾𝗍𝗎𝗋𝗇𝖾𝖽");
                    }
                    
                    // Cleanup cache files
                    try {
                        const cachePath = path.join(__dirname, 'cache', 'imagePost.png');
                        if (fs.existsSync(cachePath)) {
                            fs.unlinkSync(cachePath);
                        }
                    } catch (e) {
                        console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖼𝖺𝖼𝗁𝖾:", e.message);
                    }
                    
                    await message.reply(`✅ 𝖯𝗈𝗌𝗍 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒!\n\n🆔 𝖯𝗈𝗌𝗍 𝖨𝖣: ${postID}\n🔗 𝖴𝖱𝖫: ${urlPost || '𝖭/𝖠'}`);
                    
                } catch (error) {
                    console.error("💥 𝖯𝗈𝗌𝗍 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", error);
                    
                    let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗉𝗈𝗌𝗍, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋";
                    
                    if (error.code === 'ECONNREFUSED') {
                        errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
                    } else if (error.code === 'ETIMEDOUT') {
                        errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
                    } else if (error.response) {
                        errorMessage = `❌ 𝖠𝖯𝖨 𝖾𝗋𝗋𝗈𝗋: ${error.response.status}`;
                    }
                    
                    await message.reply(errorMessage);
                }
            }
        } catch (error) {
            console.error("💥 𝖢𝗋𝖾𝖺𝗍𝖾𝖯𝗈𝗌𝗍 𝗋𝖾𝗉𝗅𝗒 𝖾𝗋𝗋𝗈𝗋:", error);
            await message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
        }
    }
};

function getGUID() {
    let sectionLength = Date.now();
    const id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        const r = Math.floor((sectionLength + Math.random() * 16) % 16);
        sectionLength = Math.floor(sectionLength / 16);
        const _guid = (c === "x" ? r : (r & 7) | 8).toString(16);
        return _guid;
    });
    return id;
}
