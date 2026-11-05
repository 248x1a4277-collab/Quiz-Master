import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Flame,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Difficulty, Question, QuizCategory } from '../../types';
import { sound } from '../../services/soundEffects';

interface QuizScreenProps {
  category: QuizCategory;
  questions: Question[];
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  onBack: () => void;
  onFinishQuiz: (
    score: number,
    correctCount: number,
    incorrectCount: number,
    userAnswers: number[],
    durationSeconds: number
  ) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  category,
  questions,
  isLoading,
  errorMessage,
  onRetry,
  onBack,
  onFinishQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(25); // 25s per question
  const [startTime] = useState<number>(Date.now());

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progressPercent = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  // Countdown timer per question
  useEffect(() => {
    if (isLoading || errorMessage || isAnswered || !currentQuestion) return;

    setTimeLeft(25);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, isLoading, errorMessage, isAnswered]);

  const handleTimeOut = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOptionIndex(-1); // timed out
    setIncorrectCount((prev) => prev + 1);
    setUserAnswers((prev) => [...prev, -1]);
    sound.playIncorrect();
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered || !currentQuestion) return;

    setIsAnswered(true);
    setSelectedOptionIndex(index);
    setUserAnswers((prev) => [...prev, index]);

    if (index === currentQuestion.correctAnswerIndex) {
      // Correct!
      setScore((prev) => prev + 10);
      setCorrectCount((prev) => prev + 1);
      sound.playCorrect();
    } else {
      // Incorrect!
      setIncorrectCount((prev) => prev + 1);
      sound.playIncorrect();
    }
  };

  const handleNext = () => {
    sound.playTap();
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswered(false);
    } else {
      // Quiz Finished!
      const totalDuration = Math.round((Date.now() - startTime) / 1000);
      onFinishQuiz(score, correctCount, incorrectCount, userAnswers, totalDuration);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
            <Sparkles size={20} />
          </div>
        </div>
        <h2 className="mt-5 text-base font-bold text-slate-800">
          Loading {category.name} Quiz...
        </h2>
        <p className="mt-1 text-xs text-slate-500 max-w-xs">
          Fetching questions from Open Trivia DB and formatting response...
        </p>
      </div>
    );
  }

  // Error State
  if (errorMessage || !currentQuestion) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
          <HelpCircle size={28} />
        </div>
        <h2 className="text-base font-bold text-slate-900">Unable to Load Quiz</h2>
        <p className="mt-1 text-xs text-slate-500 max-w-xs leading-relaxed">
          {errorMessage || 'No questions available for this category right now.'}
        </p>
        <div className="mt-6 flex flex-col w-full max-w-xs gap-2">
          <button
            onClick={() => {
              sound.playTap();
              onRetry();
            }}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <RefreshCw size={15} />
            <span>Retry Fetch</span>
          </button>
          <button
            onClick={() => {
              sound.playTap();
              onBack();
            }}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="flex-1 flex flex-col p-5 pb-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3">
        <button
          onClick={() => {
            sound.playTap();
            onBack();
          }}
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="text-center">
          <span className="text-xs font-bold text-slate-800">{category.name}</span>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <span className="capitalize">{currentQuestion.difficulty}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-extrabold font-mono">
          <Flame size={14} className="fill-indigo-600" />
          <span>{score} PTS</span>
        </div>
      </div>

      {/* Progress Bar & Timer */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <div
            className={`flex items-center gap-1 font-mono font-bold text-xs ${
              timeLeft <= 5 ? 'text-rose-600 animate-pulse' : 'text-slate-500'
            }`}
          >
            <Clock size={13} />
            <span>{timeLeft}s</span>
          </div>
        </div>

        <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm mb-4">
        <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
          {currentQuestion.question}
        </p>
      </div>

      {/* Options List */}
      <div className="flex-1 space-y-2.5 overflow-y-auto no-scrollbar">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOptionIndex === idx;
          const isCorrect = idx === currentQuestion.correctAnswerIndex;

          let optionStyle = 'bg-white border-slate-200/90 text-slate-800 hover:border-indigo-400';
          let badgeStyle = 'bg-slate-100 text-slate-600';

          if (isAnswered) {
            if (isCorrect) {
              optionStyle =
                'bg-emerald-50/90 border-emerald-500 text-emerald-950 font-semibold shadow-sm ring-1 ring-emerald-500/50';
              badgeStyle = 'bg-emerald-500 text-white';
            } else if (isSelected && !isCorrect) {
              optionStyle =
                'bg-rose-50/90 border-rose-500 text-rose-950 font-semibold shadow-sm ring-1 ring-rose-500/50';
              badgeStyle = 'bg-rose-500 text-white';
            } else {
              optionStyle = 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60';
              badgeStyle = 'bg-slate-200 text-slate-400';
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleSelectOption(idx)}
              className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between group active:scale-[0.99] ${optionStyle}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${badgeStyle}`}
                >
                  {optionLetters[idx]}
                </span>
                <span className="text-xs sm:text-sm leading-snug">{option}</span>
              </div>

              {isAnswered && isCorrect && (
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 ml-2" />
              )}
              {isAnswered && isSelected && !isCorrect && (
                <XCircle size={18} className="text-rose-600 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Feedback Banner & Next Button */}
      {isAnswered && (
        <div className="pt-3 border-t border-slate-200/60 flex flex-col gap-2">
          {selectedOptionIndex === currentQuestion.correctAnswerIndex ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl">
              <CheckCircle2 size={16} />
              <span>Correct! +10 Points Earned</span>
            </div>
          ) : selectedOptionIndex === -1 ? (
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-2 rounded-xl">
              <Clock size={16} />
              <span>Time's up! The correct answer was: {currentQuestion.options[currentQuestion.correctAnswerIndex]}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-2 rounded-xl">
              <XCircle size={16} />
              <span>Incorrect! Correct: {currentQuestion.options[currentQuestion.correctAnswerIndex]}</span>
            </div>
          )}

          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-98 transition-all"
          >
            <span>{currentIndex < totalQuestions - 1 ? 'Next Question' : 'View Results'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
