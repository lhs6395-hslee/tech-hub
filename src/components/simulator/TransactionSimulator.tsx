'use client';

import { useState } from 'react';
import { Lock, RotateCcw, Play } from 'lucide-react';

interface Props {
  locale: 'ko' | 'en';
}

type IsolationLevel =
  | 'read_uncommitted'
  | 'read_committed'
  | 'repeatable_read'
  | 'serializable';

interface Step {
  txA: { action: string; result?: string };
  txB: { action: string; result?: string };
  highlight?: 'dirty_read' | 'non_repeatable_read' | 'phantom_read' | 'safe';
  explanation: { ko: string; en: string };
}

interface Scenario {
  phenomenon: { ko: string; en: string };
  steps: Step[];
}

const SCENARIOS: Record<IsolationLevel, Scenario> = {
  read_uncommitted: {
    phenomenon: { ko: 'Dirty Read 발생', en: 'Dirty Read occurs' },
    steps: [
      {
        txA: { action: 'BEGIN;' },
        txB: { action: '-- waiting --' },
        explanation: {
          ko: 'Transaction A가 시작됩니다.',
          en: 'Transaction A begins.',
        },
      },
      {
        txA: {
          action:
            "UPDATE accounts SET balance = 500\nWHERE id = 1; -- was 1000",
        },
        txB: { action: '-- waiting --' },
        explanation: {
          ko: 'A가 balance를 1000 → 500으로 변경합니다 (아직 COMMIT 안 함).',
          en: 'A changes balance from 1000 → 500 (not yet committed).',
        },
      },
      {
        txA: { action: '-- working --' },
        txB: { action: 'BEGIN;' },
        explanation: {
          ko: 'Transaction B가 시작됩니다.',
          en: 'Transaction B begins.',
        },
      },
      {
        txA: { action: '-- working --' },
        txB: {
          action: 'SELECT balance FROM accounts\nWHERE id = 1;',
          result: 'balance = 500',
        },
        highlight: 'dirty_read',
        explanation: {
          ko: '⚠️ Dirty Read! B가 A의 커밋되지 않은 데이터(500)를 읽습니다.',
          en: "⚠️ Dirty Read! B reads A's uncommitted data (500).",
        },
      },
      {
        txA: { action: 'ROLLBACK;\n-- balance 다시 1000으로 복원' },
        txB: { action: '-- B는 이미 500을 읽었음 --' },
        explanation: {
          ko: 'A가 ROLLBACK합니다. B가 읽은 500은 실제로 존재하지 않는 값이었습니다!',
          en: 'A rolls back. The 500 that B read never actually existed!',
        },
      },
    ],
  },
  read_committed: {
    phenomenon: {
      ko: 'Non-Repeatable Read 발생',
      en: 'Non-Repeatable Read occurs',
    },
    steps: [
      {
        txA: { action: 'BEGIN;' },
        txB: { action: 'BEGIN;' },
        explanation: {
          ko: '두 트랜잭션이 동시에 시작됩니다.',
          en: 'Both transactions start.',
        },
      },
      {
        txA: { action: '-- working --' },
        txB: {
          action: 'SELECT balance FROM accounts\nWHERE id = 1;',
          result: 'balance = 1000',
        },
        explanation: {
          ko: 'B가 balance를 읽습니다: 1000',
          en: 'B reads balance: 1000',
        },
      },
      {
        txA: {
          action: "UPDATE accounts SET balance = 500\nWHERE id = 1;",
        },
        txB: { action: '-- working --' },
        explanation: {
          ko: 'A가 balance를 1000 → 500으로 변경합니다.',
          en: 'A changes balance from 1000 → 500.',
        },
      },
      {
        txA: { action: 'COMMIT;' },
        txB: { action: '-- working --' },
        explanation: { ko: 'A가 COMMIT합니다.', en: 'A commits.' },
      },
      {
        txA: { action: '-- done --' },
        txB: {
          action: 'SELECT balance FROM accounts\nWHERE id = 1;',
          result: 'balance = 500',
        },
        highlight: 'non_repeatable_read',
        explanation: {
          ko: '⚠️ Non-Repeatable Read! 같은 쿼리인데 결과가 1000 → 500으로 바뀌었습니다.',
          en: '⚠️ Non-Repeatable Read! Same query returns different results: 1000 → 500.',
        },
      },
    ],
  },
  repeatable_read: {
    phenomenon: {
      ko: 'Phantom Read 발생 가능',
      en: 'Phantom Read may occur',
    },
    steps: [
      {
        txA: { action: 'BEGIN;' },
        txB: { action: 'BEGIN;' },
        explanation: {
          ko: '두 트랜잭션이 동시에 시작됩니다.',
          en: 'Both transactions start.',
        },
      },
      {
        txA: { action: '-- working --' },
        txB: {
          action: 'SELECT COUNT(*) FROM accounts\nWHERE balance > 500;',
          result: 'count = 3',
        },
        explanation: {
          ko: 'B가 balance > 500인 행 수를 조회합니다: 3개',
          en: 'B counts rows where balance > 500: 3',
        },
      },
      {
        txA: {
          action:
            "INSERT INTO accounts (id, balance)\nVALUES (99, 800);",
        },
        txB: { action: '-- working --' },
        explanation: {
          ko: 'A가 balance=800인 새 행을 추가합니다.',
          en: 'A inserts a new row with balance=800.',
        },
      },
      {
        txA: { action: 'COMMIT;' },
        txB: { action: '-- working --' },
        explanation: { ko: 'A가 COMMIT합니다.', en: 'A commits.' },
      },
      {
        txA: { action: '-- done --' },
        txB: {
          action: 'SELECT COUNT(*) FROM accounts\nWHERE balance > 500;',
          result: 'count = 4 (or 3)',
        },
        highlight: 'phantom_read',
        explanation: {
          ko: '⚠️ Phantom Read! 같은 조건인데 새로운 행(phantom)이 나타날 수 있습니다. (PG/InnoDB REPEATABLE READ는 이를 방지)',
          en: '⚠️ Phantom Read! A new row (phantom) may appear. (PG/InnoDB REPEATABLE READ prevents this)',
        },
      },
    ],
  },
  serializable: {
    phenomenon: {
      ko: '모든 이상 현상 방지',
      en: 'All anomalies prevented',
    },
    steps: [
      {
        txA: { action: 'BEGIN ISOLATION LEVEL\nSERIALIZABLE;' },
        txB: { action: 'BEGIN ISOLATION LEVEL\nSERIALIZABLE;' },
        explanation: {
          ko: '두 트랜잭션이 SERIALIZABLE 수준으로 시작됩니다.',
          en: 'Both transactions start at SERIALIZABLE level.',
        },
      },
      {
        txA: { action: '-- working --' },
        txB: {
          action: 'SELECT balance FROM accounts\nWHERE id = 1;',
          result: 'balance = 1000',
        },
        explanation: {
          ko: 'B가 balance를 읽습니다: 1000',
          en: 'B reads balance: 1000',
        },
      },
      {
        txA: {
          action: "UPDATE accounts SET balance = 500\nWHERE id = 1;",
        },
        txB: { action: '-- working --' },
        explanation: {
          ko: 'A가 balance를 변경합니다.',
          en: 'A changes balance.',
        },
      },
      {
        txA: { action: 'COMMIT;' },
        txB: { action: '-- working --' },
        explanation: { ko: 'A가 COMMIT합니다.', en: 'A commits.' },
      },
      {
        txA: { action: '-- done --' },
        txB: {
          action: 'SELECT balance FROM accounts\nWHERE id = 1;',
          result: 'balance = 1000 (snapshot)',
        },
        highlight: 'safe',
        explanation: {
          ko: '✓ 보호됨! B의 스냅샷은 트랜잭션 시작 시점으로 고정. 충돌하는 쓰기 시 직렬화 오류 발생.',
          en: "✓ Protected! B's snapshot is fixed at transaction start. Conflicting writes cause serialization errors.",
        },
      },
    ],
  },
};

