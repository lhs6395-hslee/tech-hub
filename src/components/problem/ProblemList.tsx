'use client';

import Link from 'next/link';
import type { Problem } from '@/types/problem';
import { useLocaleStore } from '@/stores/locale-store';
import { useProgressStore } from '@/stores/progress-store';
import { CheckCircle2, Circle, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProblemListProps {
  problems: Problem[];
  currentProblemId?: string;
}

export default function ProblemList({ problems, currentProblemId }: ProblemListProps) {
  const locale = useLocaleStore((s) => s.locale);
  const getAttempt = useProgressStore((s) => s.getAttempt);

  return (
    <div className="space-y-1">
      {problems.map((problem) => {
        const attempt = getAttempt(problem.id);
        const isActive = problem.id === currentProblemId;
        const isCompleted = attempt?.status === 'completed';
        const isAttempted = attempt?.status === 'attempted';

        return (
          <Link
            key={problem.id}
            href={`/levels/${problem.level}/${problem.id}`}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : isAttempted ? (
              <Minus className="h-4 w-4 text-amber-500 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
            )}
            <span className="truncate">
              {String(problem.order).padStart(2, '0')}. {problem.title[locale]}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
