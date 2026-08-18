import React, { useState, useEffect, useMemo } from 'react';
import { 
  Gamepad2, 
  Flame, 
  Play, 
  Plus, 
  FileCode 
} from 'lucide-react';
import { defaultGamesList } from './data/defaultGames';
import { Header } from './components/Header';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { AddGameModal } from './components/AddGameModal';
import { JsonManagerModal } from './components/JsonManagerModal';
import { PanicSettingsModal, CLOAK_OPTIONS } from './components/PanicSettingsModal';
import ssj4GogetaIcon from './assets/images/ssj4_gogeta_icon_1787080126364.jpg';

const STORAGE_GAMES_KEY = 'unblocked_games_dataset_v5';
const STORAGE_FAVS_KEY = 'unblocked_games_favs_v5';
const STORAGE_RECENT_KEY = 'unblocked_games_recent_v5';
const STORAGE_CLOAK_KEY = 'unblocked_tab_cloak_v1';
const STORAGE_PANIC_KEY = 'unblocked_panic_key_v1';
const STORAGE_PANIC_URL = 'unblocked_panic_url_v1';

export default function App() {
  // State
  const [games, setGames] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_GAMES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load saved games:', e);
    }
    return defaultGamesList;
  });

  const [activeGame, setActiveGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FAVS_KEY);
      return saved ? JSON.parse(saved) : ['2048'];
    } catch {
      return ['2048'];
    }
  });

  const [recentIds, setRecentIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_RECENT_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isPanicModalOpen, setIsPanicModalOpen] = useState(false);

  // Tab Cloaking / Panic Settings
  const [selectedCloak, setSelectedCloak] = useState(() => {
    return localStorage.getItem(STORAGE_CLOAK_KEY) || 'default';
  });
  const [panicKey, setPanicKey] = useState(() => {
    return localStorage.getItem(STORAGE_PANIC_KEY) || 'Escape';
  });
  const [panicUrl, setPanicUrl] = useState(() => {
    return localStorage.getItem(STORAGE_PANIC_URL) || 'https://classroom.google.com';
  });

  // Save games whenever updated
  const updateGamesState = (newGames) => {
    setGames(newGames);
    localStorage.setItem(STORAGE_GAMES_KEY, JSON.stringify(newGames));
  };

  // Reset to default
  const handleResetDefaults = () => {
    setGames(defaultGamesList);
    localStorage.setItem(STORAGE_GAMES_KEY, JSON.stringify(defaultGamesList));
  };

  // Save favorites
  const toggleFavorite = (e, gameId) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(gameId) ? prev.filter(id => id !== gameId) : [...prev, gameId];
      localStorage.setItem(STORAGE_FAVS_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Play Game
  const handlePlayGame = (game) => {
    setActiveGame(game);
    // Increment plays count in memory
    setGames(prev =>
      prev.map(g => (g.id === game.id ? { ...g, plays: g.plays + 1 } : g))
    );
    // Track in recent
    setRecentIds(prev => {
      const next = [game.id, ...prev.filter(id => id !== game.id)].slice(0, 15);
      localStorage.setItem(STORAGE_RECENT_KEY, JSON.stringify(next));
      return next;
    });
    // Scroll top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add custom game
  const handleAddCustomGame = (newGame) => {
    const updated = [newGame, ...games];
    updateGamesState(updated);
    handlePlayGame(newGame);
  };

  // Tab cloaking effect
  const handleApplyCloak = (option) => {
    setSelectedCloak(option.id);
    localStorage.setItem(STORAGE_CLOAK_KEY, option.id);

    if (option.id === 'default') {
      document.title = 'Game Studio';
    } else {
      document.title = option.title;
      // Change favicon if provided
      if (option.icon && (option.icon.startsWith('http') || option.icon.startsWith('data:'))) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = option.icon;
      }
    }
  };

  // Trigger Instant Panic Redirect
  const triggerPanic = () => {
    window.location.href = panicUrl || 'https://classroom.google.com';
  };

  // Listen for Global Panic Key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === panicKey) {
        e.preventDefault();
        triggerPanic();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panicKey, panicUrl]);

  // Filtered games list
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      // Category filter
      if (selectedCategory === 'Favorites') {
        if (!favorites.includes(game.id)) return false;
      } else if (selectedCategory === 'Recent') {
        if (!recentIds.includes(game.id)) return false;
      } else if (selectedCategory !== 'All') {
        if (game.category !== selectedCategory) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = game.title?.toLowerCase().includes(q);
        const matchesDesc = game.description?.toLowerCase().includes(q);
        const matchesCat = game.category?.toLowerCase().includes(q);
        const matchesCtrl = game.controls?.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesCat || matchesCtrl;
      }

      return true;
    });
  }, [games, selectedCategory, searchQuery, favorites, recentIds]);

  // Featured Game for Spotlight Banner
  const featuredGame = useMemo(() => {
    return games.find(g => g.featured) || games[0];
  }, [games]);

  // Related games for active player
  const relatedGames = useMemo(() => {
    if (!activeGame) return [];
    return games
      .filter(g => g.id !== activeGame.id && g.category === activeGame.category)
      .slice(0, 4);
  }, [games, activeGame]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (activeGame) setActiveGame(null);
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onOpenPanicModal={() => setIsPanicModalOpen(true)}
        onPanicTrigger={triggerPanic}
        favoritesCount={favorites.length}
        totalGamesCount={games.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeGame ? (
          /* Active Game Player Mode */
          <GamePlayer
            game={activeGame}
            onBack={() => setActiveGame(null)}
            isFavorite={favorites.includes(activeGame.id)}
            onToggleFavorite={toggleFavorite}
            relatedGames={relatedGames}
            onSelectGame={handlePlayGame}
          />
        ) : (
          /* Games Catalog View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
            {/* Spotlight Banner (when on 'All' and no active search) */}
            {selectedCategory === 'All' && !searchQuery.trim() && featuredGame && (
              <div className="relative rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border border-purple-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
                <div className="absolute right-0 top-0 -mt-8 -mr-8 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    <Flame className="w-3.5 h-3.5 text-orange-400" /> Featured Unblocked Pick
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {featuredGame.title}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 line-clamp-2 leading-relaxed">
                    {featuredGame.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      id="hero-play-btn"
                      onClick={() => handlePlayGame(featuredGame)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all duration-200 flex items-center gap-2 active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-white" /> Play Now
                    </button>
                    <button
                      id="hero-add-custom-btn"
                      onClick={() => setIsAddModalOpen(true)}
                      className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold text-xs transition flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Add Custom Iframe
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Catalog Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  {selectedCategory === 'Favorites'
                    ? 'Your Favorited Games'
                    : selectedCategory === 'Recent'
                    ? 'Recently Played'
                    : `${selectedCategory} Games`}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400">
                  {filteredGames.length}
                </span>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsJsonModalOpen(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition"
                >
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View JSON</span>
                </button>
              </div>
            </div>

            {/* Games Grid */}
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onPlay={handlePlayGame}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="py-20 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400">
                  <Gamepad2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">No games found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {searchQuery
                      ? `No games matching "${searchQuery}". Try searching another title or category.`
                      : 'No games in this list yet.'}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                    >
                      Clear Search
                    </button>
                  )}
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Iframe Game
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#1b233a] bg-[#07080e] py-6 text-center text-xs text-slate-500 font-mono-cyber">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={ssj4GogetaIcon} 
              alt="SSJ4 Gogeta" 
              className="w-6 h-6 rounded-md object-cover border border-cyan-500/40"
              referrerPolicy="no-referrer"
            />
            <span className="font-orbitron font-bold text-slate-200">GAME STUDIO</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">GAME STUDIO BY AYODEJI OMOLOSO</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>PANIC KEY: <kbd className="px-1.5 py-0.5 rounded bg-[#141829] border border-pink-500/40 text-pink-300 font-bold">{panicKey}</kbd></span>
            <button
              onClick={() => setIsPanicModalOpen(true)}
              className="text-pink-400 hover:text-pink-300 transition underline underline-offset-2"
            >
              STEALTH CLOAK
            </button>
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 transition underline underline-offset-2"
            >
              GAMES.JSON MATRIX
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddCustomGame}
      />

      <JsonManagerModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
        onSaveGames={updateGamesState}
        onResetDefaults={handleResetDefaults}
      />

      <PanicSettingsModal
        isOpen={isPanicModalOpen}
        onClose={() => setIsPanicModalOpen(false)}
        selectedCloak={selectedCloak}
        onSelectCloak={handleApplyCloak}
        panicKey={panicKey}
        onChangePanicKey={(k) => {
          setPanicKey(k);
          localStorage.setItem(STORAGE_PANIC_KEY, k);
        }}
        panicUrl={panicUrl}
        onChangePanicUrl={(u) => {
          setPanicUrl(u);
          localStorage.setItem(STORAGE_PANIC_URL, u);
        }}
      />
    </div>
  );
}
