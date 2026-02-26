'use client';

import { useState } from 'react';
import { HardDrive, RotateCcw, SkipForward, FastForward } from 'lucide-react';

interface Props {
  locale: 'ko' | 'en';
}

interface BufferSlot {
  pageId: number | null;
  lastUsed: number;
}

interface AccessResult {
  pageId: number;
  hit: boolean;
  evicted: number | null;
}

const POOL_SIZE = 5;
const PAGE_SEQUENCE = [1, 2, 3, 4, 5, 2, 1, 6, 7, 2, 3, 8, 1, 4, 6];

function createEmptyPool(): BufferSlot[] {
  return Array.from({ length: POOL_SIZE }, () => ({
    pageId: null,
    lastUsed: 0,
  }));
}

export default function BufferPoolSimulator({ locale }: Props) {
  const [pool, setPool] = useState<BufferSlot[]>(createEmptyPool);
  const [accessIndex, setAccessIndex] = useState(0);
  const [clock, setClock] = useState(1);
  const [results, setResults] = useState<AccessResult[]>([]);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const hits = results.filter((r) => r.hit).length;
  const misses = results.filter((r) => !r.hit).length;
  const total = results.length;
  const hitRate = total > 0 ? Math.round((hits / total) * 100) : 0;
  const isComplete = accessIndex >= PAGE_SEQUENCE.length;

  function processNext() {
    if (isComplete) return;

    const pageId = PAGE_SEQUENCE[accessIndex];
    const newPool = pool.map((s) => ({ ...s }));
    const newClock = clock + 1;

    // Check for hit
    const hitIndex = newPool.findIndex((s) => s.pageId === pageId);

    if (hitIndex !== -1) {
      newPool[hitIndex].lastUsed = newClock;
      setPool(newPool);
      setClock(newClock);
      setAccessIndex((prev) => prev + 1);
      setResults((prev) => [...prev, { pageId, hit: true, evicted: null }]);
      setLastAction(
        locale === 'ko'
          ? `Page ${pageId} → HIT! (슬롯 ${hitIndex + 1}에서 발견)`
          : `Page ${pageId} → HIT! (found in slot ${hitIndex + 1})`
      );
      return;
    }

    // Cache MISS
    const emptyIndex = newPool.findIndex((s) => s.pageId === null);

    if (emptyIndex !== -1) {
      newPool[emptyIndex] = { pageId, lastUsed: newClock };
      setPool(newPool);
      setClock(newClock);
      setAccessIndex((prev) => prev + 1);
      setResults((prev) => [...prev, { pageId, hit: false, evicted: null }]);
      setLastAction(
        locale === 'ko'
          ? `Page ${pageId} → MISS (빈 슬롯 ${emptyIndex + 1}에 적재)`
          : `Page ${pageId} → MISS (loaded into empty slot ${emptyIndex + 1})`
      );
      return;
    }

    // LRU eviction
    let lruIndex = 0;
    let lruTime = Infinity;
    for (let i = 0; i < newPool.length; i++) {
      if (newPool[i].lastUsed < lruTime) {
        lruTime = newPool[i].lastUsed;
        lruIndex = i;
      }
    }

    const evictedPage = newPool[lruIndex].pageId!;
    newPool[lruIndex] = { pageId, lastUsed: newClock };
    setPool(newPool);
    setClock(newClock);
    setAccessIndex((prev) => prev + 1);
    setResults((prev) => [
      ...prev,
      { pageId, hit: false, evicted: evictedPage },
    ]);
    setLastAction(
      locale === 'ko'
        ? `Page ${pageId} → MISS (Page ${evictedPage}를 교체 — LRU)`
        : `Page ${pageId} → MISS (evicted Page ${evictedPage} — LRU)`
    );
  }

  function processAll() {
    let currentPool = pool.map((s) => ({ ...s }));
    let currentClock = clock;
    let currentIndex = accessIndex;
    const newResults: AccessResult[] = [...results];
    let action = '';

    while (currentIndex < PAGE_SEQUENCE.length) {
      const pageId = PAGE_SEQUENCE[currentIndex];
      currentClock++;

      const hitIdx = currentPool.findIndex((s) => s.pageId === pageId);

      if (hitIdx !== -1) {
        currentPool[hitIdx].lastUsed = currentClock;
        newResults.push({ pageId, hit: true, evicted: null });
      } else {
        const emptyIdx = currentPool.findIndex((s) => s.pageId === null);
        if (emptyIdx !== -1) {
          currentPool[emptyIdx] = { pageId, lastUsed: currentClock };
          newResults.push({ pageId, hit: false, evicted: null });
        } else {
          let lruIdx = 0;
          let lruTime = Infinity;
          for (let i = 0; i < currentPool.length; i++) {
            if (currentPool[i].lastUsed < lruTime) {
              lruTime = currentPool[i].lastUsed;
              lruIdx = i;
            }
          }
          const evicted = currentPool[lruIdx].pageId!;
          currentPool[lruIdx] = { pageId, lastUsed: currentClock };
          newResults.push({ pageId, hit: false, evicted });
        }
      }
      currentIndex++;
    }

    const finalHits = newResults.filter((r) => r.hit).length;
    const finalTotal = newResults.length;
    action =
      locale === 'ko'
        ? `전체 실행 완료: ${finalHits}/${finalTotal} HIT (${Math.round((finalHits / finalTotal) * 100)}%)`
        : `All processed: ${finalHits}/${finalTotal} HIT (${Math.round((finalHits / finalTotal) * 100)}%)`;

    setPool(currentPool);
    setClock(currentClock);
    setAccessIndex(PAGE_SEQUENCE.length);
    setResults(newResults);
    setLastAction(action);
  }

  function handleReset() {
    setPool(createEmptyPool());
    setAccessIndex(0);
    setClock(1);
    setResults([]);
    setLastAction(null);
  }

  return (
    <div className="rounded-xl border-2 border-dashed border-border bg-muted/10 p-6 space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
          <HardDrive className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold">
            {locale === 'ko'
              ? '버퍼 풀 시뮬레이터'
              : 'Buffer Pool Simulator'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {locale === 'ko'
              ? '디스크 페이지가 메모리 버퍼 풀에 캐싱되는 과정과 LRU 교체 전략'
              : 'How disk pages get cached in the memory buffer pool with LRU replacement'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={processNext}
          disabled={isComplete}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          <SkipForward className="h-4 w-4 inline mr-1" />
          {locale === 'ko' ? '다음 요청' : 'Next Request'}
          {!isComplete &&
            ` (${accessIndex + 1}/${PAGE_SEQUENCE.length})`}
        </button>
        <button
          onClick={processAll}
          disabled={isComplete}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <FastForward className="h-4 w-4 inline mr-1" />
          {locale === 'ko' ? '전체 실행' : 'Run All'}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg border text-sm hover:bg-muted transition-colors"
        >
          <RotateCcw className="h-4 w-4 inline mr-1" />
          {locale === 'ko' ? '초기화' : 'Reset'}
        </button>
      </div>

      {/* Page Request Queue */}
      <div>
        <div className="text-xs font-bold text-muted-foreground mb-2">
          {locale === 'ko' ? '페이지 요청 큐' : 'Page Request Queue'}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {PAGE_SEQUENCE.map((p, i) => (
            <span
              key={i}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                i < accessIndex
                  ? results[i]?.hit
                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-300 dark:ring-emerald-700'
                    : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 ring-1 ring-red-300 dark:ring-red-700'
                  : i === accessIndex
                    ? 'bg-blue-600 text-white ring-2 ring-blue-300 dark:ring-blue-700 scale-110'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              P{p}
            </span>
          ))}
        </div>
      </div>

      {/* Buffer Pool Visualization */}
      <div>
        <div className="text-xs font-bold text-muted-foreground mb-2">
          {locale === 'ko'
            ? `메모리 버퍼 풀 (${POOL_SIZE}슬롯)`
            : `Memory Buffer Pool (${POOL_SIZE} slots)`}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {pool.map((slot, i) => {
            const isJustAccessed =
              results.length > 0 &&
              results[results.length - 1].pageId === slot.pageId &&
              slot.pageId !== null;
            const wasHit =
              isJustAccessed && results[results.length - 1].hit;
            const wasLoaded = isJustAccessed && !results[results.length - 1].hit;

            return (
              <div
                key={i}
                className={`rounded-lg border-2 p-3 text-center transition-all duration-300 ${
                  slot.pageId === null
                    ? 'border-dashed border-border bg-muted/30'
                    : wasHit
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                      : wasLoaded
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                        : 'border-border bg-card'
                }`}
              >
                <div className="text-[10px] text-muted-foreground mb-1">
                  {locale === 'ko' ? `슬롯 ${i + 1}` : `Slot ${i + 1}`}
                </div>
                {slot.pageId !== null ? (
                  <>
                    <div className="text-lg font-bold font-mono">
                      P{slot.pageId}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      LRU: {slot.lastUsed}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground py-1">
                    {locale === 'ko' ? '비어있음' : 'Empty'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Last Action */}
      {lastAction && (
        <div
          className={`rounded-lg p-3 text-sm font-medium ${
            results.length > 0 && results[results.length - 1].hit
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
              : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
          }`}
        >
          {lastAction}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
          <div className="text-xs text-muted-foreground">HIT</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {hits}
          </div>
        </div>
        <div className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-center">
          <div className="text-xs text-muted-foreground">MISS</div>
          <div className="text-xl font-bold text-red-600 dark:text-red-400">
            {misses}
          </div>
        </div>
        <div className="px-3 py-2 rounded-lg bg-muted text-center">
          <div className="text-xs text-muted-foreground">TOTAL</div>
          <div className="text-xl font-bold">{total}</div>
        </div>
        <div
          className={`px-3 py-2 rounded-lg text-center ${
            hitRate >= 60
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800'
              : hitRate >= 30
                ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800'
                : 'bg-muted'
          }`}
        >
          <div className="text-xs text-muted-foreground">
            {locale === 'ko' ? '적중률' : 'Hit Rate'}
          </div>
          <div
            className={`text-xl font-bold ${
              hitRate >= 60
                ? 'text-emerald-600 dark:text-emerald-400'
                : hitRate >= 30
                  ? 'text-amber-600 dark:text-amber-400'
                  : ''
            }`}
          >
            {hitRate}%
          </div>
        </div>
      </div>

      {/* Access History */}
      {results.length > 0 && (
        <div className="border rounded-lg p-4 bg-card max-h-40 overflow-y-auto">
          <h3 className="text-sm font-bold mb-2">
            {locale === 'ko' ? '접근 기록' : 'Access History'}
          </h3>
          <div className="flex flex-wrap gap-1">
            {results.map((r, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${
                  r.hit
                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                    : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                }`}
              >
                P{r.pageId}: {r.hit ? 'HIT' : 'MISS'}
                {r.evicted !== null && ` (→P${r.evicted})`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tip */}
      <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
        <strong>TIP:</strong>{' '}
        {locale === 'ko'
          ? '버퍼 풀은 디스크 I/O를 줄이는 핵심 메커니즘입니다. InnoDB 기본 버퍼 풀은 128MB이며, 보통 전체 메모리의 70~80%를 할당합니다. 실무에서 적중률이 99% 이상이어야 건강한 상태입니다.'
          : "The buffer pool is the key mechanism for reducing disk I/O. InnoDB's default buffer pool is 128MB, typically allocated 70-80% of total memory. A healthy production system should have a hit rate above 99%."}
      </div>
    </div>
  );
}
