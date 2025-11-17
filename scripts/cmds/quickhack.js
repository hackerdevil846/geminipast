const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "quickhack",
    aliases: ["hacksim", "prankhack"],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 30,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🇧🇩 𝑸𝒖𝒊𝒄𝒌 𝒑𝒓𝒂𝒏𝒌: 𝒉𝒂𝒄𝒌𝒊𝒏𝒈 𝒔𝒊𝒎𝒖𝒍𝒂𝒕𝒊𝒐𝒏"
    },
    longDescription: {
      en: "🇧🇩 𝑸𝒖𝒊𝒄𝒌 𝒑𝒓𝒂𝒏𝒌: ~𝟏𝟎 𝒔𝒆𝒌𝒆𝒏𝒅𝒆𝒓 𝒎𝒐𝒅𝒅𝒉𝒆 𝒉𝒂𝒄𝒌𝒊𝒏𝒈 𝒔𝒊𝒎𝒖𝒍𝒂𝒕𝒆 𝒌𝒐𝒓𝒆, 𝒇𝒆𝒊𝒌 𝒍𝒐𝒈𝒊𝒏 𝒑𝒆𝒋 𝒂𝒓 𝒑𝒓𝒐𝒇𝒊𝒍 𝒑𝒊𝒄 𝒅𝒆𝒚 𝒋𝒐𝒅𝒊 𝒑𝒂𝒘𝒂 𝒋𝒂𝒚, 𝒂𝒃𝒐𝒏𝒈 𝒂𝒅𝒎𝒊𝒏𝒌𝒆 𝒋𝒂𝒏𝒂𝒏𝒐 𝒌𝒐𝒓𝒆. 𝑷𝒓𝒐𝒇𝒊𝒍 𝒇𝒆𝒕𝒄𝒉 𝒆𝒓𝒓𝒐𝒓 𝒉𝒂𝒏𝒅𝒍𝒆 𝒌𝒐𝒓𝒆."
    },
    guide: {
      en: "{p}quickhack @user"
    },
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "canvas": ""
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // Check dependencies
      try {
        if (!axios || !fs || !path || !createCanvas || !loadImage) {
          throw new Error("Missing required dependencies");
        }
      } catch (err) {
        return api.sendMessage("❌ | Required dependencies are missing. Please install axios, fs-extra, and canvas.", event.threadID, event.messageID);
      }

      const adminUID = "61571630409265";
      const { senderID, mentions, threadID, messageID } = event;

      if (senderID !== adminUID) {
        return api.sendMessage(
          "❌ 𝑺𝒉𝒖𝒅𝒉𝒖 𝒎𝒂𝒕𝒓𝒐 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 𝒆𝒊 𝒇𝒊𝒄𝒉𝒂𝒓 𝒃𝒂𝒃𝒐𝒉𝒂𝒓 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒃𝒆𝒏",
          threadID,
          messageID
        );
      }

      if (Object.keys(mentions).length === 0) {
        return api.sendMessage(
          "⚠️ 𝑷𝒓𝒂𝒏𝒌𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒌𝒂𝒌𝒆 𝒉𝒂𝒄𝒌 𝒅𝒆𝒌𝒉𝒂𝒃𝒆𝒏, 𝒕𝒂𝒓 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒌𝒐𝒓𝒖𝒏!",
          threadID,
          messageID
        );
      }

      const targetUID = Object.keys(mentions)[0];
      const targetName = mentions[targetUID].replace(/@/g, "");

      api.sendMessage(
        `⏱️ 𝑻𝒂𝒓𝒈𝒆𝒕 𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒅𝒓𝒖𝒕𝒐 𝒑𝒓𝒐𝒌𝒓𝒊𝒚𝒂 𝒔𝒉𝒖𝒓𝒖 𝒌𝒐𝒓𝒂 𝒉𝒐𝒄𝒄𝒆: ${targetName} [UID: ${targetUID}]\n⏳ 𝑨𝒏𝒖𝒎𝒂𝒏𝒊𝒌 𝒔𝒐𝒎𝒐𝒚: ~10 𝒔𝒆𝒄𝒐𝒏𝒅...`,
        threadID,
        messageID
      );

      const finishTimeSeconds = 9;

      setTimeout(async () => {
        let profilePicSentSuccessfully = false;
        let tempProfilePicPath = null;

        const fakeDirectMessageText = `🚨 𝑺𝒆𝒄𝒖𝒓𝒊𝒕𝒚 𝑨𝒍𝒆𝒓𝒕 🚨\n\n𝑨𝒑𝒏𝒂𝒓 𝒂𝒄𝒄𝒐𝒖𝒏𝒕 𝒔𝒖𝒓𝒂𝒌𝒉𝒂 𝒃𝒉𝒐𝒏𝒈 𝒉𝒐𝒚𝒆𝒄𝒉𝒆!\n𝑨𝒑𝒏𝒂𝒓 𝑰𝑫 𝒂𝒃𝒐𝒏𝒈 𝒑𝒂𝒔𝒔𝒘𝒐𝒓𝒅 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅-𝒌𝒆 𝒉𝒂𝒔𝒕𝒂𝒏𝒕𝒐𝒓 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆\n\n𝑨𝒏𝒖𝒈𝒓𝒐𝒉𝒐 𝒌𝒐𝒓𝒆 𝒂𝒃𝒊𝒍𝒐𝒎𝒃𝒆 𝒂𝒑𝒏𝒂𝒓 𝒑𝒂𝒔𝒔𝒘𝒐𝒓𝒅 𝒑𝒐𝒓𝒊𝒃𝒐𝒓𝒕𝒐𝒏 𝒌𝒐𝒓𝒖𝒏!`;

        try {
          await api.sendMessage(fakeDirectMessageText, targetUID);
        } catch (dmError) {
          api.sendMessage(
            `⚠️ 𝑺𝒂𝒕𝒂𝒓𝒌𝒐𝒕𝒂: ${targetName}-𝒌𝒆 𝒔𝒐𝒓𝒂𝒔𝒐𝒓𝒊 𝒃𝒂𝒓𝒕𝒂 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒋𝒂𝒚𝒏𝒊 (𝒔𝒐𝒎𝒑𝒖𝒓𝒏𝒐 𝒃𝒊𝒕𝒐𝒓𝒐𝒏 𝒏𝒂𝒐 𝒉𝒐𝒕𝒆 𝒑𝒂𝒓𝒆)`,
            threadID
          );
        }

        try {
          const userInfo = await api.getUserInfo(targetUID);

          if (userInfo && userInfo[targetUID] && userInfo[targetUID].profileUrl) {
            const targetFullName = userInfo[targetUID].name;
            const profilePicUrl = userInfo[targetUID].profileUrl;
            const imageDir = path.join(__dirname, "cache");
            tempProfilePicPath = path.join(imageDir, `${targetUID}_styled_profile_pic.jpg`);
            await fs.ensureDir(imageDir);

            // Download profile pic
            const response = await axios({
              url: profilePicUrl,
              method: "GET",
              responseType: "stream",
            });

            const tempOriginalPicPath = path.join(imageDir, `${targetUID}_original_profile_pic.jpg`);
            const writer = fs.createWriteStream(tempOriginalPicPath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
              writer.on("finish", resolve);
              writer.on("error", reject);
            });

            // Use canvas to create stylish framed profile pic
            const img = await loadImage(tempOriginalPicPath);
            const canvas = createCanvas(img.width + 40, img.height + 40);
            const ctx = canvas.getContext("2d");

            // Background
            ctx.fillStyle = "#121212";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Frame
            ctx.strokeStyle = "#0ff";
            ctx.lineWidth = 8;
            ctx.shadowColor = "#0ff";
            ctx.shadowBlur = 15;
            ctx.strokeRect(10, 10, img.width + 20, img.height + 20);

            // Draw profile pic in center
            ctx.drawImage(img, 20, 20, img.width, img.height);

            // Text overlay
            ctx.font = "bold 28px Arial";
            ctx.fillStyle = "#0ff";
            ctx.textAlign = "center";
            ctx.fillText("HACKING SIMULATION", canvas.width / 2, canvas.height - 10);

            // Save canvas result
            const buffer = canvas.toBuffer("image/jpeg");
            fs.writeFileSync(tempProfilePicPath, buffer);

            // Send message with styled profile pic attachment
            const fakeLoginMessageBody = `
🔒 𝑨𝒄𝒄𝒆𝒔𝒔 𝒐𝒏𝒖𝒎𝒐𝒅𝒊𝒕𝒐! 𝑳𝒐𝒈𝒊𝒏 𝒑𝒂𝒈𝒆 𝒔𝒊𝒎𝒖𝒍𝒂𝒕𝒊𝒐𝒏:
𝑻𝒂𝒓𝒈𝒆𝒕: ${targetFullName} [UID: ${targetUID}]
𝑷𝒓𝒐𝒇𝒊𝒍𝒆 𝒄𝒉𝒂𝒃𝒊 𝒏𝒊𝒄𝒉𝒆:
--- 𝑳𝒐𝒈𝒊𝒏 𝑰𝒏𝒕𝒆𝒓𝒇𝒂𝒄𝒆 ---
𝑺𝒚𝒔𝒕𝒆𝒎 𝒍𝒐𝒈𝒊𝒏:
𝑩𝒂𝒃𝒐𝒉𝒉𝒐𝒌𝒂𝒓𝒊: ${targetUID}
𝑷𝒂𝒔𝒔𝒘𝒐𝒓𝒅: **
𝑺𝒕𝒉𝒊𝒕𝒊: ${targetFullName} 𝒉𝒊𝒔𝒆𝒃𝒆 𝒔𝒂𝒑𝒉𝒂𝒍 𝒑𝒓𝒐𝒎𝒂𝒏𝒊𝒌𝒓𝒐𝒏
𝑺𝒐𝒓𝒃𝒐𝒔𝒉𝒆𝒔𝒉 𝒍𝒐𝒈𝒊𝒏: 𝒂𝒋, ${new Date().toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
----------------------------
[ 𝑭𝒐𝒍𝒂𝒇𝒐𝒍 ] 𝑳𝒐𝒈𝒊𝒏 𝒑𝒂𝒈𝒆 𝒕𝒐𝒊𝒓𝒊 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆. 𝑪𝒓𝒆𝒅𝒆𝒏𝒕𝒊𝒂𝒍𝒔 𝒔𝒊𝒎𝒖𝒍𝒂𝒕𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆.
`;

            await api.sendMessage(
              {
                body: fakeLoginMessageBody,
                attachment: fs.createReadStream(tempProfilePicPath),
              },
              threadID
            );

            profilePicSentSuccessfully = true;

            // Clean up original downloaded pic
            await fs.unlink(tempOriginalPicPath);
          } else {
            api.sendMessage(
              `✅ ${targetName} 𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒅𝒓𝒖𝒕𝒐 𝒑𝒓𝒐𝒌𝒓𝒊𝒚𝒂 𝒔𝒐𝒎𝒑𝒏𝒐 𝒉𝒐𝒚𝒆𝒄𝒉𝒆. (𝑳𝒐𝒈𝒊𝒏 𝒑𝒆𝒋𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒑𝒓𝒐𝒇𝒊𝒍𝒆 𝒕𝒐𝒕𝒉𝒃𝒂 𝒄𝒉𝒂𝒃𝒊 𝒑𝒂𝒐𝒂 𝒋𝒂𝒚𝒏𝒊)`,
              threadID
            );
          }
        } catch (error) {
          api.sendMessage(
            `✅ ${targetName} 𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒅𝒓𝒖𝒕𝒐 𝒑𝒓𝒐𝒌𝒓𝒊𝒚𝒂 𝒔𝒐𝒎𝒑𝒏𝒐 𝒉𝒐𝒚𝒆𝒄𝒉𝒆. (𝑳𝒐𝒈𝒊𝒏 𝒑𝒂𝒈𝒆 𝒕𝒐𝒊𝒓𝒊/𝒑𝒂𝒕𝒉𝒂𝒕𝒆 𝒕𝒓𝒖𝒕𝒊 𝒉𝒐𝒚𝒆𝒄𝒉𝒆)`,
            threadID
          );
        } finally {
          if (tempProfilePicPath && (await fs.pathExists(tempProfilePicPath))) {
            fs.unlink(tempProfilePicPath).catch(() => {});
          }
        }

        let finalMessageToAdminText = profilePicSentSuccessfully
          ? "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅, 𝒌𝒂𝒋 𝒔𝒐𝒎𝒑𝒏𝒐 𝒉𝒐𝒚𝒆𝒄𝒉𝒆 𝒍𝒐𝒈𝒊𝒏 𝒌𝒐𝒓𝒖𝒏, 𝑰𝑫 𝒐 𝒑𝒂𝒔𝒔𝒘𝒐𝒓𝒅 𝒂𝒑𝒏𝒂𝒓 𝒌𝒂𝒄𝒉𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒚𝒆𝒄𝒉𝒆."
          : "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅, 𝒌𝒂𝒋 𝒔𝒐𝒎𝒑𝒏𝒐 𝒉𝒐𝒚𝒆𝒄𝒉𝒆 𝒌𝒊𝒏𝒕𝒖 𝒕𝒂𝒓𝒈𝒆𝒕 𝒆𝒓 𝒑𝒓𝒐𝒇𝒊𝒍𝒆 𝒕𝒐𝒕𝒉𝒃𝒂/𝒄𝒉𝒂𝒃𝒊 𝒏𝒂 𝒑𝒂𝒐𝒘𝒂𝒚 𝒍𝒐𝒈𝒊𝒏 𝒑𝒂𝒈𝒆 𝒅𝒆𝒌𝒉𝒂𝒏𝒐 𝒋𝒂𝒚𝒏𝒊 𝒍𝒐𝒈𝒊𝒏 𝒌𝒐𝒓𝒖𝒏, 𝑰𝑫 𝒐 𝒑𝒂𝒔𝒔𝒘𝒐𝒓𝒅 𝒂𝒑𝒏𝒂𝒓 𝒌𝒂𝒄𝒉𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒚𝒆𝒄𝒉𝒆.";

        const mentionAdmin = { tag: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", id: adminUID };

        try {
          await api.sendMessage(
            {
              body: finalMessageToAdminText,
              mentions: [mentionAdmin],
            },
            threadID
          );
        } catch (error) {
          const fallbackMessage = profilePicSentSuccessfully
            ? "✅ 𝑫𝒓𝒖𝒕𝒐 𝒑𝒓𝒐𝒌𝒓𝒊𝒚𝒂 𝒔𝒐𝒎𝒑𝒏𝒐 𝒉𝒐𝒚𝒆𝒄𝒉𝒆. 𝒌𝒂𝒋 𝒉𝒐𝒚𝒆𝒄𝒉𝒆 𝒍𝒐𝒈𝒊𝒏 𝒌𝒐𝒓𝒖𝒏, 𝑰𝑫 𝒐 𝒑𝒂𝒔𝒔𝒘𝒐𝒓𝒅 𝒂𝒑𝒏𝒂𝒓 𝒌𝒂𝒄𝒉𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒚𝒆𝒄𝒉𝒆."
            : "✅ 𝑫𝒓𝒖𝒕𝒐 𝒑𝒓𝒐𝒌𝒓𝒊𝒚𝒂 𝒔𝒐𝒎𝒑𝒏𝒐 𝒉𝒐𝒚𝒆𝒄𝒉𝒆. 𝒌𝒂𝒋 𝒉𝒐𝒚𝒆𝒄𝒉𝒆 𝒌𝒊𝒏𝒕𝒖 𝒍𝒐𝒈𝒊𝒏 𝒑𝒂𝒈𝒆 𝒅𝒆𝒌𝒉𝒂𝒏𝒐 𝒋𝒂𝒚𝒏𝒊 𝒍𝒐𝒈𝒊𝒏 𝒌𝒐𝒓𝒖𝒏, 𝑰𝑫 𝒐 𝒑𝒂𝒔𝒔𝒘𝒐𝒓𝒅 𝒂𝒑𝒏𝒂𝒓 𝒌𝒂𝒄𝒉𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒚𝒆𝒄𝒉𝒆.";

          api.sendMessage(fallbackMessage, threadID);
        }
      }, finishTimeSeconds * 1000);

    } catch (error) {
      console.error("Quickhack Command Error:", error);
      api.sendMessage("❌ | Error in quickhack command. Please try again later.", event.threadID, event.messageID);
    }
  }
};
