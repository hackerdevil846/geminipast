/**
 * @author NTKhang
 * ! The source code is written by NTKhang, please don't change the author's name everywhere. Thank you for using
 * ! Official source code: https://github.com/ntkhang03/Goat-Bot-V2
 */

const { spawn } = require("child_process");
const http = require("http");
const log = require("./logger/log.js");

// ————————————————————————————————————————————————————————— //
// 🟢 RENDER DEPLOYMENT FIX (MANDATORY)
// This fake server listens on the port Render provides.
// It prevents the "Port scan timeout" error.
// ————————————————————————————————————————————————————————— //
const PORT = process.env.PORT || 8080;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Goat Bot V2 is running active on Render!');
});

server.listen(PORT, () => {
    log.master("SYSTEM", `Render Health Check Server is listening on Port ${PORT}`);
});

// ————————————————————————————————————————————————————————— //
// 🟢 BOT PROCESS MANAGER
// ————————————————————————————————————————————————————————— //
function startProject() {
    // We clone the current environment variables
    const childEnv = { ...process.env };

    // ⚠️ CRITICAL FIX: 
    // We DELETE the 'PORT' variable for the child process.
    // This ensures the Dashboard inside Asif.js uses the port from config.json (e.g. 9999)
    // instead of trying to steal Render's port (which would cause a crash).
    delete childEnv.PORT;

    const child = spawn("node", ["Asif.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true,
        env: childEnv // Pass the modified environment
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
