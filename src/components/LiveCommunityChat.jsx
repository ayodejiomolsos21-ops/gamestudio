import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Users, 
  Smile, 
  Share2, 
  ShieldCheck, 
  Minimize2, 
  Maximize2,
  Gamepad2,
  Flame,
  Radio,
  Trash2,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  Check
} from 'lucide-react';

const AVATARS = [
  { id: 'gogeta', name: 'SSJ4 Gogeta', bg: 'from-red-500 to-amber-500', icon: '🔥' },
  { id: 'cyber', name: 'Cyber Ninja', bg: 'from-cyan-500 to-blue-600', icon: '⚡' },
  { id: 'retro', name: 'Pixel Hero', bg: 'from-purple-500 to-pink-600', icon: '👾' },
  { id: 'shadow', name: 'Ghost Runner', bg: 'from-emerald-500 to-teal-700', icon: '👻' },
  { id: 'star', name: 'Cosmic Knight', bg: 'from-yellow-400 to-orange-600', icon: '⭐' },
];

const STORAGE_CHAT_KEY = 'unblocked_real_people_chat_v2';
const STORAGE_USER_KEY = 'unblocked_chat_username_v1';
const STORAGE_AVATAR_KEY = 'unblocked_chat_avatar_v1';
const STORAGE_CUSTOM_PFP_KEY = 'unblocked_chat_custom_pfp_v1';

