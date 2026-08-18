import { standaloneGameHtml, createDataUri, generatePlayableGameHtml } from './gameTemplates';

// Default initial games definition matching /public/games.json (Single game)
export const defaultGamesList = [
  {
    id: 'a-dance-of-fire-and-ice',
    title: 'A Dance of Fire and Ice',
    category: 'Arcade',
    description: 'Strict rhythm and one-button precision timing challenge! Guide two orbiting planets down a winding cosmic path.',
    controls: 'Spacebar or Any Key / Mouse Click to tap on beat',
    iframeSrc: 'clADOFAI.html',
    iframeHtml: '<iframe src="clADOFAI.html" width="100%" height="100%" frameborder="0" allow="fullscreen; autoplay"></iframe>',
    thumbnail: '',
    thumbnailGradient: 'from-cyan-500 via-rose-600 to-slate-950',
    iconName: 'Flame',
    featured: true,
    rating: 4.9,
    plays: 58200
  }
];

/**
 * Resolves the actual playable iframe URL or data URI from game config.
 */
export function resolveGameUrl(game) {
  if (!game) return 'about:blank';

  // 1. Direct match in standaloneGameHtml by game.id
  if (standaloneGameHtml[game.id]) {
    return createDataUri(standaloneGameHtml[game.id]);
  }

  // 2. Direct match in standaloneGameHtml by iframeSrc (without .html or with)
  if (game.iframeSrc) {
    const cleanSrc = game.iframeSrc.replace('.html', '').replace('internal://', '');
    if (standaloneGameHtml[cleanSrc]) {
      return createDataUri(standaloneGameHtml[cleanSrc]);
    }
  }

  // 3. If iframeSrc starts with internal://
  if (game.iframeSrc && game.iframeSrc.startsWith('internal://')) {
    const gameId = game.iframeSrc.replace('internal://', '');
    if (standaloneGameHtml[gameId]) {
      return createDataUri(standaloneGameHtml[gameId]);
    }
  }

  // 4. If iframeSrc is an external web URL (http:// or https://) or already a data URI
  if (game.iframeSrc && (game.iframeSrc.startsWith('http://') || game.iframeSrc.startsWith('https://') || game.iframeSrc.startsWith('data:'))) {
    return game.iframeSrc;
  }

  // 5. If iframeHtml contains an external url
  if (game.iframeHtml) {
    const srcMatch = game.iframeHtml.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      const extractedSrc = srcMatch[1];
      if (extractedSrc.startsWith('http://') || extractedSrc.startsWith('https://') || extractedSrc.startsWith('data:')) {
        return extractedSrc;
      }
    }
    // If it has inline HTML markup / script
    if (game.iframeHtml.includes('<script') || game.iframeHtml.includes('<canvas') || game.iframeHtml.includes('<!DOCTYPE')) {
      return createDataUri(game.iframeHtml);
    }
  }

  // 6. Generate dynamic custom playable game engine HTML
  return createDataUri(generatePlayableGameHtml(game));
}
