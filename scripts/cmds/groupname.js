module.exports = {
    config: {
        name: "groupname",
        aliases: [],
        version: "2.0.1",
        author: "Asif Mahmud",
        countDown: 3,
        role: 1,
        category: "group",
        shortDescription: {
            en: "Change your group's name with style"
        },
        longDescription: {
            en: "Change the name of your Facebook group with custom styling"
        },
        guide: {
            en: "{p}groupname [new name]"
        }
    },

    onStart: async function({ message, args, event, api, usersData }) {
        try {
            const { threadID, senderID } = event;
            const newName = args.join(" ").trim();
            
            // Validate input
            if (!newName) {
                return message.reply("🎯 | Please enter a new name for the group!\n\n💡 | Usage: groupname [new name]\n📝 | Example: groupname Awesome Squad");
            }
            
            if (newName.length > 200) {
                return message.reply("❌ | Group name cannot exceed 200 characters!\n\n📊 | Current length: " + newName.length + " characters");
            }
            
            if (newName.length < 2) {
                return message.reply("❌ | Group name must be at least 2 characters long!");
            }

            // Check if user has permission (role 1 or higher)
            const threadInfo = await api.getThreadInfo(threadID);
            const participant = threadInfo.participants.find(p => p.id === senderID);
            
            if (!participant) {
                return message.reply("❌ | Unable to verify your permissions in this group.");
            }

            // Show processing message
            const processingMsg = await message.reply("⏳ | Changing group name, please wait...");

            // Change group name
            await api.setTitle(newName, threadID);
            
            // Get user name from database
            const userData = await usersData.get(senderID);
            const userName = userData.name || "Unknown User";

            // Clean up processing message
            try {
                if (processingMsg && processingMsg.messageID) {
                    await message.unsend(processingMsg.messageID);
                }
            } catch (unsendError) {
                // Ignore unsend errors
            }

            // Success message
            return message.reply({
                body: `✅ | Group Name Changed Successfully!\n\n✨ | New Name: 「 ${newName} 」\n👤 | Changed By: ${userName}\n📊 | Name Length: ${newName.length} characters`,
                mentions: [{
                    tag: userName,
                    id: senderID
                }]
            });
            
        } catch (error) {
            console.error("Group Name Error:", error);
            
            let errorMessage = "❌ | Failed to change group name!";
            
            if (error.message.includes("permission")) {
                errorMessage += "\n🔧 | Please ensure I have admin permission to change group names!";
            } else if (error.message.includes("rate limit")) {
                errorMessage += "\n⏰ | Too many name changes. Please wait and try again later.";
            } else if (error.message.includes("title")) {
                errorMessage += "\n🚫 | This group name may be invalid or restricted.";
            } else {
                errorMessage += "\n🔧 | Please try again later!";
            }
            
            return message.reply(errorMessage);
        }
    },

    onLoad: function() {
        console.log("🔧 Group Name Command Loaded Successfully!");
    }
};
