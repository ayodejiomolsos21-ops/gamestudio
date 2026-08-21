import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Search, 
  X, 
  RotateCw, 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  Star, 
  Bookmark, 
  ShieldCheck, 
  Trash2, 
  Sparkles, 
  Share2, 
  Lock, 
  Layers,
  HelpCircle,
  Clock,
  Compass,
  AlertTriangle,
  Play,
  Terminal,
  Zap,
  ChevronDown,
  Sliders,
  Plus,
  Tv,
  Gamepad2,
  BookOpen,
  Code2
} from 'lucide-react';

export const BROWSER_ENGINES = [
  {
    id: 'boogibuck_search',
    name: 'BoogiBuck Search Portal',
    tag: 'Primary Portal',
    icon: '⚡',
    badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    homeUrl: 'https://boogibuck.localcito.com/search.html',
    searchUrl: 'https://boogibuck.localcito.com/search.html?q=',
    description: 'BoogiBuck custom search & unblocked web browsing interface'
  },
  {
    id: 'duckduckgo_lite',
    name: 'DuckDuckGo Lite',
    tag: 'Fast & Clean',
    icon: '🦆',
    badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    homeUrl: 'https://duckduckgo.com/lite',
    searchUrl: 'https://duckduckgo.com/lite?q=',
    description: 'Privacy search without ads, scripts, or tracker profiling'
  },
  {
    id: 'google_igu',
    name: 'Google Web Engine',
    tag: 'Most Popular',
    icon: '🌐',
    badgeColor: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
    homeUrl: 'https://www.google.com/search?igu=1',
    searchUrl: 'https://www.google.com/search?igu=1&q=',
    description: 'Embed-ready Google web search portal (IGU mode)'
  },
  {
    id: 'brave',
    name: 'Brave Search',
    tag: 'Ad-Free',
    icon: '🦁',
    badgeColor: 'text-orange-400 border-orange-500/40 bg-orange-500/10',
    homeUrl: 'https://search.brave.com',
    searchUrl: 'https://search.brave.com/search?q=',
    description: 'Independent privacy search engine with zero user tracking'
  },
  {
    id: 'searxng',
    name: 'SearXNG Open',
    tag: 'Metasearch',
    icon: '⚡',
    badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    homeUrl: 'https://searx.be',
    searchUrl: 'https://searx.be/search?q=',
    description: 'Decentralized metasearch aggregating results anonymously'
  },
  {
    id: 'bing',
    name: 'Bing Browser',
    tag: 'Universal',
    icon: '🔍',
    badgeColor: 'text-teal-400 border-teal-500/40 bg-teal-500/10',
    homeUrl: 'https://www.bing.com',
    searchUrl: 'https://www.bing.com/search?q=',
    description: 'Microsoft universal web search & visual discovery engine'
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia Mobile',
    tag: 'Research',
    icon: '📚',
    badgeColor: 'text-slate-300 border-slate-500/40 bg-slate-500/10',
    homeUrl: 'https://en.m.wikipedia.org',
    searchUrl: 'https://en.m.wikipedia.org/w/index.php?search=',
    description: 'Free encyclopedia reference with millions of articles'
  },
  {
    id: 'wayback',
    name: 'Wayback Machine',
    tag: 'Archive',
    icon: '🏛️',
    badgeColor: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10',
    homeUrl: 'https://archive.org/web/',
    searchUrl: 'https://web.archive.org/web/*/',
    description: 'Historical archive of web pages, old web tools & archives'
  }
];

