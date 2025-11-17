const Canvas = require("canvas");

module.exports = {
    config: {
        name: "resetexp",
        aliases: ["resetallexp", "clearexp"],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 2,
        category: "system",
        shortDescription: {
            en: "🌟 Reset all users' EXP"
        },
        longDescription: {
            en: "🌟 Reset EXP for all users in the current thread with stylish confirmation"
        },
        guide: {
            en: "{p}resetexp"
        },
        dependencies: {
            "canvas": ""
        }
    },

    onStart: async function ({ api, event, usersData }) {
        try {
            // Check dependencies
            try {
                if (!Canvas || !Canvas.createCanvas) {
                    throw new Error("Missing required dependencies");
                }
            } catch (err) {
                return api.sendMessage("❌ | Required dependencies are missing. Please install canvas.", event.threadID, event.messageID);
            }

            const threadInfo = await api.getThreadInfo(event.threadID);
            let resetCount = 0;

            for (const user of threadInfo.userInfo) {
                const userData = await usersData.get(user.id);
                if (userData) {
                    await usersData.set(user.id, { exp: 0 });
                    resetCount++;
                }
            }

            // Create a canvas confirmation message
            const canvas = Canvas.createCanvas(600, 250);
            const ctx = canvas.getContext("2d");

            // Background gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, "#ff8c00");
            gradient.addColorStop(1, "#ff0080");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Text style
            ctx.font = "bold 36px Sans";
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.fillText("✅ EXP Reset Complete!", canvas.width / 2, 100);
            ctx.font = "28px Sans";
            ctx.fillText(`🌟 Total Users Reset: ${resetCount} 🌟`, canvas.width / 2, 170);

            // Convert canvas to buffer
            const imageBuffer = canvas.toBuffer();

            return api.sendMessage(
                { 
                    body: `✅ Successfully reset EXP for ${resetCount} users!`,
                    attachment: imageBuffer 
                },
                event.threadID,
                event.messageID
            );

        } catch (error) {
            console.error("ResetExp Command Error:", error);
            return api.sendMessage("❌ EXP reset korte giye ekta error hoyeche.", event.threadID, event.messageID);
        }
    }
};