export const LiveCommunityChat = ({ activeGame, onlineUsersCount = 1340 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPfpSuccess, setShowPfpSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const broadcastRef = useRef(null);

  // User Profile State
  const [username, setUsername] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      if (saved && saved.trim()) return saved.trim();
    } catch {}
    return `Player_${Math.floor(1000 + Math.random() * 9000)}`;
  });

  const [avatarIndex, setAvatarIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AVATAR_KEY);
      if (saved) return parseInt(saved, 10) % AVATARS.length;
    } catch {}
    return 0;
  });

  const [customPfp, setCustomPfp] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_PFP_KEY);
      if (saved && saved.startsWith('data:image')) return saved;
    } catch {}
    return null;
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CHAT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const [inputText, setInputText] = useState('');
  const [activeChannel, setActiveChannel] = useState('lobby');

  // Handle Custom PFP File Upload and Canvas Optimization
  const handlePfpFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, GIF, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 128;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setCustomPfp(dataUrl);
          try {
            localStorage.setItem(STORAGE_CUSTOM_PFP_KEY, dataUrl);
          } catch (err) {
            console.error('Failed to save custom PFP to localStorage:', err);
          }
          setShowPfpSuccess(true);
          setTimeout(() => setShowPfpSuccess(false), 2500);
        }
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);

    // Reset input so user can choose same file again if desired
    e.target.value = '';
  };

  const handleResetToPresetAvatar = () => {
    setCustomPfp(null);
    try {
      localStorage.removeItem(STORAGE_CUSTOM_PFP_KEY);
    } catch {}
  };

  // Initialize BroadcastChannel and Storage Listener for instant multi-tab live chat syncing between real users
  useEffect(() => {
    try {
      broadcastRef.current = new BroadcastChannel('game_studio_real_live_chat_channel');
      broadcastRef.current.onmessage = (event) => {
        if (event.data && event.data.type === 'NEW_REAL_MESSAGE') {
          setMessages((prev) => {
            if (prev.some(m => m.id === event.data.message.id)) return prev;
            const updated = [...prev, event.data.message].slice(-80);
            try { localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(updated)); } catch {}
            return updated;
          });
          if (!isOpen) {
            setUnreadCount((c) => c + 1);
          }
        } else if (event.data && event.data.type === 'CLEAR_CHAT') {
          setMessages([]);
          try { localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify([])); } catch {}
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported:', e);
    }

    const handleStorageChange = (e) => {
      if (e.key === STORAGE_CHAT_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setMessages(parsed);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (broadcastRef.current) {
        broadcastRef.current.close();
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isOpen]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen && !isMinimized && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Reset unread counter on open
  const handleToggleOpen = () => {
    if (!isOpen) {
      setUnreadCount(0);
      setIsOpen(true);
      setIsMinimized(false);
    } else {
      setIsOpen(false);
    }
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const currentAvatar = AVATARS[avatarIndex];
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      user: username.trim() || 'Anonymous Player',
      avatar: currentAvatar.icon,
      avatarBg: currentAvatar.bg,
      customPfp: customPfp || null,
      channel: activeChannel,
      text: inputText.trim(),
      time: formattedTime,
      timestamp: Date.now(),
      game: activeGame ? activeGame.title : null
    };

    const updated = [...messages, newMsg].slice(-80);
    setMessages(updated);
    try {
      localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(updated));
    } catch {}

    // Broadcast message to all other open sessions/tabs
    if (broadcastRef.current) {
      broadcastRef.current.postMessage({ type: 'NEW_REAL_MESSAGE', message: newMsg });
    }

    setInputText('');
  };

  const handleShareCurrentGame = () => {
    if (!activeGame) {
      setInputText('Browsing games right now! Who is ready to play?');
      return;
    }
    setInputText(`🎮 I'm playing ${activeGame.title} right now!`);
  };

  const cycleAvatar = () => {
    if (customPfp) {
      handleResetToPresetAvatar();
      return;
    }
    const nextIdx = (avatarIndex + 1) % AVATARS.length;
    setAvatarIndex(nextIdx);
    try {
      localStorage.setItem(STORAGE_AVATAR_KEY, nextIdx.toString());
    } catch {}
  };

  const handleUsernameChange = (newName) => {
    setUsername(newName);
    try {
      localStorage.setItem(STORAGE_USER_KEY, newName);
    } catch {}
  };

  const clearChatHistory = () => {
    setMessages([]);
    try {
      localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify([]));
    } catch {}
    if (broadcastRef.current) {
      broadcastRef.current.postMessage({ type: 'CLEAR_CHAT' });
    }
  };

  const filteredMessages = messages.filter(
    (m) => !m.channel || m.channel === activeChannel || (activeChannel === 'lobby')
  );

  return (
    <>
      {/* Floating Cyber Chat Launcher Button (Bottom Right) */}
      {!isOpen && (
        <button
          id="global-chat-launcher-btn"
          onClick={handleToggleOpen}
          aria-label="Open Live Community Chat"
          className="fixed bottom-5 right-5 z-50 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 text-slate-950 font-orbitron font-bold text-xs shadow-2xl shadow-cyan-500/40 border border-cyan-300 hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md"
        >
          {/* Animated ping effect */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-950"></span>
          </span>

          {customPfp ? (
            <img 
              src={customPfp} 
              alt="User Avatar" 
              className="w-4 h-4 rounded-full object-cover border border-slate-950" 
            />
          ) : (
            <MessageSquare className="w-4 h-4 text-slate-950 fill-slate-950" />
          )}
          
          <span className="tracking-wider">PLAYER CHAT</span>

          {/* Unread Message Badge */}
          {unreadCount > 0 ? (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-red-600 text-white font-extrabold shadow-md animate-bounce">
              {unreadCount}
            </span>
          ) : (
            <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] bg-slate-950/30 text-slate-900 font-mono-cyber font-bold">
              {onlineUsersCount.toLocaleString()}
            </span>
          )}
        </button>
      )}

      {/* Slide-out Cyberpunk Chat Modal Window */}
      {isOpen && (
        <div
          id="global-chat-panel"
          className={`fixed bottom-4 right-4 z-50 w-[92vw] sm:w-[390px] md:w-[430px] transition-all duration-300 ease-out flex flex-col rounded-2xl bg-[#090b14]/98 border border-cyan-500/40 shadow-2xl shadow-cyan-950/80 backdrop-blur-2xl overflow-hidden font-sans ${
            isMinimized ? 'h-14' : 'h-[550px] max-h-[85vh]'
          }`}
        >
          {/* Hidden File Input for Custom PFP Upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePfpFileUpload}
            accept="image/*"
            className="hidden"
            id="chat-pfp-file-input"
          />

          {/* Top Neon Header */}
          <div className="h-14 px-3.5 bg-gradient-to-r from-[#0d101d] via-[#111728] to-[#0d101d] border-b border-cyan-500/30 flex items-center justify-between shrink-0 select-none relative">
            {/* Cyber accent top beam */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 animate-pulse" />

            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  title="Click to change your PFP image from files"
                  className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-pink-500 p-[1.5px] shadow-sm shadow-cyan-500/40 cursor-pointer hover:scale-105 transition"
                >
                  <div className="w-full h-full bg-[#080a11] rounded-[6px] flex items-center justify-center text-sm overflow-hidden">
                    {customPfp ? (
                      <img src={customPfp} alt="Custom Profile" className="w-full h-full object-cover" />
                    ) : (
                      AVATARS[avatarIndex].icon
                    )}
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#090b14] animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-orbitron font-extrabold text-xs tracking-wider text-white">
                    REAL<span className="text-cyan-400">CHAT</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono-cyber font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                    ● {onlineUsersCount.toLocaleString()} ON SITE
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono-cyber text-slate-400">
                  <span className="text-slate-300">#{activeChannel}</span>
                  <span>•</span>
                  <span className="text-pink-400">{username}</span>
                </div>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                id="chat-clear-btn"
                onClick={clearChatHistory}
                title="Clear Chat History"
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800/60 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                id="chat-toggle-minimize-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                id="chat-close-btn"
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-slate-800/60 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Channel Tabs & User Customizer Subheader */}
              <div className="px-3 py-2 bg-[#0c0f1d] border-b border-[#182038] flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
                {/* Channel Switchers */}
                <div className="flex items-center gap-1 font-mono-cyber">
                  <button
                    onClick={() => setActiveChannel('lobby')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center gap-1 ${
                      activeChannel === 'lobby'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Radio className="w-3 h-3 text-cyan-400" />
                    <span>#lobby</span>
                  </button>
                  <button
                    onClick={() => setActiveChannel('highscores')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center gap-1 ${
                      activeChannel === 'highscores'
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Flame className="w-3 h-3 text-pink-400" />
                    <span>#records</span>
                  </button>
                </div>

                {/* Nickname, Avatar & Image Change PFP Button */}
                <div className="flex items-center gap-1.5">
                  {/* IMAGE BUTTON: Change your PFP image from your files */}
                  <button
                    id="chat-change-pfp-image-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload & change your custom profile picture image from your files"
                    className="px-2 py-1 rounded-md bg-gradient-to-r from-cyan-500/30 to-pink-500/30 hover:from-cyan-500/50 hover:to-pink-500/50 border border-cyan-400/50 text-cyan-200 hover:text-white text-[10px] font-mono-cyber font-bold flex items-center gap-1 transition shadow-sm active:scale-95 group"
                  >
                    {showPfpSuccess ? (
                      <Check className="w-3 h-3 text-emerald-400 animate-bounce" />
                    ) : (
                      <ImageIcon className="w-3 h-3 text-cyan-300 group-hover:text-pink-300" />
                    )}
                    <span>{showPfpSuccess ? 'UPDATED!' : 'IMAGE'}</span>
                  </button>

                  {/* Reset PFP if custom is active */}
                  {customPfp && (
                    <button
                      onClick={handleResetToPresetAvatar}
                      title="Reset to default emoji avatar"
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[10px] transition"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                    </button>
                  )}

                  {/* Preset Avatar Cycler */}
                  <button
                    onClick={cycleAvatar}
                    title={customPfp ? "Using Custom Photo (click to reset)" : "Cycle preset avatar"}
                    className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-xs text-white border border-slate-700 transition flex items-center justify-center overflow-hidden shrink-0"
                  >
                    {customPfp ? (
                      <img src={customPfp} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      AVATARS[avatarIndex].icon
                    )}
                  </button>

                  <input
                    type="text"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    maxLength={16}
                    title="Click to edit your nickname"
                    placeholder="Nickname"
                    className="w-20 bg-[#070912] border border-cyan-950 focus:border-cyan-400 rounded px-1.5 py-0.5 text-[11px] font-mono-cyber text-cyan-200 outline-none"
                  />
                </div>
              </div>

              {/* Message Feed */}
              <div 
                id="chat-messages-scroll"
                className="flex-1 p-3 overflow-y-auto space-y-2.5 font-sans text-xs scrollbar-thin scrollbar-thumb-slate-800"
              >
                {/* Community Guidelines Banner */}
                <div className="p-2 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-[10px] font-mono-cyber text-cyan-300/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Real players live. Click <strong>IMAGE</strong> to set your custom photo PFP.</span>
                  </div>
                </div>

                {filteredMessages.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 font-mono-cyber space-y-1">
                    <p className="text-xs text-slate-400">No messages yet in #{activeChannel}.</p>
                    <p className="text-[10px]">Be the first to say hello to everyone online!</p>
                  </div>
                ) : (
                  filteredMessages.map((msg) => {
                    const isMe = msg.user === username;
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-2 group ${
                          isMe ? 'flex-row-reverse' : ''
                        }`}
                      >
                        {/* Avatar (Custom Image or Emoji Icon) */}
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${msg.avatarBg || 'from-cyan-500 to-blue-600'} p-[1px] shrink-0 shadow-sm overflow-hidden`}>
                          <div className="w-full h-full bg-[#0d101c] rounded-[5px] flex items-center justify-center text-xs overflow-hidden">
                            {msg.customPfp ? (
                              <img src={msg.customPfp} alt={msg.user} className="w-full h-full object-cover" />
                            ) : (
                              msg.avatar || '👾'
                            )}
                          </div>
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`max-w-[78%] rounded-xl p-2.5 space-y-1 shadow-md ${
                            isMe
                              ? 'bg-gradient-to-r from-cyan-900/70 to-indigo-900/70 border border-cyan-500/50 text-cyan-50 rounded-tr-none'
                              : 'bg-[#111528] border border-[#1e2642] text-slate-200 rounded-tl-none'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 text-[10px] font-mono-cyber">
                            <span className={`font-bold ${isMe ? 'text-cyan-300' : 'text-pink-400'}`}>
                              {msg.user}
                            </span>
                            <span className="text-slate-500">{msg.time}</span>
                          </div>

                          {/* Game Tag if sharing game */}
                          {msg.game && (
                            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/40 border border-yellow-400/30 text-[9px] text-yellow-300 font-mono-cyber">
                              <Gamepad2 className="w-2.5 h-2.5" />
                              <span>PLAYING: {msg.game}</span>
                            </div>
                          )}

                          <p className="text-[12px] leading-relaxed break-words">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar & Quick Action */}
              <div className="p-2.5 bg-[#0b0e1b] border-t border-[#182038] space-y-2 shrink-0">
                {/* Quick Share Buttons */}
                <div className="flex items-center justify-between text-[10px] font-mono-cyber text-slate-400 px-0.5">
                  <button
                    onClick={handleShareCurrentGame}
                    className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>{activeGame ? `Share "${activeGame.title}"` : 'Share Current Game'}</span>
                  </button>

                  <div className="flex items-center gap-1 text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Sync</span>
                  </div>
                </div>

                {/* Form Input */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      id="live-chat-input"
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type a message to other players..."
                      maxLength={240}
                      className="w-full bg-[#070914] border border-[#1b233a] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-3 py-2 text-xs font-sans text-slate-100 placeholder-slate-500 outline-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    id="live-chat-send-btn"
                    disabled={!inputText.trim()}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold shadow-lg shadow-cyan-500/20 transition active:scale-95 flex items-center justify-center shrink-0"
                  >
                    <Send className="w-4 h-4 fill-slate-950" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
