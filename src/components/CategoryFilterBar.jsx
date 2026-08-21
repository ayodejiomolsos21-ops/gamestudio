import React from 'react';
import { 
  Gamepad2, 
  Flame, 
  Zap, 
  Users, 
  Cpu, 
  Ghost, 
  Sparkles, 
  Star, 
  Clock, 
  SlidersHorizontal, 
  ArrowUpDown,
  X,
  Filter,
  Globe
} from 'lucide-react';

export const CATEGORY_DEFINITIONS = [
  { id: 'All', label: 'All Games', icon: Gamepad2, color: 'cyan', description: 'Complete unblocked matrix' },
  { id: 'Idle', label: 'Idle & Clicker', icon: Zap, color: 'yellow', description: 'Automated incremental & clicker simulators' },
  { id: 'Multiplayer', label: 'Multiplayer / 2P', icon: Users, color: 'blue', description: 'Co-op & 2-player local duels' },
  { id: 'Simulation', label: 'Simulation', icon: Cpu, color: 'emerald', description: 'Physics sandboxes & realistic simulators' },
  { id: 'Horror', label: 'Horror & Survival', icon: Ghost, color: 'purple', description: 'Spooky cameras, liminal mazes & escapes' },
  { id: 'Arcade', label: 'Arcade & Rhythm', icon: Flame, color: 'rose', description: 'High precision timing & cosmic beats' },
  { id: 'RPG', label: 'RPG & Adventure', icon: Sparkles, color: 'pink', description: 'Episodic story RPGs & dark world battles' },
  { id: 'Favorites', label: 'Favorites', icon: Star, color: 'amber', description: 'Your starred bookmarks' },
  { id: 'Recent', label: 'Recent', icon: Clock, color: 'cyan', description: 'Recently launched games' },
];

export const SORT_OPTIONS = [
  { id: 'popular', label: 'Most Popular (Plays)' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'az', label: 'Alphabetical (A - Z)' },
  { id: 'za', label: 'Alphabetical (Z - A)' },
];

export const CategoryFilterBar = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  sortBy,
  onSortChange,
  searchQuery,
  onClearSearch,
  onOpenBrowserModal,
  totalGames,
  filteredCount
}) => {
  const isFiltering = selectedCategory !== 'All' || Boolean(searchQuery.trim());

  return (
    <div className="space-y-4">
      {/* Category Pills Bar */}
      <div className="bg-[#0b0e1a]/80 border border-[#1b233a] rounded-2xl p-2.5 sm:p-3 backdrop-blur-md shadow-xl shadow-cyan-950/20">
        <div className="flex items-center justify-between gap-3 mb-2.5 px-1">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono-cyber font-bold uppercase tracking-wider text-slate-300">
              FILTER MATRIX // CATEGORIES
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#07080e] border border-[#1b233a] rounded-lg px-2.5 py-1 text-xs font-mono-cyber">
              <ArrowUpDown className="w-3 h-3 text-cyan-400" />
              <span className="text-slate-500 hidden sm:inline">SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                aria-label="Sort games"
                className="bg-transparent text-cyan-200 outline-none cursor-pointer text-xs font-bold"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-[#0b0e1a] text-slate-200">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters button */}
            {isFiltering && (
              <button
                onClick={() => {
                  onSelectCategory('All');
                  onClearSearch();
                }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-pink-950/40 border border-pink-500/40 hover:bg-pink-900/60 text-pink-300 hover:text-white text-xs font-mono-cyber transition active:scale-95"
              >
                <X className="w-3 h-3" />
                <span className="hidden sm:inline">RESET</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
          {/* Dedicated Unblocked Browser launcher pill */}
          {onOpenBrowserModal && (
            <button
              id="filter-pill-browser"
              onClick={onOpenBrowserModal}
              className="whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-mono-cyber font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 border bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 text-emerald-300 border-emerald-500/60 hover:border-emerald-300 shadow-md shadow-emerald-950/40 hover:scale-105 active:scale-95"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>🌐 Web Browser</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                PORTAL
              </span>
            </button>
          )}

          {CATEGORY_DEFINITIONS.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;
            const count = categoryCounts[cat.id] ?? 0;

            // Accent color themes per category
            let activeStyle = 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/20';
            if (cat.id === 'Idle') activeStyle = 'bg-yellow-500/20 text-yellow-300 border-yellow-400 shadow-md shadow-yellow-500/20';
            if (cat.id === 'Multiplayer') activeStyle = 'bg-blue-500/20 text-blue-300 border-blue-400 shadow-md shadow-blue-500/20';
            if (cat.id === 'Simulation') activeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-md shadow-emerald-500/20';
            if (cat.id === 'Horror') activeStyle = 'bg-purple-500/20 text-purple-300 border-purple-400 shadow-md shadow-purple-500/20';
            if (cat.id === 'Arcade') activeStyle = 'bg-rose-500/20 text-rose-300 border-rose-400 shadow-md shadow-rose-500/20';
            if (cat.id === 'RPG') activeStyle = 'bg-pink-500/20 text-pink-300 border-pink-400 shadow-md shadow-pink-500/20';
            if (cat.id === 'Favorites') activeStyle = 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-md shadow-amber-500/20';

            return (
              <button
                key={cat.id}
                id={`filter-pill-${cat.id.toLowerCase()}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-mono-cyber font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 relative border ${
                  isSelected
                    ? activeStyle
                    : 'bg-[#07080e]/90 hover:bg-[#141829] text-slate-400 border-[#1c2236] hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${
                  isSelected
                    ? (cat.id === 'Favorites' ? 'fill-amber-400 text-amber-400' : '')
                    : 'text-slate-400'
                }`} />

                <span>{cat.label}</span>

                {/* Count Badge */}
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-800/80 text-slate-400'
                }`}>
                  {count}
                </span>

                {/* Active Indicator Glow */}
                {isSelected && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs font-mono-cyber text-slate-400">
        <div className="flex items-center gap-2">
          <span>SHOWING:</span>
          <span className="text-cyan-300 font-bold">
            {filteredCount} OF {totalGames} GAMES
          </span>
          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
              CATEGORY: {selectedCategory.toUpperCase()}
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-pink-950/60 border border-pink-500/30 text-pink-300">
              QUERY: "{searchQuery}"
            </span>
          )}
        </div>

        {/* Quick Category Jump Badges */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px]">
          <span className="text-slate-500">QUICK JUMP:</span>
          {['Idle', 'Multiplayer', 'Simulation', 'Horror'].map((quickCat) => (
            <button
              key={quickCat}
              onClick={() => onSelectCategory(quickCat)}
              className={`px-2 py-0.5 rounded border transition ${
                selectedCategory === quickCat
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                  : 'bg-[#0d101c] hover:bg-[#141829] text-slate-400 border-[#1c2236] hover:text-slate-300'
              }`}
            >
              #{quickCat.toLowerCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
