'use client';

import { useState, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useLocaleStore } from '@/stores/locale-store';
import { useK8sProgressStore } from '@/stores/k8s-progress-store';
import { getK8sProblemById, getK8sProblemsByDomain, getNextK8sProblem } from '@/data/k8s-problems';
import type { K8sExecutionResult, K8sGradingResult } from '@/types/k8s-problem';
import type { KubeLevel } from '@/types/kubernetes';
import K8sProblemDescription from '@/components/problem/K8sProblemDescription';
import K8sResultPanel from '@/components/editor/K8sResultPanel';
import K8sGradingResultDisplay from '@/components/problem/K8sGradingResult';
import K8sProblemList from '@/components/problem/K8sProblemList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, PanelLeftClose, PanelLeft, Play, RotateCcw, Lightbulb, CheckCircle2, BookOpen, Terminal, FileCode } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const K8sEditor = dynamic(() => import('@/components/editor/K8sEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] rounded-md border border-border bg-muted/50 flex items-center justify-center text-sm text-muted-foreground">
      Loading editor...
    </div>
  ),
});

export default function K8sProblemWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const domain = params.domain as KubeLevel;
  const problemId = params.problemId as string;

  const locale = useLocaleStore((s) => s.locale);
  const { completeProblem, recordAttempt } = useK8sProgressStore();

  const problem = getK8sProblemById(problemId);
  const domainProblems = getK8sProblemsByDomain(domain);

  const [inputValue, setInputValue] = useState('');
  const [editorTab, setEditorTab] = useState<'kubectl' | 'yaml'>('kubectl');
  const [executionResults, setExecutionResults] = useState<K8sExecutionResult[] | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [gradingResult, setGradingResult] = useState<K8sGradingResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hintIndex, setHintIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState('result');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSettingUp, setIsSettingUp] = useState(false);

  // Setup problem environment on mount
  useEffect(() => {
    if (!problem) return;
    const setupProblem = async () => {
      setIsSettingUp(true);
      try {
        await fetch('/api/k8s-setup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'setup', problemId: problem.id }),
        });
      } catch {
        // Setup may fail if k3s is not running - we'll handle that on execution
      } finally {
        setIsSettingUp(false);
      }
    };
    setupProblem();

    // Cleanup on unmount
    return () => {
      fetch('/api/k8s-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cleanup', problemId: problem.id }),
      }).catch(() => {});
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemId]);

  const handleRun = useCallback(async () => {
    if (!problem || !inputValue.trim()) return;

    setIsRunning(true);
    setExecutionError(null);
    setGradingResult(null);

    try {
      const res = await fetch('/api/execute-k8s', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: inputValue,
          namespace: problem.namespace,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = locale === 'ko' && data.errorKo ? data.errorKo : data.error;
        setExecutionError(errorMsg || 'Unknown error');
        if (data.results) setExecutionResults(data.results);
        return;
      }

      setExecutionResults(data.results);
      setActiveTab('result');
      recordAttempt(problem.id);
    } catch {
      setExecutionError(
        locale === 'ko'
          ? 'k3s 클러스터 연결에 실패했습니다. k3s가 실행 중인지 확인해주세요.'
          : 'Failed to connect to k3s cluster. Please make sure k3s is running.'
      );
    } finally {
      setIsRunning(false);
    }
  }, [inputValue, problem, locale, recordAttempt]);

  const handleCheckAnswer = useCallback(async () => {
    if (!problem || !inputValue.trim()) return;

    setIsRunning(true);
    setExecutionError(null);
    setGradingResult(null);

    try {
      // Step 1: Cleanup and re-setup the environment
      await fetch('/api/k8s-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cleanup', problemId: problem.id }),
      });

      await fetch('/api/k8s-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setup', problemId: problem.id }),
      });

      // Step 2: Execute user's solution
      const execRes = await fetch('/api/execute-k8s', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: inputValue,
          namespace: problem.namespace,
        }),
      });

      const execData = await execRes.json();

      if (!execRes.ok || !execData.success) {
        const errorMsg = locale === 'ko' && execData.errorKo ? execData.errorKo : execData.error;
        setExecutionError(errorMsg || 'Execution failed');
        if (execData.results) setExecutionResults(execData.results);
        return;
      }

      setExecutionResults(execData.results);
      recordAttempt(problem.id);

      // Step 3: Verify the cluster state
      const verifyRes = await fetch('/api/k8s-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', problemId: problem.id }),
      });

      const verifyData = await verifyRes.json();

      if (verifyData.success && verifyData.result) {
        const result = verifyData.result as K8sGradingResult;
        setGradingResult(result);
        setActiveTab('result');

        if (result.correct) {
          try {
            completeProblem(problem.id, inputValue, Math.max(0, hintIndex + 1));
          } catch {
            // Progress save failed
          }
        }
      }
    } catch {
      setExecutionError(
        locale === 'ko'
          ? '채점 중 오류가 발생했습니다.'
          : 'An error occurred during grading.'
      );
    } finally {
      setIsRunning(false);
    }
  }, [inputValue, problem, hintIndex, locale, completeProblem, recordAttempt]);

  const handleReset = useCallback(async () => {
    if (!problem) return;
    setInputValue('');
    setExecutionResults(null);
    setExecutionError(null);
    setGradingResult(null);
    setHintIndex(-1);

    // Re-setup environment
    try {
      await fetch('/api/k8s-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cleanup', problemId: problem.id }),
      });
      await fetch('/api/k8s-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setup', problemId: problem.id }),
      });
    } catch {
      // Silent reset
    }
  }, [problem]);

  const handleHint = useCallback(() => {
    if (!problem) return;
    const maxHints = problem.hints[locale].length;
    if (hintIndex < maxHints - 1) {
      setHintIndex((prev) => prev + 1);
    }
  }, [problem, hintIndex, locale]);

  const handleNextProblem = useCallback(() => {
    if (!problem) return;
    const next = getNextK8sProblem(problem.id);
    if (next) {
      router.push(`/kubernetes/labs/${next.domain}/${next.id}`);
      setInputValue('');
      setExecutionResults(null);
      setExecutionError(null);
      setGradingResult(null);
      setHintIndex(-1);
    }
  }, [problem, router]);

  const handleViewExplanation = useCallback(() => {
    setActiveTab('explanation');
  }, []);

  if (!problem) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold">
          {locale === 'ko' ? '문제를 찾을 수 없습니다' : 'Problem not found'}
        </h1>
        <Link href={`/kubernetes/labs/${domain}`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {locale === 'ko' ? '목록으로' : 'Back to list'}
          </Button>
        </Link>
      </div>
    );
  }

  const showYamlTab = problem.editorMode === 'yaml' || problem.editorMode === 'both';
  const showKubectlTab = problem.editorMode === 'kubectl' || problem.editorMode === 'both';

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-64 border-r bg-muted/20 shrink-0">
          <div className="p-3 border-b flex items-center justify-between">
            <Link href={`/kubernetes/labs/${domain}`} className="text-sm font-medium hover:text-primary transition-colors">
              {locale === 'ko' ? '문제 목록' : 'Problems'}
            </Link>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setSidebarOpen(false)}>
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100%-3rem)]">
            <div className="p-2">
              <K8sProblemList problems={domainProblems} currentProblemId={problemId} />
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
            <K8sProblemDescription problem={problem} />
          </div>
        </div>

        {/* Right Panel - Editor + Results */}
        <div className="w-1/2 flex flex-col min-w-0">
          {/* Editor Mode Tabs */}
          <div className="flex-shrink-0 border-b">
            <div className="p-2 border-b flex items-center gap-2">
              {problem.editorMode === 'both' && (
                <div className="flex gap-1">
                  {showKubectlTab && (
                    <button
                      onClick={() => setEditorTab('kubectl')}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                        editorTab === 'kubectl'
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Terminal className="h-3 w-3" />
                      kubectl
                    </button>
                  )}
                  {showYamlTab && (
                    <button
                      onClick={() => setEditorTab('yaml')}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                        editorTab === 'yaml'
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <FileCode className="h-3 w-3" />
                      YAML
                    </button>
                  )}
                </div>
              )}
              {problem.editorMode !== 'both' && (
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  {problem.editorMode === 'yaml' ? (
                    <><FileCode className="h-3 w-3" /> YAML</>
                  ) : (
                    <><Terminal className="h-3 w-3" /> kubectl</>
                  )}
                </span>
              )}
              {isSettingUp && (
                <span className="ml-auto text-[10px] text-muted-foreground animate-pulse">
                  {locale === 'ko' ? '환경 준비 중...' : 'Setting up...'}
                </span>
              )}
            </div>
            <div className="h-[200px]">
              <K8sEditor
                value={inputValue}
                onChange={setInputValue}
                onRun={handleRun}
                editorMode={problem.editorMode}
                activeTab={problem.editorMode === 'yaml' ? 'yaml' : problem.editorMode === 'kubectl' ? 'kubectl' : editorTab}
              />
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 py-2 px-2">
              <Button
                onClick={handleRun}
                disabled={isRunning || isSettingUp}
                size="sm"
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Play className="h-3.5 w-3.5" />
                {locale === 'ko' ? '실행' : 'Run'}
                <kbd className="ml-1 hidden sm:inline-flex items-center rounded border border-emerald-400/30 bg-emerald-500/20 px-1 text-[10px] font-mono">
                  {typeof navigator !== 'undefined' && navigator?.platform?.includes('Mac') ? '⌘' : 'Ctrl'}+↵
                </kbd>
              </Button>

              <Button onClick={handleCheckAnswer} disabled={isRunning || !inputValue.trim() || isSettingUp} size="sm" variant="default" className="gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {locale === 'ko' ? '정답 확인' : 'Check Answer'}
              </Button>

              <div className="flex-1" />

              <Button onClick={handleHint} size="sm" variant="outline" className="gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" />
                {locale === 'ko' ? '힌트' : 'Hint'}
              </Button>

              <Button onClick={handleReset} size="sm" variant="ghost" className="gap-1.5 text-muted-foreground">
                <RotateCcw className="h-3.5 w-3.5" />
                {locale === 'ko' ? '초기화' : 'Reset'}
              </Button>
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
          {gradingResult && (
            <div className="p-3 border-b">
              <K8sGradingResultDisplay
                result={gradingResult}
                onNextProblem={getNextK8sProblem(problem.id) ? handleNextProblem : undefined}
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
              <TabsContent value="result" className="flex-1 overflow-auto mt-0">
                <K8sResultPanel results={executionResults} error={gradingResult ? null : executionError} />
              </TabsContent>
              <TabsContent value="explanation" className="flex-1 overflow-auto mt-0">
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
