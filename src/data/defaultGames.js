import { standaloneGameHtml, createDataUri, generatePlayableGameHtml } from './gameTemplates';

// Default initial games definition matching /public/games.json (Single game)
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
