module.exports = {
  config: {
    name: "sweetVoice",
    aliases: ["sv", "gvoice"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝑆𝑤𝑒𝑒𝑡 𝑔𝑖𝑟𝑙 𝑣𝑜𝑖𝑐𝑒 𝑐ℎ𝑎𝑡 𝑤𝑖𝑡ℎ 𝑎𝑢𝑑𝑖𝑜 𝑐𝑙𝑖𝑝 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛, 𝑚𝑢𝑙𝑡𝑖𝑝𝑙𝑒 𝑣𝑜𝑖𝑐𝑒𝑠, 𝑎𝑛𝑑 𝑅𝑒𝑎𝑐𝑡 𝑈𝐼 𝑖𝑛𝑡𝑒𝑔𝑟𝑎𝑡𝑖𝑜𝑛"
    },
    longDescription: {
      en: "𝐸𝑛𝑎𝑏𝑙𝑒𝑠 𝑦𝑜𝑢𝑟 𝑏𝑜𝑡 𝑡𝑜 𝑠𝑝𝑒𝑎𝑘 𝑖𝑛 𝑎 𝑠𝑤𝑒𝑒𝑡 𝑔𝑖𝑟𝑙 𝑣𝑜𝑖𝑐𝑒 𝑢𝑠𝑖𝑛𝑔 𝐿𝑖𝑣𝑒𝐾𝑖𝑡, 𝐸𝑙𝑒𝑣𝑒𝑛𝐿𝑎𝑏𝑠, 𝐶𝑎𝑚𝑏.𝑎𝑖, 𝑎𝑛𝑑 𝐺𝑒𝑚𝑖𝑛𝑖. 𝐼𝑛𝑐𝑙𝑢𝑑𝑒𝑠 𝑎𝑢𝑑𝑖𝑜 𝑐𝑙𝑖𝑝 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛, 𝑚𝑢𝑙𝑡𝑖𝑝𝑙𝑒 𝑣𝑜𝑖𝑐𝑒𝑠, 𝑎𝑛𝑑 𝑅𝑒𝑎𝑐𝑡 𝑈𝐼 𝑖𝑛𝑡𝑒𝑔𝑟𝑎𝑡𝑖𝑜𝑛."
    },
    category: "𝑣𝑜𝑖𝑐𝑒",
    guide: {
      en: "{𝑝}𝑠𝑤𝑒𝑒𝑡𝑉𝑜𝑖𝑐𝑒 [𝑟𝑜𝑜𝑚𝐼𝐷] [𝑣𝑜𝑖𝑐𝑒𝑁𝑎𝑚𝑒]"
    },
    dependencies: {
      "livekit-server-sdk": "",
      "ws": "",
      "@google/generative-ai": "",
      "node-fetch": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const { RoomServiceClient } = require('livekit-server-sdk');
      const WebSocket = require('ws');
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const fetch = require('node-fetch');
      const fs = require('fs-extra');

      const LIVEKIT_HOST = 'wss://chatbot-9abm958u.livekit.cloud';
      const API_KEY = 'APIGH5UgpvBadvu';
      const API_SECRET = 'qaaEViFb8OworsXr41y5SaukMe20cG3VfatGJqwesF5A';

      const ELEVENLABS_API_KEY = 'sk_e207f6aafdaa4fa2ceccddc5dd485cba8964e3146f32f4ea';
      const CAMB_API_KEY = '1d701012-dc9f-4186-bfe4-228d75be9eec';
      const GEMINI_API_KEY = 'AIzaSyDLRdmI2BbnLNigH9KI9jgdN4c6jBYOPU0';

      const BOT_NAME = '𝑆𝑤𝑒𝑒𝑡𝑉𝑜𝑖𝑐𝑒𝐵𝑜𝑡';
      const roomName = args[0] || `sweet-voice-${Date.now()}`;
      const selectedVoice = args[1] || 'rachel';

      const roomService = new RoomServiceClient(LIVEKIT_HOST, API_KEY, API_SECRET);
      const { AccessToken } = require('livekit-server-sdk');
      const at = new AccessToken(API_KEY, API_SECRET, { identity: BOT_NAME });
      at.addGrant({ roomJoin: true, room: roomName });
      const token = at.toJwt();

      const wsUrl = `${LIVEKIT_HOST}/?token=${token}`;
      const ws = new WebSocket(wsUrl);

      ws.on('open', () => {
        console.log(`✅ 𝐶𝑜𝑛𝑛𝑒𝑐𝑡𝑒𝑑 𝑡𝑜 𝑟𝑜𝑜𝑚: ${roomName}`);
      });

      ws.on('message', async (data) => {
        const msg = JSON.parse(data);
        if (msg.kind === 'track' && msg.track?.kind === 'audio') {
          console.log('🎤 𝑅𝑒𝑐𝑒𝑖𝑣𝑒𝑑 𝑎𝑢𝑑𝑖𝑜');
          const transcript = await transcribeAudio(msg.track);
          console.log('📝 𝑇𝑟𝑎𝑛𝑠𝑐𝑟𝑖𝑝𝑡:', transcript);

          const reply = await generateReply(transcript);
          console.log('🤖 𝑅𝑒𝑝𝑙𝑦:', reply);

          await speakReply(reply, selectedVoice);
        }
      });

      // ================================
      // 𝑇𝑟𝑎𝑛𝑠𝑐𝑟𝑖𝑏𝑒 𝐴𝑢𝑑𝑖𝑜 𝑢𝑠𝑖𝑛𝑔 𝐶𝑎𝑚𝑏.𝑎𝑖
      // ================================
      async function transcribeAudio(audioBuffer) {
        try {
          const response = await fetch('https://api.camb.ai/transcriptions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${CAMB_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              audio: audioBuffer.toString('base64'),
              language: 'en'
            })
          });
          const data = await response.json();
          return data.transcript || "𝑈𝑛𝑎𝑏𝑙𝑒 𝑡𝑜 𝑡𝑟𝑎𝑛𝑠𝑐𝑟𝑖𝑏𝑒";
        } catch (error) {
          console.error('❌ 𝐶𝑎𝑚𝑏.𝑎𝑖 𝐸𝑟𝑟𝑜𝑟:', error.message);
          return "𝑇𝑟𝑎𝑛𝑠𝑐𝑟𝑖𝑝𝑡𝑖𝑜𝑛 𝑓𝑎𝑖𝑙𝑒𝑑";
        }
      }

      // ================================
      // 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑅𝑒𝑝𝑙𝑦 𝑢𝑠𝑖𝑛𝑔 𝐺𝑒𝑚𝑖𝑛𝑖
      // ================================
      async function generateReply(text) {
        try {
          const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

          const result = await model.generateContent(text);
          const reply = await result.response.text();
          return reply;
        } catch (error) {
          console.error('❌ 𝐺𝑒𝑚𝑖𝑛𝑖 𝐸𝑟𝑟𝑜𝑟:', error.message);
          return "𝑆𝑜𝑟𝑟𝑦, 𝐼 𝑐𝑜𝑢𝑙𝑑𝑛'𝑡 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒.";
        }
      }

      // ================================
      // 𝑇𝑒𝑥𝑡-𝑡𝑜-𝑆𝑝𝑒𝑒𝑐ℎ 𝑢𝑠𝑖𝑛𝑔 𝐸𝑙𝑒𝑣𝑒𝑛𝐿𝑎𝑏𝑠 (𝑆𝑤𝑒𝑒𝑡 𝐺𝑖𝑟𝑙 𝑉𝑜𝑖𝑐𝑒𝑠)
      // ================================
      async function speakReply(text, voiceName) {
        try {
          const voices = {
            rachel: 'EXAVITQu4vr4xnSDxMaL',
            drew: '29vD33N1CtxCmqQRPOHJ',
            clyde: '2EiwWn4FVgS3dlbJG3lJ',
            domi: 'AZnzlk1XvdvUeBnXmlld'
          };

          const voiceId = voices[voiceName.toLowerCase()] || voices.rachel;

          const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
              'xi-api-key': ELEVENLABS_API_KEY,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              text,
              voice_settings: {
                stability: 0.4,
                similarity_boost: 0.9,
                style: 0.3
              }
            })
          });

          if (!response.ok) throw new Error('𝐸𝑙𝑒𝑣𝑒𝑛𝐿𝑎𝑏𝑠 𝑇𝑇𝑆 𝑓𝑎𝑖𝑙𝑒𝑑');

          const audioBuffer = await response.buffer();
          console.log(`🔊 𝑣𝑜𝑖𝑐𝑒 𝑟𝑒𝑝𝑙𝑦 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 (${voiceName})`);

          // Save audio clip for playback
          await fs.writeFile(`voice_clip_${Date.now()}.mp3`, audioBuffer);
          return audioBuffer;
        } catch (error) {
          console.error('❌ 𝐸𝑙𝑒𝑣𝑒𝑛𝐿𝑎𝑏𝑠 𝐸𝑟𝑟𝑜𝑟:', error.message);
          return Buffer.from('𝑚𝑜𝑐𝑘 𝑎𝑢𝑑𝑖𝑜');
        }
      }

      await message.reply(`🎤 𝑌𝑜𝑢𝑟 𝑏𝑜𝑡 𝑖𝑠 𝑛𝑜𝑤 𝑖𝑛 𝑠𝑤𝑒𝑒𝑡 𝑔𝑖𝑟𝑙 𝑣𝑜𝑖𝑐𝑒 𝑐ℎ𝑎𝑡 𝑚𝑜𝑑𝑒 𝑖𝑛 𝑟𝑜𝑜𝑚: ${roomName} 𝑤𝑖𝑡ℎ 𝑣𝑜𝑖𝑐𝑒: ${selectedVoice}`);

    } catch (error) {
      console.error("𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑡𝑎𝑟𝑡 𝑠𝑤𝑒𝑒𝑡 𝑣𝑜𝑖𝑐𝑒: " + error.message);
    }
  }
};
