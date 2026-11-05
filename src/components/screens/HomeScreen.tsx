import React from 'react';
import {
  Trophy,
  Play,
  PlusCircle,
  Sparkles,
  Atom,
  Terminal,
  Sigma,
  Landmark,
  Cpu,
  ChevronRight,
  Flame,
  Award,
} from 'lucide-react';
import { ActiveScreen, CategoryId, QuizCategory, QuizResult } from '../../types';
import { QUIZ_CATEGORIES } from '../../services/apiService';
import { sound } from '../../services/soundEffects';

interface HomeScreenProps {
  highestScore: number;
  bestResult: QuizResult | null;
  onNavigate: (screen: ActiveScreen) => void;
  onStartCategoryQuiz: (cat: QuizCategory) => void;
  customQuestionsCount: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  highestScore,
  bestResult,
  onNavigate,
  onStartCategoryQuiz,
  customQuestionsCount,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles size={20} className="text-white" />;
      case 'Atom':
        return <Atom size={20} className="text-white" />;
      case 'Terminal':
        return <Terminal size={20} className="text-white" />;
      case 'Sigma':
        return <Sigma size={20} className="text-white" />;
      case 'Landmark':
        return <Landmark size={20} className="text-white" />;
      case 'Trophy':
        return <Trophy size={20} className="text-white" />;
      case 'Cpu':
        return <Cpu size={20} className="text-white" />;
      default:
        return <Sparkles size={20} className="text-white" />;
    }
  };

  const featuredCategories = QUIZ_CATEGORIES.slice(0, 4);

  return (
    <div className="flex-1 flex flex-col p-5 pb-6">
      {/* Brand Header */}
      <div className="flex items-center justify-between pt-1 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Flame size={24} className="text-white fill-amber-300 stroke-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
              QuizMaster
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Flutter Android Quiz Edition
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            onNavigate('leaderboard');
          }}
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-indigo-600 hover:bg-slate-50 active:scale-95 transition-transform"
          title="Best Scores & Leaderboard"
        >
          <Award size={20} />
        </button>
      </div>

      {/* Highest Score Hero Card */}
      <div className="mt-2 w-full rounded-3xl p-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-xl shadow-indigo-600/30 relative overflow-hidden">
        {/* Glow Circles */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-purple-500/30 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-10 w-24 h-24 rounded-full bg-blue-400/20 blur-xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <span className="text-[11px] font-bold tracking-widest text-indigo-200 uppercase">
            Personal Best Score
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold text-amber-300">
            <Trophy size={13} className="fill-amber-300" />
            <span>Highest</span>
          </div>
        </div>

        <div className="mt-3 relative z-10 flex items-baseline gap-2">
          <span className="text-4xl font-extrabold tracking-tight font-display">
            {highestScore}
          </span>
          <span className="text-sm font-semibold text-indigo-200">PTS</span>
          {bestResult && (
            <span className="ml-auto text-xs font-semibold bg-indigo-500/50 px-2 py-0.5 rounded-md text-white">
              {bestResult.percentage}% Accuracy
            </span>
          )}
        </div>

        <p className="mt-2 text-xs text-indigo-100/90 leading-relaxed relative z-10">
          {highestScore > 0
            ? `Top record in ${bestResult?.categoryName || 'General Knowledge'}. Challenge yourself to score higher!`
            : 'Take your first quiz to set your personal best record!'}
        </p>
      </div>

      {/* Action Buttons: Start Quiz & Add Questions */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          onClick={() => {
            sound.playTap();
            onNavigate('categories');
          }}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 active:scale-98 transition-all"
        >
          <Play size={18} className="fill-white" />
          <span>Start Quiz</span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            onNavigate('add_question');
          }}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-indigo-600 text-indigo-600 font-bold text-sm shadow-sm active:scale-98 transition-all"
        >
          <PlusCircle size={18} />
          <span>Add Questions</span>
        </button>
      </div>

      {/* Categories Section Header */}
      <div className="flex items-center justify-between mt-6 mb-3">
        <h2 className="text-sm font-bold text-slate-800 tracking-tight">
          Explore Categories
        </h2>
        <button
          onClick={() => {
            sound.playTap();
            onNavigate('categories');
          }}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
        >
          <span>View All (8)</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Featured Categories Grid */}
      <div className="grid grid-cols-2 gap-3">
        {featuredCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              sound.playTap();
              onStartCategoryQuiz(cat);
            }}
            className="group p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left h-28 active:scale-95"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${cat.colorFrom}, ${cat.colorTo})`,
              }}
            >
              {getCategoryIcon(cat.iconName)}
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                ~{cat.questionCountEstimate} questions
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Custom Questions Banner */}
      <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-200/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white">
            <PlusCircle size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Custom Bank</h4>
            <p className="text-[11px] text-slate-500">
              {customQuestionsCount} authored questions saved
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            sound.playTap();
            const customCat = QUIZ_CATEGORIES.find((c) => c.id === 'custom');
            if (customCat) onStartCategoryQuiz(customCat);
          }}
          className="text-xs font-bold text-pink-600 hover:text-pink-700 px-3 py-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors"
        >
          Play Custom
        </button>
      </div>
    </div>
  );
};
