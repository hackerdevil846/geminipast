/**
 * videomix.js
 * Sends a random video from a user-specified category.
 * Hybrid, production-ready, preserves all provided links as-is.
 */

const axios = (() => { try { return require("axios"); } catch (e) { return null; } })();
const fs = (() => { try { return require("fs-extra"); } catch (e) { return null; } })();
const path = require("path");

const VIDEOS = {
  "funny": [
    "https://i.imgur.com/evswpXP.mp4",
    "https://i.imgur.com/CbwvstK.mp4",
    "https://i.imgur.com/19j5Vhh.mp4",
    "https://i.imgur.com/VYRYUNJ.mp4",
    "https://i.imgur.com/w2DN7Vr.mp4",
    "https://i.imgur.com/CiAuZc7.mp4",
    "https://i.imgur.com/JK5LZnq.mp4",
    "https://i.imgur.com/cH5mhfJ.mp4",
    "https://i.imgur.com/WmDqN6m.mp4",
    "https://i.imgur.com/e2OjqeQ.mp4",
    "https://i.imgur.com/FmOKl2S.mp4",
    "https://i.imgur.com/vrQpE9G.mp4",
    "https://i.imgur.com/H8fHZdu.mp4",
    "https://i.imgur.com/G5i0xcY.mp4",
    "https://i.imgur.com/lqPyKgZ.mp4",
    "https://i.imgur.com/sUJFShv.mp4",
    "https://i.imgur.com/WzXz13s.mp4"
  ],
  "islamic": [
    "https://i.imgur.com/3EXzdzu.mp4",
    "https://i.imgur.com/elsJxEk.mp4",
    "https://i.imgur.com/htitv6P.mp4",
    "https://i.imgur.com/iD8lpOs.mp4",
    "https://i.imgur.com/PjTN0I5.mp4",
    "https://i.imgur.com/hzFQ4Xu.mp4",
    "https://i.imgur.com/8WojIf7.mp4",
    "https://i.imgur.com/guefl5P.mp4",
    "https://i.imgur.com/7zFKSsJ.mp4",
    "https://i.imgur.com/5Vys7Eb.mp4",
    "https://i.imgur.com/B6fu243.mp4",
    "https://i.imgur.com/53dHYJM.mp4",
    "https://i.imgur.com/pCWDq0c.mp4",
    "https://i.imgur.com/bytY1SY.mp4",
    "https://i.imgur.com/oWZkJ7b.mp4",
    "https://i.imgur.com/P8aujG8.mp4",
    "https://i.imgur.com/g0Fj7Ch.mp4",
    "https://i.imgur.com/nE1Z3kz.mp4",
    "https://i.imgur.com/AxnZq05.mp4",
    "https://i.imgur.com/sXYLgUB.mp4",
    "https://i.imgur.com/JjFKInj.mp4",
    "https://i.imgur.com/2OqRU40.mp4",
    "https://i.imgur.com/uRQGaK6.mp4",
    "https://i.imgur.com/3Hp0Oxy.mp4",
    "https://i.imgur.com/0Sqtett.mp4",
    "https://i.imgur.com/uZI7DXV.mp4",
    "https://i.imgur.com/soL5Jxy.mp4",
    "https://i.imgur.com/Rr2tG0T.mp4",
    "https://i.imgur.com/cNJ5j47.mp4",
    "https://i.imgur.com/OVwJaDx.mp4",
    "https://i.imgur.com/EXGhWrC.mp4",
    "https://i.imgur.com/2JvDA4e.mp4",
    "https://i.imgur.com/ZWVwq1l.mp4",
    "https://i.imgur.com/FpuexGp.mp4",
    "https://i.imgur.com/Ew7CvTt.mp4",
    "https://i.imgur.com/V0OqX8g.mp4",
    "https://i.imgur.com/JmUDnqb.mp4",
    "https://i.imgur.com/FUnr5qQ.mp4",
    "https://i.imgur.com/AQwbIOr.mp4",
    "https://i.imgur.com/Tmt0IGj.mp4",
    "https://i.imgur.com/v0I3a1W.mp4",
    "https://i.imgur.com/Ai6RzC5.mp4",
    "https://i.imgur.com/cLbms2h.mp4",
    "https://i.imgur.com/WVitFo7.mp4",
    "https://i.imgur.com/tl5pUKV.mp4",
    "https://i.imgur.com/MqwgGtt.mp4",
    "https://i.imgur.com/xeZsWGT.mp4",
    "https://i.imgur.com/ggaGB0v.mp4",
    "https://i.imgur.com/qTSRbNF.mp4",
    "https://i.imgur.com/d8GRdba.mp4",
    "https://i.imgur.com/6J5V9qA.mp4",
    "https://i.imgur.com/W2tlljJ.mp4",
    "https://i.imgur.com/Bma5E6H.mp4",
    "https://i.imgur.com/zJO00lU.mp4",
    "https://i.imgur.com/iK7HgGJ.mp4",
    "https://i.imgur.com/AGgrxCv.mp4",
    "https://i.imgur.com/fxYQOh3.mp4",
    "https://i.imgur.com/lMtE97b.mp4",
    "https://i.imgur.com/W7Sl7Lg.mp4",
    "https://i.imgur.com/wVkIgip.mp4",
    "https://i.imgur.com/rKPBWbh.mp4",
    "https://i.imgur.com/JaZUUm9.mp4",
    "https://i.imgur.com/IlxXBo3.mp4",
    "https://i.imgur.com/ho6L4po.mp4",
    "https://i.imgur.com/AxqytnF.mp4"
  ],
  "sad": [
    "https://i.imgur.com/gxEZBV3.mp4",
    "https://i.imgur.com/922SK6n.mp4",
    "https://i.imgur.com/hup72M7.mp4",
    "https://i.imgur.com/i4LFfcu.mp4",
    "https://i.imgur.com/GcvzaXx.mp4",
    "https://i.imgur.com/Oi0Pvuu.mp4",
    "https://i.imgur.com/vqD0c2q.mp4",
    "https://i.imgur.com/7ORsoKf.mp4",
    "https://i.imgur.com/qYQEAIB.mp4",
    "https://i.imgur.com/BOmHsyH.mp4",
    "https://i.imgur.com/ppN0ZyP.mp4",
    "https://i.imgur.com/UcjQY4L.mp4",
    "https://i.imgur.com/HPAGz1p.mp4",
    "https://i.imgur.com/1PViCD0.mp4",
    "https://i.imgur.com/qbNAfXm.mp4",
    "https://i.imgur.com/YcA3vSG.mp4",
    "https://i.imgur.com/s8Phnz8.mp4",
    "https://i.imgur.com/M8FtvL4.mp4",
    "https://i.imgur.com/dnH1hkP.mp4",
    "https://i.imgur.com/LhnNOpd.mp4",
    "https://i.imgur.com/X5EbxXx.mp4",
    "https://i.imgur.com/wfoKOGm.mp4",
    "https://i.imgur.com/KsN9rjh.mp4",
    "https://i.imgur.com/ixARUtV.mp4",
    "https://i.imgur.com/ICMr18L.mp4",
    "https://i.imgur.com/MhhgRNT.mp4",
    "https://i.imgur.com/zXfgXcW.mp4",
    "https://i.imgur.com/inFjSXQ.mp4",
    "https://i.imgur.com/ixarKZq.mp4",
    "https://i.imgur.com/Udc9BxT.mp4",
    "https://i.imgur.com/IRATz3B.mp4",
    "https://i.imgur.com/KNgLMEf.mp4",
    "https://i.imgur.com/mzgDu8F.mp4",
    "https://i.imgur.com/gind8qB.mp4",
    "https://i.imgur.com/tEUE391.mp4",
    "https://i.imgur.com/XnPZJKo.mp4",
    "https://i.imgur.com/e3eqdmI.mp4",
    "https://i.imgur.com/SaFLAzV.mp4",
    "https://i.imgur.com/Sj5rRTY.mp4",
    "https://i.imgur.com/y0MCCn1.mp4",
    "https://i.imgur.com/diuVaqL.mp4",
    "https://i.imgur.com/oYOCqyU.mp4",
    "https://i.imgur.com/0ztfMSa.mp4",
    "https://i.imgur.com/wF5QPb6.mp4",
    "https://i.imgur.com/PymRza6.mp4",
    "https://i.imgur.com/wFdCSib.mp4",
    "https://i.imgur.com/JCH1Agc.mp4",
    "https://i.imgur.com/AEhvxyV.mp4",
    "https://i.imgur.com/E0tWA3v.mp4",
    "https://i.imgur.com/7a8UUkO.mp4",
    "https://i.imgur.com/4mFVYK8.mp4",
    "https://i.imgur.com/nN6Ifhw.mp4",
    "https://i.imgur.com/DgqSVjy.mp4",
    "https://i.imgur.com/HgiaYjr.mp4"
  ],
  "anime": [
    "https://drive.google.com/uc?export=download&id=1cyB6E3z4-_Dr4mlYFB87DlWkUlC_KvrR",
    "https://drive.google.com/uc?export=download&id=1Q5L8SGKYpNrXtJ6mffcwMA9bcUtegtga",
    "https://drive.google.com/uc?export=download&id=1u8JzKCTubRhnh0APo2mMob-mQM0CoNYj",
    "https://drive.google.com/uc?export=download&id=1JBIo966g0MmUT27S1yc0B06lASt4dD9V",
    "https://drive.google.com/uc?export=download&id=1w_HUyAFHnVfkUl8XLY01pxs8dnmQNEVn",
    "https://drive.google.com/uc?export=download&id=1EoeMITZrSNB1PpPjsh5cmsFzbjMZKH2c",
    "https://drive.google.com/uc?export=download&id=1Kh4qvle57FlMjcam-JNxTQtPZe2uxrJ8",
    "https://drive.google.com/uc?export=download&id=1KtyLzqbyJpq5_ke0Cb6gD89ZNf0NQm0t",
    "https://drive.google.com/uc?export=download&id=1vy0ZldnlTqXgwJ36HxOXC9hLObgNkTZ-",
    "https://i.imgur.com/QlnhAph.mp4",
    "https://i.imgur.com/kOzX5YP.mp4",
    "https://i.imgur.com/9A2uka3.mp4",
    "https://i.imgur.com/wFQfVfE.mp4",
    "https://i.imgur.com/CSdSAi7.mp4",
    "https://i.imgur.com/oOD0jJW.mp4",
    "https://i.imgur.com/s7l7Sjm.mp4",
    "https://i.imgur.com/YGfF4tz.mp4",
    "https://i.imgur.com/F5UzBPK.mp4",
    "https://i.imgur.com/AQj1Rhz.mp4",
    "https://i.imgur.com/1hYLk2n.mp4",
    "https://i.imgur.com/gksDFfF.mp4",
    "https://i.imgur.com/8atPovs.mp4",
    "https://i.imgur.com/8BbEtUG.mp4",
    "https://i.imgur.com/ZYNE9XV.mp4",
    "https://i.imgur.com/1MmiyS2.mp4",
    "https://i.imgur.com/j6UUgCC.mp4",
    "https://i.imgur.com/eaIeQI3.mp4",
    "https://i.imgur.com/yTLLAB9.mp4",
    "https://i.imgur.com/8OlhZRR.mp4",
    "https://i.imgur.com/THk7qF4.mp4",
    "https://i.imgur.com/ahvJHns.mp4",
    "https://i.imgur.com/uf4EBBk.mp4",
    "https://i.imgur.com/eTOLz0x.mp4"
  ],
  "baby": [
    "https://i.imgur.com/na2yELI.mp4",
    "https://i.imgur.com/WETgR7Y.mp4",
    "https://i.imgur.com/QM6cI1y.mp4",
    "https://i.imgur.com/FhlYV3Y.mp4",
    "https://i.imgur.com/dNldyDZ.mp4",
    "https://i.imgur.com/ptHuH2w.mp4",
    "https://i.imgur.com/2H8Fmkk.mp4",
    "https://i.imgur.com/R42nQEq.mp4",
    "https://i.imgur.com/JMkoAyA.mp4",
    "https://i.imgur.com/Hl1vq4D.mp4",
    "https://i.imgur.com/Flm78Ph.mp4",
    "https://i.imgur.com/PDnHuWv.mp4",
    "https://i.imgur.com/eiXiggG.mp4",
    "https://i.imgur.com/YxCt3gc.mp4",
    "https://i.imgur.com/3CXsP6i.mp4"
  ],
  "lofi": [
    "https://i.imgur.com/g6cdosz.mp4",
    "https://i.imgur.com/4gY1bWL.mp4",
    "https://i.imgur.com/Y2AnTbO.mp4",
    "https://i.imgur.com/slARoKZ.mp4",
    "https://i.imgur.com/HU45akB.mp4"
  ],
  "horny": [
    "https://example.com/horny_video1.mp4",
    "https://example.com/horny_video2.mp4"
  ],
  "couple": [
    "https://i.imgur.com/G26ADLB.mp4",
    "https://i.imgur.com/SjmVLRO.mp4",
    "https://i.imgur.com/TmtN3Qp.mp4",
    "https://i.imgur.com/9NPlChB.mp4",
    "https://i.imgur.com/dUkVc3m.mp4",
    "https://i.imgur.com/86iAcN5.mp4",
    "https://i.imgur.com/dCg9bGH.mp4",
    "https://i.imgur.com/pzQcUGE.mp4",
    "https://i.imgur.com/FMMxX7Y.mp4",
    "https://i.imgur.com/p8cZKZo.mp4",
    "https://i.imgur.com/4hmvU0G.mp4",
    "https://i.imgur.com/mYd02mH.mp4",
    "https://i.imgur.com/M3u1x25.mp4",
    "https://i.imgur.com/8oX8Cl0.mp4",
    "https://i.imgur.com/U5wsgmz.mp4",
    "https://i.imgur.com/vm6TUHz.mp4",
    "https://i.imgur.com/i2B7yy6.mp4",
    "https://i.imgur.com/KSIOtqC.mp4",
    "https://i.imgur.com/yCIDZqP.mp4",
    "https://i.imgur.com/nQTe46T.mp4",
    "https://i.imgur.com/Y3AB4Hx.mp4",
    "https://i.imgur.com/556UzNL.mp4",
    "https://i.imgur.com/CwBE5tk.mp4",
    "https://i.imgur.com/dbWBQ5W.mp4",
    "https://i.imgur.com/jUlfoTR.mp4",
    "https://i.imgur.com/8zpVqJK.mp4",
    "https://i.imgur.com/eh9I6Rm.mp4",
    "https://i.imgur.com/VGs9xZQ.mp4",
    "https://i.imgur.com/SRmWhsV.mp4",
    "https://i.imgur.com/w7E3FpU.mp4",
    "https://i.imgur.com/LL8zj0j.mp4",
    "https://i.imgur.com/w2SfYTp.mp4",
    "https://i.imgur.com/vZeeWLo.mp4",
    "https://i.imgur.com/vNgefkB.mp4",
    "https://i.imgur.com/bXjpWsJ.mp4",
    "https://i.imgur.com/tA2P7q2.mp4",
    "https://i.imgur.com/LzXzTw9.mp4",
    "https://i.imgur.com/ENRgE4x.mp4",
    "https://i.imgur.com/CGCYDDq.mp4"
  ],
  "flower": [
    "https://i.imgur.com/ybgGM3H.mp4",
    "https://i.imgur.com/UzVZZYA.mp4",
    "https://i.imgur.com/xpMBP9D.mp4",
    "https://i.imgur.com/qgH02qV.mp4",
    "https://i.imgur.com/ObG99sv.mp4",
    "https://i.imgur.com/YGuBg4V.mp4",
    "https://i.imgur.com/hgtbcSK.mp4",
    "https://i.imgur.com/60qVh21.mp4",
    "https://i.imgur.com/Gtd9NRW.mp4",
    "https://i.imgur.com/l0lI4ZX.mp4",
    "https://i.imgur.com/6FmM2GS.mp4",
    "https://i.imgur.com/PXsaXdM.mp4",
    "https://i.imgur.com/3ENVWpm.mp4",
    "https://i.imgur.com/jPItNKc.mp4",
    "https://i.imgur.com/BjzJHtx.mp4",
    "https://i.imgur.com/AZ01ayL.mp4"
  ],
  "aesthetic": [
    "https://example.com/aesthetic_video1.mp4",
    "https://example.com/aesthetic_video2.mp4"
  ],
  "sigma": [
    "https://i.imgur.com/BjXVxIq.mp4",
    "https://i.imgur.com/M8xZu60.mp4",
    "https://i.imgur.com/9xs5xTp.mp4",
    "https://i.imgur.com/vFwtz7I.mp4",
    "https://i.imgur.com/WYmUOzm.mp4"
  ],
  "lyrics": [
    "https://i.imgur.com/Zdyxg7P.mp4",
    "https://i.imgur.com/AW7paTb.mp4",
    "https://i.imgur.com/4FGHD8d.mp4",
    "https://i.imgur.com/XmpNpYt.mp4",
    "https://i.imgur.com/sZ01LgJ.mp4",
    "https://i.imgur.com/0RVvTAN.mp4",
    "https://i.imgur.com/P0IUmiG.mp4",
    "https://i.imgur.com/12hQnsb.mp4",
    "https://i.imgur.com/IEDHf4P.mp4",
    "https://i.imgur.com/sMbBFWm.mp4",
    "https://i.imgur.com/wP5sOJW.mp4",
    "https://i.imgur.com/zg60azD.mp4",
    "https://i.imgur.com/zsKTADg.mp4",
    "https://i.imgur.com/NjJK9Np.mp4",
    "https://i.imgur.com/0ueXnpB.mp4"
  ],
  "cat": [
    "https://i.imgur.com/LzXzTw9.mp4",
    "https://i.imgur.com/s4Tfoql.mp4",
    "https://i.imgur.com/k3971qb.mp4",
    "https://i.imgur.com/ZsnYmvb.mp4",
    "https://i.imgur.com/BjXVxIq.mp4",
    "https://i.imgur.com/DkjMVwX.mp4",
    "https://i.imgur.com/bZXTYTO.mp4",
    "https://i.imgur.com/D7443So.mp4",
    "https://i.imgur.com/ekfNkRo.mp4"
  ],
  "18+": [
    "https://i.imgur.com/JB4v2pu.mp4",
    "https://i.imgur.com/TF6Fwc9.mp4"
  ],
  "freefire": [
    "https://i.imgur.com/sL6iIV5.mp4",
    "https://i.imgur.com/kS7SDdc.mp4",
    "https://i.imgur.com/x4Ia9wi.mp4",
    "https://i.imgur.com/aYUXixH.mp4",
    "https://i.imgur.com/l3zk86E.mp4",
    "https://i.imgur.com/gFYpBSn.mp4",
    "https://i.imgur.com/QZZPkeY.mp4",
    "https://i.imgur.com/LRSfvqD.mp4",
    "https://i.imgur.com/Cm3188l.mp4",
    "https://i.imgur.com/QG8DEb8.mp4",
    "https://i.imgur.com/2nhUpjN.mp4",
    "https://i.imgur.com/xWbQls8.mp4",
    "https://i.imgur.com/ZJGJdcL.mp4",
    "https://i.imgur.com/fC8gjAD.mp4",
    "https://i.imgur.com/lXZjWd6.mp4",
    "https://i.imgur.com/1C3fQK1.mp4",
    "https://i.imgur.com/pcc3RL6.mp4",
    "https://i.imgur.com/9VK833x.mp4",
    "https://i.imgur.com/SPSCsoL.mp4",
    "https://i.imgur.com/4BpgEos.mp4",
    "https://i.imgur.com/EYXZR79.mp4",
    "https://i.imgur.com/NeYjAKg.mp4",
    "https://i.imgur.com/Rsktftp.mp4",
    "https://i.imgur.com/6nxJFwB.mp4",
    "https://i.imgur.com/WSM5MCj.mp4",
    "https://i.imgur.com/wWMxgrZ.mp4",
    "https://i.imgur.com/nSnBW3z.mp4",
    "https://i.imgur.com/xTaC2Bi.mp4",
    "https://i.imgur.com/3AKyhW5.mp4",
    "https://i.imgur.com/rYol0jl.mp4",
    "https://i.imgur.com/dDfghV8.mp4",
    "https://i.imgur.com/sOcNMuK.mp4",
    "https://i.imgur.com/iAe53o4.mp4",
    "https://i.imgur.com/cnNos7d.mp4",
    "https://i.imgur.com/HmEjrKT.mp4",
    "https://i.imgur.com/jiGqDvh.mp4",
    "https://i.imgur.com/VTcH66o.mp4",
    "https://i.imgur.com/B4kbNF7.mp4"
  ],
  "football": [
    "https://i.imgur.com/URn99v1.mp4",
    "https://i.imgur.com/J6qrjqP.mp4",
    "https://i.imgur.com/AEbXAJU.mp4",
    "https://i.imgur.com/XanuIJH.mp4",
    "https://i.imgur.com/KAiOpqY.mp4",
    "https://i.imgur.com/ar58O9i.mp4",
    "https://vt.tiktok.com/ZSMJXU8EC/"
  ],
  "girl": [
    "https://i.imgur.com/o1PTdGV.mp4",
    "https://i.imgur.com/RKJwOpe.mp4",
    "https://i.imgur.com/yCSj2Kh.mp4",
    "https://i.imgur.com/nyzI1cK.mp4",
    "https://i.imgur.com/CbgckN1.mp4",
    "https://i.imgur.com/cDpqOCp.mp4",
    "https://i.imgur.com/TXUD5TM.mp4",
    "https://i.imgur.com/D6PyM90.mp4",
    "https://i.imgur.com/pLvL9dP.mp4",
    "https://i.imgur.com/RvLOsJZ.mp4",
    "https://i.imgur.com/kM5wgxs.mp4",
    "https://i.imgur.com/lRrlGWI.mp4",
    "https://i.imgur.com/mNFOR07.mp4",
    "https://i.imgur.com/tQjXy3a.mp4",
    "https://i.imgur.com/AezYExh.mp4",
    "https://i.imgur.com/N6kihzz.mp4",
    "https://i.imgur.com/fkRizD5.mp4",
    "https://i.imgur.com/IPOLLbu.mp4"
  ],
  "friends": [
    "https://example.com/friends_video1.mp4",
    "https://example.com/friends_video2.mp4"
  ]
};

