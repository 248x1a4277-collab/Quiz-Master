export type CategoryId =
  | 'general'
  | 'science'
  | 'math'
  | 'computers'
  | 'history'
  | 'sports'
  | 'technology'
  | 'custom';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'any';

export interface QuizCategory {
  id: CategoryId;
  name: string;
  apiCategoryId: number | null; // null for custom
  description: string;
  iconName: string;
  colorFrom: string;
  colorTo: string;
  questionCountEstimate: number;
}

export interface Question {
  id: string;
  category: CategoryId;
  categoryName: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isCustom?: boolean;
}

export interface QuizResult {
  id: string;
  categoryName: string;
  categoryId: CategoryId;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  timeTakenSeconds: number;
  correctAnswers: number;
  incorrectAnswers: number;
  questions: Question[];
  userAnswers: number[]; // index of option chosen (-1 if skipped)
}

export interface CategoryHighScore {
  categoryId: CategoryId;
  categoryName: string;
  highestScore: number;
  totalQuestions: number;
  highestPercentage: number;
  date: string;
}

export type ActiveScreen =
  | 'home'
  | 'categories'
  | 'quiz'
  | 'results'
  | 'add_question'
  | 'leaderboard';