const ISOLATION_LEVELS: IsolationLevel[] = [
  'read_uncommitted',
  'read_committed',
  'repeatable_read',
  'serializable',
];

const LEVEL_LABELS: Record<IsolationLevel, string> = {
  read_uncommitted: 'READ UNCOMMITTED',
  read_committed: 'READ COMMITTED',
  repeatable_read: 'REPEATABLE READ',
  serializable: 'SERIALIZABLE',
};

const PHENOMENA_TABLE = [
  {
    name: { ko: 'Dirty Read', en: 'Dirty Read' },
    levels: [true, false, false, false],
  },
  {
    name: { ko: 'Non-Repeatable Read', en: 'Non-Repeatable Read' },
    levels: [true, true, false, false],
  },
  {
    name: { ko: 'Phantom Read', en: 'Phantom Read' },
    levels: [true, true, true, false],
  },
];

export default function TransactionSimulator({ locale }: Props) {
  const [level, setLevel] = useState<IsolationLevel>('read_uncommitted');
  const [currentStep, setCurrentStep] = useState(-1);

  const scenario = SCENARIOS[level];
  const maxStep = scenario.steps.length - 1;

  function handleNext() {
    if (currentStep < maxStep) setCurrentStep((prev) => prev + 1);
  }

  function handleReset() {
    setCurrentStep(-1);
  }

  function handleChangeLevel(newLevel: IsolationLevel) {
    setLevel(newLevel);
    setCurrentStep(-1);
  }

  const HIGHLIGHT_STYLES: Record<string, string> = {
    dirty_read:
      'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/30',
    non_repeatable_read:
      'border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/30',
    phantom_read:
      'border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/30',
    safe: 'border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-border bg-muted/10 p-6 space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500">
          <Lock className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold">
            {locale === 'ko'
              ? '트랜잭션 격리 수준 시뮬레이터'
              : 'Transaction Isolation Simulator'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {locale === 'ko'
              ? '격리 수준별로 동시 트랜잭션의 동작 차이를 단계별로 확인합니다'
              : 'Step through concurrent transactions at different isolation levels'}
          </p>
        </div>
      </div>

      {/* Level Selector */}
      <div className="flex flex-wrap gap-2">
        {ISOLATION_LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => handleChangeLevel(l)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              level === l
                ? 'bg-violet-600 text-white'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            {LEVEL_LABELS[l]}
          </button>
        ))}
      </div>

      {/* Phenomenon badge */}
      <div className="text-sm">
        <span className="text-muted-foreground">
          {locale === 'ko' ? '시나리오: ' : 'Scenario: '}
        </span>
        <span className="font-bold">{scenario.phenomenon[locale]}</span>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={handleNext}
          disabled={currentStep >= maxStep}
          className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-50 transition-colors"
        >
          <Play className="h-4 w-4 inline mr-1" />
          {currentStep === -1
            ? locale === 'ko'
              ? '시작'
              : 'Start'
            : locale === 'ko'
              ? '다음 단계'
              : 'Next Step'}
          {currentStep >= 0 && ` (${currentStep + 1}/${scenario.steps.length})`}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg border text-sm hover:bg-muted transition-colors"
        >
          <RotateCcw className="h-4 w-4 inline mr-1" />
          {locale === 'ko' ? '초기화' : 'Reset'}
        </button>
      </div>

      {/* Transaction Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Transaction A */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-blue-600 text-white px-3 py-2 text-sm font-bold">
            Transaction A
          </div>
          <div className="divide-y divide-border/40">
            {currentStep >= 0 ? (
              scenario.steps.slice(0, currentStep + 1).map((step, i) => (
                <div
                  key={i}
                  className={`px-3 py-2 text-xs ${
                    i === currentStep && step.highlight
                      ? HIGHLIGHT_STYLES[step.highlight]
                      : ''
                  }`}
                >
                  <pre className="font-mono text-[11px] whitespace-pre-wrap">
                    {step.txA.action}
                  </pre>
                  {step.txA.result && (
                    <div className="mt-1 font-bold text-emerald-600 dark:text-emerald-400">
                      → {step.txA.result}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-6 text-xs text-muted-foreground text-center">
                {locale === 'ko' ? '시작을 눌러주세요' : 'Press Start'}
              </div>
            )}
          </div>
        </div>

        {/* Transaction B */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-orange-600 text-white px-3 py-2 text-sm font-bold">
            Transaction B
          </div>
          <div className="divide-y divide-border/40">
            {currentStep >= 0 ? (
              scenario.steps.slice(0, currentStep + 1).map((step, i) => (
                <div
                  key={i}
                  className={`px-3 py-2 text-xs ${
                    i === currentStep && step.highlight
                      ? HIGHLIGHT_STYLES[step.highlight]
                      : ''
                  }`}
                >
                  <pre className="font-mono text-[11px] whitespace-pre-wrap">
                    {step.txB.action}
                  </pre>
                  {step.txB.result && (
                    <div className="mt-1 font-bold text-emerald-600 dark:text-emerald-400">
                      → {step.txB.result}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-6 text-xs text-muted-foreground text-center">
                {locale === 'ko' ? '시작을 눌러주세요' : 'Press Start'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Explanation */}
      {currentStep >= 0 && (
        <div
          className={`rounded-lg p-3 text-sm ${
            scenario.steps[currentStep].highlight
              ? HIGHLIGHT_STYLES[scenario.steps[currentStep].highlight!]
              : 'bg-muted/50 border'
          }`}
        >
          {scenario.steps[currentStep].explanation[locale]}
        </div>
      )}

      {/* Comparison Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted/50 px-3 py-2 text-xs font-bold">
          {locale === 'ko'
            ? '격리 수준별 이상 현상 비교'
            : 'Anomalies by Isolation Level'}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-3 py-2 text-left">
                  {locale === 'ko' ? '현상' : 'Phenomenon'}
                </th>
                <th className="px-3 py-2 text-center text-[10px]">RU</th>
                <th className="px-3 py-2 text-center text-[10px]">RC</th>
                <th className="px-3 py-2 text-center text-[10px]">RR</th>
                <th className="px-3 py-2 text-center text-[10px]">S</th>
              </tr>
            </thead>
            <tbody>
              {PHENOMENA_TABLE.map((p, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="px-3 py-2 font-medium">{p.name[locale]}</td>
                  {p.levels.map((occurs, li) => (
                    <td
                      key={li}
                      className={`px-3 py-2 text-center ${
                        occurs
                          ? 'text-red-500'
                          : 'text-emerald-500'
                      }`}
                    >
                      {occurs ? '⚠️' : '✓'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-3 py-1.5 text-[10px] text-muted-foreground bg-muted/30">
          * PostgreSQL/InnoDB REPEATABLE READ{' '}
          {locale === 'ko'
            ? '는 Phantom Read도 방지'
            : 'also prevents Phantom Reads'}
        </div>
      </div>

      {/* Tip */}
      <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
        <strong>TIP:</strong>{' '}
        {locale === 'ko'
          ? '격리 수준이 높을수록 데이터 일관성은 보장되지만 동시성(성능)이 낮아집니다. PostgreSQL 기본값은 READ COMMITTED, MySQL InnoDB 기본값은 REPEATABLE READ입니다.'
          : "Higher isolation levels guarantee more consistency but reduce concurrency. PostgreSQL defaults to READ COMMITTED, MySQL InnoDB defaults to REPEATABLE READ."}
      </div>
    </div>
  );
}
