'use client';

import { useState, useMemo, useCallback } from 'react';
import { useLocaleStore } from '@/stores/locale-store';
import { oxQuestions as defaultOXQuestions, quizCategories as defaultCategories } from '@/data/quiz';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react';

interface OXQuestionData {
  id: string;
  category: string;
  statement: { ko: string; en: string };
  answer: boolean;
  explanation: { ko: string; en: string };
}

interface CategoryData {
  id: string;
  name: { ko: string; en: string };
  icon: string;
}

interface OXQuizProps {
  questionsData?: OXQuestionData[];
  categoriesData?: CategoryData[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function OXQuiz({ questionsData, categoriesData }: OXQuizProps = {}) {
  const locale = useLocaleStore((s) => s.locale);
  const sourceQuestions = questionsData ?? defaultOXQuestions;
  const sourceCategories = categoriesData ?? defaultCategories;
  const [category, setCategory] = useState<string>('all');
  const [questions, setQuestions] = useState(() => shuffle(sourceQuestions));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  const filtered = useMemo(
    () => (category === 'all' ? questions : questions.filter((q) => q.category === category)),
    [questions, category]
  );

  const q = filtered[current];

  const handleAnswer = useCallback(
    (answer: boolean) => {
      if (selected !== null || !q) return;
      setSelected(answer);
      if (answer === q.answer) {
        setScore((s) => s + 1);
        setStreak((s) => {
          const next = s + 1;
          setMaxStreak((m) => Math.max(m, next));
          return next;
        });
      } else {
        setStreak(0);
      }
    },
    [selected, q]
  );

  const handleNext = () => {
    if (current + 1 >= filtered.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const handleRestart = () => {
    setQuestions(shuffle(sourceQuestions));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setFinished(false);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setFinished(false);
  };

  // Finished screen
  if (finished) {
    const pct = Math.round((score / filtered.length) * 100);
    const grade = pct >= 90 ? 'S' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'F';
    const gradeColor =
      grade === 'S'
        ? 'text-yellow-500'
        : grade === 'A'
          ? 'text-green-500'
          : grade === 'B'
            ? 'text-blue-500'
            : grade === 'C'
              ? 'text-orange-500'
              : 'text-red-500';

    return (
      <div className="max-w-md mx-auto text-center space-y-6 py-8">
        <Trophy className="h-16 w-16 mx-auto text-yellow-500" />
        <h2 className="text-2xl font-bold">
          {locale === 'ko' ? '퀴즈 완료!' : 'Quiz Complete!'}
        </h2>
        <div className={`text-6xl font-black ${gradeColor}`}>{grade}</div>
        <div className="space-y-2 text-lg">
          <p>
            {locale === 'ko' ? '정답' : 'Score'}: {score} / {filtered.length} ({pct}%)
          </p>
          <p>
            {locale === 'ko' ? '최대 연속 정답' : 'Max Streak'}: {maxStreak}
          </p>
        </div>
        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          {locale === 'ko' ? '다시 도전' : 'Try Again'}
        </button>
      </div>
    );
  }

  if (!q) return null;

  const isCorrect = selected === q.answer;
  const catMeta = sourceCategories.find((c) => c.id === q.category);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            category === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {locale === 'ko' ? '전체' : 'All'}
        </button>
        {sourceCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              category === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat.icon} {cat.name[locale]}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {current + 1} / {filtered.length}
        </span>
        <div className="flex items-center gap-4">
          <span>
            {locale === 'ko' ? '점수' : 'Score'}: {score}
          </span>
          {streak > 1 && (
            <span className="text-orange-500 font-medium animate-pulse">
              🔥 {streak} {locale === 'ko' ? '연속' : 'streak'}
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${((current + 1) / filtered.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="border-2 border-border rounded-xl p-8 bg-card">
        {catMeta && (
          <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground mb-4">
            {catMeta.icon} {catMeta.name[locale]}
          </span>
        )}
        <p className="text-xl font-medium leading-relaxed">{q.statement[locale]}</p>
      </div>

      {/* O/X Buttons */}
      {selected === null ? (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAnswer(true)}
            className="flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 hover:border-green-500 hover:bg-green-100 dark:hover:bg-green-950/50 transition-all text-2xl font-bold text-green-600 dark:text-green-400"
          >
            <CheckCircle className="h-8 w-8" /> O
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 hover:border-red-500 hover:bg-red-100 dark:hover:bg-red-950/50 transition-all text-2xl font-bold text-red-600 dark:text-red-400"
          >
            <XCircle className="h-8 w-8" /> X
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Result */}
          <div
            className={`flex items-center gap-3 p-4 rounded-xl ${
              isCorrect
                ? 'bg-green-50 dark:bg-green-950/30 border border-green-300 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800'
            }`}
          >
            {isCorrect ? (
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
            )}
            <div>
              <p className={`font-bold ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                {isCorrect
                  ? locale === 'ko'
                    ? '정답!'
                    : 'Correct!'
                  : locale === 'ko'
                    ? `오답! 정답은 ${q.answer ? 'O' : 'X'}`
                    : `Wrong! Answer is ${q.answer ? 'O (True)' : 'X (False)'}`}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{q.explanation[locale]}</p>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            {current + 1 >= filtered.length
              ? locale === 'ko'
                ? '결과 보기'
                : 'See Results'
              : locale === 'ko'
                ? '다음 문제'
                : 'Next Question'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
