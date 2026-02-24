'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useLocaleStore } from '@/stores/locale-store';
import { useSettingsStore } from '@/stores/settings-store';
import { useProgressStore } from '@/stores/progress-store';
import { getProblemById, getProblemsByLevel, getNextProblem } from '@/data/problems';
import { gradeResult, type GradingResult } from '@/lib/grading/grader';
import type { QueryResult, Level } from '@/types/problem';
import ProblemDescription from '@/components/problem/ProblemDescription';
import ResultTable from '@/components/editor/ResultTable';
import EditorToolbar from '@/components/editor/EditorToolbar';
import GradingResultDisplay from '@/components/problem/GradingResult';
import Explanation from '@/components/problem/Explanation';
import ProblemList from '@/components/problem/ProblemList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, PanelLeftClose, PanelLeft } from 'lucide-react';
import Link from 'next/link';

const SqlEditor = dynamic(() => import('@/components/editor/SqlEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] rounded-md border border-border bg-muted/50 flex items-center justify-center text-sm text-muted-foreground">
      Loading editor...
    </div>
  ),
});

export default function ProblemWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const level = params.level as Level;
  const problemId = params.problemId as string;

  const locale = useLocaleStore((s) => s.locale);
  const dbEngine = useSettingsStore((s) => s.dbEngine);
  const { completeProblem, recordAttempt } = useProgressStore();

  const problem = getProblemById(problemId);
  const levelProblems = getProblemsByLevel(level);

  const [sqlValue, setSqlValue] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [gradingResultState, setGradingResult] = useState<GradingResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hintIndex, setHintIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState('result');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleRun = useCallback(async () => {
    if (!problem || !sqlValue.trim()) return;

    setIsRunning(true);
    setQueryError(null);
    setGradingResult(null);

    try {
      const res = await fetch('/api/execute-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sql: sqlValue.trim(),
          level: problem.level,
          engine: dbEngine,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = locale === 'ko' && data.errorKo ? data.errorKo : data.error;
        setQueryError(errorMsg || 'Unknown error');
        return;
      }

      setQueryResult(data.result);
      setActiveTab('result');
      recordAttempt(problem.id);
    } catch (err) {
      setQueryError(
        locale === 'ko'
          ? '데이터베이스 연결에 실패했습니다. Docker가 실행 중인지 확인해주세요.'
          : 'Failed to connect to database. Please make sure Docker is running.'
      );
    } finally {
      setIsRunning(false);
    }
  }, [sqlValue, problem, dbEngine, locale, recordAttempt]);

  const handleCheckAnswer = useCallback(async () => {
    if (!problem || !queryResult) return;

    // Execute the expected query to get expected result
    try {
      const res = await fetch('/api/execute-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sql: problem.expectedQuery[dbEngine],
          level: problem.level,
          engine: dbEngine,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setQueryError(data.error);
        return;
      }

      const result = gradeResult(queryResult, data.result, problem.gradingMode);
      setGradingResult(result);

      if (result.correct) {
        completeProblem(problem.id, sqlValue, Math.max(0, hintIndex + 1));
      }

      setActiveTab('result');
    } catch {
      setQueryError(
        locale === 'ko'
          ? '채점 중 오류가 발생했습니다.'
          : 'An error occurred during grading.'
      );
    }
  }, [problem, queryResult, dbEngine, sqlValue, hintIndex, locale, completeProblem]);

  const handleReset = useCallback(() => {
    setSqlValue('');
    setQueryResult(null);
    setQueryError(null);
    setGradingResult(null);
    setHintIndex(-1);
  }, []);

  const handleHint = useCallback(() => {
    if (!problem) return;
    const maxHints = problem.hints[locale].length;
    if (hintIndex < maxHints - 1) {
      setHintIndex((prev) => prev + 1);
    }
  }, [problem, hintIndex, locale]);

  const handleNextProblem = useCallback(() => {
    if (!problem) return;
    const next = getNextProblem(problem.id);
    if (next) {
      router.push(`/levels/${next.level}/${next.id}`);
      handleReset();
    }
  }, [problem, router, handleReset]);

  const handleViewExplanation = useCallback(() => {
    setActiveTab('explanation');
  }, []);

  if (!problem) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold">
          {locale === 'ko' ? '문제를 찾을 수 없습니다' : 'Problem not found'}
        </h1>
        <Link href={`/levels/${level}`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {locale === 'ko' ? '목록으로' : 'Back to list'}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-64 border-r bg-muted/20 shrink-0">
          <div className="p-3 border-b flex items-center justify-between">
            <Link href={`/levels/${level}`} className="text-sm font-medium hover:text-primary transition-colors">
              {locale === 'ko' ? '문제 목록' : 'Problems'}
            </Link>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setSidebarOpen(false)}>
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100%-3rem)]">
            <div className="p-2">
              <ProblemList problems={levelProblems} currentProblemId={problemId} />
            </div>
          </ScrollArea>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex min-w-0">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r flex flex-col min-w-0">
          <div className="p-2 border-b flex items-center gap-2">
            {!sidebarOpen && (
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setSidebarOpen(true)}>
                <PanelLeft className="h-4 w-4" />
              </Button>
            )}
            <span className="text-xs font-medium text-muted-foreground">
              {locale === 'ko' ? '문제 설명' : 'Problem Description'}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <ProblemDescription problem={problem} />
          </div>
        </div>

        {/* Right Panel - Editor + Results */}
        <div className="w-1/2 flex flex-col min-w-0">
          {/* Editor */}
          <div className="flex-shrink-0 border-b">
            <div className="p-2 border-b">
              <span className="text-xs font-medium text-muted-foreground">
                {locale === 'ko' ? 'SQL 편집기' : 'SQL Editor'}
              </span>
            </div>
            <div className="h-[200px]">
              <SqlEditor
                value={sqlValue}
                onChange={setSqlValue}
                onRun={handleRun}
              />
            </div>
            <div className="px-2">
              <EditorToolbar
                onRun={handleRun}
                onReset={handleReset}
                onHint={handleHint}
                onCheckAnswer={handleCheckAnswer}
                isRunning={isRunning}
                hasResult={queryResult !== null}
              />
            </div>
          </div>

          {/* Hints */}
          {hintIndex >= 0 && problem && (
            <div className="p-3 border-b bg-amber-500/5">
              <div className="space-y-1">
                {problem.hints[locale].slice(0, hintIndex + 1).map((hint, i) => (
                  <p key={i} className="text-xs text-amber-700 dark:text-amber-400">
                    💡 {locale === 'ko' ? '힌트' : 'Hint'} {i + 1}: {hint}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Grading Result */}
          {gradingResultState && (
            <div className="p-3 border-b">
              <GradingResultDisplay
                result={gradingResultState}
                onNextProblem={getNextProblem(problem.id) ? handleNextProblem : undefined}
                onViewExplanation={handleViewExplanation}
              />
            </div>
          )}

          {/* Results Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="rounded-none border-b bg-transparent h-9 w-full justify-start px-2">
                <TabsTrigger value="result" className="text-xs h-7 rounded-md">
                  {locale === 'ko' ? '실행 결과' : 'Result'}
                </TabsTrigger>
                <TabsTrigger value="explanation" className="text-xs h-7 rounded-md">
                  {locale === 'ko' ? '해설' : 'Explanation'}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="result" className="flex-1 overflow-auto mt-0 p-3">
                <ResultTable result={queryResult} error={queryError} />
              </TabsContent>
              <TabsContent value="explanation" className="flex-1 overflow-auto mt-0">
                <Explanation problem={problem} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
