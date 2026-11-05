import { CategoryId, CategoryHighScore, Question, QuizResult } from '../types';

const STORAGE_KEYS = {
  HIGH_SCORES: 'quizmaster_high_scores_v1',
  BEST_SCORE_OVERALL: 'quizmaster_best_score_overall_v1',
  CUSTOM_QUESTIONS: 'quizmaster_custom_questions_v1',
  QUIZ_HISTORY: 'quizmaster_quiz_history_v1',
};

const INITIAL_CUSTOM_QUESTIONS: Question[] = [
  {
    id: 'cust-1',
    category: 'custom',
    categoryName: 'My Custom Questions',
    question: 'What is the primary widget tree rendering engine used by Flutter?',
    options: ['Impeller / Skia', 'WebKit', 'Gecko', 'Blink'],
    correctAnswerIndex: 0,
    difficulty: 'medium',
    isCustom: true,
  },
  {
    id: 'cust-2',
    category: 'custom',
    categoryName: 'My Custom Questions',
    question: 'In Flutter, which State Management approach uses ChangeNotifier and notifyListeners()?',
    options: ['Provider', 'Redux', 'Bloc', 'MobX'],
    correctAnswerIndex: 0,
    difficulty: 'easy',
    isCustom: true,
  },
  {
    id: 'cust-3',
    category: 'custom',
    categoryName: 'My Custom Questions',
    question: 'Which file in a Flutter project defines package dependencies and assets?',
    options: ['build.gradle', 'pubspec.yaml', 'manifest.json', 'package.json'],
    correctAnswerIndex: 1,
    difficulty: 'easy',
    isCustom: true,
  },
];

export const StorageService = {
  // Load high scores per category
  getCategoryHighScores(): Record<CategoryId, CategoryHighScore> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HIGH_SCORES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error loading high scores:', e);
    }
    return {} as Record<CategoryId, CategoryHighScore>;
  },

  // Save quiz result & update high scores
  saveQuizResult(result: QuizResult): { isNewHighScore: boolean; isOverallBest: boolean } {
    let isNewHighScore = false;
    let isOverallBest = false;

    try {
      // 1. Update Category High Score
      const scores = this.getCategoryHighScores();
      const currentCategoryScore = scores[result.categoryId];

      if (!currentCategoryScore || result.percentage > currentCategoryScore.highestPercentage) {
        scores[result.categoryId] = {
          categoryId: result.categoryId,
          categoryName: result.categoryName,
          highestScore: result.score,
          totalQuestions: result.totalQuestions,
          highestPercentage: result.percentage,
          date: result.date,
        };
        localStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(scores));
        isNewHighScore = true;
      }

      // 2. Check Overall Best
      const overallBest = this.getOverallBestScore();
      if (!overallBest || result.percentage > overallBest.percentage) {
        localStorage.setItem(STORAGE_KEYS.BEST_SCORE_OVERALL, JSON.stringify(result));
        isOverallBest = true;
      }

      // 3. Append to History
      const history = this.getQuizHistory();
      history.unshift(result);
      // Keep last 30
      localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(history.slice(0, 30)));
    } catch (e) {
      console.error('Error saving quiz result:', e);
    }

    return { isNewHighScore, isOverallBest };
  },

  // Overall best score
  getOverallBestScore(): QuizResult | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BEST_SCORE_OVERALL);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error loading overall best score:', e);
    }
    return null;
  },

  // Recent quiz history
  getQuizHistory(): QuizResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error loading quiz history:', e);
    }
    return [];
  },

  // Custom user-authored questions
  getCustomQuestions(): Question[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
      if (data) {
        return JSON.parse(data);
      }
      // Initialize with sample custom questions
      localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(INITIAL_CUSTOM_QUESTIONS));
      return INITIAL_CUSTOM_QUESTIONS;
    } catch (e) {
      console.error('Error loading custom questions:', e);
      return INITIAL_CUSTOM_QUESTIONS;
    }
  },

  addCustomQuestion(question: Omit<Question, 'id'>): Question {
    const questions = this.getCustomQuestions();
    const newQuestion: Question = {
      ...question,
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      isCustom: true,
    };
    questions.unshift(newQuestion);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(questions));
    return newQuestion;
  },

  deleteCustomQuestion(id: string): void {
    const questions = this.getCustomQuestions().filter((q) => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(questions));
  },

  // Clear data
  clearAllScores(): void {
    localStorage.removeItem(STORAGE_KEYS.HIGH_SCORES);
    localStorage.removeItem(STORAGE_KEYS.BEST_SCORE_OVERALL);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_HISTORY);
  },
};
