import { CategoryId, Difficulty, Question, QuizCategory } from '../types';

export const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    id: 'general',
    name: 'General Knowledge',
    apiCategoryId: 9,
    description: 'Trivia covering world facts, literature, trivia, and daily life.',
    iconName: 'Sparkles',
    colorFrom: '#6366f1', // Indigo
    colorTo: '#8b5cf6', // Violet
    questionCountEstimate: 500,
  },
  {
    id: 'science',
    name: 'Science & Nature',
    apiCategoryId: 17,
    description: 'Physics, biology, chemistry, astronomy, and planetary mysteries.',
    iconName: 'Atom',
    colorFrom: '#06b6d4', // Cyan
    colorTo: '#3b82f6', // Blue
    questionCountEstimate: 420,
  },
  {
    id: 'computers',
    name: 'Computer Science',
    apiCategoryId: 18,
    description: 'Algorithms, operating systems, hardware, networks, and coding.',
    iconName: 'Terminal',
    colorFrom: '#8b5cf6', // Purple
    colorTo: '#ec4899', // Pink
    questionCountEstimate: 350,
  },
  {
    id: 'math',
    name: 'Mathematics',
    apiCategoryId: 19,
    description: 'Algebra, geometry, calculus, numbers, and logical reasoning.',
    iconName: 'Sigma',
    colorFrom: '#3b82f6', // Blue
    colorTo: '#6366f1', // Indigo
    questionCountEstimate: 180,
  },
  {
    id: 'history',
    name: 'World History',
    apiCategoryId: 23,
    description: 'Ancient empires, world wars, historical leaders, and revolutions.',
    iconName: 'Landmark',
    colorFrom: '#f59e0b', // Amber
    colorTo: '#ef4444', // Red
    questionCountEstimate: 410,
  },
  {
    id: 'sports',
    name: 'Sports & Athletics',
    apiCategoryId: 21,
    description: 'Olympics, football, basketball, cricket, records, and champions.',
    iconName: 'Trophy',
    colorFrom: '#10b981', // Emerald
    colorTo: '#06b6d4', // Cyan
    questionCountEstimate: 290,
  },
  {
    id: 'technology',
    name: 'Modern Technology',
    apiCategoryId: 30, // Gadgets
    description: 'Smartphones, gadgets, AI, robotics, and consumer tech innovation.',
    iconName: 'Cpu',
    colorFrom: '#4f46e5', // Deep Indigo
    colorTo: '#7c3aed', // Purple
    questionCountEstimate: 240,
  },
  {
    id: 'custom',
    name: 'My Custom Questions',
    apiCategoryId: null,
    description: 'Questions authored and saved locally on your device.',
    iconName: 'Edit3',
    colorFrom: '#ec4899', // Pink
    colorTo: '#f43f5e', // Rose
    questionCountEstimate: 0,
  },
];

