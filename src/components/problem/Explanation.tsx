'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Problem } from '@/types/problem';
import { useLocaleStore } from '@/stores/locale-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen } from 'lucide-react';

interface ExplanationProps {
  problem: Problem;
}

export default function Explanation({ problem }: ExplanationProps) {
  const locale = useLocaleStore((s) => s.locale);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <BookOpen className="h-4 w-4 text-blue-500" />
          <span>{locale === 'ko' ? '해설' : 'Explanation'}</span>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
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
            {problem.explanation[locale]}
          </ReactMarkdown>
        </div>
      </div>
    </ScrollArea>
  );
}
