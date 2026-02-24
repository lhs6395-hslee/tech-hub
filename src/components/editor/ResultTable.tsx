'use client';

import type { QueryResult } from '@/types/problem';
import { useTranslation } from '@/lib/i18n';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Clock, Rows3 } from 'lucide-react';

interface ResultTableProps {
  result: QueryResult | null;
  error?: string | null;
}

export default function ResultTable({ result, error }: ResultTableProps) {
  const { t } = useTranslation();

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm font-medium text-destructive">{t('grading.executionError')}</p>
        <pre className="mt-2 text-xs text-destructive/80 whitespace-pre-wrap font-mono">
          {error}
        </pre>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-full min-h-[150px] text-muted-foreground">
        <p className="text-sm">{t('problem.noResult')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Rows3 className="h-3 w-3" />
          {result.rowCount} rows
        </span>
        {result.executionTime !== undefined && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {result.executionTime < 1
              ? '<1ms'
              : `${result.executionTime}ms`}
          </span>
        )}
      </div>
      <ScrollArea className="rounded-lg border">
        <div className="max-h-[400px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-muted/80 backdrop-blur-sm border-b">
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground w-10">
                  #
                </th>
                {result.columns.map((col, i) => (
                  <th
                    key={i}
                    className="px-3 py-2 text-left text-xs font-semibold text-foreground whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="border-b last:border-b-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="px-3 py-1.5 text-xs text-muted-foreground tabular-nums">
                    {rowIdx + 1}
                  </td>
                  {row.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className={`px-3 py-1.5 text-xs whitespace-nowrap font-mono ${
                        cell === null ? 'text-muted-foreground italic' : ''
                      }`}
                    >
                      {cell === null ? 'NULL' : String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
