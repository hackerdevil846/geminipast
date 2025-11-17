module.exports = {
  config: {
    name: "animevdo",
    aliases: ["anivid", "animeedit"],
    version: "1.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 15,
    role: 0,
    shortDescription: {
      en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑣𝑖𝑑𝑒𝑜𝑠"
    },
    longDescription: {
      en: "𝑆𝑒𝑛𝑑𝑠 ℎ𝑖𝑔ℎ-𝑞𝑢𝑎𝑙𝑖𝑡𝑦 𝑟𝑎𝑛𝑑𝑜𝑚 𝑎𝑛𝑖𝑚𝑒 𝑒𝑑𝑖𝑡𝑠/𝑣𝑖𝑑𝑒𝑜𝑠 𝑓𝑟𝑜𝑚 𝑎 𝑐𝑢𝑟𝑎𝑡𝑒𝑑 𝑐𝑜𝑙𝑙𝑒𝑐𝑡𝑖𝑜𝑛"
    },
    category: "𝑎𝑛𝑖𝑚𝑒",
    guide: {
      en: "{p}animevdo"
    }
  },

  sentVideos: new Set(), // 𝑆𝑡𝑜𝑟𝑒 𝑝𝑟𝑒𝑣𝑖𝑜𝑢𝑠𝑙𝑦 𝑠𝑒𝑛𝑡 𝑣𝑖𝑑𝑒𝑜𝑠

  onStart: async function ({ message }) {
    try {
      // 𝐿𝑜𝑎𝑑𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒
      const loadingMessage = await message.reply("⏳ 𝐿𝑜𝑎𝑑𝑖𝑛𝑔 𝑎 𝑝𝑟𝑒𝑚𝑖𝑢𝑚 𝑎𝑛𝑖𝑚𝑒 𝑣𝑖𝑑𝑒𝑜 𝑒𝑑𝑖𝑡... 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡!");

      // 𝐹𝑢𝑙𝑙 𝑙𝑖𝑠𝑡 𝑜𝑓 𝑣𝑖𝑑𝑒𝑜 𝑙𝑖𝑛𝑘𝑠
      const videoLinks = [
        "https://drive.google.com/uc?export=download&id=1cyB6E3z4-_Dr4mlYFB87DlWkUlC_KvrR",
        "https://drive.google.com/uc?export=download&id=1Q5L8SGKYpNrXtJ6mffcwMA9bcUtegtga",
        "https://drive.google.com/uc?export=download&id=1u8JzKCTubRhnh0APo2mMob-mQM0CoNYj",
        "https://drive.google.com/uc?export=download&id=1JBIo966g0MmUT27S1yc0B06lASt4dD9V",
        "https://drive.google.com/uc?export=download&id=1w_HUyAFHnVfkUl8XLY01pxs8dnmQNEVn",
        "https://drive.google.com/uc?export=download&id=1EoeMITZrSNB1PpPjsh5cmsFzbjMZKH2c",
        "https://drive.google.com/uc?export=download&id=1Kh4qvle57FlMjcam-JNxTQtPZe2uxrJ8",
        "https://drive.google.com/uc?export=download&id=1KtyLzqbyJpq5_ke0Cb6gD89ZNf0NQm0t",
        "https://drive.google.com/uc?export=download&id=1vy0ZldnlTqXgwJ36HxOXC9hLObgNkTZ-",
        "https://drive.google.com/uc?export=download&id=1hPZhzKm_uj6HRsEdFAH1lPFFF8vC-lTB",
        "https://drive.google.com/uc?export=download&id=1AJCeDc-MvtvSspz7oX98ywzDB3Z29bSu",
        "https://drive.google.com/uc?export=download&id=1reVD_c5kK29iTdLAu_7sYFBB0hzrRkAx",
        "https://drive.google.com/uc?export=download&id=1vmnlCwp40mmjW6aFob_wD_U1PmOgRYst",
        "https://drive.google.com/uc?export=download&id=1R0n8HQgMEEAlaL6YJ3JiDs_6oBdsjN0e",
        "https://drive.google.com/uc?export=download&id=1tUJEum_tf79gj9420mHx-_q7f0QP27DC",
        "https://drive.google.com/uc?export=download&id=1hAKRt-oOSNnUNYjDQG-OF-tdzN_qJFoR",
        "https://drive.google.com/uc?export=download&id=1HrvT5jaPsPi66seHCLBkRbTziXJUkntn",
        "https://drive.google.com/uc?export=download&id=1v8k2YxBme5zEumlNiLIry5SDMryfkBts",
        "https://drive.google.com/uc?export=download&id=1x01XDJoJMbtUjWztomF25Ne1Up4cWQoC",
        "https://drive.google.com/uc?export=download&id=12j65dstfkMUHMSmQU8FnZi2RyHPHJipx",
        "https://drive.google.com/uc?export=download&id=13ImpZl3aLHpwlYhWvjKLfiRvFsK3kl5z",
        "https://drive.google.com/uc?export=download&id=1EdFmtprVtt652PDocRlgeXXxIQRYTSQw",
        "https://drive.google.com/uc?export=download&id=1QdLGspkvM-Gf1SHh2fJf8zPbrZaURTJs",
        "https://drive.google.com/uc?export=download&id=1RyG2Lh1cp6lq9IEIr4vVaDyu21RW_pav",
        "https://drive.google.com/uc?export=download&id=1zlmaoBVrk9GKPZ_2XYZzzQkFMdiszSzL",
        "https://drive.google.com/uc?export=download&id=1rcxnb5U4gnwSiZhOcsbahqzE003LKYXc",
        "https://drive.google.com/uc?export=download&id=12cjBYkdDR4BMKj1H4aV6rfa7sVuoU3eU",
        "https://drive.google.com/uc?export=download&id=1aBHnJ7AgkQKC9RBIycVN-l6F4kdeX3hf",
        "https://drive.google.com/uc?export=download&id=13X4yhx9Nr8tIleXtxC7bV1Rfjt1FXeDv",
        "https://drive.google.com/uc?export=download&id=1uuajuhhLPlLXlSRBdzmwGfIMAV6WwW5u",
        "https://drive.google.com/uc?export=download&id=1wkoC5kbo4GuDEqoEXoz40DwZi6OMKiSI",
      ];

      // 𝐹𝑖𝑙𝑡𝑒𝑟 𝑜𝑢𝑡 𝑠𝑒𝑛𝑡 𝑣𝑖𝑑𝑒𝑜𝑠
      const availableVideos = videoLinks.filter(video => !this.sentVideos.has(video));

      // 𝑅𝑒𝑠𝑒𝑡 𝑤ℎ𝑒𝑛 𝑎𝑙𝑙 𝑣𝑖𝑑𝑒𝑜𝑠 𝑢𝑠𝑒𝑑
      if (availableVideos.length === 0) {
        this.sentVideos.clear();
        availableVideos.push(...videoLinks);
        await message.reply("♻️ 𝑅𝑒𝑓𝑟𝑒𝑠ℎ𝑖𝑛𝑔 𝑣𝑖𝑑𝑒𝑜 𝑐𝑜𝑙𝑙𝑒𝑐𝑡𝑖𝑜𝑛...");
      }

      // 𝑅𝑎𝑛𝑑𝑜𝑚 𝑠𝑒𝑙𝑒𝑐𝑡
      const randomVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];
      this.sentVideos.add(randomVideo);

      // 𝑆𝑒𝑛𝑑 𝑡ℎ𝑒 𝑣𝑖𝑑𝑒𝑜
      await message.reply({
        body: "✨ 𝐻𝑒𝑟𝑒'𝑠 𝑎 𝑝𝑟𝑒𝑚𝑖𝑢𝑚 𝑎𝑛𝑖𝑚𝑒 𝑒𝑑𝑖𝑡 𝑓𝑜𝑟 𝑦𝑜𝑢!\n\n" +
              "▷ 𝐸𝑛𝑗𝑜𝑦 𝑡ℎ𝑒 𝑣𝑖𝑑𝑒𝑜 🎬\n" +
              "▷ 𝐿𝑖𝑘𝑒 & 𝑠ℎ𝑎𝑟𝑒 𝑖𝑓 𝑦𝑜𝑢 𝑙𝑜𝑣𝑒 𝑖𝑡 💖\n" +
              "▷ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑚𝑜𝑟𝑒 𝑤𝑖𝑡ℎ {p}animevdo",
        attachment: await global.utils.getStreamFromURL(randomVideo)
      });

      // 𝑅𝑒𝑚𝑜𝑣𝑒 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑚𝑠𝑔
      setTimeout(() => {
        message.unsend(loadingMessage.messageID).catch(() => {});
      }, 2000);

    } catch (error) {
      console.error("𝐴𝑛𝑖𝑚𝑒𝑉𝑑𝑜 𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply(
        "⚠️ 𝑂𝑜𝑝𝑠! 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑡ℎ𝑒 𝑎𝑛𝑖𝑚𝑒 𝑣𝑖𝑑𝑒𝑜.\n\n" +
        "𝑃𝑜𝑠𝑠𝑖𝑏𝑙𝑒 𝑟𝑒𝑎𝑠𝑜𝑛𝑠:\n" +
        "• 𝑆𝑒𝑟𝑣𝑒𝑟 𝑖𝑠 𝑏𝑢𝑠𝑦\n" +
        "• 𝑉𝑖𝑑𝑒𝑜 𝑓𝑖𝑙𝑒 𝑡𝑜𝑜 𝑙𝑎𝑟𝑔𝑒\n" +
        "• 𝑇𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛 𝑖𝑠𝑠𝑢𝑒\n\n" +
        "𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟!"
      );
    }
  }
};
