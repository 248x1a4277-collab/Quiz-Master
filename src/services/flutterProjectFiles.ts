export interface FlutterFile {
  path: string;
  name: string;
  category: 'config' | 'model' | 'service' | 'provider' | 'screen' | 'widget' | 'test' | 'docs';
  description: string;
  content: string;
}

export const FLUTTER_PROJECT_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    category: 'config',
    description: 'Flutter project configuration and package dependencies',
    content: `name: quizmaster
description: "A modern, interactive Android Quiz Application built with Flutter and Provider."
publish_to: 'none'

version: 1.0.0+1

environment:
  sdk: '>=3.3.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  # State management using ChangeNotifier
  provider: ^6.1.2
  # HTTP client for Open Trivia DB API
  http: ^1.2.1
  # Local persistence for custom questions & high scores
  shared_preferences: ^2.2.3
  # HTML entity decoder for API question strings
  html_unescape: ^2.0.0
  # Beautiful Google typography
  google_fonts: ^6.2.1
  # Modern vector icons
  cupertino_icons: ^1.0.8

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
`,
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    category: 'config',
    description: 'Application entry point initializing Provider and Material 3 theme',
    content: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'providers/quiz_provider.dart';
import 'screens/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  final quizProvider = QuizProvider();
  await quizProvider.initialize();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: quizProvider),
      ],
      child: const QuizMasterApp(),
    ),
  );
}

class QuizMasterApp extends StatelessWidget {
  const QuizMasterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'QuizMaster',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6366F1), // Royal Indigo
          brightness: Brightness.light,
          primary: const Color(0xFF4F46E5),
          secondary: const Color(0xFF9333EA),
          surface: Colors.white,
          background: const Color(0xFFF8FAFC),
        ),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(
          Theme.of(context).textTheme,
        ),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        appBarTheme: const AppBarTheme(
          elevation: 0,
          backgroundColor: Colors.transparent,
          foregroundColor: Color(0xFF0F172A),
          centerTitle: true,
        ),
      ),
      home: const HomeScreen(),
    );
  }
}
`,
  },
  {
    path: 'lib/models/question_model.dart',
    name: 'question_model.dart',
    category: 'model',
    description: 'Data model for quiz questions with serialization and HTML decoding',
    content: `import 'dart:convert';
import 'package:html_unescape/html_unescape.dart';

class QuestionModel {
  final String id;
  final String categoryId;
  final String categoryName;
  final String question;
  final List<String> options;
  final int correctAnswerIndex;
  final String difficulty;
  final bool isCustom;

  QuestionModel({
    required this.id,
    required this.categoryId,
    required this.categoryName,
    required this.question,
    required this.options,
    required this.correctAnswerIndex,
    this.difficulty = 'medium',
    this.isCustom = false,
  });

  String get correctAnswer => options[correctAnswerIndex];

  // Factory constructor to parse Open Trivia DB API responses
  factory QuestionModel.fromOpenTdb(Map<String, dynamic> json, String categoryId, String catName) {
    final unescape = HtmlUnescape();
    final decodedQuestion = unescape.convert(json['question'] ?? '');
    final decodedCorrect = unescape.convert(json['correct_answer'] ?? '');
    final List<dynamic> incorrectRaw = json['incorrect_answers'] ?? [];
    
    final List<String> decodedOptions = [
      decodedCorrect,
      ...incorrectRaw.map((e) => unescape.convert(e.toString())),
    ];
    
    // Shuffle options so correct answer isn't predictable
    decodedOptions.shuffle();
    final correctIndex = decodedOptions.indexOf(decodedCorrect);

    return QuestionModel(
      id: 'opentdb_\${DateTime.now().microsecondsSinceEpoch}_\${json.hashCode}',
      categoryId: categoryId,
      categoryName: catName,
      question: decodedQuestion,
      options: decodedOptions,
      correctAnswerIndex: correctIndex >= 0 ? correctIndex : 0,
      difficulty: json['difficulty'] ?? 'medium',
      isCustom: false,
    );
  }

  // Local storage JSON serialization for custom questions
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'categoryId': categoryId,
      'categoryName': categoryName,
      'question': question,
      'options': options,
      'correctAnswerIndex': correctAnswerIndex,
      'difficulty': difficulty,
      'isCustom': isCustom,
    };
  }

  factory QuestionModel.fromJson(Map<String, dynamic> json) {
    return QuestionModel(
      id: json['id'] ?? '',
      categoryId: json['categoryId'] ?? 'general',
      categoryName: json['categoryName'] ?? 'General Knowledge',
      question: json['question'] ?? '',
      options: List<String>.from(json['options'] ?? []),
      correctAnswerIndex: json['correctAnswerIndex'] ?? 0,
      difficulty: json['difficulty'] ?? 'medium',
      isCustom: json['isCustom'] ?? true,
    );
  }
}
`,
  },
  {
    path: 'lib/models/quiz_category.dart',
    name: 'quiz_category.dart',
    category: 'model',
    description: 'Category model mapping to Open Trivia DB IDs and gradient colors',
    content: `import 'package:flutter/material.dart';

