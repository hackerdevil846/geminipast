module.exports = {
    config: {
        name: "ghosttag",
        aliases: ["gtag", "spamtag"],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 1,
        role: 1,
        category: "group",
        shortDescription: {
            en: "Continuously tag user multiple times"
        },
        longDescription: {
            en: "Tag a user continuously for a specified number of times"
        },
        guide: {
            en: "{p}ghosttag @mention [times] [delay]"
        }
    },

    onStart: async function({ api, event, args }) {
        try {
            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            const { mentions, threadID, messageID } = event;
            
            function reply(body) {
                api.sendMessage(body, threadID, messageID);
            }

            // Initialize global storage if not exists
            if (!global.client.modulesGhostTag) {
                global.client.modulesGhostTag = [];
            }
            
            const dataGhostTag = global.client.modulesGhostTag;
            
            // Find or create thread data
            let thisGhostTag = dataGhostTag.find(item => item.threadID == threadID);
            if (!thisGhostTag) {
                thisGhostTag = { threadID, targetID: [] };
                dataGhostTag.push(thisGhostTag);
            }

            // Stop command
            if (args[0] === "stop") {
                if (args[1] === "all") {
                    thisGhostTag.targetID = [];
                    return reply("✅ Stopped all ghost tagging");
                } else {
                    if (Object.keys(mentions).length === 0) {
                        return reply("❌ Please tag the user you want to stop ghost tagging");
                    }
                    
                    let msg = "";
                    for (let id in mentions) {
                        const userName = mentions[id];
                        if (!thisGhostTag.targetID.includes(id)) {
                            msg += `\n${userName} is not currently being ghost tagged`;
                        } else {
                            thisGhostTag.targetID = thisGhostTag.targetID.filter(item => item !== id);
                            msg += `\n✅ Stopped ghost tagging ${userName}`;
                        }
                    }
                    return reply(msg);
                }
            } else {
                // Start ghost tagging
                if (Object.keys(mentions).length === 0) {
                    return reply("❌ Please tag the user you want to ghost tag");
                }
                
                // Parse times and delay
                let timesToTag = parseInt(args[args.length - 2]);
                let delayTime = parseInt(args[args.length - 1]);
                
                if (!timesToTag || !delayTime || isNaN(timesToTag) || isNaN(delayTime)) {
                    return reply("❌ Please specify valid number of times and delay\nExample: {p}ghosttag @user 10 2");
                }
                
                if (timesToTag > 50) {
                    return reply("❌ Maximum 50 times allowed for safety");
                }
                
                if (delayTime < 1) {
                    return reply("❌ Delay must be at least 1 second");
                }
                
                delayTime = delayTime * 1000; // Convert to milliseconds
                const target = Object.keys(mentions)[0];
                const userName = mentions[target];
                
                if (thisGhostTag.targetID.includes(target)) {
                    return reply("❌ This user is already being ghost tagged");
                }
                
                thisGhostTag.targetID.push(target);
                
                // Extract message content (remove the last two args which are times and delay)
                const messageContent = args.slice(0, args.length - 2).join(" ");
                
                await reply(`✅ Started ghost tagging ${userName}:\n📊 Times: ${timesToTag}\n⏰ Delay: ${delayTime/1000} seconds\n\nType "{p}ghosttag stop @user" to stop early`);
                
                let count = 0;
                const startTime = Date.now();
                
                while (count < timesToTag) {
                    // Check if target was removed (stop command)
                    const currentThreadData = global.client.modulesGhostTag.find(item => item.threadID == threadID);
                    if (!currentThreadData || !currentThreadData.targetID.includes(target)) {
                        break;
                    }
                    
                    await api.sendMessage({
                        body: messageContent ? `${messageContent}` : `👻 ${userName}`,
                        mentions: [{ id: target, tag: userName }]
                    }, threadID);
                    
                    count++;
                    
                    // Stop if reached the limit
                    if (count >= timesToTag) {
                        break;
                    }
                    
                    // Delay between tags
                    await delay(delayTime);
                    
                    // Safety timeout (10 minutes max)
                    if (Date.now() - startTime > 10 * 60 * 1000) {
                        break;
                    }
                }
                
                // Clean up after completion
                thisGhostTag.targetID = thisGhostTag.targetID.filter(id => id !== target);
                
                if (count === timesToTag) {
                    await api.sendMessage(`✅ Completed ghost tagging ${userName} ${timesToTag} times`, threadID);
                }
            }
        } catch (error) {
            console.error("Ghost Tag Error:", error);
            api.sendMessage("❌ An error occurred while processing ghost tag command", event.threadID, event.messageID);
        }
    }
};