export const UNBLOCKED_WEB_APPS = [
  {
    name: 'BoogiBuck Search',
    category: 'Search & Portal',
    url: 'https://boogibuck.localcito.com/search.html',
    icon: '⚡',
    description: 'Custom unblocked web search portal'
  },
  {
    name: 'DuckDuckGo Search',
    category: 'Search Engine',
    url: 'https://duckduckgo.com/lite',
    icon: '🦆',
    description: 'Fast private search'
  },
  {
    name: 'Wikipedia Mobile',
    category: 'Encyclopedia',
    url: 'https://en.m.wikipedia.org',
    icon: '📚',
    description: 'Free encyclopedia & reference'
  },
  {
    name: 'Scratch Studio',
    category: 'Creativity',
    url: 'https://scratch.mit.edu/explore/projects/all',
    icon: '🐱',
    description: 'Interactive coding games & animations'
  },
  {
    name: 'Chess.com Analysis',
    category: 'Games & Puzzles',
    url: 'https://www.chess.com/analysis',
    icon: '♟️',
    description: 'Play and analyze chess moves online'
  },
  {
    name: 'Wayback Machine',
    category: 'Archive',
    url: 'https://archive.org/web/',
    icon: '🏛️',
    description: 'Browse millions of historical web pages'
  },
  {
    name: 'Mathway Calculator',
    category: 'Education',
    url: 'https://www.mathway.com',
    icon: '📐',
    description: 'Step-by-step math solver & calculator'
  },
  {
    name: 'FreeCodeCamp',
    category: 'Coding',
    url: 'https://www.freecodecamp.org',
    icon: '💻',
    description: 'Learn programming with interactive lessons'
  },
  {
    name: 'Google Search IGU',
    category: 'Search Engine',
    url: 'https://www.google.com/search?igu=1',
    icon: '🌐',
    description: 'Embedded Google Search Portal'
  }
];

const STEALTH_CLOAKS = [
  {
    id: 'gdrive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    icon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png'
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes',
    icon: 'https://ssl.gstatic.com/classroom/favicon.png'
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Google Docs: Online Document Editor',
    icon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard | Canvas',
    icon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico'
  }
];

const STORAGE_BOOKMARKS = 'boogi_browser_bookmarks_v1';
const STORAGE_HISTORY = 'boogi_browser_history_v1';
const STORAGE_SELECTED_ENGINE = 'boogi_browser_engine_v1';

