import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy-initialized Gemini client with telemetry header
  let aiClient: GoogleGenAI | null = null;
  function getAiClient(): GoogleGenAI {
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // Health check API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Server-side Gemini AI Chat Assistant
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, history, currentGame, systemContext } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const ai = getAiClient();

      // System instruction for Game Studio AI Assistant
      const systemInstruction = `You are "CYBER-AI // Game Studio AI Assistant & Gaming Copilot" created for Game Studio by Ayodeji Omoloso.
You are a knowledgeable, witty, and helpful AI gaming companion.

Your Core Capabilities:
1. Provide in-depth strategies, boss tactics, hidden secrets, and speedrun tricks for classic & popular web/retro games (e.g. Cuphead, FNAF / Five Nights at Freddy's, Super Mario 64, Slope, Retro Bowl, Cookie Clicker, Subway Surfers, BitLife, 1v1.LOL, Geometry Dash, Paper.io 2, Run 3, Drift Boss, Crossy Road, Cut the Rope, Flappy Bird, Bad Ice Cream, etc.).
2. Recommend games based on user preferences, genres (Idle, Horror, Multiplayer, Simulation, Arcade, RPG), or gameplay style.
3. Provide keyboard controls, cheat codes, mechanics breakdowns, and walkthroughs.
4. Assist users with adding custom web games (explaining iframe embeds, HTTPS URLs, and JSON dataset management).
5. Always format responses cleanly with markdown: bold headings, bulleted tips, step-by-step guides, and clean code blocks if showing JSON or iframe links.
${currentGame ? `CURRENT CONTEXT: The user is currently playing: "${currentGame.title}" (Category: ${currentGame.category}, Controls: ${currentGame.controls || 'N/A'}, Rating: ${currentGame.rating || 'N/A'}). Provide relevant advice for this game if the user asks!` : ''}
${systemContext ? `ADDITIONAL CONTEXT: ${systemContext}` : ''}`;

      // Build contents array with history
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
      if (Array.isArray(history) && history.length > 0) {
        for (const h of history) {
          if (h && (h.role === 'user' || h.role === 'model') && typeof h.text === 'string' && h.text.trim()) {
            contents.push({
              role: h.role,
              parts: [{ text: h.text }],
            });
          }
        }
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "I processed your request, but received an empty response. How else can I assist your gaming session?";
      return res.json({ reply: replyText });
    } catch (error: any) {
      console.error('Gemini API error:', error);
      const isMissingKey = !process.env.GEMINI_API_KEY;
      return res.status(500).json({
        error: error.message || 'Failed to generate AI response',
        isMissingKey,
        fallbackReply: isMissingKey
          ? "⚠️ GEMINI API KEY is not set in environment secrets. You can configure your key in AI Studio Settings > Secrets. However, here are quick default gaming tips: Cuphead requires mastering parries (Pink objects), FNAF 1 requires camera 1C and door audio cues, and Super Mario 64 requires long-jumping (Z + A)!"
          : "⚡ Neural link connection failed temporarily. Please try asking again in a moment!",
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
