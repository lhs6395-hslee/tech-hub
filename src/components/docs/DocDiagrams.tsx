'use client';

import { Fragment, useState } from 'react';

interface DiagramProps {
  locale: 'ko' | 'en';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// E-Commerce ERD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface TableDef {
  name: string;
  label: { ko: string; en: string };
  color: string;
  columns: { name: string; type: string; pk?: boolean; fk?: string }[];
}

const ERD_TABLES: TableDef[] = [
  {
    name: 'customers',
    label: { ko: '고객', en: 'Customers' },
    color: 'blue',
    columns: [
      { name: 'id', type: 'SERIAL', pk: true },
      { name: 'name', type: 'VARCHAR(100)' },
      { name: 'email', type: 'VARCHAR(150)' },
      { name: 'city', type: 'VARCHAR(50)' },
      { name: 'signup_date', type: 'DATE' },
      { name: 'is_premium', type: 'BOOLEAN' },
    ],
  },
  {
    name: 'customer_profiles',
    label: { ko: '고객 프로필', en: 'Customer Profiles' },
    color: 'teal',
    columns: [
      { name: 'id', type: 'SERIAL', pk: true },
      { name: 'customer_id', type: 'INTEGER UNIQUE', fk: 'customers' },
      { name: 'bio', type: 'TEXT' },
      { name: 'avatar_url', type: 'VARCHAR(300)' },
    ],
  },
  {
    name: 'orders',
    label: { ko: '주문', en: 'Orders' },
    color: 'violet',
    columns: [
      { name: 'id', type: 'SERIAL', pk: true },
      { name: 'customer_id', type: 'INTEGER', fk: 'customers' },
      { name: 'order_date', type: 'TIMESTAMP' },
      { name: 'status', type: 'VARCHAR(20)' },
      { name: 'total_amount', type: 'DECIMAL(12,2)' },
    ],
  },
  {
    name: 'order_items',
    label: { ko: '주문 상세', en: 'Order Items' },
    color: 'rose',
    columns: [
      { name: 'id', type: 'SERIAL', pk: true },
      { name: 'order_id', type: 'INTEGER', fk: 'orders' },
      { name: 'product_id', type: 'INTEGER', fk: 'products' },
      { name: 'quantity', type: 'INTEGER' },
      { name: 'unit_price', type: 'DECIMAL(10,2)' },
    ],
  },
  {
    name: 'categories',
    label: { ko: '카테고리', en: 'Categories' },
    color: 'amber',
    columns: [
      { name: 'id', type: 'SERIAL', pk: true },
      { name: 'name', type: 'VARCHAR(50)' },
      { name: 'parent_id', type: 'INTEGER', fk: 'categories (self)' },
    ],
  },
  {
    name: 'products',
    label: { ko: '상품', en: 'Products' },
    color: 'emerald',
    columns: [
      { name: 'id', type: 'SERIAL', pk: true },
      { name: 'name', type: 'VARCHAR(200)' },
      { name: 'category_id', type: 'INTEGER', fk: 'categories' },
      { name: 'price', type: 'DECIMAL(10,2)' },
      { name: 'stock_quantity', type: 'INTEGER' },
    ],
  },
  {
    name: 'reviews',
    label: { ko: '리뷰', en: 'Reviews' },
    color: 'orange',
    columns: [
      { name: 'id', type: 'SERIAL', pk: true },
      { name: 'product_id', type: 'INTEGER', fk: 'products' },
      { name: 'customer_id', type: 'INTEGER', fk: 'customers' },
      { name: 'rating', type: 'INTEGER CHECK(1~5)' },
      { name: 'comment', type: 'TEXT' },
    ],
  },
];

const TABLE_HEADER_COLORS: Record<string, string> = {
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  rose: 'bg-rose-500',
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  orange: 'bg-orange-500',
  teal: 'bg-teal-500',
};

const TABLE_RING_COLORS: Record<string, string> = {
  blue: 'ring-blue-200 dark:ring-blue-800/50',
  violet: 'ring-violet-200 dark:ring-violet-800/50',
  rose: 'ring-rose-200 dark:ring-rose-800/50',
  amber: 'ring-amber-200 dark:ring-amber-800/50',
  emerald: 'ring-emerald-200 dark:ring-emerald-800/50',
  orange: 'ring-orange-200 dark:ring-orange-800/50',
  teal: 'ring-teal-200 dark:ring-teal-800/50',
};

