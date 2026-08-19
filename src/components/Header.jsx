import React from 'react';
import { 
  Search, 
  Plus, 
  FileCode, 
  ShieldAlert, 
  Star, 
  Sparkles, 
  X, 
  Flame, 
  Clock 
} from 'lucide-react';
import ssj4GogetaIcon from '../assets/images/ssj4_gogeta_icon_1787080126364.jpg';

const CATEGORIES = [
  'All',
  'Idle',
  'Multiplayer',
  'Simulation',
  'Horror',
  'Arcade',
  'RPG',
  'Favorites',
  'Recent'
];

export const Header = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenAddModal,
  onOpenJsonModal,
  onOpenPanicModal,
  onPanicTrigger,
  favoritesCount,
  totalGamesCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1c2333] bg-[#090b12]/95 backdrop-blur-xl shadow-lg shadow-cyan-950/20">
      {/* Cyber Accent Top Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500 via-pink-500 to-yellow-400 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          {/* Logo & Cyberpunk Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0" 
            onClick={() => onSelectCategory('All')}
          >
            <div className="relative w-11 h-11 rounded-lg bg-gradient-to-br from-cyan-500 via-pink-500 to-yellow-400 p-[2px] shadow-lg shadow-pink-500/25 group-hover:shadow-cyan-400/60 transition-all duration-300">
              <div className="w-full h-full bg-[#0d0f18] rounded-[6px] overflow-hidden flex items-center justify-center">
                <img 
                  src={ssj4GogetaIcon} 
                  alt="SSJ4 Gogeta Game Studio Logo" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping opacity-75" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-black text-base sm:text-lg tracking-wider text-white">
                  GAME<span className="text-cyan-400 neon-text-cyan">STUDIO</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono-cyber font-bold bg-cyan-950/70 text-cyan-300 border border-cyan-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5 animate-pulse" />
                  ONLINE // {totalGamesCount}
                </span>
              </div>
              <p className="text-[10px] font-mono-cyber text-slate-400 flex items-center gap-1.5 tracking-wider">
                <span className="text-pink-400 font-semibold">BY AYODEJI OMOLOSO</span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="text-yellow-400 hidden sm:inline">MATRIX 240Hz</span>
              </p>
            </div>
          </div>

          {/* Cyberpunk Search Terminal Box */}
          <div className="flex-1 max-w-md mx-1 sm:mx-2">
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-cyan-400 font-mono-cyber text-xs">
                &gt;_
              </div>
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="EXECUTE SEARCH // [name, category, controls]"
                className="w-full bg-[#0d101c] border border-cyan-950/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-lg pl-9 pr-8 py-2 text-xs sm:text-sm font-mono-cyber text-cyan-100 placeholder-slate-500 outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-pink-400 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              {/* Corner tech accent tick */}
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400/40 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400/40 pointer-events-none" />
            </div>
          </div>

          {/* Action HUD Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Panic Abort Button */}
            <button
              id="panic-quick-btn"
              onClick={onPanicTrigger}
              title="EMERGENCY ABORT! Instantly redirect tab"
              className="px-2.5 sm:px-3 py-2 rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-500/60 text-red-300 hover:text-white text-xs font-mono-cyber font-bold flex items-center gap-1.5 transition-all shadow-md shadow-red-950/50 active:scale-95 group"
            >
              <ShieldAlert className="w-4 h-4 text-red-400 group-hover:animate-bounce" />
              <span className="hidden md:inline uppercase tracking-wider">Panic</span>
            </button>

            {/* Neural Cloak Disguise */}
            <button
              id="tab-cloak-btn"
              onClick={onOpenPanicModal}
              title="Stealth Neural Cloak (Disguise browser tab title & favicon)"
              className="p-2 sm:px-3 sm:py-2 rounded-lg bg-[#0d101c] hover:bg-[#15192b] border border-pink-500/30 hover:border-pink-400 text-pink-300 hover:text-white text-xs font-mono-cyber font-semibold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden lg:inline uppercase tracking-wider">Cloak Tab</span>
            </button>

            {/* JSON Terminal Data Manager */}
            <button
              id="json-manager-btn"
              onClick={onOpenJsonModal}
              title="Manage JSON Database (Export, Import, Edit iframe matrix)"
              className="p-2 sm:px-3 sm:py-2 rounded-lg bg-[#0d101c] hover:bg-[#15192b] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-mono-cyber font-semibold flex items-center gap-1.5 transition-all"
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline uppercase tracking-wider">games.json</span>
            </button>

            {/* Inject Custom Game */}
            <button
              id="add-game-btn"
              onClick={onOpenAddModal}
              className="px-3 sm:px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-slate-950 font-orbitron font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline tracking-wide">+ ADD GAME</span>
            </button>
          </div>
        </div>

        {/* Category Cyber Chips Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar border-t border-[#131726]">
          {CATEGORIES.map((category, idx) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                id={`cat-btn-${category.toLowerCase()}`}
                onClick={() => onSelectCategory(category)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-mono-cyber font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 relative border ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-[#0d101c]/70 hover:bg-[#141829] text-slate-400 border-[#1c2236] hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {/* Tech prefix indicator */}
                <span className={`text-[9px] ${isSelected ? 'text-pink-400' : 'text-slate-600'}`}>
                  0{idx+1}
                </span>

                {category === 'Favorites' && (
                  <Star className={`w-3 h-3 ${isSelected ? 'text-yellow-300 fill-yellow-300' : 'text-yellow-400 fill-yellow-400'}`} />
                )}
                {category === 'Recent' && (
                  <Clock className="w-3 h-3 text-cyan-400" />
                )}
                {category === 'Action' && <Flame className="w-3 h-3 text-orange-400" />}
                
                <span>{category}</span>

                {category === 'Favorites' && favoritesCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 font-bold">
                    {favoritesCount}
                  </span>
                )}

                {/* Cyber active corner indicator */}
                {isSelected && (
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-pink-500 rounded-bl" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