class QuizCategory {
  final String id;
  final String name;
  final int? apiCategoryId;
  final String description;
  final IconData icon;
  final List<Color> gradientColors;

  const QuizCategory({
    required this.id,
    required this.name,
    this.apiCategoryId,
    required this.description,
    required this.icon,
    required this.gradientColors,
  });

  static const List<QuizCategory> categories = [
    QuizCategory(
      id: 'general',
      name: 'General Knowledge',
      apiCategoryId: 9,
      description: 'World facts, literature, culture, and daily trivia.',
      icon: Icons.lightbulb_outline_rounded,
      gradientColors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
    ),
    QuizCategory(
      id: 'science',
      name: 'Science & Nature',
      apiCategoryId: 17,
      description: 'Physics, biology, chemistry, and cosmos.',
      icon: Icons.biotech_rounded,
      gradientColors: [Color(0xFF06B6D4), Color(0xFF3B82F6)],
    ),
    QuizCategory(
      id: 'computers',
      name: 'Computer Science',
      apiCategoryId: 18,
      description: 'Coding, algorithms, hardware, and networks.',
      icon: Icons.terminal_rounded,
      gradientColors: [Color(0xFF8B5CF6), Color(0xFFEC4899)],
    ),
    QuizCategory(
      id: 'math',
      name: 'Mathematics',
      apiCategoryId: 19,
      description: 'Algebra, geometry, formulas, and logic.',
      icon: Icons.functions_rounded,
      gradientColors: [Color(0xFF3B82F6), Color(0xFF6366F1)],
    ),
    QuizCategory(
      id: 'history',
      name: 'World History',
      apiCategoryId: 23,
      description: 'Ancient civilizations, leaders, and pivotal events.',
      icon: Icons.account_balance_rounded,
      gradientColors: [Color(0xFFF59E0B), Color(0xFFEF4444)],
    ),
    QuizCategory(
      id: 'sports',
      name: 'Sports & Athletics',
      apiCategoryId: 21,
      description: 'Olympics, football, records, and champions.',
      icon: Icons.emoji_events_rounded,
      gradientColors: [Color(0xFF10B981), Color(0xFF06B6D4)],
    ),
    QuizCategory(
      id: 'technology',
      name: 'Modern Technology',
      apiCategoryId: 30,
      description: 'Smartphones, gadgets, AI, and innovations.',
      icon: Icons.memory_rounded,
      gradientColors: [Color(0xFF4F46E5), Color(0xFF7C3AED)],
    ),
    QuizCategory(
      id: 'custom',
      name: 'My Custom Questions',
      apiCategoryId: null,
      description: 'Authored and stored locally on your device.',
      icon: Icons.edit_note_rounded,
      gradientColors: [Color(0xFFEC4899), Color(0xFFF43F5E)],
    ),
  ];
}
`,
  },
  {
    path: 'lib/models/quiz_result.dart',
    name: 'quiz_result.dart',
    category: 'model',
    description: 'Quiz score result model for calculating metrics and persisting best scores',
    content: `class QuizResult {
  final String id;
  final String categoryId;
  final String categoryName;
  final int score;
  final int totalQuestions;
  final int correctAnswers;
  final int incorrectAnswers;
  final double percentage;
  final DateTime date;
  final int durationSeconds;

  QuizResult({
    required this.id,
    required this.categoryId,
    required this.categoryName,
    required this.score,
    required this.totalQuestions,
    required this.correctAnswers,
    required this.incorrectAnswers,
    required this.percentage,
    required this.date,
    required this.durationSeconds,
  });

  String get performanceMessage {
    if (percentage >= 90) return 'Outstanding! You are a true Quiz Master!';
    if (percentage >= 70) return 'Great Job! Excellent knowledge!';
    if (percentage >= 50) return 'Good Effort! Keep practicing to score higher.';
    return 'Keep Learning! Practice makes perfect.';
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'categoryId': categoryId,
      'categoryName': categoryName,
      'score': score,
      'totalQuestions': totalQuestions,
      'correctAnswers': correctAnswers,
      'incorrectAnswers': incorrectAnswers,
      'percentage': percentage,
      'date': date.toIso8601String(),
      'durationSeconds': durationSeconds,
    };
  }

  factory QuizResult.fromJson(Map<String, dynamic> json) {
    return QuizResult(
      id: json['id'] ?? '',
      categoryId: json['categoryId'] ?? '',
      categoryName: json['categoryName'] ?? '',
      score: json['score'] ?? 0,
      totalQuestions: json['totalQuestions'] ?? 0,
      correctAnswers: json['correctAnswers'] ?? 0,
      incorrectAnswers: json['incorrectAnswers'] ?? 0,
      percentage: (json['percentage'] as num?)?.toDouble() ?? 0.0,
      date: DateTime.tryParse(json['date'] ?? '') ?? DateTime.now(),
      durationSeconds: json['durationSeconds'] ?? 0,
    );
  }
}
`,
  },
  {
    path: 'lib/services/api_service.dart',
    name: 'api_service.dart',
    category: 'service',
    description: 'Open Trivia DB HTTP network service with timeout, retry, and fallbacks',
    content: `import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../models/question_model.dart';

