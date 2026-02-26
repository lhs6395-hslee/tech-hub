'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/stores/locale-store';
import { Search, Trash2, Lock, HardDrive, ArrowLeft } from 'lucide-react';
import BTreeSimulator from '@/components/simulator/BTreeSimulator';
import VacuumSimulator from '@/components/simulator/VacuumSimulator';
import TransactionSimulator from '@/components/simulator/TransactionSimulator';
import BufferPoolSimulator from '@/components/simulator/BufferPoolSimulator';

type SimulatorId = 'btree' | 'vacuum' | 'transaction' | 'buffer-pool';

const simulators = [
  {
    id: 'btree' as SimulatorId,
    icon: Search,
    gradient: 'from-blue-500 to-cyan-500',
    title: { ko: 'B-tree 인덱스 탐색', en: 'B-tree Index Search' },
    description: {
      ko: 'B-tree 인덱스에서 값을 검색하는 과정을 단계별로 시각화합니다.',
      en: 'Step-by-step visualization of searching a value in a B-tree index.',
    },
  },
  {
    id: 'vacuum' as SimulatorId,
    icon: Trash2,
    gradient: 'from-orange-500 to-red-500',
    title: { ko: 'VACUUM 프로세스', en: 'VACUUM Process' },
    description: {
      ko: 'Dead tuple이 생성되고 VACUUM으로 정리되는 과정을 체험합니다.',
      en: 'Experience how dead tuples accumulate and get cleaned up by VACUUM.',
    },
  },
  {
    id: 'transaction' as SimulatorId,
    icon: Lock,
    gradient: 'from-violet-500 to-purple-500',
    title: { ko: '트랜잭션 격리 수준', en: 'Transaction Isolation' },
    description: {
      ko: '동시 실행되는 트랜잭션에서 격리 수준별 동작 차이를 확인합니다.',
      en: 'See how different isolation levels affect concurrent transactions.',
    },
  },
  {
    id: 'buffer-pool' as SimulatorId,
    icon: HardDrive,
    gradient: 'from-emerald-500 to-teal-500',
    title: { ko: '버퍼 풀 (캐시)', en: 'Buffer Pool (Cache)' },
    description: {
      ko: '버퍼 풀의 캐시 히트/미스와 LRU 교체 전략을 시뮬레이션합니다.',
      en: 'Simulate buffer pool cache hits/misses and LRU replacement strategy.',
    },
  },
];

export default function SimulatorPage() {
  const locale = useLocaleStore((s) => s.locale);
  const [selected, setSelected] = useState<SimulatorId | null>(null);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">
          {locale === 'ko' ? 'DB 인터랙티브 시뮬레이터' : 'DB Interactive Simulators'}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {locale === 'ko'
            ? '데이터베이스 내부 동작을 직접 체험하며 학습하세요. 각 시뮬레이터를 통해 핵심 개념을 시각적으로 이해할 수 있습니다.'
            : 'Learn by experiencing database internals firsthand. Each simulator helps you visually understand core concepts.'}
        </p>
      </div>

      {/* Simulator Selector */}
      {!selected && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {simulators.map((sim) => (
            <button
              key={sim.id}
              onClick={() => setSelected(sim.id)}
              className="group text-left p-6 rounded-xl border-2 border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${sim.gradient} shadow-md shrink-0`}
                >
                  <sim.icon className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold group-hover:text-primary transition-colors">
                    {sim.title[locale]}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {sim.description[locale]}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Back button + Selected Simulator */}
      {selected && (
        <div className="space-y-4">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {locale === 'ko' ? '시뮬레이터 목록으로' : 'Back to simulators'}
          </button>

          {selected === 'btree' && <BTreeSimulator locale={locale} />}
          {selected === 'vacuum' && <VacuumSimulator locale={locale} />}
          {selected === 'transaction' && <TransactionSimulator locale={locale} />}
          {selected === 'buffer-pool' && <BufferPoolSimulator locale={locale} />}
        </div>
      )}
    </div>
  );
}
