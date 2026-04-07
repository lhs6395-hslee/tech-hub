'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/stores/locale-store';
import { LEVEL_CONFIGS } from '@/types/problem';
import LevelCard from '@/components/progress/LevelCard';
import { CheckCircle, Zap, Link2, ArrowLeft } from 'lucide-react';
import OXQuiz from '@/components/quiz/OXQuiz';
import MultipleChoice from '@/components/quiz/MultipleChoice';
import TermMatching from '@/components/quiz/TermMatching';

type Tab = 'practice' | 'quiz';
type GameMode = 'ox' | 'mc' | 'matching';

const gameModes: {
  id: GameMode;
  title: { ko: string; en: string };
  desc: { ko: string; en: string };
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}[] = [
  {
    id: 'ox',
    title: { ko: 'OX 퀴즈', en: 'True / False' },
    desc: {
      ko: '문장이 맞으면 O, 틀리면 X! 빠른 판단력을 테스트하세요.',
      en: 'O if true, X if false! Test your quick judgment.',
    },
    icon: CheckCircle,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'mc',
    title: { ko: '4지선다', en: 'Multiple Choice' },
    desc: {
      ko: '4개 보기 중 정답을 골라보세요. 깊이 있는 이해를 확인합니다.',
      en: 'Choose the correct answer from 4 options. Test your deep understanding.',
    },
    icon: Zap,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'matching',
    title: { ko: '용어 매칭', en: 'Term Matching' },
    desc: {
      ko: '용어와 정의를 올바르게 연결하세요. 기억력과 이해도를 확인합니다.',
      en: 'Match terms with their definitions. Test your memory and comprehension.',
    },
    icon: Link2,
    gradient: 'from-purple-500 to-pink-500',
  },
];

export default function LearnPage() {
  const locale = useLocaleStore((s) => s.locale);
  const [tab, setTab] = useState<Tab>('practice');
  const [selectedGame, setSelectedGame] = useState<GameMode | null>(null);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          {locale === 'ko' ? '학습' : 'Learn'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {locale === 'ko'
            ? 'SQL 실습 문제를 풀거나, 이론 퀴즈로 개념을 복습하세요.'
            : 'Solve SQL practice problems or review concepts with theory quizzes.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => { setTab('practice'); setSelectedGame(null); }}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === 'practice'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
          }`}
        >
          {locale === 'ko' ? 'SQL 실습' : 'SQL Practice'}
        </button>
        <button
          onClick={() => { setTab('quiz'); setSelectedGame(null); }}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === 'quiz'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
          }`}
        >
          {locale === 'ko' ? '이론 퀴즈' : 'Theory Quiz'}
        </button>
      </div>

      {/* SQL Practice Tab */}
      {tab === 'practice' && (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            {locale === 'ko'
              ? '레벨을 선택하여 실제 데이터베이스에서 SQL을 실행하고 채점받으세요.'
              : 'Select a level to execute SQL on a real database and get graded.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LEVEL_CONFIGS.map((config) => (
              <LevelCard key={config.id} config={config} />
            ))}
          </div>
        </div>
      )}

      {/* Theory Quiz Tab */}
      {tab === 'quiz' && (
        <div>
          {/* Game Mode Selector */}
          {!selectedGame && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                {locale === 'ko'
                  ? '게임을 통해 데이터베이스 이론을 재미있게 복습하세요!'
                  : 'Review database theory through fun games!'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {gameModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedGame(mode.id)}
                    className="group text-left p-6 rounded-xl border-2 border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-200"
                  >
                    <div
                      className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${mode.gradient} mb-4`}
                    >
                      <mode.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {mode.title[locale]}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{mode.desc[locale]}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Game View */}
          {selectedGame && (
            <div>
              <button
                onClick={() => setSelectedGame(null)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                {locale === 'ko' ? '게임 선택으로 돌아가기' : 'Back to game selection'}
              </button>

              {selectedGame === 'ox' && <OXQuiz />}
              {selectedGame === 'mc' && <MultipleChoice />}
              {selectedGame === 'matching' && <TermMatching />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
