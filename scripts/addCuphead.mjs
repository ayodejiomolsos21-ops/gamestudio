import fs from 'fs';

const cupheadGame = {
  id: "cuphead",
  title: "Cuphead",
  category: "Arcade",
  description: "Classic run-and-gun action game heavily focused on boss battles, inspired by 1930s rubber hose cartoons with hand drawn cell animation and jazz soundtrack.",
  controls: "[WASD / Arrows] Move & Duck, [Z / Space] Jump, [X] Shoot, [C] Dash, [V] EX Move",
  iframeSrc: "cuphead.html",
  thumbnail: "",
  thumbnailGradient: "from-amber-500 via-rose-700 to-slate-950",
  iconName: "Flame",
  featured: true,
  rating: 5.0,
  plays: 165000
};

// Read current games.json
let currentGames = [];
try {
  currentGames = JSON.parse(fs.readFileSync('./public/games.json', 'utf8'));
} catch (e) {
  currentGames = [];
}

// Remove existing cuphead if any and unshift to top
currentGames = currentGames.filter(g => g.id !== 'cuphead');
currentGames.unshift(cupheadGame);

fs.writeFileSync('./public/games.json', JSON.stringify(currentGames, null, 2));

// Update defaultGames.js
const defaultGamesContent = `import { standaloneGameHtml, createDataUri, generatePlayableGameHtml } from './gameTemplates';

// Full initial games definition matching /public/games.json (${currentGames.length} games)
export const defaultGamesList = ${JSON.stringify(currentGames, null, 2)};

/**
 * Resolves the actual playable iframe URL or data URI from game config.
 */
export function resolveGameUrl(game) {
  if (!game) return 'about:blank';

  // 1. If iframeSrc points to an HTML file available in the public assets (e.g. cuphead.html, clADOFAI.html)
  if (game.iframeSrc && game.iframeSrc.endsWith('.html') && !game.iframeSrc.startsWith('http')) {
    const cleanPath = game.iframeSrc.replace(/^\\.?\\/+/, '');
    return \`/\${cleanPath}\`;
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
`;

fs.writeFileSync('./src/data/defaultGames.js', defaultGamesContent);
console.log(`Successfully added Cuphead! Total games: ${currentGames.length}`);
