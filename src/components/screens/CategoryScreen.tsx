import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Atom,
  Terminal,
  Sigma,
  Landmark,
  Trophy,
  Cpu,
  Edit3,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import { ActiveScreen, Difficulty, QuizCategory } from '../../types';
import { QUIZ_CATEGORIES } from '../../services/apiService';
import { sound } from '../../services/soundEffects';

interface CategoryScreenProps {
  onBack: () => void;
  onSelectCategory: (category: QuizCategory, amount: number, difficulty: Difficulty) => void;
  customQuestionsCount: number;
}

export const CategoryScreen: React.FC<CategoryScreenProps> = ({
  onBack,
  onSelectCategory,
  customQuestionsCount,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('any');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [filterType, setFilterType] = useState<'all' | 'stem' | 'humanities' | 'custom'>('all');

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles size={22} className="text-white" />;
      case 'Atom':
        return <Atom size={22} className="text-white" />;
      case 'Terminal':
        return <Terminal size={22} className="text-white" />;
      case 'Sigma':
        return <Sigma size={22} className="text-white" />;
      case 'Landmark':
        return <Landmark size={22} className="text-white" />;
      case 'Trophy':
        return <Trophy size={22} className="text-white" />;
      case 'Cpu':
        return <Cpu size={22} className="text-white" />;
      case 'Edit3':
        return <Edit3 size={22} className="text-white" />;
      default:
        return <Sparkles size={22} className="text-white" />;
    }
  };

  const filteredCategories = QUIZ_CATEGORIES.filter((cat) => {
    if (filterType === 'stem') {
      return ['science', 'math', 'computers', 'technology'].includes(cat.id);
    }
    if (filterType === 'humanities') {
      return ['general', 'history', 'sports'].includes(cat.id);
    }
    if (filterType === 'custom') {
      return cat.id === 'custom';
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col p-5 pb-6">
      {/* Top App Bar */}
      <div className="flex items-center gap-3 pb-4">
        <button
          onClick={() => {
            sound.playTap();
            onBack();
          }}
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-none">
            Quiz Categories
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Choose your topic & test your mastery
          </p>
        </div>
      </div>

      {/* Quiz Options Controls Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <SlidersHorizontal size={14} className="text-indigo-600" />
            <span>Difficulty Level</span>
          </span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {(['any', 'easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  sound.playTap();
                  setSelectedDifficulty(diff);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md capitalize transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <span className="font-semibold text-slate-700">Questions Count</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {[5, 10, 15, 20].map((num) => (
              <button
                key={num}
                onClick={() => {
                  sound.playTap();
                  setQuestionCount(num);
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  questionCount === num
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {num} Qs
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-2">
        {(
          [
            { id: 'all', label: 'All Topics' },
            { id: 'stem', label: 'STEM & Tech' },
            { id: 'humanities', label: 'Humanities & Sports' },
            { id: 'custom', label: 'Custom' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playTap();
              setFilterType(tab.id);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
              filterType === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category List */}
      <div className="flex-1 space-y-2.5 overflow-y-auto no-scrollbar pr-0.5">
        {filteredCategories.map((cat) => {
          const isCustom = cat.id === 'custom';
          const count = isCustom ? customQuestionsCount : cat.questionCountEstimate;

          return (
            <button
              key={cat.id}
              onClick={() => {
                sound.playTap();
                onSelectCategory(cat, questionCount, selectedDifficulty);
              }}
              className="w-full text-left p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition-all flex items-center justify-between group active:scale-98"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${cat.colorFrom}, ${cat.colorTo})`,
                  }}
                >
                  {getCategoryIcon(cat.iconName)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 max-w-[210px]">
                    {cat.description}
                  </p>
                  <p className="text-[10px] font-semibold text-indigo-600 mt-0.5">
                    {isCustom ? `${count} user questions` : `~${count} available questions`}
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
                <ChevronRight size={16} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
