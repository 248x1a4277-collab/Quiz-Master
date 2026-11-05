import React, { useState, useEffect } from 'react';
import {
  ActiveScreen,
  CategoryId,
  Difficulty,
  Question,
  QuizCategory,
  QuizResult,
} from './types';
import { QUIZ_CATEGORIES, fetchQuestions } from './services/apiService';
import { StorageService } from './services/storageService';
import { TopNav, AppViewMode } from './components/TopNav';
import { PhoneFrame } from './components/PhoneFrame';
import { HomeScreen } from './components/screens/HomeScreen';
import { CategoryScreen } from './components/screens/CategoryScreen';
import { QuizScreen } from './components/screens/QuizScreen';
import { ResultScreen } from './components/screens/ResultScreen';
import { AddQuestionScreen } from './components/screens/AddQuestionScreen';
import { LeaderboardScreen } from './components/screens/LeaderboardScreen';
import { FlutterExportHub } from './components/FlutterExportHub';
import { DocsHub } from './components/DocsHub';
import { sound } from './services/soundEffects';

export default function App() {
  const [appMode, setAppMode] = useState<AppViewMode>('app_simulator');
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [isFramed, setIsFramed] = useState<boolean>(true);

  // High Scores & Storage State
  const [highestScore, setHighestScore] = useState<number>(0);
  const [bestResult, setBestResult] = useState<QuizResult | null>(null);
  const [customQuestionsCount, setCustomQuestionsCount] = useState<number>(0);

  // Active Quiz State
  const [activeCategory, setActiveCategory] = useState<QuizCategory>(QUIZ_CATEGORIES[0]);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);
  const [quizErrorMessage, setQuizErrorMessage] = useState<string | null>(null);
  const [quizParams, setQuizParams] = useState<{ amount: number; difficulty: Difficulty }>({
    amount: 10,
    difficulty: 'any',
  });

  // Result state
  const [latestResult, setLatestResult] = useState<QuizResult | null>(null);
  const [isNewHighScoreAchieved, setIsNewHighScoreAchieved] = useState<boolean>(false);

  // Load initial scores and custom questions on mount
  useEffect(() => {
    refreshStoredData();
  }, []);

  const refreshStoredData = () => {
    const overall = StorageService.getOverallBestScore();
    setBestResult(overall);
    setHighestScore(overall ? overall.score : 0);

    const customs = StorageService.getCustomQuestions();
    setCustomQuestionsCount(customs.length);
  };

  const handleStartCategoryQuiz = async (
    category: QuizCategory,
    amount: number = 10,
    difficulty: Difficulty = 'any'
  ) => {
    setActiveCategory(category);
    setQuizParams({ amount, difficulty });
    setIsLoadingQuestions(true);
    setQuizErrorMessage(null);
    setActiveScreen('quiz');
    setAppMode('app_simulator');

    try {
      const customs = StorageService.getCustomQuestions();
      const questions = await fetchQuestions({
        category,
        amount,
        difficulty,
        customQuestions: customs,
      });

      if (questions.length === 0) {
        throw new Error('No questions could be loaded for this selection.');
      }

      setActiveQuestions(questions);
      setIsLoadingQuestions(false);
    } catch (err: any) {
      console.error('Quiz fetch error:', err);
      setQuizErrorMessage(err.message || 'Failed to load questions from Open Trivia DB.');
      setIsLoadingQuestions(false);
    }
  };

  const handleFinishQuiz = (
    score: number,
    correctCount: number,
    incorrectCount: number,
    userAnswers: number[],
    durationSeconds: number
  ) => {
    const total = activeQuestions.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    const result: QuizResult = {
      id: `result-${Date.now()}`,
      categoryName: activeCategory.name,
      categoryId: activeCategory.id,
      score,
      totalQuestions: total,
      percentage,
      date: new Date().toISOString(),
      timeTakenSeconds: durationSeconds,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      questions: activeQuestions,
      userAnswers,
    };

    const { isNewHighScore } = StorageService.saveQuizResult(result);
    setIsNewHighScoreAchieved(isNewHighScore);
    setLatestResult(result);
    refreshStoredData();
    setActiveScreen('results');
  };

  const handleRestartQuiz = () => {
    handleStartCategoryQuiz(activeCategory, quizParams.amount, quizParams.difficulty);
  };

  const handleInstantQuiz = () => {
    const randomCat = QUIZ_CATEGORIES[Math.floor(Math.random() * (QUIZ_CATEGORIES.length - 1))];
    handleStartCategoryQuiz(randomCat, 10, 'any');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Universal Top Bar Contract */}
      <TopNav
        currentMode={appMode}
        onSelectMode={(mode) => setAppMode(mode)}
        onInstantQuiz={handleInstantQuiz}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {appMode === 'app_simulator' && (
          <PhoneFrame
            isFramed={isFramed}
            onToggleFrame={() => setIsFramed(!isFramed)}
          >
            {activeScreen === 'home' && (
              <HomeScreen
                highestScore={highestScore}
                bestResult={bestResult}
                onNavigate={(screen) => setActiveScreen(screen)}
                onStartCategoryQuiz={(cat) => handleStartCategoryQuiz(cat)}
                customQuestionsCount={customQuestionsCount}
              />
            )}

            {activeScreen === 'categories' && (
              <CategoryScreen
                onBack={() => setActiveScreen('home')}
                onSelectCategory={(cat, amount, diff) =>
                  handleStartCategoryQuiz(cat, amount, diff)
                }
                customQuestionsCount={customQuestionsCount}
              />
            )}

            {activeScreen === 'quiz' && (
              <QuizScreen
                category={activeCategory}
                questions={activeQuestions}
                isLoading={isLoadingQuestions}
                errorMessage={quizErrorMessage}
                onRetry={() =>
                  handleStartCategoryQuiz(
                    activeCategory,
                    quizParams.amount,
                    quizParams.difficulty
                  )
                }
                onBack={() => setActiveScreen('categories')}
                onFinishQuiz={handleFinishQuiz}
              />
            )}

            {activeScreen === 'results' && latestResult && (
              <ResultScreen
                result={latestResult}
                isNewHighScore={isNewHighScoreAchieved}
                onRestart={handleRestartQuiz}
                onHome={() => setActiveScreen('home')}
              />
            )}

            {activeScreen === 'add_question' && (
              <AddQuestionScreen
                onBack={() => setActiveScreen('home')}
                onQuestionAdded={() => {
                  refreshStoredData();
                }}
              />
            )}

            {activeScreen === 'leaderboard' && (
              <LeaderboardScreen
                onBack={() => setActiveScreen('home')}
                onClearScores={() => refreshStoredData()}
              />
            )}
          </PhoneFrame>
        )}

        {appMode === 'flutter_code' && (
          <div className="py-6 px-4">
            <FlutterExportHub />
          </div>
        )}

        {appMode === 'docs' && (
          <div className="py-6 px-4">
            <DocsHub />
          </div>
        )}
      </main>
    </div>
  );
}
