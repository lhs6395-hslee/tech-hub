'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Trash2,
  Plus,
  Pencil,
  X,
  Sparkles,
  RotateCcw,
  Zap,
  BarChart3,
  Lock,
  Settings,
} from 'lucide-react';

interface Props {
  locale: 'ko' | 'en';
}

interface TupleRow {
  id: number;
  name: string;
  value: number;
  status: 'live' | 'dead';
  version: number;
  xmin: number;
}

const INITIAL_ROWS: TupleRow[] = [
  { id: 1, name: 'Alice', value: 1000, status: 'live', version: 1, xmin: 100 },
  { id: 2, name: 'Bob', value: 2000, status: 'live', version: 1, xmin: 101 },
  { id: 3, name: 'Carol', value: 1500, status: 'live', version: 1, xmin: 102 },
  { id: 4, name: 'Dave', value: 3000, status: 'live', version: 1, xmin: 103 },
  { id: 5, name: 'Eve', value: 2500, status: 'live', version: 1, xmin: 104 },
];

const RANDOM_NAMES = [
  'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy',
  'Karl', 'Liam', 'Mia', 'Noah', 'Olivia',
];

export default function VacuumSimulator({ locale }: Props) {
  const [rows, setRows] = useState<TupleRow[]>(INITIAL_ROWS);
  const [log, setLog] = useState<string[]>([]);
  const [tablePages, setTablePages] = useState(2);
  const [statsAge, setStatsAge] = useState(0);
  const [lastAnalyzeAt, setLastAnalyzeAt] = useState(0);
  const [autovacuumEnabled, setAutovacuumEnabled] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [operationCount, setOperationCount] = useState(0);
  const nextIdRef = useRef(6);
  const nextTxIdRef = useRef(106);

  // Autovacuum settings
  const AUTOVACUUM_THRESHOLD = 3;
  const AUTOVACUUM_SCALE_FACTOR = 0.2;

  const liveTuples = rows.filter((r) => r.status === 'live').length;
  const deadTuples = rows.filter((r) => r.status === 'dead').length;
  const totalTuples = rows.length;
  const bloatPct =
    totalTuples > 0 ? Math.round((deadTuples / totalTuples) * 100) : 0;

  // Autovacuum threshold
  const autovacuumTrigger = Math.floor(
    AUTOVACUUM_THRESHOLD + AUTOVACUUM_SCALE_FACTOR * liveTuples
  );

  // Check autovacuum trigger
  useEffect(() => {
    if (autovacuumEnabled && deadTuples >= autovacuumTrigger && deadTuples > 0) {
      const timer = setTimeout(() => {
        handleAutovacuum();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [deadTuples, autovacuumEnabled, autovacuumTrigger]);

  function addLog(msg: string) {
    setLog((prev) => [...prev, msg]);
  }

  function handleInsert() {
    if (isLocked) return;
    const name = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    const value = Math.floor(Math.random() * 5000) + 500;
    const txId = nextTxIdRef.current++;
    const id = nextIdRef.current++;
    setRows((prev) => [
      ...prev,
      { id, name, value, status: 'live', version: 1, xmin: txId },
    ]);
    setTablePages((prev) => prev + (totalTuples % 4 === 3 ? 1 : 0));
    setStatsAge((prev) => prev + 1);
    setOperationCount((prev) => prev + 1);
    addLog(`INSERT: (${id}, '${name}', ${value}) [tx:${txId}]`);
  }

  function handleUpdate() {
    if (isLocked) return;
    const liveRows = rows.filter((r) => r.status === 'live');
    if (liveRows.length === 0) return;
    const target = liveRows[Math.floor(Math.random() * liveRows.length)];
    const txId = nextTxIdRef.current++;
    const newValue = Math.floor(Math.random() * 5000) + 500;

    setRows((prev) => [
      ...prev.map((r) =>
        r.id === target.id &&
        r.version === target.version &&
        r.status === 'live'
          ? { ...r, status: 'dead' as const }
          : r
      ),
      {
        ...target,
        value: newValue,
        status: 'live' as const,
        version: target.version + 1,
        xmin: txId,
      },
    ]);
    setTablePages((prev) => prev + (totalTuples % 4 === 3 ? 1 : 0));
    setStatsAge((prev) => prev + 1);
    setOperationCount((prev) => prev + 1);
    addLog(
      locale === 'ko'
        ? `UPDATE: id=${target.id} value: ${target.value} → ${newValue} [tx:${txId}] (이전 버전 → dead tuple)`
        : `UPDATE: id=${target.id} value: ${target.value} → ${newValue} [tx:${txId}] (old version → dead tuple)`
    );
  }

  function handleDelete() {
    if (isLocked) return;
    const liveRows = rows.filter((r) => r.status === 'live');
    if (liveRows.length === 0) return;
    const target = liveRows[Math.floor(Math.random() * liveRows.length)];

    setRows((prev) =>
      prev.map((r) =>
        r.id === target.id &&
        r.version === target.version &&
        r.status === 'live'
          ? { ...r, status: 'dead' as const }
          : r
      )
    );
    setStatsAge((prev) => prev + 1);
    setOperationCount((prev) => prev + 1);
    addLog(
      locale === 'ko'
        ? `DELETE: id=${target.id} '${target.name}' → dead tuple로 표시`
        : `DELETE: id=${target.id} '${target.name}' → marked as dead tuple`
    );
  }

  function handleVacuum() {
    const deadCount = rows.filter((r) => r.status === 'dead').length;
    if (deadCount === 0) {
      addLog(
        locale === 'ko'
          ? 'VACUUM: 정리할 dead tuple이 없습니다.'
          : 'VACUUM: No dead tuples to clean.'
      );
      return;
    }
    setRows((prev) => prev.filter((r) => r.status === 'live'));
    addLog(
      locale === 'ko'
        ? `VACUUM: ${deadCount}개 dead tuple 제거. 공간은 재사용 가능하지만 OS에 반환되지 않음. (테이블 크기 유지: ${tablePages} pages)`
        : `VACUUM: Removed ${deadCount} dead tuples. Space reusable but NOT returned to OS. (Table size unchanged: ${tablePages} pages)`
    );
  }

  function handleVacuumFull() {
    const deadCount = rows.filter((r) => r.status === 'dead').length;
    if (deadCount === 0) {
      addLog(
        locale === 'ko'
          ? 'VACUUM FULL: 정리할 dead tuple이 없습니다.'
          : 'VACUUM FULL: No dead tuples to clean.'
      );
      return;
    }

    setIsLocked(true);
    addLog(
      locale === 'ko'
        ? '🔒 VACUUM FULL: AccessExclusiveLock 획득 — 테이블 재작성 중... (읽기/쓰기 모두 차단)'
        : '🔒 VACUUM FULL: AccessExclusiveLock acquired — rewriting table... (all reads/writes blocked)'
    );

    setTimeout(() => {
      const liveRows = rows.filter((r) => r.status === 'live');
      setRows(liveRows);
      const newPages = Math.max(1, Math.ceil(liveRows.length / 4));
      const oldPages = tablePages;
      setTablePages(newPages);
      setIsLocked(false);
      addLog(
        locale === 'ko'
          ? `VACUUM FULL: ${deadCount}개 dead tuple 제거 + 테이블 재작성 완료. 디스크 공간 반환됨 (${oldPages} → ${newPages} pages). 🔓 Lock 해제.`
          : `VACUUM FULL: Removed ${deadCount} dead tuples + table rewritten. Disk space reclaimed (${oldPages} → ${newPages} pages). 🔓 Lock released.`
      );
    }, 2000);
  }

  function handleVacuumAnalyze() {
    const deadCount = rows.filter((r) => r.status === 'dead').length;
    setRows((prev) => prev.filter((r) => r.status === 'live'));
    const oldAge = statsAge;
    setStatsAge(0);
    setLastAnalyzeAt(operationCount);

    if (deadCount > 0) {
      addLog(
        locale === 'ko'
          ? `VACUUM ANALYZE: ${deadCount}개 dead tuple 제거 + 통계 갱신 완료 (stale age: ${oldAge} → 0). 쿼리 플래너가 최신 통계를 사용합니다.`
          : `VACUUM ANALYZE: Removed ${deadCount} dead tuples + statistics updated (stale age: ${oldAge} → 0). Query planner now uses fresh stats.`
      );
    } else {
      addLog(
        locale === 'ko'
          ? `VACUUM ANALYZE: dead tuple 없음. 통계만 갱신 (stale age: ${oldAge} → 0). 쿼리 플래너 최적화.`
          : `VACUUM ANALYZE: No dead tuples. Statistics updated only (stale age: ${oldAge} → 0). Query planner optimized.`
      );
    }
  }

  function handleAutovacuum() {
    const deadCount = rows.filter((r) => r.status === 'dead').length;
    if (deadCount === 0) return;
    setRows((prev) => prev.filter((r) => r.status === 'live'));
    addLog(
      locale === 'ko'
        ? `⚡ AUTOVACUUM: 임계값 도달 (dead: ${deadCount} ≥ threshold: ${autovacuumTrigger}). 자동으로 ${deadCount}개 dead tuple 제거.`
        : `⚡ AUTOVACUUM: Threshold reached (dead: ${deadCount} ≥ threshold: ${autovacuumTrigger}). Auto-removed ${deadCount} dead tuples.`
    );
  }

  function handleReset() {
    setRows([...INITIAL_ROWS]);
    nextIdRef.current = 6;
    nextTxIdRef.current = 106;
    setLog([]);
    setTablePages(2);
    setStatsAge(0);
    setLastAnalyzeAt(0);
    setAutovacuumEnabled(false);
    setIsLocked(false);
    setOperationCount(0);
  }

  return (
    <div className="rounded-xl border-2 border-dashed border-border bg-muted/10 p-6 space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
          <Trash2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold">
            {locale === 'ko'
              ? 'VACUUM 프로세스 시뮬레이터'
              : 'VACUUM Process Simulator'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {locale === 'ko'
              ? 'PostgreSQL MVCC에서 dead tuple이 생기고 다양한 VACUUM 모드로 정리되는 과정'
              : 'How dead tuples accumulate in PostgreSQL MVCC and get cleaned by different VACUUM modes'}
          </p>
        </div>
      </div>

      {/* Lock Overlay */}
      {isLocked && (
        <div className="rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-950/30 p-3 flex items-center gap-2 text-sm text-red-700 dark:text-red-400 font-bold animate-pulse">
          <Lock className="h-4 w-4" />
          {locale === 'ko'
            ? 'AccessExclusiveLock — VACUUM FULL 실행 중 (읽기/쓰기 차단)'
            : 'AccessExclusiveLock — VACUUM FULL in progress (reads/writes blocked)'}
        </div>
      )}

      {/* DML Buttons */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {locale === 'ko' ? 'DML 작업' : 'DML Operations'}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleInsert}
            disabled={isLocked}
            className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            <Plus className="h-4 w-4 inline mr-1" /> INSERT
          </button>
          <button
            onClick={handleUpdate}
            disabled={isLocked}
            className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Pencil className="h-4 w-4 inline mr-1" /> UPDATE
          </button>
          <button
            onClick={handleDelete}
            disabled={isLocked}
            className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <X className="h-4 w-4 inline mr-1" /> DELETE
          </button>
        </div>
      </div>

      {/* VACUUM Mode Buttons */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {locale === 'ko' ? 'VACUUM 모드' : 'VACUUM Modes'}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* VACUUM */}
          <button
            onClick={handleVacuum}
            disabled={isLocked}
            className="flex items-start gap-3 px-3 py-3 rounded-lg border-2 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-950/40 disabled:opacity-50 transition-colors text-left"
          >
            <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold">VACUUM</div>
              <div className="text-[10px] text-muted-foreground">
                {locale === 'ko'
                  ? 'Dead tuple 제거. 공간 재사용 가능. 테이블 크기 유지.'
                  : 'Remove dead tuples. Space reusable. Table size unchanged.'}
              </div>
            </div>
          </button>

          {/* VACUUM FULL */}
          <button
            onClick={handleVacuumFull}
            disabled={isLocked}
            className="flex items-start gap-3 px-3 py-3 rounded-lg border-2 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 disabled:opacity-50 transition-colors text-left"
          >
            <Lock className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold">VACUUM FULL</div>
              <div className="text-[10px] text-muted-foreground">
                {locale === 'ko'
                  ? '테이블 재작성. 디스크 반환. ⚠️ Exclusive Lock!'
                  : 'Rewrite table. Reclaim disk. ⚠️ Exclusive Lock!'}
              </div>
            </div>
          </button>

          {/* VACUUM ANALYZE */}
          <button
            onClick={handleVacuumAnalyze}
            disabled={isLocked}
            className="flex items-start gap-3 px-3 py-3 rounded-lg border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/40 disabled:opacity-50 transition-colors text-left"
          >
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold">VACUUM ANALYZE</div>
              <div className="text-[10px] text-muted-foreground">
                {locale === 'ko'
                  ? 'Dead tuple 제거 + 통계 갱신 (쿼리 플래너 최적화)'
                  : 'Remove dead tuples + update statistics (optimize planner)'}
              </div>
            </div>
          </button>

          {/* AUTOVACUUM Toggle */}
          <button
            onClick={() => setAutovacuumEnabled(!autovacuumEnabled)}
            className={`flex items-start gap-3 px-3 py-3 rounded-lg border-2 transition-colors text-left ${
              autovacuumEnabled
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                : 'border-border bg-muted/30 hover:bg-muted/50'
            }`}
          >
            <Zap
              className={`h-5 w-5 shrink-0 mt-0.5 ${
                autovacuumEnabled
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-muted-foreground'
              }`}
            />
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                AUTOVACUUM
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    autovacuumEnabled
                      ? 'bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {autovacuumEnabled ? 'ON' : 'OFF'}
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground">
                {locale === 'ko'
                  ? `임계값 도달 시 자동 실행 (threshold: ${autovacuumTrigger})`
                  : `Auto-run when threshold reached (threshold: ${autovacuumTrigger})`}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Reset */}
      <div>
        <button
          onClick={handleReset}
          className="px-3 py-2 rounded-lg border text-sm hover:bg-muted transition-colors"
        >
          <RotateCcw className="h-4 w-4 inline mr-1" />
          {locale === 'ko' ? '전체 초기화' : 'Reset All'}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
          <div className="text-[10px] text-muted-foreground">Live</div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {liveTuples}
          </div>
        </div>
        <div className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-center">
          <div className="text-[10px] text-muted-foreground">Dead</div>
          <div className="text-lg font-bold text-red-600 dark:text-red-400">
            {deadTuples}
          </div>
        </div>
        <div
          className={`px-3 py-2 rounded-lg text-center ${
            bloatPct > 50
              ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800'
              : bloatPct > 25
                ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800'
                : 'bg-muted'
          }`}
        >
          <div className="text-[10px] text-muted-foreground">Bloat</div>
          <div
            className={`text-lg font-bold ${
              bloatPct > 50
                ? 'text-red-600 dark:text-red-400'
                : bloatPct > 25
                  ? 'text-amber-600 dark:text-amber-400'
                  : ''
            }`}
          >
            {bloatPct}%
          </div>
        </div>
        <div className="px-3 py-2 rounded-lg bg-muted text-center">
          <div className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '테이블 크기' : 'Table Size'}
          </div>
          <div className="text-lg font-bold">{tablePages}p</div>
        </div>
        <div
          className={`px-3 py-2 rounded-lg text-center ${
            statsAge > 10
              ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800'
              : 'bg-muted'
          }`}
        >
          <div className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '통계 노후도' : 'Stats Age'}
          </div>
          <div
            className={`text-lg font-bold ${
              statsAge > 10
                ? 'text-amber-600 dark:text-amber-400'
                : ''
            }`}
          >
            {statsAge}
          </div>
        </div>
        {autovacuumEnabled && (
          <div
            className={`px-3 py-2 rounded-lg text-center ${
              deadTuples >= autovacuumTrigger
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 animate-pulse'
                : 'bg-muted'
            }`}
          >
            <div className="text-[10px] text-muted-foreground">
              {locale === 'ko' ? 'AV 임계값' : 'AV Threshold'}
            </div>
            <div className="text-lg font-bold">
              {deadTuples}/{autovacuumTrigger}
            </div>
          </div>
        )}
      </div>

      {/* Bloat Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Live ({liveTuples})</span>
          <span>Dead ({deadTuples})</span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden flex">
          <div
            className="bg-emerald-500 transition-all duration-300"
            style={{
              width: `${totalTuples > 0 ? (liveTuples / totalTuples) * 100 : 100}%`,
            }}
          />
          <div
            className="bg-red-400 transition-all duration-300"
            style={{
              width: `${totalTuples > 0 ? (deadTuples / totalTuples) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Table Visualization */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted/50 px-3 py-2 text-[10px] font-bold grid grid-cols-6 gap-2 uppercase tracking-wider">
          <span>Status</span>
          <span>ID</span>
          <span>Name</span>
          <span>Value</span>
          <span>Ver</span>
          <span>xmin</span>
        </div>
        <div className="max-h-64 overflow-y-auto divide-y divide-border/40">
          {rows.map((row, i) => (
            <div
              key={`${row.id}-v${row.version}-${row.status}-${i}`}
              className={`px-3 py-1.5 grid grid-cols-6 gap-2 text-xs transition-colors ${
                row.status === 'dead'
                  ? 'bg-red-50/50 dark:bg-red-950/20 text-muted-foreground line-through'
                  : 'bg-card'
              }`}
            >
              <span>
                {row.status === 'live' ? (
                  <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                    LIVE
                  </span>
                ) : (
                  <span className="inline-block px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-[10px] font-bold">
                    DEAD
                  </span>
                )}
              </span>
              <span className="font-mono">{row.id}</span>
              <span>{row.name}</span>
              <span className="font-mono">{row.value}</span>
              <span className="font-mono">v{row.version}</span>
              <span className="font-mono text-muted-foreground">
                {row.xmin}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* VACUUM Mode Comparison */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted/50 px-3 py-2 text-xs font-bold">
          {locale === 'ko' ? 'VACUUM 모드 비교' : 'VACUUM Mode Comparison'}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-3 py-2 text-left">
                  {locale === 'ko' ? '모드' : 'Mode'}
                </th>
                <th className="px-3 py-2 text-center">Dead Tuple</th>
                <th className="px-3 py-2 text-center">
                  {locale === 'ko' ? '디스크 반환' : 'Reclaim Disk'}
                </th>
                <th className="px-3 py-2 text-center">
                  {locale === 'ko' ? '통계 갱신' : 'Stats Update'}
                </th>
                <th className="px-3 py-2 text-center">Lock</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-3 py-1.5 font-bold">VACUUM</td>
                <td className="px-3 py-1.5 text-center text-emerald-500">✓</td>
                <td className="px-3 py-1.5 text-center text-red-500">✗</td>
                <td className="px-3 py-1.5 text-center text-red-500">✗</td>
                <td className="px-3 py-1.5 text-center text-emerald-500">ShareUpdateExclusive</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-1.5 font-bold">VACUUM FULL</td>
                <td className="px-3 py-1.5 text-center text-emerald-500">✓</td>
                <td className="px-3 py-1.5 text-center text-emerald-500">✓</td>
                <td className="px-3 py-1.5 text-center text-red-500">✗</td>
                <td className="px-3 py-1.5 text-center text-red-500">AccessExclusive ⚠️</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-1.5 font-bold">VACUUM ANALYZE</td>
                <td className="px-3 py-1.5 text-center text-emerald-500">✓</td>
                <td className="px-3 py-1.5 text-center text-red-500">✗</td>
                <td className="px-3 py-1.5 text-center text-emerald-500">✓</td>
                <td className="px-3 py-1.5 text-center text-emerald-500">ShareUpdateExclusive</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-bold">AUTOVACUUM</td>
                <td className="px-3 py-1.5 text-center text-emerald-500">✓</td>
                <td className="px-3 py-1.5 text-center text-red-500">✗</td>
                <td className="px-3 py-1.5 text-center text-emerald-500">✓</td>
                <td className="px-3 py-1.5 text-center text-emerald-500">
                  {locale === 'ko' ? '자동 (백그라운드)' : 'Auto (background)'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Operation Log */}
      {log.length > 0 && (
        <div className="border rounded-lg p-4 bg-card space-y-1 max-h-48 overflow-y-auto">
          <h3 className="text-sm font-bold mb-2">
            {locale === 'ko' ? '작업 로그' : 'Operation Log'}
          </h3>
          {log.map((msg, i) => (
            <div key={i} className="text-xs font-mono text-muted-foreground">
              <span className="text-foreground/50">[{i + 1}]</span> {msg}
            </div>
          ))}
        </div>
      )}

      {/* Tip */}
      <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 space-y-1">
        <div>
          <strong>TIP:</strong>{' '}
          {locale === 'ko'
            ? '실무에서는 AUTOVACUUM을 켜두고(기본값 ON), 필요시 VACUUM ANALYZE를 수동 실행합니다. VACUUM FULL은 대용량 테이블에서 장시간 Lock이 발생하므로 신중하게 사용해야 합니다.'
            : 'In production, keep AUTOVACUUM enabled (default ON) and manually run VACUUM ANALYZE when needed. VACUUM FULL causes prolonged locks on large tables, so use it carefully.'}
        </div>
        <div>
          <strong>
            {locale === 'ko' ? 'AUTOVACUUM 공식: ' : 'AUTOVACUUM formula: '}
          </strong>
          <code className="text-[10px] bg-muted/50 px-1 rounded">
            threshold + scale_factor * n_live_tup = {AUTOVACUUM_THRESHOLD} +{' '}
            {AUTOVACUUM_SCALE_FACTOR} * {liveTuples} = {autovacuumTrigger}
          </code>
        </div>
      </div>
    </div>
  );
}
