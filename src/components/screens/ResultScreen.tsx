import React, { useState, useEffect } from 'react';
import {
  Trophy,
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Share2,
  Sparkles,
} from 'lucide-react';
import { QuizResult } from '../../types';
import { sound } from '../../services/soundEffects';
import { fireConfetti } from '../../services/confetti';

interface ResultScreenProps {
  result: QuizResult;
  isNewHighScore: boolean;
  onRestart: () => void;
  onHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  isNewHighScore,
  onRestart,
  onHome,
}) => {
  const [showReview, setShowReview] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (result.percentage >= 60 || isNewHighScore) {
      fireConfetti();
      sound.playFanfare();
    }
  }, [result.percentage, isNewHighScore]);

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return { title: 'Quiz Master!', subtitle: 'Phenomenal score! You mastered this subject.' };
    if (percentage >= 70) return { title: 'Excellent Work!', subtitle: 'Great accuracy and quick thinking.' };
    if (percentage >= 50) return { title: 'Good Effort!', subtitle: 'Solid attempt! Practice again to hit 90%+.' };
    return { title: 'Keep Learning!', subtitle: 'Every attempt builds stronger knowledge. Try again!' };
  };

  const perf = getPerformanceMessage(result.percentage);

  const handleShare = () => {
    sound.playTap();
    const text = `I just scored ${result.score} PTS (${result.percentage}%) on QuizMaster in ${result.categoryName}! 🧠🔥`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-5 pb-6 overflow-y-auto no-scrollbar">
      {/* Celebration Header */}
      <div className="flex flex-col items-center text-center pt-2 pb-4">
        {/* Trophy / Score Ring */}
        <div className="relative mb-3">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-600/30">
            <Trophy size={44} className="text-amber-300 fill-amber-300 stroke-indigo-900" />
          </div>
          {isNewHighScore && (
            <div className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md">
              New Best!
            </div>
          )}
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
          {perf.title}
        </h1>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          {perf.subtitle}
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4 mb-4">
        {/* Big Percentage & Score */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Final Score
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-extrabold text-indigo-600 font-display">
                {result.score}
              </span>
              <span className="text-xs font-bold text-slate-400">PTS</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Accuracy
            </span>
            <div className="text-3xl font-extrabold text-slate-900 font-display mt-0.5">
              {result.percentage}%
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total</span>
            <span className="text-base font-extrabold text-slate-800">
              {result.totalQuestions}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-600 uppercase block">Correct</span>
            <span className="text-base font-extrabold text-emerald-700">
              {result.correctAnswers}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-100">
            <span className="text-[10px] font-bold text-rose-600 uppercase block">Wrong</span>
            <span className="text-base font-extrabold text-rose-700">
              {result.incorrectAnswers}
            </span>
          </div>
        </div>

        {/* Time Spent */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock size={14} className="text-slate-400" />
            <span>Time Taken</span>
          </span>
          <span className="font-bold text-slate-800 font-mono">
            {result.timeTakenSeconds} seconds
          </span>
        </div>
      </div>

      {/* Answer Review Accordion */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-4">
        <button
          onClick={() => {
            sound.playTap();
            setShowReview(!showReview);
          }}
          className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-600" />
            <span>Review All Questions & Answers</span>
          </div>
          {showReview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showReview && (
          <div className="p-4 pt-0 space-y-3 border-t border-slate-100 max-h-72 overflow-y-auto no-scrollbar">
            {result.questions.map((q, qIndex) => {
              const userPick = result.userAnswers[qIndex];
              const isCorrect = userPick === q.correctAnswerIndex;
              const isTimeout = userPick === -1;

              return (
                <div
                  key={q.id || qIndex}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900 leading-snug">
                      {qIndex + 1}. {q.question}
                    </span>
                    {isCorrect ? (
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                    )}
                  </div>

                  <div className="text-[11px] space-y-0.5 pt-1">
                    <div className="text-emerald-700 font-medium">
                      ✓ Correct: {q.options[q.correctAnswerIndex]}
                    </div>
                    {!isCorrect && (
                      <div className="text-rose-700 font-medium">
                        ✗ Your answer:{' '}
                        {isTimeout ? 'Timed out' : q.options[userPick] || 'None'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Primary Actions */}
      <div className="mt-auto space-y-2 pt-2">
        <button
          onClick={() => {
            sound.playTap();
            onRestart();
          }}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-98 transition-all"
        >
          <RotateCcw size={18} />
          <span>Restart Quiz</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              sound.playTap();
              onHome();
            }}
            className="w-full py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <Home size={16} />
            <span>Back to Home</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-indigo-600 font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <Share2 size={15} />
            <span>{copiedLink ? 'Copied Score!' : 'Share Result'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
