/**
 * @author NTKhang
 * ! The source code is written by NTKhang, please don't change the author's name everywhere. Thank you for using
 * ! Official source code: https://github.com/ntkhang03/Goat-Bot-V2
 */

const { spawn } = require("child_process");
const log = require("./logger/log.js");

function startProject() {
	const child = spawn("node", ["Asif.js"], {
		cwd: __dirname,
		stdio: "inherit",
		shell: true
	});

	child.on("close", (code) => {
		if (code === 2) {
            // Restart triggered by bot logic (e.g., login failure or update)
			log.info("RESTART", "Restarting Project...");
			startProject();
		} else if (code !== 0) {
            // Crash detected
            log.error("CRASH", `Child process exited with code ${code}. Restarting in 5 seconds...`);
            setTimeout(() => startProject(), 5000);
        }
	});
    
    child.on("error", (err) => {
        log.error("SYSTEM", "Failed to start child process.", err);
    });
}

startProject();
