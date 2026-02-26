'use client';

import { useState } from 'react';
import { Search, RotateCcw, SkipForward } from 'lucide-react';

interface Props {
  locale: 'ko' | 'en';
}

interface TreeNode {
  id: string;
  keys: number[];
  children: string[];
}

interface Step {
  nodeId: string;
  desc: { ko: string; en: string };
  result: 'searching' | 'found' | 'not_found';
}

const NODES: Record<string, TreeNode> = {
  root: { id: 'root', keys: [20], children: ['n1', 'n2'] },
  n1: { id: 'n1', keys: [8, 14], children: ['l1', 'l2', 'l3'] },
  n2: { id: 'n2', keys: [25, 35], children: ['l4', 'l5', 'l6'] },
  l1: { id: 'l1', keys: [3, 5], children: [] },
  l2: { id: 'l2', keys: [10, 12], children: [] },
  l3: { id: 'l3', keys: [16, 18], children: [] },
  l4: { id: 'l4', keys: [22, 24], children: [] },
  l5: { id: 'l5', keys: [28, 30], children: [] },
  l6: { id: 'l6', keys: [40, 45], children: [] },
};

const LEVELS = [['root'], ['n1', 'n2'], ['l1', 'l2', 'l3', 'l4', 'l5', 'l6']];

function buildSteps(target: number): Step[] {
  const steps: Step[] = [];
  let nodeId = 'root';

  while (true) {
    const node = NODES[nodeId];
    const isLeaf = node.children.length === 0;
    const keys = node.keys;

    const exactIdx = keys.indexOf(target);
    if (exactIdx !== -1) {
      steps.push({
        nodeId,
        desc: {
          ko: `[${keys.join(', ')}] 에서 ${target} 발견!`,
          en: `Found ${target} in [${keys.join(', ')}]!`,
        },
        result: 'found',
      });
      return steps;
    }

    let childIndex = keys.length;
    for (let i = 0; i < keys.length; i++) {
      if (target < keys[i]) {
        childIndex = i;
        break;
      }
    }

    if (isLeaf) {
      steps.push({
        nodeId,
        desc: {
          ko: `리프 [${keys.join(', ')}] — 값 ${target}을(를) 찾을 수 없음`,
          en: `Leaf [${keys.join(', ')}] — value ${target} not found`,
        },
        result: 'not_found',
      });
      return steps;
    }

    let desc: { ko: string; en: string };
    if (childIndex === 0) {
      desc = {
        ko: `[${keys.join(', ')}]: ${target} < ${keys[0]} → 왼쪽 자식으로`,
        en: `[${keys.join(', ')}]: ${target} < ${keys[0]} → go left`,
      };
    } else if (childIndex === keys.length) {
      desc = {
        ko: `[${keys.join(', ')}]: ${target} > ${keys[keys.length - 1]} → 오른쪽 자식으로`,
        en: `[${keys.join(', ')}]: ${target} > ${keys[keys.length - 1]} → go right`,
      };
    } else {
      desc = {
        ko: `[${keys.join(', ')}]: ${keys[childIndex - 1]} < ${target} < ${keys[childIndex]} → 중간 자식으로`,
        en: `[${keys.join(', ')}]: ${keys[childIndex - 1]} < ${target} < ${keys[childIndex]} → go middle`,
      };
    }

    steps.push({ nodeId, desc, result: 'searching' });
    nodeId = node.children[childIndex];
  }
}

