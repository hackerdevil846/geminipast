const express = require("express");
const router = express.Router();

module.exports = function ({ isAuthenticated, isVeryfiUserIDFacebook, checkHasAndInThread, threadsData, checkAuthConfigDashboardOfThread, imageExt, videoExt, audioExt, convertSize, drive, isVideoFile }) {
    router
        .get("/", [isAuthenticated, isVeryfiUserIDFacebook], async (req, res) => {
            let allThread = await threadsData.getAll();
            // Added safe check for t.members existence
            allThread = allThread.filter(t => t.members && t.members.some(m => m.userID == req.user.facebookUserID && m.inGroup));
            res.render("dashboard", { threads: allThread });
        })
        .get("/:threadID", [isAuthenticated, isVeryfiUserIDFacebook, checkHasAndInThread], async (req, res) => {
            const { threadData } = req;
            let authConfigDashboard = true;
            const warnings = [];
            if (!await checkAuthConfigDashboardOfThread(threadData, req.user.facebookUserID)) {
                warnings.push({ msg: "[!] Chỉ quản trị viên của nhóm chat hoặc những thành viên được cho phép mới có thể chỉnh sửa dashboard" });
                authConfigDashboard = false;
            }
            // Safely delete if it exists to avoid errors, though req is fresh per request
            if(req.threadData) delete req.threadData;
            
            res.render("dashboard-thread", {
                threadData,
                threadDataJSON: encodeURIComponent(JSON.stringify(threadData)),
                authConfigDashboard,
                warnings
            });
        })
        .get("/:threadID/:command", [isAuthenticated, isVeryfiUserIDFacebook, checkHasAndInThread], async (req, res) => {
            const command = req.params.command;
            const threadData = req.threadData;
            const threadDataJSON = encodeURIComponent(JSON.stringify(threadData));
            const variables = {
                threadID: req.params.threadID,
                threadData,
                threadDataJSON,
                command,
                imageExt,
                videoExt,
                audioExt,
                convertSize,
                isVideoFile
            };
            let renderFile;

            // Helper to safely fetch drive files
            const fetchDriveFiles = async (fileIds) => {
                if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) return [];
                if (!drive || !drive.default) return []; // Safety check if drive is broken

                let pending = [];
                fileIds.forEach(fileId => {
                    pending.push(drive.default.files.get({
                        fileId,
                        fields: "name,mimeType,size,id,createdTime,webContentLink,fileExtension"
                    }).catch(e => null)); // Catch individual errors
                });

                return (await Promise.allSettled(pending))
                    .filter(item => item.status == "fulfilled" && item.value && item.value.data)
                    .map(({ value }) => {
                        return {
                            ...value.data,
                            urlDownload: value.data.webContentLink
                        };
                    });
            };

            switch (command) {
                case "welcome": {
                    renderFile = "dashboard-welcome";
                    variables.welcomeAttachments = await fetchDriveFiles(threadData.data.welcomeAttachment);
                    variables.defaultWelcomeMessage = global.GoatBot.configCommands.envEvents.welcome.defaultWelcomeMessage;
                    break;
                }
                case "leave": {
                    renderFile = "dashboard-leave";
                    variables.leaveAttachments = await fetchDriveFiles(threadData.data.leaveAttachment);
                    variables.defaultLeaveMessage = global.GoatBot.configCommands.envEvents.leave.defaultLeaveMessage;
                    break;
                }
                case "rankup": {
                    renderFile = "dashboard-rankup";
                    break;
                }
                case "custom-cmd": {
                    renderFile = "dashboard-custom-cmd";
                    break;
                }
                default: {
                    req.flash("errors", { msg: "Command not found" });
                    return res.redirect("/dashboard");
                }
            }

            res.render(renderFile, variables);
        });

    return router;
};