function ERDTableCard({ table, locale }: { table: TableDef; locale: 'ko' | 'en' }) {
  return (
    <div className={`rounded-lg border bg-card shadow-sm ring-1 ${TABLE_RING_COLORS[table.color]} overflow-hidden`}>
      <div className={`${TABLE_HEADER_COLORS[table.color]} px-3 py-2 flex items-center justify-between`}>
        <span className="text-white font-mono text-xs font-bold">{table.name}</span>
        <span className="text-white/70 text-[10px]">{table.label[locale]}</span>
      </div>
      <div className="divide-y divide-border/40">
        {table.columns.map((col) => (
          <div key={col.name} className="px-3 py-1.5 flex items-center gap-2 text-[11px]">
            <div className="flex items-center gap-1 w-5 shrink-0 justify-center">
              {col.pk && (
                <span className="text-amber-500 text-[10px]" title="Primary Key">PK</span>
              )}
              {col.fk && !col.pk && (
                <span className="text-blue-500 text-[10px]" title={`FK → ${col.fk}`}>FK</span>
              )}
            </div>
            <span className="font-mono font-medium text-foreground">{col.name}</span>
            <span className="text-muted-foreground ml-auto text-[10px] font-mono">{col.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const TYPE_COLORS: Record<string, string> = {
  '1:N': 'text-blue-600 dark:text-blue-400',
  'N:1': 'text-violet-600 dark:text-violet-400',
  'N:M': 'text-orange-600 dark:text-orange-400',
  '1:1': 'text-emerald-600 dark:text-emerald-400',
};

const TYPE_BG: Record<string, string> = {
  '1:N': 'bg-blue-500/10',
  'N:1': 'bg-violet-500/10',
  'N:M': 'bg-orange-500/10',
  '1:1': 'bg-emerald-500/10',
};

export function EcommerceERD({ locale }: DiagramProps) {
  const relationships: { from: string; to: string; type: string; label: { ko: string; en: string } }[] = [
    // 1:1 relationships
    { from: 'customers', to: 'customer_profiles', type: '1:1', label: { ko: '한 고객 ↔ 하나의 프로필', en: 'One customer ↔ one profile' } },
    // 1:N relationships (parent → children)
    { from: 'customers', to: 'orders', type: '1:N', label: { ko: '한 고객이 여러 주문', en: 'One customer has many orders' } },
    { from: 'categories', to: 'products', type: '1:N', label: { ko: '한 카테고리에 여러 상품', en: 'One category has many products' } },
    // N:1 relationships (child → parent)
    { from: 'order_items', to: 'orders', type: 'N:1', label: { ko: '여러 항목이 한 주문에 속함', en: 'Many items belong to one order' } },
    { from: 'order_items', to: 'products', type: 'N:1', label: { ko: '여러 항목이 한 상품을 참조', en: 'Many items reference one product' } },
    { from: 'reviews', to: 'customers', type: 'N:1', label: { ko: '여러 리뷰가 한 고객에 속함', en: 'Many reviews belong to one customer' } },
    { from: 'reviews', to: 'products', type: 'N:1', label: { ko: '여러 리뷰가 한 상품에 속함', en: 'Many reviews belong to one product' } },
    // N:M relationships (through junction table)
    { from: 'orders', to: 'products', type: 'N:M', label: { ko: '주문↔상품 (order_items 경유)', en: 'Orders↔Products (via order_items)' } },
    // Self-referencing
    { from: 'categories', to: 'categories', type: '1:N', label: { ko: '자기참조: 상위↔하위 카테고리', en: 'Self-ref: parent↔child category' } },
  ];

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 text-white text-sm">
          ER
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? 'E-Commerce 데이터베이스 스키마' : 'E-Commerce Database Schema'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '7개 테이블 · 1:1, 1:N, N:1, N:M 관계 포함' : '7 tables · includes 1:1, 1:N, N:1, N:M relationships'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {ERD_TABLES.map((t) => (
          <ERDTableCard key={t.name} table={t} locale={locale} />
        ))}
      </div>

      <div className="border-t pt-4">
        <p className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-wider">
          {locale === 'ko' ? '테이블 관계' : 'Table Relationships'}
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {relationships.map((r, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs">
              <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[10px] font-bold">{r.from}</code>
              <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded ${TYPE_COLORS[r.type]} ${TYPE_BG[r.type]}`}>
                {r.type}
              </span>
              <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[10px] font-bold">{r.to}</code>
              <span className="text-muted-foreground text-[10px] hidden sm:inline truncate">{r.label[locale]}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px]">
          <span className="text-muted-foreground font-semibold">{locale === 'ko' ? '범례:' : 'Legend:'}</span>
          <div className="flex items-center gap-1">
            <span className={`px-1.5 py-0.5 rounded font-bold font-mono ${TYPE_COLORS['1:1']} ${TYPE_BG['1:1']}`}>1:1</span>
            <span className="text-muted-foreground">{locale === 'ko' ? '하나↔하나' : 'One↔One'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`px-1.5 py-0.5 rounded font-bold font-mono ${TYPE_COLORS['1:N']} ${TYPE_BG['1:N']}`}>1:N</span>
            <span className="text-muted-foreground">{locale === 'ko' ? '하나→여러개' : 'One→Many'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`px-1.5 py-0.5 rounded font-bold font-mono ${TYPE_COLORS['N:1']} ${TYPE_BG['N:1']}`}>N:1</span>
            <span className="text-muted-foreground">{locale === 'ko' ? '여러개→하나' : 'Many→One'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`px-1.5 py-0.5 rounded font-bold font-mono ${TYPE_COLORS['N:M']} ${TYPE_BG['N:M']}`}>N:M</span>
            <span className="text-muted-foreground">{locale === 'ko' ? '다대다 (중간 테이블)' : 'Many↔Many (junction)'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// JOIN Types Diagram
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type JoinType = 'inner' | 'left' | 'right' | 'full';

function JoinVenn({ type, id }: { type: JoinType; id: string }) {
  const cx1 = 70, cx2 = 130, cy = 65, r = 48;

  const leftOpacity = type === 'left' || type === 'full' ? 0.35 : 0.06;
  const rightOpacity = type === 'right' || type === 'full' ? 0.35 : 0.06;
  const showIntersection = type === 'inner';

  return (
    <svg viewBox="0 0 200 130" className="w-full max-w-[180px] mx-auto">
      <defs>
        <clipPath id={`clip-${id}`}>
          <circle cx={cx1} cy={cy} r={r} />
        </clipPath>
      </defs>

      {/* Left circle */}
      <circle cx={cx1} cy={cy} r={r}
        fill={`rgba(59, 130, 246, ${leftOpacity})`}
        stroke="rgb(59, 130, 246)" strokeWidth="2.5" />

      {/* Right circle */}
      <circle cx={cx2} cy={cy} r={r}
        fill={`rgba(239, 68, 68, ${rightOpacity})`}
        stroke="rgb(239, 68, 68)" strokeWidth="2.5" />

      {/* INNER JOIN: highlight intersection only */}
      {showIntersection && (
        <circle cx={cx2} cy={cy} r={r}
          fill="rgba(139, 92, 246, 0.4)"
          clipPath={`url(#clip-${id})`} />
      )}

      {/* Labels */}
      <text x={cx1 - 20} y={cy + 5} fill="currentColor" fontSize="14" fontWeight="700" textAnchor="middle">A</text>
      <text x={cx2 + 20} y={cy + 5} fill="currentColor" fontSize="14" fontWeight="700" textAnchor="middle">B</text>
    </svg>
  );
}

export function JoinTypesDiagram({ locale }: DiagramProps) {
  const types: { type: JoinType; name: string; desc: { ko: string; en: string } }[] = [
    { type: 'inner', name: 'INNER JOIN', desc: { ko: '양쪽 모두 일치하는 행만 반환', en: 'Only matching rows from both tables' } },
    { type: 'left', name: 'LEFT JOIN', desc: { ko: '왼쪽(A) 전체 + 오른쪽 일치', en: 'All from A + matching from B' } },
    { type: 'right', name: 'RIGHT JOIN', desc: { ko: '왼쪽 일치 + 오른쪽(B) 전체', en: 'Matching from A + all from B' } },
    { type: 'full', name: 'FULL OUTER JOIN', desc: { ko: '양쪽 모두의 전체 행 (합집합)', en: 'All rows from both (union)' } },
  ];

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-red-500 text-white text-xs font-bold">
          JN
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? 'JOIN 타입 비교' : 'JOIN Types Comparison'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '색칠된 영역이 결과에 포함되는 행입니다' : 'Colored regions represent rows included in the result'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {types.map((t) => (
          <div key={t.type} className="text-center p-4 rounded-xl bg-background border shadow-sm">
            <JoinVenn type={t.type} id={t.type} />
            <p className="text-xs font-bold font-mono mt-2 text-foreground">{t.name}</p>
            <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{t.desc[locale]}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">TIP:</span>{' '}
          {locale === 'ko'
            ? 'LEFT JOIN이 가장 자주 사용됩니다. 일치하지 않는 행은 NULL이 되므로, WHERE o.id IS NULL 패턴으로 "데이터가 없는 항목"을 찾을 수 있습니다.'
            : 'LEFT JOIN is the most commonly used. Non-matching rows return NULL, so you can use the WHERE o.id IS NULL pattern to find "missing data".'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SQL Execution Order
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function SqlExecutionOrder({ locale }: DiagramProps) {
  const steps = [
    { clause: 'FROM / JOIN', desc: { ko: '테이블 선택 & 결합', en: 'Select & join tables' }, color: 'bg-blue-500', written: 4 },
    { clause: 'WHERE', desc: { ko: '조건에 맞는 행 필터링', en: 'Filter rows by condition' }, color: 'bg-red-500', written: 5 },
    { clause: 'GROUP BY', desc: { ko: '행을 그룹으로 묶기', en: 'Group rows together' }, color: 'bg-amber-500', written: 6 },
    { clause: 'HAVING', desc: { ko: '그룹 필터링', en: 'Filter groups' }, color: 'bg-orange-500', written: 7 },
    { clause: 'SELECT', desc: { ko: '열 선택 & 계산', en: 'Select columns & compute' }, color: 'bg-emerald-500', written: 1 },
    { clause: 'DISTINCT', desc: { ko: '중복 행 제거', en: 'Remove duplicate rows' }, color: 'bg-teal-500', written: 2 },
    { clause: 'ORDER BY', desc: { ko: '결과 정렬', en: 'Sort results' }, color: 'bg-violet-500', written: 8 },
    { clause: 'LIMIT / OFFSET', desc: { ko: '반환 행 수 제한', en: 'Limit number of rows' }, color: 'bg-pink-500', written: 9 },
  ];

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 text-white text-xs font-bold">
          #
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? 'SQL 실행 순서' : 'SQL Execution Order'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '작성 순서와 실행 순서는 다릅니다!' : 'Written order and execution order are different!'}
          </p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Execution Order */}
        <div className="flex-1">
          <p className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-wider">
            {locale === 'ko' ? '실행 순서' : 'Execution Order'}
          </p>
          <div className="flex flex-col items-start gap-0">
            {steps.map((step, i) => (
              <Fragment key={step.clause}>
                <div className="flex items-center gap-3 w-full">
                  <span className={`${step.color} w-7 h-7 rounded-full text-white flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm`}>
                    {i + 1}
                  </span>
                  <div className="flex items-baseline gap-2 min-w-0">
                    <code className="font-mono font-bold text-[13px] shrink-0">{step.clause}</code>
                    <span className="text-xs text-muted-foreground truncate">{step.desc[locale]}</span>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-3 bg-border ml-[13px]" />
                )}
              </Fragment>
            ))}
          </div>
        </div>

        {/* Written vs Execution comparison */}
        <div className="w-48 shrink-0 hidden md:block">
          <p className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-wider">
            {locale === 'ko' ? '작성 순서' : 'Written Order'}
          </p>
          <div className="space-y-1 text-xs font-mono">
            <div className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold">1. SELECT</div>
            <div className="px-2 py-1 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300">2. DISTINCT</div>
            <div className="px-2 py-1 rounded bg-muted text-muted-foreground">3. column_list</div>
            <div className="px-2 py-1 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold">4. FROM / JOIN</div>
            <div className="px-2 py-1 rounded bg-red-500/10 text-red-700 dark:text-red-300">5. WHERE</div>
            <div className="px-2 py-1 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300">6. GROUP BY</div>
            <div className="px-2 py-1 rounded bg-orange-500/10 text-orange-700 dark:text-orange-300">7. HAVING</div>
            <div className="px-2 py-1 rounded bg-violet-500/10 text-violet-700 dark:text-violet-300">8. ORDER BY</div>
            <div className="px-2 py-1 rounded bg-pink-500/10 text-pink-700 dark:text-pink-300">9. LIMIT</div>
          </div>
        </div>
      </div>

      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">TIP:</span>{' '}
          {locale === 'ko'
            ? 'SELECT는 5번째로 실행됩니다! 따라서 WHERE 절에서 SELECT의 별칭(AS)을 사용할 수 없습니다. 별칭을 사용하려면 ORDER BY에서 사용하세요.'
            : 'SELECT runs 5th! So you cannot use SELECT aliases (AS) in the WHERE clause. Use aliases in ORDER BY instead.'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PK / FK Relationship Diagram
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function PKFKDiagram({ locale }: DiagramProps) {
  const customersData = [
    { id: 1, name: locale === 'ko' ? '김철수' : 'John', email: 'john@mail.com' },
    { id: 2, name: locale === 'ko' ? '이영희' : 'Sarah', email: 'sarah@mail.com' },
    { id: 3, name: locale === 'ko' ? '박민수' : 'Mike', email: 'mike@mail.com' },
  ];
  const ordersData = [
    { id: 101, customer_id: 1, total: '150.00' },
    { id: 102, customer_id: 1, total: '89.50' },
    { id: 103, customer_id: 2, total: '210.00' },
    { id: 104, customer_id: 3, total: '45.00' },
  ];

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-blue-500 text-white text-xs font-bold">
          PK
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? '기본키(PK) ↔ 외래키(FK) 연결' : 'Primary Key (PK) ↔ Foreign Key (FK) Link'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? 'FK는 다른 테이블의 PK를 참조하여 테이블 간 관계를 형성합니다' : 'FK references another table\'s PK to form relationships'}
          </p>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* Customers table */}
        <div className="flex-1">
          <div className="rounded-lg border overflow-hidden shadow-sm">
            <div className="bg-blue-500 px-3 py-2 flex items-center justify-between">
              <span className="text-white font-mono text-xs font-bold">customers</span>
              <span className="text-white/70 text-[10px]">{locale === 'ko' ? '"1" 쪽' : '"1" side'}</span>
            </div>
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-2 py-1.5 text-left font-bold text-amber-600 dark:text-amber-400">PK id</th>
                  <th className="px-2 py-1.5 text-left font-semibold">name</th>
                  <th className="px-2 py-1.5 text-left font-semibold">email</th>
                </tr>
              </thead>
              <tbody>
                {customersData.map((c) => (
                  <tr key={c.id} className="border-t border-border/40">
                    <td className="px-2 py-1.5 font-mono font-bold text-amber-600 dark:text-amber-400">{c.id}</td>
                    <td className="px-2 py-1.5">{c.name}</td>
                    <td className="px-2 py-1.5 text-muted-foreground">{c.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center justify-center pt-12 shrink-0">
          <svg width="60" height="80" viewBox="0 0 60 80">
            <defs>
              <marker id="pk-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" className="text-primary" />
              </marker>
            </defs>
            <line x1="5" y1="20" x2="55" y2="20" stroke="currentColor" className="text-primary" strokeWidth="2" markerEnd="url(#pk-arrow)" />
            <line x1="5" y1="40" x2="55" y2="40" stroke="currentColor" className="text-primary" strokeWidth="2" markerEnd="url(#pk-arrow)" />
            <line x1="5" y1="60" x2="55" y2="60" stroke="currentColor" className="text-primary" strokeWidth="2" markerEnd="url(#pk-arrow)" />
          </svg>
          <span className="text-[9px] text-muted-foreground font-mono mt-1">
            PK ← FK
          </span>
        </div>

        {/* Orders table */}
        <div className="flex-1">
          <div className="rounded-lg border overflow-hidden shadow-sm">
            <div className="bg-violet-500 px-3 py-2 flex items-center justify-between">
              <span className="text-white font-mono text-xs font-bold">orders</span>
              <span className="text-white/70 text-[10px]">{locale === 'ko' ? '"N" 쪽' : '"N" side'}</span>
            </div>
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-2 py-1.5 text-left font-bold text-amber-600 dark:text-amber-400">PK id</th>
                  <th className="px-2 py-1.5 text-left font-bold text-blue-600 dark:text-blue-400">FK customer_id</th>
                  <th className="px-2 py-1.5 text-left font-semibold">total</th>
                </tr>
              </thead>
              <tbody>
                {ordersData.map((o) => (
                  <tr key={o.id} className="border-t border-border/40">
                    <td className="px-2 py-1.5 font-mono font-bold text-amber-600 dark:text-amber-400">{o.id}</td>
                    <td className="px-2 py-1.5 font-mono font-bold text-blue-600 dark:text-blue-400">{o.customer_id}</td>
                    <td className="px-2 py-1.5 text-muted-foreground">${o.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/40" />
          <span className="font-bold text-amber-600 dark:text-amber-400">PK</span>
          <span className="text-muted-foreground">{locale === 'ko' ? '기본키 (고유 식별자)' : 'Primary Key (unique identifier)'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/40" />
          <span className="font-bold text-blue-600 dark:text-blue-400">FK</span>
          <span className="text-muted-foreground">{locale === 'ko' ? '외래키 (다른 테이블 PK 참조)' : 'Foreign Key (references another PK)'}</span>
        </div>
      </div>

      {/* Key insight */}
      <div className="mt-4 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">TIP:</span>{' '}
          {locale === 'ko'
            ? 'customer_id=1인 주문이 2개 (주문#101, #102) → 고객 "김철수"가 2번 주문한 것. 이것이 1:N 관계입니다. FK 값으로 어느 고객의 주문인지 알 수 있습니다.'
            : 'customer_id=1 has 2 orders (#101, #102) → Customer "John" placed 2 orders. This is a 1:N relationship. The FK value tells you which customer owns the order.'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Relationship Types Diagram
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function RelationshipTypesDiagram({ locale }: DiagramProps) {
  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 text-white text-xs font-bold">
          1:N
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? '테이블 관계 유형' : 'Relationship Types'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '테이블 간 데이터 연결 방식 4가지' : 'Four ways tables relate to each other'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 1:1 */}
        <div className="p-4 rounded-xl bg-background border shadow-sm">
          <div className="text-center mb-3">
            <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold font-mono">
              1 : 1
            </span>
          </div>
          <svg viewBox="0 0 200 100" className="w-full max-w-[220px] mx-auto">
            <rect x="10" y="20" width="70" height="60" rx="8" fill="none" stroke="currentColor" className="text-blue-400" strokeWidth="2" />
            <text x="45" y="45" fill="currentColor" fontSize="10" textAnchor="middle" fontWeight="700" className="text-foreground">users</text>
            <text x="45" y="60" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">id=1</text>
            <text x="45" y="70" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">id=2</text>

            <rect x="120" y="20" width="70" height="60" rx="8" fill="none" stroke="currentColor" className="text-violet-400" strokeWidth="2" />
            <text x="155" y="45" fill="currentColor" fontSize="9" textAnchor="middle" fontWeight="700" className="text-foreground">profiles</text>
            <text x="155" y="60" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">user_id=1</text>
            <text x="155" y="70" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">user_id=2</text>

            <line x1="82" y1="50" x2="118" y2="50" stroke="currentColor" className="text-primary" strokeWidth="2" />
            <circle cx="85" cy="50" r="3" fill="currentColor" className="text-primary" />
            <circle cx="115" cy="50" r="3" fill="currentColor" className="text-primary" />
          </svg>
          <p className="text-[10px] text-center text-muted-foreground mt-2 leading-snug">
            {locale === 'ko' ? '한 행 ↔ 정확히 한 행' : 'One row ↔ exactly one row'}
          </p>
        </div>

        {/* 1:N */}
        <div className="p-4 rounded-xl bg-background border-2 border-primary/30 shadow-sm">
          <div className="text-center mb-3">
            <span className="inline-block px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold font-mono">
              1 : N ★
            </span>
          </div>
          <svg viewBox="0 0 200 100" className="w-full max-w-[220px] mx-auto">
            <rect x="10" y="15" width="70" height="70" rx="8" fill="none" stroke="currentColor" className="text-blue-400" strokeWidth="2" />
            <text x="45" y="38" fill="currentColor" fontSize="9" textAnchor="middle" fontWeight="700" className="text-foreground">customers</text>
            <text x="45" y="55" fill="currentColor" fontSize="9" textAnchor="middle" className="text-muted-foreground">id=1</text>

            <rect x="120" y="5" width="70" height="90" rx="8" fill="none" stroke="currentColor" className="text-violet-400" strokeWidth="2" />
            <text x="155" y="25" fill="currentColor" fontSize="10" textAnchor="middle" fontWeight="700" className="text-foreground">orders</text>
            <text x="155" y="42" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">c_id=1</text>
            <text x="155" y="55" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">c_id=1</text>
            <text x="155" y="68" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">c_id=1</text>

            <line x1="82" y1="55" x2="118" y2="42" stroke="currentColor" className="text-primary" strokeWidth="1.5" />
            <line x1="82" y1="55" x2="118" y2="55" stroke="currentColor" className="text-primary" strokeWidth="1.5" />
            <line x1="82" y1="55" x2="118" y2="68" stroke="currentColor" className="text-primary" strokeWidth="1.5" />
            <circle cx="85" cy="55" r="3" fill="currentColor" className="text-primary" />
          </svg>
          <p className="text-[10px] text-center text-muted-foreground mt-2 leading-snug">
            {locale === 'ko' ? '한 행 → 여러 행 (가장 흔함)' : 'One row → many rows (most common)'}
          </p>
        </div>

        {/* N:1 */}
        <div className="p-4 rounded-xl bg-background border shadow-sm">
          <div className="text-center mb-3">
            <span className="inline-block px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs font-bold font-mono">
              N : 1
            </span>
          </div>
          <svg viewBox="0 0 200 100" className="w-full max-w-[220px] mx-auto">
            {/* Orders side (N) */}
            <rect x="10" y="5" width="70" height="90" rx="8" fill="none" stroke="currentColor" className="text-violet-400" strokeWidth="2" />
            <text x="45" y="25" fill="currentColor" fontSize="10" textAnchor="middle" fontWeight="700" className="text-foreground">orders</text>
            <text x="45" y="42" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">c_id=1</text>
            <text x="45" y="55" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">c_id=1</text>
            <text x="45" y="68" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">c_id=1</text>

            {/* Customers side (1) */}
            <rect x="120" y="15" width="70" height="70" rx="8" fill="none" stroke="currentColor" className="text-blue-400" strokeWidth="2" />
            <text x="155" y="38" fill="currentColor" fontSize="9" textAnchor="middle" fontWeight="700" className="text-foreground">customers</text>
            <text x="155" y="55" fill="currentColor" fontSize="9" textAnchor="middle" className="text-muted-foreground">id=1</text>

            <line x1="82" y1="42" x2="118" y2="55" stroke="currentColor" className="text-primary" strokeWidth="1.5" />
            <line x1="82" y1="55" x2="118" y2="55" stroke="currentColor" className="text-primary" strokeWidth="1.5" />
            <line x1="82" y1="68" x2="118" y2="55" stroke="currentColor" className="text-primary" strokeWidth="1.5" />
            <circle cx="121" cy="55" r="3" fill="currentColor" className="text-primary" />
          </svg>
          <p className="text-[10px] text-center text-muted-foreground mt-2 leading-snug">
            {locale === 'ko' ? '여러 행 → 한 행 (1:N의 역방향)' : 'Many rows → one row (reverse of 1:N)'}
          </p>
        </div>

        {/* N:M */}
        <div className="p-4 rounded-xl bg-background border shadow-sm">
          <div className="text-center mb-3">
            <span className="inline-block px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-700 dark:text-orange-300 text-xs font-bold font-mono">
              N : M
            </span>
          </div>
          <svg viewBox="0 0 200 100" className="w-full max-w-[220px] mx-auto">
            <rect x="5" y="15" width="55" height="70" rx="8" fill="none" stroke="currentColor" className="text-blue-400" strokeWidth="2" />
            <text x="32" y="35" fill="currentColor" fontSize="9" textAnchor="middle" fontWeight="700" className="text-foreground">orders</text>
            <text x="32" y="52" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">id=1</text>
            <text x="32" y="65" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">id=2</text>

            <rect x="73" y="20" width="55" height="60" rx="8" fill="none" stroke="currentColor" className="text-rose-400" strokeWidth="2" strokeDasharray="4 2" />
            <text x="100" y="38" fill="currentColor" fontSize="7" textAnchor="middle" fontWeight="700" className="text-foreground">order_</text>
            <text x="100" y="48" fill="currentColor" fontSize="7" textAnchor="middle" fontWeight="700" className="text-foreground">items</text>
            <text x="100" y="62" fill="currentColor" fontSize="7" textAnchor="middle" className="text-muted-foreground">(1,A)(1,B)</text>
            <text x="100" y="72" fill="currentColor" fontSize="7" textAnchor="middle" className="text-muted-foreground">(2,A)</text>

            <rect x="140" y="15" width="55" height="70" rx="8" fill="none" stroke="currentColor" className="text-emerald-400" strokeWidth="2" />
            <text x="167" y="35" fill="currentColor" fontSize="8" textAnchor="middle" fontWeight="700" className="text-foreground">products</text>
            <text x="167" y="52" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">id=A</text>
            <text x="167" y="65" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">id=B</text>

            <line x1="62" y1="50" x2="71" y2="50" stroke="currentColor" className="text-primary" strokeWidth="1.5" />
            <line x1="130" y1="50" x2="138" y2="50" stroke="currentColor" className="text-primary" strokeWidth="1.5" />
          </svg>
          <p className="text-[10px] text-center text-muted-foreground mt-2 leading-snug">
            {locale === 'ko' ? '여러 행 ↔ 여러 행 (중간 테이블 필요)' : 'Many rows ↔ many rows (junction table needed)'}
          </p>
        </div>
      </div>

      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">TIP:</span>{' '}
          {locale === 'ko'
            ? '대부분의 관계는 1:N입니다. N:M 관계는 중간 테이블(order_items 같은)로 풀어서 두 개의 1:N 관계로 만듭니다.'
            : 'Most relationships are 1:N. N:M relationships are resolved using a junction table (like order_items), creating two 1:N relationships.'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Section → Diagram Mapping
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Combined diagram for schema-keys section
function SchemaKeysDiagrams({ locale }: DiagramProps) {
  return (
    <>
      <PKFKDiagram locale={locale} />
      <RelationshipTypesDiagram locale={locale} />
    </>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Partition Table Diagram (Interactive)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PARTITION_COLORS = [
  { bg: 'bg-blue-500/10', border: 'border-blue-500/30', dot: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-300' },
  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-300' },
  { bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-300' },
  { bg: 'bg-rose-500/10', border: 'border-rose-500/30', dot: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-300' },
];

interface PartitionConfig {
  table: string;
  column: string;
  desc: { ko: string; en: string };
  partitions: { name: string; range: string; rows: string[] }[];
}

export function PartitionDiagram({ locale }: DiagramProps) {
  const [activeType, setActiveType] = useState<'range' | 'list' | 'hash'>('range');

  const configs: Record<string, PartitionConfig> = {
    range: {
      table: 'orders',
      column: 'order_date',
      desc: { ko: '날짜 범위로 분할', en: 'Split by date range' },
      partitions: [
        { name: '2024_Q1', range: 'Jan – Mar', rows: ['2024-01-15', '2024-02-20', '2024-03-10'] },
        { name: '2024_Q2', range: 'Apr – Jun', rows: ['2024-04-05', '2024-05-18'] },
        { name: '2024_Q3', range: 'Jul – Sep', rows: ['2024-07-01', '2024-09-30'] },
        { name: '2024_Q4', range: 'Oct – Dec', rows: ['2024-11-11'] },
      ],
    },
    list: {
      table: 'customers',
      column: 'country',
      desc: { ko: '값 목록으로 분할', en: 'Split by value list' },
      partitions: [
        { name: 'p_asia', range: 'KR, JP, CN', rows: ['Korea', 'Japan', 'China'] },
        { name: 'p_europe', range: 'DE, FR, UK', rows: ['Germany', 'France'] },
        { name: 'p_america', range: 'US, CA, BR', rows: ['USA', 'Canada', 'Brazil'] },
      ],
    },
    hash: {
      table: 'logs',
      column: 'user_id',
      desc: { ko: '해시 함수로 균등 분할', en: 'Even distribution via hash' },
      partitions: [
        { name: 'P0', range: 'MOD 4 = 0', rows: ['uid=4', 'uid=8', 'uid=12'] },
        { name: 'P1', range: 'MOD 4 = 1', rows: ['uid=1', 'uid=5'] },
        { name: 'P2', range: 'MOD 4 = 2', rows: ['uid=2', 'uid=6'] },
        { name: 'P3', range: 'MOD 4 = 3', rows: ['uid=3', 'uid=7'] },
      ],
    },
  };

  const config = configs[activeType];
  const allRows = config.partitions.flatMap((p) => p.rows);

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-amber-500 text-white text-xs font-bold">
          PT
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? '파티션 테이블 구조' : 'Partition Table Structure'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '클릭하여 파티셔닝 방식 비교' : 'Click to compare partitioning strategies'}
          </p>
        </div>
      </div>

      {/* Type selector tabs */}
      <div className="flex gap-2 mb-5">
        {(['range', 'list', 'hash'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
              activeType === type
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
        <span className="text-[10px] text-muted-foreground self-center ml-2 italic">
          {config.desc[locale]}
        </span>
      </div>

      {/* Main visual */}
      <div className="flex items-stretch gap-3">
        {/* Source table */}
        <div className="w-[130px] shrink-0">
          <div className="rounded-lg border overflow-hidden shadow-sm h-full flex flex-col">
            <div className="bg-zinc-500 dark:bg-zinc-600 px-3 py-2">
              <span className="text-white font-mono text-[11px] font-bold">{config.table}</span>
            </div>
            <div className="p-2 flex-1">
              <div className="text-[9px] text-muted-foreground font-mono leading-relaxed">
                PARTITION BY<br />
                <span className="font-bold">{activeType.toUpperCase()}</span> ({config.column})
              </div>
              <div className="border-t mt-2 pt-2 space-y-0.5">
                {allRows.slice(0, 7).map((row, i) => (
                  <div key={i} className="text-[10px] font-mono bg-muted/50 px-1.5 py-0.5 rounded truncate">
                    {row}
                  </div>
                ))}
                {allRows.length > 7 && (
                  <div className="text-[9px] text-muted-foreground text-center">
                    +{allRows.length - 7} more
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center shrink-0">
          <svg width="36" height="24" viewBox="0 0 36 24" className="text-primary">
            <path d="M2 12 L28 12 M22 6 L28 12 L22 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Partitions */}
        <div className="flex-1 flex flex-col gap-2">
          {config.partitions.map((p, i) => {
            const c = PARTITION_COLORS[i % PARTITION_COLORS.length];
            return (
              <div key={p.name} className={`rounded-lg border ${c.border} ${c.bg} px-3 py-2 flex items-center gap-3 transition-all hover:shadow-sm`}>
                <div className={`w-2.5 h-2.5 rounded-full ${c.dot} shrink-0`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[11px] font-bold font-mono">{p.name}</span>
                    <span className="text-[9px] text-muted-foreground">{p.range}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.rows.map((row, j) => (
                      <span key={j} className="text-[10px] font-mono bg-background/60 px-1.5 py-0.5 rounded shadow-sm">
                        {row}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                  {p.rows.length}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tip */}
      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">TIP:</span>{' '}
          {locale === 'ko'
            ? 'WHERE 조건에 파티션 키가 포함되면 해당 파티션만 스캔합니다 (파티션 프루닝). EXPLAIN으로 확인하세요.'
            : 'When WHERE includes the partition key, only the relevant partition is scanned (partition pruning). Verify with EXPLAIN.'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Function vs Procedure Diagram
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function FunctionProcedureDiagram({ locale }: DiagramProps) {
  const [activeTab, setActiveTab] = useState<'function' | 'procedure'>('function');

  const fnSteps = [
    {
      icon: '①',
      title: { ko: '입력 매개변수', en: 'Input Parameters' },
      code: '(price DECIMAL, rate DECIMAL)',
      color: 'bg-emerald-500',
    },
    {
      icon: '②',
      title: { ko: '처리 본문', en: 'Process Body' },
      code: 'RETURN price * (1 - rate/100)',
      color: 'bg-emerald-500',
    },
    {
      icon: '③',
      title: { ko: 'RETURNS 반환', en: 'RETURNS value' },
      code: '→ DECIMAL',
      color: 'bg-emerald-500',
    },
  ];

  const procSteps = [
    {
      icon: '①',
      title: { ko: '입력 매개변수', en: 'Input Parameters' },
      code: '(IN sender INT, IN rcvr INT, IN amount DECIMAL)',
      color: 'bg-violet-500',
    },
    {
      icon: '②',
      title: { ko: '처리 본문', en: 'Process Body' },
      code: 'UPDATE accounts ... UPDATE accounts ...',
      color: 'bg-violet-500',
    },
    {
      icon: '③',
      title: { ko: '트랜잭션 제어', en: 'Transaction Control' },
      code: 'COMMIT / ROLLBACK',
      color: 'bg-violet-500',
    },
  ];

  const steps = activeTab === 'function' ? fnSteps : procSteps;
  const traitsPanelClass = activeTab === 'function'
    ? 'bg-emerald-500/5 border-emerald-500/20'
    : 'bg-violet-500/5 border-violet-500/20';
  const callCodeClass = activeTab === 'function'
    ? 'text-emerald-700 dark:text-emerald-300'
    : 'text-violet-700 dark:text-violet-300';

  const fnTraits = [
    { ok: true, text: { ko: 'SELECT, WHERE, JOIN에서 사용 가능', en: 'Can be used in SELECT, WHERE, JOIN' } },
    { ok: true, text: { ko: '값을 반드시 반환 (RETURNS)', en: 'Must return a value (RETURNS)' } },
    { ok: false, text: { ko: '트랜잭션 제어 불가', en: 'Cannot control transactions' } },
  ];
  const procTraits = [
    { ok: true, text: { ko: 'COMMIT / ROLLBACK 가능', en: 'Can COMMIT / ROLLBACK' } },
    { ok: true, text: { ko: 'OUT 매개변수로 결과 전달', en: 'Pass results via OUT params' } },
    { ok: false, text: { ko: 'SELECT에서 사용 불가 (CALL로만 호출)', en: 'Cannot use in SELECT (CALL only)' } },
  ];
  const traits = activeTab === 'function' ? fnTraits : procTraits;

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-500 text-white text-xs font-bold">
          Fn
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? '함수 vs 프로시저 실행 흐름' : 'Function vs Procedure Flow'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '클릭하여 실행 흐름 비교' : 'Click to compare execution flows'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setActiveTab('function')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'function'
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          FUNCTION
        </button>
        <button
          onClick={() => setActiveTab('procedure')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'procedure'
              ? 'bg-violet-500 text-white shadow-sm'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          PROCEDURE
        </button>
        <span className="text-[10px] text-muted-foreground self-center ml-2">
          {activeTab === 'function'
            ? locale === 'ko' ? 'SELECT calc_discount(price, 10)' : 'SELECT calc_discount(price, 10)'
            : locale === 'ko' ? 'CALL transfer_funds(1, 2, 50000)' : 'CALL transfer_funds(1, 2, 50000)'}
        </span>
      </div>

      <div className="flex gap-6">
        {/* Flow steps */}
        <div className="flex-1">
          <div className="flex flex-col items-start gap-0">
            {steps.map((step, i) => (
              <Fragment key={i}>
                <div className="flex items-start gap-3 w-full">
                  <span className={`${step.color} w-7 h-7 rounded-full text-white flex items-center justify-center text-[12px] font-bold shrink-0 shadow-sm`}>
                    {i + 1}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-xs font-bold">{step.title[locale]}</p>
                    <code className="text-[10px] font-mono text-muted-foreground break-all">{step.code}</code>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-4 bg-border ml-[13px]" />
                )}
              </Fragment>
            ))}
          </div>
        </div>

        {/* Traits panel */}
        <div className={`w-64 shrink-0 rounded-lg border p-3 ${traitsPanelClass}`}>
          <p className="text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-wider">
            {locale === 'ko' ? '특징' : 'Characteristics'}
          </p>
          <div className="space-y-2">
            {traits.map((t, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className={`shrink-0 mt-0.5 ${t.ok ? 'text-emerald-500' : 'text-red-400'}`}>
                  {t.ok ? '✓' : '✗'}
                </span>
                <span className={t.ok ? 'text-foreground' : 'text-muted-foreground'}>
                  {t.text[locale]}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-[10px] font-bold text-muted-foreground mb-1">
              {locale === 'ko' ? '호출 방식' : 'How to call'}
            </p>
            <code className={`text-[11px] font-mono font-bold ${callCodeClass}`}>
              {activeTab === 'function'
                ? 'SELECT func_name(...)'
                : 'CALL proc_name(...)'}
            </code>
          </div>
        </div>
      </div>

      {/* Quick comparison */}
      <div className="mt-5 grid grid-cols-2 gap-3 text-[11px]">
        <div className={`rounded-lg border p-3 ${activeTab === 'function' ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border bg-background'}`}>
          <p className="font-bold font-mono mb-1 text-emerald-700 dark:text-emerald-300">FUNCTION</p>
          <p className="text-muted-foreground leading-relaxed">
            {locale === 'ko'
              ? '계산, 데이터 변환, 조회용. SQL 문 안에서 직접 호출.'
              : 'For calculations, transforms, queries. Called directly in SQL.'}
          </p>
        </div>
        <div className={`rounded-lg border p-3 ${activeTab === 'procedure' ? 'border-violet-500/40 bg-violet-500/5' : 'border-border bg-background'}`}>
          <p className="font-bold font-mono mb-1 text-violet-700 dark:text-violet-300">PROCEDURE</p>
          <p className="text-muted-foreground leading-relaxed">
            {locale === 'ko'
              ? '비즈니스 로직, 배치 작업용. CALL로 호출하며 트랜잭션 제어 가능.'
              : 'For business logic, batch ops. Called with CALL, can control transactions.'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOB Storage Tiers Diagram
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function StorageTiersDiagram({ locale }: DiagramProps) {
  const [activeTier, setActiveTier] = useState<number | null>(null);

  const tiers = [
    {
      name: { ko: '인라인 저장', en: 'Inline Storage' },
      size: '< 2KB',
      color: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', header: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-300' },
      types: ['INT', 'VARCHAR', 'BOOLEAN', 'DATE', 'DECIMAL'],
      pg: { ko: '행 내부에 직접 저장', en: 'Stored directly in row' },
      mysql: { ko: '행 내부에 직접 저장', en: 'Stored directly in row' },
      desc: { ko: '일반 데이터 타입은 행(row) 안에 인라인으로 저장됩니다. 가장 빠른 접근 속도입니다.', en: 'Regular data types are stored inline within the row. Fastest access speed.' },
    },
    {
      name: { ko: 'TOAST / 오프페이지', en: 'TOAST / Off-page' },
      size: '2KB – 1GB',
      color: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', header: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-300' },
      types: ['TEXT', 'BYTEA', 'JSONB', 'BLOB'],
      pg: { ko: 'TOAST: 자동 압축 + 외부 테이블', en: 'TOAST: auto compress + external table' },
      mysql: { ko: 'Off-page: 별도 페이지 저장', en: 'Off-page: stored in separate pages' },
      desc: { ko: 'PostgreSQL은 TOAST로 자동 압축 후 분할 저장합니다. MySQL은 오버플로 페이지에 저장합니다. 사용자가 관리할 필요 없습니다.', en: 'PostgreSQL uses TOAST for auto-compression and split storage. MySQL stores in overflow pages. No user management needed.' },
    },
    {
      name: { ko: 'Large Object', en: 'Large Object' },
      size: '> 1GB',
      color: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', header: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-300' },
      types: ['lo_import', 'OID', 'pg_largeobject'],
      pg: { ko: '별도 시스템 테이블 (최대 ~4TB)', en: 'Separate system table (up to ~4TB)' },
      mysql: { ko: 'LONGBLOB/LONGTEXT (최대 ~4GB)', en: 'LONGBLOB/LONGTEXT (up to ~4GB)' },
      desc: { ko: 'PostgreSQL은 pg_largeobject 시스템 테이블에 청크 단위로 저장합니다. MySQL은 LONGBLOB/LONGTEXT로 최대 4GB까지 저장합니다.', en: 'PostgreSQL stores in pg_largeobject system table in chunks. MySQL uses LONGBLOB/LONGTEXT up to 4GB.' },
    },
    {
      name: { ko: '외부 스토리지', en: 'External Storage' },
      size: locale === 'ko' ? '무제한' : 'Unlimited',
      color: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', header: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-300' },
      types: ['S3', 'GCS', 'Azure Blob', 'URL'],
      pg: { ko: 'URL만 DB에 저장', en: 'Store only URL in DB' },
      mysql: { ko: 'URL만 DB에 저장', en: 'Store only URL in DB' },
      desc: { ko: '수 MB 이상의 파일은 오브젝트 스토리지에 저장하고, URL만 DB에 기록하는 것이 실무 권장 패턴입니다.', en: 'For files larger than a few MB, store in object storage and record only the URL in DB. This is the recommended production pattern.' },
    },
  ];

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-rose-500 text-white text-xs font-bold">
          LO
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? '데이터 크기별 저장 전략' : 'Storage Strategy by Data Size'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '각 단계를 클릭하여 상세 정보를 확인하세요' : 'Click each tier for details'}
          </p>
        </div>
      </div>

      {/* Size scale bar */}
      <div className="mb-4 flex items-center gap-1 text-[9px] text-muted-foreground">
        <span>{locale === 'ko' ? '작음' : 'Small'}</span>
        <div className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-emerald-500/40 via-blue-500/40 via-amber-500/40 to-rose-500/40" />
        <span>{locale === 'ko' ? '대용량' : 'Large'}</span>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-4 gap-2">
        {tiers.map((tier, i) => (
          <button
            key={i}
            onClick={() => setActiveTier(activeTier === i ? null : i)}
            className={`rounded-lg border text-left transition-all ${tier.color.border} ${tier.color.bg} ${
              activeTier === i ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
            }`}
          >
            <div className={`${tier.color.header} px-2 py-1.5 rounded-t-[7px]`}>
              <span className="text-white text-[10px] font-bold">{tier.name[locale]}</span>
            </div>
            <div className="p-2">
              <p className={`text-[12px] font-bold font-mono ${tier.color.text}`}>{tier.size}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {tier.types.map((t) => (
                  <span key={t} className="text-[9px] font-mono bg-background/60 px-1 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {activeTier !== null && (
        <div className={`mt-3 rounded-lg border ${tiers[activeTier].color.border} ${tiers[activeTier].color.bg} p-4 transition-all`}>
          <p className="text-xs leading-relaxed mb-3">{tiers[activeTier].desc[locale]}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md bg-background/60 p-2.5">
              <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-1">PostgreSQL</p>
              <p className="text-[11px] text-foreground">{tiers[activeTier].pg[locale]}</p>
            </div>
            <div className="rounded-md bg-background/60 p-2.5">
              <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400 mb-1">MySQL</p>
              <p className="text-[11px] text-foreground">{tiers[activeTier].mysql[locale]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tip */}
      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">TIP:</span>{' '}
          {locale === 'ko'
            ? '수 KB 이하 → DB 직접 저장, 수 MB 이상 → S3/GCS에 저장 후 URL만 DB에 기록하는 것이 실무 표준입니다.'
            : 'A few KB or less → store in DB directly. A few MB or more → store in S3/GCS and record only the URL in DB.'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Section → Diagram Mapping
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const sectionDiagrams: Record<string, React.ComponentType<DiagramProps>> = {
  'what-is-sql': EcommerceERD,
  'schema-keys': SchemaKeysDiagrams,
  'select-basics': SqlExecutionOrder,
  'joins': JoinTypesDiagram,
  'partition-tables': PartitionDiagram,
  'functions-procedures': FunctionProcedureDiagram,
  'lob-data-types': StorageTiersDiagram,
};
