const fs = require('fs');
const path = require('path');
const axios = require('axios'); // kept in case other modules/logic expect it
const { Data } = require('./constant');
const { Party } = require('./enum');

/**
 * Try to use the installed 'deep-extend' if available; otherwise use
 * a compatible, dependency-free implementation below.
 *
 * The implementation below:
 * - behaves like deep-extend: merges source properties into target recursively
 * - mutates the first argument (so using deepExtend({}, a, b) returns merged result
 *   without mutating a or b)
 * - copies arrays by replacing the value with a shallow copy of source array
 * - merges plain objects recursively
 */
let deepExtend;
try {
  deepExtend = require('deep-extend');
} catch (e) {
  const isPlainObject = v => Object.prototype.toString.call(v) === '[object Object]';
  deepExtend = function deepExtend(target, ...sources) {
    if (target === undefined || target === null) target = {};
    for (const source of sources) {
      if (source === undefined || source === null) continue;
      // If source is not object/array, assign directly (overwrites target)
      if (!isPlainObject(source) && !Array.isArray(source)) {
        // For non-objects, just return source (but since API expects target mutated, set and continue)
        target = source;
        continue;
      }

      const keys = Object.keys(source);
      for (const key of keys) {
        const srcVal = source[key];
        const tgtVal = target[key];

        if (Array.isArray(srcVal)) {
          // replace with shallow copy of array
          target[key] = srcVal.slice();
        } else if (isPlainObject(srcVal)) {
          if (!isPlainObject(tgtVal)) target[key] = {};
          target[key] = deepExtend(target[key], srcVal);
        } else {
          // primitives, functions, buffers, etc. - assign
          target[key] = srcVal;
        }
      }
    }
    return target;
  };
}

/* ---------- utility functions ---------- */
const random = (start, end) => {
  start = Number(start) || 0;
  end = Number(end) || 0;
  if (end < start) [start, end] = [end, start];
  return Math.floor(Math.random() * (end - start + 1) + start);
};

/* ---------- load & merge config safely (uses deepExtend for compatibility) ---------- */
let exampleConfig = {};
try {
  exampleConfig = require('./gameConfig.example');
} catch (err) {
  // example config may be missing or invalid — log and continue with empty object
  console.error('Warning: could not require ./gameConfig.example; using empty exampleConfig. Error:', err && err.message);
}

let exampleConfigPath;
try {
  exampleConfigPath = require.resolve('./gameConfig.example');
} catch (err) {
  exampleConfigPath = path.join(__dirname, 'gameConfig.example.js');
}

const configPath = path.join(process.cwd(), 'werewolfConfig.js');
let gameConfig;

try {
  if (!fs.existsSync(configPath)) {
    // create default user config from example if possible
    if (fs.existsSync(exampleConfigPath)) {
      try {
        fs.copyFileSync(exampleConfigPath, configPath);
      } catch (copyErr) {
        // fallback: write minimal config
        try { fs.writeFileSync(configPath, 'module.exports = {};'); } catch (werr) {}
      }
    } else {
      try { fs.writeFileSync(configPath, 'module.exports = {};'); } catch (werr) {}
    }
  }

  // Load user config, ensuring fresh require
  try { delete require.cache[require.resolve(configPath)]; } catch (e) {}
  let userCfg = {};
  try {
    userCfg = require(configPath) || {};
  } catch (e) {
    console.error('Warning: could not require user config werewolfConfig.js; using empty config. Error:', e && e.message);
    userCfg = {};
  }

  // Merge: use deepExtend({}, exampleConfig, userCfg) so originals are not mutated
  gameConfig = deepExtend({}, exampleConfig || {}, userCfg || {});
} catch (err) {
  console.error('Failed to prepare gameConfig — falling back to exampleConfig or empty. Error:', err && err.message);
  gameConfig = exampleConfig || {};
}

