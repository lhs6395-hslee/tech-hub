'use client';

import { useLocaleStore } from '@/stores/locale-store';
import type { K8sExecutionResult } from '@/types/k8s-problem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal, Clock } from 'lucide-react';

interface K8sResultPanelProps {
  results: K8sExecutionResult[] | null;
  error: string | null;
}

export default function K8sResultPanel({ results, error }: K8sResultPanelProps) {
  const locale = useLocaleStore((s) => s.locale);

  if (!results && !error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
        <Terminal className="h-8 w-8 opacity-40" />
        <p>
          {locale === 'ko'
            ? '명령을 실행하면 결과가 여기에 표시됩니다.'
            : 'Run a command to see results here.'}
        </p>
      </div>
    );
  }

  if (error && !results) {
    return (
      <div className="p-4">
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
          <pre className="text-xs text-red-600 dark:text-red-400 font-mono whitespace-pre-wrap">
            {error}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-2">
        {results?.map((result, idx) => (
          <div key={idx} className="rounded-lg bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-800 dark:bg-zinc-900 border-b border-zinc-700">
              <span className="text-[10px] text-zinc-400 font-mono">
                {locale === 'ko' ? '실행 결과' : 'Output'} {results.length > 1 ? `#${idx + 1}` : ''}
              </span>
              <div className="flex items-center gap-2">
                {result.exitCode !== 0 && (
                  <span className="text-[10px] text-red-400">
                    exit: {result.exitCode}
                  </span>
                )}
                <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                  <Clock className="h-3 w-3" />
                  {result.executionTime}ms
                </span>
              </div>
            </div>
            <div className="p-3 font-mono text-xs">
              {result.stdout && (
                <pre className="text-emerald-400 whitespace-pre-wrap">{result.stdout}</pre>
              )}
              {result.stderr && (
                <pre className="text-red-400 whitespace-pre-wrap mt-1">{result.stderr}</pre>
              )}
              {!result.stdout && !result.stderr && (
                <span className="text-zinc-500">
                  {locale === 'ko' ? '(출력 없음)' : '(no output)'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
