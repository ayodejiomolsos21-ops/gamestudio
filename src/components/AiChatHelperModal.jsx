import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  Trash2, 
  Copy, 
  Check, 
  Gamepad2, 
  Zap, 
  ShieldAlert, 
  Flame, 
  Code, 
  Lightbulb, 
  RotateCcw,
  MessageSquare,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import Markdown from 'react-markdown';

const SUGGESTED_PROMPTS = [
  { label: '🏆 FNAF Night 5 Guide', prompt: 'Give me a step-by-step strategy to beat Night 5 in Five Nights at Freddy\'s 1.' },
  { label: '🥊 Cuphead Boss Tips', prompt: 'What are the best weapons, charms, and tips to defeat early bosses in Cuphead?' },
  { label: '⭐ SM64 Speedrun Skips', prompt: 'What are the essential speedrun techniques in Super Mario 64 (like BLJ and long jumps)?' },
  { label: '⚡ Slope High Scores', prompt: 'How do I score over 200 in Slope? Give me movement and reaction tips.' },
  { label: '👥 Best 2-Player Games', prompt: 'Recommend the best unblocked 2-player games on this site for me and a friend.' },
  { label: '🛠️ Add Custom Iframe', prompt: 'How do I add a custom game to this portal using an iframe URL?' },
];

const PROMPT_MODES = [
  { id: 'all', label: '🎮 Game Copilot', icon: Gamepad2, desc: 'General guides, lore & advice' },
  { id: 'tactics', label: '⚔️ Boss Tactics', icon: Flame, desc: 'Overcome difficult bosses & nights' },
  { id: 'speedrun', label: '⚡ Speedrun Coach', icon: Zap, desc: 'Shortcuts, skips & mechanical optimization' },
  { id: 'modding', label: '🛠️ Game Matrix Tech', icon: Code, desc: 'Iframes, JSON configs & custom games' },
];

const INITIAL_MESSAGES = [
  {
    id: 'msg-init-1',
    role: 'model',
    text: `### 🤖 Welcome to CYBER-AI // Game Studio Copilot!
I am your personal AI gaming companion powered by **Gemini 3.7 Flash**. 

Here is what I can assist you with:
- **Game Walkthroughs & Cheats**: Tips for *Cuphead, FNAF, Super Mario 64, Slope, Retro Bowl, Cookie Clicker, Run 3*, and more.
- **Custom Game Embeds**: Guidance on finding HTTPS iframe links and importing games into your **games.json** matrix.
- **Tailored Recommendations**: Ask for idle, multiplayer, horror, simulation, or arcade games.

Select a quick prompt below or type your question to start!`,
    timestamp: new Date().toISOString()
  }
];

