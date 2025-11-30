const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "hvd",
        aliases: [],
        version: "2.1", // Bumped version for the fix
        author: "kshitiz fixed by Asif", 
        countDown: 60,
        role: 0,
        shortDescription: "get hentai video",
        longDescription: "it will send hentai video",
        category: "𝟭𝟴+",
        guide: "{p}hvd",
    },

    sentVideos: [],

    onStart: async function ({ api, event, message }) {
        let loadingMessage = null;
        try {
            // Send loading message initially
            loadingMessage = await message.reply({
                body: "📥 Searching for a working video... This might take a moment to skip dead links.",
            });

            // --- YOUR ORIGINAL LINKS (UNCHANGED) ---
            const link = [
                "https://drive.google.com/uc?export=download&id=1ywjcqK_AkWyxnRXjoB0JKLdChZsR69cK",
                "https://drive.google.com/uc?export=download&id=1xyC3bJWlmZVMoWJHYRLdX_dNibPVBDIV",
                "https://drive.google.com/uc?export=download&id=1whpsUv4Xzt3bp-QSlx03cLdwW2UsnEt2",
                "https://drive.google.com/uc?export=download&id=1wUaET9wLXH4vVBF3ilxOWybxPiqp2gEs",
                "https://drive.google.com/uc?export=download&id=1w3Q3OgnemXiN05bdE8oReOPcQOW55SAF",
                "https://drive.google.com/uc?export=download&id=1vDfJtp77RyAyOWOQrimZEYX_Ah6Xkz2t",
                "https://drive.google.com/uc?export=download&id=1uGrrFh79_5yPN3GPWd1mA4MtIy6C08y-",
                "https://drive.google.com/uc?export=download&id=1tN2WYhRs7Cbq7KbN0MWUlhZGaKUHj_6y",
                "https://drive.google.com/uc?export=download&id=1syg8E-nP9HAYIjY-MAIQEALKkY39A4a4",
                "https://drive.google.com/uc?export=download&id=1sDRmcDv_LGTPwITrSn7N454AtZ8V_NgN",
                "https://drive.google.com/uc?export=download&id=1ri-l4Qk4tf73KVAMdiXxy-yVF0JNqdS7",
                "https://drive.google.com/uc?export=download&id=1rcsGmKWNdN0hCKiX88QNBSXEU8VvaQAo",
                "https://drive.google.com/uc?export=download&id=1rZJ8y_5kLKAJfMMIc9z-_4E9n3pm0GsO",
                "https://drive.google.com/uc?export=download&id=1rTf61vUJJGw7-_3yw0QzS7ZrGMdmbuWA",
                "https://drive.google.com/uc?export=download&id=1rNMJgoHOsBH_luODo-VHfdb_ZkAuc5Az",
                "https://drive.google.com/uc?export=download&id=1qy4cU5WRWVfYZPPncGEQ8cFXacCVZ15u",
                "https://drive.google.com/uc?export=download&id=1qrtf0Cp5gDGXWqxLjdEB2x1lUammXMUl",
                "https://drive.google.com/uc?export=download&id=1pz_fkQjHKx9BUmZWZPm05KRMaDTPEV9k",
                "https://drive.google.com/uc?export=download&id=1pw3B0kR3XQ9roy0Jj7EpNBoMOlHtK8qX",
                "https://drive.google.com/uc?export=download&id=1psBrXCWoFVexjbDDVJR1OYoXadFFRqam",
                "https://drive.google.com/uc?export=download&id=1ortx_MWQXEN1iYUXhJJow-uHcXlnK28e",
                "https://drive.google.com/uc?export=download&id=1nO5ojZ_oGkXGv_Pl9bPHz7CUwpYSDGCN",
                "https://drive.google.com/uc?export=download&id=1lSZ078rtW7a6aMNTlaBC9jXFb1I8jRYC",
                "https://drive.google.com/uc?export=download&id=1lM8v68ICcprxePiGdjsbwPjfrqzRvZ6y",
                "https://drive.google.com/uc?export=download&id=1lHQv7iSNAdgF769n8Ur7cIz5JHjER1DB",
                "https://drive.google.com/uc?export=download&id=1lDwJOwZfveRqOomhZe6Wb3RJ1vW08uTv",
                "https://drive.google.com/uc?export=download&id=1l2ewdfVNAoQ2KYPPqjYOEEhW17PwYUF2",
                "https://drive.google.com/uc?export=download&id=1kedvq0VECKWpw1nEU-VWtO_VkoIhbOuI",
                "https://drive.google.com/uc?export=download&id=1kByndSenNowuek8een-4pDjSKnoIEwlJ",
                "https://drive.google.com/uc?export=download&id=1jpciEk9NXG_eIKnN0ltd3fjLUVh9nI2I",
                "https://drive.google.com/uc?export=download&id=1ipQqL_rLIhiSatSnoWHwhaS-UWuC1Vq6",
                "https://drive.google.com/uc?export=download&id=1iNiBBs7yGlPdEGJtRuHVnt_cte3lWUQ4",
                "https://drive.google.com/uc?export=download&id=1iAVp7tMolOu7m5LldenbGJN5uEzqo9G3",
                "https://drive.google.com/uc?export=download&id=1hZOD6-n8tDjne1tLaFaoVGgqUYTytkPI",
                "https://drive.google.com/uc?export=download&id=1hBGpE-mgCbFe8WuWxw0BBlzRuwsVIh24",
                "https://drive.google.com/uc?export=download&id=1h1KzxAkbiHSpP1c_XUkPXm4kOzXkLETJ",
                "https://drive.google.com/uc?export=download&id=1f_64vga6i4-hEVcE9cdZnIqC-VOgUjzs",
                "https://drive.google.com/uc?export=download&id=1ew_vEjjxHcrukG5T9T7gKdKl6feDrj4V",
                "https://drive.google.com/uc?export=download&id=1emeDbEjIV58KgGC783Gz9T_xqbTkpDr_",
                "https://drive.google.com/uc?export=download&id=1eDwS_7xg0kFNi9xMKjYEs5pZPTKQ6-5M",
                "https://drive.google.com/uc?export=download&id=1ctctkv5L_-XehYSXDrtRpaWBkDQ8G94w",
                "https://drive.google.com/uc?export=download&id=1cnXVJM_E57-z5MeoiUiaq6KmGj0nOD4_",
                "https://drive.google.com/uc?export=download&id=1cdqo21j1WK5ssROfVtgMmqtDiQ2PQR5c",
                "https://drive.google.com/uc?export=download&id=1bw3xD_KosEQKxONZHJIy9R5X-IYUsHeV",
                "https://drive.google.com/uc?export=download&id=1bJKLVy10G0idoLWD23VDguIMRonY4Trn",
                "https://drive.google.com/uc?export=download&id=1b7zxHpinRVVPBiUww4Ei0Xr4ayo-9jJd",
                "https://drive.google.com/uc?export=download&id=1b6HQ7mOwUjCmT6_2B8-q34bTN9cCil6P",
                "https://drive.google.com/uc?export=download&id=1aogVwyNI2G6FZ14BDT--F32tCY3FRx28",
                "https://drive.google.com/uc?export=download&id=1aoBfRR8NN9MXKrV0HoSmLyphSdbal6tt",
                "https://drive.google.com/uc?export=download&id=1aM-Y_d9trGy40x-cCjNBl74Mi5bafVRS",
                "https://drive.google.com/uc?export=download&id=1_DLc0wPBThe32DCAsgMLQDprIYy8XWj2",
                "https://drive.google.com/uc?export=download&id=1_BN9mfNAr5IXT7x0yY0l16ADMUEvPQJm",
                "https://drive.google.com/uc?export=download&id=1Zwrnh3ZnUWuY9XF7uP-3mnyvTzzrcui4",
                "https://drive.google.com/uc?export=download&id=1Zlz7D8Wbb4cmcrulO7J6rPIwVQ_z4GbJ",
                "https://drive.google.com/uc?export=download&id=1ZJtu5zMAvoJkKx946IgeD8A2zcCsG9-i",
                "https://drive.google.com/uc?export=download&id=1ZE_kkEpk6WphvkhFZXZ0MmfeQHEPhHhB",
                "https://drive.google.com/uc?export=download&id=1ZBR4DjulCb29tBqlliShJmAPOiUAyGsQ",
                "https://drive.google.com/uc?export=download&id=1Yv-6_eh3MSYkFqXuCY_hXlRirAHqBN6l",
                "https://drive.google.com/uc?export=download&id=1Y3uYGaS43suvYgA8FefjDvwWJgbBB8Zw",
                "https://drive.google.com/uc?export=download&id=1WgtoHEgvKRSpf__RJyRFd1gEI9kuIrAa",
                "https://drive.google.com/uc?export=download&id=1Wf9YF0pIfrO4x4oqKorBMafy4S3bfltG",
                "https://drive.google.com/uc?export=download&id=1W_7DfzSTqu0gkpKBFz-SKPR2r4lYZApH",
                "https://drive.google.com/uc?export=download&id=1WSmaBA7-spNd2uwLBGk8MKaSqnIK7MZW",
                "https://drive.google.com/uc?export=download&id=1VtDW7l8sfU5C4h0pj38errdpVReh-bJf",
                "https://drive.google.com/uc?export=download&id=1UlfU6y2hN-eKrgVhiVP0qrujyWLJ7uXL",
                "https://drive.google.com/uc?export=download&id=1T0kLjv8OJhaauyCqlEsCwPZY7Gvjg2M_",
                "https://drive.google.com/uc?export=download&id=1Slif55DBfBJxjMIlqQuTJsxjOPKVIBmt",
                "https://drive.google.com/uc?export=download&id=1SURWfk83_YVoK34BCwz94XDAbyLlkeQn",
                "https://drive.google.com/uc?export=download&id=1SOWyF6IXSaLaA_gpZKVUWp5-vVPNnvpf",
                "https://drive.google.com/uc?export=download&id=1SIDJrei58BqXQOl5mQjB7ePmcioO44aJ",
                "https://drive.google.com/uc?export=download&id=1S0Da-yz69uIhBqE1o2wYJaybYw5oGxxO",
                "https://drive.google.com/uc?export=download&id=1RjCzhqQKr5_lqaQLStfePlSwiOexCOl5",
                "https://drive.google.com/uc?export=download&id=1RQGJqcyv5K22qcKil9hrPXcrkJ1D89-9",
                "https://drive.google.com/uc?export=download&id=1RL4GBOPbtIraD-Ubwr5xiy_aWdl8SSww",
                "https://drive.google.com/uc?export=download&id=1RAXJRUNqspEKB0CplgvxnT90ot5JvIIO",
                "https://drive.google.com/uc?export=download&id=1R1dZCfszPsjKUJgP558_WdMoIHHKf9Ny",
                "https://drive.google.com/uc?export=download&id=1QVqXrYRD-TxOiJn7tZlux-JyZSpi2bZ5",
                "https://drive.google.com/uc?export=download&id=1MT_ymm-k_FgvGiGiH2w5HyRLN-ahO8CC",
                "https://drive.google.com/uc?export=download&id=1MAwvuhI_Dsot6HOIaTlU8yDweA1qr1KY",
                "https://drive.google.com/uc?export=download&id=1M-a8BQMRBce3cXviQAozaWym0n8w62pz",
                "https://drive.google.com/uc?export=download&id=1LyIfu4V1mUKL8A1S47wJuP6xRf4A0odf",
                "https://drive.google.com/uc?export=download&id=1LvIxhb2FZQbMxlColkl5F7nzhgFVD8jB",
                "https://drive.google.com/uc?export=download&id=1L64bldudsF7U4e90g-Iu4r4pqLRV0aOJ",
                "https://drive.google.com/uc?export=download&id=1KjE1kJUznYUrHHY_5nHR74LlHYvDZCG5",
                "https://drive.google.com/uc?export=download&id=1KdD3w4CAJjWQmNWd9Efdvsc8gMI88aIM",
                "https://drive.google.com/uc?export=download&id=1J1ZgyE77yIYmx32A8xUDvu8h-vLkNKJr",
                "https://drive.google.com/uc?export=download&id=1IlP84x785hrOE-IStgNGLiXyvPF5jTr_",
                "https://drive.google.com/uc?export=download&id=1IgeyKOeiY1FWxzfJ8jwnP5AJueuhPZWG",
                "https://drive.google.com/uc?export=download&id=1OiSB4qKnmsbdDWC7q7KrO09E2O69Boa9",
                "https://drive.google.com/uc?export=download&id=1IU5bwMYCmMqDg-CpGMxEOr2ifEaUCJKU",
                "https://drive.google.com/uc?export=download&id=1HDmbWSiNJV7g3yqT1gaOxwkMOvvNy2N8",
                "https://drive.google.com/uc?export=download&id=1H040DCdXt4a18YcDorLB7HFcGnwo5LtE",
                "https://drive.google.com/uc?export=download&id=1G97HQZd-F8b0bqOM-8dVc1s9mIA_vzW8",
                "https://drive.google.com/uc?export=download&id=1Eea3vgcIywc7FjAGaYIKGCJEbJ2zx4ET",
                "https://drive.google.com/uc?export=download&id=1ELDAKvCCV8fdN323A09fpPXNoVasq9TO",
                "https://drive.google.com/uc?export=download&id=1DxiqL2A9ChPeqy6LPyD5p4di1xCbdXH5",
                "https://drive.google.com/uc?export=download&id=1DM-2VUWFlrsNDu1Pdwcdzi6an_GZAFtb",
                "https://drive.google.com/uc?export=download&id=1DL8Mty1cbbY_cgANBfBL6THLEaiv-tVB",
                "https://drive.google.com/uc?export=download&id=1AP_lHQyiRBhIfbxpLEkqLhNwBzdG5AAa",
                "https://drive.google.com/uc?export=download&id=1AKdLmu36TyMfi1OXNWGMY-Pjbd_4ll8C",
                "https://drive.google.com/uc?export=download&id=1AFh5P_OzMnvpDPfu43fW_c8gmEULZ0ob",
                "https://drive.google.com/uc?export=download&id=1PLPN8_LqKC1-3qN5St-f1XgtkbBuhl0g",
                "https://drive.google.com/uc?export=download&id=19qMp1YCKY3iFMYIf4yUfVYOgdRw5knPw",
                "https://drive.google.com/uc?export=download&id=17RxCY6f7BPQIfAgT7N2LH_WjQi7ljwjK",
                "https://drive.google.com/uc?export=download&id=1O2mx97gKRFLx2lJEyNNrVyAxjQj7cAg2",
                "https://drive.google.com/uc?export=download&id=176zWucsq7YC2q5BNDwrvAYdU6zz7FOrD",
                "https://drive.google.com/uc?export=download&id=16Rot2cC8TCVsvBKVHfy3DRfPiFzP6xX6",
                "https://drive.google.com/uc?export=download&id=16QMumT_8FTZNq95HBQHgy7lca1gZtQex",
                "https://drive.google.com/uc?export=download&id=15jVSPiMbMZ0U0E-_zvqexpRK1QPU3iVq",
                "https://drive.google.com/uc?export=download&id=15LBEfVVP35w4nauwQ08be0Ft3aG1lVuF",
                "https://drive.google.com/uc?export=download&id=15-Mry2bczG5KLeXzo8h3_Y8gyW_2GbP9",
                "https://drive.google.com/uc?export=download&id=14hazsqEnBZeXpCNLvracDEie8mD4XrTw",
                "https://drive.google.com/uc?export=download&id=12RTmt2-CcteP-TX6DCUlBwsETzOciBVd",
                "https://drive.google.com/uc?export=download&id=11DAQV5lCdZLrz07KvoctvJS2m5dZLrWT",
                "https://drive.google.com/uc?export=download&id=11D0Hafy48zpMxrQNW0xw_iD-sSbuHV1H",
                "https://drive.google.com/uc?export=download&id=1-prVKuEIlMFsOxeDLZ3_y8A7HEUNmq6l",
                "https://drive.google.com/uc?export=download&id=1-oJvKu5Pv4xvGoA3Snk2H8WHNbr7sD2R",
                "https://drive.google.com/uc?export=download&id=1-7rYID9JMd38eg5NplPVFbD7jTE8NDyf",
            ];

            // Setup Directory
            const cacheDir = path.join(__dirname, "cache");
            await fs.ensureDir(cacheDir);
            const videoPath = path.join(cacheDir, `hvd_${Date.now()}.mp4`);

            // Helper to shuffle the array so we try links in random order
            const shuffleArray = (array) => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            };

            // Get list of videos to try (shuffled)
            // We prioritize videos we haven't sent, but if those fail, we try everything.
            let videosToTry = link.filter(video => !this.sentVideos.includes(video));
            if (videosToTry.length === 0) {
                this.sentVideos = []; // Reset history
                videosToTry = [...link];
            }
            videosToTry = shuffleArray(videosToTry);

            let downloadSuccess = false;
            let finalVideoUrl = "";

            // --- THE FIX: LOOP SYSTEM ---
            // Try links one by one. If one fails (404), go to the next.
            console.log(`[HVD] Starting search through ${videosToTry.length} links...`);

            for (const currentLink of videosToTry) {
                try {
                    console.log(`[HVD] Trying: ${currentLink}`);
                    
                    const response = await axios({
                        method: 'GET',
                        url: currentLink,
                        responseType: 'stream',
                        timeout: 10000, // Short timeout (10s) to skip hanging links quickly
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                        }
                    });

                    // Save stream to file
                    const writer = fs.createWriteStream(videoPath);
                    response.data.pipe(writer);

                    await new Promise((resolve, reject) => {
                        writer.on('finish', resolve);
                        writer.on('error', reject);
                        response.data.on('error', reject);
                    });

                    // Verify file size
                    const stats = await fs.stat(videoPath);
                    if (stats.size > 2000) { // Should be larger than 2KB (avoid empty HTML error pages)
                        downloadSuccess = true;
                        finalVideoUrl = currentLink;
                        this.sentVideos.push(currentLink);
                        console.log(`[HVD] ✅ Success! Size: ${stats.size}`);
                        break; // Stop the loop, we found a video!
                    } else {
                        console.log(`[HVD] ⚠️ File too small (probably error page), skipping...`);
                        await fs.remove(videoPath); // Delete bad file
                    }

                } catch (err) {
                    // This catches the 404 and allows the loop to continue to the next link
                    console.log(`[HVD] ❌ Failed to download (skipping): ${err.message}`);
                    try { await fs.remove(videoPath); } catch(e){}
                    continue; // FORCE NEXT ITERATION
                }
            }

            // Remove loading message
            if (loadingMessage) {
                await api.unsendMessage(loadingMessage.messageID);
            }

            if (downloadSuccess) {
                await message.reply({
                    body: '🎬 Make sure to watch full video! 🥵',
                    attachment: fs.createReadStream(videoPath)
                });
            } else {
                await message.reply("❌ All available links in the database seem to be broken/deleted. Please contact the bot admin to update the links.");
            }

            // Cleanup after sending (wait 30 seconds to ensure send completes)
            setTimeout(async () => {
                try {
                    await fs.remove(videoPath);
                    console.log('🧹 Cleanup done');
                } catch (e) { console.log(e); }
            }, 30000);

        } catch (error) {
            console.error('❌ Critical Error in hvd command:', error);
            if (loadingMessage) {
                try { await api.unsendMessage(loadingMessage.messageID); } catch (e) {}
            }
            await message.reply("❌ Critical error: " + error.message);
        }
    },
};
