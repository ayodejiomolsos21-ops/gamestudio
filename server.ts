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

      if (process.env.GEMINI_API_KEY) {
        try {
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

          // Attempt primary model, then fallback models if experiencing temporary 503 high-demand spikes
          const candidateModels = ['gemini-3.7-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
          let response = null;
          let lastError: any = null;

          for (const modelName of candidateModels) {
            try {
              response = await ai.models.generateContent({
                model: modelName,
                contents: contents,
                config: {
                  systemInstruction: systemInstruction,
                  temperature: 0.7,
                },
              });
              if (response && response.text) break;
            } catch (err: any) {
              lastError = err;
              // If model is experiencing temporary 503 / 429 high demand, try next available candidate model
              const errMsg = err?.message || '';
              if (errMsg.includes('503') || errMsg.includes('high demand') || errMsg.includes('429')) {
                continue;
              }
              break;
            }
          }

          if (response && response.text) {
            return res.json({ reply: response.text });
          } else if (lastError) {
            throw lastError;
          }
        } catch (apiError: any) {
          // Log only brief warning, then seamlessly serve built-in tactical knowledge
          console.warn('Gemini temporary high demand/offline, using copilot matrix knowledge:', apiError?.message?.substring(0, 100));
        }
      }

      // Intelligent Built-in Copilot Knowledge Engine (Fallback & Offline)
      const q = message.toLowerCase();
      let reply = '';

      if (q.includes('fnaf') || q.includes('freddy') || q.includes('night 5')) {
        reply = `### 🐻 Five Nights at Freddy's 1 // Night 5 Master Strategy

To survive Night 5, you must conserve power strictly and follow a disciplined camera routine:

1. **Power Management Rules:**
   - Keep doors open unless an animatronic is literally at the doorway.
   - Limit camera usage to checking **CAM 1C (Pirate Cove)** and **CAM 4B (East Hall Corner)**.
   - Never turn on both hallway lights simultaneously.

2. **Foxy Management (Pirate Cove - CAM 1C):**
   - Check CAM 1C every 5-7 seconds. If Foxy is gone, immediately slam down your monitor, shut the **LEFT DOOR**, and switch to CAM 2A to watch him sprint down the hall.

3. **Freddy Tactics (CAM 4B):**
   - Freddy laughs every time he moves. When he reaches the East Hall Corner (CAM 4B right outside your office), keep your camera locked on CAM 4B to stall him, or shut the **RIGHT DOOR** before opening your monitor.

4. **Bonnie & Chica:**
   - Rely strictly on rapid door lights (\`Light -> Look -> Off\`). Shut the corresponding door only when their shadow or face appears in the doorway.`;
      } else if (q.includes('cuphead') || q.includes('boss')) {
        reply = `### ☕ Cuphead // Boss Tactic Blueprint & Loadout Guide

1. **Optimal Early-Game Weapon Loadout:**
   - **Spread (Shotgun):** Highest DPS in the game when standing close to large bosses like *The Root Pack* and *Cagney Carnation*.
   - **Chaser (Homing):** Essential for chaotic phases (*Ribby & Croaks*, *Baroness Von Bon Bon*) so you can focus 100% on dodging.
   - **Smoke Bomb (Charm):** Grants invincible dash frames—indispensable for phasing through projectiles and boss hitboxes.

2. **Parry Discipline (Pink Objects):**
   - Slap your jump button mid-air on any pink object (spores, teardrops, butterflies) to instantly fill your EX Super card meter.

3. **Super Art Strategy:**
   - Save your 5-card EX meter for **Super Art I (Energy Beam)** during the final, hardest phase of each boss to skip their dangerous mechanics.`;
      } else if (q.includes('mario') || q.includes('sm64') || q.includes('speedrun') || q.includes('blj')) {
        reply = `### ⭐ Super Mario 64 // Movement & Speedrun Techniques

1. **Backward Long Jump (BLJ):**
   - Crouch (\`Z\` on N64) and Long Jump (\`A\`) backward up stairs while mashing the Jump button rapidly. This accumulates negative forward velocity to bypass 50-Star and 70-Star doors!

2. **Triple Jump Wall Kick:**
   - Run -> Jump -> Jump -> Jump -> tap opposite direction on joystick + \`A\` against walls to reach elevated ledges early.

3. **Ground Pound Dive Cancel:**
   - In mid-air: Press \`Z\` (Ground Pound) followed immediately by \`B\` (Dive) to launch Mario forward with high horizontal momentum.`;
      } else if (q.includes('slope') || q.includes('high score')) {
        reply = `### ⚡ Slope // 200+ Score Pro Guide

1. **Micro-Tapping Over Holding:** Never hold down the arrow keys or \`A\`/\`D\`. Use rapid micro-taps to make fine trajectory adjustments.
2. **Tunnel Vision Avoidance:** Look 2-3 platforms ahead rather than staring directly at your ball.
3. **Stay Centered:** Always return to the center of each slope segment before launching onto ramps or red-tile sections.`;
      } else if (q.includes('custom') || q.includes('iframe') || q.includes('add game') || q.includes('json')) {
        reply = `### 🛠️ Adding Custom Games to Game Studio

1. **Using the UI:** Click the **\`+ ADD CUSTOM GAME\`** button in the header HUD to open the modal.
2. **Iframe Requirements:** The game URL must support HTTPS and allow cross-origin iframe embedding (e.g. GitHub Pages, itch.io embed links, WebGL CDN mirrors).
3. **JSON Matrix Sync:** Use the **\`JSON MATRIX\`** button in the header to export your library or import custom datasets!`;
      } else if (q.includes('2 player') || q.includes('two player') || q.includes('friend') || q.includes('multiplayer')) {
        reply = `### 👥 Best 2-Player & Multiplayer Games on Game Studio

Here are the top picks for playing with friends:
- 🧊 **Bad Ice Cream 1, 2, & 3**: Classic cooperative/competitive retro arcade action on the same keyboard.
- 🎯 **1v1.LOL**: Competitive third-person building and shooter showdown.
- 🚗 **Smash Karts**: 3D multiplayer arena kart combat with power-ups.
- 🏐 **Basket Random & Soccer Random**: Hilarious ragdoll physics 2-player sports.
- 👑 **Paper.io 2 & Agar.io**: Real-time territory capture and size domination.`;
      } else {
        reply = `### 🎮 CYBER-AI // Game Studio Copilot Analysis

Here is tactical gaming guidance for your query:

- **Featured Game Library:** Browse through 50+ unblocked games across **Retro, Action, Idle, 2-Player, Simulator, and Speed** categories.
- **Controls & Performance:** Use fullscreen mode or launch in a clean cloaked tab via the **Panic & Cloak Settings** (\`Esc\` or custom hotkey).
- **Pro Tip:** Need specific boss patterns, keyboard bindings, or speedrun routes? Ask about any specific game like *Cuphead, FNAF, Super Mario 64, Slope, Cookie Clicker, or Retro Bowl*!`;
      }

      return res.json({ reply });
    } catch (error: any) {
      console.error('Chat endpoint error:', error);
      return res.json({
        reply: `### ⚡ Game Studio Copilot
Here are quick essential tips for your session:
- Use **Fullscreen** for optimal framerate and control responsiveness.
- Configure your **Panic Key** (default: \`P\`) in the top HUD for instant cloaking.
- What specific game or boss would you like a walkthrough for?`
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
