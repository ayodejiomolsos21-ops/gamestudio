import React, { useState } from 'react';
import { X, Plus, Eye, Code, Globe, Sparkles } from 'lucide-react';

const CATEGORIES = ['Arcade', 'Puzzle', 'Action', 'Retro', 'Classic', 'Sports'];

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [inputType, setInputType] = useState('url');
  const [iframeInput, setIframeInput] = useState('');
  const [controls, setControls] = useState('Arrow keys / Mouse');
  const [description, setDescription] = useState('');
  const [previewActive, setPreviewActive] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a game title.');
      return;
    }
    if (!iframeInput.trim()) {
      setError('Please provide an iframe URL or embed code.');
      return;
    }

    const id = 'custom-' + Date.now();
    let finalSrc = '';
    let finalHtml = '';

    if (inputType === 'url') {
      finalSrc = iframeInput.trim();
      finalHtml = `<iframe src="${finalSrc}" width="100%" height="100%" frameborder="0" allow="fullscreen; autoplay"></iframe>`;
    } else {
      finalHtml = iframeInput.trim();
      const match = finalHtml.match(/src=["']([^"']+)["']/i);
      finalSrc = match ? match[1] : '';
    }

    const newGame = {
      id,
      title: title.trim(),
      category,
      description: description.trim() || `Play ${title.trim()} unblocked in cyber matrix mode.`,
      controls: controls.trim() || 'Keyboard & Mouse',
      iframeSrc: finalSrc,
      iframeHtml: finalHtml,
      thumbnail: '',
      thumbnailGradient: 'from-cyan-600 via-indigo-900 to-pink-900',
      iconName: 'Sparkles',
      rating: 5.0,
      plays: 1,
      isCustom: true
    };

    onAddGame(newGame);
    onClose();
    // Reset fields
    setTitle('');
    setIframeInput('');
    setDescription('');
    setError('');
    setPreviewActive(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0c0e18] border border-cyan-500/40 rounded-xl shadow-2xl shadow-cyan-950/50 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top cyan neon line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500 via-pink-500 to-yellow-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1b233a] bg-[#07080e]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-orbitron font-bold text-white tracking-wide">INJECT CUSTOM IFRAME GAME</h2>
              <p className="text-xs font-mono-cyber text-slate-400">Append custom HTML5 iframe matrix to games.json</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-[#141829] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto font-mono-cyber text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/70 border border-red-500/60 text-red-300 text-xs font-bold">
              {error}
            </div>
          )}

          {/* Title & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-cyan-300 mb-1.5 uppercase">GAME TITLE *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => { setTitle(e.target.value); setError(''); }}
                placeholder="e.g. Cyber Runner 2077"
                className="w-full bg-[#07080e] border border-[#1b233a] focus:border-cyan-400 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-600 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-cyan-300 mb-1.5 uppercase">CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#07080e] border border-[#1b233a] focus:border-cyan-400 rounded-lg px-3.5 py-2 text-sm text-white outline-none transition"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Source Type Selector */}
          <div>
            <label className="block text-xs font-bold text-cyan-300 mb-1.5 uppercase">IFRAME SOURCE INGESTION</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInputType('url')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition ${
                  inputType === 'url'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'bg-[#07080e] text-slate-400 border-[#1b233a] hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4 text-cyan-400" /> WEB URL
              </button>
              <button
                type="button"
                onClick={() => setInputType('code')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition ${
                  inputType === 'code'
                    ? 'bg-pink-500/20 text-pink-300 border-pink-400'
                    : 'bg-[#07080e] text-slate-400 border-[#1b233a] hover:text-white'
                }`}
              >
                <Code className="w-4 h-4 text-pink-400" /> RAW &lt;iframe&gt;
              </button>
            </div>
          </div>

          {/* Iframe Input */}
          <div>
            <label className="block text-xs font-bold text-cyan-300 mb-1.5 uppercase">
              {inputType === 'url' ? 'GAME EMBED WEB URL *' : 'IFRAME EMBED HTML SNIPPET *'}
            </label>
            {inputType === 'url' ? (
              <input
                type="url"
                required
                value={iframeInput}
                onChange={(e) => { setIframeInput(e.target.value); setError(''); }}
                placeholder="https://example.com/games/my-game"
                className="w-full bg-[#07080e] border border-[#1b233a] focus:border-cyan-400 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-600 outline-none"
              />
            ) : (
              <textarea
                required
                rows={3}
                value={iframeInput}
                onChange={(e) => { setIframeInput(e.target.value); setError(''); }}
                placeholder='<iframe src="https://example.com/embed" width="100%" height="100%" frameborder="0"></iframe>'
                className="w-full bg-[#07080e] border border-[#1b233a] focus:border-pink-400 rounded-lg p-3 text-xs font-mono-cyber text-pink-300 placeholder-slate-600 outline-none"
              />
            )}
          </div>

          {/* Controls hint */}
          <div>
            <label className="block text-xs font-bold text-cyan-300 mb-1.5 uppercase">INPUT & KEYBOARD CONTROLS</label>
            <input
              type="text"
              value={controls}
              onChange={(e) => setControls(e.target.value)}
              placeholder="e.g. WASD to move, Space to attack"
              className="w-full bg-[#07080e] border border-[#1b233a] focus:border-cyan-400 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-600 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-cyan-300 mb-1.5 uppercase">BRIEF SIMULATION DESCRIPTION</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of game mechanics and objective..."
              className="w-full bg-[#07080e] border border-[#1b233a] focus:border-cyan-400 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-600 outline-none font-sans"
            />
          </div>

          {/* Live Preview Toggle */}
          {iframeInput.trim() && (
            <div>
              <button
                type="button"
                onClick={() => setPreviewActive(!previewActive)}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" /> {previewActive ? '[ HIDE MATRIX PREVIEW ]' : '[ TEST MATRIX PREVIEW ]'}
              </button>
              {previewActive && (
                <div className="mt-2 h-44 rounded-lg border border-cyan-500/40 bg-black overflow-hidden relative">
                  <iframe
                    src={inputType === 'url' ? iframeInput : undefined}
                    srcDoc={inputType === 'code' ? iframeInput : undefined}
                    title="Game Preview"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                  />
                </div>
              )}
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1b233a]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#141829] hover:bg-[#1e253e] text-slate-300 hover:text-white text-xs font-bold transition"
            >
              ABORT
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-slate-950 text-xs font-orbitron font-bold shadow-lg shadow-cyan-500/25 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> [ INJECT GAME ]
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
