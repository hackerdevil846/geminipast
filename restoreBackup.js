const fs = require("fs-extra");
const readline = require("readline");
const log = require('./logger/log.js');
const path = require("path");

let versionBackup;
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// FILES TO PROTECT (Do not overwrite these during restore)
const PROTECTED_FILES = [
	"index.js",
	"utils.js",
	"updater.js",
	"update.js",
	"bot/login/login.js",
	"bot/login/loadData.js",
	"bot/login/checkLiveCookie.js",
	"bot/handler/handlerEvents.js",
	"bot/handler/handlerAction.js",
	"fb-chat-api/index.js",
	"fb-chat-api/src/listenMqtt.js",
	"package.json"
];

function isProtected(filePath) {
    // Normalize path for cross-platform check
    const normalized = filePath.replace(/\\/g, '/');
    return PROTECTED_FILES.some(protectedFile => normalized.includes(protectedFile));
}

function recursiveReadDirAndBackup(pathFileOrFolder) {
	const pathFileOrFolderBackup = `${process.cwd()}/backups/${versionBackup}/${pathFileOrFolder}`;
	const pathFileOrFolderRestore = `${process.cwd()}/${pathFileOrFolder}`;

	if (!fs.existsSync(pathFileOrFolderBackup)) return; // Skip if doesn't exist

	if (fs.lstatSync(pathFileOrFolderBackup).isDirectory()) {
		if (!fs.existsSync(pathFileOrFolderRestore))
			fs.mkdirSync(pathFileOrFolderRestore, { recursive: true });
		
		const readDir = fs.readdirSync(pathFileOrFolderBackup);
		readDir.forEach(fileOrFolder => {
			recursiveReadDirAndBackup(`${pathFileOrFolder}/${fileOrFolder}`);
		});
	}
	else {
        // SAFETY CHECK: Skip protected files
        if (isProtected(pathFileOrFolder)) {
            log.warn("RESTORE", `Skipped restoring protected file: ${pathFileOrFolder} (to keep Super Modified features safe)`);
            return;
        }

		try {
			fs.copyFileSync(pathFileOrFolderBackup, pathFileOrFolderRestore);
            // log.info("RESTORE", `Restored: ${pathFileOrFolder}`);
		} catch (err) {
			log.err("RESTORE", `Failed to restore ${pathFileOrFolder}: ${err.message}`);
		}
	}
}

(async () => {
	if (process.argv.length < 3) {
		versionBackup = await new Promise((resolve) => {
			rl.question("Input version backup (e.g. 1.5.30): ", answer => {
				resolve(answer);
			});
		});
	}
	else {
		versionBackup = process.argv[2];
	}

	if (!versionBackup) {
		log.err("ERROR", `Please input version backup`);
		process.exit();
	}

	versionBackup = versionBackup.replace("backup_", ""); 
	versionBackup = `backup_${versionBackup}`;

	const backupFolder = `${process.cwd()}/backups/${versionBackup}`;
	if (!fs.existsSync(backupFolder)) {
		log.err("ERROR", `Backup folder does not exist (${backupFolder})`);
		process.exit();
	}

	console.log("===================================================");
	log.info("RESTORE", `Restoring backup: ${versionBackup}`);
	log.warn("RESTORE", "Core system files will be SKIPPED to protect 'Super Modified' version.");
	console.log("===================================================");

	const files = fs.readdirSync(backupFolder);
	for (const file of files)
		recursiveReadDirAndBackup(file);

    // Handle package.json carefully (Merge dependencies instead of overwrite if needed)
    // For now, we skip it via PROTECTED_FILES to avoid losing 'playwright'

	log.info("RESTORE", `Successfully restored backup ${versionBackup} (Safe Mode)`);
	process.exit(0);
})();
