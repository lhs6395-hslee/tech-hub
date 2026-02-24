'use client';

import type { GradingResult } from '@/lib/grading/grader';
import { useLocaleStore } from '@/stores/locale-store';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';

interface GradingResultProps {
  result: GradingResult | null;
  onNextProblem?: () => void;
  onViewExplanation?: () => void;
}

export default function GradingResultDisplay({
  result,
  onNextProblem,
  onViewExplanation,
}: GradingResultProps) {
  const locale = useLocaleStore((s) => s.locale);
  const { t } = useTranslation();

  if (!result) return null;

  const icon = result.correct ? (
    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
  ) : result.score >= 50 ? (
    <AlertTriangle className="h-5 w-5 text-amber-500" />
  ) : (
    <XCircle className="h-5 w-5 text-red-500" />
  );

  const bgClass = result.correct
    ? 'bg-emerald-500/10 border-emerald-500/30'
    : result.score >= 50
    ? 'bg-amber-500/10 border-amber-500/30'
    : 'bg-red-500/10 border-red-500/30';

  return (
    <div className={`rounded-lg border p-4 space-y-3 ${bgClass} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold text-sm">
          {result.message[locale]}
        </span>
        {result.score > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">
            Score: {result.score}/100
          </span>
        )}
      </div>

      {result.details && !result.correct && (
        <div className="text-xs space-y-1 text-muted-foreground">
          {result.details.missingColumns && result.details.missingColumns.length > 0 && (
            <p>
              {locale === 'ko' ? '누락된 컬럼: ' : 'Missing columns: '}
              <code className="bg-muted px-1 rounded">{result.details.missingColumns.join(', ')}</code>
            </p>
          )}
          {result.details.extraColumns && result.details.extraColumns.length > 0 && (
            <p>
              {locale === 'ko' ? '불필요한 컬럼: ' : 'Extra columns: '}
              <code className="bg-muted px-1 rounded">{result.details.extraColumns.join(', ')}</code>
            </p>
          )}
          {result.details.expectedRowCount !== result.details.actualRowCount && (
            <p>
              {locale === 'ko'
                ? `기대 행 수: ${result.details.expectedRowCount}, 실제 행 수: ${result.details.actualRowCount}`
                : `Expected rows: ${result.details.expectedRowCount}, Actual rows: ${result.details.actualRowCount}`}
            </p>
          )}
        </div>
      )}

      {result.correct && (
        <div className="flex items-center gap-2">
          {onViewExplanation && (
            <Button size="sm" variant="outline" onClick={onViewExplanation}>
              {t('grading.viewExplanation')}
            </Button>
          )}
          {onNextProblem && (
            <Button size="sm" onClick={onNextProblem} className="gap-1">
              {t('grading.nextProblem')}
              <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
