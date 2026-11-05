import React from 'react';
import { Terminal, CheckCircle2, Layers, Cpu, Database, Smartphone, ShieldCheck } from 'lucide-react';

export const DocsHub: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto p-6 text-slate-200 space-y-8">
      {/* Title */}
      <div>
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
          Comprehensive Documentation
        </span>
        <h2 className="text-3xl font-extrabold text-white tracking-tight font-display mt-1">
          QuizMaster Architecture & Engineering Guide
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          QuizMaster is engineered with Flutter 3.35 and Dart, leveraging Provider for reactive state management, Open Trivia DB for public multi-category question sets, and local persistence for high scores and custom question authoring.
        </p>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Layers size={20} />
          </div>
          <h3 className="text-base font-bold text-white">Provider State Flow</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            `QuizProvider` extends `ChangeNotifier` to hold the single source of truth for the active question, timer, score, and user answers, dispatching atomic updates via `notifyListeners()`.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Cpu size={20} />
          </div>
          <h3 className="text-base font-bold text-white">Open Trivia DB Integration</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            `ApiService` queries the public OpenTDB API with dynamic category IDs, HTML entity decoding with `html_unescape`, timeout guards, and instant fallback questions on connection interruptions.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Database size={20} />
          </div>
          <h3 className="text-base font-bold text-white">Local Persistence</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            High scores per category, overall records, and user-authored questions are persisted with `shared_preferences`, keeping data safe across app restarts.
          </p>
        </div>
      </div>

      {/* Project Folder Structure */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white">Production Folder Structure</h3>
        <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
{`quizmaster/
├── android/                   # Native Android configuration & Gradle files
├── assets/images/             # App icons & branding resources
├── lib/
│   ├── main.dart              # App entry point, MultiProvider & Material 3 theme
│   ├── models/
│   │   ├── question_model.dart  # Data model, JSON serialization, HTML unescape
│   │   ├── quiz_category.dart   # Categories, OpenTDB ID mapping, gradient styling
│   │   └── quiz_result.dart     # Final score computation, accuracy %, timestamps
│   ├── services/
│   │   ├── api_service.dart     # HTTP client for Open Trivia DB with retry & timeout
│   │   └── storage_service.dart # SharedPreferences wrapper for scores & custom questions
│   ├── providers/
│   │   └── quiz_provider.dart   # ChangeNotifier managing quiz lifecycle & state
│   ├── screens/
│   │   ├── home_screen.dart         # Hero high score, categories preview, actions
│   │   ├── category_screen.dart     # Category listing & difficulty filters
│   │   ├── quiz_screen.dart         # Question card, 4 options, progress & feedback
│   │   ├── result_screen.dart       # Score ring, accuracy %, review drawer
│   │   └── add_question_screen.dart # Custom question authoring & validation
│   └── widgets/
│       ├── gradient_card.dart   # Reusable Material gradient card
│       └── option_tile.dart     # Interactive option tile with correct/incorrect states
├── test/
│   └── widget_test.dart       # Automated Flutter smoke & widget testing
├── pubspec.yaml               # Package dependencies & asset configuration
└── README.md                  # Project overview, APK build and setup guide`}
        </pre>
      </div>

      {/* Step by Step APK Build Instructions */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Smartphone size={20} className="text-indigo-400" />
          <span>How to Build and Run the Android Release APK</span>
        </h3>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <span className="font-bold text-indigo-400 block">Step 1: Install Dependencies</span>
            <code className="text-slate-300 font-mono">flutter pub get</code>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <span className="font-bold text-indigo-400 block">Step 2: Run Automated Widget Tests</span>
            <code className="text-slate-300 font-mono">flutter test</code>
            <p className="text-slate-400 text-[11px]">
              Verifies the widget tree builds correctly, validating title, start buttons, and state initialization.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <span className="font-bold text-indigo-400 block">Step 3: Compile Standalone Release APK</span>
            <code className="text-slate-300 font-mono">flutter build apk --release</code>
            <p className="text-slate-400 text-[11px]">
              Generates the optimized release binary at <span className="text-indigo-300 font-mono">build/app/outputs/flutter-apk/app-release.apk</span> with tree-shaking and minification.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <span className="font-bold text-indigo-400 block">Step 4: Install on Device</span>
            <code className="text-slate-300 font-mono">flutter install</code>
            <span className="text-slate-400 text-[11px] block">
              Or connect phone with USB debugging enabled and run: <code className="text-indigo-300 font-mono">adb install build/app/outputs/flutter-apk/app-release.apk</code>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
