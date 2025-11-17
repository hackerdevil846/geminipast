const axios = require("axios");

module.exports = {
    config: {
        name: "anime",
        aliases: [],
        version: "1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑒𝑛𝑡𝑒𝑟𝑡𝑎𝑖𝑛𝑚𝑒𝑛𝑡",
        shortDescription: {
            en: "𝐴𝑛𝑖𝑚𝑒 𝑟𝑒𝑐𝑜𝑚𝑚𝑒𝑛𝑑𝑎𝑡𝑖𝑜𝑛"
        },
        longDescription: {
            en: "𝑅𝑒𝑐𝑜𝑚𝑚𝑒𝑛𝑑 𝑎𝑛 𝑎𝑛𝑖𝑚𝑒 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑎 𝑔𝑒𝑛𝑟𝑒"
        },
        guide: {
            en: "{p}anime [𝑔𝑒𝑛𝑟𝑒]\n𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑔𝑒𝑛𝑟𝑒𝑠: 𝑠ℎ𝑜𝑛𝑒𝑛, 𝑠𝑒𝑖𝑛𝑒𝑛, 𝑖𝑠𝑒𝑘𝑎𝑖, 𝑠𝑐𝑖𝑓𝑖"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function ({ message, args, event }) {
        try {
            // Dependency check
            try {
                require("axios");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠.");
            }

            const animeRecommendations = {
        shonen: [
            { animeName: "𝑁𝑎𝑟𝑢𝑡𝑜", imageUrl: "https://drive.google.com/uc?export=download&id=1OP2zmycLmFihRISVLzFwrw__LRBsF9GN" },
            { animeName: "𝑂𝑛𝑒 𝑃𝑖𝑒𝑐𝑒", imageUrl: "https://drive.google.com/uc?export=download&id=1QaK3EfNmbwAgpJm4czY8n8QRau9MXoaR" },
            { animeName: "𝐷𝑟𝑎𝑔𝑜𝑛 𝐵𝑎𝑙𝑙 𝑍", imageUrl: "https://drive.google.com/uc?export=download&id=1q-8lFZD5uPmhRySvT75Bgsr2lp9UQ4Mi" },
            { animeName: "𝐵𝑙𝑒𝑎𝑐ℎ", imageUrl: "https://drive.google.com/uc?export=download&id=1bds-i6swtqi2k4YCoglPKTV7kL7f-SF7" },
            { animeName: "𝑀𝑦 𝐻𝑒𝑟𝑜 𝐴𝑐𝑎𝑑𝑒𝑚𝑖𝑎", imageUrl: "https://drive.google.com/uc?export=download&id=1uOcTZ8r1zDGmqF9Nyg1vupuWHKEg1eVf" },
            { animeName: "𝐴𝑡𝑡𝑎𝑐𝑘 𝑜𝑛 𝑇𝑖𝑡𝑎𝑛", imageUrl: "https://drive.google.com/uc?export=download&id=1DrBwp7irJrW_DVmIXHbNvFjofHCTmZ0a" },
            { animeName: "𝐻𝑢𝑛𝑡𝑒𝑟 𝑥 𝐻𝑢𝑛𝑡𝑒𝑟", imageUrl: "https://drive.google.com/uc?export=download&id=1W4RHPv1zWtFUGFVUJ0uiCxvP5ovpURHG" },
            { animeName: "𝐹𝑢𝑙𝑙𝑚𝑒𝑡𝑎𝑙 𝐴𝑙𝑐ℎ𝑒𝑚𝑖𝑠𝑡: 𝐵𝑟𝑜𝑡ℎ𝑒𝑟ℎ𝑜𝑜𝑑", imageUrl: "https://drive.google.com/uc?export=download&id=1C-pRqtjpCFFPSZf8xAsNLgn9VgZBUgu6" },
            { animeName: "𝐷𝑒𝑚𝑜𝑛 𝑆𝑙𝑎𝑦𝑒𝑟: 𝐾𝑖𝑚𝑒𝑡𝑠𝑢 𝑛𝑜 𝑌𝑎𝑖𝑏𝑎", imageUrl: "https://drive.google.com/uc?export=download&id=1vU5XMLgKwBPfsiheUF4SK79LfKbzU6NX" },
            { animeName: "𝐷𝑒𝑎𝑡ℎ 𝑁𝑜𝑡𝑒", imageUrl: "https://drive.google.com/uc?export=download&id=1tUJEum_tf79gj9420mHx-_q7f0QP27DC" },
            { animeName: "𝑌𝑢 𝑌𝑢 𝐻𝑎𝑘𝑢𝑠ℎ𝑜", imageUrl: "https://drive.google.com/uc?export=download&id=1JL07gw2S4f6T_d9ufWDnNkDme3zqOuLU" },
            { animeName: "𝐹𝑎𝑖𝑟𝑦 𝑇𝑎𝑖𝑙", imageUrl: "https://drive.google.com/uc?export=download&id=13WKaqx8rdmwZE7VDWRK0fFkk8zkA7AOi" },
            { animeName: "𝑂𝑛𝑒 𝑃𝑢𝑛𝑐ℎ 𝑀𝑎𝑛", imageUrl: "https://drive.google.com/uc?export=download&id=10KOnQyrli8HPaeThalyN3KA2yX0T28Uj" },
            { animeName: "𝑆𝑤𝑜𝑟𝑑 𝐴𝑟𝑡 𝑂𝑛𝑙𝑖𝑛𝑒", imageUrl: "https://drive.google.com/uc?export=download&id=1JxczwxBgreEc4tZdLTdFHh6klsvlCYkM" },
            { animeName: "𝐽𝑜𝐽𝑜'𝑠 𝐵𝑖𝑧𝑎𝑟𝑟𝑒 𝐴𝑑𝑣𝑒𝑛𝑡𝑢𝑟𝑒", imageUrl: "https://drive.google.com/uc?export=download&id=1aKzkrSAYAPXNIPhazTT6pkQxJpdQOD2p" },
            { animeName: "𝐷𝑟𝑎𝑔𝑜𝑛 𝐵𝑎𝑙𝑙", imageUrl: "https://drive.google.com/uc?export=download&id=1oonrlOFBjdYLV2zv9V-oB0AenGH4HNr2" },
            { animeName: "𝐻𝑎𝑖𝑘𝑦𝑢𝑢!!", imageUrl: "https://drive.google.com/uc?export=download&id=1tFHwCTNgoLHi34YL6fdXq2taZINZERHR" },
            { animeName: "𝐵𝑙𝑎𝑐𝑘 𝐶𝑙𝑜𝑣𝑒𝑟", imageUrl: "https://drive.google.com/uc?export=download&id=1ecenM1HVzgPtwaN8eISfxwBB-uKqdZoj" },
            { animeName: "𝑇ℎ𝑒 𝑆𝑒𝑣𝑒𝑛 𝐷𝑒𝑎𝑑𝑙𝑦 𝑆𝑖𝑛𝑠", imageUrl: "https://drive.google.com/uc?export=download&id=1FzV9FwXri9xxwAy-xrlA8zA6dyO70tkf" },
            { animeName: "𝑀𝑜𝑏 𝑃𝑠𝑦𝑐ℎ𝑜 100", imageUrl: "https://drive.google.com/uc?export=download&id=1qBXCvbhENmyC05vLHQLFJR-xlf5HhZzF" },
            { animeName: "𝐴𝑠𝑠𝑎𝑠𝑠𝑖𝑛𝑎𝑡𝑖𝑜𝑛 𝐶𝑙𝑎𝑠𝑠𝑟𝑜𝑜𝑚", imageUrl: "https://drive.google.com/uc?export=download&id=13IP6cwdimzHv3nUJi-kODbGKIAHpJEAy" },
            { animeName: "𝑇𝑜𝑟𝑖𝑘𝑜", imageUrl: "https://drive.google.com/uc?export=download&id=1Gu6us6Ue5530ynkpFu-vsGOCynq_o6EI" },
            { animeName: "𝐵𝑙𝑢𝑒 𝐸𝑥𝑜𝑟𝑐𝑖𝑠𝑡", imageUrl: "https://drive.google.com/uc?export=download&id=1f8CGrENwaHOgy11yeNdPwDI_nzpcESky" },
            { animeName: "𝑁𝑜𝑟𝑎𝑔𝑎𝑚𝑖", imageUrl: "https://drive.google.com/uc?export=download&id=1PxUiu6ZhJT5btIAWNubNPD3cQPNWnvYp" },
            { animeName: "𝐺𝑢𝑟𝑟𝑒𝑛 𝐿𝑎𝑔𝑎𝑛𝑛", imageUrl: "https://drive.google.com/uc?export=download&id=1o57c1C7yXr_RDHz0lAH9lWJUgpMzQn1x" },
            { animeName: "𝑀𝑎𝑔𝑖: 𝑇ℎ𝑒 𝐿𝑎𝑏𝑦𝑟𝑖𝑛𝑡ℎ 𝑜𝑓 𝑀𝑎𝑔𝑖𝑐", imageUrl: "https://drive.google.com/uc?export=download&id=1hQEdeO3F8v1sZQvZ6uh5n_YTwuizYt0v" },
            { animeName: "𝐵𝑒𝑒𝑙𝑧𝑒𝑏𝑢𝑏", imageUrl: "https://drive.google.com/uc?export=download&id=1Lz3PNL1X4ygv1U7xcFgILYODtGiwaGn9" },
            { animeName: "𝐹𝑖𝑟𝑒 𝐹𝑜𝑟𝑐𝑒", imageUrl: "https://drive.google.com/uc?export=download&id=11vryRMTkLuFvhlWjVZkuAaS0QoesIlwo" },
            { animeName: "𝑇ℎ𝑒 𝑅𝑖𝑠𝑖𝑛𝑔 𝑜𝑓 𝑡ℎ𝑒 𝑆ℎ𝑖𝑒𝑙𝑑 𝐻𝑒𝑟𝑜", imageUrl: "https://drive.google.com/uc?export=download&id=1oRD7AAH_VD73o8kUlUaJQC1dFTrV1nDz" },
            { animeName: "𝐷𝑟. 𝑆𝑡𝑜𝑛𝑒", imageUrl: "https://drive.google.com/uc?export=download&id=1jpb7fFDZpdHjACghQWUQopI0nzzvzrxY" },
            { animeName: "𝑇ℎ𝑒 𝑃𝑟𝑜𝑚𝑖𝑠𝑒𝑑 𝑁𝑒𝑣𝑒𝑟𝑙𝑎𝑛𝑑", imageUrl: "https://drive.google.com/uc?export=download&id=1AREnLG7w6VSdKuTi-gtnb39aoV8XdUXV" },
            { animeName: "𝑊𝑜𝑟𝑙𝑑 𝑇𝑟𝑖𝑔𝑔𝑒𝑟", imageUrl: "https://drive.google.com/uc?export=download&id=1yo-18brlycFf_ieBoWrUXXpAoUP3aUUX" },
            { animeName: "𝐾𝑢𝑟𝑜𝑘𝑜'𝑠 𝐵𝑎𝑠𝑘𝑒𝑡𝑏𝑎𝑙𝑙", imageUrl: "https://drive.google.com/uc?export=download&id=10DLx4o4V_aC9IoQyJmhd5as6bbyYzUFD" },
            { animeName: "𝐾-𝑂𝑛!", imageUrl: "https://drive.google.com/uc?export=download&id=1lR87igFhcRilVCky_0dzRT7TwQwd0ROt" },
            { animeName: "𝐷𝑢𝑟𝑎𝑟𝑎𝑟𝑎!!", imageUrl: "https://drive.google.com/uc?export=download&id=1OPE1Iva4JcoZkBUM8A2RokUuNwmAFXVu" },
            { animeName: "𝐷.𝐺𝑟𝑎𝑦-𝑚𝑎𝑛", imageUrl: "https://drive.google.com/uc?export=download&id=1A6GOPhwuUZONyQvNjXtd8v5uhVuJ4a9N" },
            { animeName: "𝑆𝑒𝑟𝑎𝑝ℎ 𝑜𝑓 𝑡ℎ𝑒 𝐸𝑛𝑑", imageUrl: "https://drive.google.com/uc?export=download&id=1w77GthKwlhZlyPWHzg3adtiqRJ9znLeR" },
            { animeName: "𝐺𝑖𝑛𝑡𝑎𝑚𝑎", imageUrl: "https://drive.google.com/uc?export=download&id=1UCaRajoK2ZprPAWNWK7aRQhHDirY3-Hs" },
            { animeName: "𝐴𝑖𝑟 𝐺𝑒𝑎𝑟", imageUrl: "https://drive.google.com/uc?export=download&id=1dfTNijY40l_CZHhP__yd-v_RozKtwHw_" },
            { animeName: "𝐻𝑎𝑗𝑖𝑚𝑒 𝑛𝑜 𝐼𝑝𝑝𝑜", imageUrl: "https://drive.google.com/uc?export=download&id=1cASzbVsNR-YXv02ZLdVvL-6Fsoc2B1FJ" },
            { animeName: "𝑅𝑢𝑟𝑜𝑢𝑛𝑖 𝐾𝑒𝑛𝑠ℎ𝑖𝑛", imageUrl: "https://drive.google.com/uc?export=download&id=1MA1_270eyhBkMRF001wE2QWoq0_6EjpK" },
            { animeName: "𝑌𝑢-𝐺𝑖-𝑂ℎ!", imageUrl: "https://drive.google.com/uc?export=download&id=19g-LMWLAhWPNbbjXrzk22ai3qFen9QXt" },
            { animeName: "𝐾𝑎𝑡𝑒𝑘𝑦𝑜 𝐻𝑖𝑡𝑚𝑎𝑛 𝑅𝑒𝑏𝑜𝑟𝑛!", imageUrl: "https://drive.google.com/uc?export=download&id=1Qq-AGdBalodBDmQcY6iPC4kUUS0z7A73" },
            { animeName: "𝑆ℎ𝑎𝑚𝑎𝑛 𝐾𝑖𝑛𝑔", imageUrl: "https://drive.google.com/uc?export=download&id=1mW49sTK7YwyLE1MY-6z64mYbPE7iDlsl" },
            { animeName: "𝑁𝑒𝑜𝑛 𝐺𝑒𝑛𝑒𝑠𝑖𝑠 𝐸𝑣𝑎𝑛𝑔𝑒𝑙𝑖𝑜𝑛", imageUrl: "https://drive.google.com/uc?export=download&id=1dp3Pe3Ckbu6MsnlAEj5QsbQrp6chTe-p" },
            { animeName: "𝐵𝑙𝑢𝑒 𝐷𝑟𝑎𝑔𝑜𝑛", imageUrl: "https://drive.google.com/uc?export=download&id=1dKXAveL6LyBgClgscDrAa-doaavwXtdq" },
            { animeName: "𝑍𝑎𝑡𝑐ℎ 𝐵𝑒𝑙𝑙!", imageUrl: "https://drive.google.com/uc?export=download&id=1RTRPU9yF3tIfzG-rNWljdfzzLgxgxEVk" },
            { animeName: "𝐸𝑦𝑒𝑠ℎ𝑖𝑒𝑙𝑑 21", imageUrl: "https://drive.google.com/uc?export=download&id=1e0XOffNUQtfQDwOLZ0e7IwlBOneZdOZo" },
            { animeName: "𝐾𝑒𝑛𝑖𝑐ℎ𝑖: 𝑇ℎ𝑒 𝑀𝑖𝑔ℎ𝑡𝑖𝑒𝑠𝑡 𝐷𝑖𝑠𝑐𝑖𝑝𝑙𝑒", imageUrl: "https://drive.google.com/uc?export=download&id=1DysZxKEN_QSfMjB3DDOR-iWHFshmae_Y" },
            { animeName: "𝐵𝑒𝑦𝑏𝑙𝑎𝑑𝑒", imageUrl: "https://drive.google.com/uc?export=download&id=14UrkjjLC2595N5yUClXRxsjq3x81unHU" }
        ],
        seinen: [
            { animeName: "𝐵𝑒𝑟𝑠𝑒𝑟𝑘", imageUrl: "https://example.com/berserk.jpg" },
            { animeName: "𝐶𝑜𝑤𝑏𝑜𝑦 𝐵𝑒𝑏𝑜𝑝", imageUrl: "https://example.com/cowboybebop.jpg" },
            { animeName: "𝐻𝑒𝑙𝑙𝑠𝑖𝑛𝑔", imageUrl: "https://example.com/hellsing.jpg" },
            { animeName: "𝐵𝑙𝑎𝑐𝑘 𝐿𝑎𝑔𝑜𝑜𝑛", imageUrl: "https://example.com/blacklagoon.jpg" },
            { animeName: "𝐺ℎ𝑜𝑠𝑡 𝑖𝑛 𝑡ℎ𝑒 𝑆ℎ𝑒𝑙𝑙: 𝑆𝑡𝑎𝑛𝑑 𝐴𝑙𝑜𝑛𝑒 𝐶𝑜𝑚𝑝𝑙𝑒𝑥", imageUrl: "https://example.com/ghostintheshell.jpg" },
            { animeName: "𝑃𝑠𝑦𝑐ℎ𝑜-𝑃𝑎𝑠𝑠", imageUrl: "https://example.com/psychopass.jpg" },
            { animeName: "𝑀𝑜𝑛𝑠𝑡𝑒𝑟", imageUrl: "https://example.com/monster.jpg" },
            { animeName: "𝐷𝑒𝑎𝑡ℎ 𝑃𝑎𝑟𝑎𝑑𝑒", imageUrl: "https://example.com/deathparade.jpg" },
            { animeName: "𝑉𝑖𝑛𝑙𝑎𝑛𝑑 𝑆𝑎𝑔𝑎", imageUrl: "https://example.com/vinlandsaga.jpg" },
            { animeName: "𝑃𝑎𝑟𝑎𝑛𝑜𝑖𝑎 𝐴𝑔𝑒𝑛𝑡", imageUrl: "https://example.com/paranoiaagent.jpg" },
            { animeName: "𝐺𝑎𝑛𝑡𝑧", imageUrl: "https://example.com/gantz.jpg" },
            { animeName: "𝐸𝑟𝑔𝑜 𝑃𝑟𝑜𝑥𝑦", imageUrl: "https://example.com/ergoproxy.jpg" },
            { animeName: "𝑅𝑎𝑖𝑛𝑏𝑜𝑤: 𝑁𝑖𝑠ℎ𝑎 𝑅𝑜𝑘𝑢𝑏𝑜𝑢 𝑛𝑜 𝑆ℎ𝑖𝑐ℎ𝑖𝑛𝑖𝑛", imageUrl: "https://example.com/rainbow.jpg" },
            { animeName: "𝑊𝑒𝑙𝑐𝑜𝑚𝑒 𝑡𝑜 𝑡ℎ𝑒 𝑁𝐻𝐾!", imageUrl: "https://example.com/welcometothenhk.jpg" },
            { animeName: "𝑀𝑢𝑠ℎ𝑖𝑠ℎ𝑖", imageUrl: "https://example.com/mushishi.jpg" },
            { animeName: "𝑆𝑡𝑒𝑖𝑛𝑠;𝐺𝑎𝑡𝑒", imageUrl: "https://example.com/steinsgate.jpg" },
            { animeName: "𝐶𝑙𝑎𝑦𝑚𝑜𝑟𝑒", imageUrl: "https://example.com/claymore.jpg" },
            { animeName: "𝑃𝑒𝑟𝑓𝑒𝑐𝑡 𝐵𝑙𝑢𝑒", imageUrl: "https://example.com/perfectblue.jpg" },
            { animeName: "𝐸𝑙𝑓𝑒𝑛 𝐿𝑖𝑒𝑑", imageUrl: "https://example.com/elfenlied.jpg" },
            { animeName: "𝑇ℎ𝑒 𝑇𝑎𝑡𝑎𝑚𝑖 𝐺𝑎𝑙𝑎𝑥𝑦", imageUrl: "https://example.com/tatamigalaxy.jpg" },
            { animeName: "𝑆𝑒𝑟𝑖𝑎𝑙 𝐸𝑥𝑝𝑒𝑟𝑖𝑚𝑒𝑛𝑡𝑠 𝐿𝑎𝑖𝑛", imageUrl: "https://example.com/lain.jpg" },
            { animeName: "𝐺𝑟𝑎𝑣𝑒 𝑜𝑓 𝑡ℎ𝑒 𝐹𝑖𝑟𝑒𝑓𝑙𝑖𝑒𝑠", imageUrl: "https://example.com/graveoffireflies.jpg" },
            { animeName: "𝑆𝑎𝑚𝑢𝑟𝑎𝑖 𝐶ℎ𝑎𝑚𝑝𝑙𝑜𝑜", imageUrl: "https://example.com/samuraichamploo.jpg" },
            { animeName: "𝐵𝑙𝑎𝑐𝑘 𝐵𝑢𝑡𝑙𝑒𝑟", imageUrl: "https://example.com/blackbutler.jpg" },
            { animeName: "𝐴𝑗𝑖𝑛: 𝐷𝑒𝑚𝑖-𝐻𝑢𝑚𝑎𝑛", imageUrl: "https://example.com/ajin.jpg" },
            { animeName: "𝑃𝑟𝑖𝑛𝑐𝑒𝑠𝑠 𝑀𝑜𝑛𝑜𝑛𝑜𝑘𝑒", imageUrl: "https://example.com/princessmononoke.jpg" },
            { animeName: "𝐺𝑎𝑛𝑔𝑠𝑡𝑎", imageUrl: "https://example.com/gangsta.jpg" },
            { animeName: "𝐺ℎ𝑜𝑠𝑡 𝐻𝑢𝑛𝑡", imageUrl: "https://example.com/ghosthunt.jpg" },
            { animeName: "𝑇𝑜𝑘𝑦𝑜 𝐺ℎ𝑜𝑢𝑙", imageUrl: "https://example.com/tokyoghoul.jpg" },
            { animeName: "𝑊𝑖𝑡𝑐ℎ 𝐻𝑢𝑛𝑡𝑒𝑟 𝑅𝑜𝑏𝑖𝑛", imageUrl: "https://example.com/witchhunterrobin.jpg" },
            { animeName: "𝐵𝑎𝑐𝑐𝑎𝑛𝑜!", imageUrl: "https://example.com/baccano.jpg" },
            { animeName: "𝑃𝑎𝑟𝑎𝑠𝑦𝑡𝑒: 𝑇ℎ𝑒 𝑀𝑎𝑥𝑖𝑚", imageUrl: "https://example.com/parasyte.jpg" },
            { animeName: "𝑆ℎ𝑖𝑔𝑢𝑟𝑢𝑖: 𝐷𝑒𝑎𝑡ℎ 𝐹𝑟𝑒𝑛𝑧𝑦", imageUrl: "https://example.com/shigurui.jpg" },
            { animeName: "𝑃𝑎𝑝𝑟𝑖𝑘𝑎", imageUrl: "https://example.com/paprika.jpg" },
            { animeName: "𝑇𝑒𝑟𝑟𝑎 𝐹𝑜𝑟𝑚𝑎𝑟𝑠", imageUrl: "https://example.com/terraformars.jpg" },
            { animeName: "𝐺ℎ𝑜𝑠𝑡 𝑖𝑛 𝑡ℎ𝑒 𝑆ℎ𝑒𝑙𝑙: 𝑆𝐴𝐶 2𝑛𝑑 𝐺𝐼𝐺", imageUrl: "https://example.com/ghostintheshell2.jpg" },
            { animeName: "𝐾𝑎𝑖𝑗𝑖: 𝑈𝑙𝑡𝑖𝑚𝑎𝑡𝑒 𝑆𝑢𝑟𝑣𝑖𝑣𝑜𝑟", imageUrl: "https://example.com/kaiji.jpg" },
            { animeName: "𝑅𝑒𝑞𝑢𝑖𝑒𝑚 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑃ℎ𝑎𝑛𝑡𝑜𝑚", imageUrl: "https://example.com/requiemforthephantom.jpg" },
            { animeName: "𝑇𝑒𝑟𝑟𝑜𝑟 𝑖𝑛 𝑅𝑒𝑠𝑜𝑛𝑎𝑛𝑐𝑒", imageUrl: "https://example.com/terrorinresonance.jpg" },
            { animeName: "𝑇𝑒𝑥ℎ𝑛𝑜𝑙𝑦𝑧𝑒", imageUrl: "https://example.com/texhnolyze.jpg" },
            { animeName: "𝐴𝑘𝑖𝑟𝑎", imageUrl: "https://example.com/akira.jpg" },
            { animeName: "𝐺𝑎𝑛𝑘𝑢𝑡𝑠𝑢𝑜𝑢: 𝑇ℎ𝑒 𝐶𝑜𝑢𝑛𝑡 𝑜𝑓 𝑀𝑜𝑛𝑡𝑒 𝐶𝑟𝑖𝑠𝑡𝑜", imageUrl: "https://example.com/gankutsuou.jpg" },
            { animeName: "𝐷𝑒𝑣𝑖𝑙𝑚𝑎𝑛: 𝐶𝑟𝑦𝑏𝑎𝑏𝑦", imageUrl: "https://example.com/devilmancrybaby.jpg" },
            { animeName: "𝐴𝑜𝑖 𝐵𝑢𝑛𝑔𝑎𝑘𝑢", imageUrl: "https://example.com/aoibungaku.jpg" }
        ],
        isekai: [
            { animeName: "𝑅𝑒:𝑍𝑒𝑟𝑜 - 𝑆𝑡𝑎𝑟𝑡𝑖𝑛𝑔 𝐿𝑖𝑓𝑒 𝑖𝑛 𝐴𝑛𝑜𝑡ℎ𝑒𝑟 𝑊𝑜𝑟𝑙𝑑", imageUrl: "https://example.com/rezero.jpg" },
            { animeName: "𝑆𝑤𝑜𝑟𝑑 𝐴𝑟𝑡 𝑂𝑛𝑙𝑖𝑛𝑒", imageUrl: "https://example.com/sao.jpg" },
            { animeName: "𝑁𝑜 𝐺𝑎𝑚𝑒 𝑁𝑜 𝐿𝑖𝑓𝑒", imageUrl: "https://example.com/nogamenolife.jpg" },
            { animeName: "𝑂𝑣𝑒𝑟𝑙𝑜𝑟𝑑", imageUrl: "https://example.com/overlord.jpg" },
            { animeName: "𝐿𝑜𝑔 𝐻𝑜𝑟𝑖𝑧𝑜𝑛", imageUrl: "https://example.com/loghorizon.jpg" },
            { animeName: "𝑇ℎ𝑒 𝑅𝑖𝑠𝑖𝑛𝑔 𝑜𝑓 𝑡ℎ𝑒 𝑆ℎ𝑖𝑒𝑙𝑑 𝐻𝑒𝑟𝑜", imageUrl: "https://example.com/shieldhero.jpg" },
            { animeName: "𝑇ℎ𝑎𝑡 𝑇𝑖𝑚𝑒 𝐼 𝐺𝑜𝑡 𝑅𝑒𝑖𝑛𝑐𝑎𝑟𝑛𝑎𝑡𝑒𝑑 𝑎𝑠 𝑎 𝑆𝑙𝑖𝑚𝑒", imageUrl: "https://example.com/tensei-shitara-slime.jpg" },
            { animeName: "𝐾𝑜𝑛𝑜𝑆𝑢𝑏𝑎: 𝐺𝑜𝑑'𝑠 𝐵𝑙𝑒𝑠𝑠𝑖𝑛𝑔 𝑜𝑛 𝑇ℎ𝑖𝑠 𝑊𝑜𝑛𝑑𝑒𝑟𝑓𝑢𝑙 𝑊𝑜𝑟𝑙𝑑!", imageUrl: "https://example.com/konosuba.jpg" },
            { animeName: "𝑇ℎ𝑒 𝐷𝑒𝑣𝑖𝑙 𝐼𝑠 𝑎 𝑃𝑎𝑟𝑡-𝑇𝑖𝑚𝑒𝑟!", imageUrl: "https://example.com/part-timer.jpg" },
            { animeName: "𝐺𝑟𝑖𝑚𝑔𝑎𝑟, 𝐴𝑠ℎ𝑒𝑠 𝑎𝑛𝑑 𝐼𝑙𝑙𝑢𝑠𝑖𝑜𝑛𝑠", imageUrl: "https://example.com/grimgar.jpg" },
            { animeName: "𝐷𝑟𝑖𝑓𝑡𝑒𝑟𝑠", imageUrl: "https://example.com/drifters.jpg" },
            { animeName: "𝐼𝑛 𝐴𝑛𝑜𝑡ℎ𝑒𝑟 𝑊𝑜𝑟𝑙𝑑 𝑤𝑖𝑡ℎ 𝑀𝑦 𝑆𝑚𝑎𝑟𝑡𝑝ℎ𝑜𝑛𝑒", imageUrl: "https://example.com/smartphone.jpg" },
            { animeName: "𝑇ℎ𝑒 𝐹𝑎𝑚𝑖𝑙𝑖𝑎𝑟 𝑜𝑓 𝑍𝑒𝑟𝑜", imageUrl: "https://example.com/familiarofzero.jpg" },
            { animeName: "𝐷𝑖𝑔𝑖𝑚𝑜𝑛 𝐴𝑑𝑣𝑒𝑛𝑡𝑢𝑟𝑒", imageUrl: "https://example.com/digimon.jpg" },
            { animeName: "𝑇ℎ𝑒 𝑉𝑖𝑠𝑖𝑜𝑛 𝑜𝑓 𝐸𝑠𝑐𝑎𝑓𝑙𝑜𝑤𝑛𝑒", imageUrl: "https://example.com/escaflowne.jpg" },
            { animeName: "𝐺𝑎𝑡𝑒: 𝐽𝑖𝑒𝑖𝑡𝑎𝑖 𝐾𝑎𝑛𝑜𝑐ℎ𝑖 𝑛𝑖𝑡𝑒, 𝐾𝑎𝑘𝑢 𝑇𝑎𝑡𝑎𝑘𝑎𝑒𝑟𝑖", imageUrl: "https://example.com/gate.jpg" },
            { animeName: "𝐼𝑛𝑢𝑌𝑎𝑠ℎ𝑎", imageUrl: "https://example.com/inuyasha.jpg" },
            { animeName: "𝑇ℎ𝑒 𝑇𝑤𝑒𝑙𝑣𝑒 𝐾𝑖𝑛𝑔𝑑𝑜𝑚𝑠", imageUrl: "https://example.com/twelvekingdoms.jpg" },
            { animeName: "𝑅𝑒:𝐶𝑟𝑒𝑎𝑡𝑜𝑟𝑠", imageUrl: "https://example.com/recreators.jpg" },
            { animeName: "𝐼𝑠𝑒𝑘𝑎𝑖 𝐶ℎ𝑒𝑎𝑡 𝑀𝑎𝑔𝑖𝑐𝑖𝑎𝑛", imageUrl: "https://example.com/isekaicheat.jpg" },
            { animeName: "𝐶𝑎𝑢𝑡𝑖𝑜𝑢𝑠 𝐻𝑒𝑟𝑜: 𝑇ℎ𝑒 𝐻𝑒𝑟𝑜 𝐼𝑠 𝑂𝑣𝑒𝑟𝑝𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑢𝑡 𝑂𝑣𝑒𝑟𝑙𝑦 𝐶𝑎𝑢𝑡𝑖𝑜𝑢𝑠", imageUrl: "https://example.com/cautioushero.jpg" },
            { animeName: "𝐴𝑟𝑖𝑓𝑢𝑟𝑒𝑡𝑎: 𝐹𝑟𝑜𝑚 𝐶𝑜𝑚𝑚𝑜𝑛𝑝𝑙𝑎𝑐𝑒 𝑡𝑜 𝑊𝑜𝑟𝑙𝑑'𝑠 𝑆𝑡𝑟𝑜𝑛𝑔𝑒𝑠𝑡", imageUrl: "https://example.com/arifureta.jpg" },
            { animeName: "𝐴𝑠𝑐𝑒𝑛𝑑𝑎𝑛𝑐𝑒 𝑜𝑓 𝑎 𝐵𝑜𝑜𝑘𝑤𝑜𝑟𝑚", imageUrl: "https://example.com/bookworm.jpg" },
            { animeName: "𝐻𝑎𝑖 𝑡𝑜 𝐺𝑒𝑛𝑠𝑜𝑢 𝑛𝑜 𝐺𝑟𝑖𝑚𝑔𝑎𝑟", imageUrl: "https://example.com/grimgar.jpg" },
            { animeName: "𝐾𝑛𝑖𝑔ℎ𝑡𝑠 & 𝑀𝑎𝑔𝑖𝑐", imageUrl: "https://example.com/knightsandmagic.jpg" },
            { animeName: "𝑇ℎ𝑒 𝑀𝑎𝑠𝑡𝑒𝑟 𝑜𝑓 𝑅𝑎𝑔𝑛𝑎𝑟𝑜𝑘 & 𝐵𝑙𝑒𝑠𝑠𝑒𝑟 𝑜𝑓 𝐸𝑖𝑛ℎ𝑒𝑟𝑗𝑎𝑟", imageUrl: "https://example.com/ragnarok.jpg" },
            { animeName: "𝑂𝑢𝑡𝑏𝑟𝑒𝑎𝑘 𝐶𝑜𝑚𝑝𝑎𝑛𝑦", imageUrl: "https://example.com/outbreakcompany.jpg" },
            { animeName: "𝑇ℎ𝑒 𝑆𝑎𝑖𝑛𝑡'𝑠 𝑀𝑎𝑔𝑖𝑐 𝑃𝑜𝑤𝑒𝑟 𝐼𝑠 𝑂𝑚𝑛𝑖𝑝𝑜𝑡𝑒𝑛𝑡", imageUrl: "https://example.com/saintspower.jpg" },
            { animeName: "𝐼𝑛 𝐴𝑛𝑜𝑡ℎ𝑒𝑟 𝑊𝑜𝑟𝑙𝑑 𝑤𝑖𝑡ℎ 𝑀𝑦 𝐴𝑏𝑠𝑢𝑟𝑑 𝑆𝑘𝑖𝑙𝑙", imageUrl: "https://example.com/absurdskill.jpg" }
        ],
        scifi: [
            { animeName: "𝐶𝑜𝑤𝑏𝑜𝑦 𝐵𝑒𝑏𝑜𝑝", imageUrl: "https://example.com/cowboybebop.jpg" },
            { animeName: "𝐺ℎ𝑜𝑠𝑡 𝑖𝑛 𝑡ℎ𝑒 𝑆ℎ𝑒𝑙𝑙: 𝑆𝑡𝑎𝑛𝑑 𝐴𝑙𝑜𝑛𝑒 𝐶𝑜𝑚𝑝𝑙𝑒𝑥", imageUrl: "https://example.com/ghostintheshell.jpg" },
            { animeName: "𝑆𝑡𝑒𝑖𝑛𝑠;𝐺𝑎𝑡𝑒", imageUrl: "https://example.com/steinsgate.jpg" },
            { animeName: "𝑃𝑠𝑦𝑐ℎ𝑜-𝑃𝑎𝑠𝑠", imageUrl: "https://example.com/psychopass.jpg" },
            { animeName: "𝑆𝑒𝑟𝑖𝑎𝑙 𝐸𝑥𝑝𝑒𝑟𝑖𝑚𝑒𝑛𝑡𝑠 𝐿𝑎𝑖𝑛", imageUrl: "https://example.com/lain.jpg" },
            { animeName: "𝐸𝑟𝑔𝑜 𝑃𝑟𝑜𝑥𝑦", imageUrl: "https://example.com/ergoproxy.jpg" },
            { animeName: "𝑆𝑝𝑎𝑐𝑒 𝐷𝑎𝑛𝑑𝑦", imageUrl: "https://example.com/spacedandy.jpg" },
            { animeName: "𝑃𝑙𝑎𝑛𝑒𝑡𝑒𝑠", imageUrl: "https://example.com/planetes.jpg" },
            { animeName: "𝐴𝑙𝑑𝑛𝑜𝑎ℎ.𝑍𝑒𝑟𝑜", imageUrl: "https://example.com/aldnoahzero.jpg" },
            { animeName: "𝑇𝑟𝑖𝑔𝑢𝑛", imageUrl: "https://example.com/trigun.jpg" },
            { animeName: "𝐶𝑜𝑑𝑒 𝐺𝑒𝑎𝑠𝑠: 𝐿𝑒𝑙𝑜𝑢𝑐ℎ 𝑜𝑓 𝑡ℎ𝑒 𝑅𝑒𝑏𝑒𝑙𝑙𝑖𝑜𝑛", imageUrl: "https://example.com/codegeass.jpg" },
            { animeName: "𝑂𝑢𝑡𝑙𝑎𝑤 𝑆𝑡𝑎𝑟", imageUrl: "https://example.com/outlawstar.jpg" },
            { animeName: "𝑁𝑜𝑒𝑖𝑛: 𝑇𝑜 𝑌𝑜𝑢𝑟 𝑂𝑡ℎ𝑒𝑟 𝑆𝑒𝑙𝑓", imageUrl: "https://example.com/noein.jpg" },
            { animeName: "𝑇𝑖𝑚𝑒 𝑜𝑓 𝐸𝑣𝑒 (𝐸𝑣𝑒 𝑛𝑜 𝐽𝑖𝑘𝑎𝑛)", imageUrl: "https://example.com/timeofeve.jpg" },
            { animeName: "𝐿𝑒𝑔𝑒𝑛𝑑 𝑜𝑓 𝑡ℎ𝑒 𝐺𝑎𝑙𝑎𝑐𝑡𝑖𝑐 𝐻𝑒𝑟𝑜𝑒𝑠", imageUrl: "https://example.com/logh.jpg" },
            { animeName: "𝐿𝑎𝑠𝑡 𝐸𝑥𝑖𝑙𝑒", imageUrl: "https://example.com/lastexile.jpg" },
            { animeName: "𝐺𝑎𝑛𝑘𝑢𝑡𝑠𝑢𝑜𝑢: 𝑇ℎ𝑒 𝐶𝑜𝑢𝑛𝑡 𝑜𝑓 𝑀𝑜𝑛𝑡𝑒 𝐶𝑟𝑖𝑠𝑡𝑜", imageUrl: "https://example.com/gankutsuou.jpg" },
            { animeName: "𝐾𝑛𝑖𝑔ℎ𝑡𝑠 𝑜𝑓 𝑆𝑖𝑑𝑜𝑛𝑖𝑎", imageUrl: "https://example.com/sidonia.jpg" },
            { animeName: "𝑆𝑝𝑎𝑐𝑒 𝐵𝑎𝑡𝑡𝑙𝑒𝑠ℎ𝑖𝑝 𝑌𝑎𝑚𝑎𝑡𝑜 2199", imageUrl: "https://example.com/yamato.jpg" },
            { animeName: "𝑇𝑒𝑟𝑟𝑎 𝐹𝑜𝑟𝑚𝑎𝑟𝑠", imageUrl: "https://example.com/terraformars.jpg" },
            { animeName: "𝐴𝑘𝑖𝑟𝑎", imageUrl: "https://example.com/akira.jpg" },
            { animeName: "𝐶𝑎𝑠𝑠ℎ𝑒𝑟𝑛 𝑆𝑖𝑛𝑠", imageUrl: "https://example.com/casshernsins.jpg" },
            { animeName: "𝐷𝑖𝑚𝑒𝑛𝑠𝑖𝑜𝑛 𝑊", imageUrl: "https://example.com/dimensionw.jpg" },
            { animeName: "𝐴𝑟𝑚𝑖𝑡𝑎𝑔𝑒 𝐼𝐼𝐼", imageUrl: "https://example.com/armitage.jpg" },
            { animeName: "𝐴𝑝𝑝𝑙𝑒𝑠𝑒𝑒𝑑", imageUrl: "https://example.com/appleseed.jpg" },
            { animeName: "𝑃𝑎𝑙𝑒 𝐶𝑜𝑐𝑜𝑜𝑛", imageUrl: "https://example.com/palecocoon.jpg" },
            { animeName: "𝐸𝑢𝑟𝑒𝑘𝑎 𝑆𝑒𝑣𝑒𝑛", imageUrl: "https://example.com/eurekaseven.jpg" },
            { animeName: "𝑇ℎ𝑒 𝐵𝑖𝑔 𝑂", imageUrl: "https://example.com/bigo.jpg" },
            { animeName: "𝑁𝑜. 6", imageUrl: "https://example.com/no6.jpg" },
            { animeName: "𝐼𝐷: 𝐼𝑁𝑉𝐴𝐷𝐸𝐷", imageUrl: "https://example.com/idinvaded.jpg" },
            { animeName: "𝐵𝑙𝑢𝑒 𝐺𝑒𝑛𝑑𝑒𝑟", imageUrl: "https://example.com/bluegender.jpg" },
            { animeName: "𝐵𝑎𝑡𝑡𝑙𝑒 𝐴𝑛𝑔𝑒𝑙 𝐴𝑙𝑖𝑡𝑎 (𝐺𝑢𝑛𝑛𝑚)", imageUrl: "https://example.com/alita.jpg" },
            { animeName: "𝑅𝑜𝑏𝑜𝑡𝑖𝑐𝑠;𝑁𝑜𝑡𝑒𝑠", imageUrl: "https://example.com/roboticsnotes.jpg" },
            { animeName: "𝐻𝑖𝑔𝑎𝑠ℎ𝑖 𝑛𝑜 𝐸𝑑𝑒𝑛 (𝐸𝑑𝑒𝑛 𝑜𝑓 𝑡ℎ𝑒 𝐸𝑎𝑠𝑡)", imageUrl: "https://example.com/edenoftheeast.jpg" },
            { animeName: "𝑆𝑜𝑙𝑡𝑦 𝑅𝑒𝑖", imageUrl: "https://example.com/soltyrei.jpg" },
            { animeName: "𝑉𝑜𝑖𝑐𝑒𝑠 𝑜𝑓 𝑎 𝐷𝑖𝑠𝑡𝑎𝑛𝑡 𝑆𝑡𝑎𝑟 (𝐻𝑜𝑠ℎ𝑖 𝑛𝑜 𝐾𝑜𝑒)", imageUrl: "https://example.com/voices.jpg" },
            { animeName: "𝐵𝑙𝑎𝑐𝑘 𝐵𝑢𝑙𝑙𝑒𝑡", imageUrl: "https://example.com/blackbullet.jpg" },
            { animeName: "𝐴𝑠𝑡𝑟𝑎 𝐿𝑜𝑠𝑡 𝑖𝑛 𝑆𝑝𝑎𝑐𝑒 (𝐾𝑎𝑛𝑎𝑡𝑎 𝑛𝑜 𝐴𝑠𝑡𝑟𝑎)", imageUrl: "https://example.com/astra.jpg" },
            { animeName: "𝐶𝑎𝑝𝑡𝑎𝑖𝑛 𝐸𝑎𝑟𝑡ℎ", imageUrl: "https://example.com/captainearth.jpg" },
            { animeName: "𝑇ℎ𝑒 𝐼𝑟𝑟𝑒𝑔𝑢𝑙𝑎𝑟 𝑎𝑡 𝑀𝑎𝑔𝑖𝑐 𝐻𝑖𝑔ℎ 𝑆𝑐ℎ𝑜𝑜𝑙 (𝑀𝑎ℎ𝑜𝑢𝑘𝑎 𝐾𝑜𝑢𝑘𝑜𝑢 𝑛𝑜 𝑅𝑒𝑡𝑡𝑜𝑢𝑠𝑒𝑖)", imageUrl: "https://example.com/irregular.jpg" },
            { animeName: "𝐵𝑢𝑏𝑏𝑙𝑒𝑔𝑢𝑚 𝐶𝑟𝑖𝑠𝑖𝑠", imageUrl: "https://example.com/bubblegumcrisis.jpg" },
            { animeName: "𝑁𝑎𝑢𝑠𝑖𝑐𝑎ä 𝑜𝑓 𝑡ℎ𝑒 𝑉𝑎𝑙𝑙𝑒𝑦 𝑜𝑓 𝑡ℎ𝑒 𝑊𝑖𝑛𝑑", imageUrl: "https://example.com/nausicaa.jpg" },
            { animeName: "𝑃𝑙𝑎𝑠𝑡𝑖𝑐 𝑀𝑒𝑚𝑜𝑟𝑖𝑒𝑠", imageUrl: "https://example.com/plasticmemories.jpg" },
            { animeName: "𝐵𝑙𝑢𝑒 𝑆𝑢𝑏𝑚𝑎𝑟𝑖𝑛𝑒 𝑁𝑜. 6", imageUrl: "https://example.com/bluesubmarine.jpg" },
            { animeName: "𝐴𝑗𝑖𝑛: 𝐷𝑒𝑚𝑖-𝐻𝑢𝑚𝑎𝑛", imageUrl: "https://example.com/ajin.jpg" },
            { animeName: "𝐿𝑜𝑔 𝐻𝑜𝑟𝑖𝑧𝑜𝑛", imageUrl: "https://example.com/loghorizon.jpg" }
        ]
    };


            // Fallback images using your Google Drive links
            const fallbackImages = [
                "https://drive.google.com/uc?export=download&id=1OP2zmycLmFihRISVLzFwrw__LRBsF9GN",
                "https://drive.google.com/uc?export=download&id=1QaK3EfNmbwAgpJm4czY8n8QRau9MXoaR",
                "https://drive.google.com/uc?export=download&id=1q-8lFZD5uPmhRySvT75Bgsr2lp9UQ4Mi",
                "https://drive.google.com/uc?export=download&id=1bds-i6swtqi2k4YCoglPKTV7kL7f-SF7",
                "https://drive.google.com/uc?export=download&id=1uOcTZ8r1zDGmqF9Nyg1vupuWHKEg1eVf"
            ];

            if (args.length === 0) {
                const genreList = Object.keys(animeRecommendations).join(', ');
                return message.reply(`🎌 𝐴𝑛𝑖𝑚𝑒 𝑅𝑒𝑐𝑜𝑚𝑚𝑒𝑛𝑑𝑎𝑡𝑖𝑜𝑛\n\n❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 𝑎 𝑔𝑒𝑛𝑟𝑒!\n\n📚 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝐺𝑒𝑛𝑟𝑒𝑠:\n• ${Object.keys(animeRecommendations).join('\n• ')}\n\n💡 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: ${global.config.PREFIX}anime 𝑠ℎ𝑜𝑛𝑒𝑛`);
            }

            const genre = args[0].toLowerCase().trim();

            if (!animeRecommendations[genre]) {
                const genreList = Object.keys(animeRecommendations).join(', ');
                return message.reply(`❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑔𝑒𝑛𝑟𝑒!\n\n📚 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝐺𝑒𝑛𝑟𝑒𝑠:\n• ${Object.keys(animeRecommendations).join('\n• ')}\n\n💡 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: ${global.config.PREFIX}anime 𝑠ℎ𝑜𝑛𝑒𝑛`);
            }

            const loadingMsg = await message.reply("⏳ 𝐿𝑜𝑎𝑑𝑖𝑛𝑔 𝑎𝑛𝑖𝑚𝑒 𝑟𝑒𝑐𝑜𝑚𝑚𝑒𝑛𝑑𝑎𝑡𝑖𝑜𝑛...");

            try {
                const recommendations = animeRecommendations[genre];
                const randomIndex = Math.floor(Math.random() * recommendations.length);
                const recommendation = recommendations[randomIndex];
                
                let imageUrl = recommendation.imageUrl;
                let imageSuccess = false;
                let imageStream = null;

                console.log(`🎯 𝑆𝑒𝑙𝑒𝑐𝑡𝑒𝑑: ${recommendation.animeName}`);
                console.log(`📥 𝐴𝑡𝑡𝑒𝑚𝑝𝑡𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒: ${imageUrl}`);

                // Try to get image stream with timeout
                try {
                    imageStream = await global.utils.getStreamFromURL(imageUrl);
                    if (imageStream) {
                        imageSuccess = true;
                        console.log(`✅ 𝐼𝑚𝑎𝑔𝑒 𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦`);
                    }
                } catch (streamError) {
                    console.error(`❌ 𝑃𝑟𝑖𝑚𝑎𝑟𝑦 𝑖𝑚𝑎𝑔𝑒 𝑓𝑎𝑖𝑙𝑒𝑑:`, streamError.message);
                }

                // If primary image fails, try fallback images
                if (!imageSuccess) {
                    console.log(`🔄 𝑇𝑟𝑦𝑖𝑛𝑔 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑖𝑚𝑎𝑔𝑒𝑠...`);
                    
                    for (let i = 0; i < Math.min(3, fallbackImages.length); i++) {
                        try {
                            const fallbackUrl = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
                            console.log(`🔄 𝑇𝑟𝑦𝑖𝑛𝑔 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 ${i + 1}: ${fallbackUrl}`);
                            
                            imageStream = await global.utils.getStreamFromURL(fallbackUrl);
                            if (imageStream) {
                                imageSuccess = true;
                                console.log(`✅ 𝐹𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑖𝑚𝑎𝑔𝑒 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙`);
                                break;
                            }
                        } catch (fallbackError) {
                            console.error(`❌ 𝐹𝑎𝑙𝑙𝑏𝑎𝑐𝑘 ${i + 1} 𝑓𝑎𝑖𝑙𝑒𝑑:`, fallbackError.message);
                        }
                    }
                }

                const messageBody = `🎌 𝐴𝑛𝑖𝑚𝑒 𝑅𝑒𝑐𝑜𝑚𝑚𝑒𝑛𝑑𝑎𝑡𝑖𝑜𝑛\n\n✨ 𝐺𝑒𝑛𝑟𝑒: ${genre.toUpperCase()}\n🎬 𝑇𝑖𝑡𝑙𝑒: ${recommendation.animeName}\n\n💫 𝐸𝑛𝑗𝑜𝑦 𝑦𝑜𝑢𝑟 𝑎𝑛𝑖𝑚𝑒 𝑗𝑜𝑢𝑟𝑛𝑒𝑦!`;

                if (imageSuccess && imageStream) {
                    await message.reply({
                        body: messageBody,
                        attachment: imageStream
                    });
                } else {
                    console.log(`⚠️ 𝑆𝑒𝑛𝑑𝑖𝑛𝑔 𝑡𝑒𝑥𝑡-𝑜𝑛𝑙𝑦 𝑟𝑒𝑐𝑜𝑚𝑚𝑒𝑛𝑑𝑎𝑡𝑖𝑜𝑛`);
                    await message.reply({
                        body: messageBody + `\n\n📸 𝐼𝑚𝑎𝑔𝑒 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒, 𝑏𝑢𝑡 ℎ𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑟𝑒𝑐𝑜𝑚𝑚𝑒𝑛𝑑𝑎𝑡𝑖𝑜𝑛!`
                    });
                }

                // Delete loading message
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑢𝑛𝑠𝑒𝑛𝑑 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒:", unsendError.message);
                }
                
            } catch (recommendationError) {
                console.error("𝑅𝑒𝑐𝑜𝑚𝑚𝑒𝑛𝑑𝑎𝑡𝑖𝑜𝑛 𝐸𝑟𝑟𝑜𝑟:", recommendationError);
                
                // Send error message with genre info
                await message.reply({
                    body: `❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑎𝑛𝑖𝑚𝑒 𝑟𝑒𝑐𝑜𝑚𝑚𝑒𝑛𝑑𝑎𝑡𝑖𝑜𝑛 𝑓𝑜𝑟 "${genre}".\n\n📚 𝑇𝑟𝑦 𝑡ℎ𝑒𝑠𝑒 𝑔𝑒𝑛𝑟𝑒𝑠:\n• ${Object.keys(animeRecommendations).join('\n• ')}`
                });
                
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑢𝑛𝑠𝑒𝑛𝑑 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒:", unsendError.message);
                }
            }

        } catch (error) {
            console.error("💥 𝐴𝑛𝑖𝑚𝑒 𝑅𝑒𝑐𝑜𝑚𝑚𝑒𝑛𝑑𝑎𝑡𝑖𝑜𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
            
            let errorMessage = "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑎𝑛𝑖𝑚𝑒 𝑟𝑒𝑐𝑜𝑚𝑚𝑒𝑛𝑑𝑎𝑡𝑖𝑜𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑖𝑛𝑡𝑒𝑟𝑛𝑒𝑡 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛.";
            } else if (error.message.includes('getStreamFromURL')) {
                errorMessage = "❌ 𝐼𝑚𝑎𝑔𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
