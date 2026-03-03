'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/stores/locale-store';
import { K8S_LEVEL_CONFIGS } from '@/types/kubernetes';
import { CheckCircle, Zap, Link2, ArrowLeft } from 'lucide-react';
import OXQuiz from '@/components/quiz/OXQuiz';
import MultipleChoice from '@/components/quiz/MultipleChoice';
import TermMatching from '@/components/quiz/TermMatching';
import {
  k8sQuizCategories,
  k8sOXQuestions,
  k8sMCQuestions,
  k8sMatchingSets,
} from '@/data/kubernetes/quiz';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Container as ContainerIcon, Network, HardDrive, Search } from 'lucide-react';
import Link from 'next/link';

type Tab = 'practice' | 'quiz';
type GameMode = 'ox' | 'mc' | 'matching';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Server,
  Container: ContainerIcon,
  Network,
  HardDrive,
  Search,
};

const GRADIENTS: Record<string, string> = {
  blue: 'from-blue-500/20 to-blue-600/5 hover:from-blue-500/30 hover:to-blue-600/10',
  emerald: 'from-emerald-500/20 to-emerald-600/5 hover:from-emerald-500/30 hover:to-emerald-600/10',
  cyan: 'from-cyan-500/20 to-cyan-600/5 hover:from-cyan-500/30 hover:to-cyan-600/10',
  amber: 'from-amber-500/20 to-amber-600/5 hover:from-amber-500/30 hover:to-amber-600/10',
  purple: 'from-purple-500/20 to-purple-600/5 hover:from-purple-500/30 hover:to-purple-600/10',
};

const ICON_COLORS: Record<string, string> = {
  blue: 'text-blue-500',
  emerald: 'text-emerald-500',
  cyan: 'text-cyan-500',
  amber: 'text-amber-500',
  purple: 'text-purple-500',
};

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
      ko: '문장이 맞으면 O, 틀리면 X! CKA 핵심 개념을 빠르게 확인하세요.',
      en: 'O if true, X if false! Quickly verify CKA core concepts.',
    },
    icon: CheckCircle,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'mc',
    title: { ko: '4지선다', en: 'Multiple Choice' },
    desc: {
      ko: '4개 보기 중 정답을 골라보세요. CKA 시험과 유사한 형식입니다.',
      en: 'Choose the correct answer from 4 options. CKA exam-style format.',
    },
    icon: Zap,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'matching',
    title: { ko: '용어 매칭', en: 'Term Matching' },
    desc: {
      ko: 'Kubernetes 용어와 정의를 올바르게 연결하세요.',
      en: 'Match Kubernetes terms with their definitions.',
    },
    icon: Link2,
    gradient: 'from-purple-500 to-pink-500',
  },
];

export default function K8sLearnPage() {
  const locale = useLocaleStore((s) => s.locale);
  const [tab, setTab] = useState<Tab>('practice');
  const [selectedGame, setSelectedGame] = useState<GameMode | null>(null);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {locale === 'ko' ? 'Kubernetes 학습' : 'Learn Kubernetes'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {locale === 'ko'
            ? 'CKA 도메인별 이론을 학습하거나, 퀴즈로 개념을 복습하세요.'
            : 'Study CKA domain topics or review concepts with quizzes.'}
        </p>
      </div>

      <div className="flex border-b">
        <button
          onClick={() => { setTab('practice'); setSelectedGame(null); }}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === 'practice'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
          }`}
        >
          {locale === 'ko' ? 'CKA 도메인' : 'CKA Domains'}
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

      {tab === 'practice' && (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            {locale === 'ko'
              ? 'CKA 시험의 5개 도메인별로 이론을 학습하세요. 각 도메인을 클릭하면 상세 이론 문서로 이동합니다.'
              : 'Study theory for each of the 5 CKA exam domains. Click a domain to view detailed documentation.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {K8S_LEVEL_CONFIGS.map((config) => {
              const Icon = ICONS[config.icon] || Server;
              const gradient = GRADIENTS[config.color] || GRADIENTS.blue;
              const iconColor = ICON_COLORS[config.color] || ICON_COLORS.blue;

              return (
                <Link key={config.id} href="/kubernetes/docs">
                  <Card className="relative overflow-hidden group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-all`} />
                    <CardContent className="relative p-6 flex flex-col items-center text-center space-y-3">
                      <Icon className={`h-10 w-10 ${iconColor}`} />
                      <div>
                        <h3 className="font-bold text-lg">{config.label[locale]}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {config.description[locale]}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        CKA {config.weight}%
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'quiz' && (
        <div>
          {!selectedGame && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                {locale === 'ko'
                  ? '게임을 통해 Kubernetes & CKA 이론을 재미있게 복습하세요!'
                  : 'Review Kubernetes & CKA theory through fun games!'}
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

          {selectedGame && (
            <div>
              <button
                onClick={() => setSelectedGame(null)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                {locale === 'ko' ? '게임 선택으로 돌아가기' : 'Back to game selection'}
              </button>

              {selectedGame === 'ox' && (
                <OXQuiz
                  questionsData={k8sOXQuestions}
                  categoriesData={k8sQuizCategories}
                />
              )}
              {selectedGame === 'mc' && (
                <MultipleChoice
                  questionsData={k8sMCQuestions}
                  categoriesData={k8sQuizCategories}
                />
              )}
              {selectedGame === 'matching' && (
                <TermMatching
                  setsData={k8sMatchingSets}
                  categoriesData={k8sQuizCategories}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
