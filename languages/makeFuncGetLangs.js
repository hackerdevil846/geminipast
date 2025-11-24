const fs = require("fs-extra");
const log = require("../logger/log.js");
const path = require("path");

function loadLanguageData(langCode) {
    let pathLanguageFile = path.join(__dirname, `${langCode}.lang`);
    
    if (!fs.existsSync(pathLanguageFile)) {
        // Fallback to English if specific lang doesn't exist
        // log.warn("LANGUAGE", `Language file ${langCode}.lang not found, using en.lang`);
        pathLanguageFile = path.join(__dirname, "en.lang");
    }

    try {
        if (!fs.existsSync(pathLanguageFile)) {
            log.err("LANGUAGE", "Critical Error: No language files found (en.lang missing)!");
            return {};
        }

        const readLanguage = fs.readFileSync(pathLanguageFile, "utf-8");
        const languageData = readLanguage
            .split(/\r?\n|\r/)
            .filter(line => line && !line.trim().startsWith("#") && !line.trim().startsWith("//") && line.trim() !== "");

        return convertLangObj(languageData);
    } catch (err) {
        log.err("LANGUAGE", "Error reading language file:", err);
        return {};
    }
}

function convertLangObj(languageData) {
    const obj = {};
    for (const sentence of languageData) {
        const getSeparator = sentence.indexOf('=');
        if (getSeparator === -1) continue; // Skip invalid lines

        const itemKey = sentence.slice(0, getSeparator).trim();
        const itemValue = sentence.slice(getSeparator + 1).trim();
        const head = itemKey.slice(0, itemKey.indexOf('.'));
        const key = itemKey.replace(head + '.', '');
        const value = itemValue.replace(/\\n/gi, '\n');

        if (!obj[head]) obj[head] = {};
        obj[head][key] = value;
    }
    return obj;
}

// Load default language initially
global.language = loadLanguageData(global.GoatBot.config.language || "en");

function getText(head, key, ...args) {
    let langObj;

    // Handle dynamic language loading request
    if (typeof head === "object" && head.lang) {
        langObj = loadLanguageData(head.lang);
        head = head.head; // Extract actual head key
    } else {
        langObj = global.language;
    }

    if (!langObj[head] || !langObj[head].hasOwnProperty(key)) {
        return `MISSING TEXT: "${head}.${key}"`;
    }

    let text = langObj[head][key];
    for (let i = args.length - 1; i >= 0; i--) {
        text = text.replace(new RegExp(`%${i + 1}`, 'g'), args[i]);
    }

    return text;
}

module.exports = getText;