export const AiChatHelperModal = ({
  isOpen,
  onClose,
  activeGame,
  onPanicTrigger
}) => {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('game_studio_ai_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load chat history:', e);
    }
    return INITIAL_MESSAGES;
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState('all');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem('game_studio_ai_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  }, [messages]);

  // Keyboard shortcut: close on Escape if not captured by panic
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend = null) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toISOString()
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build server request
      const modeInfo = PROMPT_MODES.find(m => m.id === selectedMode);
      const systemContext = `Current Mode: ${modeInfo?.label || 'General'}.`;

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: newHistory.slice(-10).map(m => ({
            role: m.role,
            text: m.text
          })),
          currentGame: activeGame ? {
            title: activeGame.title,
            category: activeGame.category,
            controls: activeGame.controls,
            rating: activeGame.rating
          } : null,
          systemContext
        })
      });

      const data = await response.json();

      if (data && data.reply) {
        setMessages(prev => [
          ...prev,
          {
            id: `msg-ai-${Date.now()}`,
            role: 'model',
            text: data.reply,
            timestamp: new Date().toISOString()
          }
        ]);
      } else {
        const errorText = data?.fallbackReply || data?.error || 'Unable to connect to AI server. Please try asking again.';
        setMessages(prev => [
          ...prev,
          {
            id: `msg-err-${Date.now()}`,
            role: 'model',
            text: errorText,
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: 'model',
          text: `⚡ **Connection Error**: Failed to reach backend. Check your network or server status. In the meantime, feel free to use keyboard controls and game player tools!`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Reset and clear chat conversation history?')) {
      setMessages(INITIAL_MESSAGES);
    }
  };

  const handleCopyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleAskAboutCurrentGame = () => {
    if (!activeGame) return;
    const prompt = `Give me a complete overview, key controls, and the best tips/strategies for "${activeGame.title}" (${activeGame.category}).`;
    handleSendMessage(prompt);
  };

  return (
    <div 
      id="ai-chat-helper-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl h-[90vh] max-h-[850px] bg-[#090c17] border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/80 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-400 shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#1b233a] bg-[#0c1020]/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-pink-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#070913] rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-orbitron font-extrabold text-slate-100 tracking-wide">
                  CYBER-AI // GAME COPILOT
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-cyber font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-cyber hidden sm:block">
                Instant walkthroughs, boss strategies, speedrun tips & custom game modding
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Clear Chat Button */}
            <button
              onClick={handleClearChat}
              title="Clear conversation"
              className="p-2 rounded-lg bg-[#14192b] hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition active:scale-95 text-xs flex items-center gap-1.5 font-mono-cyber"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              title="Close modal (Esc)"
              className="p-2 rounded-lg bg-[#14192b] hover:bg-pink-950/60 text-slate-400 hover:text-pink-300 border border-slate-700/60 hover:border-pink-500/50 transition active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selector & Context Bar */}
        <div className="px-4 sm:px-6 py-2 bg-[#060811] border-b border-[#161c30] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-mono-cyber font-bold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
              MODE:
            </span>
            {PROMPT_MODES.map((mode) => {
              const Icon = mode.icon;
              const isSelected = selectedMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  title={mode.desc}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono-cyber font-semibold flex items-center gap-1.5 transition whitespace-nowrap border ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/80 shadow-sm shadow-cyan-500/20'
                      : 'bg-[#0e1222] text-slate-400 border-[#1c2236] hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active game context detector */}
          {activeGame && (
            <button
              onClick={handleAskAboutCurrentGame}
              className="px-2.5 py-1 rounded-lg bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/40 text-pink-300 text-xs font-mono-cyber font-bold flex items-center gap-1.5 transition shrink-0 animate-pulse"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-pink-400" />
              <span>Playing: {activeGame.title}</span>
              <span className="text-[10px] text-pink-400/80 underline ml-1">Ask Tips →</span>
            </button>
          )}
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-mono-cyber scroll-smooth">
          {messages.map((msg, index) => {
            const isModel = msg.role === 'model';
            return (
              <div
                key={msg.id || index}
                className={`flex gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}
              >
                {isModel && (
                  <div className="w-8 h-8 rounded-xl bg-[#0e1326] border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-cyan-950/60">
                    <Bot className="w-4 h-4 text-cyan-400" />
                  </div>
                )}

                <div className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                  isModel 
                    ? 'bg-[#0f1426]/90 border border-[#202947] text-slate-200 shadow-lg' 
                    : 'bg-gradient-to-br from-cyan-600/90 via-indigo-600/90 to-pink-600/90 text-white font-medium border border-cyan-400/50 shadow-md shadow-cyan-950/40'
                }`}>
                  {isModel ? (
                    <div className="markdown-body space-y-2.5">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}

                  {/* Message Tools Bar (Copy Button) */}
                  {isModel && (
                    <div className="mt-2.5 pt-2 border-t border-[#1b233a] flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 text-[10px]">
                        <Sparkles className="w-3 h-3 text-cyan-400" /> Game Studio AI
                      </span>
                      <button
                        onClick={() => handleCopyText(msg.text, index)}
                        className="flex items-center gap-1 hover:text-cyan-300 transition py-0.5 px-1.5 rounded hover:bg-slate-800"
                        title="Copy answer"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3 h-3 text-green-400" />
                            <span className="text-green-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-[#0e1326] border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-md">
                <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
              </div>
              <div className="bg-[#0f1426] border border-[#202947] rounded-2xl px-4 py-3 text-xs text-cyan-300 font-mono-cyber flex items-center gap-2 shadow-lg">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="inline-block w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="ml-1 text-slate-400 font-medium">Synthesizing gaming intelligence...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 sm:px-6 py-2 bg-[#070914] border-t border-[#161c30] shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-mono-cyber text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-400" /> PROMPTS:
            </span>
            {SUGGESTED_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] font-mono-cyber font-medium bg-[#0f1426] hover:bg-[#19213d] text-slate-300 hover:text-cyan-300 border border-[#222c4d] hover:border-cyan-500/50 transition active:scale-95 disabled:opacity-50"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#090c19] border-t border-[#1b233a] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask AI Copilot for cheats, boss tips, walkthroughs, or game recommendations..."
                disabled={isLoading}
                className="w-full bg-[#050711] border border-cyan-950/90 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-4 pr-10 py-3 text-xs sm:text-sm font-mono-cyber text-cyan-100 placeholder-slate-500 outline-none transition shadow-inner disabled:opacity-60"
              />
              <Bot className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 sm:px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-slate-950 font-orbitron font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <span>SEND</span>
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
