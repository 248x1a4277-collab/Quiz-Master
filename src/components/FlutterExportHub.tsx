import React, { useState } from 'react';
import {
  FileCode,
  Folder,
  Copy,
  Check,
  Download,
  Terminal,
  BookOpen,
  Layers,
  ChevronRight,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { FLUTTER_PROJECT_FILES, FlutterFile } from '../services/flutterProjectFiles';
import { sound } from '../services/soundEffects';

export const FlutterExportHub: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>('lib/main.dart');
  const [copiedFile, setCopiedFile] = useState<boolean>(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [copiedTerminal, setCopiedTerminal] = useState<boolean>(false);

  const selectedFile =
    FLUTTER_PROJECT_FILES.find((f) => f.path === selectedFilePath) || FLUTTER_PROJECT_FILES[0];

  const handleCopyCode = () => {
    sound.playTap();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 2000);
    }
  };

  const handleDownloadFile = () => {
    sound.playTap();
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllAsZip = () => {
    sound.playTap();
    // Bundles all files into an exported project text bundle
    let bundle = `# QUIZMASTER FLUTTER PROJECT EXPORT BUNDLE\n# Flutter 3.35+ with Dart & Provider\n# Generated: ${new Date().toISOString()}\n\n`;
    FLUTTER_PROJECT_FILES.forEach((f) => {
      bundle += `================================================================================\n`;
      bundle += `FILE: ${f.path}\n`;
      bundle += `================================================================================\n\n`;
      bundle += `${f.content}\n\n`;
    });

    const blob = new Blob([bundle], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quizmaster-flutter-source-bundle.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyApkCommand = () => {
    sound.playTap();
    const cmd = `flutter create . --org com.quizmaster.app\nflutter pub get\nflutter test\nflutter build apk --release`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cmd);
      setCopiedTerminal(true);
      setTimeout(() => setCopiedTerminal(false), 2000);
    }
  };

  const filteredFiles = FLUTTER_PROJECT_FILES.filter((f) => {
    if (activeCategoryFilter === 'all') return true;
    return f.category === activeCategoryFilter;
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 text-slate-100">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Flutter 3.35+
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">Dart Null-Safety & Provider</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            QuizMaster Flutter Source Code & Architecture
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Complete GitHub-ready Android project codebase. Organized cleanly into models,
            services, providers, screens, and widgets with automated widget tests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadAllAsZip}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <Download size={15} />
            <span>Export Source Bundle</span>
          </button>
        </div>
      </div>

      {/* APK Quick Build Terminal Card */}
      <div className="mt-6 p-4 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-inner flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
            <Terminal size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-200">
              Build Android Release APK Terminal Command
            </span>
            <code className="block text-xs font-mono text-indigo-300 mt-0.5">
              flutter pub get && flutter test && flutter build apk --release
            </code>
          </div>
        </div>

        <button
          onClick={handleCopyApkCommand}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold shrink-0 transition-colors"
        >
          {copiedTerminal ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copiedTerminal ? 'Copied Commands!' : 'Copy Commands'}</span>
        </button>
      </div>

      {/* Code Explorer Workspace */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: File Tree Explorer */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Folder size={15} className="text-indigo-400" />
              <span>Project Structure ({FLUTTER_PROJECT_FILES.length} files)</span>
            </span>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'screen', label: 'Screens' },
              { id: 'provider', label: 'Providers' },
              { id: 'service', label: 'Services' },
              { id: 'model', label: 'Models' },
              { id: 'widget', label: 'Widgets' },
              { id: 'test', label: 'Test' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  sound.playTap();
                  setActiveCategoryFilter(f.id);
                }}
                className={`px-2 py-1 text-[11px] font-semibold rounded-md whitespace-nowrap transition-colors ${
                  activeCategoryFilter === f.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Files List */}
          <div className="flex-1 space-y-1 overflow-y-auto max-h-[580px] no-scrollbar pr-1">
            {filteredFiles.map((file) => {
              const isSelected = file.path === selectedFilePath;
              return (
                <button
                  key={file.path}
                  onClick={() => {
                    sound.playTap();
                    setSelectedFilePath(file.path);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:bg-slate-800/80 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode
                      size={14}
                      className={isSelected ? 'text-white' : 'text-indigo-400'}
                    />
                    <span className="truncate">{file.path}</span>
                  </div>
                  <span
                    className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-mono shrink-0 ${
                      isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {file.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
          {/* File Header */}
          <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 size={16} className="text-indigo-400" />
              <span className="text-xs font-mono font-bold text-slate-200">
                {selectedFile.path}
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline">·</span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                {selectedFile.description}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                title="Copy code to clipboard"
              >
                {copiedFile ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedFile ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownloadFile}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                title="Download this file"
              >
                <Download size={13} />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* Code Body with Line Numbers */}
          <div className="flex-1 p-4 bg-slate-950 text-xs font-mono overflow-auto max-h-[620px] leading-relaxed text-slate-300">
            <pre className="overflow-x-auto whitespace-pre font-mono">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