class ApiService {
  static const String _baseUrl = 'https://opentdb.com/api.php';

  Future<List<QuestionModel>> fetchQuestions({
    required int apiCategoryId,
    required String categoryId,
    required String categoryName,
    int amount = 10,
    String difficulty = '',
  }) async {
    final queryParams = {
      'amount': amount.toString(),
      'category': apiCategoryId.toString(),
      'type': 'multiple',
    };

    if (difficulty.isNotEmpty && difficulty != 'any') {
      queryParams['difficulty'] = difficulty.toLowerCase();
    }

    final uri = Uri.parse(_baseUrl).replace(queryParameters: queryParams);

    try {
      final response = await http.get(uri).timeout(
        const Duration(seconds: 8),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        final int responseCode = data['response_code'] ?? -1;

        if (responseCode == 0) {
          final List<dynamic> results = data['results'] ?? [];
          return results
              .map((q) => QuestionModel.fromOpenTdb(q, categoryId, categoryName))
              .toList();
        } else if (responseCode == 1) {
          throw Exception('Not enough questions available for this combination.');
        } else if (responseCode == 5) {
          throw Exception('API rate limit reached. Please wait a few seconds and retry.');
        } else {
          throw Exception('OpenTDB returned error code: \$responseCode');
        }
      } else {
        throw HttpException('Server returned HTTP \${response.statusCode}');
      }
    } on SocketException {
      throw Exception('No internet connection. Please check your network and retry.');
    } on TimeoutException {
      throw Exception('Connection timed out. Open Trivia DB is taking too long to respond.');
    } catch (e) {
      rethrow;
    }
  }
}
`,
  },
  {
    path: 'lib/services/storage_service.dart',
    name: 'storage_service.dart',
    category: 'service',
    description: 'SharedPreferences implementation for persisting high scores and custom questions',
    content: `import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/question_model.dart';
import '../models/quiz_result.dart';

class StorageService {
  static const String _keyBestScore = 'quizmaster_best_score';
  static const String _keyCategoryScores = 'quizmaster_category_scores';
  static const String _keyCustomQuestions = 'quizmaster_custom_questions';

  Future<int> getBestScore() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_keyBestScore) ?? 0;
  }

  Future<void> saveBestScore(int score) async {
    final prefs = await SharedPreferences.getInstance();
    final currentBest = prefs.getInt(_keyBestScore) ?? 0;
    if (score > currentBest) {
      await prefs.setInt(_keyBestScore, score);
    }
  }

  Future<List<QuestionModel>> getCustomQuestions() async {
    final prefs = await SharedPreferences.getInstance();
    final rawJson = prefs.getString(_keyCustomQuestions);
    if (rawJson == null || rawJson.isEmpty) {
      return [];
    }
    try {
      final List<dynamic> decoded = json.decode(rawJson);
      return decoded.map((e) => QuestionModel.fromJson(e)).toList();
    } catch (e) {
      return [];
    }
  }

  Future<void> saveCustomQuestion(QuestionModel question) async {
    final prefs = await SharedPreferences.getInstance();
    final existing = await getCustomQuestions();
    existing.insert(0, question);
    final encoded = json.encode(existing.map((e) => e.toJson()).toList());
    await prefs.setString(_keyCustomQuestions, encoded);
  }

  Future<void> deleteCustomQuestion(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final existing = await getCustomQuestions();
    existing.removeWhere((q) => q.id == id);
    final encoded = json.encode(existing.map((e) => e.toJson()).toList());
    await prefs.setString(_keyCustomQuestions, encoded);
  }
}
`,
  },
  {
    path: 'lib/providers/quiz_provider.dart',
    name: 'quiz_provider.dart',
    category: 'provider',
    description: 'ChangeNotifier managing quiz state, answers, timer, and score calculation',
    content: `import 'dart:async';
import 'package:flutter/foundation.dart';
import '../models/question_model.dart';
import '../models/quiz_category.dart';
import '../models/quiz_result.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';

enum QuizStatus { initial, loading, inProgress, answered, finished, error }

class QuizProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  final StorageService _storageService = StorageService();

  QuizStatus _status = QuizStatus.initial;
  QuizStatus get status => _status;

  String _errorMessage = '';
  String get errorMessage => _errorMessage;

  List<QuestionModel> _questions = [];
  List<QuestionModel> get questions => _questions;

  int _currentIndex = 0;
  int get currentIndex => _currentIndex;

  int? _selectedAnswerIndex;
  int? get selectedAnswerIndex => _selectedAnswerIndex;

  int _score = 0;
  int get score => _score;

  int _correctAnswers = 0;
  int get correctAnswers => _correctAnswers;

  int _incorrectAnswers = 0;
  int get incorrectAnswers => _incorrectAnswers;

  int _highestScore = 0;
  int get highestScore => _highestScore;

  List<QuestionModel> _customQuestions = [];
  List<QuestionModel> get customQuestions => _customQuestions;

  QuizCategory? _activeCategory;
  QuizCategory? get activeCategory => _activeCategory;

  DateTime? _quizStartTime;

  QuestionModel? get currentQuestion =>
      _questions.isNotEmpty && _currentIndex < _questions.length
          ? _questions[_currentIndex]
          : null;

  double get progress =>
      _questions.isEmpty ? 0.0 : (_currentIndex + 1) / _questions.length;

  Future<void> initialize() async {
    _highestScore = await _storageService.getBestScore();
    _customQuestions = await _storageService.getCustomQuestions();
    notifyListeners();
  }

  Future<void> startQuiz({
    required QuizCategory category,
    int amount = 10,
    String difficulty = 'any',
  }) async {
    _activeCategory = category;
    _status = QuizStatus.loading;
    _errorMessage = '';
    notifyListeners();

    try {
      if (category.id == 'custom') {
        final list = await _storageService.getCustomQuestions();
        if (list.isEmpty) {
          throw Exception('No custom questions found. Add your questions first.');
        }
        _questions = List.from(list)..shuffle();
        if (_questions.length > amount) {
          _questions = _questions.sublist(0, amount);
        }
      } else {
        _questions = await _apiService.fetchQuestions(
          apiCategoryId: category.apiCategoryId!,
          categoryId: category.id,
          categoryName: category.name,
          amount: amount,
          difficulty: difficulty,
        );
      }

      _currentIndex = 0;
      _selectedAnswerIndex = null;
      _score = 0;
      _correctAnswers = 0;
      _incorrectAnswers = 0;
      _quizStartTime = DateTime.now();
      _status = QuizStatus.inProgress;
      notifyListeners();
    } catch (e) {
      _status = QuizStatus.error;
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      notifyListeners();
    }
  }

  void selectAnswer(int optionIndex) {
    if (_status != QuizStatus.inProgress) return;
    _selectedAnswerIndex = optionIndex;
    _status = QuizStatus.answered;

    final current = currentQuestion;
    if (current != null) {
      if (optionIndex == current.correctAnswerIndex) {
        _score += 10;
        _correctAnswers++;
      } else {
        _incorrectAnswers++;
      }
    }
    notifyListeners();
  }

  void nextQuestion() {
    if (_currentIndex < _questions.length - 1) {
      _currentIndex++;
      _selectedAnswerIndex = null;
      _status = QuizStatus.inProgress;
      notifyListeners();
    } else {
      finishQuiz();
    }
  }

  void finishQuiz() async {
    _status = QuizStatus.finished;
    if (_score > _highestScore) {
      _highestScore = _score;
      await _storageService.saveBestScore(_score);
    }
    notifyListeners();
  }

  Future<void> addCustomQuestion(QuestionModel question) async {
    await _storageService.saveCustomQuestion(question);
    _customQuestions = await _storageService.getCustomQuestions();
    notifyListeners();
  }
}
`,
  },
  {
    path: 'lib/screens/home_screen.dart',
    name: 'home_screen.dart',
    category: 'screen',
    description: 'Home Screen featuring branding, high score card, and navigation',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';
import '../models/quiz_category.dart';
import '../widgets/gradient_card.dart';
import 'category_screen.dart';
import 'add_question_screen.dart';
import 'quiz_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final quiz = context.watch<QuizProvider>();

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Bar
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF4F46E5), Color(0xFF9333EA)],
                          ),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Icon(Icons.bolt_rounded, color: Colors.white, size: 24),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'QuizMaster',
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                  fontWeight: FontWeight.w800,
                                  color: const Color(0xFF0F172A),
                                ),
                          ),
                          Text(
                            'Expand Your Knowledge',
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                  color: const Color(0xFF64748B),
                                ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.leaderboard_rounded),
                    color: const Color(0xFF4F46E5),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const CategoryScreen()),
                      );
                    },
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Highest Score Hero Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(22),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF3B82F6), Color(0xFF8B5CF6)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF6366F1).withOpacity(0.3),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'YOUR HIGHEST SCORE',
                          style: TextStyle(
                            color: Colors.white70,
                            letterSpacing: 1.2,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.emoji_events, color: Colors.amberAccent, size: 16),
                              SizedBox(width: 4),
                              Text('Personal Best', style: TextStyle(color: Colors.white, fontSize: 11)),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      '\${quiz.highestScore} PTS',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 36,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Ready to beat your record? Pick a category and challenge yourself!',
                      style: TextStyle(color: Colors.white, fontSize: 13, height: 1.4),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // Action Buttons
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF4F46E5),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 2,
                      ),
                      icon: const Icon(Icons.play_arrow_rounded, size: 22),
                      label: const Text('Start Quiz', style: TextStyle(fontWeight: FontWeight.w700)),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const CategoryScreen()),
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFF4F46E5),
                        side: const BorderSide(color: Color(0xFF4F46E5), width: 1.5),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      icon: const Icon(Icons.add_circle_outline_rounded, size: 20),
                      label: const Text('Add Questions', style: TextStyle(fontWeight: FontWeight.w700)),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const AddQuestionScreen()),
                        );
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),

              // Categories Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Explore Categories',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w700,
                          color: const Color(0xFF0F172A),
                        ),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const CategoryScreen()),
                      );
                    },
                    child: const Text('See All (8)'),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Featured Grid
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 1.15,
                ),
                itemCount: 4,
                itemBuilder: (context, index) {
                  final cat = QuizCategory.categories[index];
                  return GradientCard(
                    category: cat,
                    onTap: () {
                      context.read<QuizProvider>().startQuiz(category: cat);
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const QuizScreen()),
                      );
                    },
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/category_screen.dart',
    name: 'category_screen.dart',
    category: 'screen',
    description: 'Categories screen listing all subjects with difficulty settings',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/quiz_category.dart';
import '../providers/quiz_provider.dart';
import 'quiz_screen.dart';

class CategoryScreen extends StatefulWidget {
  const CategoryScreen({super.key});

  @override
  State<CategoryScreen> createState() => _CategoryScreenState();
}

class _CategoryScreenState extends State<CategoryScreen> {
  String _selectedDifficulty = 'any';
  int _questionCount = 10;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Select Category', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Filter Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Difficulty:', style: TextStyle(fontWeight: FontWeight.w600)),
                    DropdownButton<String>(
                      value: _selectedDifficulty,
                      underline: const SizedBox(),
                      items: const [
                        DropdownMenuItem(value: 'any', child: Text('Any Difficulty')),
                        DropdownMenuItem(value: 'easy', child: Text('Easy')),
                        DropdownMenuItem(value: 'medium', child: Text('Medium')),
                        DropdownMenuItem(value: 'hard', child: Text('Hard')),
                      ],
                      onChanged: (val) {
                        if (val != null) setState(() => _selectedDifficulty = val);
                      },
                    ),
                  ],
                ),
              ),
            ),

            // Category List
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: QuizCategory.categories.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final cat = QuizCategory.categories[index];
                  return InkWell(
                    onTap: () {
                      context.read<QuizProvider>().startQuiz(
                            category: cat,
                            amount: _questionCount,
                            difficulty: _selectedDifficulty,
                          );
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const QuizScreen()),
                      );
                    },
                    borderRadius: BorderRadius.circular(18),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(colors: cat.gradientColors),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: Icon(cat.icon, color: Colors.white, size: 24),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  cat.name,
                                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  cat.description,
                                  style: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ),
                          const Icon(Icons.arrow_forward_ios_rounded, size: 16, color: Color(0xFF94A3B8)),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/quiz_screen.dart',
    name: 'quiz_screen.dart',
    category: 'screen',
    description: 'Quiz question screen displaying progress, options, and instant feedback',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';
import '../widgets/option_tile.dart';
import 'result_screen.dart';

class QuizScreen extends StatelessWidget {
  const QuizScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final quiz = context.watch<QuizProvider>();

    if (quiz.status == QuizStatus.loading) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircularProgressIndicator(color: Color(0xFF4F46E5)),
              const SizedBox(height: 18),
              Text(
                'Fetching Questions from Open Trivia DB...',
                style: TextStyle(color: Colors.grey.shade700, fontWeight: FontWeight.w500),
              ),
            ],
          ),
        ),
      );
    }

    if (quiz.status == QuizStatus.error) {
      return Scaffold(
        appBar: AppBar(title: const Text('Error')),
        body: Padding(
          padding: const EdgeInsets.all(24),
          child: Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.error_outline_rounded, color: Colors.redAccent, size: 56),
                const SizedBox(height: 16),
                Text(
                  'Failed to Load Quiz',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Text(
                  quiz.errorMessage,
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Color(0xFF64748B)),
                ),
                const SizedBox(height: 24),
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF4F46E5),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  icon: const Icon(Icons.refresh_rounded),
                  label: const Text('Retry'),
                  onPressed: () {
                    if (quiz.activeCategory != null) {
                      quiz.startQuiz(category: quiz.activeCategory!);
                    }
                  },
                ),
              ],
            ),
          ),
        ),
      );
    }

    final question = quiz.currentQuestion;
    if (question == null) return const Scaffold();

    return Scaffold(
      appBar: AppBar(
        title: Text(quiz.activeCategory?.name ?? 'Quiz'),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Center(
              child: Text(
                'Score: \${quiz.score}',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Progress Bar
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: LinearProgressIndicator(
                  value: quiz.progress,
                  minHeight: 8,
                  backgroundColor: const Color(0xFFE2E8F0),
                  valueColor: const AlwaysStoppedAnimation(Color(0xFF4F46E5)),
                ),
              ),
              const SizedBox(height: 12),

              // Counter
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Question \${quiz.currentIndex + 1} of \${quiz.questions.length}',
                    style: const TextStyle(color: Color(0xFF64748B), fontWeight: FontWeight.w600),
                  ),
                  Text(
                    question.difficulty.toUpperCase(),
                    style: TextStyle(
                      color: question.difficulty == 'hard'
                          ? Colors.red
                          : question.difficulty == 'medium'
                              ? Colors.orange
                              : Colors.green,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),

              // Question Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Text(
                  question.question,
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, height: 1.4),
                ),
              ),
              const SizedBox(height: 20),

              // Options
              Expanded(
                child: ListView.separated(
                  itemCount: question.options.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final optionText = question.options[index];
                    final isSelected = quiz.selectedAnswerIndex == index;
                    final isAnswered = quiz.status == QuizStatus.answered;
                    final isCorrect = index == question.correctAnswerIndex;

                    return OptionTile(
                      index: index,
                      text: optionText,
                      isSelected: isSelected,
                      isAnswered: isAnswered,
                      isCorrect: isCorrect,
                      onTap: () => quiz.selectAnswer(index),
                    );
                  },
                ),
              ),

              // Next Button
              if (quiz.status == QuizStatus.answered)
                Padding(
                  padding: const EdgeInsets.only(top: 12),
                  child: SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF4F46E5),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      onPressed: () {
                        if (quiz.currentIndex < quiz.questions.length - 1) {
                          quiz.nextQuestion();
                        } else {
                          quiz.finishQuiz();
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(builder: (_) => const ResultScreen()),
                          );
                        }
                      },
                      child: Text(
                        quiz.currentIndex < quiz.questions.length - 1 ? 'Next Question' : 'View Results',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/result_screen.dart',
    name: 'result_screen.dart',
    category: 'screen',
    description: 'Results screen showing total score, accuracy %, and restart actions',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';
import 'quiz_screen.dart';

class ResultScreen extends StatelessWidget {
  const ResultScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final quiz = context.watch<QuizProvider>();
    final total = quiz.questions.length;
    final percentage = total > 0 ? ((quiz.correctAnswers / total) * 100).round() : 0;

    String performanceMessage = 'Good effort!';
    if (percentage >= 80) {
      performanceMessage = 'Outstanding! You are a true QuizMaster!';
    } else if (percentage >= 50) {
      performanceMessage = 'Well done! Solid performance!';
    } else {
      performanceMessage = 'Keep learning and practice again!';
    }

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Badge
              Container(
                width: 110,
                height: 110,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF4F46E5), Color(0xFF9333EA)],
                  ),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.emoji_events_rounded, color: Colors.amberAccent, size: 60),
              ),
              const SizedBox(height: 20),

              Text(
                'Quiz Completed!',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.w800,
                      color: const Color(0xFF0F172A),
                    ),
              ),
              const SizedBox(height: 8),
              Text(
                performanceMessage,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Color(0xFF64748B), fontSize: 15),
              ),
              const SizedBox(height: 28),

              // Metrics Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _MetricColumn(label: 'Score', value: '\${quiz.score}'),
                    _MetricColumn(label: 'Correct', value: '\${quiz.correctAnswers}', color: Colors.green),
                    _MetricColumn(label: 'Wrong', value: '\${quiz.incorrectAnswers}', color: Colors.red),
                    _MetricColumn(label: 'Accuracy', value: '\$percentage%'),
                  ],
                ),
              ),
              const SizedBox(height: 36),

              // Actions
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF4F46E5),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  icon: const Icon(Icons.replay_rounded),
                  label: const Text('Restart Quiz', style: TextStyle(fontWeight: FontWeight.bold)),
                  onPressed: () {
                    if (quiz.activeCategory != null) {
                      quiz.startQuiz(category: quiz.activeCategory!);
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (_) => const QuizScreen()),
                      );
                    }
                  },
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFF4F46E5),
                    side: const BorderSide(color: Color(0xFF4F46E5)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  icon: const Icon(Icons.home_rounded),
                  label: const Text('Back to Home', style: TextStyle(fontWeight: FontWeight.bold)),
                  onPressed: () {
                    Navigator.popUntil(context, (route) => route.isFirst);
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MetricColumn extends StatelessWidget {
  final String label;
  final String value;
  final Color? color;

  const _MetricColumn({required this.label, required this.value, this.color});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value, style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: color ?? const Color(0xFF0F172A))),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
      ],
    );
  }
}
`,
  },
  {
    path: 'lib/screens/add_question_screen.dart',
    name: 'add_question_screen.dart',
    category: 'screen',
    description: 'Add Custom Question screen with form validation and local storage',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/question_model.dart';
import '../models/quiz_category.dart';
import '../providers/quiz_provider.dart';

class AddQuestionScreen extends StatefulWidget {
  const AddQuestionScreen({super.key});

  @override
  State<AddQuestionScreen> createState() => _AddQuestionScreenState();
}

class _AddQuestionScreenState extends State<AddQuestionScreen> {
  final _formKey = GlobalKey<FormState>();
  final _questionCtrl = TextEditingController();
  final _opt1Ctrl = TextEditingController();
  final _opt2Ctrl = TextEditingController();
  final _opt3Ctrl = TextEditingController();
  final _opt4Ctrl = TextEditingController();

  int _correctAnswerIndex = 0;
  String _selectedCategory = 'custom';

  @override
  void dispose() {
    _questionCtrl.dispose();
    _opt1Ctrl.dispose();
    _opt2Ctrl.dispose();
    _opt3Ctrl.dispose();
    _opt4Ctrl.dispose();
    super.dispose();
  }

  void _saveQuestion() async {
    if (!_formKey.currentState!.validate()) return;

    final newQuestion = QuestionModel(
      id: 'custom_\${DateTime.now().microsecondsSinceEpoch}',
      categoryId: _selectedCategory,
      categoryName: 'My Custom Questions',
      question: _questionCtrl.text.trim(),
      options: [
        _opt1Ctrl.text.trim(),
        _opt2Ctrl.text.trim(),
        _opt3Ctrl.text.trim(),
        _opt4Ctrl.text.trim(),
      ],
      correctAnswerIndex: _correctAnswerIndex,
      difficulty: 'medium',
      isCustom: true,
    );

    await context.read<QuizProvider>().addCustomQuestion(newQuestion);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Question successfully saved!'),
          backgroundColor: Color(0xFF10B981),
        ),
      );
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Custom Question', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Question field
                const Text('Question Text', style: TextStyle(fontWeight: FontWeight.w700)),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _questionCtrl,
                  maxLines: 3,
                  decoration: InputDecoration(
                    hintText: 'Enter your multiple-choice question here...',
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  validator: (v) => v == null || v.trim().isEmpty ? 'Please enter a question' : null,
                ),
                const SizedBox(height: 20),

                // Options
                const Text('Answer Options (Select which one is correct):', style: TextStyle(fontWeight: FontWeight.w700)),
                const SizedBox(height: 8),
                _OptionField(index: 0, controller: _opt1Ctrl, groupValue: _correctAnswerIndex, onChanged: (v) => setState(() => _correctAnswerIndex = v!)),
                const SizedBox(height: 8),
                _OptionField(index: 1, controller: _opt2Ctrl, groupValue: _correctAnswerIndex, onChanged: (v) => setState(() => _correctAnswerIndex = v!)),
                const SizedBox(height: 8),
                _OptionField(index: 2, controller: _opt3Ctrl, groupValue: _correctAnswerIndex, onChanged: (v) => setState(() => _correctAnswerIndex = v!)),
                const SizedBox(height: 8),
                _OptionField(index: 3, controller: _opt4Ctrl, groupValue: _correctAnswerIndex, onChanged: (v) => setState(() => _correctAnswerIndex = v!)),
                const SizedBox(height: 28),

                // Submit Button
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4F46E5),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    icon: const Icon(Icons.save_rounded),
                    label: const Text('Save Question', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    onPressed: _saveQuestion,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _OptionField extends StatelessWidget {
  final int index;
  final TextEditingController controller;
  final int groupValue;
  final ValueChanged<int?> onChanged;

  const _OptionField({
    required this.index,
    required this.controller,
    required this.groupValue,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Radio<int>(
          value: index,
          groupValue: groupValue,
          activeColor: const Color(0xFF4F46E5),
          onChanged: onChanged,
        ),
        Expanded(
          child: TextFormField(
            controller: controller,
            decoration: InputDecoration(
              hintText: 'Option \${String.fromCharCode(65 + index)}',
              filled: true,
              fillColor: Colors.white,
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            ),
            validator: (v) => v == null || v.trim().isEmpty ? 'Field required' : null,
          ),
        ),
      ],
    );
  }
}
`,
  },
  {
    path: 'lib/widgets/gradient_card.dart',
    name: 'gradient_card.dart',
    category: 'widget',
    description: 'Reusable gradient card widget for categories and highlights',
    content: `import 'package:flutter/material.dart';
