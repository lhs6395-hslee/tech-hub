'use client';

import { useTranslation } from '@/lib/i18n';
import { useLocaleStore } from '@/stores/locale-store';
import { LEVEL_CONFIGS } from '@/types/problem';
import LevelCard from '@/components/progress/LevelCard';
import { Database, Terminal, BookOpen, Trophy } from 'lucide-react';
import ArchitectureDiagram from '@/components/home/ArchitectureDiagram';
import ExecutionFlowDiagram from '@/components/home/ExecutionFlowDiagram';
import ERDDiagram from '@/components/home/ERDDiagram';

export default function HomePage() {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-12">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 shadow-lg">
            <Database className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t('home.hero.title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('home.hero.subtitle')}
        </p>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center p-6 rounded-xl bg-muted/30 space-y-3">
          <Terminal className="h-8 w-8 text-emerald-500" />
          <h3 className="font-semibold">
            {locale === 'ko' ? '실제 DB 실행' : 'Real DB Execution'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {locale === 'ko'
              ? 'PostgreSQL과 MySQL에서 직접 SQL을 실행하고 결과를 확인합니다'
              : 'Execute SQL directly on PostgreSQL and MySQL and see real results'}
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-xl bg-muted/30 space-y-3">
          <BookOpen className="h-8 w-8 text-blue-500" />
          <h3 className="font-semibold">
            {locale === 'ko' ? '단계별 학습' : 'Step-by-Step Learning'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {locale === 'ko'
              ? '초보부터 전문가까지 체계적인 커리큘럼으로 학습합니다'
              : 'Learn with a structured curriculum from beginner to expert'}
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-xl bg-muted/30 space-y-3">
          <Trophy className="h-8 w-8 text-amber-500" />
          <h3 className="font-semibold">
            {locale === 'ko' ? '즉시 채점' : 'Instant Grading'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {locale === 'ko'
              ? '쿼리 결과를 자동으로 채점하고 상세한 해설을 제공합니다'
              : 'Automatically grade your queries and get detailed explanations'}
          </p>
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="max-w-4xl mx-auto">
        <ArchitectureDiagram locale={locale} />
      </section>

      {/* Execution Flow Diagram */}
      <section className="max-w-4xl mx-auto">
        <ExecutionFlowDiagram locale={locale} />
      </section>

      {/* ERD Diagram */}
      <section className="max-w-4xl mx-auto">
        <ERDDiagram locale={locale} />
      </section>

      {/* Level Cards */}
      <section className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">{t('home.levelSection.title')}</h2>
          <p className="text-muted-foreground">{t('home.levelSection.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LEVEL_CONFIGS.map((config) => (
            <LevelCard key={config.id} config={config} />
          ))}
        </div>
      </section>
    </div>
  );
}
