'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLocaleStore } from '@/stores/locale-store';
import { useProgressStore } from '@/stores/progress-store';
import { getProblemsByLevel } from '@/data/problems';
import { LEVEL_CONFIGS, type Level, getSqlType, SQL_TYPE_LABELS } from '@/types/problem';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Minus, ArrowLeft, ArrowRight } from 'lucide-react';

export default function LevelPage() {
  const params = useParams();
  const level = params.level as Level;
  const locale = useLocaleStore((s) => s.locale);
  const getAttempt = useProgressStore((s) => s.getAttempt);
  const getLevelProgress = useProgressStore((s) => s.getLevelProgress);

  const problems = getProblemsByLevel(level);
  const levelConfig = LEVEL_CONFIGS.find((c) => c.id === level);
  const progress = getLevelProgress(level);

  if (!levelConfig || problems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold">
          {locale === 'ko' ? '준비 중인 레벨입니다' : 'This level is coming soon'}
        </h1>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {locale === 'ko' ? '홈으로 돌아가기' : 'Back to Home'}
          </Button>
        </Link>
      </div>
    );
  }

  // Group problems by category
  const categories = [...new Set(problems.map((p) => p.category))];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{levelConfig.label[locale]}</h1>
          <p className="text-sm text-muted-foreground">{levelConfig.description[locale]}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">
            {progress.completedProblems}/{problems.length} {locale === 'ko' ? '완료' : 'completed'}
          </p>
          <Progress value={progress.percentage} className="h-2 w-32 mt-1" />
        </div>
      </div>

      {categories.map((category) => {
        const categoryProblems = problems.filter((p) => p.category === category);
        return (
          <div key={category} className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Badge variant="outline">{category}</Badge>
              <span className="text-xs text-muted-foreground">
                ({categoryProblems.length} {locale === 'ko' ? '문제' : 'problems'})
              </span>
            </h2>
            <div className="grid gap-2">
              {categoryProblems.map((problem) => {
                const attempt = getAttempt(problem.id);
                const isCompleted = attempt?.status === 'completed';
                const isAttempted = attempt?.status === 'attempted';

                return (
                  <Link key={problem.id} href={`/levels/${level}/${problem.id}`}>
                    <Card className="group hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                      <CardContent className="p-4 flex items-center gap-3">
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                        ) : isAttempted ? (
                          <Minus className="h-5 w-5 text-amber-500 shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground/30 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {String(problem.order).padStart(2, '0')}. {problem.title[locale]}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-[10px] ${SQL_TYPE_LABELS[getSqlType(problem.category)].color}`}
                          >
                            {SQL_TYPE_LABELS[getSqlType(problem.category)][locale]}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={`text-[10px] ${
                              problem.difficulty === 1
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : problem.difficulty === 2
                                ? 'bg-amber-500/10 text-amber-600'
                                : 'bg-red-500/10 text-red-600'
                            }`}
                          >
                            {problem.difficulty === 1
                              ? locale === 'ko' ? '쉬움' : 'Easy'
                              : problem.difficulty === 2
                              ? locale === 'ko' ? '보통' : 'Medium'
                              : locale === 'ko' ? '어려움' : 'Hard'}
                          </Badge>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