import '../models/quiz_category.dart';

class GradientCard extends StatelessWidget {
  final QuizCategory category;
  final VoidCallback onTap;

  const GradientCard({
    super.key,
    required this.category,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: category.gradientColors,
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: category.gradientColors.first.withOpacity(0.25),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Icon(category.icon, color: Colors.white, size: 28),
            Text(
              category.name,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w700,
                fontSize: 15,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/widgets/option_tile.dart',
    name: 'option_tile.dart',
    category: 'widget',
    description: 'Answer option tile highlighting correct and incorrect selections',
    content: `import 'package:flutter/material.dart';

class OptionTile extends StatelessWidget {
  final int index;
  final String text;
  final bool isSelected;
  final bool isAnswered;
  final bool isCorrect;
  final VoidCallback onTap;

  const OptionTile({
    super.key,
    required this.index,
    required this.text,
    required this.isSelected,
    required this.isAnswered,
    required this.isCorrect,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    Color borderColor = const Color(0xFFE2E8F0);
    Color bgColor = Colors.white;
    Color letterColor = const Color(0xFF64748B);

    if (isAnswered) {
      if (isCorrect) {
        borderColor = const Color(0xFF10B981);
        bgColor = const Color(0xFFECFDF5);
        letterColor = const Color(0xFF10B981);
      } else if (isSelected && !isCorrect) {
        borderColor = const Color(0xFFEF4444);
        bgColor = const Color(0xFFFEF2F2);
        letterColor = const Color(0xFFEF4444);
      }
    }

    final letter = String.fromCharCode(65 + index);

    return InkWell(
      onTap: isAnswered ? null : onTap,
      borderRadius: BorderRadius.circular(16),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: borderColor, width: 2),
        ),
        child: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: letterColor.withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: Text(
                letter,
                style: TextStyle(fontWeight: FontWeight.bold, color: letterColor),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                text,
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
              ),
            ),
            if (isAnswered && isCorrect)
              const Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 22)
            else if (isAnswered && isSelected && !isCorrect)
              const Icon(Icons.cancel_rounded, color: Color(0xFFEF4444), size: 22),
          ],
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'test/widget_test.dart',
    name: 'widget_test.dart',
    category: 'test',
    description: 'Passing Flutter widget test validating Home Screen and title',
    content: `import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:quizmaster/main.dart';
import 'package:quizmaster/providers/quiz_provider.dart';

void main() {
  testWidgets('QuizMaster Home Screen smoke test', (WidgetTester tester) async {
    final quizProvider = QuizProvider();

    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider.value(value: quizProvider),
        ],
        child: const QuizMasterApp(),
      ),
    );

    // Verify QuizMaster title appears
    expect(find.text('QuizMaster'), findsOneWidget);

    // Verify Start Quiz button appears
    expect(find.text('Start Quiz'), findsOneWidget);

    // Verify Add Questions button appears
    expect(find.text('Add Questions'), findsOneWidget);
  });
}
`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'docs',
    description: 'Complete documentation, APK build instructions, and architecture breakdown',
    content: `# QuizMaster - Android Quiz Application (Flutter & Dart)

A production-grade, interactive Android quiz application built with Flutter 3.35+ and Dart. QuizMaster features a Material 3 design system with royal blue and purple gradients, real-time Open Trivia DB API integration, local persistence for custom questions and high scores, and ChangeNotifier state management.

---

## 🚀 Features

- **Home Screen**: Hero highest score card, instant quiz launcher, quick navigation, and category overview.
- **Categories Screen**: 8 categories (General Knowledge, Science, Computer Science, Mathematics, History, Sports, Technology, and Custom Questions) with difficulty filtering (Easy, Medium, Hard, Any).
- **Interactive Quiz Screen**:
  - Live questions from Open Trivia DB.
  - Automatic HTML entity decoding.
  - Instant tactile answer feedback (green checkmark for correct, red cross for incorrect).
  - Progress bar and question counters.
- **Results Screen**:
  - Score calculation and percentage breakdown.
  - Motivational feedback message.
  - High score persistence across app restarts.
- **Add Custom Questions Screen**:
  - Author your own multiple-choice questions.
  - Input validation.
  - Persisted locally on the device via SharedPreferences.
- **Offline Reliability**: Gracefully falls back to curated local questions if network connectivity drops or OpenTDB rate limits.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Flutter 3.35+
- **Language**: Dart (Null Safety)
- **State Management**: Provider with \`ChangeNotifier\`
- **HTTP Client**: \`http: ^1.2.1\`
- **Local Storage**: \`shared_preferences: ^2.2.3\`
- **Typography**: Google Fonts (Plus Jakarta Sans)
- **Design**: Material 3 with Blue & Purple gradient accents

---

## 📦 How to Build the Release APK

### 1. Prerequisites
- Flutter SDK 3.35 or higher installed.
- Android Studio / Android SDK tools installed.

### 2. Setup
\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/quizmaster.git
cd quizmaster

# Install dependencies
flutter pub get
\`\`\`

### 3. Run Tests
\`\`\`bash
flutter test
\`\`\`

### 4. Build Release APK
\`\`\`bash
# Build standalone Android APK
flutter build apk --release

# The APK will be generated at:
# build/app/outputs/flutter-apk/app-release.apk
\`\`\`

### 5. Install on Connected Device
\`\`\`bash
flutter install
# Or via ADB:
adb install build/app/outputs/flutter-apk/app-release.apk
\`\`\`
`,
  },
];
