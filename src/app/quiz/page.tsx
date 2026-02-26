'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/stores/locale-store';
import { ArrowLeft, CheckCircle, XCircle, Shuffle, Zap, Link2 } from 'lucide-react';
import OXQuiz from '@/components/quiz/OXQuiz';
import MultipleChoice from '@/components/quiz/MultipleChoice';
import TermMatching from '@/components/quiz/TermMatching';

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

export default function QuizPage() {
  const locale = useLocaleStore((s) => s.locale);
  const [selected, setSelected] = useState<GameMode | null>(null);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          {locale === 'ko' ? '이론 퀴즈 게임' : 'Theory Quiz Game'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {locale === 'ko'
            ? '게임을 통해 데이터베이스 이론을 재미있게 복습하세요!'
            : 'Review database theory through fun games!'}
        </p>
      </div>

      {/* Game Mode Selector */}
      {!selected && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {gameModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelected(mode.id)}
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
      )}

      {/* Game View */}
      {selected && (
        <div>
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {locale === 'ko' ? '게임 선택으로 돌아가기' : 'Back to game selection'}
          </button>

          {selected === 'ox' && <OXQuiz />}
          {selected === 'mc' && <MultipleChoice />}
          {selected === 'matching' && <TermMatching />}
        </div>
      )}
    </div>
  );
}
