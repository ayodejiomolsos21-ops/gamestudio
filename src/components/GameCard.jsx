import React from 'react';
import { 
  Play, 
  Star, 
  Flame, 
  Layers, 
  Hash, 
  Grid3X3, 
  Zap, 
  Feather, 
  Radio, 
  Sparkles, 
  Navigation, 
  Activity, 
  Crosshair, 
  CircleDot, 
  X,
  Code2,
  Terminal,
  Gamepad2,
  Gamepad,
  Skull,
  Moon,
  Coins,
  Anchor,
  Plane,
  Globe,
  Swords,
  Rocket,
  Shield,
  Cloud,
  Users,
  Target,
  Trees,
  Atom,
  Snowflake,
  Waves,
  Trophy,
  Compass,
  Ghost,
  Briefcase,
  Key,
  Eye,
  Building,
  Heart,
  Dices
} from 'lucide-react';

const ICON_MAP = {
  Flame,
  Moon,
  Zap,
  Coins,
  Anchor,
  Plane,
  Globe,
  Swords,
  Rocket,
  Layers,
  Shield,
  Cloud,
  Users,
  Target,
  Crosshair,
  Feather,
  Trees,
  Atom,
  Snowflake,
  Sparkles,
  Waves,
  Trophy,
  Compass,
  Skull,
  Gamepad2,
  Gamepad,
  Ghost,
  Briefcase,
  Key,
  Eye,
  Building,
  Heart,
  Dices,
  Hash,
  Grid3X3,
  Radio,
  Navigation,
  Activity,
  CircleDot,
  Terminal
};

// Icon helper
const renderIcon = (name) => {
  const IconComponent = ICON_MAP[name] || Gamepad2;
  return <IconComponent className="w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />;
};

export const GameCard = ({
  game,
  onPlay,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <div
      id={`game-card-${game.id}`}
      onClick={() => onPlay(game)}
      className="group relative flex flex-col rounded-xl bg-[#0c0e18] border border-[#1a2138] hover:border-cyan-400/80 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-cyan-500/15 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
    >
      {/* Cyber Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400/60 z-30 group-hover:border-cyan-300" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400/60 z-30 group-hover:border-cyan-300" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-pink-500/60 z-30 group-hover:border-pink-400" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-pink-500/60 z-30 group-hover:border-pink-400" />

      {/* Thumbnail Banner */}
      <div
        className={`relative w-full h-40 bg-gradient-to-br ${
          game.thumbnailGradient || 'from-cyan-900 via-indigo-950 to-slate-950'
        } flex items-center justify-center overflow-hidden`}
      >
        {/* Cyber scanline overlay */}
        <div className="absolute inset-0 cyber-scanlines opacity-40 z-10 pointer-events-none" />

        {/* Abstract neon background glows */}
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-cyan-500/20 rounded-full blur-xl group-hover:scale-150 group-hover:bg-cyan-400/30 transition-all duration-500" />
        <div className="absolute -left-6 -top-6 w-24 h-24 bg-pink-500/20 rounded-full blur-lg" />

        {/* Thumbnail icon or image */}
        {game.thumbnail ? (
          <img
            src={game.thumbnail}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="relative z-10 flex flex-col items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
            {renderIcon(game.iconName)}
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-20">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono-cyber font-bold uppercase tracking-wider bg-[#080a12]/90 text-cyan-300 border border-cyan-500/40 backdrop-blur-sm shadow-sm">
            {game.category}
          </span>
          {game.isCustom && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-cyber font-bold bg-pink-950/90 text-pink-300 border border-pink-500/50 backdrop-blur-sm flex items-center gap-1">
              <Code2 className="w-3 h-3" /> CUSTOM
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          id={`fav-btn-${game.id}`}
          onClick={(e) => onToggleFavorite(e, game.id)}
          title={isFavorite ? 'Remove from neural favorites' : 'Add to neural favorites'}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition-all z-20 border ${
            isFavorite
              ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-md shadow-yellow-400/40 scale-105 font-bold'
              : 'bg-[#080a12]/80 text-slate-400 border-slate-700 hover:text-yellow-400 hover:border-yellow-400/50'
          }`}
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-slate-950 text-slate-950' : ''}`} />
        </button>

        {/* Holographic Play Overlay */}
        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity duration-200 flex flex-col items-center justify-center gap-1.5 z-20">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-cyan-500 to-pink-500 p-[2px] shadow-xl shadow-cyan-500/40 transform scale-75 group-hover:scale-100 transition-transform duration-200">
            <div className="w-full h-full bg-[#08090e] rounded-[6px] flex items-center justify-center">
              <Play className="w-5 h-5 fill-cyan-400 text-cyan-400 ml-0.5" />
            </div>
          </div>
          <span className="text-[10px] font-orbitron font-bold text-cyan-300 tracking-widest uppercase neon-text-cyan">
            [ EXECUTE ]
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#0c0e18] to-[#090a12]">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="font-orbitron font-bold text-white text-sm tracking-tight truncate group-hover:text-cyan-300 transition-colors">
              {game.title}
            </h3>
            <div className="flex items-center gap-1 text-xs font-mono-cyber text-yellow-400 font-bold shrink-0">
              <Star className="w-3 h-3 fill-yellow-400" />
              <span>{typeof game.rating === 'number' ? game.rating.toFixed(1) : '4.8'}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed font-sans">
            {game.description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-2.5 border-t border-[#181d2f] flex items-center justify-between text-[10px] font-mono-cyber text-slate-400">
          <span className="truncate max-w-[160px] text-cyan-300/80 flex items-center gap-1" title={game.controls}>
            <Terminal className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="truncate">{game.controls || 'Mouse / Keyboard'}</span>
          </span>
          <span className="text-pink-400/90 shrink-0 font-bold">
            {(game.plays || 12000).toLocaleString()} RUNS
          </span>
        </div>
      </div>
    </div>
  );
};
