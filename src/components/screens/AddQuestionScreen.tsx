import React, { useState } from 'react';
import { ArrowLeft, PlusCircle, Check, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { CategoryId, Difficulty, Question, QuizCategory } from '../../types';
import { QUIZ_CATEGORIES } from '../../services/apiService';
import { StorageService } from '../../services/storageService';
import { sound } from '../../services/soundEffects';

interface AddQuestionScreenProps {
  onBack: () => void;
  onQuestionAdded: (newQuestion: Question) => void;
}

export const AddQuestionScreen: React.FC<AddQuestionScreenProps> = ({
  onBack,
  onQuestionAdded,
}) => {
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<CategoryId>('custom');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!questionText.trim()) {
      setErrorMsg('Please enter a question statement.');
      return;
    }
    if (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      setErrorMsg('All four answer options must be filled in.');
      return;
    }

    const selectedCategoryObj = QUIZ_CATEGORIES.find((c) => c.id === categoryId);

    const newQuestion = StorageService.addCustomQuestion({
      category: categoryId,
      categoryName: selectedCategoryObj?.name || 'My Custom Questions',
      question: questionText.trim(),
      options: [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()],
      correctAnswerIndex,
      difficulty: difficulty === 'any' ? 'medium' : difficulty,
      isCustom: true,
    });

    sound.playCorrect();
    setSavedSuccess(true);
    onQuestionAdded(newQuestion);

    // Reset form after short delay
    setTimeout(() => {
      setQuestionText('');
      setOptionA('');
      setOptionB('');
      setOptionC('');
      setOptionD('');
      setSavedSuccess(false);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-5 pb-6 overflow-y-auto no-scrollbar">
      {/* Top Bar */}
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
            Add Custom Question
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Author and store questions on your device
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check size={16} className="text-emerald-600" />
          <span>Question saved successfully to local storage!</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Authoring Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Picker */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value as CategoryId)}
            className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {QUIZ_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Question Text */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Question Statement
          </label>
          <textarea
            rows={3}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="e.g. In Flutter, which widget manages state changes via notifyListeners()?"
            className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* 4 Options with Correct Answer Selector */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700">
              Answer Options
            </label>
            <span className="text-[11px] text-indigo-600 font-semibold">
              Select radio for correct answer
            </span>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Option A', value: optionA, setter: setOptionA, index: 0 },
              { label: 'Option B', value: optionB, setter: setOptionB, index: 1 },
              { label: 'Option C', value: optionC, setter: setOptionC, index: 2 },
              { label: 'Option D', value: optionD, setter: setOptionD, index: 3 },
            ].map((opt) => (
              <div
                key={opt.index}
                className={`flex items-center gap-2 p-2 rounded-xl bg-white border ${
                  correctAnswerIndex === opt.index
                    ? 'border-indigo-500 ring-1 ring-indigo-500/30'
                    : 'border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={correctAnswerIndex === opt.index}
                  onChange={() => setCorrectAnswerIndex(opt.index)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 ml-1 cursor-pointer"
                />
                <span className="w-5 text-center text-xs font-bold text-slate-400">
                  {String.fromCharCode(65 + opt.index)}
                </span>
                <input
                  type="text"
                  value={opt.value}
                  onChange={(e) => opt.setter(e.target.value)}
                  placeholder={`Enter ${opt.label}...`}
                  className="flex-1 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                />
                {correctAnswerIndex === opt.index && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                    Correct
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Difficulty
          </label>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
              <button
                type="button"
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                  difficulty === diff
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-98 transition-all"
          >
            <PlusCircle size={18} />
            <span>Save Question to Device</span>
          </button>
        </div>
      </form>
    </div>
  );
};