const CACHE_DIR = path.join(__dirname, "cache", "videomix");
const MIN_FILE_BYTES = 100 * 1024; // 100KB minimum for videos
const DOWNLOAD_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

// helpers
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function pickRandom(list) {
  if (!Array.isArray(list) || list.length === 0) return null;
  const filtered = list.filter(url => url && typeof url === 'string' && url.startsWith('http'));
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function cacheFilenameFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const extension = pathname.includes('.') ? pathname.split('.').pop() : 'mp4';
    const safeName = Buffer.from(url).toString('base64').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 100);
    return `${safeName}.${extension}`;
  } catch (e) {
    const safeName = url.replace(/[^a-zA-Z0-9]/gi, '_').slice(0, 100);
    return `${safeName}.mp4`;
  }
}

async function downloadToCache(url, destPath) {
  if (!axios) throw new Error("Missing dependency: axios");
  if (!fs) throw new Error("Missing dependency: fs-extra");

  await fs.ensureDir(path.dirname(destPath));
  
  for (let attempt = 1; attempt <= DOWNLOAD_RETRIES; attempt++) {
    let tmpPath = destPath + '.tmp';
    
    try {
      if (attempt > 1) {
        await sleep(RETRY_DELAY_MS);
      }

      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const writer = fs.createWriteStream(tmpPath);

      await new Promise((resolve, reject) => {
        let error = null;
        
        response.data.pipe(writer);
        
        writer.on('error', (err) => {
          error = err;
          writer.close();
          reject(err);
        });
        
        writer.on('finish', () => {
          if (!error) resolve();
        });
        
        response.data.on('error', (err) => {
          error = err;
          writer.close();
          reject(err);
        });
      });

      // Verify file size
      const stats = await fs.stat(tmpPath);
      if (stats.size < MIN_FILE_BYTES) {
        await fs.remove(tmpPath);
        throw new Error(`Downloaded file too small: ${stats.size} bytes`);
      }

      // Move temp file to final location
      await fs.move(tmpPath, destPath, { overwrite: true });
      return destPath;

    } catch (err) {
      // Clean up temp file on error
      try {
        if (await fs.pathExists(tmpPath)) {
          await fs.remove(tmpPath);
        }
      } catch (cleanupError) {}
      
      if (attempt === DOWNLOAD_RETRIES) {
        throw new Error(`Failed to download after ${DOWNLOAD_RETRIES} attempts: ${err.message}`);
      }
    }
  }
}

