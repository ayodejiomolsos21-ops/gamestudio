import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  RotateCcw, 
  Copy, 
  Check, 
  AlertCircle, 
  Save, 
  Database 
} from 'lucide-react';

export const JsonManagerModal = ({
  isOpen,
  onClose,
  games,
  onSaveGames,
  onResetDefaults
}) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setJsonText(JSON.stringify(games, null, 2));
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen, games]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        const parsed = JSON.parse(content);
        if (!Array.isArray(parsed)) {
          throw new Error('JSON root must be an array of game objects.');
        }
        setJsonText(JSON.stringify(parsed, null, 2));
        setError(null);
        setSuccessMsg(`Ingested ${parsed.length} matrix games from file.`);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Invalid JSON file';
        setError('Matrix parse failure: ' + message);
      }
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Root element must be an Array of game objects.');
      }
      for (let i = 0; i < parsed.length; i++) {
        if (!parsed[i].id || !parsed[i].title) {
          throw new Error(`Item at index ${i} is missing required "id" or "title" property.`);
        }
      }
      onSaveGames(parsed);
      setSuccessMsg('Successfully written to games.json!');
      setError(null);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid JSON syntax';
      setError('Matrix Error: ' + message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0c0e18] border border-cyan-500/40 rounded-xl shadow-2xl shadow-cyan-950/50 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top cyan neon line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500 via-pink-500 to-yellow-400" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1b233a] bg-[#07080e]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-orbitron font-bold text-white tracking-wide">GAMES.JSON MATRIX ENGINE</h2>
              <p className="text-xs font-mono-cyber text-slate-400">All iframe nodes, categories, and controls loaded from JSON</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-[#141829] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#08090f] border-b border-[#1b233a] text-xs font-mono-cyber">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-[#141829] hover:bg-[#1e253e] text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 font-bold flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'DUMP COPIED' : 'COPY DUMP'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-[#141829] hover:bg-[#1e253e] text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 font-bold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>EXPORT games.json</span>
            </button>

            <label className="px-3 py-1.5 rounded-lg bg-[#141829] hover:bg-[#1e253e] text-pink-300 border border-pink-500/30 hover:border-pink-400 font-bold flex items-center gap-1.5 transition cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-pink-400" />
              <span>IMPORT JSON</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <button
            onClick={() => {
              if (confirm('Reset entire matrix to default core catalog?')) {
                onResetDefaults();
                onClose();
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/50 text-red-300 font-bold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>PURGE TO DEFAULT</span>
          </button>
        </div>

        {/* JSON Editor Box */}
        <div className="flex-1 p-4 bg-[#07080e] overflow-hidden flex flex-col font-mono-cyber">
          {error && (
            <div className="mb-3 p-3 rounded-lg bg-red-950/70 border border-red-500/80 text-red-300 text-xs flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-3 p-3 rounded-lg bg-emerald-950/70 border border-emerald-500/80 text-emerald-300 text-xs flex items-center gap-2 font-bold">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <textarea
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setError(null);
            }}
            className="w-full flex-1 min-h-[340px] bg-[#0c0e18] border border-[#1b233a] rounded-lg p-4 font-mono-cyber text-xs text-cyan-300 focus:border-cyan-400 outline-none resize-none leading-relaxed"
            placeholder="[ { id: '...', title: '...' } ]"
            spellCheck={false}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[#1b233a] bg-[#07080e] font-mono-cyber">
          <span className="text-xs text-slate-500">
            {games.length} SIMULATION NODES ACTIVE
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#141829] hover:bg-[#1e253e] text-slate-300 hover:text-white text-xs font-bold transition"
            >
              CLOSE
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-slate-950 text-xs font-orbitron font-bold shadow-lg shadow-cyan-500/25 transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> [ OVERWRITE MATRIX ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
