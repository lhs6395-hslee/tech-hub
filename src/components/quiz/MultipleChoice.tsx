'use client';

import { useState, useMemo, useCallback } from 'react';
import { useLocaleStore } from '@/stores/locale-store';
import { mcQuestions as defaultMCQuestions, quizCategories as defaultCategories } from '@/data/quiz';
import { ArrowRight, RotateCcw, Trophy, CheckCircle, XCircle } from 'lucide-react';

interface MCQuestionData {
  id: string;
  category: string;
  question: { ko: string; en: string };
  choices: { ko: string[]; en: string[] };
  answerIndex: number;
  explanation: { ko: string; en: string };
}

interface CategoryData {
  id: string;
  name: { ko: string; en: string };
  icon: string;
}

interface MultipleChoiceProps {
  questionsData?: MCQuestionData[];
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

export default function MultipleChoice({ questionsData, categoriesData }: MultipleChoiceProps = {}) {
  const locale = useLocaleStore((s) => s.locale);
  const sourceQuestions = questionsData ?? defaultMCQuestions;
  const sourceCategories = categoriesData ?? defaultCategories;
  const [category, setCategory] = useState<string>('all');
  const [questions, setQuestions] = useState(() => shuffle(sourceQuestions));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
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
    (index: number) => {
      if (selected !== null || !q) return;
      setSelected(index);
      if (index === q.answerIndex) {
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

  // Finished
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

  const isCorrect = selected === q.answerIndex;
  const catMeta = sourceCategories.find((c) => c.id === q.category);
  const labels = ['A', 'B', 'C', 'D'];

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

      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${((current + 1) / filtered.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="border-2 border-border rounded-xl p-8 bg-card">
        {catMeta && (
          <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground mb-4">
            {catMeta.icon} {catMeta.name[locale]}
          </span>
        )}
        <p className="text-xl font-medium leading-relaxed">{q.question[locale]}</p>
      </div>

      {/* Choices */}
      <div className="space-y-3">
        {q.choices[locale].map((choice, i) => {
          let style = 'border-border bg-card hover:border-primary/50 hover:bg-accent';
          if (selected !== null) {
            if (i === q.answerIndex) {
              style = 'border-green-500 bg-green-50 dark:bg-green-950/30';
            } else if (i === selected && !isCorrect) {
              style = 'border-red-500 bg-red-50 dark:bg-red-950/30';
            } else {
              style = 'border-border bg-muted/50 opacity-50';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${style}`}
            >
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  selected !== null && i === q.answerIndex
                    ? 'bg-green-500 text-white'
                    : selected !== null && i === selected && !isCorrect
                      ? 'bg-red-500 text-white'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {selected !== null && i === q.answerIndex ? (
                  <CheckCircle className="h-5 w-5" />
                ) : selected !== null && i === selected && !isCorrect ? (
                  <XCircle className="h-5 w-5" />
                ) : (
                  labels[i]
                )}
              </span>
              <span className="text-sm font-medium">{choice}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation + Next */}
      {selected !== null && (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-xl ${
              isCorrect
                ? 'bg-green-50 dark:bg-green-950/30 border border-green-300 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800'
            }`}
          >
            <p
              className={`font-bold ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}
            >
              {isCorrect
                ? locale === 'ko'
                  ? '정답!'
                  : 'Correct!'
                : locale === 'ko'
                  ? '오답!'
                  : 'Wrong!'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{q.explanation[locale]}</p>
          </div>
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
