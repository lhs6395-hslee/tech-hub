'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { K8sProblem } from '@/types/k8s-problem';
import { K8S_CATEGORY_LABELS } from '@/types/k8s-problem';
import { useLocaleStore } from '@/stores/locale-store';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface K8sProblemDescriptionProps {
  problem: K8sProblem;
}

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

export default function K8sProblemDescription({ problem }: K8sProblemDescriptionProps) {
  const locale = useLocaleStore((s) => s.locale);
  const categoryLabel = K8S_CATEGORY_LABELS[problem.category];

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={difficultyColors[problem.difficulty]}>
              {difficultyLabels[problem.difficulty][locale]}
            </Badge>
            <Badge className={`text-[10px] ${categoryLabel.color}`}>
              {categoryLabel[locale]}
            </Badge>
          </div>
          <h2 className="text-lg font-bold">{problem.title[locale]}</h2>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children, ...props }) => (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full" {...props}>{children}</table>
                </div>
              ),
              th: ({ children, ...props }) => (
                <th className="bg-muted/50 px-3 py-2 text-left text-xs font-semibold" {...props}>
                  {children}
                </th>
              ),
              td: ({ children, ...props }) => (
                <td className="px-3 py-1.5 text-xs border-t font-mono" {...props}>
                  {children}
                </td>
              ),
              code: ({ children, className, ...props }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono" {...props}>
                      {children}
                    </code>
                  );
                }
                return (
                  <code className={`${className} text-xs`} {...props}>
                    {children}
                  </code>
                );
              },
              pre: ({ children, ...props }) => (
                <pre className="rounded-lg bg-muted/50 p-3 text-xs overflow-x-auto" {...props}>
                  {children}
                </pre>
              ),
            }}
          >
            {problem.description[locale]}
          </ReactMarkdown>
        </div>
      </div>
    </ScrollArea>
  );
}
