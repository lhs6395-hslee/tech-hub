'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocaleStore } from '@/stores/locale-store';
import { useTranslation } from '@/lib/i18n';
import { useProgressStore } from '@/stores/progress-store';
import { useK8sProgressStore } from '@/stores/k8s-progress-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Database, Brain, Container, Monitor, TrendingUp, CheckCircle, BookOpen } from 'lucide-react';
import ChatBot from '@/components/chat/ChatBot';

const techPaths = [
  {
    id: 'database',
    icon: Database,
    gradient: 'from-emerald-500 to-blue-600',
    cardGradient: 'from-emerald-500/20 to-blue-600/5 hover:from-emerald-500/30 hover:to-blue-600/10',
    iconColor: 'text-emerald-500',
    href: '/database',
    comingSoon: false,
  },
  {
    id: 'ai',
    icon: Brain,
    gradient: 'from-purple-500 to-pink-600',
    cardGradient: 'from-purple-500/20 to-pink-600/5 hover:from-purple-500/30 hover:to-pink-600/10',
    iconColor: 'text-purple-500',
    href: null,
    comingSoon: true,
  },
  {
    id: 'kubernetes',
    icon: Container,
    gradient: 'from-blue-500 to-cyan-600',
    cardGradient: 'from-blue-500/20 to-cyan-600/5 hover:from-blue-500/30 hover:to-cyan-600/10',
    iconColor: 'text-blue-500',
    href: '/kubernetes',
    comingSoon: false,
  },
] as const;

export default function HubPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const [clickedId, setClickedId] = useState<string | null>(null);

  const handleClick = (path: typeof techPaths[number]) => {
    if (path.comingSoon) {
      setClickedId(path.id);
      setTimeout(() => setClickedId(null), 2000);
      return;
    }
    if (path.href) {
      router.push(path.href);
    }
  };

  // Aggregate stats
  const sqlProgress = useProgressStore((s) => s.progress.levelProgress);
  const k8sProgress = useK8sProgressStore((s) => s.progress.domainProgress);

  const totalSqlCompleted = Object.values(sqlProgress).reduce((sum, lp) => sum + lp.completedProblems, 0);
  const totalSqlProblems = Object.values(sqlProgress).reduce((sum, lp) => sum + lp.totalProblems, 0);
  const totalK8sCompleted = Object.values(k8sProgress).reduce((sum, lp) => sum + lp.completedProblems, 0);
  const totalK8sProblems = Object.values(k8sProgress).reduce((sum, lp) => sum + lp.totalProblems, 0);
  const overallCompleted = totalSqlCompleted + totalK8sCompleted;
  const overallTotal = totalSqlProblems + totalK8sProblems;
  const overallPct = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)]">
      {/* Hero Section */}
      <section className="text-center space-y-4 mb-16">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <Monitor className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t('common.appName')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('hub.title')}
        </p>
        <p className="text-sm text-muted-foreground">
          {t('hub.subtitle')}
        </p>
      </section>

      {/* Learning Stats Dashboard */}
      {overallTotal > 0 && (
        <section className="max-w-4xl w-full mb-8">
          <Card className="border-dashed">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold text-sm text-muted-foreground">
                  {locale === 'ko' ? '나의 학습 현황' : 'My Learning Progress'}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      {locale === 'ko' ? '전체 진행도' : 'Overall'}
                    </span>
                    <span className="font-medium">{overallPct}%</span>
                  </div>
                  <Progress value={overallPct} className="h-2 [&>div]:bg-indigo-500" />
                  <p className="text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3 inline mr-1" />
                    {overallCompleted}/{overallTotal} {locale === 'ko' ? '완료' : 'completed'}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5">
                      <Database className="h-4 w-4 text-emerald-500" />
                      SQL
                    </span>
                    <span className="font-medium">
                      {totalSqlProblems > 0 ? Math.round((totalSqlCompleted / totalSqlProblems) * 100) : 0}%
                    </span>
                  </div>
                  <Progress value={totalSqlProblems > 0 ? Math.round((totalSqlCompleted / totalSqlProblems) * 100) : 0} className="h-2 [&>div]:bg-emerald-500" />
                  <p className="text-xs text-muted-foreground">{totalSqlCompleted}/{totalSqlProblems}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5">
                      <Container className="h-4 w-4 text-blue-500" />
                      K8s
                    </span>
                    <span className="font-medium">
                      {totalK8sProblems > 0 ? Math.round((totalK8sCompleted / totalK8sProblems) * 100) : 0}%
                    </span>
                  </div>
                  <Progress value={totalK8sProblems > 0 ? Math.round((totalK8sCompleted / totalK8sProblems) * 100) : 0} className="h-2 [&>div]:bg-blue-500" />
                  <p className="text-xs text-muted-foreground">{totalK8sCompleted}/{totalK8sProblems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Tech Path Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {techPaths.map((path) => {
          const Icon = path.icon;
          const titleKey = `hub.${path.id}.title` as const;
          const descKey = `hub.${path.id}.description` as const;

          return (
            <div key={path.id} onClick={() => handleClick(path)} className="cursor-pointer">
              <Card className={`relative overflow-hidden group transition-all hover:shadow-lg hover:-translate-y-1 ${path.comingSoon ? 'opacity-70' : ''}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${path.cardGradient} transition-all`} />
                <CardContent className="relative p-8 flex flex-col items-center text-center space-y-4">
                  {/* Coming Soon Badge */}
                  {path.comingSoon && (
                    <Badge
                      variant="secondary"
                      className={`absolute top-3 right-3 text-[10px] transition-all ${
                        clickedId === path.id
                          ? 'bg-amber-500/20 text-amber-600 scale-110'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {t('hub.comingSoon')}
                    </Badge>
                  )}

                  {/* Icon */}
                  <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${path.gradient} shadow-md`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-bold text-xl">{t(titleKey)}</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t(descKey)}
                    </p>
                  </div>

                  {/* Status indicator */}
                  {!path.comingSoon && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {locale === 'ko' ? '학습 가능' : 'Available'}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </section>

      <ChatBot context="hub" />
    </div>
  );
}
