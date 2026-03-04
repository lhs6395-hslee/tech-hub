'use client';

import type { K8sGradingResult } from '@/types/k8s-problem';
import { useLocaleStore } from '@/stores/locale-store';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface K8sGradingResultProps {
  result: K8sGradingResult | null;
  onNextProblem?: () => void;
  onViewExplanation?: () => void;
}

export default function K8sGradingResultDisplay({
  result,
  onNextProblem,
  onViewExplanation,
}: K8sGradingResultProps) {
  const locale = useLocaleStore((s) => s.locale);
  const [showDetails, setShowDetails] = useState(false);

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

  const passedCount = result.details.filter((d) => d.passed).length;
  const totalCount = result.details.length;

  return (
    <div className={`rounded-lg border p-4 space-y-3 ${bgClass} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold text-sm">
          {result.message[locale]}
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          {passedCount}/{totalCount} {locale === 'ko' ? '통과' : 'passed'}
        </span>
      </div>

      {/* Verification details toggle */}
      {result.details.length > 0 && (
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {locale === 'ko' ? '검증 상세' : 'Verification Details'}
        </button>
      )}

      {showDetails && (
        <div className="space-y-2">
          {result.details.map((detail, idx) => (
            <div
              key={idx}
              className={`rounded-md border p-2.5 text-xs ${
                detail.passed
                  ? 'border-emerald-500/20 bg-emerald-500/5'
                  : 'border-red-500/20 bg-red-500/5'
              }`}
            >
              <div className="flex items-center gap-1.5 font-medium">
                {detail.passed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-red-500" />
                )}
                {detail.description[locale]}
              </div>
              {!detail.passed && (
                <div className="mt-1.5 pl-5 space-y-0.5 text-muted-foreground">
                  <p>
                    <span className="font-medium">{locale === 'ko' ? '기대값' : 'Expected'}:</span>{' '}
                    <code className="bg-muted px-1 rounded">{detail.expected}</code>
                  </p>
                  <p>
                    <span className="font-medium">{locale === 'ko' ? '실제값' : 'Actual'}:</span>{' '}
                    <code className="bg-muted px-1 rounded">{detail.actual}</code>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {result.correct && (
        <div className="flex items-center gap-2">
          {onViewExplanation && (
            <Button size="sm" variant="outline" onClick={onViewExplanation}>
              {locale === 'ko' ? '해설 보기' : 'View Explanation'}
            </Button>
          )}
          {onNextProblem && (
            <Button size="sm" onClick={onNextProblem} className="gap-1">
              {locale === 'ko' ? '다음 문제' : 'Next Problem'}
              <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
