import React, { useRef, useState } from 'react';
import { 
  ArrowLeft, 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  ExternalLink, 
  Star, 
  Tv, 
  Gamepad2, 
  Info, 
  FileCode, 
  Shield, 
  Check, 
  Terminal, 
  Cpu, 
  Monitor, 
  Activity 
} from 'lucide-react';
import { resolveGameUrl } from '../data/defaultGames';

export const GamePlayer = ({
  game,
  onBack,
  isFavorite,
  onToggleFavorite,
  relatedGames = [],
  onSelectGame
}) => {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [showJsonView, setShowJsonView] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [crtEffect, setCrtEffect] = useState(false);

  const gameUrl = resolveGameUrl(game);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error entering fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Reload iframe
  const reloadFrame = () => {
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = 'about:blank';
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.src = currentSrc;
      }, 50);
    }
  };

  // Stealth About:Blank Popup Launcher
  const launchAboutBlankStealth = () => {
    try {
      const win = window.open('about:blank', '_blank');
      if (win) {
        win.document.write(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>Google Docs - Document</title>
            <link rel="icon" href="https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico" type="image/x-icon">
            <style>
              * { margin:0; padding:0; box-sizing:border-box; }
              html, body { width:100%; height:100%; overflow:hidden; background:#08090e; }
              iframe { width:100%; height:100%; border:none; display:block; }
            </style>
          </head>
          <body>
            <iframe src="${gameUrl}" allow="fullscreen; autoplay; gamepad; camera; microphone"></iframe>
          </body>
          </html>
        `);
        win.document.close();
      }
    } catch (err) {
      console.error('Failed to open stealth popup:', err);
    }
  };

  const copyGameJson = () => {
    navigator.clipboard.writeText(JSON.stringify(game, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      {/* Top Cyber HUD Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d101c] p-3.5 rounded-xl border border-[#1b233a] shadow-lg shadow-cyan-950/20 backdrop-blur-md relative overflow-hidden">
        {/* Top cyan accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-cyan-500 via-pink-500 to-yellow-400" />

        <div className="flex items-center gap-3">
          <button
            id="player-back-btn"
            onClick={onBack}
            className="p-2 sm:px-3 rounded-lg bg-[#141829] hover:bg-[#1e253e] text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-400 transition flex items-center gap-1.5 text-xs font-mono-cyber font-bold"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>// MATRIX</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-orbitron font-bold text-white tracking-wide">
                {game.title}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-cyber font-bold uppercase tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                {game.category}
              </span>
            </div>
            <p className="text-xs font-mono-cyber text-slate-400 hidden sm:flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-pink-400" />
              <span>{game.controls}</span>
            </p>
          </div>
        </div>

        {/* Cyber Player Controls Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Favorite */}
          <button
            id="player-fav-btn"
            onClick={(e) => onToggleFavorite(e, game.id)}
            className={`p-2 rounded-lg border transition flex items-center gap-1.5 text-xs font-mono-cyber font-bold ${
              isFavorite
                ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-md shadow-yellow-400/30'
                : 'bg-[#141829] hover:bg-[#1e253e] text-slate-300 border-[#1f2742] hover:text-yellow-400'
            }`}
            title="Toggle neural bookmark"
          >
            <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-slate-950 text-slate-950' : 'text-yellow-400'}`} />
            <span className="hidden md:inline">{isFavorite ? 'SAVED' : 'SAVE'}</span>
          </button>

          {/* CRT scanlines toggle */}
          <button
            onClick={() => setCrtEffect(!crtEffect)}
            className={`p-2 rounded-lg border text-xs font-mono-cyber flex items-center gap-1.5 transition ${
              crtEffect
                ? 'bg-pink-950/80 text-pink-300 border-pink-500/60'
                : 'bg-[#141829] hover:bg-[#1e253e] text-slate-300 border-[#1f2742] hover:text-pink-300'
            }`}
            title="Toggle Cyber CRT Scanline Overlay"
          >
            <Monitor className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden lg:inline">CRT FX</span>
          </button>

          {/* Reload Frame */}
          <button
            id="player-reload-btn"
            onClick={reloadFrame}
            className="p-2 rounded-lg bg-[#141829] hover:bg-[#1e253e] text-cyan-300 hover:text-white border border-[#1f2742] text-xs font-mono-cyber flex items-center gap-1.5 transition"
            title="Restart / Reload Game Frame"
          >
            <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">RELOAD</span>
          </button>

          {/* Theater Mode */}
          <button
            id="player-theater-btn"
            onClick={() => setIsTheater(!isTheater)}
            className={`p-2 rounded-lg border text-xs font-mono-cyber flex items-center gap-1.5 transition ${
              isTheater
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                : 'bg-[#141829] hover:bg-[#1e253e] text-slate-300 border-[#1f2742] hover:text-white'
            }`}
            title="Toggle Theater Mode"
          >
            <Tv className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">THEATER</span>
          </button>

          {/* Stealth Tab Cloak Window */}
          <button
            id="player-stealth-btn"
            onClick={launchAboutBlankStealth}
            className="p-2 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/70 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-mono-cyber font-bold flex items-center gap-1.5 transition"
            title="Open in stealth about:blank popup"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">GHOST TAB</span>
          </button>

          {/* Fullscreen */}
          <button
            id="player-fullscreen-btn"
            onClick={toggleFullscreen}
            className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-slate-950 text-xs font-orbitron font-bold flex items-center gap-1.5 transition shadow-lg shadow-cyan-500/25 active:scale-95"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">FULLSCREEN</span>
          </button>
        </div>
      </div>

      {/* Main Cyber Iframe Player Stage */}
      <div
        ref={containerRef}
        id="game-viewport-container"
        className={`relative w-full rounded-xl bg-black border-2 border-[#1c243b] overflow-hidden shadow-2xl transition-all duration-300 flex flex-col items-center justify-center ${
          isTheater ? 'h-[84vh]' : 'h-[650px] max-h-[75vh]'
        }`}
      >
        {/* Cyber HUD Corner Brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none z-30 opacity-70" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none z-30 opacity-70" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-pink-500 pointer-events-none z-30 opacity-70" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-pink-500 pointer-events-none z-30 opacity-70" />

        {/* Optional CRT Scanline effect */}
        {crtEffect && (
          <div className="absolute inset-0 cyber-scanlines opacity-50 pointer-events-none z-20" />
        )}

        <iframe
          ref={iframeRef}
          id="game-iframe"
          title={game.title}
          src={gameUrl}
          className="w-full h-full border-0 bg-[#08090e]"
          sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups"
          allow="fullscreen; autoplay; gamepad; camera; microphone"
        />
      </div>

      {/* Cyber Diagnostics & JSON Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Game Info & Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0c0e18] border border-[#1b2238] rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-orbitron font-bold text-white">NEURAL CONTROLS & MANUAL</h2>
              </div>
              <button
                onClick={() => setShowJsonView(!showJsonView)}
                className="px-2.5 py-1 rounded-lg bg-[#141829] hover:bg-[#1e253e] text-cyan-300 border border-cyan-500/30 text-xs font-mono-cyber flex items-center gap-1.5 transition"
              >
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>{showJsonView ? '[ HIDE JSON ]' : '[ INSPECT JSON ]'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-[#07080d] border border-[#1b233a] mb-4">
              <div className="text-[11px] font-mono-cyber font-bold uppercase tracking-wider text-pink-400 mb-1 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>INPUT TELEMETRY //</span>
              </div>
              <div className="text-sm font-mono-cyber font-medium text-cyan-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                {game.controls}
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {game.description}
            </p>

            {/* JSON Code Inspector Modal / Panel */}
            {showJsonView && (
              <div className="mt-4 pt-4 border-t border-[#1b233a]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono-cyber font-bold text-cyan-400">CORE NODE SCHEMA:</span>
                  <button
                    onClick={copyGameJson}
                    className="px-2.5 py-1 rounded bg-[#141829] hover:bg-[#1e253e] text-xs font-mono-cyber text-slate-200 border border-cyan-500/30 flex items-center gap-1"
                  >
                    {copiedJson ? <Check className="w-3 h-3 text-emerald-400" /> : <FileCode className="w-3 h-3" />}
                    <span>{copiedJson ? 'DUMP COPIED' : 'COPY JSON'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-[#07080d] border border-[#1b233a] text-xs font-mono-cyber text-cyan-300 overflow-x-auto max-h-48">
                  {JSON.stringify(game, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Cyber Diagnostics */}
        <div className="space-y-4">
          <div className="bg-[#0c0e18] border border-[#1b2238] rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-orbitron font-bold text-white mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-pink-400" /> DIAGNOSTICS & TELEMETRY
            </h3>
            <div className="space-y-2.5 text-xs font-mono-cyber">
              <div className="flex justify-between py-1.5 border-b border-[#1b233a]">
                <span className="text-slate-400">CATEGORY</span>
                <span className="font-bold text-cyan-300">{game.category}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1b233a]">
                <span className="text-slate-400">RATING SCORE</span>
                <span className="font-bold text-yellow-400 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400" /> {game.rating.toFixed(1)} / 5.0
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1b233a]">
                <span className="text-slate-400">SIMULATION RUNS</span>
                <span className="font-bold text-pink-400">{game.plays.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1b233a]">
                <span className="text-slate-400">STORAGE ARCHITECTURE</span>
                <span className="font-bold text-cyan-400">JSON IFRAME EMBED</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">SECURITY PROTOCOL</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> SECURE SANDBOX
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended / More Games in Cyber Module Format */}
      {relatedGames.length > 0 && (
        <div className="pt-4">
          <h2 className="text-base font-orbitron font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-cyan-400">// MORE NODES IN</span>
            <span className="text-pink-400">{game.category.toUpperCase()}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedGames.map((relGame) => (
              <div
                key={relGame.id}
                onClick={() => onSelectGame(relGame)}
                className="group p-3 rounded-lg bg-[#0c0e18] border border-[#1b2238] hover:border-cyan-400/60 cursor-pointer transition flex items-center gap-3"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                    relGame.thumbnailGradient || 'from-cyan-900 to-indigo-950'
                  } flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-cyan-500/20`}
                >
                  <Gamepad2 className="w-5 h-5 text-cyan-300" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-orbitron font-bold text-white truncate group-hover:text-cyan-300">
                    {relGame.title}
                  </h4>
                  <p className="text-[10px] font-mono-cyber text-slate-400 truncate">
                    {relGame.category} • <span className="text-yellow-400 font-bold">{relGame.rating.toFixed(1)} ★</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
