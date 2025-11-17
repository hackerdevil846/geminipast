module.exports = {
  config: {
    name: "cheerio-shim",
    version: "1.0.0",
    author: "System",
    countDown: 0,
    role: 0,
    category: "system",
    shortDescription: {
      en: "Cheerio compatibility shim for yt-search"
    },
    longDescription: {
      en: "Creates shim for cheerio/lib/index.js to fix yt-search compatibility"
    },
    guide: {
      en: "This is an auto-run system module"
    }
  },

  onStart: function() {
    try {
      this.applyCheerioShim();
    } catch (error) {
      console.error('[cheerio-shim] onStart error:', error.message);
    }
  },

  applyCheerioShim: function() {
    try {
      const fs = require('fs');
      const path = require('path');

      // Resolve the cheerio package entry (throws if not installed)
      let cheerioResolved;
      try {
        cheerioResolved = require.resolve('cheerio');
        console.log('[cheerio-shim] Found cheerio at:', cheerioResolved);
      } catch (e) {
        // cheerio not installed — nothing to patch
        console.warn('[cheerio-shim] cheerio package not found. To enable full parsing install cheerio: npm install cheerio');
        return;
      }

      // Compute package dir and target shim path
      const cheerioDir = path.dirname(cheerioResolved); // e.g. node_modules/cheerio
      const libDir = path.join(cheerioDir, 'lib');     // node_modules/cheerio/lib
      const shimFile = path.join(libDir, 'index.js'); // node_modules/cheerio/lib/index.js

      console.log('[cheerio-shim] Target shim file:', shimFile);

      // If the shim already exists and looks like a shim we created, skip
      if (fs.existsSync(shimFile)) {
        try {
          const existing = fs.readFileSync(shimFile, 'utf8');
          if (existing && existing.includes('patched shim for')) {
            // previously created shim — nothing to do
            console.info('[cheerio-shim] shim already present; skipping.');
            return;
          }
          // If file exists but is not our shim, do not overwrite automatically.
          // To avoid unexpected overwrites, we will back it up and replace it.
          const backup = shimFile + '.backup-' + Date.now();
          fs.copyFileSync(shimFile, backup);
          console.info(`[cheerio-shim] existing file backed up to: ${backup}`);
        } catch (e) {
          console.warn('[cheerio-shim] Could not inspect or backup existing shim file:', e.message);
        }
      }

      // Ensure lib dir exists
      if (!fs.existsSync(libDir)) {
        try {
          fs.mkdirSync(libDir, { recursive: true });
          console.info('[cheerio-shim] created directory:', libDir);
        } catch (e) {
          console.error('[cheerio-shim] failed to create lib directory:', e.message);
          return;
        }
      }

      // Write shim content
      const shimContent = `// patched shim for yt-search / legacy require('cheerio/lib/index.js')
// This file was created automatically by scripts/cmds/cheerio-shim.js
// It re-exports the package root so legacy "cheerio/lib/index.js" requires work.
module.exports = require('../'); // patched shim for yt-search
`;

      try {
        fs.writeFileSync(shimFile, shimContent, { encoding: 'utf8', flag: 'w' });
        console.info('[cheerio-shim] shim written to:', shimFile);
      } catch (e) {
        console.error('[cheerio-shim] failed to write shim file:', e.message);
        return;
      }

      // Extra: also ensure a minimal package.json exists in the lib folder (not required, but helps some resolvers)
      try {
        const metaPath = path.join(libDir, 'package.json');
        if (!fs.existsSync(metaPath)) {
          const meta = {
            name: 'cheerio-lib-shim',
            version: '0.0.0',
            description: 'shim to satisfy legacy require("cheerio/lib/index.js")',
            main: 'index.js'
          };
          fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8');
          console.info('[cheerio-shim] wrote helper package.json to lib dir to help older resolvers.');
        }
      } catch (e) {
        // non-fatal
        console.warn('[cheerio-shim] Could not write package.json:', e.message);
      }

      console.info('[cheerio-shim] Cheerio compatibility shim installed successfully.');
      console.info('[cheerio-shim] If you still see errors, restart the bot process.');

    } catch (err) {
      // Never throw from this script; always log and continue
      console.error('[cheerio-shim] unexpected error:', err && (err.stack || err.message || err));
    }
  }
};