export const UnblockedBrowserModal = ({ isOpen, onClose }) => {
  const [selectedEngineId, setSelectedEngineId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_SELECTED_ENGINE) || 'boogibuck_search';
    } catch {
      return 'boogibuck_search';
    }
  });

  const [currentUrl, setCurrentUrl] = useState('about:home');
  const [inputUrl, setInputUrl] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('browser'); // 'browser' | 'engines' | 'bookmarks' | 'history'
  const [showEngineDropdown, setShowEngineDropdown] = useState(false);
  const [showCloakDropdown, setShowCloakDropdown] = useState(false);
  const [selectedCloak, setSelectedCloak] = useState(STEALTH_CLOAKS[0]);

  const iframeRef = useRef(null);
  const engineDropdownRef = useRef(null);

  const activeEngine = BROWSER_ENGINES.find(e => e.id === selectedEngineId) || BROWSER_ENGINES[0];

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BOOKMARKS);
      return saved ? JSON.parse(saved) : UNBLOCKED_WEB_APPS.slice(0, 4);
    } catch {
      return UNBLOCKED_WEB_APPS.slice(0, 4);
    }
  });

  // History state
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Handle URL navigation
  const navigateTo = (rawInput) => {
    if (!rawInput || !rawInput.trim()) return;

    let target = rawInput.trim();

    if (target === 'about:home' || target === 'home') {
      setCurrentUrl('about:home');
      setInputUrl('');
      setIsLoading(false);
      setActiveTab('browser');
      return;
    }

    const hasProtocol = target.startsWith('http://') || target.startsWith('https://');
    const isDomain = target.includes('.') && !target.includes(' ') && !target.startsWith('?');

    if (!hasProtocol) {
      if (isDomain) {
        target = 'https://' + target;
      } else {
        target = `${activeEngine.searchUrl}${encodeURIComponent(target)}`;
      }
    }

    setCurrentUrl(target);
    setInputUrl(target);
    setIsLoading(true);
    setIframeKey(Date.now());
    setActiveTab('browser');

    // Add to history
    setHistory(prev => {
      const entry = {
        url: target,
        timestamp: Date.now()
      };
      const filtered = prev.filter(h => h.url !== target);
      const next = [entry, ...filtered].slice(0, 30);
      try {
        localStorage.setItem(STORAGE_HISTORY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    navigateTo(inputUrl);
  };

  const handleRefresh = () => {
    if (currentUrl === 'about:home') return;
    setIsLoading(true);
    setIframeKey(Date.now());
  };

  const handleToggleBookmark = () => {
    if (currentUrl === 'about:home') return;
    const isBookmarked = bookmarks.some(b => b.url === currentUrl);
    let nextBookmarks;
    if (isBookmarked) {
      nextBookmarks = bookmarks.filter(b => b.url !== currentUrl);
    } else {
      let title = 'Web Bookmark';
      try {
        const parsed = new URL(currentUrl);
        title = parsed.hostname.replace(/^www\./, '');
      } catch {}

      nextBookmarks = [
        ...bookmarks,
        {
          name: title,
          url: currentUrl,
          icon: '🌐',
          category: 'Saved'
        }
      ];
    }
    setBookmarks(nextBookmarks);
    try {
      localStorage.setItem(STORAGE_BOOKMARKS, JSON.stringify(nextBookmarks));
    } catch {}
  };

  // Launch in stealth about:blank window disguised with tab cloaking
  const launchAboutBlank = (targetUrl, cloak = selectedCloak) => {
    const urlToOpen = targetUrl || (currentUrl === 'about:home' ? activeEngine.homeUrl : currentUrl);
    try {
      const win = window.open('about:blank', '_blank');
      if (!win) {
        window.open(urlToOpen, '_blank');
        return;
      }
      const doc = win.document;
      doc.title = cloak.title;
      const link = doc.createElement('link');
      link.rel = 'icon';
      link.href = cloak.icon;
      doc.head.appendChild(link);

      const frame = doc.createElement('iframe');
      frame.style.position = 'fixed';
      frame.style.top = '0';
      frame.style.left = '0';
      frame.style.bottom = '0';
      frame.style.right = '0';
      frame.style.width = '100%';
      frame.style.height = '100%';
      frame.style.border = 'none';
      frame.style.margin = '0';
      frame.style.padding = '0';
      frame.style.overflow = 'hidden';
      frame.src = urlToOpen;
      doc.body.appendChild(frame);
      doc.body.style.margin = '0';
    } catch (err) {
      window.open(urlToOpen, '_blank');
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_HISTORY);
    } catch {}
  };

  if (!isOpen) return null;

  const isCurrentBookmarked = bookmarks.some(b => b.url === currentUrl);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-2 bg-slate-950/95 backdrop-blur-2xl overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`relative w-full bg-[#080a14] border border-cyan-500/50 rounded-2xl shadow-2xl shadow-cyan-950/80 overflow-hidden flex flex-col transition-all duration-200 ${
        isFullscreen ? 'h-full max-h-full max-w-full rounded-none' : 'w-[98vw] max-w-[1700px] h-[96vh] max-h-[98vh]'
      }`}>
        
        {/* Browser Window Top Navigation Bar */}
        <div className="bg-[#0b0e1b] border-b border-[#1b233a] px-2.5 sm:px-3 py-1 sm:py-1.5 flex items-center justify-between gap-1.5 shrink-0">
          
          {/* Brand & Tab Navigation */}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-[1px] flex items-center justify-center shadow-sm shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[5px] flex items-center justify-center">
                <Globe className="w-3 h-3 text-emerald-400 animate-pulse" />
              </div>
            </div>

            {/* Navigation Mode Tabs */}
            <div className="hidden sm:flex items-center gap-0.5 bg-[#060810] border border-[#1b233a] p-0.5 rounded-md text-[11px] font-mono-cyber">
              <button
                onClick={() => setActiveTab('browser')}
                className={`px-2 py-0.5 rounded font-bold transition flex items-center gap-1 ${
                  activeTab === 'browser' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🌐 BROWSER</span>
              </button>
              <button
                onClick={() => setActiveTab('engines')}
                className={`px-2 py-0.5 rounded font-bold transition flex items-center gap-1 ${
                  activeTab === 'engines' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>⚡ ENGINES ({BROWSER_ENGINES.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`px-2 py-0.5 rounded font-bold transition flex items-center gap-1 ${
                  activeTab === 'bookmarks' ? 'bg-pink-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bookmark className="w-2.5 h-2.5" />
                <span>SAVED ({bookmarks.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-2 py-0.5 rounded font-bold transition flex items-center gap-1 ${
                  activeTab === 'history' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-2.5 h-2.5" />
                <span>HISTORY</span>
              </button>
            </div>
          </div>

          {/* Quick Info & Window Control Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Stealth Cloak Selector & Launcher */}
            <div className="flex items-center gap-0.5 bg-purple-950/60 border border-purple-500/40 rounded-md p-0.5">
              <button
                onClick={() => launchAboutBlank()}
                title={`Launch Stealth Tab disguised as ${selectedCloak.name}`}
                className="px-1.5 py-0.5 rounded text-purple-300 hover:text-white text-[10px] font-mono-cyber font-bold flex items-center gap-1 transition active:scale-95 hover:bg-purple-900"
              >
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                <span className="hidden md:inline">STEALTH</span>
              </button>

              <select
                value={selectedCloak.id}
                onChange={(e) => {
                  const cloak = STEALTH_CLOAKS.find(c => c.id === e.target.value) || STEALTH_CLOAKS[0];
                  setSelectedCloak(cloak);
                }}
                aria-label="Cloak disguise identity"
                className="bg-transparent text-purple-300 text-[9px] font-mono-cyber font-bold outline-none cursor-pointer pr-0.5"
              >
                {STEALTH_CLOAKS.map(c => (
                  <option key={c.id} value={c.id} className="bg-[#0b0e1b] text-slate-200">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Direct Open in New Tab */}
            {currentUrl !== 'about:home' && (
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 sm:px-1.5 sm:py-0.5 rounded bg-[#101426] hover:bg-[#18203d] border border-cyan-500/30 text-cyan-300 hover:text-white text-[10px] font-mono-cyber flex items-center gap-1 transition"
                title="Open current URL in new tab"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="hidden lg:inline">OPEN TAB</span>
              </a>
            )}

            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 rounded bg-[#101426] hover:bg-[#18203d] border border-cyan-500/30 text-slate-300 hover:text-white transition"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1 rounded bg-[#101426] hover:bg-red-950/80 border border-slate-700 hover:border-red-500 text-slate-400 hover:text-white transition active:scale-95"
              title="Close Browser (Esc)"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Address Bar Navigation Controls */}
        <div className="bg-[#070913] border-b border-[#182036] px-2.5 sm:px-3 py-1 flex items-center gap-1.5 shrink-0">
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => navigateTo('about:home')}
              className={`p-1 rounded hover:bg-white/5 text-slate-400 hover:text-cyan-300 transition ${currentUrl === 'about:home' ? 'text-cyan-400 bg-cyan-950/30' : ''}`}
              title="Browser Home"
            >
              <Home className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleRefresh}
              className={`p-1 rounded hover:bg-white/5 text-slate-400 hover:text-cyan-300 transition ${isLoading ? 'animate-spin text-cyan-400' : ''}`}
              title="Reload page"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Engine Switcher Button inside Bar */}
          <button
            type="button"
            onClick={() => setActiveTab('engines')}
            title="Change default browser engine"
            className="flex items-center gap-1 bg-[#0d1020] hover:bg-[#151a33] border border-cyan-500/40 rounded-md px-2 py-0.5 text-[10px] font-mono-cyber text-cyan-300 font-bold transition shrink-0"
          >
            <span>{activeEngine.icon}</span>
            <span className="hidden sm:inline">{activeEngine.name.split(' ')[0]}</span>
            <Sliders className="w-2.5 h-2.5 text-cyan-400 opacity-80" />
          </button>

          {/* Omnibox / URL Search Bar */}
          <form onSubmit={handleFormSubmit} className="flex-1 min-w-[160px] flex items-center relative">
            <div className="absolute left-2 flex items-center text-slate-500 pointer-events-none">
              <Lock className="w-3 h-3 text-emerald-400" />
            </div>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder={`Search or URL...`}
              className="w-full bg-[#0d1020] border border-cyan-500/40 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 rounded-md pl-6 pr-16 py-1 text-[11px] font-mono-cyber text-slate-100 placeholder-slate-500 outline-none shadow-inner"
            />
            <div className="absolute right-1 flex items-center gap-1">
              {currentUrl !== 'about:home' && (
                <button
                  type="button"
                  onClick={handleToggleBookmark}
                  title={isCurrentBookmarked ? 'Remove bookmark' : 'Bookmark this page'}
                  className={`p-0.5 rounded transition ${
                    isCurrentBookmarked ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500 hover:text-yellow-400'
                  }`}
                >
                  <Star className="w-3 h-3" />
                </button>
              )}
              <button
                type="submit"
                className="px-2 py-0.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded text-[9px] font-mono-cyber font-bold transition active:scale-95"
              >
                GO
              </button>
            </div>
          </form>

        </div>

        {/* Quick Engine Tabs Bar */}
        <div className="bg-[#05070e] border-b border-[#141b30] px-2.5 sm:px-3 py-0.5 sm:py-1 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[9px] font-mono-cyber text-slate-500 font-bold uppercase tracking-wider shrink-0 mr-0.5 flex items-center gap-0.5">
            ⚡ BROWSERS:
          </span>
          {BROWSER_ENGINES.map((engine) => {
            const isActive = selectedEngineId === engine.id;
            return (
              <button
                key={engine.id}
                onClick={() => {
                  setSelectedEngineId(engine.id);
                  try {
                    localStorage.setItem(STORAGE_SELECTED_ENGINE, engine.id);
                  } catch {}
                  navigateTo(engine.homeUrl);
                }}
                className={`whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-mono-cyber font-semibold transition-all border flex items-center gap-1 active:scale-95 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/20 font-bold'
                    : 'bg-[#0a0d1c] hover:bg-[#121730] text-slate-300 border-[#1c243d] hover:text-white'
                }`}
                title={`Switch browser to ${engine.name}`}
              >
                <span>{engine.icon}</span>
                <span>{engine.name}</span>
              </button>
            );
          })}
        </div>

        {/* Browser Content Area */}
        <div className="flex-1 relative bg-slate-950 overflow-hidden flex flex-col">
          
          {/* TAB: BROWSER VIEW */}
          {activeTab === 'browser' && (
            <div className="w-full h-full relative flex flex-col bg-[#060812]">
              
              {/* HOME SCREEN / PORTAL LAUNCHER */}
              {currentUrl === 'about:home' ? (
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-center text-center">
                  <div className="max-w-3xl w-full space-y-6">
                    
                    {/* Logo & Headline */}
                    <div className="space-y-2">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-[2px] shadow-xl shadow-emerald-500/20">
                        <div className="w-full h-full bg-[#090c1a] rounded-[14px] flex items-center justify-center">
                          <Globe className="w-7 h-7 text-emerald-400" />
                        </div>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-orbitron font-extrabold text-white tracking-wider">
                        UNBLOCKED WEB BROWSER
                      </h2>
                      <p className="text-xs sm:text-sm font-mono-cyber text-slate-400 max-w-lg mx-auto">
                        Search the web, explore embeddable portals, or launch stealth tabs with Google Drive / Classroom disguise.
                      </p>
                    </div>

                    {/* Active Browser Engine Switcher Banner */}
                    <div className="bg-[#0c1024] border border-cyan-500/40 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-left">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{activeEngine.icon}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-mono-cyber font-bold text-white">
                              Active Engine: {activeEngine.name}
                            </h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${activeEngine.badgeColor}`}>
                              {activeEngine.tag}
                            </span>
                          </div>
                          <p className="text-xs font-mono-cyber text-slate-400">
                            {activeEngine.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigateTo(activeEngine.homeUrl)}
                          className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono-cyber text-xs font-bold rounded-lg transition active:scale-95 shadow"
                        >
                          LAUNCH ENGINE ↗
                        </button>
                        <button
                          onClick={() => setActiveTab('engines')}
                          className="px-3 py-1.5 bg-[#141b33] hover:bg-[#1c2647] border border-cyan-500/30 text-cyan-300 font-mono-cyber text-xs font-bold rounded-lg transition"
                        >
                          CHANGE BROWSER
                        </button>
                      </div>
                    </div>

                    {/* Quick Search Launcher Input */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (inputUrl) navigateTo(inputUrl);
                      }} 
                      className="relative max-w-xl mx-auto"
                    >
                      <input
                        type="text"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder={`Search ${activeEngine.name} or enter URL...`}
                        className="w-full bg-[#0c1024] border border-cyan-500/50 hover:border-cyan-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 rounded-xl pl-10 pr-24 py-3 text-sm font-mono-cyber text-white placeholder-slate-500 outline-none shadow-lg shadow-cyan-950/40"
                      />
                      <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-orbitron font-bold text-xs rounded-lg shadow transition active:scale-95 hover:brightness-110"
                      >
                        SEARCH
                      </button>
                    </form>

                    {/* Popular Unblocked Hubs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-left">
                      {UNBLOCKED_WEB_APPS.map((preset) => (
                        <div
                          key={preset.url}
                          onClick={() => navigateTo(preset.url)}
                          className="bg-[#0b0e20] hover:bg-[#121733] border border-[#1b233d] hover:border-cyan-400/80 rounded-xl p-3 cursor-pointer transition group shadow-sm hover:shadow-cyan-500/10"
                        >
                          <div className="text-2xl mb-1.5">{preset.icon}</div>
                          <h4 className="text-xs font-mono-cyber font-bold text-white group-hover:text-cyan-300 truncate">
                            {preset.name}
                          </h4>
                          <p className="text-[10px] font-mono-cyber text-slate-400 line-clamp-2 mt-0.5">
                            {preset.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Stealth Notice */}
                    <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-3 flex items-center justify-between gap-3 text-left">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
                        <div>
                          <p className="text-xs font-mono-cyber font-bold text-purple-200">
                            Stealth Disguise Mode ({selectedCloak.name})
                          </p>
                          <p className="text-[10px] font-mono-cyber text-slate-400">
                            Opens any browser in an about:blank tab disguised with {selectedCloak.name} icon & title.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => launchAboutBlank(activeEngine.homeUrl)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-mono-cyber text-xs font-bold rounded-lg shrink-0 transition active:scale-95 shadow"
                      >
                        LAUNCH STEALTH
                      </button>
                    </div>

                  </div>
                </div>
              ) : (
                /* LIVE EMBEDDED IFRAME VIEW */
                <div className="w-full flex-1 relative flex flex-col">
                  <iframe
                    key={iframeKey}
                    ref={iframeRef}
                    id="unblocked-web-browser-frame"
                    src={currentUrl}
                    title="Unblocked Web Browser"
                    className="w-full flex-1 border-0 bg-white"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    onLoad={() => setIsLoading(false)}
                  />

                  {/* Fallback Banner for Sites with strict X-Frame-Options */}
                  <div className="bg-[#090c1c] border-t border-[#1a233b] px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-cyber text-slate-300 shrink-0">
                    <div className="flex items-center gap-2 truncate max-w-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span className="truncate text-slate-300 font-medium">{currentUrl}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setActiveTab('engines')}
                        className="px-2 py-1 rounded bg-[#121730] text-cyan-300 hover:text-white border border-cyan-500/40 text-[11px] font-bold transition"
                      >
                        Switch Browser
                      </button>
                      <button
                        onClick={() => launchAboutBlank(currentUrl)}
                        className="px-2.5 py-1 rounded bg-purple-950/90 text-purple-300 hover:text-white border border-purple-500/50 text-[11px] font-bold transition hover:bg-purple-900 flex items-center gap-1 active:scale-95"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Stealth Tab Mode</span>
                      </button>
                      <a
                        href={currentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded bg-cyan-950/90 text-cyan-300 hover:text-white border border-cyan-500/50 text-[11px] font-bold transition hover:bg-cyan-900 flex items-center gap-1 active:scale-95"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Direct Tab</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB: BROWSER ENGINES HUB */}
          {activeTab === 'engines' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-900/40 pb-3">
                <div>
                  <h3 className="text-base font-orbitron font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    SELECT & CHANGE BROWSER ENGINE
                  </h3>
                  <p className="text-xs font-mono-cyber text-slate-400">
                    Switch between privacy browsers, embeddable search portals, and archive search tools
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('browser')}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-mono-cyber text-xs font-bold hover:bg-cyan-400 transition"
                >
                  BACK TO BROWSER
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {BROWSER_ENGINES.map((engine) => {
                  const isSelected = engine.id === selectedEngineId;
                  return (
                    <div
                      key={engine.id}
                      className={`rounded-xl p-4 border transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-[#0f142b] border-cyan-400 shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-400/50' 
                          : 'bg-[#0a0d1e] border-[#18213d] hover:border-cyan-500/60 hover:bg-[#0e1328]'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-3xl">{engine.icon}</span>
                            <div>
                              <h4 className="text-sm font-mono-cyber font-bold text-white">
                                {engine.name}
                              </h4>
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border mt-0.5 ${engine.badgeColor}`}>
                                {engine.tag}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded bg-cyan-500 text-slate-950 text-[10px] font-mono-cyber font-extrabold uppercase">
                              ACTIVE
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-mono-cyber text-slate-400 mb-3">
                          {engine.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-[#1a233f]">
                        <button
                          onClick={() => {
                            setSelectedEngineId(engine.id);
                            try {
                              localStorage.setItem(STORAGE_SELECTED_ENGINE, engine.id);
                            } catch {}
                            navigateTo(engine.homeUrl);
                          }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-mono-cyber font-bold transition flex items-center justify-center gap-1.5 ${
                            isSelected 
                              ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400' 
                              : 'bg-[#151c38] hover:bg-cyan-500 hover:text-slate-950 text-cyan-300'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{isSelected ? 'LOAD HOME' : 'SET & LAUNCH'}</span>
                        </button>

                        <button
                          onClick={() => launchAboutBlank(engine.homeUrl)}
                          title="Launch in stealth about:blank window"
                          className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-300 hover:text-white transition"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={engine.homeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open in new external tab"
                          className="p-1.5 rounded-lg bg-[#151c38] hover:bg-[#1e2850] border border-cyan-500/30 text-cyan-300 hover:text-white transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: BOOKMARKS MANAGER */}
          {activeTab === 'bookmarks' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3">
                <div>
                  <h3 className="text-base font-orbitron font-bold text-white flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-pink-400" />
                    SAVED WEB BOOKMARKS
                  </h3>
                  <p className="text-xs font-mono-cyber text-slate-400">
                    Quickly launch saved unblocked tools, games, and research websites
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('browser')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-mono-cyber text-xs font-bold"
                >
                  BACK TO BROWSER
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {bookmarks.map((bm) => (
                  <div
                    key={bm.url}
                    className="bg-[#0b0e1f] border border-cyan-500/30 hover:border-cyan-400 rounded-xl p-3 flex items-center justify-between gap-3 group transition"
                  >
                    <div 
                      onClick={() => navigateTo(bm.url)}
                      className="flex-1 min-w-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{bm.icon || '🌐'}</span>
                        <h4 className="text-xs font-mono-cyber font-bold text-white truncate group-hover:text-cyan-300">
                          {bm.name}
                        </h4>
                      </div>
                      <p className="text-[10px] font-mono-cyber text-slate-400 truncate mt-0.5">
                        {bm.url}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const filtered = bookmarks.filter(b => b.url !== bm.url);
                        setBookmarks(filtered);
                        try {
                          localStorage.setItem(STORAGE_BOOKMARKS, JSON.stringify(filtered));
                        } catch {}
                      }}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition"
                      title="Delete bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: HISTORY LOG */}
          {activeTab === 'history' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3">
                <div>
                  <h3 className="text-base font-orbitron font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    RECENT BROWSING SESSIONS
                  </h3>
                  <p className="text-xs font-mono-cyber text-slate-400">
                    Browsing history saved privately in your local browser storage
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearHistory}
                    className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 hover:text-white font-mono-cyber text-xs font-bold"
                  >
                    CLEAR HISTORY
                  </button>
                  <button
                    onClick={() => setActiveTab('browser')}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-mono-cyber text-xs font-bold"
                  >
                    BACK TO BROWSER
                  </button>
                </div>
              </div>

              {history.length > 0 ? (
                <div className="space-y-2">
                  {history.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => navigateTo(item.url)}
                      className="bg-[#0b0e1f] border border-[#1b233a] hover:border-cyan-400 rounded-lg p-2.5 flex items-center justify-between cursor-pointer transition"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="text-xs font-mono-cyber text-slate-200 truncate">
                          {item.url}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono-cyber text-slate-500 shrink-0">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs font-mono-cyber">
                  No browsing history logged yet.
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