// Reliable HTML entity decoder
export function decodeHtmlEntities(str: string): string {
  const doc = new DOMParser().parseFromString(str, 'text/html');
  return doc.documentElement.textContent || str;
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Fallback curated questions for offline or API rate limit handling
const FALLBACK_QUESTIONS: Record<CategoryId, Question[]> = {
  general: [
    {
      id: 'gen-1',
      category: 'general',
      categoryName: 'General Knowledge',
      question: 'Which country is home to the ancient city of Machu Picchu?',
      options: ['Peru', 'Bolivia', 'Chile', 'Colombia'],
      correctAnswerIndex: 0,
      difficulty: 'easy',
    },
    {
      id: 'gen-2',
      category: 'general',
      categoryName: 'General Knowledge',
      question: 'What is the largest ocean on Earth?',
      options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'],
      correctAnswerIndex: 2,
      difficulty: 'easy',
    },
    {
      id: 'gen-3',
      category: 'general',
      categoryName: 'General Knowledge',
      question: 'Who painted the famous artwork "The Starry Night"?',
      options: ['Pablo Picasso', 'Vincent van Gogh', 'Claude Monet', 'Salvador Dalí'],
      correctAnswerIndex: 1,
      difficulty: 'medium',
    },
    {
      id: 'gen-4',
      category: 'general',
      categoryName: 'General Knowledge',
      question: 'Which element has the chemical symbol "Au"?',
      options: ['Silver', 'Argon', 'Gold', 'Aluminum'],
      correctAnswerIndex: 2,
      difficulty: 'easy',
    },
    {
      id: 'gen-5',
      category: 'general',
      categoryName: 'General Knowledge',
      question: 'In which year did the Apollo 11 mission land the first humans on the Moon?',
      options: ['1965', '1969', '1971', '1973'],
      correctAnswerIndex: 1,
      difficulty: 'medium',
    },
  ],
  science: [
    {
      id: 'sci-1',
      category: 'science',
      categoryName: 'Science & Nature',
      question: 'What is the powerhouse organelle of eukaryotic cells?',
      options: ['Nucleus', 'Mitochondria', 'Endoplasmic Reticulum', 'Ribosome'],
      correctAnswerIndex: 1,
      difficulty: 'easy',
    },
    {
      id: 'sci-2',
      category: 'science',
      categoryName: 'Science & Nature',
      question: 'What is the speed of light in a vacuum approximately?',
      options: ['300,000 km/s', '150,000 km/s', '3,000 km/s', '1,000,000 km/s'],
      correctAnswerIndex: 0,
      difficulty: 'medium',
    },
    {
      id: 'sci-3',
      category: 'science',
      categoryName: 'Science & Nature',
      question: 'Which gas is most abundant in Earth\'s atmosphere?',
      options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'],
      correctAnswerIndex: 1,
      difficulty: 'easy',
    },
    {
      id: 'sci-4',
      category: 'science',
      categoryName: 'Science & Nature',
      question: 'What type of bond involves the sharing of electron pairs between atoms?',
      options: ['Ionic Bond', 'Covalent Bond', 'Hydrogen Bond', 'Van der Waals'],
      correctAnswerIndex: 1,
      difficulty: 'medium',
    },
  ],
  computers: [
    {
      id: 'comp-1',
      category: 'computers',
      categoryName: 'Computer Science',
      question: 'Which data structure follows the Last-In, First-Out (LIFO) principle?',
      options: ['Queue', 'Binary Tree', 'Stack', 'Linked List'],
      correctAnswerIndex: 2,
      difficulty: 'easy',
    },
    {
      id: 'comp-2',
      category: 'computers',
      categoryName: 'Computer Science',
      question: 'What is the average time complexity of searching in a balanced Binary Search Tree?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
      correctAnswerIndex: 2,
      difficulty: 'medium',
    },
    {
      id: 'comp-3',
      category: 'computers',
      categoryName: 'Computer Science',
      question: 'Which language is primarily used for cross-platform app development in Flutter?',
      options: ['Kotlin', 'Swift', 'Dart', 'TypeScript'],
      correctAnswerIndex: 2,
      difficulty: 'easy',
    },
    {
      id: 'comp-4',
      category: 'computers',
      categoryName: 'Computer Science',
      question: 'What does HTTP status code 404 signify?',
      options: ['Unauthorized', 'Not Found', 'Internal Server Error', 'Forbidden'],
      correctAnswerIndex: 1,
      difficulty: 'easy',
    },
  ],
  math: [
    {
      id: 'math-1',
      category: 'math',
      categoryName: 'Mathematics',
      question: 'What is the derivative of sin(x) with respect to x?',
      options: ['-cos(x)', 'cos(x)', 'tan(x)', '-sin(x)'],
      correctAnswerIndex: 1,
      difficulty: 'medium',
    },
    {
      id: 'math-2',
      category: 'math',
      categoryName: 'Mathematics',
      question: 'What is the sum of interior angles in a hexagon?',
      options: ['360°', '540°', '720°', '900°'],
      correctAnswerIndex: 2,
      difficulty: 'medium',
    },
    {
      id: 'math-3',
      category: 'math',
      categoryName: 'Mathematics',
      question: 'Which number is known as Euler’s number approximately equal to 2.718?',
      options: ['π', 'e', 'φ', 'i'],
      correctAnswerIndex: 1,
      difficulty: 'easy',
    },
  ],
  history: [
    {
      id: 'hist-1',
      category: 'history',
      categoryName: 'World History',
      question: 'In which year did the Titanic sink after striking an iceberg?',
      options: ['1910', '1912', '1914', '1918'],
      correctAnswerIndex: 1,
      difficulty: 'medium',
    },
    {
      id: 'hist-2',
      category: 'history',
      categoryName: 'World History',
      question: 'Who was the first President of the United States?',
      options: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Alexander Hamilton'],
      correctAnswerIndex: 2,
      difficulty: 'easy',
    },
  ],
  sports: [
    {
      id: 'sport-1',
      category: 'sports',
      categoryName: 'Sports & Athletics',
      question: 'How many players are on the pitch for one team in standard soccer/football?',
      options: ['9', '10', '11', '12'],
      correctAnswerIndex: 2,
      difficulty: 'easy',
    },
    {
      id: 'sport-2',
      category: 'sports',
      categoryName: 'Sports & Athletics',
      question: 'In which sport would you perform a slam dunk?',
      options: ['Volleyball', 'Basketball', 'Tennis', 'Handball'],
      correctAnswerIndex: 1,
      difficulty: 'easy',
    },
  ],
  technology: [
    {
      id: 'tech-1',
      category: 'technology',
      categoryName: 'Modern Technology',
      question: 'Which company developed the Android mobile operating system before acquisition by Google in 2005?',
      options: ['Android Inc.', 'Motorola', 'Symbian Ltd', 'Bell Labs'],
      correctAnswerIndex: 0,
      difficulty: 'medium',
    },
    {
      id: 'tech-2',
      category: 'technology',
      categoryName: 'Modern Technology',
      question: 'What does OLED stand for in display technology?',
      options: [
        'Optical Light Emitting Diode',
        'Organic Light Emitting Diode',
        'Optimized Laser Emission Device',
        'Oxide Layer Electronic Display',
      ],
      correctAnswerIndex: 1,
      difficulty: 'easy',
    },
  ],
  custom: [],
};

export interface FetchQuestionsParams {
  category: QuizCategory;
  amount?: number;
  difficulty?: Difficulty;
  customQuestions?: Question[];
}

export async function fetchQuestions({
  category,
  amount = 10,
  difficulty = 'any',
  customQuestions = [],
}: FetchQuestionsParams): Promise<Question[]> {
  // If user selected custom questions
  if (category.id === 'custom') {
    if (customQuestions.length === 0) {
      throw new Error('No custom questions found. Add questions from the "Add Questions" screen.');
    }
    return shuffleArray(customQuestions).slice(0, amount);
  }

  // If no API category ID, use fallback
  if (!category.apiCategoryId) {
    return FALLBACK_QUESTIONS[category.id] || [];
  }

  const url = new URL('https://opentdb.com/api.php');
  url.searchParams.set('amount', amount.toString());
  url.searchParams.set('category', category.apiCategoryId.toString());
  url.searchParams.set('type', 'multiple');
  if (difficulty !== 'any') {
    url.searchParams.set('difficulty', difficulty);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`OpenTDB server responded with status: ${res.status}`);
    }

    const data = await res.json();

    // response_code 0 is SUCCESS
    // 1: No Results, 2: Invalid Parameter, 5: Rate limit
    if (data.response_code === 0 && Array.isArray(data.results) && data.results.length > 0) {
      return data.results.map((raw: any, index: number) => {
        const decodedQuestion = decodeHtmlEntities(raw.question);
        const decodedCorrect = decodeHtmlEntities(raw.correct_answer);
        const decodedIncorrect: string[] = raw.incorrect_answers.map((ans: string) =>
          decodeHtmlEntities(ans)
        );

        // Put correct answer in array, then shuffle
        const allOptions = [decodedCorrect, ...decodedIncorrect];
        const shuffled = shuffleArray(allOptions);
        const correctIndex = shuffled.indexOf(decodedCorrect);

        return {
          id: `api-${category.id}-${index}-${Date.now()}`,
          category: category.id,
          categoryName: category.name,
          question: decodedQuestion,
          options: shuffled,
          correctAnswerIndex: correctIndex,
          difficulty: raw.difficulty || 'medium',
        } as Question;
      });
    }

    // If API returned rate limit or empty results, fallback to curated questions
    console.warn(`OpenTDB returned code ${data.response_code}. Using curated local fallback.`);
    const fallbacks = FALLBACK_QUESTIONS[category.id] || FALLBACK_QUESTIONS.general;
    return shuffleArray(fallbacks).slice(0, amount);
  } catch (err: any) {
    console.warn('Network request to OpenTDB failed, using verified fallback:', err.message);
    const fallbacks = FALLBACK_QUESTIONS[category.id] || FALLBACK_QUESTIONS.general;
    return shuffleArray(fallbacks).slice(0, amount);
  }
}
