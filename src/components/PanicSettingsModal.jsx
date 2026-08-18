import React from 'react';
import { X, ShieldAlert, Check, Keyboard, EyeOff } from 'lucide-react';
import ssj4GogetaIcon from '../assets/images/ssj4_gogeta_icon_1787080126364.jpg';

export const CLOAK_OPTIONS = [
  {
    id: 'default',
    name: 'Normal (Game Studio)',
    title: 'Game Studio',
    icon: ssj4GogetaIcon,
    redirectUrl: ''
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes',
    icon: 'https://ssl.gstatic.com/classroom/favicon.png',
    redirectUrl: 'https://classroom.google.com'
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    icon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png',
    redirectUrl: 'https://drive.google.com'
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    icon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
    redirectUrl: 'https://docs.google.com'
  },
  {
    id: 'desmos',
    name: 'Desmos Calculator',
    title: 'Desmos | Graphing Calculator',
    icon: 'https://www.desmos.com/favicon.ico',
    redirectUrl: 'https://www.desmos.com/calculator'
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    title: 'Wikipedia, the free encyclopedia',
    icon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
    redirectUrl: 'https://en.wikipedia.org'
  },
  {
    id: 'blank',
    name: 'Blank New Tab',
    title: 'New Tab',
    icon: 'data:image/x-icon;base64,iVBORw0KGgo=',
    redirectUrl: 'https://google.com'
  }
];

export const PanicSettingsModal = ({
  isOpen,
  onClose,
  selectedCloak,
  onSelectCloak,
  panicKey,
  onChangePanicKey,
  panicUrl,
  onChangePanicUrl
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0c0e18] border border-cyan-500/40 rounded-xl shadow-2xl shadow-cyan-950/50 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top cyan-to-pink line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500 via-pink-500 to-yellow-400" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1b233a] bg-[#07080e]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/40">
              <EyeOff className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-orbitron font-bold text-white tracking-wide">STEALTH CLOAK &amp; PANIC KEY</h2>
              <p className="text-xs font-mono-cyber text-slate-400">Mask browser tab telemetry &amp; configure emergency switch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-[#141829] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto font-mono-cyber">
          {/* Cloak Options List */}
          <div>
            <label className="block text-xs font-bold text-cyan-300 mb-2 uppercase">
              SELECT CLOAK CAMOUFLAGE (UPDATES TAB TITLE &amp; FAVICON)
            </label>
            <div className="space-y-2">
              {CLOAK_OPTIONS.map((opt) => {
                const isCurrent = selectedCloak === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onSelectCloak(opt)}
                    className={`w-full p-3 rounded-lg border flex items-center justify-between transition text-left ${
                      isCurrent
                        ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-sm shadow-cyan-500/20'
                        : 'bg-[#07080e] border-[#1b233a] hover:border-cyan-500/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 flex items-center justify-center rounded bg-[#141829] border border-[#1b233a] overflow-hidden">
                        {opt.icon.startsWith('http') || opt.icon.startsWith('data:') ? (
                          <img src={opt.icon} alt="" className="w-4 h-4 object-contain" />
                        ) : (
                          <span className="text-sm">{opt.icon}</span>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200 font-rajdhani uppercase tracking-wider">{opt.name}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[240px] font-mono-cyber">{opt.title}</div>
                      </div>
                    </div>
                    {isCurrent && (
                      <div className="p-1 rounded bg-cyan-400 text-slate-950 font-bold">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panic Key Settings */}
          <div className="p-4 rounded-lg bg-[#07080e] border border-pink-500/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-pink-400 font-orbitron">
              <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
              <span>[ EMERGENCY PANIC PROTOCOL ]</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase">
                  TRIGGER HOTKEY
                </label>
                <div className="flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-slate-500" />
                  <select
                    value={panicKey}
                    onChange={(e) => onChangePanicKey(e.target.value)}
                    className="bg-[#0c0e18] border border-[#1b233a] focus:border-pink-400 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none w-full"
                  >
                    <option value="Escape">Escape (Esc)</option>
                    <option value="Backquote">Tilde (` / ~)</option>
                    <option value="F2">F2 Key</option>
                    <option value="Equal">Plus/Equals (=)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase">
                  REDIRECT TARGET URL
                </label>
                <input
                  type="url"
                  value={panicUrl}
                  onChange={(e) => onChangePanicUrl(e.target.value)}
                  placeholder="https://classroom.google.com"
                  className="w-full bg-[#0c0e18] border border-[#1b233a] focus:border-pink-400 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-mono-cyber">
              Pressing the trigger key anywhere in matrix immediately redirects your browser tab.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-[#1b233a] bg-[#07080e]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-slate-950 text-xs font-orbitron font-bold shadow-lg shadow-cyan-500/25 transition"
          >
            CONFIRM CONFIG
          </button>
        </div>
      </div>
    </div>
  );
};
