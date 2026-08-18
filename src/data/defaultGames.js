import { standaloneGameHtml, createDataUri } from './gameTemplates';

// Default initial games definition matching /public/games.json
export const defaultGamesList = [
  {
    id: '2048',
    title: '2048 Classic',
    category: 'Puzzle',
    description: 'Join the numbers and get to the 2048 tile! Slide matching numbers together to merge them.',
    controls: 'Arrow keys or WASD / Swipe on Mobile',
    iframeSrc: 'internal://2048',
    iframeHtml: '<iframe src="internal://2048" width="100%" height="100%" frameborder="0" allow="fullscreen; autoplay"></iframe>',
    thumbnail: '',
    thumbnailGradient: 'from-amber-500 to-orange-600',
    iconName: 'Hash',
    featured: true,
    rating: 4.9,
    plays: 12450
  }
];

/**
 * Resolves the actual playable iframe URL or data URI from game config.
 */
export function resolveGameUrl(game) {
  // If iframeSrc starts with internal://
  if (game.iframeSrc && game.iframeSrc.startsWith('internal://')) {
    const gameId = game.iframeSrc.replace('internal://', '');
    if (standaloneGameHtml[gameId]) {
      return createDataUri(standaloneGameHtml[gameId]);
    }
  }

  // If iframeHtml is provided, try extracting src="..."
  if (game.iframeHtml) {
    const srcMatch = game.iframeHtml.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      const extractedSrc = srcMatch[1];
      if (extractedSrc.startsWith('internal://')) {
        const gameId = extractedSrc.replace('internal://', '');
        if (standaloneGameHtml[gameId]) {
          return createDataUri(standaloneGameHtml[gameId]);
        }
      }
      return extractedSrc;
    }
    // If it is raw HTML snippet inside iframeHtml
    if (!game.iframeSrc && game.iframeHtml.includes('<')) {
      return createDataUri(game.iframeHtml);
    }
  }

  if (game.iframeSrc) {
    return game.iframeSrc;
  }

  // Fallback to internal template by game id if available
  if (standaloneGameHtml[game.id]) {
    return createDataUri(standaloneGameHtml[game.id]);
  }

  return 'about:blank';
}