// Ensure global reply map exists
if (!global.GoatBot) global.GoatBot = {};
if (!global.GoatBot.onReply) global.GoatBot.onReply = new Map();

module.exports = {
  config: {
    name: "videomix",
    version: "2.0.0",
    author: "Asif",
    role: 0,
    category: "media",
    shortDescription: { en: "Send random videos from categories" },
    longDescription: { en: "Usage: videomix <category> OR just videomix to choose interactively / random." },
    guide: { en: "{p}videomix <category>\nAvailable categories: " + Object.keys(VIDEOS).join(", ") },
    countDown: 5,
    dependencies: { "axios": "", "fs-extra": "" }
  },

  onStart: async function({ api, event, args, message }) {
    try {
      // Check dependencies
      if (!axios || !fs) {
        return message.reply("❌ Command unavailable: missing dependencies (axios or fs-extra).");
      }

      // Ensure cache directory exists
      try {
        await fs.ensureDir(CACHE_DIR);
      } catch (dirError) {
        console.error("Failed to create cache directory:", dirError);
        return message.reply("❌ Failed to setup cache directory.");
      }

      const threadID = event.threadID;
      const userID = event.senderID;
      const providedCategory = (args[0] || "").toLowerCase().trim();

      // If no category provided, show interactive menu
      if (!providedCategory) {
        const categories = Object.keys(VIDEOS);
        const categoryList = categories.map((cat, index) => `${index + 1}. ${cat}`).join('\n');
        
        const promptMessage = await message.reply(
          `🎬 **VideoMix Categories**\n\n${categoryList}\n\n` +
          `Reply with the category name or number to get a video.`
        );

        // Store reply information
        global.GoatBot.onReply.set(promptMessage.messageID, {
          commandName: "videomix",
          author: userID,
          messageID: promptMessage.messageID,
          categories: VIDEOS
        });

        return;
      }

      // Process provided category
      await processVideoCategory(api, message, threadID, providedCategory);

    } catch (error) {
      console.error("videomix onStart error:", error);
      message.reply("❌ An error occurred while processing your request.");
    }
  },

  onReply: async function({ api, event, Reply, message }) {
    if (!Reply || event.senderID !== Reply.author) return;
    
    const userInput = (event.body || "").trim();
    if (!userInput) return;

    try {
      // Clean up reply handler
      global.GoatBot.onReply.delete(Reply.messageID);
      
      // Try to delete the prompt message
      try {
        await api.unsendMessage(Reply.messageID);
      } catch (unsendError) {
        // Ignore if we can't unsend
      }

      await processVideoCategory(api, message, event.threadID, userInput);

    } catch (error) {
      console.error("videomix onReply error:", error);
      message.reply("❌ Failed to process your category selection.");
    }
  }
};

