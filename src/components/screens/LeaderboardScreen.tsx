import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Award, Trash2, Calendar, Clock, Flame } from 'lucide-react';
import { CategoryHighScore, QuizResult } from '../../types';
import { StorageService } from '../../services/storageService';
import { sound } from '../../services/soundEffects';

interface LeaderboardScreenProps {
  onBack: () => void;
  onClearScores: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  onBack,
  onClearScores,
}) => {
  const [highScores, setHighScores] = useState<Record<string, CategoryHighScore>>({});
  const [overallBest, setOverallBest] = useState<QuizResult | null>(null);
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [activeTab, setActiveTab] = useState<'category_bests' | 'history'>('category_bests');

  useEffect(() => {
    setHighScores(StorageService.getCategoryHighScores());
    setOverallBest(StorageService.getOverallBestScore());
    setHistory(StorageService.getQuizHistory());
  }, []);

  const handleClear = () => {
    if (confirm('Are you sure you want to reset all stored high scores and quiz history?')) {
      StorageService.clearAllScores();
      setHighScores({});
      setOverallBest(null);
      setHistory([]);
      onClearScores();
      sound.playTap();
    }
  };

  const highScoreList = Object.values(highScores);

  return (
    <div className="flex-1 flex flex-col p-5 pb-6 overflow-y-auto no-scrollbar">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playTap();
              onBack();
            }}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">
              Best Scores
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Locally stored personal records
            </p>
          </div>
        </div>

        {highScoreList.length > 0 && (
          <button
            onClick={handleClear}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Reset high scores"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Hero Best Score Card */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-xl shadow-indigo-600/20 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-widest text-indigo-200 uppercase">
            All-Time Record
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold text-amber-300">
            <Trophy size={13} className="fill-amber-300" />
            <span>Grandmaster</span>
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-display">
            {overallBest ? overallBest.score : 0}
          </span>
          <span className="text-xs font-semibold text-indigo-200">POINTS</span>
          {overallBest && (
            <span className="ml-auto text-xs font-bold bg-white/20 px-2 py-0.5 rounded-md">
              {overallBest.percentage}% Accuracy
            </span>
          )}
        </div>

        <p className="mt-2 text-xs text-indigo-100/80">
          {overallBest
            ? `Achieved in ${overallBest.categoryName} (${overallBest.correctAnswers}/${overallBest.totalQuestions} correct)`
            : 'No quiz completed yet. Complete a quiz to establish your benchmark!'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl mb-4">
        <button
          onClick={() => {
            sound.playTap();
            setActiveTab('category_bests');
          }}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'category_bests'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Category Records
        </button>
        <button
          onClick={() => {
            sound.playTap();
            setActiveTab('history');
          }}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'history'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Recent Activity ({history.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'category_bests' ? (
        <div className="flex-1 space-y-2.5">
          {highScoreList.length === 0 ? (
            <div className="text-center py-10 px-4">
              <Award size={36} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-700">No Category Records Yet</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Play a quiz in any category to record your high score!
              </p>
            </div>
          ) : (
            highScoreList.map((item) => (
              <div
                key={item.categoryId}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.categoryName}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {item.date ? new Date(item.date).toLocaleDateString() : 'Recent'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-indigo-600 font-display">
                    {item.highestScore} PTS
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {item.highestPercentage}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="flex-1 space-y-2.5">
          {history.length === 0 ? (
            <div className="text-center py-10 px-4">
              <Clock size={36} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-700">No History Recorded</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Completed quiz sessions will appear here.
              </p>
            </div>
          ) : (
            history.map((h) => (
              <div
                key={h.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{h.categoryName}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span>{new Date(h.date).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{h.correctAnswers}/{h.totalQuestions} correct</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-900 font-mono">
                    {h.score} PTS
                  </span>
                  <div className="text-[10px] font-semibold text-slate-500">
                    {h.percentage}%
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
