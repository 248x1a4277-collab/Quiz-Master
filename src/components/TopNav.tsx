import React from 'react';
import { Smartphone, Code2, BookOpen, Play } from 'lucide-react';
import { sound } from '../services/soundEffects';

export type AppViewMode = 'app_simulator' | 'flutter_code' | 'docs';

interface TopNavProps {
  currentMode: AppViewMode;
  onSelectMode: (mode: AppViewMode) => void;
  onInstantQuiz: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentMode,
  onSelectMode,
  onInstantQuiz,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 bg-slate-950 border-b border-slate-800 text-white z-40 sticky top-0">
      {/* Zone 1: Wordmark display title */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
          Q
        </div>
        <span className="text-lg font-bold tracking-tight text-white font-display">
          QuizMaster
        </span>
      </div>

      {/* Zone 2: 3-4 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => {
            sound.playTap();
            onSelectMode('app_simulator');
          }}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
            currentMode === 'app_simulator'
              ? 'text-indigo-400 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone size={15} />
          <span>Android App Simulator</span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            onSelectMode('flutter_code');
          }}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
            currentMode === 'flutter_code'
              ? 'text-indigo-400 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code2 size={15} />
          <span>Flutter Source Code (14 Files)</span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            onSelectMode('docs');
          }}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
            currentMode === 'docs'
              ? 'text-indigo-400 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen size={15} />
          <span>Architecture & APK Guide</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => {
            sound.playTap();
            onInstantQuiz();
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30 whitespace-nowrap shrink-0 active:scale-95"
        >
          <Play size={14} className="fill-white" />
          <span>Start Instant Quiz</span>
        </button>
      </div>
    </header>
  );
};