// Main video processing function
async function processVideoCategory(api, message, threadID, categoryInput) {
  try {
    const categories = Object.keys(VIDEOS);
    let selectedCategory = categoryInput.toLowerCase();

    // Handle numeric input
    if (/^\d+$/.test(selectedCategory)) {
      const index = parseInt(selectedCategory) - 1;
      if (index >= 0 && index < categories.length) {
        selectedCategory = categories[index];
      }
    }

    // Validate category
    if (!VIDEOS[selectedCategory]) {
      const available = categories.join(', ');
      return message.reply(`❌ Invalid category "${categoryInput}".\n\nAvailable: ${available}`);
    }

    const videoUrls = VIDEOS[selectedCategory].filter(url => url && typeof url === 'string' && url.startsWith('http'));
    if (videoUrls.length === 0) {
      return message.reply("❌ No valid video URLs found for this category.");
    }

    // Pick random video
    const videoUrl = pickRandom(videoUrls);
    if (!videoUrl) {
      return message.reply("❌ Failed to select a video. Please try again.");
    }

    // Send processing message
    const processingMsg = await message.reply(`⬇️ Downloading ${selectedCategory} video...`);

    try {
      // Get cached file or download
      const cacheFileName = cacheFilenameFromUrl(videoUrl);
      const cacheFilePath = path.join(CACHE_DIR, cacheFileName);
      
      let finalFilePath = null;

      // Check cache first
      try {
        if (await fs.pathExists(cacheFilePath)) {
          const stats = await fs.stat(cacheFilePath);
          if (stats.size >= MIN_FILE_BYTES) {
            finalFilePath = cacheFilePath;
          } else {
            await fs.remove(cacheFilePath);
          }
        }
      } catch (cacheError) {
        console.warn("Cache check failed:", cacheError.message);
      }

      // Download if not cached
      if (!finalFilePath) {
        try {
          finalFilePath = await downloadToCache(videoUrl, cacheFilePath);
        } catch (downloadError) {
          throw new Error(`Failed to download video: ${downloadError.message}`);
        }
      }

      // Delete processing message
      try {
        await api.unsendMessage(processingMsg.messageID);
      } catch (unsendError) {}

      // Send the video as attachment
      await message.reply({
        body: `🎥 ${selectedCategory.toUpperCase()} Video\nEnjoy! 🎬`,
        attachment: fs.createReadStream(finalFilePath)
      });

    } catch (videoError) {
      // Clean up processing message
      try {
        await api.unsendMessage(processingMsg.messageID);
      } catch (unsendError) {}
      
      console.error("Video processing failed:", videoError);
      message.reply(`❌ Failed to process video: ${videoError.message}`);
    }

  } catch (error) {
    console.error("processVideoCategory error:", error);
    message.reply("❌ An unexpected error occurred while processing the video.");
  }
}