export default function BTreeSimulator({ locale }: Props) {
  const [searchValue, setSearchValue] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);

  const visitedNodes = new Set(steps.slice(0, currentStep + 1).map((s) => s.nodeId));
  const currentNodeId = currentStep >= 0 ? steps[currentStep]?.nodeId : null;

  function handleSearch() {
    const target = parseInt(searchValue);
    if (isNaN(target)) return;
    const newSteps = buildSteps(target);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsComplete(newSteps.length === 1);
  }

  function handleNextStep() {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (next === steps.length - 1) setIsComplete(true);
    }
  }

  function handleReset() {
    setSearchValue('');
    setSteps([]);
    setCurrentStep(-1);
    setIsComplete(false);
  }

  function getNodeStyle(nodeId: string) {
    if (nodeId === currentNodeId) {
      const step = steps[currentStep];
      if (step?.result === 'found')
        return 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 scale-105';
      if (step?.result === 'not_found')
        return 'ring-2 ring-red-500 bg-red-50 dark:bg-red-950/50';
      return 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/50 scale-105';
    }
    if (visitedNodes.has(nodeId))
      return 'ring-2 ring-emerald-400/60 bg-emerald-50/50 dark:bg-emerald-950/30';
    return 'bg-card';
  }

  const allValues = Object.values(NODES)
    .flatMap((n) => n.keys)
    .sort((a, b) => a - b);

  return (
    <div className="rounded-xl border-2 border-dashed border-border bg-muted/10 p-6 space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
          <Search className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold">
            {locale === 'ko'
              ? 'B-tree 인덱스 탐색 시뮬레이터'
              : 'B-tree Index Search Simulator'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {locale === 'ko'
              ? 'B-tree(차수 3)에서 값을 검색하는 과정을 단계별로 확인합니다'
              : 'Watch the step-by-step search process in a B-tree (order 3)'}
          </p>
        </div>
      </div>

      {/* Search Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="number"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={locale === 'ko' ? '검색할 값 입력' : 'Enter value'}
          className="w-40 px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={!searchValue}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Search className="h-4 w-4 inline mr-1" />
          {locale === 'ko' ? '검색' : 'Search'}
        </button>
        {steps.length > 0 && !isComplete && (
          <button
            onClick={handleNextStep}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            <SkipForward className="h-4 w-4 inline mr-1" />
            {locale === 'ko' ? '다음 단계' : 'Next Step'}
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg border text-sm hover:bg-muted transition-colors"
        >
          <RotateCcw className="h-4 w-4 inline mr-1" />
          {locale === 'ko' ? '초기화' : 'Reset'}
        </button>
      </div>

      {/* Available values hint */}
      <div className="text-xs text-muted-foreground">
        {locale === 'ko' ? '트리에 있는 값: ' : 'Values in tree: '}
        <span className="font-mono">{allValues.join(', ')}</span>
      </div>

      {/* B-tree Visualization */}
      <div className="space-y-3 py-4">
        {LEVELS.map((level, li) => (
          <div key={li} className="flex justify-center gap-2 sm:gap-3">
            {level.map((nodeId) => {
              const node = NODES[nodeId];
              return (
                <div
                  key={nodeId}
                  className={`px-3 py-2 rounded-lg border shadow-sm text-center transition-all duration-300 ${getNodeStyle(nodeId)}`}
                >
                  <div className="text-[10px] text-muted-foreground mb-1 font-medium">
                    {li === 0
                      ? 'Root'
                      : node.children.length > 0
                        ? 'Internal'
                        : 'Leaf'}
                  </div>
                  <div className="flex gap-1 justify-center">
                    {node.keys.map((key, ki) => (
                      <span
                        key={ki}
                        className="inline-block px-2.5 py-1 rounded bg-muted font-mono text-sm font-bold"
                      >
                        {key}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Search Log */}
      {steps.length > 0 && (
        <div className="border rounded-lg p-4 bg-card space-y-2">
          <h3 className="text-sm font-bold mb-2">
            {locale === 'ko' ? '탐색 로그' : 'Search Log'}
          </h3>
          {steps.slice(0, currentStep + 1).map((step, i) => (
            <div
              key={i}
              className={`text-sm flex items-start gap-2 ${
                step.result === 'found'
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : step.result === 'not_found'
                    ? 'text-red-600 dark:text-red-400 font-bold'
                    : 'text-foreground'
              }`}
            >
              <span className="shrink-0 w-5 text-right text-muted-foreground">
                {i + 1}.
              </span>
              <span>{step.desc[locale]}</span>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {isComplete && (
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="px-3 py-2 rounded-lg bg-muted">
            <span className="text-muted-foreground">
              {locale === 'ko' ? '비교 횟수: ' : 'Comparisons: '}
            </span>
            <span className="font-bold">{steps.length}</span>
          </div>
          <div className="px-3 py-2 rounded-lg bg-muted">
            <span className="text-muted-foreground">
              {locale === 'ko' ? '방문 노드: ' : 'Nodes visited: '}
            </span>
            <span className="font-bold">
              {new Set(steps.map((s) => s.nodeId)).size}
            </span>
          </div>
          <div
            className={`px-3 py-2 rounded-lg font-bold ${
              steps[steps.length - 1].result === 'found'
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            }`}
          >
            {steps[steps.length - 1].result === 'found'
              ? locale === 'ko'
                ? '✓ 검색 성공'
                : '✓ Found'
              : locale === 'ko'
                ? '✗ 검색 실패'
                : '✗ Not Found'}
          </div>
        </div>
      )}

      {/* Tip */}
      <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
        <strong>TIP:</strong>{' '}
        {locale === 'ko'
          ? 'B-tree는 데이터베이스 인덱스의 기본 자료구조입니다. N개의 데이터에서 O(log N) 비교로 검색합니다. 위 트리는 18개 값을 최대 3번의 노드 방문으로 찾습니다.'
          : 'B-tree is the fundamental data structure for database indexes. It searches N items in O(log N) comparisons. This tree finds any of 18 values in at most 3 node visits.'}
      </div>
    </div>
  );
}
