import { standaloneGameHtml, createDataUri, generatePlayableGameHtml } from './gameTemplates';

// Default initial games definition matching /public/games.json (Single game with Unity WebGL)
export const defaultGamesList = [
  {
    id: "a-dance-of-fire-and-ice",
    title: "A Dance of Fire and Ice",
    category: "Arcade",
    description: "Strict rhythm and one-button precision timing challenge! Guide two orbiting cosmic spheres down winding tracks.",
    controls: "Spacebar / Z / X / Click on beat",
    iframeSrc: "clADOFAI.html",
    iframeHtml: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/paigerodeghero/academicwebsite@897c910c65e6c68b04c44a6b6eba0b99d0f2f2cf/TemplateData/style.css"> <script src="https://cdn.jsdelivr.net/gh/paigerodeghero/academicwebsite@897c910c65e6c68b04c44a6b6eba0b99d0f2f2cf/TemplateData/UnityProgress.js"></script> <script src="https://cdn.jsdelivr.net/gh/udbsite/adofai@f170efcb1b532312817e69f26ce3f84c99940238/Build/UnityLoader.js"></script> <script> var gameInstance = UnityLoader.instantiate("gameContainer", "https://cdn.jsdelivr.net/gh/udbsite/adofai@f170efcb1b532312817e69f26ce3f84c99940238/Build/adofaiii4.json", {onProgress: UnityProgress,Module:{onRuntimeInitialized: function() {UnityProgress(gameInstance, "complete")}}}); </script> <div class="webgl-content"> <div id="gameContainer" style="width: 100vw; height: 100vh"></div> </div>',
    thumbnail: "",
    thumbnailGradient: "from-cyan-500 via-rose-600 to-slate-950",
    iconName: "Flame",
    featured: true,
    rating: 4.9,
    plays: 74200
  },
  {
    id: "deltarune",
    title: "Deltarune",
    category: "RPG",
    description: "Step into the Dark World in Toby Fox's acclaimed episodic RPG. Master bullet-hell dodging, act or fight, and make your destiny.",
    controls: "Arrow Keys to Move, [Z] Confirm / Action, [X] Cancel / Dash, [C] Menu",
    iframeSrc: "deltarune.html",
    iframeHtml: '<script>\n    launch();\n    function launch() {\n      try {\n        fetch("https://cdn.jsdelivr.net/gh/regedit-sys/web-port@main/deltarune/free.html?t="+Date.now())\n          .then(response => response.text())\n          .then(html => {\n                document.documentElement.innerHTML = html;\n                document.documentElement.querySelectorAll(\'script\').forEach(oldScript => {\n                    const newScript = document.createElement(\'script\');\n                    if (oldScript.src) {\n                        newScript.src = oldScript.src;\n                    } else {\n                        newScript.textContent = oldScript.textContent;\n                    }\n                    document.body.appendChild(newScript);\n                });\n          });\n      } catch (error) {\n        console.error(\'error:\', error);\n      }\n    }\n  </script>',
    thumbnail: "",
    thumbnailGradient: "from-purple-600 via-pink-600 to-slate-950",
    iconName: "Sparkles",
    featured: true,
    rating: 4.9,
    plays: 98400
  },
  {
    id: "sonic-3d-blast",
    title: "Sonic 3D Blast",
    category: "Platformer",
    description: "The classic isometric 3D Sonic adventure! Rescue the Flickies from Dr. Robotnik across vibrant isometric zones with genuine Mega Drive emulation.",
    controls: "Arrow Keys: Move | [Z]/[X]/[C]: Spin Dash & Jump | [Enter]: Start",
    iframeSrc: "clsonic3dblast.html",
    iframeHtml: "",
    thumbnail: "",
    thumbnailGradient: "from-blue-600 via-cyan-500 to-slate-950",
    iconName: "Zap",
    featured: true,
    rating: 4.8,
    plays: 65100
  },
  {
    id: "sonic-jam",
    title: "Sonic Jam",
    category: "Retro",
    description: "The classic Sega Sonic compilation featuring iconic adventures, special stages, and high-speed platforming nostalgia.",
    controls: "Arrow Keys: Directional Pad | [Z]/[X]: Action & Jump | [Enter]: Start",
    iframeSrc: "clsonicjam.html",
    iframeHtml: "",
    thumbnail: "",
    thumbnailGradient: "from-amber-500 via-orange-600 to-slate-950",
    iconName: "Disc",
    featured: true,
    rating: 4.7,
    plays: 54200
  },
  {
    id: "sonic-r",
    title: "Sonic R",
    category: "Racing",
    description: "The authentic 3D foot-racing classic! Race as Sonic, Tails, Knuckles, and Amy across 5 intricate 3D tracks with high-tempo eurobeat soundtrack.",
    controls: "Arrow Keys: Steer/Accelerate | [Z]: Jump/Action | [X]: Drift | [Enter]: Start",
    iframeSrc: "clsonicr.html",
    iframeHtml: "",
    thumbnail: "",
    thumbnailGradient: "from-red-600 via-yellow-500 to-slate-950",
    iconName: "Trophy",
    featured: true,
    rating: 4.8,
    plays: 83900
  }
];

/**
 * Resolves the actual playable iframe URL or data URI from game config.
 */
export function resolveGameUrl(game) {
  if (!game) return 'about:blank';

  // 1. If iframeSrc points to an HTML file available in the public assets (e.g. clADOFAI.html)
  if (game.iframeSrc && game.iframeSrc.endsWith('.html') && !game.iframeSrc.startsWith('http')) {
    const cleanPath = game.iframeSrc.replace(/^\.?\/+/, '');
    // Return root path so the browser fetches the standalone HTML directly
    return `/${cleanPath}`;
  }

  // 2. Direct match in standaloneGameHtml by game.id
  if (standaloneGameHtml[game.id]) {
    return createDataUri(standaloneGameHtml[game.id]);
  }

  // 3. Direct match in standaloneGameHtml by iframeSrc (without .html or with)
  if (game.iframeSrc) {
    const cleanSrc = game.iframeSrc.replace('.html', '').replace('internal://', '');
    if (standaloneGameHtml[cleanSrc]) {
      return createDataUri(standaloneGameHtml[cleanSrc]);
    }
  }

  // 4. If iframeSrc starts with internal://
  if (game.iframeSrc && game.iframeSrc.startsWith('internal://')) {
    const gameId = game.iframeSrc.replace('internal://', '');
    if (standaloneGameHtml[gameId]) {
      return createDataUri(standaloneGameHtml[gameId]);
    }
  }

  // 5. If iframeSrc is an external web URL (http:// or https://) or already a data URI
  if (game.iframeSrc && (game.iframeSrc.startsWith('http://') || game.iframeSrc.startsWith('https://') || game.iframeSrc.startsWith('data:'))) {
    return game.iframeSrc;
  }

  // 6. If iframeHtml contains an external url
  if (game.iframeHtml) {
    const srcMatch = game.iframeHtml.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      const extractedSrc = srcMatch[1];
      if (extractedSrc.startsWith('http://') || extractedSrc.startsWith('https://') || extractedSrc.startsWith('data:')) {
        return extractedSrc;
      }
    }
    // If it has inline HTML markup / script
    if (game.iframeHtml.includes('<script') || game.iframeHtml.includes('<canvas') || game.iframeHtml.includes('<!DOCTYPE') || game.iframeHtml.includes('<link')) {
      return createDataUri(game.iframeHtml);
    }
  }

  // 7. Generate dynamic custom playable game engine HTML
  return createDataUri(generatePlayableGameHtml(game));
}
