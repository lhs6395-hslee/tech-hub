'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLocaleStore } from '@/stores/locale-store';
import { useK8sProgressStore } from '@/stores/k8s-progress-store';
import { getK8sProblemsByDomain } from '@/data/k8s-problems';
import { K8S_LEVEL_CONFIGS, type KubeLevel } from '@/types/kubernetes';
import { K8S_CATEGORY_LABELS } from '@/types/k8s-problem';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, Circle, Minus } from 'lucide-react';

const difficultyColors = {
  1: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  2: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  3: 'bg-red-500/10 text-red-600 border-red-500/20',
};

const difficultyLabels = {
  1: { ko: '쉬움', en: 'Easy' },
  2: { ko: '보통', en: 'Medium' },
  3: { ko: '어려움', en: 'Hard' },
};

export default function K8sDomainPage() {
  const params = useParams();
  const domain = params.domain as KubeLevel;
  const locale = useLocaleStore((s) => s.locale);
  const completedProblems = useK8sProgressStore((s) => s.progress.completedProblems);

  const problems = getK8sProblemsByDomain(domain);
  const config = K8S_LEVEL_CONFIGS.find((c) => c.id === domain);

  if (!config) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold">
          {locale === 'ko' ? '도메인을 찾을 수 없습니다' : 'Domain not found'}
        </h1>
        <Link href="/kubernetes/labs">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {locale === 'ko' ? '목록으로' : 'Back to list'}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/kubernetes/labs">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            {locale === 'ko' ? '돌아가기' : 'Back'}
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{config.label[locale]}</h1>
          <p className="text-sm text-muted-foreground">{config.description[locale]}</p>
        </div>
      </div>

      <div className="space-y-2">
        {problems.map((problem) => {
          const attempt = completedProblems[problem.id];
          const isCompleted = attempt?.status === 'completed';
          const isAttempted = attempt?.status === 'attempted';
          const categoryLabel = K8S_CATEGORY_LABELS[problem.category];

          return (
            <Link
              key={problem.id}
              href={`/kubernetes/labs/${domain}/${problem.id}`}
              className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors group"
            >
              <div className="shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : isAttempted ? (
                  <Minus className="h-5 w-5 text-amber-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/40" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-muted-foreground">
                    #{String(problem.order).padStart(2, '0')}
                  </span>
                  <h3 className="font-medium group-hover:text-primary transition-colors truncate">
                    {problem.title[locale]}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-[10px] ${difficultyColors[problem.difficulty]}`}>
                    {difficultyLabels[problem.difficulty][locale]}
                  </Badge>
                  <Badge className={`text-[10px] ${categoryLabel.color}`}>
                    {categoryLabel[locale]}
                  </Badge>
                </div>
              </div>
            </Link>
          );
        })}

        {problems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {locale === 'ko'
              ? '이 도메인에는 아직 문제가 없습니다.'
              : 'No problems available for this domain yet.'}
          </div>
        )}
      </div>
    </div>
  );
}