/* ---------- symbols mapping ---------- */
const symbols = {
  0: '𝟬',
  1: '𝟭',
  2: '𝟮',
  3: '𝟯',
  4: '𝟰',
  5: '𝟱',
  6: '𝟲',
  7: '𝟳',
  8: '𝟴',
  9: '𝟵'
};

for (let i = 10; i <= 1000; i++) {
  let number = i;
  let out = '';
  while (number > 0) {
    const digit = number % 10;
    out = (symbols[digit] || String(digit)) + out;
    number = Math.floor(number / 10);
  }
  symbols[i] = out;
}

/* ---------- small helpers ---------- */
const randomItem = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  return arr[random(0, arr.length - 1)];
};

const dataSetup = (setup) => {
  const roles = [];
  if (!setup || typeof setup !== 'object' || !setup.roles || typeof setup.roles !== 'object') {
    return {
      name: setup && setup.name ? setup.name : 'unknown',
      roles,
      org: setup
    };
  }
  for (const roleKey of Object.keys(setup.roles)) {
    const count = Number(setup.roles[roleKey]) || 0;
    if (count > 0) roles.push(...new Array(count).fill(roleKey));
  }
  return {
    name: setup.name,
    roles,
    org: setup
  };
};

/* ---------- vietnamese role name mapping ---------- */
const vietMap = {
  villager: 'Dân làng',
  werewolf: 'Ma sói',
  mayor: 'Thị trưởng',
  diseased: 'Người bệnh',
  apprentice: 'Tiên tri tập sự',
  minion: 'Kẻ phản bội',
  bodyguard: 'Bảo vệ',
  cupid: 'Thần tình yêu',
  evilseer: 'Evilseer',
  fruitbrute: 'Sói ăn chay',
  goodseer: 'Tiên tri',
  hunter: 'Thợ săn',
  investigator: 'Thám tử',
  lycan: 'Người sói',
  oldman: 'Ông già',
  tanner: 'Chán đời',
  witch: 'Phù thủy',
  neutral: 'Trung lập',
  pacifist: 'Người hòa bình'
};

const vietsub = (role) => {
  if (!role) return '';
  const key = String(role).toLowerCase();
  const mapped = vietMap[key] || role;
  // Keep previous behaviour for ASCII: uppercase; otherwise return as-is
  if (/^[\x00-\x7F]*$/.test(String(mapped))) return String(mapped).toUpperCase();
  return mapped;
};

/* ---------- guide builder ---------- */
const guide = (role) => {
  try {
    const roleName = (role && role.constructor && role.constructor.name) ? role.constructor.name : String(role);
    const meta = Data && Data[roleName] ? Data[roleName] : {};
    const {
      party = null,
      description = 'Không có mô tả',
      advice = 'Không có lời khuyên',
      image = null
    } = meta;

    // Convert party enum value to name
    let partyName = 'UNKNOWN';
    if (typeof party !== 'undefined' && party !== null) {
      for (const pn in Party) {
        if (Party[pn] === party) {
          partyName = pn;
          break;
        }
      }
    }

    const body =
      `• BẠN LÀ ${vietsub(roleName)}!\n` +
      `• Phe: ${partyName} (vẫn có thể bị đổi)\n` +
      `• Mô tả: ${description}\n` +
      `• Lời khuyên: ${advice}`;

    // Prepare attachment stream if image path exists
    let attachment = null;
    if (image) {
      const candidates = [
        image,
        path.join(process.cwd(), image),
        path.join(__dirname, image)
      ];
      for (const p of candidates) {
        try {
          if (p && fs.existsSync(p) && fs.statSync(p).isFile()) {
            attachment = fs.createReadStream(p);
            break;
          }
        } catch (e) {
          // ignore and try next candidate
        }
      }
    }

    return { body, attachment };
  } catch (err) {
    console.error('Error building guide:', err && err.message);
    return { body: 'Không thể lấy thông tin vai trò.', attachment: null };
  }
};

/* ---------- exports ---------- */
module.exports = {
  gameConfig,
  symbols,
  randomItem,
  dataSetup,
  guide,
  vietsub
};
